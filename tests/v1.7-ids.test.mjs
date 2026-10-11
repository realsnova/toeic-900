// v1.7 題目固定編號（工作票 16 第 1 項，design/stable-ids.md，INV-13）
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadApp } from "./helpers/load-app.mjs";
import { currentIds, SNAPSHOT } from "../tools/content/snapshot-ids.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const p5 = q => ({ q, opts: ["a", "b", "c", "d"], ans: 0, cat: "詞性", exp: "測試用的詳解文字。" });

test("ID-1 每一題都有唯一的固定編號；內建題是 <類型>-<四位數>，自訂題是 c-<類型>-<雜湊>", () => {
  const app = loadApp({ storage: { toeic900_bank: JSON.stringify({ p5: [p5("Custom ______ one.")] }) } });
  for (const t of ["p5", "p6", "p7", "l2", "l34"]) {
    const ids = plain(app.run(`BANK_ARRAYS().${t}.map(it => it.id)`));
    assert.equal(new Set(ids).size, ids.length, `${t} 有重複編號`);
    const n = app.run(`BASE_N.${t}`);
    ids.slice(0, n).forEach((id, i) => assert.equal(id, `${t}-${String(i).padStart(4, "0")}`));
  }
  assert.match(app.run("PART5[PART5.length - 1].id"), /^c-p5-[0-9a-f]{8}$/);
});

test("ID-2 編號只含 Firebase 允許的字元", () => {
  const app = loadApp();
  const ids = plain(app.run(`["p5","p6","p7","l2","l34"].flatMap(t => BANK_ARRAYS()[t].map(it => it.id))`));
  ids.forEach(id => assert.match(id, /^[a-z0-9_-]+$/));
});

test("ID-3 轉換可以重複執行，結果相同；轉換前的原始紀錄留一份在本機", () => {
  const legacy = { wb: { p5: { 3: { n: 1, last: "2026-10-01" } }, p7: { "2-1": { n: 0, last: null } } },
    p5seen: { 4: true }, p7done: { 2: 3 }, mockSeen: { l2: { 1: true } }, baseN: null };
  const raw = JSON.stringify(legacy);
  const app = loadApp({ storage: { toeic900: raw } });
  assert.equal(app.store.get("toeic900_pre_v17_backup"), raw);
  const once = plain(app.run("S"));
  const twice = plain(app.run("migrateToIds(JSON.parse(JSON.stringify(S)))"));
  assert.deepEqual(twice, once);
  // 已經轉換過的紀錄再載入：不再轉換、不覆蓋備份
  app.run("save()");
  const again = loadApp({ storage: { toeic900: app.store.get("toeic900"), toeic900_pre_v17_backup: raw } });
  assert.deepEqual(plain(again.run("S.wb")), once.wb);
  assert.equal(again.store.get("toeic900_pre_v17_backup"), raw);
});

test("ID-4 自訂題的編號和位置無關：順序不同、前面多了內建題，編號都一樣", () => {
  const a = loadApp({ storage: { toeic900_bank: JSON.stringify({ p5: [p5("First ______."), p5("Second ______.")] }) } });
  const b = loadApp({ storage: { toeic900_bank: JSON.stringify({ p5: [p5("Second ______."), p5("First ______.")] }) } });
  const idA = a.run(`PART5.find(x => x.q === "Second ______.").id`);
  const idB = b.run(`PART5.find(x => x.q === "Second ______.").id`);
  assert.equal(idA, idB);
});

test("ID-5 匯入檔自帶的 id 一律被覆蓋，不能冒用內建題的編號", () => {
  const app = loadApp();
  const r = plain(app.run(`importBank("p5", JSON.stringify([Object.assign(${JSON.stringify(p5("Fake ______ item."))}, { id: "p5-0001" })]))`));
  assert.equal(r.added, 1, JSON.stringify(r));
  assert.equal(app.run(`PART5.filter(x => x.id === "p5-0001").length`), 1);
  assert.match(app.run("PART5[PART5.length - 1].id"), /^c-p5-/);
});

test("ID-6 練習寫入的紀錄都是固定編號；執行期仍用位置", () => {
  const app = loadApp();
  app.run(`wbMark("p5", 12, false); wbMark("p7", "3-2", false); setBest("p6", 4, 3); drawRound("p5seen", PART5.length, 5, [], null, null);`);
  const S = plain(app.run("S"));
  assert.ok(S.wb.p5["p5-0012"]);
  assert.ok(S.wb.p7["p7-0003_2"]);
  assert.equal(S.p6done["p6-0004"], 3);
  assert.equal(Object.keys(S.p5seen).length, 5);
  Object.keys(S.p5seen).forEach(k => assert.match(k, /^p5-\d{4}$/));
  assert.deepEqual(plain(app.run(`wbKeys("p7")`)), ["3-2"]);
  assert.equal(app.run(`bestOf("p6", 4)`), 3);
  // 答對兩次（跨天）後移除，仍然用執行期的鍵操作
  app.run(`S.wb.p5["p5-0012"] = { n: 1, last: "2000-01-01" }; wbMark("p5", "12", true);`);
  assert.equal(app.run(`S.wb.p5["p5-0012"]`), undefined);
});

test("ID-7 模考組卷的輪替紀錄也是固定編號", () => {
  const app = loadApp();
  const picked = plain(app.run(`Mock.draw("p5", PART5.length, 3)`));
  const keys = Object.keys(plain(app.run("S.mockSeen.p5")));
  assert.deepEqual(keys.sort(), picked.map(i => `p5-${String(i).padStart(4, "0")}`).sort());
});

test("ID-8 已發布的編號不重排、不改題意（INV-13）：清單裡的每個編號仍然指向同一題", () => {
  assert.ok(fs.existsSync(SNAPSHOT), "缺少 tests/fixtures/published-ids.json，執行 node tools/content/snapshot-ids.mjs");
  const published = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
  const cur = currentIds();
  const bad = Object.entries(published).filter(([id, h]) => cur[id] !== h).map(([id]) => id);
  assert.deepEqual(bad, [], "這些編號的題目被移動或改了題意：要修正題意請標 retired 再新增一題；只是錯字用 --fix");
  const missing = Object.keys(cur).filter(id => !(id in published));
  assert.deepEqual(missing, [], "有新題目還沒登記，執行 node tools/content/snapshot-ids.mjs");
});

test("ID-9 對不到題目的舊鍵收進 legacy，不會出現在錯題本，也不會讓頁面出錯", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ baseN: { p5: 390, p6: 22, p7: 65, l2: 150, l34: 69 }, wb: { p5: { 5000: { n: 0, last: null } } } }) } });
  assert.deepEqual(plain(app.run("S.wb.p5")), {});
  assert.deepEqual(plain(app.run("S.legacy.wb.p5")), { 5000: { n: 0, last: null } });
  app.run("renderers.wrong()");
});
