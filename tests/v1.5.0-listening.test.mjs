// v1.5.0：神經語音音檔（預先產生，沒有時改用裝置語音）與完整聽力測驗 L1
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { loadApp, fakeSpeech, fakeAudio, voice, wait } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const ROOT = path.resolve(import.meta.dirname, "..");

test("L1-content 第 1 回聽力測驗：Part 2 25 題、Part 3 13 組、Part 4 10 組，共 94 題，含新制題型", () => {
  const app = loadApp();
  const p2 = plain(app.run(`PART2.filter(q => q.form === "L1")`));
  const sets = plain(app.run(`PART34.filter(s => s.form === "L1")`));
  const p3 = sets.filter(s => s.type === "Part 3"), p4 = sets.filter(s => s.type === "Part 4");
  assert.equal(p2.length, 25);
  assert.equal(p3.length, 13);
  assert.equal(p4.length, 10);
  assert.equal(p2.length + sets.reduce((n, s) => n + s.qs.length, 0), 94);
  // 正式考試的配置：Part 3 最後 3 組、Part 4 最後 2 組是圖表題；Part 3 至少 2 組三人對話；意圖題各至少 2 題
  assert.deepEqual(p3.map(s => !!s.graphic), [...Array(10).fill(false), true, true, true]);
  assert.deepEqual(p4.map(s => !!s.graphic), [...Array(8).fill(false), true, true]);
  assert.ok(p3.filter(s => s.turns.some(t => t.s === "M2" || t.s === "W2")).length >= 2);
  const intent = list => list.flatMap(s => s.qs).filter(q => /^Why does the (wo)?man say|^Why does the speaker say/.test(q.q)).length;
  assert.ok(intent(p3) >= 2 && intent(p4) >= 2);
  for (const s of sets) {
    assert.ok(["us", "uk"].includes(s.acc), `${s.title} 沒有指定腔調`);
    if (s.graphic) assert.ok(s.graphic.split("\n").every(l => l.length <= 34), `${s.title} 的圖表太寬`);
    s.qs.forEach(q => { assert.equal(q.opts.length, 4); assert.equal(new Set(q.opts).size, 4); });
  }
  // 正解不能常常是最長的選項（考生會靠長度猜）
  const longest = p2.filter(q => q.opts[q.ans].length === Math.max(...q.opts.map(o => o.length))).length;
  assert.ok(longest <= 10, `Part 2 正解是最長選項的題數 ${longest}`);
});

test("L1-reserve 完整聽力測驗的題目不出現在一般練習與短版模考", () => {
  const app = loadApp();
  const formP2 = new Set(plain(app.run(`PART2.map((q, i) => q.form === "L1" ? i : -1).filter(i => i >= 0)`)));
  const formSets = new Set(plain(app.run(`PART34.map((s, i) => s.form === "L1" ? i : -1).filter(i => i >= 0)`)));
  assert.equal(app.run(`isFormItem("l2", ${[...formP2][0]})`), true);
  assert.equal(app.run(`isFormItem("l34", ${[...formSets][0]})`), true);
  assert.equal(app.run(`isFormItem("l2", 0)`), false);
  for (let r = 0; r < 15; r++) {
    app.run("startL2(); TTS.stop()");
    plain(app.run("l2s.ids")).forEach(i => assert.equal(formP2.has(i), false, `練習抽到 L1 的題目 ${i}`));
  }
  for (let r = 0; r < 6; r++) {
    const paper = plain(app.run(`Mock.buildPaper("listen").listening.map(x => x.type === "l2" ? "a" + x.id : "b" + x.si)`));
    paper.forEach(k => assert.equal(k[0] === "a" ? formP2.has(+k.slice(1)) : formSets.has(+k.slice(1)), false));
  }
  // 聽力分頁的題組清單不列 L1
  app.run(`document.getElementById = () => ({ innerHTML: "", addEventListener() {}, querySelectorAll: () => [], querySelector: () => null }); renderers.listen()`);
});

