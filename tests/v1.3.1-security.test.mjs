// 2026-10-07 資安審查（.scratch/toeic-v1-improve/security-review-v1.3.1.md）修正的回歸測試
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp, readSource } from "./helpers/load-app.mjs";

const X = '<img src=x onerror="alert(1)">';
const plain = v => JSON.parse(JSON.stringify(v));
// 惡意的學習紀錄：每個會寫進畫面的欄位都塞 XSS 字串
const EVIL = {
  exam: X, updatedAt: X, lastBackup: X, targetScore: X, onboarded: X,
  racc: { r: X, w: X },
  cat: { "詞性": { r: X, w: X } },
  lcat: { "Part 2": { r: X, w: 1 } },
  daily: { "2026-10-01": { p5: X, l2: 3, wr: X }, [X]: { p5: 1 } },
  vocab: { abandon: { i: X, e: X, due: X, n: X } },
  wb: { p5: { 3: { n: X, last: X } }, p6: X },
  p6done: { 0: X }, p7done: [X, 2], l34done: { 1: X },
  p5seen: { 1: true, 2: X }, l2seen: X, mockSeen: { p5: { 1: true, 2: X } },
  mocks: [{ date: X, mode: X, lR: X, lT: 4, rR: 3, rT: 5, parts: { "Part 2": { r: X, t: 2 }, [X]: { r: 1, t: 1 } }, secs: X }, X]
};

test("sec-H1-1 load() 把惡意紀錄的每個欄位都收斂成安全的型別", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify(EVIL) } });
  const S = plain(app.run("S"));
  const json = JSON.stringify(S);
  assert.equal(S.exam, null);
  assert.equal(S.updatedAt, 0);
  assert.equal("lastBackup" in S, false);
  assert.equal(S.targetScore, null);
  assert.equal(typeof S.onboarded, "boolean"); // 開機時有紀錄的使用者會被標記為已引導，所以只檢查型別
  assert.deepEqual(S.racc, { r: 0, w: 0 });
  assert.deepEqual(S.lcat["Part 2"], { r: 0, w: 1 });
  assert.deepEqual(S.daily["2026-10-01"], { p5: 0, l2: 3, wr: 0 });
  assert.equal(Object.keys(S.daily).some(k => k.includes("<")), false, "不是日期的鍵要丟掉");
  assert.deepEqual(S.cat, { "詞性": { r: 0, w: 0 } });
  assert.equal(S.vocab.abandon.i, 0);
  assert.equal(S.vocab.abandon.e, 2.5);
  assert.match(S.vocab.abandon.due, /^\d{4}-\d{2}-\d{2}$/);
  // v1.7 起紀錄以題目固定編號為鍵（INV-13）
  assert.deepEqual(S.wb.p5["p5-0003"], { n: 0, last: null });
  assert.deepEqual(S.wb.p6, {});
  assert.deepEqual(S.p6done, { "p6-0000": 0 });
  assert.deepEqual(S.p7done, { "p7-0000": 0, "p7-0001": 2 });
  assert.deepEqual(S.p5seen, { "p5-0001": true });
  assert.deepEqual(S.l2seen, {});
  assert.deepEqual(S.mockSeen, { p5: { "p5-0001": true } });
  assert.equal(S.mocks.length, 1);
  assert.deepEqual(S.mocks[0], { date: "", lT: 4, rR: 3, rT: 5, parts: { "Part 2": { r: 0, t: 2 } } });
  assert.equal(json.includes("onerror"), false, json);
});

test("sec-H1-2 合法的舊版資料完整保留（INV-03）", () => {
  const legacy = {
    exam: "2026-11-30", updatedAt: 1759800000000, lastBackup: "2026-10-01", targetScore: 900, onboarded: true,
    racc: { r: 18, w: 2 }, cat: { "詞性": { r: 5, w: 1 } }, lcat: { "Part 3/4": { r: 2, w: 1 } },
    daily: { "2026-10-01": { v: 20, p5: 10, p6: 1, p7: 1, l2: 10, l34: 2, newV: 5, wr: 3, mockDone: 1 } },
    vocab: { abandon: { i: 6, e: 2.36, due: "2026-10-10", n: 3 } },
    wb: { p5: { 3: true, 7: { n: 1, last: "2026-10-01" } }, p6: { "0-1": true }, p7: {}, l2: {}, l34: {} },
    p6done: [3, null, 4], p7done: { 2: 3 }, l34done: { 0: 3 },
    p5seen: [true, null, true], l2seen: { 5: true }, mockSeen: { p5: [true, true] },
    mocks: [{ date: "2026-08-01", mode: "full", L: 400, R: 380 },
      { date: "2026-10-01", mode: "read", lR: 0, lT: 0, rR: 20, rT: 27, lSkip: 0, secs: 1300, parts: { "Part 5": { r: 12, t: 15 } } }]
  };
  const app = loadApp({ storage: { toeic900: JSON.stringify(legacy) } });
  const S = plain(app.run("S"));
  for (const k of ["exam", "updatedAt", "lastBackup", "targetScore", "onboarded", "racc", "cat", "vocab"]) {
    assert.deepEqual(S[k], legacy[k], k);
  }
  assert.deepEqual(S.daily["2026-10-01"], legacy.daily["2026-10-01"]); // 開機時會另外建立今天的空白紀錄
  assert.deepEqual(S.lcat, { "Part 3-4": { r: 2, w: 1 } }, "原本的 Part 3/4 遷移仍要正常");
  // v1.7 起紀錄以題目固定編號為鍵，內容不變（INV-13）
  assert.deepEqual(S.wb.p5, { "p5-0003": { n: 0, last: null }, "p5-0007": { n: 1, last: "2026-10-01" } });
  assert.deepEqual(S.wb.p6, { "p6-0000_1": { n: 0, last: null } });
  assert.deepEqual(S.p6done, { "p6-0000": 3, "p6-0002": 4 }, "Firebase 存成陣列的資料也要能讀");
  assert.deepEqual(S.p5seen, { "p5-0000": true, "p5-0002": true });
  assert.deepEqual(S.mockSeen, { p5: { "p5-0000": true, "p5-0001": true } });
  assert.deepEqual(S.l34done, { "l34-0000": 3 });
  assert.deepEqual(S.l2seen, { "l2-0005": true });
  assert.equal(S.idV, 1);
  assert.equal("legacy" in S, false, "全部對得到題目，不需要 legacy");
  assert.deepEqual(S.mocks, legacy.mocks);
});

