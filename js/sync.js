/* ============ 雲端同步（Firebase Realtime Database）============ */
// 用一組「同步代碼」把同一份學習紀錄接到雲端，讓手機與電腦看到同一套進度。
// 未設定 FIREBASE_CONFIG 時，以下功能會靜默停用，App 其餘功能不受影響。
const SYNC_CODE_KEY = "toeic900_synccode";
const Sync = {
  ready: false,
  db: null,
  code: localStorage.getItem(SYNC_CODE_KEY) || "",
  pushTimer: null,
  lastSynced: null,
  init() {
    if (typeof FIREBASE_CONFIG !== "object" || !FIREBASE_CONFIG || typeof firebase === "undefined") return;
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      Sync.db = firebase.database();
      Sync.ready = true;
    } catch (e) { console.warn("Firebase 初始化失敗", e); }
  },
  genCode() {
    // 同步代碼等於讀寫權，必須用密碼學安全的亂數（一般偽亂數的輸出可被推測）
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 去除易混淆字元（31 個）
    const limit = 256 - (256 % chars.length); // 拒絕取樣，避免取餘數造成前幾個字元機率偏高
    let s = "";
    while (s.length < 10) {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      for (const b of buf) if (b < limit && s.length < 10) s += chars[b % chars.length];
    }
    return s.match(/.{1,5}/g).join("-"); // 例如 ab3de-f7gh9
  },
  // 和 firebase/database.rules.json 相同的格式條件：4–64 字，小寫英數字，可用單一連字號分段
  validCode(code) {
    return typeof code === "string" && code.length >= 4 && code.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code);
  },
  // 系統產生的代碼有 10 個英數字（約 50 位元）；少於 10 個的自訂代碼可能被猜到
  weakCode(code) { return String(code).replace(/-/g, "").length < 10; },
  lastError: null, // "read" | "write" | null：同步失敗時顯示在題庫/備份頁
  setCode(code) {
    Sync.code = code.trim().toLowerCase();
    localStorage.setItem(SYNC_CODE_KEY, Sync.code);
  },
  clearCode() {
    Sync.code = "";
    localStorage.removeItem(SYNC_CODE_KEY);
  },
  ref() {
    if (!Sync.ready || !Sync.code) return null;
    return Sync.db.ref("sync/" + Sync.code.replace(/[^a-z0-9-]/g, ""));
  },
  // 背景抓一次雲端資料。baseline = 開機當下的本機時間戳。
  // 只有在「雲端比開機當下的本機新」且「使用者這段背景時間內沒有動過本機」時才套用，
  // 避免蓋掉使用者開 App 後、雲端回應前就已經開始的作答。
  async pullOnStartup(baseline) {
    const ref = Sync.ref();
    if (!ref) return false;
    const base = baseline == null ? (S.updatedAt || 0) : baseline;
    try {
      const snap = await ref.get();
      const remote = snap.val();
      if (!remote || !remote.records) return false;
      const remoteTime = remote.updatedAt || 0;
      const localNow = S.updatedAt || 0;
      if (remoteTime > base && localNow === base) {
        // 舊版裝置推上來的紀錄沒有 baseN：設成 null，讓 sanitizeState 當作 v1.3.x 的內建題數處理
        S = Object.assign(defaultState(), { baseN: null }, remote.records);
        // 這條路徑不經過 load()，所以要自己做一次型別檢查（含錯題本格式遷移）：
        // 雲端資料任何知道同步代碼的人都能寫入，不檢查就可能把腳本帶進畫面（2026-10-07 資安審查 H1）。
        sanitizeState(S);
        localStorage.setItem(STORE_KEY, JSON.stringify(S));
        if (remote.bank) saveBank(Object.assign(emptyBank(), remote.bank));
        Sync.lastSynced = new Date();
        Sync.lastError = null;
        return true;
      }
      Sync.lastSynced = new Date();
      Sync.lastError = null;
    } catch (e) { console.warn("雲端同步讀取失敗", e); Sync.lastError = "read"; }
    return false;
  },
  // 每次 save() 後 debounce 推送到雲端
  schedulePush() {
    if (!Sync.ref()) return;
    clearTimeout(Sync.pushTimer);
    Sync.pushTimer = setTimeout(Sync.pushNow, 1500);
  },
  async pushNow() {
    const ref = Sync.ref();
    if (!ref) return;
    try {
      await ref.set({ records: S, bank: loadBank(), updatedAt: S.updatedAt || Date.now() });
      Sync.lastSynced = new Date();
      Sync.lastError = null;
    } catch (e) { console.warn("雲端同步寫入失敗", e); Sync.lastError = "write"; }
  }
};
