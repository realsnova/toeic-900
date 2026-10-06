// v1.3.0 的單元測試。測試 ID 對應 .scratch/toeic-v1-improve/verification.md
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp, fakeSpeech, voice, readSource, wait } from "./helpers/load-app.mjs";

const EN = [voice("en-US", "Test US"), voice("en-GB", "Test GB")];

/* ---------- MET-01 移除未校準分數 ---------- */
test("T-MET-01-1 原始碼不再有分數換算與「預估分數」文字", () => {
  for (const f of ["js/app.js", "js/mock.js", "js/views.js", "index.html"]) {
    const src = readSource(f);
    for (const word of ["預估分數", "預估總分", "粗估", "scoreEstimate", "505 / 5"]) {
      assert.equal(src.includes(word), false, `${f} 仍有「${word}」`);
    }
  }
});

test("T-MET-01-2 practiceAccuracy 只回傳答對數與百分比，沒有 TOEIC 分數", () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN }) });
  app.run(`S.lcat = { "Part 2": { r: 12, w: 3 } }; S.racc = { r: 18, w: 2 };`);
  const acc = app.run("practiceAccuracy()");
  assert.deepEqual(JSON.parse(JSON.stringify(acc.L)), { right: 12, total: 15, min: 15, ready: true, need: 0, pct: 80 });
  assert.deepEqual(JSON.parse(JSON.stringify(acc.R)), { right: 18, total: 20, min: 20, ready: true, need: 0, pct: 90 });
});

/* ---------- MET-02 答對率口徑一致 ---------- */
test("T-MET-02-1 錯題本重考不更新聽力與閱讀的累計答對率", () => {
  const app = loadApp();
  const src = app.run("retryWrong.toString()");
  assert.equal(/trackListening\(/.test(src), false, "錯題本重考不應呼叫 trackListening");
  assert.equal(/trackReading\(/.test(src), false, "錯題本重考不應呼叫 trackReading");
  assert.equal(/wbMark\(/.test(src), true, "錯題本仍要更新掌握進度");
});

test("T-MET-02-3 未達門檻時顯示還差幾題", () => {
  const app = loadApp();
  app.run(`S.lcat = { "Part 2": { r: 10, w: 4 } }; S.racc = { r: 15, w: 4 };`);
  const acc = app.run("practiceAccuracy()");
  assert.equal(acc.L.ready, false); assert.equal(acc.L.need, 1);
  assert.equal(acc.R.ready, false); assert.equal(acc.R.need, 1);
  assert.match(app.run("accuracyText(practiceAccuracy().L)"), /再答 1 題後顯示/);
  app.run(`S.lcat = {}; S.racc = { r: 0, w: 0 };`);
  const empty = app.run("practiceAccuracy()");
  assert.equal(empty.L.pct, null, "沒有作答時不可顯示 0%");
});

/* ---------- MET-03 連續天數 ---------- */
test("T-MET-03-1 只做錯題本或只完成模考的日子也算有學習", () => {
  const app = loadApp();
  app.run(`S.daily = {
    [todayStr()]: { wr: 3 },
    [todayStr(-1)]: { mockDone: 1 },
    [todayStr(-2)]: { p5: 10 }
  };`);
  assert.equal(app.run("dayTotal(S.daily[todayStr()])"), 3);
  assert.equal(app.run("dayTotal(S.daily[todayStr(-1)])"), 1);
  assert.equal(app.run("streak()"), 3);
  assert.equal(app.run("dayTotal(undefined)"), 0);
  assert.equal(app.run(`dayTotal({ v: "x", p5: null })`), 0, "異常值不可變成 NaN");
});

test("T-MET-03-2 開機與渲染首頁期間不寫入學習紀錄（INV-01）", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ updatedAt: 123, daily: {} }) } });
  assert.equal(app.writes.filter(k => k === "toeic900").length, 0);
  assert.equal(app.run("S.updatedAt"), 123);
});

/* ---------- MET-04 模擬考 ---------- */
test("T-MET-04-1 三種格式的歷史紀錄", () => {
  const app = loadApp();
  assert.equal(app.run(`Mock.hasCounts({ L: 400, R: 380 })`), false, "只有換算分數的舊紀錄");
  assert.equal(app.run(`Mock.hasCounts({ L: 410, R: 395, lR: 15, lT: 19, rR: 20, rT: 26 })`), true, "v1.1 格式");
  assert.equal(app.run(`Mock.hasCounts({ lR: 15, lT: 19, rR: 0, rT: 0 })`), true, "只考聽力節");
  assert.equal(app.run(`Mock.hasCounts({ lR: 0, lT: 0, rR: 0, rT: 0 })`), false, "沒有任何題目");
});

