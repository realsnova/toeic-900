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
  },
  // ---- R3：完整閱讀測驗 Part 6，保留給完整測驗，不出現在一般練習 ----
  {"title": "電子郵件：辦公室搬遷", "form": "R3", "text": "To: All Staff\nFrom: Facilities Department\nSubject: Office move\n\nAs you know, our team will move to the new building on Grant Street next month. To make the transition as smooth as possible, we ask that you ___[1]___ your personal belongings by Friday, March 7. Boxes and labels will be ___[2]___ at the front desk starting Monday. ___[3]___\n\nThe movers will transport all furniture and computer equipment over the weekend. ___[4]___, please contact Ana Ruiz at extension 214.", "blanks": [{"opts": ["pack", "packed", "packing", "to pack"], "ans": 0, "exp": "ask that + 主詞 + 原形動詞（假設語氣）：we ask that you pack。packed、packing、to pack 都不能放在 that 子句的主詞 you 後面當動詞。"}, {"opts": ["available", "availability", "avail", "availably"], "ans": 0, "exp": "be 動詞後面接形容詞：will be available（可以取得）。availability 是名詞；avail 是動詞；availably 不是常用字。"}, {"opts": ["Please write your name and new desk number on each box.", "The new building has a large cafeteria on the top floor.", "Last year's move was postponed because of bad weather.", "Staff parking will cost ten dollars per day."], "ans": 0, "exp": "句子插入題：前一句說櫃台會發箱子和標籤，接著說明標籤要寫什麼（姓名和新座位號碼）最連貫。餐廳、去年延期、停車費都和打包的指示無關。"}, {"opts": ["If you have any questions", "Even so", "As a result", "In addition"], "ans": 0, "exp": "後面是 please contact…（請聯絡…），前面需要一個條件：If you have any questions（如果有任何問題）。Even so（即便如此）、As a result（結果）、In addition（此外）都不能引出「請聯絡某人」。"}]},
  {"title": "廣告：烹飪學校週末課程", "form": "R3", "text": "Riverside Cooking School is pleased to announce a new series of weekend classes for beginners. Each class is ___[1]___ by a professional chef and lasts three hours. Participants will learn basic knife skills, simple sauces, and ___[2]___ to plan balanced meals.\n\nAll ingredients and equipment are provided. ___[3]___ Class sizes are limited to twelve students, so early registration is ___[4]___ recommended.", "blanks": [{"opts": ["taught", "teaching", "teach", "teacher"], "ans": 0, "exp": "課程是「被教授」的，is + 過去分詞的被動：is taught by a professional chef。teaching 會變成課程在教別人；teach 和 teacher 不能接在 is 後面。"}, {"opts": ["how", "what", "which", "why"], "ans": 0, "exp": "learn how to plan（學習如何規劃）。what to plan 是「規劃什麼」，和後面的 balanced meals 不搭；which、why 也不合。"}, {"opts": ["Students simply need to bring an apron.", "Our restaurant is open every evening except Monday.", "The school was founded by two brothers in 1998.", "Advanced classes require a written test."], "ans": 0, "exp": "句子插入題：前一句說食材和器材都由學校提供，接著說「學生只要帶圍裙」最連貫。文中沒有提到餐廳；學校歷史和進階班考試都和初學者課程的準備無關。"}, {"opts": ["strongly", "strong", "strength", "strengthen"], "ans": 0, "exp": "修飾形容詞 recommended，要用副詞：strongly recommended（強烈建議）。strong 是形容詞；strength 是名詞；strengthen 是動詞。"}]},
  {"title": "報導：麵包店獲獎", "form": "R3", "text": "MAPLETON (April 2) — Golden Crust Bakery has won this year's Best Small Business award from the Mapleton Chamber of Commerce. The bakery, which opened just three years ago, was ___[1]___ for its use of local ingredients and its support of community events. ___[2]___\n\nOwner Lena Fischer said she was surprised by the news. \"We are a small team, and every one of us works hard,\" she said. \"This award really belongs to my staff.\"\n\nMs. Fischer plans to use the prize money to ___[3]___ a second oven, which will allow the bakery to increase production. The award ceremony will be held on April 20 at the Mapleton Hotel, and tickets are available to the ___[4]___.", "blanks": [{"opts": ["recognized", "recognizing", "recognition", "recognize"], "ans": 0, "exp": "麵包店是「被表揚」的，was + 過去分詞的被動：was recognized for…。recognizing 是主動；recognition 是名詞；recognize 是原形。"}, {"opts": ["Every Saturday, it donates unsold bread to a local shelter.", "The Chamber of Commerce was established in 1952.", "Bread prices have risen across the region this year.", "Ms. Fischer previously worked as an accountant."], "ans": 0, "exp": "句子插入題：前一句說獲獎原因之一是支持社區活動，接著舉例「每週六把沒賣完的麵包捐給收容所」最連貫。商會成立年份、麵包漲價都離題；Fischer 女士在下一段才第一次出現，這裡先用 Ms. Fischer 稱呼不合理。"}, {"opts": ["purchase", "purchasing", "purchased", "purchaser"], "ans": 0, "exp": "to 後面接原形動詞：to purchase a second oven（購買第二台烤箱）。purchasing、purchased 不能接在不定詞 to 後面；purchaser 是名詞（買方）。"}, {"opts": ["public", "publicly", "publicity", "publish"], "ans": 0, "exp": "the public（一般大眾）是固定說法：門票開放大眾購買。publicly 是副詞；publicity 是名詞（宣傳），和 available to 不搭；publish 是動詞。"}]},
  {"title": "備忘錄：新的報帳系統", "form": "R3", "text": "MEMO\nTo: All employees\nFrom: Finance Department\nDate: May 12\n\nStarting June 1, all travel expenses must be submitted through ExpenseNow, our new online system. The system will replace the paper forms that we ___[1]___ for the past ten years.\n\nWith ExpenseNow, you can photograph receipts with your phone and submit claims in minutes. ___[2]___, reimbursements will be processed within five business days instead of three weeks.\n\nTraining sessions will be held next week in Room 4B. ___[3]___ Employees who cannot attend may watch a recorded version on the company intranet. Paper forms will no longer be accepted ___[4]___ May 31.", "blanks": [{"opts": ["have used", "use", "will use", "are using"], "ans": 0, "exp": "for the past ten years（過去十年來）搭配現在完成式：have used。use 是現在簡單式；will use 是未來式；are using 是現在進行式，都不能和 for the past ten years 搭配。"}, {"opts": ["In addition", "However", "Otherwise", "For example"], "ans": 0, "exp": "前一句說新系統的好處（用手機拍收據、幾分鐘就能申請），這句再加一個好處（五個工作天內撥款），用 In addition（此外）。However 表示轉折；Otherwise（否則）、For example（例如）都不合。"}, {"opts": ["Each session will last about forty-five minutes.", "Receipts must be kept for seven years.", "Room 4B is currently being renovated.", "Our travel policy has not changed since 2015."], "ans": 0, "exp": "句子插入題：前一句說下週在 4B 室舉辦訓練課程，接著說明每場課程的長度最連貫。4B 室正在整修，和在那裡上課矛盾；收據保存年限和差旅政策都離題。"}, {"opts": ["after", "until", "since", "during"], "ans": 0, "exp": "「5 月 31 日之後」不再接受紙本表格：no longer… after May 31。until 搭配 no longer 會變成「到 5 月 31 日為止不再接受」，語意不合；since 要搭配完成式；during 後面接一段期間。"}]},
  // ---- C1：練習題批次 ----
  {"title": "新聞稿：物流公司與航空貨運合作", "text": "FOR IMMEDIATE RELEASE\nContact: Helena Brandt, Communications Manager\n\nSEATTLE (March 9) — Corvane Logistics announced today that it has entered into a three-year agreement with Northwind Air Cargo. Under the partnership, Corvane customers will gain access to overnight freight service between Seattle and twelve cities in Asia. ___[1]___, Northwind will dedicate two aircraft exclusively to Corvane shipments during the peak holiday season.\n\n\"Our clients have been asking for faster international options for some time,\" said Corvane CEO Marcus Webb. \"This agreement allows us to meet that demand without ___[2]___ our own fleet of aircraft.\" ___[3]___\n\nThe new service will be available to customers beginning May 1. Corvane expects its international shipping volume to grow by 30 percent in the first year, and the company plans to hire forty additional warehouse employees to handle the ___[4]___ workload.", "src": "C1", "blanks": [{"opts": ["In addition", "Instead", "Even so", "Otherwise"], "ans": 0, "sk": "p6-trans", "exp": "前一句說客戶可以使用隔夜空運服務，這句再補充另一項合作內容（旺季專用兩架飛機），是「追加」關係，用 In addition（此外）。Instead（反而）表示取代前面的內容；Even so（即便如此）表示讓步；Otherwise（否則）表示條件相反，都和前後文的關係不合。"}, {"opts": ["expanding", "expand", "expanded", "expansion"], "ans": 0, "sk": "p6-grammar", "exp": "介係詞 without 後面要接動名詞，而且後面還有受詞 our own fleet，所以用 expanding（擴充）。expand 是原形動詞、expanded 是過去式或過去分詞，都不能直接放在介係詞後面；expansion 是名詞，後面不能再直接接受詞 our own fleet。"}, {"opts": ["Until now, Corvane has shipped to Asia only by sea.", "Northwind recently ended all of its cargo flights to Asian cities.", "Mr. Webb founded the company with his brother in 1994.", "Corvane also reported lower profits for the third quarter in a row."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：Webb 執行長剛說客戶一直要求「更快的國際運送選項」，接著補充背景「到目前為止只能走海運」，說明為什麼需要空運，最連貫。「Northwind 停飛所有亞洲航線」和第一段的亞洲十二個城市隔夜服務矛盾；公司創立年份、連續三季獲利下滑都和這次合作無關，放在這裡很突兀。"}, {"opts": ["increased", "reduced", "previous", "optional"], "ans": 0, "sk": "p6-vocab", "exp": "前面說國際運量預計成長 30%，所以要多僱四十名倉儲人員來處理「增加的」工作量：the increased workload。reduced（減少的）和運量成長矛盾；previous（先前的）工作量不需要新增人手；optional（可選擇的）和 workload 搭配不合理。"}]},
  {"title": "電子郵件：供應商調整價格", "text": "To: Purchasing Team, Delmont Furniture\nFrom: Aisha Kamara, Account Manager, Teakwood Timber Supply\nDate: August 3\nSubject: Updated price list\n\nDear Purchasing Team,\n\nI am writing to inform you of a change to our pricing. Due to rising transportation costs, the price of all hardwood products will increase by six percent ___[1]___ September 1. Orders placed before that date will be billed at current rates, even if they are delivered later.\n\nWe understand that this news may affect your production budget. ___[2]___ To help ease the transition, we are offering a one-time discount of four percent on any order of more than 500 board feet placed during August.\n\nThe updated price list is attached. Please note that softwood and plywood prices will remain ___[3]___ for the rest of the year.\n\n___[4]___, we value our long relationship with Delmont Furniture and remain committed to delivering quality materials on schedule.\n\nSincerely,\nAisha Kamara", "src": "C1", "blanks": [{"opts": ["effective", "effectively", "effects", "effected"], "ans": 0, "sk": "p6-grammar", "exp": "effective + 日期＝「自某日起生效」，是公告價格、規定時的固定用法：will increase … effective September 1（9 月 1 日起調漲）。effectively 是副詞（有效地／實際上），不能接日期；effects 是名詞複數或第三人稱動詞；effected 是過去分詞（被實現），放在這裡都不通。"}, {"opts": ["We have worked hard to keep this increase as small as possible.", "Hardwood prices have fallen steadily over the past year.", "Your most recent shipment was delivered two days late.", "Our warehouse will be closed for the entire month of August."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前一句說「這個消息可能影響貴公司的預算」，接著說「我們已盡力把漲幅壓到最低」，再接 To help ease the transition 提出折扣，語氣一路連貫。「硬木價格持續下跌」和信中說成本上升、要漲價矛盾；上一批貨晚到兩天和漲價無關；「倉庫八月整月關閉」和後面「八月下單享折扣」矛盾。"}, {"opts": ["unchanged", "unfinished", "unattended", "unopened"], "ans": 0, "sk": "p6-vocab", "exp": "Please note 這句是在對比：硬木漲價，但軟木和夾板價格「維持不變」，remain unchanged。unfinished（未完成的）、unattended（無人看管的）、unopened（未開封的）都不能用來形容價格。"}, {"opts": ["In any case", "As a result", "For example", "Otherwise"], "ans": 0, "sk": "p6-trans", "exp": "最後一段是結尾，不論前面說了漲價這類壞消息，都要強調重視雙方的長期合作，用 In any case（無論如何）。As a result（因此）會變成「因為漲價，所以我們重視合作」，因果不通；For example（例如）後面沒有舉例；Otherwise（否則）需要前面有條件，這裡沒有。"}]},
  {"title": "公告：大樓消防演習", "text": "NOTICE TO ALL TENANTS\n\nThe annual fire drill for the Prescott Building will take place on Wednesday, April 15, at approximately 10:30 A.M. When the alarm sounds, all occupants must leave the building by the nearest stairway. Elevators will be ___[1]___ automatically and must not be used.\n\nOnce outside, please proceed to your assigned assembly area in the north parking lot. Floor wardens will check that everyone ___[2]___ accounted for before the all-clear signal is given. ___[3]___\n\nThe drill is required by city regulations and is designed to ensure that all occupants know how to respond in a real emergency. ___[4]___, we ask tenants to inform their visitors and clients of the drill in advance.", "src": "C1", "blanks": [{"opts": ["disabled", "dismissed", "discarded", "displaced"], "ans": 0, "sk": "p6-vocab", "exp": "後面說電梯「不得使用」，所以前面是電梯會被自動「停用」：will be disabled automatically。dismissed 用在人（解散、解僱）；discarded 是丟棄；displaced 是移位、使流離失所，都不適合描述演習時的電梯。"}, {"opts": ["has been", "have been", "being", "to be"], "ans": 0, "sk": "p6-grammar", "exp": "that 子句需要一個完整的動詞，主詞 everyone 是單數，所以用 has been accounted for（都已清點到）。have been 是複數動詞，和 everyone 不一致；being 和 to be 都不是完整的動詞，that 子句會缺少動詞。"}, {"opts": ["The whole drill should take about twenty minutes.", "Employees on the ground floor may remain at their desks.", "Visitors must sign in at the security desk upon arrival.", "The north parking lot will be repaved later this spring."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前一句說到解除警報（all-clear signal）為止的流程，接著說明整個演習「大約二十分鐘」，是對流程的總結，最連貫。「一樓員工可以留在座位」和第一段 all occupants must leave 矛盾；訪客簽到和演習無關；停車場之後要重鋪是另一件事，放在這裡離題。"}, {"opts": ["To avoid confusion", "In contrast", "Even so", "Instead"], "ans": 0, "sk": "p6-trans", "exp": "請房客事先告訴訪客和客戶有演習，目的是「避免混亂」，用 To avoid confusion（為了避免混淆）。In contrast（相對地）需要前後對比；Even so（即便如此）需要讓步關係；Instead（取而代之）表示替換，都和前一句「演習是法規要求、為了讓大家知道如何應變」接不起來。"}]},
  {"title": "廣告：辦公室植栽租賃", "text": "Bring Your Workspace to Life with GreenLease\n\nStudies show that plants can reduce stress and improve concentration in the workplace. But keeping them healthy takes time that busy professionals simply do not have. That is ___[1]___ GreenLease comes in.\n\nFor a low monthly fee, our designers will select plants suited to the light and temperature conditions of your office. ___[2]___ Our technicians then visit every two weeks to water, trim, and fertilize each plant. If a plant ___[3]___ to thrive, we will replace it at no extra charge.\n\nGreenLease currently serves more than 400 businesses in the Denver area. ___[4]___, new clients who sign a twelve-month agreement before June 30 will receive their first month free. Call 555-0187 to schedule a free consultation.", "src": "C1", "blanks": [{"opts": ["where", "which", "what", "whom"], "ans": 0, "sk": "p6-grammar", "exp": "That is where … comes in 是固定說法，意思是「這就是某某派上用場的地方」，where 是關係副詞，後面接完整子句 GreenLease comes in。which、whom 是關係代名詞，後面子句要缺受詞或主詞，但 GreenLease comes in 已經完整；what 也一樣需要子句缺一個名詞，句子都不通。"}, {"opts": ["They will also deliver the plants and arrange them for you.", "Artificial plants are a popular low-cost alternative.", "You will need to water each plant twice a week.", "Most of our plants are grown in greenhouses abroad."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前一句說設計師幫你挑選植物，下一句用 then（接著）說技術人員每兩週來照顧，中間需要「送來並擺好」這個步驟，They 指設計師，最連貫。人造植物和這項租賃服務無關；「你要每週澆兩次水」和技術人員負責澆水矛盾；植物在國外溫室種植是離題資訊，也接不上 then。"}, {"opts": ["fails", "declines", "refuses", "neglects"], "ans": 0, "sk": "p6-vocab", "exp": "fail to thrive＝長不好、無法存活，是描述植物（或生物）狀況的固定說法：如果植物長不好，免費換新。decline to 是「婉拒去做」，refuse to 是「拒絕去做」，都需要有意志的主詞；neglect to 是「疏忽沒做」，植物不會疏忽，三個都不合。"}, {"opts": ["What's more", "However", "Therefore", "Likewise"], "ans": 0, "sk": "p6-trans", "exp": "前一句說服務超過 400 家企業（優點），這句再加一個好處：新客戶簽約一年免第一個月費用，是追加關係，用 What's more（而且、更棒的是）。However 表示轉折，但前後沒有對立；Therefore 表示因果，「服務很多家企業」不會導致「新客戶免一個月」；Likewise（同樣地）需要前後是相似的情況。"}]},
  {"title": "備忘錄：新的訪客登記程序", "text": "MEMO\nTo: All Staff\nFrom: Gregory Okafor, Head of Security\nDate: February 16\nRe: New visitor procedure\n\nBeginning Monday, March 2, all visitors to our headquarters must be registered in advance through the VisitorPass system. Employees who are expecting a guest should enter the visitor's name, company, and expected arrival time no later than 5:00 P.M. on the previous business day. The system will then automatically ___[1]___ the guest an e-mail containing a QR code.\n\n___[2]___ Unregistered visitors will be asked to wait in the lobby until their host comes down to sign them in personally.\n\nThis change is part of a wider effort to improve building security. ___[3]___, it will allow reception staff to prepare badges ahead of time, reducing waiting times at the front desk. A short guide to VisitorPass ___[4]___ to this memo. Please direct any questions to the security office at extension 4120.", "src": "C1", "blanks": [{"opts": ["send", "inform", "notify", "deliver"], "ans": 0, "sk": "p6-vocab", "exp": "空格後面是 the guest（人）＋ an e-mail（物）兩個受詞，只有 send 可以這樣用：send someone something（寄給某人某物）。inform 和 notify 的用法是 inform/notify someone of something，不能直接接 an e-mail；deliver 一般說 deliver something to someone，不接兩個受詞。"}, {"opts": ["Guests will need to show this code at the reception desk upon arrival.", "Visitors will no longer be required to check in at reception.", "The lobby will be closed for repainting throughout March.", "Our headquarters first opened its doors to the public in 2011."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前一段結尾提到系統寄出含 QR code 的電子郵件，這句用 this code 接著說「訪客抵達時要在櫃台出示」，後面再說沒登記的訪客要在大廳等候，前後呼應。「訪客不用再到櫃台報到」和新程序矛盾；「大廳三月整修關閉」和「未登記訪客在大廳等候」矛盾；總部開幕年份和訪客程序無關。"}, {"opts": ["In addition", "Instead", "Otherwise", "Nonetheless"], "ans": 0, "sk": "p6-trans", "exp": "前一句說這項改變能提升大樓安全，這句再說另一個好處（櫃台可以先準備好識別證、縮短等候時間），是追加關係，用 In addition（此外）。Instead（反而）表示取代；Otherwise（否則）表示相反條件；Nonetheless（儘管如此）表示讓步，前後都沒有對立。"}, {"opts": ["is attached", "attaches", "attaching", "has attached"], "ans": 0, "sk": "p6-grammar", "exp": "主詞是 A short guide（指南），指南是「被附上」的，要用被動語態 is attached to this memo。attaches 和 has attached 是主動，會變成「指南附上了某物」，而且後面沒有受詞；attaching 不是完整的動詞，句子缺少動詞。"}]},
  {"title": "信件：標案結果通知", "text": "Ridgeway Municipal Services\n410 Harlan Avenue\nRidgeway\n\nNovember 12\n\nMs. Priya Desai\nDesai Landscaping\n88 Orchard Lane\nRidgeway\n\nDear Ms. Desai,\n\nThank you for submitting a proposal to maintain the grounds of Ridgeway's public parks. We received eleven bids for this contract, and the selection committee reviewed each one ___[1]___.\n\nAfter much consideration, we have decided to award the contract to another company. Your proposal was well organized, and your references spoke highly of your work. ___[2]___, the committee felt that the winning bid offered a more detailed plan for reducing water use, which is a priority for the city this year.\n\n___[3]___ We will keep your company's information on file and would encourage you to bid on future projects. The next round of contracts, which ___[4]___ snow removal and street cleaning, will be announced in January.\n\nSincerely,\nThomas Reilly\nProcurement Officer", "src": "C1", "blanks": [{"opts": ["carefully", "careful", "care", "cared"], "ans": 0, "sk": "p6-grammar", "exp": "句子 the committee reviewed each one 已經完整，空格要修飾動詞 reviewed，用副詞 carefully（仔細地）。careful 是形容詞，不能修飾動詞；care 是名詞或動詞；cared 是過去式，放在句尾都不通。"}, {"opts": ["Nevertheless", "Therefore", "Likewise", "In other words"], "ans": 0, "sk": "p6-trans", "exp": "前一句稱讚對方提案條理分明、推薦人評價很高，這句卻說委員會認為得標者的省水計畫更詳細，是「先肯定、再轉折」，用 Nevertheless（儘管如此）。Therefore（因此）會變成「因為你的提案很好，所以別人得標」，因果不通；Likewise（同樣地）需要相似的情況；In other words（換句話說）需要前後意思相同。"}, {"opts": ["We realize that this news is disappointing.", "Work will begin as soon as you sign the enclosed contract.", "Our parks department plans to hire three gardeners in spring.", "The committee will meet again next week to review the bids."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前面說明沒有得標的原因，這段開頭先表達體諒「我們知道這個消息令人失望」，再接「會保留貴公司資料、鼓勵參加之後的標案」，是落選通知信常見的順序。「簽約後就開工」和沒有得標矛盾；公園處要僱園丁和信件主旨無關；「委員會下週會再開會審標」和前面說已經決定得標廠商矛盾。"}, {"opts": ["cover", "retain", "pursue", "prevent"], "ans": 0, "sk": "p6-vocab", "exp": "下一批合約「涵蓋」除雪和街道清潔：contracts, which cover snow removal and street cleaning。retain（保留）、pursue（追求）、prevent（防止）放進去都不通，尤其 prevent snow removal 會變成「阻止除雪」。"}]},
  {"title": "電子郵件：年度績效面談", "text": "To: Daniel Ferreira\nFrom: Ingrid Solberg\nDate: June 1\nSubject: Annual performance review\n\nHi Daniel,\n\nIt is time once again for annual performance reviews. Before we meet, please complete the self-assessment form that HR ___[1]___ to all employees last week. In it, you will be asked to describe your main accomplishments over the past year and to identify areas where you would like to grow.\n\nI have tentatively scheduled your review for Thursday, June 11, at 2:00 P.M. If that time is inconvenient, let me know, and I will find another slot that works for ___[2]___. ___[3]___\n\nPlease bring any documents that you think support your self-assessment, such as client feedback or project reports. I look forward to a ___[4]___ conversation about your goals for the coming year.\n\nBest,\nIngrid", "src": "C1", "blanks": [{"opts": ["sent", "sends", "will send", "has been sending"], "ans": 0, "sk": "p6-grammar", "exp": "句尾有 last week（上週），表示過去已完成的動作，用過去式 sent。sends 是現在式；will send 是未來式，和「上週」矛盾；has been sending 是現在完成進行式，表示一直持續在寄，不能和 last week 這種明確的過去時間連用。"}, {"opts": ["both of us", "each other", "ourselves", "one another"], "ans": 0, "sk": "p6-grammar", "exp": "找一個對「我們兩個人」都方便的時段：works for both of us。each other 和 one another 是「互相」，要用在雙方互相對彼此做某事的句子（例如 help each other），這裡沒有互相的動作；ourselves 是反身代名詞，主詞要是 we 才能用，這裡的主詞是 another slot。"}, {"opts": ["Please return your form to me before we meet.", "Since your review was so positive, we will not need to meet.", "HR has decided to discontinue annual reviews this year.", "Client feedback surveys will be sent out in September."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：這段在安排面談時間，接著請對方「面談前把表格交給我」，連結了第一段的自評表和這段的面談日期，最連貫。「評價很好所以不用見面」和前面已經排好面談矛盾；「人資今年取消年度考核」和整封信的目的矛盾；九月寄客戶問卷和這次面談的安排無關。"}, {"opts": ["productive", "punctual", "tentative", "mandatory"], "ans": 0, "sk": "p6-vocab", "exp": "期待一場「有成果的」對話：a productive conversation，是商務信件常見的結尾。punctual（準時的）用來形容人，不形容對話；tentative（暫定的）可以形容時間安排，不適合形容期待中的對話；mandatory（強制的）放在「我很期待」的句子裡語氣矛盾。"}]},
  {"title": "公告：自來水管線工程停水", "text": "NOTICE OF WATER SERVICE INTERRUPTION\n\nThe Calloway Water Authority will be replacing aging pipes along Birch Street between 3rd and 7th Avenues. ___[1]___, water service to homes and businesses on these blocks will be shut off on Tuesday, July 21, from 9:00 A.M. to 4:00 P.M.\n\nResidents are advised to store enough drinking water for the day ___[2]___ the work begins. When service is restored, tap water may appear cloudy for a short time. This is caused by air in the pipes and is not harmful. ___[3]___\n\nWe apologize for the inconvenience and thank residents for their patience as we work to improve the ___[4]___ of the local water supply.", "src": "C1", "blanks": [{"opts": ["As a result", "In contrast", "Even so", "For instance"], "ans": 0, "sk": "p6-trans", "exp": "因為要更換舊水管（原因），所以這幾個街區會停水（結果），用 As a result（因此）。In contrast（相對地）需要對比；Even so（即便如此）表示讓步，會變成「雖然換水管，還是停水」；For instance（例如）後面要舉例，停水不是換水管的例子。"}, {"opts": ["before", "since", "unless", "whereas"], "ans": 0, "sk": "p6-grammar", "exp": "居民應該在施工「開始之前」先儲水：before the work begins。since 表示「自從」或「因為」，「自從施工開始就儲水」不合理；unless（除非）、whereas（然而）的邏輯都不通。"}, {"opts": ["Running the tap briefly should clear it.", "To be safe, please boil all tap water for the next two weeks.", "Work on Birch Street was completed ahead of schedule last month.", "Bills for July will be mailed a week later than usual."], "ans": 0, "sk": "p6-insert", "exp": "句子插入題：前兩句說恢復供水後水可能混濁、但無害，接著提供解決方法「讓水龍頭流一下就會變清」，it 指混濁的自來水，最連貫。「為了安全請煮沸兩週」和前一句「無害」矛盾；「施工上個月已提前完成」和這份停水預告矛盾；帳單延後寄送和停水說明無關。"}, {"opts": ["reliability", "reliance", "relief", "relevance"], "ans": 0, "sk": "p6-vocab", "exp": "更換老舊水管是為了提升供水的「穩定可靠程度」：improve the reliability of the water supply。reliance（依賴）、relief（緩解、救濟）、relevance（關聯性）拼法相近，但放進去意思都不通。"}]},
];
