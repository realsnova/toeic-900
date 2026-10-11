/* ============ 模擬考：組卷引擎、考試介面、成績報告、歷史趨勢 ============ */
// 仿真 TOEIC 兩節：聽力節（P2×10＋P3/4×3 組）＋ 閱讀節（P5×15＋P6×1 篇＋P7×2 組，限時 22 分）
// 作答中不顯示對錯；聽力不可回放；閱讀可旗標、跳題、倒數自動收卷。

const READING_SECONDS = 22 * 60;
// 完整閱讀測驗的清單 FORMS 定義在 app.js（首頁菜單開機時就要用到）
const FORM_PROGRESS_KEY = "toeic900_form_progress";
const formOf = mode => FORMS.find(f => f.id === mode) || null;

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
    if (formOf(Mock.s.mode) && !isListenForm(formOf(Mock.s.mode))) Mock.clearProgress(); // 聽力測驗沒有暫存，不可刪掉閱讀測驗的進度
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
    for (let i = 0; i < poolSize; i++) if (!S.mockSeen[kind][recId(kind, i)] && !isFormItem(kind, i)) fresh.push(i);
    if (fresh.length < n) {
      S.mockSeen[kind] = {}; // 該類題庫輪替一圈，重置
      fresh = Array.from({ length: poolSize }, (_, i) => i).filter(i => !isFormItem(kind, i));
      UI.toast(`${kind.toUpperCase()} 題庫已輪替一圈，重新洗牌`, "info");
    }
    const picked = shuffle(fresh).slice(0, n);
    picked.forEach(i => { const id = recId(kind, i); if (id) S.mockSeen[kind][id] = true; });
    return picked;
  },

  /* ---------- 組卷 ---------- */
  // 完整測驗的卷子：該回的所有題目，依題庫順序
  buildFormPaper(id) {
    const paper = { listening: [], reading: [] };
    PART5.forEach((item, i) => {
      if (item.form === id) paper.reading.push({ type: "p5", part: "Part 5", id: i, q: item, order: shuffle(item.opts.map((_, k) => k)) });
    });
    PART6.forEach((p, pi) => {
      if (p.form !== id) return;
      p.blanks.forEach((blank, bi) => paper.reading.push({
        type: "p6", part: "Part 6", pi, bi, passage: p,
        q: { q: `空格 [${bi + 1}] 應填入：`, opts: blank.opts, ans: blank.ans, exp: blank.exp },
        order: shuffle(blank.opts.map((_, k) => k))
      }));
    });
    PART7.forEach((set, si) => {
      if (set.form !== id) return;
      set.qs.forEach((q, qi) => paper.reading.push({ type: "p7", part: "Part 7", si, qi, set, q, order: optionOrder(q.opts) }));
    });
    // 完整聽力測驗：Part 2 → Part 3 → Part 4，題號照正式考試（Part 1 待補，所以從 7 開始）。
    // pre：這一題前要先播的旁白（各 Part 說明、題組開場）；ask：念題目（Part 3/4）。
    // 旁白的文字與題號必須和 tools/audio/build-jobs.mjs 一致，音檔才對得上。
    let num = 7, lastPart = null;
    const narr = (t, pause) => ({ t, s: "N", pause, clip: ClipKey.n(t) });
    PART2.forEach((item, i) => {
      if (item.form !== id) return;
      const order = shuffle(item.opts.map((_, k) => k));
      paper.listening.push({ type: "l2", part: "Part 2", id: i, ref: item, order, ansPos: order.indexOf(item.ans), num: num++,
        pre: lastPart === "Part 2" ? null : [narr(ListenScript.directions["Part 2"], 900)] });
      lastPart = "Part 2";
    });
    PART34.forEach((set, si) => {
      if (set.form !== id) return;
      const pre = (lastPart === set.type ? [] : [narr(ListenScript.directions[set.type], 900)])
        .concat([narr(ListenScript.setIntro(set, num, num + set.qs.length - 1), 500)]);
      lastPart = set.type;
      set.qs.forEach((q, qi) => {
        paper.listening.push({
          type: "l34", part: set.type, si, qi, set, q, num,
          order: shuffle(q.opts.map((_, k) => k)),
          audioLead: qi === 0, pre: qi === 0 ? pre : null,
          ask: narr(ListenScript.question(num, q.q), 0)
        });
        num++;
      });
    });
    return paper;
  },

  buildPaper(mode) {
    if (formOf(mode)) return Mock.buildFormPaper(mode);
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
          paper.reading.push({ type: "p7", part: "Part 7", si, qi, set, q, order: optionOrder(q.opts) });
        });
      });
    }
    return paper;
  },

  /* ---------- 啟動 ---------- */
  start(mode, resume) { // mode: full | listen | read | R1…；resume：完整測驗的暫存進度
    if (Mock.inProgress()) return; // 連點兩次開始：第二次忽略，避免留下第二個計時器
    const paper = Mock.buildPaper(mode);
    Mock.s = {
      mode, paper,
      lAnswers: new Array(paper.listening.length).fill(null),
      rAnswers: new Array(paper.reading.length).fill(null),
      flags: new Set(),
      rAt: 0,
      secLeft: formOf(mode) ? formOf(mode).secs : READING_SECONDS,
      readTimer: null,
      t0: Date.now(),
      audioFail: new Set(), // 語音沒有播放的聽力題索引：不計分（見 submit）
      finished: false, cancelled: false
    };
    if (resume) {
      // 完整測驗的作答以「原始選項索引」存，選項重新洗牌也對得上；超出範圍的值一律丟掉
      const n = paper.reading.length;
      Mock.s.rAnswers = Mock.s.rAnswers.map((_, i) => {
        const a = resume.answers[i];
        return Number.isInteger(a) && a >= 0 && a < paper.reading[i].q.opts.length ? a : null;
      });
      Mock.s.flags = new Set((Array.isArray(resume.flags) ? resume.flags : []).filter(i => Number.isInteger(i) && i >= 0 && i < n));
      Mock.s.deadline = resume.deadline;
      Mock.s.t0 = Number.isFinite(resume.t0) ? resume.t0 : Date.now();
    }
    save(); // mockSeen 已更新
    if (mode === "read" || (formOf(mode) && !isListenForm(formOf(mode)))) Mock.startReading();
    else Mock.readyListening();
  },

  // 聽力節要由使用者點「開始播放」才開始：iOS 只允許在點擊當下直接觸發語音，
  // 開始前的確認視窗是非同步的，不能直接接著播放。
  readyListening() {
    const s = Mock.s;
    Mock.box().innerHTML = `
      <div class="card" style="text-align:center">
        <h2>🎧 聽力節</h2>
        <p class="muted">共 ${s.paper.listening.length} 題，語音會自動連續播放、不可暫停或回放。${isListenForm(formOf(s.mode)) ? "題號照正式考試從 7 開始（Part 1 待補）。對話播放時可以先看這一組的三個題目。中途離開不會保存進度。" : ""}</p>
        ${ttsNoteHTML()}
        <button class="btn" id="mock-play">▶ 開始播放</button>
      </div>`;
    $("#mock-play").addEventListener("click", () => {
      s.t0 = Date.now();
      Mock.runListening(); // 第一段語音在這次點擊內同步送出
    });
  },

  box() { return $("#tab-mock"); },

  /* ---------- 聽力節（自動推進、不可回放） ---------- */
  async runListening() {
    const s = Mock.s;
    const items = s.paper.listening;
    for (let i = 0; i < items.length; i++) {
      if (!Mock.s || s.cancelled) return;
      const it = items[i];
      const onSilent = () => showSilentHelp(null);
      const seqOpts = { onSilent, clipRate: 1 }; // 模擬考的音檔一律原速
      hideSilentHelp(); // 上一題的提示不可留到這一題
      if (it.pre && it.pre.length) {
        Mock.renderListenItem(i, true);
        await TTS.seq(it.pre, { clipRate: 1 }); // 旁白沒播出來不影響作答，不提示也不扣題
        if (Mock.s !== s || s.cancelled) return;
      }
      if (it.type === "l34" && it.audioLead) {
        Mock.renderListenItem(i, true);
        const { played, aborted } = await TTS.seq(l34Audio(it.set), seqOpts);
        if (Mock.s !== s || s.cancelled) return;
        // 對話沒有播放，同一組的三題都無從作答
        if (!played && !aborted) items.forEach((x, j) => { if (x.type === "l34" && x.set === it.set) s.audioFail.add(j); });
      }
      Mock.renderListenItem(i, false);
      if (it.type === "l2") {
        const { played, aborted } = await TTS.seq(l2Audio(it.ref, it.order), seqOpts);
        if (Mock.s !== s || s.cancelled) return;
        if (!played && !aborted) s.audioFail.add(i);
      } else if (it.ask) {
        await TTS.seq([it.ask], { clipRate: 1 }); // 念題目（題目也顯示在畫面上，沒念出來不影響作答）
        if (Mock.s !== s || s.cancelled) return;
      }
      // 作答窗：P2 五秒、P3/4 每題八秒；作答後可提前進下一題
      await Mock.answerWindow(i, it.type === "l2" ? 5 : 8);
      if (!Mock.s || s.cancelled) return;
    }
    if (s.mode === "full") Mock.startReading();
    else Mock.submit();
  },

  // 對話播放時先讓考生看這一組的題目（正式考試的題本上印有題目與選項）
  previewHTML(it) {
    if (!it.set || it.type !== "l34") return "";
    const items = Mock.s.paper.listening.filter(x => x.set === it.set);
    return `<div class="mock-preview">${items.map(x => `
      <div class="q-text">${x.num ? `${x.num}. ` : ""}${esc(x.q.q)}</div>
      <ol class="muted" type="A">${x.order.map(oi => `<li>${esc(x.q.opts[oi])}</li>`).join("")}</ol>`).join("")}</div>`;
  },

  renderListenItem(i, playingLead) {
    const s = Mock.s;
    const it = s.paper.listening[i];
    const total = s.paper.listening.length;
    const answered = s.lAnswers.filter(a => a !== null).length;
    let body;
    if (playingLead) {
      body = `<div class="mock-audio"><div class="wave">🔊</div><p class="muted">正在播放 ${esc(it.part)} 音檔（不可暫停／回放）</p></div>${graphicHTML(it.set)}${Mock.previewHTML(it)}`;
    } else if (it.type === "l2") {
      body = `
        <div class="mock-audio"><div class="wave">🔊</div><p class="muted">聆聽問句與 (A)(B)(C) 三個回應，選出最合適的回應</p></div>
        <div class="rating-row" id="mock-abc">
          ${it.order.map((_, pos) => `<button data-pos="${pos}" class="${s.lAnswers[i] === pos ? "picked" : ""}">${"ABC"[pos]}</button>`).join("")}
        </div>`;
    } else {
      body = `
        ${graphicHTML(it.set)}
        <div class="q-text">${it.num ? `${it.num}. ` : ""}${esc(it.q.q)}</div>
        <div>
          ${it.order.map((oi, pos) => `<button class="opt mock-opt ${s.lAnswers[i] === oi ? "picked" : ""}" data-oi="${oi}">(${"ABCD"[pos]}) ${esc(it.q.opts[oi])}</button>`).join("")}
        </div>`;
    }
    Mock.box().innerHTML = `
      <div class="card">
        <div class="mock-topbar">
          <span class="pill">🎧 聽力節 · ${esc(it.part)}</span>
          <span class="muted">${it.num ? `第 ${it.num} 題（${i + 1} / ${total}）` : `第 ${i + 1} / ${total} 題`} · 已答 ${answered}</span>
        </div>
        ${body}
        ${ttsNoteHTML(it.type === "l2" ? l2Audio(it.ref, it.order) : l34Audio(it.set))}
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
  // 剩餘秒數由截止時間算出：瀏覽器在背景會放慢或暫停計時器，不能靠每秒減一
  timeLeft(s) { return Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)); },
  startReading() {
    const s = Mock.s;
    s.phase = "reading";
    if (!s.deadline) s.deadline = Date.now() + s.secLeft * 1000;
    const tick = () => {
      if (Mock.s !== s || s.cancelled || s.finished) { clearInterval(s.readTimer); document.removeEventListener("visibilitychange", tick); return; }
      s.secLeft = Mock.timeLeft(s);
      const el = document.getElementById("mock-timer");
      if (el) {
        el.textContent = `⏱ ${Math.floor(s.secLeft / 60)}:${String(s.secLeft % 60).padStart(2, "0")}`;
        el.classList.toggle("over", s.secLeft <= 120);
      }
      if (s.secLeft <= 0) {
        clearInterval(s.readTimer);
        document.removeEventListener("visibilitychange", tick);
        UI.toast("時間到，自動交卷", "info");
        Mock.submit();
      }
    };
    s.readTimer = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick); // 回到分頁時立刻更新
    Mock.saveProgress();
    tick();
    if (!s.finished) Mock.renderReading();
  },

  /* ---- 完整測驗的作答進度暫存（P2-2）：重新整理或手機把分頁關掉後可以接著做 ----
     存在 localStorage 的獨立鍵，不進 S、不同步；交卷或放棄時刪除。 */
  saveProgress() {
    const s = Mock.s;
    if (!s || !formOf(s.mode) || s.finished) return;
    try {
      localStorage.setItem(FORM_PROGRESS_KEY, JSON.stringify({ mode: s.mode, sig: Mock.formSig(s.mode), answers: s.rAnswers, flags: [...s.flags], deadline: s.deadline, t0: s.t0 }));
    } catch (e) { /* 存不了就算了，不影響作答 */ }
  },
  loadProgress() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(FORM_PROGRESS_KEY) || "null"); } catch (e) { p = undefined; }
    if (p === null) return null;
    if (p && formOf(p.mode) && Array.isArray(p.answers) && Number.isFinite(p.deadline) && p.sig === Mock.formSig(p.mode)) return p;
    Mock.clearProgress(); // 壞資料、已不存在的測驗、或題目已經更新：無法正確接續，刪除
    return null;
  },
  // 測驗題目的指紋：題目更新後，舊的作答進度就不能再對到題號
  formSig(mode) {
    const items = [];
    PART5.forEach((q, i) => { if (q.form === mode) items.push(q.q); });
    PART6.forEach(p => { if (p.form === mode) items.push(p.text); });
    PART7.forEach(st => { if (st.form === mode) st.qs.forEach(q => items.push(q.q)); });
    let h = 0x811c9dc5;
    const str = items.join("\u0001");
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return `${items.length}-${h.toString(16)}`;
  },
  clearProgress() { try { localStorage.removeItem(FORM_PROGRESS_KEY); } catch (e) { /* 忽略 */ } },

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
          <span class="pill">📖 ${formOf(s.mode) ? esc(formOf(s.mode).name) : "閱讀節"} · ${esc(it.part)}</span>
          <span class="timer" id="mock-timer">⏱ ${Math.floor(s.secLeft / 60)}:${String(s.secLeft % 60).padStart(2, "0")}</span>
        </div>
        ${(() => {
          const grid = `<div class="qnav">${items.map((_, idx) => {
            const cls = [s.rAt === idx ? "cur" : "", s.rAnswers[idx] !== null ? "done" : "", s.flags.has(idx) ? "flag" : ""].join(" ");
            return `<button class="qcell ${cls}" data-jump="${idx}">${idx + 1}</button>`;
          }).join("")}</div>`;
          // 題數多（完整測驗 100 題）時題號格會佔滿手機畫面，改成可收合，預設收起
          if (items.length <= 30) return grid;
          const answered = s.rAnswers.filter(a => a !== null).length;
          return `<details class="qnav-wrap" ${s.navOpen ? "open" : ""}><summary>題號導覽（已答 ${answered} / ${items.length}${s.flags.size ? `・旗標 ${s.flags.size}` : ""}）</summary>${grid}</details>`;
        })()}
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
    const navWrap = box.querySelector(".qnav-wrap");
    if (navWrap) navWrap.addEventListener("toggle", () => { s.navOpen = navWrap.open; });
    box.querySelectorAll(".mock-opt").forEach(btn =>
      btn.addEventListener("click", () => {
        s.rAnswers[s.rAt] = Number(btn.dataset.oi);
        Mock.saveProgress();
        box.querySelectorAll(".mock-opt").forEach(b => b.classList.remove("picked"));
        btn.classList.add("picked");
        const cell = box.querySelector(`.qcell[data-jump="${s.rAt}"]`);
        if (cell) cell.classList.add("done");
      }));
    box.querySelectorAll("[data-jump]").forEach(b =>
      b.addEventListener("click", () => { s.rAt = Number(b.dataset.jump); Mock.renderReading(); }));
    box.querySelector("#mock-flag").addEventListener("click", () => {
      s.flags.has(s.rAt) ? s.flags.delete(s.rAt) : s.flags.add(s.rAt);
      Mock.saveProgress();
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
    if (formOf(s.mode) && !isListenForm(formOf(s.mode))) Mock.clearProgress();

    // 完全沒有作答（例如開始後就離開、時間到自動交卷）：不計分、不記錄，錯題本與答對率都不動，
    // 這一回完整測驗也不算做過。必須在下面的計分之前結束，聽力題的計分也會寫入錯題本與答對率。
    const answeredAny = s.rAnswers.some(a => a !== null) || s.lAnswers.some(a => a !== null);
    if (!answeredAny) {
      Mock.s = null;
      hideSilentHelp();
      Mock.box().innerHTML = `<div class="card result-banner"><h2>這次沒有作答</h2>
        <p class="muted">沒有任何作答，所以不記錄成績，也不影響錯題本與答對率。${formOf(s.mode) ? "這一回完整測驗之後可以重新開始。" : ""}</p>
        <br><button class="btn" id="mock-back">回模擬考首頁</button></div>`;
      document.getElementById("mock-back").addEventListener("click", () => Mock.menu());
      updateNavBadges();
      return;
    }

    const parts = {}; // part -> {r, t}
    const wrongs = []; // {part, q, opts, ans, exp, chosenText}
    const bump = (part, correct) => {
      if (!parts[part]) parts[part] = { r: 0, t: 0 };
      parts[part].t++;
      if (correct) parts[part].r++;
    };
    // 聽力
    let lR = 0, lT = 0;
    const lSkip = s.audioFail.size;
    s.paper.listening.forEach((it, i) => {
      if (s.audioFail.has(i)) return; // 沒聽到題目，不算對也不算錯，不進錯題本也不進累計答對率
      lT++;
      let correct, q, chosen;
      if (it.type === "l2") {
        correct = s.lAnswers[i] === it.ansPos;
        q = { q: it.ref.q, opts: it.ref.opts, ans: it.ref.ans, exp: it.ref.exp };
        chosen = s.lAnswers[i] === null ? null : it.ref.opts[it.order[s.lAnswers[i]]];
        wbMark("l2", it.id, !!correct);
        trackListening("Part 2", !!correct);
      } else {
        correct = s.lAnswers[i] === it.q.ans;
        q = it.q;
        chosen = s.lAnswers[i] === null ? null : it.q.opts[s.lAnswers[i]];
        const key = `${it.si}-${it.qi}`;
        wbMark("l34", key, !!correct);
        trackListening("Part 3-4", !!correct);
      }
      bump(it.part, correct);
      if (correct) lR++;
      else wrongs.push({ part: it.part, q: q.q, opts: q.opts, ans: q.ans, exp: q.exp, chosen });
    });
    // 閱讀
    let rR = 0, rT = 0;
    let rBlank = 0;
    s.paper.reading.forEach((it, i) => {
      rT++;
      const correct = s.rAnswers[i] === it.q.ans;
      const chosen = s.rAnswers[i] === null ? null : it.q.opts[s.rAnswers[i]];
      // 沒作答（多半是時間不夠）：本次成績算錯，但不進錯題本、不計入累計答對率與類別統計——
      // 沒看過的題目進錯題本只會淹沒真正答錯的題，也會讓答對率失真
      if (s.rAnswers[i] === null) {
        rBlank++;
      } else {
        if (it.type === "p5") { wbMark("p5", it.id, !!correct); if (!S.cat[it.q.cat]) S.cat[it.q.cat] = { r: 0, w: 0 }; correct ? S.cat[it.q.cat].r++ : S.cat[it.q.cat].w++; }
        if (it.type === "p6") { wbMark("p6", `${it.pi}-${it.bi}`, !!correct); }
        if (it.type === "p7") { wbMark("p7", `${it.si}-${it.qi}`, !!correct); }
        trackReading(!!correct);
      }
      bump(it.part, correct);
      if (correct) rR++;
      else wrongs.push({ part: it.part, q: it.q.q, opts: it.q.opts, ans: it.q.ans, exp: it.q.exp, chosen });
    });

    // 只存原始答對數，不換算 TOEIC 分數（題目沒有校準，換算出來的數字沒有根據）
    const secs = Math.round((Date.now() - s.t0) / 1000);
    hideSilentHelp();

    if (!S.mocks) S.mocks = [];
    S.mocks.push({ date: todayStr(), mode: s.mode, lR, lT, rR, rT, lSkip, parts, secs });
    const d = daily(); d.mockDone = (d.mockDone || 0) + 1;
    if (s.mode !== "listen" && s.rAnswers.some(a => a !== null)) d.readMock = (d.readMock || 0) + 1;
    save();
    updateNavBadges();
    Mock.renderReport({ lR, lT, rR, rT, lSkip, rBlank, parts, wrongs, secs, mode: s.mode });
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
    const pct = (a, b) => b ? Math.round(a / b * 100) : null;
    const sec = (name, a, b) => `<div class="mock-sec"><div class="score">${pct(a, b)}%</div><div class="muted">${name}答對 ${a} / ${b} 題</div></div>`;
    const lf = isListenForm(formOf(r.mode));
    const hasL = r.mode === "full" || r.mode === "listen" || lf, hasR = r.mode !== "listen" && !lf;
    const graded = r.lT + r.rT > 0; // 全部題目都因語音沒播放而不計分時，不可顯示「全對」
    Mock.box().innerHTML = `
      <div class="card result-banner">
        <p class="muted">${Mock.modeName(r.mode)} · 用時 ${Math.floor(r.secs / 60)} 分 ${r.secs % 60} 秒</p>
        <div class="mock-secs">
          ${hasL ? (r.lT ? sec("聽力", r.lR, r.lT) : `<div class="mock-sec"><div class="score">—</div><div class="muted">聽力沒有可計分的題目</div></div>`) : ""}
          ${hasR ? sec("閱讀", r.rR, r.rT) : ""}
        </div>
        ${r.lSkip ? `<p class="muted">有 ${r.lSkip} 題聽力因為語音沒有播放，不列入計分。</p>` : ""}
        ${r.rBlank ? `<p class="muted">閱讀有 ${r.rBlank} 題沒有作答：本次成績算錯，但不放進錯題本，也不計入累計答對率。</p>` : ""}
        <p class="muted">這是本份練習卷的答對率，不是 TOEIC 分數。</p>
      </div>
      <div class="card"><h2>📊 各 Part 正確率</h2>${bars}</div>
      <div class="card"><h2>🎯 弱項優先加強</h2>
        ${weak.map((w, i) => `<div class="item-row"><div>${i + 1}. <b>${w.p}</b> <span class="muted">正確率 ${Math.round(w.acc * 100)}%</span></div><button class="btn small" data-weak="${partTab[w.p]}">去練習</button></div>`).join("")}
      </div>
      <div class="card"><h2>❌ 答錯 ${r.wrongs.length - (r.rBlank || 0)} 題（已加入錯題本）${r.rBlank ? `・未作答 ${r.rBlank} 題` : ""}</h2>
        ${r.wrongs.length ? r.wrongs.map(w => `
          <details class="mock-wrong">
            <summary><span class="pill">${esc(w.part)}</span> ${esc(w.q.slice(0, 60))}${w.q.length > 60 ? "…" : ""}</summary>
            <div class="explain">你的答案：${w.chosen === null ? "未作答" : esc(w.chosen)}<br>正解：${esc(w.opts[w.ans])}<br>${esc(w.exp)}</div>
          </details>`).join("") : `<p class="muted">${graded ? "全對！🏆" : "沒有可計分的題目。"}</p>`}
      </div>
      <div style="text-align:center"><button class="btn" id="mock-back">返回模擬考首頁</button></div>`;
    if (graded && r.wrongs.length === 0) setTimeout(() => Anim.confetti(), 350);
    Mock.box().querySelectorAll("[data-weak]").forEach(b =>
      b.addEventListener("click", () => goTo(b.dataset.weak)));
    $("#mock-back").addEventListener("click", () => renderers.mock());
  },

  modeName(mode) {
    const f = formOf(mode);
    return f ? f.name : { full: "雙節模考（短版）", listen: "聽力節", read: "閱讀節" }[mode] || "模擬考";
  },

  // 有原始題數的紀錄才能換算答對率、畫進趨勢圖；更早的版本只存了換算分數，保留但不比較
  hasCounts(m) {
    return ["lR", "lT", "rR", "rT"].every(k => Number.isFinite(m[k])) && m.lT + m.rT > 0;
  },

  // 歷次答對率趨勢：縱軸固定 0–100%，聽力、閱讀各一條線，不依最高最低值放大差距
  trendSVG(list) {
    const w = 320, h = 150, left = 34, right = 10, top = 14, bottom = 24;
    const x = i => left + (list.length === 1 ? 0 : i * (w - left - right) / (list.length - 1));
    const y = v => top + (100 - v) * (h - top - bottom) / 100;
    const point = (i, a, b) => { const v = Math.round(a / b * 100); return [x(i), y(v), v]; };
    const series = [
      { name: "聽力", color: "var(--accent)", pts: list.map((m, i) => m.lT ? point(i, m.lR, m.lT) : null).filter(Boolean) },
      { name: "閱讀", color: "var(--good)", pts: list.map((m, i) => m.rT ? point(i, m.rR, m.rT) : null).filter(Boolean) }
    ];
    const grid = [0, 50, 100].map(v => `<line x1="${left}" y1="${y(v)}" x2="${w - right}" y2="${y(v)}" stroke="var(--border)"/>
      <text x="${left - 4}" y="${y(v) + 3}" text-anchor="end" font-size="10" fill="var(--muted)">${v}%</text>`).join("");
    const lines = series.map(sr => sr.pts.length ? `
      ${sr.pts.length > 1 ? `<polyline points="${sr.pts.map(p => `${p[0]},${p[1]}`).join(" ")}" fill="none" stroke="${sr.color}" stroke-width="2.5" stroke-linecap="round"/>` : ""}
      ${sr.pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${sr.color}"><title>${sr.name} ${p[2]}%</title></circle>`).join("")}` : "").join("");
    const legend = series.filter(sr => sr.pts.length).map(sr => `<span style="color:${sr.color}">● ${sr.name}</span>`).join("　");
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:440px" role="img"
        aria-label="最近 ${list.length} 次模擬考的聽力與閱讀答對率，縱軸固定為百分之零到一百">${grid}${lines}</svg>
      <p class="muted" style="font-size:.85rem">${legend}　（縱軸固定 0–100%）</p>`;
  },

  /* ---------- 模擬考首頁（選單＋歷史趨勢） ---------- */
  menu() {
    const mocks = S.mocks || [];
    const comparable = mocks.filter(Mock.hasCounts).slice(-12);
    const chart = comparable.length >= 2 ? Mock.trendSVG(comparable) : "";
    const pct = (a, b) => Math.round(a / b * 100);
    const resultText = m => {
      if (!Mock.hasCounts(m)) {
        const counted = ["lR", "lT", "rR", "rT"].every(k => Number.isFinite(m[k]));
        return `<span class="muted">${counted ? "沒有可計分的題目" : "舊版紀錄，無法比較"}</span>`;
      }
      const l = m.lT ? `聽力 ${pct(m.lR, m.lT)}%（${m.lR}/${m.lT}）` : "";
      const r = m.rT ? `閱讀 ${pct(m.rR, m.rT)}%（${m.rR}/${m.rT}）` : "";
      return [l, r].filter(Boolean).join(" · ");
    };
    Mock.box().innerHTML = `
      <div class="card">
        <h2>🚀 模擬考</h2>
        <p class="muted">短版練習卷，練習 TOEIC 的作答節奏：聽力節自動連播不可回放；閱讀節限時 22 分鐘，可旗標與跳題；作答中不顯示對錯，交卷後顯示聽力、閱讀與各 Part 的答對率，錯題自動進錯題本。題數少於正式考試的 200 題，不能換算 TOEIC 分數。</p>
      </div>
      ${strategyHTML()}
      <div class="hub-card" data-mock="full">
        <div class="hub-icon">📋</div>
        <div class="hub-text"><div class="hub-title">雙節模考（短版）</div><div class="hub-sub muted">聽力節（19 題）＋閱讀節（約 27 題）· 約 35 分鐘</div></div>
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
      ${!mocks.length ? `<p class="muted" style="text-align:center;margin-top:8px">完成第一次模擬考後，這裡會顯示成績報告與歷史趨勢。</p>` : ""}
      ${mocks.length ? `
      <div class="card">
        <h2>📈 歷次答對率</h2>
        ${chart}
        ${mocks.slice(-8).reverse().map(m => `
          <div class="item-row"><div><b>${esc(m.date)}</b> <span class="pill">${Mock.modeName(m.mode)}</span></div>
          <div>${resultText(m)}</div></div>`).join("")}
      </div>` : ""}`;
    const formCards = FORMS.map(f => {
      const last = mocks.filter(m => m.mode === f.id).slice(-1)[0];
      const lastText = last && Mock.hasCounts(last)
        ? ` · 上次答對 ${isListenForm(f) ? `${last.lR}/${last.lT}` : `${last.rR}/${last.rT}`}` : " · 尚未作答";
      return `<div class="hub-card" data-mock="${f.id}">
        <div class="hub-icon">${isListenForm(f) ? "🎧" : "📝"}</div>
        <div class="hub-text"><div class="hub-title">${esc(f.name)}</div><div class="hub-sub muted">${isListenForm(f)
          ? `Part 2 ×25＋Part 3 ×39＋Part 4 ×30，共 94 題 · 約 ${f.mins} 分鐘 · 照正式考試節奏連續播放（Part 1 待補）`
          : `Part 5 ×30＋Part 6 ×16＋Part 7 ×54，共 100 題 · 限時 ${f.secs / 60} 分鐘 · 題目和正式考試同樣配置`}${lastText}</div></div>
        <div class="hub-arrow">›</div>
      </div>`;
    }).join("");
    const prog = Mock.loadProgress();
    const resumeCard = prog ? `<div class="card" style="border-color:var(--warn)">
        <b>📝 ${esc(formOf(prog.mode).name)}作答中</b>
        <p class="muted">${Date.now() < prog.deadline
          ? `已答 ${prog.answers.filter(a => a !== null).length} / ${prog.answers.length} 題，剩約 ${Math.ceil((prog.deadline - Date.now()) / 60000)} 分鐘（時間在離開期間仍會繼續計算）。`
          : `時間已經到了，可以用已作答的 ${prog.answers.filter(a => a !== null).length} 題交卷。`}</p>
        <button class="btn small" id="mock-resume">${Date.now() < prog.deadline ? "繼續作答" : "交卷看成績"}</button>
        <button class="btn ghost small" id="mock-discard">放棄這次</button>
      </div>` : "";
    Mock.box().querySelector(".card").insertAdjacentHTML("afterend", resumeCard + formCards);
    if (prog) {
      document.getElementById("mock-resume").addEventListener("click", () => {
        Mock.start(prog.mode, prog);
        if (Mock.s && Date.now() >= prog.deadline) Mock.submit();
      });
      document.getElementById("mock-discard").addEventListener("click", () => {
        if (!confirm("放棄這次作答？已作答的內容不會記錄。")) return;
        Mock.clearProgress();
        Mock.menu();
      });
    }
    Mock.box().querySelectorAll("[data-mock]").forEach(el =>
      el.addEventListener("click", () => {
        const mode = el.dataset.mock;
        if (mode === "read" || (formOf(mode) && !isListenForm(formOf(mode)))) ask(mode); else withVoices(() => ask(mode));
      }));
    const ask = async mode => {
        const f = formOf(mode);
        const pending = f ? Mock.loadProgress() : null;
        const ok = await UI.confirm(
          isListenForm(f) ? `${f.name}共 94 題（Part 2–4），約 ${f.mins} 分鐘，照正式考試的節奏連續播放，不能暫停或重播。中途離開不會保存進度，請戴上耳機、找一段不會被打擾的時間一次做完。這份測驗的題目不會出現在一般練習中。`
          : f ? `${pending ? `你有一份「${formOf(pending.mode).name}」還沒做完，開始新的測驗會放棄那一份（已作答的內容不會記錄）。\n\n` : ""}${f.name}共 100 題，限時 ${f.secs / 60} 分鐘，和正式考試的閱讀部分相同；時間到自動交卷。建議找一段不會被打擾的時間一次做完。這份測驗的題目不會出現在一般練習中。`
            : mode === "read" ? "閱讀節限時 22 分鐘，時間到自動交卷。準備好就開始！" : "聽力節將自動連續播放、不可暫停或回放（仿真考試）。建議戴上耳機，準備好就開始！",
          { title: isListenForm(f) ? "開始完整聽力測驗" : f ? "開始完整閱讀測驗" : "開始模擬考", okText: "開始" });
        if (ok) Mock.start(mode);
    };
  }
};
