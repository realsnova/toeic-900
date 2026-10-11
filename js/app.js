/* ============ 狀態管理 ============ */
const STORE_KEY = "toeic900";
// 這兩個常數必須宣告在 `let S = load()` 之前：load() 會呼叫 migrateWb()，
// const 在初始化前存取會踩到暫時性死區（TDZ）而整個 App 白屏。
const WB_TYPES = ["p5", "p6", "p7", "l2", "l34"];
const WB_MASTER_N = 2; // 錯題要連續答對幾次（且跨天）才算掌握、移出錯題本
// 內建題數（在 mergeBank() 併入自訂題之前取得）。自訂題接在內建題後面，以索引為鍵；
// 新版本增加內建題時，自訂題的索引會往後移，錯題本等紀錄要跟著搬（shiftForBuiltinGrowth）。
// 同樣必須宣告在 `let S = load()` 之前。
const BASE_N = { p5: PART5.length, p6: PART6.length, p7: PART7.length, l2: PART2.length, l34: PART34.length };
const LEGACY_BASE_N = { p5: 200, p6: 10, p7: 12, l2: 60, l34: 13 }; // v1.3.x 以前（紀錄裡沒有 baseN）的內建題數
const PRE_ID_BACKUP_KEY = "toeic900_pre_v17_backup"; // 轉換成固定編號之前的原始紀錄（只在本機）
const TQ_MAX = 10; // 遷移練習佇列的上限（sanitizeState 會用到，必須在 load() 之前）
// 題目固定編號用到的常數（說明見 migrateToIds）；load() 會用到，必須宣告在 `let S = load()` 之前
const ID_TYPES = ["p5", "p6", "p7", "l2", "l34"];
const SET_PARTS = { p6: "blanks", p7: "qs", l34: "qs" };
const builtinId = (t, i) => `${t}-${String(i).padStart(4, "0")}`;

function defaultState() {
  return {
    exam: null,               // 考試日期 'YYYY-MM-DD'
    updatedAt: 0,              // 最後異動時間戳（雲端同步比對新舊用，不可為 undefined）
    vocab: {},                // word -> {i:間隔天數, due:'YYYY-MM-DD', n:複習次數, s:穩定度, d:難度, l:上次複習日}（v1.7 起 FSRS；e 是舊版的難易係數）
    mastery: {},              // 技能 ID -> {th:能力值, n:作答數, r:答對數, last:'YYYY-MM-DD'}（v1.7，js/engine.js）
    tq: { p5: [], l2: [] },   // 遷移練習：答錯的技能，下一輪出一道同技能的新題（v1.7）
    cat: {},                  // Part5 類別 -> {r, w}
    lcat: {},                 // 聽力類別（Part 2 / Part 3/4）-> {r, w}
    racc: { r: 0, w: 0 },     // 閱讀累計作答（練習答對率用；錯題本重考不計入）
    daily: {},                // date -> {v, p5, p6, p7, l2, l34, newV, wr:錯題本重考題數, mockDone:完成的模考次數}
    // 錯題本：key -> {n:連續答對次數, last:'YYYY-MM-DD' 最後一次計入的日期}
    // n 一定要寫成數字（即使是 0）：Firebase 會把 null 值當成刪除，若整個物件只有 null 欄位
    // 就會變成空物件而被 RTDB 整個節點刪掉，剛答錯的題目會在同步後人間蒸發。
    wb: { p5: {}, p6: {}, p7: {}, l2: {}, l34: {} },
    p6done: {}, p7done: {}, l34done: {},
    p5seen: {}, l2seen: {}, // Part 5 / 聽力 Part 2 出過的題（索引），支撐不重複出題輪替
    mocks: [],                // 模擬考歷史 [{date, mode, lR, lT, rR, rT, parts, secs}]（v1.1 以前另有換算分數 L/R，保留不用）
    mockSeen: {},             // 模考出過的題（各類別索引），支撐不重複組卷
    targetScore: null,        // 新手引導設定的目標分數
    onboarded: false,         // 是否已完成（或略過）新手引導
    ext: [],                  // 外部測驗成績 [{date, src, L, R}]：使用者自己輸入，L/R 為 0–495，0 代表沒考該部分
    baseN: { ...BASE_N },     // 這份紀錄建立或最後遷移時的內建題數（見 shiftForBuiltinGrowth）
    contentV: 2,              // 題目內容版本：原地替換題目時遞增，sanitizeState 會清掉指到舊題目的紀錄
    idV: 1                    // 1＝錯題本、輪替、最佳成績都以題目固定編號為鍵（v1.7，INV-13）
  };
}
const APP_VERSION = "1.5.1";
const CHANGELOG = [
  { v: "1.5.1", d: "2026-10-11", notes: "新增完整聽力測驗第 2 回（Part 2–4 共 94 題，神經語音音檔）與完整閱讀測驗第 3 回（100 題、75 分鐘），題目都經過兩次獨立盲解與抽檢，不會出現在一般練習中。做完前一回後，每日菜單會自動排下一回。" },
  { v: "1.5.0", d: "2026-10-11", notes: "聽力改用預先產生的神經語音音檔（Kokoro，美式與英式男女聲），不再依賴手機或電腦內建的語音，沒有英文語音的裝置也能練聽力；音檔缺少或播放失敗時自動改用裝置語音，並在畫面上標示。新增完整聽力測驗第 1 回：Part 2–4 共 94 題（Part 1 待補），照正式考試的題號、說明、題組開場與念題目的節奏連續播放，對話播放時可以先看題目。" },
  { v: "1.4.1", d: "2026-10-11", notes: "考前衝刺第二、三波：新增完整閱讀測驗第 2 回（和第 1 回一樣 100 題、75 分鐘）；聽力新增新制題組 10 組（看圖表作答、三人對話、意圖題，圖表會顯示在畫面上，三人對話用不同聲音）與 Part 2 新題 40 題；統計頁可以記錄外部測驗成績；模擬考頁新增考前作答策略（時間分配與技巧）；插入句子位置題的選項改照 [1]～[4] 排列；舊 Part 6 插入題的錯誤選項重寫，不再一眼就能排除；替換和舊題太像的題目。（v1.4.0 已加入完整閱讀測驗第 1 回，100 題、75 分鐘。）" },
  { v: "1.4.0", d: "2026-10-10", notes: "考前衝刺版：新增 Part 5 高難度題 100 題、Part 7 新制題組 8 組（簡訊與線上討論的意圖題、插入句子位置題、5 題的多篇題組）；Part 2 全部重寫干擾選項，不再能靠「選最長的」猜對；修正題庫審查找到的錯題與兩可題；衝刺期每日菜單加入定期模考，考前三天自動減量；練習中可以按「這題有問題」回報。AI 錯題解析（試用）：在設定頁貼上自己的 Anthropic API 金鑰後，答錯時可以請 AI 說明為什麼錯，金鑰預設關掉 App 就清除、不會同步或備份。資安強化：檢查同步與備份資料的格式、加入內容安全政策與第三方腳本完整性檢查、自訂同步代碼太短時提醒" },
  { v: "1.3.0", d: "2026-10-06", notes: "改顯示練習答對率（不再換算未校準的 TOEIC 分數，錯題本重考不計入）；只做錯題本或模考的日子也算連續學習；模考報告分開顯示聽力與閱讀、趨勢圖固定 0–100%；裝置沒有英文語音時先說明、語音沒播放時提示且模考不會卡住；同步代碼改用安全亂數並檢查格式；修正 Part 7 做完最後一題會跳出錯誤提示" },
  { v: "1.1.0", d: "2026-08-09", notes: "學習演算法強化：錯題要連續答對 2 次（跨天）才移除、Part 5 依弱項類別加權出題、Part 5／聽力 Part 2 不重複輪替出題、單字每日複習量上限" },
  { v: "1.0.3", d: "2026-07-12", notes: "驗收稽核：修復考試日期／同步代碼欄位的 XSS 漏洞、深色主題按鈕文字對比度不足、補上頁面 H1 標題" },
  { v: "1.0.2", d: "2026-07-12", notes: "驗收稽核：修復自訂題庫匯入可能讓雲端同步靜默失敗的資料安全性問題" },
  { v: "1.0.1", d: "2026-07-11", notes: "修復雲端同步在練過聽力 Part 3/4 後會靜默失敗的問題" },
  { v: "1.0.0", d: "2026-07-11", notes: "新手引導、全域錯誤處理、版本資訊上線；商業級強化收尾完成" },
  { v: "0.4.0", d: "2026-07-11", notes: "互動打磨：單字卡 3D 翻面與滑動評分手勢、進度環、結算動效、聽力播放視覺化" },
  { v: "0.3.0", d: "2026-07-11", notes: "完整模擬考上線：仿真聽力節／閱讀節、成績報告、歷史趨勢" },
  { v: "0.2.1", d: "2026-07-10", notes: "題庫擴充至 1,000+ 題" },
  { v: "0.2.0", d: "2026-07-10", notes: "白屏修復、鍵盤無障礙、App 圖示、5 大分區介面、雙主題、聽力腔調選擇" },
  { v: "0.1.0", d: "2026-07-09", notes: "雲端同步、SRS 單字卡、Part 5–7 練習、聽力訓練上線" }
];
let S = load();
function load() {
  const d = defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(d, parsed);
      if (parsed.baseN === undefined) d.baseN = null; // 舊版紀錄：當作 v1.3.x 的內建題數
      if (parsed.contentV === undefined) d.contentV = 0; // 舊版紀錄：還沒做過題目替換的清理
      if (parsed.idV === undefined) {
        d.idV = 0; // 舊版紀錄：還是用陣列索引當鍵，sanitizeState 會轉成固定編號
        // 轉換前的原始資料留一份在本機（不同步），設定頁可以下載；只留第一次的
        if (localStorage.getItem(PRE_ID_BACKUP_KEY) === null) {
          try { localStorage.setItem(PRE_ID_BACKUP_KEY, raw); } catch (e) { /* 空間不足就略過，不影響轉換 */ }
        }
      }
      // 舊版資料補齊新欄位
      d.wb = Object.assign({ p5: {}, p6: {}, p7: {}, l2: {}, l34: {} }, parsed.wb || {});
      // 錯題本的格式遷移（migrateWb）在下方 sanitizeState() 裡做，要先去掉 Firebase 陣列的空位才遷移
      d.p5seen = parsed.p5seen || {};
      d.l2seen = parsed.l2seen || {};
      d.lcat = parsed.lcat || {};
      d.racc = parsed.racc || { r: 0, w: 0 };
      d.l34done = parsed.l34done || {};
      // 遷移：舊版用 "Part 3/4" 當 S.lcat 的 key，但 "/" 是 Firebase 資料庫的禁用字元，
      // 只要使用者練過聽力 Part 3/4，雲端同步就會整批靜默失敗。改用 "Part 3-4"，並合併舊資料避免遺失。
      if (d.lcat["Part 3/4"]) {
        const old = d.lcat["Part 3/4"];
        const cur = d.lcat["Part 3-4"] || { r: 0, w: 0 };
        d.lcat["Part 3-4"] = { r: cur.r + old.r, w: cur.w + old.w };
        delete d.lcat["Part 3/4"];
      }
      sanitizeState(d);
    }
  } catch (e) { /* 資料損毀時重置 */ }
  return d;
}
/* 學習紀錄的型別檢查（2026-10-07 資安審查 H1）
   學習紀錄有三個入口會帶進外部資料：本機 load()、雲端同步拉取、匯入備份檔（匯入後重新整理走 load()）。
   知道同步代碼的人或一個惡意備份檔，可以把任何字串塞進這些欄位，而有些欄位會直接寫進畫面，
   形成可以讀走 API 金鑰與同步代碼的 XSS。這裡把每個已知欄位強制成預期的型別，不合格就丟棄或歸零。
   原則：只收斂型別，不刪除合法的舊版資料（INV-03）。
   注意：load() 在檔案開頭就被呼叫，這裡用到的常數必須是函式內的區域常數或宣告在 `let S = load()` 之前，
   否則會踩到暫時性死區，被 load() 的 catch 當成資料損毀而清空所有紀錄。 */
function sanitizeState(d) {
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const obj = v => (v && typeof v === "object" ? v : {}); // Firebase 會把數字鍵的物件存成陣列，陣列也接受
  const cnt = v => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; };
  const num = (v, dflt) => { const n = Number(v); return v !== null && v !== "" && Number.isFinite(n) ? n : dflt; };
  const date = v => (typeof v === "string" && DATE_RE.test(v) ? v : null);
  const entries = v => Object.entries(obj(v)).filter(([, x]) => x !== null && x !== undefined);
  const rw = v => ({ r: cnt(obj(v).r), w: cnt(obj(v).w) });

  d.exam = date(d.exam);
  d.updatedAt = cnt(d.updatedAt);
  if (d.lastBackup !== undefined) { const b = date(d.lastBackup); if (b) d.lastBackup = b; else delete d.lastBackup; }
  const ts = num(d.targetScore, null);
  d.targetScore = ts === null ? null : Math.min(990, Math.max(10, Math.round(ts)));
  d.onboarded = d.onboarded === true;
  d.racc = rw(d.racc);
  ["cat", "lcat"].forEach(k => { const out = {}; entries(d[k]).forEach(([c, v]) => { out[c] = rw(v); }); d[k] = out; });
  // 開發期間曾用「不定詞」當類別名，後來改成「不定詞與動名詞」：合併統計，弱項加權才對得到題目
  if (d.cat["不定詞"]) {
    const a = d.cat["不定詞"], b = d.cat["不定詞與動名詞"] || { r: 0, w: 0 };
    d.cat["不定詞與動名詞"] = { r: a.r + b.r, w: a.w + b.w };
    delete d.cat["不定詞"];
  }
  const daily = {};
  entries(d.daily).forEach(([day, v]) => {
    if (!DATE_RE.test(day)) return;
    const o = {};
    ["v", "p5", "p6", "p7", "l2", "l34", "newV", "wr", "mockDone", "readMock"].forEach(f => { if (obj(v)[f] !== undefined) o[f] = cnt(v[f]); });
    daily[day] = o;
  });
  d.daily = daily;
  const vocab = {};
  entries(d.vocab).forEach(([w, v]) => {
    const c = obj(v);
    const card = { i: Math.max(0, num(c.i, 0)), e: Math.min(5, Math.max(1.3, num(c.e, 2.5))), due: date(c.due) || todayStr(), n: cnt(c.n) };
    // FSRS 欄位（v1.7）：數值不合理就丟掉，下次複習時從 i、e 重新推算
    const s = num(c.s, NaN), dd = num(c.d, NaN);
    if (s > 0 && s <= 36500 && dd >= 1 && dd <= 10) { card.s = s; card.d = dd; }
    if (date(c.l)) card.l = c.l;
    if (c.lapses !== undefined) card.lapses = cnt(c.lapses);
    vocab[w] = card;
  });
  d.vocab = vocab;
  const mastery = {};
  entries(d.mastery).forEach(([k, v]) => {
    if (!/^[a-z0-9-]{2,20}$/.test(k)) return;
    const m = obj(v), th = num(m.th, 0);
    mastery[k] = { th: Math.min(4, Math.max(-4, th)), n: cnt(m.n), r: Math.min(cnt(m.r), cnt(m.n)), last: date(m.last) || "" };
  });
  d.mastery = mastery;
  const tq = {};
  ["p5", "l2"].forEach(t => { tq[t] = (Array.isArray(obj(d.tq)[t]) ? obj(d.tq)[t] : []).filter(x => typeof x === "string" && /^[a-z0-9-]{2,20}$/.test(x)).slice(-TQ_MAX); });
  d.tq = tq;
  if (!d.wb || typeof d.wb !== "object") d.wb = {};
  // 錯題本：Firebase 可能把數字鍵存成陣列，空位在 JSON 裡會變成 null；先去掉空位（否則會變成假的錯題），
  // 再做舊格式遷移（true → {n, last}），最後確認日期格式；n 一定是數字（INV-09）
  if (d.wb && typeof d.wb === "object") {
    WB_TYPES.forEach(t => { const out = {}; entries(d.wb[t]).forEach(([k, v]) => { if (v) out[k] = v; }); d.wb[t] = out; });
  }
  migrateWb(d);
  WB_TYPES.forEach(t => Object.keys(d.wb[t]).forEach(k => { const e = d.wb[t][k]; e.last = date(e.last); }));
  ["p6done", "p7done", "l34done"].forEach(k => { const out = {}; entries(d[k]).forEach(([i, v]) => { out[i] = cnt(v); }); d[k] = out; });
  const seen = v => { const out = {}; entries(v).forEach(([i, x]) => { if (x === true) out[i] = true; }); return out; };
  d.p5seen = seen(d.p5seen);
  d.l2seen = seen(d.l2seen);
  const ms = {};
  entries(d.mockSeen).forEach(([kind, v]) => { ms[kind] = seen(v); });
  d.mockSeen = ms;
  const PARTS = ["Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"];
  const score = v => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(495, Math.max(0, n)) : 0; };
  d.ext = (Array.isArray(d.ext) ? d.ext : Object.values(obj(d.ext))).filter(e => e && typeof e === "object" && date(e.date))
    .map(e => ({ date: e.date, src: String(e.src || "").slice(0, 60), L: score(e.L), R: score(e.R) })).slice(-50);
  d.mocks = (Array.isArray(d.mocks) ? d.mocks : Object.values(obj(d.mocks))).filter(m => m && typeof m === "object").map(m => {
    const out = { date: date(m.date) || "" };
    if (typeof m.mode === "string" && (["full", "listen", "read"].includes(m.mode) || /^[LR]\d{1,2}$/.test(m.mode))) out.mode = m.mode; // 舊紀錄沒有 mode 就維持沒有（顯示為「模擬考」）
    ["lR", "lT", "rR", "rT", "lSkip", "secs", "L", "R"].forEach(f => { if (Number.isFinite(m[f])) out[f] = cnt(m[f]); });
    if (m.parts && typeof m.parts === "object") {
      out.parts = {};
      PARTS.forEach(p => { if (m.parts[p]) out.parts[p] = { r: cnt(m.parts[p].r), t: cnt(m.parts[p].t) }; });
    }
    return out;
  });
  shiftForBuiltinGrowth(d);
  // v1.4.1 原地替換了 6 題 Part 5（題號 107、174、200 與第 1 回測驗的 3 題）：舊的錯題本紀錄會指到新題目，刪除
  if (!Number.isInteger(d.contentV)) d.contentV = 0;
  if (d.contentV < 2) {
    [106, 173, 199, 302, 311, 322].forEach(i => { delete d.wb.p5[i]; });
    d.contentV = 2;
  }
  migrateToIds(d);
  if (d.legacy !== undefined && (!d.legacy || typeof d.legacy !== "object" || Array.isArray(d.legacy))) delete d.legacy;
  return d;
}
/* ---- 題目固定編號（v1.7，INV-13）----
   內建題：<類型>-<四位數流水號>，流水號＝第一次轉換時的陣列位置，之後新題拿下一號，不改、不重用；
   要修正題意時舊題標 retired、另給新號。題組裡的小題：<題組編號>_<小題序號>（Firebase 的鍵不能有 #）。
   自訂題：c-<類型>-<題目文字的雜湊>，每台裝置算出來都一樣，內建題增加時也不用搬紀錄。
   程式內部仍然用陣列位置（「執行期的鍵」：Part 5／Part 2 是索引，題組類是「題組索引-小題索引」），
   只有寫進紀錄時才換成固定編號：recId() 轉成編號，rtKey() 轉回位置。 */
