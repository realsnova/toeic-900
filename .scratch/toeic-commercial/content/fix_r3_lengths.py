# R3：正解太常是最長選項，換掉或加長誘答（仍然明確錯誤）
from pathlib import Path
HERE = Path(__file__).parent

def patch(name, pairs):
    p = HERE / name
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert s.count(a) == 1, (name, a, s.count(a))
        s = s.replace(a, b)
    p.write_text(s, encoding="utf-8")

patch("r3_part5_6.py", [
    ('["Although", "Because", "Unless", "Whether"]', '["Although", "Because", "Unless", "Provided that"]'),
    ('Unless（除非）和 Whether（是否）都不合。', 'Unless（除非）和 Provided that（只要）都不合。'),
    ('["herself", "her", "hers", "she"]', '["herself", "her", "hers", "themselves"]'),
    ('her、hers、she 放在句尾都不能表示「自己親自」。', 'her、hers 放在句尾不能表示「自己親自」；themselves 是複數，和 Ms. Chen 不一致。'),
    ('["between", "from", "during", "among"]', '["between", "from", "during", "throughout"]'),
    ('during 後面接一段期間的名詞，不接 A and B；among 用於三者以上。', 'during、throughout 後面接一段期間的名詞，不接 A and B。'),
    ('["had worked", "has worked", "works", "will work"]', '["had worked", "has worked", "has been working", "will work"]'),
    ('has worked 是現在完成式，不能搭配已經退休的過去時間點。', 'has worked、has been working 是現在完成式，不能搭配已經退休的過去時間點。'),
    ('["stock", "order", "line", "place"]', '["stock", "order", "service", "place"]'),
    ('out of line 是「不恰當」；', 'out of service 是「停止運作」；'),
    ('["capacity", "ability", "quality", "quantity"]', '["capacity", "possibility", "quality", "quantity"]'),
    ('full ability、full quality', 'full possibility、full quality'),
])
patch("r3_part7.py", [
    ('"To introduce new parking fees"', '"To introduce new monthly parking fees for tenants"'),
    ('"A booth has not been reserved"', '"A booth at the trade show has not been reserved yet"'),
    ('"By moving within the same city"', '"By moving to an address within the same city"'),
    ('"The opening of a train station"', '"The opening of a new train station near the campus"'),
    ('"To offer to prepare more slides"', '"To offer to prepare more slides for the client"'),
    ('"They want to show their children how food is produced"', '"They want their children to see food production"'),
    ('"They are looking for seasonal jobs"', '"They are looking for seasonal jobs at local farms"'),
    ('"She will start a new job in December"', '"She will start a new job at another company in December"'),
    ('"To offer to give a presentation"', '"To offer to give a presentation at next year\'s summit"'),
    ('"He has already received a gift card"', '"He has already received a gift card from human resources"'),
    ('"Extending the market\'s opening hours"', '"Extending the market\'s opening hours on weekend evenings"'),
    ('"The library lot would be open to market visitors on that day"', '"Visitors could park at the library that day"'),
    ('"A special event was held that day"', '"A special event was held at the market that day"'),
])
print("ok")
