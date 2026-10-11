/* ============ 雲端同步（Firebase Realtime Database）============ */
// 用一組「同步代碼」把同一份學習紀錄接到雲端，讓手機與電腦看到同一套進度。
// 未設定 FIREBASE_CONFIG 時，以下功能會靜默停用，App 其餘功能不受影響。
//
// v1.7 起（工作票 17，D-4 不做帳號登入，所以把「代碼＝鑰匙」做到最好）：
// - 端對端加密：同步代碼推導出兩把不同的鑰匙。一把決定雲端位置（雜湊值，從位置看不出代碼），
//   一把用 AES-GCM 加密資料。雲端只存亂碼；被改過的資料解密驗證失敗，不會套用。
// - 三方合併（js/merge.js）：兩台裝置在同步之間都有作答時，兩邊的作答都保留，不再整份覆蓋。
// - 樂觀鎖：每次寫入版本號 rev 必須是雲端的 rev + 1（資料庫規則檢查），同時寫入時後到的一方重新合併再寫。
// - 舊版明文位置 sync/<代碼>：讀進來合併後清空（過渡期內）。
const SYNC_CODE_KEY = "toeic900_synccode";
const SYNC_BASE_KEY = "toeic900_sync_base"; // 上次同步成功時雙方一致的那一份（三方合併的 base），只在本機
const SYNC_KDF_SALT = "toeic900/sync/v2";
const SYNC_KDF_ITER = 150000;
const SYNC_LEGACY_UNTIL = "2027-03-31"; // 這天以前仍會讀取並清空舊版明文位置
const SyncCrypto = {
  enc: s => new TextEncoder().encode(s),
  b64: bytes => { let s = ""; new Uint8Array(bytes).forEach(b => { s += String.fromCharCode(b); }); return btoa(s); },
  unb64: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
  // 代碼不分大小寫、忽略連字號與空白：使用者抄寫時常會打錯這些
  normalize: code => String(code).toLowerCase().replace(/[\s-]/g, ""),
  // 同步代碼 → { id: 雲端位置（32 個十六進位字元）, key: AES-GCM 金鑰 }
  // PBKDF2 讓每一次猜代碼都要花時間；HKDF 從同一份材料分出兩把互不相干的鑰匙。
  async derive(code) {
    const subtle = crypto.subtle;
    const pw = await subtle.importKey("raw", SyncCrypto.enc(SyncCrypto.normalize(code)), "PBKDF2", false, ["deriveBits"]);
    const bits = await subtle.deriveBits({ name: "PBKDF2", salt: SyncCrypto.enc(SYNC_KDF_SALT), iterations: SYNC_KDF_ITER, hash: "SHA-256" }, pw, 256);
    const hk = await subtle.importKey("raw", bits, "HKDF", false, ["deriveBits", "deriveKey"]);
    const h = info => ({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: SyncCrypto.enc(info) });
    const idBits = new Uint8Array(await subtle.deriveBits(h("location"), hk, 128));
    const key = await subtle.deriveKey(h("data"), hk, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    return { id: Array.from(idBits, b => b.toString(16).padStart(2, "0")).join(""), key };
  },
  async gzip(bytes, mode) {
    const Stream = mode === "compress" ? globalThis.CompressionStream : globalThis.DecompressionStream;
    const s = new Blob([bytes]).stream().pipeThrough(new Stream("gzip"));
    return new Uint8Array(await new Response(s).arrayBuffer());
  },
  // 資料 → { ct, iv, z }。附加資料綁定雲端位置：把密文搬到別的位置也解不開。
  async seal(data, keys) {
    let bytes = SyncCrypto.enc(JSON.stringify(data));
    const z = typeof CompressionStream === "function" ? 1 : 0;
    if (z) bytes = await SyncCrypto.gzip(bytes, "compress");
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: SyncCrypto.enc("toeic900/v2/" + keys.id) }, keys.key, bytes);
    return { ct: SyncCrypto.b64(ct), iv: SyncCrypto.b64(iv), z };
  },
  // 解密失敗（被竄改、或用錯鑰匙）會丟出例外
  async open(node, keys) {
    const iv = SyncCrypto.unb64(node.iv);
    let bytes = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: SyncCrypto.enc("toeic900/v2/" + keys.id) }, keys.key, SyncCrypto.unb64(node.ct)));
    if (node.z === 1) bytes = await SyncCrypto.gzip(bytes, "decompress");
    return JSON.parse(new TextDecoder().decode(bytes));
  }
};

