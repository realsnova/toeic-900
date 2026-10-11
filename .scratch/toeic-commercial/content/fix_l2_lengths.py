# L2 Part 3/4：正解太常是最長選項（31/69），加長 15 題的誘答（意思不變、仍然明確錯誤）
from pathlib import Path
HERE = Path(__file__).parent

def patch(name, pairs):
    p = HERE / name
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert s.count(a) == 1, (name, a, s.count(a))
        s = s.replace(a, b)
    p.write_text(s, encoding="utf-8")

patch("l2_part3.py", [
    ('"Fill out a form online"', '"Fill out a patient form on the clinic\'s website"'),
    ('"To explain why visitors increased"', '"To explain why the number of website visitors increased"'),
    ('"Her hotel reservation was canceled"', '"Her hotel reservation was canceled by mistake"'),
    ('"The website loads slowly"', '"The website loads too slowly on her computer"'),
    ('"Change the website\'s colors"', '"Change the colors used on the website\'s main page"'),
    ('"A reference from another bank"', '"A reference letter from her previous bank"'),
    ('"A brochure contains errors"', '"The brochure contains several printing errors"'),
    ('"To ask for a schedule change"', '"To ask for a change to the course schedule next month"'),
])
patch("l2_part4.py", [
    ('"To announce a building closure"', '"To announce that the library will close for repairs"'),
    ('"To explain a price increase"', '"To explain why strawberry prices have gone up this week"'),
    ('"To advertise a new tour"', '"To advertise a new evening tour of the harbour"'),
    ('"To suggest that the trip may be uncomfortable for them"', '"To suggest the trip may be rough for them"'),
    ('"To offer a discount for children"', '"To offer a discount for children under twelve years old"'),
    ('"The town offered tax benefits"', '"The town offered the company special tax benefits"'),
    ('"To praise the northern team"', '"To praise the northern team for their hard work this year"'),
    ('"To discuss customer complaints"', '"To discuss customer complaints about late deliveries"'),
])
print("ok")
