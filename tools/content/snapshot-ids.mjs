// 已發布的題目編號清單：每個內建題的固定編號 → 題目文字的雜湊（INV-13）。
// 測試會檢查：清單裡的編號仍然存在、仍然指向同一題（只能在尾端新增，不能重排或改題意）。
// 只用 Node 內建模組（D-2）。
//
// 用法（在 repo 根目錄）：
//   node tools/content/snapshot-ids.mjs           把新增的題目編號加進清單（既有的不動）
//   node tools/content/snapshot-ids.mjs --fix ID  修正錯字後，重新記錄某一題的雜湊（題意不變時才可以用）
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
export const SNAPSHOT = path.join(ROOT, "tests", "fixtures", "published-ids.json");

export function currentIds() {
  const ctx = {};
  vm.createContext(ctx);
  for (const f of ["js/audio.js", "js/data/part5.js", "js/data/part6.js", "js/data/part7.js", "js/data/listening.js"])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  const { arrs, fnv1a } = vm.runInContext("({ arrs: { p5: PART5, p6: PART6, p7: PART7, l2: PART2, l34: PART34 }, fnv1a })", ctx);
  const sig = {
    p5: it => it.q + "|" + it.opts[it.ans],
    l2: it => it.q + "|" + it.opts[it.ans],
    p6: it => it.text,
    p7: it => it.passages.join("\n") + "|" + it.qs.map(q => q.q).join("|"),
    l34: it => it.turns.map(t => t.t).join("\n") + "|" + it.qs.map(q => q.q).join("|")
  };
  const out = {};
  for (const [t, arr] of Object.entries(arrs))
    arr.forEach((it, i) => { out[`${t}-${String(i).padStart(4, "0")}`] = fnv1a(sig[t](it)); });
  return out;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/").replace(/^\//, "")}`) {
  const cur = currentIds();
  const old = fs.existsSync(SNAPSHOT) ? JSON.parse(fs.readFileSync(SNAPSHOT, "utf8")) : {};
  const fix = process.argv.indexOf("--fix");
  if (fix > 0) {
    const id = process.argv[fix + 1];
    if (!cur[id]) throw new Error(`沒有 ${id}`);
    old[id] = cur[id];
  }
  let added = 0;
  for (const [id, h] of Object.entries(cur)) if (!(id in old)) { old[id] = h; added++; }
  fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
  fs.writeFileSync(SNAPSHOT, JSON.stringify(old, null, 0).replace(/,"/g, ',\n"') + "\n");
  console.log(`新增 ${added} 個編號，共 ${Object.keys(old).length} 個`);
}
