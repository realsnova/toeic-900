/* ============ UI 基礎：裝置偏好設定、主題、Toast、Modal ============ */
// 這些屬於「裝置偏好」，存獨立的 localStorage 鍵，不進 S、不參與雲端同步。
const THEME_KEY = "toeic900_theme";
const SETTINGS_KEY = "toeic900_settings";

const Settings = {
  data: { ttsRate: 0.92, ttsVoice: "", newPerDay: 10, accent: "auto" }, // accent: auto | mixed | en-US 等指定腔調
  load() {
    try { Object.assign(Settings.data, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch (e) { /* 壞資料用預設 */ }
  },
  save() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings.data)); },
  get(k) { return Settings.data[k]; },
  set(k, v) { Settings.data[k] = v; Settings.save(); }
};
Settings.load();

/* ============ 聽力腔調偵測與挑選 ============ */
// TOEIC 聽力會混用美/英/澳/加拿大等腔調，但裝置能提供哪些腔調完全看瀏覽器/作業系統——
// 手機通常內建多腔調，Windows 桌面預設常只有系統顯示語言那一種（甚至 0 個英文語音）。
// 這裡只列出「裝置上真的偵測得到」的腔調，絕不假裝有不存在的選項。
const Accents = {
  labels: {
    "en-US": "🇺🇸 美式", "en-GB": "🇬🇧 英式", "en-AU": "🇦🇺 澳式",
    "en-CA": "🇨🇦 加拿大", "en-IN": "🇮🇳 印度", "en-IE": "🇮🇪 愛爾蘭",
    "en-ZA": "🇿🇦 南非", "en-NZ": "🇳🇿 紐西蘭", "en-GB-x": "英式"
  },
  pool: {},
  ready: false,
  scan() {
    const voices = (typeof speechSynthesis !== "undefined" ? speechSynthesis.getVoices() : []).filter(v => v.lang.startsWith("en"));
    const pool = {};
    voices.forEach(v => {
      const lang = v.lang.replace("_", "-");
      (pool[lang] = pool[lang] || []).push(v);
    });
    Accents.pool = pool;
    Accents.ready = true;
    return pool;
  },
  available() { return Object.keys(Accents.pool); }, // 例如 ['en-US', 'en-GB']
  label(lang) { return Accents.labels[lang] || lang; }
};

const Theme = {
  mode: localStorage.getItem(THEME_KEY) || "auto", // auto | light | dark
  media: window.matchMedia("(prefers-color-scheme: light)"),
  resolved() { return Theme.mode === "auto" ? (Theme.media.matches ? "light" : "dark") : Theme.mode; },
  apply() {
    document.documentElement.dataset.theme = Theme.resolved();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = Theme.resolved() === "light" ? "#f4f6fb" : "#0b0f1a";
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = { auto: "🌗", light: "☀️", dark: "🌙" }[Theme.mode];
  },
  set(mode) { Theme.mode = mode; localStorage.setItem(THEME_KEY, mode); Theme.apply(); },
  cycle() {
    Theme.set({ auto: "light", light: "dark", dark: "auto" }[Theme.mode]);
    UI.toast("主題：" + { auto: "跟隨系統", light: "淺色", dark: "深色" }[Theme.mode]);
  }
};
Theme.media.addEventListener("change", () => { if (Theme.mode === "auto") Theme.apply(); });
Theme.apply();
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-btn");
  if (btn) btn.addEventListener("click", () => Theme.cycle());
});

const UI = {
  // 輕量通知，取代 alert
  toast(msg, type = "info", ms = 2600) { // type: info | ok | err
    let holder = document.getElementById("toasts");
    if (!holder) {
      holder = document.createElement("div");
      holder.id = "toasts";
      document.body.appendChild(holder);
    }
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    holder.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, ms);
  },
  // 確認對話框，取代 confirm（回傳 Promise<boolean>）
  confirm(msg, { title = "確認", okText = "確定", cancelText = "取消", danger = false } = {}) {
    return new Promise(res => {
      const wrap = document.createElement("div");
      wrap.className = "modal-backdrop";
      wrap.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          <h3>${title}</h3>
          <p>${msg}</p>
          <div class="modal-actions">
            <button class="btn secondary" data-act="cancel">${cancelText}</button>
            <button class="btn ${danger ? "danger" : ""}" data-act="ok">${okText}</button>
          </div>
        </div>`;
      const done = v => { wrap.classList.remove("open"); setTimeout(() => wrap.remove(), 200); res(v); };
      wrap.addEventListener("click", e => {
        if (e.target === wrap) { done(false); return; }
        const act = e.target.closest("[data-act]");
        if (act) done(act.dataset.act === "ok");
      });
      document.body.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add("open"));
    });
  }
};