test("T-MET-04-2 趨勢圖縱軸固定 0–100%，2% 的差距不被放大", () => {
  const app = loadApp();
  const svg = app.run(`Mock.trendSVG([{ lR: 78, lT: 100, rR: 0, rT: 0 }, { lR: 80, lT: 100, rR: 0, rT: 0 }])`);
  const ys = [...svg.matchAll(/<circle cx="[\d.]+" cy="([\d.]+)"/g)].map(m => Number(m[1]));
  assert.equal(ys.length, 2);
  const plotH = 150 - 14 - 24; // trendSVG 的 h - top - bottom
  assert.ok(Math.abs((ys[0] - ys[1]) - plotH * 0.02) < 1e-9, `高度差 ${ys[0] - ys[1]} 應為 ${plotH * 0.02}`);
  assert.match(svg, />100%</); assert.match(svg, />0%</);
});

test("T-AUD-03-4 模考中語音沒播放的聽力題不計分", async () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN }) });
  app.run(`
    Mock.start("listen");
    Mock.s.lAnswers = Mock.s.lAnswers.map(() => null);
    Mock.s.paper.listening.forEach((it, i) => { if (i < 3) Mock.s.audioFail.add(i); });
    globalThis.__before = JSON.stringify(S.lcat);
    Mock.submit();
  `);
  const last = app.run("S.mocks[S.mocks.length - 1]");
  assert.equal(app.run("Mock.s"), null, "交卷後 session 清空");
  assert.equal(last.lSkip, 3);
  assert.equal(last.lT, 19 - 3);
  assert.equal(last.L, undefined, "不再存換算分數");
  const lcat = app.run("S.lcat");
  const answered = Object.values(lcat).reduce((n, s) => n + s.r + s.w, 0);
  assert.equal(answered, 16, "累計答對率只計入有播放的題目");
});

/* ---------- MET-05 結算文案 ---------- */
test("T-MET-05-1 沒有用單輪結果判定程度的文字", () => {
  const src = readSource("js/app.js");
  for (const phrase of ["900+ 的水準", "高分水準", "聽力反應很到位"]) assert.equal(src.includes(phrase), false, phrase);
});

/* ---------- AUD-01 語音就緒偵測 ---------- */
test("T-AUD-01-1/3/4 語音狀態判定", () => {
  const speech = fakeSpeech({ voices: [] });
  const app = loadApp({ speech });
  assert.equal(app.run("TTS.voiceState()"), "loading", "清單還沒載入");
  speech.loadVoices([voice("zh-TW", "Chinese")]);
  assert.equal(app.run("TTS.voiceState()"), "none", "只有中文語音");
  speech.loadVoices([voice("zh-TW"), voice("en-US")]);
  assert.equal(app.run("TTS.voiceState()"), "ready", "有英文語音");
});

test("T-AUD-01-2 清單一直是空的，2 秒後判定為沒有英文語音", async () => {
  const app = loadApp({ speech: fakeSpeech({ voices: [] }) });
  assert.equal(app.run("TTS.voiceState()"), "loading");
  await wait(2100);
  assert.equal(app.run("TTS.voiceState()"), "none");
});

test("T-AUD-01-5/7 沒有英文語音時 withVoices 先說明、不播放；有語音時同步開始", () => {
  const speech = fakeSpeech({ voices: [voice("zh-TW")] });
  const app = loadApp({ speech });
  speech.loadVoices([voice("zh-TW")]);
  app.run(`globalThis.__started = 0; globalThis.__asked = 0;
    UI.confirm = () => { __asked++; return new Promise(() => {}); };
    withVoices(() => { __started++; });`);
  assert.equal(app.run("__started"), 0);
  assert.equal(app.run("__asked"), 1);
  speech.loadVoices([voice("en-US")]);
  app.run("withVoices(() => { __started++; });");
  assert.equal(app.run("__started"), 1, "有英文語音時要同步開始，保留點擊手勢");
});

