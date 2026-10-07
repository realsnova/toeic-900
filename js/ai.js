/* ============ AI 錯題解析（自帶金鑰，試用版 v1.3.1）============ */
// 規格：.scratch/toeic-v1-improve/spec.md §5.1A（AI-01～AI-05）、INV-10～12。
// 金鑰存在獨立的 localStorage 鍵，不進 S：所以不會雲端同步、也不會出現在備份檔（INV-10）。
// 只在使用者按下按鈕時才送出請求；沒有金鑰時不發任何 AI 請求（INV-11）。
// AI 的判定只記錄，不改計分、錯題本或題庫（INV-12）。
const AI_KEY = "toeic900_ai";
const AI_CACHE_KEY = "toeic900_ai_cache";
const AI_FLAGS_KEY = "toeic900_ai_flags";
const AI_ENDPOINT = "https://api.anthropic.com/v1/messages";
const AI_MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5（快、費用最低）" },
  { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5（較準確、費用較高）" }
];
const AI_TIMEOUT_MS = 20000;
const AI_CACHE_MAX = 300;
const AI_FLAGS_MAX = 200;
const AI_VERDICTS = ["KEY_OK", "ALSO_CORRECT", "KEY_WRONG"];
const AI_PART_NAMES = {
  p5: "Part 5 句子填空", p6: "Part 6 段落填空", p7: "Part 7 閱讀理解",
  l2: "Part 2 應答問題（聽力）", l34: "Part 3/4 對話與短講（聽力）"
};
const AI_SYSTEM = `你是 TOEIC 英文老師。學生程度約 TOEIC 600–850 分，目標 900 分。學生剛答錯一題，請用繁體中文（台灣用語）說明。

輸出格式：
第一行只寫一個判定代碼，不要加其他字：
KEY_OK：題庫標示的正解正確，學生的答案錯。
ALSO_CORRECT：學生選的答案在文法與語意上也完全可以接受（這題有兩個正解）。
KEY_WRONG：題庫標示的正解其實是錯的。
只有在你很確定時才使用 ALSO_CORRECT 或 KEY_WRONG，並在說明中講清楚理由。

第二行起是說明，分成三段，每段以下列標題開頭：
【你選的為什麼不對】
【正解為什麼對】
【下次怎麼判斷】

規則：
- 直接引用選項的英文原文，不要用 (A)(B)(C)(D) 或任何字母代稱選項（選項順序每次會打亂）。
- 不要使用 Markdown 符號（#、*、表格）。
- 全文 300 字以內。`;

class AIError extends Error {
  constructor(code, detail = "") { super(code); this.code = code; this.detail = detail; }
}

