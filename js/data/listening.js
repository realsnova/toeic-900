// 聽力題庫：Part 2 應答問題 + Part 3 對話 + Part 4 短講
// 音訊由瀏覽器語音合成（speechSynthesis）即時朗讀，作答前不顯示文字稿

// Part 2：聽問句，從三個口說選項中選出最合適的回應（900+ 常考間接回應與陷阱）
const PART2 = [
  { q: "Where should I submit my expense report?", opts: ["Through the expense portal on the company intranet.", "About fifty dollars for the taxi and meals.", "The expenses were higher than last month's."], ans: 0, exp: "問「在哪裡交」，答「透過公司內部網站的報帳系統」。「About fifty dollars…」答的是金額；「The expenses were higher…」用 expense 做同字陷阱，沒回答在哪裡交。" },
  { q: "The client meeting has been moved to Thursday, hasn't it?", opts: ["Yes, the client had a scheduling conflict on Wednesday.", "He moved to Chicago with his family last year.", "In the conference room on the fifth floor."], ans: 0, exp: "附加問句確認會議是否改到週四：「是的，客戶週三時間衝突」。「He moved to Chicago…」用 moved 做同字陷阱；「In the conference room…」答的是地點。" },
  { q: "Why don't we order more toner for the printer?", opts: ["Good idea — I'll call the supplier.", "Because the last order arrived two days late.", "A ten-page document in color."], ans: 0, exp: "Why don't we…? 是提議，回答「好主意，我來聯絡廠商」。用 Because 開頭回答提議是常見陷阱；「A ten-page document…」用 printer 相關字聯想，答非所問。" },
  { q: "Who's leading the training session this afternoon?", opts: ["It's been postponed until next week.", "In the main auditorium on the second floor.", "About two hours, including a short break."], ans: 0, exp: "問誰帶訓練，間接回答「延到下週了」（今天下午不會有人帶）。另外兩個分別答地點和時間長度。" },
  { q: "Would you like the aisle seat or the window seat?", opts: ["The aisle, please.", "Yes, I would.", "It's a long flight."], ans: 0, exp: "選擇疑問句（A or B）必須擇一回答，不能用 Yes/No。「Yes, I would.」是最典型的陷阱。" },
  { q: "How often does the shuttle run downtown?", opts: ["Every twenty minutes.", "It runs on diesel.", "Since this morning."], ans: 0, exp: "How often 問頻率，答「每二十分鐘一班」。「It runs on diesel」用 run 做同字陷阱；「Since this morning」答的是從什麼時候開始。" },
  { q: "Haven't you finished the budget proposal yet?", opts: ["I'm still waiting for the sales figures.", "Yes, it's not finished.", "We'll need a bigger budget next quarter."], ans: 0, exp: "否定疑問句問「還沒完成嗎」，間接回答「還在等銷售數字」（所以還沒完成）。「Yes, it's not finished」前後矛盾；「We'll need a bigger budget…」用 budget 做同字陷阱。" },
  { q: "Could you forward me the agenda before the call?", opts: ["Sure, I'll send it right away.", "Four items.", "He called yesterday."], ans: 0, exp: "請對方轉寄議程，回答「好，馬上寄」。「Four items」描述議程內容，沒有回應請求；「He called yesterday」用 call 做同字陷阱。" },
  { q: "When will the renovations be completed?", opts: ["You'd have to ask the contractor.", "On the fourth floor.", "It cost a lot."], ans: 0, exp: "問什麼時候完工，間接回答「要問承包商」（我不知道）。另外兩個分別答地點和費用。" },
  { q: "Do you want me to book the conference room, or has that been done?", opts: ["Tanya already reserved it.", "A room with a view of the harbor.", "Yes, please do both of them."], ans: 0, exp: "選擇疑問句（要我訂，還是已經訂了？），回答「Tanya 已經訂了」。選擇疑問句不能用 Yes 回答；「A room with a view…」用 room 做同字陷阱。" },
  { q: "This café is pretty crowded, isn't it?", opts: ["There's another one around the corner.", "I'd like a coffee with milk, please.", "No, it's the most crowded one in town."], ans: 0, exp: "附加問句說「很擠吧」，間接回應「轉角還有另一家」（建議換一家）。「No, it's the most crowded…」前後矛盾；點咖啡是用 café 聯想，答非所問。" },
  { q: "Whose laptop is this in the meeting room?", opts: ["It might be Karen's — she was just there.", "It's the newest model with a larger screen.", "On the table next to the projector."], ans: 0, exp: "Whose 問是誰的，回答「可能是 Karen 的」。「It's the newest model…」描述筆電；「On the table…」答的是位置。" },
  { q: "Should we take the highway or the local roads?", opts: ["The highway's faster this time of day.", "Yes, let's leave right after the lunch meeting.", "I took the train to work yesterday."], ans: 0, exp: "選擇疑問句（高速公路還是一般道路），回答「這個時段高速公路比較快」。選擇疑問句不能用 Yes 回答；「I took the train…」用 took 做同字陷阱。" },
  { q: "The quarterly figures look better than expected.", opts: ["Yes, sales really picked up in the last two months.", "We publish them on a quarterly basis.", "I expected you to arrive much earlier."], ans: 0, exp: "對方說季度數字比預期好，回應「是啊，最近兩個月業績大幅回升」。「on a quarterly basis」用 quarterly 做同字陷阱；「I expected you…」用 expected 做同字陷阱。" },
  { q: "How do I get reimbursed for the conference fees?", opts: ["Just submit the receipts to accounting.", "It was a very informative conference.", "By next Friday at the very latest, I think."], ans: 0, exp: "How 問如何報帳，回答「把收據交給會計」。「It was a very informative conference」用 conference 做同字陷阱；「By next Friday…」答的是期限。" },
  { q: "Why was the product launch delayed?", opts: ["There was an issue with the packaging.", "At the convention center downtown.", "It launched successfully in three countries."], ans: 0, exp: "Why 問延期原因，回答「包裝出了問題」。「At the convention center」答地點；「It launched successfully」和「延期」矛盾。" },
  { q: "Has the marketing report been finalized?", opts: ["Dana's reviewing the last section now.", "The marketing department is on the third floor.", "Yes, a financial report."], ans: 0, exp: "問報告定稿了沒，間接回答「Dana 正在看最後一節」（還沒定稿）。「The marketing department is…」用 marketing 做同字陷阱，答的是地點；「Yes, a financial report」答非所問。" },
  { q: "When does the pharmacy on Fifth Street close?", opts: ["It's open around the clock.", "Near the bank.", "To pick up a prescription."], ans: 0, exp: "When 問幾點關門，間接回答「24 小時營業」。「Near the bank」答地點；「To pick up a prescription」答目的。" },
  { q: "Why don't you join us for lunch at the new bistro?", opts: ["I wish I could, but I'm on a deadline.", "A table for six by the window, please.", "The bistro opened on Main Street in May."], ans: 0, exp: "邀請一起吃午餐，委婉拒絕「我也想，但在趕期限」。「A table for six…」是訂位用語，答非所問；「The bistro opened…」用 bistro 做同字陷阱，沒有回應邀請。" },
  { q: "Who approved the overtime request?", opts: ["It didn't need approval.", "About ten hours.", "Over the weekend."], ans: 0, exp: "Who 問誰核准，間接回答「這不需要核准」。另外兩個分別答時數和時間。" },
  { q: "Where can I find the safety guidelines?", opts: ["They're posted on the bulletin board.", "By the end of the day, if possible.", "We've maintained a safe workplace for years."], ans: 0, exp: "Where 問在哪裡找得到，回答「貼在公告欄上」。「By the end of the day」答時間；「a safe workplace」用 safety／safe 做同字陷阱。" },
  { q: "You've met the new branch manager, haven't you?", opts: ["Briefly, at the orientation.", "It's a management position.", "Yes, I'll meet the deadline."], ans: 0, exp: "附加問句：「見過，在新人訓練時短暫見過」。「I'll meet the deadline」用 meet 的多義陷阱（趕上期限）。" },
  { q: "Would you mind switching shifts with me on Friday?", opts: ["Not at all — I'm free that day.", "Yes, the light switch is by the door.", "During the night shift at the warehouse."], ans: 0, exp: "Would you mind…? 回答 Not at all 表示「不介意」，也就是答應。「the light switch」用 switch 做同字陷阱；「During the night shift…」用 shift 做同字陷阱。" },
  { q: "How many people signed up for the wellness program?", opts: ["I don't know — the list hasn't been posted yet.", "Please sign at the bottom of the form.", "It's a great program for new employees."], ans: 0, exp: "How many 問人數，間接回答「不知道，名單還沒公布」。「sign at the bottom」用 sign 做同字陷阱；「It's a great program…」用 program 做同字陷阱。" },
  { q: "Where did you put the quarterly sales report?", opts: ["I emailed it to you this morning.", "Sales were about three percent higher.", "It was quite detailed and well written."], ans: 0, exp: "Where 問報告放哪裡，間接回答「今天早上寄給你了」。另外兩個描述報告內容，沒回答在哪裡。" },
  { q: "Isn't the new cafeteria opening this week?", opts: ["No, it's been pushed back a month.", "On the second floor, next to the gym.", "Yes, I opened the window."], ans: 0, exp: "否定疑問句問「不是這週開幕嗎」，回答「沒有，延後一個月了」。「On the second floor…」答地點；「I opened the window」用 open 做同字陷阱。" },
  { q: "Should I email the client or call them directly?", opts: ["A phone call would be more personal.", "Yes, please do that.", "The client was very satisfied with the results."], ans: 0, exp: "選擇疑問句（寄信還是打電話），回答「打電話比較有誠意」。選擇疑問句不能用 Yes 回答；「The client was very satisfied…」用 client 做同字陷阱。" },
  { q: "Who's responsible for ordering office supplies?", opts: ["That's handled by the admin team.", "In the storage room.", "Every two weeks."], ans: 0, exp: "Who 問誰負責，回答「行政團隊負責」。另外兩個分別答地點和頻率。" },
  { q: "The projector in Room B isn't working again.", opts: ["I'll put in a maintenance request.", "Yes, it's a great room for presentations.", "About two hours long, including questions."], ans: 0, exp: "對方說投影機又壞了，回應「我來提出維修申請」。「it's a great room」用 room 做同字陷阱；「About two hours long」答時間長度。" },
  { q: "Why has the delivery been delayed?", opts: ["The supplier ran out of stock.", "By express courier.", "To the warehouse."], ans: 0, exp: "Why 問延遲原因，回答「供應商缺貨」。另外兩個分別答運送方式和目的地。" },
  { q: "Could you recommend a good hotel near the airport?", opts: ["The Grandview usually has great rates.", "Yes, I flew there for a conference last week.", "It's a long flight, so bring a book."], ans: 0, exp: "請對方推薦飯店，回答「Grandview 的價格通常很好」。「I flew there…」「It's a long flight…」都用 airport 聯想到飛行，答非所問。" },
  { q: "Do you know when the shipment will clear customs?", opts: ["It should be released by Thursday.", "At the port, in a refrigerated container.", "A large container of office furniture."], ans: 0, exp: "問何時通關，回答「週四前應該會放行」。「At the port…」答地點；「A large container…」描述貨物，沒回答時間。" },
  { q: "Haven't the new brochures been printed yet?", opts: ["They'll be ready this afternoon.", "The printer is on the second floor.", "In the marketing office."], ans: 0, exp: "否定疑問句：「今天下午就會好」表示還沒印好。「The printer is on the second floor」是用 printed／printer 的同字陷阱；「In the marketing office」答的是地點。" },
  { q: "Would you prefer the morning or the afternoon session?", opts: ["The morning works better for me.", "Yes, I'd love to attend the session.", "It lasts about two hours with a break."], ans: 0, exp: "選擇疑問句（上午還是下午），回答「上午比較方便」。選擇疑問句不能用 Yes 回答；「It lasts about two hours…」答時間長度。" },
  { q: "How often is the equipment serviced?", opts: ["Once every six months.", "By an outside contractor.", "In the basement."], ans: 0, exp: "How often 問頻率，「每六個月一次」。「By an outside contractor」答執行者；「In the basement」答地點。" },
  { q: "Where can I get my parking validated?", opts: ["At the reception desk in the lobby.", "For up to three hours.", "It costs five dollars."], ans: 0, exp: "Where 問停車券在哪裡蓋章，回答「在大廳的接待櫃檯」。另外兩個分別答時間長度和費用。" },
  { q: "The client wants to move the meeting up to Monday.", opts: ["I'll check if the room's free.", "Yes, it was a productive meeting.", "The movers arrive on Monday morning."], ans: 0, exp: "客戶想把會議提前到週一，回應「我來看看會議室有沒有空」。「it was a productive meeting」用過去式描述會議；「The movers…」用 move 做同字陷阱。" },
  { q: "Why don't we outsource the translation work?", opts: ["That might actually save us time.", "In several different languages, I think.", "It was translated into French last year."], ans: 0, exp: "Why don't we…? 提議外包翻譯，回應「那說不定能省時間」。另外兩個用 translation 聯想，答非所問。" },
  { q: "Has anyone confirmed the venue for the awards dinner?", opts: ["Karen is finalizing it today.", "It was a lovely evening, wasn't it?", "About two hundred guests are expected."], ans: 0, exp: "問場地確認了沒，回答「Karen 今天會確定」。「It was a lovely evening」用過去式描述晚宴；「About two hundred guests」答人數。" },
  { q: "Which supplier offered the better price?", opts: ["We're still comparing the two quotes.", "By the end of the week at the latest.", "In bulk quantities only."], ans: 0, exp: "Which 問哪家價格比較好，間接回答「還在比較兩份報價」。另外兩個分別答期限和數量。" },
  { q: "You're attending the trade show in Berlin, aren't you?", opts: ["Yes, my flight leaves Tuesday.", "It was informative.", "At the convention center."], ans: 0, exp: "附加問句確認是否參加柏林展覽，回答「是的，我週二的班機」。「It was informative」用過去式，答非所問；「At the convention center」答地點。" },
  { q: "Should the report be printed in color or black and white?", opts: ["Color would look more professional.", "Yes, ten copies, please.", "By tomorrow morning, if that's possible."], ans: 0, exp: "選擇疑問句（彩色還是黑白），回答「彩色看起來比較專業」。選擇疑問句不能用 Yes 回答；「By tomorrow morning」答期限。" },
  { q: "How was the response to the customer survey?", opts: ["Better than we anticipated.", "By email and by phone.", "Around fifty questions in total."], ans: 0, exp: "How was… 問反應如何，回答「比預期好」。「By email and by phone」答方式；「Around fifty questions」答題數。" },
  { q: "Where should I store these confidential files?", opts: ["In the locked cabinet in my office.", "For at least seven years, by law.", "They contain highly sensitive information."], ans: 0, exp: "Where 問放在哪裡，回答「我辦公室上鎖的櫃子」。「For at least seven years」答保存期限；「They contain highly sensitive information」用 confidential 聯想，沒回答在哪裡。" },
  { q: "Didn't the maintenance crew fix the elevator?", opts: ["They're coming back tomorrow.", "The crew had lunch in the cafeteria.", "On the fifth and sixth floors."], ans: 0, exp: "否定疑問句問「維修人員不是修好了嗎」，間接回答「他們明天會再來」（還沒修好）。「The crew had lunch…」用 crew 做同字陷阱；「On the fifth and sixth floors」答地點。" },
  { q: "Would you like me to book a taxi or arrange a shuttle?", opts: ["A shuttle would be more economical.", "Yes, right away, please.", "To the airport by six o'clock tomorrow."], ans: 0, exp: "選擇疑問句（計程車還是接駁車），回答「接駁車比較省錢」。選擇疑問句不能用 Yes 回答；「To the airport…」答目的地。" },
  { q: "Why was the budget meeting canceled?", opts: ["The director had a scheduling conflict.", "In the main boardroom on the top floor.", "For about an hour every Monday."], ans: 0, exp: "Why 問會議取消的原因，回答「主管時間衝突」。另外兩個分別答地點和時間。" },
  { q: "How do I apply for the leadership program?", opts: ["There's a form on the intranet.", "It runs for six months.", "About twenty participants."], ans: 0, exp: "How 問如何申請，回答「內部網站上有表格」。另外兩個分別答期間和人數。" },
  { q: "The printer is out of toner again.", opts: ["I'll order some more right away.", "Yes, it prints very quickly in color.", "On the third floor, next to the kitchen."], ans: 0, exp: "對方說印表機又沒碳粉了，回應「我馬上再訂」。「it prints very quickly」用 printer 聯想；「On the third floor…」答地點。" },
  { q: "Who approved this expense report?", opts: ["It still needs the director's signature.", "About three hundred dollars for the hotel.", "Last Thursday, before the meeting."], ans: 0, exp: "Who 問誰核准，間接回答「還需要主管簽名」（還沒核准）。另外兩個分別答金額和時間。" },
  { q: "Isn't this the last day of the promotion?", opts: ["No, it runs through Sunday.", "At all of our locations nationwide.", "Twenty percent off all winter coats."], ans: 0, exp: "否定疑問句問「今天不是促銷最後一天嗎」，回答「不是，到週日」。另外兩個分別答地點和折扣內容。" },
  { q: "Where are the training sessions being held this year?", opts: ["They've moved to the downtown branch.", "Every Wednesday afternoon from two to four.", "By a certified instructor from headquarters."], ans: 0, exp: "Where 問在哪裡舉行，回答「搬到市中心分行了」。另外兩個分別答時間和講師。" },
  { q: "Could you send me the updated contact list?", opts: ["Sure, I'll forward it now.", "About fifty names.", "In alphabetical order."], ans: 0, exp: "請對方寄聯絡名單，回答「好，現在就轉寄」。另外兩個描述名單內容，沒回應請求。" },
  { q: "Why is the lobby closed off this morning?", opts: ["They're refinishing the floors.", "Until noon.", "Near the main entrance."], ans: 0, exp: "Why 問大廳為什麼封閉，回答「正在重新整修地板」。「Until noon」答到什麼時候；「Near the main entrance」答地點。" },
  { q: "Do you want to review the slides before the presentation?", opts: ["Yes, could you email them over?", "It went very well, thanks for asking.", "In the conference room on the second floor."], ans: 0, exp: "問要不要先看簡報，回答「好，可以寄給我嗎？」。「It went very well」用過去式說簡報（還沒發生）；「In the conference room…」答地點。" },
  { q: "How long has Ms. Tanaka been with the company?", opts: ["She joined about a decade ago.", "In the finance department.", "As a senior analyst."], ans: 0, exp: "How long 問在公司多久，回答「大約十年前加入」。另外兩個分別答部門和職位。" },
  { q: "Shouldn't we notify the clients about the price change?", opts: ["A notice is already being drafted.", "I changed my phone number last week.", "By about five percent for most items."], ans: 0, exp: "否定疑問句＋間接回應：「通知已經在草擬了」表示會通知。「I changed my phone number」用 change 做同字陷阱；「By about five percent」答的是漲幅。" },
  { q: "Where did the shipment get held up?", opts: ["Somewhere at the border crossing, I heard.", "For over a week, unfortunately.", "It was packed in sealed containers."], ans: 0, exp: "Where 問貨在哪裡被卡住，回答「聽說是在邊境關口」。「For over a week」答時間長度；「It was packed…」描述包裝。" },
  { q: "Would you rather lead the project or support it?", opts: ["I'd be happy to take the lead.", "Yes, it's an exciting project.", "Over the next quarter."], ans: 0, exp: "選擇疑問句擇一回答。「Yes, it's an exciting project」用 Yes 回答是陷阱。" },
  { q: "Why haven't the invoices been sent to accounting?", opts: ["I'm still waiting on two receipts.", "By the end of the day at the latest.", "In the top drawer of my desk."], ans: 0, exp: "Why 問發票為什麼還沒送會計，回答「還在等兩張收據」。「By the end of the day」答時間；「In the top drawer…」答地點。" },
  // ---- S2（2026-10-11）：新題 40 題，兩位獨立審查者盲解一致 ----
  { q: "When is the new branch opening?", opts: ["Sometime in early spring.", "On Maple Avenue, near the bank.", "Yes, it's a branch of the bank."], ans: 0, exp: "When 問時間，回答「春初的某個時候」。「On Maple Avenue…」答地點；「Yes, it's a branch…」用 Yes 回答 When 問句，而且 branch 是同字陷阱。", src: "S2" },
  { q: "Who's going to train the new interns?", opts: ["Ms. Okoro volunteered to do it.", "They start on Monday.", "The train leaves at noon."], ans: 0, exp: "Who 問誰負責訓練，回答「Okoro 女士自願擔任」。「They start on Monday」答時間；「The train leaves…」用 train 做同字陷阱（訓練／火車）。", src: "S2" },
  { q: "Where can I recharge my phone?", opts: ["There's an outlet behind the sofa.", "About two hours ago, before the meeting started.", "Yes, the charge was refunded."], ans: 0, exp: "Where 問在哪裡充電，回答「沙發後面有插座」。「About two hours ago」答時間；「the charge was refunded」用 charge 做同字陷阱（充電／費用）。", src: "S2" },
  { q: "Why was the meeting moved to Room 6?", opts: ["Room 4 is being painted.", "At two o'clock this afternoon.", "I moved here three years ago."], ans: 0, exp: "Why 問原因，回答「4 號會議室在油漆」。「At two o'clock…」答時間；「I moved here…」用 moved 做同字陷阱。", src: "S2" },
  { q: "How long will the inspection take?", opts: ["Most of the afternoon, I'd guess.", "The inspector arrives at nine.", "It's a long hallway."], ans: 0, exp: "How long 問需要多久，回答「我猜大概一個下午」。「The inspector arrives at nine」答幾點來；「It's a long hallway」用 long 做同字陷阱。", src: "S2" },
  { q: "Which hotel did you book for the conference?", opts: ["I haven't decided yet.", "Three nights, starting Tuesday.", "The conference was very useful."], ans: 0, exp: "Which 問訂哪家飯店，間接回答「還沒決定」。「Three nights…」答住幾晚；「The conference was very useful」用 conference 做同字陷阱。", src: "S2" },
  { q: "Would you like some help carrying those boxes?", opts: ["Thanks, they're heavier than they look.", "Yes, I'd like a box of pens.", "In the supply closet."], ans: 0, exp: "提議幫忙搬箱子，回答「謝謝，它們比看起來重」，表示接受幫忙。「a box of pens」用 box 做同字陷阱；「In the supply closet」答地點。", src: "S2" },
  { q: "Can you review my report before I submit it?", opts: ["Sure, send it over.", "It was reviewed by the board.", "The deadline was last month."], ans: 0, exp: "請對方幫忙看報告，回答「好，寄過來」。「It was reviewed by the board」用 review 做同字陷阱；「The deadline was last month」說期限已過，和「還沒交」的情況矛盾。", src: "S2" },
  { q: "Didn't Mr. Hill approve the budget yesterday?", opts: ["He's still reviewing a few items.", "A budget of ten thousand dollars.", "Yes, a budget hotel."], ans: 0, exp: "否定疑問句問「Hill 先生昨天不是核准了嗎」，間接回答「他還在看幾個項目」（還沒核准）。另外兩個用 budget 做同字陷阱，答非所問。", src: "S2" },
  { q: "Should we take a taxi or walk to the restaurant?", opts: ["It's only five minutes away.", "Yes, the restaurant was excellent.", "A table for four, please."], ans: 0, exp: "選擇疑問句（搭計程車還是走路），間接回答「只要五分鐘」（走路就好）。選擇疑問句不能用 Yes 回答；「A table for four」是訂位用語。", src: "S2" },
  { q: "The printer on the second floor is jammed again.", opts: ["I'll call the technician.", "Print two copies, please.", "On the second floor, next to the elevator."], ans: 0, exp: "對方說印表機又卡紙了，回應「我來找技術人員」。「Print two copies」用 print 聯想；「On the second floor…」重複題目的地點，答非所問。", src: "S2" },
  { q: "You've worked with this client before, haven't you?", opts: ["Yes, on last year's ad campaign.", "He works on the fifth floor.", "The client signed the contract last week."], ans: 0, exp: "附加問句確認以前是否合作過，回答「是的，在去年的廣告活動」。「He works on the fifth floor」用 work 做同字陷阱；「The client signed…」用 client 做同字陷阱。", src: "S2" },
  { q: "Why don't we hold the training session online?", opts: ["That would save on travel costs.", "Because the session was canceled.", "Online banking is convenient."], ans: 0, exp: "Why don't we…? 是提議，回答「那可以省下交通費」表示贊成。用 Because 回答提議是常見陷阱；「Online banking…」用 online 做同字陷阱。", src: "S2" },
  { q: "What time does the post office close today?", opts: ["At five thirty, I think.", "Next to the pharmacy.", "I posted it on the website."], ans: 0, exp: "What time 問幾點關門，回答「我想是五點半」。「Next to the pharmacy」答地點；「I posted it…」用 post 做同字陷阱。", src: "S2" },
  { q: "Is this seat taken?", opts: ["No, go right ahead.", "Yes, I took it yesterday.", "A window seat, please."], ans: 0, exp: "問「這個位子有人嗎」，回答「沒有，請坐」。「Yes, I took it yesterday」用 take 做同字陷阱，語意不通；「A window seat, please」是訂位用語。", src: "S2" },
  { q: "How did the product demonstration go?", opts: ["Better than we expected.", "It went to the Boston office.", "The product is sold online."], ans: 0, exp: "How did… go? 問進行得如何，回答「比預期好」。「It went to the Boston office」用 go／went 做同字陷阱；「The product is sold online」用 product 做同字陷阱。", src: "S2" },
  { q: "Who should I give these invoices to?", opts: ["Leave them on Gina's desk.", "Thirty dollars each.", "I gave a presentation yesterday."], ans: 0, exp: "Who 問要交給誰，間接回答「放在 Gina 的桌上」。「Thirty dollars each」答金額；「I gave a presentation」用 give 做同字陷阱。", src: "S2" },
  { q: "Aren't you presenting at the sales meeting?", opts: ["No, Patrick is doing it this time.", "The sales figures were strong.", "It meets every Monday."], ans: 0, exp: "否定疑問句問「你不是要在業務會議上報告嗎」，回答「不是，這次由 Patrick 報告」。另外兩個分別用 sales、meeting 做聯想，答非所問。", src: "S2" },
  { q: "Could you show me how to use the scanner?", opts: ["I'm in a meeting until three, actually.", "It scans both sides.", "Yes, I showed it to him and his whole team."], ans: 0, exp: "請對方教用掃描器，間接回答「其實我開會到三點」（現在沒空）。「It scans both sides」描述功能，沒回應請求；「I showed it to him」用 show 做同字陷阱。", src: "S2" },
  { q: "Do you know where the extra chairs are kept?", opts: ["Check the storage room downstairs.", "Yes, I'll keep it.", "Ten more people are coming."], ans: 0, exp: "問多的椅子放在哪裡，回答「去樓下儲藏室找」。「Yes, I'll keep it」用 keep 做同字陷阱；「Ten more people are coming」說的是人數。", src: "S2" },
  { q: "When will the shipment from Korea arrive?", opts: ["It's been delayed at customs.", "By air freight.", "Korea has great food."], ans: 0, exp: "When 問何時到，間接回答「在海關被耽擱了」。「By air freight」答運送方式；「Korea has great food」用 Korea 做聯想。", src: "S2" },
  { q: "Why is the parking lot so full today?", opts: ["There's a job fair in the lobby.", "Park on the second level.", "It's full of useful information."], ans: 0, exp: "Why 問停車場為什麼這麼滿，回答「大廳在辦徵才博覽會」。「Park on the second level」告訴對方停哪裡，沒回答原因；「It's full of useful information」用 full 做同字陷阱。", src: "S2" },
  { q: "Have the new uniforms been delivered?", opts: ["They're in the back room.", "Yes, the uniform size chart.", "Deliver them to the lobby."], ans: 0, exp: "問新制服送來了沒，間接回答「在後面的房間」（已經送到）。「Yes, the uniform size chart」答非所問；「Deliver them to the lobby」用 deliver 做同字陷阱，是指示而不是回答。", src: "S2" },
  { q: "Where's the nearest gas station?", opts: ["There's one just past the bridge.", "About forty dollars to fill up.", "Yes, it's nearly empty."], ans: 0, exp: "Where 問最近的加油站，回答「過橋就有一家」。「About forty dollars…」答加滿的費用；「Yes, it's nearly empty」用 Yes 回答 Where 問句。", src: "S2" },
  { q: "I can't find the contract you sent me.", opts: ["I'll e-mail it again.", "The contractor is here.", "The contract runs for two years."], ans: 0, exp: "對方說找不到合約，回應「我再寄一次」。「The contractor is here」用 contract／contractor 做相似字陷阱；「The contract runs for two years」描述合約內容，沒解決問題。", src: "S2" },
  { q: "How often do you back up the files?", opts: ["Every Friday afternoon.", "Back up the truck, please.", "In the cloud folder."], ans: 0, exp: "How often 問頻率，回答「每週五下午」。「Back up the truck」用 back up 做同字陷阱（備份／倒車）；「In the cloud folder」答地點。", src: "S2" },
  { q: "Would you rather meet on Tuesday or Wednesday?", opts: ["Either works for me.", "Yes, I'd rather not.", "The meeting went well."], ans: 0, exp: "選擇疑問句（週二還是週三），回答「哪天都可以」。選擇疑問句不能用 Yes 回答；「The meeting went well」用過去式描述會議，答非所問。", src: "S2" },
  { q: "Isn't the cafeteria closed on weekends?", opts: ["Only on Sundays.", "The café sells sandwiches.", "It's close to the station."], ans: 0, exp: "否定疑問句問「週末不是休息嗎」，回答「只有週日休息」。「The café sells sandwiches」用 café 聯想；「It's close to the station」用 close 做同字陷阱（關門／靠近）。", src: "S2" },
  { q: "Why did Ms. Duval leave early?", opts: ["She had a dentist appointment.", "Leave it on the table by the front entrance.", "Early in the morning."], ans: 0, exp: "Why 問提早離開的原因，回答「她要看牙醫」。「Leave it on the table」用 leave 做同字陷阱；「Early in the morning」用 early 做同字陷阱。", src: "S2" },
  { q: "Can I pay with a credit card?", opts: ["Yes, we accept all major cards.", "A birthday card for my sister.", "It costs twenty dollars."], ans: 0, exp: "問能不能刷卡，回答「可以，主要的卡都收」。「A birthday card…」用 card 做同字陷阱；「It costs twenty dollars」答價格。", src: "S2" },
  { q: "Who's in charge of the holiday party this year?", opts: ["The events committee is planning it.", "Last December.", "Charge it to my company account, please."], ans: 0, exp: "Who 問誰負責，回答「活動委員會在籌劃」。「Last December」答時間；「Charge it to my company account」用 charge 做同字陷阱。", src: "S2" },
  { q: "The quarterly report needs a few more changes.", opts: ["I'll revise it this afternoon.", "Change for a twenty, please.", "Every quarter."], ans: 0, exp: "對方說季報還要再改，回應「我今天下午修改」。「Change for a twenty」用 change 做同字陷阱（修改／零錢）；「Every quarter」用 quarterly 聯想，答非所問。", src: "S2" },
  { q: "Did you get the message I left?", opts: ["Sorry, my phone was off.", "The left side of the screen.", "A message board."], ans: 0, exp: "問有沒有收到留言，間接回答「抱歉，我手機關機了」（沒收到）。「The left side of the screen」用 left 做同字陷阱（留下／左邊）；「A message board」用 message 做同字陷阱。", src: "S2" },
  { q: "Which of these designs do you prefer?", opts: ["The blue one stands out more.", "A graphic designer.", "I prefer to work from home."], ans: 0, exp: "Which 問比較喜歡哪個設計，回答「藍色那個比較醒目」。「A graphic designer」用 design 聯想；「I prefer to work from home」用 prefer 做同字陷阱。", src: "S2" },
  { q: "How much does the annual membership cost?", opts: ["It depends on the plan you choose.", "Every year in June.", "A membership card."], ans: 0, exp: "How much 問費用，間接回答「要看你選哪個方案」。「Every year in June」答時間；「A membership card」用 membership 做同字陷阱。", src: "S2" },
  { q: "Where should we put the new printer?", opts: ["How about next to the copier?", "It prints in color.", "We bought it on sale last week from an online store."], ans: 0, exp: "Where 問印表機放哪裡，用反問提出建議「放在影印機旁邊如何？」。「It prints in color」描述功能；最後一個說的是在哪裡買的，答非所問。", src: "S2" },
  { q: "Let's order lunch for the whole team.", opts: ["Good idea — I'll get the menu.", "The team won the game.", "I ordered it online two weeks ago from the warehouse."], ans: 0, exp: "提議幫全隊訂午餐，回應「好主意，我去拿菜單」。「The team won the game」用 team 做同字陷阱；最後一個用 order 做同字陷阱，答非所問。", src: "S2" },
  { q: "Weren't the sales figures supposed to be ready by now?", opts: ["Accounting asked for one more day.", "Yes, they're for sale.", "Yes, the store's sale ends on Sunday afternoon."], ans: 0, exp: "否定疑問句問「銷售數字不是應該好了嗎」，間接回答「會計部要求再多一天」。另外兩個都用 sale 做同字陷阱，答非所問。", src: "S2" },
  { q: "Why don't you ask Mr. Kim for advice?", opts: ["He's out of the office this week.", "Because he gave me some advice.", "I asked for the bill and paid it at the front counter."], ans: 0, exp: "Why don't you…? 是建議，間接回答「他這週不在辦公室」（沒辦法問）。用 Because 回答建議是常見陷阱；最後一個用 ask 做同字陷阱，答非所問。", src: "S2" },
  { q: "When does your flight leave?", opts: ["Not until tomorrow night.", "From Gate 12, I believe.", "I'm flying with my two colleagues from the marketing department."], ans: 0, exp: "When 問班機何時起飛，回答「明天晚上才飛」。「From Gate 12」答登機門；最後一個答的是和誰同行。", src: "S2" }
];

