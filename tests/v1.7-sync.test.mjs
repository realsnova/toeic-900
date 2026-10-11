// v1.7 雲端同步：端對端加密、三方合併、樂觀鎖、舊位置搬移、代碼升級、刪除雲端資料（工作票 17）
import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeDb, loadApp, readSource } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const CODE = "k2mnp-qr5st-ab3de-f7gh9";
const device = (db, storage = {}) => loadApp({ db, storage: Object.assign({ toeic900_synccode: CODE }, storage) });
const v2 = db => Object.keys(db.data).filter(k => k.startsWith("v2/"));

test("SYNC-1 雲端只存加密後的資料：位置看不出代碼，內容沒有任何明文", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; S.vocab.meticulous = { i: 3, e: 2.5, due: "2026-10-20", n: 2 }; wbMark("p5", 12, false); save();`);
  await a.run("Sync.syncNow()");
  const paths = v2(db);
  assert.equal(paths.length, 1);
  assert.match(paths[0], /^v2\/[0-9a-f]{32}$/);
  const node = db.data[paths[0]];
  assert.deepEqual(Object.keys(node).sort(), ["ct", "iv", "rev", "u", "v", "z"]);
  const raw = JSON.stringify(node);
  for (const s of ["meticulous", "2026-10-31", "p5-0012", "k2mnp", "records"]) assert.equal(raw.includes(s), false, `雲端出現明文：${s}`);
  assert.equal(Object.keys(db.data).some(k => k.includes("k2mnp")), false, "雲端位置不可含代碼");
});

test("SYNC-2 代碼不分大小寫、忽略連字號與空白；不同代碼對到不同位置", async () => {
  const app = loadApp();
  const id = c => app.run(`SyncCrypto.derive(${JSON.stringify(c)}).then(k => k.id)`);
  assert.equal(await id(CODE), await id(CODE.toUpperCase().replace(/-/g, " ")));
  assert.notEqual(await id(CODE), await id("k2mnp-qr5st-ab3de-f7gh8"));
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

test("SYNC-5 雲端資料被竄改：不套用、不覆蓋，提示可以重建", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  const p = v2(db)[0];
  const ct = db.data[p].ct;
  db.data[p].ct = (ct[0] === "A" ? "B" : "A") + ct.slice(1);
  const before = JSON.stringify(db.data[p]);
  const b = device(db);
  b.run(`S.exam = "2026-12-01"; save();`);
  assert.equal(await b.run("Sync.syncNow()"), false);
  assert.equal(b.run("Sync.lastError"), "decrypt");
  assert.equal(b.run("S.exam"), "2026-12-01");
  assert.equal(JSON.stringify(db.data[p]), before, "不可覆蓋雲端");
  // 使用者選擇重建
  assert.equal(await b.run("Sync.deleteCloud()"), true);
  b.run("Sync.lastError = null");
  await b.run("Sync.syncNow()");
  assert.equal(b.run("Sync.lastError"), null);
  const c = device(db);
  await c.run("Sync.syncNow()");
  assert.equal(c.run("S.exam"), "2026-12-01");
});

test("SYNC-6 同時寫入：版本號不符被拒時，重新讀取合併後再寫，兩邊的作答都保留", async () => {
  const db = fakeDb();
  const a = device(db), b = device(db);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  a.run(`S.racc.r += 2; save();`);
  b.run(`S.racc.r += 4; save();`);
  // a 讀到雲端之後、寫入之前，b 搶先寫入
  db.beforeSet = async () => { await b.run("Sync.syncNow()"); };
  await a.run("Sync.syncNow()");
  await b.run("Sync.syncNow()");
  assert.equal(a.run("S.racc.r"), 6);
  assert.equal(b.run("S.racc.r"), 6);
  assert.equal(a.run("Sync.lastError"), null);
});

test("SYNC-7 舊版明文位置：讀進來合併，成功寫入新位置後清空", async () => {
  const db = fakeDb();
  db.data["sync/" + CODE] = { records: { racc: { r: 7, w: 2 }, wb: { p5: { 3: { n: 0, last: null } } }, exam: "2026-10-31", updatedAt: 5 }, bank: {}, updatedAt: 5 };
  const a = device(db);
  a.run(`S.racc.r = 1; save();`);
  assert.equal(await a.run("Sync.syncNow()"), true);
  assert.equal(a.run("S.racc.r"), 7, "沒有共同的 base：計數取較大值，不會重複相加");
  assert.ok(a.run(`S.wb.p5["p5-0003"]`), "舊索引也轉成固定編號");
  assert.equal(db.data["sync/" + CODE], undefined, "舊位置已清空");
  assert.equal(v2(db).length, 1);
});

test("SYNC-8 升級代碼：資料搬到新位置；舊位置留下「已搬走」標記，用舊代碼的裝置停止同步並提示", async () => {
  const db = fakeDb();
  const old = "ab3de-f7gh9";
  const a = loadApp({ db, storage: { toeic900_synccode: old } });
  const b = loadApp({ db, storage: { toeic900_synccode: old } });
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  const code = await a.run("Sync.upgradeCode()");
  assert.match(code, /^[a-hjkmnp-z2-9]{5}(-[a-hjkmnp-z2-9]{5}){3}$/);
  assert.equal(a.run("Sync.code"), code);
  assert.equal(v2(db).length, 2);
  assert.equal(await b.run("Sync.syncNow()"), false);
  assert.equal(b.run("Sync.lastError"), "moved");
  assert.equal(JSON.stringify(db.data).includes(code.replace(/-/g, "")), false, "舊位置不可含新代碼");
  // 輸入新代碼後就接上
  b.run(`Sync.setCode(${JSON.stringify(code)})`);
  await b.run("Sync.syncNow()");
  assert.equal(b.run("S.exam"), "2026-10-31");
});

test("SYNC-9 刪除雲端資料：新位置與舊明文位置都清空，本機紀錄不受影響", async () => {
  const db = fakeDb();
  db.data["sync/" + CODE] = { records: { updatedAt: 1 }, updatedAt: 1 };
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  db.data["sync/" + CODE] = { records: { updatedAt: 1 }, updatedAt: 1 };
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

test("SYNC-11 規則檔：新位置只接受加密欄位並檢查版本號；舊位置過渡期保留", () => {
  const rules = JSON.parse(readSource("firebase/database.rules.json")).rules;
  assert.equal(rules[".read"], false);
  assert.equal(rules[".write"], false);
  const v = rules.v2.$id;
  assert.match(v[".read"], /\^\[0-9a-f\]\{32\}\$/);
  assert.match(v[".validate"], /rev/);
  assert.equal(v.$other[".validate"], false);
  assert.deepEqual(Object.keys(v).filter(k => !k.startsWith(".") && k !== "$other").sort(), ["ct", "iv", "rev", "u", "v", "z"]);
  assert.ok(rules.sync, "舊位置在過渡期內仍可讀寫，讓舊版裝置能搬過來");
});

test("SYNC-12 答錯時記下日期 w，同步合併才知道誰比較新；舊格式照常讀取", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ idV: 1, wb: { p5: { "p5-0004": { n: 1, last: "2026-10-01", w: "2026-09-30" }, "p5-0005": { n: 0, last: null, w: "bad" } } } }) } });
  assert.deepEqual(plain(app.run(`S.wb.p5["p5-0004"]`)), { n: 1, last: "2026-10-01", w: "2026-09-30" });
  assert.deepEqual(plain(app.run(`S.wb.p5["p5-0005"]`)), { n: 0, last: null });
  app.run(`wbMark("p5", 6, false)`);
  assert.equal(app.run(`S.wb.p5["p5-0006"].w`), app.run("todayStr()"));
});
