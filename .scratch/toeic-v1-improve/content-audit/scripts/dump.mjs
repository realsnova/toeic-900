// 題庫審查用匯出：盲測版（選項洗牌、不含答案與解析）＋答案鍵（含解析）
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.argv[2];
const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const ctx = {};
vm.createContext(ctx);
for (const f of ["vocab", "part5", "part6", "part7", "listening"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data", f + ".js"), "utf8"), ctx);
}
const { VOCAB, PART5, PART6, PART7, PART2, PART34 } = vm.runInContext("({ VOCAB, PART5, PART6, PART7, PART2, PART34 })", ctx);

// 固定種子洗牌（mulberry32），結果可重現
let seed = 20261007;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const shuffled = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const L = "ABCD";
const key = {};
const blind = { p5: [], p6: [], p7: [], l2: [], l34: [] };
const pad = (n, w = 3) => String(n).padStart(w, "0");

function mcq(bucket, id, header, q) {
  const order = shuffled(q.opts.length);
  const lines = [`[${id}]${header ? " " + header : ""}`, q.q ? `Q: ${q.q}` : null,
    ...order.map((oi, pos) => `  (${L[pos]}) ${q.opts[oi]}`)].filter(Boolean);
  blind[bucket].push(lines.join("\n"));
  key[id] = { ans: L[order.indexOf(q.ans)], answerText: q.opts[q.ans], exp: q.exp, cat: q.cat || null };
}

PART5.forEach((q, i) => mcq("p5", `P5-${pad(i + 1)}`, "", q));
PART6.forEach((p, i) => {
  blind.p6.push(`===== P6-${pad(i + 1, 2)} ${p.title}\n${p.text}`);
  p.blanks.forEach((b, j) => mcq("p6", `P6-${pad(i + 1, 2)}-${j + 1}`, `空格 [${j + 1}]`, { q: "", ...b }));
});
PART7.forEach((s, i) => {
  blind.p7.push(`===== P7-${pad(i + 1, 2)} ${s.title}（建議 ${s.time} 秒）\n` + s.passages.map((t, k) => `--- 文件 ${k + 1} ---\n${t}`).join("\n"));
  s.qs.forEach((q, j) => mcq("p7", `P7-${pad(i + 1, 2)}-${j + 1}`, "", q));
});
PART2.forEach((q, i) => mcq("l2", `L2-${pad(i + 1)}`, "", q));
PART34.forEach((s, i) => {
  blind.l34.push(`===== L34-${pad(i + 1, 2)} ${s.type} ${s.title}\n` + s.turns.map(t => `${t.s}: ${t.t}`).join("\n"));
  s.qs.forEach((q, j) => mcq("l34", `L34-${pad(i + 1, 2)}-${j + 1}`, "", q));
});

for (const [k, v] of Object.entries(blind)) fs.writeFileSync(path.join(OUT, `blind-${k}.txt`), v.join("\n\n") + "\n");
fs.writeFileSync(path.join(OUT, "key.json"), JSON.stringify(key, null, 1));
fs.writeFileSync(path.join(OUT, "vocab.txt"), VOCAB.map((v, i) => `[V-${pad(i + 1)}] ${v.w} | ${v.pos} | ${v.zh}\n  EX: ${v.ex}\n  ZH: ${v.exZh}`).join("\n") + "\n");
console.log({ p5: PART5.length, p6: PART6.length, p7: PART7.length, l2: PART2.length, l34: PART34.length, vocab: VOCAB.length, mcq: Object.keys(key).length });
