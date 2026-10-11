// v1.7.0 獨立審查（2026-10-11）找到的問題：升級期間舊版裝置的整份覆蓋、同步中作答、模考輪替等
import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeDb, loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const CODE = "k2mnp-qr5st-ab3de-f7gh9";
const device = (db, storage = {}) => loadApp({ db, storage: Object.assign({ toeic900_synccode: CODE }, storage) });
const P = "sync/" + CODE;

// Firebase 的存法：去掉 null 與空物件、陣列可能變成以序號為鍵的物件、鍵排序
function firebaseNormalize(v) {
  if (v === null || v === undefined) return undefined;
  if (typeof v !== "object") return v;
  const out = {};
  Object.keys(v).sort().forEach(k => { const c = firebaseNormalize(v[k]); if (c !== undefined) out[k] = c; });
  if (!Object.keys(out).length) return undefined;
  const keys = Object.keys(out);
  if (keys.every((k, i) => k === String(i))) return keys.map(k => out[k]); // 連續序號 → 陣列
  return out;
}

test("REV-B1 舊版裝置整份覆蓋雲端：不會刪掉新版裝置自己的新作答、單字卡與每日題數", async () => {
  const db = fakeDb();
  const b = device(db);
  await b.run("Sync.syncNow()");
  const aState = plain(db.data[P].records); // 舊版裝置 A 此時拉到的紀錄
  b.run(`wbMark("p5", 5, false); S.vocab.alpha = { i: 1, e: 2.5, due: "2026-10-12", n: 1 }; daily().p5 += 10; save();`);
  await b.run("Sync.syncNow()");
  // A（v1.6）作答一題後存檔：用索引寫錯題本，整份覆蓋
  aState.wb = aState.wb || {}; aState.wb.p5 = Object.assign({}, aState.wb.p5, { 37: { n: 0, last: null } });
  aState.updatedAt = Date.now() + 5;
  db.data[P] = { records: aState, bank: {}, updatedAt: aState.updatedAt };
  await b.run("Sync.syncNow()");
  const S = plain(b.run("S"));
  assert.ok(S.wb.p5["p5-0005"], "B 的錯題不可被刪");
  assert.ok(S.vocab.alpha, "B 的單字卡不可被刪");
  assert.equal(b.run("daily().p5"), 10, "B 的每日題數不可歸零");
  // REV-B2：A 用索引寫的錯題也轉成編號，錯題本看得到
  assert.ok(S.wb.p5["p5-0037"], "A 的新錯題轉成固定編號");
  assert.equal(S.wb.p5["37"], undefined);
  assert.ok(plain(b.run(`wbKeys("p5")`)).includes("37"));
  // 寫回雲端時帶簽章；雲端的更新時間是現在，舊版裝置下次開啟會拉取
  assert.equal(b.run(`Sync.signed(${JSON.stringify(db.data[P])})`), true);
});

test("REV-B2 紀錄已是新格式（idV 1）但混有舊版寫入的索引鍵：轉成編號，同一題兩種鍵都有時取較晚的", () => {
  const rec = { idV: 1, wb: { p5: { "p5-0004": { n: 1, last: "2026-10-01" }, 4: { n: 0, last: null, w: "2026-10-05" }, 8: { n: 0, last: null } }, p7: { "3-1": { n: 0, last: null } } },
    p6done: { "p6-0002": 2, 2: 3 }, p5seen: { 12: true, "p5-0001": true } };
  const app = loadApp({ storage: { toeic900: JSON.stringify(rec) } });
  const S = plain(app.run("S"));
  assert.deepEqual(Object.keys(S.wb.p5).sort(), ["p5-0004", "p5-0008"]);
  assert.deepEqual(S.wb.p5["p5-0004"], { n: 0, last: null, w: "2026-10-05" }, "10/05 答錯比 10/01 答對晚");
  assert.deepEqual(Object.keys(S.wb.p7), ["p7-0003_1"]);
  assert.equal(S.p6done["p6-0002"], 3, "最佳成績取較高的");
  assert.deepEqual(Object.keys(S.p5seen).sort(), ["p5-0001", "p5-0012"]);
});

