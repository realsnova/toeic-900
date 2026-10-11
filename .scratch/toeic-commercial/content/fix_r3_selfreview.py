# R3 自查修正：答案無法確定、題目措辭不自然、行號會隨螢幕寬度改變
from pathlib import Path
p = Path(__file__).parent / "r3_part7.py"
s = p.read_text(encoding="utf-8")
R = [
 ("I'd love to join two classes a week, but there's only one evening class that interests me.",
  "I'd love to join two classes a week, but the only evening classes are strength training and dance, and I'm really not a dancer."),
 ("\"三篇整合：晚上的課只有週二重訓和週四有氧舞蹈兩堂，他說只有一堂晚上的課讓他有興趣，所以另一堂他沒興趣。他第一次上課是週一，不可能已經上滿十堂；他提到業務部的人，不是人資部。題目只能推論他對其中一堂沒興趣，選項中只有 Cardio Dance 符合（若他對重訓有興趣）。\"",
  "\"三篇整合：晚上的課只有週二重訓和週四有氧舞蹈（Cardio Dance），他說自己不會跳舞（not a dancer）＝對有氧舞蹈沒興趣。他第一次上課是週一，不可能已經上滿十堂；他提到業務部的人，不是人資部。\""),
 ("(\"Which requirement does Ms. Vargas's letter suggest she meets that is listed as a plus?\"",
  "(\"Which of Ms. Vargas's qualifications is described as a plus in the job opening?\""),
 ("(\"When would the library lot most likely be available to visitors like Hannah P.?\", [\"On the day she visited the market\", \"Only on weekdays\", \"Only in the evenings\", \"Only during the renovation\"],\n   \"三篇整合：圖書館停車場只在週六、週日開放；Hannah 是週日去的，所以她去的那天可以用。\")",
  "(\"What is suggested about the day Hannah P. visited the market?\", [\"The library lot would be open to market visitors on that day\", \"The market was closed that day\", \"A special event was held that day\", \"The buses were not running that day\"],\n   \"三篇整合：圖書館停車場只在週六、週日開放給市場訪客；Hannah 是週日去的，所以那天可以使用。報導說市場週二到週日營業，週日有開。\")"),
 ("(\"The word \\\"share\\\" in paragraph 2, line 4, is closest in meaning to\"",
  "(\"In paragraph 2, the word \\\"share\\\" is closest in meaning to\""),
]
for a, b in R:
    assert s.count(a) == 1, (a[:60], s.count(a))
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")
print("ok")
