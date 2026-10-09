// v1.4.0（S1 考前衝刺版）的單元測試：新題資料、Part 2 長度偏差、衝刺菜單、題目回報、內建題增加時的紀錄搬移
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const CJK = /[一-鿿]/;

test("S1-content 新題結構正確：Part 5 共 300 題、Part 7 共 20 組，S1 題目格式與解析規則都符合", () => {
  const app = loadApp();
  assert.equal(app.run("BASE_N.p5"), 300);
  assert.equal(app.run("BASE_N.p7"), 20);
  const p5 = plain(app.run(`PART5.filter(q => q.src === "S1")`));
  assert.equal(p5.length, 100);
  const cats = new Set(plain(app.run("Object.keys(S.cat).concat(PART5.map(q => q.cat))")));
  for (const q of p5) {
    assert.equal(q.opts.length, 4, q.q);
    assert.equal(new Set(q.opts.map(o => o.toLowerCase())).size, 4, `重複選項：${q.q}`);
    assert.ok(q.q.includes("______"), q.q);
    assert.equal(CJK.test(q.q + q.opts.join("")), false, `英文欄位混入中文：${q.q}`);
    assert.equal(/\([A-D]\)/.test(q.exp), false, `解析引用字母：${q.q}`);
    assert.ok(q.exp.length > 10);
  }
  assert.ok(cats.has("不定詞與動名詞"));
  const p7 = plain(app.run(`PART7.filter(s => s.src === "S1")`));
  assert.equal(p7.length, 8);
  const qn = p7.map(s => s.qs.length);
  assert.ok(qn.filter(n => n === 5).length >= 4, "至少 4 組是 5 題的多篇題組");
  for (const s of p7) for (const q of s.qs) {
    assert.equal(q.opts.length, 4);
    assert.equal(/\([A-D]\)/.test(q.exp), false);
  }
  const insert = p7.flatMap(s => s.qs).filter(q => /positions marked \[1\]/.test(q.q));
  assert.ok(insert.length >= 2, "要有插入句子位置題");
  const intent = p7.flatMap(s => s.qs).filter(q => /mean when s?he writes|imply when s?he writes/.test(q.q));
  assert.ok(intent.length >= 2, "要有意圖題");
});

test("S1-P2 Part 2 不再能靠選項長度猜答案：正解是最長或最短的比例都不超過一半", () => {
  const app = loadApp();
  const P2 = plain(app.run("PART2"));
  let longest = 0, shortest = 0;
  for (const q of P2) {
    const L = q.opts.map(o => o.length), r = L[q.ans], s = [...L].sort((a, b) => a - b);
    if (r === s[2]) longest++;
    if (r === s[0]) shortest++;
    assert.equal(/\([A-C]\)/.test(q.exp), false);
  }
  assert.ok(longest <= 30, `正解最長 ${longest}/60`);
  assert.ok(shortest <= 30, `正解最短 ${shortest}/60`);
});

test("S1-phase 考前三天進入「考前調整」：不學新字、菜單減量；考試日期過了會提示更新", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(2)`);
  assert.equal(app.run("phase().name"), "考前調整");
  assert.equal(app.run("newPerDay()"), 0);
  const plan = plain(app.run("todayPlan()"));
  assert.equal(plan.length, 4);
  assert.ok(plan.some(p => /不學新字/.test(p.label)));
  app.run(`S.exam = todayStr(-1)`);
  assert.equal(app.run("phase().name"), "考試已過");
  assert.match(app.run("phaseTips()"), /設定下一次的考試/);
  app.run(`S.exam = todayStr(10)`);
  assert.equal(app.run("phase().name"), "衝刺期");
  assert.ok(app.run("newPerDay()") >= 1);
});

test("S1-phase 衝刺期每 3 天排一次閱讀節模考，其他天練 Part 7 限時題", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(10); S.mocks = [];`);
  assert.ok(plain(app.run("todayPlan()")).some(p => p.tab === "mock"), "沒考過模考時要排");
  app.run(`S.mocks = [{ date: todayStr(-1), mode: "read", lR: 0, lT: 0, rR: 20, rT: 27 }];`);
  const plan = plain(app.run("todayPlan()"));
  assert.equal(plan.some(p => p.tab === "mock"), false, "昨天才考過，今天不排");
  assert.ok(plan.some(p => p.tab === "p7"));
  app.run(`S.mocks = [{ date: todayStr(-3), mode: "read", lR: 0, lT: 0, rR: 20, rT: 27 }];`);
  assert.ok(plain(app.run("todayPlan()")).some(p => p.tab === "mock"), "滿 3 天要排");
});

