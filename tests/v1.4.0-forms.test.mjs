// S2：完整閱讀測驗（forms）的單元測試
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));

test("form-R1 題目配置和正式考試相同：Part 5 30 題、Part 6 4 篇 16 題、Part 7 54 題（10 組單篇、2 組雙篇、3 組三篇）", () => {
  const app = loadApp();
  assert.equal(app.run(`PART5.filter(q => q.form === "R1").length`), 30);
  assert.equal(app.run(`PART6.filter(p => p.form === "R1").length`), 4);
  const sets = plain(app.run(`PART7.filter(s => s.form === "R1").map(s => ({ n: s.qs.length, p: s.passages.length }))`));
  assert.equal(sets.reduce((a, s) => a + s.n, 0), 54);
  assert.equal(sets.filter(s => s.p === 1).length, 10);
  assert.equal(sets.filter(s => s.p === 2).length, 2);
  assert.equal(sets.filter(s => s.p === 3).length, 3);
  assert.ok(sets.filter(s => s.p > 1).every(s => s.n === 5), "多篇題組每組 5 題");
});

test("form-R1 卷子依 Part 5 → 6 → 7 的順序出完 100 題，限時 75 分鐘", () => {
  const app = loadApp();
  const parts = plain(app.run(`Mock.buildPaper("R1").reading.map(it => it.part)`));
  assert.equal(parts.length, 100);
  assert.deepEqual([...new Set(parts)], ["Part 5", "Part 6", "Part 7"]);
  assert.equal(parts.filter(p => p === "Part 5").length, 30);
  assert.equal(parts.filter(p => p === "Part 6").length, 16);
  assert.equal(app.run(`Mock.buildPaper("R1").listening.length`), 0);
  app.run(`Mock.start("R1")`);
  assert.equal(app.run("Mock.s.secLeft"), 75 * 60);
  assert.equal(app.run("Mock.s.paper.reading.length"), 100);
  app.run("Mock.abandon()");
});

test("form-R1 測驗題目不會出現在一般 Part 5 練習與隨機模考中", () => {
  const app = loadApp();
  const formIdx = new Set(plain(app.run(`PART5.map((q, i) => q.form ? i : -1).filter(i => i >= 0)`)));
  for (let k = 0; k < 40; k++) {
    const ids = plain(app.run(`drawRound("p5seen", PART5.length, 10, [], null, i => isFormItem("p5", i))`));
    assert.equal(ids.some(i => formIdx.has(i)), false);
  }
  for (const kind of ["p5", "p6", "p7"]) {
    for (let k = 0; k < 20; k++) {
      const picked = plain(app.run(`Mock.draw("${kind}", ${kind === "p5" ? "PART5" : kind === "p6" ? "PART6" : "PART7"}.length, 2)`));
      assert.equal(picked.some(i => app.run(`isFormItem("${kind}", ${i})`)), false, kind);
    }
  }
  // 隨機模考的閱讀節也不含測驗題
  const reading = plain(app.run(`Mock.buildPaper("read").reading.map(it => it.type === "p5" ? PART5[it.id].form : it.type === "p6" ? PART6[it.pi].form : PART7[it.si].form)`));
  assert.equal(reading.some(Boolean), false);
});

test("form-R1 測驗交卷後：答錯的題目進錯題本，紀錄的模式是 R1，報告不顯示聽力", () => {
  const app = loadApp();
  app.run(`Mock.start("R1"); Mock.s.rAnswers = Mock.s.rAnswers.map((_, i) => i < 50 ? Mock.s.paper.reading[i].q.ans : null); Mock.submit();`);
  const last = plain(app.run("S.mocks[S.mocks.length - 1]"));
  assert.equal(last.mode, "R1");
  assert.equal(last.rT, 100);
  assert.equal(last.rR, 50);
  assert.equal(last.lT, 0);
  assert.ok(app.run("Object.keys(S.wb.p7).length") > 0, "沒答的 Part 7 題進錯題本");
  assert.equal(app.run(`Mock.modeName("R1")`), "完整閱讀測驗 第 1 回");
  // 存檔後重新載入，模式 R1 不會被當成不合法的值清掉
  const again = loadApp({ storage: { toeic900: app.store.get("toeic900") } });
  assert.equal(again.run("S.mocks[S.mocks.length - 1].mode"), "R1");
});

test("form-R1 衝刺期模考日：還沒做過完整測驗時優先排完整測驗；做過之後改排閱讀節", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(10); S.mocks = [];`);
  assert.equal(app.run("nextForm().id"), "R1");
  let item = plain(app.run("todayPlan()")).find(p => p.tab === "mock");
  assert.match(item.label, /完整閱讀測驗 第 1 回/);
  app.run(`S.mocks = [{ date: todayStr(-5), mode: "R1", lR: 0, lT: 0, rR: 70, rT: 100 }];`);
  assert.equal(app.run("nextForm()"), null);
  item = plain(app.run("todayPlan()")).find(p => p.tab === "mock");
  assert.match(item.label, /閱讀節/);
});