test("T-AUD-01-6 選擇仍要嘗試播放後就開始", async () => {
  const speech = fakeSpeech({ voices: [] });
  const app = loadApp({ speech });
  speech.loadVoices([]);
  // 模擬使用者按下「仍要嘗試播放」：UI.confirm 在點擊處理函式內同步呼叫 onOk
  app.run(`globalThis.__started = 0; UI.confirm = (msg, opts) => { opts.onOk(); return Promise.resolve(true); };
    withVoices(() => { __started++; });`);
  assert.equal(app.run("__started"), 1, "必須在點擊當下同步開始，不能等 Promise（review P3-4）");
  assert.equal(app.run("TTS.forceTry"), true);
});

/* ---------- AUD-02 由點擊開始播放 ---------- */
test("T-AUD-02-1 seq 在呼叫當下同步送出第一段語音", () => {
  const speech = fakeSpeech({ voices: EN });
  const app = loadApp({ speech });
  app.run(`TTS.seq([{ t: "first" }, { t: "second" }]);`);
  assert.deepEqual(speech.spoken, ["first"], "第一段必須在同一個呼叫堆疊內送出");
});

test("T-AUD-02-1b 模考聽力節要按「開始播放」才開始", () => {
  const speech = fakeSpeech({ voices: EN });
  const app = loadApp({ speech });
  app.run(`Mock.start("listen");`);
  assert.equal(speech.spoken.length, 0, "確認視窗之後不可直接播放");
  assert.match(app.run("Mock.readyListening.toString()"), /mock-play/);
});

/* ---------- AUD-03 播放看門狗 ---------- */
test("T-AUD-03-2 逾時公式", () => {
  const app = loadApp();
  app.run(`Settings.get = () => 1;`);
  assert.equal(app.run(`TTS.timeoutMs("one", 1)`), (4 + 3) * 1000);
  assert.equal(app.run(`TTS.timeoutMs("a b c d e f g h i j", 1)`), (Math.max(4, 6) + 3) * 1000);
  const words100 = Array(100).fill("w").join(" ");
  assert.equal(app.run(`TTS.timeoutMs(${JSON.stringify(words100)}, 1.2)`), (100 * 0.6 / 1.2 + 3) * 1000);
  assert.equal(app.run(`TTS.timeoutMs(${JSON.stringify(words100)}, 0.8)`), (100 * 0.6 / 0.8 + 3) * 1000);
});

test("T-AUD-03-1/3 語音一直沒反應：逾時結束等待並提示沒有聲音", async () => {
  const speech = fakeSpeech({ voices: EN, mode: "silent" });
  const app = loadApp({ speech });
  app.run(`TTS.timeoutMs = () => 30; globalThis.__silent = 0; globalThis.__res = null;
    TTS.seq([{ t: "a", pause: 0 }, { t: "b", pause: 0 }], { onSilent: () => __silent++ }).then(r => { __res = r; });`);
  await wait(200);
  assert.deepEqual(JSON.parse(JSON.stringify(app.run("__res"))), { played: false, aborted: false }, "必須結束等待");
  assert.equal(speech.spoken.length, 2);
  assert.equal(app.run("__silent"), 1, "整組都沒播放要提示一次");
  await wait(3100);
  assert.equal(app.run("__silent"), 1, "不可重複提示");
});

test("T-AUD-03-3 語音卡住超過 3 秒（尚未逾時）就提示", async () => {
  const speech = fakeSpeech({ voices: EN, mode: "silent" });
  const app = loadApp({ speech });
  app.run(`globalThis.__silent = 0; TTS.seq([{ t: "a" }], { onSilent: () => __silent++ });`);
  await wait(3100);
  assert.equal(app.run("__silent"), 1);
  app.run("TTS.stop()");
});

test("T-AUD-03-3b 瀏覽器立刻回報錯誤（iOS 擋下時的行為）也要提示", async () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN, mode: "error" }) });
  app.run(`globalThis.__silent = 0; TTS.seq([{ t: "a", pause: 0 }], { onSilent: () => __silent++ });`);
  await wait(50);
  assert.equal(app.run("__silent"), 1);
});

test("正常播放不出現沒有聲音的提示", async () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN }) });
  app.run(`globalThis.__silent = 0; TTS.seq([{ t: "a", pause: 0 }], { onSilent: () => __silent++ });`);
  await wait(3100);
  assert.equal(app.run("__silent"), 0);
});