test("L1-paper 組卷：照正式考試的題號（7–100）、各 Part 說明、題組開場與念題目", () => {
  const app = loadApp();
  const paper = plain(app.run(`Mock.buildFormPaper("L1")`));
  assert.equal(paper.reading.length, 0);
  const L = paper.listening;
  assert.equal(L.length, 94);
  assert.deepEqual(L.map(x => x.num), Array.from({ length: 94 }, (_, i) => i + 7));
  assert.match(L[0].pre[0].t, /^Part Two\./);
  assert.equal(L.slice(1, 25).every(x => !x.pre), true);
  const firstP3 = L.find(x => x.part === "Part 3"), firstP4 = L.find(x => x.part === "Part 4");
  assert.equal(firstP3.num, 32);
  assert.match(firstP3.pre[0].t, /^Part Three\./);
  assert.equal(firstP3.pre[1].t, "Questions 32 through 34 refer to the following conversation.");
  assert.equal(firstP4.num, 71);
  assert.match(firstP4.pre[0].t, /^Part Four\./);
  assert.match(firstP4.pre[1].t, /^Questions 71 through 73 refer to the following talk\.$/);
  // 第二組以後只有題組開場；三人對話與圖表題的開場要說明
  const second = L.find(x => x.num === 35);
  assert.equal(second.pre.length, 1);
  assert.ok(L.some(x => x.pre && /conversation with three speakers/.test(x.pre[0].t)));
  assert.ok(L.some(x => x.pre && /conversation and graphic/.test(x.pre[0].t)));
  assert.ok(L.some(x => x.pre && /talk and graphic/.test(x.pre[0].t)));
  L.filter(x => x.type === "l34").forEach(x => assert.equal(x.ask.t, `${x.num}. ${x.q.q}`));
  // 中途離開不暫存（只有閱讀測驗有作答進度）
  assert.equal(app.run(`isListenForm(formOf("L1"))`), true);
});

test("L1-keys App 算出的音檔鍵和建置工具產生的一致（含旁白、題號）", () => {
  const built = new Set(JSON.parse(execFileSync(process.execPath, [path.join(ROOT, "tools/audio/build-jobs.mjs"), "--keys"], { encoding: "utf8" })));
  const app = loadApp();
  const keys = plain(app.run(`(() => {
    const k = [];
    const add = parts => parts.forEach(p => { if (p.clip) k.push(p.clip); });
    PART2.forEach(it => ["ABC", "BCA", "CAB"].forEach(o => add(l2Audio(it, o.split("").map(c => "ABC".indexOf(c))))));
    PART34.forEach(s => add(l34Audio(s)));
    Mock.buildFormPaper("L1").listening.forEach(x => { if (x.pre) add(x.pre); if (x.ask) add([x.ask]); });
    return k;
  })()`));
  const missing = keys.filter(k => !built.has(k));
  assert.deepEqual(missing, [], "App 會找、但建置工具沒有產生的鍵");
});

test("AUDIO-play 有音檔時播放音檔、不用裝置語音；Part 2 依洗牌後的位置挑對應標號的版本", async () => {
  const audio = fakeAudio();
  const speech = fakeSpeech({ voices: [voice("en-US")] });
  const app = loadApp({ speech, audio });
  const item = plain(app.run("PART2[0]"));
  app.run(`AudioClips.load({ us: [ClipKey.q(PART2[0].q), ClipKey.r("A", PART2[0].opts[2]), ClipKey.r("B", PART2[0].opts[0]), ClipKey.r("C", PART2[0].opts[1])] })`);
  const r = plain(await app.run(`TTS.seq(l2Audio(PART2[0], [2, 0, 1]), { clipRate: 1 })`));
  assert.equal(r.played, true);
  assert.deepEqual(speech.spoken, [" "], "只送出一段無聲語音（iOS 解鎖），內容全部由音檔播放");
  const srcs = audio.played.map(p => p.src);
  assert.equal(srcs.length, 4);
  assert.equal(srcs[0], `audio/v1/${app.run(`ClipKey.q(PART2[0].q)`)}.mp3`);
  assert.equal(srcs[1], `audio/v1/${app.run(`ClipKey.r("A", ${JSON.stringify(item.opts[2])})`)}.mp3`);
  assert.equal(audio.played[0].rate, 1);
  assert.match(app.run(`ttsNoteHTML(l2Audio(PART2[0], [2, 0, 1]))`), /神經語音/);
});

test("AUDIO-fallback 沒有音檔或音檔播放失敗時，改用裝置語音念完整內容", async () => {
  // 沒有音檔
  const speech = fakeSpeech({ voices: [voice("en-US")] });
  const app = loadApp({ speech, audio: fakeAudio() });
  app.run(`AudioClips.load({})`);
  await app.run(`TTS.seq(l2Audio(PART2[0], [0, 1, 2]))`);
  const it = plain(app.run("PART2[0]"));
  assert.deepEqual(speech.spoken, [it.q, "A.", it.opts[0], "B.", it.opts[1], "C.", it.opts[2]]);
  assert.match(app.run(`ttsNoteHTML(l2Audio(PART2[0], [0, 1, 2]))`), /裝置合成/);
  // 音檔播放錯誤：該段改用裝置語音
  const speech2 = fakeSpeech({ voices: [voice("en-US")] });
  const app2 = loadApp({ speech: speech2, audio: fakeAudio({ mode: "error" }) });
  app2.run(`AudioClips.load({ uk: [ClipKey.c(PART34[0].turns)] })`);
  const r = plain(await app2.run(`TTS.seq(l34Audio(PART34[0]))`));
  assert.equal(r.played, true);
  assert.deepEqual(speech2.spoken.filter(t => t.trim()), plain(app2.run("PART34[0].turns.map(t => t.t)")));
  // 部分有音檔
  assert.match(app2.run(`ttsNoteHTML(l2Audio(PART2[0], [0, 1, 2]).concat(l34Audio(PART34[0])))`), /部分/);
});

