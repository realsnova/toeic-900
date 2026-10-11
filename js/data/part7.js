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
Room: Deluxe King — 2 nights
Rate: $145 per night (breakfast included)
Note: Free cancellation up to 48 hours before check-in. Airport shuttle available on request for $25 each way.`,
      `To: reservations@harborviewhotel.com
From: David Ortiz
Subject: Reservation HV-77218

Hello,

I noticed my confirmation lists my stay as "2 nights," but my dates, May 12 to May 15, are three nights. To clarify, I need the room for all three nights, checking out on May 15 as stated. Please correct any error so I'm not undercharged or overcharged.

Also, I would like to arrange the airport shuttle for my arrival only, not the return. Finally, is it possible to guarantee an early check-in at around 1:00 P.M.? My flight lands in the morning.

Thank you,
David Ortiz`
    ],
    qs: [
      { q: "What is the main reason for Mr. Ortiz's email?", opts: ["To clarify the length of his stay", "To cancel his reservation", "To request a different hotel", "To complain about the breakfast"], ans: 0, exp: "確認信寫 2 晚，但入住與退房日期（5/12–5/15）其實是 3 晚，Ortiz 寫信澄清他需要住三晚。" },
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
  },
  // ---- S1（2026-10-10）：新制題組 8 組（簡訊、線上討論、意圖題、插入句子位置題、5 題多篇題組）----
  {
    title: "單篇：簡訊對話（新制・意圖題）",
    time: 120,
    src: "S1",
    passages: [
      "Karen Liu (9:12 A.M.)\nHi Tom, are you still at the Westfield office? The projector in Conference Room B won't connect to my laptop, and the client arrives at 10.\n\nTom Becker (9:14 A.M.)\nI left about twenty minutes ago. Did you try the adapter in the top drawer of the cabinet?\n\nKaren Liu (9:15 A.M.)\nThat drawer is locked.\n\nTom Becker (9:16 A.M.)\nAh, right. Ask Priya at the front desk. She keeps the spare keys.\n\nKaren Liu (9:17 A.M.)\nWill do. Thanks!"
    ],
    qs: [
      { q: "Why does Ms. Liu contact Mr. Becker?", opts: ["She needs help with some equipment.", "She wants to reschedule a client meeting.", "She is looking for an available conference room.", "She needs directions to the Westfield office."], ans: 0, exp: "Liu 說投影機連不上筆電，客戶十點就到，所以是需要設備方面的協助。她沒有要改會議時間，也沒有在找會議室。" },
      { q: "At 9:15 A.M., what does Ms. Liu most likely mean when she writes, \"That drawer is locked\"?", opts: ["She cannot get the adapter Mr. Becker mentioned.", "She has already found the adapter.", "She thinks Mr. Becker took the adapter with him.", "She plans to move the meeting to another room."], ans: 0, exp: "意圖題：Becker 建議用抽屜裡的轉接頭，Liu 回答抽屜鎖著，意思是她拿不到那個轉接頭。接著 Becker 才告訴她去找保管備用鑰匙的 Priya。" }
    ]
  },
  {
    title: "單篇：線上討論（新制・多人聊天）",
    time: 240,
    src: "S1",
    passages: [
      "Daniel Reyes [2:03 P.M.]\nQuick update on the Lumina launch event. The venue just told me the main hall is double-booked on May 18.\n\nSophie Grant [2:04 P.M.]\nSeriously? We've already printed the invitations.\n\nDaniel Reyes [2:05 P.M.]\nThey've offered us the Garden Pavilion instead, same date, at no extra charge. It holds about 150 people.\n\nMarcus Webb [2:06 P.M.]\nWe have 210 confirmed guests.\n\nDaniel Reyes [2:07 P.M.]\nThat's the problem. The main hall is available on May 25, though.\n\nSophie Grant [2:09 P.M.]\nMoving the date means sending a correction to everyone, but at least the invitations don't list the room.\n\nAiko Tanaka [2:10 P.M.]\nI can handle the correction notices. If we decide by tomorrow, they'll go out on Thursday.\n\nDaniel Reyes [2:11 P.M.]\nLet's go with May 25. I'll confirm with the venue this afternoon."
    ],
    qs: [
      { q: "What problem does Mr. Reyes report?", opts: ["A room has been reserved by two groups for the same day.", "The invitations contain a printing error.", "The venue has raised its rental fee.", "Fewer guests than expected have confirmed."], ans: 0, exp: "double-booked 是同一個場地同一天被重複預訂。場地提供的替代方案還是 no extra charge，所以沒有漲價。" },
      { q: "At 2:06 P.M., what does Mr. Webb imply when he writes, \"We have 210 confirmed guests\"?", opts: ["The Garden Pavilion is too small for the event.", "More invitations need to be printed.", "The event should still be held on May 18.", "He is pleased with the response to the invitations."], ans: 0, exp: "意圖題：前一則訊息說 Garden Pavilion 只能容納約 150 人，Webb 指出已確認的賓客有 210 人，意思是替代場地太小。Reyes 接著也說 That's the problem。" },
      { q: "What does Ms. Grant indicate about the invitations?", opts: ["They do not mention the specific room.", "They have not been printed yet.", "They were designed by Ms. Tanaka.", "They were mailed on Thursday."], ans: 0, exp: "Grant 說 at least the invitations don't list the room（至少邀請函上沒寫是哪個廳）。她在 2:04 也說邀請函已經印好了。" },
      { q: "What will Ms. Tanaka most likely do?", opts: ["Send updated information to the guests", "Confirm the new date with the venue", "Print a new set of invitations", "Look for a larger venue"], ans: 0, exp: "Tanaka 說她來處理更正通知（correction notices），也就是寄出更新後的資訊給賓客。和場地確認是 Reyes 要做的事。" }
    ]
  },
  {
    title: "單篇：報導（新制・插入句子位置題）",
    time: 240,
    src: "S1",
    passages: [
      "RIVERTON (June 4) — Halvorsen Industries, a manufacturer of kitchen appliances, will expand its Riverton plant this fall. [1] The $40 million project will add a second assembly line and roughly 180 new jobs.\n\nCompany president Inga Halvorsen said the expansion was driven by strong demand for the company's energy-efficient dishwashers. [2] \"Our current facility has been running at full capacity for over a year,\" she said.\n\nConstruction is scheduled to begin in September and finish the following spring. [3] Hiring for the new positions will start in January, and the company plans to hold a job fair at Riverton Community College. [4]\n\nLocal officials welcomed the news. Mayor Daniel Okoye noted that the plant is already the city's third-largest employer."
    ],
    qs: [
      { q: "What is the article mainly about?", opts: ["The expansion of a manufacturing facility", "The opening of a new college campus", "A change in a company's leadership", "A new line of kitchen appliances"], ans: 0, exp: "整篇報導在說 Halvorsen Industries 擴建 Riverton 工廠：投資金額、原因、時程與招募。" },
      { q: "Why is Halvorsen Industries expanding?", opts: ["Its products are in high demand.", "It is moving out of its current building.", "It received funding from the city.", "It plans to make a new type of product."], ans: 0, exp: "總裁說擴建的原因是節能洗碗機的需求強勁（strong demand），目前的工廠已滿載運轉一年多。" },
      { q: "When will the company begin hiring for the new positions?", opts: ["In January", "In June", "In September", "In the spring"], ans: 0, exp: "Hiring for the new positions will start in January。九月是開始施工，春天是完工。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \"Sales of those models rose 35 percent last year alone.\"", opts: ["[2]", "[1]", "[3]", "[4]"], ans: 0, exp: "句中的 those models 要指前面提過的產品。[2] 前一句剛提到節能洗碗機的需求強勁，接著用去年銷售成長 35% 佐證，最連貫。" }
    ]
  },
  {
    title: "單篇：電子郵件（新制・插入句子位置題）",
    time: 180,
    src: "S1",
    passages: [
      "To: Rachel Moore <rmoore@brightpath.com>\nFrom: Customer Service <service@deskline.com>\nDate: March 9\nSubject: Order #58213\n\nDear Ms. Moore,\n\nThank you for your recent order of twelve ergonomic office chairs. [1] Unfortunately, the gray fabric you selected is temporarily out of stock, and our supplier does not expect a new shipment until April 2. [2]\n\nIf you would prefer not to wait, we can ship the same chair in charcoal or navy within three business days. [3] Alternatively, you may cancel the order for a full refund.\n\nPlease let us know how you would like to proceed by replying to this e-mail. [4] As an apology for the inconvenience, we have added a 10 percent discount to your order.\n\nSincerely,\nBen Castillo\nDeskline Customer Service"
    ],
    qs: [
      { q: "Why did Mr. Castillo write to Ms. Moore?", opts: ["To explain a delay in filling an order", "To confirm that an order has shipped", "To request payment for an order", "To ask for feedback on a product"], ans: 0, exp: "Castillo 說明她選的灰色布料缺貨，要等到 4 月 2 日才有新貨，也就是訂單會延遲。" },
      { q: "What is NOT offered to Ms. Moore?", opts: ["Free express shipping", "A different fabric color", "A full refund", "A discount"], ans: 0, exp: "NOT 題：信中提供了換成炭灰或深藍色、取消並全額退款、九折優惠，沒有提到免費快遞。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \"Both colors are made from the same durable material.\"", opts: ["[3]", "[1]", "[2]", "[4]"], ans: 0, exp: "Both colors 要指前面剛提到的兩個顏色。[3] 前一句說可以改出炭灰或深藍色，接著補充兩種顏色材質相同，最合理。" }
    ]
  },
  {
    title: "雙篇：健身中心公告＋會員來信（新制・5 題）",
    time: 330,
    src: "S1",
    passages: [
      "PINECREST FITNESS CENTER — Notice to Members\n\nThe indoor pool will be closed from July 8 to July 21 for resurfacing. During this period, members may use the pool at our Eastgate location free of charge by showing their membership card.\n\nAlso beginning July 8, the center will open one hour earlier on weekdays (5:00 A.M.) in response to member requests. Weekend hours will not change.\n\nGroup classes scheduled in the pool area, including Aqua Fit and Swim Basics, will be moved to Eastgate during the closure. Class times remain the same.\n\nQuestions? Contact Member Services at members@pinecrestfit.com.",
      "To: members@pinecrestfit.com\nFrom: Gloria Nash\nDate: July 2\nSubject: Pool closure\n\nHello,\n\nI take the Swim Basics class every Tuesday and Thursday at 6:30 P.M. I understand the class will meet at Eastgate during the closure, but I don't drive, and Eastgate is not near a bus line. Would it be possible to receive credit for the classes I miss instead?\n\nAlso, I was glad to see the new weekday hours. I've often had to skip my morning workout because the center opened too late for me to exercise before work.\n\nThank you,\nGloria Nash"
    ],
    qs: [
      { q: "What is the main purpose of the notice?", opts: ["To announce temporary changes at a facility", "To introduce a new swimming class", "To advertise a membership discount", "To explain a new fee for members"], ans: 0, exp: "公告說明泳池暫停開放、課程移到另一個據點、平日提早開門，都是設施的變動。" },
      { q: "According to the notice, what will happen beginning on July 8?", opts: ["The center will open earlier on weekdays.", "The Eastgate location will close.", "Class times will change.", "Members will receive new cards."], ans: 0, exp: "公告說從 7 月 8 日起，平日提早一小時（5:00）開門。課程時間不變（Class times remain the same）。" },
      { q: "What is suggested about Ms. Nash?", opts: ["She will have difficulty attending her class during the closure.", "She works at the Eastgate location.", "She usually exercises on weekends.", "She plans to cancel her membership."], ans: 0, exp: "Nash 說她不開車，Eastgate 又不在公車路線上，所以泳池關閉期間很難去上課。" },
      { q: "What time will Ms. Nash's class meet at Eastgate during the closure?", opts: ["6:30 P.M.", "5:00 A.M.", "6:00 A.M.", "7:30 P.M."], ans: 0, exp: "跨篇題：她的 Swim Basics 是 6:30 P.M.（第二篇），公告說課程移到 Eastgate 但時間不變（第一篇），所以仍是 6:30 P.M.。" },
      { q: "What does Ms. Nash request?", opts: ["Credit for the classes she will miss", "A ride to the Eastgate location", "A copy of the bus schedule", "A refund of her membership fee"], ans: 0, exp: "她問 Would it be possible to receive credit for the classes I miss instead?，要求補償缺席的課程。" }
    ]
  },
  {
    title: "雙篇：產品網頁＋顧客評論（新制・5 題）",
    time: 330,
    src: "S1",
    passages: [
      "Brightline Pro Label Printer — $129\n\n• Prints up to 60 labels per minute\n• Connects by USB or Bluetooth\n• Compatible with label rolls from 12 mm to 62 mm wide\n• Two-year warranty; extended three-year warranty available for $25\n\nOrder by 2:00 P.M. for same-day shipping. Free shipping on orders over $150.",
      "★★★★☆ Reviewed by Owen Clarke, May 14\n\nI bought the Brightline Pro for our small shipping business, along with a pack of 62 mm label rolls, which brought my total over the free shipping minimum. Setup took about ten minutes, and the Bluetooth connection has been reliable. The printer easily keeps up with our daily volume of about 300 packages.\n\nMy only complaint is that the instructions were hard to follow. I had to watch a video online to figure out how to load the rolls correctly. Still, I would recommend this printer to other small businesses."
    ],
    qs: [
      { q: "What is indicated about the label printer?", opts: ["It can be connected without a cable.", "It comes with a three-year warranty.", "It can print labels of any width.", "It ships free with every order."], ans: 0, exp: "網頁寫可以用藍牙連線（Bluetooth），所以不用接線。保固是兩年，三年要另外付 $25；標籤寬度限 12–62 mm；滿 $150 才免運。" },
      { q: "What is suggested about Mr. Clarke's order?", opts: ["He did not pay for shipping.", "It arrived on the day it was ordered.", "It included an extended warranty.", "It cost exactly $129."], ans: 0, exp: "跨篇題：Clarke 說加買標籤後總額超過免運門檻（第二篇），網頁說滿 $150 免運（第一篇），所以他不用付運費。" },
      { q: "In the review, the phrase \"keeps up with\" in paragraph 1 is closest in meaning to", opts: ["handles", "follows behind", "stays informed about", "repairs"], ans: 0, exp: "同義字題：The printer easily keeps up with our daily volume 是「應付得了每天約 300 件的量」，最接近 handles。" },
      { q: "What problem did Mr. Clarke have?", opts: ["He found the instructions unclear.", "The Bluetooth connection was unreliable.", "The labels were the wrong size.", "Setup took longer than expected."], ans: 0, exp: "他唯一的抱怨是說明書很難懂，還得上網看影片才學會裝標籤紙。藍牙連線很穩定，安裝只花十分鐘。" },
      { q: "What most likely is Mr. Clarke's job?", opts: ["He runs a business that sends packages.", "He repairs office equipment.", "He makes instructional videos.", "He designs product labels."], ans: 0, exp: "他說是為了自己的小型出貨事業（small shipping business）買的，每天要寄約 300 件包裹。" }
    ]
  },
  {
    title: "三篇：徵才廣告＋求職信＋面試時間表（新制・5 題）",
    time: 360,
    src: "S1",
    passages: [
      "Corwin Logistics is hiring a Warehouse Operations Supervisor for its Dayton distribution center.\n\nRequirements:\n• At least three years of supervisory experience in a warehouse setting\n• Forklift certification\n• Ability to work rotating weekend shifts\n\nPreferred: experience with inventory management software\n\nApply by October 15 at corwinlogistics.com/careers. Interviews will be held the week of October 20.",
      "To: Hiring Team <careers@corwinlogistics.com>\nFrom: Malik Hassan\nDate: October 12\nSubject: Application — Warehouse Operations Supervisor\n\nDear Hiring Team,\n\nI have submitted my application for the supervisor position in Dayton. I have managed a team of twelve at Fairmont Supply's warehouse for the past four years, and I have used StockTrack inventory software daily during that time.\n\nI should mention that my forklift certification expired in August. I have registered for a renewal course that ends on October 28 and would be happy to provide the new certificate then.\n\nI am available for an interview any day except October 22, when I will be attending a training session.\n\nSincerely,\nMalik Hassan",
      "Corwin Logistics — Interview Schedule, Week of October 20 (Dayton)\n\nMonday, Oct. 20 | 10:00 A.M. | Teresa Moy\nTuesday, Oct. 21 | 2:00 P.M. | Malik Hassan\nWednesday, Oct. 22 | 9:30 A.M. | Kevin Park\nThursday, Oct. 23 | 1:00 P.M. | Linda Ferreira\n\nAll interviews are conducted by Operations Manager Julia Brandt."
    ],
    qs: [
      { q: "What is NOT listed as a requirement for the position?", opts: ["Experience with inventory software", "Forklift certification", "Supervisory experience", "Willingness to work some weekends"], ans: 0, exp: "NOT 題：庫存軟體經驗列在 Preferred（加分條件），不是 Requirements。其他三項都是必要條件。" },
      { q: "What does Mr. Hassan indicate about himself?", opts: ["He does not currently meet one of the requirements.", "He has never used inventory software.", "He supervises more than twenty workers.", "He has worked at Corwin Logistics before."], ans: 0, exp: "跨篇題：廣告要求堆高機證照（第一篇），Hassan 說他的證照八月已過期（第二篇），所以目前不符合其中一項必要條件。他每天使用庫存軟體，管理 12 人。" },
      { q: "When will Mr. Hassan finish his renewal course?", opts: ["On October 28", "In August", "On October 15", "On October 22"], ans: 0, exp: "信中說 a renewal course that ends on October 28。八月是證照過期的時間；10 月 22 日是他要參加訓練、無法面試的日子。" },
      { q: "When will Mr. Hassan be interviewed?", opts: ["On Tuesday afternoon", "On Monday morning", "On Wednesday morning", "On Thursday afternoon"], ans: 0, exp: "面試時間表上 Malik Hassan 是 Tuesday, Oct. 21, 2:00 P.M.，也就是週二下午（避開了他無法出席的 10 月 22 日）。" },
      { q: "Who will most likely interview Mr. Hassan?", opts: ["Julia Brandt", "Teresa Moy", "Kevin Park", "Linda Ferreira"], ans: 0, exp: "時間表最後寫 All interviews are conducted by Operations Manager Julia Brandt。其他三位是應徵者。" }
    ]
  },
  {
    title: "三篇：內部備忘錄＋報名表＋電子郵件（新制・5 題）",
    time: 360,
    src: "S1",
    passages: [
      "MEMO\nTo: All staff\nFrom: Human Resources\nDate: September 3\nRe: Professional development workshops\n\nThis fall, Arden Financial will offer three workshops at our headquarters. Employees may attend up to two workshops during work hours; managers must approve all registrations.\n\n• Business Writing — September 24, 9:00 A.M.–12:00 P.M.\n• Data Visualization — October 8, 1:00–4:00 P.M.\n• Negotiation Skills — October 22, 9:00 A.M.–12:00 P.M.\n\nEach workshop is limited to 20 participants. Registration closes one week before each workshop date.",
      "WORKSHOP REGISTRATION FORM\n\nName: Helen Brooks\nDepartment: Client Accounts\nWorkshop(s): Data Visualization; Negotiation Skills\nManager approval: Samuel Ortega (signed September 12)\nDate submitted: September 12",
      "To: Helen Brooks\nFrom: Human Resources\nDate: October 2\nSubject: Workshop update\n\nDear Ms. Brooks,\n\nThank you for registering. Unfortunately, the instructor for the Negotiation Skills workshop is no longer available on October 22, so the workshop has been moved to November 5 at the same time. If this date does not work for you, you may switch to Business Writing, which we are offering again on November 12, or withdraw your registration.\n\nYour registration for the other workshop is unchanged.\n\nHuman Resources"
    ],
    qs: [
      { q: "According to the memo, what is required for employees to attend a workshop?", opts: ["Approval from a manager", "Payment of a registration fee", "Completion of an earlier workshop", "A recommendation from a coworker"], ans: 0, exp: "備忘錄說 managers must approve all registrations（所有報名都要主管核准）。" },
      { q: "What was the last day Ms. Brooks could have registered for the Data Visualization workshop?", opts: ["October 1", "September 24", "October 8", "September 12"], ans: 0, exp: "跨段推算：Data Visualization 是 10 月 8 日，報名在工作坊前一週截止，所以最晚是 10 月 1 日。9 月 12 日是她實際送出報名的日期。" },
      { q: "Why was the e-mail sent to Ms. Brooks?", opts: ["To inform her of a schedule change", "To confirm her manager's approval", "To tell her that a workshop is full", "To request payment for a workshop"], ans: 0, exp: "信中通知談判技巧工作坊因講師無法出席，從 10 月 22 日改到 11 月 5 日。" },
      { q: "What time will the Negotiation Skills workshop begin on November 5?", opts: ["9:00 A.M.", "1:00 P.M.", "12:00 P.M.", "4:00 P.M."], ans: 0, exp: "跨篇題：郵件說改到 11 月 5 日、時間不變（at the same time），備忘錄上原本是 9:00 A.M.–12:00 P.M.，所以 9:00 開始。" },
      { q: "What is indicated about the Data Visualization workshop?", opts: ["Ms. Brooks is still registered for it.", "It has been moved to November.", "It will be taught by a new instructor.", "It is no longer being offered."], ans: 0, exp: "她報名了兩個工作坊（第二篇），郵件說 Your registration for the other workshop is unchanged（第三篇），另一個就是 Data Visualization，所以她仍然是報名狀態。" }
    ]
  },
  // ---- 完整閱讀測驗 第 1 回（R1）Part 7：單篇 10 組、雙篇 2 組、三篇 3 組 ----
  {
    title: "單篇：公寓公告",
    time: 120,
    form: "R1",
    passages: [
      "ATTENTION RESIDENTS OF MAPLE COURT APARTMENTS\n\nWater service will be shut off on Tuesday, August 12, from 9:00 A.M. to 1:00 P.M. while the city replaces a valve on Elm Street. Residents are advised to store water for drinking and cooking before the shutoff begins.\n\nThe laundry room will also be unavailable during this time. We apologize for the inconvenience. If you have questions, please contact the building manager, Paul Ferris, at 555-0193."
    ],
    qs: [
      { q: "What is the purpose of the notice?", opts: ["To announce a temporary interruption in service", "To introduce a new building manager", "To request payment for repairs", "To announce the opening of a laundry room"], ans: 0, exp: "公告說週二上午 9 點到下午 1 點停水，是暫時中斷服務的通知。Paul Ferris 只是聯絡人，不是新任經理。" },
      { q: "What are residents advised to do?", opts: ["Fill containers with water before 9:00 A.M. on Tuesday", "Call the city water department", "Avoid driving on Elm Street", "Move their cars from the parking area"], ans: 0, exp: "Residents are advised to store water… before the shutoff begins：在週二上午 9 點停水前先把水裝起來備用。" }
    ]
  },
  {
    title: "單篇：清潔公司廣告",
    time: 120,
    form: "R1",
    passages: [
      "Brightway Office Cleaning\n\nKeep your workplace spotless without disrupting your business! Our trained crews clean offices in the evenings and on weekends, so your employees can work without interruption.\n\n• Daily, weekly, or monthly service plans\n• Eco-friendly cleaning products\n• Fully insured and bonded staff\n\nNew customers receive their first cleaning free when they sign up for a six-month plan. Call 555-0148 or visit brightwayclean.com for a free estimate."
    ],
    qs: [
      { q: "What is mentioned about Brightway's crews?", opts: ["They work outside normal business hours.", "They specialize in cleaning factories.", "They provide office furniture.", "They are available only on weekends."], ans: 0, exp: "廣告說清潔人員在晚上和週末工作（in the evenings and on weekends），也就是上班時間以外。不是「只有週末」。" },
      { q: "How can a new customer get a free cleaning?", opts: ["By signing up for a six-month plan", "By referring a friend", "By visiting the Web site", "By paying for a year in advance"], ans: 0, exp: "新客戶簽六個月方案，第一次清潔免費（New customers receive their first cleaning free when they sign up for a six-month plan）。" }
    ]
  },
  {
    title: "單篇：發票",
    time: 120,
    form: "R1",
    passages: [
      "Hartley Office Supply — INVOICE #20417\n\nBill to: Larkspur Dental Clinic, 88 Fenwick Road\nOrder date: September 3    Delivery date: September 5\n\nItem | Qty | Unit price | Total\nPrinter paper (box of 10 reams) | 3 | $42.00 | $126.00\nToner cartridge, black | 2 | $68.00 | $136.00\nDesk organizer | 4 | $12.50 | $50.00\n\nSubtotal: $312.00\nDelivery: $0.00 (free on orders over $300)\nTotal due: $312.00\n\nPayment due within 30 days. A 2 percent late fee applies to overdue balances."
    ],
    qs: [
      { q: "What is indicated about the order?", opts: ["It qualified for free delivery.", "It was delivered on September 3.", "It included a printer.", "It has already been paid for."], ans: 0, exp: "小計 $312 超過 $300，所以運費是 $0。9 月 3 日是訂購日，送達是 9 月 5 日；訂單裡有碳粉匣但沒有印表機。" },
      { q: "What will happen if the clinic pays late?", opts: ["An additional charge will be added.", "The order will be canceled.", "Future deliveries will be delayed.", "A discount will be removed."], ans: 0, exp: "A 2 percent late fee applies to overdue balances：逾期會加收 2% 滯納金。" }
    ]
  },
  {
    title: "單篇：簡訊對話（意圖題）",
    time: 120,
    form: "R1",
    passages: [
      "Marco Silva (11:42 A.M.)\nHi Jenna. The caterer just called. They can't deliver the sandwiches for the 1:00 training until 1:30.\n\nJenna Wu (11:44 A.M.)\nHmm. The session starts at 1:00 sharp, and the trainer has a flight at 5.\n\nMarco Silva (11:45 A.M.)\nShould I look for another caterer?\n\nJenna Wu (11:46 A.M.)\nOn such short notice? Let's just start on time and take a break when the food arrives.\n\nMarco Silva (11:47 A.M.)\nOK, I'll let the trainer know."
    ],
    qs: [
      { q: "What problem does Mr. Silva mention?", opts: ["A food delivery will be late.", "A trainer has canceled a session.", "A room has been double-booked.", "A flight has been delayed."], ans: 0, exp: "外燴廠商說三明治要到 1:30 才能送到，比訓練開始時間晚。" },
      { q: "At 11:46 A.M., what does Ms. Wu most likely mean when she writes, \"On such short notice?\"", opts: ["She doubts another caterer can be found in time.", "She is surprised the training was scheduled so soon.", "She wants Mr. Silva to give the trainer more notice.", "She would like to cancel the training."], ans: 0, exp: "意圖題：Silva 問要不要找別家外燴，Wu 回「這麼臨時？」，意思是這麼短的時間內大概找不到，接著提議照常開始、餐點到了再休息。" }
    ]
  },
  {
    title: "單篇：電子郵件",
    time: 180,
    form: "R1",
    passages: [
      "To: Priya Nair <pnair@coastline.com>\nFrom: Daniel Osei <dosei@vantagepr.com>\nDate: November 4\nSubject: Press release draft\n\nDear Ms. Nair,\n\nAttached is the draft press release announcing Coastline's new line of solar-powered outdoor lights. I have incorporated the product details you sent last week, along with a quote from your CEO.\n\nBefore we distribute the release to our media contacts, please confirm the launch date. Your earlier e-mail said November 20, but the product brochure lists November 27. We would like to send the release at least ten days before the launch.\n\nOnce I hear from you, I will finalize the document and prepare the list of publications.\n\nBest regards,\nDaniel Osei\nVantage Public Relations"
    ],
    qs: [
      { q: "Why did Mr. Osei write the e-mail?", opts: ["To ask for confirmation of a detail", "To request samples of a product", "To schedule an interview with a CEO", "To report that a release has been published"], ans: 0, exp: "Osei 請 Nair 確認上市日期，因為她的信和型錄上的日期不一致。" },
      { q: "What is suggested about the press release?", opts: ["It has not yet been sent to the media.", "It was written by Ms. Nair.", "It describes several companies' products.", "It will be printed in a brochure."], ans: 0, exp: "信中說 Before we distribute the release to our media contacts，所以新聞稿還沒發給媒體。新聞稿是 Osei 寫的草稿。" },
      { q: "If the launch date is November 20, what is the latest date the release can be sent?", opts: ["November 10", "November 4", "November 17", "November 27"], ans: 0, exp: "他們想在上市前至少十天發稿：11 月 20 日往前十天是 11 月 10 日。" }
    ]
  },
  {
    title: "單篇：報導（插入句子位置題）",
    time: 180,
    form: "R1",
    passages: [
      "BAYSIDE (April 2) — Fernwood Grocers will open its first store in Bayside on May 15, the company announced yesterday. The 3,000-square-meter store will be located in the former Harbor Books building on Pier Street. [1]\n\nFernwood, which operates 22 stores across the region, is known for its large selection of locally grown produce. [2] The Bayside location will also include a café and a cooking school offering evening classes.\n\n\"We've wanted to come to Bayside for years,\" said Fernwood president Alan Moreau. [3] \"When the Harbor Books building became available, we knew it was the right fit.\"\n\nThe store expects to hire about 60 employees. [4] Applications are being accepted on the company's Web site."
    ],
    qs: [
      { q: "What is the article mainly about?", opts: ["The opening of a new store", "The closing of a bookstore", "A cooking competition", "A local farming program"], ans: 0, exp: "整篇在說 Fernwood Grocers 要在 Bayside 開第一家店。Harbor Books 只是店面原本的用途。" },
      { q: "What is NOT mentioned as a feature of the Bayside store?", opts: ["A pharmacy", "A café", "A cooking school", "Locally grown produce"], ans: 0, exp: "NOT 題：文中提到咖啡館、烹飪教室，以及 Fernwood 以在地農產品聞名；沒有提到藥局。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \"About half of its fruits and vegetables come from farms within 100 kilometers.\"", opts: ["[2]", "[1]", "[3]", "[4]"], ans: 0, exp: "its fruits and vegetables 要接在提到農產品的句子後面。[2] 前一句說 Fernwood 以大量在地農產品聞名，接著用「一半蔬果來自 100 公里內的農場」說明，最連貫。" }
    ]
  },
  {
    title: "單篇：網頁（藝術中心課程）",
    time: 180,
    form: "R1",
    passages: [
      "www.lindenartcenter.org/classes\n\nLinden Art Center — Fall Classes\n\nWatercolor for Beginners — Mondays, 6:00–8:00 P.M., Sept. 8–Oct. 27. Instructor: Grace Holm. $160\n\nPortrait Drawing — Wednesdays, 6:30–8:30 P.M., Sept. 10–Oct. 29. Instructor: Victor Lam. $180\n\nDigital Photography — Saturdays, 10:00 A.M.–12:00 P.M., Sept. 13–Nov. 1. Instructor: Ruth Adeyemi. $200 (students must bring their own camera)\n\nMembers of the Linden Art Center receive a 15 percent discount on all classes. All supplies are included except where noted. Register online or at the front desk. Classes with fewer than six registered students by September 1 may be canceled."
    ],
    qs: [
      { q: "What is true about the Digital Photography class?", opts: ["Students must provide their own equipment.", "It meets on weekday evenings.", "It is taught by Victor Lam.", "It is the least expensive class."], ans: 0, exp: "攝影課註明 students must bring their own camera（學生要自備相機）。它在週六上午、由 Ruth Adeyemi 授課，而且是最貴的。" },
      { q: "How much would a member pay for Portrait Drawing?", opts: ["$153", "$180", "$160", "$136"], ans: 0, exp: "人像素描 $180，會員打 85 折：180 × 0.85 = $153。" },
      { q: "According to the Web page, why might a class be canceled?", opts: ["Not enough people register for it.", "The instructor is unavailable.", "The art center is being renovated.", "Supplies have not arrived."], ans: 0, exp: "Classes with fewer than six registered students by September 1 may be canceled：報名人數不足六人可能取消。" }
    ]
  },
  {
    title: "單篇：信件（插入句子位置題）",
    time: 240,
    form: "R1",
    passages: [
      "Pinecrest Medical Group\n410 Lakeview Drive, Suite 200\nAshford, OR 97520\n\nOctober 6\n\nMs. Teresa Lund\n27 Willow Lane\nAshford, OR 97521\n\nDear Ms. Lund,\n\nWe are writing to let you know that Dr. Samuel Bryce will be retiring at the end of this year after 30 years of practice. [1] We are grateful for his many years of service to our patients.\n\nBeginning January 2, Dr. Bryce's patients will be cared for by Dr. Helena Ruiz, who joined Pinecrest in August. [2] Dr. Ruiz completed her training at Ashford University Hospital and has a special interest in sports medicine.\n\nYour medical records will be transferred to Dr. Ruiz automatically. [3] If you would prefer to see another doctor at Pinecrest, please call our office at 555-0170, and we will be happy to help.\n\n[4] Dr. Bryce will be at the clinic until December 19 and looks forward to seeing many of you before then.\n\nSincerely,\nMonica Hale\nOffice Manager"
    ],
    qs: [
      { q: "Why was the letter sent?", opts: ["To inform a patient about a change in doctors", "To remind a patient of an appointment", "To announce the opening of a new clinic", "To request updated medical records"], ans: 0, exp: "信中通知 Bryce 醫師年底退休，病人明年起改由 Ruiz 醫師照顧。" },
      { q: "What is indicated about Dr. Ruiz?", opts: ["She has been working at Pinecrest for a few months.", "She trained under Dr. Bryce.", "She will retire next year.", "She specializes in children's medicine."], ans: 0, exp: "Ruiz 八月加入 Pinecrest，信是十月寫的，所以她已經在這裡工作幾個月了。她的專長是運動醫學，不是兒科。" },
      { q: "What should Ms. Lund do if she wants to see a different doctor?", opts: ["Telephone the clinic", "Visit the clinic before December 19", "Write a letter to Dr. Bryce", "Fill out a form online"], ans: 0, exp: "想看其他醫師的話，請打電話到診所（please call our office at 555-0170）。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \"You do not need to take any action.\"", opts: ["[3]", "[1]", "[2]", "[4]"], ans: 0, exp: "前一句說病歷會「自動」轉給 Ruiz 醫師，接著說「您不需要做任何事」最連貫；下一句再說明想換其他醫師時該怎麼做。" }
    ]
  },
  {
    title: "單篇：線上討論（意圖題）",
    time: 240,
    form: "R1",
    passages: [
      "Olivia Grant [10:02 A.M.]\nThe Kensington client wants the revised floor plans by Thursday instead of Friday. Can we manage that?\n\nRavi Patel [10:04 A.M.]\nThe layout is done. I'm just waiting on the lighting specifications from Henrik.\n\nHenrik Dahl [10:05 A.M.]\nI'll have those to you by noon tomorrow.\n\nOlivia Grant [10:06 A.M.]\nThat leaves Ravi only a day and a half.\n\nRavi Patel [10:07 A.M.]\nThat's plenty. The final drawings won't take long once I have the specs.\n\nMei Chen [10:09 A.M.]\nI can do the 3D renderings Wednesday night if Ravi sends me the files by 5.\n\nOlivia Grant [10:10 A.M.]\nGreat. I'll tell the client we'll deliver Thursday morning."
    ],
    qs: [
      { q: "What is the discussion mainly about?", opts: ["Meeting an earlier deadline", "Hiring a lighting specialist", "Reducing the cost of a project", "Scheduling a client visit"], ans: 0, exp: "客戶要求從週五提前到週四交平面圖，大家在討論能不能趕上。" },
      { q: "What is Mr. Patel waiting for?", opts: ["Information from a colleague", "Approval from the client", "Payment for a project", "3D renderings"], ans: 0, exp: "Patel 說他在等 Henrik 的照明規格（lighting specifications from Henrik），Henrik 是同事。" },
      { q: "At 10:07 A.M., what does Mr. Patel mean when he writes, \"That's plenty\"?", opts: ["He has enough time to finish his work.", "He has received enough information.", "The client has paid enough for the project.", "Too many people are working on the project."], ans: 0, exp: "意圖題：Grant 擔心 Patel 只剩一天半，Patel 回「那很夠了」，接著說拿到規格後完稿不會花太久，意思是時間足夠。" },
      { q: "What will Ms. Chen most likely do on Wednesday?", opts: ["Create images of the design", "Meet with the client", "Send files to Mr. Patel", "Prepare lighting specifications"], ans: 0, exp: "Chen 說她可以在週三晚上做 3D 渲染圖（3D renderings），也就是設計的立體圖像。是 Patel 要把檔案寄給她。" }
    ]
  },
  {
    title: "單篇：報導（同義字題）",
    time: 240,
    form: "R1",
    passages: [
      "Remote Work Reshapes Office Market\nBy Hannah Lowe\n\nDemand for traditional office space in the city center has fallen for the third year in a row, according to a report released Monday by the Metropolitan Business Council. The vacancy rate for downtown offices now stands at 18 percent, up from 11 percent three years ago.\n\nThe report attributes the decline mainly to the growth of remote and hybrid work. Many companies have reduced the size of their offices, choosing instead to rent shared workspaces for days when employees come in.\n\nHowever, not all landlords are struggling. Buildings that offer modern amenities, such as fitness centers, outdoor terraces, and flexible floor plans, have kept occupancy rates above 90 percent. \"Tenants are willing to pay more for space that gives employees a reason to come to the office,\" said council director Martin Abe.\n\nSome property owners are now converting older office buildings into apartments, a trend the council expects to continue."
    ],
    qs: [
      { q: "What is the article mainly about?", opts: ["Changes in the demand for office space", "The construction of a new fitness center", "A city's plan to build apartments", "The benefits of working from home"], ans: 0, exp: "報導說市中心辦公室需求連續三年下降、空置率上升，以及哪些大樓仍然搶手，主題是辦公室市場需求的變化。" },
      { q: "What was the downtown office vacancy rate three years ago?", opts: ["11 percent", "18 percent", "90 percent", "3 percent"], ans: 0, exp: "The vacancy rate… now stands at 18 percent, up from 11 percent three years ago：三年前是 11%。" },
      { q: "In paragraph 3, the word \"kept\" is closest in meaning to", opts: ["maintained", "stored", "delayed", "prevented"], ans: 0, exp: "同義字題：have kept occupancy rates above 90 percent 是「維持」出租率在九成以上，最接近 maintained。" },
      { q: "According to Mr. Abe, why are some buildings successful?", opts: ["They offer features that attract workers.", "They charge lower rents.", "They are located near train stations.", "They have been converted into apartments."], ans: 0, exp: "Abe 說租戶願意為「讓員工有理由進辦公室」的空間多付錢，也就是提供健身中心、露台等吸引員工的設施。報導說租戶願意付更多，不是租金比較低。" }
    ]
  },
  {
    title: "雙篇：講者通知信＋議程表",
    time: 300,
    form: "R1",
    passages: [
      "To: All Conference Speakers\nFrom: Nadia Petrov, Program Coordinator\nDate: February 3\nSubject: Northwest Retail Summit — final schedule\n\nDear Speakers,\n\nThank you for agreeing to present at this year's Northwest Retail Summit, which will take place on March 6 at the Harborview Convention Center. The final schedule is attached.\n\nPlease arrive at least 30 minutes before your session begins so that our technical staff can test your equipment. Presentation slides should be sent to me by February 27.\n\nSpeakers whose sessions are in the Cedar Room should note that this room does not have a microphone system, as it is our smallest space.\n\nBest regards,\nNadia Petrov",
      "Northwest Retail Summit — March 6\n\n9:00 A.M. | Opening Remarks | Main Hall | Nadia Petrov\n9:30 A.M. | The Future of Online Shopping | Main Hall | Gregory Hale\n11:00 A.M. | Building Customer Loyalty | Cedar Room | Amira Saleh\n1:00 P.M. | Managing Inventory Costs | Pine Room | Lucas Brandt\n2:30 P.M. | Designing Store Layouts | Cedar Room | Erin Walsh"
    ],
    qs: [
      { q: "What is the purpose of the e-mail?", opts: ["To provide information to presenters", "To invite people to attend a summit", "To announce a change of venue", "To request feedback on a conference"], ans: 0, exp: "信是寫給所有講者，說明議程、報到時間、投影片期限和會議室設備。" },
      { q: "By when should speakers send their slides?", opts: ["February 27", "February 3", "March 6", "March 1"], ans: 0, exp: "投影片要在 2 月 27 日前寄給 Petrov（Presentation slides should be sent to me by February 27）。" },
      { q: "What is the latest time Mr. Brandt should arrive?", opts: ["12:30 P.M.", "1:00 P.M.", "9:00 A.M.", "2:00 P.M."], ans: 0, exp: "跨篇題：Brandt 的場次是下午 1:00（第二篇），講者要提前至少 30 分鐘到（第一篇），所以最晚 12:30。" },
      { q: "Who will most likely present without a microphone?", opts: ["Erin Walsh", "Lucas Brandt", "Gregory Hale", "Nadia Petrov"], ans: 0, exp: "跨篇題：Cedar Room 沒有麥克風（第一篇）；議程表上 Erin Walsh 的場次在 Cedar Room（第二篇）。" },
      { q: "What is suggested about the Cedar Room?", opts: ["It is the smallest room at the venue.", "It will be used only in the morning.", "It has the newest equipment.", "It is next to the Main Hall."], ans: 0, exp: "信中說 Cedar Room 沒有麥克風系統，as it is our smallest space（因為它是最小的場地）。下午 2:30 也有場次在這裡。" }
    ]
  },
  {
    title: "雙篇：家具特賣廣告＋顧客來信",
    time: 300,
    form: "R1",
    passages: [
      "SUMMIT FURNITURE — SPRING SALE\nApril 1–15 only!\n\n• 25% off all office chairs\n• 15% off desks and bookcases\n• Free delivery within 30 kilometers of any Summit store\n\nCan't visit in person? Shop online at summitfurniture.com. Online orders placed during the sale also qualify for sale prices.\n\nStore hours: Monday–Saturday 9 A.M.–8 P.M.; Sunday 11 A.M.–6 P.M.",
      "To: Customer Service <help@summitfurniture.com>\nFrom: Kenji Watanabe\nDate: April 9\nSubject: Order #A-5521\n\nHello,\n\nOn April 6, I ordered two ergonomic office chairs and a standing desk from your Web site. The chairs arrived yesterday, but the desk is not expected until April 20. I live about 45 kilometers from your Riverside store, so I paid a delivery fee, and I would prefer not to pay a second time for the desk.\n\nAlso, the chairs were charged at full price, even though the sale was in effect when I ordered. Could you please look into this?\n\nThank you,\nKenji Watanabe"
    ],
    qs: [
      { q: "What is NOT offered during the sale?", opts: ["Discounts on lighting", "Lower prices on chairs", "Reduced prices on bookcases", "Free delivery to nearby customers"], ans: 0, exp: "NOT 題：特賣有椅子 75 折、書桌和書櫃 85 折、30 公里內免運，沒有提到燈具。" },
      { q: "Why did Mr. Watanabe have to pay for delivery?", opts: ["He lives too far from a store.", "He ordered items online.", "He placed his order after the sale ended.", "He requested express delivery."], ans: 0, exp: "跨篇題：免運限 30 公里內（第一篇），Watanabe 住在離門市約 45 公里的地方（第二篇）。網購也適用特價，所以不是因為網購。" },
      { q: "What discount should Mr. Watanabe have received on the chairs?", opts: ["25 percent", "15 percent", "30 percent", "45 percent"], ans: 0, exp: "跨篇題：他 4 月 6 日下單，在特賣期間內；辦公椅打 75 折，也就是 25% off。" },
      { q: "What is indicated about the desk?", opts: ["It will arrive after the sale has ended.", "It was charged at the sale price.", "Its order has been canceled.", "It is out of stock at the Riverside store."], ans: 0, exp: "跨篇題：書桌預計 4 月 20 日才到（第二篇），特賣只到 4 月 15 日（第一篇）。信中沒有說書桌用什麼價格計算。" },
      { q: "What does Mr. Watanabe ask the company to do?", opts: ["Look into a billing problem", "Exchange one of the chairs", "Deliver the desk sooner", "Refund his entire order"], ans: 0, exp: "他說椅子被收了原價，請公司查明（Could you please look into this?），也就是處理收費問題。" }
    ]
  },
  {
    title: "三篇：獨木舟行程網頁＋訂位信＋評論",
    time: 300,
    form: "R1",
    passages: [
      "Coastal Kayak Tours — Tour Options\n\nHarbor Sunset Tour: 2 hours, departs 6:00 P.M. daily, $55 per person. Suitable for beginners.\n\nIsland Explorer Tour: 4 hours, departs 9:00 A.M. on weekends, $95 per person, lunch included. Some kayaking experience required.\n\nPrivate Group Tour: customizable route and schedule, minimum 6 people, $80 per person.\n\nAll tours include equipment and a certified guide. Bookings canceled at least 48 hours in advance receive a full refund.",
      "To: bookings@coastalkayak.com\nFrom: Laura Mendes\nDate: June 10\nSubject: Group booking\n\nHello,\n\nI would like to book a tour for my team of eight on Saturday, June 21. None of us has kayaked before, so we'd prefer something suitable for beginners. Ideally, we'd go in the morning, since several of us have commitments in the evening. Could you arrange a route along the harbor?\n\nThank you,\nLaura Mendes, Brightline Consulting",
      "★★★★★ Posted June 24 by L. Mendes\n\nOur team had a fantastic morning on the water with our guide, Tomás. He adjusted the route when the wind picked up and kept everyone safe and laughing. We even saw seals near the old lighthouse! The only drawback was that the changing rooms were quite small for a group our size. Highly recommended for team outings."
    ],
    qs: [
      { q: "What is required for the Island Explorer Tour?", opts: ["Previous kayaking experience", "A group of at least six people", "Payment in advance", "A reservation made 48 hours ahead"], ans: 0, exp: "Island Explorer Tour 註明 Some kayaking experience required（需要一些划獨木舟的經驗）。至少六人是私人團的條件。" },
      { q: "Which tour did Ms. Mendes's team most likely take?", opts: ["Private Group Tour", "Harbor Sunset Tour", "Island Explorer Tour", "Seal Watching Tour"], ans: 0, exp: "跨篇題：她們八人、都是新手、想在早上出發、自訂港灣路線（第二篇）；夕陽團在傍晚，島嶼團要經驗，只有可自訂路線和時間的私人團符合（第一篇）。評論也說是上午出團（第三篇）。" },
      { q: "How much did the tour most likely cost for the whole team?", opts: ["$640", "$440", "$760", "$480"], ans: 0, exp: "跨篇題：私人團每人 $80（第一篇），團隊八人（第二篇）：80 × 8 = $640。" },
      { q: "What is suggested about Tomás?", opts: ["He changed plans in response to the weather.", "He works at a lighthouse.", "He organized the team outing.", "He provided lunch for the group."], ans: 0, exp: "評論說起風時（when the wind picked up）他調整了路線。" },
      { q: "What did Ms. Mendes dislike?", opts: ["The size of a facility", "The length of the tour", "The price of the tour", "The behavior of the guide"], ans: 0, exp: "唯一的缺點是更衣室對她們這麼多人來說太小（the changing rooms were quite small）。" }
    ]
  },
  {
    title: "三篇：社區菜園公告＋申請表＋電子郵件",
    time: 300,
    form: "R1",
    passages: [
      "CITY OF MILFORD — Community Garden Plots Available\n\nApplications are now being accepted for plots at the Riverside Community Garden for the upcoming growing season (April–October).\n\nPlot sizes and annual fees:\nSmall (2 m × 3 m): $40\nMedium (3 m × 4 m): $65\nLarge (4 m × 6 m): $90\n\nMilford residents receive priority. Applications received by February 28 will be processed first; plots will then be assigned on a first-come, first-served basis. Water and basic tools are provided. Gardeners must attend a one-hour orientation session before planting.",
      "RIVERSIDE COMMUNITY GARDEN — PLOT APPLICATION\n\nName: Arthur Benoit\nAddress: 14 Chestnut Street, Milford\nPhone: 555-0116\nPlot size requested: Medium\nPrevious experience: Grew vegetables on my balcony for 3 years.\nOrientation session preference: ☐ March 22 (Sat., 10 A.M.)  ☑ March 26 (Wed., 6 P.M.)\nDate submitted: February 25",
      "To: Arthur Benoit\nFrom: Parks Department, City of Milford\nDate: March 10\nSubject: Your garden plot\n\nDear Mr. Benoit,\n\nWe are pleased to confirm your plot at the Riverside Community Garden. Due to high demand for medium plots, we have assigned you a small plot (#27) instead. The difference in fees will be refunded to the card you used to pay. If a medium plot becomes available, we will contact you.\n\nYour orientation session is confirmed for the date you selected.\n\nParks Department"
    ],
    qs: [
      { q: "What is mentioned about the community garden?", opts: ["Gardeners are provided with water.", "It is open all year.", "Only Milford residents may apply.", "Plots are assigned by lottery."], ans: 0, exp: "公告說 Water and basic tools are provided。種植季是 4 到 10 月；米爾福德居民只是優先，不是只限居民；分配方式是先到先得，不是抽籤。" },
      { q: "What is indicated about Mr. Benoit's application?", opts: ["It was submitted before the priority deadline.", "It did not include a phone number.", "It requested a large plot.", "It was rejected."], ans: 0, exp: "跨篇題：2 月 28 日前收到的申請優先處理（第一篇），他 2 月 25 日送出（第二篇）。" },
      { q: "How much will Mr. Benoit most likely be refunded?", opts: ["$25", "$40", "$65", "$50"], ans: 0, exp: "跨篇題：他申請中型（$65），被改分配小型（$40）（第一、三篇），退還差額 65 − 40 = $25。" },
      { q: "When will Mr. Benoit attend an orientation session?", opts: ["On March 26", "On March 22", "On March 10", "On February 28"], ans: 0, exp: "跨篇題：他勾選 3 月 26 日（第二篇），郵件說說明會確認是他選的日期（第三篇）。" },
      { q: "According to the e-mail, why was Mr. Benoit assigned a different plot?", opts: ["Plots of the size he requested were in high demand.", "He applied after the deadline.", "He did not pay the full fee.", "He lacks gardening experience."], ans: 0, exp: "Due to high demand for medium plots：中型菜園需求太高。" }
    ]
  },
  {
    title: "三篇：報導＋備忘錄＋問卷結果表",
    time: 300,
    form: "R1",
    passages: [
      "Dalton Foods to Introduce Four-Day Workweek\n\nCHESTER (July 8) — Dalton Foods, a maker of frozen meals, will test a four-day workweek at its Chester headquarters beginning September 1. Office employees will work ten hours a day, Monday through Thursday, instead of eight hours a day, five days a week. Factory employees are not included in the trial, which will last six months.\n\nCompany spokesperson Irene Faulk said the change is intended to improve employee satisfaction and reduce commuting costs. \"If the trial succeeds, we will consider expanding it to our other offices,\" she said.",
      "MEMO\nTo: Chester office staff\nFrom: Human Resources\nDate: August 15\nRe: Four-day workweek trial\n\nAs announced, the trial schedule will begin on September 1. Core hours will be 8:00 A.M. to 6:30 P.M., with a 30-minute lunch break. Employees whose duties require coverage on Fridays, such as customer service staff, will work Tuesday through Friday instead.\n\nA survey about the new schedule will be sent to all participants at the end of each month. Please complete it within one week.",
      "Survey Results — Four-Day Workweek Trial (Chester office)\n\nMonth | Participants responding | Satisfied or very satisfied\nSeptember | 182 | 74%\nOctober | 176 | 81%\nNovember | 179 | 85%"
    ],
    qs: [
      { q: "What is the purpose of the article?", opts: ["To report on a planned change in working hours", "To announce the opening of a new factory", "To describe a new line of frozen meals", "To explain a change in company leadership"], ans: 0, exp: "報導 Dalton Foods 將試行每週四天工作制，是工作時間的變動。" },
      { q: "Who is NOT taking part in the trial?", opts: ["Factory employees", "Customer service staff", "Office employees", "Human Resources staff"], ans: 0, exp: "Factory employees are not included in the trial。客服人員也參加，只是改成週二到週五。" },
      { q: "What is suggested about customer service staff?", opts: ["They do not work on Mondays during the trial.", "They work eight hours a day.", "They are based at the factory.", "They complete a weekly survey."], ans: 0, exp: "備忘錄說需要週五有人值班的員工（例如客服）改成週二到週五上班，所以試行期間週一不上班。問卷是每月一次。" },
      { q: "According to the survey results, in which month was satisfaction the highest?", opts: ["November", "September", "October", "December"], ans: 0, exp: "表格中十一月的滿意比例最高（85%）。表格沒有十二月的資料。" },
      { q: "When will the trial most likely end?", opts: ["At the end of February", "At the end of November", "At the end of September", "At the end of December"], ans: 0, exp: "跨篇推算：9 月 1 日開始（第一、二篇），為期六個月（第一篇），所以約在隔年二月底結束。" }
    ]
  },
  // ---- 完整閱讀測驗 第 2 回（R2）Part 7：單篇 10 組、雙篇 2 組、三篇 3 組 ----
  {
    title: "單篇：圖書館公告",
    time: 120,
    form: "R2",
    passages: [
      "LAKEVIEW PUBLIC LIBRARY — NEW HOURS\n\nBeginning September 1, the library will extend its weekday hours. The new schedule is:\n\nMonday–Thursday: 9:00 A.M.–9:00 P.M.\nFriday: 9:00 A.M.–6:00 P.M.\nSaturday: 10:00 A.M.–5:00 P.M.\nSunday: Closed\n\nThe change was made in response to a survey in which many residents asked for evening hours. The children's reading room will continue to close at 6:00 P.M. every day."
    ],
    qs: [
      { q: "What is the purpose of the notice?", opts: ["To announce a change in opening hours", "To request responses to a survey", "To introduce a new children's room", "To announce that the library will close"], ans: 0, exp: "公告說明 9 月 1 日起延長平日開放時間，並列出新的時間表。" },
      { q: "According to the notice, why were the hours changed?", opts: ["Residents asked for evening hours.", "The library hired more staff.", "Fewer people visit on Sundays.", "The children's room was expanded."], ans: 0, exp: "公告說調整時間是因為問卷中很多居民希望晚上也開放（many residents asked for evening hours）。" }
    ]
  },
  {
    title: "單篇：共享辦公室廣告",
    time: 120,
    form: "R2",
    passages: [
      "WORKHUB DOWNTOWN — Flexible Office Space\n\nNeed a professional place to work without signing a long-term lease? WorkHub offers private offices, shared desks, and meeting rooms, all with high-speed Internet and free coffee.\n\n• Day pass: $25\n• Monthly shared desk: $280\n• Monthly private office: $650\n\nMembers can book our meeting rooms at no charge for up to four hours per month. Visit us at 200 Grant Street for a free one-day trial."
    ],
    qs: [
      { q: "For whom is the advertisement most likely intended?", opts: ["People who need flexible workspace", "Coffee shop owners", "Real estate agents", "Internet service providers"], ans: 0, exp: "廣告訴求「不用簽長期租約就有專業的工作空間」，對象是需要彈性辦公空間的人。" },
      { q: "What do members receive at no charge?", opts: ["Limited use of meeting rooms", "A private office", "A monthly parking space", "Printing services"], ans: 0, exp: "Members can book our meeting rooms at no charge for up to four hours per month：會員每月可免費使用會議室最多四小時。" }
    ]
  },
  {
    title: "單篇：租車明細",
    time: 120,
    form: "R2",
    passages: [
      "QUICKWAY CAR RENTAL — Rental Agreement Summary\n\nCustomer: Elena Varga\nPick-up: Denver Airport, May 4, 10:00 A.M.\nReturn: Denver Airport, May 7, 10:00 A.M.\nVehicle: Compact sedan\n\nDaily rate: $48 × 3 days = $144\nGPS navigation: $9 × 3 days = $27\nTotal: $171\n\nFuel policy: Return the vehicle with a full tank to avoid a $60 refueling charge."
    ],
    qs: [
      { q: "For how long did Ms. Varga rent the car?", opts: ["Three days", "Four days", "Seven days", "One week"], ans: 0, exp: "5 月 4 日早上 10 點取車，5 月 7 日早上 10 點還車，明細也是 × 3 days，共三天。" },
      { q: "How can Ms. Varga avoid an additional charge?", opts: ["By filling the gas tank before returning the car", "By returning the GPS unit early", "By paying in cash", "By choosing a larger car"], ans: 0, exp: "Return the vehicle with a full tank to avoid a $60 refueling charge：還車前加滿油就不用付 $60 加油費。" }
    ]
  },
  {
    title: "單篇：簡訊對話（意圖題）",
    time: 120,
    form: "R2",
    passages: [
      "Ana Costa (3:05 P.M.)\nHi Luis. I'm at the print shop picking up the brochures for tomorrow's trade show. They printed 300 instead of 500.\n\nLuis Park (3:07 P.M.)\nCan they print the rest today?\n\nAna Costa (3:08 P.M.)\nThey said not before Thursday.\n\nLuis Park (3:09 P.M.)\nThe show is only one day. We'll hand out the 300 and collect e-mail addresses from everyone else.\n\nAna Costa (3:10 P.M.)\nGood idea. I'll bring a sign-up sheet."
    ],
    qs: [
      { q: "What problem does Ms. Costa report?", opts: ["An order is incomplete.", "A print shop is closed.", "A trade show has been canceled.", "Some brochures contain errors."], ans: 0, exp: "印刷店只印了 300 份，不是 500 份，訂單數量不足。" },
      { q: "At 3:08 P.M., what does Ms. Costa mean when she writes, \"They said not before Thursday\"?", opts: ["The remaining brochures will not be ready in time.", "The trade show has been moved to Thursday.", "She will return to the print shop on Thursday.", "The print shop is closed until Thursday."], ans: 0, exp: "意圖題：Park 問今天能不能印完剩下的，Costa 回答「他們說週四之前不行」，也就是來不及在明天的展覽前印好。Park 接著提議只發 300 份、其他人留 e-mail。" }
    ]
  },
  {
    title: "單篇：電子郵件",
    time: 180,
    form: "R2",
    passages: [
      "To: Gavin Shore <gshore@northlinemedia.com>\nFrom: Leah Kim <lkim@brightpath.org>\nDate: June 2\nSubject: Our meeting on June 5\n\nDear Mr. Shore,\n\nI'm afraid I need to reschedule our meeting on Thursday, June 5. Our board has called an emergency meeting that afternoon, and I am required to attend.\n\nWould Monday, June 9, at the same time work for you? If not, I am also free on Tuesday morning. I would be happy to come to your office so that you don't have to travel.\n\nI apologize for the inconvenience and look forward to discussing the advertising campaign with you.\n\nBest regards,\nLeah Kim\nCommunications Director, BrightPath"
    ],
    qs: [
      { q: "Why did Ms. Kim write the e-mail?", opts: ["To change the date of a meeting", "To cancel an advertising campaign", "To invite Mr. Shore to a board meeting", "To request a price quote"], ans: 0, exp: "Kim 說她需要更改 6 月 5 日的會議時間（I need to reschedule our meeting）。" },
      { q: "What is indicated about the original meeting?", opts: ["It was scheduled for the afternoon.", "It was going to take place on a Monday.", "It was requested by the board.", "It was about a new product design."], ans: 0, exp: "董事會臨時在「那天下午」開會，和原本的會議衝突，所以原本的會議在下午。原訂日期是週四，討論的是廣告活動。" },
      { q: "What does Ms. Kim offer to do?", opts: ["Travel to Mr. Shore's office", "Pay for Mr. Shore's travel", "Send a draft of the campaign", "Meet on Thursday morning"], ans: 0, exp: "I would be happy to come to your office so that you don't have to travel：她願意到 Shore 的辦公室。" }
    ]
  },
  {
    title: "單篇：報導（插入句子位置題）",
    time: 180,
    form: "R2",
    passages: [
      "New Ferry Service Links Harbor Towns\n\nPORT ELLIS (May 20) — A new ferry service between Port Ellis and Clearwater began operating on Monday, cutting travel time between the two towns from 90 minutes by car to 35 minutes. [1]\n\nThe ferry, operated by BlueWave Marine, makes eight round trips daily. One-way tickets cost $12 for adults and $6 for children. [2]\n\nLocal business owners are hopeful that the service will bring more visitors. [3] \"Many tourists stay in Clearwater but never come to Port Ellis because the drive is too long,\" said Maya Dorsey, owner of a café near the ferry dock. [4]"
    ],
    qs: [
      { q: "What is the article mainly about?", opts: ["A new transportation service", "A road construction project", "The opening of a café", "A tourism award"], ans: 0, exp: "報導 Port Ellis 和 Clearwater 之間新開的渡輪服務。" },
      { q: "How much would two adults pay for one-way tickets?", opts: ["$24", "$12", "$18", "$36"], ans: 0, exp: "成人單程 $12，兩位成人是 $24。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? She added, \"The ferry could change that.\"", opts: ["[4]", "[1]", "[2]", "[3]"], ans: 0, exp: "She 要指前面已經出現的女性，that 要指前面說的情況。[4] 前面是 Dorsey 說「遊客嫌開車太遠所以不來」，接著補充「渡輪可能改變這種情況」最連貫。放在 [3] 時 Dorsey 還沒出現。" }
    ]
  },
  {
    title: "單篇：線上課程方案網頁",
    time: 180,
    form: "R2",
    passages: [
      "www.skillbridge.com/pricing\n\nSkillBridge Online Courses — Choose Your Plan\n\nBasic: $15/month. Access to 200 courses. Certificates not included.\n\nPlus: $25/month. Access to all 800 courses, plus certificates of completion.\n\nTeam: $20 per user/month (minimum 5 users). Includes everything in Plus, along with progress reports for managers.\n\nAll plans can be canceled at any time. New subscribers get the first two weeks free."
    ],
    qs: [
      { q: "What is a feature of the Plus plan?", opts: ["Certificates of completion", "Progress reports for managers", "A minimum of five users", "Access to 200 courses only"], ans: 0, exp: "Plus 方案包含全部 800 門課和結業證書（certificates of completion）。主管進度報告是 Team 方案才有。" },
      { q: "How much would a company pay per month for a Team plan with six users?", opts: ["$120", "$100", "$150", "$90"], ans: 0, exp: "Team 方案每人每月 $20，六人是 $120。" },
      { q: "What is offered to new subscribers?", opts: ["A free trial period", "A discount on certificates", "A free course of their choice", "Lifetime access to courses"], ans: 0, exp: "New subscribers get the first two weeks free：新訂戶前兩週免費。" }
    ]
  },
  {
    title: "單篇：信件（插入句子位置題）",
    time: 240,
    form: "R2",
    passages: [
      "Hollis Property Management\n55 Brook Street\nFairview, CA 94012\n\nJuly 14\n\nDear Tenant,\n\nAs part of our ongoing maintenance program, the elevators in your building will be inspected on Wednesday, July 23. [1] During the inspection, which will take place from 8:00 A.M. to noon, both elevators will be out of service.\n\nWe understand that this may cause difficulties for some residents. [2] If you need assistance carrying groceries or other items during the inspection, our building staff will be glad to help. Please call the front desk at 555-0124 to arrange this.\n\nWe also remind residents that the stairwells must be kept clear of bicycles and other personal belongings at all times. [3]\n\nThank you for your understanding. [4]\n\nSincerely,\nRuth Okafor\nBuilding Manager"
    ],
    qs: [
      { q: "What is the main purpose of the letter?", opts: ["To inform residents of a temporary service interruption", "To announce a rent increase", "To introduce a new building manager", "To request payment for repairs"], ans: 0, exp: "信中通知 7 月 23 日早上電梯檢查、暫停使用。" },
      { q: "What are residents who need help asked to do?", opts: ["Call the front desk", "Use the service elevator", "Speak to the inspector", "Leave their belongings in the lobby"], ans: 0, exp: "需要協助的住戶請打電話到櫃檯安排（Please call the front desk at 555-0124 to arrange this）。" },
      { q: "What are residents reminded about?", opts: ["Keeping the stairways free of objects", "Recycling their bicycles", "Paying rent on time", "Locking their doors"], ans: 0, exp: "信中提醒樓梯間隨時都要淨空，不能放腳踏車或個人物品（must be kept clear）。" },
      { q: "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \"To avoid any inconvenience, residents with mobility concerns may wish to plan their errands for the afternoon.\"", opts: ["[2]", "[1]", "[3]", "[4]"], ans: 0, exp: "[2] 前一句說「電梯停用可能對部分住戶造成不便」，接著建議行動不便的住戶把外出安排在下午（電梯中午就恢復），最連貫。放在 [1] 時還沒說明檢查是在上午；[3] 在提醒樓梯間淨空之後，[4] 在結尾致謝之後，都接不上。" }
    ]
  },
  {
    title: "單篇：線上討論（意圖題）",
    time: 240,
    form: "R2",
    passages: [
      "Lena Fischer [9:31 A.M.]\nHas anyone heard from the caterer for Friday's client lunch?\n\nOmar Haddad [9:33 A.M.]\nThey called yesterday. They need the final headcount by noon today.\n\nLena Fischer [9:34 A.M.]\nWe have 18 confirmed so far. Are we still waiting on anyone?\n\nGrace Liu [9:36 A.M.]\nTwo people from the Hartwell team haven't replied. I'll call their office.\n\nOmar Haddad [9:37 A.M.]\nLet's just give the caterer 20. Extra food is better than not enough.\n\nLena Fischer [9:38 A.M.]\nFair enough. Grace, could you still let me know what Hartwell says?\n\nGrace Liu [9:39 A.M.]\nWill do. Also, one of the guests is vegetarian, so I'll tell the caterer."
    ],
    qs: [
      { q: "What are the writers mainly discussing?", opts: ["Preparations for a business meal", "A change in a client's contract", "Hiring a new caterer", "A team-building activity"], ans: 0, exp: "大家在討論週五客戶午餐要給外燴廠商的人數和餐點需求。" },
      { q: "By when must the caterer be given the number of guests?", opts: ["By noon today", "By Friday", "By the end of the week", "By tomorrow morning"], ans: 0, exp: "They need the final headcount by noon today。週五是午餐的日期。" },
      { q: "At 9:38 A.M., what does Ms. Fischer most likely mean when she writes, \"Fair enough\"?", opts: ["She agrees with Mr. Haddad's suggestion.", "She thinks the price is reasonable.", "She is satisfied with the food choices.", "She believes enough guests have replied."], ans: 0, exp: "意圖題：Haddad 提議直接報 20 人，寧可多不要少；Fischer 回「有道理」，表示同意這個做法。" },
      { q: "What will Ms. Liu most likely do?", opts: ["Contact the Hartwell team's office", "Change the date of the lunch", "Cancel the catering order", "Prepare vegetarian food herself"], ans: 0, exp: "Liu 說她會打電話到 Hartwell 的辦公室（I'll call their office），Fischer 也請她回報結果。素食是她要轉告外燴廠商，不是自己準備。" }
    ]
  },
  {
    title: "單篇：報導（同義字題）",
    time: 240,
    form: "R2",
    passages: [
      "Small Bakery Wins National Award\nBy Rosa Delgado\n\nGREENFIELD — Pane & Co., a small bakery on Elm Street, has been named Best Independent Bakery in the country by Food Trade Monthly. The award recognizes businesses that combine quality products with strong community involvement.\n\nOwner Teresa Fontana opened the bakery eight years ago with just two employees. Today, it employs 14 people and supplies bread to 12 local restaurants. Every Friday, unsold bread is donated to a nearby food bank.\n\n\"We never set out to win awards,\" Fontana said. \"We just wanted to bake good bread for our neighbors.\"\n\nSince the announcement last week, the bakery has seen a sharp rise in customers, and lines now regularly stretch out the door on weekend mornings. Fontana plans to hire three more bakers this summer to keep up with demand."
    ],
    qs: [
      { q: "Why did Pane & Co. receive an award?", opts: ["For its products and its community involvement", "For its long history", "For opening many locations", "For its low prices"], ans: 0, exp: "這個獎表揚「優質產品結合社區參與」的店家，Pane & Co. 每週捐麵包給食物銀行。" },
      { q: "What is NOT mentioned about Pane & Co.?", opts: ["It sells its products online.", "It supplies bread to restaurants.", "It donates bread every week.", "It has 14 employees."], ans: 0, exp: "NOT 題：文中提到供貨給 12 家餐廳、每週五捐麵包、員工 14 人，沒有提到網路販售。" },
      { q: "In paragraph 4, the word \"sharp\" is closest in meaning to", opts: ["sudden", "intelligent", "pointed", "clear"], ans: 0, exp: "同義字題：a sharp rise in customers 是「顧客急遽增加」，最接近 sudden。" },
      { q: "What does Ms. Fontana plan to do?", opts: ["Hire more staff", "Open a second bakery", "Supply bread to more restaurants", "Stop donating bread"], ans: 0, exp: "Fontana 打算今年夏天再雇用三位麵包師傅（plans to hire three more bakers this summer），也就是增加人手。" }
    ]
  },
  {
    title: "雙篇：志工招募傳單＋報名信",
    time: 300,
    form: "R2",
    passages: [
      "CITY ARTS FESTIVAL — Volunteer Opportunities\nSaturday, August 16 – Sunday, August 17\n\nWe need volunteers for the following roles:\n• Information booth (shifts: 9 A.M.–1 P.M. or 1 P.M.–5 P.M.)\n• Stage crew (must be able to lift 20 kg; shift: 8 A.M.–2 P.M.)\n• Children's art tent (experience working with children preferred)\n\nAll volunteers receive a free festival T-shirt and lunch. Volunteers who work both days also receive two tickets to the closing concert.\n\nSign up by August 1 at cityartsfest.org/volunteer.",
      "To: volunteers@cityartsfest.org\nFrom: Noah Brennan\nDate: July 28\nSubject: Volunteer sign-up\n\nHello,\n\nI'd like to volunteer at this year's festival. I'm a primary school teacher, so I think I would be a good fit for the children's area. I'm available on both days, though I'd prefer to work in the afternoon on Saturday.\n\nAlso, I have a back injury and was told not to lift heavy objects for a few months, so please don't assign me to any physical tasks.\n\nThanks,\nNoah Brennan"
    ],
    qs: [
      { q: "What is the purpose of the flyer?", opts: ["To recruit people to help at an event", "To sell concert tickets", "To advertise art classes for children", "To announce a change in festival dates"], ans: 0, exp: "傳單在招募藝術節的志工，列出各種職務和報名方式。" },
      { q: "What do all volunteers receive?", opts: ["A meal", "Concert tickets", "A cash payment", "Free parking"], ans: 0, exp: "所有志工都有一件 T 恤和午餐（lunch）。音樂會門票只有兩天都參加的人才有。" },
      { q: "Why is Mr. Brennan probably suited for one of the roles?", opts: ["He works with children.", "He can lift heavy objects.", "He has volunteered before.", "He lives near the festival."], ans: 0, exp: "跨篇題：兒童藝術帳篷優先找有兒童工作經驗的人（第一篇），Brennan 是小學老師（第二篇）。" },
      { q: "If Mr. Brennan volunteers as he plans, what will he most likely receive?", opts: ["Two tickets to a concert", "A discount on art supplies", "A free parking pass", "A payment for his time"], ans: 0, exp: "跨篇題：兩天都參加的志工可以拿到兩張閉幕音樂會門票（第一篇），Brennan 說他兩天都能參加（第二篇）。" },
      { q: "What is indicated about Mr. Brennan's e-mail?", opts: ["It was sent before the sign-up deadline.", "It was sent after the festival.", "It was sent on the first day of the festival.", "It was sent after the sign-up deadline."], ans: 0, exp: "跨篇題：報名截止日是 8 月 1 日（第一篇），他的信是 7 月 28 日寄的（第二篇）。" }
    ]
  },
  {
    title: "雙篇：飯店廣告＋住客評論",
    time: 300,
    form: "R2",
    passages: [
      "SEASIDE INN — Summer Special\n\nStay three nights and get the fourth night free! (Valid June 1–August 31; not valid on holiday weekends.)\n\nAll rooms include free Wi-Fi and breakfast. Ocean-view rooms are available for an additional $30 per night.\n\nBook online at seasideinn.com or call 555-0199.",
      "★★★☆☆ Reviewed by J. Moreno, July 20\n\nMy family stayed at the Seaside Inn for four nights in early July, using the summer special. We paid extra for an ocean view, and the view was beautiful. Breakfast was fine, though the selection was limited. Our biggest disappointment was the Wi-Fi, which barely worked in our room. The front desk staff were friendly and offered to move us to another room, but by then we had already unpacked. Overall, a decent place for the price."
    ],
    qs: [
      { q: "What is indicated about the summer special?", opts: ["It cannot be used on some dates.", "It includes a free ocean view.", "It is available only online.", "It includes dinner."], ans: 0, exp: "優惠註明 not valid on holiday weekends（連假週末不適用）。海景房要另外加價；也可以打電話訂房。" },
      { q: "For how many nights did the Moreno family most likely pay?", opts: ["Three", "Four", "Two", "One"], ans: 0, exp: "跨篇題：他們用夏季優惠住了四晚（第二篇），優惠是住三晚送第四晚（第一篇），所以付三晚的錢。" },
      { q: "What did the reviewer pay extra for?", opts: ["A room with a view of the ocean", "Breakfast", "Wi-Fi access", "A late checkout"], ans: 0, exp: "We paid extra for an ocean view。早餐和 Wi-Fi 都是免費的。" },
      { q: "What problem did the reviewer have?", opts: ["The Internet connection was poor.", "The room was not clean.", "The staff were unhelpful.", "Breakfast was not served."], ans: 0, exp: "最大的失望是 Wi-Fi 在房間裡幾乎不能用。櫃檯人員很友善，早餐只是選擇少。" },
      { q: "What did the hotel staff offer to do?", opts: ["Move the guests to another room", "Refund one night", "Provide a free breakfast", "Repair the Wi-Fi immediately"], ans: 0, exp: "offered to move us to another room：櫃檯提議幫他們換房間。" }
    ]
  },
  {
    title: "三篇：產品召回公告＋顧客來信＋回信",
    time: 300,
    form: "R2",
    passages: [
      "PRODUCT SAFETY NOTICE\n\nHomeline Appliances is voluntarily recalling its Model K-200 electric kettle, sold between January and April of this year. In a small number of units, the handle may become loose after repeated use.\n\nCustomers who own a K-200 kettle should stop using it immediately. To receive a free replacement kettle (Model K-250) or a full refund, contact Homeline customer service at support@homeline.com with the serial number found on the bottom of the kettle. Replacement kettles will be shipped within 10 business days.",
      "To: support@homeline.com\nFrom: Priya Shah\nDate: May 6\nSubject: K-200 kettle\n\nHello,\n\nI bought a K-200 kettle in March and just read about the recall. The serial number is HK2003-7781. I would prefer a refund rather than a replacement, as I have already bought a different kettle.\n\nCould you also tell me whether I need to send the old kettle back?\n\nThank you,\nPriya Shah",
      "To: Priya Shah\nFrom: Homeline Customer Service\nDate: May 7\nSubject: RE: K-200 kettle\n\nDear Ms. Shah,\n\nThank you for contacting us. We have processed your request, and the full purchase price will be returned to your credit card within five business days.\n\nYou do not need to return the kettle. Instead, please remove the handle and dispose of the kettle according to local regulations. We apologize for any inconvenience.\n\nHomeline Customer Service"
    ],
    qs: [
      { q: "Why is the K-200 kettle being recalled?", opts: ["A part may not stay firmly attached.", "It may overheat.", "Its power cord may be damaged.", "Its lid may not close properly."], ans: 0, exp: "公告說少數產品的把手在多次使用後可能鬆脫（the handle may become loose）。" },
      { q: "What information must customers provide?", opts: ["A serial number", "A receipt", "A photograph of the kettle", "The name of the store"], ans: 0, exp: "要附上壺底的序號（with the serial number found on the bottom of the kettle）。" },
      { q: "What is suggested about Ms. Shah?", opts: ["She bought the kettle during the period covered by the recall.", "She was injured by the kettle.", "She would like a Model K-250.", "She has already returned the kettle."], ans: 0, exp: "跨篇題：召回範圍是 1 到 4 月售出的產品（第一篇），Shah 是 3 月買的（第二篇）。她要退款，不要換新品。" },
      { q: "What will Ms. Shah receive?", opts: ["Her money back", "A replacement kettle", "Store credit", "A discount coupon"], ans: 0, exp: "回信說全額款項會在五個工作天內退回她的信用卡。" },
      { q: "What is Ms. Shah asked to do with the kettle?", opts: ["Remove the handle and throw it away", "Mail it to Homeline", "Bring it to a store", "Keep it for an inspection"], ans: 0, exp: "回信說不用寄回，請把把手拆下，再依當地規定丟棄（remove the handle and dispose of the kettle）。" }
    ]
  },
  {
    title: "三篇：辦公室出租資訊＋詢問信＋回信",
    time: 300,
    form: "R2",
    passages: [
      "OFFICE SPACE FOR LEASE — 400 Harbor Plaza\n\nSuite 210: 120 square meters, 2nd floor, $2,400/month. Available now.\nSuite 315: 180 square meters, 3rd floor, harbor view, $3,600/month. Available September 1.\nSuite 502: 250 square meters, 5th floor, harbor view, private kitchen, $5,000/month. Available October 1.\n\nAll suites include utilities and access to a shared conference room. Underground parking: $150 per space per month.\n\nContact: Derek Lam, Harbor Plaza Leasing, 555-0182",
      "To: Derek Lam\nFrom: Sofia Marquez\nDate: August 4\nSubject: Office space inquiry\n\nDear Mr. Lam,\n\nMy architecture firm is looking for a new office for our team of 12 people. We need at least 150 square meters, and we would like a harbor view. Our current lease ends on August 31, so we need to move in by September 1.\n\nOur monthly budget is about $4,000, including parking for two cars. Could we arrange a viewing next week?\n\nRegards,\nSofia Marquez",
      "To: Sofia Marquez\nFrom: Derek Lam\nDate: August 5\nSubject: RE: Office space inquiry\n\nDear Ms. Marquez,\n\nThank you for your interest. I believe one of our suites would suit your needs perfectly, and it would fit within your budget even with two parking spaces. I can show it to you on Tuesday or Thursday afternoon next week.\n\nPlease let me know which day works best.\n\nBest regards,\nDerek Lam"
    ],
    qs: [
      { q: "What is true about all of the suites?", opts: ["Utilities are included in the rent.", "They have a harbor view.", "They are available immediately.", "They include a private kitchen."], ans: 0, exp: "All suites include utilities：所有辦公室都含水電。只有 315 和 502 看得到港口；只有 502 有私人廚房。" },
      { q: "Which suite is Mr. Lam most likely referring to in his e-mail?", opts: ["Suite 315", "Suite 210", "Suite 502", "A suite on the fourth floor"], ans: 0, exp: "跨篇題：Marquez 要 150 平方公尺以上、港景、9 月 1 日前可入住、預算約 $4,000 含兩個車位（第二篇）。210 太小又沒有港景；502 十月才空出來，也超過預算；只有 315 符合（第一篇）。" },
      { q: "How much will Ms. Marquez's firm most likely pay per month, including parking?", opts: ["$3,900", "$3,600", "$4,000", "$3,750"], ans: 0, exp: "跨篇計算：Suite 315 月租 $3,600，加兩個車位 2 × $150 = $300，共 $3,900，在預算內。" },
      { q: "What kind of business does Ms. Marquez work for?", opts: ["One that designs buildings", "One that sells real estate", "One that manages parking facilities", "One that builds kitchens"], ans: 0, exp: "她說 My architecture firm（我的建築師事務所），建築師事務所設計建築物。" },
      { q: "What does Mr. Lam offer to do?", opts: ["Show a property to Ms. Marquez", "Lower the rent", "Provide free parking", "Extend her current lease"], ans: 0, exp: "他說下週二或週四下午可以帶她看（I can show it to you）。" }
    ]
  },
  {
    title: "三篇：公司報導＋參與人數表＋電子郵件",
    time: 300,
    form: "R2",
    passages: [
      "Harper Logistics Launches Wellness Program\n\nIn March, Harper Logistics introduced a wellness program for its 400 employees. The program offers free weekly yoga classes, a step-counting challenge with monthly prizes, and healthy snacks in all break rooms. Employees who take part in at least two activities per month receive an extra paid day off each quarter.\n\n\"We wanted to show employees that we care about their health,\" said HR manager Tanya Brooks.",
      "Wellness Program Participation (number of employees)\n\nActivity | March | April | May\nYoga classes | 45 | 62 | 78\nStep challenge | 120 | 155 | 140\nNutrition workshop | — | 30 | 52",
      "To: All Harper Logistics staff\nFrom: Tanya Brooks\nDate: June 2\nSubject: Wellness program update\n\nDear colleagues,\n\nThank you to everyone who has joined our wellness activities. Participation in yoga has grown every month, so we will add a second weekly class starting June 10.\n\nWe were sorry to see fewer participants in last month's step challenge. To make it more appealing, June's prize will be a new pair of running shoes for each of the top three walkers.\n\nFinally, our nutrition workshop, which began in April, will now be held twice a month.\n\nBest regards,\nTanya Brooks"
    ],
    qs: [
      { q: "What do employees receive for joining at least two activities each month?", opts: ["An additional day of paid leave", "A pair of running shoes", "Free healthy snacks", "A monthly cash bonus"], ans: 0, exp: "每月參加至少兩項活動的員工，每季多一天有薪假（an extra paid day off each quarter）。健康零食是所有人都有；跑鞋是步數挑戰前三名的獎品。" },
      { q: "According to the table, how many employees took part in yoga classes in May?", opts: ["78", "62", "45", "140"], ans: 0, exp: "表格中瑜伽課五月的人數是 78。" },
      { q: "Why will a change be made to the step challenge?", opts: ["Participation decreased.", "Employees asked for new prizes.", "The program's budget increased.", "Too many people joined."], ans: 0, exp: "跨篇題：步數挑戰從四月的 155 人降到五月的 140 人（第二篇），Brooks 說人數變少，所以換更吸引人的獎品（第三篇）。" },
      { q: "When was the nutrition workshop first offered?", opts: ["In April", "In March", "In May", "In June"], ans: 0, exp: "表格三月是「—」，郵件也說工作坊 began in April。" },
      { q: "What will happen starting June 10?", opts: ["An additional yoga class will be offered.", "The step challenge will end.", "Healthy snacks will be removed.", "The nutrition workshop will be canceled."], ans: 0, exp: "郵件說從 6 月 10 日起每週增加第二堂瑜伽課。" }
    ]
  },
  // ---- R3：完整閱讀測驗 Part 7，保留給完整測驗，不出現在一般練習 ----
  {"title": "單篇：停車場關閉公告", "time": 120, "form": "R3", "passages": ["NOTICE: PARKING GARAGE CLOSURE\n\nThe underground parking garage at Lakeview Tower will be closed on Saturday, September 9, and Sunday, September 10, while the floors are resurfaced and the parking lines are repainted.\n\nDuring the closure, tenants may park free of charge at the Elm Street public lot, two blocks east of the building. Please display your Lakeview Tower parking permit on your dashboard.\n\nVehicles left in the garage after 8:00 P.M. on Friday, September 8, will be towed at the owner's expense.\n\nLakeview Tower Management"], "qs": [{"q": "What is the purpose of the notice?", "opts": ["To announce temporary maintenance work", "To introduce new monthly parking fees for tenants", "To report a towing incident", "To advertise a new parking lot"], "ans": 0, "exp": "公告說停車場週末要重鋪地面、重畫停車格而關閉＝暫時的維修工程。"}, {"q": "What are tenants asked to do?", "opts": ["Show a permit when parking elsewhere", "Pay for parking at the Elm Street lot", "Move their cars by Saturday afternoon", "Contact management for a temporary pass"], "ans": 0, "exp": "在 Elm Street 停車場免費停車，但要把大樓的停車證放在儀表板上＝出示停車證。是免費的，不用付費；車子要在週五晚上八點前移走。"}]},
  {"title": "單篇：簡訊對話（意圖題）", "time": 120, "form": "R3", "passages": ["Paulo Mendes [10:12 A.M.]\nHi, Grace. The printer just told me the brochures for the trade show won't be ready until Thursday.\n\nGrace Kim [10:13 A.M.]\nThursday? We're leaving for Chicago on Wednesday morning.\n\nPaulo Mendes [10:14 A.M.]\nI know. They offered to ship them straight to the convention center instead.\n\nGrace Kim [10:16 A.M.]\nThat works. Our booth doesn't open until Friday.\n\nPaulo Mendes [10:17 A.M.]\nGreat. I'll give them the address and ask for a tracking number."], "qs": [{"q": "What problem does Mr. Mendes report?", "opts": ["Some printed materials will be delayed", "A flight to Chicago was canceled", "The convention center has changed", "A booth at the trade show has not been reserved yet"], "ans": 0, "exp": "印刷廠說商展用的型錄週四才會好＝印刷品延遲。"}, {"q": "At 10:16 A.M., what does Ms. Kim mean when she writes, \"That works\"?", "opts": ["She agrees with a suggested solution", "She thinks a machine is working again", "She will work at the booth on Friday", "She approves a new brochure design"], "ans": 0, "exp": "意圖題：印刷廠提議直接寄到會展中心，她說 That works，接著說攤位週五才開＝同意這個解決辦法。不是說機器修好了。"}]},
  {"title": "單篇：搬家公司廣告", "time": 120, "form": "R3", "passages": ["SWIFT MOVERS — Moving made simple\n\nWhether you are moving across town or across the country, Swift Movers has the experience to get you there safely. Our services include:\n• Packing and unpacking\n• Furniture assembly\n• Short-term storage (up to 60 days)\n\nAll moves are fully insured. Book before the end of this month and receive 15% off any move of more than 100 kilometers.\n\nFor a free estimate, call 555-0142 or visit swiftmovers.com. A member of our team will visit your home within 48 hours."], "qs": [{"q": "What service does Swift Movers offer?", "opts": ["Temporary storage of belongings", "Home cleaning", "Interior design", "Long-term warehouse rental"], "ans": 0, "exp": "服務項目有 Short-term storage (up to 60 days)＝短期存放物品。只有短期，最多 60 天，不是長期倉庫出租。"}, {"q": "How can customers receive a discount?", "opts": ["By booking a long-distance move this month", "By requesting a free estimate online", "By packing their own belongings", "By moving to an address within the same city"], "ans": 0, "exp": "本月底前預訂、搬家距離超過 100 公里打 85 折＝本月預訂長途搬家。同城搬家不符合 100 公里的條件。"}]},
  {"title": "單篇：訂購收據", "time": 120, "form": "R3", "passages": ["OFFICE PLUS — Order Receipt\nOrder number: 48213\nDate: October 3\nCustomer: Hanover Legal Services\n\nItem / Quantity / Price\nPrinter paper (box of 10 reams) / 3 / $105.00\nBlue ink cartridges / 4 / $96.00\nDesk organizers / 6 / (back-ordered)\nSubtotal: $201.00\nBusiness customer discount (10%): -$20.10\nTotal: $180.90\n\nNote: The desk organizers ($54.00) are currently out of stock and will be shipped separately by October 17. They are not included in the total above; you will be charged when they ship."], "qs": [{"q": "What is indicated about Hanover Legal Services?", "opts": ["It received a business discount", "It ordered six boxes of paper", "It paid for all items in advance", "It will pick up the order in person"], "ans": 0, "exp": "收據上有 Business customer discount (10%)＝享有企業客戶折扣。紙是 3 箱；收納盒還沒收費，所以不是全部先付了。"}, {"q": "What will most likely happen by October 17?", "opts": ["Some items will be shipped", "A refund will be issued", "A new order will be placed", "The price of ink will increase"], "ans": 0, "exp": "附註說收納盒目前缺貨，10 月 17 日前另外寄出（shipped）＝部分商品會寄出。"}]},
  {"title": "單篇：電子郵件", "time": 180, "form": "R3", "passages": ["To: Rachel Owens\nFrom: Hiroshi Tanaka\nDate: February 2\nSubject: Quarterly review meeting\n\nDear Rachel,\n\nThank you for agreeing to present the customer satisfaction results at next Tuesday's quarterly review. The meeting will begin at 9:30 A.M. in the main conference room, and you will be the second speaker, after Mr. Bell from finance.\n\nEach presenter has fifteen minutes, followed by five minutes for questions. The room has a projector, but please e-mail your slides to my assistant, Dana, by Monday at noon so that she can load them onto the laptop in advance.\n\nIf you need any printed handouts, Dana can arrange those as well.\n\nBest regards,\nHiroshi Tanaka"], "qs": [{"q": "Why was the e-mail sent?", "opts": ["To give details about a presentation", "To invite Ms. Owens to a job interview", "To ask Ms. Owens to conduct a survey", "To reschedule a quarterly meeting"], "ans": 0, "exp": "信中感謝她答應在季度檢討會上報告，並說明時間、順序、長度＝說明簡報的細節。"}, {"q": "What is suggested about Mr. Bell?", "opts": ["He will speak before Ms. Owens", "He is Mr. Tanaka's assistant", "He will prepare printed handouts", "He works in customer service"], "ans": 0, "exp": "她是第二位講者，排在財務部的 Bell 先生之後＝Bell 先生先講。助理是 Dana。"}, {"q": "What is Ms. Owens asked to do by Monday?", "opts": ["Send her slides to an assistant", "Reserve a conference room", "Print copies of her report", "Test a projector"], "ans": 0, "exp": "請她週一中午前把投影片寄給助理 Dana（e-mail your slides to my assistant）。"}]},
  {"title": "單篇：報導（插入句子位置題）", "time": 180, "form": "R3", "passages": ["City Opens First Electric Bus Route\n\nGREENFIELD (June 4) — Greenfield's first fully electric bus route began service on Monday, connecting the train station with the university campus. [1]\n\nThe twelve new buses can travel about 250 kilometers on a single charge and are recharged overnight at the city's main depot. [2] Officials say the buses will save the city around $400,000 a year in fuel costs.\n\nRiders have also noticed a difference. [3] \"It's so quiet that you can actually have a conversation,\" said student Mia Torres. The city plans to convert three more routes to electric buses by the end of next year. [4]"], "qs": [{"q": "What is the article mainly about?", "opts": ["A new type of public transportation", "The opening of a new train station near the campus", "A university construction project", "A rise in bus fares"], "ans": 0, "exp": "報導 Greenfield 第一條全電動公車路線開始營運。"}, {"q": "According to the article, how will the city benefit?", "opts": ["It will spend less on fuel", "It will attract more students", "It will need fewer drivers", "It will receive a government award"], "ans": 0, "exp": "官員說每年可以省下約 40 萬美元的燃料費（save … in fuel costs）。"}, {"q": "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?\n\"Unlike the old diesel buses, the new ones make almost no noise.\"", "opts": ["[3]", "[1]", "[2]", "[4]"], "ans": 0, "exp": "前一句說乘客也感受到差異，這句說明差異是什麼（幾乎沒有噪音），後面學生又說「安靜到可以聊天」，放在 [3] 最連貫。"}]},
  {"title": "單篇：線上課程網頁", "time": 180, "form": "R3", "passages": ["BIZSKILLS ONLINE — Spring Courses\n\nBusiness Writing (6 weeks) — $180\nLearn to write clear e-mails, reports, and proposals. Includes weekly feedback from an instructor.\n\nData Analysis Basics (8 weeks) — $240\nAn introduction to spreadsheets, charts, and simple statistics. No previous experience required.\n\nPresentation Skills (4 weeks) — $150\nPractice delivering presentations in live online sessions every Thursday evening.\n\nAll courses begin on March 3. Students who register for two or more courses receive 20% off the total price. Certificates are issued to students who complete all assignments."], "qs": [{"q": "Which course includes live sessions?", "opts": ["Presentation Skills", "Business Writing", "Data Analysis Basics", "All of the courses"], "ans": 0, "exp": "Presentation Skills 每週四晚上有線上直播課程（live online sessions）。"}, {"q": "What is true about Data Analysis Basics?", "opts": ["It is designed for beginners", "It is the shortest course", "It includes weekly instructor feedback", "It begins later than the other courses"], "ans": 0, "exp": "No previous experience required＝適合初學者。最短的是四週的簡報課；每週回饋是寫作課的；所有課程都 3 月 3 日開始。"}, {"q": "How can students receive a discount?", "opts": ["By taking more than one course", "By registering before March 3", "By completing all assignments", "By attending every Thursday session"], "ans": 0, "exp": "報名兩門以上打八折（two or more courses receive 20% off）。完成作業拿到的是證書，不是折扣。"}]},
  {"title": "單篇：信件（插入句子位置題）", "time": 240, "form": "R3", "passages": ["Harbor View Apartments\n22 Ocean Drive, Bayside\n\nApril 18\n\nDear Mr. Alvarez,\n\nThank you for renting with Harbor View Apartments for the past two years. Your current lease will end on June 30. [1]\n\nIf you would like to stay, please sign the enclosed renewal form and return it to the management office by May 15. [2] The monthly rent for a new one-year lease will be $1,350, an increase of $50, which reflects rising maintenance costs.\n\nWe are also pleased to let you know that the fitness room on the ground floor will reopen in May after renovation. [3] It now has new equipment and longer opening hours.\n\nIf you plan to move out, please give us written notice by the same date. [4] We would be sorry to see you go.\n\nSincerely,\nKaren Doyle\nProperty Manager"], "qs": [{"q": "Why did Ms. Doyle write to Mr. Alvarez?", "opts": ["To ask whether he will renew his lease", "To remind him of a late payment", "To welcome him as a new tenant", "To announce that the building will be sold"], "ans": 0, "exp": "信中說他的租約 6 月 30 日到期，要續約請簽續約表＝詢問是否續租。他已經住了兩年，不是新房客。"}, {"q": "What is indicated about the rent?", "opts": ["It will increase slightly", "It will stay the same", "It is due on the fifteenth of each month", "It includes the cost of the fitness room"], "ans": 0, "exp": "新租約月租 $1,350，比原本多 $50＝小幅調漲。5 月 15 日是回覆期限，不是繳租日。"}, {"q": "What is mentioned about the fitness room?", "opts": ["It has been updated", "It will close in May", "It is open only to new tenants", "It requires an extra fee"], "ans": 0, "exp": "健身房整修後五月重新開放，有新器材、開放時間更長＝已經更新。"}, {"q": "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?\n\"This will give us time to arrange a final inspection of your apartment.\"", "opts": ["[4]", "[1]", "[2]", "[3]"], "ans": 0, "exp": "[4] 前面說「若要搬走，請在同一日期前書面通知」，接著說明提早通知的原因：「讓我們有時間安排退租檢查」。放在 [2] 時前面講的是續約，續約不需要退租檢查。"}]},
  {"title": "單篇：線上討論（意圖題）", "time": 240, "form": "R3", "passages": ["Liam Carter [2:05 P.M.]\nTeam, the client in Toronto wants to move our video call from Thursday to Wednesday at 4:00. Does that work for everyone?\n\nNadia Rahman [2:07 P.M.]\nI have a dentist appointment at 3:30 on Wednesday.\n\nOwen Brooks [2:08 P.M.]\nWednesday is fine for me. Nadia, could you join from your phone after the appointment?\n\nNadia Rahman [2:10 P.M.]\nProbably, but I'd be about fifteen minutes late. I'm the one presenting the budget, though.\n\nLiam Carter [2:12 P.M.]\nThen let's ask them for 4:30 instead. I'll e-mail them now and send everyone the new link once it's confirmed.\n\nOwen Brooks [2:13 P.M.]\nSounds good. I'll update the slides tonight."], "qs": [{"q": "What is the main topic of the discussion?", "opts": ["Rescheduling a meeting", "Preparing a budget", "Hiring a new team member", "Choosing a dentist"], "ans": 0, "exp": "客戶想把視訊會議改到週三，大家討論時間＝會議改期。"}, {"q": "At 2:10 P.M., why does Ms. Rahman write, \"I'm the one presenting the budget, though\"?", "opts": ["To point out that her arrival time matters", "To ask someone else to present", "To complain about the client", "To offer to prepare more slides for the client"], "ans": 0, "exp": "意圖題：她說可能會晚十五分鐘，接著提醒預算是她要報告的，暗示她遲到會影響會議。Carter 先生因此改請客戶延到 4:30。"}, {"q": "What will Mr. Carter most likely do next?", "opts": ["Contact the client", "Call Ms. Rahman's dentist", "Update the presentation slides", "Cancel Thursday's call"], "ans": 0, "exp": "他說 I'll e-mail them now（現在就寫信給客戶）。更新投影片的是 Brooks 先生。"}, {"q": "What time does Mr. Carter suggest for the call?", "opts": ["4:30", "3:30", "4:00", "2:15"], "ans": 0, "exp": "他說 let's ask them for 4:30 instead。3:30 是看牙醫的時間；4:00 是客戶原本提議的時間。"}]},
  {"title": "單篇：報導（同義字題）", "time": 240, "form": "R3", "passages": ["Local Farm Expands into Tourism\n\nWESTWOOD (August 12) — For three generations, the Hollis family has grown apples on its 40-hectare farm outside Westwood. This autumn, the family is opening its doors to visitors.\n\nStarting September 1, guests can pick their own apples, take a guided tour of the orchard, and visit a new farm shop selling cider, jam, and baked goods. \"Many families tell us they want their children to see where food comes from,\" said owner Peter Hollis. \"This is our chance to share what we do.\"\n\nThe farm will be open on weekends from 9 A.M. to 5 P.M. through the end of October. Admission is $8 for adults and free for children under 12. Mr. Hollis expects the new activities to bring in additional income during a period when apple prices have been unstable."], "qs": [{"q": "What is the article mainly about?", "opts": ["A farm offering new activities for visitors", "A new type of apple", "A cooking competition", "The sale of a family business"], "ans": 0, "exp": "Hollis 家的果園開放遊客採果、導覽、農場商店＝農場推出新的遊客活動。"}, {"q": "According to Mr. Hollis, why are some families interested in visiting?", "opts": ["They want their children to see food production", "They want to buy land in the area", "They prefer organic products", "They are looking for seasonal jobs at local farms"], "ans": 0, "exp": "他說很多家庭希望孩子看看食物從哪裡來（see where food comes from）。"}, {"q": "In paragraph 2, the word \"share\" is closest in meaning to", "opts": ["show", "divide", "own", "pay"], "ans": 0, "exp": "同義字題：share what we do 是「分享、讓人看到我們做的事」，最接近 show。divide 是「平分」的意思，在這裡不合。"}, {"q": "What is NOT mentioned about the farm?", "opts": ["It offers overnight stays", "It has been run by one family for decades", "It will charge an admission fee", "It will sell baked goods"], "ans": 0, "exp": "NOT 題：文中提到三代經營、成人門票 $8、商店賣烘焙點心，沒有提到住宿。"}]},
  {"title": "雙篇：徵才廣告＋應徵信", "time": 300, "form": "R3", "passages": ["JOB OPENING: Customer Service Supervisor\nNorthgate Electronics — Denver store\n\nWe are looking for an experienced supervisor to lead our team of eight customer service representatives.\n\nRequirements:\n• At least three years of customer service experience, including one year in a supervisory role\n• Excellent communication skills\n• Availability to work weekends\n• Spanish language skills are a plus\n\nTo apply, send a résumé and cover letter to jobs@northgate.com by November 20. Interviews will take place the week of November 27.", "To: jobs@northgate.com\nFrom: Teresa Vargas\nDate: November 14\nSubject: Customer Service Supervisor position\n\nDear Hiring Manager,\n\nI am writing to apply for the Customer Service Supervisor position at your Denver store. For the past four years, I have worked at Belmont Home Appliances, where I was promoted to team leader eighteen months ago. In that role, I manage a team of six and handle customer complaints that require special attention.\n\nI grew up speaking both English and Spanish, and I regularly assist our Spanish-speaking customers. I am available to work any day of the week.\n\nPlease note that I will be traveling from November 26 to December 1, but I would be happy to interview by video during that time.\n\nSincerely,\nTeresa Vargas"], "qs": [{"q": "What is indicated about the position?", "opts": ["The supervisor will manage eight people", "It is located at several stores", "It requires a university degree", "It is a part-time job"], "ans": 0, "exp": "廣告說要帶領八位客服人員（lead our team of eight）。"}, {"q": "What is a requirement for the job?", "opts": ["Supervisory experience", "Spanish language skills", "Technical knowledge of electronics", "A driver's license"], "ans": 0, "exp": "需要至少一年的主管經驗。西班牙語是加分項（a plus），不是必要條件。"}, {"q": "How long has Ms. Vargas been a team leader?", "opts": ["About a year and a half", "Four years", "Six months", "Three years"], "ans": 0, "exp": "她說十八個月前升為組長（eighteen months ago）＝約一年半。四年是她在該公司的總年資。"}, {"q": "Why does Ms. Vargas mention her travel plans?", "opts": ["She will be away during the interview week", "She wants to transfer to another city", "She cannot work on weekends", "She will start a new job at another company in December"], "ans": 0, "exp": "雙篇整合：廣告說面試在 11 月 27 日那週；她 11 月 26 日到 12 月 1 日出差，剛好在面試週，所以提議視訊面試。"}, {"q": "Which of Ms. Vargas's qualifications is described as a plus in the job opening?", "opts": ["Speaking Spanish", "Working weekends", "Managing a team", "Handling complaints"], "ans": 0, "exp": "雙篇整合：廣告中標示為加分項（a plus）的是西班牙語能力，她說從小說英語和西班牙語。週末上班和主管經驗是必要條件，不是加分項。"}]},
  {"title": "雙篇：研討會議程＋電子郵件", "time": 300, "form": "R3", "passages": ["REGIONAL RETAIL SUMMIT — Day 2 Program (Hall B)\n\n9:00 A.M. — Keynote: The Future of In-Store Shopping (Dr. Amy Lin)\n10:30 A.M. — Panel: Managing Online Returns\n12:00 P.M. — Lunch (Terrace Restaurant)\n1:30 P.M. — Workshop: Building Customer Loyalty (Raj Patel)\n3:00 P.M. — Workshop: Pricing in Uncertain Times (Lisa Grant)\n4:30 P.M. — Closing remarks\n\nWorkshops are limited to 40 participants. Please sign up at the registration desk.", "To: Summit Organizers\nFrom: Daniel Shaw\nDate: May 9\nSubject: Day 2 workshops\n\nHello,\n\nI attended yesterday's sessions and found them very useful. I would like to join the workshop on customer loyalty this afternoon, but I was told at the registration desk that it is already full.\n\nCould you let me know whether a recording or the slides will be made available afterward? My company has asked me to report on loyalty programs to our management team next week.\n\nAlso, I have to leave for the airport at 2:30 P.M., so unfortunately I will miss the other afternoon workshop as well.\n\nThank you,\nDaniel Shaw"], "qs": [{"q": "What is true about the workshops?", "opts": ["The number of participants is limited", "They are held in the Terrace Restaurant", "They require an extra fee", "They take place in the morning"], "ans": 0, "exp": "議程說工作坊限 40 人（limited to 40 participants）。餐廳是午餐地點；工作坊在下午。"}, {"q": "Who is leading the workshop Mr. Shaw wants to attend?", "opts": ["Raj Patel", "Amy Lin", "Lisa Grant", "Daniel Shaw"], "ans": 0, "exp": "雙篇整合：他想參加顧客忠誠度的工作坊，議程上 Building Customer Loyalty 是 Raj Patel 主持。"}, {"q": "Why did Mr. Shaw write the e-mail?", "opts": ["To ask about materials from a session", "To register for a keynote speech", "To complain about the lunch", "To offer to give a presentation at next year's summit"], "ans": 0, "exp": "工作坊已額滿，他問之後會不會提供錄影或投影片＝詢問課程資料。"}, {"q": "Why is Mr. Shaw interested in the topic?", "opts": ["He has to report on it at work", "He is writing a book about it", "He plans to start his own business", "He was asked to lead the workshop"], "ans": 0, "exp": "公司要他下週向管理團隊報告會員忠誠方案（report on loyalty programs）。"}, {"q": "Which session will Mr. Shaw be unable to attend because of his travel plans?", "opts": ["Pricing in Uncertain Times", "Managing Online Returns", "The keynote speech", "Building Customer Loyalty"], "ans": 0, "exp": "雙篇整合：他兩點半要去機場，所以會錯過「另一場下午工作坊」。忠誠度那場是因為額滿；另一場下午工作坊是 3:00 的 Pricing in Uncertain Times。"}]},
  {"title": "三篇：產品網頁＋訂單確認＋顧客來信", "time": 300, "form": "R3", "passages": ["COMFORTPRO OFFICE CHAIRS\n\nModel A — $189 — Adjustable height, mesh back\nModel B — $249 — Adjustable height and armrests, mesh back\nModel C — $329 — Adjustable height, armrests, and lumbar support, leather seat\n\nFree delivery on orders over $500. All chairs come with a two-year warranty. Assembly service is available for $25 per chair.", "ORDER CONFIRMATION — ComfortPro\nOrder #7731 — Placed March 4\nCustomer: Brightline Design Studio\n\n3 × Model B office chair\nAssembly service × 3\nDelivery: Free\nEstimated delivery date: March 11", "To: support@comfortpro.com\nFrom: Olivia Grant, Brightline Design Studio\nDate: March 12\nSubject: Order #7731\n\nHello,\n\nOur chairs arrived yesterday as promised, and the assembly team was quick and professional. However, one of the three chairs has a broken armrest. Could you send a replacement part, or should we return the whole chair?\n\nAlso, two of my colleagues have back problems and have asked about a chair with lumbar support. If we order two more chairs, would they be delivered free as well?\n\nThank you,\nOlivia Grant"], "qs": [{"q": "What is true about all ComfortPro chairs?", "opts": ["They come with a warranty", "They have armrests", "They have leather seats", "They are delivered free"], "ans": 0, "exp": "網頁說所有椅子都有兩年保固。扶手只有 B、C 型才有；免運要訂單超過 $500。"}, {"q": "Why was delivery free for order #7731?", "opts": ["The order total was over $500", "Brightline Design Studio is a regular customer", "There was a special promotion in March", "The chairs were assembled by the customer"], "ans": 0, "exp": "雙篇整合：三張 B 型 $249 共 $747，加上組裝服務，超過 $500＝符合免運條件。"}, {"q": "What is indicated about the delivery?", "opts": ["It arrived on the estimated date", "It arrived later than expected", "It was missing one chair", "It did not include assembly"], "ans": 0, "exp": "三篇整合：預計 3 月 11 日到貨；Olivia 3 月 12 日寫信說椅子昨天到、和承諾的一樣（as promised）＝在預計日期送達。三張都到了，也有組裝。"}, {"q": "What problem does Ms. Grant report?", "opts": ["A part of a chair is damaged", "The wrong model was delivered", "The assembly team was late", "She was charged twice"], "ans": 0, "exp": "她說三張椅子中有一張扶手壞了（a broken armrest）。"}, {"q": "Which model will Ms. Grant's colleagues most likely be interested in?", "opts": ["Model C", "Model A", "Model B", "All three models"], "ans": 0, "exp": "三篇整合：同事背不好，想要有腰部支撐（lumbar support）的椅子；網頁上只有 Model C 有 lumbar support。"}]},
  {"title": "三篇：備忘錄＋課表＋電子郵件", "time": 300, "form": "R3", "passages": ["MEMO\nTo: All staff\nFrom: Human Resources\nDate: January 8\n\nAs part of our wellness program, we will offer free fitness classes in the second-floor training room starting January 15. Classes are open to all employees and are held during lunch or after work. Space is limited to fifteen people per class, so please reserve a spot through the HR portal. Employees who attend at least ten classes by March 31 will receive a $50 gift card.", "WELLNESS CLASS SCHEDULE\nMonday — 12:15 P.M. — Yoga (Instructor: Kim)\nTuesday — 5:30 P.M. — Strength Training (Instructor: Diaz)\nWednesday — 12:15 P.M. — Stretching (Instructor: Kim)\nThursday — 5:30 P.M. — Cardio Dance (Instructor: Lowe)\nFriday — 12:15 P.M. — Meditation (Instructor: Kim)", "To: hr@vantagecorp.com\nFrom: Marcus Bell\nDate: January 20\nSubject: Wellness classes\n\nHi,\n\nI really enjoyed the class I took on Tuesday evening. Unfortunately, I have client calls almost every day at lunchtime, so I can only attend classes after work. I'd love to join two classes a week, but the only evening classes are strength training and dance, and I'm really not a dancer.\n\nWould it be possible to add another evening session? I'm sure many people who work in sales would come.\n\nThanks,\nMarcus Bell"], "qs": [{"q": "What is the purpose of the memo?", "opts": ["To announce a new employee program", "To introduce a new HR director", "To ask employees to update their contact details", "To explain changes to the lunch schedule"], "ans": 0, "exp": "備忘錄宣布健康計畫的一部分：免費健身課程＝新的員工福利計畫。"}, {"q": "How can employees receive a gift card?", "opts": ["By attending ten or more classes", "By joining the HR team", "By reserving a spot before January 15", "By teaching a class"], "ans": 0, "exp": "3 月 31 日前上滿至少十堂課可以拿到 $50 禮券。"}, {"q": "Which class did Mr. Bell most likely attend?", "opts": ["Strength Training", "Yoga", "Cardio Dance", "Meditation"], "ans": 0, "exp": "三篇整合：他說上了週二晚上的課；課表上週二是 5:30 P.M. 的 Strength Training。"}, {"q": "Who teaches all of the lunchtime classes?", "opts": ["Kim", "Diaz", "Lowe", "Bell"], "ans": 0, "exp": "課表上 12:15 的課（週一、三、五）都是 Kim 老師。"}, {"q": "What can be concluded about Mr. Bell?", "opts": ["He is not interested in Cardio Dance", "He works in human resources", "He usually takes Wednesday classes", "He has already received a gift card from human resources"], "ans": 0, "exp": "三篇整合：晚上的課只有週二重訓和週四有氧舞蹈（Cardio Dance），他說自己不會跳舞（not a dancer）＝對有氧舞蹈沒興趣。他第一次上課是週二，不可能已經上滿十堂；他提到業務部的人，不是人資部。"}]},
  {"title": "三篇：報導＋讀者評論＋電子郵件", "time": 300, "form": "R3", "passages": ["Riverside Market Reopens After Renovation\n\nFAIRVIEW (October 3) — The historic Riverside Market reopened on Saturday after an eight-month renovation. The market now has a glass roof, a seating area for 200 people, and twelve new food stalls. \"We wanted to keep the character of the building while making it more comfortable,\" said market manager Jorge Silva. The market is open Tuesday through Sunday, from 8 A.M. to 8 P.M.", "Review by Hannah P. — ★★★★☆\nI visited Riverside Market last Sunday with my family. The new glass roof makes the whole space bright, and the food was excellent, especially the Thai noodle stall. My only complaint is parking. We drove around for twenty minutes before finding a space. Next time, I'll take the bus.", "To: Jorge Silva\nFrom: Councillor Ruth Ames\nDate: October 15\nSubject: Parking at Riverside Market\n\nDear Mr. Silva,\n\nCongratulations on the successful reopening. Since then, my office has received several comments from residents about parking near the market, especially on weekends.\n\nThe city is willing to open the lot at the Fairview Library, two streets away, to market visitors on Saturdays and Sundays. Would you be available to meet next week to discuss how we could let visitors know about this option?\n\nBest regards,\nRuth Ames"], "qs": [{"q": "What is mentioned about Riverside Market?", "opts": ["It is closed on Mondays", "It is open twenty-four hours", "It has a new parking garage", "It was built eight months ago"], "ans": 0, "exp": "報導說市場週二到週日營業＝週一休息。八個月是整修期間，不是興建時間。"}, {"q": "What did Hannah P. like about the market?", "opts": ["The brightness of the space", "The convenient parking", "The low prices", "The live music"], "ans": 0, "exp": "她說新的玻璃屋頂讓整個空間很明亮（bright）。停車是她唯一的抱怨。"}, {"q": "What problem do the review and the e-mail both mention?", "opts": ["Difficulty finding parking", "Long lines at food stalls", "Limited seating", "Noise from construction"], "ans": 0, "exp": "雙篇整合：評論抱怨找停車位花了二十分鐘；議員的信也說收到居民對停車的意見。"}, {"q": "What does Ms. Ames propose?", "opts": ["Letting market visitors use another parking area", "Building a new bus stop", "Extending the market's opening hours on weekend evenings", "Closing the market on weekends"], "ans": 0, "exp": "市府願意在週末開放兩條街外的圖書館停車場給市場訪客＝讓訪客使用其他停車場。"}, {"q": "What problem experienced by Hannah P. is Ms. Ames's proposal intended to solve?", "opts": ["Spending a long time looking for parking", "Waiting in long lines at food stalls", "Finding the market closed on Sunday", "Having to pay high bus fares"], "ans": 0, "exp": "三篇整合：Hannah 說繞了二十分鐘才找到停車位；議員提議週末開放圖書館停車場給訪客，正是要解決找車位的問題。市場週日有營業；評論沒有提到排隊或公車票價。"}]},
];
