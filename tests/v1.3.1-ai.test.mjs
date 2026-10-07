// v1.3.1 AI 錯題解析的單元測試。測試 ID 對應 .scratch/toeic-v1-improve/verification.md §3.1A
// 全部使用假 fetch 與明顯的測試金鑰，不連到真實 API。
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp, fakeFetch, readSource } from "./helpers/load-app.mjs";

const KEY = "sk-ant-test-0000-THIS-IS-NOT-A-REAL-KEY";
const plain = v => JSON.parse(JSON.stringify(v));
function appWithKey(fetchOpts) {
  const app = loadApp({ fetch: fakeFetch(fetchOpts) });
  assert.equal(app.run(`AI.setKey(${JSON.stringify(KEY)})`), null);
  return app;
}
// 用真實題庫的 Part 5 第 1 題，使用者選第一個錯誤選項
const P5_CTX = `(() => { const it = PART5[0]; return { type: "p5", key: 0, q: it.q, opts: it.opts, ans: it.ans, exp: it.exp,
  chosen: it.opts.findIndex((_, i) => i !== it.ans) }; })()`;

/* ---------- AI-01 金鑰設定 ---------- */
test("T-AI-01-1 金鑰預設只在 sessionStorage；不在 localStorage、學習紀錄、備份與同步內容中", () => {
  const app = appWithKey();
  app.run("save()");
  assert.equal(app.session.get("toeic900_ai_key"), KEY);
  for (const [k, v] of app.store) assert.equal(v.includes(KEY), false, `localStorage 的 ${k} 不可含金鑰`);
  // exportBackup() 與 Sync.pushNow() 寫出的內容都是 { records: S, bank: loadBank() }
  const payload = app.run("JSON.stringify({ records: S, bank: loadBank() })");
  assert.equal(payload.includes(KEY), false);
  assert.match(readSource("js/app.js"), /records: S, bank: loadBank\(\)/);
  assert.match(readSource("js/sync.js"), /records: S, bank: loadBank\(\)/);
});

test("T-AI-01-2 刪除金鑰後不再啟用，儲存內容中沒有金鑰", () => {
  const app = appWithKey();
  assert.equal(app.run("AI.enabled()"), true);
  app.run("AI.clearKey()");
  assert.equal(app.run("AI.enabled()"), false);
  assert.equal(app.store.get("toeic900_ai").includes(KEY), false);
  assert.equal(app.session.has("toeic900_ai_key"), false);
});

test("sec-H2 勾選「記住」才把金鑰存進 localStorage；取消勾選會搬回 sessionStorage", () => {
  const app = loadApp();
  assert.equal(app.run(`AI.setKey(${JSON.stringify(KEY)}, true)`), null);
  assert.ok(app.store.get("toeic900_ai").includes(KEY));
  assert.equal(app.session.has("toeic900_ai_key"), false);
  assert.equal(app.run("AI.cfg().remember"), true);
  app.run("const c = AI.cfg(); c.remember = false; AI.saveCfg(c);");
  assert.equal(app.store.get("toeic900_ai").includes(KEY), false);
  assert.equal(app.session.get("toeic900_ai_key"), KEY);
  assert.equal(app.run("AI.enabled()"), true);
  // 模型設定不受影響、也不含金鑰
  app.run(`AI.setModel("claude-sonnet-5-5")`);
  assert.equal(JSON.parse(app.store.get("toeic900_ai")).model, "claude-sonnet-5-5");
});

test("sec-L1 被其他網站用框架嵌入時不啟用 AI", () => {
  const app = appWithKey();
  app.run("top = {}"); // 模擬 window.top !== window.self
  assert.equal(app.run("AI.enabled()"), false);
  assert.equal(app.run("aiOffer(false)"), "");
  assert.match(app.run("aiSettingsHTML()"), /嵌在其他網站/);
});

test("T-AI-01-2b 金鑰格式檢查：空白、含空白、過短都拒絕；畫面只顯示末 4 碼", () => {
  const app = loadApp();
  for (const bad of ["", "   ", "sk-ant- abc def ghi jkl mno", "short"]) {
    assert.equal(typeof app.run(`AI.setKey(${JSON.stringify(bad)})`), "string", `應拒絕「${bad}」`);
  }
  assert.equal(app.run("AI.enabled()"), false);
  assert.equal(app.run(`AI.setKey(${JSON.stringify("  " + KEY + "\n")})`), null, "前後空白應自動去掉");
  assert.equal(app.run("AI.cfg().key"), KEY);
  assert.equal(app.run("AI.maskedKey()"), "…" + KEY.slice(-4));
});

