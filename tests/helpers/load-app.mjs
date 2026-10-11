// 測試載入器：把原本的全域腳本依 index.html 的順序載入 Node 的 vm 沙盒，不改寫成模組。
// 只提供最小的瀏覽器替身（localStorage、document、speechSynthesis…），足夠讓 App 開機與執行邏輯。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPTS = [
  "js/ui.js", "js/data/vocab.js", "js/data/part5.js", "js/data/part6.js", "js/data/part7.js",
  "js/data/listening.js", "js/data/skills.js", "js/firebase-config.js", "js/merge.js", "js/engine.js", "js/sync.js", "js/ai.js", "audio/clips.js", "js/audio.js", "js/app.js", "js/mock.js", "js/views.js"
];

// 假 fetch（AI 解析測試用）：記錄每次請求，依 mode 回應。不會連到真實網路。
// mode：ok（回傳 reply 文字）、401、429、500、400credit、timeout（等到被 abort）、network、empty、html（非 JSON）、
// refusal、thinkonly（只有思考就達上限）、cutoff（文字被長度上限截斷）
export function fakeFetch({ mode = "ok", reply = "KEY_OK\n【你選的為什麼不對】測試" } = {}) {
  const calls = [];
  const f = async (url, opts = {}) => {
    calls.push({ url, headers: opts.headers, body: JSON.parse(opts.body) });
    const m = f.mode;
    if (m === "network") throw new TypeError("Failed to fetch");
    if (m === "timeout") {
      return new Promise((_, reject) => opts.signal.addEventListener("abort", () => {
        const e = new Error("aborted"); e.name = "AbortError"; reject(e);
      }));
    }
    const json = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
    if (m === "html") return { ok: false, status: 502, json: async () => { throw new SyntaxError("bad json"); } };
    if (m === "401") return json(401, { type: "error", error: { type: "authentication_error", message: "invalid x-api-key" } });
    if (m === "429") return json(429, { type: "error", error: { type: "rate_limit_error", message: "rate limited" } });
    if (m === "500") return json(500, { type: "error", error: { type: "api_error", message: "oops" } });
    if (m === "400credit") return json(400, { type: "error", error: { type: "invalid_request_error", message: "Your credit balance is too low" } });
    if (m === "empty") return json(200, { content: [], stop_reason: "end_turn" });
    if (m === "refusal") return json(200, { content: [], stop_reason: "refusal" });
    // 只有思考內容就用完 max_tokens
    if (m === "thinkonly") return json(200, { content: [{ type: "thinking", thinking: "..." }], stop_reason: "max_tokens" });
    // 文字寫到一半被截斷
    if (m === "cutoff") return json(200, { content: [{ type: "text", text: f.reply }], stop_reason: "max_tokens" });
    return json(200, { content: [{ type: "thinking", thinking: "..." }, { type: "text", text: f.reply }], stop_reason: "end_turn" });
  };
  f.calls = calls; f.mode = mode; f.reply = reply;
  return f;
}

// 什麼都接受的假 DOM 元素：渲染函式只要不拋錯即可，畫面內容由 innerHTML 字串檢查
function fakeEl() {
  const el = {
    innerHTML: "", textContent: "", value: "", hidden: false, style: {}, dataset: {}, children: [],
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    r: { baseVal: { value: 10 } },
    addEventListener() {}, removeEventListener() {}, appendChild: c => c, remove() {},
    setAttribute() {}, getAttribute: () => null, scrollIntoView() {}, focus() {}, closest: () => null,
    querySelector: () => fakeEl(), querySelectorAll: () => []
  };
  return el;
}

// 假語音合成。mode：normal（依序觸發 start、end）、silent（永遠沒有事件）、error（立即觸發 error）
export function fakeSpeech({ voices = [], mode = "normal" } = {}) {
  const spoken = [];
  const synth = {
    mode, spoken, voices,
    onvoiceschanged: null,
    getVoices: () => synth.voices,
    speak(u) {
      spoken.push(u.text);
      if (synth.mode === "silent") return;
      if (synth.mode === "error") { setTimeout(() => u.onerror && u.onerror({}), 0); return; }
      setTimeout(() => { if (u.onstart) u.onstart(); setTimeout(() => u.onend && u.onend(), 5); }, 0);
    },
    cancel() {},
    // 測試用：模擬瀏覽器載入完語音清單
    loadVoices(list) { synth.voices = list; if (synth.onvoiceschanged) synth.onvoiceschanged(); }
  };
  return synth;
}

export function voice(lang, name = lang) { return { lang, name }; }

// 假 <audio>。mode：ok（觸發 playing、ended）、error（觸發 error）、reject（play() 被瀏覽器拒絕）
export function fakeAudio({ mode = "ok" } = {}) {
  const played = [];
  function A() {
    const el = this;
    el.paused = true; el.duration = NaN; el.playbackRate = 1; el.src = "";
    el.pause = () => { el.paused = true; };
    el.play = () => {
      played.push({ src: el.src, rate: el.playbackRate });
      el.paused = false;
      if (A.mode === "reject") return Promise.reject(new Error("NotAllowedError"));
      if (A.mode === "error") { setTimeout(() => el.onerror && el.onerror({}), 0); return Promise.resolve(); }
      setTimeout(() => { if (el.onplaying) el.onplaying(); setTimeout(() => el.onended && el.onended(), 5); }, 0);
      return Promise.resolve();
    };
  }
  A.mode = mode; A.played = played;
  return A;
}

