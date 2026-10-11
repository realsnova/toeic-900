/* ============ 學習引擎 v2（v1.7，工作票 16）============
   純函式，不碰 S、localStorage 或畫面；app.js 負責呼叫與存檔。
   - FSRS：單字卡排程。依公開的 FSRS-5 公式自行實作，使用官方預設參數（open-spaced-repetition/fsrs4anki，MIT）。
   - Mastery：每項技能的掌握度。簡化的 Elo／Rasch：能力值 θ，題目難度 b，答對機率含猜中率 c。 */

const FSRS = (() => {
  // FSRS-5 預設參數
  const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
    1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const DECAY = -0.5, FACTOR = 19 / 81; // R(t, S) = (1 + FACTOR·t/S)^DECAY；t = S 時 R = 0.9
  const RETENTION = 0.9;
  const MAX_IVL = 365;
  const G = { again: 1, hard: 2, good: 3, easy: 4 };
  const clampD = d => Math.min(10, Math.max(1, d));
  const DAY = 86400000;
  const days = (a, b) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / DAY);
  const addDays = (d, n) => new Date(Date.parse(d + "T00:00:00Z") + n * DAY).toISOString().slice(0, 10);

  const s0 = g => W[g - 1];
  const d0 = g => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);
  const retrievability = (t, s) => Math.pow(1 + FACTOR * t / s, DECAY);
  const interval = s => Math.min(MAX_IVL, Math.max(1, Math.round(s / FACTOR * (Math.pow(RETENTION, 1 / DECAY) - 1))));
  function nextD(d, g) {
    const dp = d - W[6] * (g - 3) * (10 - d) / 9; // 線性阻尼
    return clampD(W[7] * d0(4) + (1 - W[7]) * dp); // 回歸平均
  }
  function recallS(d, s, r, g) {
    const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
    return s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
  }
  function forgetS(d, s, r) {
    return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  }
  const shortS = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18])); // 同一天再複習（FSRS-5）

  // 舊版（SM-2 變形）的卡片轉成 FSRS 狀態：間隔天數當作穩定度，難易係數換成難度。不改 due，排程不會跳動。
  function fromLegacy(c) {
    if (c && Number.isFinite(c.s) && Number.isFinite(c.d)) return c;
    const e = Number.isFinite(c && c.e) ? c.e : 2.5;
    return Object.assign({}, c, { s: Math.max(0.5, (c && c.i) || 0.5), d: clampD(5.3 + (2.5 - e) * 4) });
  }
  // 評分後的新卡片。card 為 null 代表新卡。回傳新物件，不改傳入的 card。
  function review(card, rating, today) {
    const g = G[rating];
    if (!g) throw new Error("rating");
    let c = card ? fromLegacy(card) : null;
    let s, d;
    if (!c) { s = s0(g); d = d0(g); }
    else {
      // 舊版卡片沒有上次複習日：排定的 due 減掉間隔就是上次複習的那天
      const last = c.l || addDays(c.due || today, -((card && card.i) || 0));
      const t = Math.max(0, days(last, today));
      if (t === 0 && c.l) s = shortS(c.s, g);
      else {
        const r = retrievability(Math.max(t, 0), c.s);
        s = g === 1 ? forgetS(c.d, c.s, r) : recallS(c.d, c.s, r, g);
      }
      d = nextD(c.d, g);
    }
    s = Math.max(0.1, Math.min(36500, s));
    const ivl = g === 1 ? 0 : interval(s);
    const out = Object.assign({}, card || {}, {
      s: +s.toFixed(4), d: +d.toFixed(4), i: ivl, due: addDays(today, ivl), l: today, n: ((card && card.n) || 0) + 1
    });
    if (g === 1) out.lapses = ((card && card.lapses) || 0) + 1;
    return out;
  }
  // 四個按鈕各會排到幾天後（畫面顯示用）
  function preview(card, today) {
    const out = {};
    Object.keys(G).forEach(r => { out[r] = review(card, r, today).i; });
    return out;
  }
  return { review, preview, fromLegacy, retrievability, interval, W };
})();

const Mastery = (() => {
  const K0 = 0.6, KMIN = 0.1, TH = 4;
  const sigma = x => 1 / (1 + Math.exp(-x));
  const guess = t => (t === "l2" ? 1 / 3 : 1 / 4);
  // 答對機率：猜中率 c 加上真正會的部分
  const p = (th, b, c) => c + (1 - c) * sigma(th - b);
  // 一次作答後的新狀態。m 可以是 undefined（第一次）。前幾題步伐大、之後越來越小，避免一兩題就大起大落。
  function update(m, correct, { type = "p5", b = 0, today = "" } = {}) {
    const n = (m && m.n) || 0, th = (m && m.th) || 0;
    const K = Math.max(KMIN, K0 / Math.sqrt(1 + n / 3));
    const th2 = Math.min(TH, Math.max(-TH, th + K * ((correct ? 1 : 0) - p(th, b, guess(type)))));
    return { th: +th2.toFixed(4), n: n + 1, r: ((m && m.r) || 0) + (correct ? 1 : 0), last: today };
  }
  // 掌握度：一般難度的題目預估答對率（0–1，含猜中率）
  const level = (m, type = "p5") => p((m && m.th) || 0, 0, guess(type));
  const MIN_N = 5; // 少於這個題數只顯示「資料不足」
  const enough = m => !!m && m.n >= MIN_N;
  return { update, level, enough, p, guess, MIN_N };
})();
