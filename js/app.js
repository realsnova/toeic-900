/* ============ 狀態管理 ============ */
const STORE_KEY = "toeic900";

function defaultState() {
  return {
    exam: null,               // 考試日期 'YYYY-MM-DD'
    updatedAt: 0,              // 最後異動時間戳（雲端同步比對新舊用，不可為 undefined）
    vocab: {},                // word -> {i:間隔天數, e:難易係數, due:'YYYY-MM-DD', n:複習次數}
    cat: {},                  // Part5 類別 -> {r, w}
    lcat: {},                 // 聽力類別（Part 2 / Part 3/4）-> {r, w}
    racc: { r: 0, w: 0 },     // 閱讀總作答（估分用）
    daily: {},                // date -> {v, p5, p6, p7, l2, l34, newV}
    wb: { p5: {}, p6: {}, p7: {}, l2: {}, l34: {} }, // 錯題本
    p6done: {}, p7done: {}, l34done: {},
    mocks: [],                // 模擬考歷史 [{date, mode, L, R, parts, secs}]
    mockSeen: {}              // 模考出過的題（各類別索引），支撐不重複組卷
  };
}
let S = load();
function load() {
  const d = defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(d, parsed);
      // 舊版資料補齊新欄位
      d.wb = Object.assign({ p5: {}, p6: {}, p7: {}, l2: {}, l34: {} }, parsed.wb || {});
      d.lcat = parsed.lcat || {};
      d.racc = parsed.racc || { r: 0, w: 0 };
      d.l34done = parsed.l34done || {};
    }
  } catch (e) { /* 資料損毀時重置 */ }
  return d;
}
function save() {
  S.updatedAt = Date.now();
  localStorage.setItem(STORE_KEY, JSON.stringify(S));
  if (typeof Sync !== "undefined") Sync.schedulePush();
}

/* ============ 自訂題庫（一鍵擴增）============ */
const BANK_KEY = "toeic900_bank";
function emptyBank() { return { vocab: [], p5: [], p6: [], p7: [], l2: [], l34: [] }; }
function loadBank() {
  try {
    const raw = localStorage.getItem(BANK_KEY);
    if (raw) return Object.assign(emptyBank(), JSON.parse(raw));
  } catch (e) { /* 損毀時視為空 */ }
  return emptyBank();
}
function saveBank(b) { localStorage.setItem(BANK_KEY, JSON.stringify(b)); }
const BUILTIN = {}; // 內建題數（合併自訂題庫前記錄）
const BANK_ARRAYS = () => ({ vocab: VOCAB, p5: PART5, p6: PART6, p7: PART7, l2: PART2, l34: PART34 });
function mergeBank() {
  const arrs = BANK_ARRAYS();
  Object.keys(arrs).forEach(k => { BUILTIN[k] = arrs[k].length; });
  const b = loadBank();
  Object.keys(arrs).forEach(k => arrs[k].push(...b[k]));
}
const BANK_TYPES = {
  vocab: { name: "單字", unit: "個" },
  p5: { name: "Part 5 文法題", unit: "題" },
  p6: { name: "Part 6 段落填空", unit: "篇" },
  p7: { name: "Part 7 閱讀題組", unit: "組" },
  l2: { name: "聽力 Part 2 應答", unit: "題" },
  l34: { name: "聽力 Part 3/4 題組", unit: "組" }
};
// 驗證匯入項目的欄位
function validateItem(type, it) {
  const mcq = (q, n) => q && typeof q.q === "string" && Array.isArray(q.opts) && q.opts.length === n &&
    q.opts.every(o => typeof o === "string") && Number.isInteger(q.ans) && q.ans >= 0 && q.ans < n && typeof q.exp === "string";
  switch (type) {
    case "vocab": return ["w", "pos", "zh", "ex", "exZh"].every(k => typeof it[k] === "string" && it[k]);
    case "p5": return mcq(it, 4) && typeof it.cat === "string";
    case "p6": return typeof it.title === "string" && typeof it.text === "string" &&
      /___\[1\]___/.test(it.text) && Array.isArray(it.blanks) && it.blanks.length === 4 &&
      it.blanks.every(b => Array.isArray(b.opts) && b.opts.length === 4 && Number.isInteger(b.ans) && b.ans >= 0 && b.ans < 4 && typeof b.exp === "string");
    case "p7": return typeof it.title === "string" && typeof it.time === "number" &&
      Array.isArray(it.passages) && it.passages.every(p => typeof p === "string") &&
      Array.isArray(it.qs) && it.qs.length > 0 && it.qs.every(q => mcq(q, 4));
    case "l2": return mcq(it, 3);
    case "l34": return typeof it.type === "string" && typeof it.title === "string" &&
      Array.isArray(it.turns) && it.turns.every(t => ["M", "W", "N"].includes(t.s) && typeof t.t === "string") &&
      Array.isArray(it.qs) && it.qs.length > 0 && it.qs.every(q => mcq(q, 4));
  }
  return false;
}
// 去重的比對鍵
function itemKey(type, it) {
  if (type === "vocab") return it.w.toLowerCase().trim();
  if (type === "p5" || type === "l2") return it.q.toLowerCase().trim();
  return (it.title || "").toLowerCase().trim();
}
function importBank(type, text) {
  let raw = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  let arr;
  try { arr = JSON.parse(raw); } catch (e) { return { err: "JSON 格式錯誤，無法解析。請確認貼上的是完整的 JSON 陣列。" }; }
  if (!Array.isArray(arr)) return { err: "需要 JSON 陣列（以 [ 開頭、] 結尾）。" };
  const existing = new Set(BANK_ARRAYS()[type].map(it => itemKey(type, it)));
  let invalid = 0, dup = 0;
  const ok = [];
  arr.forEach(it => {
    if (!validateItem(type, it)) { invalid++; return; }
    const key = itemKey(type, it);
    if (existing.has(key)) { dup++; return; }
    existing.add(key);
    ok.push(it);
  });
  if (ok.length) {
    const b = loadBank();
    b[type].push(...ok);
    saveBank(b);
    BANK_ARRAYS()[type].push(...ok); // 立即生效
  }
  return { added: ok.length, invalid, dup };
}
// AI 擴充指令產生器
function aiPrompt(type, n) {
  const schemas = {
    vocab: `[{"w":"單字","pos":"詞性（如 v. / n. / adj.）","zh":"繁體中文意思","ex":"英文例句（商業情境）","exZh":"例句的繁體中文翻譯"}]`,
    p5: `[{"q":"含 ______ 空格的單句","opts":["正解","誘答1","誘答2","誘答3"],"ans":0,"cat":"從這些類別擇一：詞性、動詞時態、介係詞、連接詞、代名詞、詞彙、比較級、關係詞、分詞","exp":"繁體中文詳解"}]`,
    p6: `[{"title":"標題（如 電子郵件：xxx）","text":"含 ___[1]___ 至 ___[4]___ 四個空格的商用文章（email、公告、報導等，用 \\n 換行）","blanks":[{"opts":["正解","誘答1","誘答2","誘答3"],"ans":0,"exp":"繁體中文詳解"}]}]（blanks 恰好 4 個，其中 1 格為句子插入題）`,
    p7: `[{"title":"單篇：xxx 或 雙篇：xxx（標題1＋標題2）","time":建議秒數（單篇180、雙篇240、三篇300）,"passages":["文章1","文章2（雙篇以上才有）"],"qs":[{"q":"問題","opts":["正解","誘答1","誘答2","誘答3"],"ans":0,"exp":"繁體中文詳解"}]}]（每組 3–4 題，多篇題組須含至少 1 題跨篇整合題）`,
    l2: `[{"q":"口說問句或陳述句","opts":["最合適的回應（正解）","誘答1","誘答2"],"ans":0,"exp":"繁體中文詳解，說明陷阱類型（同字陷阱、Yes/No 陷阱、間接回應等）"}]`,
    l34: `[{"type":"Part 3 或 Part 4","title":"對話：xxx 或 短講：xxx","turns":[{"s":"M（男聲）、W（女聲）或 N（單人旁白）","t":"英文台詞"}],"qs":[{"q":"問題","opts":["正解","誘答1","誘答2","誘答3"],"ans":0,"exp":"繁體中文詳解"}]}]（Part 3 為 M/W 對話 4–6 輪；Part 4 為單一 N 的短講；每組恰好 3 題）`
  };
  const dedupe = {
    vocab: `\n6. 不可與以下已存在的單字重複：${VOCAB.map(v => v.w).join(", ")}`,
    p6: `\n6. 主題不可與以下已存在的篇章重複：${PART6.map(p => p.title).join("；")}`,
    p7: `\n6. 主題不可與以下已存在的題組重複：${PART7.map(p => p.title).join("；")}`,
    l34: `\n6. 主題不可與以下已存在的題組重複：${PART34.map(p => p.title).join("；")}`
  };
  return `請為目標 TOEIC 900 分以上的考生，產生 ${n} ${BANK_TYPES[type].unit}全新的 TOEIC ${BANK_TYPES[type].name}練習內容。

規則：
1. 只輸出一個 JSON 陣列，不要有任何其他文字、說明或 markdown 圍欄
2. ans 一律填 0（把正解放在 opts 的第一個位置，練習軟體顯示時會自動洗牌）
3. 詳解（exp）用繁體中文，且不可用 (A)(B)(C)(D) 字母指稱選項——選項會被洗牌——必須直接引用選項內容
4. 難度為 TOEIC 850–990 等級：多益商業情境（會議、出差、採購、客服、人事、行銷），誘答選項要有鑑別度（同字陷阱、形近字、文法陷阱、跨段推論）
5. 內容必須原創，英文自然道地${dedupe[type] || ""}

JSON 格式（務必完全一致）：
${schemas[type]}`;
}