function customId(t, it) {
  try { return `c-${t}-${fnv1a(t + "\n" + itemKey(t, it))}`; } catch (e) { return null; }
}
// 把一份紀錄的索引鍵換成固定編號。可以重複執行（idV 已是 1 就跳過）。
// 自訂題的位置＝內建題數＋在自訂題庫裡的順序（mergeBank 的併入方式），所以從本機自訂題庫查編號。
// 對不到題目的鍵不刪除，原樣收進 d.legacy（App 不讀，INV-03）。
function migrateToIds(d) {
  if (d.idV === 1) return d;
  let bank = {};
  try { bank = JSON.parse(localStorage.getItem("toeic900_bank") || "{}") || {}; } catch (e) { bank = {}; }
  const idAt = (t, i) => {
    if (!Number.isInteger(i) || i < 0) return null;
    if (i < BASE_N[t]) return builtinId(t, i);
    const it = Array.isArray(bank[t]) ? bank[t][i - BASE_N[t]] : null;
    return it && typeof it === "object" ? customId(t, it) : null;
  };
  const one = (t, k) => (/^\d+$/.test(k) ? idAt(t, Number(k)) : null);
  const sub = (t, k) => { const m = /^(\d+)-(\d+)$/.exec(k); const s = m && idAt(t, Number(m[1])); return s ? `${s}_${m[2]}` : null; };
  const legacy = {};
  const keep = (path, k, v) => { let o = legacy; path.forEach(p => { o = o[p] = o[p] || {}; }); o[k] = v; };
  const convert = (obj, f, path) => {
    const out = {};
    Object.keys(obj || {}).forEach(k => { const id = f(k); if (id) out[id] = obj[k]; else keep(path, k, obj[k]); });
    return out;
  };
  ID_TYPES.forEach(t => {
    if (d.wb && d.wb[t]) d.wb[t] = convert(d.wb[t], k => (SET_PARTS[t] ? sub(t, k) : one(t, k)), ["wb", t]);
    if (d.mockSeen && d.mockSeen[t]) d.mockSeen[t] = convert(d.mockSeen[t], k => one(t, k), ["mockSeen", t]);
  });
  [["p5seen", "p5"], ["l2seen", "l2"], ["p6done", "p6"], ["p7done", "p7"], ["l34done", "l34"]].forEach(([f, t]) => {
    if (d[f]) d[f] = convert(d[f], k => one(t, k), [f]);
  });
  if (Object.keys(legacy).length) d.legacy = Object.assign(d.legacy && typeof d.legacy === "object" ? d.legacy : {}, legacy);
  d.idV = 1;
  return d;
}
// 內建題增加時，把自訂題（索引 >= 舊內建題數）的紀錄往後搬，讓錯題本、輪替、最佳成績仍對到同一題。
// 只處理增加；搬完把 baseN 更新成目前的內建題數，所以重複呼叫不會重複搬。
function shiftForBuiltinGrowth(d) {
  // 完全沒有 baseN（v1.3 以前的紀錄）才用舊版題數；有 baseN 但缺某一類（例如之後新增的題型）或值壞掉，
  // 那一類就當作已是目前題數、不搬，避免把已經用新編號寫入的紀錄再搬一次。
  const hasBase = d.baseN && typeof d.baseN === "object";
  const prevOf = t => (!hasBase ? LEGACY_BASE_N[t] : Number.isInteger(d.baseN[t]) && d.baseN[t] >= 0 ? d.baseN[t] : BASE_N[t]);
  const remap = (obj, f) => { const out = {}; Object.keys(obj || {}).forEach(k => { out[f(k)] = obj[k]; }); return out; };
  WB_TYPES.forEach(t => {
    const old = prevOf(t), delta = BASE_N[t] - old;
    if (delta <= 0) return;
    const sh = i => (i >= old ? i + delta : i);
    const idx = k => (/^\d+$/.test(k) ? String(sh(Number(k))) : k);
    const pair = k => { const m = /^(\d+)-(\d+)$/.exec(k); return m ? `${sh(Number(m[1]))}-${m[2]}` : k; };
    d.wb[t] = remap(d.wb[t], t === "p5" || t === "l2" ? idx : pair);
    const done = { p5: "p5seen", l2: "l2seen", p6: "p6done", p7: "p7done", l34: "l34done" }[t];
    d[done] = remap(d[done], idx);
    if (d.mockSeen && d.mockSeen[t]) d.mockSeen[t] = remap(d.mockSeen[t], idx);
  });
  d.baseN = { ...BASE_N };
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
    if (raw) return cleanBank(JSON.parse(raw));
  } catch (e) { /* 損毀時視為空 */ }
  return emptyBank();
}
// 自訂題庫也可能來自雲端同步或備份檔，逐題重新驗證格式（2026-10-07 資安審查 H1）
function cleanBank(data) {
  const b = Object.assign(emptyBank(), data && typeof data === "object" ? data : {});
  Object.keys(b).forEach(k => { if (!(k in emptyBank())) delete b[k]; });
  Object.keys(emptyBank()).forEach(k => {
    b[k] = (Array.isArray(b[k]) ? b[k] : Object.values(b[k] || {})).filter(it => it && typeof it === "object" && validateItem(k, it));
    b[k].forEach(it => { delete it.form; delete it.id; }); // 完整測驗的標記只屬於內建題；編號由 assignIds 指定
  });
  return b;
}
function saveBank(b) { localStorage.setItem(BANK_KEY, JSON.stringify(b)); }
const BUILTIN = {}; // 內建題數（合併自訂題庫前記錄）
const BANK_ARRAYS = () => ({ vocab: VOCAB, p5: PART5, p6: PART6, p7: PART7, l2: PART2, l34: PART34 });
function mergeBank() {
  const arrs = BANK_ARRAYS();
  // 可能被呼叫多次（開機、套用同步代碼、雲端資料更新後）：先截回內建題數再併入，避免自訂題重複出現
  Object.keys(arrs).forEach(k => {
    if (BUILTIN[k] === undefined) BUILTIN[k] = arrs[k].length;
    else arrs[k].length = BUILTIN[k];
  });
  const b = loadBank();
  Object.keys(arrs).forEach(k => arrs[k].push(...b[k]));
  assignIds();
}
// 每一題都帶 id：內建題依位置、自訂題依內容雜湊（匯入檔自帶的 id 一律覆蓋，避免冒用內建題的編號）
const ID_INDEX = {}; // 類型 -> Map(編號 -> 陣列位置)
function assignIds() {
  const arrs = BANK_ARRAYS();
  ID_TYPES.forEach(t => {
    const map = new Map();
    arrs[t].forEach((it, i) => {
      it.id = i < BASE_N[t] ? builtinId(t, i) : customId(t, it);
      if (it.id && !map.has(it.id)) map.set(it.id, i);
      // 技能標籤：新題寫在題目裡；舊題查 SKILL_TAGS；自訂的 Part 5 題依類別推定
      if (SET_PARTS[t]) (it[SET_PARTS[t]] || []).forEach((q, k) => { if (!q.sk && SKILL_TAGS[`${it.id}_${k}`]) q.sk = SKILL_TAGS[`${it.id}_${k}`]; });
      else if (!it.sk) it.sk = SKILL_TAGS[it.id] || (t === "p5" ? CAT_SKILL[it.cat] : undefined);
    });
    ID_INDEX[t] = map;
  });
}
const CAT_SKILL = { "詞性": "g-pos", "介係詞": "g-prep", "動詞時態": "g-tense", "代名詞": "g-pron", "分詞": "g-part", "關係詞": "g-rel",
  "連接詞": "g-conj", "比較級": "g-comp", "詞彙": "v-word", "不定詞與動名詞": "g-inf", "主詞動詞一致": "g-agree", "假設語氣與倒裝": "g-mood" };