test("sec-H1-3 雲端同步拉取的資料也會經過型別檢查", async () => {
  const app = loadApp();
  app.run(`S.updatedAt = 0; Sync.ref = () => ({ get: async () => ({ val: () => (${JSON.stringify({ records: EVIL, updatedAt: 5 })}) }) });`);
  const applied = await app.run("Sync.pullOnStartup(0)");
  assert.equal(applied, true);
  const S = plain(app.run("S"));
  assert.equal("lastBackup" in S, false);
  assert.equal(S.targetScore, null);
  assert.deepEqual(S.p6done, { 0: 0 });
  assert.equal(app.store.get("toeic900").includes("onerror"), false, "寫回本機的資料不可含 XSS 字串");
});

test("sec-H1-4 自訂題庫從同步或備份帶進來時逐題驗證，格式不符的丟棄", () => {
  const bank = {
    p5: [{ q: "A ___ b.", opts: ["a", "b", "c", "d"], ans: 0, cat: "詞性", exp: "x" }, { q: { evil: X }, opts: X, ans: "0" }, null],
    vocab: [{ w: "valid", pos: "adj.", zh: "有效的", ex: "It is valid.", exZh: "有效。" }, { w: "a.b", pos: "n", zh: "x", ex: "x", exZh: "x" }],
    l2: X, extra: [1, 2]
  };
  const app = loadApp({ storage: { toeic900_bank: JSON.stringify(bank) } });
  const b = plain(app.run("loadBank()"));
  assert.equal(b.p5.length, 1);
  assert.equal(b.vocab.length, 1);
  assert.deepEqual(b.l2, []);
  assert.equal(app.run("PART5.length"), app.run("BUILTIN.p5") + 1, "只有合格的自訂題併入題庫");
});

test("sec-H1-5 畫面輸出的雙重防護：統計列與舊的 sinks 都經過 esc", () => {
  const app = loadApp();
  app.run(`S.cat = { "詞性": { r: ${JSON.stringify(X)}, w: 0 } };`);
  assert.equal(app.run("catBars()").includes("<img"), false);
  const src = readSource("js/app.js");
  assert.ok(src.includes("最佳 ${esc(best)}/4"));
  assert.ok(src.includes("${esc(S.lastBackup || \"從未備份\")}"));
  assert.ok(readSource("js/views.js").includes("目標分數 ${esc(S.targetScore)} 分"));
});

test("sec-H1-6 sanitizeState 不會在 load() 開機時踩到尚未宣告的常數（否則會清空紀錄）", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ exam: "2026-11-30", racc: { r: 3, w: 1 } }) } });
  assert.equal(app.run("S.exam"), "2026-11-30");
  assert.equal(app.run("S.racc.r"), 3);
});

test("sec-M3 少於 10 個英數字的同步代碼視為容易被猜到", () => {
  const app = loadApp();
  assert.equal(app.run(`Sync.weakCode("toeic")`), true);
  assert.equal(app.run(`Sync.weakCode("abcd-efgh")`), true);
  assert.equal(app.run(`Sync.weakCode("ab3de-f7gh9")`), false, "系統產生的格式不算弱");
  assert.equal(app.run(`Sync.weakCode(Sync.genCode())`), false);
});

