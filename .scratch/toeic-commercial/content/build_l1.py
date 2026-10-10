# 組合 L1.json，並產生兩份選項洗牌、不含答案的盲解工作表（各用不同亂數種子）
import json, random, sys
sys.path.insert(0, '.')
from l1_part2 import P2
from l1_part3 import P3
from l1_part4 import P4

p2 = [{"q": q, "opts": o, "ans": 0, "exp": e, "src": "L1", "form": "L1"} for q, o, e in P2]
sets = P3 + P4
for s in sets:
    s["src"] = "L1"; s["form"] = "L1"
json.dump({"part2": p2, "part34": sets}, open("L1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

LET = "ABCD"
for seed in (1, 2):
    rnd = random.Random(seed * 7919)
    lines, key = [], {}
    lines.append("# L1 聽力盲解工作表（第 %d 份）\n" % seed)
    lines.append("每題選一個答案。只根據逐字稿作答。若有兩個選項都說得通、或沒有選項正確，請在該題註明 FLAG 並說明。\n")
    lines.append("## Part 2（聽問句，選最合適的回應）\n")
    n = 0
    for i, it in enumerate(p2, 1):
        order = list(range(3)); rnd.shuffle(order)
        n += 1; qid = f"P2-{i:02d}"
        key[qid] = LET[order.index(0)]
        lines.append(f"**{qid}** {it['q']}")
        for k, j in enumerate(order):
            lines.append(f"  ({LET[k]}) {it['opts'][j]}")
        lines.append("")
    for si, st in enumerate(sets, 1):
        part = st["type"]
        tag = f"{'P3' if part == 'Part 3' else 'P4'}-{si if part == 'Part 3' else si - len(P3):02d}"
        lines.append(f"## {tag}（{part}）\n")
        if st.get("graphic"):
            lines.append("圖表：\n```\n" + st["graphic"] + "\n```")
        names = {"M": "Man", "W": "Woman", "M2": "Man 2", "W2": "Woman 2", "N": "Speaker"}
        for t in st["turns"]:
            lines.append(f"{names[t['s']]}: {t['t']}")
        lines.append("")
        for qi, q in enumerate(st["qs"], 1):
            order = list(range(4)); rnd.shuffle(order)
            qid = f"{tag}-{qi}"
            key[qid] = LET[order.index(0)]
            lines.append(f"**{qid}** {q['q']}")
            for k, j in enumerate(order):
                lines.append(f"  ({LET[k]}) {q['opts'][j]}")
            lines.append("")
    open(f"blind-sheet-{seed}.md", "w", encoding="utf-8").write("\n".join(lines))
    json.dump(key, open(f"blind-key-{seed}.json", "w", encoding="utf-8"), indent=0)
print("questions", len(p2) + sum(len(s["qs"]) for s in sets))
