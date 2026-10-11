# 把 <form>.json（例如 L2.json）附加到 js/data/listening.js 的 PART2 與 PART34 陣列尾端（INV-07：只附加，不改既有索引）
import json, re, sys
FORM = sys.argv[1]
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "js" / "data" / "listening.js"
src = DATA.read_text(encoding="utf-8")
assert f'"form": "{FORM}"' not in src, f"{FORM} 已經合併過"
data = json.loads((Path(__file__).parent / f"{FORM}.json").read_text(encoding="utf-8"))

def js(o):
    return json.dumps(o, ensure_ascii=False)

i34 = src.index("const PART34 = [")
end2 = src.rindex("];", 0, i34)
p2_block = "  // ---- L1（2026-10-10）：完整聽力測驗第 1 回 Part 2，保留給完整測驗，不出現在一般練習 ----\n" + \
    "".join(f"  {js(it)},\n" for it in data["part2"])
before = src[:end2].rstrip()
if not before.endswith(","): before += ","
src = before + "\n" + p2_block + src[end2:]

end34 = src.rindex("];")
sets_block = "  // ---- L1（2026-10-10）：完整聽力測驗第 1 回 Part 3（13 組）與 Part 4（10 組），保留給完整測驗 ----\n" + \
    "".join(f"  {js(s)},\n" for s in data["part34"])
before = src[:end34].rstrip()
if not before.endswith(","): before += ","
src = before + "\n" + sets_block + src[end34:]
DATA.write_text(src, encoding="utf-8")
print("ok")
