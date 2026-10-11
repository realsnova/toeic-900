// v1.4.0（S1 考前衝刺版）的單元測試：新題資料、Part 2 長度偏差、衝刺菜單、題目回報、內建題增加時的紀錄搬移
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
// 目前的內建題數（之後每次加題都會變，測試不寫死數字）
const { p5: N5, p7: N7 } = plain(loadApp().run("BASE_N"));
const CJK = /[一-鿿]/;

test("S1-content S1 新題結構正確：Part 5 新題 100 題、Part 7 新制題組 8 組，格式與解析規則都符合", () => {
  const app = loadApp();
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
  assert.ok(longest <= P2.length / 2, `正解最長 ${longest}/${P2.length}`);
  assert.ok(shortest <= P2.length / 2, `正解最短 ${shortest}/${P2.length}`);
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
  // v1.5.0：不排閱讀模考的日子，可能改排完整聽力測驗（也在模擬考分頁），所以只檢查閱讀模考
  assert.equal(plan.some(p => p.tab === "mock" && !/聽力測驗/.test(p.label)), false, "昨天才考過，今天不排");
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

test("S1-baseN 舊版紀錄升級時，自訂題的錯題本、輪替與最佳成績對到同一題（v1.7 起轉成固定編號）", () => {
  // v1.3 的紀錄：內建 Part 5 有 200 題、Part 7 有 12 組；索引 200、12 是使用者自己匯入的自訂題
  const legacy = {
    wb: { p5: { 5: { n: 1, last: "2026-10-01" }, 200: { n: 0, last: null } }, p7: { "3-1": { n: 0, last: null }, "12-0": { n: 0, last: null } },
      p6: { "2-1": { n: 0, last: null } }, l2: {}, l34: {} },
    p5seen: { 5: true, 200: true, 201: true }, p7done: { 3: 4, 12: 2 }, p6done: { 2: 3 },
    mockSeen: { p5: { 199: true, 200: true }, p7: { 12: true } }
  };
  const p5 = (q, cat = "詞性") => ({ q, opts: ["a", "b", "c", "d"], ans: 0, cat, exp: "測試用的詳解文字。" });
  const bank = { p5: [p5("Custom one ______ here."), p5("Custom two ______ here.")],
    p7: [{ title: "自訂題組", time: 60, passages: ["Text."], qs: [{ q: "Why?", opts: ["a", "b", "c", "d"], ans: 0, exp: "測試用的詳解文字。" }] }] };
  const app = loadApp({ storage: { toeic900: JSON.stringify(legacy), toeic900_bank: JSON.stringify(bank) } });
  const S = plain(app.run("S"));
  const c5 = k => app.run(`recId("p5", ${k})`), c7 = app.run(`PART7[${N7}].id`);
  assert.match(c5(N5), /^c-p5-[0-9a-f]{8}$/);
  assert.deepEqual(Object.keys(S.wb.p5).sort(), [c5(N5), "p5-0005"].sort());
  assert.deepEqual(Object.keys(S.wb.p7).sort(), [`${c7}_0`, "p7-0003_1"].sort());
  assert.deepEqual(S.wb.p6, { "p6-0002_1": { n: 0, last: null } }, "Part 6 內建題數沒變，不搬");
  assert.deepEqual(S.p5seen, { "p5-0005": true, [c5(N5)]: true, [c5(N5 + 1)]: true });
  assert.deepEqual(S.p7done, { "p7-0003": 4, [c7]: 2 });
  assert.deepEqual(S.mockSeen, { p5: { "p5-0199": true, [c5(N5)]: true }, p7: { [c7]: true } });
  assert.deepEqual(S.baseN, plain(app.run("BASE_N")));
  // 執行期仍然對得到同一題
  assert.deepEqual(plain(app.run(`wbKeys("p5")`)).sort(), [String(N5), "5"].sort());
  // 存檔後再載入一次，不會重複搬
  app.run("save()");
  const again = loadApp({ storage: { toeic900: app.store.get("toeic900"), toeic900_bank: JSON.stringify(bank) } });
  assert.deepEqual(Object.keys(plain(again.run("S.wb.p5"))).sort(), [c5(N5), "p5-0005"].sort());
});

test("S1-baseN 新使用者的紀錄帶有目前的內建題數；舊版裝置同步上來的紀錄也會搬移", async () => {
  const fresh = loadApp();
  assert.deepEqual(plain(fresh.run("S.baseN")), plain(fresh.run("BASE_N")));
  const app = loadApp();
  const remote = { records: { wb: { p5: { 200: { n: 0, last: null } } } }, updatedAt: 5 };
  app.run(`S.updatedAt = 0; Sync.ref = () => ({ get: async () => ({ val: () => (${JSON.stringify(remote)}) }) });`);
  assert.equal(await app.run("Sync.pullOnStartup(0)"), true);
  assert.deepEqual(Object.keys(plain(app.run("S.wb.p5"))), [String(N5)]);
  // 新版裝置的紀錄（有 baseN）不會再搬
  const app2 = loadApp();
  const remote2 = { records: { wb: { p5: { [N5]: { n: 0, last: null } } }, baseN: plain(app2.run("BASE_N")) }, updatedAt: 5 };
  app2.run(`S.updatedAt = 0; Sync.ref = () => ({ get: async () => ({ val: () => (${JSON.stringify(remote2)}) }) });`);
  await app2.run("Sync.pullOnStartup(0)");
  assert.deepEqual(Object.keys(plain(app2.run("S.wb.p5"))), [String(N5)]);
});

/* ---------- 獨立審查（review-s1）後補的案例 ---------- */
test("review-s1 P1 今天考完模考後，菜單仍保留模考項目並顯示已完成", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(10); S.mocks = [{ date: todayStr(), mode: "read", lR: 0, lT: 0, rR: 20, rT: 27 }]; daily().mockDone = 1; daily().readMock = 1;`);
  const item = plain(app.run("todayPlan()")).find(p => p.tab === "mock");
  assert.ok(item, "模考項目不可消失");
  assert.equal(item.done, true);
  assert.equal(item.detail, "今天已完成");
});

test("review-s1 P3 日期格式錯誤、未來日期、只考聽力節的模考，不影響閱讀模考的排程", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(10); S.mocks = [{ date: "2026-13-45", mode: "read" }, { date: todayStr(5), mode: "read" }, { date: todayStr(-1), mode: "listen" }];`);
  assert.equal(app.run("daysSinceMock()"), 999);
  assert.ok(plain(app.run("todayPlan()")).some(p => p.tab === "mock"));
});

