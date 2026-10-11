/* ============ 「練習」Hub：單字卡/聽力/Part5/6/7 的入口 ============ */
renderers.practice = function () {
  const d = daily();
  const due = dueCount();
  const mastered = Object.values(S.vocab).filter(c => c.i >= 21).length;
  const cards = [
    { id: "vocab", icon: "📖", title: "單字卡", detail: due ? `${due} 張待複習` : "今日已完成", sub: `已精通 ${mastered} / ${VOCAB.length}` },
    { id: "listen", icon: "🎧", title: "聽力", detail: `今日 P2 ${d.l2} 題・P3/4 ${d.l34} 組`, sub: "Part 2 應答 + Part 3/4 對話短講" },
    { id: "p5", icon: "📝", title: "Part 5 文法", detail: `今日已完成 ${d.p5} 題`, sub: `題庫共 ${PART5.filter(q => !q.form).length} 題（另有完整測驗）` },
    { id: "p6", icon: "📄", title: "Part 6 段落填空", detail: `今日已完成 ${d.p6} 篇`, sub: `題庫共 ${PART6.filter(p => !p.form).length} 篇` },
    { id: "p7", icon: "📚", title: "Part 7 閱讀", detail: `今日已完成 ${d.p7} 篇`, sub: `題庫共 ${PART7.filter(p => !p.form).length} 組` }
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
    { id: "stats", icon: "📊", title: "統計", sub: "練習答對率、學習熱圖、弱項分析" },
    { id: "bank", icon: "📦", title: "題庫 / 備份", sub: "擴增題庫、匯出備份、雲端同步" },
    { id: "settings", icon: "⚙️", title: "設定", sub: "主題、聽力語速與腔調、每日單字量、AI 解析" }
  ];
  $("#tab-me").innerHTML = `
    <div class="card"><h2>👤 我的</h2>${S.targetScore ? `<p class="muted">目標分數 ${esc(S.targetScore)} 分</p>` : ""}</div>
    ${cards.map(c => `
      <div class="hub-card" data-go="${c.id}">
        <div class="hub-icon">${c.icon}</div>
        <div class="hub-text">
          <div class="hub-title">${esc(c.title)}</div>
          <div class="hub-sub muted">${esc(c.sub)}</div>
        </div>
        <div class="hub-arrow">›</div>
      </div>`).join("")}
    <div class="card">
      <h3>版本資訊 <span class="muted" style="font-weight:400">v${APP_VERSION}</span></h3>
      <div id="changelog-list">
        ${CHANGELOG.slice(0, 3).map(c => `<div class="changelog-entry"><span class="v">v${c.v}</span><span class="d">${c.d}</span><br>${esc(c.notes)}</div>`).join("")}
      </div>
      ${CHANGELOG.length > 3 ? `<button class="btn ghost small" id="changelog-more" style="margin-top:8px">顯示完整更新紀錄</button>` : ""}
    </div>`;
  $("#tab-me").querySelectorAll("[data-go]").forEach(el =>
    el.addEventListener("click", () => enterSub(el.dataset.go, "me")));
  const moreBtn = $("#changelog-more");
  if (moreBtn) moreBtn.addEventListener("click", () => {
    $("#changelog-list").innerHTML = CHANGELOG.map(c =>
      `<div class="changelog-entry"><span class="v">v${c.v}</span><span class="d">${c.d}</span><br>${esc(c.notes)}</div>`).join("");
    moreBtn.remove();
  });
};

/* ============ 模擬考 ============ */
renderers.mock = function () { Mock.menu(); };

