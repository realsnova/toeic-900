// v1.7 學習引擎：FSRS 排程、技能掌握度（工作票 16）
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const app = loadApp();
const run = code => plain(app.run(code));

test("FSRS-1 新卡：四個按鈕的間隔由短到長；忘記是當天", () => {
  const iv = run(`FSRS.preview(null, "2026-10-11")`);
  assert.equal(iv.again, 0);
  assert.ok(iv.hard >= 1 && iv.hard <= iv.good && iv.good < iv.easy, JSON.stringify(iv));
});

test("FSRS-2 連續記得：間隔越拉越長，但不超過 365 天", () => {
  let c = null, day = "2026-01-01", prev = 0;
  const add = (d, n) => new Date(Date.parse(d + "T00:00:00Z") + n * 86400000).toISOString().slice(0, 10);
  for (let k = 0; k < 12; k++) {
    c = run(`FSRS.review(${JSON.stringify(c)}, "good", "${day}")`);
    assert.ok(c.i >= prev, `第 ${k + 1} 次 ${c.i} < ${prev}`);
    assert.ok(c.i <= 365);
    prev = c.i; day = add(day, c.i);
  }
  assert.ok(prev > 60, "記得 12 次後間隔應該很長");
});

test("FSRS-3 忘記：穩定度下降、當天再問、記錄遺忘次數；難度上升", () => {
  let c = run(`FSRS.review(null, "good", "2026-10-01")`);
  c = run(`FSRS.review(${JSON.stringify(c)}, "good", "${c.due}")`);
  const before = c;
  c = run(`FSRS.review(${JSON.stringify(c)}, "again", "2026-11-20")`);
  assert.ok(c.s < before.s);
  assert.equal(c.i, 0);
  assert.equal(c.due, "2026-11-20");
  assert.equal(c.lapses, 1);
  assert.ok(c.d > before.d);
});

test("FSRS-4 舊版（SM-2）的卡片直接接上：間隔長的卡穩定度高，下一次間隔不會歸零", () => {
  const old = { i: 30, e: 2.5, due: "2026-10-11", n: 6 };
  const c = run(`FSRS.review(${JSON.stringify(old)}, "good", "2026-10-11")`);
  assert.ok(c.i > 30, `間隔 ${c.i}`);
  assert.equal(c.n, 7);
  const hard = run(`FSRS.fromLegacy({ i: 2, e: 1.3, due: "2026-10-11", n: 4 })`);
  const easy = run(`FSRS.fromLegacy({ i: 2, e: 3.0, due: "2026-10-11", n: 4 })`);
  assert.ok(hard.d > easy.d, "難易係數低＝難度高");
});

test("MAS-1 掌握度：一直答對會上升、一直答錯會下降，有上下限", () => {
  let m;
  for (let k = 0; k < 40; k++) m = run(`Mastery.update(${JSON.stringify(m)}, true, { type: "p5" })`);
  assert.ok(app.run(`Mastery.level(${JSON.stringify(m)})`) > 0.9);
  let w;
  for (let k = 0; k < 40; k++) w = run(`Mastery.update(${JSON.stringify(w)}, false, { type: "p5" })`);
  const low = app.run(`Mastery.level(${JSON.stringify(w)})`);
  assert.ok(low < 0.3 && low >= 0.25, `${low}（不會低於猜中率）`);
  assert.equal(w.n, 40);
  assert.equal(w.r, 0);
});

test("MAS-2 收斂：真實答對率 70% 的學習者，掌握度落在 60–80%", () => {
  let m, seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let k = 0; k < 300; k++) m = run(`Mastery.update(${JSON.stringify(m)}, ${rnd() < 0.7}, { type: "p5" })`);
  const lv = app.run(`Mastery.level(${JSON.stringify(m)})`);
  assert.ok(lv > 0.6 && lv < 0.8, String(lv));
});

test("MAS-3 少於 5 題不判定", () => {
  assert.equal(app.run(`Mastery.enough({ th: 1, n: 4 })`), false);
  assert.equal(app.run(`Mastery.enough({ th: 1, n: 5 })`), true);
});

test("SKILL-1 每一道內建題都有合法的技能標籤（100% 覆蓋），而且屬於自己的 Part", () => {
  const a = loadApp();
  const missing = plain(a.run(`(() => {
    const out = [];
    const part = Object.fromEntries(SKILLS.map(s => [s.id, s.part]));
    ["p5", "l2"].forEach(t => BANK_ARRAYS()[t].forEach(it => { if (part[it.sk] !== t) out.push(it.id + ":" + it.sk); }));
    ["p6", "p7", "l34"].forEach(t => BANK_ARRAYS()[t].forEach(s => s[SET_PARTS[t]].forEach((q, k) => { if (part[q.sk] !== t) out.push(s.id + "_" + k + ":" + q.sk); })));
    return out;
  })()`));
  assert.deepEqual(missing, []);
  assert.equal(a.run("SKILLS.length"), 36);
});

