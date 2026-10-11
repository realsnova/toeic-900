# 組合練習題批次（C1…）：轉成 App 格式、執行內容檢查、產生盲解工作表，或合併進 js/data/
# 用法（在 repo 根目錄）：
#   python -X utf8 .scratch/toeic-commercial/content/build_batch.py C1                 組合 + lint + 盲解工作表
#   python -X utf8 .scratch/toeic-commercial/content/build_batch.py C1 --merge         附加到 js/data/*.js 的陣列尾端（INV-07）
# 批次模組（小寫批次名開頭）：c1_part5.py(P5)、c1_part6_7a.py(P6, P7)、c1_part7b.py(P7)、c1_part2.py(P2)、
# c1_part34.py(P34)、c1_vocab_*.py(V)。缺少的模組會略過。
import importlib, json, random, subprocess, sys
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
BATCH = sys.argv[1]
low = BATCH.lower()
sys.path.insert(0, str(HERE))


def mod(name):
    try:
        return importlib.import_module(f"{low}_{name}")
    except ModuleNotFoundError:
        print(f"（略過：{low}_{name}.py 不存在）")
        return None


out = {"p5": [], "p6": [], "p7": [], "l2": [], "l34": [], "vocab": []}
m = mod("part5")
if m:
    out["p5"] = [{"q": q, "opts": o, "ans": 0, "cat": c, "sk": sk, "exp": e, "src": BATCH} for q, o, c, sk, e in m.P5]
m = mod("part6_7a")
if m:
    out["p6"] = [{"title": t, "text": text, "src": BATCH, "blanks": [{"opts": o, "ans": 0, "sk": sk, "exp": e} for o, sk, e in b]}
                 for t, text, b in m.P6]
    out["p7"] += [dict(s, src=BATCH) for s in m.P7]
m = mod("part7b")
if m:
    out["p7"] += [dict(s, src=BATCH) for s in m.P7]
m = mod("part2")
if m:
    out["l2"] = [{"q": q, "opts": o, "ans": 0, "sk": sk, "exp": e, "src": BATCH} for q, o, sk, e in m.P2]
m = mod("part34")
if m:
    out["l34"] = [dict(s, src=BATCH) for s in m.P34]
for name in ("vocab_al", "vocab_mz"):
    m = mod(name)
    if m:
        out["vocab"] += [{"w": w, "pos": p, "zh": z, "ex": ex, "exZh": exz} for w, p, z, ex, exz in m.V]
out["vocab"].sort(key=lambda v: v["w"].lower())

json_path = HERE / f"{BATCH}.json"
json.dump(out, open(json_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in out.items()})


def js(o):
    return json.dumps(o, ensure_ascii=False)


if "--merge" in sys.argv:
    label = f"{BATCH}：練習題批次"
    targets = [("part5.js", "PART5", "p5"), ("part6.js", "PART6", "p6"), ("part7.js", "PART7", "p7"),
               ("listening.js", "PART2", "l2"), ("listening.js", "PART34", "l34"), ("vocab.js", "VOCAB", "vocab")]
    for fname, var, key in targets:
        items = out[key]
        if not items:
            continue
        path = ROOT / "js" / "data" / fname
        src = path.read_text(encoding="utf-8")
        assert f'"src": "{BATCH}"' not in src.split(f"const {var} = [")[1].split("\nconst ")[0] or key == "vocab", f"{BATCH} 已經合併到 {var}"
        start = src.index(f"const {var} = [")
        nxt = src.find("\nconst ", start + 1)
        end = src.rfind("];", start, nxt if nxt != -1 else len(src))
        assert end > start, f"{fname}：找不到 {var} 的結尾"
        before = src[:end].rstrip()
        if not before.endswith(","):
            before += ","
        block = f"  // ---- {label} ----\n" + "".join(f"  {js(it)},\n" for it in items)
        path.write_text(before + "\n" + block + src[end:], encoding="utf-8")
    print("merged")
    sys.exit(0)

# 內容檢查
r = subprocess.run(["node", str(ROOT / "tools" / "content" / "lint.mjs"), str(json_path)], capture_output=True, text=True, encoding="utf-8")
print(r.stdout[-6000:])
if r.returncode:
    print("lint 有錯誤，先修正再產生盲解工作表")
    sys.exit(1)