test("REV-B3 同步進行中作答：新作答不會被同步結果蓋掉，接著再同步一次送上雲端", async () => {
  const db = fakeDb();
  const a = device(db), b = device(db);
  await a.run("Sync.syncNow()"); await b.run("Sync.syncNow()");
  a.run(`wbMark("p5", 2, false); save();`);
  await a.run("Sync.syncNow()");
  // B 的同步讀到 A 的新資料、還沒寫入時，使用者在 B 答了一題
  db.beforeSet = async () => { b.run(`wbMark("p5", 9, false); daily().p5 += 1; save();`); };
  await b.run("Sync.syncNow()");
  assert.ok(b.run(`S.wb.p5["p5-0009"]`), "同步中的作答還在");
  assert.ok(b.run(`S.wb.p5["p5-0002"]`), "A 的作答也合併進來");
  assert.equal(b.run("daily().p5"), 1);
  assert.ok(db.data[P].records.wb.p5["p5-0009"], "再同步一次送上雲端");
  assert.equal(JSON.parse(b.run(`localStorage.getItem(STORE_KEY)`)).wb.p5["p5-0009"] !== undefined, true);
});

test("REV-sig 簽章不受 Firebase 存法影響（鍵順序、空物件、陣列）；內容改了就對不上", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`wbMark("p5", 3, false); S.mocks.push({ date: "2026-10-10", lR: 20, lT: 25 }); save();`);
  await a.run("Sync.syncNow()");
  const node = db.data[P];
  const viaFirebase = firebaseNormalize(node);
  assert.equal(a.run(`Sync.signed(${JSON.stringify(viaFirebase)})`), true);
  viaFirebase.records.racc.r += 1;
  assert.equal(a.run(`Sync.signed(${JSON.stringify(viaFirebase)})`), false);
  assert.equal(a.run(`Sync.signed({ records: { racc: { r: 1 } } })`), false, "沒有簽章（舊版）");
  assert.equal(a.run("S.wv"), undefined, "簽章不進本機紀錄");
});

test("REV-S2 合併時出錯：記錄錯誤、不套用、同步不會卡住", async () => {
  const db = fakeDb();
  const a = device(db);
  a.run(`S.exam = "2026-10-31"; save();`);
  await a.run("Sync.syncNow()");
  a.run(`Sync._clean = Sync.clean; Sync.clean = () => { throw new Error("boom"); };`);
  assert.equal(await a.run("Sync.syncNow()"), false);
  assert.equal(a.run("Sync.lastError"), "read");
  assert.equal(a.run("Sync.running"), null);
  a.run("Sync.clean = Sync._clean");
  await a.run("Sync.syncNow()");
  assert.equal(a.run("Sync.lastError"), null);
});

test("REV-S1 模考抽題：題組類記題組編號，下次不再抽到", () => {
  const app = loadApp();
  const picked = plain(app.run(`Mock.draw("p7", PART7.length, 3)`));
  const seen = Object.keys(plain(app.run("S.mockSeen.p7")));
  assert.equal(seen.length, 3);
  seen.forEach(id => assert.match(id, /^p7-\d{4}$/));
  const again = plain(app.run(`Mock.draw("p7", PART7.length, 3)`));
  assert.equal(again.filter(i => picked.includes(i)).length, 0);
});

test("REV-M1 自訂題庫有格式不對的題目：轉換時跳過它，錯題對到正確的自訂題", () => {
  const good = { q: "A valid custom ______ item.", opts: ["a", "b", "c", "d"], ans: 0, cat: "詞彙", exp: "有效的自訂題" };
  const app0 = loadApp();
  const N = app0.run("BASE_N.p5");
  const rec = { baseN: plain(app0.run("BASE_N")), wb: { p5: { [N]: { n: 0, last: "2026-10-09" } } } };
  const app = loadApp({ storage: { toeic900: JSON.stringify(rec), toeic900_bank: JSON.stringify({ p5: [{ q: 123 }, good] }) } });
  const id = app.run(`PART5[BASE_N.p5].id`);
  assert.deepEqual(Object.keys(plain(app.run("S.wb.p5"))), [id]);
  assert.ok(plain(app.run(`wbKeys("p5")`)).includes(String(N)));
});

test("REV-M3 內容相同的兩筆模考紀錄合併時不會變成一筆", () => {
  const app = loadApp();
  const m = { date: "2026-10-01", lR: 20, lT: 25, rR: 30, rT: 40 };
  const r = plain(app.run(`Merge.records(null, { mocks: [${JSON.stringify(m)}, ${JSON.stringify(m)}] }, { mocks: [${JSON.stringify(m)}] })`));
  assert.equal(r.mocks.length, 2);
});