test("AUDIO-stop 重播或切頁時停止音檔，不會接著念", async () => {
  const audio = fakeAudio();
  const speech = fakeSpeech({ voices: [voice("en-US")] });
  const app = loadApp({ speech, audio });
  app.run(`AudioClips.load({ us: [ClipKey.c(PART34[0].turns)] })`);
  const p = app.run(`TTS.seq(l34Audio(PART34[0]))`);
  app.run("TTS.stop()");
  const r = plain(await p);
  assert.equal(r.aborted, true);
  assert.deepEqual(speech.spoken.filter(t => t.trim()), [], "被停止的音檔不可改用裝置語音再念一次");
});

test("AUDIO-novoice 裝置沒有英文語音時，有音檔就直接開始，不跳出警告", () => {
  const app = loadApp({ speech: fakeSpeech({ voices: [] }), audio: fakeAudio() });
  app.run("TTS.settled = true");
  app.run(`AudioClips.load({ us: ["qdeadbeef"] }, 1)`);
  app.run("var started = false; withVoices(() => { started = true; })");
  assert.equal(app.run("started"), true);
  // 只有部分段落有音檔：仍要先說明（否則沒有音檔的段落會沒有聲音）
  app.run(`AudioClips.load({ us: ["qdeadbeef"] }, 2)`);
  app.run("started = false; withVoices(() => { started = true; })");
  assert.equal(app.run("started"), false);
  app.run(`AudioClips.load({})`);
  app.run("started = false; withVoices(() => { started = true; })");
  assert.equal(app.run("started"), false, "沒有音檔又沒有英文語音時，仍要先說明");
});

test("L1-flow 完整聽力測驗：照順序播放說明、對話、念題目；交卷只有聽力成績，菜單不再排", async () => {
  const audio = fakeAudio();
  const app = loadApp({ speech: fakeSpeech({ voices: [voice("en-US")] }), audio });
  app.run(`S.exam = todayStr(10); S.mocks = [{ date: todayStr(-1), mode: "read", lR: 0, lT: 0, rR: 20, rT: 27 }];`);
  assert.ok(plain(app.run("todayPlan()")).some(p => /完整聽力測驗 第 1 回/.test(p.label)), "沒做過時，不排閱讀模考的日子要排");
  app.run(`Mock.start("L1")`);
  assert.equal(app.run("Mock.s.paper.listening.length"), 94);
  assert.equal(app.run("Mock.s.phase"), undefined, "聽力測驗不可進入閱讀計時");
  // 答幾題後交卷
  app.run(`Mock.s.lAnswers[0] = Mock.s.paper.listening[0].ansPos; Mock.s.lAnswers[30] = 0;`);
  app.run("Mock.submit()");
  const last = plain(app.run("S.mocks[S.mocks.length - 1]"));
  assert.equal(last.mode, "L1");
  assert.equal(last.lT, 94);
  assert.equal(last.rT, 0);
  assert.equal(app.run("nextForm(true)"), null);
  assert.ok(!plain(app.run("todayPlan()")).some(p => /完整聽力測驗/.test(p.label) && !p.done), "做過後不再排成待辦（今天顯示已完成）");
});

