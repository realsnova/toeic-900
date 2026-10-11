# C1 Part 6（8 篇 32 題）與 Part 7 單篇（14 組）。ans 一律 0，執行時洗牌。
INS = "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?"

P6 = [
 ("新聞稿：物流公司與航空貨運合作",
  "FOR IMMEDIATE RELEASE\nContact: Helena Brandt, Communications Manager\n\nSEATTLE (March 9) — Corvane Logistics announced today that it has entered into a three-year agreement with Northwind Air Cargo. Under the partnership, Corvane customers will gain access to overnight freight service between Seattle and twelve cities in Asia. ___[1]___, Northwind will dedicate two aircraft exclusively to Corvane shipments during the peak holiday season.\n\n\"Our clients have been asking for faster international options for some time,\" said Corvane CEO Marcus Webb. \"This agreement allows us to meet that demand without ___[2]___ our own fleet of aircraft.\" ___[3]___\n\nThe new service will be available to customers beginning May 1. Corvane expects its international shipping volume to grow by 30 percent in the first year, and the company plans to hire forty additional warehouse employees to handle the ___[4]___ workload.",
  [(["In addition", "Instead", "Even so", "Otherwise"], "p6-trans",
    "前一句說客戶可以使用隔夜空運服務，這句再補充另一項合作內容（旺季專用兩架飛機），是「追加」關係，用 In addition（此外）。Instead（反而）表示取代前面的內容；Even so（即便如此）表示讓步；Otherwise（否則）表示條件相反，都和前後文的關係不合。"),
   (["expanding", "expand", "expanded", "expansion"], "p6-grammar",
    "介係詞 without 後面要接動名詞，而且後面還有受詞 our own fleet，所以用 expanding（擴充）。expand 是原形動詞、expanded 是過去式或過去分詞，都不能直接放在介係詞後面；expansion 是名詞，後面不能再直接接受詞 our own fleet。"),
   (["Until now, Corvane has shipped to Asia only by sea.", "Northwind recently ended all of its cargo flights to Asian cities.", "Mr. Webb founded the company with his brother in 1994.", "Corvane also reported lower profits for the third quarter in a row."], "p6-insert",
    "句子插入題：Webb 執行長剛說客戶一直要求「更快的國際運送選項」，接著補充背景「到目前為止只能走海運」，說明為什麼需要空運，最連貫。「Northwind 停飛所有亞洲航線」和第一段的亞洲十二個城市隔夜服務矛盾；公司創立年份、連續三季獲利下滑都和這次合作無關，放在這裡很突兀。"),
   (["increased", "reduced", "previous", "optional"], "p6-vocab",
    "前面說國際運量預計成長 30%，所以要多僱四十名倉儲人員來處理「增加的」工作量：the increased workload。reduced（減少的）和運量成長矛盾；previous（先前的）工作量不需要新增人手；optional（可選擇的）和 workload 搭配不合理。")]),

 ("電子郵件：供應商調整價格",
  "To: Purchasing Team, Delmont Furniture\nFrom: Aisha Kamara, Account Manager, Teakwood Timber Supply\nDate: August 3\nSubject: Updated price list\n\nDear Purchasing Team,\n\nI am writing to inform you of a change to our pricing. Due to rising transportation costs, the price of all hardwood products will increase by six percent ___[1]___ September 1. Orders placed before that date will be billed at current rates, even if they are delivered later.\n\nWe understand that this news may affect your production budget. ___[2]___ To help ease the transition, we are offering a one-time discount of four percent on any order of more than 500 board feet placed during August.\n\nThe updated price list is attached. Please note that softwood and plywood prices will remain ___[3]___ for the rest of the year.\n\n___[4]___, we value our long relationship with Delmont Furniture and remain committed to delivering quality materials on schedule.\n\nSincerely,\nAisha Kamara",
  [(["effective", "effectively", "effects", "effected"], "p6-grammar",
    "effective + 日期＝「自某日起生效」，是公告價格、規定時的固定用法：will increase … effective September 1（9 月 1 日起調漲）。effectively 是副詞（有效地／實際上），不能接日期；effects 是名詞複數或第三人稱動詞；effected 是過去分詞（被實現），放在這裡都不通。"),
   (["We have worked hard to keep this increase as small as possible.", "Hardwood prices have fallen steadily over the past year.", "Your most recent shipment was delivered two days late.", "Our warehouse will be closed for the entire month of August."], "p6-insert",
    "句子插入題：前一句說「這個消息可能影響貴公司的預算」，接著說「我們已盡力把漲幅壓到最低」，再接 To help ease the transition 提出折扣，語氣一路連貫。「硬木價格持續下跌」和信中說成本上升、要漲價矛盾；上一批貨晚到兩天和漲價無關；「倉庫八月整月關閉」和後面「八月下單享折扣」矛盾。"),
   (["unchanged", "unfinished", "unattended", "unopened"], "p6-vocab",
    "Please note 這句是在對比：硬木漲價，但軟木和夾板價格「維持不變」，remain unchanged。unfinished（未完成的）、unattended（無人看管的）、unopened（未開封的）都不能用來形容價格。"),
   (["In any case", "As a result", "For example", "Otherwise"], "p6-trans",
    "最後一段是結尾，不論前面說了漲價這類壞消息，都要強調重視雙方的長期合作，用 In any case（無論如何）。As a result（因此）會變成「因為漲價，所以我們重視合作」，因果不通；For example（例如）後面沒有舉例；Otherwise（否則）需要前面有條件，這裡沒有。")]),

 ("公告：大樓消防演習",
  "NOTICE TO ALL TENANTS\n\nThe annual fire drill for the Prescott Building will take place on Wednesday, April 15, at approximately 10:30 A.M. When the alarm sounds, all occupants must leave the building by the nearest stairway. Elevators will be ___[1]___ automatically and must not be used.\n\nOnce outside, please proceed to your assigned assembly area in the north parking lot. Floor wardens will check that everyone ___[2]___ accounted for before the all-clear signal is given. ___[3]___\n\nThe drill is required by city regulations and is designed to ensure that all occupants know how to respond in a real emergency. ___[4]___, we ask tenants to inform their visitors and clients of the drill in advance.",
  [(["disabled", "dismissed", "discarded", "displaced"], "p6-vocab",
    "後面說電梯「不得使用」，所以前面是電梯會被自動「停用」：will be disabled automatically。dismissed 用在人（解散、解僱）；discarded 是丟棄；displaced 是移位、使流離失所，都不適合描述演習時的電梯。"),
   (["has been", "have been", "being", "to be"], "p6-grammar",
    "that 子句需要一個完整的動詞，主詞 everyone 是單數，所以用 has been accounted for（都已清點到）。have been 是複數動詞，和 everyone 不一致；being 和 to be 都不是完整的動詞，that 子句會缺少動詞。"),
   (["The whole drill should take about twenty minutes.", "Employees on the ground floor may remain at their desks.", "Visitors must sign in at the security desk upon arrival.", "The north parking lot will be repaved later this spring."], "p6-insert",
    "句子插入題：前一句說到解除警報（all-clear signal）為止的流程，接著說明整個演習「大約二十分鐘」，是對流程的總結，最連貫。「一樓員工可以留在座位」和第一段 all occupants must leave 矛盾；訪客簽到和演習無關；停車場之後要重鋪是另一件事，放在這裡離題。"),
   (["To avoid confusion", "In contrast", "Even so", "Instead"], "p6-trans",
    "請房客事先告訴訪客和客戶有演習，目的是「避免混亂」，用 To avoid confusion（為了避免混淆）。In contrast（相對地）需要前後對比；Even so（即便如此）需要讓步關係；Instead（取而代之）表示替換，都和前一句「演習是法規要求、為了讓大家知道如何應變」接不起來。")]),

 ("廣告：辦公室植栽租賃",
  "Bring Your Workspace to Life with GreenLease\n\nStudies show that plants can reduce stress and improve concentration in the workplace. But keeping them healthy takes time that busy professionals simply do not have. That is ___[1]___ GreenLease comes in.\n\nFor a low monthly fee, our designers will select plants suited to the light and temperature conditions of your office. ___[2]___ Our technicians then visit every two weeks to water, trim, and fertilize each plant. If a plant ___[3]___ to thrive, we will replace it at no extra charge.\n\nGreenLease currently serves more than 400 businesses in the Denver area. ___[4]___, new clients who sign a twelve-month agreement before June 30 will receive their first month free. Call 555-0187 to schedule a free consultation.",
  [(["where", "which", "what", "whom"], "p6-grammar",
    "That is where … comes in 是固定說法，意思是「這就是某某派上用場的地方」，where 是關係副詞，後面接完整子句 GreenLease comes in。which、whom 是關係代名詞，後面子句要缺受詞或主詞，但 GreenLease comes in 已經完整；what 也一樣需要子句缺一個名詞，句子都不通。"),
   (["They will also deliver the plants and arrange them for you.", "Artificial plants are a popular low-cost alternative.", "You will need to water each plant twice a week.", "Most of our plants are grown in greenhouses abroad."], "p6-insert",
    "句子插入題：前一句說設計師幫你挑選植物，下一句用 then（接著）說技術人員每兩週來照顧，中間需要「送來並擺好」這個步驟，They 指設計師，最連貫。人造植物和這項租賃服務無關；「你要每週澆兩次水」和技術人員負責澆水矛盾；植物在國外溫室種植是離題資訊，也接不上 then。"),
   (["fails", "declines", "refuses", "neglects"], "p6-vocab",
    "fail to thrive＝長不好、無法存活，是描述植物（或生物）狀況的固定說法：如果植物長不好，免費換新。decline to 是「婉拒去做」，refuse to 是「拒絕去做」，都需要有意志的主詞；neglect to 是「疏忽沒做」，植物不會疏忽，三個都不合。"),
   (["What's more", "However", "Therefore", "Likewise"], "p6-trans",
    "前一句說服務超過 400 家企業（優點），這句再加一個好處：新客戶簽約一年免第一個月費用，是追加關係，用 What's more（而且、更棒的是）。However 表示轉折，但前後沒有對立；Therefore 表示因果，「服務很多家企業」不會導致「新客戶免一個月」；Likewise（同樣地）需要前後是相似的情況。")]),

 ("備忘錄：新的訪客登記程序",
  "MEMO\nTo: All Staff\nFrom: Gregory Okafor, Head of Security\nDate: February 16\nRe: New visitor procedure\n\nBeginning Monday, March 2, all visitors to our headquarters must be registered in advance through the VisitorPass system. Employees who are expecting a guest should enter the visitor's name, company, and expected arrival time no later than 5:00 P.M. on the previous business day. The system will then automatically ___[1]___ the guest an e-mail containing a QR code.\n\n___[2]___ Unregistered visitors will be asked to wait in the lobby until their host comes down to sign them in personally.\n\nThis change is part of a wider effort to improve building security. ___[3]___, it will allow reception staff to prepare badges ahead of time, reducing waiting times at the front desk. A short guide to VisitorPass ___[4]___ to this memo. Please direct any questions to the security office at extension 4120.",
  [(["send", "inform", "notify", "deliver"], "p6-vocab",
    "空格後面是 the guest（人）＋ an e-mail（物）兩個受詞，只有 send 可以這樣用：send someone something（寄給某人某物）。inform 和 notify 的用法是 inform/notify someone of something，不能直接接 an e-mail；deliver 一般說 deliver something to someone，不接兩個受詞。"),
   (["Guests will need to show this code at the reception desk upon arrival.", "Visitors will no longer be required to check in at reception.", "The lobby will be closed for repainting throughout March.", "Our headquarters first opened its doors to the public in 2011."], "p6-insert",
    "句子插入題：前一段結尾提到系統寄出含 QR code 的電子郵件，這句用 this code 接著說「訪客抵達時要在櫃台出示」，後面再說沒登記的訪客要在大廳等候，前後呼應。「訪客不用再到櫃台報到」和新程序矛盾；「大廳三月整修關閉」和「未登記訪客在大廳等候」矛盾；總部開幕年份和訪客程序無關。"),
   (["In addition", "Instead", "Otherwise", "Nonetheless"], "p6-trans",
    "前一句說這項改變能提升大樓安全，這句再說另一個好處（櫃台可以先準備好識別證、縮短等候時間），是追加關係，用 In addition（此外）。Instead（反而）表示取代；Otherwise（否則）表示相反條件；Nonetheless（儘管如此）表示讓步，前後都沒有對立。"),
   (["is attached", "attaches", "attaching", "has attached"], "p6-grammar",
    "主詞是 A short guide（指南），指南是「被附上」的，要用被動語態 is attached to this memo。attaches 和 has attached 是主動，會變成「指南附上了某物」，而且後面沒有受詞；attaching 不是完整的動詞，句子缺少動詞。")]),

 ("信件：標案結果通知",
  "Ridgeway Municipal Services\n410 Harlan Avenue\nRidgeway\n\nNovember 12\n\nMs. Priya Desai\nDesai Landscaping\n88 Orchard Lane\nRidgeway\n\nDear Ms. Desai,\n\nThank you for submitting a proposal to maintain the grounds of Ridgeway's public parks. We received eleven bids for this contract, and the selection committee reviewed each one ___[1]___.\n\nAfter much consideration, we have decided to award the contract to another company. Your proposal was well organized, and your references spoke highly of your work. ___[2]___, the committee felt that the winning bid offered a more detailed plan for reducing water use, which is a priority for the city this year.\n\n___[3]___ We will keep your company's information on file and would encourage you to bid on future projects. The next round of contracts, which ___[4]___ snow removal and street cleaning, will be announced in January.\n\nSincerely,\nThomas Reilly\nProcurement Officer",
  [(["carefully", "careful", "care", "cared"], "p6-grammar",
    "句子 the committee reviewed each one 已經完整，空格要修飾動詞 reviewed，用副詞 carefully（仔細地）。careful 是形容詞，不能修飾動詞；care 是名詞或動詞；cared 是過去式，放在句尾都不通。"),
   (["Nevertheless", "Therefore", "Likewise", "In other words"], "p6-trans",
    "前一句稱讚對方提案條理分明、推薦人評價很高，這句卻說委員會認為得標者的省水計畫更詳細，是「先肯定、再轉折」，用 Nevertheless（儘管如此）。Therefore（因此）會變成「因為你的提案很好，所以別人得標」，因果不通；Likewise（同樣地）需要相似的情況；In other words（換句話說）需要前後意思相同。"),
   (["We realize that this news is disappointing.", "Work will begin as soon as you sign the enclosed contract.", "Our parks department plans to hire three gardeners in spring.", "The committee will meet again next week to review the bids."], "p6-insert",
    "句子插入題：前面說明沒有得標的原因，這段開頭先表達體諒「我們知道這個消息令人失望」，再接「會保留貴公司資料、鼓勵參加之後的標案」，是落選通知信常見的順序。「簽約後就開工」和沒有得標矛盾；公園處要僱園丁和信件主旨無關；「委員會下週會再開會審標」和前面說已經決定得標廠商矛盾。"),
   (["cover", "retain", "pursue", "prevent"], "p6-vocab",
    "下一批合約「涵蓋」除雪和街道清潔：contracts, which cover snow removal and street cleaning。retain（保留）、pursue（追求）、prevent（防止）放進去都不通，尤其 prevent snow removal 會變成「阻止除雪」。")]),

 ("電子郵件：年度績效面談",
  "To: Daniel Ferreira\nFrom: Ingrid Solberg\nDate: June 1\nSubject: Annual performance review\n\nHi Daniel,\n\nIt is time once again for annual performance reviews. Before we meet, please complete the self-assessment form that HR ___[1]___ to all employees last week. In it, you will be asked to describe your main accomplishments over the past year and to identify areas where you would like to grow.\n\nI have tentatively scheduled your review for Thursday, June 11, at 2:00 P.M. If that time is inconvenient, let me know, and I will find another slot that works for ___[2]___. ___[3]___\n\nPlease bring any documents that you think support your self-assessment, such as client feedback or project reports. I look forward to a ___[4]___ conversation about your goals for the coming year.\n\nBest,\nIngrid",
  [(["sent", "sends", "will send", "has been sending"], "p6-grammar",
    "句尾有 last week（上週），表示過去已完成的動作，用過去式 sent。sends 是現在式；will send 是未來式，和「上週」矛盾；has been sending 是現在完成進行式，表示一直持續在寄，不能和 last week 這種明確的過去時間連用。"),
   (["both of us", "each other", "ourselves", "one another"], "p6-grammar",
    "找一個對「我們兩個人」都方便的時段：works for both of us。each other 和 one another 是「互相」，要用在雙方互相對彼此做某事的句子（例如 help each other），這裡沒有互相的動作；ourselves 是反身代名詞，主詞要是 we 才能用，這裡的主詞是 another slot。"),
   (["Please return your form to me before we meet.", "Since your review was so positive, we will not need to meet.", "HR has decided to discontinue annual reviews this year.", "Client feedback surveys will be sent out in September."], "p6-insert",
    "句子插入題：這段在安排面談時間，接著請對方「面談前把表格交給我」，連結了第一段的自評表和這段的面談日期，最連貫。「評價很好所以不用見面」和前面已經排好面談矛盾；「人資今年取消年度考核」和整封信的目的矛盾；九月寄客戶問卷和這次面談的安排無關。"),
   (["productive", "punctual", "tentative", "mandatory"], "p6-vocab",
    "期待一場「有成果的」對話：a productive conversation，是商務信件常見的結尾。punctual（準時的）用來形容人，不形容對話；tentative（暫定的）可以形容時間安排，不適合形容期待中的對話；mandatory（強制的）放在「我很期待」的句子裡語氣矛盾。")]),

 ("公告：自來水管線工程停水",
  "NOTICE OF WATER SERVICE INTERRUPTION\n\nThe Calloway Water Authority will be replacing aging pipes along Birch Street between 3rd and 7th Avenues. ___[1]___, water service to homes and businesses on these blocks will be shut off on Tuesday, July 21, from 9:00 A.M. to 4:00 P.M.\n\nResidents are advised to store enough drinking water for the day ___[2]___ the work begins. When service is restored, tap water may appear cloudy for a short time. This is caused by air in the pipes and is not harmful. ___[3]___\n\nWe apologize for the inconvenience and thank residents for their patience as we work to improve the ___[4]___ of the local water supply.",
  [(["As a result", "In contrast", "Even so", "For instance"], "p6-trans",
    "因為要更換舊水管（原因），所以這幾個街區會停水（結果），用 As a result（因此）。In contrast（相對地）需要對比；Even so（即便如此）表示讓步，會變成「雖然換水管，還是停水」；For instance（例如）後面要舉例，停水不是換水管的例子。"),
   (["before", "since", "unless", "whereas"], "p6-grammar",
    "居民應該在施工「開始之前」先儲水：before the work begins。since 表示「自從」或「因為」，「自從施工開始就儲水」不合理；unless（除非）、whereas（然而）的邏輯都不通。"),
   (["Running the tap briefly should clear it.", "To be safe, please boil all tap water for the next two weeks.", "Work on Birch Street was completed ahead of schedule last month.", "Bills for July will be mailed a week later than usual."], "p6-insert",
    "句子插入題：前兩句說恢復供水後水可能混濁、但無害，接著提供解決方法「讓水龍頭流一下就會變清」，it 指混濁的自來水，最連貫。「為了安全請煮沸兩週」和前一句「無害」矛盾；「施工上個月已提前完成」和這份停水預告矛盾；帳單延後寄送和停水說明無關。"),
   (["reliability", "reliance", "relief", "relevance"], "p6-vocab",
    "更換老舊水管是為了提升供水的「穩定可靠程度」：improve the reliability of the water supply。reliance（依賴）、relief（緩解、救濟）、relevance（關聯性）拼法相近，但放進去意思都不通。")]),
]