const AI = {
  timeoutMs: AI_TIMEOUT_MS, // 測試可以縮短
  /* ---- 設定（AI-01）---- */
  cfg() {
    const d = { key: "", model: AI_MODELS[0].id };
    try { return Object.assign(d, JSON.parse(localStorage.getItem(AI_KEY) || "{}")); } catch (e) { return d; }
  },
  saveCfg(c) { localStorage.setItem(AI_KEY, JSON.stringify({ key: c.key || "", model: c.model })); },
  enabled() { return !!AI.cfg().key; },
  // 回傳錯誤訊息；null 代表接受
  setKey(raw) {
    const key = String(raw || "").trim();
    if (!key) return "請貼上 API 金鑰。";
    if (/\s/.test(key) || key.length < 20 || key.length > 300) return "金鑰格式不對：應該是一長串沒有空白的文字（通常以 sk-ant- 開頭）。";
    const c = AI.cfg(); c.key = key; AI.saveCfg(c);
    return null;
  },
  clearKey() { const c = AI.cfg(); c.key = ""; AI.saveCfg(c); },
  setModel(id) { if (AI_MODELS.some(m => m.id === id)) { const c = AI.cfg(); c.model = id; AI.saveCfg(c); } },
  modelLabel(id) { const m = AI_MODELS.find(x => x.id === id); return m ? m.label.replace(/（.*$/, "") : id; },
  // 畫面只顯示末 4 碼
  maskedKey() { const k = AI.cfg().key; return k ? `…${k.slice(-4)}` : ""; },

  /* ---- 本機 JSON 存取 ---- */
  read(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) || fallback; } catch (e) { return fallback; } },
  write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 空間不足時放棄快取，不影響作答 */ } },

  /* ---- 請求內容（AI-02）---- */
  // ctx：{ type, key, q, opts, ans, exp, context, chosen }
  prompt(ctx) {
    const lines = [`題型：${AI_PART_NAMES[ctx.type] || ctx.type}`];
    if (ctx.type === "l2") lines.push("（聽力題：學生只聽到語音，沒有看到文字。）");
    if (ctx.context) lines.push("", ctx.type === "l34" ? "【對話／短講逐字稿】" : "【文章】", ctx.context);
    lines.push("", `題目：${ctx.q || "（選出最適當的選項）"}`, "選項：");
    ctx.opts.forEach(o => lines.push(`- ${o}`));
    lines.push("", `題庫標示的正解：${ctx.opts[ctx.ans]}`, `學生選的答案：${ctx.opts[ctx.chosen]}`);
    if (ctx.exp) lines.push(`題庫原有解析：${ctx.exp}`);
    return lines.join("\n");
  },
  // 簡單的 FNV-1a 雜湊：題目內容改了，舊快取自動失效（AI-04）
  hash(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, "0");
  },
  cacheKey(ctx, model) {
    const content = [ctx.q, ctx.context, ctx.exp, ctx.ans, ...ctx.opts].join("\u0001");
    return `${ctx.type}:${ctx.key}:${ctx.chosen}:${model}:${AI.hash(content)}`;
  },

  /* ---- 回應解析（AI-03）---- */
  parse(text) {
    const t = String(text || "").trim();
    const nl = t.indexOf("\n");
    const first = (nl < 0 ? t : t.slice(0, nl)).trim().replace(/^[^A-Z]*/, "");
    const verdict = AI_VERDICTS.find(v => first.startsWith(v)) || null;
    const body = verdict ? (nl < 0 ? "" : t.slice(nl + 1).trim()) : t;
    return { verdict, body };
  },

  /* ---- 呼叫 API ---- */
  async call(system, user, maxTokens) {
    const { key, model } = AI.cfg();
    if (!key) throw new AIError("nokey");
    if (typeof navigator !== "undefined" && navigator.onLine === false) throw new AIError("offline");
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), AI.timeoutMs);
    let res;
    try {
      res = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch (e) {
      throw new AIError(e && e.name === "AbortError" ? "timeout" : "network");
    } finally {
      clearTimeout(timer);
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* 非 JSON 回應，下面依狀態碼處理 */ }
    if (!res.ok) {
      const apiMsg = AI.scrub(String((data && data.error && data.error.message) || ""), key);
      if (res.status === 401) throw new AIError("auth");
      if (res.status === 403) throw new AIError("forbidden", apiMsg);
      if (res.status === 429) throw new AIError("ratelimit");
      if (res.status === 404) throw new AIError("model", apiMsg);
      if (res.status === 400 && /credit|balance|billing/i.test(apiMsg)) throw new AIError("credit");
      if (res.status >= 500) throw new AIError("server");
      throw new AIError("bad", apiMsg);
    }
    const text = data && Array.isArray(data.content)
      ? data.content.filter(c => c && c.type === "text").map(c => c.text).join("").trim() : "";
    if (!text) throw new AIError("empty");
    return { text, model };
  },
  // 錯誤訊息中如果意外帶到金鑰就遮掉（INV-10）
  scrub(s, key) { return key ? String(s).split(key).join("***") : String(s); },
  errMsg(err) {
    const code = err && err.code;
    const msgs = {
      nokey: "還沒設定 API 金鑰，請到「我的 → 設定 → AI 解析」設定。",
      offline: "目前離線，連上網路後再試。",
      timeout: "AI 回應逾時（20 秒），請稍後重試。",
      network: "連不到 AI 服務，請檢查網路後重試。",
      auth: "API 金鑰無效或已被撤銷，請到設定頁重新輸入。",
      forbidden: "這把金鑰沒有使用權限。",
      ratelimit: "請求太頻繁或已達用量上限，請稍等一下再試。",
      credit: "API 額度不足，請到 Anthropic 主控台儲值或調整上限。",
      model: "找不到所選的模型，請到設定頁換一個模型。",
      server: "AI 服務暫時忙碌，請稍後重試。",
      empty: "AI 沒有回傳內容，請重試。",
      bad: "AI 服務拒絕了這次請求。"
    };
    const base = msgs[code] || "AI 解析失敗，請重試。";
    return err && err.detail ? `${base}（${err.detail.slice(0, 120)}）` : base;
  },

  /* ---- 取得解析（AI-02、AI-04）---- */
  async explain(ctx) {
    const { model } = AI.cfg();
    const ck = AI.cacheKey(ctx, model);
    const cache = AI.read(AI_CACHE_KEY, {});
    if (cache[ck]) return { verdict: cache[ck].v, body: cache[ck].b, model: cache[ck].m, cached: true };
    const { text } = await AI.call(AI_SYSTEM, AI.prompt(ctx), 900);
    const { verdict, body } = AI.parse(text);
    cache[ck] = { v: verdict, b: body, m: model, t: Date.now() };
    const keys = Object.keys(cache);
    if (keys.length > AI_CACHE_MAX) {
      keys.sort((a, b) => cache[a].t - cache[b].t).slice(0, keys.length - AI_CACHE_MAX).forEach(k => delete cache[k]);
    }
    AI.write(AI_CACHE_KEY, cache);
    if (verdict === "ALSO_CORRECT" || verdict === "KEY_WRONG") AI.flag(ctx, verdict, body, model);
    return { verdict, body, model, cached: false };
  },
  async test() {
    await AI.call("Reply with the single word OK.", "ping", 5);
    return "連線成功，金鑰可以使用。";
  },

  /* ---- 疑似有問題的題目（AI-03）---- */
  flags() { return AI.read(AI_FLAGS_KEY, []); },
  flag(ctx, verdict, reason, model) {
    const id = `${ctx.type}:${ctx.key}`;
    const list = AI.flags().filter(f => f.id !== id);
    list.push({
      id, type: ctx.type, key: String(ctx.key), q: ctx.q, opts: ctx.opts, ans: ctx.ans, chosen: ctx.chosen,
      verdict, reason: String(reason).slice(0, 1500), model, at: new Date().toISOString(),
      v: typeof APP_VERSION !== "undefined" ? APP_VERSION : "" // app.js 在 ai.js 之後載入，呼叫時才讀
    });
    AI.write(AI_FLAGS_KEY, list.slice(-AI_FLAGS_MAX));
  },
  clearFlags() { localStorage.removeItem(AI_FLAGS_KEY); },
  exportFlags() {
    const data = { app: "toeic900", kind: "ai-flags", exported: new Date().toISOString(), items: AI.flags() };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `toeic-AI疑似問題題目-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

/* ---- 畫面：答錯時的 AI 解析按鈕 ---- */
function aiBoxHTML() {
  return `<div class="ai-box"><button class="btn ghost small ai-btn" type="button">🤖 AI 解析：我選的為什麼不對</button><div class="ai-out" aria-live="polite"></div></div>`;
}
// root：包含 aiBoxHTML() 的容器；ctx 見 AI.prompt
function wireAIBox(root, ctx) {
  const box = root.querySelector(".ai-box");
  if (!box) return;
  const btn = box.querySelector(".ai-btn"), out = box.querySelector(".ai-out");
  const run = () => {
    btn.disabled = true;
    out.innerHTML = `<p class="muted ai-loading">AI 解析中…（可以先按下一題）</p>`;
    AI.explain(ctx).then(res => {
      if (!out.isConnected) return; // 已換題：不把舊回應寫到新畫面
      btn.remove();
      const warn = res.verdict === "ALSO_CORRECT" ? "AI 認為你選的答案可能也說得通（這題可能有兩個正解）。"
        : res.verdict === "KEY_WRONG" ? "AI 認為題庫標示的答案可能是錯的。" : "";
      out.innerHTML = `
        ${warn ? `<div class="ai-warn">⚠️ ${warn}AI 的判斷不一定正確，這題已記錄到「設定 → AI 解析」的疑似問題清單，作答紀錄不受影響。</div>` : ""}
        <div class="ai-text">${esc(res.body || "（AI 沒有提供說明）")}</div>
        <p class="ai-foot muted">由 ${esc(AI.modelLabel(res.model))} 產生，可能有誤；以題庫解析為準。${res.cached ? "（已存在本機，未再次呼叫）" : ""}</p>`;
    }).catch(err => {
      if (!out.isConnected) return;
      btn.disabled = false;
      out.innerHTML = `<p class="ai-err">${esc(AI.errMsg(err))}</p>`;
      btn.textContent = "🤖 重試 AI 解析";
    });
  };
  btn.addEventListener("click", run);
}
// 答錯且有金鑰時才放按鈕；插入畫面後要再呼叫 wireAIBox
function aiOffer(correct) { return !correct && AI.enabled() ? aiBoxHTML() : ""; }

/* ---- 設定頁的「AI 解析（試用）」區塊（AI-01、AI-03）---- */
function aiSettingsHTML() {
  const c = AI.cfg(), n = AI.flags().length;
  return `
    <div class="card" id="ai-card">
      <h2>🤖 AI 解析（試用）</h2>
      <p class="muted">答錯時可以按「AI 解析」，請 AI 說明你選的為什麼不對。需要你自己的
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Anthropic API 金鑰</a>，費用由金鑰帳戶支付（Haiku 4.5 每則約 0.3 美分）。</p>
      <div class="item-row">
        <div>API 金鑰：${c.key ? `<b>已設定</b> <span class="muted">（${esc(AI.maskedKey())}）</span>` : `<span class="muted">尚未設定</span>`}</div>
        ${c.key ? `<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn small secondary" id="ai-test">測試連線</button><button class="btn small ghost" id="ai-clear">刪除金鑰</button></div>` : ""}
      </div>
      <div class="item-row">
        <input type="password" id="ai-key" autocomplete="off" spellcheck="false" placeholder="${c.key ? "貼上新金鑰以更換" : "貼上 sk-ant- 開頭的金鑰"}" aria-label="Anthropic API 金鑰"
          style="flex:1;min-width:0;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit">
        <button class="btn small" id="ai-save">儲存</button>
      </div>
      <div class="item-row">
        <div>模型</div>
        <select id="ai-model" style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit">
          ${AI_MODELS.map(m => `<option value="${m.id}" ${c.model === m.id ? "selected" : ""}>${esc(m.label)}</option>`).join("")}
        </select>
      </div>
      <p class="muted" id="ai-status" aria-live="polite"></p>
      <div class="item-row">
        <div>AI 認為可能有問題的題目：<b>${n}</b> 題</div>
        <div style="display:flex;gap:6px">
          <button class="btn small secondary" id="ai-flags-export" ${n ? "" : "disabled"}>匯出</button>
          <button class="btn small ghost" id="ai-flags-clear" ${n ? "" : "disabled"}>清除</button>
        </div>
      </div>
      <ul class="muted ai-notes">
        <li>金鑰只存在這台裝置的瀏覽器，不會雲端同步，也不會放進備份檔；換裝置要重新輸入。</li>
        <li>只有按下「AI 解析」時才會送出：題目、選項、你選的答案和原有解析。不會送出學習紀錄或同步代碼。</li>
        <li>這台裝置上的瀏覽器擴充功能可能讀得到金鑰。建議在 Anthropic 主控台為這把金鑰設定每月用量上限；不用時可以在這裡刪除，並到主控台撤銷。</li>
        <li>AI 的說明可能有誤，以題庫解析為準；AI 的判定不會改變你的作答紀錄。</li>
      </ul>
    </div>`;
}
function wireAISettings(root, rerender) {
  const status = root.querySelector("#ai-status");
  const say = (msg, cls) => { status.textContent = msg; status.className = cls || "muted"; };
  root.querySelector("#ai-save").addEventListener("click", () => {
    const input = root.querySelector("#ai-key");
    const err = AI.setKey(input.value);
    input.value = "";
    if (err) { say(err, "ai-err"); return; }
    UI.toast("API 金鑰已儲存在這台裝置", "ok");
    rerender();
  });
  root.querySelector("#ai-model").addEventListener("change", e => {
    AI.setModel(e.target.value);
    UI.toast("AI 模型已更新為 " + AI.modelLabel(e.target.value), "ok");
  });
  const test = root.querySelector("#ai-test");
  if (test) test.addEventListener("click", () => {
    test.disabled = true;
    say("測試中…");
    AI.test().then(msg => say("✅ " + msg, "ai-ok")).catch(err => say(AI.errMsg(err), "ai-err"))
      .finally(() => { test.disabled = false; });
  });
  const clear = root.querySelector("#ai-clear");
  if (clear) clear.addEventListener("click", () => {
    if (!confirm("刪除這台裝置上的 API 金鑰？（不會撤銷金鑰本身，要撤銷請到 Anthropic 主控台）")) return;
    AI.clearKey();
    UI.toast("API 金鑰已刪除", "ok");
    rerender();
  });
  root.querySelector("#ai-flags-export").addEventListener("click", () => AI.exportFlags());
  root.querySelector("#ai-flags-clear").addEventListener("click", () => {
    if (!confirm("清除 AI 記錄的疑似問題清單？建議先匯出。")) return;
    AI.clearFlags();
    rerender();
  });
}