test("T-AI-01-3 測試連線：成功、金鑰錯誤、網路失敗顯示不同訊息，且不含金鑰", async () => {
  const msgs = [];
  for (const mode of ["ok", "401", "network"]) {
    const app = appWithKey({ mode });
    msgs.push(await app.run("AI.test().catch(e => AI.errMsg(e))"));
  }
  assert.equal(new Set(msgs).size, 3, msgs.join(" | "));
  assert.match(msgs[0], /成功/);
  assert.match(msgs[1], /金鑰無效/);
  assert.match(msgs[2], /網路/);
  msgs.forEach(m => assert.equal(m.includes(KEY), false));
});

test("T-AI-01-4 模型只能設成清單內的值", () => {
  const app = loadApp();
  assert.equal(app.run("AI.cfg().model"), "claude-haiku-4-5-20251001");
  app.run(`AI.setModel("claude-sonnet-5-5")`);
  assert.equal(app.run("AI.cfg().model"), "claude-sonnet-5-5");
  app.run(`AI.setModel("not-a-model")`);
  assert.equal(app.run("AI.cfg().model"), "claude-sonnet-5-5");
});

/* ---------- AI-02 請求內容與錯誤處理 ---------- */
test("T-AI-02-1 五種題型的請求都包含題目、全部選項、正解、使用者選項、原有解析與必要的文章／逐字稿", () => {
  const app = loadApp();
  const cases = app.run(`[
    (() => { const it = PART5[0]; return { type: "p5", key: 0, q: it.q, opts: it.opts, ans: it.ans, exp: it.exp, chosen: (it.ans + 1) % 4, need: [] }; })(),
    (() => { const p = PART6[0], b = p.blanks[0]; return { type: "p6", key: "0-0", q: "空格 [1] 應填入：", opts: b.opts, ans: b.ans, exp: b.exp, chosen: (b.ans + 1) % 4, context: p.text, need: [p.text] }; })(),
    (() => { const i = PART7.findIndex(s => s.passages.length > 1), s = PART7[i], q = s.qs[0];
      return { type: "p7", key: i + "-0", q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, chosen: (q.ans + 1) % 4, context: aiPassages(s), need: s.passages.concat(["（文章 2）"]) }; })(),
    (() => { const it = PART2[0]; return { type: "l2", key: 0, q: it.q, opts: it.opts, ans: it.ans, exp: it.exp, chosen: (it.ans + 1) % 3, need: ["聽力題"] }; })(),
    (() => { const s = PART34[0], q = s.qs[0]; return { type: "l34", key: "0-0", q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, chosen: (q.ans + 1) % 4, context: aiTranscript(s), need: s.turns.map(t => t.t) }; })()
  ]`);
  for (const c of plain(cases)) {
    const p = app.run(`AI.prompt(${JSON.stringify(c)})`);
    const must = [c.q, ...c.opts, `題庫標示的正解：${c.opts[c.ans]}`, `學生選的答案：${c.opts[c.chosen]}`, c.exp, ...c.need];
    must.forEach(s => assert.ok(p.includes(s), `${c.type} 的請求缺少：${s.slice(0, 40)}`));
    assert.equal(/\([A-D]\)/.test(p.replace(c.exp, "")), false, `${c.type} 的請求不應用字母代稱選項`);
  }
});

test("T-AI-02-2 請求網址、標頭、模型與系統提示正確", async () => {
  const app = appWithKey();
  await app.run(`AI.explain(${P5_CTX})`);
  assert.equal(app.fetch.calls.length, 1);
  const { url, headers, body } = app.fetch.calls[0];
  assert.equal(url, "https://api.anthropic.com/v1/messages");
  assert.equal(headers["x-api-key"], KEY);
  assert.equal(headers["anthropic-version"], "2023-06-01");
  assert.equal(headers["anthropic-dangerous-direct-browser-access"], "true");
  assert.equal(body.model, "claude-haiku-4-5-20251001");
  assert.ok(body.max_tokens > 0);
  assert.match(body.system, /KEY_OK/);
  assert.match(body.system, /不要用 \(A\)\(B\)\(C\)\(D\)/);
  assert.equal(body.messages[0].role, "user");
});