/* ============ 工具 ============ */
function todayStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function daily() {
  const t = todayStr();
  if (!S.daily[t]) S.daily[t] = {};
  const d = S.daily[t];
  ["v", "p5", "p6", "p7", "l2", "l34", "newV"].forEach(k => { if (typeof d[k] !== "number") d[k] = 0; });
  return d;
}
function dayTotal(d) { return d ? (d.v || 0) + (d.p5 || 0) + (d.p6 || 0) + (d.p7 || 0) + (d.l2 || 0) + (d.l34 || 0) : 0; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function $(sel) { return document.querySelector(sel); }

/* ============ 備考階段引擎 ============ */
function examDate() {
  // 純讀取、不寫入：若在雲端同步比對完成前就 save()，會用空白的預設狀態搶先蓋掉雲端的真實進度
  return S.exam || todayStr(49); // 未設定時預設 7 週後
}
function daysLeft() {
  const ms = new Date(examDate()) - new Date(todayStr());
  return Math.round(ms / 86400000);
}
function phase() {
  const d = daysLeft();
  if (d > 35) return { name: "基礎期", icon: "🧱", desc: "補齊文法漏洞、建立聽力反應" };
  if (d > 14) return { name: "強化期", icon: "⚙️", desc: "攻克長對話與多篇閱讀" };
  return { name: "衝刺期", icon: "🚀", desc: "限時訓練、錯題清零、穩定節奏" };
}
function newPerDay() {
  const base = (typeof Settings !== "undefined" ? Settings.get("newPerDay") : 10) || 10;
  return phase().name === "衝刺期" ? Math.max(1, Math.round(base / 2)) : base;
}
// 各階段每日菜單（label, done 判斷, 跳轉分頁, 預估時間）
function todayPlan() {
  const d = daily(), ph = phase().name, due = dueCount(), wrongs = wrongCount();
  const base = [
    { label: "單字複習", detail: due ? `還有 ${due} 張卡片` : "今日完成！", done: due === 0, tab: "vocab", est: "15 分" },
    { label: "Part 5 文法 10 題", detail: `已完成 ${d.p5} 題`, done: d.p5 >= 10, tab: "p5", est: "8 分" }
  ];
  if (ph === "基礎期") return base.concat([
    { label: "聽力 Part 2 十題", detail: `已完成 ${d.l2} 題`, done: d.l2 >= 10, tab: "listen", est: "10 分" },
    { label: "Part 6 段落填空 1 篇", detail: `已完成 ${d.p6} 篇`, done: d.p6 >= 1, tab: "p6", est: "5 分" },
    { label: "Part 7 閱讀 1 篇", detail: `已完成 ${d.p7} 篇`, done: d.p7 >= 1, tab: "p7", est: "10 分" }
  ]);
  if (ph === "強化期") return base.concat([
    { label: "聽力 Part 3/4 兩組", detail: `已完成 ${d.l34} 組`, done: d.l34 >= 2, tab: "listen", est: "12 分" },
    { label: "Part 7 閱讀 2 篇（多篇優先）", detail: `已完成 ${d.p7} 篇`, done: d.p7 >= 2, tab: "p7", est: "18 分" },
    { label: "錯題本重考 5 題", detail: wrongs ? `錯題本還有 ${wrongs} 題` : "錯題本已清空！", done: wrongs === 0 || (d.wr || 0) >= 5, tab: "wrong", est: "6 分" }
  ]);
  return base.concat([ // 衝刺期
    { label: "聽力 Part 2 五題 + Part 3/4 一組", detail: `P2 ${d.l2} 題 · P3/4 ${d.l34} 組`, done: d.l2 >= 5 && d.l34 >= 1, tab: "listen", est: "12 分" },
    { label: "Part 7 限時 1 篇（多篇）", detail: `已完成 ${d.p7} 篇`, done: d.p7 >= 1, tab: "p7", est: "10 分" },
    { label: "錯題本全部清零", detail: wrongs ? `還剩 ${wrongs} 題` : "已清空！", done: wrongs === 0, tab: "wrong", est: "10 分" }
  ]);
}

/* ============ 語音合成（聽力播放）============ */
const TTS = {
  ok: "speechSynthesis" in window,
  voices: [],
  currentLang: "en-US", // 這一組播放（一題 Part2 / 一組 Part3-4）目前用的腔調
  init() {
    if (!TTS.ok) return;
    const pick = () => {
      TTS.voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
      if (typeof Accents !== "undefined") Accents.scan();
    };
    pick();
    speechSynthesis.onvoiceschanged = pick;
  },
  // 依「聽力腔調」設定，為即將播放的這一組音檔決定要用哪個腔調
  // auto=裝置預設；mixed=每組隨機挑一個可用腔調（仿真考試混腔）；否則固定使用指定腔調
  chooseLang() {
    if (typeof Accents === "undefined" || !Accents.ready) return "en-US";
    const avail = Accents.available();
    if (!avail.length) return "en-US";
    const setting = (typeof Settings !== "undefined" && Settings.get("accent")) || "auto";
    if (setting === "mixed") return avail[Math.floor(Math.random() * avail.length)];
    if (avail.includes(setting)) return setting;
    return avail[0];
  },
  voiceFor(speaker) {
    const pool = (typeof Accents !== "undefined" && Accents.pool[TTS.currentLang]) || TTS.voices;
    if (!pool.length) return null;
    // 盡量讓男女聲用不同語音
    if (speaker === "W") return pool.find(v => /female|zira|aria|jenny/i.test(v.name)) || pool[0];
    if (speaker === "M") return pool.find(v => /male|david|guy|mark/i.test(v.name)) || pool[pool.length - 1];
    return pool[0];
  },
  speak(text, speaker = "N", rate) {
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text);
      const v = TTS.voiceFor(speaker);
      if (v) u.voice = v;
      u.lang = TTS.currentLang;
      u.rate = rate || (typeof Settings !== "undefined" ? Settings.get("ttsRate") : 0.92) || 0.92;
      // 同一語音時用音高區分男女
      if (speaker === "W") u.pitch = 1.15;
      if (speaker === "M") u.pitch = 0.9;
      u.onend = res; u.onerror = res;
      speechSynthesis.speak(u);
    });
  },
  async seq(parts) {
    if (!TTS.ok) return;
    TTS.stop();
    TTS.currentLang = TTS.chooseLang(); // 整組（一題或一組對話）用同一個腔調，同步且在第一個 await 之前完成
    TTS.playing = true;
    for (const p of parts) {
      if (!TTS.playing) break;
      await TTS.speak(p.t, p.s, p.rate);
      await new Promise(r => setTimeout(r, p.pause == null ? 350 : p.pause));
    }
    TTS.playing = false;
  },
  stop() { if (TTS.ok) { TTS.playing = false; speechSynthesis.cancel(); } }
};
TTS.init();

/* ============ 分頁切換 ============ */
// 頂層導覽（nav 按鈕、底部導覽列都對應這 5 個）
const NAV_TABS = ["home", "practice", "mock", "wrong", "me"];
// 全部實際存在的內容區塊——頂層 5 個 + 練習/我的兩個 hub 內部的子頁面
const tabs = ["home", "practice", "vocab", "listen", "p5", "p6", "p7", "mock", "wrong", "me", "bank", "stats", "settings"];
const renderers = {};
let activeTimer = null;

// 子頁面所屬的 hub、與子頁面顯示用標題（給 subheader 返回鈕與首頁捷徑按鈕用）
const HUB_OF = { vocab: "practice", listen: "practice", p5: "practice", p6: "practice", p7: "practice", bank: "me", stats: "me", settings: "me" };
const HUB_LABELS = { practice: "練習", me: "我的" };
const TAB_TITLES = { vocab: "單字卡", listen: "聽力", p5: "Part 5 文法", p6: "Part 6 段落填空", p7: "Part 7 閱讀", stats: "統計", bank: "題庫/備份", settings: "設定" };