test("L1-run 播放流程：Part 2 開頭先播說明；Part 3 第一題前播說明＋題組開場＋對話，之後念題目", async () => {
  const audio = fakeAudio();
  const app = loadApp({ speech: fakeSpeech({ voices: [voice("en-US")] }), audio });
  // 全部段落都當作有音檔，方便從播放紀錄看順序
  app.run(`(() => { const k = [];
    const add = parts => parts.forEach(p => p.clip && k.push(p.clip));
    PART2.forEach(it => add(l2Audio(it, [0, 1, 2])));
    Mock.buildFormPaper("L1").listening.forEach(x => { if (x.pre) add(x.pre); if (x.ask) add([x.ask]); if (x.set) add(l34Audio(x.set)); });
    AudioClips.load({ n: k }); })()`);
  app.ctx.setTimeout = fn => setTimeout(fn, 0); // 段落之間的停頓不用真的等
  app.run(`Mock.start("L1"); Mock.answerWindow = () => Promise.resolve();`);
  // 只跑前 27 題（Part 2 全部＋Part 3 第一組前兩題）就停
  app.run(`Mock.s.paper.listening.length = 27; Mock.runListening();`);
  for (let i = 0; i < 2000 && app.run("!!Mock.s"); i++) await wait(2);
  const keyOf = expr => `audio/v1/${app.run(expr)}.mp3`;
  const srcs = audio.played.map(p => p.src);
  assert.equal(srcs[0], keyOf(`ClipKey.n(ListenScript.directions["Part 2"])`));
  const iDir3 = srcs.indexOf(keyOf(`ClipKey.n(ListenScript.directions["Part 3"])`));
  assert.ok(iDir3 > 0);
  const set = `PART34.find(s => s.form === "L1")`;
  assert.equal(srcs[iDir3 + 1], keyOf(`ClipKey.n(ListenScript.setIntro(${set}, 32, 34))`));
  assert.equal(srcs[iDir3 + 2], keyOf(`ClipKey.c(${set}.turns)`));
  assert.equal(srcs[iDir3 + 3], keyOf(`ClipKey.n(ListenScript.question(32, ${set}.qs[0].q))`));
  assert.ok(audio.played.every(p => p.rate === 1), "模擬考音檔一律原速");
});

test("REVIEW-1 完整聽力測驗的成績重新載入後仍保留（菜單不會一直排、卡片顯示上次成績）", () => {
  const app = loadApp({ audio: fakeAudio() });
  app.run(`Mock.start("L1"); Mock.s.lAnswers[0] = Mock.s.paper.listening[0].ansPos; Mock.submit();`);
  const again = loadApp({ storage: Object.fromEntries(app.store), audio: fakeAudio() });
  assert.equal(again.run("S.mocks[S.mocks.length - 1].mode"), "L1");
  assert.equal(again.run("nextForm(true)"), null);
});

test("REVIEW-2 完整聽力測驗不重置閱讀模考的 3 天週期", () => {
  const app = loadApp();
  app.run(`S.mocks = [{ date: todayStr(-2), mode: "read", lR: 0, lT: 0, rR: 20, rT: 27 }, { date: todayStr(), mode: "L1", lR: 60, lT: 94, rR: 0, rT: 0 }];`);
  assert.equal(app.run("daysSinceMock()"), 2);
  // 今天做完聽力測驗：菜單顯示已完成，不改排未完成的聽力練習
  app.run(`S.exam = todayStr(10)`);
  const item = plain(app.run("todayPlan()")).find(p => /完整聽力測驗/.test(p.label));
  assert.ok(item && item.done);
});

test("REVIEW-3 完整聽力測驗交卷或放棄，不刪除閱讀測驗的作答進度", () => {
  const app = loadApp({ audio: fakeAudio() });
  app.run(`localStorage.setItem(FORM_PROGRESS_KEY, JSON.stringify({ mode: "R1", sig: Mock.formSig("R1"), answers: [0], flags: [], deadline: Date.now() + 60000, t0: Date.now() }))`);
  app.run(`Mock.start("L1"); Mock.abandon();`);
  assert.ok(app.run("Mock.loadProgress()"), "放棄 L1 後 R1 的進度還在");
  app.run(`Mock.start("L1"); Mock.s.lAnswers[0] = 0; Mock.submit();`);
  assert.ok(app.run("Mock.loadProgress()"), "交卷 L1 後 R1 的進度還在");
});

test("REVIEW-4 第一段是音檔時，在點擊當下同步送出無聲語音解鎖（iOS 之後的備援語音才念得出來）", () => {
  const speech = fakeSpeech({ voices: [voice("en-US")] });
  const app = loadApp({ speech, audio: fakeAudio() });
  app.run(`AudioClips.load({ us: [ClipKey.c(PART34[0].turns)] })`);
  app.run(`TTS.seq(l34Audio(PART34[0]))`); // 不 await：檢查同步送出的內容
  assert.deepEqual(speech.spoken, [" "]);
});

// 上線前的關卡：所有段落都要有音檔（產生中會失敗，屬預期）
test("AUDIO-complete 所有段落都已經有音檔，而且 audio/clips.js 的總數正確", () => {
  const built = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, "tools/audio/build-jobs.mjs"), "--keys"], { encoding: "utf8" }));
  const app = loadApp();
  assert.equal(app.run("AUDIO_CLIPS.total"), built.length);
  const missing = built.filter(k => !app.run(`AudioClips.has(${JSON.stringify(k)})`));
  assert.equal(missing.length, 0, `還有 ${missing.length} 段沒有音檔`);
  assert.equal(app.run("AudioClips.complete"), true);
});
