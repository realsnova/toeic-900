// 內容檢查工具：格式、重複與近似重複、正解長度偏差、圖表寬度、技能標籤、聽力腳本可唸性。
// 只用 Node 內建模組，不需要安裝任何套件（D-2）。
//
// 用法（在 repo 根目錄）：
//   node tools/content/lint.mjs                  檢查 js/data/ 裡的全部內建題
//   node tools/content/lint.mjs batch.json       檢查一批新題（和內建題比對重複），新題必須有 sk
// batch.json 的格式：{ p5:[], p6:[], p7:[], l2:[], l34:[], vocab:[] }，每一項和 js/data/ 裡的格式相同。
// 有錯誤時結束碼為 1；警告不影響結束碼。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

export const SKILLS = {
  p5: ["g-pos", "g-tense", "g-agree", "g-part", "g-inf", "g-prep", "g-conj", "g-rel", "g-pron", "g-comp", "g-mood", "v-word", "v-coll"],
  p6: ["p6-grammar", "p6-vocab", "p6-trans", "p6-insert"],
  p7: ["r-main", "r-detail", "r-infer", "r-syn", "r-intent", "r-insert", "r-not", "r-multi"],
  l2: ["l2-wh", "l2-yn", "l2-choice", "l2-req", "l2-stmt"],
  l34: ["l-main", "l-detail", "l-infer", "l-intent", "l-graphic", "l-next"]
};
export const P5_CATS = ["詞性", "介係詞", "動詞時態", "代名詞", "分詞", "關係詞", "連接詞", "比較級", "詞彙", "不定詞與動名詞", "主詞動詞一致", "假設語氣與倒裝"];
const GRAPHIC_W = 34;

export function loadBuiltin() {
  const ctx = {};
  vm.createContext(ctx);
  for (const f of ["vocab", "part5", "part6", "part7", "listening"])
    vm.runInContext(fs.readFileSync(path.join(ROOT, "js", "data", f + ".js"), "utf8"), ctx, { filename: f + ".js" });
  return vm.runInContext("({ vocab: VOCAB, p5: PART5, p6: PART6, p7: PART7, l2: PART2, l34: PART34 })", ctx);
}

// ---- 近似重複：小寫、去標點後的詞集合 Jaccard ----
const words = s => new Set(String(s).toLowerCase().replace(/_+/g, " ").replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(w => w.length > 2));
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n / (a.size + b.size - n);
}
const sig = {
  p5: it => it.q,
  p6: it => it.text,
  p7: it => it.passages.join(" "),
  l2: it => it.q,
  l34: it => it.turns.map(t => t.t).join(" ")
};
const NEAR = { p5: 0.7, p6: 0.5, p7: 0.5, l2: 0.75, l34: 0.5 };

function questionsOf(type, it) {
  if (type === "p5" || type === "l2") return [it];
  if (type === "p6") return it.blanks;
  return it.qs;
}