test("S1-report 題目回報存在本機（不進 S）、同一題只留最新一筆、最多 200 筆", () => {
  const app = loadApp();
  app.run(`addReport({ type: "p5", key: 3, q: "q", opts: ["a", "b"], ans: 0, chosen: 1 }, "舊");
           addReport({ type: "p5", key: "3", q: "q", opts: ["a", "b"], ans: 0, chosen: 1 }, "新");`);
  const r = plain(app.run("loadReports()"));
  assert.equal(r.length, 1);
  assert.equal(r[0].note, "新");
  assert.equal(r[0].v, app.run("APP_VERSION"));
  app.run(`for (let i = 0; i < 205; i++) addReport({ type: "p7", key: "0-" + i, q: "q", opts: [], ans: 0, chosen: 0 }, "")`);
  assert.equal(app.run("loadReports().length"), 200);
  app.run("save()");
  assert.equal(app.store.get("toeic900").includes("note"), false, "回報不放進學習紀錄");
});

test("S1-baseN 舊版紀錄升級時，自訂題的錯題本、輪替與最佳成績跟著搬到新的索引", () => {
  // v1.3 的紀錄：內建 Part 5 有 200 題、Part 7 有 12 組；索引 200、12 是使用者自己匯入的自訂題
  const legacy = {
    wb: { p5: { 5: { n: 1, last: "2026-10-01" }, 200: { n: 0, last: null } }, p7: { "3-1": { n: 0, last: null }, "12-0": { n: 0, last: null } },
      p6: { "2-1": { n: 0, last: null } }, l2: {}, l34: {} },
    p5seen: { 5: true, 200: true, 201: true }, p7done: { 3: 4, 12: 2 }, p6done: { 2: 3 },
    mockSeen: { p5: { 199: true, 200: true }, p7: { 12: true } }
  };
  const app = loadApp({ storage: { toeic900: JSON.stringify(legacy) } });
  const S = plain(app.run("S"));
  assert.deepEqual(Object.keys(S.wb.p5).sort(), ["300", "5"]);
  assert.deepEqual(Object.keys(S.wb.p7).sort(), ["20-0", "3-1"]);
  assert.deepEqual(S.wb.p6, { "2-1": { n: 0, last: null } }, "Part 6 內建題數沒變，不搬");
  assert.deepEqual(S.p5seen, { 5: true, 300: true, 301: true });
  assert.deepEqual(S.p7done, { 3: 4, 20: 2 });
  assert.deepEqual(S.mockSeen, { p5: { 199: true, 300: true }, p7: { 20: true } });
  assert.deepEqual(S.baseN, plain(app.run("BASE_N")));
  // 存檔後再載入一次，不會重複搬
  app.run("save()");
  const again = loadApp({ storage: { toeic900: app.store.get("toeic900") } });
  assert.deepEqual(Object.keys(plain(again.run("S.wb.p5"))).sort(), ["300", "5"]);
});

test("S1-baseN 新使用者的紀錄帶有目前的內建題數；舊版裝置同步上來的紀錄也會搬移", async () => {
  const fresh = loadApp();
  assert.deepEqual(plain(fresh.run("S.baseN")), plain(fresh.run("BASE_N")));
  const app = loadApp();
  const remote = { records: { wb: { p5: { 200: { n: 0, last: null } } } }, updatedAt: 5 };
  app.run(`S.updatedAt = 0; Sync.ref = () => ({ get: async () => ({ val: () => (${JSON.stringify(remote)}) }) });`);
  assert.equal(await app.run("Sync.pullOnStartup(0)"), true);
  assert.deepEqual(Object.keys(plain(app.run("S.wb.p5"))), ["300"]);
  // 新版裝置的紀錄（有 baseN）不會再搬
  const app2 = loadApp();
  const remote2 = { records: { wb: { p5: { 300: { n: 0, last: null } } }, baseN: plain(app2.run("BASE_N")) }, updatedAt: 5 };
  app2.run(`S.updatedAt = 0; Sync.ref = () => ({ get: async () => ({ val: () => (${JSON.stringify(remote2)}) }) });`);
  await app2.run("Sync.pullOnStartup(0)");
  assert.deepEqual(Object.keys(plain(app2.run("S.wb.p5"))), ["300"]);
});
