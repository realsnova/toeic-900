# C1 練習題第 1 批品質紀錄（2026-10-11）

| 類型 | 題數 | 盲解 1（繼承模型） | 盲解 2（sonnet） |
|---|---:|---|---|
| Part 5 | 120 | 120/120 | 120/120 |
| Part 6 | 8 篇 32 題 | 102/102（含 Part 7） | 102/102（含 Part 7） |
| Part 7 | 20 組 70 題 | 同上 | 同上 |
| 聽力 Part 2 | 60 | 120/120（含 Part 3/4） | 120/120（含 Part 3/4） |
| 聽力 Part 3/4 | 20 組 60 題 | 同上 | 同上 |
| 單字 | 380 | 另一代理逐條檢查：3 條需修正 | — |

共 342 題、380 個單字。內容檢查 `tools/content/lint.mjs`：0 錯誤、0 警告（正解最長／最短比例：Part 6/7 約 30%／16%、Part 2 32%／33%、Part 3/4 30%／20%）。

## 標記與修正
- P5-017「Of the two venues … the more/most」：兩者比較用 more 在口語有爭議 → 改成三個場地、正解 most。
- P5-047 who/whom：判定題目正確（who 是 is 的主詞），詳解已說明插入語，保留。
- L2-053「out of the blue folders」只聽會像慣用語 → 改成 "we've run out of blue folders"。
- L34-04 盤點數字（缺 20 盞卻加訂 50）→ 改成加訂 30 盞「保險起見」。
- L34-12 布景題干擾項「存放在排練場」也可推得 → 換成「演出時損壞」；尺寸口語改成 "three metres by three metres"。
- P7-03 不符題的「週一公休」可由營業時間推得 → 換成「剛開幕」；開幕週優惠 4/6（週一公休）改成 4/7–12。
- P7-09 同義字 resilient 的干擾項 elastic 太接近 → 換成 temporary。
- P7-17 來函「clarify two points」後接三段 → 第三段改用 In addition。
- 單字：bulletin 例句改示範「快報」、duly 刪掉不常見的「按時」、heavy-duty 例句改「耐重貨架」；out of stock、venture 例句和其他單字重複 → 改寫。
- 以上修正的題目都重新盲解（sonnet）：19/19 正確、沒有標記。

## 使用者抽檢
- 抽檢表：[spot-check.md](spot-check.md)（17 題＋20 個單字）
- 結果：使用者選擇直接上線（2026-10-11），抽檢改為使用中回報
- 合併後的重複檢查：新 Part 5 第 "for the duration of" 題和 R1 的 "closed for repairs" 題幹太像 → 改成 "The east parking lot will remain unavailable ______ ..."（正解仍是 for）；lint 加入同樣的檢查。

## 語音轉寫比對（Whisper base.en，瀏覽器內執行）
- 範圍：`tools/audio/jobs/verify-C1.json`，140 段（80 段題目／對話／獨白＋60 段隨機選項）。
- 原始平均字元誤差 3.0%；扣掉格式差異（選項字母 "C." 被聽成 "See"、數字寫成阿拉伯數字、人名拼法）後約 1–2%。
- 兩段長對話（c2c12ba57 50 秒、c0cce72e1 44 秒）整段轉寫缺一截 → 分段重新轉寫，內容完整，是轉寫工具 30 秒分塊合併的問題，音檔沒有被截掉。
- 人名聽寫差異（Akiko、Ines、Fischer、Nakamura）：轉寫工具的限制，不影響作答。
- 需要人耳確認的 2 段（語速較快、轉寫有連音）：
  - r17222281 "B. The higher floors are quieter."（轉寫成 "the high of floors, a quieter"）
  - r9a95c702 "B. The commute is much easier."（轉寫成 "the commuter much easier"）
  - 已加進抽檢表；聽不清楚就換聲音重新產生。