test("review-s1 P2-1 baseN 缺某一類或值壞掉時，那一類不搬（避免重複搬移）；完全沒有 baseN 才當作舊版", () => {
  const partial = { baseN: { p5: N5, p6: 14, p7: "bad", l2: 60 }, wb: { p5: { [N5]: { n: 0, last: null } }, p7: { [`${N7}-0`]: { n: 0, last: null } } } };
  // 沒有自訂題庫：搬完的位置對不到題目，收進 S.legacy（v1.7），從 legacy 看搬移結果
  const app = loadApp({ storage: { toeic900: JSON.stringify(partial) } });
  assert.deepEqual(Object.keys(plain(app.run("S.legacy.wb.p5"))), [String(N5)]);
  assert.deepEqual(Object.keys(plain(app.run("S.legacy.wb.p7"))), [`${N7}-0`]);
  const nul = loadApp({ storage: { toeic900: JSON.stringify({ baseN: null, wb: { p5: { 200: { n: 0, last: null } } } }) } });
  assert.deepEqual(Object.keys(plain(nul.run("S.legacy.wb.p5"))), [String(N5)], "baseN 為 null 視為舊版紀錄");
});

test("review-s1 P2-2 雲端資料格式錯誤時不會讓載入失敗：錯誤欄位被收斂成安全的值，不會留下 baseN: null", async () => {
  const app = loadApp();
  app.run(`S.updatedAt = 0; S.wb.p5 = { 5: { n: 1, last: "2026-10-01" } }; Sync.ref = () => ({ get: async () => ({ val: () => ({ records: { wb: "x", mocks: "y" }, updatedAt: 5 }) }) });`);
  await app.run("Sync.pullOnStartup(0)");
  const S = plain(app.run("S"));
  assert.equal(typeof S.wb, "object");
  assert.notEqual(S.baseN, null, "不可留下 baseN: null");
  assert.ok(Array.isArray(S.mocks));
  const bad = loadApp({ storage: { toeic900: JSON.stringify({ exam: "2026-10-31", wb: "x" }) } });
  assert.equal(bad.run("S.exam"), "2026-10-31", "wb 壞掉不可讓整份紀錄被清空");
  assert.deepEqual(plain(bad.run("S.wb.p5")), {});
});

test("review-s1 P2-3 舊類別名「不定詞」的統計合併到「不定詞與動名詞」", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ cat: { "不定詞": { r: 3, w: 2 }, "不定詞與動名詞": { r: 1, w: 1 } } }) } });
  assert.deepEqual(plain(app.run("S.cat")), { "不定詞與動名詞": { r: 4, w: 3 } });
});

test("review-s1 phase 邊界：剩 3 天與 0 天是考前調整，剩 4 天是衝刺期；考後不學新字", () => {
  const app = loadApp();
  for (const [d, name] of [[3, "考前調整"], [0, "考前調整"], [4, "衝刺期"], [14, "衝刺期"], [15, "強化期"], [-1, "考試已過"]]) {
    app.run(`S.exam = todayStr(${d})`);
    assert.equal(app.run("phase().name"), name, `剩 ${d} 天`);
  }
  assert.equal(app.run("newPerDay()"), 0);
});

test("review-s1 P3 回報清單有壞資料時不拋錯；回報會記下是不是自訂題", () => {
  const bank = { p5: [{ q: "The report was ______ on time.", opts: ["submitted", "submit", "submitting", "submits"], ans: 0, cat: "詞性", exp: "被動語態要用過去分詞。" }] };
  const app = loadApp({ storage: { toeic900_reports: JSON.stringify([null, 5, { type: "p5", key: "1" }]), toeic900_bank: JSON.stringify(bank) } });
  // v1.7 起回報記的是固定編號：自訂題是 c-…，內建題是 p5-0003
  assert.equal(app.run(`addReport({ type: "p5", key: ${N5}, q: "q", opts: [], ans: 0, chosen: 0 }, "x")`), true);
  const r = plain(app.run("loadReports()")).find(x => x.key.startsWith("c-p5-"));
  assert.equal(r.custom, true);
  app.run(`addReport({ type: "p5", key: 3, q: "q", opts: [], ans: 0, chosen: 0 }, "y")`);
  assert.equal(plain(app.run("loadReports()")).find(x => x.key === "p5-0003").custom, false);
});
