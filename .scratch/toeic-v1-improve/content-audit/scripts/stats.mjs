import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
const ROOT = process.argv[2];
const ctx = {};
vm.createContext(ctx);
for (const f of ["vocab", "part5", "part6", "part7", "listening"]) vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data", f + ".js"), "utf8"), ctx);
const { PART5, PART7, PART2, PART34 } = vm.runInContext("({ PART5, PART7, PART2, PART34 })", ctx);

// Part 5 類別分布，及前後半難度差（以平均題幹長度與選項是否同字根粗估）
const cats = {};
PART5.forEach(q => { cats[q.cat] = (cats[q.cat] || 0) + 1; });
console.log("P5 類別分布", cats);
const half = (a, b) => PART5.slice(a, b);
const avgLen = arr => Math.round(arr.reduce((s, q) => s + q.q.split(/\s+/).length, 0) / arr.length);
const sameRoot = q => { const r = q.opts[0].toLowerCase().slice(0, 4); return q.opts.every(o => o.toLowerCase().startsWith(r)); };
console.log("P5 題幹平均字數：1–70", avgLen(half(0, 70)), "／71–200", avgLen(half(70, 200)));
console.log("P5 詞性題（四個選項同字根）比例：1–70", half(0, 70).filter(sameRoot).length, "/70；71–200", half(70, 200).filter(sameRoot).length, "/130");

// 近似重複：題幹去掉空格與停用字後的 Jaccard 相似度
const words = s => new Set(s.toLowerCase().replace(/_+/g, " ").match(/[a-z]+/g).filter(w => w.length > 3));
const sim = (a, b) => { const A = words(a), B = words(b); const inter = [...A].filter(x => B.has(x)).length; return inter / (A.size + B.size - inter); };
const pairs = [];
for (let i = 0; i < PART5.length; i++) for (let j = i + 1; j < PART5.length; j++) {
  const s = sim(PART5[i].q, PART5[j].q);
  const sameKey = PART5[i].opts[PART5[i].ans].toLowerCase() === PART5[j].opts[PART5[j].ans].toLowerCase();
  if (s >= 0.4 || (sameKey && s >= 0.25)) pairs.push(`P5-${String(i + 1).padStart(3, "0")} ~ P5-${String(j + 1).padStart(3, "0")} 相似 ${s.toFixed(2)}${sameKey ? "，同答案" : ""}`);
}
console.log("P5 近似重複", pairs.length, pairs);
const keyCount = {};
PART5.forEach(q => { const k = q.opts[q.ans].toLowerCase(); keyCount[k] = (keyCount[k] || 0) + 1; });
console.log("P5 重複出現 3 次以上的正解", Object.entries(keyCount).filter(([, n]) => n >= 3));

// Part 2：正解是否為最長選項
const longest = PART2.filter(q => { const L = q.opts.map(o => o.length); return L[q.ans] === Math.max(...L) && L.filter(x => x === L[q.ans]).length === 1; }).length;
console.log(`P2 正解是唯一最長選項：${longest}/${PART2.length}（隨機約 1/3）`);

// Part 7：篇數、題數、題型
PART7.forEach((s, i) => console.log(`P7-${String(i + 1).padStart(2, "0")} 篇數 ${s.passages.length} 題數 ${s.qs.length} ${s.title}`));
const qtypes = { NOT: 0, 字義: 0, 主旨: 0, 推論: 0 };
PART7.forEach(s => s.qs.forEach(q => {
  if (/\bNOT\b/.test(q.q)) qtypes.NOT++;
  if (/closest in meaning/.test(q.q)) qtypes.字義++;
  if (/purpose|main/i.test(q.q)) qtypes.主旨++;
  if (/suggested|implied|most likely|concluded|indicated/i.test(q.q)) qtypes.推論++;
}));
console.log("P7 題型", qtypes);
// Part 3/4：講者人數與題型
PART34.forEach((s, i) => {
  const speakers = new Set(s.turns.map(t => t.s)).size;
  const implied = s.qs.filter(q => /mean when|imply|most likely|suggest/i.test(q.q)).length;
  console.log(`L34-${String(i + 1).padStart(2, "0")} ${s.type} 講者 ${speakers} 推論題 ${implied}`);
});
