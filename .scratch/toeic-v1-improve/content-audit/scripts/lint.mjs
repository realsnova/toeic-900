// 題庫自動檢查：結構、重複、混入中文、解析引用字母、解析是否提到正解
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.argv[2];
const ctx = {};
vm.createContext(ctx);
for (const f of ["vocab", "part5", "part6", "part7", "listening"]) vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data", f + ".js"), "utf8"), ctx);
const { VOCAB, PART5, PART6, PART7, PART2, PART34 } = vm.runInContext("({ VOCAB, PART5, PART6, PART7, PART2, PART34 })", ctx);
const CJK = /[一-鿿]/;
const out = [];
const flag = (id, kind, msg) => out.push({ id, kind, msg });
const pad = (n, w = 3) => String(n).padStart(w, "0");

function checkMcq(id, q, nOpts, { stemEnglish = true } = {}) {
  if (!Array.isArray(q.opts) || q.opts.length !== nOpts) flag(id, "結構", `選項數 ${q.opts && q.opts.length}，應為 ${nOpts}`);
  if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans >= nOpts) flag(id, "結構", `答案索引 ${q.ans}`);
  const norm = q.opts.map(o => o.trim().toLowerCase());
  if (new Set(norm).size !== norm.length) flag(id, "重複選項", q.opts.join(" / "));
  q.opts.forEach(o => { if (CJK.test(o)) flag(id, "選項混入中文", o); });
  if (stemEnglish && q.q && CJK.test(q.q)) flag(id, "題幹混入中文", q.q);
  if (!q.exp || !CJK.test(q.exp)) flag(id, "解析", "缺少中文解析");
  if (/\(([A-D])\)|（[A-D]）|選\s*[A-D]\b|答案\s*[A-D]\b/.test(q.exp || "")) flag(id, "解析引用字母", q.exp);
  // 解析是否提到正解的文字（取正解的第一個英文單字片段比對）；沒提到不一定錯，列為人工注意
  const ansText = q.opts[q.ans] || "";
  const token = (ansText.match(/[A-Za-z][A-Za-z'-]{2,}/g) || [])[0];
  if (token && !(q.exp || "").toLowerCase().includes(token.toLowerCase())) flag(id, "解析未提正解（注意）", `正解「${ansText}」`);
  // 正解特別長（考生可靠長度猜題）
  const lens = q.opts.map(o => o.length);
  const others = lens.filter((_, i) => i !== q.ans);
  if (others.length && lens[q.ans] > 1.6 * Math.max(...others) && lens[q.ans] > 25) flag(id, "正解明顯最長（注意）", ansText);
}

PART5.forEach((q, i) => { checkMcq(`P5-${pad(i + 1)}`, q, 4); if ((q.q.match(/_{3,}/g) || []).length !== 1) flag(`P5-${pad(i + 1)}`, "結構", "空格數不是 1"); });
PART6.forEach((p, i) => {
  const id = `P6-${pad(i + 1, 2)}`;
  for (let k = 1; k <= 4; k++) if (!p.text.includes(`___[${k}]___`)) flag(id, "結構", `缺少空格標記 [${k}]`);
  if (p.blanks.length !== 4) flag(id, "結構", `空格數 ${p.blanks.length}`);
  p.blanks.forEach((b, j) => checkMcq(`${id}-${j + 1}`, { q: "", ...b }, 4));
  if (CJK.test(p.text)) flag(id, "文章混入中文", "");
  const sentenceInsert = p.blanks.some(b => b.opts.every(o => o.trim().split(/\s+/).length >= 5));
  if (!sentenceInsert) flag(id, "TOEIC 規格", "沒有句子插入題（正式 Part 6 每篇都有一題）");
});
PART7.forEach((s, i) => {
  const id = `P7-${pad(i + 1, 2)}`;
  s.passages.forEach(t => { if (CJK.test(t)) flag(id, "文章混入中文", ""); });
  s.qs.forEach((q, j) => checkMcq(`${id}-${j + 1}`, q, 4));
});
PART2.forEach((q, i) => checkMcq(`L2-${pad(i + 1)}`, q, 3));
PART34.forEach((s, i) => {
  const id = `L34-${pad(i + 1, 2)}`;
  if (s.qs.length !== 3) flag(id, "TOEIC 規格", `題數 ${s.qs.length}，正式每組 3 題`);
  s.turns.forEach(t => { if (CJK.test(t.t)) flag(id, "逐字稿混入中文", t.t); });
  s.qs.forEach((q, j) => checkMcq(`${id}-${j + 1}`, q, 4));
});
const seen = new Map();
VOCAB.forEach((v, i) => {
  const id = `V-${pad(i + 1)}`;
  const w = v.w.toLowerCase().trim();
  if (seen.has(w)) flag(id, "單字重複", `${v.w}（同 ${seen.get(w)}）`); else seen.set(w, id);
  if (CJK.test(v.w) || CJK.test(v.ex)) flag(id, "英文欄位混入中文", v.w);
  // 例句是否用到這個字（取字根前 5 個字母，片語取第一個實詞）
  const head = w.split(/\s+/).find(x => x.length > 3) || w;
  const stem = head.slice(0, Math.max(4, Math.min(5, head.length - 1)));
  if (!v.ex.toLowerCase().includes(stem)) flag(id, "例句未用到單字（注意）", `${v.w}：${v.ex}`);
  if (!/^(n|v|adj|adv|prep|conj|phr|phrase|idiom|n\.\/v|v\.\/n)/i.test(v.pos)) flag(id, "詞性標記", v.pos);
});
const byKind = {};
out.forEach(f => { (byKind[f.kind] = byKind[f.kind] || []).push(f); });
for (const [k, list] of Object.entries(byKind)) {
  console.log(`\n## ${k}（${list.length}）`);
  list.slice(0, 40).forEach(f => console.log(`- ${f.id} ${f.msg}`));
  if (list.length > 40) console.log(`  …另有 ${list.length - 40} 筆`);
}
console.log(`\n總計 ${out.length} 筆`);