/* ============ 設定 ============ */
/* 隱私權說明（v1.7，工作票 17）。內容改動時一併更新日期。 */
const PRIVACY_UPDATED = "2026-10-11";
function privacyHTML() {
  return `<div class="card" id="privacy">
    <h2>🔒 隱私與資料</h2>
    <details>
      <summary>這個 App 會存哪些資料、送到哪裡（${PRIVACY_UPDATED} 更新）</summary>
      <div class="muted" style="margin-top:8px;line-height:1.7">
        <p><b>存在你的裝置上</b>：學習紀錄（作答結果、錯題本、單字卡進度、模考成績）、自訂題庫、設定、題目回報與錯誤紀錄，都存在這台裝置的瀏覽器裡。沒有帳號，也不需要姓名、信箱或任何身分資料。</p>
        <p><b>雲端同步（自己決定要不要開）</b>：設定同步代碼後，學習紀錄和自訂題庫會存到 Firebase（Google 的資料庫服務），存放位置由同步代碼決定。資料沒有加密，Firebase 專案的管理者看得到內容；同步代碼就是讀寫的鑰匙，請不要分享。可以在「題庫/備份」頁刪除雲端資料。</p>
        <p><b>AI 錯題解析（自己決定要不要開）</b>：貼上你自己的 Anthropic API 金鑰後，按「AI 解析」時會把那一題的題目、選項、正解和你的答案送到 Anthropic。金鑰預設只在這次開啟期間有效，不會同步、不會放進備份檔。</p>
        <p><b>不做的事</b>：不使用廣告、追蹤、分析工具或 Cookie；不收集作答統計；不把資料提供給任何第三方。網站由 GitHub Pages 提供，音檔都是預先產生、放在同一個網站上。</p>
        <p><b>刪除</b>：「題庫/備份」頁可以刪除雲端資料；「統計」頁最下方可以清除所有學習紀錄；清除瀏覽器的網站資料也會刪掉這台裝置上的全部資料。刪除前建議先匯出備份。</p>
        <p><b>著作權與商標</b>：題目為原創，語音由 Kokoro（Apache-2.0 授權）產生。TOEIC is a registered trademark of ETS. This product is not endorsed or approved by ETS.</p>
      </div>
    </details>
  </div>`;
}
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
      <h2>📅 每日單字量</h2>
      <div class="item-row">
        <div>新單字：基礎期/強化期預設 10 個，衝刺期自動減半</div>
        <input type="number" id="set-newperday" min="1" max="30" value="${Settings.get("newPerDay")}"
          style="width:64px;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit">
      </div>
      <div class="item-row">
        <div>到期複習卡上限（預設 60 張）</div>
        <input type="number" id="set-revperday" min="10" max="500" value="${Settings.get("revPerDay")}"
          style="width:64px;background:var(--panel2);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:8px;font-family:inherit">
      </div>
      <p class="muted">請假幾天後到期卡會一次累積上百張，設上限才做得完。超出的部分會自動留到明天，不會遺失。</p>
    </div>
    <div class="card">
      <h2>🚩 題目回報</h2>
      <div class="item-row">
        <div>你回報的題目：<b>${loadReports().length}</b> 題 · AI 認為可能有問題：<b>${typeof AI !== "undefined" ? AI.flags().length : 0}</b> 題</div>
        <div style="display:flex;gap:6px">
          <button class="btn small secondary" id="report-export">匯出</button>
          <button class="btn small ghost" id="report-clear">清除我的回報</button>
        </div>
      </div>
      <p class="muted">練習時按「🚩 這題有問題」會記在這台裝置。匯出的檔案交給我（Claude），下一次更新時會逐題確認並修正。</p>
    </div>
    ${aiSettingsHTML()}
    <div class="card">
      <h2>🧯 錯誤紀錄</h2>
      <div class="item-row">
        <div>這台裝置記下的程式錯誤：<b>${ErrLog.list().length}</b> 筆</div>
        <div style="display:flex;gap:6px">
          <button class="btn small secondary" id="errlog-export">匯出</button>
          <button class="btn small ghost" id="errlog-clear">清除</button>
        </div>
      </div>
      <p class="muted">只記錯誤訊息、版本和時間，不含作答內容；只存在這台裝置，不會自動送出。遇到問題時可以匯出給我（Claude）查原因。</p>
      ${localStorage.getItem(PRE_ID_BACKUP_KEY) ? `<div class="item-row"><div>v1.7 升級前的原始紀錄（自動保存）</div><button class="btn small ghost" id="preid-download">下載</button></div>` : ""}
    </div>
    ${privacyHTML()}`;
  wireAISettings($("#tab-settings"), renderers.settings);
  $("#report-export").addEventListener("click", exportReports);
  $("#errlog-export").addEventListener("click", () => ErrLog.download());
  $("#errlog-clear").addEventListener("click", () => { if (confirm("清除錯誤紀錄？")) { ErrLog.clear(); renderers.settings(); } });
  const pre = $("#preid-download");
  if (pre && pre.addEventListener) pre.addEventListener("click", downloadPreIdBackup);
  $("#report-clear").addEventListener("click", () => {
    if (!confirm("清除你回報的題目清單？建議先匯出。")) return;
    localStorage.removeItem(REPORT_KEY);
    renderers.settings();
  });
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
  $("#set-revperday").addEventListener("change", (e) => {
    const v = Math.max(10, Math.min(500, Number(e.target.value) || 60));
    Settings.set("revPerDay", v);
    e.target.value = v;
    UI.toast("每日複習上限已更新為 " + v + " 張", "ok");
    updateNavBadges(); // 徽章的到期數會套用上限，改完要立刻反映
  });
};

/* ============ 考前作答策略（S3）============
   放在模擬考頁，可展開。內容是一般性的應考技巧，不涉及任何官方題目。 */
function strategyHTML() {
  return `
    <details class="card strategy">
      <summary><b>📘 考前作答策略：時間分配與技巧</b></summary>
      <h3>聽力（約 45 分鐘，自動播放、不能回頭）</h3>
      <ul>
        <li><b>利用說明時間</b>：Part 1、2、3、4 開頭的說明播放時，先讀接下來 Part 3 或 Part 4 的題目和選項。</li>
        <li><b>Part 2</b>：只聽第一個字就能判斷題型（Who／When／Where／Why…）。間接回答常是正解；同音字、重複題目字詞的選項常是陷阱。</li>
        <li><b>Part 3／4</b>：題目通常照對話順序出。邊聽邊作答，一組答完立刻去看下一組的題目，不要回頭想上一題。</li>
        <li><b>圖表題</b>（Look at the graphic）：先看圖表，再對照選項找出要聽的關鍵資訊，例如樓層、時間、價格。</li>
        <li><b>聽不懂就猜一個</b>，馬上準備下一題。卡住一題，常會連帶錯過後面兩三題。</li>
      </ul>
      <h3>閱讀（75 分鐘，100 題）</h3>
      <ul>
        <li><b>時間分配</b>：Part 5 約 10 分鐘（每題 20 秒內）、Part 6 約 8 分鐘，留 55 分鐘以上給 Part 7。</li>
        <li><b>檢查時間點</b>：開始閱讀後約 18 分鐘應該進入 Part 7；剩 15 分鐘時，若還有多篇題組沒做，先挑題目短、能直接找答案的題目。</li>
        <li><b>Part 5</b>：先看選項。四個選項同字根是詞性題，看空格前後就能判斷，不用讀完整句。</li>
        <li><b>Part 7</b>：先讀題目再找答案。NOT 題、推論題、跨篇題比較花時間，可以留到同一組的最後。插入句子位置題，要找句子裡的代名詞或連接詞（they、this、however），對照前一句。</li>
        <li><b>不會的題目先猜一個答案</b>，做個記號再往下。答錯不倒扣，絕對不要留白。</li>
      </ul>
      <h3>考前幾天與當天</h3>
      <ul>
        <li>最後三天不學新東西，只複習錯題本和到期單字，每天做一點聽力和閱讀保持手感。</li>
        <li>依照考試通知確認要攜帶的證件與文具、可以帶進考場的物品、考場地點和交通時間。</li>
        <li>前一晚睡飽，提早到考場。</li>
        <li>在本工具裡，「完整閱讀測驗」可以練習 75 分鐘的時間分配；考前一週內至少做一次。</li>
      </ul>
    </details>`;
}