test("T-AUD-03-5 正常播放回報 played，出錯回報未播放", async () => {
  const ok = loadApp({ speech: fakeSpeech({ voices: EN }) });
  ok.run(`globalThis.__res = null; TTS.seq([{ t: "a", pause: 0 }]).then(r => { __res = r; });`);
  await wait(50);
  assert.equal(ok.run("__res.played"), true);
  const bad = loadApp({ speech: fakeSpeech({ voices: EN, mode: "error" }) });
  bad.run(`globalThis.__res = null; TTS.seq([{ t: "a", pause: 0 }]).then(r => { __res = r; });`);
  await wait(50);
  assert.equal(bad.run("__res.played"), false);
});

test("播放中按重播，舊的播放不再繼續念", async () => {
  const speech = fakeSpeech({ voices: EN });
  const app = loadApp({ speech });
  app.run(`TTS.seq([{ t: "a1", pause: 0 }, { t: "a2", pause: 0 }, { t: "a3", pause: 0 }]);
    TTS.seq([{ t: "b1", pause: 0 }]);`);
  await wait(100);
  assert.deepEqual(speech.spoken, ["a1", "b1"]);
});

/* ---------- SEC-02 同步代碼 ---------- */
test("T-SEC-02-1/2 同步代碼格式、唯一性與安全亂數", () => {
  const app = loadApp();
  const codes = app.run(`Array.from({ length: 10000 }, () => Sync.genCode())`);
  const re = /^[a-hjkmnp-z2-9]{5}-[a-hjkmnp-z2-9]{5}$/;
  assert.ok(codes.every(c => re.test(c)), "格式不符");
  assert.equal(new Set(codes).size, codes.length, "出現重複代碼");
  assert.equal(/Math\.random/.test(readSource("js/sync.js")), false);
});

/* ---------- SEC-01 規則檔（靜態檢查；實際權限測試見 verification.md 的 L4） ---------- */
test("SEC-01 規則檔可解析，且沒有使用 Firebase 不支援的正規表示式語法", () => {
  const rules = JSON.parse(readSource("firebase/database.rules.json"));
  const code = rules.rules.sync.$code;
  assert.equal(rules.rules[".read"], false);
  assert.equal(rules.rules[".write"], false);
  const regexes = [...code[".read"].matchAll(/matches\(\/(.*?)\/\)/g)].map(m => m[1]);
  assert.equal(regexes.length, 1);
  assert.equal(/\{\d/.test(regexes[0]), false, "Firebase 規則不支援 {m,n}");
  const re = new RegExp(regexes[0]);
  for (const ok of ["ab3de-f7gh9", "abcd"]) assert.ok(re.test(ok), ok);
  for (const bad of ["AB3DE", "ab_cd", "ab.cd", "-abcd", "abcd-"]) assert.equal(re.test(bad), false, bad);
  assert.equal(code.$other[".validate"], false);
});

test("T-AUD-03-4b 所有聽力題都沒播放時，報告不可顯示全對", () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN }) });
  app.run(`globalThis.__html = "";
    const realBox = Mock.box; Mock.box = () => ({ set innerHTML(v) { __html = v; }, get innerHTML() { return __html; }, querySelector: () => null, querySelectorAll: () => [] });
    globalThis.$ = () => ({ addEventListener() {} });
    Mock.start("listen");
    Mock.s.paper.listening.forEach((it, i) => Mock.s.audioFail.add(i));
    Mock.submit();`);
  const html = app.run("__html");
  assert.equal(html.includes("全對"), false);
  assert.match(html, /沒有可計分的題目/);
});

test("T-MET-04-3 雙節模考報告分開顯示聽力與閱讀，沒有合併總分", () => {
  const app = loadApp();
  app.run(`globalThis.__html = "";
    Mock.box = () => ({ set innerHTML(v) { __html = v; }, get innerHTML() { return __html; }, querySelector: () => null, querySelectorAll: () => [] });
    globalThis.$ = () => ({ addEventListener() {} });
    Mock.renderReport({ mode: "full", lR: 16, lT: 19, rR: 22, rT: 27, lSkip: 0, secs: 2100,
      parts: { "Part 2": { r: 8, t: 10 }, "Part 5": { r: 12, t: 15 } },
      wrongs: [{ part: "Part 5", q: "q", opts: ["a", "b"], ans: 0, exp: "e", chosen: "b" }] });`);
  const html = app.run("__html");
  assert.match(html, /聽力答對 16 \/ 19 題/);
  assert.match(html, /閱讀答對 22 \/ 27 題/);
  assert.match(html, /84%/); assert.match(html, /81%/);
  assert.equal(/83%|總分|總答對/.test(html), false, "不可合併成總分");
  assert.match(html, /不是 TOEIC 分數/);
});

