# 06 P1 地基 v1.6.0：穩定 ID、內容分包、離線、CI、模組化

Type: task（大項，開工前拆成小票）
Status: planned
Phase: P1（11/02–11/29）
Blocked by: 05

設計見 spec §3.1、§3.7、§3.8。

## 內容

1. **補測試**：拆模組前，先補齊狀態轉換、排程、選題和模考的行為測試。
2. **穩定題目 ID**：
   - 題目加上 `id`；
   - 新增 `migrateToIds()`；
   - INV-13 取代 INV-07；
   - 舊備份可以匯入。
3. **內容分包**：`content/<pack>.json`、`content/manifest.json`，依需要載入。
4. **Service Worker**：
   - 外殼預先快取，內容和音檔用到時才快取；
   - 有新版時提示更新；
   - 準備緊急停用版本。
5. **模組化**：`app.js` 依職責拆成 ES 模組，每檔 ≤600 行，行為不變。
6. **開發工具**：`package.json`（只放開發依賴）、Playwright、axe-core。
7. **CI**：GitHub Actions 跑單元測試、內容 lint、E2E（Chromium＋WebKit）、axe、效能預算。
8. **版本**：`tools/stamp.mjs` 自動產生版本號和快取參數。
9. **錯誤紀錄**：本機循環紀錄，可以從設定頁匯出。
10. **Staging**：預覽站，加上發布清單和回滾流程。
11. **無障礙稽核**：鍵盤全流程、NVDA 實測、對比度、`prefers-reduced-motion`。

## 完成條件

- [ ] 用使用者真實的備份檔演練 ID 轉換：所有錯題、SRS 和紀錄都一一對應，零遺失。
- [ ] 中斷網路後重新開啟 App，可以練習已經快取的內容。
- [ ] CI 全綠是合併的必要條件。
- [ ] 首次載入傳輸 ≤300 KB。
- [ ] axe 沒有 critical 或 serious 問題。
