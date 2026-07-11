/* ============ 模擬考：組卷引擎、考試介面、成績報告、歷史趨勢 ============ */
// 仿真 TOEIC 兩節：聽力節（P2×10＋P3/4×3 組）＋ 閱讀節（P5×15＋P6×1 篇＋P7×2 組，限時 22 分）
// 作答中不顯示對錯；聽力不可回放；閱讀可旗標、跳題、倒數自動收卷。

const READING_SECONDS = 22 * 60;

const Mock = {
  s: null, // 進行中的 session

  inProgress() { return !!Mock.s && !Mock.s.finished; },

  // 離開防護：switchTab 會在使用者切走前呼叫
  confirmLeave(proceed) {
    UI.confirm("模擬考正在進行中，離開將放棄本次成績。確定要離開嗎？", { title: "放棄模擬考", okText: "放棄並離開", danger: true })
      .then(ok => { if (ok) { Mock.abandon(); proceed(); } });
  },

  abandon() {
    if (!Mock.s) return;
    Mock.s.cancelled = true;
    Mock.s.finished = true;
    if (Mock.s.readTimer) { clearInterval(Mock.s.readTimer); }
    TTS.stop();
    Mock.s = null;
  },

  /* ---------- 抽題 ---------- */
  // 從 pool（索引清單）抽 n 個「模考沒出過」的；不夠就重置該類 seen 重新輪替
  draw(kind, poolSize, n) {
    if (!S.mockSeen) S.mockSeen = {};
    if (!S.mockSeen[kind]) S.mockSeen[kind] = {};
    let fresh = [];
    for (let i = 0; i < poolSize; i++) if (!S.mockSeen[kind][i]) fresh.push(i);
    if (fresh.length < n) {
      S.mockSeen[kind] = {}; // 該類題庫輪替一圈，重置
      fresh = Array.from({ length: poolSize }, (_, i) => i);
      UI.toast(`${kind.toUpperCase()} 題庫已輪替一圈，重新洗牌`, "info");
    }
    const picked = shuffle(fresh).slice(0, n);
    picked.forEach(i => { S.mockSeen[kind][i] = true; });
    return picked;
  },

  /* ---------- 組卷 ---------- */
  buildPaper(mode) {
    const paper = { listening: [], reading: [] };
    if (mode !== "read") {
      // 聽力節：P2 ×10
      Mock.draw("l2", PART2.length, 10).forEach(id => {
        const item = PART2[id];
        const order = shuffle(item.opts.map((_, i) => i));
        paper.listening.push({ type: "l2", part: "Part 2", id, ref: item, order, ansPos: order.indexOf(item.ans) });
      });
      // P3/4 ×3 組（每組展開為 3 題，共 9 題）
      Mock.draw("l34", PART34.length, 3).forEach(si => {
        const set = PART34[si];
        set.qs.forEach((q, qi) => {
          paper.listening.push({
            type: "l34", part: set.type, si, qi, set, q,
            order: shuffle(q.opts.map((_, i) => i)),
            audioLead: qi === 0 // 每組第一題前播整段音檔
          });
        });
      });
    }
    if (mode !== "listen") {
      // 閱讀節：P5 ×15
      Mock.draw("p5", PART5.length, 15).forEach(id => {
        const item = PART5[id];
        paper.reading.push({ type: "p5", part: "Part 5", id, q: item, order: shuffle(item.opts.map((_, i) => i)) });
      });
      // P6 ×1 篇（4 格）
      Mock.draw("p6", PART6.length, 1).forEach(pi => {
        const p = PART6[pi];
        p.blanks.forEach((blank, bi) => {
          paper.reading.push({
            type: "p6", part: "Part 6", pi, bi, passage: p,
            q: { q: `空格 [${bi + 1}] 應填入：`, opts: blank.opts, ans: blank.ans, exp: blank.exp },
            order: shuffle(blank.opts.map((_, i) => i))
          });
        });
      });
      // P7 ×2 組
      Mock.draw("p7", PART7.length, 2).forEach(si => {
        const set = PART7[si];
        set.qs.forEach((q, qi) => {
          paper.reading.push({ type: "p7", part: "Part 7", si, qi, set, q, order: shuffle(q.opts.map((_, i) => i)) });
        });
      });
    }
    return paper;
  },

  /* ---------- 啟動 ---------- */
  start(mode) { // mode: full | listen | read
    const paper = Mock.buildPaper(mode);
    Mock.s = {
      mode, paper,
      lAnswers: new Array(paper.listening.length).fill(null),
      rAnswers: new Array(paper.reading.length).fill(null),
      flags: new Set(),
      rAt: 0,
      secLeft: READING_SECONDS,
      readTimer: null,
      t0: Date.now(),
      finished: false, cancelled: false
    };
    save(); // mockSeen 已更新
    if (mode === "read") Mock.startReading();
    else Mock.runListening();
  },

  box() { return $("#tab-mock"); },

  /* ---------- 聽力節（自動推進、不可回放） ---------- */
  async runListening() {
    const s = Mock.s;
    const items = s.paper.listening;
    for (let i = 0; i < items.length; i++) {
      if (!Mock.s || s.cancelled) return;
      const it = items[i];
      if (it.type === "l34" && it.audioLead) {
        Mock.renderListenItem(i, true);
        if (TTS.ok) await TTS.seq(l34Audio(it.set));
        if (!Mock.s || s.cancelled) return;
      }
      Mock.renderListenItem(i, false);
      if (it.type === "l2" && TTS.ok) {
        await TTS.seq(l2Audio(it.ref, it.order));
        if (!Mock.s || s.cancelled) return;
      }
      // 作答窗：P2 五秒、P3/4 每題八秒；作答後可提前進下一題
      await Mock.answerWindow(i, it.type === "l2" ? 5 : 8);
      if (!Mock.s || s.cancelled) return;
    }
    if (s.mode === "full") Mock.startReading();
    else Mock.submit();
  },

  renderListenItem(i, playingLead) {
    const s = Mock.s;
    const it = s.paper.listening[i];
    const total = s.paper.listening.length;
    const answered = s.lAnswers.filter(a => a !== null).length;
    let body;
    if (playingLead) {
      body = `<div class="mock-audio"><div class="wave">🔊</div><p class="muted">正在播放 ${esc(it.part)} 音檔（不可暫停／回放）</p></div>`;
    } else if (it.type === "l2") {
      body = `
        <div class="mock-audio"><div class="wave">🔊</div><p class="muted">聆聽問句與 (A)(B)(C) 三個回應，選出最合適的回應</p></div>
        <div class="rating-row" id="mock-abc">
          ${it.order.map((_, pos) => `<button data-pos="${pos}" class="${s.lAnswers[i] === pos ? "picked" : ""}">${"ABC"[pos]}</button>`).join("")}
        </div>`;
    } else {
      body = `
        <div class="q-text">${esc(it.q.q)}</div>
        <div>
          ${it.order.map((oi, pos) => `<button class="opt mock-opt ${s.lAnswers[i] === oi ? "picked" : ""}" data-oi="${oi}">(${"ABCD"[pos]}) ${esc(it.q.opts[oi])}</button>`).join("")}
        </div>`;
    }
    Mock.box().innerHTML = `
      <div class="card">
        <div class="mock-topbar">
          <span class="pill">🎧 聽力節 · ${esc(it.part)}</span>
          <span class="muted">第 ${i + 1} / ${total} 題 · 已答 ${answered}</span>
        </div>
        ${body}
        <div id="mock-window" class="mock-window"></div>
      </div>`;
    if (!playingLead) {
      Mock.box().querySelectorAll("#mock-abc button").forEach(btn =>
        btn.addEventListener("click", () => { s.lAnswers[i] = Number(btn.dataset.pos); Mock.markAnswered(i, btn, "#mock-abc button"); }));
      Mock.box().querySelectorAll(".mock-opt").forEach(btn =>
        btn.addEventListener("click", () => { s.lAnswers[i] = Number(btn.dataset.oi); Mock.markAnswered(i, btn, ".mock-opt"); }));
    }
  },

  markAnswered(i, btn, sel) {
    Mock.box().querySelectorAll(sel).forEach(b => b.classList.remove("picked"));
    btn.classList.add("picked");
    // 已作答→縮短等待，1 秒後進下一題
    if (Mock.s) Mock.s.skipAt = Date.now() + 1000;
  },

  answerWindow(i, secs) {
    return new Promise(res => {
      const s = Mock.s;
      s.skipAt = null;
      const end = Date.now() + secs * 1000;
      const tick = setInterval(() => {
        if (!Mock.s || s.cancelled) { clearInterval(tick); res(); return; }
        const now = Date.now();
        const deadline = s.skipAt && s.skipAt < end ? s.skipAt : end;
        const left = Math.max(0, Math.ceil((deadline - now) / 1000));
        const el = document.getElementById("mock-window");
        if (el) el.innerHTML = `<div class="bar-track" style="height:6px"><div class="bar-fill" style="width:${Math.max(0, (deadline - now) / (secs * 1000)) * 100}%"></div></div><p class="muted" style="margin-top:4px">${left} 秒後自動下一題</p>`;
        if (now >= deadline) { clearInterval(tick); res(); }
      }, 200);
    });
  },

  /* ---------- 閱讀節（題號導航、旗標、倒數） ---------- */
  startReading() {
    const s = Mock.s;
    s.phase = "reading";
    s.readTimer = setInterval(() => {
      if (!Mock.s || s.cancelled) { clearInterval(s.readTimer); return; }
      s.secLeft--;
      const el = document.getElementById("mock-timer");
      if (el) {
        el.textContent = `⏱ ${Math.floor(s.secLeft / 60)}:${String(s.secLeft % 60).padStart(2, "0")}`;
        el.classList.toggle("over", s.secLeft <= 120);
      }
      if (s.secLeft <= 0) { clearInterval(s.readTimer); UI.toast("時間到，自動交卷", "info"); Mock.submit(); }
    }, 1000);
    Mock.renderReading();
  },

  renderReading() {
    const s = Mock.s;
    const items = s.paper.reading;
    const it = items[s.rAt];
    let passageHtml = "";
    if (it.type === "p6") {
      const marked = esc(it.passage.text).replace(/___\[(\d)\]___/g, (m, n) =>
        Number(n) === it.bi + 1 ? `<mark>___[${n}]___</mark>` : `___[${n}]___`);
      passageHtml = `<div class="passage">${marked}</div>`;
    } else if (it.type === "p7") {
      passageHtml = it.set.passages.map((t, idx) =>
        `${it.set.passages.length > 1 ? `<h3>文章 ${idx + 1}</h3>` : ""}<div class="passage">${esc(t)}</div>`).join("");
    }
    Mock.box().innerHTML = `
      <div class="card">
        <div class="mock-topbar">
          <span class="pill">📖 閱讀節 · ${esc(it.part)}</span>
          <span class="timer" id="mock-timer">⏱ ${Math.floor(s.secLeft / 60)}:${String(s.secLeft % 60).padStart(2, "0")}</span>
        </div>
        <div class="qnav">${items.map((_, idx) => {
          const cls = [s.rAt === idx ? "cur" : "", s.rAnswers[idx] !== null ? "done" : "", s.flags.has(idx) ? "flag" : ""].join(" ");
          return `<button class="qcell ${cls}" data-jump="${idx}">${idx + 1}</button>`;
        }).join("")}</div>
        ${passageHtml}
        <p class="q-progress">第 ${s.rAt + 1} / ${items.length} 題</p>
        <div class="q-text">${esc(it.q.q || "")}</div>
        <div>
          ${it.order.map((oi, pos) => `<button class="opt mock-opt ${s.rAnswers[s.rAt] === oi ? "picked" : ""}" data-oi="${oi}">(${"ABCD"[pos]}) ${esc(it.q.opts[oi])}</button>`).join("")}
        </div>
        <div class="mock-actions">
          <button class="btn ghost small" id="mock-flag">${s.flags.has(s.rAt) ? "🚩 取消旗標" : "🏳 旗標待回頭"}</button>
          <span>
            <button class="btn secondary small" id="mock-prev" ${s.rAt === 0 ? "disabled" : ""}>← 上一題</button>
            ${s.rAt < items.length - 1
              ? `<button class="btn small" id="mock-next">下一題 →</button>`
              : `<button class="btn small" id="mock-submit">交卷</button>`}
          </span>
        </div>
      </div>`;
    const box = Mock.box();
    box.querySelectorAll(".mock-opt").forEach(btn =>
      btn.addEventListener("click", () => {
        s.rAnswers[s.rAt] = Number(btn.dataset.oi);
        box.querySelectorAll(".mock-opt").forEach(b => b.classList.remove("picked"));
        btn.classList.add("picked");
        const cell = box.querySelector(`.qcell[data-jump="${s.rAt}"]`);
        if (cell) cell.classList.add("done");
      }));
    box.querySelectorAll("[data-jump]").forEach(b =>
      b.addEventListener("click", () => { s.rAt = Number(b.dataset.jump); Mock.renderReading(); }));
    box.querySelector("#mock-flag").addEventListener("click", () => {
      s.flags.has(s.rAt) ? s.flags.delete(s.rAt) : s.flags.add(s.rAt);
      Mock.renderReading();
    });
    const prev = box.querySelector("#mock-prev");
    if (prev) prev.addEventListener("click", () => { s.rAt--; Mock.renderReading(); });
    const next = box.querySelector("#mock-next");
    if (next) next.addEventListener("click", () => { s.rAt++; Mock.renderReading(); });
    const submit = box.querySelector("#mock-submit");
    if (submit) submit.addEventListener("click", async () => {
      const un = s.rAnswers.filter(a => a === null).length;
      const ok = un === 0 || await UI.confirm(`還有 ${un} 題未作答，確定交卷嗎？`, { title: "交卷確認", okText: "交卷" });
      if (ok) Mock.submit();
    });
  },

  /* ---------- 交卷與計分 ---------- */
  submit() {
    const s = Mock.s;
    if (!s || s.finished) return;
    s.finished = true;
    if (s.readTimer) clearInterval(s.readTimer);
    TTS.stop();

    const parts = {}; // part -> {r, t}
    const wrongs = []; // {part, q, opts, ans, exp, chosenText}
    const bump = (part, correct) => {
      if (!parts[part]) parts[part] = { r: 0, t: 0 };
      parts[part].t++;
      if (correct) parts[part].r++;
    };
    // 聽力
    let lR = 0, lT = 0;
    s.paper.listening.forEach((it, i) => {
      lT++;
      let correct, q, chosen;
      if (it.type === "l2") {
        correct = s.lAnswers[i] === it.ansPos;
        q = { q: it.ref.q, opts: it.ref.opts, ans: it.ref.ans, exp: it.ref.exp };
        chosen = s.lAnswers[i] === null ? null : it.ref.opts[it.order[s.lAnswers[i]]];
        if (correct) delete S.wb.l2[it.id]; else S.wb.l2[it.id] = true;
        trackListening("Part 2", !!correct);
      } else {
        correct = s.lAnswers[i] === it.q.ans;
        q = it.q;
        chosen = s.lAnswers[i] === null ? null : it.q.opts[s.lAnswers[i]];
        const key = `${it.si}-${it.qi}`;
        if (correct) delete S.wb.l34[key]; else S.wb.l34[key] = true;
        trackListening("Part 3/4", !!correct);
      }
      bump(it.part, correct);
      if (correct) lR++;
      else wrongs.push({ part: it.part, q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, chosen });
    });
    // 閱讀
    let rR = 0, rT = 0;
    s.paper.reading.forEach((it, i) => {
      rT++;
      const correct = s.rAnswers[i] === it.q.ans;
      const chosen = s.rAnswers[i] === null ? null : it.q.opts[s.rAnswers[i]];
      if (it.type === "p5") { if (correct) delete S.wb.p5[it.id]; else S.wb.p5[it.id] = true; if (!S.cat[it.q.cat]) S.cat[it.q.cat] = { r: 0, w: 0 }; correct ? S.cat[it.q.cat].r++ : S.cat[it.q.cat].w++; }
      if (it.type === "p6") { const k = `${it.pi}-${it.bi}`; if (correct) delete S.wb.p6[k]; else S.wb.p6[k] = true; }
      if (it.type === "p7") { const k = `${it.si}-${it.qi}`; if (correct) delete S.wb.p7[k]; else S.wb.p7[k] = true; }
      trackReading(!!correct);
      bump(it.part, correct);
      if (correct) rR++;
      else wrongs.push({ part: it.part, q: it.q.q, opts: it.q.opts, ans: it.q.ans, exp: it.q.exp, chosen });
    });

    const curve = acc => Math.min(495, Math.max(5, Math.round(acc * 505 / 5) * 5));
    const L = lT ? curve(lR / lT) : null;
    const R = rT ? curve(rR / rT) : null;
    const secs = Math.round((Date.now() - s.t0) / 1000);

    if (!S.mocks) S.mocks = [];
    S.mocks.push({ date: todayStr(), mode: s.mode, L, R, lR, lT, rR, rT, parts, secs });
    const d = daily(); d.mockDone = (d.mockDone || 0) + 1;
    save();
    updateNavBadges();
    Mock.renderReport({ L, R, lR, lT, rR, rT, parts, wrongs, secs, mode: s.mode });
    Mock.s = null;
  },

  renderReport(r) {
    const partOrder = ["Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"];
    const partTab = { "Part 2": "listen", "Part 3": "listen", "Part 4": "listen", "Part 5": "p5", "Part 6": "p6", "Part 7": "p7" };
    const bars = partOrder.filter(p => r.parts[p]).map(p => {
      const st = r.parts[p], pct = Math.round(st.r / st.t * 100);
      return `<div class="bar-row"><span class="lbl">${p}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span class="val">${pct}%（${st.r}/${st.t}）</span></div>`;
    }).join("");
    // 弱項 Top 3
    const weak = partOrder.filter(p => r.parts[p]).map(p => ({ p, acc: r.parts[p].r / r.parts[p].t }))
      .sort((a, b) => a.acc - b.acc).slice(0, 3);
    const total = (r.L || 0) + (r.R || 0);
    Mock.box().innerHTML = `
      <div class="card result-banner">
        <p class="muted">${r.mode === "full" ? "完整模考" : r.mode === "listen" ? "聽力節" : "閱讀節"} · 用時 ${Math.floor(r.secs / 60)} 分 ${r.secs % 60} 秒</p>
        <div class="score">${r.mode === "full" ? total : (r.L ?? r.R)}</div>
        <p>${r.L !== null ? `聽力 L ${r.L}（${r.lR}/${r.lT}）` : ""}${r.L !== null && r.R !== null ? " ＋ " : ""}${r.R !== null ? `閱讀 R ${r.R}（${r.rR}/${r.rT}）` : ""}</p>
        <p class="muted">預估分數以正確率換算，僅供追蹤趨勢</p>
      </div>
      <div class="card"><h2>📊 各 Part 正確率</h2>${bars}</div>
      <div class="card"><h2>🎯 弱項優先加強</h2>
        ${weak.map((w, i) => `<div class="item-row"><div>${i + 1}. <b>${w.p}</b> <span class="muted">正確率 ${Math.round(w.acc * 100)}%</span></div><button class="btn small" data-weak="${partTab[w.p]}">去練習</button></div>`).join("")}
      </div>
      <div class="card"><h2>❌ 答錯 ${r.wrongs.length} 題（已加入錯題本）</h2>
        ${r.wrongs.length ? r.wrongs.map(w => `
          <details class="mock-wrong">
            <summary><span class="pill">${esc(w.part)}</span> ${esc(w.q.slice(0, 60))}${w.q.length > 60 ? "…" : ""}</summary>
            <div class="explain">你的答案：${w.chosen === null ? "未作答" : esc(w.chosen)}<br>正解：${esc(w.opts[w.ans])}<br>${esc(w.exp)}</div>
          </details>`).join("") : `<p class="muted">全對！🏆</p>`}
      </div>
      <div style="text-align:center"><button class="btn" id="mock-back">返回模擬考首頁</button></div>`;
    Mock.box().querySelectorAll("[data-weak]").forEach(b =>
      b.addEventListener("click", () => goTo(b.dataset.weak)));
    $("#mock-back").addEventListener("click", () => renderers.mock());
  },

  /* ---------- 模擬考首頁（選單＋歷史趨勢） ---------- */
  menu() {
    const mocks = S.mocks || [];
    const fulls = mocks.filter(m => m.mode === "full");
    const best = fulls.length ? Math.max(...fulls.map(m => (m.L || 0) + (m.R || 0))) : null;
    // 歷次（完整模考）折線圖
    let chart = "";
    if (fulls.length >= 2) {
      const w = 320, h = 120, pad = 20;
      const scores = fulls.map(m => (m.L || 0) + (m.R || 0));
      const min = Math.min(...scores), max = Math.max(...scores);
      const x = i => pad + i * (w - 2 * pad) / (fulls.length - 1);
      const y = v => h - pad - (max === min ? 0.5 : (v - min) / (max - min)) * (h - 2 * pad);
      const pts = scores.map((v, i) => `${x(i)},${y(v)}`).join(" ");
      chart = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:420px" role="img" aria-label="歷次模考分數趨勢">
          <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
          ${scores.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="var(--accent)"/><text x="${x(i)}" y="${y(v) - 8}" text-anchor="middle" font-size="10" fill="var(--muted)">${v}</text>`).join("")}
        </svg>`;
    }
    Mock.box().innerHTML = `
      <div class="card">
        <h2>🚀 模擬考</h2>
        <p class="muted">仿真 TOEIC 節奏：聽力節自動連播不可回放；閱讀節限時 22 分鐘，可旗標與跳題；作答中不顯示對錯，交卷後產出成績報告，錯題自動進錯題本。</p>
      </div>
      <div class="hub-card" data-mock="full">
        <div class="hub-icon">📋</div>
        <div class="hub-text"><div class="hub-title">完整模考</div><div class="hub-sub muted">聽力節（19 題）＋閱讀節（約 27 題）· 約 35 分鐘</div></div>
        <div class="hub-arrow">›</div>
      </div>
      <div class="hub-card" data-mock="listen">
        <div class="hub-icon">🎧</div>
        <div class="hub-text"><div class="hub-title">只考聽力節</div><div class="hub-sub muted">P2 ×10＋P3/4 ×3 組 · 約 12 分鐘</div></div>
        <div class="hub-arrow">›</div>
      </div>
      <div class="hub-card" data-mock="read">
        <div class="hub-icon">📖</div>
        <div class="hub-text"><div class="hub-title">只考閱讀節</div><div class="hub-sub muted">P5 ×15＋P6 ×1 篇＋P7 ×2 組 · 限時 22 分鐘</div></div>
        <div class="hub-arrow">›</div>
      </div>
      ${mocks.length ? `
      <div class="card">
        <h2>📈 歷史成績${best ? ` <span class="muted">· 最佳 ${best}</span>` : ""}</h2>
        ${chart}
        ${mocks.slice(-8).reverse().map(m => `
          <div class="item-row"><div><b>${m.date}</b> <span class="pill">${m.mode === "full" ? "完整" : m.mode === "listen" ? "聽力節" : "閱讀節"}</span></div>
          <div>${m.L !== null && m.L !== undefined ? `L ${m.L}` : ""} ${m.R !== null && m.R !== undefined ? `R ${m.R}` : ""} ${m.mode === "full" ? `= <b>${(m.L || 0) + (m.R || 0)}</b>` : ""}</div></div>`).join("")}
      </div>` : ""}`;
    Mock.box().querySelectorAll("[data-mock]").forEach(el =>
      el.addEventListener("click", async () => {
        const mode = el.dataset.mock;
        const ok = await UI.confirm(
          mode === "read" ? "閱讀節限時 22 分鐘，時間到自動交卷。準備好就開始！" : "聽力節將自動連續播放、不可暫停或回放（仿真考試）。建議戴上耳機，準備好就開始！",
          { title: "開始模擬考", okText: "開始" });
        if (ok) Mock.start(mode);
      }));
  }
};