test("SKILL-2 作答會更新該技能的掌握度；錯題本重考也算", () => {
  const a = loadApp();
  const sk = a.run(`PART5[0].sk`);
  a.run(`wbMark("p5", 0, false); wbMark("p5", 0, true); wbMark("p7", "0-0", true);`);
  const m = plain(a.run("S.mastery"));
  assert.equal(m[sk].n, 2);
  assert.equal(m[sk].r, 1);
  assert.ok(m[a.run(`PART7[0].qs[0].sk`)]);
});

test("SKILL-3 自訂 Part 5 題依類別推定技能", () => {
  const bank = { p5: [{ q: "We ______ the order yesterday.", opts: ["shipped", "ship", "shipping", "ships"], ans: 0, cat: "動詞時態", exp: "yesterday 用過去式。" }] };
  const a = loadApp({ storage: { toeic900_bank: JSON.stringify(bank) } });
  assert.equal(a.run("PART5[PART5.length - 1].sk"), "g-tense");
});

test("SKILL-4 掌握度與 FSRS 欄位會經過型別檢查，也會在同步時合併", () => {
  const a = loadApp({ storage: { toeic900: JSON.stringify({ idV: 1,
    mastery: { "g-pos": { th: 99, n: 3, r: 9, last: "x" }, "bad key!": { th: 1, n: 1 } },
    vocab: { alpha: { i: 3, e: 2.5, due: "2026-10-12", n: 2, s: 3.2, d: 5.1, l: "2026-10-09" }, beta: { i: 1, e: 2.5, due: "2026-10-12", n: 1, s: -1, d: 99 } } }) } });
  const S = plain(a.run("S"));
  assert.deepEqual(S.mastery, { "g-pos": { th: 4, n: 3, r: 3, last: "" } });
  assert.equal(S.vocab.alpha.s, 3.2);
  assert.equal(S.vocab.alpha.l, "2026-10-09");
  assert.equal("s" in S.vocab.beta, false);
  const m = plain(a.run(`Merge.records({ mastery: { "g-pos": { th: 0, n: 2 } } }, { mastery: { "g-pos": { th: 1, n: 5 } } }, { mastery: { "g-pos": { th: -1, n: 3 }, "g-rel": { th: 0.5, n: 6 } } })`));
  assert.deepEqual(m.mastery, { "g-pos": { th: 1, n: 5 }, "g-rel": { th: 0.5, n: 6 } });
});

test("FSRS-5 單字卡評分走 FSRS：記得的卡間隔和預覽一致", () => {
  const a = loadApp();
  a.run(`vq = [VOCAB[0]]; nextCard = () => {};`);
  const iv = plain(a.run(`FSRS.preview(null, todayStr())`));
  a.run(`rateCard(VOCAB[0], "good")`);
  const c = plain(a.run("S.vocab[VOCAB[0].w]"));
  assert.equal(c.i, iv.good);
  assert.ok(c.s > 0 && c.d >= 1 && c.l);
  assert.equal(a.run("daily().newV"), 1);
});

test("TRANSFER-1 答錯後下一輪出一道同技能的新題（不是同一題），出過就移出佇列", () => {
  const a = loadApp();
  const i = a.run(`PART5.findIndex(q => !q.form && q.sk === "g-comp")`);
  a.run(`wbMark("p5", ${i}, false)`);
  assert.deepEqual(plain(a.run("S.tq.p5")), ["g-comp"]);
  const ids = plain(a.run(`drawRound("p5seen", PART5.length, 10, [], null, j => isFormItem("p5", j))`));
  const comp = ids.filter(j => a.run(`PART5[${j}].sk`) === "g-comp" && j !== i);
  assert.ok(comp.length >= 1, "要有一道同技能的新題");
  assert.deepEqual(plain(a.run("S.tq.p5")), []);
});

test("WEAK-1 弱項技能：作答夠多且掌握度低於 70% 才算，由弱到強；Part 5 出題會偏向弱項", () => {
  const a = loadApp();
  a.run(`S.mastery = { "g-rel": { th: -2, n: 12, r: 3 }, "g-pos": { th: -1, n: 12, r: 5 }, "g-prep": { th: 2, n: 12, r: 11 }, "g-comp": { th: -3, n: 2, r: 0 } }`);
  assert.deepEqual(plain(a.run(`weakSkills("p5")`)), ["g-rel", "g-pos"]);
  let weakCount = 0;
  for (let k = 0; k < 20; k++) {
    a.run(`S.p5seen = {}; S.tq = { p5: [], l2: [] }`);
    const ids = plain(a.run(`drawRound("p5seen", PART5.length, 10, [], j => ["g-rel", "g-pos"].includes(PART5[j].sk), j => isFormItem("p5", j))`));
    weakCount += ids.filter(j => ["g-rel", "g-pos"].includes(a.run(`PART5[${j}].sk`))).length;
  }
  assert.ok(weakCount / 200 >= 0.4, `弱項佔 ${weakCount / 200}`);
  a.run("renderers.stats()");
});