test("sec-M1 有 CSP：腳本不允許 inline／eval，連線只到 Firebase 與 Anthropic；頁面沒有行內腳本或事件屬性", () => {
  const html = readSource("index.html");
  const m = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.ok(m, "缺少 CSP");
  const dir = Object.fromEntries(m[1].split(";").map(s => s.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
  assert.equal(dir["script-src"].some(v => /unsafe/.test(v)), false);
  assert.deepEqual(dir["object-src"], ["'none'"]);
  assert.ok(dir["connect-src"].includes("https://api.anthropic.com"));
  assert.equal(dir["connect-src"].some(v => v === "*" || v === "https:"), false);
  assert.equal(/<script(?![^>]*\bsrc=)[^>]*>/.test(html), false, "index.html 有行內腳本");
  for (const f of ["index.html", "js/app.js", "js/mock.js", "js/views.js", "js/ui.js", "js/ai.js"]) {
    assert.equal(/\son[a-z]+\s*=\s*["'{]/.test(readSource(f)), false, `${f} 有 on*= 事件屬性，CSP 下會失效`);
  }
});

test("sec-M2 第三方腳本都有 SRI 完整性檢查", () => {
  const html = readSource("index.html");
  const ext = html.match(/<script[^>]+src="https:[^"]+"[^>]*>/g) || [];
  assert.equal(ext.length, 2);
  ext.forEach(tag => {
    assert.match(tag, /integrity="sha384-[A-Za-z0-9+/=]{64}"/);
    assert.match(tag, /crossorigin="anonymous"/);
  });
});

/* ---------- 獨立審查（review-sec）後補的案例 ---------- */
test("review-sec P2 Firebase 存成陣列的錯題本，空位不會變成假的錯題", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ wb: { p5: [null, null, { n: 1, last: "2026-10-01" }], l2: [null, true] } }) } });
  // v1.7 起紀錄以固定編號為鍵（INV-13）
  assert.deepEqual(plain(app.run("S.wb.p5")), { "p5-0002": { n: 1, last: "2026-10-01" } });
  assert.deepEqual(plain(app.run("S.wb.l2")), { "l2-0001": { n: 0, last: null } });
  assert.equal(app.run("wrongCount()"), 2);
});

test("review-sec P3-1 錯題本中指向不存在題目的鍵不顯示、不讓頁面出錯，也不刪除紀錄", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ wb: { p5: { 0: true, 99999: true }, p6: { "0-0": true, "999-9": true }, p7: { "x-y": true }, l34: { "0-99": true } } }) } });
  assert.deepEqual(plain(app.run(`wbKeys("p5")`)), ["0"]);
  assert.deepEqual(plain(app.run(`wbKeys("p6")`)), ["0-0"]);
  assert.deepEqual(plain(app.run(`wbKeys("p7")`)), []);
  assert.equal(app.run("wrongCount()"), 2);
  app.run("renderers.wrong()"); // 不可拋錯
  // 對不到題目的鍵不刪除，轉換時收進 S.legacy（v1.7）
  assert.deepEqual(Object.keys(plain(app.run("S.wb.p5"))), ["p5-0000"]);
  assert.equal(Object.keys(plain(app.run("S.legacy.wb.p5"))).length, 1, "紀錄本身保留");
});

test("review-sec P3-2 沒有 mode 的舊模考紀錄維持沒有 mode", () => {
  const app = loadApp({ storage: { toeic900: JSON.stringify({ mocks: [{ date: "2026-08-01", L: 400, R: 380 }] }) } });
  assert.deepEqual(plain(app.run("S.mocks")), [{ date: "2026-08-01", L: 400, R: 380 }]);
  assert.equal(app.run("Mock.modeName(S.mocks[0].mode)"), "模擬考");
});

test("review-sec P3-3 開發期間存在 localStorage 的舊格式金鑰會被清掉、不再使用", () => {
  const app = loadApp({ storage: { toeic900_ai: JSON.stringify({ key: "sk-ant-test-old-format-000000", model: "claude-sonnet-5-5" }) } });
  assert.equal(app.run("AI.enabled()"), false);
  assert.equal(app.store.get("toeic900_ai").includes("sk-ant"), false);
  assert.equal(app.run("AI.cfg().model"), "claude-sonnet-5-5", "模型設定保留");
});

test("review-sec P3-4 取消「記住」時 sessionStorage 寫入失敗，記住的金鑰不會遺失", () => {
  const app = loadApp();
  const key = "sk-ant-test-remember-0000000";
  app.run(`AI.setKey(${JSON.stringify(key)}, true)`);
  app.run(`sessionStorage.setItem = () => { throw new Error("blocked"); }`);
  assert.equal(app.run("(() => { const c = AI.cfg(); c.remember = false; return AI.saveCfg(c); })()"), false);
  assert.equal(app.run("AI.cfg().key"), key);
});

test("review-sec P3-7 重複呼叫 mergeBank 不會讓自訂題重複出現", () => {
  const bank = { p5: [{ q: "A ___ b.", opts: ["a", "b", "c", "d"], ans: 0, cat: "詞性", exp: "x" }] };
  const app = loadApp({ storage: { toeic900_bank: JSON.stringify(bank) } });
  const n = app.run("PART5.length");
  app.run("mergeBank(); mergeBank();");
  assert.equal(app.run("PART5.length"), n);
  assert.equal(app.run("BUILTIN.p5"), n - 1);
});
