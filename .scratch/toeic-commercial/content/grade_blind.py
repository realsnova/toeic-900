# 盲解評分：python -X utf8 grade_blind.py <批次> <工作表名稱>   例如 C1 p5
import json, re, sys
from pathlib import Path
E = Path(__file__).parent.parent / "evidence" / sys.argv[1]
name = sys.argv[2]
for seed in (1, 2):
    key = json.load(open(E / "keys" / f"{sys.argv[1]}-{name}-key-{seed}.json", encoding="utf-8"))
    f = E / "answers" / f"{sys.argv[1]}-{name}-answers-{seed}.txt"
    if not f.exists(): print(seed, "沒有答案檔"); continue
    ans, flags = {}, {}
    for line in f.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*\**([A-Z0-9-]+)\**\s*[:：]\s*\(?([A-D])\)?(.*)", line)
        if m:
            ans[m[1]] = m[2]
            if "FLAG" in m[3]: flags[m[1]] = m[3].strip()
    wrong = [q for q in key if ans.get(q) != key[q]]
    print(f"第 {seed} 份：{len(key) - len(wrong)}/{len(key)}  錯：{[(q, ans.get(q), key[q]) for q in wrong]}")
    for q, t in flags.items(): print("   FLAG", q, t[:160])
