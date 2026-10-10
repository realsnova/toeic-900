// v1.4.1 程式審查（dfe94b4..60226db）找到的問題：回歸測試
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const captureReport = `globalThis.__html = "";
  Mock.box = () => ({ set innerHTML(v) { __html = v; }, get innerHTML() { return __html; }, querySelector: () => ({ insertAdjacentHTML() {}, addEventListener() {}, classList: { add() {} } }), querySelectorAll: () => [] });`;

test("review-v141 P2-1 完整測驗完全沒作答（例如時間到自動交卷）：不記錄、不進錯題本、不影響答對率，這一回仍算沒做過", () => {
  const app = loadApp();
  app.run(`${captureReport} Mock.start("R1"); Mock.submit();`);
  assert.equal(app.run("(S.mocks || []).length"), 0);
  assert.equal(app.run("Object.keys(S.wb.p5).length + Object.keys(S.wb.p6).length + Object.keys(S.wb.p7).length"), 0);
  assert.deepEqual(plain(app.run("S.racc")), { r: 0, w: 0 });
  assert.equal(app.run("Object.keys(S.cat).length"), 0);
  assert.equal(app.run("nextForm().id"), "R1");
  assert.match(app.run("__html"), /這次沒有作答/);
});

test("review-v141 P2-1 部分作答：答錯的進錯題本、沒作答的不進；報告說明沒作答的題數", () => {
  const app = loadApp();
  app.run(`${captureReport} Mock.start("R1");
    const it0 = Mock.s.paper.reading[0]; Mock.s.rAnswers[0] = (it0.q.ans + 1) % 4;  // 第 1 題答錯
    const it1 = Mock.s.paper.reading[1]; Mock.s.rAnswers[1] = it1.q.ans;            // 第 2 題答對
    Mock.submit();`);
  const last = plain(app.run("S.mocks[S.mocks.length - 1]"));
  assert.equal(last.rT, 100);
  assert.equal(last.rR, 1);
  assert.equal(app.run("Object.keys(S.wb.p5).length"), 1, "只有答錯的那題進錯題本");
  assert.deepEqual(plain(app.run("S.racc")), { r: 1, w: 1 });
  assert.match(app.run("__html"), /閱讀有 98 題沒有作答/);
});

test("review-v141 P2-1 一般 Part 5 練習不會從錯題本帶出完整測驗的題目", () => {
  const app = loadApp();
  app.run(`PART5.forEach((q, i) => { if (q.form) S.wb.p5[i] = { n: 0, last: null }; }); startP5();`);
  const ids = plain(app.run("p5session.ids"));
  assert.equal(ids.length, 10);
  assert.equal(ids.some(i => app.run(`isFormItem("p5", ${i})`)), false);
});

test("review-v141 P2-2 計時以截止時間為準；作答進度存在本機，可以接著做，交卷或放棄時刪除", () => {
  const app = loadApp();
  app.run(`Mock.start("R1")`);
  const left = app.run("Mock.s.deadline - Date.now()");
  assert.ok(left > 74 * 60 * 1000 && left <= 75 * 60 * 1000);
  assert.equal(app.run("Mock.timeLeft({ deadline: Date.now() + 5000 })"), 5);
  assert.equal(app.run("Mock.timeLeft({ deadline: Date.now() - 5000 })"), 0);
  app.run(`Mock.s.rAnswers[2] = 1; Mock.s.flags.add(5); Mock.saveProgress();`);
  const prog = JSON.parse(app.store.get("toeic900_form_progress"));
  assert.equal(prog.mode, "R1");
  assert.equal(prog.answers[2], 1);
  assert.deepEqual(prog.flags, [5]);
  // 模擬重新整理：session 消失，再用暫存進度繼續
  app.run(`Mock.s = null; Mock.start("R1", Mock.loadProgress());`);
  assert.equal(app.run("Mock.s.rAnswers[2]"), 1);
  assert.equal(app.run("Mock.s.flags.has(5)"), true);
  assert.equal(app.run("Mock.s.deadline"), prog.deadline, "時間不會重設");
  app.run("Mock.abandon()");
  assert.equal(app.store.has("toeic900_form_progress"), false);
});

test("review-v141 P3 連點兩次開始：第二次被忽略，不會留下第二個 session 與計時器", () => {
  const app = loadApp();
  app.run(`Mock.start("R1"); globalThis.__s1 = Mock.s; Mock.start("R2");`);
  assert.equal(app.run("Mock.s === __s1"), true);
  assert.equal(app.run("Mock.s.mode"), "R1");
  app.run("Mock.abandon()");
});

test("review-v141 P3 只考聽力節不算今天的閱讀模考", () => {
  const app = loadApp();
  app.run(`${captureReport} S.exam = todayStr(10); Mock.start("listen"); Mock.s.lAnswers[0] = 0; Mock.submit();`);
  assert.equal(app.run("daily().mockDone"), 1);
  assert.equal(app.run("daily().readMock"), 0);
  const item = plain(app.run("todayPlan()")).find(p => p.tab === "mock");
  assert.ok(item && item.done === false, "閱讀模考項目仍是未完成");
});

test("review-v141 P3 原地替換的題目：舊錯題本紀錄只清一次；新紀錄不受影響", () => {
  const legacy = loadApp({ storage: { toeic900: JSON.stringify({ wb: { p5: { 106: { n: 0, last: null }, 5: { n: 0, last: null } } } }) } });
  assert.deepEqual(Object.keys(plain(legacy.run("S.wb.p5"))), ["5"]);
  assert.equal(legacy.run("S.contentV"), 2);
  const fresh = loadApp({ storage: { toeic900: JSON.stringify({ contentV: 2, wb: { p5: { 106: { n: 0, last: null } } } }) } });
  assert.deepEqual(Object.keys(plain(fresh.run("S.wb.p5"))), ["106"], "已經是新版內容的紀錄不再清");
});

test("review-v141 P3 自訂題庫的題目不能帶完整測驗標記；模考模式必須是字串", () => {
  const bank = { p5: [{ q: "A ___ b.", opts: ["a", "b", "c", "d"], ans: 0, cat: "詞性", exp: "x", form: "R1" }] };
  const app = loadApp({ storage: { toeic900_bank: JSON.stringify(bank),
    toeic900: JSON.stringify({ mocks: [{ date: "2026-10-01", mode: ["R1"], lR: 0, lT: 0, rR: 1, rT: 2 }] }) } });
  assert.equal(app.run(`Mock.buildPaper("R1").reading.length`), 100);
  assert.equal(app.run("PART5[PART5.length - 1].form"), undefined);
  assert.equal(app.run("'mode' in S.mocks[0]"), false);
});