// 一題（執行期的鍵）的技能
function skillOf(t, k) {
  const arr = BANK_ARRAYS()[t];
  if (SET_PARTS[t]) { const [si, qi] = String(k).split("-").map(Number); const set = arr[si]; const q = set && set[SET_PARTS[t]][qi]; return q && q.sk; }
  const it = arr[Number(k)];
  return it && it.sk;
}
const SKILL_BY_ID = Object.fromEntries(SKILLS.map(s => [s.id, s]));
// 每次作答都更新該技能的掌握度（wbMark 是所有作答的共同入口）
function recordSkill(t, k, correct) {
  const sk = skillOf(t, k);
  if (!sk || !SKILL_BY_ID[sk]) return;
  if (!S.mastery) S.mastery = {};
  S.mastery[sk] = Mastery.update(S.mastery[sk], correct, { type: t, today: todayStr() });
  // 遷移練習：答錯後，下一輪出一道同技能、不同句子的題目，確認學到的是觀念而不是記住這一題
  if (!correct && (t === "p5" || t === "l2")) {
    if (!S.tq) S.tq = { p5: [], l2: [] };
    if (!Array.isArray(S.tq[t])) S.tq[t] = [];
    S.tq[t].push(sk);
    S.tq[t] = S.tq[t].slice(-TQ_MAX);
  }
}
// 某個 Part 的弱項技能：作答數夠、掌握度低於 70%，由弱到強
const WEAK_LEVEL = 0.7;
function weakSkills(t) {
  return SKILLS.filter(s => s.part === t)
    .map(s => ({ id: s.id, m: (S.mastery || {})[s.id] }))
    .filter(x => Mastery.enough(x.m) && Mastery.level(x.m, t) < WEAK_LEVEL)
    .sort((a, b) => Mastery.level(a.m, t) - Mastery.level(b.m, t))
    .map(x => x.id);
}
// 執行期的鍵 → 紀錄用的固定編號；已經是編號就原樣傳回；找不到題目時傳回 null
function recId(t, k) {
  const arr = BANK_ARRAYS()[t], s = String(k);
  if (SET_PARTS[t]) {
    const m = /^(\d+)-(\d+)$/.exec(s);
    if (!m) return /_\d+$/.test(s) ? s : null;
    const set = arr[Number(m[1])];
    return set && set.id ? `${set.id}_${m[2]}` : null;
  }
  if (!/^\d+$/.test(s)) return s;
  const it = arr[Number(s)];
  return it && it.id ? it.id : null;
}
// 固定編號 → 執行期的鍵（字串）；題目已不存在（自訂題被清除、題組小題數變少）時傳回 null
function rtKey(t, id) {
  const map = ID_INDEX[t];
  if (!map) return null;
  if (SET_PARTS[t]) {
    const m = /^(.+)_(\d+)$/.exec(String(id));
    const si = m ? map.get(m[1]) : undefined;
    if (si === undefined) return null;
    const set = BANK_ARRAYS()[t][si];
    return set && set[SET_PARTS[t]][Number(m[2])] ? `${si}-${m[2]}` : null;
  }
  const i = map.get(String(id));
  return i === undefined ? null : String(i);
}
// 題組的最佳成績（以題組編號為鍵）
function bestOf(t, si) { const set = BANK_ARRAYS()[t][si]; return set ? S[t + "done"][set.id] : undefined; }
function setBest(t, si, right) {
  const id = BANK_ARRAYS()[t][si].id, done = S[t + "done"];
  done[id] = Math.max(done[id] || 0, right);
}
// 錯題本的一筆（用執行期的鍵查）
function wbGet(t, k) { const id = recId(t, k); return id ? S.wb[t][id] : undefined; }
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
    // w 會被直接當成 S.vocab 的 key（不像 p5 的 cat 可以靜默改字，改字會讓卡片顯示錯誤拼字），
    // 所以含 Firebase 禁用字元的單字直接拒絕匯入，而不是清洗。
    case "vocab": return ["w", "pos", "zh", "ex", "exZh"].every(k => typeof it[k] === "string" && it[k]) &&
      !/[.#$/\[\]]/.test(it.w);
    case "p5": return mcq(it, 4) && typeof it.cat === "string";
    case "p6": return typeof it.title === "string" && typeof it.text === "string" &&
      /___\[1\]___/.test(it.text) && Array.isArray(it.blanks) && it.blanks.length === 4 &&
      it.blanks.every(b => Array.isArray(b.opts) && b.opts.length === 4 && Number.isInteger(b.ans) && b.ans >= 0 && b.ans < 4 && typeof b.exp === "string");
    case "p7": return typeof it.title === "string" && typeof it.time === "number" &&
      Array.isArray(it.passages) && it.passages.every(p => typeof p === "string") &&
      Array.isArray(it.qs) && it.qs.length > 0 && it.qs.every(q => mcq(q, 4));
    case "l2": return mcq(it, 3);
    case "l34": return typeof it.type === "string" && typeof it.title === "string" &&
      Array.isArray(it.turns) && it.turns.every(t => ["M", "W", "M2", "W2", "N"].includes(t.s) && typeof t.t === "string") &&
      (it.graphic === undefined || typeof it.graphic === "string") &&
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
// Part5 的 cat 欄位最終會被當成 S.cat 物件的 key 存進雲端同步的資料裡；
// Firebase Realtime Database 的 key 禁止 ". # $ / [ ]"，使用者手動編輯匯入 JSON
// 時很可能寫出「詞性/詞彙」這種人類習慣的斜線分類，一旦答題觸發 S.cat[cat] 建立，
// 就會重演 "Part 3/4" 那個讓雲端同步整批靜默失敗的 bug。這裡在匯入當下就清洗掉。
function sanitizeFirebaseKey(s) {
  return String(s).replace(/[.#$/\[\]]/g, "-");
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
    if (type === "p5") it.cat = sanitizeFirebaseKey(it.cat);
    const key = itemKey(type, it);
    if (existing.has(key)) { dup++; return; }
    existing.add(key);
    ok.push(it);
  });
  if (ok.length) {
    const b = loadBank();
    b[type].push(...ok);
    saveBank(b);
    mergeBank(); // 立即生效（並替新題指定編號）
  }
  return { added: ok.length, invalid, dup };
}
// AI 擴充指令產生器
function aiPrompt(type, n) {
  const schemas = {
    vocab: `[{"w":"單字","pos":"詞性（如 v. / n. / adj.）","zh":"繁體中文意思","ex":"英文例句（商業情境）","exZh":"例句的繁體中文翻譯"}]`,
    p5: `[{"q":"含 ______ 空格的單句","opts":["正解","誘答1","誘答2","誘答3"],"ans":0,"cat":"從這些類別擇一：詞性、動詞時態、介係詞、連接詞、代名詞、詞彙、比較級、關係詞、分詞、不定詞與動名詞","exp":"繁體中文詳解"}]`,
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
  ["v", "p5", "p6", "p7", "l2", "l34", "newV", "wr", "mockDone", "readMock"].forEach(k => { if (typeof d[k] !== "number") d[k] = 0; });
  return d;
}
// 一天內所有學習活動的總量，連續天數與熱圖都用它判斷「這天有沒有學習」。
// 只做錯題本重考或只完成模擬考的日子也要算，否則認真複習的那天會被當成休息日、連續天數歸零。
function dayTotal(d) {
  if (!d) return 0;
  return ["v", "p5", "p6", "p7", "l2", "l34", "wr", "mockDone"].reduce((sum, k) => sum + (Number(d[k]) || 0), 0);
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// 選項顯示順序：一般題目洗牌（避免背位置）；「插入句子位置題」的選項 [1]～[4] 照正式考試的順序排列，不洗牌
function optionOrder(opts) {
  const idx = opts.map((_, i) => i);
  if (opts.length && opts.every(o => /^\[\d\]$/.test(o))) return idx.sort((a, b) => opts[a].localeCompare(opts[b]));
  return shuffle(idx);
}
function esc(s) {
  // 也跳脫雙引號：本函式的輸出有時會被接在雙引號屬性裡（如 value="${esc(...)}"），
  // 若來源字串含 " 且不跳脫，攻擊者可跳出屬性注入新屬性（如 onfocus=...）造成 XSS。
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  if (d < 0) return { name: "考試已過", icon: "📅", desc: "請在下方更新下一次的考試日期" };
  if (d <= 3) return { name: "考前調整", icon: "🧘", desc: "減量複習、維持手感、睡飽" };
  if (d > 35) return { name: "基礎期", icon: "🧱", desc: "補齊文法漏洞、建立聽力反應" };
  if (d > 14) return { name: "強化期", icon: "⚙️", desc: "攻克長對話與多篇閱讀" };
  return { name: "衝刺期", icon: "🚀", desc: "限時訓練、錯題清零、穩定節奏" };
}
function newPerDay() {
  const base = (typeof Settings !== "undefined" ? Settings.get("newPerDay") : 10) || 10;
  const ph = phase().name;
  if (ph === "考前調整" || ph === "考試已過") return 0; // 考前三天與考後（還沒設定下一次考試）不學新字，只複習
  return ph === "衝刺期" ? Math.max(1, Math.round(base / 2)) : base;
}
// 到期複習卡的每日上限。請假幾天回來會累積上百張到期卡，一次全端出來只會讓人直接放棄；
// 截掉的部分因為 due 日期已過，明天本來就會再出現，不需要另外記錄。
function reviewPerDay() {
  const v = typeof Settings !== "undefined" ? Number(Settings.get("revPerDay")) : 60;
  return Number.isFinite(v) && v > 0 ? Math.round(v) : 60;
}
// 各階段每日菜單（label, done 判斷, 跳轉分頁, 預估時間）
// 每日菜單的每一項附一句「為什麼排這個」（v1.7，工作票 16）
function planWhy(item) {
  const weakest = parts => {
    const list = parts.flatMap(t => weakSkills(t).map(id => ({ t, id, m: S.mastery[id] })));
    list.sort((a, b) => Mastery.level(a.m, a.t) - Mastery.level(b.m, b.t));
    return list[0];
  };
  const say = w => `${SKILL_BY_ID[w.id].name}掌握度 ${Math.round(Mastery.level(w.m, w.t) * 100)}%（${w.m.n} 題），這一輪會多出這類題`;
  switch (item.tab) {
    case "vocab": return "依記憶曲線（FSRS），這些單字今天複習最有效率，再晚就容易忘";
    case "p5": {
      const w = weakest(["p5"]);
      if (w) return say(w);
      if (S.tq && S.tq.p5 && S.tq.p5.length) return `上次答錯的「${SKILL_BY_ID[S.tq.p5[0]] ? SKILL_BY_ID[S.tq.p5[0]].name : ""}」會出一題同技能的新題`;
      return "還沒有明顯的弱項，維持每天的文法手感";
    }
    case "listen": { const w = weakest(["l2", "l34"]); return w ? say(w) : "聽力每天都要接觸，耳朵才不會生疏"; }
    case "p6": case "p7": { const w = weakest([item.tab]); return w ? say(w).replace("，這一輪會多出這類題", "，挑有這類題的題組") : "閱讀量決定考試時能不能寫完"; }
    case "wrong": return "錯題要分兩天各答對一次才算學會，這是最有效率的複習";
    case "mock": return "完整、計時的測驗練的是時間分配和耐力";
    default: return "";
  }
}
function todayPlan() {
  return todayPlanItems().map(p => Object.assign(p, { why: planWhy(p) }));
}
function todayPlanItems() {
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
  if (ph === "考前調整" || ph === "考試已過") return [
    { label: "單字複習（不學新字）", detail: due ? `還有 ${due} 張卡片` : "今日完成！", done: due === 0, tab: "vocab", est: "10 分" },
    { label: "錯題本重考 5 題", detail: wrongs ? `錯題本還有 ${wrongs} 題` : "錯題本已清空！", done: wrongs === 0 || (d.wr || 0) >= 5, tab: "wrong", est: "8 分" },
    { label: "聽力 Part 3/4 一組（保持耳朵手感）", detail: `已完成 ${d.l34} 組`, done: d.l34 >= 1, tab: "listen", est: "6 分" },
    { label: "Part 7 限時 1 篇", detail: `已完成 ${d.p7} 篇`, done: d.p7 >= 1, tab: "p7", est: "10 分" }
  ];
  // 衝刺期：距離上次模考滿 3 天就排一次閱讀節模考（練時間分配與耐力），其他天練限時題
  // 今天已考過（含閱讀節）也要保留這一項，才會顯示「已完成」；只考聽力節不算
  const readDone = d.readMock || 0;
  const mockDue = readDone > 0 || daysSinceMock() >= 3;
  const lfToday = (S.mocks || []).find(m => m && m.date === todayStr() && isListenForm(formOf(m.mode)));
  return base.concat([
    mockDue
      ? (nextForm() && !readDone
        ? { label: `${nextForm().name}（100 題・75 分鐘）`, detail: "挑一天時間充裕時做，練完整的時間分配與耐力", done: false, tab: "mock", est: "80 分" }
        : { label: "模擬考：閱讀節（限時 22 分鐘）", detail: readDone ? "今天已完成" : "每 3 天一次，練時間分配", done: readDone >= 1, tab: "mock", est: "25 分" })
      : { label: "Part 7 限時 2 篇（新制題組優先）", detail: `已完成 ${d.p7} 篇`, done: d.p7 >= 2, tab: "p7", est: "18 分" },
    // 還沒做過完整聽力測驗：不排閱讀模考的日子改排一次（約 40 分鐘）
    !mockDue && lfToday
      ? { label: formOf(lfToday.mode).name, detail: "今天已完成", done: true, tab: "mock", est: `${formOf(lfToday.mode).mins} 分` }
      : !mockDue && nextForm(true)
      ? { label: `${nextForm(true).name}（約 ${nextForm(true).mins} 分鐘）`, detail: "照正式考試節奏連續播放，練專注力與題目預讀", done: false, tab: "mock", est: `${nextForm(true).mins} 分` }
      : { label: "聽力 Part 2 五題 + Part 3/4 一組", detail: `P2 ${d.l2} 題 · P3/4 ${d.l34} 組`, done: d.l2 >= 5 && d.l34 >= 1, tab: "listen", est: "12 分" },
    { label: "錯題本全部清零", detail: wrongs ? `還剩 ${wrongs} 題` : "已清空！", done: wrongs === 0, tab: "wrong", est: "10 分" }
  ]);
}
// 還沒做過的第一份完整閱讀測驗（listen=true 時找聽力測驗）
function nextForm(listen = false) {
  const done = new Set((S.mocks || []).map(m => m && m.mode));
  return FORMS.find(f => isListenForm(f) === listen && !done.has(f.id)) || null;
}
// 距離最近一次模擬考的天數（沒考過回傳很大的數字）
function daysSinceMock() {
  const t = todayStr();
  // 只考聽力（聽力節、完整聽力測驗）不算：這裡排的是閱讀模考
  const dates = (S.mocks || []).filter(m => m && m.mode !== "listen" && !isListenForm(formOf(m.mode)))
    .map(m => m.date).filter(x => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && x <= t && !isNaN(new Date(x))).sort();
  if (!dates.length) return 999;
  return Math.round((new Date(todayStr()) - new Date(dates[dates.length - 1])) / 86400000);
}

/* ============ 語音合成（聽力播放）============ */
// 聽力完全依賴裝置內建的語音合成。三個要防的情況：
// 1. 裝置沒有英文語音（Windows 常見）：用中文語音念英文比沒聲音更糟，開始前要先說明。
// 2. 語音被瀏覽器擋下或引擎沒反應（iOS 自動播放限制、語音故障）：end/error 永遠不來，
//    模擬考聽力節會卡死，所以每段語音都要有逾時。
// 3. 播放中按重播：舊的播放迴圈必須停下，不能和新的交錯念。
const TTS_VOICE_WAIT_MS = 2000;   // 開頁後最多等這麼久讓語音清單載入，之後才判定「沒有英文語音」
const TTS_START_TIMEOUT_MS = 3000; // 第一段語音呼叫後這麼久還沒開始，就提示「沒有聽到聲音？」
const TTS = {
  ok: "speechSynthesis" in window,
  voices: [],
  settled: false,     // 語音清單是否已經有定論（載入完成或等候逾時）
  forceTry: false,    // 沒有英文語音時，使用者仍選擇嘗試播放（本次開啟期間有效）
  gen: 0,             // 播放世代：每次 seq/stop 都遞增，舊的播放迴圈看到世代不同就停止
  playing: false,
  currentLang: "en-US", // 這一組播放（一題 Part2 / 一組 Part3-4）目前用的腔調
  init() {
    if (!TTS.ok) { TTS.settled = true; return; }
    const pick = () => {
      TTS.voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
      if (typeof Accents !== "undefined") Accents.scan();
      if (TTS.voices.length) TTS.settled = true;
    };
    pick();
    speechSynthesis.onvoiceschanged = () => { pick(); TTS.settled = true; };
    setTimeout(() => { TTS.settled = true; }, TTS_VOICE_WAIT_MS);
  },
  // loading：清單還在載入；ready：有英文語音；none：確定沒有英文語音（或瀏覽器不支援語音合成）
  voiceState() {
    if (!TTS.ok) return "none";
    if (!TTS.voices.length) { // 有些瀏覽器不觸發 voiceschanged：判定前再讀一次清單
      TTS.voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
      if (TTS.voices.length && typeof Accents !== "undefined") Accents.scan();
    }
    if (TTS.voices.length) return "ready";
    return TTS.settled ? "none" : "loading";
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
    const female = v => /female|zira|aria|jenny|samantha|karen|susan|hazel|libby|sonia|natasha/i.test(v.name);
    const male = v => !female(v) && /male|david|guy|mark|daniel|alex|george|ryan|william|james/i.test(v.name);
    if (speaker === "W") return pool.find(female) || pool[0];
    if (speaker === "M") return pool.find(male) || pool[pool.length - 1];
    // 三人對話的第二位男聲／女聲：找一個和第一位不同的語音，找不到就沿用並靠音高區分
    if (speaker === "W2") { const w = pool.filter(female); return w[1] || w[0] || pool[0]; }
    if (speaker === "M2") { const m = pool.filter(male); return m[1] || m[0] || pool[pool.length - 1]; }
    return pool[0];
  },
  rate(rate) {
    return rate || (typeof Settings !== "undefined" ? Settings.get("ttsRate") : 0.92) || 0.92;
  },
  // 一段語音最多等多久：正常語速約每字 0.4 秒，取 0.6 秒留餘裕，再加 3 秒緩衝，最少 4 秒
  timeoutMs(text, rate) {
    const words = String(text).trim().split(/\s+/).filter(Boolean).length;
    return (Math.max(4, words * 0.6 / TTS.rate(rate)) + 3) * 1000;
  },
  // 回傳 Promise<{started}>：started 表示瀏覽器真的開始念了。end、error、逾時三者先到者結束等待
  speak(text, speaker = "N", rate, onStart) {
    return new Promise(res => {
      let started = false, finished = false;
      const finish = () => { if (finished) return; finished = true; clearTimeout(timer); res({ started }); };
      const timer = setTimeout(finish, TTS.timeoutMs(text, rate));
      try {
        const u = new SpeechSynthesisUtterance(text);
        const v = TTS.voiceFor(speaker);
        if (v) u.voice = v;
        u.lang = TTS.currentLang;
        u.rate = TTS.rate(rate);
        // 同一語音時用音高區分男女
        const pitch = { W: 1.15, M: 0.9, W2: 1.35, M2: 0.75 }[speaker];
        if (pitch) u.pitch = pitch;
        u.onstart = () => { started = true; if (onStart) onStart(); };
        u.onend = finish; u.onerror = finish;
        speechSynthesis.speak(u);
      } catch (e) { finish(); }
    });
  },
  // 依序播放一組語音。第一段語音在呼叫當下同步送出（iOS 要求語音由使用者點擊直接觸發），
  // 所以呼叫端必須在 click 處理函式裡直接呼叫，中間不可先 await。
  // opts.onSilent：第一段語音 3 秒內沒有開始時呼叫（顯示「沒有聽到聲音？」）
  // 回傳 Promise<{played}>：played 表示至少有一段語音真的開始播放
  // 段落可以帶 clip（預先產生的音檔鍵）與 fb（沒有音檔或播放失敗時改念的語音段落，省略時念 p.t）。
  // opts.clipRate：音檔的播放速度（模擬考固定 1，練習時跟著語速設定）
  async seq(parts, opts = {}) {
    const anyClip = parts.some(p => AudioClips.has(p.clip));
    if (!TTS.ok && !anyClip) { if (opts.onSilent) opts.onSilent(); return { played: false }; }
    TTS.stop();
    const gen = TTS.gen;
    TTS.currentLang = TTS.chooseLang(); // 整組（一題或一組對話）用同一個腔調，同步且在第一個 await 之前完成
    TTS.playing = true;
    let played = false, warned = false;
    // 沒有聲音的提示只出現一次：3 秒內沒開始，或整組播完都沒有開始（例如瀏覽器立刻回報 not-allowed）
    const warnSilent = () => {
      if (!played && !warned && gen === TTS.gen && opts.onSilent) { warned = true; opts.onSilent(); }
    };
    const silentTimer = setTimeout(warnSilent, anyClip ? AUDIO_START_TIMEOUT_MS + TTS_START_TIMEOUT_MS : TTS_START_TIMEOUT_MS);
    const onStart = () => { played = true; if (warned) hideSilentHelp(); };
    const clipRate = opts.clipRate || TTS.rate();
    // iOS 只允許在點擊當下第一次發聲：第一段是音檔時，同步送出一段無聲的語音解鎖語音合成，
    // 否則之後音檔缺少或失敗時，改用的裝置語音會被擋下。每次開啟只需要一次。
    if (anyClip && TTS.ok && !TTS.unlocked) {
      TTS.unlocked = true;
      try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* 忽略 */ }
    }
    for (const p of parts) {
      if (gen !== TTS.gen) break;
      let useSpeech = true;
      if (AudioClips.has(p.clip)) {
        const r = await AudioClips.play(p.clip, clipRate);
        if (r.started) onStart();
        useSpeech = !!r.failed && !r.aborted && gen === TTS.gen; // 音檔失敗才改念，被停止就不念
        if (r.failed && typeof console !== "undefined") console.warn("音檔播放失敗，改用裝置語音：", p.clip);
      }
      if (useSpeech && TTS.ok) {
        for (const sp of p.fb || [p]) {
          if (gen !== TTS.gen) break;
          const r = await TTS.speak(sp.t, sp.s, sp.rate, onStart);
          if (r.started) played = true;
          if (sp !== p && sp.pause && gen === TTS.gen) await new Promise(rs => setTimeout(rs, sp.pause));
        }
      }
      if (gen !== TTS.gen) break;
      await new Promise(rs => setTimeout(rs, p.pause == null ? 350 : p.pause));
    }
    clearTimeout(silentTimer);
    warnSilent();
    const aborted = gen !== TTS.gen; // 被重播、切頁或交卷停止，不代表語音有問題
    if (!aborted) TTS.playing = false;
    return { played, aborted };
  },
  stop() { TTS.gen++; TTS.playing = false; AudioClips.stop(); if (TTS.ok) speechSynthesis.cancel(); }
};
TTS.init();

// 聽力入口共用的開始前檢查：有英文語音（或清單還在載入）就同步直接開始，保留點擊手勢；
// 確定沒有英文語音時先說明，使用者選擇仍要嘗試才開始。
function withVoices(start) {
  // 內建題目全部都有預先產生的音檔時，不需要裝置的英文語音
  if (AudioClips.complete || TTS.voiceState() !== "none" || TTS.forceTry) { start(); return; }
  UI.confirm(
    `這台裝置沒有英文語音，聽力題可能沒有聲音，或由其他語言的語音念出英文。<br><br>
     建議改用手機（iPhone、Android 通常內建英文語音），或在電腦安裝英文語音包：
     <a href="https://github.com/realsnova/toeic-900#windows-安裝英式澳式語音包" target="_blank" rel="noopener">安裝步驟</a>。`,
    {
      title: "找不到英文語音", okText: "仍要嘗試播放", cancelText: "先不要",
      // 在按鈕點擊的處理函式內同步開始播放，不等 Promise（iOS 只認點擊當下送出的語音）
      onOk: () => { TTS.forceTry = true; start(); }
    }
  );
}
// 聽力畫面的固定標示：讓使用者知道這不是正式考試的真人錄音，以及這一題用的是音檔還是裝置語音
// parts：這一題的播放內容；省略時依整體情況說明
function ttsNoteHTML(parts) {
  const src = parts ? audioSource(parts) : (AudioClips.complete ? "all" : AudioClips.ready ? "mixed" : "none");
  const text = src === "all" ? "語音：預先產生的神經語音（Kokoro），非真人錄音"
    : src === "mixed" ? "語音：部分為神經語音音檔，部分為裝置合成，非真人錄音"
    : "語音：裝置合成，非真人錄音";
  return `<p class="muted tts-note">${text}</p>`;
}
// 第一段語音沒有開始時的提示。replay 為 null 表示不能重播（模擬考）
function showSilentHelp(replay) {
  let el = document.getElementById("tts-help");
  if (!el) {
    el = document.createElement("div");
    el.id = "tts-help";
    el.className = "tts-help";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <b>沒有聽到聲音？</b>
    <span class="muted">${replay ? "請確認音量，再按重播。" : "語音還沒開始播放；如果這題一直沒有聲音，不會列入計分。"}</span>
    <span class="tts-help-actions">
      ${replay ? `<button class="btn small" data-act="replay">重播</button>` : ""}
      <a class="btn small secondary" href="https://github.com/realsnova/toeic-900#windows-安裝英式澳式語音包" target="_blank" rel="noopener">說明</a>
      <button class="btn small secondary" data-act="close">關閉</button>
    </span>`;
  el.hidden = false;
  el.onclick = e => {
    const act = e.target.closest("[data-act]");
    if (!act) return;
    el.hidden = true;
    if (act.dataset.act === "replay" && replay) replay();
  };
}
function hideSilentHelp() { const el = document.getElementById("tts-help"); if (el) el.hidden = true; }

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
  hideSilentHelp();
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
  if (typeof Mock !== "undefined" && Mock.inProgress()) {
    if (name === "mock") return; // 已經在考試畫面：重畫選單會打斷聽力並讓本題被當成沒有播放
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
  // 到期卡要套用每日上限，否則徽章顯示 200 但實際佇列只給 60，數字對不起來
  const dueOld = Math.min(Object.values(S.vocab).filter(c => c.due <= t).length, reviewPerDay());
  const newLeft = Math.max(0, newPerDay() - daily().newV);
  const unseen = VOCAB.filter(v => !S.vocab[v.w]).length;
  return dueOld + Math.min(newLeft, unseen);
}
function wrongCount() {
  return WB_TYPES.reduce((n, k) => n + wbKeys(k).length, 0);
}
// 錯題本中「題目還存在」的鍵。題目可能不存在：自訂題被移除後索引對不上，或同步資料中有錯誤的鍵。
// 不刪除這些紀錄（自訂題之後可能隨同步回來），只是不顯示，避免錯題本頁整個出錯。
// 回傳執行期的鍵（Part 5／Part 2 是索引字串，題組類是「題組索引-小題索引」）。
function wbKeys(type) {
  return Object.keys((S.wb && S.wb[type]) || {}).map(id => rtKey(type, id)).filter(k => k !== null);
}

/* ---- 錯題本的「掌握」判定 ----
   一次答對就移除是不夠的：Part 5/6/7 與 Part 3/4 是四選一（25% 猜中率），聽力 Part 2 是
   三選一（33%），而且剛看完詳解就重做時，答對往往是「認得這題」而不是真的學會。
   改成要連續答對 2 次、且第 2 次必須是不同天才移除，逼出至少一次隔天的間隔回想。 */
// 舊版錯題本的值是 true，新版是 {n, last}。所有讀取端一律先過這裡，
// 因為雲端同步的 pullOnStartup 會直接覆寫 S 而不經過 load()，舊格式仍可能從雲端流進來。
function wbNorm(v) {
  if (!v || v === true) return { n: 0, last: null };
  const e = {
    n: typeof v.n === "number" && v.n > 0 ? v.n : 0,
    last: typeof v.last === "string" && v.last ? v.last : null
  };
  // w：最近一次答錯的日期（v1.7）。多裝置合併時用來判斷哪一邊的作答比較新（js/merge.js）
  if (typeof v.w === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.w)) e.w = v.w;
  return e;
}
// 還要再答對幾次才會被移除（給 UI 顯示用，讓使用者知道為什麼答對了題目還在）
function wbRemain(v) { return Math.max(1, WB_MASTER_N - wbNorm(v).n); }
// 把整份狀態的錯題本轉成新格式；load() 與雲端 pull 後都要呼叫
function migrateWb(d) {
  if (!d.wb) d.wb = {};
  WB_TYPES.forEach(t => {
    const bag = d.wb[t] && typeof d.wb[t] === "object" ? d.wb[t] : {};
    Object.keys(bag).forEach(k => { bag[k] = wbNorm(bag[k]); });
    d.wb[t] = bag;
  });
}
// 所有錯題本的寫入都走這裡，避免五個題型各寫一套邏輯而漏改
function wbMark(type, rt, correct) {
  recordSkill(type, rt, correct);
  const bag = S.wb[type];
  const key = recId(type, rt);
  if (!bag || !key) return;
  if (!correct) { bag[key] = { n: 0, last: null, w: todayStr() }; return; } // 答錯就把連對次數歸零，題目留在錯題本
  if (bag[key] === undefined) return; // 本來就不在錯題本裡，答對不需要記任何東西
  const e = wbNorm(bag[key]);
  const t = todayStr();
  // 同一天內重複答對不累計：否則在錯題本頁連點兩次「重新挑戰」就能清掉，等於沒有間隔複習
  if (e.last !== t) { e.n++; e.last = t; }
  if (e.n >= WB_MASTER_N) delete bag[key];
  else bag[key] = e;
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
  const acc = practiceAccuracy();
  $("#tab-home").innerHTML = `
    <div class="hero">
      <div class="stat-tile"><div class="num">${dl >= 0 ? dl : 0}</div><div class="lbl">距離考試（天）</div></div>
      <div class="stat-tile"><div class="num">${ph.icon} ${ph.name}</div><div class="lbl">${ph.desc}</div></div>
      <div class="stat-tile"><div class="num">🔥 ${streak()}</div><div class="lbl">連續學習天數</div></div>
      <div class="stat-tile ring-tile">${Anim.ringSVG("home-ring")}<div class="lbl">今日任務</div></div>
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
            <span class="muted"> · ${esc(p.detail)} · 約 ${p.est}</span>
            ${p.why ? `<div class="muted plan-why">💡 ${esc(p.why)}</div>` : ""}</div>
          <button class="btn small ${p.done ? "secondary" : ""}" data-goto="${p.tab}">${p.done ? "再練" : "開始"}</button>
        </div>`).join("")}
      ${doneCount === plan.length ? `<p style="text-align:center;margin-top:12px">🎉 今日任務全數完成！</p>` : ""}
    </div>
    <div class="card">
      <h3>🎯 考試日期與練習答對率</h3>
      <div class="item-row">
        <div>考試日期：<input type="date" id="exam-date" value="${esc(examDate())}"
          style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:6px 10px;font-family:inherit"></div>
        <div>聽力 ${accuracyText(acc.L)} · 閱讀 ${accuracyText(acc.R)}</div>
      </div>
      <p class="muted">答對率只反映本工具內的練習（不含錯題本重考），不是 TOEIC 分數。計畫的三個階段（基礎→強化→衝刺）會依考試日期自動切換，改日期即重新規劃。</p>
    </div>
    <div class="card">
      <h3>💡 ${ph.name}重點</h3>
      <p class="muted">${phaseTips()}</p>
    </div>`;
  Anim.ringAnimate("home-ring", doneCount, plan.length);
  $("#tab-home").querySelectorAll("[data-goto]").forEach(b =>
    b.addEventListener("click", () => goTo(b.dataset.goto)));
  $("#exam-date").addEventListener("change", (e) => {
    if (e.target.value) { S.exam = e.target.value; save(); renderers.home(); }
  });
};
function phaseTips() {
  const p = phase().name;
  if (p === "基礎期") return "700 → 900 的第一步是把 Part 5 各文法類別正確率都拉到 85% 以上（看統計頁找弱項）。聽力 Part 2 專注辨認「間接回應」與同字陷阱——這是中級與高分的分水嶺。單字每天 10 個新字持續累積。";
  if (p === "強化期") return "把重心移到 Part 3/4（聽力配分最重）與 Part 7 多篇整合題。聽力先看題目再聽音檔、邊聽邊作答；閱讀練習「題目定位法」。新制題型（簡訊與線上討論的意圖題、插入句子位置題、5 題的多篇題組）要先熟悉，考場上才不會卡住。錯題本每天清 5 題，別讓它累積。";
  if (p === "考前調整") return "最後三天不學新東西：只複習錯題本和到期單字，每天做一點聽力與閱讀保持手感。確認准考證、身分證件、考場位置與交通時間，前一晚早點睡。考試時閱讀部分 Part 5 約 10 分鐘、Part 6 約 8 分鐘，留 55 分鐘以上給 Part 7；不會的題目先猜一個答案再往下，不要留白。";
  if (p === "考試已過") return "考試日期已經過了。請在上方的「考試日期」設定下一次的考試，菜單會依剩下的天數重新規劃。";
  return "考前兩週：不再學新內容，專注限時訓練與錯題清零。Part 5/6 全部 20 秒內作答，Part 7 每篇控制在建議時間內。考前一天只複習錯題本與單字，保持狀態。";
}
// 累計練習答對率。刻意不換算成 TOEIC 分數：本工具的題目沒有經過等化／校準，
// 把答對率套進 5–495 的曲線只會產生看起來精確、其實沒有根據的數字。
// 錯題本重考不計入（見 trackListening／trackReading 的呼叫處），聽力和閱讀的口徑才一致。
const ACC_MIN = { L: 15, R: 20 }; // 樣本少於這個數時答對率波動太大，不顯示百分比
function practiceAccuracy() {
  const stat = (r, w, min) => {
    const total = r + w;
    return { right: r, total, min, ready: total >= min, need: Math.max(0, min - total),
      pct: total ? Math.round(r / total * 100) : null };
  };
  let lr = 0, lw = 0;
  Object.values(S.lcat || {}).forEach(s => { lr += Number(s.r) || 0; lw += Number(s.w) || 0; });
  const racc = S.racc || {};
  return { L: stat(lr, lw, ACC_MIN.L), R: stat(Number(racc.r) || 0, Number(racc.w) || 0, ACC_MIN.R) };
}
function accuracyText(a) {
  return a.ready ? `<b style="color:var(--accent)">${a.pct}%</b>（${a.right}/${a.total}）`
    : `<span class="muted">再答 ${a.need} 題後顯示</span>`;
}

/* ============ 單字卡（SRS 間隔重複）============ */
let vq = null;         // 本次複習佇列
let vqDeferred = 0;    // 因為超過每日上限而被留到明天的到期卡數（完成畫面要告知使用者）
function buildVocabQueue() {
  const t = todayStr();
  const dueAll = VOCAB.filter(v => S.vocab[v.w] && S.vocab[v.w].due <= t);
  const cap = reviewPerDay();
  const dueCards = shuffle(dueAll).slice(0, cap);
  vqDeferred = dueAll.length - dueCards.length;
  const newLeft = Math.max(0, newPerDay() - daily().newV);
  const newCards = VOCAB.filter(v => !S.vocab[v.w]).slice(0, newLeft);
  // 到期卡排在新卡前面：記憶曲線上「快忘掉的舊字」比「沒看過的新字」急，
  // 中途離開時也該優先把複習做完（原本是全部混在一起洗牌）。
  return shuffle(dueCards).concat(shuffle(newCards));
}
renderers.vocab = function () {
  vq = buildVocabQueue();
  nextCard();
};
let vocabVoiceNoticed = false;
// 單字發音不擋流程：沒有英文語音時只提示一次，不用其他語言的語音念英文
function vocabSpeak(parts, byUser = true) {
  if (TTS.voiceState() === "none" && !TTS.forceTry) {
    if (byUser && !vocabVoiceNoticed) {
      vocabVoiceNoticed = true;
      UI.toast("這台裝置沒有英文語音，無法播放發音。可到「我的 → 設定」查看說明。", "err", 4500);
    }
    return;
  }
  TTS.seq(parts);
}
function speakWord(w, byUser = true) { vocabSpeak([{ t: w, s: "N", rate: 0.85 }], byUser); }
function nextCard() {
  const box = $("#tab-vocab");
  if (!vq.length) {
    const learned = Object.keys(S.vocab).length;
    box.innerHTML = `
      <div class="card result-banner">
        <div style="font-size:3rem">🎉</div>
        <h2>今日單字複習完成！</h2>
        <p class="muted">已學習 ${learned} / ${VOCAB.length} 個單字。明天會依記憶曲線自動安排複習。</p>
        ${vqDeferred > 0 ? `<p class="muted">📌 今天還有 ${vqDeferred} 張到期卡明天繼續（每日複習上限 ${reviewPerDay()} 張，可在「我的 → 設定」調整）。</p>` : ""}
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
    <div class="flashcard-stage">
      <div class="flashcard flip-inner" id="fc">
        <div class="fc-face fc-front">
          <div class="word">${esc(card.w)} <button class="speak-btn" id="spk" title="發音" aria-label="播放單字發音">🔊</button></div>
          <div class="pos">${esc(card.pos)}</div>
          <div class="hint">點擊卡片顯示答案</div>
        </div>
        <div class="fc-face fc-back" id="fc-back"></div>
      </div>
      <div class="swipe-hint left">😕 忘記</div>
      <div class="swipe-hint right">✅ 記得</div>
    </div>
    <div id="rating"></div>`;
  speakWord(card.w, false); // 出卡時自動發音；沒有英文語音時安靜略過，不跳提示
  $("#spk").addEventListener("click", (e) => { e.stopPropagation(); speakWord(card.w); });
  $("#fc").addEventListener("click", (e) => { if (e.target.id !== "spk") revealCard(card); });
}
function revealCard(card) {
  $("#fc-back").innerHTML = `
    <div class="word">${esc(card.w)} <button class="speak-btn" id="spk2" title="發音" aria-label="播放單字與例句發音">🔊</button></div>
    <div class="pos">${esc(card.pos)}</div>
    <div class="zh">${esc(card.zh)}</div>
    <div class="ex">${esc(card.ex)}</div>
    <div class="exzh">${esc(card.exZh)}</div>`;
  $("#fc").classList.add("flipped");
  $("#spk2").addEventListener("click", (e) => {
    e.stopPropagation();
    vocabSpeak([{ t: card.w, s: "N", rate: 0.85, pause: 250 }, { t: card.ex, s: "N" }]);
  });
  // FSRS（v1.7）：每個按鈕實際會排到幾天後
  const iv = FSRS.preview(S.vocab[card.w] || null, todayStr());
  $("#rating").innerHTML = `
    <div class="rating-row">
      <button class="rate-again" data-r="again">忘記<span class="days">稍後再問</span></button>
      <button class="rate-hard" data-r="hard">模糊<span class="days">${iv.hard} 天後</span></button>
      <button class="rate-good" data-r="good">記得<span class="days">${iv.good} 天後</span></button>
      <button class="rate-easy" data-r="easy">簡單<span class="days">${iv.easy} 天後</span></button>
    </div>`;
  $("#rating").querySelectorAll("button").forEach(b =>
    b.addEventListener("click", () => rateCard(card, b.dataset.r, iv)));
  attachSwipeRating(card, iv);
}
// 卡片翻面後的滑動評分手勢：左滑=忘記、右滑=記得。位移動畫套用在外層 .flashcard-stage，
// 與內層 #fc 的 3D 翻面 rotateY 分開處理，避免兩個 transform 疊加造成座標混亂。
function attachSwipeRating(card, iv) {
  const fc = $("#fc");
  const stage = document.querySelector(".flashcard-stage");
  const hintL = stage.querySelector(".swipe-hint.left");
  const hintR = stage.querySelector(".swipe-hint.right");
  const threshold = 90;
  let startX = null, dx = 0, dragging = false, done = false;
  const reset = () => {
    stage.style.transition = reducedMotion() ? "none" : "transform .3s cubic-bezier(.34,1.56,.64,1)";
    stage.style.transform = "";
    hintL.style.opacity = 0; hintR.style.opacity = 0;
  };
  const onStart = (e) => {
    if (done) return;
    const t = e.touches ? e.touches[0] : e;
    startX = t.clientX; dx = 0; dragging = true;
    stage.style.transition = "none";
  };
  const onMove = (e) => {
    if (!dragging || done) return;
    const t = e.touches ? e.touches[0] : e;
    dx = t.clientX - startX;
    if (!reducedMotion()) {
      stage.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      const op = Math.min(1, Math.abs(dx) / threshold);
      if (dx < 0) { hintL.style.opacity = op; hintR.style.opacity = 0; }
      else { hintR.style.opacity = op; hintL.style.opacity = 0; }
    }
  };
  const onEnd = () => {
    if (!dragging || done) return;
    dragging = false;
    if (Math.abs(dx) > threshold) {
      done = true;
      const dir = dx < 0 ? "again" : "good";
      if (!reducedMotion()) {
        stage.style.transition = "transform .25s ease, opacity .25s ease";
        stage.style.transform = `translateX(${dx < 0 ? -500 : 500}px) rotate(${dx < 0 ? -25 : 25}deg)`;
        stage.style.opacity = "0";
      }
      setTimeout(() => rateCard(card, dir, iv), reducedMotion() ? 0 : 200);
    } else {
      reset();
    }
  };
  fc.addEventListener("touchstart", onStart, { passive: true });
  fc.addEventListener("touchmove", onMove, { passive: true });
  fc.addEventListener("touchend", onEnd);
  fc.addEventListener("touchcancel", onEnd);
}
function rateCard(card, r) {
  const isNew = !S.vocab[card.w];
  if (isNew) daily().newV++;
  daily().v++;
  // FSRS 排程（js/engine.js）。e 保留給舊版 App 讀取：忘記降、簡單升，和舊版一樣
  const prev = S.vocab[card.w] || null;
  const c = FSRS.review(prev, r, todayStr());
  const e = prev && Number.isFinite(prev.e) ? prev.e : 2.5;
  c.e = r === "again" ? Math.max(1.3, e - 0.2) : r === "easy" ? Math.min(3.0, e + 0.1) : r === "hard" ? Math.max(1.3, e - 0.15) : e;
  S.vocab[card.w] = c;
  if (r === "again") vq.push(vq.shift()); // 移到佇列尾端再問一次
  else vq.shift();
  save();
  nextCard();
}

/* ============ 通用選擇題渲染 ============ */
function renderMCQ(container, item, meta, onDone) {
  const order = optionOrder(item.opts);
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
        </div>${meta.ai ? aiOffer(correct) + reportBtnHTML() : ""}`;
      // meta.ai：{type, key, context}，答錯時提供 AI 解析（v1.3.1，只在按下按鈕才呼叫）
      const qctx = meta.ai ? { ...meta.ai, q: item.q, opts: item.opts, ans: item.ans, exp: item.exp, chosen } : null;
      if (qctx && !correct) wireAIBox(container, qctx);
      if (qctx) wireReport(container, qctx);
      onDone(correct);
    });
  });
}
/* ============ 題目回報（spec CNT-07，S1）============
   練習中覺得題目有問題（兩個答案都對、答案錯、解析看不懂）可以記下來，存在本機、可匯出，
   下一次發布時人工確認後修正。不進 S，不同步。 */
const REPORT_KEY = "toeic900_reports";
const REPORT_MAX = 200;
function loadReports() {
  try { const r = JSON.parse(localStorage.getItem(REPORT_KEY) || "[]"); return Array.isArray(r) ? r : []; } catch (e) { return []; }
}
function addReport(ctx, note) {
  const key = recId(ctx.type, ctx.key) || String(ctx.key);
  const list = loadReports().filter(r => r && typeof r === "object" && !(r.type === ctx.type && r.key === key));
  list.push({ type: ctx.type, key, custom: key.startsWith("c-"),
    context: ctx.context ? String(ctx.context).slice(0, 120) : undefined, q: ctx.q, opts: ctx.opts, ans: ctx.ans, chosen: ctx.chosen,
    note: String(note || "").slice(0, 500), at: new Date().toISOString(), v: APP_VERSION });
  try { localStorage.setItem(REPORT_KEY, JSON.stringify(list.slice(-REPORT_MAX))); return true; } catch (e) { return false; }
}
function reportBtnHTML() {
  return `<div class="report-row"><button class="btn ghost small report-btn" type="button">🚩 這題有問題</button></div>`;
}
function wireReport(root, ctx) {
  const btn = root.querySelector(".report-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const note = prompt("這題哪裡有問題？（例如：兩個答案都對、答案錯了、解析看不懂）", "");
    if (note === null) return; // 按取消
    btn.disabled = true;
    btn.textContent = addReport(ctx, note) ? "🚩 已記錄，謝謝" : "🚩 無法儲存（儲存空間已滿）";
  });
}
function exportReports() {
  const data = { app: "toeic900", kind: "question-reports", exported: new Date().toISOString(), version: APP_VERSION,
    reports: loadReports(), aiFlags: typeof AI !== "undefined" ? AI.flags() : [] };
  const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `toeic-題目回報-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
// 有音檔時顯示音檔的腔調；裝置語音只有偵測到 2 種以上腔調時才顯示標籤，避免對只有預設腔調的裝置造成無意義的雜訊
function accentTag(parts) {
  const clip = parts && parts.map(p => p.clip).find(k => AudioClips.has(k));
  if (clip) return `<span class="pill accent-pill">🔊 ${{ us: "美式", uk: "英式" }[AudioClips.accent[clip]] || "英語"}</span>`;
  if (typeof Accents === "undefined" || !Accents.ready || Accents.available().length <= 1) return "";
  return `<span class="pill accent-pill">🔊 ${esc(Accents.label(TTS.currentLang))}</span>`;
}
// 聽力播放視覺化（波紋動畫）與語速快捷鈕，Part 2 / Part 3-4 共用
function waveHTML() {
  return `<div class="wave-bars" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>`;
}
function rateQuickHTML() {
  const rates = [0.8, 0.9, 1.0, 1.1];
  const cur = Settings.get("ttsRate");
  const nearest = rates.reduce((a, b) => Math.abs(b - cur) < Math.abs(a - cur) ? b : a);
  return `<div class="rate-quick">${rates.map(r =>
    `<button data-rate="${r}" class="${r === nearest ? "active" : ""}">${r}x</button>`).join("")}</div>`;
}
function wireRateQuick(container, onChange) {
  container.querySelectorAll(".rate-quick button").forEach(b => b.addEventListener("click", () => {
    Settings.set("ttsRate", Number(b.dataset.rate));
    container.querySelectorAll(".rate-quick button").forEach(x => x.classList.toggle("active", x === b));
    if (onChange) onChange();
  }));
}
function trackReading(correct) { correct ? S.racc.r++ : S.racc.w++; }
function trackListening(cat, correct) {
  if (!S.lcat[cat]) S.lcat[cat] = { r: 0, w: 0 };
  correct ? S.lcat[cat].r++ : S.lcat[cat].w++;
}

/* ============ 聽力 ============ */
renderers.listen = function () {
  const box = $("#tab-listen");
  if (!TTS.ok && !AudioClips.complete) {
    box.innerHTML = `<div class="card"><h2>🎧 聽力訓練</h2><p class="muted">此瀏覽器不支援語音合成（speechSynthesis），請改用 Edge 或 Chrome。</p></div>`;
    return;
  }
  const p2 = S.lcat["Part 2"] || { r: 0, w: 0 }, p2t = (p2.r || 0) + (p2.w || 0);
  const l2acc = accuracyText({ right: p2.r || 0, total: p2t, ready: p2t >= ACC_MIN.L, need: Math.max(0, ACC_MIN.L - p2t),
    pct: p2t ? Math.round((p2.r || 0) / p2t * 100) : null });
  box.innerHTML = `
    <div class="card">
      ${ttsNoteHTML()}
      <h2>🎧 Part 2 應答問題</h2>
      <p class="muted">聽問句與三個回應（不顯示文字），選出最合適的回應。專攻間接回應與同字陷阱。Part 2 答對率：${l2acc}</p>
      <br><button class="btn" id="l2-start">開始 10 題</button>
    </div>
    <div class="card">
      <h2>🎧 Part 3/4 對話與短講</h2>
      <p class="muted">先讀題目再聽音檔（男女聲自動區分），聽完作答，答完可看逐字稿。</p>
    </div>
    ${PART34.map((s, i) => {
      if (isFormItem("l34", i)) return ""; // 完整聽力測驗的題組只在模擬考出現
      const best = bestOf("l34", i);
      return `<div class="item-row"><div><span class="pill">${esc(s.type)}</span> <b>${esc(s.title)}</b></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${esc(best)}/${s.qs.length}</span>` : `<span class="pill">未完成</span>`}
        <button class="btn small" data-l34="${i}">開始</button></div></div>`;
    }).join("")}`;
  $("#l2-start").addEventListener("click", () => withVoices(startL2));
  box.querySelectorAll("[data-l34]").forEach(b =>
    b.addEventListener("click", () => withVoices(() => startL34(Number(b.dataset.l34)))));
};

/* ---- Part 2 ---- */
let l2s = null;
// 有音檔時，每個回應用「標號＋句子」一起錄好的音檔（依洗牌後的位置挑 A/B/C 版本）；沒有音檔就用裝置語音分開念
function l2Audio(item, order) {
  return [{ t: item.q, s: "N", pause: 700, clip: ClipKey.q(item.q) }].concat(
    order.map((oi, pos) => {
      const L = "ABC"[pos];
      return { t: item.opts[oi], s: "N", pause: 500, clip: ClipKey.r(L, item.opts[oi]),
        fb: [{ t: L + ".", s: "N", pause: 150 }, { t: item.opts[oi], s: "N" }] };
    }));
}
function startL2() {
  // Part 2 沒有類別統計，所以只做「已出過」輪替，不做弱項加權
  const ws = new Set(weakSkills("l2"));
  const ids = drawRound("l2seen", PART2.length, ROUND_N,
    wbKeys("l2").map(Number).filter(i => !isFormItem("l2", i)), ws.size ? (i => ws.has(PART2[i].sk)) : null, i => isFormItem("l2", i));
  save(); // l2seen 已更新
  l2s = { ids, at: 0, right: 0 };
  l2Next();
}
function l2Next() {
  const s = l2s, box = $("#tab-listen");
  if (s.at >= s.ids.length) {
    box.innerHTML = `
      <div class="card result-banner">
        <div class="score">${s.right} / ${s.ids.length}</div>
        <p class="muted">${s.right === s.ids.length ? "本輪全對！之後用新題再確認一次 🏆" : "答錯的題目已加入錯題本。"}</p>
        <br><button class="btn" id="l2-again">再來 10 題</button>
        <button class="btn secondary" id="l2-back">返回</button>
      </div>`;
    Anim.scoreReveal(box.querySelector(".score"), s.right, s.ids.length);
    $("#l2-again").addEventListener("click", () => withVoices(startL2));
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
        ${waveHTML()}
        <p class="muted">聆聽問句與 (A)(B)(C) 三個回應</p>
        <div id="l2-accent" style="margin-bottom:8px"></div>
        <button class="btn ghost small" id="l2-replay">▶ 重播</button>
        ${rateQuickHTML()}
        ${ttsNoteHTML(l2Audio(item, order))}
      </div>
      <div class="rating-row" id="l2-abc">
        ${order.map((_, pos) => `<button style="background:var(--panel2);border:1px solid var(--border2)" data-pos="${pos}">${"ABC"[pos]}</button>`).join("")}
      </div>
      <div class="feedback"></div>
      <div id="l2-nav" style="text-align:right;margin-top:10px"></div>
    </div>`;
  // 這個函式由「開始」或「下一題」的點擊直接呼叫，第一段語音因此在點擊手勢內送出
  const play = () => { hideSilentHelp(); TTS.seq(l2Audio(item, order), { onSilent: () => showSilentHelp(play) }); $("#l2-accent").innerHTML = accentTag(l2Audio(item, order)); };
  play();
  $("#l2-replay").addEventListener("click", play);
  wireRateQuick(box, play);
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
        </div>${aiOffer(correct)}${reportBtnHTML()}`;
      const l2ctx = { type: "l2", key: id, q: item.q, opts: item.opts, ans: item.ans, exp: item.exp, chosen: order[pos] };
      if (!correct) wireAIBox(box, l2ctx);
      wireReport(box, l2ctx);
      trackListening("Part 2", correct);
      wbMark("l2", id, correct);
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
  return [{ t: "", s: "N", pause: 350, clip: ClipKey.c(set.turns), fb: set.turns.map(t => ({ t: t.t, s: t.s, pause: 450 })) }];
}
function startL34(si) {
  const set = PART34[si];
  const state = { at: 0, right: 0 };
  const box = $("#tab-listen");
  function render() {
    if (state.at >= set.qs.length) {
      setBest("l34", si, state.right);
      daily().l34++;
      save();
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${set.qs.length}</div>
          <p class="muted">${state.right === set.qs.length ? "全對！🏆" : "答錯的題目已加入錯題本。"}</p>
        </div>
        <div class="card"><h3>📜 逐字稿</h3><div class="passage">${transcript(set)}</div>
          <div style="text-align:right"><button class="btn" id="l34-back">返回列表</button></div></div>`;
      Anim.scoreReveal(box.querySelector(".score"), state.right, set.qs.length);
      $("#l34-back").addEventListener("click", renderers.listen);
      updateNavBadges();
      return;
    }
    box.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <h2>${esc(set.type)} · ${esc(set.title)}</h2>
          <button class="btn ghost small" id="l34-replay">▶ 重播音檔</button>
        </div>
        <p class="muted">先讀題目，音檔播放中即可作答。</p>
        ${waveHTML()}
        <div id="l34-accent" style="margin:4px 0 8px;text-align:center"></div>
        ${rateQuickHTML()}
        ${ttsNoteHTML(l34Audio(set))}
        ${graphicHTML(set)}
        <div id="l34-q"></div>
        <div id="l34-nav" style="text-align:right"></div>
      </div>`;
    const playL34 = () => { hideSilentHelp(); TTS.seq(l34Audio(set), { onSilent: () => showSilentHelp(playL34) }); $("#l34-accent").innerHTML = accentTag(l34Audio(set)); };
    if (state.at === 0) playL34();
    $("#l34-replay").addEventListener("click", playL34);
    wireRateQuick(box, playL34);
    const q = set.qs[state.at];
    renderMCQ($("#l34-q"), q, { progress: `第 ${state.at + 1} / ${set.qs.length} 題`,
      ai: { type: "l34", key: `${si}-${state.at}`, context: aiTranscript(set) } }, (correct) => {
      const key = `${si}-${state.at}`;
      trackListening("Part 3-4", correct);
      if (correct) state.right++;
      wbMark("l34", key, correct);
      save();
      $("#l34-nav").innerHTML = `<button class="btn" id="l34-nextbtn">${state.at + 1 >= set.qs.length ? "看結果與逐字稿" : "下一題"} →</button>`;
      $("#l34-nextbtn").addEventListener("click", () => { state.at++; render(); });
    });
  }
  render();
}
// 圖表題（Look at the graphic）的圖表：作答時要看得到，用等寬字顯示表格
function graphicHTML(set) {
  return set && set.graphic ? `<div class="passage graphic">${esc(set.graphic)}</div>` : "";
}
function transcript(set) {
  const name = { M: "男", W: "女", M2: "男 2", W2: "女 2", N: "" };
  return set.turns.map(t => `${t.s !== "N" ? `（${name[t.s]}）` : ""}${esc(t.t)}`).join("\n\n");
}
// 送給 AI 解析的純文字文章與逐字稿（不經 esc，不會顯示在畫面上）
function aiTranscript(set) {
  const name = { M: "男", W: "女", M2: "男 2", W2: "女 2", N: "旁白" };
  const lines = set.turns.map(t => `${name[t.s] || t.s}：${t.t}`).join("\n");
  return set.graphic ? `${lines}\n\n【題目附的圖表】\n${set.graphic}` : lines;
}
function aiPassages(set) {
  return set.passages.length > 1 ? set.passages.map((t, i) => `（文章 ${i + 1}）\n${t}`).join("\n\n") : set.passages[0];
}

/* ============ Part 5 ============ */
let p5session = null;
renderers.p5 = function () { p5Menu(); };
function p5Menu() {
  $("#tab-p5").innerHTML = `
    <div class="card">
      <h2>📝 Part 5 單句文法快攻</h2>
      <p class="muted">每輪 10 題，附中文詳解。目標：每題 20 秒內作答。題庫共 ${PART5.filter((q, i) => !isFormItem("p5", i)).length} 題，答錯自動進入錯題本。</p>
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
      <span class="val">${pct}%（${esc(s.r)}/${esc(total)}）</span></div>`;
  }).join("");
}
const ROUND_N = 10;          // 每輪題數
const WEAK_ACC = 0.85;       // 正確率低於此值算弱項（900+ 的 Part 5 目標線）
const WEAK_MIN_SAMPLE = 5;   // 至少答過幾題才納入弱項判斷，避免第一題就答錯被誤判成弱項
const WEAK_SHARE = 0.5;      // 非錯題名額中保留給弱項的比例（10 題約 4–6 題）

// 依 S.cat 找出「正確率不足且樣本夠」的類別。統計頁與模考報告早就在算弱項了，
// 但出題端一直沒查 item.cat，等於診斷出弱項卻不餵對應的題。
function weakCats() {
  const set = new Set();
  Object.entries(S.cat || {}).forEach(([c, s]) => {
    const total = (s.r || 0) + (s.w || 0);
    if (total >= WEAK_MIN_SAMPLE && s.r / total < WEAK_ACC) set.add(c);
  });
  return set;
}

// 抽一輪題：錯題優先，其餘從「沒出過的」裡面抽；沒出過的不足一輪就重置該類 seen 重新輪替
// （照抄 Mock.draw 的作法）。isWeak 可選，用來把一部分名額留給弱項類別。
// 回傳的陣列長度最多 n，題庫比 n 小時就自然變短，不會卡住也不會湊不出題。
// 完整閱讀測驗：題目在題庫中以 form 標記（例如 form: "R1"），測驗時依 Part 5 → 6 → 7 的順序出完所有題目
const FORMS = [
  { id: "R1", name: "完整閱讀測驗 第 1 回", secs: 75 * 60 },
  { id: "R2", name: "完整閱讀測驗 第 2 回", secs: 75 * 60 },
  { id: "R3", name: "完整閱讀測驗 第 3 回", secs: 75 * 60 },
  // 聽力測驗沒有倒數：跟著音檔節奏進行（Part 1 待補，所以是 94 題）
  { id: "L1", name: "完整聽力測驗 第 1 回", kind: "listen", mins: 40 },
  { id: "L2", name: "完整聽力測驗 第 2 回", kind: "listen", mins: 40 }
];
const isListenForm = f => !!f && f.kind === "listen";
// 完整測驗（forms）的題目：保留給完整測驗，一般練習與隨機模考都不抽（答錯後會進錯題本，可以在錯題本重考）
function isFormItem(type, i) {
  const arr = { p5: PART5, p6: PART6, p7: PART7, l2: PART2, l34: PART34 }[type];
  return !!(arr && i < BASE_N[type] && arr[i] && arr[i].form);
}
function drawRound(seenKey, poolSize, n, wrongIds, isWeak, isHidden) {
  if (!S[seenKey] || typeof S[seenKey] !== "object") S[seenKey] = {};
  const type = { p5seen: "p5", l2seen: "l2" }[seenKey];
  const seen = { has: i => !!S[seenKey][recId(type, i)], add: i => { const id = recId(type, i); if (id) S[seenKey][id] = true; } };
  const hidden = i => !!(isHidden && isHidden(i));
  // 錯題優先，且不受 seen 影響——錯題本的題目本來就該重複出現直到掌握
  const ids = shuffle(wrongIds.filter(i => Number.isInteger(i) && i >= 0 && i < poolSize)).slice(0, n);
  const taken = new Set(ids);
  // 遷移練習：上一輪答錯的技能，各出一道沒做過的同技能新題（最多 3 題），出過就從佇列移除
  const queue = type && S.tq && Array.isArray(S.tq[type]) ? S.tq[type] : [];
  const arr = type ? BANK_ARRAYS()[type] : [];
  const transfer = [];
  while (queue.length && ids.length < n && transfer.length < 3) {
    const sk = queue.shift();
    const pick = shuffle(Array.from({ length: poolSize }, (_, i) => i)
      .filter(i => arr[i] && arr[i].sk === sk && !taken.has(i) && !hidden(i) && !seen.has(i)))[0];
    if (pick !== undefined) { ids.push(pick); taken.add(pick); transfer.push(pick); }
  }
  let need = n - ids.length;
  if (need > 0) {
    let fresh = [];
    for (let i = 0; i < poolSize; i++) if (!seen.has(i) && !taken.has(i) && !hidden(i)) fresh.push(i);
    if (fresh.length < need) {
      S[seenKey] = {}; // 題庫輪替一圈，重置後重新洗牌
      fresh = [];
      for (let i = 0; i < poolSize; i++) if (!taken.has(i) && !hidden(i)) fresh.push(i);
    }
    // 弱項配額只在「真的有弱項資料」時才生效；沒有弱項時 weak 為空，行為等同原本的純隨機
    const weak = isWeak ? shuffle(fresh.filter(isWeak)) : [];
    const quota = Math.min(need, Math.round(need * WEAK_SHARE), weak.length);
    const picked = weak.slice(0, quota);
    const pickedSet = new Set(picked);
    // 補滿剩餘名額時要「先非弱項、剩下再拿弱項」。若直接從整個 fresh 補，弱項題本身也在
    // fresh 裡會被重複抽中——實測 10 題會塞進 6–8 題弱項，整輪都在練同一類反而失衡。
    // 末端仍接上剩餘的弱項題當後備，確保題庫偏斜時依然湊得滿一輪。
    const isW = i => !!(isWeak && isWeak(i));
    const rest = fresh.filter(i => !pickedSet.has(i));
    shuffle(rest.filter(i => !isW(i))).concat(shuffle(rest.filter(isW)))
      .forEach(i => { if (picked.length < need) { picked.push(i); pickedSet.add(i); } });
    picked.forEach(i => { ids.push(i); taken.add(i); });
  }
  ids.forEach(i => seen.add(i));
  return shuffle(ids);
}
function startP5() {
  const ws = new Set(weakSkills("p5"));
  const weak = weakCats();
  const isWeak = ws.size ? (i => ws.has(PART5[i].sk)) : weak.size ? (i => weak.has(PART5[i].cat)) : null;
  const ids = drawRound("p5seen", PART5.length, ROUND_N,
    wbKeys("p5").map(Number).filter(i => !isFormItem("p5", i)), isWeak, i => isFormItem("p5", i));
  save(); // p5seen 已更新
  p5session = { ids, at: 0, right: 0, t0: Date.now() };
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
        <p class="muted">${s.right === s.ids.length ? "本輪全對！之後用新題再確認一次 🏆" : "答錯的題目已加入錯題本，記得複習。"}</p>
        <br><button class="btn" id="p5-again">再來 10 題</button>
        <button class="btn secondary" id="p5-back">返回</button>
      </div>`;
    Anim.scoreReveal(document.querySelector("#tab-p5 .score"), s.right, s.ids.length);
    $("#p5-again").addEventListener("click", startP5);
    $("#p5-back").addEventListener("click", p5Menu);
    updateNavBadges();
    return;
  }
  const id = s.ids[s.at];
  const item = PART5[id];
  const box = $("#tab-p5");
  box.innerHTML = `<div class="card" id="p5-q"></div><div id="p5-nav" style="text-align:right"></div>`;
  renderMCQ($("#p5-q"), item, { progress: `第 ${s.at + 1} / ${s.ids.length} 題`, cat: item.cat, ai: { type: "p5", key: id } }, (correct) => {
    if (!S.cat[item.cat]) S.cat[item.cat] = { r: 0, w: 0 };
    if (correct) { S.cat[item.cat].r++; s.right++; } else S.cat[item.cat].w++;
    wbMark("p5", id, correct);
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
      if (p.form) return ""; // 完整測驗的篇章不列在一般練習
      const best = bestOf("p6", i);
      return `<div class="item-row"><div><b>${esc(p.title)}</b></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${esc(best)}/4</span>` : `<span class="pill">未完成</span>`}
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
      setBest("p6", pi, state.right);
      daily().p6++;
      save();
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${p.blanks.length}</div>
          <p class="muted">${state.right === p.blanks.length ? "全對！🏆" : "答錯的空格已加入錯題本。"}</p>
          <br><button class="btn" id="p6-back">返回列表</button>
        </div>`;
      Anim.scoreReveal(box.querySelector(".score"), state.right, p.blanks.length);
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
      { progress: `空格 ${state.at + 1} / ${p.blanks.length}`, ai: { type: "p6", key: `${pi}-${state.at}`, context: p.text } }, (correct) => {
        const key = `${pi}-${state.at}`;
        if (correct) state.right++;
        wbMark("p6", key, correct);
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
      if (p.form) return ""; // 完整測驗的題組不列在一般練習
      const best = bestOf("p7", i);
      return `<div class="item-row"><div><b>${esc(p.title)}</b><br>
        <span class="muted">${p.qs.length} 題 · 建議 ${Math.round(p.time / 60)} 分鐘</span></div>
        <div>${best !== undefined ? `<span class="pill ok">最佳 ${esc(best)}/${p.qs.length}</span>` : `<span class="pill">未完成</span>`}
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
      setBest("p7", si, state.right);
      daily().p7++;
      save();
      const used = set.time - state.left;
      box.innerHTML = `
        <div class="card result-banner">
          <div class="score">${state.right} / ${set.qs.length}</div>
          <p>用時 ${Math.floor(used / 60)} 分 ${used % 60} 秒（建議 ${Math.round(set.time / 60)} 分鐘）</p>
          <p class="muted">${state.right === set.qs.length ? "本篇全對！換一篇新文章再確認一次 🏆" : "答錯的題目已加入錯題本。"}</p>
          <br><button class="btn" id="p7-back">返回列表</button>
        </div>`;
      Anim.scoreReveal(box.querySelector(".score"), state.right, set.qs.length);
      $("#p7-back").addEventListener("click", renderers.p7);
      updateNavBadges();
      return;
    }
    const q = set.qs[state.at];
    renderMCQ($("#p7-q"), q, { progress: `第 ${state.at + 1} / ${set.qs.length} 題`,
      ai: { type: "p7", key: `${si}-${state.at}`, context: aiPassages(set) } }, (correct) => {
      const key = `${si}-${state.at}`;
      if (correct) state.right++;
      wbMark("p7", key, correct);
      trackReading(correct);
      save();
      $("#p7-nav").innerHTML = `<button class="btn" id="p7-nextbtn">下一題 →</button>`;
      // 先清掉按鈕再換題：最後一題時 renderQ() 會換成結算畫面，#p7-nav 就不存在了
      $("#p7-nextbtn").addEventListener("click", () => { $("#p7-nav").innerHTML = ""; state.at++; renderQ(); });
    });
  }
  renderQ();
}

