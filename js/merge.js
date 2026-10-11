/* ============ 多裝置合併（v1.7，工作票 17）============
   以前同步是「整份覆蓋、較新的勝出」：兩台裝置在同步之間都有作答時，其中一台的作答會整批消失。
   現在改成三方合併：base＝上次同步成功時雙方一致的那一份，local＝這台裝置，remote＝雲端。
   - 一般欄位：只有一邊改過就用那一邊；兩邊都改過才用各欄位的規則決定（resolve）。
     刪除也算「改過」，所以一台裝置清掉的錯題，另一台不會又把它帶回來。
   - 計數（答對／答錯、每日題數）：remote＋(local－base)，兩邊各自的作答都算進去，不會重複計算。
   - 沒有 base（第一次同步、或換了同步代碼）：無法知道誰改過，改用保守的兩方規則：
     聯集、計數取較大值、錯題保留。
   全部是純函式，不碰 S、localStorage 或網路。 */
const Merge = (() => {
  const isObj = v => !!v && typeof v === "object" && !Array.isArray(v);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const obj = v => (v && typeof v === "object" ? v : {});

  // 一個「鍵 → 值」的物件做三方合併。base 為 null 時做兩方合併（兩邊都有就交給 resolve）。
  function map3(b, l, r, resolve) {
    l = obj(l); r = obj(r);
    const out = {};
    const keys = new Set([...Object.keys(l), ...Object.keys(r), ...(b ? Object.keys(obj(b)) : [])]);
    keys.forEach(k => {
      const lv = l[k], rv = r[k];
      let v;
      if (!b) v = lv === undefined ? rv : rv === undefined ? lv : same(lv, rv) ? lv : resolve(lv, rv, k);
      else {
        const bv = obj(b)[k];
        const lc = !same(lv, bv), rc = !same(rv, bv);
        if (!lc) v = rv;
        else if (!rc || same(lv, rv)) v = lv;
        else v = resolve(lv, rv, k);
      }
      if (v !== undefined && v !== null) out[k] = v;
    });
    return out;
  }
  // 計數：remote＋(local－base)；沒有 base 取較大值
  function count3(b, l, r) {
    const n = v => (Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : 0);
    if (b === null || b === undefined) return Math.max(n(l), n(r));
    return Math.max(0, n(r) + n(l) - n(b));
  }
  // 每個欄位都是計數的物件（{r, w}、每日的各題型題數）
  function counts3(b, l, r) {
    const out = {};
    const keys = new Set([...Object.keys(obj(l)), ...Object.keys(obj(r))]);
    keys.forEach(k => { out[k] = count3(b ? obj(b)[k] : null, obj(l)[k], obj(r)[k]); });
    return out;
  }
  // 「鍵 → 計數物件」：類別統計、每日紀錄
  function countMap3(b, l, r) {
    const out = {};
    const keys = new Set([...Object.keys(obj(l)), ...Object.keys(obj(r))]);
    keys.forEach(k => { out[k] = counts3(b ? obj(obj(b)[k]) : null, obj(l)[k], obj(r)[k]); });
    return out;
  }

  // ---- 各欄位兩邊都改過時的規則 ----
  const dateKey = e => [e && e.last, e && e.w].filter(Boolean).sort().pop() || "";
  // 錯題本：最近一次作答較晚的那一筆；一邊已經移除（掌握）而另一邊又有作答，保留題目（寧可多複習一次）
  function wbEntry(lv, rv) {
    if (lv === undefined || rv === undefined) return lv === undefined ? rv : lv;
    const dl = dateKey(lv), dr = dateKey(rv);
    if (dl !== dr) return dl > dr ? lv : rv;
    return (lv.n || 0) <= (rv.n || 0) ? lv : rv; // 同一天：連對次數較少的（保守）
  }
  // 單字卡：複習次數多的較新；一樣多就看下次複習日
  function card(lv, rv) {
    if (lv === undefined || rv === undefined) return lv === undefined ? rv : lv;
    if ((lv.n || 0) !== (rv.n || 0)) return (lv.n || 0) > (rv.n || 0) ? lv : rv;
    return String(lv.due || "") >= String(rv.due || "") ? lv : rv;
  }
  const max = (lv, rv) => Math.max(Number(lv) || 0, Number(rv) || 0);
  const yes = () => true;
  const keepLocal = (lv, rv) => (lv === undefined ? rv : lv);

  // 陣列（模考紀錄、外部成績）：用內容當鍵做集合合併，再依日期排序
  function list3(b, l, r, sig) {
    const toMap = a => { const m = {}; (Array.isArray(a) ? a : []).forEach(x => { if (x && typeof x === "object") m[sig(x)] = x; }); return m; };
    const m = map3(b ? toMap(b) : null, toMap(l), toMap(r), keepLocal);
    return Object.values(m).sort((x, y) => String(x.date || "").localeCompare(String(y.date || "")));
  }
  const mockSig = m => [m.date, m.mode || "", m.secs || 0, m.lR || 0, m.lT || 0, m.rR || 0, m.rT || 0, m.L || 0, m.R || 0].join("|");
  const extSig = e => [e.date, e.src, e.L, e.R].join("|");

  // 單一值的欄位（考試日期、目標分數…）：只有一邊改過就用那一邊；都改過用較新的那一份
  function scalar3(b, l, r, k, localNewer) {
    const lv = l[k], rv = r[k];
    if (!b) return localNewer ? (lv !== undefined ? lv : rv) : (rv !== undefined ? rv : lv);
    const bv = b[k];
    if (same(lv, bv)) return rv;
    if (same(rv, bv)) return lv;
    return localNewer ? lv : rv;
  }

  // 學習紀錄（S）的合併。三份都必須已經通過 sanitizeState。
  function records(base, local, remote) {
    const b = isObj(base) ? base : null, l = obj(local), r = obj(remote);
    const localNewer = (l.updatedAt || 0) >= (r.updatedAt || 0);
    const out = Object.assign({}, r, l); // 不認得的欄位：以本機為準
    ["exam", "targetScore", "lastBackup"].forEach(k => {
      const v = scalar3(b, l, r, k, localNewer);
      if (v === undefined) delete out[k]; else out[k] = v;
    });
    if (out.lastBackup === undefined && (l.lastBackup || r.lastBackup)) out.lastBackup = [l.lastBackup, r.lastBackup].filter(Boolean).sort().pop();
    out.onboarded = !!(l.onboarded || r.onboarded);
    out.updatedAt = Math.max(l.updatedAt || 0, r.updatedAt || 0);
    out.racc = counts3(b ? obj(b.racc) : null, l.racc, r.racc);
    out.cat = countMap3(b ? b.cat : null, l.cat, r.cat);
    out.lcat = countMap3(b ? b.lcat : null, l.lcat, r.lcat);
    out.daily = countMap3(b ? b.daily : null, l.daily, r.daily);
    out.vocab = map3(b ? b.vocab : null, l.vocab, r.vocab, card);
    // 技能掌握度：兩邊都改過時取作答次數多的那一份（能力值不是計數，不能相加）
    out.mastery = map3(b ? b.mastery || {} : null, l.mastery, r.mastery, (lv, rv) => (lv === undefined ? rv : rv === undefined ? lv : (lv.n || 0) >= (rv.n || 0) ? lv : rv));
    out.wb = {};
    new Set([...Object.keys(obj(l.wb)), ...Object.keys(obj(r.wb))]).forEach(t => {
      out.wb[t] = map3(b ? obj(b.wb)[t] || {} : null, obj(l.wb)[t], obj(r.wb)[t], wbEntry);
    });
    ["p6done", "p7done", "l34done"].forEach(k => { out[k] = map3(b ? b[k] || {} : null, l[k], r[k], max); });
    ["p5seen", "l2seen"].forEach(k => { out[k] = map3(b ? b[k] || {} : null, l[k], r[k], yes); });
    out.mockSeen = {};
    new Set([...Object.keys(obj(l.mockSeen)), ...Object.keys(obj(r.mockSeen))]).forEach(t => {
      out.mockSeen[t] = map3(b ? obj(b.mockSeen)[t] || {} : null, obj(l.mockSeen)[t], obj(r.mockSeen)[t], yes);
    });
    out.mocks = list3(b ? b.mocks : null, l.mocks, r.mocks, mockSig);
    out.ext = list3(b ? b.ext : null, l.ext, r.ext, extSig).slice(-50);
    out.tq = l.tq || r.tq; // 遷移練習佇列只是提示，以本機為準
    // 版本與轉換標記：兩邊都已經過 sanitizeState，以本機為準
    ["baseN", "contentV", "idV"].forEach(k => { if (l[k] !== undefined) out[k] = l[k]; });
    return out;
  }

  // 自訂題庫：每類是一個陣列，用 keyOf（題目文字）當鍵做三方合併，保留本機的順序、雲端新增的接在後面
  function bank(base, local, remote, keyOf) {
    const out = {};
    const types = new Set([...Object.keys(obj(local)), ...Object.keys(obj(remote))]);
    types.forEach(t => {
      const toMap = a => { const m = {}; (Array.isArray(a) ? a : []).forEach(it => { try { m[keyOf(t, it)] = it; } catch (e) { /* 壞資料略過 */ } }); return m; };
      const lm = toMap(obj(local)[t]), rm = toMap(obj(remote)[t]);
      const m = map3(base ? toMap(obj(base)[t]) : null, lm, rm, keepLocal);
      const order = [...Object.keys(lm), ...Object.keys(rm).filter(k => !(k in lm))];
      out[t] = order.filter(k => k in m).map(k => m[k]);
    });
    return out;
  }

  return { records, bank, map3, count3, same };
})();
