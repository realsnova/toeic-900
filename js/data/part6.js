// Part 6 段落填空題庫（每篇 4 格，[1]~[4] 為空格位置）
const PART6 = [
  {
    title: "電子郵件：訂單延遲通知",
    text: `To: Rebecca Liu <r.liu@stellaroffice.com>
From: Customer Care <care@apexsupplies.com>
Subject: Order #58214

Dear Ms. Liu,

Thank you for your recent order of ergonomic office chairs. Unfortunately, due to an unexpected surge in demand, the model you selected is temporarily out of stock. We expect to receive a new shipment ___[1]___ ten business days.

___[2]___, we would like to offer you two options. You may either wait for the original model or switch to the Deluxe series at no additional cost. The Deluxe series has received excellent reviews and offers ___[3]___ lumbar support.

___[4]___ We apologize for any inconvenience and appreciate your patience.

Sincerely,
Apex Supplies Customer Care`,
    blanks: [
      { opts: ["within", "since", "by", "along"], ans: 0, exp: "within + 一段時間（十個工作天之內）。by 接時間點，since 接起始點。" },
      { opts: ["In the meantime", "As a result", "On the contrary", "For instance"], ans: 0, exp: "承接上文「等待到貨期間」，用 In the meantime（在此期間）提供替代方案。" },
      { opts: ["enhanced", "enhancing", "enhance", "enhancement"], ans: 0, exp: "修飾名詞 lumbar support，用過去分詞 enhanced（強化的）作形容詞。" },
      { opts: ["Please let us know your preference by Friday.", "The chairs were delivered yesterday.", "Our store hours have recently changed.", "Thank you for your job application."], ans: 0, exp: "句子插入題：上文提供兩個選項，此處自然接「請於週五前告知您的選擇」。其餘選項與上下文無關。" }
    ]
  },
  {
    title: "公告：辦公室整修",
    text: `MEMO

To: All Staff
From: Facilities Management
Date: March 3
Re: Renovation of the fourth floor

Beginning Monday, March 10, the fourth floor will be closed for renovations. The project, ___[1]___ is expected to take six weeks, includes new carpeting, upgraded lighting, and a redesigned break room.

Employees currently working on the fourth floor will be ___[2]___ relocated to the second-floor conference area. IT staff will assist with moving computers and phones so that disruptions are kept to a ___[3]___.

___[4]___ If you have questions about the timeline, please contact Facilities Management at extension 4501.`,
    blanks: [
      { opts: ["which", "what", "who", "where"], ans: 0, exp: "非限定關係子句修飾 The project（事物），用 which。" },
      { opts: ["temporarily", "temporary", "temporariness", "more temporary"], ans: 0, exp: "修飾動詞 relocated 需用副詞 temporarily（暫時地）。" },
      { opts: ["minimum", "minimal", "minimize", "minimally"], ans: 0, exp: "keep... to a minimum（降到最低）為固定搭配，a 之後接名詞 minimum。" },
      { opts: ["We appreciate your cooperation during this period.", "The new employees will start next month.", "Lunch will be provided at the seminar.", "Parking fees will increase in April."], ans: 0, exp: "句子插入題：整修公告的合理結尾是感謝配合。其餘選項偏離主題。" }
    ]
  },
  {
    title: "報導：本地企業擴張",
    text: `HARBORVIEW — Coastal Roasters, a family-owned coffee company founded in 2005, announced plans yesterday to open three new locations across the region. The expansion comes after the company reported record sales for the third ___[1]___ year.

"Our customers have been asking us to open closer to their neighborhoods," said co-founder Elena Park. "This expansion allows us to do exactly that ___[2]___ maintaining the quality we are known for."

The company will begin hiring baristas and shift managers next month. ___[3]___ interested in applying should visit the company's website for details.

Construction on the first new store is already ___[4]___. It is scheduled to open in early September.`,
    blanks: [
      { opts: ["consecutive", "consecutively", "consequent", "considerable"], ans: 0, exp: "for the third consecutive year（連續第三年）為固定搭配，修飾名詞 year 用形容詞 consecutive。" },
      { opts: ["while", "during", "despite", "moreover"], ans: 0, exp: "while + V-ing（同時⋯）：擴張的同時維持品質。during 接名詞；despite 語意不合。" },
      { opts: ["Those", "That", "Them", "Theirs"], ans: 0, exp: "Those interested in... = 有意應徵者（Those who are interested 的簡化）。" },
      { opts: ["underway", "underground", "undergone", "understated"], ans: 0, exp: "be underway = 進行中。undergone 是 undergo 的過去分詞，主動語態不合。" }
    ]
  },
  {
    title: "電子郵件：會員續約優惠",
    text: `Dear Valued Member,

Our records indicate that your Premier Fitness membership will ___[1]___ on April 30. We would like to thank you for being a loyal member for the past three years.

To show our appreciation, we are pleased to offer you an exclusive renewal rate of $39 per month — a 20% discount off the standard price. This offer is ___[2]___ only until April 15, so we encourage you to act quickly.

___[3]___ renewing online, you may also visit the front desk during business hours. Our staff will be happy to assist you with the process.

___[4]___ We look forward to supporting your fitness goals for years to come.

Best regards,
Premier Fitness Membership Team`,
    blanks: [
      { opts: ["expire", "expand", "explore", "export"], ans: 0, exp: "membership will expire（會籍即將到期）。詞彙題，依語意選 expire。" },
      { opts: ["valid", "validly", "validate", "validity"], ans: 0, exp: "be valid until...（有效期限至⋯）。be 動詞後接形容詞 valid。" },
      { opts: ["In addition to", "Instead of", "Except for", "As opposed to"], ans: 0, exp: "In addition to renewing online（除了線上續約之外）,還可以到櫃檯辦理。語意為「加上」而非「取代」。" },
      { opts: ["As always, thank you for choosing Premier Fitness.", "Your payment is now overdue by 60 days.", "The pool will be closed for maintenance.", "Congratulations on completing the marathon."], ans: 0, exp: "句子插入題：續約感謝信的自然結尾。其餘選項與信件目的不符。" }
    ]
  },
  {
    title: "內部通知：新差旅系統上線",
    text: `To: All Employees
From: Finance Department
Subject: New travel booking system

Dear colleagues,

We are pleased to announce that our new travel booking platform, TripDesk, will go live on Monday, May 6. From that date, all business trips must be arranged ___[1]___ the platform rather than by email.

TripDesk automatically applies our corporate rates and generates expense reports, ___[2]___ the time spent on paperwork by more than half. Trips booked before May 6 will not be affected and should be expensed under the current procedure.

___[3]___ the transition easier, the finance team will hold two online training sessions next week. ___[4]___ Attendance at one of the two sessions is strongly encouraged.

Best regards,
Finance Department`,
    blanks: [
      { opts: ["through", "among", "onto", "beside"], ans: 0, exp: "through the platform = 透過平台（管道）。介係詞語意題。" },
      { opts: ["reducing", "reduced", "reduces", "reduction"], ans: 0, exp: "分詞構句：主句完整，逗號後補充結果（因而減少文書時間），主動用現在分詞 reducing。" },
      { opts: ["To make", "Making", "Made", "For making"], ans: 0, exp: "不定詞表目的：To make the transition easier（為了讓過渡更順利）置於句首。" },
      { opts: ["A calendar invitation with the session links will be sent tomorrow.", "The old system has been praised by all departments.", "Hotel prices are expected to rise sharply this year.", "The company picnic has been rescheduled to June."], ans: 0, exp: "句子插入題：上文提到將舉辦兩場線上訓練，接「明天會寄出含連結的行事曆邀請」最連貫。" }
    ]
  },
  {
    title: "電子郵件：面試邀約",
    text: `Dear Mr. Alvarez,

Thank you for applying for the position of Marketing Coordinator at Vertex Media. After reviewing your application, we would like to invite you ___[1]___ an interview at our downtown office.

The interview is ___[2]___ scheduled for Thursday, May 9, at 2:00 P.M. It will last approximately one hour and will include a short presentation task. ___[3]___ Please bring a copy of your résumé and a valid photo ID.

If this time is not convenient, please let us know and we will do our best to ___[4]___ your schedule.

We look forward to meeting you.

Best regards,
Hiring Team, Vertex Media`,
    blanks: [
      { opts: ["for", "to", "with", "on"], ans: 0, exp: "invite someone for an interview（邀請某人面試）為固定搭配。" },
      { opts: ["tentatively", "tentative", "tentativeness", "tentativity"], ans: 0, exp: "修飾動詞 scheduled 需用副詞 tentatively（暫定地）。" },
      { opts: ["Details about the presentation topic will be emailed to you separately.", "The position has already been filled.", "Our office is closed on public holidays.", "Thank you for your recent purchase."], ans: 0, exp: "句子插入題：上文提到面試含簡報任務，接「簡報主題細節將另行寄送」最連貫。" },
      { opts: ["accommodate", "accommodation", "accommodating", "accommodated"], ans: 0, exp: "do our best to + 原形動詞 accommodate（配合您的時間）。" }
    ]
  },
  {
    title: "公告：停車場維修",
    text: `NOTICE TO ALL EMPLOYEES

Please be advised that the north parking lot will be closed for resurfacing ___[1]___ Monday, June 3 to Wednesday, June 5.

During this period, employees are encouraged to use the south lot, which has ___[2]___ spaces available. Alternatively, the company will cover the cost of public transportation for those who choose not to drive. ___[3]___

We apologize for any inconvenience this may cause and appreciate your ___[4]___ during the repairs.

Sincerely,
Facilities Management`,
    blanks: [
      { opts: ["from", "since", "by", "within"], ans: 0, exp: "from A to B（從六月三日到五日）表區間，與 to 呼應。" },
      { opts: ["ample", "amply", "amplify", "amplitude"], ans: 0, exp: "形容詞修飾名詞 spaces，ample spaces（充足的車位）。" },
      { opts: ["Simply keep your transit receipts and submit them for reimbursement.", "The parking lot will remain closed permanently.", "New employees will start next Monday.", "The cafeteria menu has been updated."], ans: 0, exp: "句子插入題：上文提到公司補助大眾運輸，接「保留車票收據報帳」最連貫。" },
      { opts: ["cooperation", "cooperate", "cooperative", "cooperatively"], ans: 0, exp: "所有格 your 之後接名詞 cooperation（配合）。" }
    ]
  },
  {
    title: "報導：本地餐廳擴張",
    text: `RIVERTON — Bella Cucina, a family-owned Italian restaurant, announced this week that it will open a second location downtown. The new branch, ___[1]___ is scheduled to open in October, will seat up to eighty guests.

Owner Marco Bellini said the decision came after years of ___[2]___ demand. "Our regular customers have been asking us to expand for a long time," he said. ___[3]___ The new location will feature an open kitchen and a private dining room for events.

The restaurant is currently ___[4]___ experienced chefs and servers. Interested applicants can apply through the company website.`,
    blanks: [
      { opts: ["which", "what", "who", "where"], ans: 0, exp: "非限定關係子句修飾事物 The new branch，用 which。" },
      { opts: ["growing", "grown", "grows", "growth"], ans: 0, exp: "現在分詞作形容詞修飾 demand，growing demand（日益增長的需求）。" },
      { opts: ["He added that the menu will remain largely the same.", "The original location will close next month.", "The city has banned outdoor seating.", "Ticket prices have increased this year."], ans: 0, exp: "句子插入題：延續老闆談擴張，接「他補充說菜單大致維持不變」最連貫。" },
      { opts: ["recruiting", "recruit", "recruited", "recruitment"], ans: 0, exp: "is currently + V-ing 現在進行式，recruiting（正在招募）。" }
    ]
  },
  {
    title: "電子郵件：訂閱續約提醒",
    text: `Dear Subscriber,

This is a friendly reminder that your annual subscription to Business Insight Monthly will expire ___[1]___ June 30.

To continue enjoying uninterrupted access to our articles and market reports, please renew ___[2]___ the expiration date. Renewing early also qualifies you for a ten percent loyalty discount. ___[3]___

If you have already renewed, please ___[4]___ this reminder. Thank you for being a valued reader.

Warm regards,
The Business Insight Team`,
    blanks: [
      { opts: ["on", "in", "since", "by the"], ans: 0, exp: "on + 日期（六月三十日到期）。" },
      { opts: ["before", "during", "despite", "although"], ans: 0, exp: "before the expiration date（在到期日之前）為介係詞接名詞片語。during 語意不合。" },
      { opts: ["Simply click the link below to renew in seconds.", "Our office will be relocating next year.", "Print subscriptions are no longer available.", "The magazine won an industry award."], ans: 0, exp: "句子插入題：延續催促續約，接「點下方連結即可秒速續約」最連貫。" },
      { opts: ["disregard", "disregarding", "disregarded", "disregards"], ans: 0, exp: "please + 原形動詞 disregard（請忽略此提醒）。" }
    ]
  },
  {
    title: "公告：新線上系統上線",
    text: `MEMO — To All Staff

We are pleased to announce that the new employee portal will go live on Monday. The portal allows you to view pay slips, request leave, and update personal information, all ___[1]___ one place.

To access the portal, use your existing company email and the temporary password sent to you today. You will be prompted to ___[2]___ a new password upon your first login. ___[3]___

Should you experience any difficulties, the IT help desk is available ___[4]___ to assist you.

Thank you,
Human Resources`,
    blanks: [
      { opts: ["in", "on", "at", "by"], ans: 0, exp: "in one place（在同一個地方）為固定用法。" },
      { opts: ["create", "creating", "created", "creation"], ans: 0, exp: "be prompted to + 原形動詞 create（被提示建立新密碼）。" },
      { opts: ["A short video tutorial is available on the homepage.", "The portal will be discontinued next month.", "Paper pay slips will still be mailed weekly.", "The office will close early on Friday."], ans: 0, exp: "句子插入題：延續操作說明，接「首頁有簡短影片教學」最連貫。" },
      { opts: ["around the clock", "out of order", "on the house", "in the red"], ans: 0, exp: "around the clock（全天候）表 IT 支援隨時待命。其餘片語語意不合。" }
    ]
  }
];
