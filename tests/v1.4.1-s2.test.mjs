// S2：聽力新制題組（圖表題、三人對話）、Part 2 新題、外部測驗成績、考前作答策略
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp, fakeSpeech, voice } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));

test("S2-content 聽力新題：Part 2 新題 40 題、Part 3/4 新制題組 10 組（5 組圖表題、2 組三人對話）", () => {
  const app = loadApp();
  assert.equal(app.run(`PART2.filter(q => q.src === "S2").length`), 40);
  const sets = plain(app.run(`PART34.filter(s => s.src === "S2")`));
  assert.equal(sets.length, 10);
  const graphic = sets.filter(s => s.graphic);
  assert.equal(graphic.length, 5);
  graphic.forEach(s => {
    assert.ok(s.qs.some(q => /^Look at the graphic/.test(q.q)), `${s.title} 缺圖表題`);
    assert.ok(s.graphic.split("\n").every(l => l.length <= 34), `${s.title} 的圖表太寬，手機會需要橫向捲動`);
  });
  assert.equal(sets.filter(s => s.turns.some(t => t.s === "M2" || t.s === "W2")).length, 2);
  for (const s of sets) {
    assert.equal(s.qs.length, 3);
    s.qs.forEach(q => { assert.equal(q.opts.length, 4); assert.equal(/\([A-D]\)/.test(q.exp), false); });
    assert.ok(s.turns.every(t => ["M", "W", "M2", "W2", "N"].includes(t.s)));
  }
  // 自訂題庫匯入也接受三人對話與圖表
  assert.equal(app.run(`validateItem("l34", PART34.find(s => s.graphic && s.src === "S2"))`), true);
  assert.equal(app.run(`validateItem("l34", PART34.find(s => s.src === "S2" && s.turns.some(t => t.s === "M2")))`), true);
});

test("S2-voice 三人對話的第二位男聲／女聲：有不同語音時換語音，沒有時用不同音高", async () => {
  const voices = [voice("en-US", "Microsoft David"), voice("en-US", "Microsoft Mark"), voice("en-US", "Microsoft Zira"), voice("en-US", "Microsoft Jenny")];
  const speech = fakeSpeech({ voices });
  const app = loadApp({ speech });
  app.run("TTS.init()");
  assert.equal(app.run(`TTS.voiceFor("M").name`), "Microsoft David");
  assert.equal(app.run(`TTS.voiceFor("M2").name`), "Microsoft Mark");
  assert.equal(app.run(`TTS.voiceFor("W").name`), "Microsoft Zira");
  assert.equal(app.run(`TTS.voiceFor("W2").name`), "Microsoft Jenny");
  // 只有一個男聲時，M2 沿用同一個語音（靠音高區分）
  const one = loadApp({ speech: fakeSpeech({ voices: [voice("en-US", "Microsoft David"), voice("en-US", "Microsoft Zira")] }) });
  one.run("TTS.init()");
  assert.equal(one.run(`TTS.voiceFor("M2").name`), "Microsoft David");
  assert.match(app.run("TTS.speak.toString()"), /M2: 0\.75/);
});

test("S2-graphic 圖表以純文字顯示、逐字稿標出第二位說話者、AI 解析也收到圖表", () => {
  const app = loadApp();
  assert.equal(app.run(`graphicHTML({ graphic: "<img src=x onerror=alert(1)>" })`).includes("<img"), false);
  assert.equal(app.run(`graphicHTML({})`), "");
  const set = `PART34.find(s => s.src === "S2" && s.turns.some(t => t.s === "M2"))`;
  assert.match(app.run(`transcript(${set})`), /（男 2）/);
  assert.match(app.run(`aiTranscript(${set})`), /男 2：/);
  const g = `PART34.find(s => s.graphic && s.src === "S2")`;
  assert.match(app.run(`aiTranscript(${g})`), /【題目附的圖表】/);
});

