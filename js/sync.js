/* ============ 雲端同步（Firebase Realtime Database）============ */
// 用一組「同步代碼」把同一份學習紀錄接到雲端，讓手機與電腦看到同一套進度。
// 未設定 FIREBASE_CONFIG 時，以下功能會靜默停用，App 其餘功能不受影響。
//
// v1.7 起（工作票 17）：
// - 三方合併（js/merge.js）：兩台裝置在同步之間都有作答時，兩邊的作答都保留，不再整份覆蓋。
// - 雲端位置與格式和 v1.6 以前相同（sync/<代碼>，{records, bank, updatedAt}），資料庫規則不用改。
// - 端對端加密（2026-10-11 使用者決定先擱置：只有自己使用）：完整實作保留在分支 claude/toeic-sync-encrypted。
const SYNC_CODE_KEY = "toeic900_synccode";
const SYNC_BASE_KEY = "toeic900_sync_base"; // 上次同步成功時雙方一致的那一份（三方合併的 base），只在本機
const Sync = {
  ready: false,
  db: null,
  code: localStorage.getItem(SYNC_CODE_KEY) || "",
  pushTimer: null,
  lastSynced: null,
  lastError: null, // "read" | "write" | null：同步失敗時顯示在題庫/備份頁
  running: null,   // 正在進行的同步（Promise），避免同時跑兩次
  again: false,    // 同步進行中又有新的存檔：結束後再跑一次
  init() {
    if (typeof FIREBASE_CONFIG !== "object" || !FIREBASE_CONFIG || typeof firebase === "undefined") return;
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      Sync.db = firebase.database();
      Sync.ready = true;
    } catch (e) { console.warn("Firebase 初始化失敗", e); }
  },
  // 同步代碼等於讀寫權，必須用密碼學安全的亂數（一般偽亂數的輸出可被推測）
  // v1.7 起 20 個字元（約 99 位元），分成 4 段方便抄寫
  genCode(len = 20) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 去除易混淆字元（31 個）
    const limit = 256 - (256 % chars.length); // 拒絕取樣，避免取餘數造成前幾個字元機率偏高
    let s = "";
    while (s.length < len) {
      const buf = new Uint8Array(32);
      crypto.getRandomValues(buf);
      for (const b of buf) if (b < limit && s.length < len) s += chars[b % chars.length];
    }
    return s.match(/.{1,5}/g).join("-"); // 例如 ab3de-f7gh9-k2mnp-qr5st
  },
  // 和 firebase/database.rules.json 相同的格式條件：4–64 字，小寫英數字，可用單一連字號分段
  validCode(code) {
    return typeof code === "string" && code.length >= 4 && code.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code);
  },
  // 少於 10 個英數字的自訂代碼可能被猜到
  weakCode(code) { return String(code).replace(/-/g, "").length < 10; },
  setCode(code) {
    Sync.code = code.trim().toLowerCase();
    Sync.lastError = null;
    localStorage.setItem(SYNC_CODE_KEY, Sync.code);
    localStorage.removeItem(SYNC_BASE_KEY); // 換了代碼，上次同步的 base 不再適用
  },
  clearCode() {
    Sync.code = "";
    localStorage.removeItem(SYNC_CODE_KEY);
    localStorage.removeItem(SYNC_BASE_KEY);
  },
  ref() {
    if (!Sync.ready || !Sync.code) return null;
    return Sync.db.ref("sync/" + Sync.code.replace(/[^a-z0-9-]/g, ""));
  },
  loadBase() {
    try { const b = JSON.parse(localStorage.getItem(SYNC_BASE_KEY) || "null"); return b && b.records ? b : null; } catch (e) { return null; }
  },
  saveBase(data) {
    try { localStorage.setItem(SYNC_BASE_KEY, JSON.stringify(data)); } catch (e) { localStorage.removeItem(SYNC_BASE_KEY); }
  },
  // 雲端資料任何知道同步代碼的人都能寫入：一律先在副本上做型別檢查，不合格的欄位收斂成安全的值（2026-10-07 資安審查 H1）。
  // 舊版裝置推上來的紀錄沒有 baseN、idV：設成「舊版」，讓 sanitizeState 做內建題增加的搬移與固定編號轉換。
  clean(data) {
    if (!data || typeof data !== "object" || !data.records) return null;
    const records = sanitizeState(Object.assign(defaultState(), { baseN: null, contentV: 0, idV: 0 }, data.records));
    const bank = cleanBank(data.bank);
    return { records, bank };
  },
  // 開機時呼叫：回傳本機紀錄是否因雲端資料而改變（需要重繪畫面）
  async pullOnStartup() { return Sync.syncNow(); },
  async pushNow() { return Sync.syncNow(); },
  // 每次 save() 後 debounce 同步到雲端
  schedulePush() {
    if (!Sync.ready || !Sync.code) return;
    clearTimeout(Sync.pushTimer);
    Sync.pushTimer = setTimeout(Sync.syncNow, 1500);
  },
  async syncNow() {
    if (!Sync.ready || !Sync.code) return false;
    if (Sync.running) { Sync.again = true; return Sync.running; }
    Sync.running = (async () => {
      let changed = false;
      try {
        do { Sync.again = false; changed = (await Sync.round()) || changed; } while (Sync.again);
      } finally { Sync.running = null; }
      return changed;
    })();
    return Sync.running;
  },
  // 一輪同步：在 Firebase 交易（transaction）裡讀雲端 → 檢查 → 合併 → 有差異才寫回；成功後套用到本機。
  // 交易保證「讀到的」就是「寫入前的最新值」：另一台裝置剛好同時寫入時，Firebase 會用新值重跑合併，兩邊的作答都保留。
  async round() {
    const ref = Sync.ref();
    if (!ref) return false;
    const base = Sync.loadBase();
    const local = { records: JSON.parse(JSON.stringify(S)), bank: loadBank() };
    let merged = local, readOk = false;
    try {
      await ref.transaction(cur => {
        readOk = false;
        const remote = Sync.clean(cur);
        readOk = true;
        merged = remote ? Sync.merge(base, local, remote) : local;
        merged.records = sanitizeState(merged.records);
        if (remote && Merge.same(merged, remote)) return; // 雲端已經是最新：不寫入
        return { records: merged.records, bank: merged.bank, updatedAt: merged.records.updatedAt || Date.now() };
      }, undefined, false);
    } catch (e) {
      console.warn(readOk ? "雲端同步寫入失敗" : "雲端同步讀取失敗", e);
      Sync.lastError = readOk ? "write" : "read";
      return false;
    }
    const changed = !Merge.same(merged.records, local.records) || !Merge.same(merged.bank, local.bank);
    if (changed) Sync.apply(merged);
    Sync.saveBase(merged);
    Sync.lastSynced = new Date();
    Sync.lastError = null;
    return changed;
  },
  merge(base, local, remote) {
    return {
      records: Merge.records(base && base.records, local.records, remote.records),
      bank: Merge.bank(base && base.bank, local.bank, remote.bank, itemKey)
    };
  },
  // 把合併結果寫進本機。就地更新 S（保留巢狀物件的參照），練習進行中拿著 daily() 等參照的程式不會寫到舊物件上。
  apply(merged) {
    const assignDeep = (target, src) => {
      Object.keys(target).forEach(k => { if (!(k in src)) delete target[k]; });
      Object.keys(src).forEach(k => {
        const a = target[k], b = src[k];
        if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) assignDeep(a, b);
        else target[k] = b;
      });
    };
    assignDeep(S, merged.records);
    localStorage.setItem(STORE_KEY, JSON.stringify(S)); // 不經過 save()：不改 updatedAt、不觸發另一次同步
    saveBank(merged.bank);
    mergeBank();
  },
  // 刪除雲端資料，本機紀錄不受影響
  async deleteCloud() {
    const ref = Sync.ref();
    if (!ref) return false;
    try {
      await ref.remove();
      localStorage.removeItem(SYNC_BASE_KEY);
      return true;
    } catch (e) { console.warn("刪除雲端資料失敗", e); return false; }
  }
};
