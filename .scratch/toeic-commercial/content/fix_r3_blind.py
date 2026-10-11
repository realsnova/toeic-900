# R3 盲解發現的 4 個問題（2026-10-11）
from pathlib import Path
p = Path(__file__).parent / "r3_part7.py"
s = p.read_text(encoding="utf-8")
R = [
 # 1. 收據：小計含收納盒但附註說還沒收費，自相矛盾 → 收納盒不計入小計
 ("Desk organizers / 6 / $54.00\nSubtotal: $255.00\nBusiness customer discount (10%): -$25.50\nTotal: $229.50\n\nNote: The desk organizers are currently out of stock and will be shipped separately by October 17. You have not been charged for them yet.",
  "Desk organizers / 6 / (back-ordered)\nSubtotal: $201.00\nBusiness customer discount (10%): -$20.10\nTotal: $180.90\n\nNote: The desk organizers ($54.00) are currently out of stock and will be shipped separately by October 17. They are not included in the total above; you will be charged when they ship."),
 # 2. 信件插入題：[2] 和 [4] 都說得通 → 換成只接得上「搬走通知」的句子
 (r'\"Tenants who do not respond will be assumed to be leaving.\"', r'\"This will give us time to arrange a final inspection of your apartment.\"'),
 ("\"[4] 前面說「若要搬走，請在同一日期前書面通知」，接著說「沒有回覆的房客會被視為要搬走」最連貫。放在 [2] 會打斷續約與租金的說明。\"",
  "\"[4] 前面說「若要搬走，請在同一日期前書面通知」，接著說明提早通知的原因：「讓我們有時間安排退租檢查」。放在 [2] 時前面講的是續約，續約不需要退租檢查。\""),
 # 3. 課程：他說只能上下班後的課，卻上了週一中午的瑜伽 → 改成週二晚上
 ("I really enjoyed the class I took on Monday.", "I really enjoyed the class I took on Tuesday evening."),
 ("(\"Which class did Mr. Bell most likely attend?\", [\"Yoga\", \"Strength Training\", \"Stretching\", \"Meditation\"],\n   \"三篇整合：他說週一上了一堂課；課表上週一是 12:15 的 Yoga。\")",
  "(\"Which class did Mr. Bell most likely attend?\", [\"Strength Training\", \"Yoga\", \"Cardio Dance\", \"Meditation\"],\n   \"三篇整合：他說上了週二晚上的課；課表上週二是 5:30 P.M. 的 Strength Training。\")"),
 ("他第一次上課是週一，不可能已經上滿十堂", "他第一次上課是週二，不可能已經上滿十堂"),
 # 4. 最後一題：圖書館停車場是事後才提議的，沒有正確選項 → 改成整合評論與信件的題目
 ("(\"What is suggested about the day Hannah P. visited the market?\", [\"Visitors could park at the library that day\", \"The market was closed that day\", \"A special event was held at the market that day\", \"The buses were not running that day\"],\n   \"三篇整合：圖書館停車場只在週六、週日開放給市場訪客；Hannah 是週日去的，所以那天可以使用。報導說市場週二到週日營業，週日有開。\")",
  "(\"What problem experienced by Hannah P. is Ms. Ames's proposal intended to solve?\", [\"Spending a long time looking for parking\", \"Waiting in long lines at food stalls\", \"Finding the market closed on Sunday\", \"Having to pay high bus fares\"],\n   \"三篇整合：Hannah 說繞了二十分鐘才找到停車位；議員提議週末開放圖書館停車場給訪客，正是要解決找車位的問題。市場週日有營業；評論沒有提到排隊或公車票價。\")"),
]
NL, ESC = chr(10), chr(92) + "n"  # 文章在原始檔裡的換行是「\」加「n」兩個字元
R[0] = (R[0][0].replace(NL, ESC), R[0][1].replace(NL, ESC))
for a, b in R:
    assert s.count(a) == 1, (a[:60], s.count(a))
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")
print("ok")
