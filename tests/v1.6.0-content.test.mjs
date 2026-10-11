// v1.6.0：練習題第 1 批（C1）。新題接在內建題後面，舊紀錄（錯題本、輪替）仍對到同一題
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
// v1.5.1 的內建題數（C1 之前）與 C1 新增的題數
const OLD = { p5: 390, p6: 22, p7: 65, l2: 150, l34: 69 };
const ADD = { p5: 120, p6: 8, p7: 20, l2: 60, l34: 20 };

test("C1-content 題數、全部是練習題（不是完整測驗保留題）、每題都有技能標籤", () => {
  const app = loadApp();
  const n = plain(app.run("BASE_N"));
  Object.keys(OLD).forEach(t => assert.equal(n[t], OLD[t] + ADD[t], t));
  assert.equal(app.run("VOCAB.length"), 1001);
  const arrs = { p5: "PART5", p6: "PART6", p7: "PART7", l2: "PART2", l34: "PART34" };
  Object.entries(arrs).forEach(([t, a]) => {
    const items = plain(app.run(`${a}.slice(${OLD[t]})`));
    items.forEach((it, i) => {
      assert.ok(!it.form, `${t}#${OLD[t] + i} 不應是完整測驗題`);
      const qs = it.qs || it.blanks || [it];
      qs.forEach(q => assert.match(String(q.sk || ""), /^[a-z0-9-]{2,20}$/, `${t}#${OLD[t] + i} 缺技能標籤`));
    });
  });
  // 新的 Part 5 類別出現在類別清單
  const cats = new Set(plain(app.run("PART5.map(q => q.cat)")));
  ["主詞動詞一致", "假設語氣與倒裝"].forEach(c => assert.ok(cats.has(c), c));
});

test("C1-upgrade v1.5.1 的紀錄升級：內建題的紀錄不動，自訂題的紀錄搬到新索引", () => {
  const rec = {
    baseN: OLD,
    wb: {
      p5: { 5: { n: 0, last: null }, [OLD.p5]: { n: 1, last: "2026-10-10" } },
      p7: { "3-1": { n: 0, last: null }, [`${OLD.p7}-2`]: { n: 0, last: null } },
      l2: { [OLD.l2 + 1]: { n: 0, last: null } }
    },
    p5seen: { 7: true, [OLD.p5 + 2]: true },
    p7done: { [OLD.p7]: 3 }
  };
  const app = loadApp({ storage: { toeic900: JSON.stringify(rec) } });
  const S = plain(app.run("S"));
  assert.deepEqual(Object.keys(S.wb.p5).sort(), ["5", String(OLD.p5 + ADD.p5)].sort());
  assert.deepEqual(Object.keys(S.wb.p7).sort(), ["3-1", `${OLD.p7 + ADD.p7}-2`].sort());
  assert.deepEqual(Object.keys(S.wb.l2), [String(OLD.l2 + ADD.l2 + 1)]);
  assert.deepEqual(Object.keys(S.p5seen).sort(), ["7", String(OLD.p5 + ADD.p5 + 2)].sort());
  assert.deepEqual(Object.keys(S.p7done), [String(OLD.p7 + ADD.p7)]);
  assert.deepEqual(S.baseN, plain(app.run("BASE_N")));
});

test("C1-round 一般練習會抽到新題", () => {
  const app = loadApp();
  // 抽很多輪，新題（索引 >= 舊題數）至少出現過
  const hit = app.run(`(() => { let h = 0; for (let k = 0; k < 40; k++) { S.p5seen = {}; const ids = drawRound("p5seen", PART5.length, ROUND_N, [], null, i => isFormItem("p5", i)); h += ids.filter(i => i >= ${OLD.p5}).length; } return h; })()`);
  assert.ok(hit > 0);
});