/* ---------- 獨立審查發現的回歸測試（evidence/v1.3.0/review.md） ---------- */
test("review P2-1 模考進行中再點「模擬考」不會中斷聽力或重畫選單", () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN }) });
  app.run(`Mock.start("listen"); globalThis.__menu = 0; globalThis.__stops = 0;
    const realMenu = Mock.menu; Mock.menu = () => { __menu++; };
    const realStop = TTS.stop; TTS.stop = () => { __stops++; };
    switchTab("mock");`);
  assert.equal(app.run("__menu"), 0);
  assert.equal(app.run("__stops"), 0);
  assert.notEqual(app.run("Mock.s"), null);
});

test("review P2-1 被停止的播放回報 aborted，不算成沒有播放", async () => {
  const app = loadApp({ speech: fakeSpeech({ voices: EN, mode: "silent" }) });
  app.run(`TTS.timeoutMs = () => 30; globalThis.__res = null;
    TTS.seq([{ t: "a", pause: 0 }]).then(r => { __res = r; }); TTS.stop();`);
  await wait(100);
  assert.equal(app.run("__res.aborted"), true);
});

test("review P2-1 舊的聽力迴圈不可接手新的模考", () => {
  const src = readSource("js/mock.js");
  assert.match(src, /Mock\.s !== s \|\| s\.cancelled/);
});

test("review P2-2 同步代碼格式檢查與規則一致", () => {
  const app = loadApp();
  for (const ok of ["ab3de-f7gh9", "abcd", "my-code-2026"]) assert.equal(app.run(`Sync.validCode(${JSON.stringify(ok)})`), true, ok);
  for (const bad of ["abc", "dean-", "my--code", "-abcd", "AB3DE", "a_b", "x".repeat(65)]) {
    assert.equal(app.run(`Sync.validCode(${JSON.stringify(bad)})`), false, bad);
  }
  const rules = JSON.parse(readSource("firebase/database.rules.json"));
  const re = new RegExp(rules.rules.sync.$code[".read"].match(/matches\(\/(.*?)\/\)/)[1]);
  for (const c of ["ab3de-f7gh9", "abcd", "my--code", "dean-", "a_b"]) {
    const byRule = c.length >= 4 && c.length <= 64 && re.test(c);
    assert.equal(app.run(`Sync.validCode(${JSON.stringify(c)})`), byRule, `程式與規則對 ${c} 的判斷不一致`);
  }
});

test("review P2-3 voiceschanged 沒觸發時，判定前會再讀一次語音清單", async () => {
  const speech = fakeSpeech({ voices: [] });
  const app = loadApp({ speech });
  await wait(2100);
  speech.voices = [voice("en-US")]; // 清單有了，但沒有觸發 voiceschanged
  assert.equal(app.run("TTS.voiceState()"), "ready");
});

test("review P3-3 出卡自動發音時沒有英文語音不跳提示，按發音鈕才提示", () => {
  const speech = fakeSpeech({ voices: [] });
  const app = loadApp({ speech });
  speech.loadVoices([]);
  app.run(`globalThis.__toasts = 0; UI.toast = () => { __toasts++; }; speakWord("word", false);`);
  assert.equal(app.run("__toasts"), 0);
  app.run(`speakWord("word");`);
  assert.equal(app.run("__toasts"), 1);
});

test("review P3-6 送出語音時拋錯也會結束等待", async () => {
  const speech = fakeSpeech({ voices: EN });
  speech.speak = () => { throw new Error("boom"); };
  const app = loadApp({ speech });
  app.run(`globalThis.__res = null; TTS.seq([{ t: "a", pause: 0 }]).then(r => { __res = r; }, () => { __res = "rejected"; });`);
  await wait(50);
  assert.equal(app.run("__res.played"), false);
});
