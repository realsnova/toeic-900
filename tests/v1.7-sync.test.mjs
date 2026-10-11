// v1.7 雲端同步：三方合併、交易寫入、刪除雲端資料（工作票 17）。
// 端對端加密 2026-10-11 先擱置（使用者只有自己使用），雲端位置與格式維持和 v1.6 相同。
import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeDb, loadApp, readSource } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const CODE = "k2mnp-qr5st-ab3de-f7gh9";
const device = (db, storage = {}) => loadApp({ db, storage: Object.assign({ toeic900_synccode: CODE }, storage) });

test("SYNC-1 雲端位置與格式和 v1.6 相同（sync/<代碼>，records／bank／updatedAt），符合現行資料庫規則", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; wbMark("p5", 12, false); save();`);
  await a.run("Sync.syncNow()");
  assert.deepEqual(Object.keys(db.data), ["sync/" + CODE]);
  const node = db.data["sync/" + CODE];
  assert.deepEqual(Object.keys(node).sort(), ["bank", "records", "updatedAt"]);
  assert.equal(node.records.exam, "2026-10-31");
  assert.ok(node.records.wb.p5["p5-0012"]);
  assert.equal(a.run("Sync.lastError"), null);
});

test("SYNC-2 新產生的代碼 20 個字元；少於 10 個英數字的代碼會提醒", () => {
  const app = loadApp();
  const code = app.run("Sync.genCode()");
  assert.match(code, /^[a-hjkmnp-z2-9]{5}(-[a-hjkmnp-z2-9]{5}){3}$/);
  assert.equal(app.run(`Sync.weakCode("ab3de-f7gh")`), true);
  assert.equal(app.run(`Sync.weakCode("ab3de-f7gh9")`), false);
});

test("SYNC-3 兩台裝置在同步之間都有作答：兩邊的作答都保留，計數相加不重複", async () => {
  const db = fakeDb();
  const a = device(db), b = device(db);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  a.run(`S.racc.r += 3; S.racc.w += 1; wbMark("p5", 1, false); S.vocab.alpha = { i: 1, e: 2.5, due: "2026-10-12", n: 1 }; save();`);
  b.run(`S.racc.r += 5; wbMark("p7", "2-0", false); S.vocab.beta = { i: 1, e: 2.5, due: "2026-10-12", n: 1 }; save();`);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()"); await a.run("Sync.syncNow()");
  for (const dev of [a, b]) {
    const S = plain(dev.run("S"));
    assert.deepEqual(S.racc, { r: 8, w: 1 });
    assert.ok(S.wb.p5["p5-0001"] && S.wb.p7["p7-0002_0"]);
    assert.ok(S.vocab.alpha && S.vocab.beta);
  }
  // 再同步一次不會重複計算
  await b.run("Sync.syncNow()"); await a.run("Sync.syncNow()");
  assert.deepEqual(plain(a.run("S.racc")), { r: 8, w: 1 });
});

test("SYNC-4 一台裝置移除的錯題，另一台同步後也移除（不會被帶回來）", async () => {
  const db = fakeDb();
  const a = device(db), b = device(db);
  a.run(`wbMark("p5", 9, false); save();`);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  assert.ok(b.run(`S.wb.p5["p5-0009"]`));
  a.run(`delete S.wb.p5["p5-0009"]; save();`);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  assert.equal(b.run(`S.wb.p5["p5-0009"]`), undefined);
});

test("SYNC-5 雲端資料格式不對：先檢查再合併，壞欄位不會進到本機", async () => {
  const db = fakeDb();
  db.data["sync/" + CODE] = { records: { racc: { r: "<img src=x onerror=alert(1)>", w: -5 }, exam: "<script>", wb: { p5: { 3: "bad" } }, updatedAt: 5 }, bank: { p5: [{ q: 1 }] }, updatedAt: 5 };
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  const S = plain(a.run("S"));
  assert.ok(Number.isInteger(S.racc.r) && S.racc.w >= 0);
  assert.equal(S.exam, "2026-10-31");
  assert.equal(JSON.stringify(S).includes("<script>") || JSON.stringify(S).includes("onerror"), false);
  assert.equal(a.run("Sync.lastError"), null);
});

test("SYNC-6 同時寫入：另一台裝置在讀與寫之間搶先寫入時，用新值重新合併，兩邊的作答都保留", async () => {
  const db = fakeDb();
  const a = device(db), b = device(db);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  a.run(`S.racc.r += 2; save();`);
  b.run(`S.racc.r += 4; save();`);
  // a 合併完、寫入之前，b 搶先寫入
  db.beforeSet = async () => { await b.run("Sync.syncNow()"); };
  const runs = db.txRuns;
  await a.run("Sync.syncNow()");
  assert.ok(db.txRuns - runs >= 3, "a 的交易應該重跑");
  await b.run("Sync.syncNow()");
  assert.equal(a.run("S.racc.r"), 6);
  assert.equal(b.run("S.racc.r"), 6);
  assert.equal(a.run("Sync.lastError"), null);
});

test("SYNC-7 v1.6 以前的裝置推上來的紀錄（索引、沒有 baseN）：轉成固定編號後合併", async () => {
  const db = fakeDb();
  db.data["sync/" + CODE] = { records: { racc: { r: 7, w: 2 }, wb: { p5: { 3: { n: 0, last: null } } }, exam: "2026-10-31", updatedAt: 5 }, bank: {}, updatedAt: 5 };
  const a = device(db);
  a.run(`S.racc.r = 1; save();`);
  assert.equal(await a.run("Sync.syncNow()"), true);
  assert.equal(a.run("S.racc.r"), 7, "沒有共同的 base：計數取較大值，不會重複相加");
  assert.ok(a.run(`S.wb.p5["p5-0003"]`), "舊索引也轉成固定編號");
  assert.ok(db.data["sync/" + CODE].records.wb.p5["p5-0003"]);
});

test("SYNC-8 雲端已經是最新時不寫入", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  await a.run("Sync.syncNow()"); // 開機流程會在記憶體補上 onboarded（不存檔），第二次同步把它送上去
  const n = db.writes.length;
  await a.run("Sync.syncNow()");
  assert.equal(db.writes.length, n);
});

test("SYNC-9 刪除雲端資料：雲端清空，本機紀錄不受影響", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  assert.equal(await a.run("Sync.deleteCloud()"), true);
  assert.deepEqual(Object.keys(db.data), []);
  assert.equal(a.run("S.exam"), "2026-10-31");
});

test("SYNC-10 合併規則：錯題兩邊都改過時保留較晚作答的；計數用 remote＋(local－base)", () => {
  const app = loadApp();
  const r = plain(app.run(`Merge.records(
    { racc: { r: 10, w: 2 }, wb: { p5: { "p5-0001": { n: 1, last: "2026-10-01" } } }, daily: { "2026-10-11": { p5: 5 } } },
    { racc: { r: 13, w: 2 }, wb: { p5: { "p5-0001": { n: 0, last: null, w: "2026-10-05" } } }, daily: { "2026-10-11": { p5: 8 } } },
    { racc: { r: 11, w: 4 }, wb: { p5: { "p5-0001": { n: 2, last: "2026-10-03" } } }, daily: { "2026-10-11": { p5: 6, l2: 3 } } })`));
  assert.deepEqual(r.racc, { r: 14, w: 4 });
  assert.deepEqual(r.daily["2026-10-11"], { p5: 9, l2: 3 });
  assert.deepEqual(r.wb.p5["p5-0001"], { n: 0, last: null, w: "2026-10-05" }, "10/05 答錯比 10/03 答對晚");
});

test("SYNC-11 規則檔維持現行版本：只有 sync/<代碼>，上線不用改 Firebase 主控台", () => {
  const rules = JSON.parse(readSource("firebase/database.rules.json")).rules;
  assert.equal(rules[".read"], false);
  assert.equal(rules[".write"], false);
  assert.deepEqual(Object.keys(rules).filter(k => !k.startsWith(".")), ["sync"]);
  assert.equal(rules.sync.$code.$other[".validate"], false);
});

test("SYNC-12 答錯時記下日期 w，同步合併才知道誰比較新；舊格式照常讀取", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ idV: 1, wb: { p5: { "p5-0004": { n: 1, last: "2026-10-01", w: "2026-09-30" }, "p5-0005": { n: 0, last: null, w: "bad" } } } }) } });
  assert.deepEqual(plain(app.run(`S.wb.p5["p5-0004"]`)), { n: 1, last: "2026-10-01", w: "2026-09-30" });
  assert.deepEqual(plain(app.run(`S.wb.p5["p5-0005"]`)), { n: 0, last: null });
  app.run(`wbMark("p5", 6, false)`);
  assert.equal(app.run(`S.wb.p5["p5-0006"].w`), app.run("todayStr()"));
});

test("SEC-ERRLOG 錯誤紀錄只在本機、最多 200 筆，遮掉金鑰與同步代碼", () => {
  const app = loadApp({ storage: { toeic900_synccode: CODE } });
  app.run(`for (let i = 0; i < 205; i++) ErrLog.add("error", new Error("boom " + i));`);
  app.run(`ErrLog.add("error", new Error("bad key sk-ant-api03-SECRET123 and code ${CODE}"))`);
  const list = plain(app.run("ErrLog.list()"));
  assert.equal(list.length, 200);
  const last = JSON.stringify(list[list.length - 1]);
  assert.equal(last.includes("SECRET123"), false);
  assert.equal(last.includes(CODE), false);
  assert.equal(JSON.stringify(plain(app.run("S"))).includes("boom"), false, "不進學習紀錄（不會同步）");
  app.run("renderers.settings()");
});

test("SEC-PRIVACY 隱私說明寫明資料去向，且和程式行為一致（沒有加密就不能說有）", () => {
  const app = loadApp();
  const html = app.run("privacyHTML()");
  for (const s of ["沒有加密", "Firebase", "Anthropic", "不使用廣告", "刪除雲端資料", "not endorsed or approved by ETS"]) assert.ok(html.includes(s), s);
  assert.equal(/雲端只看得到亂碼|用同步代碼加密/.test(html + readSource("js/app.js")), false);
  // 說「不使用 Cookie／分析工具」：頁面不可載入其他第三方腳本
  const scripts = readSource("index.html").match(/<script[^>]+src="https?:\/\/[^"]+"/g) || [];
  scripts.forEach(s => assert.match(s, /www\.gstatic\.com\/firebasejs\//));
  assert.equal(/document\.cookie/.test(readSource("js/app.js") + readSource("js/sync.js") + readSource("js/views.js")), false);
});