["nav", "bottomnav"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (btn) switchTab(btn.dataset.tab);
  });
});
// 顯示某個內容區塊並執行它的 renderer；子頁面會在頂端加一列「← 返回」，不需要更動各 renderer 內部邏輯
function showTab(name) {
  if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
  TTS.stop();
  tabs.forEach(t => document.getElementById("tab-" + t).classList.toggle("active", t === name));
  const sub = document.getElementById("subheader");
  if (sub) {
    const hub = HUB_OF[name];
    if (hub) {
      sub.style.display = "flex";
      document.getElementById("subheader-title").textContent = TAB_TITLES[name] || "";
      document.getElementById("subheader-hub").textContent = HUB_LABELS[hub] || "返回";
      document.getElementById("subheader-back").onclick = () => switchTab(hub);
    } else {
      sub.style.display = "none";
    }
  }
  renderers[name]();
}
// 給 nav / 底部導覽列用：切到頂層 5 區之一
function switchTab(name) {
  if (name !== "mock" && typeof Mock !== "undefined" && Mock.inProgress()) {
    Mock.confirmLeave(() => switchTab(name));
    return;
  }
  document.querySelectorAll("#nav button, #bottomnav button").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  showTab(name);
  updateNavBadges();
}
// 給「練習」「我的」兩個 hub 內的卡片用：進入子頁面，但 nav 高亮維持在該 hub 上
function enterSub(name, hubId) {
  if (typeof Mock !== "undefined" && Mock.inProgress()) {
    Mock.confirmLeave(() => enterSub(name, hubId));
    return;
  }
  document.querySelectorAll("#nav button, #bottomnav button").forEach(b => b.classList.toggle("active", b.dataset.tab === hubId));
  showTab(name);
  updateNavBadges();
}
function goTo(name) {
  if (NAV_TABS.includes(name)) switchTab(name);
  else enterSub(name, HUB_OF[name] || "home");
}
function updateNavBadges() {
  const due = dueCount();
  const wrongN = wrongCount();
  document.querySelectorAll('button[data-tab="practice"] .badge-slot').forEach(el => {
    el.innerHTML = due ? ` <span class="badge">${due}</span>` : "";
  });
  document.querySelectorAll('button[data-tab="wrong"] .badge-slot').forEach(el => {
    el.innerHTML = wrongN ? ` <span class="badge">${wrongN}</span>` : "";
  });
}
function dueCount() {
  const t = todayStr();
  const dueOld = Object.values(S.vocab).filter(c => c.due <= t).length;
  const newLeft = Math.max(0, newPerDay() - daily().newV);
  const unseen = VOCAB.filter(v => !S.vocab[v.w]).length;
  return dueOld + Math.min(newLeft, unseen);
}
function wrongCount() {
  return ["p5", "p6", "p7", "l2", "l34"].reduce((n, k) => n + Object.keys(S.wb[k]).length, 0);
}

/* ============ 首頁 ============ */
function streak() {
  let n = 0;
  for (let i = 0; ; i++) {
    const active = dayTotal(S.daily[todayStr(-i)]) > 0;
    if (active) n++;
    else if (i === 0) continue; // 今天還沒開始不中斷連續紀錄
    else break;
  }
  return n;
}
renderers.home = function () {
  const ph = phase();
  const dl = daysLeft();
  const plan = todayPlan();
  const doneCount = plan.filter(p => p.done).length;
  const est = scoreEstimate();
  $("#tab-home").innerHTML = `
    <div class="hero">
      <div class="stat-tile"><div class="num">${dl >= 0 ? dl : 0}</div><div class="lbl">距離考試（天）</div></div>
      <div class="stat-tile"><div class="num">${ph.icon} ${ph.name}</div><div class="lbl">${ph.desc}</div></div>
      <div class="stat-tile"><div class="num">🔥 ${streak()}</div><div class="lbl">連續學習天數</div></div>
      <div class="stat-tile"><div class="num">${doneCount}/${plan.length}</div><div class="lbl">今日任務</div></div>
    </div>
    ${backupDue() ? `<div class="card" style="border-color:var(--warn)">
      <div class="item-row" style="background:transparent;margin:0;padding:0">
        <div>💾 <b>${S.lastBackup ? "已超過 7 天未備份" : "尚未建立過備份"}</b><span class="muted"> · 清除瀏覽資料或換電腦會遺失紀錄</span></div>
        <button class="btn small" data-goto="bank">立即備份</button>
      </div></div>` : ""}
    <div class="card">
      <h2>📋 今日 60 分鐘菜單 <span class="muted">（${ph.name}自動生成）</span></h2>
      ${plan.map(p => `
        <div class="plan-item ${p.done ? "done" : ""}">
          <div><span class="check">${p.done ? "✅" : "⬜"}</span><b>${p.label}</b>
            <span class="muted"> · ${p.detail} · 約 ${p.est}</span></div>
          <button class="btn small ${p.done ? "secondary" : ""}" data-goto="${p.tab}">${p.done ? "再練" : "開始"}</button>
        </div>`).join("")}
      ${doneCount === plan.length ? `<p style="text-align:center;margin-top:12px">🎉 今日任務全數完成！</p>` : ""}
    </div>
    <div class="card">
      <h3>🎯 考試日期與預估分數</h3>
      <div class="item-row">
        <div>考試日期：<input type="date" id="exam-date" value="${examDate()}"
          style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:6px 10px;font-family:inherit"></div>
        <div>${est.ready ? `目前實力粗估：<b style="color:var(--accent)">L ${est.L} + R ${est.R} = ${est.L + est.R}</b>` : `<span class="muted">累積更多作答後將顯示預估分數</span>`}</div>
      </div>
      <p class="muted">計畫的三個階段（基礎→強化→衝刺）會依考試日期自動切換，改日期即重新規劃。</p>
    </div>
    <div class="card">
      <h3>💡 ${ph.name}重點</h3>
      <p class="muted">${phaseTips()}</p>
    </div>`;
  $("#tab-home").querySelectorAll("[data-goto]").forEach(b =>
    b.addEventListener("click", () => goTo(b.dataset.goto)));
  $("#exam-date").addEventListener("change", (e) => {
    if (e.target.value) { S.exam = e.target.value; save(); renderers.home(); }
  });
};
function phaseTips() {
  const p = phase().name;
  if (p === "基礎期") return "700 → 900 的第一步是把 Part 5 各文法類別正確率都拉到 85% 以上（看統計頁找弱項）。聽力 Part 2 專注辨認「間接回應」與同字陷阱——這是中級與高分的分水嶺。單字每天 10 個新字持續累積。";
  if (p === "強化期") return "把重心移到 Part 3/4（聽力配分最重）與 Part 7 多篇整合題。聽力先看題目再聽音檔、邊聽邊作答；閱讀練習「題目定位法」。錯題本每天清 5 題，別讓它累積。";
  return "考前兩週：不再學新內容，專注限時訓練與錯題清零。Part 5/6 全部 20 秒內作答，Part 7 每篇控制在建議時間內。考前一天只複習錯題本與單字，保持狀態。";
}
// 粗估分數（樣本量足夠才顯示）
function scoreEstimate() {
  let lr = 0, lw = 0;
  Object.values(S.lcat).forEach(s => { lr += s.r; lw += s.w; });
  const rTotal = S.racc.r + S.racc.w, lTotal = lr + lw;
  if (rTotal < 20 || lTotal < 15) return { ready: false };
  const curve = acc => Math.min(495, Math.max(5, Math.round(acc * 505 / 5) * 5));
  return { ready: true, L: curve(lr / lTotal), R: curve(S.racc.r / rTotal) };
}

