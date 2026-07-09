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
  { q: "How many people signed up for the wellness program?", opts: ["The list hasn't been posted yet.", "Sign at the bottom.", "It's a great program."], ans: 0, exp: "間接回應：「名單還沒公布」＝不知道人數。「Sign at the bottom」用 sign 的同字陷阱；「It's a great program」答非所問。" }
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
  }
];
