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
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 去除易混淆字元
    let s = "";
    for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s.match(/.{1,5}/g).join("-"); // 例如 ab3de-f7gh9
  },
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
  // 啟動時抓一次雲端資料，若比本機新就採用雲端版本
  async pullOnStartup() {
    const ref = Sync.ref();
    if (!ref) return false;
    try {
      const snap = await ref.get();
      const remote = snap.val();
      if (!remote || !remote.records) return false;
      const localTime = S.updatedAt || 0;
      const remoteTime = remote.updatedAt || 0;
      if (remoteTime > localTime) {
        S = Object.assign(defaultState(), remote.records);
        localStorage.setItem(STORE_KEY, JSON.stringify(S));
        if (remote.bank) saveBank(Object.assign(emptyBank(), remote.bank));
        Sync.lastSynced = new Date();
        return true;
      }
      Sync.lastSynced = new Date();
    } catch (e) { console.warn("雲端同步讀取失敗", e); }
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
    } catch (e) { console.warn("雲端同步寫入失敗", e); }
  }
};