const Sync = {
  ready: false,
  db: null,
  code: localStorage.getItem(SYNC_CODE_KEY) || "",
  keys: null,      // { code, id, key }：目前代碼推導出的鑰匙（只在記憶體）
  pushTimer: null,
  lastSynced: null,
  lastError: null, // "read" | "write" | "decrypt" | "moved" | null：同步失敗時顯示在題庫/備份頁
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
  // 和 firebase/database.rules.json 舊位置相同的格式條件：4–64 字，小寫英數字，可用單一連字號分段
  validCode(code) {
    return typeof code === "string" && code.length >= 4 && code.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code);
  },
  // 少於 10 個英數字的自訂代碼可能被猜到；少於 16 個（v1.6 以前產生的 10 字元代碼）建議升級
  weakCode(code) { return SyncCrypto.normalize(code).length < 10; },
  shortCode(code) { return SyncCrypto.normalize(code).length < 16; },
  setCode(code) {
    Sync.code = code.trim().toLowerCase();
    Sync.keys = null;
    Sync.lastError = null;
    localStorage.setItem(SYNC_CODE_KEY, Sync.code);
    localStorage.removeItem(SYNC_BASE_KEY); // 換了代碼，上次同步的 base 不再適用
  },
  clearCode() {
    Sync.code = "";
    Sync.keys = null;
    localStorage.removeItem(SYNC_CODE_KEY);
    localStorage.removeItem(SYNC_BASE_KEY);
  },
  async keysFor(code) {
    if (!Sync.keys || Sync.keys.code !== code) Sync.keys = Object.assign({ code }, await SyncCrypto.derive(code));
    return Sync.keys;
  },
  async ref() {
    if (!Sync.ready || !Sync.code) return null;
    const k = await Sync.keysFor(Sync.code);
    return Sync.db.ref("v2/" + k.id);
  },
  legacyRef() {
    if (!Sync.ready || !Sync.code || todayStr() > SYNC_LEGACY_UNTIL || !Sync.validCode(Sync.code)) return null;
    return Sync.db.ref("sync/" + Sync.code.replace(/[^a-z0-9-]/g, ""));
  },
  loadBase() {
    try { const b = JSON.parse(localStorage.getItem(SYNC_BASE_KEY) || "null"); return b && b.records ? b : null; } catch (e) { return null; }
  },
  saveBase(data) {
    try { localStorage.setItem(SYNC_BASE_KEY, JSON.stringify(data)); } catch (e) { localStorage.removeItem(SYNC_BASE_KEY); }
  },
  // 外部資料（雲端、舊位置）一律先在副本上做型別檢查，不合格的欄位收斂成安全的值（2026-10-07 資安審查 H1）
  clean(data) {
    if (!data || typeof data !== "object") return null;
    const records = sanitizeState(Object.assign(defaultState(), { baseN: null, contentV: 0, idV: 0 }, data.records || {}));
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
  // 一輪同步：讀雲端 → 解密 → 合併 → 套用到本機 → 有差異才寫回雲端（版本衝突時重來，最多 4 次）
  async round() {
    const ref = await Sync.ref();
    if (!ref) return false;
    for (let attempt = 0; attempt < 4; attempt++) {
      let node, remote = null, legacy = null;
      try {
        node = (await ref.get()).val();
        if (node && node.ct) {
          const opened = await SyncCrypto.open(node, Sync.keys);
          if (opened && opened.moved) { Sync.lastError = "moved"; return false; }
          remote = Sync.clean(opened);
        }
        const lref = Sync.legacyRef();
        if (lref) { const l = (await lref.get()).val(); if (l && l.records) legacy = Sync.clean(l); }
      } catch (e) {
        // 解不開：不是被竄改就是資料損毀。不套用，也不覆蓋（使用者可以在設定頁選擇用本機資料重建）
        console.warn("雲端同步讀取失敗", e);
        Sync.lastError = e && e.name === "OperationError" ? "decrypt" : "read";
        return false;
      }
      const base = Sync.loadBase();
      const local = { records: JSON.parse(JSON.stringify(S)), bank: loadBank() };
      let merged = remote ? Sync.merge(remote ? base : null, local, remote) : local;
      if (legacy) merged = Sync.merge(null, merged, legacy);
      merged.records = sanitizeState(merged.records);
      const changed = !Merge.same(merged.records, local.records) || !Merge.same(merged.bank, local.bank);
      if (changed) Sync.apply(merged);
      const needPush = !remote || !Merge.same(merged, remote);
      if (needPush) {
        try {
          const sealed = await SyncCrypto.seal(merged, Sync.keys);
          await ref.set(Object.assign(sealed, { u: merged.records.updatedAt || Date.now(), rev: ((node && node.rev) || 0) + 1, v: 2 }));
        } catch (e) {
          if (attempt < 3) continue; // 多半是另一台裝置剛好也寫入（rev 不符）：重新讀取合併
          console.warn("雲端同步寫入失敗", e); Sync.lastError = "write"; return changed;
        }
      }
      Sync.saveBase(merged);
      if (legacy) { try { await Sync.legacyRef().remove(); } catch (e) { /* 下次再清 */ } }
      Sync.lastSynced = new Date();
      Sync.lastError = null;
      return changed;
    }
    return false;
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
  // 換一組更長的新代碼：資料搬到新位置，舊位置留下「已搬走」標記（不含新代碼），其他裝置會提示輸入新代碼
  async upgradeCode() {
    if (!Sync.ready || !Sync.code) return null;
    const oldCode = Sync.code;
    await Sync.syncNow();
    if (Sync.lastError) return null;
    const oldRef = await Sync.ref(), oldKeys = Sync.keys;
    const newCode = Sync.genCode();
    Sync.setCode(newCode);
    Sync.lastError = null;
    await Sync.syncNow();
    if (Sync.lastError) { Sync.setCode(oldCode); return null; }
    try {
      const snap = (await oldRef.get()).val();
      const sealed = await SyncCrypto.seal({ moved: true, at: Date.now() }, oldKeys);
      await oldRef.set(Object.assign(sealed, { u: Date.now(), rev: ((snap && snap.rev) || 0) + 1, v: 2 }));
    } catch (e) { console.warn("舊位置標記失敗", e); }
    return newCode;
  },
  // 刪除雲端資料（新位置與舊明文位置），本機紀錄不受影響
  async deleteCloud() {
    const ref = await Sync.ref();
    if (!ref) return false;
    try {
      await ref.remove();
      const lref = Sync.legacyRef();
      if (lref) await lref.remove();
      localStorage.removeItem(SYNC_BASE_KEY);
      return true;
    } catch (e) { console.warn("刪除雲端資料失敗", e); return false; }
  }
};