def S(title, time, passages, qs):
    return {"title": title, "time": time, "passages": passages,
            "qs": [{"q": q, "opts": o, "sk": sk, "ans": 0, "exp": e} for q, o, sk, e in qs]}

P7 = [
 S("單篇：會議室預約新規定", 120, [
  "CONFERENCE ROOM BOOKINGS — UPDATED RULES\n\nEffective Monday, May 4, all bookings for Conference Rooms A, B, and C must be made through the RoomFinder calendar instead of by e-mail to the front desk.\n\n• Rooms may be reserved up to 30 days in advance.\n• Bookings longer than three hours require approval from the office manager, Celia Navarro.\n• If a room is not occupied within 15 minutes of the start time, the booking will be released automatically.\n• Room C, which seats 40, is reserved for client meetings on Tuesdays and Thursdays.\n\nQuestions may be directed to Ms. Navarro at extension 3305."],
  [("What is the purpose of the notice?", ["To explain changes to a reservation process", "To announce the opening of new meeting rooms", "To introduce a new office manager", "To ask staff to tidy rooms after use"], "r-main",
    "公告開頭說 all bookings … must be made through the RoomFinder calendar instead of by e-mail，接著列出新的預約規則＝說明預約流程的改變。會議室 A、B、C 本來就有，不是新開的；Navarro 女士只是負責核准的人，沒說她是新上任；公告沒有提到使用後要整理。"),
   ("According to the notice, what will happen if a room is not used shortly after a booking begins?", ["It will become available to others", "The person who booked it will be charged a fee", "Ms. Navarro will be informed", "The booking will be moved to Room C"], "r-detail",
    "依據 If a room is not occupied within 15 minutes of the start time, the booking will be released automatically：預約自動取消、房間釋出給別人用。公告沒有提到罰款或通知 Navarro 女士（她負責的是超過三小時的預約）；Room C 是週二、週四留給客戶會議用，和取消預約無關。")]),

 S("單篇：外燴服務發票", 120, [
  "SAFFRON TABLE CATERING\n1220 Mercer Road, Portland\n\nINVOICE #C-2291\nDate: September 18\nClient: Lindqvist Architects (attn: Owen Pratt)\nEvent: Staff appreciation lunch, September 16\n\nDescription / Amount\nLunch buffet, 45 guests at $22.00 / $990.00\nVegetarian and gluten-free options / included\nBeverage station / $135.00\nServing staff (2 staff, 4 hours) / $240.00\nSubtotal / $1,365.00\nDeposit paid August 28 / -$300.00\nBalance due / $1,065.00\n\nPayment is due within 21 days of the invoice date. A late fee of 2% per month will be applied to overdue balances. Thank you for choosing Saffron Table!"],
  [("What is indicated about the event?", ["Special diets were provided for at no extra cost", "It was attended by twenty-two guests", "It took place on September 18", "Four serving staff worked at it"], "r-detail",
    "依據 Vegetarian and gluten-free options / included：素食和無麩質餐點包含在內、沒有另外收費。賓客是 45 位，22 是每人單價 $22.00；活動日是 9 月 16 日，9 月 18 日是發票日期；服務人員是 2 位、各 4 小時，不是 4 位。"),
   ("By what date should Lindqvist Architects pay to avoid a late fee?", ["October 9", "September 16", "September 18", "August 28"], "r-infer",
    "依據 Payment is due within 21 days of the invoice date，發票日期是 September 18，往後推 21 天＝10 月 9 日。9 月 16 日是活動日；9 月 18 日是發票日本身；8 月 28 日是已付訂金的日期。")]),

 S("單篇：自行車維修店廣告", 120, [
  "SPOKE AND GEAR BICYCLE WORKS\nNow open at 75 Canal Street!\n\nFrom flat tires to full rebuilds, our certified mechanics keep you riding. Most repairs are completed within 24 hours, and we never begin work without first giving you a written estimate.\n\nSeasonal Tune-Up Package — $59\nIncludes brake and gear adjustment, chain cleaning, and a safety inspection.\n\nCommuters: ask about our loaner bikes, available free of charge while your own bike is in the shop.\n\nOpening week special (April 7–12): bring this advertisement and receive a free bike lock with any repair over $40.\n\nHours: Tuesday–Sunday, 8 A.M.–7 P.M."],
  [("What is NOT mentioned about Spoke and Gear Bicycle Works?", ["It sells new bicycles", "It provides cost estimates in writing", "It lends bikes to some customers", "It has recently opened"], "r-not",
    "廣告只講維修服務，沒有提到販售新車＝沒提到。書面估價：we never begin work without first giving you a written estimate；借車：loaner bikes, available free of charge；剛開幕：Now open at 75 Canal Street。"),
   ("What is suggested about the business?", ["It opened recently", "It specializes in racing bicycles", "It does repairs only on weekends", "It charges extra for safety inspections"], "r-infer",
    "依據 Now open at 75 Canal Street! 和 Opening week special，可以推知這家店剛開幕。廣告說從補胎到整車翻修都做，沒有說專修競速車；營業時間是週二到週日，不只週末；安全檢查包含在 $59 的保養套餐中，不另外收費。")]),

 S("單篇：翻譯報價電子郵件", 180, [
  "To: Marisol Vega <mvega@brightharborpress.com>\nFrom: Tobias Lindgren <tlindgren@clearwordtranslation.com>\nDate: January 21\nSubject: Quote for catalog translation\n\nDear Ms. Vega,\n\nThank you for sending the files for your spring product catalog. Based on the word count of approximately 18,000 words, our fee for translating the catalog into French and German would be $6,840. This includes a second review by a native-speaking editor for each language.\n\nYou mentioned that the printer needs the final text by February 20. Our standard turnaround for a project of this size is four weeks, which would allow us to meet that deadline if we start by January 23. Should you need the work sooner, we can assign additional translators for a rush fee of 15 percent.\n\nPlease note that this quote does not cover the 40 product photographs with embedded text that you sent separately. Since the text in those images cannot be edited directly, we would need to price them separately once we have seen the original design files.\n\nIf you would like to proceed, simply reply to this e-mail, and I will send you a contract to sign.\n\nKind regards,\nTobias Lindgren\nClearword Translation Services"],
  [("Why did Mr. Lindgren write to Ms. Vega?", ["To provide a price estimate for a project", "To request payment for a finished translation", "To recommend a printing company", "To ask for more time to meet a deadline"], "r-main",
    "信件主旨是 Quote for catalog translation，內文說 our fee for translating the catalog … would be $6,840＝提供報價。翻譯還沒開始，所以不是請款；印刷廠是 Vega 女士那邊的，他沒有推薦；他說只要 1 月 23 日開始就能趕上期限，沒有要求延期。"),
   ("The word \"cover\" in paragraph 3, line 1, is closest in meaning to", ["include", "protect", "hide", "report on"], "r-syn",
    "this quote does not cover the 40 product photographs：報價「不包含」那 40 張照片，後面也說照片要另外報價，所以 cover＝include。protect（保護）、hide（遮蓋）、report on（報導）是 cover 在其他情境的意思，放在「報價範圍」的句子裡都不通。"),
   ("What is suggested about the product photographs?", ["More files are needed to price them", "They will be translated at no extra charge", "They will be removed from the catalog", "They contain errors that must be corrected"], "r-infer",
    "依據 we would need to price them separately once we have seen the original design files：要先看到原始設計檔才能報價，可推知 Vega 女士還需要提供更多檔案。信中說報價不包含照片、要另外計價，所以不是免費；沒有提到要刪掉照片或照片有錯誤。")]),

 S("單篇：工廠參訪行程表", 180, [
  "VISIT ITINERARY — Delegation from Hanwell Manufacturing\nHost: Ostrava Precision Components, Plant 2\nDate: Thursday, October 22\n\n8:45 A.M. Arrival and security check (Main Gate). Visitors must present photo identification.\n9:00 A.M. Welcome and company overview — Ludmila Novak, Plant Director (Room 104)\n9:45 A.M. Tour of machining and assembly lines — led by Kevin Ashworth, Production Manager. Safety glasses and ear protection will be provided.\n11:15 A.M. Quality control demonstration (Testing Lab)\n12:15 P.M. Lunch with department heads (Staff Cafeteria, private dining area)\n1:30 P.M. Discussion of supply agreement — Ms. Novak and Hanwell purchasing team (Room 104)\n3:00 P.M. Departure. Taxis to Ostrava Central Station will be arranged by the front desk.\n\nNote: Photography is not permitted on the production floor."],
  [("What is most likely the main reason for the visit?", ["To negotiate a business deal", "To interview candidates for a position", "To inspect a newly built factory", "To attend a training course on safety"], "r-infer",
    "行程的重點是下午的 Discussion of supply agreement（討論供應合約），而且參加的是 Hanwell 的採購團隊（purchasing team），可推知來訪是為了洽談合作。行程沒有面試；沒有說工廠是新蓋的；安全眼鏡和耳罩只是參觀產線時的裝備，不是安全訓練課程。"),
   ("What is NOT included in the itinerary?", ["A presentation on new product designs", "A meal with company staff", "A demonstration of testing procedures", "Help arranging transportation"], "r-not",
    "行程表沒有新產品設計的簡報＝沒有包含。和員工用餐：Lunch with department heads；測試流程示範：Quality control demonstration (Testing Lab)；協助安排交通：Taxis … will be arranged by the front desk。"),
   ("What are visitors asked to do when they arrive?", ["Show identification", "Put on safety glasses", "Sign a confidentiality form", "Meet the plant director at the gate"], "r-detail",
    "依據 8:45 A.M. Arrival and security check … Visitors must present photo identification：抵達時要出示附照片的證件。安全眼鏡是參觀產線時才發；行程沒有提到保密文件；廠長 Novak 女士是在 104 室致歡迎詞，不是在大門口見面。")]),

 S("單篇：美術館會員方案網頁", 180, [
  "www.calderamuseum.org/membership\n\nBECOME A MEMBER OF THE CALDERA MUSEUM OF ART\n\nIndividual — $65 per year\n• Free admission for one person\n• 10% discount at the Museum Shop\n• Invitations to exhibition previews\n\nDual — $110 per year\n• All Individual benefits for two adults living at the same address\n• Two guest passes per year\n\nPatron — $250 per year\n• All Dual benefits\n• Free parking in the museum garage\n• Reserved seating at evening lectures\n\nMemberships purchased online take effect immediately; your digital card will be e-mailed to you within one hour. Members who renew before their expiration date receive an extra month free. Please note that membership fees are non-refundable, and special exhibitions such as this winter's \"Light and Glass\" may require a separate timed ticket for all visitors, including members."],
  [("Which membership level includes free parking?", ["Patron", "Individual", "Dual", "All three levels"], "r-detail",
    "Free parking in the museum garage 只列在 Patron（$250）方案底下。Individual 和 Dual 都沒有停車優惠，所以也不是三種都有。"),
   ("What is NOT stated about memberships?", ["They can be paid for in monthly installments", "They can be used right after an online purchase", "They cannot be refunded", "They are extended when renewed early"], "r-not",
    "網頁的價格都是 per year（年費），沒有提到可以按月分期＝沒有說明。線上購買立即生效：take effect immediately；不能退費：membership fees are non-refundable；提早續約多送一個月：receive an extra month free。"),
   ("What is suggested about the \"Light and Glass\" exhibition?", ["Members may need to obtain a ticket to see it", "It is free for Patron members only", "It closed at the end of last winter", "It can be seen only during evening lectures"], "r-infer",
    "依據 special exhibitions such as this winter's \"Light and Glass\" may require a separate timed ticket for all visitors, including members：連會員都可能要另外取得限時段票券。文中說「所有參觀者包括會員」，沒有 Patron 免費的例外；是「今年冬天」的展覽，不是去年已結束；晚間講座是 Patron 的保留座位福利，和這個展無關。")]),

 S("單篇：設備維修申請表", 180, [
  "FACILITIES SERVICE REQUEST FORM\nRequest number: FS-6017\nSubmitted: Monday, March 9, 8:40 A.M.\nName: Hannah Okoye\nDepartment: Accounting\nLocation: 5th floor, Room 512\nExtension: 2248\nType of request: Heating/Cooling\nPriority requested: Medium\n\nDescription of problem:\nThe air-conditioning unit in Room 512 has been making a loud rattling noise since last Thursday, and the room is noticeably warmer than the rest of the floor. Six people work in this room, and we are preparing quarterly reports this week, so we would appreciate a quick response. Please note that the room will be empty on Wednesday afternoon if that is a convenient time for repairs.\n\nFOR FACILITIES USE ONLY\nAssigned to: R. Delgado\nScheduled: Wednesday, March 11, 1:30 P.M.\nNotes: Replacement fan motor ordered; arrival expected March 10."],
  [("Why did Ms. Okoye submit the form?", ["To report a problem with a cooling unit", "To request additional desks for her team", "To ask for a different office", "To complain about flickering lights"], "r-main",
    "申請類別是 Heating/Cooling，說明欄寫 The air-conditioning unit in Room 512 has been making a loud rattling noise … the room is noticeably warmer＝回報冷氣故障。她提到六個人在這間辦公，但沒有要求加桌子或換辦公室；表格沒有提到燈光問題。"),
   ("What is NOT indicated about Room 512?", ["It is located next to a meeting room", "It is used by six employees", "It is warmer than other rooms on the floor", "It is on the fifth floor"], "r-not",
    "表格沒有提到 512 室旁邊是會議室＝沒有說明。六個人使用：Six people work in this room；比較熱：noticeably warmer than the rest of the floor；在五樓：Location: 5th floor, Room 512。"),
   ("What is suggested about the repair?", ["It will be done while the room is empty", "It will be handled by an outside company", "It was completed last Thursday", "It has been given a high priority"], "r-infer",
    "Okoye 女士說 the room will be empty on Wednesday afternoon，設施部排定的時間是 Wednesday, March 11, 1:30 P.M.，正好是週三下午，可推知會在房間沒人時維修。負責人 R. Delgado 寫在「設施部專用」欄，看不出是外包；上週四是噪音開始的時間，不是修好的時間；她申請的優先等級是 Medium，不是 High。")]),

 S("單篇：文章（二手辦公家具）", 240, [
  "Second Life for Office Furniture\n\nBy Renata Coleman\n\nWhen companies relocate or downsize, their old desks and chairs often end up in landfills. Carlisle-based ReDesk is trying to change that. Founded four years ago by former interior designer Simone Achebe, the company collects used office furniture, repairs it, and resells it to businesses at about half the cost of new items. [1]\n\nThe idea came to Ms. Achebe while she was working on the redesign of a large law office. \"The client was throwing away more than 200 chairs that were in perfectly good condition,\" she recalled. \"Nobody had a plan for them.\" [2]\n\nReDesk now operates a 6,000-square-meter warehouse and employs 35 people, many of them skilled carpenters and upholsterers. Last year, the company kept an estimated 900 tons of furniture out of landfills. [3] Its clients range from small start-ups to a national bank, which recently furnished three regional offices entirely with ReDesk products.\n\nMs. Achebe admits that the business has faced obstacles. Supply is unpredictable, since it depends on when other firms decide to move, and some customers still assume that used furniture means lower quality. To address that concern, ReDesk now offers a five-year warranty on every item it sells. [4] \"Once people see the furniture in person, they usually change their minds,\" she said."],
  [("What is the article mainly about?", ["A business that restores and resells used furniture", "A law firm that moved into a new office", "A new method of manufacturing desks", "Rising prices of office furniture"], "r-main",
    "第一段說 ReDesk collects used office furniture, repairs it, and resells it，後面各段介紹這家公司的起源、規模和挑戰＝一家整修並轉售二手家具的公司。律師事務所只是創辦人想到點子的場合；ReDesk 是修理舊家具，不是新的製造方法；文章沒有談家具漲價。"),
   ("The word \"address\" in paragraph 4, line 3, is closest in meaning to", ["deal with", "send", "label", "lecture"], "r-syn",
    "To address that concern, ReDesk now offers a five-year warranty：為了「處理」顧客擔心品質的疑慮，提供五年保固，所以 address＝deal with。send（寄送，address a letter）、label（標上地址）、lecture（對…演說，address an audience）都是 address 在其他情境的意思，和 concern 搭配不通。"),
   (INS + "\n\"That moment convinced her to start a business of her own.\"", ["[2]", "[1]", "[3]", "[4]"], "r-insert",
    "這句的 That moment（那個時刻）需要前面先描述一個具體的時刻。[2] 前面正好是她在律師事務所看到兩百多張好椅子被丟掉、Nobody had a plan for them 的經歷，接著說這個時刻讓她決定創業，最連貫。[1] 前面講公司的營運方式、[3] 前面講去年的回收噸數、[4] 前面講保固，都沒有可以讓 That moment 指涉的事件。"),
   ("According to the article, why does ReDesk offer a warranty?", ["To reassure customers about quality", "To meet a legal requirement", "To compete with a national bank", "To attract skilled employees"], "r-detail",
    "依據 some customers still assume that used furniture means lower quality. To address that concern, ReDesk now offers a five-year warranty：保固是為了消除顧客對品質的疑慮。文中沒有提到法規要求；全國性銀行是 ReDesk 的客戶，不是競爭對手；技術工人是公司的員工，和保固無關。")]),

 S("單篇：服務中斷致歉電子郵件", 240, [
  "To: Benedikt Hoffmann <bhoffmann@hoffmannbakeries.com>\nFrom: Yuki Nakamura <ynakamura@stratuscloud.com>\nDate: November 5\nSubject: Service disruption on November 3\n\nDear Mr. Hoffmann,\n\nThank you for your message regarding the outage that affected your online ordering system on Tuesday, November 3. I understand that your customers were unable to place orders for nearly four hours during your busiest morning period, and I sincerely apologize. [1]\n\nOur engineers have identified the cause. A routine software update was installed on one of our servers without being properly tested, and it caused a conflict with several client applications, including yours. [2] We have since introduced an additional review step so that no update can be installed until it has been tested on a separate system.\n\nIn recognition of the disruption, we will credit your account with the equivalent of one full month of service. This credit will appear automatically on your December invoice. [3]\n\nI would also like to offer you a free consultation with one of our technical specialists, who can review your current setup and recommend ways to make it more resilient. [4] Please let me know a few dates that would suit you.\n\nSincerely,\nYuki Nakamura\nClient Relations Manager, Stratus Cloud Services"],
  [("What is the main purpose of the e-mail?", ["To respond to a complaint", "To announce a planned software update", "To request payment of an overdue invoice", "To introduce a new online ordering system"], "r-main",
    "開頭 Thank you for your message regarding the outage … I sincerely apologize，可知 Hoffmann 先生先來信反映服務中斷，這封是回覆並道歉＝回應客訴。軟體更新是造成中斷的原因，不是預告；信中是給對方帳戶補償（credit），不是催繳；線上訂購系統是 Hoffmann 先生原本就在用的，不是新系統。"),
   ("What has Stratus Cloud Services changed?", ["Its procedure for installing updates", "The price of its monthly service", "The servers it uses for bakeries", "Its customer support hours"], "r-detail",
    "依據 We have since introduced an additional review step so that no update can be installed until it has been tested on a separate system：新增審查步驟，更新要先在另一個系統測試才能安裝＝改變安裝更新的程序。一個月的補償是一次性的，沒有調整月費；沒有提到換伺服器或客服時間。"),
   ("The word \"resilient\" in paragraph 4, line 2, is closest in meaning to", ["dependable", "temporary", "affordable", "attractive"], "r-syn",
    "recommend ways to make it more resilient：在這次中斷事件的脈絡下，是讓系統設定「更耐得住問題、更可靠」，resilient＝dependable。temporary（暫時的）和「更耐得住問題」相反；affordable（便宜的）、attractive（吸引人的）都和防止中斷無關。"),
   (INS + "\n\"No further action is required on your part.\"", ["[3]", "[1]", "[2]", "[4]"], "r-insert",
    "[3] 前面說補償金額 will appear automatically on your December invoice（自動出現在帳單上），接著說「您不需要做任何事」最連貫。[4] 前面是提供免費諮詢，後面還請對方提供方便的日期，說「不需要做任何事」會矛盾；[1] 前面是道歉、[2] 前面是說明原因，都沒有需要對方採取行動的事項。")]),

 S("單篇：報導（老戲院變共享廚房）", 240, [
  "Old Theater Finds New Purpose as Shared Kitchen\n\nBRAMLEY (February 24) — The Rialto, a 1920s movie theater on Bramley's Main Street that had stood empty since 2019, will reopen next month as a shared commercial kitchen for small food businesses. [1]\n\nThe project is the work of Bramley Food Hub, a nonprofit organization that helps local cooks turn their recipes into businesses. Members will be able to rent fully equipped kitchen space by the hour, which spares them the expense of building their own facilities. [2] Rates will start at $18 an hour, with reduced rates for overnight bookings.\n\nRenovation costs of $1.2 million were covered by a state grant and donations from more than 300 residents. The building's original facade and ticket booth have been preserved, and the former lobby will serve as a small café where members can sell their products to the public. [3]\n\nAccording to director Farah Haddad, 27 businesses have already signed up, including bakers, caterers, and a company that produces hot sauce. \"Many of our members currently cook in their own homes, which limits how much they can sell,\" Ms. Haddad said. \"Here, they will have room to grow.\" [4] The hub will hold an open house on Saturday, March 14, from 10 A.M. to 3 P.M."],
  [("What is NOT mentioned about the Rialto building?", ["It will continue to show films on weekends", "Parts of its original design were kept", "It has been unused for several years", "Its renovation was partly funded by residents"], "r-not",
    "文章說戲院將改成共享廚房，沒有說週末還會放電影＝不符。保留原始設計：original facade and ticket booth have been preserved；閒置多年：had stood empty since 2019；居民出資：donations from more than 300 residents。"),
   ("The word \"spares\" in paragraph 2, line 3, is closest in meaning to", ["saves", "lends", "keeps in reserve", "forgives"], "r-syn",
    "which spares them the expense of building their own facilities：按時數租廚房「讓他們省下」自己蓋廚房的費用，spare someone something＝save someone something。lends（借出）不通；keeps in reserve（留作備用）是 spare 當形容詞「備用的」的意思；forgives（原諒、免除債務）語意不對。"),
   (INS + "\n\"The theater's old projectors, however, have been donated to a film museum.\"", ["[3]", "[1]", "[2]", "[4]"], "r-insert",
    "這句用 however 表示對比：[3] 前面說戲院的外牆和售票亭都被「保留」下來，接著說「不過舊放映機已捐給電影博物館」，保留和移走形成對比，最連貫。[1] 前面只說戲院要改成廚房，沒有「保留」可以對比；[2] 前面講會員租用廚房、[4] 前面講會員的成長空間，和放映機都接不上。"),
   ("What is suggested about many Food Hub members?", ["Their kitchens limit their sales", "They used to work at the Rialto theater", "They plan to open restaurants on Main Street", "They will be able to cook overnight for free"], "r-infer",
    "依據 Many of our members currently cook in their own homes, which limits how much they can sell：在家裡做菜限制了銷售量。文中沒有說他們以前在戲院工作或要在 Main Street 開餐廳；夜間租用是 reduced rates（降價），不是免費。")]),

 S("訊息：食材臨時缺貨", 120, [
  "Rosa Delgado [3:41 P.M.]\nMarco, the fish supplier just called. They can't deliver the salmon for tonight's private dinner.\n\nMarco Bellini [3:43 P.M.]\nThat's forty guests. Did they say why?\n\nRosa Delgado [3:44 P.M.]\nTheir truck broke down. They offered to send cod instead, at the same price, by five o'clock.\n\nMarco Bellini [3:46 P.M.]\nI can work with that. I'll adjust the sauce so it suits a milder fish.\n\nRosa Delgado [3:47 P.M.]\nGreat. Should I let the client know about the change?\n\nMarco Bellini [3:48 P.M.]\nYes, please. Ms. Fontaine chose the menu herself, so she'll want to hear about it."],
  [("What are the writers mainly discussing?", ["A change to a dinner menu", "The cost of a large fish order", "The repair of a delivery truck", "A request to add more guests"], "r-main",
    "供應商送不了鮭魚，改送鱈魚，主廚調整醬汁、還要通知客戶＝討論晚宴菜單的變更。鱈魚 at the same price，價錢不是重點；卡車故障是供應商的問題，他們沒有討論修車；forty guests 是原本的人數，沒有要加人。"),
   ("At 3:46 P.M., what does Mr. Bellini most likely mean when he writes, \"I can work with that\"?", ["He accepts the substitute ingredient", "He is available to work extra hours tonight", "He can help repair the truck", "He agrees to cook for more guests"], "r-intent",
    "意圖題：Delgado 女士說供應商改送鱈魚，Bellini 先生回 I can work with that，接著說會調整醬汁來搭配較清淡的魚＝接受替代食材。這裡的 work with 是「可以將就使用」，不是加班；修卡車和加客人都沒有人提出。")]),

 S("訊息：新聞稿法務審核", 180, [
  "Lena Park [11:02 A.M.]\nThe press release about the Orion headphones has to go to our media list by 3:00. Has legal approved the final text?\n\nOwen Kessler [11:05 A.M.]\nNot yet. They flagged the line about \"the longest battery life on the market.\"\n\nLena Park [11:06 A.M.]\nCan we back that claim up?\n\nOwen Kessler [11:08 A.M.]\nOnly against our own earlier models. We haven't tested any competitors' products.\n\nRachel Adeyemi [11:09 A.M.]\nThen let's change it to \"our longest battery life ever.\" That's accurate, and it still sounds strong.\n\nLena Park [11:10 A.M.]\nWorks for me. Owen, can you send the revised version back to legal right away?\n\nOwen Kessler [11:11 A.M.]\nOn it. I'll mark it urgent."],
  [("At 11:06 A.M., what does Ms. Park most likely mean when she writes, \"Can we back that claim up?\"", ["She wants to know whether a statement can be proven", "She is asking to return to an earlier draft", "She wants to save a copy of the document", "She is offering to support Mr. Kessler"], "r-intent",
    "意圖題：法務挑出「市面上電池續航最長」這句，Park 女士問 Can we back that claim up?，Kessler 先生回答只跟自家舊款比過、沒測過競爭對手＝她在問這個說法有沒有證據支持。back up 在這裡是「證實」，不是退回舊版、備份檔案或支持某人。"),
   ("Why did the legal team most likely object to a line in the press release?", ["It made a comparison that had not been verified", "It described a product that is not finished", "It contained an error in a product name", "It was too long for the media list"], "r-infer",
    "被挑出的是 the longest battery life on the market，而 Kessler 先生說 We haven't tested any competitors' products，可推知問題在於「和市面產品比較」這件事沒有經過驗證。對話沒有提到產品還沒完成、名稱拼錯或新聞稿太長。"),
   ("What will Mr. Kessler most likely do next?", ["Resend a revised text", "Test a competitor's headphones", "Contact members of the media", "Write a new product description"], "r-detail",
    "Park 女士請他 send the revised version back to legal right away，他回 On it. I'll mark it urgent＝把修改後的新聞稿送回法務核准。他們說沒測過競爭對手的產品，但沒有要去測；寄給媒體是 3 點前要做的事，現在還在等法務；修改的是一句話，不是重寫產品說明。")]),

 S("訊息：更換研習講師", 180, [
  "Grace Liang [8:30 A.M.]\nTom, Dr. Harlow just told me she can't lead our negotiation workshop on May 19. She has a conflict she can't move.\n\nTom Whitfield [8:32 A.M.]\nThat's a shame. Twenty-five people have already signed up.\n\nGrace Liang [8:33 A.M.]\nI know. She suggested a colleague of hers, Martin Oyelaran. He's taught the same course at two other firms.\n\nTom Whitfield [8:35 A.M.]\nDo we have any feedback on him?\n\nGrace Liang [8:36 A.M.]\nBoth firms rated his sessions highly. Could you reach out to him today and ask about his fee?\n\nTom Whitfield [8:37 A.M.]\nSay no more. I'll also ask whether he can keep the same date so that we don't have to notify everyone."],
  [("What are the writers mainly discussing?", ["Finding a replacement instructor", "Choosing a new date for a workshop", "Reducing the cost of a course", "Responding to complaints from staff"], "r-main",
    "Harlow 博士不能來上課，她推薦 Oyelaran 先生，兩人討論他的評價、費用和能不能維持原日期＝找替代講師。Whitfield 先生反而希望維持 5 月 19 日，不是要改日期；問講師費是為了了解，不是要降低成本；回饋是其他公司對講師的評價，不是員工抱怨。"),
   ("At 8:37 A.M., what does Mr. Whitfield most likely mean when he writes, \"Say no more\"?", ["He will gladly do what Ms. Liang asks", "He does not want to hear about Dr. Harlow", "He thinks the fee should not be discussed", "He prefers to talk about the matter in person"], "r-intent",
    "意圖題：Liang 女士請他今天聯絡 Oyelaran 先生、問費用，他回 Say no more，接著說還會順便問能不能維持同一天＝他很樂意照辦，不用再多說。這句不是不想聽、不是不談費用（他正要去問），也沒有要求當面討論。"),
   ("What is indicated about Mr. Oyelaran?", ["He has received positive ratings", "He has worked for Ms. Liang's company before", "He has already agreed to a fee", "He is available on May 19"], "r-detail",
    "依據 Both firms rated his sessions highly：他在另外兩家公司的課評價很好。他教過的是 two other firms，不是 Liang 女士的公司；費用和日期都是 Whitfield 先生接下來才要去問的，還不知道。")]),

 S("訊息：年度盤點人手", 120, [
  "Hector Ruiz [4:50 P.M.]\nNadia, the annual inventory count starts tomorrow at 6 A.M. Did we get enough volunteers for the early shift?\n\nNadia Petrova [4:52 P.M.]\nOnly four so far. We need at least seven to finish Aisles 1 through 12 before the delivery trucks arrive at 10.\n\nHector Ruiz [4:53 P.M.]\nWhat if we offered the early group a free lunch and an extra hour's pay?\n\nNadia Petrova [4:55 P.M.]\nNow you're talking. I'll post that on the staff board before the evening shift leaves.\n\nHector Ruiz [4:56 P.M.]\nGood. Let me know the final count by eight tonight."],
  [("At 4:55 P.M., what does Ms. Petrova most likely mean when she writes, \"Now you're talking\"?", ["She thinks the offer will attract more people", "She is glad that Mr. Ruiz finally called her", "She wants Mr. Ruiz to speak to the staff", "She disagrees with the plan for lunch"], "r-intent",
    "意圖題：Ruiz 先生提議給早班的人免費午餐和多一小時工資，Petrova 女士回 Now you're talking，接著說馬上貼到員工公告欄＝她認為這個條件能吸引更多人報名。這是「這就對了」的贊同語，不是說他終於打電話來，也不是要他對員工講話，更不是反對。"),
   ("What is suggested about the inventory count?", ["Part of it must be done before a delivery", "It is carried out every month", "It will begin in the evening", "It requires twelve volunteers"], "r-infer",
    "依據 We need at least seven to finish Aisles 1 through 12 before the delivery trucks arrive at 10：有一部分要在貨車十點抵達前完成。盤點是 annual（每年一次），不是每月；明天早上 6 點開始，不是晚上；需要至少七人，12 是走道的編號。")]),
]
