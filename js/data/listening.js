// 聽力題庫：Part 2 應答問題 + Part 3 對話 + Part 4 短講
// 音訊由瀏覽器語音合成（speechSynthesis）即時朗讀，作答前不顯示文字稿

// Part 2：聽問句，從三個口說選項中選出最合適的回應（900+ 常考間接回應與陷阱）
const PART2 = [
  { q: "Where should I submit my expense report?", opts: ["Through the online portal.", "About fifty dollars.", "Last Tuesday."], ans: 0, exp: "Where 問地點/管道，回答「透過線上入口網站」。回答金額（fifty dollars）是 How much 的陷阱；回答時間（Last Tuesday）是 When 的陷阱。" },
  { q: "The client meeting has been moved to Thursday, hasn't it?", opts: ["Yes, because of a scheduling conflict.", "He moved to Chicago.", "In the conference room."], ans: 0, exp: "附加問句確認事實，Yes + 原因最合理。「He moved to Chicago」用 moved 的同字陷阱（搬家）；「In the conference room」答地點文不對題。" },
  { q: "Why don't we order more toner for the printer?", opts: ["Good idea — I'll call the supplier.", "Because it's out of order.", "A ten-page document."], ans: 0, exp: "Why don't we... 是「提議」不是問原因，接受提議的回應才正確。「Because it's out of order」是把提議當成 Why 問句的陷阱。" },
  { q: "Who's leading the training session this afternoon?", opts: ["It's been postponed until next week.", "In the main auditorium.", "About two hours long."], ans: 0, exp: "900+ 關鍵的「間接回應」：不直接回答是誰，而是說「延期了」（所以沒有人帶）。其餘兩個選項分別回答地點與時長，答非所問。" },
  { q: "Would you like the aisle seat or the window seat?", opts: ["The aisle, please.", "Yes, I would.", "It's a long flight."], ans: 0, exp: "選擇疑問句（A or B）必須擇一回答，不能用 Yes/No。「Yes, I would.」是最典型的陷阱。" },
  { q: "How often does the shuttle run downtown?", opts: ["Every twenty minutes.", "It runs on diesel.", "Since this morning."], ans: 0, exp: "How often 問頻率，回答 Every twenty minutes。「It runs on diesel」用 run 的多義陷阱；「Since this morning」回答起始時間。" },
  { q: "Haven't you finished the budget proposal yet?", opts: ["I'm still waiting for the sales figures.", "Yes, it's not finished.", "A bigger budget."], ans: 0, exp: "否定疑問句＋間接回應：說「還在等銷售數據」暗示尚未完成。「Yes, it's not finished」Yes 之後接否定內容自相矛盾。" },
  { q: "Could you forward me the agenda before the call?", opts: ["Sure, I'll send it right away.", "Four items.", "He called yesterday."], ans: 0, exp: "Could you... 是請求，答應（Sure）並說明行動最合理。「He called yesterday」用 call 的同字陷阱。" },
  { q: "When will the renovations be completed?", opts: ["You'd have to ask the contractor.", "On the fourth floor.", "It cost a lot."], ans: 0, exp: "間接回應：「你得問承包商」＝我不知道。When 問句不一定用時間回答，這是高分段最常見的出題手法。" },
  { q: "Do you want me to book the conference room, or has that been done?", opts: ["Tanya already reserved it.", "A room with a view.", "Yes, please do both."], ans: 0, exp: "選擇疑問句：回答「Tanya 已經訂好了」對應 or 之後的第二種情況（已經有人訂了）。用 Yes 回答選擇疑問句是陷阱。" },
  { q: "This café is pretty crowded, isn't it?", opts: ["There's another one around the corner.", "I'd like a coffee.", "No, it's very crowded."], ans: 0, exp: "陳述＋附加問句，最佳回應是提出解決方案（去轉角另一家）。「No, it's very crowded」No 之後又說很擠，自相矛盾。" },
  { q: "Whose laptop is this in the meeting room?", opts: ["It might be Karen's — she was just there.", "It's a new model.", "On the table."], ans: 0, exp: "Whose 問所有者，回答「可能是 Karen 的」。「It's a new model」描述物品本身；「On the table」回答位置，都答非所問。" },
  { q: "Should we take the highway or the local roads?", opts: ["The highway's faster this time of day.", "Yes, let's.", "I took it yesterday."], ans: 0, exp: "選擇疑問句擇一回答並附理由。「Yes, let's.」用 Yes 回答選擇疑問句是陷阱；「I took it yesterday」用 took 的同字陷阱回答過去的事。" },
  { q: "The quarterly figures look better than expected.", opts: ["Yes, sales really picked up in March.", "On a quarterly basis.", "I expected you earlier."], ans: 0, exp: "陳述句（非疑問句）：附和並補充細節最自然。另兩個選項分別重複 quarterly 與 expected，都是同字陷阱。" },
  { q: "How do I get reimbursed for the conference fees?", opts: ["Just submit the receipts to accounting.", "It was very informative.", "By next Friday."], ans: 0, exp: "How 問方法/程序，回答「把收據交給會計部」。「It was very informative」評論會議內容；「By next Friday」回答期限。" },
  { q: "Why was the product launch delayed?", opts: ["There was an issue with the packaging.", "At the convention center.", "It launched successfully."], ans: 0, exp: "Why 問原因，回答包裝出了問題。「It launched successfully」與「延期」的前提矛盾，是語意陷阱。" },
  { q: "Has the marketing report been finalized?", opts: ["Dana's reviewing the last section now.", "In the marketing department.", "Yes, a financial report."], ans: 0, exp: "間接回應：「Dana 正在看最後一部分」＝還沒完成。「In the marketing department」答地點；「a financial report」重複 report 的同字陷阱。" },
  { q: "When does the pharmacy on Fifth Street close?", opts: ["It's open around the clock.", "Near the bank.", "To pick up a prescription."], ans: 0, exp: "間接回應：「24 小時營業」＝不會關門。「Near the bank」答地點是 Where 的陷阱；「To pick up a prescription」答目的。" },
  { q: "Why don't you join us for lunch at the new bistro?", opts: ["I wish I could, but I'm on a deadline.", "Because the food was cold.", "A table for six."], ans: 0, exp: "Why don't you... 是邀請，婉拒（真希望可以，但趕期限）最合理。「Because the food was cold」把邀請當成 Why 問句回答。" },
  { q: "Who approved the overtime request?", opts: ["It didn't need approval.", "About ten extra hours.", "Over the weekend."], ans: 0, exp: "間接回應：「不需要核准」＝沒有人核准、也不必。「ten extra hours」回答時數；「Over the weekend」回答時間。" },
  { q: "Where can I find the safety guidelines?", opts: ["They're posted on the bulletin board.", "By the end of the day.", "A safe workplace."], ans: 0, exp: "Where 問地點，回答「貼在佈告欄上」。「By the end of the day」答期限；「A safe workplace」重複 safe 的同字陷阱。" },
  { q: "You've met the new branch manager, haven't you?", opts: ["Briefly, at the orientation.", "It's a management position.", "Yes, I'll meet the deadline."], ans: 0, exp: "附加問句：「見過，在新人訓練時短暫見過」。「I'll meet the deadline」用 meet 的多義陷阱（趕上期限）。" },
  { q: "Would you mind switching shifts with me on Friday?", opts: ["Not at all — I'm free that day.", "Yes, the light switch.", "During the night shift."], ans: 0, exp: "Would you mind...? 答應要用 Not at all（一點也不介意）。「the light switch」用 switch 的同字陷阱（開關）。" },
  { q: "How many people signed up for the wellness program?", opts: ["The list hasn't been posted yet.", "Sign at the bottom.", "It's a great program."], ans: 0, exp: "間接回應：「名單還沒公布」＝不知道人數。「Sign at the bottom」用 sign 的同字陷阱；「It's a great program」答非所問。" },
  { q: "Where did you put the quarterly sales report?", opts: ["I emailed it to you this morning.", "About three percent higher.", "It was quite detailed."], ans: 0, exp: "間接回應：不直說放哪，而說「今早寄到你信箱了」。「three percent higher」回答數字；「quite detailed」評論內容。" },
  { q: "Isn't the new cafeteria opening this week?", opts: ["Actually, it's been pushed back to next month.", "The food was delicious.", "On the second floor."], ans: 0, exp: "否定疑問句＋間接回應：「其實延到下個月了」。「The food was delicious」與「還沒開」矛盾；「On the second floor」答地點。" },
  { q: "Should I email the client or call them directly?", opts: ["A phone call would be more personal.", "Yes, please do.", "The client was satisfied."], ans: 0, exp: "選擇疑問句（email or call）擇一回答。「Yes, please do」用 Yes 回答選擇疑問句是陷阱。" },
  { q: "Who's responsible for ordering office supplies?", opts: ["That's handled by the admin team.", "In the storage room.", "Every two weeks."], ans: 0, exp: "Who 問負責人，「行政團隊負責」。「In the storage room」答地點；「Every two weeks」答頻率。" },
  { q: "The projector in Room B isn't working again.", opts: ["I'll put in a maintenance request.", "Yes, it's a great room.", "About two hours long."], ans: 0, exp: "陳述問題，最佳回應是提出解決（我來報修）。其餘答非所問。" },
  { q: "Why has the delivery been delayed?", opts: ["The supplier ran out of stock.", "By express courier.", "To the warehouse."], ans: 0, exp: "Why 問原因，「供應商缺貨了」。「By express courier」答方式；「To the warehouse」答地點。" },
  { q: "Could you recommend a good hotel near the airport?", opts: ["The Grandview usually has great rates.", "Yes, I flew there last week.", "It's a long flight."], ans: 0, exp: "請求推薦，回應具體飯店名。其餘用 fly/flight 的相關字陷阱，答非所問。" },
  { q: "Do you know when the shipment will clear customs?", opts: ["It should be released by Thursday.", "At the port.", "A large container."], ans: 0, exp: "When 問時間，「週四前應會放行」。「At the port」答地點；「A large container」描述物品。" },
  { q: "Haven't the new brochures been printed yet?", opts: ["They'll be ready this afternoon.", "Yes, on glossy paper.", "In the marketing office."], ans: 0, exp: "否定疑問句：「今天下午就會好」暗示尚未完成。「on glossy paper」describe 細節；「In the marketing office」答地點。" },
  { q: "Would you prefer the morning or the afternoon session?", opts: ["The morning works better for me.", "Yes, I'd love to attend.", "It lasts two hours."], ans: 0, exp: "選擇疑問句擇一回答。「Yes, I'd love to attend」用 Yes 回答是陷阱。" },
  { q: "How often is the equipment serviced?", opts: ["Once every six months.", "By an outside contractor.", "In the basement."], ans: 0, exp: "How often 問頻率，「每六個月一次」。「By an outside contractor」答執行者；「In the basement」答地點。" },
  { q: "Where can I get my parking validated?", opts: ["The reception desk can stamp it for you.", "For up to three hours.", "It costs five dollars."], ans: 0, exp: "Where 問地點，「櫃檯可以幫你蓋章」。「up to three hours」答時長；「five dollars」答金額。" },
  { q: "The client wants to move the meeting up to Monday.", opts: ["Let me check whether the room is available.", "Yes, it was a productive meeting.", "On the tenth floor."], ans: 0, exp: "陳述新資訊，回應以行動（我確認會議室是否有空）。其餘答非所問。" },
  { q: "Why don't we outsource the translation work?", opts: ["That might actually save us time.", "Because it was mistranslated.", "In several languages."], ans: 0, exp: "Why don't we...（提議），回應同意（那說不定能省時間）。「Because...」把提議當 Why 問句回答。" },
  { q: "Has anyone confirmed the venue for the awards dinner?", opts: ["Karen is finalizing it today.", "It was a lovely evening.", "About two hundred guests."], ans: 0, exp: "間接回應：「Karen 今天在敲定」＝還沒完全確認。「a lovely evening」答感想；「two hundred guests」答人數。" },
  { q: "Which supplier offered the better price?", opts: ["We're still comparing the two quotes.", "By the end of the week.", "In bulk quantities."], ans: 0, exp: "間接回應：「還在比較兩份報價」＝尚未決定。「end of the week」答時間；「bulk quantities」答數量。" },
  { q: "You're attending the trade show in Berlin, aren't you?", opts: ["Yes, my flight leaves Tuesday.", "It was very informative.", "At the convention center."], ans: 0, exp: "附加問句確認，「是，我週二的班機」。「very informative」答感想；「convention center」答地點。" },
  { q: "Should the report be printed in color or black and white?", opts: ["Color would look more professional.", "Yes, ten copies please.", "By tomorrow morning."], ans: 0, exp: "選擇疑問句擇一回答。「Yes, ten copies」用 Yes 回答並答數量是陷阱。" },
  { q: "How was the response to the customer survey?", opts: ["Better than we anticipated.", "By email and phone.", "Around fifty questions."], ans: 0, exp: "How（如何）問結果，「比預期好」。「By email and phone」答方式；「fifty questions」答數量。" },
  { q: "Where should I store these confidential files?", opts: ["The locked cabinet in my office.", "For seven years.", "They're highly sensitive."], ans: 0, exp: "Where 問地點，「我辦公室上鎖的櫃子」。「seven years」答期限；「highly sensitive」描述性質。" },
  { q: "Didn't the maintenance crew fix the elevator?", opts: ["They're coming back tomorrow.", "On every floor.", "Yes, it's a fast elevator."], ans: 0, exp: "否定疑問句＋間接回應：「他們明天再來」暗示還沒修好。「Yes, it's a fast elevator」與語意矛盾。" },
  { q: "Would you like me to book a taxi or arrange a shuttle?", opts: ["A shuttle would be more economical.", "Yes, right away.", "To the airport."], ans: 0, exp: "選擇疑問句擇一回答。「Yes, right away」用 Yes 回答是陷阱。" },
  { q: "Why was the budget meeting canceled?", opts: ["The director had a scheduling conflict.", "In the main boardroom.", "For about an hour."], ans: 0, exp: "Why 問原因，「總監行程衝突」。「main boardroom」答地點；「about an hour」答時長。" },
  { q: "How do I apply for the leadership program?", opts: ["There's a form on the company intranet.", "It runs for six months.", "About twenty participants."], ans: 0, exp: "How 問方法，「公司內網有表格」。「six months」答期間；「twenty participants」答人數。" },
  { q: "The printer is out of toner again.", opts: ["I'll order some more right away.", "Yes, it prints quickly.", "On the third floor."], ans: 0, exp: "陳述問題，回應以行動（我馬上訂）。其餘答非所問。" },
  { q: "Who approved this expense report?", opts: ["It still needs the director's signature.", "About three hundred dollars.", "Last Thursday."], ans: 0, exp: "間接回應：「還需要總監簽名」＝還沒人批准。「three hundred dollars」答金額；「Last Thursday」答時間。" },
  { q: "Isn't this the last day of the promotion?", opts: ["No, it's been extended through Sunday.", "At all our locations.", "Twenty percent off."], ans: 0, exp: "否定疑問句：「不，延長到週日」。「all our locations」答地點；「Twenty percent off」答折扣。" },
  { q: "Where are the training sessions being held this year?", opts: ["They've moved to the downtown branch.", "Every Wednesday afternoon.", "By a certified instructor."], ans: 0, exp: "Where 問地點，「改到市中心分部」。「Every Wednesday」答時間；「certified instructor」答執行者。" },
  { q: "Could you send me the updated contact list?", opts: ["Sure, I'll forward it now.", "About fifty names.", "In alphabetical order."], ans: 0, exp: "請求，回應答應（好，我現在轉寄）。「fifty names」答數量；「alphabetical order」答排序。" },
  { q: "Why is the lobby closed off this morning?", opts: ["They're refinishing the floors.", "Until noon.", "Near the entrance."], ans: 0, exp: "Why 問原因，「他們在重新打磨地板」。「Until noon」答時間；「Near the entrance」答地點。" },
  { q: "Do you want to review the slides before the presentation?", opts: ["Yes, could you email them over?", "It went very well.", "In the conference room."], ans: 0, exp: "Yes/No 問句，回應「好，能寄給我嗎？」。「It went very well」用過去式答非所問；「conference room」答地點。" },
  { q: "How long has Ms. Tanaka been with the company?", opts: ["She joined about a decade ago.", "In the finance department.", "As a senior analyst."], ans: 0, exp: "How long 問期間，「大約十年前加入」。「finance department」答部門；「senior analyst」答職稱。" },
  { q: "Shouldn't we notify the clients about the price change?", opts: ["A notice is already being drafted.", "Yes, they're valued clients.", "By about five percent."], ans: 0, exp: "否定疑問句＋間接回應：「通知已經在草擬了」。「valued clients」答非所問；「five percent」答幅度。" },
  { q: "Where did the shipment get held up?", opts: ["Somewhere at the border crossing.", "For over a week.", "In sealed containers."], ans: 0, exp: "Where 問地點，「卡在邊境某處」。「over a week」答時長；「sealed containers」描述包裝。" },
  { q: "Would you rather lead the project or support it?", opts: ["I'd be happy to take the lead.", "Yes, it's an exciting project.", "Over the next quarter."], ans: 0, exp: "選擇疑問句擇一回答。「Yes, it's an exciting project」用 Yes 回答是陷阱。" },
  { q: "Why haven't the invoices been sent to accounting?", opts: ["I'm still waiting on two receipts.", "By the end of the day.", "In the top drawer."], ans: 0, exp: "否定疑問句＋間接回應：「我還在等兩張收據」解釋原因。「end of the day」答時間；「top drawer」答地點。" }
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
  }
];
