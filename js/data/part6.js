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
      { opts: ["Please let us know your preference by Friday.", "Your original order has already been shipped.", "The Deluxe series costs $40 more per chair.", "Unfortunately, we are unable to offer you any alternatives."], ans: 0, exp: "句子插入題：前面提供兩個選擇（等原型號，或免費改成 Deluxe 系列），接著請對方週五前告知選擇最連貫。訂單已出貨和「延遲」矛盾；Deluxe 要加價和「不另收費」矛盾；無法提供替代方案和前面給的兩個選擇矛盾。" }
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
      { opts: ["We appreciate your cooperation during this period.", "The renovation was completed last week.", "Employees on the second floor will move to the fourth floor.", "IT staff will not be available to help with the move."], ans: 0, exp: "句子插入題：說明搬遷安排後，感謝大家在這段期間配合最自然。整修已完成和整篇公告矛盾；搬遷方向相反；IT 人員不協助和前一句矛盾。" }
    ]
  },
  {
    title: "報導：本地企業擴張",
    text: `HARBORVIEW — Coastal Roasters, a family-owned coffee company founded in 2005, announced plans yesterday to open three new locations across the region. The expansion comes after the company reported record sales for the third ___[1]___ year.

"Our customers have been asking us to open closer to their neighborhoods," said co-founder Elena Park. "This expansion allows us to do exactly that ___[2]___ maintaining the quality we are known for."

The company will begin hiring baristas and shift managers next month. ___[3]___ interested in applying should visit the company's website for details.

Construction on the first new store is already underway. ___[4]___`,
    blanks: [
      { opts: ["consecutive", "consecutively", "consequent", "considerable"], ans: 0, exp: "for the third consecutive year（連續第三年）為固定搭配，修飾名詞 year 用形容詞 consecutive。" },
      { opts: ["while", "during", "despite", "moreover"], ans: 0, exp: "while + V-ing（同時⋯）：擴張的同時維持品質。during 接名詞；despite 語意不合。" },
      { opts: ["Those", "That", "Them", "Theirs"], ans: 0, exp: "Those interested in... = 有意應徵者（Those who are interested 的簡化）。" },
      { opts: ["It is scheduled to open in early September, with the other two to follow next spring.", "Coffee prices in the region have risen sharply over the past year.", "Ms. Park first learned to roast coffee while working in her parents' café.", "Applicants with previous barista experience will be given priority."], ans: 0, exp: "句子插入題：前一句說第一家新店已經在施工，接著說明它何時開幕、其他兩家何時跟進，最連貫。咖啡價格上漲、創辦人的經歷都和施工進度無關；徵才條件應該放在上一段談招募的地方。" }
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
      { opts: ["As always, thank you for choosing Premier Fitness.", "Unfortunately, renewals can no longer be processed at the front desk.", "This offer has been extended until the end of the year.", "Your membership was canceled last month at your request."], ans: 0, exp: "句子插入題：結尾前感謝會員一直選擇 Premier Fitness，接著說期待繼續支持你的健身目標，最連貫。櫃檯不能辦續約和前一句矛盾；優惠延長到年底和「只到 4 月 15 日」矛盾；會員已取消和整封續約信矛盾。" }
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
      { opts: ["A calendar invitation with the session links will be sent tomorrow.", "The sessions will be held in person in the main conference room.", "Attendance at both training sessions is mandatory for all staff.", "Trips booked before May 6 must be re-entered in the new system."], ans: 0, exp: "句子插入題：前一句說會辦兩場線上訓練，接著說明明天會寄出含連結的行事曆邀請最連貫。實體上課和「線上」矛盾；兩場都必須參加和後一句「建議參加其中一場」矛盾；5 月 6 日前的行程要重新輸入和前文「不受影響」矛盾。" }
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
      { opts: ["for", "at", "with", "on"], ans: 0, exp: "invite someone for an interview（邀請某人來面試）。at、with、on 都不能和 invite 這樣搭配。" },
      { opts: ["tentatively", "tentative", "tentativeness", "tentativity"], ans: 0, exp: "修飾動詞 scheduled 需用副詞 tentatively（暫定地）。" },
      { opts: ["Details about the presentation topic will be emailed to you separately.", "The interview will be conducted entirely by phone.", "No preparation will be needed for the interview.", "Unfortunately, the interview has been canceled."], ans: 0, exp: "句子插入題：前一句說面試包含簡報，接著說明簡報題目會另外寄送最連貫。電話面試和「在市中心辦公室面試」矛盾；不需準備和簡報任務矛盾；面試取消和整封邀請信矛盾。" },
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
      { opts: ["Simply keep your transit receipts and submit them for reimbursement.", "The south lot will also be closed during this period.", "Employees must pay for public transportation themselves.", "The repairs are expected to take several years."], ans: 0, exp: "句子插入題：前一句說公司負擔大眾運輸費用，接著說明「保留收據申請報銷」的方法最連貫。南側停車場也關閉和前文矛盾；自付交通費和前一句矛盾；維修要好幾年和公告的期限矛盾。" },
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
      { opts: ["He added that the menu will remain largely the same.", "The new location will open in March.", "Mr. Bellini said customers rarely visit the restaurant.", "The restaurant has decided not to expand after all."], ans: 0, exp: "句子插入題：前一句是老闆說常客一直希望擴點，接著補充「菜單大致不變」最連貫。三月開幕和十月開幕矛盾；客人很少和「需求多年」矛盾；不擴點和整篇報導矛盾。" },
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
      { opts: ["Simply click the link below to renew in seconds.", "Renewals are now accepted only by mail.", "The loyalty discount is no longer available.", "Your subscription has already been renewed automatically."], ans: 0, exp: "句子插入題：前面提醒續訂與提早續訂的優惠，接著說明「點下方連結就能續訂」最連貫。只接受郵寄、優惠取消、已自動續訂，都和信中其他內容矛盾。" },
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
      { opts: ["A short video tutorial is available on the homepage.", "Employees will not need a password to access the portal.", "The portal will be available only to managers.", "Your temporary password will be mailed to you next month."], ans: 0, exp: "句子插入題：說明登入方式後，接著提供教學影片，再說遇到困難可以找 IT，最連貫。不需要密碼、只限主管使用、下個月才寄密碼，都和前文（用公司信箱與今天寄出的暫時密碼登入）矛盾。" },
      { opts: ["around the clock", "out of order", "on the house", "in the red"], ans: 0, exp: "around the clock（全天候）表 IT 支援隨時待命。其餘片語語意不合。" }
    ]
  },
  // ---- 完整閱讀測驗 第 1 回（R1）Part 6 ----
  {
    title: "電子郵件：辦公室搬遷",
    form: "R1",
    text: "To: All Staff\nFrom: Facilities Management\nSubject: Office relocation\n\nOur move to the new office on Harmon Avenue will take place over the weekend of March 14. Staff are asked to pack the contents of their desks ___[1]___ Friday afternoon. Boxes and labels will be delivered to each department on Wednesday.\n\nPlease note that the IT team will disconnect all computers at 3:00 P.M. on Friday. ___[2]___ Any files saved only on your desktop may be lost during the move.\n\nThe new office features an open floor plan, a larger break room, and ___[3]___ bicycle storage for employees. Questions about the move should be ___[4]___ to Hannah Cho in Facilities.",
    blanks: [
      { opts: ["by", "beside", "since", "along"], ans: 0, exp: "by + 時間（在⋯之前完成）：週五下午以前把東西打包好。beside 是「在旁邊」；since 搭配完成式，表示「自從」；along 是「沿著」，都不能接時間表示期限。" },
      { opts: ["Before then, please save all your work to the shared network drive.", "The new office is located two blocks from the train station.", "Boxes should be labeled with your name and department.", "All computers will be replaced with newer models next year."], ans: 0, exp: "句子插入題：前一句說週五下午三點會拔掉電腦，後一句說只存在桌面的檔案可能遺失，中間最適合提醒「在那之前把檔案存到共用磁碟」。標示紙箱的說明屬於第一段；新辦公室位置和明年換電腦都和前後文接不上。" },
      { opts: ["secure", "securely", "security", "secures"], ans: 0, exp: "名詞片語 bicycle storage 前面要用形容詞 secure（安全的），和前面的 open、larger 對等。" },
      { opts: ["directed", "directing", "direct", "direction"], ans: 0, exp: "should be + 過去分詞（被動）：問題應該「被轉給」Hannah Cho，be directed to。" }
    ]
  },
  {
    title: "信件：訂閱續約通知",
    form: "R1",
    text: "Dear Ms. Albright,\n\nThank you for being a loyal subscriber to Business Weekly. Our records show that your subscription will ___[1]___ on April 30. To continue receiving the magazine without interruption, simply renew online or by phone.\n\nIf you renew before April 15, you will receive 20 percent off the regular price. ___[2]___, you will gain full access to our online archive, which includes every issue published since 1995.\n\n___[3]___ Our customer service representatives are available Monday through Friday, 8 A.M. to 6 P.M.\n\nWe look forward to ___[4]___ you for many years to come.\n\nSincerely,\nLeon Marsh\nSubscription Services",
    blanks: [
      { opts: ["expire", "extend", "exceed", "export"], ans: 0, exp: "subscription will expire（訂閱將到期）。後面說「為了不中斷，請續訂」，所以是到期。extend 是延長；exceed 是超過；export 是出口。" },
      { opts: ["In addition", "However", "Otherwise", "Nevertheless"], ans: 0, exp: "In addition（此外）：續訂除了打八折，還能使用線上資料庫，是追加的好處。However、Nevertheless 表示轉折；Otherwise 是「否則」。" },
      { opts: ["If you have any questions about your account, please call 1-800-555-0142.", "Back issues can be ordered for $5 each.", "Many subscribers read the magazine during their commute.", "The magazine is printed on recycled paper."], ans: 0, exp: "句子插入題：後一句說客服人員的服務時間，前面最適合「有問題請打這支電話」。其他三句都和客服時間接不上。" },
      { opts: ["serving", "serve", "served", "server"], ans: 0, exp: "look forward to + V-ing（期待做⋯），這裡的 to 是介系詞，所以用 serving。" }
    ]
  },
  {
    title: "報導：共享單車計畫",
    form: "R1",
    text: "GREENVILLE — The city's new bike-sharing program, CityCycle, has exceeded expectations in its first three months. More than 12,000 residents have ___[1]___ for memberships since the program launched in June.\n\nRiders can pick up a bicycle at any of the 40 stations located throughout downtown and return it to ___[2]___ station. ___[3]___ City officials say they plan to add 25 more stations next year, mainly in residential neighborhoods.\n\n\"The response has been ___[4]___,\" said Mayor Lisa Tran. \"It shows that people want more options for getting around the city.\"",
    blanks: [
      { opts: ["applied", "application", "applicant", "applicable"], ans: 0, exp: "have + 過去分詞（現在完成式）：have applied for（已經申請）。其他三個是名詞或形容詞。" },
      { opts: ["any", "every", "all", "each"], ans: 0, exp: "return it to any station（還到任何一站都可以）。every、each 表示「每一站」，語意不合；all 後面要接複數名詞。" },
      { opts: ["Memberships cost $15 per month and include unlimited rides of up to 30 minutes.", "Bicycles must be returned to the station where they were picked up.", "Construction of the first stations will begin next spring.", "Several stations have been closed because of low demand."], ans: 0, exp: "句子插入題：會員費用說明接在租還方式之後最自然。必須還到原站和前一句「可以還到任何一站」矛盾；計畫六月已經上路，不會「明年春天才開始蓋站」；因需求低而關站和「超出預期」矛盾。" },
      { opts: ["overwhelming", "overwhelmed", "overwhelm", "overwhelmingly"], ans: 0, exp: "反應「熱烈得驚人」用現在分詞 overwhelming（令人驚嘆的）。overwhelmed 是「（人）感到不知所措」。" }
    ]
  },
  {
    title: "備忘錄：差旅費新規定",
    form: "R1",
    text: "MEMO\nTo: Sales Department\nFrom: Finance Office\nDate: May 2\nRe: Updated travel expense policy\n\nEffective June 1, all travel expenses must be submitted through the new online system, ExpensePro. Paper forms will no longer be ___[1]___.\n\nTo submit a claim, upload a photo of each receipt and enter the amount and purpose of the expense. Claims must be filed ___[2]___ 30 days of the end of the trip. ___[3]___\n\nA short training session on ExpensePro will be held on May 20. Although attendance is not mandatory, we ___[4]___ recommend it for anyone who travels regularly.",
    blanks: [
      { opts: ["accepted", "accepting", "accept", "acceptance"], ans: 0, exp: "will no longer be + 過去分詞（被動）：紙本表格不再「被受理」。" },
      { opts: ["within", "during", "between", "among"], ans: 0, exp: "within 30 days of（在⋯之後 30 天內）。" },
      { opts: ["Claims submitted after this deadline will not be reimbursed.", "Receipts are not required for expenses under $500.", "The training session will last about one hour.", "Paper forms can still be used for international trips."], ans: 0, exp: "句子插入題：前一句說 30 天內要申報，接著說明逾期不予報銷最連貫。不需要收據和前面「每張收據都要上傳」矛盾；紙本仍可使用和「不再受理紙本」矛盾；訓練課程要到下一段才介紹，放在這裡太早。" },
      { opts: ["strongly", "strong", "strength", "strengthen"], ans: 0, exp: "修飾動詞 recommend，要用副詞 strongly（強烈地）。" }
    ]
  },
  // ---- 完整閱讀測驗 第 2 回（R2）Part 6 ----
  {
    title: "公告：健身中心整修",
    form: "R2",
    text: "NOTICE TO MEMBERS\n\nWestside Fitness will be closed from June 3 to June 9 for renovations. During this time, we will be replacing all of the treadmills and ___[1]___ the locker rooms.\n\nMembers may use our Eastside location free of charge while we are closed. ___[2]___ Simply show your membership card at the front desk.\n\nWe expect the renovated facility to be ___[3]___ more comfortable. Thank you for your patience, and we look forward to ___[4]___ you back on June 10.",
    blanks: [
      { opts: ["expanding", "expand", "expanded", "expansion"], ans: 0, exp: "和前面的 replacing 對等，都接在 will be 後面：will be replacing… and expanding…（更換跑步機並擴建更衣室）。" },
      { opts: ["Its hours are the same as ours: 5 A.M. to 11 P.M. daily.", "The new treadmills will arrive next month.", "Membership fees will increase by 10 percent in July.", "The Eastside location will also be closed for renovations."], ans: 0, exp: "句子插入題：前一句說會員可以去 Eastside 分店，接著說明那裡的營業時間，再說「出示會員卡即可」，最連貫。新跑步機下個月才到，和這週整修期間就要更換矛盾；Eastside 也關閉和前一句矛盾；會費調漲和前後文無關。" },
      { opts: ["significantly", "significant", "significance", "signify"], ans: 0, exp: "修飾比較級 more comfortable，要用副詞 significantly（明顯地）。" },
      { opts: ["welcoming", "welcome", "welcomed", "to welcome"], ans: 0, exp: "look forward to + V-ing（期待做⋯），這裡的 to 是介系詞，所以用 welcoming。" }
    ]
  },
  {
    title: "電子郵件：錄取通知",
    form: "R2",
    text: "Dear Mr. Laurent,\n\nWe are delighted to offer you the position of Senior Analyst at Carver Financial. Your skills and experience impressed everyone on the hiring ___[1]___.\n\nAs discussed, your starting salary will be $78,000 per year. You will also be eligible for our annual bonus program after six months of ___[2]___.\n\n___[3]___ Please sign and return it by March 15 if you accept this offer.\n\nWe look forward to having you on our team. If you have any questions, please do not hesitate ___[4]___ me.\n\nSincerely,\nDana Whitfield\nHuman Resources",
    blanks: [
      { opts: ["committee", "commission", "commitment", "committed"], ans: 0, exp: "hiring committee（招聘委員會）。commission 是佣金或委員會（但不和 hiring 這樣搭配）；commitment 是承諾；committed 是形容詞。" },
      { opts: ["employment", "employer", "employ", "employed"], ans: 0, exp: "six months of + 名詞：six months of employment（任職六個月）。employer 是雇主，語意不合。" },
      { opts: ["A copy of the employment contract is attached to this e-mail.", "Your first day will include an orientation for new employees.", "We received more than 200 applications for this position.", "The bonus is based on the company's overall performance."], ans: 0, exp: "句子插入題：下一句說「請簽名後寄回 it」，it 要指前面提到的文件，只有「附上僱用合約」符合。其他三句都沒有可以簽回的東西。" },
      { opts: ["to contact", "contacting", "contact", "contacted"], ans: 0, exp: "do not hesitate + to + 原形動詞（不要猶豫，儘管⋯）：do not hesitate to contact me。" }
    ]
  },
  {
    title: "報導：機場擴建",
    form: "R2",
    text: "MILLBROOK — Construction of a new terminal at Millbrook Regional Airport will begin next spring, airport officials announced on Tuesday. The $120 million project is expected to ___[1]___ the airport's passenger capacity by 40 percent.\n\nThe new terminal will feature additional gates, a larger security area, and a variety of shops and restaurants. ___[2]___, a parking garage with 1,500 spaces will be built next to the terminal.\n\n\"Passenger numbers have grown every year for the past decade,\" said airport director Paul Inoue. ___[3]___\n\nConstruction is scheduled to be completed in two years. During that time, the existing terminal will remain ___[4]___.",
    blanks: [
      { opts: ["increase", "include", "insert", "inspect"], ans: 0, exp: "increase capacity by 40 percent（運量增加 40%）。include 是包含；insert 是插入；inspect 是檢查。" },
      { opts: ["In addition", "However", "Instead", "Otherwise"], ans: 0, exp: "In addition（此外）：在航廈設施之外，再加蓋停車場，是追加的內容。However 表示轉折；Instead 是「取而代之」；Otherwise 是「否則」。" },
      { opts: ["\"This expansion will allow us to keep up with that demand.\"", "Several airlines have recently canceled their routes to Millbrook.", "The project was canceled because of rising costs.", "Parking at the airport will be free during construction."], ans: 0, exp: "句子插入題：前一句說旅客人數十年來年年成長，接著主任說「擴建讓我們能應付這樣的需求」最連貫。航空公司取消航線和旅客成長矛盾；計畫取消和整篇報導矛盾；施工期間免費停車和前一句無關。" },
      { opts: ["open", "opened", "opening", "openly"], ans: 0, exp: "remain + 形容詞（保持⋯狀態）：remain open（照常開放）。opened、opening 不這樣用；openly 是副詞（公開地）。" }
    ]
  },
  {
    title: "備忘錄：資源回收計畫",
    form: "R2",
    text: "MEMO\nTo: All employees\nFrom: Office Services\nDate: September 8\nSubject: New recycling program\n\nStarting next Monday, the office will introduce a new recycling program. Separate bins for paper, plastic, and cans will be placed ___[1]___ the kitchen on each floor.\n\nPlease rinse plastic containers and cans before placing them in the bins. ___[2]___ Paper should be flattened, and any confidential documents must still be shredded.\n\nWe hope this program will ___[3]___ reduce the amount of waste our office sends to landfills. ___[4]___ questions about the program should be sent to Mark Delgado in Office Services.",
    blanks: [
      { opts: ["near", "onto", "upon", "among"], ans: 0, exp: "placed near the kitchen（放在茶水間附近）。onto、upon 表示放到某物上面；among 是在（三者以上）之中，都不合語意。" },
      { opts: ["Items that are not clean cannot be recycled.", "Shredded paper should be placed in the plastic bin.", "The kitchen will be closed for cleaning on Monday.", "Employees may now bring their pets to the office."], ans: 0, exp: "句子插入題：前一句要求先沖洗塑膠容器和鋁罐，接著說明原因「不乾淨的東西無法回收」最連貫。碎紙放塑膠桶不合理；茶水間週一關閉、可以帶寵物都和回收說明無關。" },
      { opts: ["help", "helping", "helped", "helpful"], ans: 0, exp: "will + 原形動詞：will help reduce（幫助減少）。help 後面可以直接接原形動詞 reduce。" },
      { opts: ["Any", "Much", "Every", "Each"], ans: 0, exp: "Any questions（任何問題）＋複數名詞。Much 接不可數名詞；Every、Each 後面要接單數名詞。" }
    ]
  }
];