// 假 Firebase Realtime Database（只在記憶體）。sync/ 底下照 firebase/database.rules.json 檢查格式：
// 一定要有 records 與 updatedAt，只能有 records、bank、updatedAt 三個欄位，否則像正式資料庫一樣以 PERMISSION_DENIED 拒絕。
// beforeSet(path, value)：測試用，在寫入前插入另一台裝置的動作（模擬同時寫入）。
// transaction(fn)：和 Firebase 一樣，寫入前雲端被別人改過就用新值重跑 fn；fn 傳回 undefined 代表不寫入。
export function fakeDb() {
  const data = {};
  const copy = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const check = (path, v) => {
    if (!path.startsWith("sync/")) return;
    const keys = v && typeof v === "object" ? Object.keys(v) : [];
    if (!v || v.records === undefined || typeof v.updatedAt !== "number" || keys.some(k => !["records", "bank", "updatedAt"].includes(k))) {
      const e = new Error("PERMISSION_DENIED: Permission denied"); e.code = "PERMISSION_DENIED"; throw e;
    }
  };
  const db = {
    data, writes: [], beforeSet: null, txRuns: 0,
    ref(path) {
      const write = async v => {
        if (db.beforeSet) { const f = db.beforeSet; db.beforeSet = null; await f(path, v); }
        check(path, v);
        db.writes.push({ path, v: copy(v) });
        data[path] = copy(v);
      };
      return {
        path,
        get: async () => ({ val: () => (data[path] === undefined ? null : copy(data[path])) }),
        set: write,
        transaction: async fn => {
          for (let i = 0; i < 25; i++) {
            db.txRuns++;
            const before = JSON.stringify(data[path] === undefined ? null : data[path]);
            const next = fn(data[path] === undefined ? null : copy(data[path]));
            if (next === undefined) return { committed: false, snapshot: { val: () => copy(data[path]) } };
            if (db.beforeSet) { const f = db.beforeSet; db.beforeSet = null; await f(path, next); }
            if (JSON.stringify(data[path] === undefined ? null : data[path]) !== before) continue; // 被別人改過：重跑
            check(path, next);
            db.writes.push({ path, v: copy(next) });
            data[path] = copy(next);
            return { committed: true, snapshot: { val: () => copy(data[path]) } };
          }
          throw new Error("maxretry");
        },
        remove: async () => { delete data[path]; }
      };
    }
  };
  return db;
}

// 載入整個 App。storage：預先放入 localStorage 的內容；speech：fakeSpeech() 的回傳值；fetch：fakeFetch() 的回傳值；
// db：fakeDb() 的回傳值（有給就把雲端同步接上這個假資料庫）
export function loadApp({ storage = {}, speech = fakeSpeech(), fetch = fakeFetch(), audio = null, db = null } = {}) {
  const store = new Map(Object.entries(storage));
  const writes = [];
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { writes.push(k); store.set(k, String(v)); },
    removeItem: k => store.delete(k)
  };
  const session = new Map();
  const sessionStorage = {
    getItem: k => (session.has(k) ? session.get(k) : null),
    setItem: (k, v) => { session.set(k, String(v)); },
    removeItem: k => session.delete(k)
  };
  const document = {
    documentElement: { dataset: {} },
    body: fakeEl(),
    getElementById: () => fakeEl(),
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
    createElement: () => fakeEl(),
    addEventListener() {},
    removeEventListener() {}
  };
  const ctx = {
    console, setTimeout, clearTimeout, setInterval, clearInterval, Promise, Date, Math, JSON,
    crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, Blob, Response, CompressionStream, DecompressionStream,
    localStorage, sessionStorage, document, navigator: { clipboard: {}, onLine: true }, fetch, AbortController,
    speechSynthesis: speech,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    requestAnimationFrame: fn => setTimeout(fn, 0),
    performance: { now: () => Date.now() },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {},
    location: { href: "http://localhost/" },
    history: { pushState() {}, replaceState() {} }
  };
  if (audio) ctx.Audio = audio; // 假 <audio>（fakeAudio()）；省略時沒有 Audio，音檔一律視為播放失敗
  ctx.window = ctx;
  ctx.self = ctx;
  ctx.top = ctx; // 沒有被框架嵌入
  vm.createContext(ctx);
  for (const f of SCRIPTS) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  if (db) { ctx.__db = db; vm.runInContext("Sync.db = __db; Sync.ready = true;", ctx); }
  return {
    ctx, speech, store, session, writes, fetch,
    run: code => vm.runInContext(code, ctx)
  };
}

export function readSource(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
export const wait = ms => new Promise(r => setTimeout(r, ms));
