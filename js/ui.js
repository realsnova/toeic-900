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

/* ============ 動效工具：進度環、數字滾動、confetti ============ */
const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Anim = {
  // 回傳一個帶 id 的 SVG 圓環字串，插入 DOM 後呼叫 ringAnimate(id, done, total) 讓它動畫轉入
  ringSVG(id, size = 64) {
    const r = size / 2 - 6;
    return `<svg class="progress-ring" id="${id}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text class="ring-text" x="50%" y="52%">0/0</text>
    </svg>`;
  },
  ringAnimate(id, done, total) {
    const svg = document.getElementById(id);
    if (!svg) return;
    const circle = svg.querySelector(".ring-fg");
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    const pct = total ? Math.min(1, done / total) : 0;
    svg.querySelector(".ring-text").textContent = `${done}/${total}`;
    circle.style.strokeDasharray = `${c} ${c}`;
    if (reducedMotion()) { circle.style.strokeDashoffset = c * (1 - pct); return; }
    circle.style.strokeDashoffset = c;
    requestAnimationFrame(() => requestAnimationFrame(() => { circle.style.strokeDashoffset = c * (1 - pct); }));
  },
  // 讓一個元素的文字內容從 0 數到 to
  countUp(el, to, duration = 700) {
    if (!el) return;
    if (reducedMotion() || !to) { el.textContent = to; return; }
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * to);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
  // scoreEl 是外層容器（含「X / Y」），right/total 用於決定是否觸發 confetti
  scoreReveal(scoreEl, right, total) {
    if (!scoreEl) return;
    scoreEl.innerHTML = `<span class="score-num">0</span> / ${total}`;
    Anim.countUp(scoreEl.querySelector(".score-num"), right, 700);
    if (total > 0 && right === total) setTimeout(() => Anim.confetti(), 350);
  },
  numberReveal(scoreEl, value) {
    if (!scoreEl) return;
    scoreEl.textContent = "0";
    Anim.countUp(scoreEl, value, 700);
  },
  confetti() {
    if (reducedMotion()) return;
    const colors = ["#4f8ef7", "#8b5cf6", "#34d399", "#fbbf24", "#f87171"];
    const holder = document.createElement("div");
    holder.className = "confetti-holder";
    for (let i = 0; i < 32; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.3) + "s";
      p.style.setProperty("--rot", Math.round(Math.random() * 540 - 270) + "deg");
      holder.appendChild(p);
    }
    document.body.appendChild(holder);
    setTimeout(() => holder.remove(), 2200);
  }
};
