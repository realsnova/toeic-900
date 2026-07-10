// Part 7 閱讀理解題庫（單篇與多篇，附建議時間與中文詳解）
const PART7 = [
  {
    title: "單篇：徵才廣告",
    time: 180,
    passages: [
      `MERIDIAN CONSULTING — REGIONAL ACCOUNT MANAGER

Meridian Consulting, a leader in supply chain optimization, is seeking a Regional Account Manager for its Northeast territory. The successful candidate will manage a portfolio of 25 corporate clients, identify opportunities for contract expansion, and collaborate with the analytics team to deliver quarterly performance reviews.

Requirements:
• Bachelor's degree in business, economics, or a related field
• Minimum five years of client-facing experience, preferably in logistics
• Willingness to travel up to 40% of the time
• Fluency in Spanish is a plus but not required

Meridian offers a competitive base salary with performance-based bonuses, comprehensive health coverage, and a professional development stipend of $2,000 per year. Candidates should submit a résumé and a one-page statement describing a client relationship they successfully expanded. Applications received by August 15 will be given priority.`
    ],
    qs: [
      { q: "What is indicated about the position?", opts: ["It involves regular travel.", "It is based in the Southwest.", "It requires fluency in Spanish.", "It is a temporary assignment."], ans: 0, exp: "文中提到 Willingness to travel up to 40% of the time，表示需經常出差。西班牙語是加分而非必要條件。" },
      { q: "What must applicants include with their résumé?", opts: ["A written account of a past success", "Three professional references", "A copy of their diploma", "A salary history"], ans: 0, exp: "文末要求 a one-page statement describing a client relationship they successfully expanded，即過去成功案例的書面說明。" },
      { q: "The word \"portfolio\" in paragraph 1 is closest in meaning to", opts: ["a group of accounts", "a leather briefcase", "a collection of artwork", "an investment fund"], ans: 0, exp: "此處 portfolio of 25 corporate clients 指「負責管理的一組客戶」。" }
    ]
  },
  {
    title: "單篇：商務電子郵件",
    time: 180,
    passages: [
      `To: Department Heads
From: Priya Raman, Chief Operations Officer
Subject: Vendor consolidation initiative
Date: October 2

As discussed at last month's leadership retreat, we will be reducing the number of office supply vendors from six to two, effective January 1. An internal review found that consolidating our purchasing would lower costs by an estimated 18% annually and simplify invoice processing for the accounting team.

Over the next three weeks, the procurement office will evaluate proposals from our current vendors. Selection criteria include pricing, delivery reliability, and sustainability practices. Department heads are asked to submit any concerns about specific supply needs to procurement by October 20 — after that date, the evaluation committee will finalize its shortlist, and additional requirements cannot be considered.

Please note that this initiative does not affect contracts for laboratory equipment, which are managed separately. A list of the selected vendors will be circulated in early December.`
    ],
    qs: [
      { q: "What is the main purpose of the email?", opts: ["To explain an upcoming change in purchasing", "To announce a new accounting system", "To request bids from new vendors", "To report the results of a customer survey"], ans: 0, exp: "主旨是通知供應商整併計畫（從六家減為兩家）這項採購變革。" },
      { q: "What is suggested about requests submitted after October 20?", opts: ["They will not be taken into account.", "They must be approved by the COO.", "They will be forwarded to the accounting team.", "They require a written justification."], ans: 0, exp: "文中提到 after that date... additional requirements cannot be considered，即逾期的需求將不被納入考量。" },
      { q: "What is NOT mentioned as a selection criterion?", opts: ["Company size", "Pricing", "Delivery reliability", "Sustainability practices"], ans: 0, exp: "評選標準列出 pricing, delivery reliability, and sustainability practices，未提及公司規模。NOT 題型需逐一核對。" },
      { q: "What is indicated about laboratory equipment contracts?", opts: ["They are handled through a separate process.", "They will be canceled in January.", "They represent 18% of total costs.", "They are managed by department heads."], ans: 0, exp: "最後一段明確指出實驗室設備合約 are managed separately，不受此計畫影響。" }
    ]
  },
  {
    title: "單篇：線上評論與回覆",
    time: 180,
    passages: [
      `HARBOR BISTRO — Customer Review
★★☆☆☆ Posted by Daniel M., May 8

I had high hopes for Harbor Bistro after reading the glowing reviews, but my experience fell short. We had a 7:00 P.M. reservation for four, yet we were not seated until 7:40. Our server was apologetic and the seafood risotto, when it finally arrived, was genuinely excellent. However, the private dining room we had requested for a business dinner was given to another party, which made our contract discussion awkward in the noisy main hall. For these prices, the coordination should be better.

— MANAGEMENT RESPONSE, May 9
Dear Daniel, thank you for your candid feedback. You are right that we fell short of our standards. Our reservation system was replaced that week, and several bookings, including your room request, were not transferred correctly. We have since restored all records and retrained our host staff. Please contact me directly at manager@harborbistro.com — we would like to host your next business dinner in the private room, with appetizers on the house.`
    ],
    qs: [
      { q: "What was the main source of the reviewer's dissatisfaction?", opts: ["Arrangements for his group were not honored.", "The food was poorly prepared.", "The prices were higher than advertised.", "The server was impolite."], ans: 0, exp: "評論者最主要的不滿是預約安排出錯：等位四十分鐘、預訂的包廂被讓給別人。他稱讚了餐點與服務生態度。" },
      { q: "According to the response, what caused the problem?", opts: ["A change in the booking system", "A shortage of kitchen staff", "An unusually large number of guests", "A scheduling error by the reviewer"], ans: 0, exp: "管理方回覆指出 Our reservation system was replaced that week，訂位資料未正確轉移。" },
      { q: "What does the manager offer to do?", opts: ["Provide free appetizers at a future dinner", "Refund the cost of the meal", "Extend the restaurant's hours", "Hire additional servers"], ans: 0, exp: "回覆末句提出下次商務晚餐提供包廂並招待開胃菜（appetizers on the house）。on the house = 店家免費招待。" }
    ]
  },
  {
    title: "雙篇：出差核銷（郵件＋政策）",
    time: 240,
    passages: [
      `TRAVEL EXPENSE POLICY — EXCERPT (Revised April 1)

1. All expense reports must be submitted through the FinTrack portal within 30 days of the trip's end date.
2. Original itemized receipts are required for any expense over $25.
3. Meal costs are reimbursed up to $60 per day; alcohol is not reimbursable.
4. Flights must be booked through the corporate travel desk. Bookings made independently are reimbursed only with prior written approval from a department director.
5. Reports submitted after the 30-day window require approval from both the department director and the finance office.`,
      `To: finance@nortonanalytics.com
From: Kevin Osei
Subject: Expense report — Chicago trip
Date: June 12

Hello,

I have just submitted my expense report for the client visit to Chicago that ended on May 5. I apologize for the delay — I was reassigned to the Dallas project immediately afterward and the deadline slipped my mind.

One note: because the corporate travel desk could not find a suitable return flight, my director, Ms. Whitfield, emailed me approval to book directly with the airline. I have attached her message along with the itemized receipts for all meals and the hotel.

Please let me know if anything else is needed.

Kevin Osei`
    ],
    qs: [
      { q: "What is the purpose of Kevin's email?", opts: ["To notify the finance office about a submitted report", "To request a copy of the travel policy", "To book a flight for an upcoming trip", "To complain about the travel desk"], ans: 0, exp: "Kevin 通知財務部他剛提交了芝加哥出差的核銷報告，並補充說明相關文件。" },
      { q: "What can be concluded about Kevin's expense report?", opts: ["It will need approval from the finance office as well as his director.", "It will be rejected automatically.", "It only requires his own signature.", "It was submitted within the deadline."], ans: 0, exp: "跨篇整合題：行程 5 月 5 日結束，6 月 12 日提交已超過 30 天。政策第 5 條規定逾期報告需部門主管「及」財務辦公室雙重核准。" },
      { q: "Why did Kevin book his flight directly with the airline?", opts: ["The travel desk could not find an appropriate flight.", "The corporate rate was too expensive.", "He wanted to use his personal mileage account.", "The FinTrack portal was offline."], ans: 0, exp: "郵件中說明 the corporate travel desk could not find a suitable return flight，且已事先取得主管書面核准，符合政策第 4 條。" },
      { q: "In the policy, which expense would NOT require an original receipt?", opts: ["A $18 taxi ride", "A $30 business lunch", "A $95 hotel parking fee", "A $200 conference fee"], ans: 0, exp: "政策第 2 條：超過 $25 的支出才需正本收據。$18 的計程車資低於門檻。" }
    ]
  },
  {
    title: "雙篇：產品召回（公告＋顧客來信）",
    time: 240,
    passages: [
      `NOTICE TO CUSTOMERS — VOLUNTARY RECALL

Lumen Home Appliances is voluntarily recalling the GlowMist Ultrasonic Humidifier (Model GM-400) sold between January 5 and March 20. In rare cases, a faulty power adapter may overheat. No injuries have been reported.

Affected customers may choose ONE of the following remedies:
(A) A free replacement adapter, shipped within 5 business days;
(B) A full refund, available only with proof of purchase;
(C) A store credit of $85, no receipt required.

To begin the process, visit lumenhome.com/recall and enter the serial number located on the base of the unit. Customers who purchased the GM-400 after March 20 are not affected, as those units contain the redesigned adapter.`,
      `To: recall@lumenhome.com
From: Sandra Petit
Subject: GM-400 recall
Date: April 2

To Whom It May Concern,

I purchased a GlowMist humidifier on February 14 as a gift for my mother, so the receipt was thrown away with the packaging. The serial number on her unit is GM4-22318-B.

My mother lives alone and is uncomfortable installing replacement parts herself. Given the circumstances, please let me know the best way to proceed. Also, I bought a second unit for my own home on March 28 — should I stop using that one as well?

Sandra Petit`
    ],
    qs: [
      { q: "Why is the GM-400 being recalled?", opts: ["A component may become dangerously hot.", "Several customers were injured.", "The water tank leaks.", "The packaging was mislabeled."], ans: 0, exp: "公告指出 a faulty power adapter may overheat（變壓器可能過熱），且明確說明無人受傷。" },
      { q: "Which remedy is most likely appropriate for Sandra's mother's unit?", opts: ["The $85 store credit", "The full refund", "The replacement adapter", "A repair appointment"], ans: 0, exp: "跨篇整合題：Sandra 沒有收據（全額退款需購買證明，不可行），母親不便自行安裝零件（更換變壓器不合適），因此免收據的 $85 商店抵用金最合適。" },
      { q: "What is suggested about the unit Sandra bought on March 28?", opts: ["It is not part of the recall.", "It must be returned immediately.", "It uses the faulty adapter.", "It is no longer under warranty."], ans: 0, exp: "公告說明 3 月 20 日之後售出的機型已採用重新設計的變壓器，不在召回範圍內。" },
      { q: "What information does the recall process require?", opts: ["The unit's serial number", "The original credit card number", "A photo of the adapter", "The store where it was purchased"], ans: 0, exp: "公告指示至網站 enter the serial number located on the base of the unit。" }
    ]
  },
  {
    title: "三篇：研討會報名（廣告＋郵件＋收據）",
    time: 300,
    passages: [
      `12TH ANNUAL PACIFIC MARKETING SUMMIT
November 7–9 · Harborfront Convention Center

Registration rates (per person):
• Early bird (by September 30): $420
• Standard (October 1 – November 1): $510
• On-site: $580

Groups of four or more from the same organization receive an additional 15% off the applicable rate. All passes include access to keynote sessions, workshops, and the networking dinner on November 8. Workshop seating is limited and assigned on a first-come, first-served basis.`,
      `To: events@brightwavemedia.com
From: Talia Moreno, Pacific Marketing Summit
Date: October 6
Subject: RE: Group registration inquiry

Dear Mr. Chen,

Thank you for your interest in the summit. To answer your question: yes, the group discount applies as long as all registrations are submitted together under one invoice, even if payment occurs after the early-bird deadline. However, the rate itself is determined by the date of registration, not the date of inquiry.

I have reserved five provisional spots for Brightwave Media. Please confirm by October 10, as workshop seats — particularly the AI Analytics session your colleagues requested — are nearly full.

Best regards,
Talia Moreno`,
      `PACIFIC MARKETING SUMMIT — PAYMENT CONFIRMATION
Date: October 9
Billed to: Brightwave Media, attn: D. Chen
Registrations: 5 × Standard rate
Group discount (15%): applied
Total charged: $2,167.50
Note: All five attendees confirmed for the AI Analytics workshop.`
    ],
    qs: [
      { q: "In the advertisement, what is indicated about workshop seats?", opts: ["They are allocated in order of registration.", "They cost extra for standard registrants.", "They are guaranteed for all attendees.", "They can be reserved on-site only."], ans: 0, exp: "廣告載明 first-come, first-served basis（先到先得），即依報名順序分配。" },
      { q: "Why did Brightwave Media NOT receive the early-bird rate?", opts: ["The company registered after September 30.", "The group was too small.", "Payment was made in cash.", "The early-bird rate excludes groups."], ans: 0, exp: "三篇整合題：郵件說明費率以「報名日期」為準；收據顯示 10 月 9 日以 Standard rate 計費，因為早鳥期限（9/30）已過。" },
      { q: "What was Brightwave Media required to do by October 10?", opts: ["Confirm its provisional reservations", "Submit a list of dietary restrictions", "Pay an on-site registration fee", "Choose a keynote speaker"], ans: 0, exp: "Talia 的郵件要求 Please confirm by October 10 以保留五個暫定名額。" },
      { q: "What is suggested by the payment confirmation?", opts: ["The total reflects a 15% group discount on the standard rate.", "One attendee was placed on a workshop waiting list.", "The company paid the on-site rate.", "The dinner on November 8 costs extra."], ans: 0, exp: "計算驗證：5 × $510 = $2,550，打 85 折 = $2,167.50，與收據金額吻合；且註明五人全數確認工作坊席位。" }
    ]
  },
  {
    title: "雙篇：辦公室搬遷（公告＋詢問郵件）",
    time: 240,
    passages: [
      `NOTICE TO ALL TENANTS — GRANDVIEW TOWER

Please be advised that the building's freight elevator will be reserved for move-related use only from Monday, July 14 through Friday, July 25, while several tenants relocate to the newly completed east wing. During this period:

• Move-in and move-out times must be booked at least 48 hours in advance through the building management office.
• Each tenant may reserve a maximum of two four-hour time slots per week.
• Moving crews must use the loading dock on Harper Street; the main lobby entrance may not be used for transporting furniture or equipment.
• Any damage to common areas caused during a move will be billed to the responsible tenant.

Tenants who are not relocating may continue to use the passenger elevators as usual. We appreciate your cooperation.

— Building Management`,
      `To: management@grandviewtower.com
From: Olivia Trask, Trask & Meyer Accounting
Date: July 8
Subject: Freight elevator booking

Hello,

Our firm is scheduled to move from the fifth floor to the east wing on July 17 and 18. I would like to reserve the freight elevator for the afternoon of both days — one o'clock to five o'clock, if available.

Also, our moving company has asked whether they can park a second truck near the entrance on Grandview Avenue to speed up the loading process. Could you confirm whether that is permitted?

Finally, we have a glass conference table that requires special handling. If the movers pad the elevator walls themselves, will the deposit still be required?

Thank you,
Olivia Trask`
    ],
    qs: [
      { q: "What is the main purpose of the notice?", opts: ["To explain temporary rules for using an elevator", "To announce the construction of a new wing", "To advertise vacant office space", "To schedule a fire safety inspection"], ans: 0, exp: "公告主旨是搬遷期間貨梯的使用規則（預約制、時段上限、動線限制）。新東翼完工只是背景資訊。" },
      { q: "By when must Ms. Trask book the elevator for a July 17 move?", opts: ["July 15", "July 16", "July 14", "July 8"], ans: 0, exp: "跨篇整合題：公告規定須提前至少 48 小時預約，7 月 17 日使用往前推 48 小時即 7 月 15 日前須完成預約。" },
      { q: "What does the notice suggest about Ms. Trask's second question?", opts: ["The movers may not use the Grandview Avenue entrance for loading.", "A second truck requires an extra fee.", "Trucks may park anywhere after business hours.", "The question should be sent to the moving company."], ans: 0, exp: "跨篇整合題：公告規定搬運人員必須使用 Harper Street 的卸貨區，主大廳與其他入口不得用於搬運，因此 Grandview Avenue 入口裝卸不被允許。" },
      { q: "In the email, what item is mentioned as needing special care?", opts: ["A conference table", "A photocopier", "A filing cabinet", "A chandelier"], ans: 0, exp: "郵件提到 a glass conference table that requires special handling（需要特殊處理的玻璃會議桌）。" }
    ]
  },
  {
    title: "單篇：公司內部通知",
    time: 180,
    passages: [
      `MEMORANDUM

To: All Sales Staff
From: Rachel Kim, Sales Director
Date: February 3
Re: New commission structure

Effective March 1, the sales commission structure will be updated to better reward top performers. Under the new system, representatives who exceed their quarterly target by 20 percent or more will earn an additional 5 percent commission on all sales above that threshold.

The base commission rate of 8 percent remains unchanged. However, the monthly bonus for new client acquisition will increase from $200 to $300 per client. These changes apply only to sales made on or after March 1; deals closed in February will be calculated under the current rates.

A detailed breakdown of the new structure is attached. If you have questions, please attend the optional Q&A session on February 20 at 10 A.M. in Conference Room C, or email me directly.`
    ],
    qs: [
      { q: "What is the main purpose of the memo?", opts: ["To announce changes to commission rates", "To introduce a new sales director", "To schedule a company retreat", "To report quarterly earnings"], ans: 0, exp: "備忘錄主旨是宣布三月一日起更新的佣金制度。" },
      { q: "What will happen to the new client bonus?", opts: ["It will increase to $300", "It will be eliminated", "It will stay at $200", "It will be paid quarterly"], ans: 0, exp: "文中提到新客戶開發獎金將從 $200 增至 $300（increase from $200 to $300）。" },
      { q: "How are February deals handled?", opts: ["Under the current rates", "Under the new rates", "With no commission", "At a reduced rate"], ans: 0, exp: "文中說二月成交的案子 calculated under the current rates（依現行費率計算）。" }
    ]
  },
  {
    title: "單篇：產品評論",
    time: 180,
    passages: [
      `★★★★☆ A reliable printer with one drawback
Reviewed by Kenji T. — Verified Purchase

I bought the PrintPro X200 for my small home office three months ago, and overall I'm very satisfied. Setup was straightforward — it connected to my wireless network in under five minutes, and the print quality is excellent for both documents and photos. It's also remarkably quiet compared to my old model.

The only real drawback is the cost of replacement ink. The cartridges are expensive and seem to run out faster than I expected, especially when printing in color. I'd recommend buying the high-capacity cartridges to save money in the long run.

Customer service deserves a mention too. When I had trouble installing the software, I emailed support and received a helpful reply within a few hours. I'd recommend this printer to anyone who prints occasionally, though heavy users should factor in the ink costs.`
    ],
    qs: [
      { q: "What does the reviewer like most about the printer?", opts: ["It was easy to set up and prints well", "It has very cheap ink", "It is large and powerful", "It came with free cartridges"], ans: 0, exp: "評論者稱讚安裝簡單、列印品質佳且安靜；最大優點是易用與品質。" },
      { q: "What is the main disadvantage mentioned?", opts: ["The ink is costly and runs out quickly", "The print quality is poor", "It is very noisy", "It is difficult to connect"], ans: 0, exp: "唯一缺點是墨水昂貴且消耗快（cost of replacement ink... run out faster）。" },
      { q: "What does the reviewer suggest to save money?", opts: ["Buying high-capacity cartridges", "Printing only in black and white", "Returning the printer", "Using a different brand of paper"], ans: 0, exp: "評論者建議買 high-capacity cartridges（大容量墨水匣）以長期省錢。" },
      { q: "What is indicated about customer service?", opts: ["It responded quickly and helpfully", "It was difficult to reach", "It charged an extra fee", "It only operates by phone"], ans: 0, exp: "評論者說寄信給客服，幾小時內就收到有幫助的回覆（helpful reply within a few hours）。" }
    ]
  },
  {
    title: "雙篇：活動報名（電郵＋確認信）",
    time: 240,
    passages: [
      `To: events@greentech-expo.com
From: Laura Chen
Subject: Group registration

Hello,

I would like to register a group of six people from Solaris Energy for the Green Technology Expo on April 18. I understand that groups of five or more receive a 15 percent discount on the standard $120 ticket price.

Could you also confirm whether the workshop on battery storage is included in the standard admission, or whether it requires a separate ticket? Two of my colleagues are particularly interested in attending it.

Thank you,
Laura Chen`,
      `To: Laura Chen
From: events@greentech-expo.com
Subject: RE: Group registration
Date: March 25

Dear Ms. Chen,

Thank you for your interest. I'm pleased to confirm your group registration of six at the discounted rate. The battery storage workshop is indeed included in standard admission; however, seating is limited and assigned on a first-come, first-served basis, so I recommend arriving early.

To complete your registration, please submit payment by April 4 using the secure link below. A confirmation and six entry badges will be emailed to you within two business days of payment.

Best regards,
Green Tech Expo Team`
    ],
    qs: [
      { q: "Why did Ms. Chen write the first email?", opts: ["To register a group for an event", "To cancel a reservation", "To request a refund", "To apply for a booth"], ans: 0, exp: "Laura 為 Solaris Energy 的六人團體報名綠能科技展。" },
      { q: "How much will each ticket cost Ms. Chen's group?", opts: ["$102", "$120", "$135", "$90"], ans: 0, exp: "跨篇計算：標準票 $120，五人以上打 85 折 = $120 × 0.85 = $102。" },
      { q: "What is indicated about the battery storage workshop?", opts: ["Seats are limited, so early arrival is advised", "It requires a separate ticket", "It has been canceled", "It is only for speakers"], ans: 0, exp: "確認信說工作坊含在門票內，但 seating is limited... arriving early（座位有限，建議早到）。" },
      { q: "What must Ms. Chen do by April 4?", opts: ["Submit payment", "Choose workshop seats", "Send a guest list", "Confirm dietary needs"], ans: 0, exp: "確認信要求 submit payment by April 4（四月四日前付款）以完成報名。" }
    ]
  },
  {
    title: "雙篇：飯店預訂（確認信＋詢問）",
    time: 240,
    passages: [
      `HARBORVIEW HOTEL — Reservation Confirmation

Guest: Mr. David Ortiz
Confirmation #: HV-77218
Check-in: May 12 (3:00 P.M.)  Check-out: May 15 (11:00 A.M.)
Room: Deluxe King, 2 nights... please note this reservation is for 3 nights.
Rate: $145 per night (breakfast included)
Note: Free cancellation up to 48 hours before check-in. Airport shuttle available on request for $25 each way.`,
      `To: reservations@harborviewhotel.com
From: David Ortiz
Subject: Reservation HV-77218

Hello,

I noticed my confirmation lists both "2 nights" and "3 nights," which is confusing. To clarify, I need the room for three nights, checking out on May 15 as stated. Please correct any error so I'm not undercharged or overcharged.

Also, I would like to arrange the airport shuttle for my arrival only, not the return. Finally, is it possible to guarantee an early check-in at around 1:00 P.M.? My flight lands in the morning.

Thank you,
David Ortiz`
    ],
    qs: [
      { q: "What is the main reason for Mr. Ortiz's email?", opts: ["To clarify the length of his stay", "To cancel his reservation", "To request a different hotel", "To complain about the breakfast"], ans: 0, exp: "確認信同時寫了 2 晚與 3 晚，Ortiz 寫信澄清他需要住三晚。" },
      { q: "How much will Mr. Ortiz pay for his room, excluding extras?", opts: ["$435", "$290", "$145", "$390"], ans: 0, exp: "跨篇計算：確認住三晚，$145 × 3 = $435（早餐已含）。" },
      { q: "What shuttle service does Mr. Ortiz request?", opts: ["One-way for his arrival", "Round-trip", "Return only", "None"], ans: 0, exp: "郵件說 shuttle for my arrival only, not the return（只要抵達單程）。" },
      { q: "What additional request does Mr. Ortiz make?", opts: ["An early check-in", "A late check-out", "A room upgrade", "Extra towels"], ans: 0, exp: "郵件詢問能否保證約下午一點的提前入住（guarantee an early check-in）。" }
    ]
  },
  {
    title: "單篇：徵才啟事",
    time: 180,
    passages: [
      `NOW HIRING — Warehouse Operations Supervisor
Northgate Distribution, Riverton

Northgate Distribution is seeking an experienced Operations Supervisor to oversee daily activities at our Riverton warehouse. This is a full-time position with occasional weekend shifts during peak season.

Responsibilities include managing a team of 15 warehouse staff, coordinating inbound and outbound shipments, ensuring compliance with safety regulations, and maintaining accurate inventory records.

Requirements:
• At least three years of supervisory experience in logistics or a related field
• Familiarity with warehouse management software
• Forklift certification (or willingness to obtain one within 60 days of hire)
• Strong communication and problem-solving skills

We offer a competitive salary, health benefits, paid time off, and opportunities for advancement. Interested candidates should submit a résumé and cover letter through our careers portal by March 20. Only shortlisted applicants will be contacted.`
    ],
    qs: [
      { q: "What position is being advertised?", opts: ["A warehouse supervisor", "A delivery driver", "A software engineer", "A safety inspector"], ans: 0, exp: "啟事招募倉庫營運主管（Operations Supervisor）。" },
      { q: "What is stated about forklift certification?", opts: ["It can be obtained within 60 days of hire", "It is not required", "It must be renewed yearly", "It is provided during training"], ans: 0, exp: "要求持堆高機證照，或 willingness to obtain one within 60 days（願於錄取後 60 天內取得）。" },
      { q: "What are applicants asked to submit?", opts: ["A résumé and cover letter", "Three references", "A portfolio", "A completed test"], ans: 0, exp: "啟事要求透過招募入口提交 résumé and cover letter（履歷與求職信）。" }
    ]
  }
];