export function lint(batch, builtin, { requireSkill = true } = {}) {
  const errors = [], warns = [], stats = {};
  const err = (where, msg) => errors.push(`${where}：${msg}`);
  const warn = (where, msg) => warns.push(`${where}：${msg}`);

  for (const type of ["p5", "p6", "p7", "l2", "l34"]) {
    const items = batch[type] || [];
    const nOpts = type === "l2" ? 3 : 4;
    let longest = 0, shortest = 0, counted = 0;
    const skillCount = {};
    items.forEach((it, i) => {
      const where = `${type}#${i + 1}${it.title ? `「${it.title}」` : ""}`;
      // 結構
      if (type === "p5") {
        if (typeof it.q !== "string" || (it.q.match(/_{6}/g) || []).length !== 1) err(where, "題目要剛好一個 ______");
        if (!P5_CATS.includes(it.cat)) err(where, `cat「${it.cat}」不在允許清單`);
      }
      if (type === "p6") {
        if (!Array.isArray(it.blanks) || it.blanks.length !== 4) err(where, "要剛好 4 個空格");
        for (let k = 1; k <= 4; k++) if ((String(it.text).split(`___[${k}]___`).length - 1) !== 1) err(where, `___[${k}]___ 要出現剛好一次`);
        if (!(it.blanks || []).some(b => b.sk === "p6-insert") && requireSkill) warn(where, "沒有句子插入題");
      }
      if (type === "p7") {
        if (!Array.isArray(it.passages) || !it.passages.length) err(where, "沒有文章");
        if (typeof it.time !== "number") err(where, "沒有 time");
        const ins = it.qs.filter(q => q.opts && String(q.opts[0]).startsWith("["));
        ins.forEach(() => { for (let k = 1; k <= 4; k++) if (!it.passages.join("\n").includes(`[${k}]`)) err(where, `插入句題缺少文章標記 [${k}]`); });
      }
      if (type === "l34") {
        if (!["Part 3", "Part 4"].includes(it.type)) err(where, "type 要是 Part 3 或 Part 4");
        if (!["us", "uk"].includes(it.acc) && requireSkill) err(where, "acc 要是 us 或 uk");
        if (!Array.isArray(it.turns) || !it.turns.length) err(where, "沒有對話");
        (it.turns || []).forEach(t => { if (!["M", "W", "M2", "W2", "N"].includes(t.s)) err(where, `說話者標記「${t.s}」不合法`); });
        if (it.type === "Part 4" && new Set(it.turns.map(t => t.s)).size !== 1) err(where, "Part 4 只能有一個說話者");
        if (it.graphic) it.graphic.split("\n").forEach(line => { if ([...line].length > GRAPHIC_W) err(where, `圖表行超過 ${GRAPHIC_W} 字元：「${line}」`); });
        if (it.qs.some(q => /graphic/i.test(q.q)) && !it.graphic) err(where, "有圖表題但沒有圖表");
      }
      // 聽力腳本要好唸
      const spoken = type === "l2" ? [it.q, ...it.opts] : type === "l34" ? it.turns.map(t => t.t) : [];
      spoken.forEach(s => { if (/[$%&]|\d:\d\d/.test(s)) warn(where, `腳本有不好唸的符號：「${s.slice(0, 60)}」`); });
      // 每一題
      questionsOf(type, it).forEach((q, qi) => {
        const qw = type === "p5" || type === "l2" ? where : `${where} 第 ${qi + 1} 題`;
        if (!Array.isArray(q.opts) || q.opts.length !== nOpts) { err(qw, `要有 ${nOpts} 個選項`); return; }
        if (q.ans !== 0) err(qw, "ans 要是 0（正解放第一個）");
        if (new Set(q.opts.map(o => String(o).trim().toLowerCase())).size !== q.opts.length) err(qw, "選項重複");
        if (typeof q.exp !== "string" || q.exp.length < 15) err(qw, "詳解太短或缺少");
        else if (/(選項|答案)\s*[A-D1-4](?![a-z])|\([A-D]\)/.test(q.exp)) err(qw, "詳解提到選項代號（選項會洗牌）");
        else if (/第[一二三四]個選項/.test(q.exp)) warn(qw, "詳解可能提到選項位置（選項會洗牌）");
        if (requireSkill || q.sk !== undefined) {
          if (!SKILLS[type].includes(q.sk)) err(qw, `sk「${q.sk}」不是 ${type} 的技能`);
          else skillCount[q.sk] = (skillCount[q.sk] || 0) + 1;
        }
        if (type === "p7" && String(q.opts[0]).startsWith("[")) return; // 位置題不算長度
        if (type === "p5" && q.sk && q.sk.startsWith("g-")) return; // 詞形變化題不算長度
        const lens = q.opts.map(o => String(o).length);
        counted++;
        if (lens[0] === Math.max(...lens) && lens.filter(l => l === lens[0]).length === 1) longest++;
        if (lens[0] === Math.min(...lens) && lens.filter(l => l === lens[0]).length === 1) shortest++;
      });
    });
    if (counted >= 10) {
      const lr = longest / counted, sr = shortest / counted;
      if (lr > 0.45) err(type, `正解是最長選項的比例 ${(lr * 100).toFixed(0)}%（上限 45%）`);
      if (sr > 0.45) err(type, `正解是最短選項的比例 ${(sr * 100).toFixed(0)}%（上限 45%）`);
      if (lr < 0.15) warn(type, `正解幾乎不是最長選項（${(lr * 100).toFixed(0)}%），可能反向偏差`);
    }
    stats[type] = { items: items.length, questions: items.reduce((s, it) => s + questionsOf(type, it).length, 0), longest, shortest, counted, skills: skillCount };

    // 重複：和內建題比、批次內互比
    const pool = (builtin && builtin[type] || []).map((it, k) => ({ where: `內建 ${type}[${k}]${it.title ? `「${it.title}」` : ""}`, w: words(sig[type](it)), raw: sig[type](it) }));
    // Part 5／Part 2：答案相同而且題幹相似度 ≥ 0.25（4 個字母以上的字）視為重複（和 tests/v1.4.1-s2 S3-quality 相同的標準）
    const w4 = s => new Set((String(s).toLowerCase().replace(/_+/g, " ").match(/[a-z]+/g) || []).filter(x => x.length > 3));
    if (type === "p5" || type === "l2") {
      const prev = (builtin && builtin[type] || []).map((it, k) => ({ where: `內建 ${type}[${k}]`, w: w4(it.q), a: String(it.opts[it.ans]).toLowerCase() }));
      items.forEach((it, i) => {
        const me = { where: `本批 ${type}#${i + 1}`, w: w4(it.q), a: String(it.opts[it.ans]).toLowerCase() };
        for (const p of prev) if (p.a === me.a && jaccard(p.w, me.w) >= 0.25) { err(`${type}#${i + 1}`, `和${p.where}答案相同、題幹相似 ${jaccard(p.w, me.w).toFixed(2)}`); break; }
        prev.push(me);
      });
    }
    items.forEach((it, i) => {
      const s = sig[type](it), w = words(s);
      for (const p of pool) {
        if (p.raw === s) { err(`${type}#${i + 1}`, `和${p.where}完全相同`); break; }
        const j = jaccard(w, p.w);
        if (j >= NEAR[type]) { warn(`${type}#${i + 1}`, `和${p.where}相似度 ${j.toFixed(2)}`); break; }
      }
      pool.push({ where: `本批 ${type}#${i + 1}`, w, raw: s });
    });
  }

  // 單字
  const vocab = batch.vocab || [];
  if (vocab.length) {
    const have = new Map((builtin && builtin.vocab || []).map((v, k) => [v.w.toLowerCase(), `內建單字[${k}]`]));
    vocab.forEach((v, i) => {
      const where = `vocab#${i + 1}「${v.w}」`;
      for (const f of ["w", "pos", "zh", "ex", "exZh"]) if (typeof v[f] !== "string" || !v[f].trim()) err(where, `缺少 ${f}`);
      if (!/^(n|v|adj|adv|phr|prep|conj)\.(\s?\/\s?(n|v|adj|adv)\.)*$/.test(v.pos)) warn(where, `詞性「${v.pos}」格式少見`);
      const key = String(v.w).toLowerCase();
      if (have.has(key)) err(where, `和${have.get(key)}重複`);
      have.set(key, `本批 vocab#${i + 1}`);
      const stem = key.split(" ")[0].replace(/(e|y|ing|ed|s)$/, "").slice(0, Math.max(4, key.length - 3));
      if (!String(v.ex).toLowerCase().includes(stem.slice(0, 4))) warn(where, "例句裡好像沒有出現這個字");
    });
    stats.vocab = { items: vocab.length };
  }
  return { errors, warns, stats };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/").replace(/^\//, "")}`) {
  const builtin = loadBuiltin();
  let batch, opts;
  if (process.argv[2]) {
    batch = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
    opts = { requireSkill: true };
  } else {
    batch = builtin;
    opts = { requireSkill: false };
  }
  const { errors, warns, stats } = lint(batch, process.argv[2] ? builtin : null, opts);
  for (const [t, s] of Object.entries(stats)) console.log(t, JSON.stringify(s));
  if (warns.length) console.log(`\n警告 ${warns.length}：\n  ` + warns.join("\n  "));
  if (errors.length) console.log(`\n錯誤 ${errors.length}：\n  ` + errors.join("\n  "));
  else console.log("\n沒有錯誤");
  process.exit(errors.length ? 1 : 0);
}