test("T-AI-02-3 每種失敗都回傳對應的中文訊息，不拋出未處理的例外", async () => {
  const expect = { "401": /金鑰無效/, "429": /太頻繁|上限/, "500": /忙碌/, "400credit": /額度不足/,
    network: /連不到/, empty: /沒有回傳內容/, html: /忙碌/, timeout: /逾時/ };
  const seen = new Set();
  for (const [mode, re] of Object.entries(expect)) {
    const app = appWithKey({ mode });
    app.run("AI.timeoutMs = 30");
    const msg = await app.run(`AI.explain(${P5_CTX}).then(() => "沒有失敗", e => AI.errMsg(e))`);
    assert.match(msg, re, `${mode}：${msg}`);
    seen.add(msg);
  }
  assert.ok(seen.size >= 7, "不同的失敗應該有不同的訊息");
});

test("T-AI-02-3b 離線時直接回報離線，不送出請求", async () => {
  const app = appWithKey();
  app.run("navigator.onLine = false");
  const msg = await app.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`);
  assert.match(msg, /離線/);
  assert.equal(app.fetch.calls.length, 0);
});

test("T-AI-02-8 模擬考不提供 AI 解析；一般練習與錯題本都有接上", () => {
  assert.equal(/aiOffer|wireAIBox|AI\./.test(readSource("js/mock.js")), false);
  const app = readSource("js/app.js");
  for (const t of ["p5", "p6", "p7", "l34"]) assert.ok(app.includes(`ai: { type: "${t}"`), `${t} 沒有傳 meta.ai`);
  assert.ok(app.includes(`meta.ai = { type: entry.type, key: entry.key }`), "錯題本重考沒有接上");
  assert.equal((app.match(/wireAIBox\(/g) || []).length, 3, "renderMCQ、Part 2、Part 2 錯題本重考各一處");
});

/* ---------- AI-03 判定與疑似問題記錄 ---------- */
test("T-AI-03-1 判定解析：三種代碼、前面多了符號、缺少判定行", () => {
  const app = loadApp();
  const p = t => plain(app.run(`AI.parse(${JSON.stringify(t)})`));
  assert.deepEqual(p("KEY_OK\n說明"), { verdict: "KEY_OK", body: "說明" });
  assert.deepEqual(p("ALSO_CORRECT\n兩個都對"), { verdict: "ALSO_CORRECT", body: "兩個都對" });
  assert.deepEqual(p("**KEY_WRONG**\n答案錯了"), { verdict: "KEY_WRONG", body: "答案錯了" });
  assert.deepEqual(p("【你選的為什麼不對】沒有判定行"), { verdict: null, body: "【你選的為什麼不對】沒有判定行" });
  assert.deepEqual(p("KEY_OK"), { verdict: "KEY_OK", body: "" });
});

test("T-AI-03-1b 只有 ALSO_CORRECT、KEY_WRONG 會被記錄；缺少判定行不記錄", async () => {
  for (const [reply, flagged] of [["KEY_OK\nx", 0], ["ALSO_CORRECT\nx", 1], ["KEY_WRONG\nx", 1], ["沒有判定", 0]]) {
    const app = appWithKey({ reply });
    const res = plain(await app.run(`AI.explain(${P5_CTX})`));
    assert.equal(app.run("AI.flags().length"), flagged, reply);
    if (flagged) {
      const f = plain(app.run("AI.flags()[0]"));
      assert.equal(f.id, "p5:0");
      assert.equal(f.verdict, reply.split("\n")[0]);
      assert.equal(f.v, "1.3.1");
      assert.equal(JSON.stringify(f).includes(KEY), false);
    }
    assert.equal(typeof res.body, "string");
  }
});

test("T-AI-03-2 同一題只保留最新一筆；最多 200 筆", () => {
  const app = loadApp();
  app.run(`const c = i => ({ type: "p5", key: i, q: "q", opts: ["a", "b"], ans: 0, chosen: 1 });
    AI.flag(c(1), "KEY_WRONG", "舊", "m"); AI.flag(c(1), "ALSO_CORRECT", "新", "m");`);
  assert.equal(app.run("AI.flags().length"), 1);
  assert.equal(app.run("AI.flags()[0].reason"), "新");
  app.run(`for (let i = 0; i < 201; i++) AI.flag(c(1000 + i), "KEY_WRONG", "r", "m");`);
  assert.equal(app.run("AI.flags().length"), 200);
  assert.equal(app.run("AI.flags()[0].id"), "p5:1001", "最舊的應被刪除");
});

test("T-AI-03-3 AI 判定不改變計分、錯題本、題庫（INV-12）", async () => {
  const app = appWithKey({ reply: "KEY_WRONG\n題庫答案錯了" });
  app.run(`wbMark("p5", 0, false); save();`);
  const before = app.run("JSON.stringify({ S, p5: PART5[0] })");
  await app.run(`AI.explain(${P5_CTX})`);
  assert.equal(app.run("JSON.stringify({ S, p5: PART5[0] })"), before);
  assert.equal(app.run("AI.flags().length"), 1);
});

/* ---------- AI-04 快取 ---------- */
test("T-AI-04-1 同一題同一選項第二次不呼叫 API", async () => {
  const app = appWithKey();
  const a = plain(await app.run(`AI.explain(${P5_CTX})`));
  const b = plain(await app.run(`AI.explain(${P5_CTX})`));
  assert.equal(app.fetch.calls.length, 1);
  assert.equal(a.cached, false);
  assert.equal(b.cached, true);
  assert.equal(b.body, a.body);
});

test("T-AI-04-2 題目內容、使用者選項或模型改變時重新請求", async () => {
  const app = appWithKey();
  await app.run(`AI.explain(${P5_CTX})`);
  await app.run(`(() => { const c = ${P5_CTX}; c.exp = c.exp + "（已修正）"; return AI.explain(c); })()`);
  assert.equal(app.fetch.calls.length, 2, "解析內容改了應重新請求");
  await app.run(`(() => { const c = ${P5_CTX}; c.chosen = c.opts.findIndex((_, i) => i !== c.ans && i !== c.chosen); return AI.explain(c); })()`);
  assert.equal(app.fetch.calls.length, 3, "換選項應重新請求");
  app.run(`AI.setModel("claude-sonnet-5-5")`);
  await app.run(`AI.explain(${P5_CTX})`);
  assert.equal(app.fetch.calls.length, 4, "換模型應重新請求");
});

test("T-AI-04-3 快取最多 300 筆，超過時刪除最舊的", async () => {
  const cache = {};
  for (let i = 0; i < 300; i++) cache[`old${i}`] = { v: "KEY_OK", b: "x", m: "m", t: 1000 + i };
  const app = loadApp({ storage: { toeic900_ai_cache: JSON.stringify(cache) } });
  app.run(`AI.setKey(${JSON.stringify(KEY)})`);
  await app.run(`AI.explain(${P5_CTX})`);
  const after = JSON.parse(app.store.get("toeic900_ai_cache"));
  assert.equal(Object.keys(after).length, 300);
  assert.equal("old0" in after, false);
  assert.equal("old1" in after, true);
});

test("T-AI-04-4 失敗的請求不寫入快取，重試會再呼叫", async () => {
  const app = appWithKey({ mode: "500" });
  await app.run(`AI.explain(${P5_CTX}).catch(() => null)`);
  app.fetch.mode = "ok";
  const r = plain(await app.run(`AI.explain(${P5_CTX})`));
  assert.equal(app.fetch.calls.length, 2);
  assert.equal(r.cached, false);
});

/* ---------- AI-05 隱私與安全 ---------- */
test("T-AI-05-1 原始碼中只有 ai.js 呼叫 fetch，且只連到 api.anthropic.com", () => {
  for (const f of ["js/app.js", "js/mock.js", "js/views.js", "js/ui.js", "js/sync.js"]) {
    assert.equal(/\bfetch\(/.test(readSource(f)), false, `${f} 不應呼叫 fetch`);
  }
  const src = readSource("js/ai.js");
  assert.equal((src.match(/\bfetch\(/g) || []).length, 1);
  const urls = src.match(/https?:\/\/[^\s"'`)]+/g) || [];
  assert.deepEqual([...new Set(urls)].sort(), ["https://api.anthropic.com/v1/messages", "https://console.anthropic.com/settings/keys"]);
});

