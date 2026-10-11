# 組合閱讀測驗（R3…）的 JSON、檢查題數，並產生兩份盲解工作表
# 用法：python -X utf8 build_read_form.py R3 <盲解工作表資料夾> <答案鍵資料夾>
#       python -X utf8 build_read_form.py R3 --merge   附加到 js/data/part5.js、part6.js、part7.js 的陣列尾端（INV-07）
import importlib, json, random, sys
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
form = sys.argv[1]
sys.path.insert(0, str(HERE))
low = form.lower()
m56 = importlib.import_module(f"{low}_part5_6")
P7 = importlib.import_module(f"{low}_part7").P7

p5 = [{"q": q, "opts": o, "ans": 0, "cat": c, "exp": e, "form": form} for q, o, c, e in m56.P5]
p6 = [{"title": t, "form": form, "text": text, "blanks": [{"opts": o, "ans": 0, "exp": e} for o, e in b]} for t, text, b in m56.P6]
p7 = [dict(title=s["title"], time=s["time"], form=form, passages=s["passages"], qs=s["qs"]) for s in P7]
assert len(p5) == 30 and len(p6) == 4 and all(len(p["blanks"]) == 4 for p in p6)
assert sum(len(s["qs"]) for s in p7) == 54
for p in p6:
    for k in range(1, 5): assert f"___[{k}]___" in p["text"], (p["title"], k)
for q in p5: assert q["q"].count("______") == 1, q["q"]
json.dump({"p5": p5, "p6": p6, "p7": p7}, open(HERE / f"{form}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def js(o): return json.dumps(o, ensure_ascii=False)

if "--merge" in sys.argv:
    for fname, var, items, label in [("part5.js", "PART5", p5, "Part 5"), ("part6.js", "PART6", p6, "Part 6"), ("part7.js", "PART7", p7, "Part 7")]:
        path = ROOT / "js" / "data" / fname
        src = path.read_text(encoding="utf-8")
        assert f'"form": "{form}"' not in src, f"{form} 已經合併到 {fname}"
        start = src.index(f"const {var} = [")
        end = src.find("];", start)
        nxt = src.find("\nconst ", start + 1)
        assert nxt == -1 or end < nxt, f"{fname}：找不到 {var} 的結尾"
        before = src[:end].rstrip()
        if not before.endswith(","): before += ","
        block = f"  // ---- {form}：完整閱讀測驗 {label}，保留給完整測驗，不出現在一般練習 ----\n" + "".join(f"  {js(it)},\n" for it in items)
        path.write_text(before + "\n" + block + src[end:], encoding="utf-8")
    print("merged")
    sys.exit(0)

sheet_dir = Path(sys.argv[2]); key_dir = Path(sys.argv[3])
sheet_dir.mkdir(parents=True, exist_ok=True); key_dir.mkdir(parents=True, exist_ok=True)
LET = "ABCD"
for seed in (1, 2):
    rnd = random.Random(seed * 104729 + len(form))
    key = {}
    lines = [f"# {form} 閱讀盲解工作表（第 {seed} 份）\n",
             "每題選一個答案。若有兩個選項都說得通、或沒有選項正確、或文章本身有錯誤，請在該題註明 FLAG 並說明。\n",
             "## Part 5（句子填空）\n"]
    def opts_order(opts):
        if opts and opts[0].startswith("["):  # 插入句子位置題：照 [1]～[4] 排
            return sorted(range(len(opts)), key=lambda k: opts[k])
        o = list(range(len(opts))); rnd.shuffle(o); return o
    for i, it in enumerate(p5, 1):
        order = opts_order(it["opts"]); qid = f"P5-{i:02d}"; key[qid] = LET[order.index(0)]
        lines.append(f"**{qid}** {it['q']}")
        lines += [f"  ({LET[k]}) {it['opts'][j]}" for k, j in enumerate(order)]
        lines.append("")
    for pi, p in enumerate(p6, 1):
        lines.append(f"## P6-{pi}\n\n```\n{p['text']}\n```\n")
        for bi, b in enumerate(p["blanks"], 1):
            order = opts_order(b["opts"]); qid = f"P6-{pi}-{bi}"; key[qid] = LET[order.index(0)]
            lines.append(f"**{qid}** 空格 [{bi}]")
            lines += [f"  ({LET[k]}) {b['opts'][j]}" for k, j in enumerate(order)]
            lines.append("")
    for si, s in enumerate(p7, 1):
        lines.append(f"## P7-{si:02d}\n")
        for n, ptxt in enumerate(s["passages"], 1):
            lines.append(f"文件 {n}：\n```\n{ptxt}\n```\n")
        for qi, q in enumerate(s["qs"], 1):
            order = opts_order(q["opts"]); qid = f"P7-{si:02d}-{qi}"; key[qid] = LET[order.index(0)]
            lines.append(f"**{qid}** {q['q']}")
            lines += [f"  ({LET[k]}) {q['opts'][j]}" for k, j in enumerate(order)]
            lines.append("")
    (sheet_dir / f"{form}-blind-sheet-{seed}.md").write_text("\n".join(lines), encoding="utf-8")
    json.dump(key, open(key_dir / f"{form}-blind-key-{seed}.json", "w", encoding="utf-8"), indent=0)
print("題數", len(p5) + 16 + 54)
