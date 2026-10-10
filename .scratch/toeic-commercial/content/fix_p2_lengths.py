import sys
sys.path.insert(0, '.')
p = "l1_part2.py"
s = open(p, encoding="utf-8").read()
R = [('"It starts at nine o\'clock."', '"It starts at nine o\'clock in Room B."'),
     ('"Yes, the lobby looks much brighter."', '"Yes, the lobby looks much brighter now that it\'s painted."'),
     ('"On the first floor near the entrance."', '"On the first floor near the main entrance."'),
     ('"I signed up for the workshop last week."', '"I signed up for the leadership workshop last week."'),
     ('"About two hundred boxes."', '"About two hundred boxes of paper."'),
     ('"I\'d like to ship it overnight."', '"I\'d like to ship it overnight, if possible."'),
     ('"The system does it automatically every night."', '"Every night, automatically."'),
     ('"Yes, I\'ll be right back."', '"Yes, I\'ll be right back after lunch."'),
     ('答「系統每晚自動備份」', '答「每晚自動備份」'),
     ('"Yes, I was a little bored during it."', '"Yes, I was a little bored during the whole thing."'),
     ('"I\'d appreciate a reply by Friday."', '"I\'d appreciate a reply by the end of the day on Friday."'),
     ('"Supplies are kept in the cabinet."', '"Supplies are kept in the cabinet by the door."'),
     ('"Actually, the deadline was extended to Friday."', '"It\'s been pushed back to Friday."'),
     ('答「其實截止日延到週五了」', '答「已經延到週五了」'),
     ('"I reported it to the help desk."', '"I reported it to the help desk this morning."'),
     ('"I watched the video yesterday."', '"I watched the training video yesterday afternoon."'),
     ('"We hired three new interns."', '"We hired three new interns for the summer."'),
     ('"Please print twenty copies."', '"Please print twenty copies for the meeting."'),
     ('"We need more storage space."', '"We definitely need more storage space in this office."'),
     ('"The meeting went very well."', '"The meeting went much better than we expected."'),
     ('"Because the flight was delayed."', '"Because the flight was delayed by two hours."'),
     ('"It\'s been cold all week."', '"It\'s been unusually cold all week, hasn\'t it?"'),
     ('"Stamp it with the company seal."', '"Stamp it with the official company seal, please."'),
     ('"The shift starts at six."', '"The night shift starts at six in the evening."'),
     ('"It comes in a larger box."', '"It comes in a larger box than the old version."'),
     ('"Several free samples."', '"Several free samples were handed out at the fair."'),
     ('"At the main branch downtown."', '"At the main branch downtown, near the station."'),
     ]
for a, b in R:
    assert s.count(a) == 1, (a, s.count(a))
    s = s.replace(a, b)
open(p, "w", encoding="utf-8").write(s)

import l1_part2
from l1_part3 import P3
from l1_part4 import P4
hi = lo = 0
for q, o, e in l1_part2.P2:
    L = [len(x) for x in o]
    hi += L[0] == max(L)
    lo += L[0] == min(L)
print("P2 longest", hi, "shortest", lo)
for si, st in enumerate(P3 + P4):
    for qi, q in enumerate(st["qs"]):
        L = [len(x) for x in q["opts"]]
        if L[0] == max(L):
            print(si, qi, L, q["opts"])
