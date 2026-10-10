# L1 題目品質紀錄（2026-10-10）

- 題數：Part 2 25 題、Part 3 13 組 39 題、Part 4 10 組 30 題，共 94 題。資料：`content/L1.json`（產生腳本 `content/build_l1.py`）
- 選項長度（正解是最長／最短選項的次數）：Part 2 7／7（共 25 題）；Part 3/4 17／21（共 66 題，不含選項等長的 3 題圖表題）
- 盲解 1（繼承模型）：94/94 和答案鍵一致，沒有標記
- 盲解 2（sonnet）：94/94 和答案鍵一致，標記 1 題
  - P2-14：干擾項「Downstairs, right next to the elevators…」可能被解讀成選咖啡店。已改為「The elevator downstairs is out of order today.」，單題重新盲解（sonnet）為 C＝正解，沒有標記
- 使用者抽檢：10 題（亂數種子 20261010），2026-10-11 使用者回覆「OK」，通過
- 圖表改窄（每行 ≤34 字元，手機不用橫向捲動），內容不變
