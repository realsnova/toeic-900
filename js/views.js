/* ============ 「練習」Hub：單字卡/聽力/Part5/6/7 的入口 ============ */
renderers.practice = function () {
  const d = daily();
  const due = dueCount();
  const mastered = Object.values(S.vocab).filter(c => c.i >= 21).length;
  const cards = [
    { id: "vocab", icon: "📖", title: "單字卡", detail: due ? `${due} 張待複習` : "今日已完成", sub: `已精通 ${mastered} / ${VOCAB.length}` },
    { id: "listen", icon: "🎧", title: "聽力", detail: `今日 P2 ${d.l2} 題・P3/4 ${d.l34} 組`, sub: "Part 2 應答 + Part 3/4 對話短講" },
    { id: "p5", icon: "📝", title: "Part 5 文法", detail: `今日已完成 ${d.p5} 題`, sub: `題庫共 ${PART5.length} 題` },
    { id: "p6", icon: "📄", title: "Part 6 段落填空", detail: `今日已完成 ${d.p6} 篇`, sub: `題庫共 ${PART6.length} 篇` },
    { id: "p7", icon: "📚", title: "Part 7 閱讀", detail: `今日已完成 ${d.p7} 篇`, sub: `題庫共 ${PART7.length} 組` }
  ];
  $("#tab-practice").innerHTML = `
    <div class="card"><h2>📋 練習</h2><p class="muted">選一項開始，各項進度會自動記錄。</p></div>
    ${cards.map(c => `
      <div class="hub-card" data-go="${c.id}">
        <div class="hub-icon">${c.icon}</div>
        <div class="hub-text">
          <div class="hub-title">${esc(c.title)}</div>
          <div class="hub-detail">${esc(c.detail)}</div>
          <div class="hub-sub muted">${esc(c.sub)}</div>
        </div>
        <div class="hub-arrow">›</div>
      </div>`).join("")}`;
  $("#tab-practice").querySelectorAll("[data-go]").forEach(el =>
    el.addEventListener("click", () => enterSub(el.dataset.go, "practice")));
};

/* ============ 「我的」Hub：統計/題庫備份/設定 的入口 ============ */
renderers.me = function () {
  const cards = [
    { id: "stats", icon: "📊", title: "統計", sub: "預估分數、學習熱圖、弱項分析" },
    { id: "bank", icon: "📦", title: "題庫 / 備份", sub: "擴增題庫、匯出備份、雲端同步" },
    { id: "settings", icon: "⚙️", title: "設定", sub: "主題、聽力語速與腔調、每日新字量" }
  ];
  $("#tab-me").innerHTML = `
    <div class="card"><h2>👤 我的</h2></div>
    ${cards.map(c => `
      <div class="hub-card" data-go="${c.id}">
        <div class="hub-icon">${c.icon}</div>
        <div class="hub-text">
          <div class="hub-title">${esc(c.title)}</div>
          <div class="hub-sub muted">${esc(c.sub)}</div>
        </div>
        <div class="hub-arrow">›</div>
      </div>`).join("")}`;
  $("#tab-me").querySelectorAll("[data-go]").forEach(el =>
    el.addEventListener("click", () => enterSub(el.dataset.go, "me")));
};

/* ============ 模擬考（第 3 批施工中，先放佔位頁） ============ */
renderers.mock = function () {
  $("#tab-mock").innerHTML = `
    <div class="card result-banner">
      <div style="font-size:3rem">🚧</div>
      <h2>完整模擬考即將推出</h2>
      <p class="muted">仿真限時聽力節＋閱讀節、答卷卡介面、成績報告與歷史趨勢，敬請期待。</p>
    </div>`;
};

/* ============ 設定 ============ */
renderers.settings = function () {
  Accents.scan();
  const avail = Accents.available();
  const cur = Settings.get("accent") || "auto";
  $("#tab-settings").innerHTML = `
    <div class="card">
      <h2>🎨 外觀</h2>
      <div class="item-row">
        <div>主題模式</div>
        <div style="display:flex;gap:6px">
          <button class="btn small ${Theme.mode === "auto" ? "" : "secondary"}" data-theme="auto">跟隨系統</button>
          <button class="btn small ${Theme.mode === "light" ? "" : "secondary"}" data-theme="light">☀️ 淺色</button>
          <button class="btn small ${Theme.mode === "dark" ? "" : "secondary"}" data-theme="dark">🌙 深色</button>
        </div>
      </div>
    </div>
    <div class="card">
      <h2>🎧 聽力</h2>
      <div class="item-row">
        <div>播放語速</div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="range" id="set-rate" min="0.7" max="1.1" step="0.02" value="${Settings.get("ttsRate")}">
          <span class="muted" id="set-rate-val">${Settings.get("ttsRate").toFixed(2)}x</span>
        </div>
      </div>
      ${avail.length <= 1 ? `
        <p class="muted" style="margin-top:10px">
          目前裝置只偵測到 ${avail.length ? Accents.label(avail[0]) : "0 種"} 英文語音，無法練習混合腔調。
          手機瀏覽器通常內建多種腔調；電腦（Windows）需另外安裝語言包，步驟見
          <a href="https://github.com/realsnova/toeic-900#windows-安裝英式澳式語音包" target="_blank" rel="noopener">README 說明</a>。
        </p>` : `
        <div class="item-row" style="margin-top:10px">
          <div>聽力腔調</div>
          <select id="set-accent" style="background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px 10px;font-family:inherit">
            <option value="auto" ${cur === "auto" ? "selected" : ""}>裝置預設</option>
            <option value="mixed" ${cur === "mixed" ? "selected" : ""}>🔀 混合腔調（仿真考試）</option>
            ${avail.map(a => `<option value="${a}" ${cur === a ? "selected" : ""}>${Accents.label(a)}</option>`).join("")}
          </select>
        </div>
        <p class="muted" style="margin-top:8px">混合腔調：每一題 Part 2、每一組 Part 3/4 會隨機從裝置可用腔調中挑一個播放，更接近正式考試混用美/英/澳等腔調的情況。作答後會顯示這次用的是哪個腔調。</p>`}
    </div>
    <div class="card">
      <h2>📅 每日新字量</h2>
      <div class="item-row">
        <div>基礎期/強化期預設 10 個，衝刺期自動減半</div>
        <input type="number" id="set-newperday" min="1" max="30" value="${Settings.get("newPerDay")}"
          style="width:64px;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit">
      </div>
    </div>`;
  $("#tab-settings").querySelectorAll("[data-theme]").forEach(b =>
    b.addEventListener("click", () => { Theme.set(b.dataset.theme); renderers.settings(); }));
  $("#set-rate").addEventListener("input", (e) => {
    const v = Number(e.target.value);
    Settings.set("ttsRate", v);
    $("#set-rate-val").textContent = v.toFixed(2) + "x";
  });
  const accentSel = $("#set-accent");
  if (accentSel) accentSel.addEventListener("change", (e) => {
    Settings.set("accent", e.target.value);
    UI.toast("聽力腔調已更新為：" + (e.target.value === "auto" ? "裝置預設" : e.target.value === "mixed" ? "混合腔調" : Accents.label(e.target.value)), "ok");
  });
  $("#set-newperday").addEventListener("change", (e) => {
    const v = Math.max(1, Math.min(30, Number(e.target.value) || 10));
    Settings.set("newPerDay", v);
    e.target.value = v;
    UI.toast("每日新字量已更新為 " + v + " 個", "ok");
  });
};