/* ============ 單字卡（SRS 間隔重複）============ */
let vq = null; // 本次複習佇列
function buildVocabQueue() {
  const t = todayStr();
  const dueCards = VOCAB.filter(v => S.vocab[v.w] && S.vocab[v.w].due <= t);
  const newLeft = Math.max(0, newPerDay() - daily().newV);
  const newCards = VOCAB.filter(v => !S.vocab[v.w]).slice(0, newLeft);
  return shuffle(dueCards.concat(newCards));
}
renderers.vocab = function () {
  vq = buildVocabQueue();
  nextCard();
};
function speakWord(w) { if (TTS.ok) TTS.seq([{ t: w, s: "N", rate: 0.85 }]); }
function nextCard() {
  const box = $("#tab-vocab");
  if (!vq.length) {
    const learned = Object.keys(S.vocab).length;
    box.innerHTML = `
      <div class="card result-banner">
        <div style="font-size:3rem">🎉</div>
        <h2>今日單字複習完成！</h2>
        <p class="muted">已學習 ${learned} / ${VOCAB.length} 個單字。明天會依記憶曲線自動安排複習。</p>
        <br><button class="btn" id="v-more">加碼再學 5 個新單字</button>
      </div>`;
    const moreBtn = $("#v-more");
    const unseen = VOCAB.filter(v => !S.vocab[v.w]);
    if (!unseen.length) moreBtn.style.display = "none";
    moreBtn.addEventListener("click", () => {
      vq = shuffle(unseen.slice(0, 5));
      nextCard();
    });
    updateNavBadges();
    return;
  }
  const card = vq[0];
  const isNew = !S.vocab[card.w];
  box.innerHTML = `
    <p class="q-progress">剩餘 ${vq.length} 張 ${isNew ? "· 🆕 新單字" : "· 🔁 複習"}</p>
    <div class="flashcard" id="fc">
      <div class="word">${esc(card.w)} <button class="speak-btn" id="spk" title="發音" aria-label="播放單字發音">🔊</button></div>
      <div class="pos">${esc(card.pos)}</div>
      <div class="hint">點擊卡片顯示答案</div>
    </div>
    <div id="rating"></div>`;
  speakWord(card.w);
  $("#spk").addEventListener("click", (e) => { e.stopPropagation(); speakWord(card.w); });
  $("#fc").addEventListener("click", (e) => { if (e.target.id !== "spk") revealCard(card); });
}
function revealCard(card) {
  $("#fc").innerHTML = `
    <div class="word">${esc(card.w)} <button class="speak-btn" id="spk2" title="發音" aria-label="播放單字與例句發音">🔊</button></div>
    <div class="pos">${esc(card.pos)}</div>
    <div class="zh">${esc(card.zh)}</div>
    <div class="ex">${esc(card.ex)}</div>
    <div class="exzh">${esc(card.exZh)}</div>`;
  $("#spk2").addEventListener("click", (e) => {
    e.stopPropagation();
    if (TTS.ok) TTS.seq([{ t: card.w, s: "N", rate: 0.85, pause: 250 }, { t: card.ex, s: "N" }]);
  });
  const info = S.vocab[card.w];
  const e = info ? info.e : 2.5, i = info ? info.i : 0;
  const iv = {
    again: 0,
    hard: Math.max(1, Math.round(i * 1.2)) || 1,
    good: i ? Math.round(i * e) : 1,
    easy: i ? Math.round(i * e * 1.3) : 3
  };
  $("#rating").innerHTML = `
    <div class="rating-row">
      <button class="rate-again" data-r="again">忘記<span class="days">稍後再問</span></button>
      <button class="rate-hard" data-r="hard">模糊<span class="days">${iv.hard} 天後</span></button>
      <button class="rate-good" data-r="good">記得<span class="days">${iv.good} 天後</span></button>
      <button class="rate-easy" data-r="easy">簡單<span class="days">${iv.easy} 天後</span></button>
    </div>`;
  $("#rating").querySelectorAll("button").forEach(b =>
    b.addEventListener("click", () => rateCard(card, b.dataset.r, iv)));
}
function rateCard(card, r, iv) {
  const isNew = !S.vocab[card.w];
  if (isNew) { S.vocab[card.w] = { i: 0, e: 2.5, due: todayStr(), n: 0 }; daily().newV++; }
  const c = S.vocab[card.w];
  c.n++;
  daily().v++;
  if (r === "again") {
    c.e = Math.max(1.3, c.e - 0.2);
    c.i = 0; c.due = todayStr();
    vq.push(vq.shift()); // 移到佇列尾端再問一次
  } else {
    if (r === "easy") c.e = Math.min(3.0, c.e + 0.1);
    if (r === "hard") c.e = Math.max(1.3, c.e - 0.15);
    c.i = iv[r];
    c.due = todayStr(c.i);
    vq.shift();
  }
  save();
  nextCard();
}

/* ============ 通用選擇題渲染 ============ */
function renderMCQ(container, item, meta, onDone) {
  const order = shuffle(item.opts.map((_, i) => i));
  container.innerHTML = `
    ${meta.progress ? `<p class="q-progress">${meta.progress}</p>` : ""}
    <div class="q-text">${esc(item.q || "")}</div>
    <div class="opts">
      ${order.map((oi, pos) => `<button class="opt" data-oi="${oi}">(${"ABCD"[pos]}) ${esc(item.opts[oi])}</button>`).join("")}
    </div>
    <div class="feedback"></div>`;
  container.querySelectorAll(".opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = Number(btn.dataset.oi);
      const correct = chosen === item.ans;
      container.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        const oi = Number(b.dataset.oi);
        if (oi === item.ans) b.classList.add("correct");
        else if (oi === chosen) b.classList.add("incorrect");
      });
      container.querySelector(".feedback").innerHTML = `
        <div class="explain">
          ${meta.cat ? `<span class="tag">${esc(meta.cat)}</span><br>` : ""}
          <b>${correct ? "✅ 答對了！" : "❌ 答錯了"}</b> 正解：${esc(item.opts[item.ans])}<br>${esc(item.exp)}
        </div>`;
      onDone(correct);
    });
  });
}
// 只有裝置上偵測到 2 種以上腔調時才顯示標籤，避免對只有預設腔調的裝置造成無意義的雜訊
function accentTag() {
  if (typeof Accents === "undefined" || !Accents.ready || Accents.available().length <= 1) return "";
  return `<span class="pill accent-pill">🔊 ${esc(Accents.label(TTS.currentLang))}</span>`;
}
function trackReading(correct) { correct ? S.racc.r++ : S.racc.w++; }
function trackListening(cat, correct) {
  if (!S.lcat[cat]) S.lcat[cat] = { r: 0, w: 0 };
  correct ? S.lcat[cat].r++ : S.lcat[cat].w++;
}