// Part 3 對話 + Part 4 短講（turns: M=男聲, W=女聲, N=旁白/單人）
const PART34 = [
  {
    type: "Part 3", title: "對話：印表機故障",
    turns: [
      { s: "W", t: "Hi Marcus, the color printer on our floor is jammed again, and I need to print fifty copies of the client proposal before the three o'clock meeting." },
      { s: "M", t: "Again? That's the third time this week. I already put in a repair request — the technician said he can't come until tomorrow morning." },
      { s: "W", t: "Tomorrow's too late. Is there another printer I can use?" },
      { s: "M", t: "The marketing department on the third floor has the same model. I'll call their office manager and let her know you're coming down." }
    ],
    qs: [
      { q: "What problem does the woman have?", opts: ["A printer is not working.", "A meeting was canceled.", "A proposal was rejected.", "A technician is unavailable today."], ans: 0, exp: "女子開頭就說 the color printer is jammed again。「技師今天不能來」雖然也是事實，但那是男子補充的資訊，不是「女子的問題」。" },
      { q: "What does the man say about the technician?", opts: ["He cannot come until the next day.", "He already fixed the printer.", "He works in the marketing department.", "He will attend the 3 o'clock meeting."], ans: 0, exp: "男子說 the technician... can't come until tomorrow morning。" },
      { q: "What will the man most likely do next?", opts: ["Contact another department", "Repair the printer himself", "Postpone the client meeting", "Print the proposal"], ans: 0, exp: "男子最後說 I'll call their office manager（打給三樓行銷部），即聯繫其他部門。" }
    ]
  },
  {
    type: "Part 3", title: "對話：出差與報帳",
    turns: [
      { s: "M", t: "Hi Priya, I just found out my flight to the Denver conference was canceled. The airline rebooked me on a flight that arrives Tuesday night instead of Tuesday morning." },
      { s: "W", t: "That's cutting it close — your presentation is Wednesday at nine. Have you told the organizers?" },
      { s: "M", t: "Not yet. Actually, I was wondering if I should just book a different airline myself. The travel desk couldn't find anything earlier." },
      { s: "W", t: "You can, but remember you need written approval from Mr. Danvers first, or finance won't reimburse it. Send him an email now — he usually replies within the hour." }
    ],
    qs: [
      { q: "Why is the man concerned?", opts: ["His new flight arrives later than planned.", "His presentation was canceled.", "He lost his airline ticket.", "He missed a deadline for a report."], ans: 0, exp: "男子的班機被取消，改訂的班機晚上才到，距離週三早上的簡報時間很緊。" },
      { q: "What does the woman remind the man to do?", opts: ["Obtain a supervisor's approval in writing", "Cancel his hotel reservation", "Submit his receipts to the travel desk", "Postpone his presentation"], ans: 0, exp: "女子提醒：自行訂票前要先取得 Mr. Danvers 的書面核准，否則財務不會核銷。" },
      { q: "What does the woman imply about Mr. Danvers?", opts: ["He responds to messages quickly.", "He is attending the same conference.", "He rarely approves travel requests.", "He works for the airline."], ans: 0, exp: "女子說 he usually replies within the hour，暗示他回覆訊息很快。「暗示題」是 900+ 必拿的題型。" }
    ]
  },
  {
    type: "Part 3", title: "對話：籌辦退休餐會",
    turns: [
      { s: "W", t: "Have you found a venue for Elaine's retirement dinner yet? We're expecting about thirty people." },
      { s: "M", t: "I checked out the Harborview Grill. Their private room seats thirty-five, and they offer a set menu at forty dollars per person." },
      { s: "W", t: "That's within budget. The only thing is, several people on the guest list are vegetarian." },
      { s: "M", t: "I asked about that — they can substitute a mushroom risotto at no extra charge. I'll email you the menu, and if it looks good, I'll put down the deposit this afternoon." }
    ],
    qs: [
      { q: "What event are the speakers planning?", opts: ["A retirement celebration", "A product launch", "A client banquet", "A holiday party"], ans: 0, exp: "開頭即說 Elaine's retirement dinner（退休餐會）。" },
      { q: "What concern does the woman mention?", opts: ["Some guests have dietary restrictions.", "The room is too small.", "The price exceeds the budget.", "The venue is fully booked."], ans: 0, exp: "女子說 several people on the guest list are vegetarian（有些賓客吃素）。價格與空間都沒有問題。" },
      { q: "What will the man send the woman?", opts: ["A menu", "A deposit receipt", "A guest list", "A seating chart"], ans: 0, exp: "男子說 I'll email you the menu。" }
    ]
  },
  {
    type: "Part 4", title: "短講：機場登機門廣播",
    turns: [
      { s: "N", t: "Attention passengers on Flight 782 to Vancouver. Due to strong winds at the departure airport, boarding will be delayed by approximately ninety minutes. The new boarding time is seven forty-five p.m., and the departure gate has been changed from Gate 12 to Gate 30, located near the food court. As an apology for the inconvenience, meal vouchers worth fifteen dollars are available at the customer service counter next to Gate 30. Please have your boarding pass ready. We thank you for your patience and understanding." }
    ],
    qs: [
      { q: "What has caused the delay?", opts: ["Weather conditions", "A mechanical problem", "A crew shortage", "Runway construction"], ans: 0, exp: "廣播說 Due to strong winds（強風），屬於天候因素。" },
      { q: "What change is announced?", opts: ["The departure gate", "The destination city", "The airline carrier", "The baggage policy"], ans: 0, exp: "登機門從 Gate 12 改為 Gate 30。" },
      { q: "What can passengers get at the customer service counter?", opts: ["Food vouchers", "Free headphones", "Seat upgrades", "Hotel coupons"], ans: 0, exp: "廣播提到 meal vouchers worth fifteen dollars（十五美元餐券）可在客服櫃檯領取。" }
    ]
  },
  {
    type: "Part 4", title: "短講：供應商語音留言",
    turns: [
      { s: "N", t: "Hello, this message is for Angela Reyes. This is Tom from Brightline Office Supplies, returning your call about order number 4471. Unfortunately, the ergonomic keyboards you requested are on back order and won't arrive for another three weeks. However, we do have a comparable model from a different manufacturer in stock — it has the same features and is actually ten percent cheaper. If you'd like to switch, just reply to the confirmation email we sent this morning, and we can ship them out tomorrow. Otherwise, we'll keep your original order on file. Thanks, and have a great day." }
    ],
    qs: [
      { q: "Why is the speaker calling?", opts: ["To explain a problem with an order", "To advertise a new store location", "To request a payment", "To schedule a delivery time"], ans: 0, exp: "來電說明訂購的鍵盤缺貨（on back order），需要三週後才到貨。" },
      { q: "What does the speaker say about the alternative product?", opts: ["It costs less than the original item.", "It has more features.", "It requires three weeks to ship.", "It was made by the same manufacturer."], ans: 0, exp: "替代品 is actually ten percent cheaper（便宜一成）。注意「同一製造商」是陷阱：留言說的是「不同」製造商。" },
      { q: "What should the listener do if she wants the substitute?", opts: ["Reply to an email", "Visit the store", "Call back after three weeks", "Cancel her original order"], ans: 0, exp: "留言指示 reply to the confirmation email（回覆今早寄出的確認信）即可換貨。" }
    ]
  },
  {
    type: "Part 4", title: "短講：公司內部會議開場",
    turns: [
      { s: "N", t: "Good morning, everyone, and thanks for joining this month's all-staff meeting. Before we get to the sales update, I have an important announcement. Starting next Monday, the parking garage beneath our building will be closed for structural repairs, which are expected to last about six weeks. During this period, employees may park free of charge at the Westfield lot, two blocks north of here — just show your employee badge at the entrance. For those who prefer public transportation, the company will cover the full cost of a monthly transit pass. To request one, fill out the form on the HR portal by this Friday. Now, let's move on to the sales figures." }
    ],
    qs: [
      { q: "What is the announcement mainly about?", opts: ["A temporary facility closure", "A new sales strategy", "A change in work schedules", "An upcoming staff banquet"], ans: 0, exp: "宣布停車場因結構整修關閉六週，屬於設施暫時關閉。" },
      { q: "According to the speaker, what should employees show at the Westfield lot?", opts: ["An employee badge", "A parking permit", "A monthly invoice", "A repair notice"], ans: 0, exp: "show your employee badge at the entrance（出示員工識別證）。" },
      { q: "Why should listeners visit the HR portal by Friday?", opts: ["To request a transit pass", "To reserve a parking space", "To sign up for the meeting", "To review the sales figures"], ans: 0, exp: "想要公司補助的月票（transit pass）須在週五前於 HR 入口網站填表申請。" }
    ]
  },
  {
    type: "Part 3", title: "對話：商品退貨",
    turns: [
      { s: "M", t: "Good afternoon, this is Ray at the Beacon Electronics service desk. How can I help you?" },
      { s: "W", t: "Hi, I bought a wireless keyboard from your online store two weeks ago, but several of the keys have already stopped responding. I'd like a refund." },
      { s: "M", t: "I'm sorry to hear that. Since it's within thirty days, you're eligible for a full refund — but I'll need the order confirmation number from the email we sent you." },
      { s: "W", t: "Hmm, I may have deleted that email. Is there another way to look it up?" },
      { s: "M", t: "No problem. If you give me the phone number on the account, I can pull up the order and email you a prepaid return label right away." }
    ],
    qs: [
      { q: "Why is the woman calling?", opts: ["To return a defective product", "To cancel a subscription", "To ask about a delivery date", "To upgrade her keyboard"], ans: 0, exp: "女子說鍵盤部分按鍵失靈，想要退款（I'd like a refund），屬於瑕疵品退貨。" },
      { q: "What problem does the woman mention?", opts: ["She no longer has a confirmation email.", "She missed the return deadline.", "She lost the product receipt in the store.", "She was charged twice for the order."], ans: 0, exp: "男子要求訂單確認編號時，女子說 I may have deleted that email（可能刪掉了確認信）。" },
      { q: "What does the man ask the woman to provide?", opts: ["A phone number", "A mailing address", "A credit card number", "A model number"], ans: 0, exp: "男子說給他帳戶上的電話號碼（the phone number on the account）就能調出訂單。" }
    ]
  },
  {
    type: "Part 4", title: "短講：家具行廣播廣告",
    turns: [
      { s: "N", t: "Is your home office due for an upgrade? Then head over to Fairfield Furniture's annual warehouse sale, running this Friday through Sunday only. Every desk, chair, and bookshelf is marked down by at least thirty percent, and our best-selling ergonomic chairs are half price while supplies last. Can't make it in person? No problem — the same discounts apply on our website, with free delivery on any purchase over two hundred dollars. And here's something special: the first fifty customers through the door on Friday morning will receive a complimentary desk lamp. Fairfield Furniture — where comfort meets craftsmanship." }
    ],
    qs: [
      { q: "What is being advertised?", opts: ["A furniture sale", "A grand opening", "A home renovation service", "An office rental"], ans: 0, exp: "廣告主打 Fairfield Furniture 的年度倉庫特賣（annual warehouse sale）。" },
      { q: "According to the advertisement, how can customers receive free delivery?", opts: ["By spending more than $200 online", "By visiting the store on Friday", "By joining a membership program", "By ordering before Thursday"], ans: 0, exp: "網站購物滿兩百美元即免運（free delivery on any purchase over two hundred dollars）。" },
      { q: "What will the first fifty customers on Friday receive?", opts: ["A free lamp", "A discount coupon", "An ergonomic chair", "A gift card"], ans: 0, exp: "週五早上前五十名進門的顧客可獲贈檯燈（complimentary desk lamp）。complimentary = 贈送的。" }
    ]
  },
  {
    type: "Part 3", title: "對話：軟體升級安排",
    turns: [
      { s: "W", t: "Hi Daniel, IT is planning to upgrade the accounting software this weekend. Will that affect our team's access on Monday?" },
      { s: "M", t: "It shouldn't. The upgrade finishes Sunday night, and everything should be back to normal by Monday morning. But you'll need to reset your password the first time you log in." },
      { s: "W", t: "Good to know. Should I back up my current reports just in case?" },
      { s: "M", t: "That's a smart idea. I'd export anything you're actively working on. I'll send everyone a step-by-step guide this afternoon so no one gets stuck." }
    ],
    qs: [
      { q: "What is the conversation mainly about?", opts: ["An upcoming software upgrade", "A new hiring policy", "A budget review", "An office relocation"], ans: 0, exp: "對話開頭即談 IT 週末要升級會計軟體，圍繞這件事展開。" },
      { q: "What does the man say users will need to do?", opts: ["Reset their passwords", "Attend a training session", "Submit a request form", "Work from home on Monday"], ans: 0, exp: "男子說第一次登入時 you'll need to reset your password（需重設密碼）。" },
      { q: "What will the man do this afternoon?", opts: ["Send out a step-by-step guide", "Back up the woman's reports", "Cancel the upgrade", "Meet with the accounting team"], ans: 0, exp: "男子說 I'll send everyone a step-by-step guide this afternoon（下午寄操作指南）。" }
    ]
  },
  {
    type: "Part 3", title: "對話：租借會議場地",
    turns: [
      { s: "M", t: "Thank you for calling Lakeside Conference Center. How may I help you?" },
      { s: "W", t: "Hi, I'd like to book a room for a product training on March 15th, for about forty people." },
      { s: "M", t: "Let me check. Yes, our Maple Room seats fifty and it's available that day. It comes with a projector and free Wi-Fi. Would you like catering as well?" },
      { s: "W", t: "Yes, a light lunch for everyone. Could you email me a quote with the room and catering costs so I can get it approved by my manager?" },
      { s: "M", t: "Of course. I'll send that within the hour. Just note that we require a fifty percent deposit to confirm the booking." }
    ],
    qs: [
      { q: "Why is the woman calling?", opts: ["To reserve a room for an event", "To cancel a reservation", "To apply for a job", "To complain about a service"], ans: 0, exp: "女子要為三月十五日的產品訓練預訂容納約四十人的場地。" },
      { q: "What does the woman ask the man to send?", opts: ["A price quote", "A room map", "A guest list", "A signed contract"], ans: 0, exp: "女子請對方 email me a quote（寄含場地與餐飲費用的報價）以便呈主管核准。" },
      { q: "What is required to confirm the booking?", opts: ["A fifty percent deposit", "A signed waiver", "A membership card", "Full payment in advance"], ans: 0, exp: "男子說 we require a fifty percent deposit to confirm（需五成訂金確認）。" }
    ]
  },
  {
    type: "Part 3", title: "對話：客訴處理",
    turns: [
      { s: "W", t: "Hello, I ordered a desk lamp from your website, but it arrived with a cracked base. This is quite disappointing." },
      { s: "M", t: "I'm very sorry about that. I can either send you a replacement right away or process a full refund. Which would you prefer?" },
      { s: "W", t: "I'd still like the lamp, so a replacement would be best. But I don't want to pay for return shipping." },
      { s: "M", t: "Absolutely, you won't. I'll email you a prepaid return label, and the new lamp will ship today. You should have it within three business days." }
    ],
    qs: [
      { q: "What problem does the woman describe?", opts: ["A product arrived damaged", "An order never arrived", "She was charged twice", "The wrong item was sent"], ans: 0, exp: "女子說檯燈送達時底座裂了（arrived with a cracked base），屬於商品損壞。" },
      { q: "What does the woman decide to do?", opts: ["Request a replacement", "Accept a refund", "Keep the damaged lamp", "Cancel her account"], ans: 0, exp: "女子說她還是想要檯燈，所以選擇更換（a replacement would be best）。" },
      { q: "What does the man agree to provide?", opts: ["A prepaid return label", "A discount coupon", "A gift card", "An extended warranty"], ans: 0, exp: "男子說會 email you a prepaid return label（寄預付運費的退貨標籤）。" }
    ]
  },
  {
    type: "Part 4", title: "短講：員工訓練說明",
    turns: [
      { s: "N", t: "Good morning, everyone, and welcome to the customer service training. Over the next two days, we'll focus on handling difficult calls and using our new ticketing system. Today's session will be mostly hands-on, so please log in to the practice accounts we've set up for you. Before we begin, a quick reminder: the cafeteria is offering a free lunch for all training participants, so be sure to keep your name badge with you. We'll break at noon and resume at one o'clock. If you have any technical issues logging in, raise your hand and one of our assistants will help you right away." }
    ],
    qs: [
      { q: "What is the main purpose of the talk?", opts: ["To introduce a training session", "To announce a company merger", "To launch a new product", "To review last year's sales"], ans: 0, exp: "講者歡迎大家參加客服訓練，並說明兩天的內容，屬於訓練說明。" },
      { q: "What are listeners asked to do before beginning?", opts: ["Log in to practice accounts", "Sign an attendance sheet", "Read a handbook", "Introduce themselves"], ans: 0, exp: "講者請大家 log in to the practice accounts（登入練習帳號）。" },
      { q: "Why should participants keep their name badges?", opts: ["To receive a free lunch", "To enter the building", "To claim a certificate", "To access the parking lot"], ans: 0, exp: "餐廳為訓練學員提供免費午餐，需憑名牌（keep your name badge with you）。" }
    ]
  },
  {
    type: "Part 4", title: "短講：博物館導覽廣播",
    turns: [
      { s: "N", t: "Welcome to the Riverside Museum of Modern Art. Please note that the third-floor photography exhibit is temporarily closed for the installation of a new collection and will reopen next Saturday. In the meantime, we invite you to explore our newly renovated sculpture garden on the ground floor. Guided tours depart from the main lobby every hour on the hour and are included with your admission. Photography is permitted throughout the museum, but please refrain from using flash, as it can damage the artwork. The gift shop and café are located near the east entrance and remain open until six p.m. Enjoy your visit." }
    ],
    qs: [
      { q: "Why is the third-floor exhibit closed?", opts: ["A new collection is being installed", "The lighting is being repaired", "It is being cleaned", "An event is taking place"], ans: 0, exp: "廣播說三樓攝影展因 installation of a new collection（安裝新館藏）暫時關閉。" },
      { q: "What does the speaker say about the guided tours?", opts: ["They are included with admission", "They must be booked in advance", "They cost an extra fee", "They are only on weekends"], ans: 0, exp: "導覽 included with your admission（含在門票內），每小時整點從大廳出發。" },
      { q: "What are visitors asked NOT to do?", opts: ["Use flash photography", "Bring food inside", "Touch the sculptures", "Enter the garden"], ans: 0, exp: "廣播請訪客 refrain from using flash（勿使用閃光燈），以免損害藝術品。" }
    ]
  },
  // ---- S2（2026-10-11）：新制題組 10 組（圖表題、三人對話、意圖題）----
  {
    type: "Part 3",
    title: "對話：訪客問路（圖表題）",
    src: "S2",
    graphic: "BUILDING DIRECTORY\nFloor 2 ... Marketing\nFloor 3 ... Customer Service\nFloor 4 ... Accounting / Legal\nFloor 5 ... Executive Offices",
    turns: [
      { s: "W", t: "Hi, I'm here for the two o'clock interview with Ms. Grant in human resources. Could you tell me where her office is?" },
      { s: "M", t: "Sure. Human resources used to be on the third floor, but it moved last month. It's now on the same floor as accounting." },
      { s: "W", t: "Great, thanks. Is there an elevator I can take?" },
      { s: "M", t: "Yes, it's just behind you. But first, you'll need to sign in here and wear this visitor badge while you're in the building." }
    ],
    qs: [
      { q: "Why is the woman visiting the building?", opts: ["To attend a job interview", "To deliver a package", "To meet with an accountant", "To repair an elevator"], ans: 0, exp: "女士說她是來參加兩點和人資部 Grant 女士的面試（the two o'clock interview）。" },
      { q: "Look at the graphic. Which floor will the woman go to?", opts: ["Floor 4", "Floor 3", "Floor 2", "Floor 5"], ans: 0, exp: "圖表題：男士說人資部原本在三樓，上個月搬到和會計部同一層。樓層表上會計部（Accounting）在 4 樓。" },
      { q: "What does the man ask the woman to do first?", opts: ["Sign in at the desk", "Take the stairs", "Come back at two o'clock", "Call Ms. Grant"], ans: 0, exp: "男士說 first, you'll need to sign in here（要先在這裡登記），並配戴訪客證。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：訂購名片（圖表題）",
    src: "S2",
    graphic: "BUSINESS CARDS (Standard)\n250 cards ........ $25\n500 cards ........ $40\n1,000 cards ...... $65\n2,000 cards ...... $110",
    turns: [
      { s: "M", t: "Hello, I'd like to order business cards for our new sales associate. We usually get the standard ones." },
      { s: "W", t: "Of course. How many would you like?" },
      { s: "M", t: "Five hundred, please. Actually, she'll be handing them out at a trade show next month, so let's make it a thousand." },
      { s: "W", t: "No problem. Just so you know, if you upload the design by noon today, we can have them ready tomorrow afternoon." },
      { s: "M", t: "Perfect. I'll e-mail the file right after this call." }
    ],
    qs: [
      { q: "Who are the business cards for?", opts: ["A new employee", "A trade show organizer", "A printing company", "A regular customer"], ans: 0, exp: "男士說名片是給新的業務助理（our new sales associate）。" },
      { q: "Look at the graphic. How much will the man most likely pay?", opts: ["$65", "$40", "$25", "$110"], ans: 0, exp: "圖表題：他一開始說 500 張，接著改成 1,000 張（let's make it a thousand），價目表上 1,000 張是 $65。" },
      { q: "What will the man most likely do next?", opts: ["Send a design file", "Visit the print shop", "Call a sales associate", "Pay a deposit"], ans: 0, exp: "男士說掛電話後就把檔案寄過去（I'll e-mail the file right after this call）。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：搭火車（圖表題）",
    src: "S2",
    graphic: "DEPARTURES — Northbound\nTime   Train    Platform\n9:15   Local    3\n9:40   Express  1\n10:05  Local    3\n10:30  Express  2",
    turns: [
      { s: "W", t: "Excuse me, I need to get to Riverside for a meeting at eleven. Which train should I take?" },
      { s: "M", t: "Let me check. The nine-forty express is the fastest, but it doesn't stop at Riverside." },
      { s: "W", t: "Oh, I see. What about the next one?" },
      { s: "M", t: "That one stops there, but because of track repairs it's running about twenty minutes late today. You'd still make it, though." },
      { s: "W", t: "I'd rather not cut it that close. Is there anything earlier?" },
      { s: "M", t: "Yes, the local before the express stops at Riverside, and it's on time." }
    ],
    qs: [
      { q: "Where does the conversation most likely take place?", opts: ["At a train station", "At a travel agency", "On a bus", "At an airport"], ans: 0, exp: "兩人在討論要搭哪一班火車、哪班會停 Riverside，地點最可能是火車站。" },
      { q: "Why is one of the trains delayed?", opts: ["Because of track repairs", "Because of bad weather", "Because of a staff shortage", "Because of a mechanical problem"], ans: 0, exp: "男士說 because of track repairs it's running about twenty minutes late（因為鐵軌維修晚了約 20 分鐘）。" },
      { q: "Look at the graphic. What time will the woman most likely leave?", opts: ["9:15", "9:40", "10:05", "10:30"], ans: 0, exp: "圖表題：9:40 的快車不停 Riverside，下一班 10:05 會誤點，她不想冒險；男士建議快車之前那班慢車，時刻表上是 9:15。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：顧客問卷結果（圖表題）",
    src: "S2",
    graphic: "FAVORITE NEW MENU ITEM (votes)\nTurkey sandwich ...... 48\nIced latte ........... 35\nFruit smoothie ....... 12\nLemon cake ........... 27",
    turns: [
      { s: "M", t: "Have you seen the results of the customer survey about our new café menu?" },
      { s: "W", t: "Yes. Most people loved the sandwiches, but I was surprised by the drink results." },
      { s: "M", t: "Me too. Our best-selling drink got the fewest votes of anything on the menu." },
      { s: "W", t: "Maybe people just don't think of it as a café item. We could promote it with a discount next month." },
      { s: "M", t: "Good idea. Could you make a sign for the counter?" }
    ],
    qs: [
      { q: "What are the speakers mainly discussing?", opts: ["The results of a survey", "The cost of ingredients", "A new café location", "A staff schedule"], ans: 0, exp: "兩人在討論新菜單的顧客問卷結果（the results of the customer survey）。" },
      { q: "Look at the graphic. How many votes did the café's best-selling drink receive?", opts: ["12", "35", "48", "27"], ans: 0, exp: "圖表題：男士說最暢銷的飲料得票最少（got the fewest votes），表上最少票的是 Fruit smoothie，12 票。" },
      { q: "What does the woman suggest doing?", opts: ["Offering a discount", "Removing an item from the menu", "Conducting another survey", "Hiring more staff"], ans: 0, exp: "女士說下個月可以用折扣來推廣（promote it with a discount）。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：三人討論電話系統（三人對話）",
    src: "S2",
    turns: [
      { s: "M", t: "Thanks for coming in, Ms. Lopez. I'm Tom Reilly, the office manager, and this is Sanjay Mehta from our IT department." },
      { s: "W", t: "Nice to meet you both. Your e-mail said you're looking for a new phone system?" },
      { s: "M2", t: "That's right. Our current one is over ten years old, and we can't add any new lines for the staff we're hiring next month." },
      { s: "W", t: "Our cloud-based system would solve that. You can add lines online in a few minutes, and employees can even take calls on their laptops when they work from home." },
      { s: "M", t: "That sounds ideal. Could you send us a price quote by Friday?" },
      { s: "W", t: "Certainly. I'll just need to know how many lines you'd like to start with." },
      { s: "M2", t: "About forty. I'll e-mail you the details this afternoon." }
    ],
    qs: [
      { q: "Who most likely is the woman?", opts: ["A sales representative", "An office manager", "An IT technician", "A new employee"], ans: 0, exp: "女士介紹自家的雲端電話系統，男士請她報價，她是來推銷產品的業務代表。辦公室經理是 Tom Reilly。" },
      { q: "What problem do the men mention?", opts: ["Their current system cannot be expanded.", "Their phone bills are too high.", "Their employees cannot work from home.", "Their office is too small."], ans: 0, exp: "IT 部門的 Mehta 說現在的系統太舊，無法為即將錄用的員工增加線路（can't add any new lines）。" },
      { q: "What will Mr. Mehta do this afternoon?", opts: ["Send some information by e-mail", "Install new software", "Interview job applicants", "Visit the woman's office"], ans: 0, exp: "三人對話：最後一句「About forty. I'll e-mail you the details this afternoon.」是 IT 部門的 Mehta 說的（和前面說明舊系統問題的是同一個聲音）。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：展覽攤位準備（三人對話）",
    src: "S2",
    turns: [
      { s: "W", t: "Rachel, did you see the e-mail from the conference organizers? They want our booth set up by seven A.M. on Thursday." },
      { s: "W2", t: "Seven? The exhibit hall doesn't open to the public until ten." },
      { s: "W", t: "I know, but they need time for safety inspections before the doors open." },
      { s: "M", t: "I could drive the display materials over on Wednesday evening. The hall allows early drop-offs after six P.M." },
      { s: "W2", t: "That would help a lot. Then we'd only have to assemble everything in the morning." },
      { s: "W", t: "Great. I'll reserve a parking spot near the loading dock for you, Alan." }
    ],
    qs: [
      { q: "What are the speakers preparing for?", opts: ["An exhibition", "A safety training session", "A product launch party", "A job interview"], ans: 0, exp: "她們要在會議的展覽廳（exhibit hall）布置攤位（booth），是在準備展覽。" },
      { q: "Why must the booth be set up early?", opts: ["To allow time for inspections", "Because the hall closes at ten", "Because of morning traffic", "To meet with the organizers"], ans: 0, exp: "主辦單位需要時間做安全檢查（they need time for safety inspections）。展覽廳是十點才開放，不是十點關閉。" },
      { q: "What will the man do on Wednesday evening?", opts: ["Deliver some materials", "Attend a safety inspection", "Assemble the booth", "Reserve a parking space"], ans: 0, exp: "男士說他週三晚上可以把展示材料載過去（drive the display materials over）。停車位是女士要幫他預約的。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：簡報提前（意圖題）",
    src: "S2",
    turns: [
      { s: "M", t: "Hi, Maria. The client from Lindell Foods just called. They want to move tomorrow's presentation from three P.M. to ten A.M." },
      { s: "W", t: "Ten in the morning? The slides still need the updated sales figures." },
      { s: "M", t: "I know. Finance said they'd send us the numbers by the end of today." },
      { s: "W", t: "Well, I've got the evening free." },
      { s: "M", t: "Thanks. I'll let the client know we can do ten, then." }
    ],
    qs: [
      { q: "What does the client want to do?", opts: ["Change the time of a presentation", "Cancel a contract", "Visit the office today", "Request new sales figures"], ans: 0, exp: "客戶想把明天的簡報從下午三點提前到上午十點。" },
      { q: "What does the woman imply when she says, \"Well, I've got the evening free\"?", opts: ["She can update the slides tonight.", "She would like to leave work early.", "She cannot attend the presentation.", "She wants to meet the client in the evening."], ans: 0, exp: "意圖題：財務部今天下班前才會給數字，女士說她今晚有空，意思是她可以今晚把數字更新到簡報上，所以十點沒問題。" },
      { q: "What will the man most likely do next?", opts: ["Contact the client", "Call the finance department", "Revise the slides", "Book a meeting room for the evening"], ans: 0, exp: "男士說會通知客戶十點可以（I'll let the client know we can do ten）。" }
    ]
  },
  {
    type: "Part 3",
    title: "對話：新筆電設定（意圖題）",
    src: "S2",
    turns: [
      { s: "W", t: "Brian, the new laptops for the design team arrived this morning. Do you want me to set them up today?" },
      { s: "M", t: "That would be great, but there's a problem. The accounting software they need isn't compatible with the new operating system." },
      { s: "W", t: "The design team doesn't use accounting software, though." },
      { s: "M", t: "Oh, you're right. I was thinking of the order for the finance department." },
      { s: "W", t: "OK. Then I'll start installing the design programs after lunch." }
    ],
    qs: [
      { q: "What arrived this morning?", opts: ["New computers", "Software licenses", "Office furniture", "Design samples"], ans: 0, exp: "女士說設計團隊的新筆電（the new laptops）今天早上送到了。" },
      { q: "Why does the woman say, \"The design team doesn't use accounting software, though\"?", opts: ["To point out that a concern does not apply", "To request new software for the team", "To complain about a purchasing decision", "To suggest training for the design team"], ans: 0, exp: "意圖題：男士擔心會計軟體不相容，女士指出設計團隊根本不用會計軟體，也就是這個顧慮不適用。男士接著承認他想成財務部的訂單了。" },
      { q: "What will the woman do after lunch?", opts: ["Install some programs", "Meet with the finance department", "Return some laptops", "Order new software"], ans: 0, exp: "女士說午餐後開始安裝設計軟體（start installing the design programs）。" }
    ]
  },
  {
    type: "Part 4",
    title: "短講：博物館廣播（圖表題）",
    src: "S2",
    graphic: "MUSEUM MAP — First Floor\nHall A ... Dinosaurs\nHall B ... Planetarium\nHall C ... Ocean Life\nHall D ... Space Exploration",
    turns: [
      { s: "N", t: "Good morning, and welcome to the Westbrook Science Museum. Before you begin exploring, here are a few announcements. Today's planetarium show, Journey to Mars, has been moved from Hall B to Hall D because of a lighting problem. The show times have not changed. Also, our café on the first floor is offering a ten percent discount to visitors with a membership card. Finally, please remember that photography is welcome everywhere except in the special exhibit on ancient textiles, where camera flashes can damage the materials. Enjoy your visit!" }
    ],
    qs: [
      { q: "Who is the speaker most likely addressing?", opts: ["Museum visitors", "Museum employees", "Science teachers", "Café workers"], ans: 0, exp: "開頭說 welcome to the Westbrook Science Museum… Before you begin exploring，對象是來參觀的訪客。" },
      { q: "Look at the graphic. Where will the planetarium show be held today?", opts: ["In the Space Exploration hall", "In the Planetarium hall", "In the Dinosaurs hall", "In the Ocean Life hall"], ans: 0, exp: "圖表題：表演從 Hall B 移到 Hall D，平面圖上 Hall D 是 Space Exploration（太空探索廳）。" },
      { q: "What are listeners asked not to do?", opts: ["Take photos in a certain exhibit", "Use flash in the café", "Enter Hall B", "Eat in the exhibit halls"], ans: 0, exp: "廣播說除了古代紡織品特展以外都可以拍照，因為閃光會損害展品，也就是不要在那個特展拍照。" }
    ]
  },
  {
    type: "Part 4",
    title: "短講：修車廠語音留言（意圖題）",
    src: "S2",
    turns: [
      { s: "N", t: "Hi, Ms. Patel, this is Greg from Sunrise Auto Repair calling about your car. We've finished replacing the brakes, and the car is ready for pickup. While we were working on it, our mechanic noticed that the front tires are quite worn. I know you mentioned you're driving to Portland this weekend. That's about six hours on the highway. We have a set of tires in stock that would fit your car, and we could install them this afternoon if you'd like. Please call me back at 555-0187 before three o'clock, and I'll let you know the final price." }
    ],
    qs: [
      { q: "Why is the speaker calling?", opts: ["To say that a car is ready", "To schedule a brake inspection", "To give directions to Portland", "To apologize for a delay"], ans: 0, exp: "留言一開始說煞車已經換好，車子可以來取了（the car is ready for pickup）。" },
      { q: "Why does the speaker say, \"That's about six hours on the highway\"?", opts: ["To suggest that new tires would be a good idea", "To recommend a different route", "To explain why a repair took so long", "To ask about the listener's travel plans"], ans: 0, exp: "意圖題：他先說前輪胎磨損得很厲害，再提醒週末去 Portland 要在高速公路開六小時，暗示最好換新輪胎；接著就說店裡有合適的輪胎、今天下午可以裝。" },
      { q: "What does the speaker ask the listener to do?", opts: ["Return his call before three o'clock", "Pick up the car this weekend", "Pay for the brakes in advance", "Visit another repair shop"], ans: 0, exp: "Please call me back at 555-0187 before three o'clock（請在三點前回電）。" }
    ]
  }
];