# 盲解工作表：閱讀 Part 5、閱讀 Part 6/7、聽力（逐字稿），各兩份不同洗牌
SHEETS = HERE.parent / "evidence" / BATCH / "sheets"
KEYS = HERE.parent / "evidence" / BATCH / "keys"
SHEETS.mkdir(parents=True, exist_ok=True)
KEYS.mkdir(parents=True, exist_ok=True)
LET = "ABCD"
HEAD = ("每題選一個答案，格式 `題號: 字母`，一行一題。若有兩個選項都說得通、沒有選項正確、"
        "或題目／文章本身有錯誤或前後矛盾，在該行後面加 `FLAG: 說明`。\n")


def sheet(name, seed, build):
    rnd = random.Random(seed * 7919 + len(name))
    key, lines = {}, [f"# {BATCH} 盲解工作表 {name}（第 {seed} 份）\n", HEAD]

    def q(qid, text, opts):
        if opts and str(opts[0]).startswith("["):
            order = sorted(range(len(opts)), key=lambda k: opts[k])
        else:
            order = list(range(len(opts)))
            rnd.shuffle(order)
        key[qid] = LET[order.index(0)]
        lines.append(f"**{qid}** {text}")
        lines.extend(f"  ({LET[k]}) {opts[j]}" for k, j in enumerate(order))
        lines.append("")
    build(lines, q)
    if len(key) == 0:
        return
    (SHEETS / f"{BATCH}-{name}-{seed}.md").write_text("\n".join(lines), encoding="utf-8")
    json.dump(key, open(KEYS / f"{BATCH}-{name}-key-{seed}.json", "w", encoding="utf-8"), indent=0)


def p5(lines, q):
    for i, it in enumerate(out["p5"], 1):
        q(f"P5-{i:03d}", it["q"], it["opts"])


def p67(lines, q):
    for pi, p in enumerate(out["p6"], 1):
        lines.append(f"## P6-{pi:02d}\n\n```\n{p['text']}\n```\n")
        for bi, b in enumerate(p["blanks"], 1):
            q(f"P6-{pi:02d}-{bi}", f"空格 [{bi}]", b["opts"])
    for si, s in enumerate(out["p7"], 1):
        lines.append(f"## P7-{si:02d}\n")
        for n, t in enumerate(s["passages"], 1):
            lines.append(f"文件 {n}：\n```\n{t}\n```\n")
        for qi, it in enumerate(s["qs"], 1):
            q(f"P7-{si:02d}-{qi}", it["q"], it["opts"])


def listen(lines, q):
    lines.append("聽力題以逐字稿呈現。Part 2 選出最適合的回應。\n")
    for i, it in enumerate(out["l2"], 1):
        q(f"L2-{i:03d}", f"「{it['q']}」", it["opts"])
    for si, s in enumerate(out["l34"], 1):
        lines.append(f"## L34-{si:02d}（{s['type']}）\n")
        lines.extend(f"{t['s']}: {t['t']}" for t in s["turns"])
        if s.get("graphic"):
            lines.append(f"\n圖表：\n```\n{s['graphic']}\n```")
        lines.append("")
        for qi, it in enumerate(s["qs"], 1):
            q(f"L34-{si:02d}-{qi}", it["q"], it["opts"])


for seed in (1, 2):
    sheet("p5", seed, p5)
    sheet("p67", seed, p67)
    sheet("listen", seed, listen)

if out["vocab"]:
    lines = [f"# {BATCH} 單字檢查表\n", "逐條檢查拼字、詞性、中文字義（多益語境）、例句用法與翻譯。有問題的寫 `編號: 問題與建議修正`；沒問題的不用列。\n"]
    lines += [f"{i}. {v['w']} ({v['pos']}) {v['zh']} — {v['ex']} / {v['exZh']}" for i, v in enumerate(out["vocab"], 1)]
    (SHEETS / f"{BATCH}-vocab.md").write_text("\n".join(lines), encoding="utf-8")
print("工作表：", sorted(p.name for p in SHEETS.iterdir()))