test("S2-ext 外部測驗成績：存在學習紀錄、會同步；格式錯誤的資料會被清掉", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ ext: [
    { date: "2026-10-05", src: "網站模擬 1", L: 400, R: 380 },
    { date: "壞日期", src: "x", L: 300, R: 300 },
    { date: "2026-10-06", src: "<img src=x onerror=alert(1)>" + "a".repeat(100), L: 999, R: "abc" },
    null
  ] }) } });
  const ext = plain(app.run("S.ext"));
  assert.equal(ext.length, 2);
  assert.deepEqual(ext[0], { date: "2026-10-05", src: "網站模擬 1", L: 400, R: 380 });
  assert.equal(ext[1].L, 495, "超過 495 的分數收斂到上限");
  assert.equal(ext[1].R, 0, "不是數字的分數歸零");
  assert.equal(ext[1].src.length, 60, "來源最多 60 字");
  app.run("save()");
  assert.ok(app.store.get("toeic900").includes("網站模擬 1"));
  assert.ok(Array.isArray(plain(loadApp().run("S.ext"))), "新使用者的紀錄就有 ext 陣列");
});

test("S3-R2 第 2 回完整測驗：配置和第 1 回相同，做完第 1 回後菜單改排第 2 回", () => {
  const app = loadApp();
  for (const id of ["R1", "R2"]) {
    const parts = plain(app.run(`Mock.buildPaper("${id}").reading.map(it => it.part)`));
    assert.equal(parts.length, 100, id);
    assert.equal(parts.filter(p => p === "Part 5").length, 30, id);
    assert.equal(parts.filter(p => p === "Part 6").length, 16, id);
  }
  app.run(`S.mocks = [{ date: todayStr(-4), mode: "R1", lR: 0, lT: 0, rR: 70, rT: 100 }];`);
  assert.equal(app.run("nextForm().id"), "R2");
  // 兩回測驗的題目互不重複
  const stems = id => plain(app.run(`PART5.filter(q => q.form === "${id}").map(q => q.q)`));
  const r1 = new Set(stems("R1"));
  assert.equal(stems("R2").some(q => r1.has(q)), false);
});

test("S3-order 插入句子位置題的選項照 [1]～[4] 排列（和正式考試一樣），一般題目仍然洗牌", () => {
  const app = loadApp();
  assert.deepEqual(plain(app.run(`optionOrder(["[2]", "[1]", "[3]", "[4]"])`)), [1, 0, 2, 3]);
  // 卷子裡的位置題：顯示順序一定是 [1][2][3][4]
  const shown = plain(app.run(`Mock.buildPaper("R2").reading.filter(it => /positions marked/.test(it.q.q)).map(it => it.order.map(i => it.q.opts[i]).join(""))`));
  assert.ok(shown.length >= 2);
  shown.forEach(s => assert.equal(s, "[1][2][3][4]"));
  // 一般題目：多次產生至少會出現不同順序
  const orders = new Set();
  for (let k = 0; k < 20; k++) orders.add(plain(app.run(`optionOrder(["a", "b", "c", "d"])`)).join(""));
  assert.ok(orders.size > 1);
});

test("S3-quality Part 5 沒有「題幹高度相似而且答案相同」的重複題", () => {
  const app = loadApp();
  const P = plain(app.run("PART5"));
  const words = s => new Set(s.toLowerCase().replace(/_+/g, " ").match(/[a-z]+/g).filter(w => w.length > 3));
  const sim = (a, b) => { const A = words(a), B = words(b); const i = [...A].filter(x => B.has(x)).length; return i / (A.size + B.size - i); };
  const dups = [];
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
    const same = P[i].opts[P[i].ans].toLowerCase() === P[j].opts[P[j].ans].toLowerCase();
    if (same && sim(P[i].q, P[j].q) >= 0.25) dups.push(`P5-${i + 1} ~ P5-${j + 1}`);
  }
  assert.deepEqual(dups, []);
});

test("S3-strategy 考前作答策略涵蓋聽力、閱讀時間分配與考前準備", () => {
  const app = loadApp();
  const html = app.run("strategyHTML()");
  for (const k of ["聽力", "閱讀", "Part 5 約 10 分鐘", "55 分鐘以上給 Part 7", "絕對不要留白", "考前幾天與當天"]) {
    assert.ok(html.includes(k), `策略頁缺少「${k}」`);
  }
});
