# L1 圖表改窄（每行 ≤34 字元，手機不需要橫向捲動）；同時改 listening.js 與內容原始檔
import json
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
G = {
 "SHUTTLE BUS SCHEDULE: Airport to Downtown\nDeparts ........ Arrives\n7:15 A.M. ...... 8:00 A.M.\n7:45 A.M. ...... 8:30 A.M.\n8:15 A.M. ...... 9:00 A.M.\n8:45 A.M. ...... 9:30 A.M.":
 "AIRPORT SHUTTLE TO DOWNTOWN\nDeparts ...... Arrives\n7:15 A.M. .... 8:00 A.M.\n7:45 A.M. .... 8:30 A.M.\n8:15 A.M. .... 9:00 A.M.\n8:45 A.M. .... 9:30 A.M.",
 "MEETING ROOMS: 4th Floor\nRoom ....... Seats ... Projector\nAzure ...... 8 ......... Yes\nBirch ...... 12 ........ No\nCedar ...... 14 ........ Yes\nDelta ...... 20 ........ Yes":
 "MEETING ROOMS: 4th Floor\nRoom ..... Seats .. Projector\nAzure .... 8 ...... Yes\nBirch .... 12 ..... No\nCedar .... 14 ..... Yes\nDelta .... 20 ..... Yes",
 "CONFERENCE PROGRAMME: Room 2\n10:00 ... Digital Marketing Trends ...... A. Novak\n11:00 ... Building Customer Loyalty ..... R. Singh\n1:00 .... Social Media Analytics ........ L. Brooks\n2:00 .... Pricing Strategies ............ M. Ortega":
 "CONFERENCE PROGRAMME: Room 2\n10:00  Marketing Trends (Novak)\n11:00  Customer Loyalty (Singh)\n1:00   Social Media (Brooks)\n2:00   Pricing (Ortega)",
 "RIVERSIDE FITNESS: MEMBERSHIP PLANS\nBasic ...... $30/month ... Gym only\nPlus ....... $45/month ... Gym + Pool\nPremium .... $60/month ... Gym + Pool + Classes\nFamily ..... $95/month ... Premium for up to 4 people":
 "RIVERSIDE FITNESS (per month)\nBasic    $30  Gym only\nPlus     $45  Gym, Pool\nPremium  $60  Gym, Pool, Classes\nFamily   $95  Premium for 4",
}
EXP = ("圖表題：座談會取代 Brooks 女士的場次。議程表上 L. Brooks 的 Social Media Analytics 在 1:00。",
       "圖表題：座談會取代 Brooks 女士的場次。議程表上 Brooks 的 Social Media 場次在 1:00。")
for new in G.values():
    assert all(len(l) <= 34 for l in new.split("\n")), new

def patch(path, enc):
    s = path.read_text(encoding="utf-8")
    for old, new in list(G.items()) + [EXP]:
        a, b = enc(old), enc(new)
        assert s.count(a) == 1, (path.name, old[:30], s.count(a))
        s = s.replace(a, b)
    path.write_text(s, encoding="utf-8")

js_enc = lambda t: json.dumps(t, ensure_ascii=False)[1:-1]   # listening.js 裡是 JSON 字串
py_enc = lambda t: t.replace("\n", "\\n")                     # .py 原始檔裡是 \n 跳脫
patch(ROOT / "js" / "data" / "listening.js", js_enc)
s3 = (HERE / "l1_part3.py").read_text(encoding="utf-8"); s4 = (HERE / "l1_part4.py").read_text(encoding="utf-8")
for path in (HERE / "l1_part3.py", HERE / "l1_part4.py"):
    s = path.read_text(encoding="utf-8")
    for old, new in list(G.items()) + [EXP]:
        a, b = py_enc(old), py_enc(new)
        if a in s: s = s.replace(a, b)
    path.write_text(s, encoding="utf-8")
print("ok")
