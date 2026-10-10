# v1.5.0 上線紀錄（2026-10-11）

- 使用者核准：2026-10-11「OK, deploy」（已試聽 5 段音檔）
- 上線前 `origin/master`：`a437476`（v1.4.1）。**回滾方式**：`git push --force-with-lease origin a437476:master`，需要使用者核准。
- 上線 commit：`3b3de45`（fast-forward 推到 master）；GitHub Pages 建置狀態 built
- 上線後驗證（https://realsnova.github.io/toeic-900/）：
  - `APP_VERSION` 1.5.0；腳本 `?v=23`，含 `audio/clips.js` 與 `js/audio.js`
  - 音檔索引 1,388 段，`AudioClips.complete` = true
  - L1 組卷 94 題；PART2 125 題、PART34 46 組
  - 抽 3 個音檔 HEAD 都是 200（`audio/mp3`）；實際播放一段：started，CSP 沒有阻擋
  - Firebase 已載入；主控台沒有錯誤
- 未驗證（需要使用者實機）：iPhone Safari 與 Android Chrome 的播放、背景切換