test("T-AI-05-2 錯誤訊息即使 API 回傳的內容帶到金鑰，也會遮掉", async () => {
  const app = appWithKey();
  app.run(`fetch = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "bad key ${KEY} here" } }) })`);
  const msg = await app.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`);
  assert.equal(msg.includes(KEY), false);
  assert.match(msg, /\*\*\*/);
});

test("T-INV-11 沒有金鑰時不發出任何請求，也不顯示按鈕", async () => {
  const app = loadApp();
  assert.equal(app.run("aiOffer(false)"), "");
  const msg = await app.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`);
  assert.match(msg, /還沒設定/);
  assert.equal(app.fetch.calls.length, 0);
  app.run(`AI.setKey(${JSON.stringify(KEY)})`);
  assert.equal(app.run("aiOffer(true)"), "", "答對時不顯示按鈕");
  assert.match(app.run("aiOffer(false)"), /AI 解析/);
});

/* ---------- AI-06 版本號 ---------- */
test("T-AI-06-1 版本一致：APP_VERSION、CHANGELOG、?v= 與 ai.js 已載入", () => {
  const app = loadApp();
  assert.equal(app.run("APP_VERSION"), "1.3.1");
  assert.equal(app.run("CHANGELOG[0].v"), "1.3.1");
  const html = readSource("index.html");
  const vs = new Set((html.match(/\?v=\d+/g) || []));
  assert.equal(vs.size, 1, [...vs].join(","));
  assert.ok(/js\/ai\.js\?v=\d+/.test(html));
  assert.ok(html.indexOf("js/ai.js") < html.indexOf("js/app.js"));
});

