# 組合聽力測驗（L1、L2…）的 JSON、檢查選項長度偏差與圖表寬度，並產生兩份盲解工作表
# 用法：python -X utf8 build_listen_form.py L2 <盲解工作表輸出資料夾> <答案鍵輸出資料夾>
import importlib, json, random, sys
from pathlib import Path

form = sys.argv[1]
sheet_dir = Path(sys.argv[2]); key_dir = Path(sys.argv[3])
sheet_dir.mkdir(parents=True, exist_ok=True); key_dir.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(Path(__file__).parent))
low = form.lower()
P2 = importlib.import_module(f"{low}_part2").P2
P3 = importlib.import_module(f"{low}_part3").P3
P4 = importlib.import_module(f"{low}_part4").P4

p2 = [{"q": q, "opts": o, "ans": 0, "exp": e, "src": form, "form": form} for q, o, e in P2]
sets = P3 + P4
for s in sets:
    s["src"] = form; s["form"] = form
json.dump({"part2": p2, "part34": sets}, open(Path(__file__).parent / f"{form}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# 檢查
assert len(p2) == 25 and len(P3) == 13 and len(P4) == 10, (len(p2), len(P3), len(P4))
for s in sets:
    assert len(s["qs"]) == 3
    for q in s["qs"]:
        assert len(q["opts"]) == 4 and len(set(q["opts"])) == 4, q["q"]
    if s.get("graphic"):
        wide = [l for l in s["graphic"].split("\n") if len(l) > 34]
        assert not wide, (s["title"], wide)
def dist(items):
    hi = lo = n = 0
    for o in items:
        L = [len(x) for x in o]
        if len(set(L)) == 1: continue
        n += 1; hi += L[0] == max(L); lo += L[0] == min(L)
    return hi, lo, n
print("P2 正解最長／最短／題數", dist([x["opts"] for x in p2]))
print("P34 正解最長／最短／題數", dist([q["opts"] for s in sets for q in s["qs"]]))

LET = "ABCD"
names = {"M": "Man", "W": "Woman", "M2": "Man 2", "W2": "Woman 2", "N": "Speaker"}
for seed in (1, 2):
    rnd = random.Random(seed * 7919 + len(form))
    lines, key = [f"# {form} 聽力盲解工作表（第 {seed} 份）\n",
                  "每題選一個答案。只根據逐字稿作答。若有兩個選項都說得通、或沒有選項正確，請在該題註明 FLAG 並說明。\n",
                  "## Part 2（聽問句，選最合適的回應）\n"], {}
    for i, it in enumerate(p2, 1):
        order = list(range(3)); rnd.shuffle(order)
        qid = f"P2-{i:02d}"; key[qid] = LET[order.index(0)]
        lines.append(f"**{qid}** {it['q']}")
        lines += [f"  ({LET[k]}) {it['opts'][j]}" for k, j in enumerate(order)]
        lines.append("")
    for si, st in enumerate(sets, 1):
        tag = f"P3-{si:02d}" if st["type"] == "Part 3" else f"P4-{si - len(P3):02d}"
        lines.append(f"## {tag}（{st['type']}）\n")
        if st.get("graphic"): lines.append("圖表：\n```\n" + st["graphic"] + "\n```")
        lines += [f"{names[t['s']]}: {t['t']}" for t in st["turns"]]
        lines.append("")
        for qi, q in enumerate(st["qs"], 1):
            order = list(range(4)); rnd.shuffle(order)
            qid = f"{tag}-{qi}"; key[qid] = LET[order.index(0)]
            lines.append(f"**{qid}** {q['q']}")
            lines += [f"  ({LET[k]}) {q['opts'][j]}" for k, j in enumerate(order)]
            lines.append("")
    (sheet_dir / f"{form}-blind-sheet-{seed}.md").write_text("\n".join(lines), encoding="utf-8")
    json.dump(key, open(key_dir / f"{form}-blind-key-{seed}.json", "w", encoding="utf-8"), indent=0)
print("題數", len(p2) + sum(len(s["qs"]) for s in sets))