/* ============ 錯題本 ============ */
renderers.wrong = function () {
  const entries = [];
  // st(type, key)：錯題的掌握進度，讓列表能說明「為什麼答對了還在這裡」
  const st = (type, key) => {
    const e = wbNorm(wbGet(type, key));
    return { remain: Math.max(1, WB_MASTER_N - e.n), todayDone: e.last === todayStr() };
  };
  wbKeys("p5").forEach(id => entries.push({ type: "p5", key: id, label: `Part 5 · ${PART5[id].cat}`, text: PART5[id].q, ...st("p5", id) }));
  wbKeys("p6").forEach(key => {
    const [pi, bi] = key.split("-").map(Number);
    entries.push({ type: "p6", key, label: `Part 6 · ${PART6[pi].title}`, text: `空格 [${bi + 1}]`, ...st("p6", key) });
  });
  wbKeys("p7").forEach(key => {
    const [si, qi] = key.split("-").map(Number);
    entries.push({ type: "p7", key, label: `Part 7 · ${PART7[si].title}`, text: PART7[si].qs[qi].q, ...st("p7", key) });
  });
  wbKeys("l2").forEach(id => entries.push({ type: "l2", key: id, label: `聽力 Part 2`, text: "應答問題（重新聆聽作答）", ...st("l2", id) }));
  wbKeys("l34").forEach(key => {
    const [si, qi] = key.split("-").map(Number);
    entries.push({ type: "l34", key, label: `聽力 · ${PART34[si].title}`, text: PART34[si].qs[qi].q, ...st("l34", key) });
  });
  const box = $("#tab-wrong");
  if (!entries.length) {
    box.innerHTML = `<div class="card result-banner"><div style="font-size:3rem">✨</div>
      <h2>錯題本是空的</h2><p class="muted">答錯的題目會自動收錄到這裡，連續答對 ${WB_MASTER_N} 次（需分在不同天）即可移除。</p>
      <br><button class="btn" id="wrong-empty-go">去練習</button></div>`;
    $("#wrong-empty-go").addEventListener("click", () => switchTab("practice"));
    return;
  }
  box.innerHTML = `
    <div class="card"><h2>📕 錯題本（${entries.length} 題）</h2>
    <p class="muted">要連續答對 ${WB_MASTER_N} 次、且分在不同天，才會從錯題本移除——四選一有 25% 猜中率，
    剛看完詳解就答對通常只是記得答案，隔天還答得出來才算真的學會。${phase().name === "衝刺期" ? "衝刺期目標：每天清零！" : ""}</p></div>
    ${entries.map((e, i) => `
      <div class="item-row"><div style="flex:1"><span class="pill">${esc(e.label)}</span>
        <span class="pill">再答對 ${e.remain} 次移除</span>${e.todayDone ? `<span class="pill">今天已計，明天再來</span>` : ""}<br>
        <span class="muted">${esc(e.text.slice(0, 80))}${e.text.length > 80 ? "…" : ""}</span></div>
        <button class="btn small" data-retry="${i}">重新挑戰</button></div>`).join("")}
    <div id="wrong-quiz"></div>`;
  box.querySelectorAll("[data-retry]").forEach(b =>
    b.addEventListener("click", () => {
      const entry = entries[Number(b.dataset.retry)];
      if (entry.type === "l2" || entry.type === "l34") withVoices(() => retryWrong(entry));
      else retryWrong(entry);
    }));
};
function retryWrong(entry) {
  const d = daily();
  const box = $("#wrong-quiz");
  box.innerHTML = `<div class="card" id="wq-inner"></div>`;
  box.scrollIntoView({ behavior: "smooth" });
  const finish = (correct) => {
    // 先記下答題前的狀態，才能分辨「這次答對有沒有計入」——同一天內重複答對是不加次數的，
    // 不講清楚使用者會以為答對了卻沒反應。
    const before = wbNorm(wbGet(entry.type, entry.key));
    wbMark(entry.type, entry.key, correct);
    const after = wbGet(entry.type, entry.key);
    d.wr = (d.wr || 0) + 1;
    save();
    let msg;
    if (!correct) msg = "還沒完全掌握，連對次數已歸零，題目保留在錯題本。";
    else if (after === undefined) msg = `✅ 連續答對 ${WB_MASTER_N} 次（跨天），已從錯題本移除！`;
    else if (before.last === todayStr()) msg = "✅ 答對了！但今天已經計過一次，明天再答對一次才能移除。";
    else msg = `✅ 答對了！再答對 ${wbRemain(after)} 次（需不同天）即可移除。`;
    $("#wq-nav").innerHTML = `
      <p class="muted" style="text-align:left">${msg}</p>
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
        <button class="btn ghost small" id="wq-replay">▶ 重播</button>${ttsNoteHTML(l2Audio(item, order))}</div>
      <div class="rating-row" id="wq-abc">
        ${order.map((_, pos) => `<button style="background:var(--panel2);border:1px solid var(--border2)" data-pos="${pos}">${"ABC"[pos]}</button>`).join("")}
      </div>
      <div class="feedback"></div><div id="wq-nav" style="text-align:right;margin-top:10px"></div>`;
    const play = () => { hideSilentHelp(); TTS.seq(l2Audio(item, order), { onSilent: () => showSilentHelp(play) }); };
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
          <b>Q:</b> ${esc(item.q)}<br>${order.map((oi, p) => `<b>(${"ABC"[p]})</b> ${esc(item.opts[oi])}`).join("<br>")}<br><br>${esc(item.exp)}</div>${aiOffer(correct)}${reportBtnHTML()}`;
        const wctx = { type: "l2", key: entry.key, q: item.q, opts: item.opts, ans: item.ans, exp: item.exp, chosen: order[pos] };
        if (!correct) wireAIBox(inner, wctx);
        wireReport(inner, wctx);
        // 錯題本重考不呼叫 trackListening：重考的是做過的題，計入會墊高答對率（閱讀也不計，口徑一致）
        finish(correct);
      });
    });
    return;
  }
  let item, meta = {}, passageHtml = "", audio = null;
  meta.ai = { type: entry.type, key: entry.key };
  if (entry.type === "p5") {
    item = PART5[entry.key];
    meta.cat = item.cat;
  } else if (entry.type === "p6") {
    const [pi, bi] = entry.key.split("-").map(Number);
    const blank = PART6[pi].blanks[bi];
    item = { q: `空格 [${bi + 1}] 應填入：`, opts: blank.opts, ans: blank.ans, exp: blank.exp };
    passageHtml = `<div class="passage">${esc(PART6[pi].text)}</div>`;
    meta.ai.context = PART6[pi].text;
  } else if (entry.type === "l34") {
    const [si, qi] = entry.key.split("-").map(Number);
    item = PART34[si].qs[qi];
    audio = PART34[si];
    meta.ai.context = aiTranscript(audio);
    passageHtml = `<div style="text-align:center;padding:8px"><button class="btn ghost small" id="wq-replay">▶ 重播音檔</button>${ttsNoteHTML(l34Audio(audio))}</div>${graphicHTML(audio)}`;
  } else {
    const [si, qi] = entry.key.split("-").map(Number);
    item = PART7[si].qs[qi];
    passageHtml = PART7[si].passages.map(t => `<div class="passage">${esc(t)}</div>`).join("");
    meta.ai.context = aiPassages(PART7[si]);
  }
  const inner = $("#wq-inner");
  inner.innerHTML = `${passageHtml}<div id="wq-q"></div><div id="wq-nav" style="text-align:right"></div>`;
  if (audio) {
    const playAudio = () => { hideSilentHelp(); TTS.seq(l34Audio(audio), { onSilent: () => showSilentHelp(playAudio) }); };
    playAudio();
    $("#wq-replay").addEventListener("click", playAudio);
  }
  renderMCQ($("#wq-q"), item, meta, (correct) => {
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
          ${Sync.lastSynced ? `上次同步：${Sync.lastSynced.toLocaleTimeString("zh-TW")}` : Sync.code ? "尚未完成過同步" : ""}
          ${!navigator.onLine ? `<br><span style="color:var(--warn)">⚠️ 目前離線，紀錄先存本機，恢復網路後會自動同步</span>` : ""}
          ${Sync.code && Sync.weakCode(Sync.code) ? `<br><span style="color:var(--warn)">⚠️ 這組代碼太短，別人有可能猜到。建議按「升級為更長的代碼」。</span>` : ""}
          ${Sync.code && !Sync.weakCode(Sync.code) && Sync.shortCode(Sync.code) ? `<br><span class="muted">💡 這是舊版的 10 字元代碼，仍然安全；想要更高的保護可以按「升級為更長的代碼」。</span>` : ""}
          ${Sync.lastError === "moved" ? `<br><span style="color:var(--warn)">⚠️ 這組代碼已經在另一台裝置升級成新代碼，這台已停止同步。請到那台裝置的這一頁查看新代碼，輸入後按「套用」。</span>`
            : Sync.lastError === "decrypt" ? `<br><span style="color:var(--warn)">⚠️ 雲端資料無法驗證（可能被竄改或損毀），沒有套用到這台裝置。可以按「用這台裝置的資料重建雲端」。</span>`
            : Sync.lastError ? `<br><span style="color:var(--warn)">⚠️ 上次同步失敗（${Sync.lastError === "read" ? "讀取" : "寫入"}），請確認網路後按「立即同步」。</span>` : ""}
        </p>
        <p class="muted">在第一台裝置按「產生新代碼」，然後把代碼抄到第二台裝置的輸入框按「套用」——兩台裝置從此自動同步（存檔後約 1.5 秒同步，開啟頁面時自動抓取最新進度）。兩台裝置都有作答時會合併，不會互相覆蓋。</p>
        <p class="muted">🔒 雲端上的資料用同步代碼加密，沒有代碼的人（包括資料庫管理者）看不到內容。代碼就是鑰匙：請勿分享，弄丟了雲端資料也無法取回（本機紀錄不受影響）。</p><br>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input id="sync-code-input" value="${esc(Sync.code)}" placeholder="貼上同步代碼，如 ab3de-f7gh9-k2mnp-qr5st"
            style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit;min-width:180px">
          <button class="btn small" id="sync-apply">套用</button>
          <button class="btn secondary small" id="sync-gen">產生新代碼</button>
          ${Sync.code ? `<button class="btn ghost small" id="sync-now">立即同步</button><button class="btn ghost small" id="sync-clear">解除此裝置同步</button>` : ""}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px">
          ${Sync.code && Sync.shortCode(Sync.code) && Sync.lastError !== "moved" ? `<button class="btn secondary small" id="sync-upgrade">升級為更長的代碼</button>` : ""}
          ${Sync.code && Sync.lastError === "decrypt" ? `<button class="btn ghost small" id="sync-rebuild">用這台裝置的資料重建雲端</button>` : ""}
          ${Sync.code ? `<button class="btn ghost small" id="sync-delete">刪除雲端資料</button>` : ""}
        </div>
        <p class="muted" id="sync-status" style="margin-top:8px"></p>`}
    </div>
    <div class="card">
      <h2>💾 備份與還原</h2>
      <p class="muted">紀錄每次作答都會即時自動存檔到瀏覽器（localStorage），但清除瀏覽資料或換電腦會遺失——請定期匯出備份檔。上次備份：<b>${esc(S.lastBackup || "從未備份")}</b>${backupDue() ? ' <span style="color:var(--warn)">（建議立即備份）</span>' : ""}</p><br>
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
      const v = $("#sync-code-input").value.trim().toLowerCase();
      if (!v) return;
      if (!Sync.validCode(v)) {
        $("#sync-status").textContent = "代碼格式不正確：需為 4–64 個英文小寫或數字，可用單一連字號分段（例如 ab3de-f7gh9）。";
        return;
      }
      // 自訂的短代碼容易被猜到（2026-10-07 資安審查 M3）。為了不讓已在使用的舊代碼無法跨裝置套用，只警告不禁止
      if (Sync.weakCode(v) && !confirm("這組代碼少於 10 個英數字，別人有可能猜到並讀取或覆蓋你的學習紀錄。\n\n建議改用「產生新代碼」。仍要使用這組代碼嗎？")) return;
      Sync.setCode(v);
      $("#sync-status").textContent = "同步中…（第一次需要幾秒鐘產生加密金鑰）";
      await Sync.syncNow(); // 雲端和這台裝置的紀錄會合併
      renderers.bank();
      updateNavBadges();
    });
    $("#sync-gen").addEventListener("click", async () => {
      if (Sync.code && !confirm("產生新代碼後，這台裝置會改用新代碼，其他裝置要重新輸入新代碼才會繼續同步。\n\n如果只是想讓舊代碼更安全，建議改按「升級為更長的代碼」。確定要產生新代碼嗎？")) return;
      Sync.setCode(Sync.genCode());
      $("#sync-status").textContent = "同步中…";
      await Sync.syncNow();
      renderers.bank();
    });
    if (Sync.code) {
      $("#sync-now").addEventListener("click", async () => {
        $("#sync-status").textContent = "同步中…";
        await Sync.syncNow();
        renderers.bank();
      });
      const upg = $("#sync-upgrade");
      if (upg && upg.addEventListener) upg.addEventListener("click", async () => {
        if (!confirm("會產生一組 20 個字元的新代碼，雲端資料搬到新代碼，舊代碼停用。\n\n其他裝置下次開啟時會提示你輸入新代碼。要繼續嗎？")) return;
        $("#sync-status").textContent = "升級中…";
        const code = await Sync.upgradeCode();
        renderers.bank();
        if (code) alert(`新的同步代碼：\n\n${code}\n\n請到其他裝置的「題庫/備份」頁輸入這組代碼並按「套用」。`);
        else $("#sync-status").textContent = "升級失敗，請確認網路後再試一次。舊代碼仍可使用。";
      });
      const rebuild = $("#sync-rebuild");
      if (rebuild && rebuild.addEventListener) rebuild.addEventListener("click", async () => {
        if (!confirm("雲端上無法驗證的資料會被這台裝置的紀錄取代。確定嗎？")) return;
        if (await Sync.deleteCloud()) { Sync.lastError = null; await Sync.syncNow(); }
        renderers.bank();
      });
      $("#sync-delete").addEventListener("click", async () => {
        if (!confirm("刪除雲端上的學習紀錄與自訂題庫？\n\n這台裝置的紀錄不受影響，但其他裝置將無法再從雲端取得進度。這台裝置也會解除同步。")) return;
        const ok = await Sync.deleteCloud();
        if (ok) Sync.clearCode();
        renderers.bank();
        alert(ok ? "雲端資料已刪除，這台裝置已解除同步。" : "刪除失敗，請確認網路後再試一次。");
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
// 技能掌握度（v1.7）：每項技能一般難度題目的預估答對率；作答少於 5 題顯示「資料不足」
function masteryCard() {
  const PART_NAME = { p5: "Part 5", p6: "Part 6", p7: "Part 7", l2: "聽力 Part 2", l34: "聽力 Part 3/4" };
  const groups = Object.keys(PART_NAME).map(t => {
    const rows = SKILLS.filter(s => s.part === t).map(s => {
      const m = (S.mastery || {})[s.id];
      if (!Mastery.enough(m)) return `<div class="bar-row"><span class="lbl">${esc(s.name)}</span><div class="bar-track"></div><span class="val muted">資料不足（${m ? m.n : 0} 題）</span></div>`;
      const pct = Math.round(Mastery.level(m, t) * 100);
      return `<div class="bar-row"><span class="lbl">${esc(s.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%${pct < WEAK_LEVEL * 100 ? ";background:var(--warn)" : ""}"></div></div><span class="val">${pct}%（${m.n} 題）</span></div>`;
    }).join("");
    return `<h3 style="margin-top:12px">${PART_NAME[t]}</h3>${rows}`;
  }).join("");
  return `<div class="card"><h2>🎯 技能掌握度</h2>
    <p class="muted">依每題的作答更新，數字是「一般難度的題目預估答對率」。低於 70% 的技能會標成橘色，Part 5 與聽力 Part 2 會多出這些技能的題目；答錯的技能下一輪會出一題同技能的新題。</p>
    <details><summary>展開 36 項技能</summary>${groups}</details></div>`;
}
renderers.stats = function () {
  const cards = Object.values(S.vocab);
  const mastered = cards.filter(c => c.i >= 21).length;
  const learning = cards.length - mastered;
  const unseen = VOCAB.length - cards.length;
  const acc = practiceAccuracy();
  const accTile = (a, name) => `<div class="stat-tile"><div class="num">${a.ready ? `${a.pct}%` : "—"}</div>
    <div class="lbl">${name}答對率 · ${a.ready ? `${a.right}/${a.total} 題` : `再答 ${a.need} 題後顯示`}</div></div>`;

  // 近 14 天活動熱圖
  const heat = [];
  for (let i = 13; i >= 0; i--) {
    const n = dayTotal(S.daily[todayStr(-i)]);
    const lvl = n === 0 ? "" : n < 10 ? "l1" : n < 30 ? "l2" : "l3";
    heat.push(`<div class="cell ${lvl}" title="${todayStr(-i)}：${n} 項">${Number(todayStr(-i).slice(8))}</div>`);
  }
  const vocabPct = (n) => VOCAB.length ? Math.round(n / VOCAB.length * 100) : 0;
  const lcatLabel = { "Part 3-4": "Part 3/4" }; // 儲存用的 key 不可含 "/"（Firebase 限制），顯示時換回正確名稱
  const lBars = Object.entries(S.lcat).map(([c, s]) => {
    const total = s.r + s.w, pct = total ? Math.round(s.r / total * 100) : 0;
    return `<div class="bar-row"><span class="lbl">${esc(lcatLabel[c] || c)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="val">${pct}%（${esc(s.r)}/${esc(total)}）</span></div>`;
  }).join("") || `<p class="muted">尚無聽力作答紀錄</p>`;
  $("#tab-stats").innerHTML = `
    <div class="hero">
      <div class="stat-tile"><div class="num">🔥 ${streak()}</div><div class="lbl">連續學習天數</div></div>
      ${accTile(acc.L, "聽力")}
      ${accTile(acc.R, "閱讀")}
      <div class="stat-tile"><div class="num">${mastered}</div><div class="lbl">已精通單字</div></div>
    </div>
    <div class="card"><p class="muted">答對率是本工具內一般練習與模擬考的累計結果（不含錯題本重考），不是 TOEIC 分數；要評估考試程度，請用完整、計時的正式模擬試題。</p></div>
    <div class="card">
      <h2>📅 近 14 天學習熱圖</h2>
      <div class="heat">${heat.join("")}</div>
    </div>
    <div class="card"><h2>🎧 聽力各類別正確率</h2>${lBars}</div>
    ${masteryCard()}
    <div class="card"><h2>🧩 Part 5 各文法類別正確率</h2>${catBars()}</div>
    <div class="card">
      <h2>📖 單字掌握進度</h2>
      <div class="bar-row"><span class="lbl">已精通</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(mastered)}%"></div></div><span class="val">${mastered}</span></div>
      <div class="bar-row"><span class="lbl">學習中</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(learning)}%;background:var(--warn)"></div></div><span class="val">${learning}</span></div>
      <div class="bar-row"><span class="lbl">未學習</span><div class="bar-track"><div class="bar-fill" style="width:${vocabPct(unseen)}%;background:var(--panel2)"></div></div><span class="val">${unseen}</span></div>
    </div>
    <div class="card" id="ext-card">
      <h2>📝 外部測驗成績</h2>
      <p class="muted">在其他地方做的完整測驗（網路模擬試題、補習班模考）可以記在這裡追蹤。這些成績不是本工具算的，各家難度也不同，只能看大致趨勢；真正的分數以正式考試為準。</p>
      <div class="ext-form">
        <input type="date" id="ext-date" value="${todayStr()}" aria-label="測驗日期">
        <input type="text" id="ext-src" maxlength="60" placeholder="來源（例如：某網站模擬試題 3）" aria-label="測驗來源">
        <input type="number" id="ext-l" min="0" max="495" step="5" placeholder="聽力" aria-label="聽力分數（0–495）">
        <input type="number" id="ext-r" min="0" max="495" step="5" placeholder="閱讀" aria-label="閱讀分數（0–495）">
        <button class="btn small" id="ext-add">記錄</button>
      </div>
      <p class="muted" id="ext-msg" aria-live="polite"></p>
      ${(S.ext || []).length ? `<div class="ext-list">${S.ext.map((e, i) => ({ e, i })).sort((a, b) => b.e.date.localeCompare(a.e.date)).map(({ e, i }) => `
        <div class="item-row"><div><b>${esc(e.date)}</b> <span class="muted">${esc(e.src || "未填來源")}</span><br>
          聽力 ${e.L ? esc(e.L) : "—"} · 閱讀 ${e.R ? esc(e.R) : "—"}${e.L && e.R ? ` · 合計 <b>${esc(e.L + e.R)}</b>` : ""}</div>
          <button class="btn ghost small" data-ext-del="${i}" aria-label="刪除這筆紀錄">刪除</button></div>`).join("")}</div>` : `<p class="muted">還沒有紀錄。</p>`}
    </div>
    <div class="card">
      <h3>資料管理</h3>
      <p class="muted">學習紀錄每次作答都會即時自動存檔（localStorage）。要防止清除瀏覽資料或換電腦造成遺失，請到「題庫/備份」分頁匯出備份檔。</p><br>
      <button class="btn ghost small" id="reset-all">清除所有學習紀錄</button>
    </div>`;
  $("#ext-add").addEventListener("click", () => {
    const date = $("#ext-date").value, src = $("#ext-src").value.trim();
    const rd = id => { const v = $(id).value.trim(); return v === "" ? 0 : Number(v); };
    const L = rd("#ext-l"), R = rd("#ext-r");
    const bad = x => !Number.isInteger(x) || x < 0 || x > 495;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { $("#ext-msg").textContent = "請選擇測驗日期。"; return; }
    if (bad(L) || bad(R) || (!L && !R)) { $("#ext-msg").textContent = "請輸入 5–495 之間的分數（只考一部分時，另一欄留空）。"; return; }
    if (!S.ext) S.ext = [];
    S.ext.push({ date, src: src.slice(0, 60), L, R });
    save();
    renderers.stats();
    UI.toast("已記錄外部測驗成績", "ok");
  });
  $("#tab-stats").querySelectorAll("[data-ext-del]").forEach(b => b.addEventListener("click", () => {
    if (!confirm("刪除這筆外部測驗紀錄？")) return;
    S.ext.splice(Number(b.dataset.extDel), 1);
    save();
    renderers.stats();
  }));
  $("#reset-all").addEventListener("click", () => {
    if (confirm("確定要清除所有學習紀錄嗎？此操作無法復原。")) {
      S = defaultState(); save();
      if (typeof Mock !== "undefined") Mock.clearProgress();
      switchTab("home");
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
  ensureOnboardFlag();
  renderers.home();
  updateNavBadges();
  if (typeof Sync !== "undefined") {
    Sync.init();
    Sync.pullOnStartup().then(applied => {
      if (applied) {
        const active = document.querySelector("#nav button.active, #bottomnav button.active")?.dataset.tab || "home";
        showTab(active);
        updateNavBadges();
      }
      // 引導的判斷務必等雲端拉取結果出爐後才做，否則裝置 B 帶著同步代碼登入時，
      // 對帳完成前那一瞬間的空白本機狀態會被誤判成「全新使用者」而彈出引導。
      maybeOnboard();
    });
  } else {
    maybeOnboard();
  }
}
boot();

window.addEventListener("beforeunload", (e) => {
  if (typeof Mock !== "undefined" && Mock.inProgress()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

/* ============ 新手引導 ============ */
function isFreshUser() {
  // 注意：不可用 Object.keys(S.daily).length 判斷——daily() 只要被呼叫過（例如首頁 render
  // 時算今日菜單）就會自動幫今天建立一筆全零的空物件，導致永遠判定為「非全新使用者」。
  // 改用活動總量加總，dayTotal() 對全零/空物件會正確回傳 0。
  const totalActivity = Object.values(S.daily).reduce((sum, d) => sum + dayTotal(d), 0);
  return Object.keys(S.vocab).length === 0 && !S.exam &&
    totalActivity === 0 && (!S.mocks || S.mocks.length === 0);
}
// 舊使用者（欄位是後來才加的，本地資料裡不會有 onboarded）不強制引導，靜默補標記即可；
// 只有真正沒有任何使用痕跡的全新使用者才會在 maybeOnboard() 觸發引導畫面。
function ensureOnboardFlag() {
  if (!S.onboarded && !isFreshUser()) S.onboarded = true;
}
function maybeOnboard() {
  ensureOnboardFlag();
  if (!S.onboarded && isFreshUser()) showOnboarding();
}
function showOnboarding() {
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  const state = { target: 900, exam: todayStr(49), minutes: 30 };
  let step = 1;
  const minuteMap = { 15: 5, 30: 10, 60: 15, 90: 20 };
  function finish() {
    S.targetScore = state.target;
    S.exam = state.exam || todayStr(49);
    Settings.set("newPerDay", minuteMap[state.minutes] || 10);
    S.onboarded = true;
    save();
    close();
    renderers.home();
  }
  function close() {
    wrap.classList.remove("open");
    setTimeout(() => wrap.remove(), 200);
  }
  function render() {
    const dots = [1, 2, 3].map(n => `<span class="onb-dot ${n === step ? "cur" : ""} ${n < step ? "done" : ""}"></span>`).join("");
    let body;
    if (step === 1) {
      body = `
        <h3>🎯 歡迎使用 TOEIC 900+ 衝刺</h3>
        <p class="muted">先花 30 秒設定，幫你排出每天的學習菜單，之後隨時可以在「我的」重新調整。</p>
        <div class="item-row"><div>目標分數</div>
          <input type="number" id="onb-target" min="400" max="990" step="5" value="${state.target}"
            style="width:80px;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit"></div>`;
    } else if (step === 2) {
      body = `
        <h3>📅 預計考試日期</h3>
        <p class="muted">用來自動切換基礎期／強化期／衝刺期的訓練重點。不確定可以先抓個大概。</p>
        <div class="item-row"><div>考試日</div>
          <input type="date" id="onb-exam" value="${state.exam}"
            style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit"></div>`;
    } else {
      body = `
        <h3>⏱️ 每天能投入多少時間？</h3>
        <p class="muted">決定每天新單字的量，練習量隨時可以在「我的→設定」調整。</p>
        <div class="rating-row" id="onb-minutes">
          ${[15, 30, 60, 90].map(m => `<button data-m="${m}" style="flex:1;background:${m === state.minutes ? "var(--accent)" : "var(--panel2)"};color:${m === state.minutes ? "#fff" : "var(--text)"};border:1px solid var(--border2);border-radius:10px;padding:10px;font-family:inherit;cursor:pointer;font-weight:600">${m} 分</button>`).join("")}
        </div>`;
    }
    wrap.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px">${dots}</div>
        ${body}
        <div class="modal-actions" style="margin-top:20px;justify-content:space-between">
          ${step > 1 ? `<button class="btn secondary" id="onb-back">上一步</button>` : `<span></span>`}
          <button class="btn" id="onb-next">${step < 3 ? "下一步" : "開始學習 🚀"}</button>
        </div>
      </div>`;
    const targetInput = wrap.querySelector("#onb-target");
    if (targetInput) targetInput.addEventListener("input", e => { state.target = Number(e.target.value) || 900; });
    const examInput = wrap.querySelector("#onb-exam");
    if (examInput) examInput.addEventListener("input", e => { if (e.target.value) state.exam = e.target.value; });
    wrap.querySelectorAll("#onb-minutes button").forEach(b =>
      b.addEventListener("click", () => { state.minutes = Number(b.dataset.m); render(); }));
    const back = wrap.querySelector("#onb-back");
    if (back) back.addEventListener("click", () => { step--; render(); });
    wrap.querySelector("#onb-next").addEventListener("click", () => {
      if (step < 3) { step++; render(); } else { finish(); }
    });
  }
  // 點背景關閉＝略過引導，仍標記為已引導避免下次又彈出（不強迫使用者完成設定）
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) { S.onboarded = true; save(); close(); }
  });
  render();
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("open"));
}

/* ============ 全域錯誤處理與連線狀態 ============ */
/* 本機錯誤紀錄（v1.7，工作票 17）：最多 200 筆，只記錯誤訊息、程式位置、版本與時間，不記作答內容或學習紀錄。
   只存在這台裝置，不同步、不自動送出；設定頁可以匯出，由使用者決定要不要提供。這不是遙測（INV-08）。 */
const ERRLOG_KEY = "toeic900_errlog";
const ERRLOG_MAX = 200;
const ErrLog = {
  list() {
    try { const a = JSON.parse(localStorage.getItem(ERRLOG_KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  },
  // 金鑰、同步代碼即使意外出現在訊息裡也要遮掉
  scrub(s) {
    let out = String(s || "").replace(/sk-ant-[A-Za-z0-9_-]+/g, "sk-ant-***");
    if (typeof Sync !== "undefined" && Sync.code) out = out.split(Sync.code).join("***");
    return out;
  },
  add(kind, err) {
    try {
      const msg = ErrLog.scrub(err && (err.message || err.reason) ? err.message || err.reason : err).slice(0, 300);
      const stack = err && err.stack ? ErrLog.scrub(String(err.stack).split("\n").slice(0, 4).join("\n")).slice(0, 600) : "";
      const list = ErrLog.list();
      list.push({ t: new Date().toISOString(), kind, msg, stack, v: APP_VERSION });
      localStorage.setItem(ERRLOG_KEY, JSON.stringify(list.slice(-ERRLOG_MAX)));
    } catch (e) { /* 儲存空間滿了就不記 */ }
  },
  clear() { localStorage.removeItem(ERRLOG_KEY); },
  download() {
    const data = { app: "toeic900", kind: "error-log", exported: new Date().toISOString(), version: APP_VERSION, errors: ErrLog.list() };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
    a.download = `toeic-錯誤紀錄-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};
// 轉換成固定編號之前的原始紀錄（v1.7 第一次開啟時自動保存），設定頁可以下載
function downloadPreIdBackup() {
  const raw = localStorage.getItem(PRE_ID_BACKUP_KEY);
  if (!raw) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: "toeic900", kind: "pre-v1.7-records", records: JSON.parse(raw) }, null, 1)], { type: "application/json" }));
  a.download = `toeic-v1.7升級前紀錄.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
window.addEventListener("error", (e) => {
  console.error("未捕捉的錯誤：", e.error || e.message);
  ErrLog.add("error", e.error || e.message);
  if (typeof UI !== "undefined") UI.toast("發生了一個小問題，但不影響你目前的進度。若持續發生請重新整理頁面。", "err", 4000);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("未處理的 Promise 拒絕：", e.reason);
  ErrLog.add("rejection", e.reason);
  if (typeof UI !== "undefined") UI.toast("發生了一個小問題，但不影響你目前的進度。", "err", 4000);
});
window.addEventListener("offline", () => {
  if (typeof UI !== "undefined") UI.toast("目前離線，練習紀錄會存在本機，恢復網路後自動同步。", "info", 3500);
});
window.addEventListener("online", () => {
  if (typeof UI !== "undefined") UI.toast("網路已恢復連線。", "ok", 2500);
});
