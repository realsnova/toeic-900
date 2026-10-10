/* ============ 聽力音檔（預先產生的神經語音）============ */
// 音檔由 tools/audio 在瀏覽器裡用 Kokoro-82M 預先產生（規格：.scratch/toeic-commercial/spec.md §3.3）。
// 每段音檔以「內容雜湊」命名：題目文字一改，雜湊跟著變，舊音檔自動不再使用，改用裝置語音（INV-14）。
// audio/clips.js 的 AUDIO_CLIPS 列出目前有哪些音檔；沒有列出的一律用裝置語音。
// 這個檔案的 ClipKey 與 ListenScript 也被 tools/audio/build-jobs.mjs 載入，兩邊的鍵必須完全一致。

// FNV-1a 32 位元雜湊（以 UTF-16 字元計算），8 位十六進位
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

const ClipKey = {
  q: text => "q" + fnv1a(text),                                           // Part 2 問句
  r: (letter, text) => "r" + fnv1a(letter + ". " + text),                 // Part 2 回應，連同 (A)(B)(C) 標號一起念
  c: turns => "c" + fnv1a(turns.map(t => t.s + ":" + t.t).join("\n")),   // Part 3/4 整段對話或短講
  n: text => "n" + fnv1a(text)                                            // 旁白：各 Part 說明、題組開場、念題目
};

// 完整聽力測驗的旁白文字（自行撰寫，不使用 ETS 的官方說明文字）
const ListenScript = {
  directions: {
    "Part 2": "Part Two. For each item, listen to a question or a statement and three possible replies. The replies are not written on your screen, and you will hear them only once. Choose the reply that fits best.",
    "Part 3": "Part Three. You will now hear several short conversations between two or more people. After each conversation, you will hear three questions about it. Choose the best answer to each question. Each conversation is played only once.",
    "Part 4": "Part Four. You will now hear several short talks, each given by a single speaker. After each talk, you will hear three questions about it. Choose the best answer to each question. Each talk is played only once."
  },
  setIntro(set, first, last) {
    const three = set.turns.some(t => t.s === "M2" || t.s === "W2");
    const what = set.type === "Part 3"
      ? (set.graphic ? "conversation and graphic" : three ? "conversation with three speakers" : "conversation")
      : (set.graphic ? "talk and graphic" : "talk");
    return `Questions ${first} through ${last} refer to the following ${what}.`;
  },
  question(num, q) { return `${num}. ${q}`; }
};

const AUDIO_START_TIMEOUT_MS = 4000; // 呼叫播放後這麼久還沒開始（檔案載入失敗、被瀏覽器擋下），就改用裝置語音
const AudioClips = {
  base: "audio/v1/",
  accent: {},   // 鍵 -> "us" | "uk" | "n"（旁白）
  complete: false, // 內建題目的所有段落都有音檔（建置工具記錄的總段數都在）
  el: null,     // 共用一個 <audio>：iOS 只要第一次在點擊內播放成功，之後同一個元素就能自動播放
  pending: null,
  load(index, total) {
    AudioClips.accent = {};
    AudioClips.complete = false;
    if (!index || typeof index !== "object") return;
    Object.keys(index).forEach(acc => (Array.isArray(index[acc]) ? index[acc] : []).forEach(k => { AudioClips.accent[k] = acc; }));
    const n = Object.keys(AudioClips.accent).length;
    AudioClips.complete = Number.isInteger(total) && total > 0 && n >= total;
  },
  has(key) { return !!key && Object.prototype.hasOwnProperty.call(AudioClips.accent, key); },
  get ready() { return Object.keys(AudioClips.accent).length > 0; },
  url(key) { return AudioClips.base + key + ".mp3"; },
  // 播放一段音檔。回傳 Promise<{ started, failed, aborted }>。
  // 必須在點擊處理函式裡同步呼叫（中間不可先 await），iOS 才允許播放。
  play(key, rate = 1) {
    AudioClips.stop();
    return new Promise(res => {
      let el = AudioClips.el;
      if (!el) {
        if (typeof Audio === "undefined") { res({ started: false, failed: true }); return; }
        el = AudioClips.el = new Audio();
        el.preload = "auto";
      }
      let started = false, done = false, endTimer = null;
      const finish = r => {
        if (done) return; done = true;
        clearTimeout(startTimer); clearTimeout(endTimer);
        el.onplaying = el.onended = el.onerror = el.onloadedmetadata = null;
        if (AudioClips.pending === finish) AudioClips.pending = null;
        res(Object.assign({ started }, r));
      };
      AudioClips.pending = finish;
      const startTimer = setTimeout(() => { if (!started) { try { el.pause(); } catch (e) { /* 忽略 */ } finish({ failed: true }); } }, AUDIO_START_TIMEOUT_MS);
      el.onplaying = () => { started = true; };
      el.onended = () => finish({});
      el.onerror = () => finish({ failed: !started });
      // 保險：音檔長度加 5 秒後還沒結束（ended 事件遺失），就當作播完
      el.onloadedmetadata = () => {
        if (Number.isFinite(el.duration)) endTimer = setTimeout(() => finish({}), (el.duration / rate + 5) * 1000);
      };
      el.src = AudioClips.url(key);
      el.playbackRate = rate;
      try {
        const p = el.play();
        if (p && typeof p.catch === "function") p.catch(() => finish({ failed: !started }));
      } catch (e) { finish({ failed: true }); }
    });
  },
  stop() {
    if (AudioClips.pending) AudioClips.pending({ aborted: true });
    if (AudioClips.el) { try { AudioClips.el.pause(); } catch (e) { /* 忽略 */ } }
  }
};
AudioClips.load(typeof AUDIO_CLIPS !== "undefined" ? AUDIO_CLIPS.keys : null, typeof AUDIO_CLIPS !== "undefined" ? AUDIO_CLIPS.total : 0);

// 一組播放內容裡，有音檔的段落比例：all＝全部有音檔、none＝全部用裝置語音、mixed＝部分
function audioSource(parts) {
  const withClip = parts.filter(p => p.clip).length;
  const has = parts.filter(p => AudioClips.has(p.clip)).length;
  if (!withClip || !has) return "none";
  return has === withClip ? "all" : "mixed";
}
