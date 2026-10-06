// 測試載入器：把原本的全域腳本依 index.html 的順序載入 Node 的 vm 沙盒，不改寫成模組。
// 只提供最小的瀏覽器替身（localStorage、document、speechSynthesis…），足夠讓 App 開機與執行邏輯。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPTS = [
  "js/ui.js", "js/data/vocab.js", "js/data/part5.js", "js/data/part6.js", "js/data/part7.js",
  "js/data/listening.js", "js/firebase-config.js", "js/sync.js", "js/app.js", "js/mock.js", "js/views.js"
];

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

// 載入整個 App。storage：預先放入 localStorage 的內容；speech：fakeSpeech() 的回傳值
export function loadApp({ storage = {}, speech = fakeSpeech() } = {}) {
  const store = new Map(Object.entries(storage));
  const writes = [];
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { writes.push(k); store.set(k, String(v)); },
    removeItem: k => store.delete(k)
  };
  const document = {
    documentElement: { dataset: {} },
    body: fakeEl(),
    getElementById: () => fakeEl(),
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
    createElement: () => fakeEl(),
    addEventListener() {}
  };
  const ctx = {
    console, setTimeout, clearTimeout, setInterval, clearInterval, Promise, Date, Math, JSON,
    crypto: webcrypto,
    localStorage, document, navigator: { clipboard: {} },
    speechSynthesis: speech,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    requestAnimationFrame: fn => setTimeout(fn, 0),
    performance: { now: () => Date.now() },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {},
    location: { href: "http://localhost/" },
    history: { pushState() {}, replaceState() {} }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of SCRIPTS) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  return {
    ctx, speech, store, writes,
    run: code => vm.runInContext(code, ctx)
  };
}

export function readSource(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
export const wait = ms => new Promise(r => setTimeout(r, ms));