/* ============ 聽力 ============ */
renderers.listen = function () {
  const box = $("#tab-listen");
  if (!TTS.ok) {
    box.innerHTML = `<div class="card"><h2>🎧 聽力訓練</h2><p class="muted">此瀏覽器不支援語音合成（speechSynthesis），請改用 Edge 或 Chrome。</p></div>`;
    return;
  }
  const l2acc = S.lcat["Part 2"] ? Math.round(S.lcat["Part 2"].r / (S.lcat["Part 2"].r + S.lcat["Part 2"].w) * 100) + "%" : "—";
  box.innerHTML = `
    <div class="card">
      <h2>🎧 Part 2 應答問題</h2>
      <p class="muted">聽問句與三個回應（不顯示文字），選出最合適的回應。專攻間接回應與同字陷阱。歷史正確率：${l2acc}</p>
      <br><button class="btn" id="l2-start">開始 10 題</button>
    </div>
    <div class="card">
      <h2>🎧 Part 3/4 對話與短講</h2>
      <p class="muted">先讀題目再聽音檔（男女聲自動區分），聽完作答，答完可看逐字稿。</p>
    </div>
    ${PART34.map((s, i) => {
      const best = S.l34done[i];
      return `<div class="item-row"><div><span class="pill">${esc(s.type)}</span> <b>${esc(s.title)}</b></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${best}/${s.qs.length}</span>` : `<span class="pill">未完成</span>`}
        <button class="btn small" data-l34="${i}">開始</button></div></div>`;
    }).join("")}`;
  $("#l2-start").addEventListener("click", startL2);
  box.querySelectorAll("[data-l34]").forEach(b =>
    b.addEventListener("click", () => startL34(Number(b.dataset.l34))));
};

/* ---- Part 2 ---- */
let l2s = null;
function l2Audio(item, order) {
  return [{ t: item.q, s: "N", pause: 700 }].concat(
    order.map((oi, pos) => [{ t: "ABCD"[pos] + ".", s: "N", pause: 150 }, { t: item.opts[oi], s: "N", pause: 500 }]).flat());
}
function startL2() {
  const wrongIds = shuffle(Object.keys(S.wb.l2).map(Number));
  const rest = shuffle(PART2.map((_, i) => i).filter(i => !S.wb.l2[i]));
  l2s = { ids: wrongIds.concat(rest).slice(0, 10), at: 0, right: 0 };
  l2Next();
}
function l2Next() {
  const s = l2s, box = $("#tab-listen");
  if (s.at >= s.ids.length) {
    box.innerHTML = `
      <div class="card result-banner">
        <div class="score">${s.right} / ${s.ids.length}</div>
        <p class="muted">${s.right === s.ids.length ? "全對！聽力反應很到位 🏆" : "答錯的題目已加入錯題本。"}</p>
        <br><button class="btn" id="l2-again">再來 10 題</button>
        <button class="btn secondary" id="l2-back">返回</button>
      </div>`;
    $("#l2-again").addEventListener("click", startL2);
    $("#l2-back").addEventListener("click", renderers.listen);
    updateNavBadges();
    return;
  }
  const id = s.ids[s.at];
  const item = PART2[id];
  const order = shuffle(item.opts.map((_, i) => i));
  box.innerHTML = `
    <div class="card">
      <p class="q-progress">第 ${s.at + 1} / ${s.ids.length} 題</p>
      <div style="text-align:center;padding:16px">
        <div style="font-size:2.4rem">🔊</div>
        <p class="muted">聆聽問句與 (A)(B)(C) 三個回應</p>
        <div id="l2-accent" style="margin-bottom:8px"></div>
        <button class="btn ghost small" id="l2-replay">↻ 重播</button>
      </div>
      <div class="rating-row" id="l2-abc">
        ${order.map((_, pos) => `<button style="background:var(--panel2);border:1px solid var(--border2)" data-pos="${pos}">${"ABC"[pos]}</button>`).join("")}
      </div>
      <div class="feedback"></div>
      <div id="l2-nav" style="text-align:right;margin-top:10px"></div>
    </div>`;
  const play = () => { TTS.seq(l2Audio(item, order)); $("#l2-accent").innerHTML = accentTag(); };
  play();
  $("#l2-replay").addEventListener("click", play);
  $("#l2-abc").querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      TTS.stop();
      const pos = Number(btn.dataset.pos);
      const correct = order[pos] === item.ans;
      const ansPos = order.indexOf(item.ans);
      $("#l2-abc").querySelectorAll("button").forEach((b, i) => {
        b.disabled = true;
        if (i === ansPos) b.style.background = "rgba(52,211,153,0.25)";
        else if (i === pos) b.style.background = "rgba(248,113,113,0.25)";
      });
      box.querySelector(".feedback").innerHTML = `
        <div class="explain">
          <span class="tag">Part 2</span><br>
          <b>${correct ? "✅ 答對了！" : "❌ 答錯了"}</b> 正解：(${"ABC"[ansPos]})<br>
          <b>Q:</b> ${esc(item.q)}<br>
          ${order.map((oi, p) => `<b>(${"ABC"[p]})</b> ${esc(item.opts[oi])}`).join("<br>")}<br><br>${esc(item.exp)}
        </div>`;
      trackListening("Part 2", correct);
      if (correct) delete S.wb.l2[id]; else S.wb.l2[id] = true;
      daily().l2++;
      if (correct) s.right++;
      save();
      $("#l2-nav").innerHTML = `<button class="btn" id="l2-nextbtn">下一題 →</button>`;
      $("#l2-nextbtn").addEventListener("click", () => { s.at++; l2Next(); });
    });
  });
}

/* ---- Part 3/4 ---- */
function l34Audio(set) {
  return set.turns.map(t => ({ t: t.t, s: t.s, pause: 450 }));
}
function startL34(si) {
  const set = PART34[si];
  const state = { at: 0, right: 0 };
  const box = $("#tab-listen");
  function render() {
    if (state.at >= set.qs.length) {
      S.l34done[si] = Math.max(S.l34done[si] || 0, state.right);
      daily().l34++;
      save();
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${set.qs.length}</div>
          <p class="muted">${state.right === set.qs.length ? "全對！🏆" : "答錯的題目已加入錯題本。"}</p>
        </div>
        <div class="card"><h3>📜 逐字稿</h3><div class="passage">${transcript(set)}</div>
          <div style="text-align:right"><button class="btn" id="l34-back">返回列表</button></div></div>`;
      $("#l34-back").addEventListener("click", renderers.listen);
      updateNavBadges();
      return;
    }
    box.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <h2>${esc(set.type)} · ${esc(set.title)}</h2>
          <button class="btn ghost small" id="l34-replay">↻ 重播音檔</button>
        </div>
        <p class="muted">先讀題目，音檔播放中即可作答。</p>
        <div id="l34-accent" style="margin:4px 0 8px"></div>
        <div id="l34-q"></div>
        <div id="l34-nav" style="text-align:right"></div>
      </div>`;
    const playL34 = () => { TTS.seq(l34Audio(set)); $("#l34-accent").innerHTML = accentTag(); };
    if (state.at === 0) playL34();
    $("#l34-replay").addEventListener("click", playL34);
    const q = set.qs[state.at];
    renderMCQ($("#l34-q"), q, { progress: `第 ${state.at + 1} / ${set.qs.length} 題` }, (correct) => {
      const key = `${si}-${state.at}`;
      trackListening("Part 3/4", correct);
      if (correct) { state.right++; delete S.wb.l34[key]; }
      else S.wb.l34[key] = true;
      save();
      $("#l34-nav").innerHTML = `<button class="btn" id="l34-nextbtn">${state.at + 1 >= set.qs.length ? "看結果與逐字稿" : "下一題"} →</button>`;
      $("#l34-nextbtn").addEventListener("click", () => { state.at++; render(); });
    });
  }
  render();
}
function transcript(set) {
  const name = { M: "男", W: "女", N: "" };
  return set.turns.map(t => `${t.s !== "N" ? `（${name[t.s]}）` : ""}${esc(t.t)}`).join("\n\n");
}

/* ============ Part 5 ============ */
let p5session = null;
renderers.p5 = function () { p5Menu(); };
function p5Menu() {
  $("#tab-p5").innerHTML = `
    <div class="card">
      <h2>📝 Part 5 單句文法快攻</h2>
      <p class="muted">每輪 10 題，附中文詳解。目標：每題 20 秒內作答。題庫共 ${PART5.length} 題，答錯自動進入錯題本。</p>
      <br><button class="btn" id="p5-start">開始 10 題挑戰</button>
    </div>
    <div class="card"><h3>各類別正確率</h3>${catBars()}</div>`;
  $("#p5-start").addEventListener("click", startP5);
}
function catBars() {
  const cats = Object.entries(S.cat);
  if (!cats.length) return `<p class="muted">尚無作答紀錄</p>`;
  return cats.map(([c, s]) => {
    const total = s.r + s.w, pct = total ? Math.round(s.r / total * 100) : 0;
    return `<div class="bar-row"><span class="lbl">${esc(c)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="val">${pct}%（${s.r}/${total}）</span></div>`;
  }).join("");
}
function startP5() {
  const wrongIds = Object.keys(S.wb.p5).map(Number);
  const rest = shuffle(PART5.map((_, i) => i).filter(i => !wrongIds.includes(i)));
  p5session = { ids: shuffle(wrongIds).concat(rest).slice(0, 10), at: 0, right: 0, t0: Date.now() };
  p5Next();
}
function p5Next() {
  const s = p5session;
  if (s.at >= s.ids.length) {
    const secs = Math.round((Date.now() - s.t0) / 1000);
    $("#tab-p5").innerHTML = `
      <div class="card result-banner">
        <div class="score">${s.right} / ${s.ids.length}</div>
        <p>用時 ${Math.floor(secs / 60)} 分 ${secs % 60} 秒（平均 ${Math.round(secs / s.ids.length)} 秒/題，目標 ≤20 秒）</p>
        <p class="muted">${s.right === s.ids.length ? "全對！900+ 的水準！🏆" : "答錯的題目已加入錯題本，記得複習。"}</p>
        <br><button class="btn" id="p5-again">再來 10 題</button>
        <button class="btn secondary" id="p5-back">返回</button>
      </div>`;
    $("#p5-again").addEventListener("click", startP5);
    $("#p5-back").addEventListener("click", p5Menu);
    updateNavBadges();
    return;
  }
  const id = s.ids[s.at];
  const item = PART5[id];
  const box = $("#tab-p5");
  box.innerHTML = `<div class="card" id="p5-q"></div><div id="p5-nav" style="text-align:right"></div>`;
  renderMCQ($("#p5-q"), item, { progress: `第 ${s.at + 1} / ${s.ids.length} 題`, cat: item.cat }, (correct) => {
    if (!S.cat[item.cat]) S.cat[item.cat] = { r: 0, w: 0 };
    if (correct) { S.cat[item.cat].r++; s.right++; delete S.wb.p5[id]; }
    else { S.cat[item.cat].w++; S.wb.p5[id] = true; }
    trackReading(correct);
    daily().p5++;
    save();
    $("#p5-nav").innerHTML = `<button class="btn" id="p5-nextbtn">下一題 →</button>`;
    $("#p5-nextbtn").addEventListener("click", () => { s.at++; p5Next(); });
  });
}

/* ============ Part 6 ============ */
renderers.p6 = function () {
  $("#tab-p6").innerHTML = `
    <div class="card">
      <h2>📄 Part 6 段落填空</h2>
      <p class="muted">每篇 4 格，包含文法、詞彙與句子插入題。</p>
    </div>
    ${PART6.map((p, i) => {
      const best = S.p6done[i];
      return `<div class="item-row"><div><b>${esc(p.title)}</b></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${best}/4</span>` : `<span class="pill">未完成</span>`}
        <button class="btn small" data-p6="${i}">練習</button></div></div>`;
    }).join("")}`;
  $("#tab-p6").querySelectorAll("[data-p6]").forEach(b =>
    b.addEventListener("click", () => startP6(Number(b.dataset.p6))));
};
function startP6(pi) {
  const p = PART6[pi];
  const state = { at: 0, right: 0 };
  function renderBlank() {
    const box = $("#tab-p6");
    if (state.at >= p.blanks.length) {
      S.p6done[pi] = Math.max(S.p6done[pi] || 0, state.right);
      daily().p6++;
      save();
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${p.blanks.length}</div>
          <p class="muted">${state.right === p.blanks.length ? "全對！🏆" : "答錯的空格已加入錯題本。"}</p>
          <br><button class="btn" id="p6-back">返回列表</button>
        </div>`;
      $("#p6-back").addEventListener("click", renderers.p6);
      updateNavBadges();
      return;
    }
    const marked = esc(p.text).replace(/___\[(\d)\]___/g, (m, n) =>
      Number(n) === state.at + 1 ? `<mark>___[${n}]___</mark>` : `___[${n}]___`);
    box.innerHTML = `
      <div class="card">
        <h2>${esc(p.title)}</h2>
        <div class="passage">${marked}</div>
        <div id="p6-q"></div>
        <div id="p6-nav" style="text-align:right"></div>
      </div>`;
    const blank = p.blanks[state.at];
    renderMCQ($("#p6-q"), { q: `空格 [${state.at + 1}] 應填入：`, opts: blank.opts, ans: blank.ans, exp: blank.exp },
      { progress: `空格 ${state.at + 1} / ${p.blanks.length}` }, (correct) => {
        const key = `${pi}-${state.at}`;
        if (correct) { state.right++; delete S.wb.p6[key]; }
        else S.wb.p6[key] = true;
        trackReading(correct);
        save();
        $("#p6-nav").innerHTML = `<button class="btn" id="p6-nextbtn">繼續 →</button>`;
        $("#p6-nextbtn").addEventListener("click", () => { state.at++; renderBlank(); });
      });
  }
  renderBlank();
}

/* ============ Part 7 ============ */
renderers.p7 = function () {
  $("#tab-p7").innerHTML = `
    <div class="card">
      <h2>📚 Part 7 限時閱讀</h2>
      <p class="muted">含單篇、雙篇與三篇整合題。計時器幫你養成 900+ 的答題節奏——超時會變紅但不會中斷作答。</p>
    </div>
    ${PART7.map((p, i) => {
      const best = S.p7done[i];
      return `<div class="item-row"><div><b>${esc(p.title)}</b><br>
        <span class="muted">${p.qs.length} 題 · 建議 ${Math.round(p.time / 60)} 分鐘</span></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${best}/${p.qs.length}</span>` : `<span class="pill">未完成</span>`}
        <button class="btn small" data-p7="${i}">開始</button></div></div>`;
    }).join("")}`;
  $("#tab-p7").querySelectorAll("[data-p7]").forEach(b =>
    b.addEventListener("click", () => startP7(Number(b.dataset.p7))));
};
function startP7(si) {
  const set = PART7[si];
  const state = { at: 0, right: 0, left: set.time };
  const box = $("#tab-p7");
  box.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <h2>${esc(set.title)}</h2><span class="timer" id="p7-timer"></span>
      </div>
      ${set.passages.map((t, i) => `
        ${set.passages.length > 1 ? `<h3>文章 ${i + 1}</h3>` : ""}
        <div class="passage">${esc(t)}</div>`).join("")}
      <div id="p7-q"></div>
      <div id="p7-nav" style="text-align:right"></div>
    </div>`;
  function tick() {
    state.left--;
    const el = $("#p7-timer");
    if (!el) { clearInterval(activeTimer); activeTimer = null; return; }
    const abs = Math.abs(state.left);
    el.textContent = `${state.left < 0 ? "超時 " : "⏱ "}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
    el.classList.toggle("over", state.left < 0);
  }
  activeTimer = setInterval(tick, 1000);
  state.left++; tick();
  function renderQ() {
    if (state.at >= set.qs.length) {
      if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
      S.p7done[si] = Math.max(S.p7done[si] || 0, state.right);
      daily().p7++;
      save();
      const used = set.time - state.left;
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${set.qs.length}</div>
          <p>用時 ${Math.floor(used / 60)} 分 ${used % 60} 秒（建議 ${Math.round(set.time / 60)} 分鐘）</p>
          <p class="muted">${state.right === set.qs.length ? "全對！閱讀力已達高分水準 🏆" : "答錯的題目已加入錯題本。"}</p>
          <br><button class="btn" id="p7-back">返回列表</button>
        </div>`;
      $("#p7-back").addEventListener("click", renderers.p7);
      updateNavBadges();
      return;
    }
    const q = set.qs[state.at];
    renderMCQ($("#p7-q"), q, { progress: `第 ${state.at + 1} / ${set.qs.length} 題` }, (correct) => {
      const key = `${si}-${state.at}`;
      if (correct) { state.right++; delete S.wb.p7[key]; }
      else S.wb.p7[key] = true;
      trackReading(correct);
      save();
      $("#p7-nav").innerHTML = `<button class="btn" id="p7-nextbtn">下一題 →</button>`;
      $("#p7-nextbtn").addEventListener("click", () => { state.at++; renderQ(); $("#p7-nav").innerHTML = ""; });
    });
  }
  renderQ();
}

/* ============ 錯題本 ============ */
renderers.wrong = function () {
  const entries = [];
  Object.keys(S.wb.p5).forEach(id => entries.push({ type: "p5", key: id, label: `Part 5 · ${PART5[id].cat}`, text: PART5[id].q }));
  Object.keys(S.wb.p6).forEach(key => {
    const [pi, bi] = key.split("-").map(Number);
    entries.push({ type: "p6", key, label: `Part 6 · ${PART6[pi].title}`, text: `空格 [${bi + 1}]` });
  });
  Object.keys(S.wb.p7).forEach(key => {
    const [si, qi] = key.split("-").map(Number);
    entries.push({ type: "p7", key, label: `Part 7 · ${PART7[si].title}`, text: PART7[si].qs[qi].q });
  });
  Object.keys(S.wb.l2).forEach(id => entries.push({ type: "l2", key: id, label: `聽力 Part 2`, text: "應答問題（重新聆聽作答）" }));
  Object.keys(S.wb.l34).forEach(key => {
    const [si, qi] = key.split("-").map(Number);
    entries.push({ type: "l34", key, label: `聽力 · ${PART34[si].title}`, text: PART34[si].qs[qi].q });
  });
  const box = $("#tab-wrong");
  if (!entries.length) {
    box.innerHTML = `<div class="card result-banner"><div style="font-size:3rem">✨</div>
      <h2>錯題本是空的</h2><p class="muted">答錯的題目會自動收錄到這裡，重新答對即可移除。</p></div>`;
    return;
  }
  box.innerHTML = `
    <div class="card"><h2>📕 錯題本（${entries.length} 題）</h2>
    <p class="muted">重新作答並答對即可從錯題本移除。${phase().name === "衝刺期" ? "衝刺期目標：每天清零！" : ""}</p></div>
    ${entries.map((e, i) => `
      <div class="item-row"><div style="flex:1"><span class="pill">${esc(e.label)}</span><br>
        <span class="muted">${esc(e.text.slice(0, 80))}${e.text.length > 80 ? "…" : ""}</span></div>
        <button class="btn small" data-retry="${i}">重新挑戰</button></div>`).join("")}
    <div id="wrong-quiz"></div>`;
  box.querySelectorAll("[data-retry]").forEach(b =>
    b.addEventListener("click", () => retryWrong(entries[Number(b.dataset.retry)])));
};
function retryWrong(entry) {
  const d = daily();
  const box = $("#wrong-quiz");
  box.innerHTML = `<div class="card" id="wq-inner"></div>`;
  box.scrollIntoView({ behavior: "smooth" });
  const finish = (correct) => {
    if (correct) delete S.wb[entry.type][entry.key];
    d.wr = (d.wr || 0) + 1;
    save();
    $("#wq-nav").innerHTML = `
      <p class="muted" style="text-align:left">${correct ? "✅ 已從錯題本移除！" : "還沒完全掌握，題目保留在錯題本。"}</p>
      <button class="btn" id="wq-back">返回錯題本</button>`;
    $("#wq-back").addEventListener("click", renderers.wrong);
  };
  // 聽力 Part 2：重新播放音檔作答
  if (entry.type === "l2") {
    const item = PART2[entry.key];
    const order = shuffle(item.opts.map((_, i) => i));
    const inner = $("#wq-inner");
    inner.innerHTML = `
      <div style="text-align:center;padding:12px"><div style="font-size:2rem">🔊</div>
        <button class="btn ghost small" id="wq-replay">↻ 重播</button></div>
      <div class="rating-row" id="wq-abc">
        ${order.map((_, pos) => `<button style="background:var(--panel2);border:1px solid var(--border2)" data-pos="${pos}">${"ABC"[pos]}</button>`).join("")}
      </div>
      <div class="feedback"></div><div id="wq-nav" style="text-align:right;margin-top:10px"></div>`;
    const play = () => TTS.seq(l2Audio(item, order));
    play();
    $("#wq-replay").addEventListener("click", play);
    inner.querySelectorAll("#wq-abc button").forEach(btn => {
      btn.addEventListener("click", () => {
        TTS.stop();
        const pos = Number(btn.dataset.pos);
        const correct = order[pos] === item.ans;
        const ansPos = order.indexOf(item.ans);
        inner.querySelectorAll("#wq-abc button").forEach((b, i) => {
          b.disabled = true;
          if (i === ansPos) b.style.background = "rgba(52,211,153,0.25)";
          else if (i === pos) b.style.background = "rgba(248,113,113,0.25)";
        });
        inner.querySelector(".feedback").innerHTML = `<div class="explain">
          <b>${correct ? "✅ 答對了！" : "❌ 答錯了"}</b> 正解：(${"ABC"[ansPos]})<br>
          <b>Q:</b> ${esc(item.q)}<br>${order.map((oi, p) => `<b>(${"ABC"[p]})</b> ${esc(item.opts[oi])}`).join("<br>")}<br><br>${esc(item.exp)}</div>`;
        trackListening("Part 2", correct);
        finish(correct);
      });
    });
    return;
  }
  let item, meta = {}, passageHtml = "", audio = null;
  if (entry.type === "p5") {
    item = PART5[entry.key];
    meta.cat = item.cat;
  } else if (entry.type === "p6") {
    const [pi, bi] = entry.key.split("-").map(Number);
    const blank = PART6[pi].blanks[bi];
    item = { q: `空格 [${bi + 1}] 應填入：`, opts: blank.opts, ans: blank.ans, exp: blank.exp };
    passageHtml = `<div class="passage">${esc(PART6[pi].text)}</div>`;
  } else if (entry.type === "l34") {
    const [si, qi] = entry.key.split("-").map(Number);
    item = PART34[si].qs[qi];
    audio = PART34[si];
    passageHtml = `<div style="text-align:center;padding:8px"><button class="btn ghost small" id="wq-replay">🔊 播放音檔</button></div>`;
  } else {
    const [si, qi] = entry.key.split("-").map(Number);
    item = PART7[si].qs[qi];
    passageHtml = PART7[si].passages.map(t => `<div class="passage">${esc(t)}</div>`).join("");
  }
  const inner = $("#wq-inner");
  inner.innerHTML = `${passageHtml}<div id="wq-q"></div><div id="wq-nav" style="text-align:right"></div>`;
  if (audio) {
    TTS.seq(l34Audio(audio));
    $("#wq-replay").addEventListener("click", () => TTS.seq(l34Audio(audio)));
  }
  renderMCQ($("#wq-q"), item, meta, (correct) => {
    if (entry.type === "l34") trackListening("Part 3/4", correct);
    finish(correct);
  });
}

/* ============ 題庫管理與備份 ============ */
function backupDue() {
  const hasData = Object.keys(S.vocab).length > 0 || Object.values(S.daily).some(d => dayTotal(d) > 0);
  if (!hasData) return false;
  if (!S.lastBackup) return true;
  return (new Date(todayStr()) - new Date(S.lastBackup)) / 86400000 >= 7;
}
function exportBackup() {
  const data = { app: "toeic900", version: 1, exported: new Date().toISOString(), records: S, bank: loadBank() };
  const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `toeic-備份-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  S.lastBackup = todayStr();
  save();
  renderers.bank();
}
function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.app !== "toeic900" || !data.records) { alert("這不是本軟體的備份檔。"); return; }
      if (!confirm("還原備份會覆蓋目前的學習紀錄與自訂題庫，確定繼續？")) return;
      localStorage.setItem(STORE_KEY, JSON.stringify(data.records));
      localStorage.setItem(BANK_KEY, JSON.stringify(Object.assign(emptyBank(), data.bank || {})));
      location.reload();
    } catch (e) { alert("備份檔讀取失敗：" + e.message); }
  };
  reader.readAsText(file);
}
renderers.bank = function () {
  const b = loadBank();
  const arrs = BANK_ARRAYS();
  const rows = Object.keys(BANK_TYPES).map(k => {
    const total = arrs[k].length, custom = b[k].length;
    return `<div class="bar-row"><span class="lbl">${BANK_TYPES[k].name}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, total)}%"></div></div>
      <span class="val" style="width:150px">${total} ${BANK_TYPES[k].unit}（內建 ${BUILTIN[k]}＋自訂 ${custom}）</span></div>`;
  }).join("");
  const defaultN = { vocab: 30, p5: 15, p6: 3, p7: 3, l2: 10, l34: 3 };
  $("#tab-bank").innerHTML = `
    <div class="card"><h2>📦 題庫規模</h2>${rows}</div>
    <div class="card">
      <h2>✨ 一鍵擴增題庫</h2>
      <p class="muted">三步驟：① 選類型按「產生擴充指令」並複製 → ② 貼給 Claude（或任何 AI）→ ③ 把 AI 回覆的 JSON 貼到下方按「匯入」。新題目立即加入練習輪替，換題型時重複相同步驟即可。</p><br>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select id="bank-type" style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit">
          ${Object.keys(BANK_TYPES).map(k => `<option value="${k}">${BANK_TYPES[k].name}</option>`).join("")}
        </select>
        <label class="muted">數量 <input type="number" id="bank-n" value="30" min="1" max="100"
          style="width:64px;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit"></label>
        <button class="btn" id="bank-gen">產生擴充指令</button>
      </div>
      <div id="bank-prompt-area" style="display:none;margin-top:12px">
        <textarea id="bank-prompt" readonly rows="7"
          style="width:100%;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:10px;padding:10px;font-family:inherit;font-size:0.85rem"></textarea>
        <div style="text-align:right;margin-top:6px"><button class="btn small" id="bank-copy">📋 複製指令</button></div>
      </div>
      <hr style="border-color:var(--border);margin:16px 0">
      <p class="muted">把 AI 產生的 JSON 貼到這裡：</p>
      <textarea id="bank-paste" rows="5" placeholder='[{"w":"...", ...}]'
        style="width:100%;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:10px;padding:10px;font-family:inherit;font-size:0.85rem;margin-top:6px"></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px;flex-wrap:wrap">
        <span class="muted" id="bank-result"></span>
        <button class="btn" id="bank-import">匯入題庫</button>
      </div>
    </div>
    <div class="card">
      <h2>☁️ 雲端同步（讓手機與電腦看到同一套進度）</h2>
      ${!Sync.ready ? `
        <p class="muted">尚未設定雲端同步。設定步驟請見 README.md「雲端同步設定」一節（約 3 分鐘，需要一個免費 Google 帳號建立 Firebase 專案）。設定完成前，各裝置的紀錄各自獨立，可用上方「匯出/匯入備份檔」手動搬移。</p>` : `
        <p class="muted">
          目前同步代碼：<b>${Sync.code ? esc(Sync.code) : "尚未設定"}</b>
          ${Sync.lastSynced ? `上次同步：${Sync.lastSynced.toLocaleTimeString("zh-TW")}` : ""}
        </p>
        <p class="muted">在第一台裝置按「產生新代碼」，然後把代碼抄到第二台裝置的輸入框按「套用」——兩台裝置從此自動同步（存檔後約 1.5 秒推送雲端，開啟頁面時自動抓取最新進度）。</p><br>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input id="sync-code-input" value="${esc(Sync.code)}" placeholder="貼上同步代碼，如 ab3de-f7gh9"
            style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit;min-width:180px">
          <button class="btn small" id="sync-apply">套用</button>
          <button class="btn secondary small" id="sync-gen">產生新代碼</button>
          ${Sync.code ? `<button class="btn ghost small" id="sync-now">立即同步</button><button class="btn ghost small" id="sync-clear">解除此裝置同步</button>` : ""}
        </div>
        <p class="muted" id="sync-status" style="margin-top:8px"></p>`}
    </div>
    <div class="card">
      <h2>💾 備份與還原</h2>
      <p class="muted">紀錄每次作答都會即時自動存檔到瀏覽器（localStorage），但清除瀏覽資料或換電腦會遺失——請定期匯出備份檔。上次備份：<b>${S.lastBackup || "從未備份"}</b>${backupDue() ? ' <span style="color:var(--warn)">（建議立即備份）</span>' : ""}</p><br>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn" id="bk-export">⬇️ 匯出備份檔（學習紀錄＋自訂題庫）</button>
        <label class="btn secondary" style="cursor:pointer">⬆️ 匯入備份檔還原<input type="file" id="bk-import" accept=".json" style="display:none"></label>
      </div>
    </div>
    <div class="card">
      <h3>自訂題庫管理</h3>
      <p class="muted">匯入的題目與內建題庫一起輪替出題。若匯入了品質不佳的內容，可整批清除自訂題庫（不影響內建題庫與學習紀錄）。</p><br>
      <button class="btn ghost small" id="bank-clear">清除全部自訂題庫</button>
    </div>`;
  $("#bank-gen").addEventListener("click", () => {
    const type = $("#bank-type").value;
    const n = Math.max(1, Math.min(100, Number($("#bank-n").value) || defaultN[type]));
    $("#bank-prompt").value = aiPrompt(type, n);
    $("#bank-prompt-area").style.display = "block";
  });
  $("#bank-type").addEventListener("change", () => { $("#bank-n").value = defaultN[$("#bank-type").value]; });
  $("#bank-copy").addEventListener("click", async () => {
    const ta = $("#bank-prompt");
    ta.select();
    try { await navigator.clipboard.writeText(ta.value); } catch (e) { document.execCommand("copy"); }
    $("#bank-copy").textContent = "✅ 已複製";
    setTimeout(() => { const btn = $("#bank-copy"); if (btn) btn.textContent = "📋 複製指令"; }, 1500);
  });
  $("#bank-import").addEventListener("click", () => {
    const type = $("#bank-type").value;
    const text = $("#bank-paste").value;
    if (!text.trim()) { $("#bank-result").textContent = "請先貼上 JSON 內容"; return; }
    const r = importBank(type, text);
    if (r.err) { $("#bank-result").textContent = "❌ " + r.err; return; }
    $("#bank-paste").value = "";
    save(); // 讓自訂題庫的變更也觸發雲端同步
    renderers.bank(); // 重新渲染以更新題庫規模
    $("#bank-result").textContent = `✅ 已匯入 ${r.added} ${BANK_TYPES[type].unit}${BANK_TYPES[type].name}` +
      (r.dup ? `，跳過重複 ${r.dup} 筆` : "") + (r.invalid ? `，格式不符 ${r.invalid} 筆` : "");
    updateNavBadges();
  });
  if (Sync.ready) {
    $("#sync-apply").addEventListener("click", async () => {
      const v = $("#sync-code-input").value.trim();
      if (!v) return;
      Sync.setCode(v);
      $("#sync-status").textContent = "同步中…";
      const changed = await Sync.pullOnStartup();
      if (!changed) await Sync.pushNow();
      mergeBank();
      renderers.bank();
      updateNavBadges();
    });
    $("#sync-gen").addEventListener("click", async () => {
      Sync.setCode(Sync.genCode());
      await Sync.pushNow();
      renderers.bank();
    });
    if (Sync.code) {
      $("#sync-now").addEventListener("click", async () => {
        $("#sync-status").textContent = "同步中…";
        await Sync.pushNow();
        renderers.bank();
      });
      $("#sync-clear").addEventListener("click", () => {
        if (confirm("解除後，這台裝置將不再與其他裝置同步（雲端資料不會被刪除）。確定嗎？")) {
          Sync.clearCode();
          renderers.bank();
        }
      });
    }
  }
  $("#bk-export").addEventListener("click", exportBackup);
  $("#bk-import").addEventListener("change", (e) => { if (e.target.files[0]) importBackupFile(e.target.files[0]); });
  $("#bank-clear").addEventListener("click", () => {
    if (confirm("確定清除全部自訂題庫？（內建題庫與學習紀錄不受影響）")) {
      saveBank(emptyBank());
      save(); // 同步空題庫到雲端，避免下次同步又抓回來
      location.reload();
    }
  });
};

/* ============ 統計 ============ */
renderers.stats = function () {
  const cards = Object.values(S.vocab);
  const mastered = cards.filter(c => c.i >= 21).length;
  const learning = cards.length - mastered;
  const unseen = VOCAB.length - cards.length;
  const est = scoreEstimate();
  const rTotal = S.racc.r + S.racc.w;
  const rAcc = rTotal ? Math.round(S.racc.r / rTotal * 100) : 0;

  // 近 14 天活動熱圖
  const heat = [];
  for (let i = 13; i >= 0; i--) {
    const n = dayTotal(S.daily[todayStr(-i)]);
    const lvl = n === 0 ? "" : n < 10 ? "l1" : n < 30 ? "l2" : "l3";
    heat.push(`<div class="cell ${lvl}" title="${todayStr(-i)}：${n} 項">${Number(todayStr(-i).slice(8))}</div>`);
  }
  const vocabPct = (n) => VOCAB.length ? Math.round(n / VOCAB.length * 100) : 0;
  const lBars = Object.entries(S.lcat).map(([c, s]) => {
    const total = s.r + s.w, pct = total ? Math.round(s.r / total * 100) : 0;
    return `<div class="bar-row"><span class="lbl">${esc(c)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="val">${pct}%（${s.r}/${total}）</span></div>`;
  }).join("") || `<p class="muted">尚無聽力作答紀錄</p>`;
  $("#tab-stats").innerHTML = `
    <div class="hero">
      <div class="stat-tile"><div class="num">🔥 ${streak()}</div><div class="lbl">連續學習天數</div></div>
      <div class="stat-tile"><div class="num">${est.ready ? est.L + est.R : "—"}</div><div class="lbl">預估總分（L${est.ready ? est.L : "?"} + R${est.ready ? est.R : "?"}）</div></div>
      <div class="stat-tile"><div class="num">${rAcc}%</div><div class="lbl">閱讀正確率</div></div>
      <div class="stat-tile"><div class="num">${mastered}</div><div class="lbl">已精通單字</div></div>
    </div>
    ${est.ready ? `<div class="card"><p class="muted">⚠️ 預估分數以練習正確率粗略換算，僅供追蹤趨勢；實測含時間壓力與體力因素，通常略低。</p></div>` : ""}
    <div class="card">
      <h2>📅 近 14 天學習熱圖</h2>
      <div class="heat">${heat.join("")}</div>
    </div>
    <div class="card"><h2>🎧 聽力各類別正確率</h2>${lBars}</div>
    <div class="card"><h2>🧩 Part 5 各文法類別正確率</h2>${catBars()}</div>
    <div class="card">
      <h2>📖 單字掌握進度</h2>
      <div class="bar-row"><span class="lbl">已精通</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(mastered)}%"></div></div><span class="val">${mastered}</span></div>
      <div class="bar-row"><span class="lbl">學習中</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(learning)}%;background:var(--warn)"></div></div><span class="val">${learning}</span></div>
      <div class="bar-row"><span class="lbl">未學習</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(unseen)}%;background:var(--panel2)"></div></div><span class="val">${unseen}</span></div>
    </div>
    <div class="card">
      <h3>資料管理</h3>
      <p class="muted">學習紀錄每次作答都會即時自動存檔（localStorage）。要防止清除瀏覽資料或換電腦造成遺失，請到「題庫/備份」分頁匯出備份檔。</p><br>
      <button class="btn ghost small" id="reset-all">清除所有學習紀錄</button>
    </div>`;
  $("#reset-all").addEventListener("click", () => {
    if (confirm("確定要清除所有學習紀錄嗎？此操作無法復原。")) {
      S = defaultState(); save(); switchTab("home");
    }
  });
};

/* ============ 啟動 ============ */
mergeBank();
async function boot() {
  // 先用本機資料立刻渲染首頁（秒開，不等網路）——避免網路慢時白屏。
  // 記下開機當下的本機時間戳當基準，雲端在背景對帳，只有雲端確實較新且這段時間
  // 使用者沒動過本機時才套用並重繪，兼顧「秒開」與「不蓋掉進度」。
  const bootLocalTime = S.updatedAt || 0;
  renderers.home();
  updateNavBadges();
  if (typeof Sync !== "undefined") {
    Sync.init();
    Sync.pullOnStartup(bootLocalTime).then(applied => {
      if (!applied) return;
      mergeBank();
      const active = document.querySelector("#nav button.active, #bottomnav button.active")?.dataset.tab || "home";
      showTab(active);
      updateNavBadges();
    });
  }
}
boot();

window.addEventListener("beforeunload", (e) => {
  if (typeof Mock !== "undefined" && Mock.inProgress()) {
    e.preventDefault();
    e.returnValue = "";
  }
});
