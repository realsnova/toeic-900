# v1.5.0：mock.js 加入完整聽力測驗（L1）模式
from pathlib import Path
p = Path(__file__).resolve().parents[3] / "js" / "mock.js"
s = p.read_text(encoding="utf-8")
R = [
("""      set.qs.forEach((q, qi) => paper.reading.push({ type: "p7", part: "Part 7", si, qi, set, q, order: optionOrder(q.opts) }));
    });
    return paper;
  },""",
"""      set.qs.forEach((q, qi) => paper.reading.push({ type: "p7", part: "Part 7", si, qi, set, q, order: optionOrder(q.opts) }));
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
  },"""),
("""    if (mode === "read" || formOf(mode)) Mock.startReading();
    else Mock.readyListening();""",
"""    if (mode === "read" || (formOf(mode) && !isListenForm(formOf(mode)))) Mock.startReading();
    else Mock.readyListening();"""),
("""        <p class="muted">共 ${s.paper.listening.length} 題，語音會自動連續播放、不可暫停或回放。</p>
        ${ttsNoteHTML()}""",
"""        <p class="muted">共 ${s.paper.listening.length} 題，語音會自動連續播放、不可暫停或回放。${isListenForm(formOf(s.mode)) ? "題號照正式考試從 7 開始（Part 1 待補）。對話播放時可以先看這一組的三個題目。中途離開不會保存進度。" : ""}</p>
        ${ttsNoteHTML()}"""),
("""      const onSilent = () => showSilentHelp(null);
      hideSilentHelp(); // 上一題的提示不可留到這一題
      if (it.type === "l34" && it.audioLead) {
        Mock.renderListenItem(i, true);
        const { played, aborted } = await TTS.seq(l34Audio(it.set), { onSilent });""",
"""      const onSilent = () => showSilentHelp(null);
      const seqOpts = { onSilent, clipRate: 1 }; // 模擬考的音檔一律原速
      hideSilentHelp(); // 上一題的提示不可留到這一題
      if (it.pre && it.pre.length) {
        Mock.renderListenItem(i, true);
        await TTS.seq(it.pre, { clipRate: 1 }); // 旁白沒播出來不影響作答，不提示也不扣題
        if (Mock.s !== s || s.cancelled) return;
      }
      if (it.type === "l34" && it.audioLead) {
        Mock.renderListenItem(i, true);
        const { played, aborted } = await TTS.seq(l34Audio(it.set), seqOpts);"""),
("""        const { played, aborted } = await TTS.seq(l2Audio(it.ref, it.order), { onSilent });
        if (Mock.s !== s || s.cancelled) return;
        if (!played && !aborted) s.audioFail.add(i);
      }""",
"""        const { played, aborted } = await TTS.seq(l2Audio(it.ref, it.order), seqOpts);
        if (Mock.s !== s || s.cancelled) return;
        if (!played && !aborted) s.audioFail.add(i);
      } else if (it.ask) {
        await TTS.seq([it.ask], { clipRate: 1 }); // 念題目（題目也顯示在畫面上，沒念出來不影響作答）
        if (Mock.s !== s || s.cancelled) return;
      }"""),
("""    if (s.mode === "full") Mock.startReading();
    else Mock.submit();
  },""",
"""    if (s.mode === "full") Mock.startReading();
    else Mock.submit();
  },

  // 對話播放時先讓考生看這一組的題目（正式考試的題本上印有題目與選項）
  previewHTML(it) {
    if (!it.set || it.type !== "l34") return "";
    const items = Mock.s.paper.listening.filter(x => x.set === it.set);
    return `<div class="mock-preview">${items.map(x => `
      <div class="q-text">${x.num ? `${x.num}. ` : ""}${esc(x.q.q)}</div>
      <ol class="muted" type="A">${x.order.map(oi => `<li>${esc(x.q.opts[oi])}</li>`).join("")}</ol>`).join("")}</div>`;
  },"""),
("""      body = `<div class="mock-audio"><div class="wave">🔊</div><p class="muted">正在播放 ${esc(it.part)} 音檔（不可暫停／回放）</p></div>${graphicHTML(it.set)}`;""",
"""      body = `<div class="mock-audio"><div class="wave">🔊</div><p class="muted">正在播放 ${esc(it.part)} 音檔（不可暫停／回放）</p></div>${graphicHTML(it.set)}${Mock.previewHTML(it)}`;"""),
("""        <div class="q-text">${esc(it.q.q)}</div>""",
"""        <div class="q-text">${it.num ? `${it.num}. ` : ""}${esc(it.q.q)}</div>"""),
("""          <span class="muted">第 ${i + 1} / ${total} 題 · 已答 ${answered}</span>
        </div>
        ${body}
        ${ttsNoteHTML()}""",
"""          <span class="muted">${it.num ? `第 ${it.num} 題（${i + 1} / ${total}）` : `第 ${i + 1} / ${total} 題`} · 已答 ${answered}</span>
        </div>
        ${body}
        ${ttsNoteHTML(it.type === "l2" ? l2Audio(it.ref, it.order) : l34Audio(it.set))}"""),
("""    const hasL = r.mode === "full" || r.mode === "listen", hasR = r.mode !== "listen";""",
"""    const lf = isListenForm(formOf(r.mode));
    const hasL = r.mode === "full" || r.mode === "listen" || lf, hasR = r.mode !== "listen" && !lf;"""),
("""      return `<div class="hub-card" data-mock="${f.id}">
        <div class="hub-icon">📝</div>
        <div class="hub-text"><div class="hub-title">${esc(f.name)}</div><div class="hub-sub muted">Part 5 ×30＋Part 6 ×16＋Part 7 ×54，共 100 題 · 限時 ${f.secs / 60} 分鐘 · 題目和正式考試同樣配置${last && Mock.hasCounts(last) ? ` · 上次答對 ${last.rR}/${last.rT}` : " · 尚未作答"}</div></div>""",
"""      const lastText = last && Mock.hasCounts(last)
        ? ` · 上次答對 ${isListenForm(f) ? `${last.lR}/${last.lT}` : `${last.rR}/${last.rT}`}` : " · 尚未作答";
      return `<div class="hub-card" data-mock="${f.id}">
        <div class="hub-icon">${isListenForm(f) ? "🎧" : "📝"}</div>
        <div class="hub-text"><div class="hub-title">${esc(f.name)}</div><div class="hub-sub muted">${isListenForm(f)
          ? `Part 2 ×25＋Part 3 ×39＋Part 4 ×30，共 94 題 · 約 ${f.mins} 分鐘 · 照正式考試節奏連續播放（Part 1 待補）`
          : `Part 5 ×30＋Part 6 ×16＋Part 7 ×54，共 100 題 · 限時 ${f.secs / 60} 分鐘 · 題目和正式考試同樣配置`}${lastText}</div></div>"""),
("""        if (mode === "read" || formOf(mode)) ask(mode); else withVoices(() => ask(mode));""",
"""        if (mode === "read" || (formOf(mode) && !isListenForm(formOf(mode)))) ask(mode); else withVoices(() => ask(mode));"""),
("""          f ? `${pending ?""",
"""          isListenForm(f) ? `${f.name}共 94 題（Part 2–4），約 ${f.mins} 分鐘，照正式考試的節奏連續播放，不能暫停或重播。中途離開不會保存進度，請戴上耳機、找一段不會被打擾的時間一次做完。這份測驗的題目不會出現在一般練習中。`
          : f ? `${pending ?"""),
("""          { title: f ? "開始完整閱讀測驗" : "開始模擬考", okText: "開始" });""",
"""          { title: isListenForm(f) ? "開始完整聽力測驗" : f ? "開始完整閱讀測驗" : "開始模擬考", okText: "開始" });"""),
]
for a, b in R:
    assert s.count(a) == 1, (a[:70], s.count(a))
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")
print("ok")
