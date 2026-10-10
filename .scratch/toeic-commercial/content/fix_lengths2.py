import sys
sys.path.insert(0, '.')

def patch(p, R):
    s = open(p, encoding="utf-8").read()
    for a, b in R:
        assert s.count(a) == 1, (p, a, s.count(a))
        s = s.replace(a, b)
    open(p, "w", encoding="utf-8").write(s)

# Part 2：上一輪矯枉過正（正解從不最長），調回約三等分
patch("l1_part2.py", [
    ('"I signed up for the leadership workshop last week."', '"I signed up for the workshop last week."'),
    ('"Yes, I was a little bored during the whole thing."', '"Yes, I was a little bored during it."'),
    ('"It was held in a large convention center."', '"It was in a big hall."'),
    ('「It was held…」時態不合，而且答的是地點', '「It was in a big hall」時態不合，而且答的是地點'),
    ('"The meeting went much better than we expected."', '"The meeting went very well."'),
    ('"It comes in a larger box than the old version."', '"It comes in a larger box."'),
    ('"We definitely need more storage space in this office."', '"We need more storage space."'),
    ('"Yes, the lobby looks much brighter now that it\'s painted."', '"Yes, the lobby looks brighter."'),
    ('"Downstairs, next to the elevators."', '"Downstairs, right next to the elevators on the left."'),
    ('"The airport is being expanded."', '"The airport is being expanded this year to add a terminal."'),
    ('"About fifty cents each."', '"About fifty cents each, or a dollar for international mail."'),
    ('"He managed it quite well."', '"He managed the old branch quite well, I heard."'),
])
patch("l1_part3.py", [
    ('"To ask about a job opening"', '"To ask about openings at the company"'),
    ('"A reservation was canceled"', '"A reservation was canceled by mistake"'),
    ('"A truck has broken down"', '"A delivery truck has broken down on the way"'),
])
patch("l1_part4.py", [
    ('"Changes to parking fees"', '"Changes to parking fees for downtown residents"'),
    ('"To confirm a flight reservation"', '"To confirm a flight reservation to Lisbon"'),
    ('"To confirm a delivery address"', '"To confirm a delivery address for an order"'),
])

import importlib, l1_part2, l1_part3, l1_part4
def dist(items):
    hi = lo = n = 0
    for o in items:
        L = [len(x) for x in o]
        if len(set(L)) == 1: continue
        n += 1; hi += L[0] == max(L); lo += L[0] == min(L)
    return f"longest {hi} shortest {lo} of {n}"
print("P2", dist([o for q, o, e in l1_part2.P2]))
print("P34", dist([q["opts"] for st in l1_part3.P3 + l1_part4.P4 for q in st["qs"]]))