/* ---------- 獨立審查（review-131）後補的案例 ---------- */
test("review-131 P2-1 回應含思考區塊時只取文字；只有思考就達上限時給明確訊息；測試連線的上限足夠", async () => {
  const ok = appWithKey();
  const r = plain(await ok.run(`AI.explain(${P5_CTX})`));
  assert.match(r.body, /測試/);
  assert.ok(ok.fetch.calls[0].body.max_tokens >= 1500, "解析的輸出上限要留給思考");
  await ok.run("AI.test()");
  assert.ok(ok.fetch.calls[1].body.max_tokens >= 32, "測試連線的上限太小，思考型模型會沒有文字");
  const think = appWithKey({ mode: "thinkonly" });
  assert.match(await think.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`), /長度上限/);
  const refuse = appWithKey({ mode: "refusal" });
  assert.match(await refuse.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`), /拒絕/);
});

test("review-131 P2-2 被截斷的回應照樣顯示，但標示不完整、不快取、不記錄判定", async () => {
  const app = appWithKey({ mode: "cutoff", reply: "KEY_WRONG\n寫到一半" });
  const r = plain(await app.run(`AI.explain(${P5_CTX})`));
  assert.equal(r.complete, false);
  assert.equal(r.verdict, null);
  assert.match(r.body, /寫到一半/);
  assert.equal(app.run("AI.flags().length"), 0);
  assert.equal(app.store.get("toeic900_ai_cache") || "{}", "{}");
  app.fetch.mode = "ok";
  await app.run(`AI.explain(${P5_CTX})`);
  assert.equal(app.fetch.calls.length, 2, "截斷的回應不可擋住重試");
});

test("review-131 P3-1 清除疑似清單後，快取命中的 KEY_WRONG 會重新記錄", async () => {
  const app = appWithKey({ reply: "KEY_WRONG\n答案錯了" });
  await app.run(`AI.explain(${P5_CTX})`);
  app.run("AI.clearFlags()");
  const r = plain(await app.run(`AI.explain(${P5_CTX})`));
  assert.equal(r.cached, true);
  assert.equal(app.run("AI.flags().length"), 1);
  assert.equal(app.fetch.calls.length, 1);
});

test("review-131 P3-2 回應內容讀取卡住也會逾時", async () => {
  const app = appWithKey();
  app.run(`AI.timeoutMs = 30; fetch = async (u, o) => ({ ok: true, status: 200,
    json: () => new Promise((_, rej) => o.signal.addEventListener("abort", () => { const e = new Error("a"); e.name = "AbortError"; rej(e); })) })`);
  assert.match(await app.run(`AI.explain(${P5_CTX}).then(() => "", e => AI.errMsg(e))`), /逾時/);
});

test("review-131 P3-3 快取鍵包含提示版本；P3-4 儲存失敗時回報而不是拋錯", () => {
  const app = loadApp();
  assert.match(app.run(`AI.cacheKey(${P5_CTX}, "m")`), /:p\d+:/);
  app.run(`localStorage.setItem = () => { throw new Error("QuotaExceededError"); }`);
  assert.match(app.run(`AI.setKey(${JSON.stringify(KEY)})`), /無法儲存/);
});
