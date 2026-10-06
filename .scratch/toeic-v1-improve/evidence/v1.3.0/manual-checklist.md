# v1.3.0 需要使用者執行的檢查

這些項目我沒辦法代勞：需要實體手機，或需要登入你的 Firebase 主控台。結果請直接告訴我，我會記錄到這個檔案。

## A. Firebase 規則（上線前必做，約 5 分鐘）

1. 開啟 [Firebase 主控台](https://console.firebase.google.com/) → 專案 `toeic-8a451` → Realtime Database → 「規則」分頁。
2. 先把目前的規則整段複製下來存檔（萬一要還原時使用）。
3. 貼上 repo 中 `firebase/database.rules.json` 的全部內容，按「發布」。
4. 在同一頁的「規則測試區」（Rules Playground）逐一執行下表，記下結果：

| 編號 | 模擬類型 | 位置 | 資料 | 預期 |
|---|---|---|---|---|
| T-SEC-01-1 | 讀取 | `/` | — | 拒絕 |
| T-SEC-01-1 | 讀取 | `/sync` | — | 拒絕 |
| T-SEC-01-2 | 設定 | `/other` | `{"a":1}` | 拒絕 |
| T-SEC-01-3 | 設定 | `/sync/ab3de-f7gh9` | `{"records":{"exam":"2026-12-01"},"updatedAt":1}` | 允許 |
| T-SEC-01-4 | 設定 | `/sync/AB3DE` | 同上 | 拒絕 |
| T-SEC-01-4 | 設定 | `/sync/-abcd` | 同上 | 拒絕 |
| T-SEC-01-5 | 設定 | `/sync/ab3de-f7gh9` | `{"records":{"exam":"x"},"updatedAt":1,"x":1}` | 拒絕 |
| T-SEC-01-5 | 設定 | `/sync/ab3de-f7gh9` | `{"updatedAt":1}` | 拒絕 |
| T-SEC-01-5 | 設定 | `/sync/ab3de-f7gh9` | `{"records":{"exam":"x"},"updatedAt":"1"}` | 拒絕 |

5. （T-SEC-01-7）新版上線後，用兩台裝置輸入同一組同步代碼，各做幾題，確認兩邊進度一致。

如果任何一項結果和預期不同，先把第 2 步存下的舊規則貼回去，再告訴我。

## B. 手機聽力（上線後做，約 10 分鐘）

| 編號 | 裝置 | 步驟 | 預期 |
|---|---|---|---|
| T-AUD-02-2 | iPhone Safari | 聽力 → Part 2 開始 10 題 | 有聲音 |
| T-AUD-02-2 | iPhone Safari | 聽力 → Part 3/4 任選一組 | 有聲音 |
| T-AUD-02-2 | iPhone Safari | 模擬考 → 只考聽力節 → ▶ 開始播放 | 第 1 題有聲音，之後的題目自動接續也有聲音 |
| T-AUD-02-3 | Android Chrome | 同上三項 | 同上 |
| T-AUD-04-2 | 任一手機 | 開啟 VoiceOver（iPhone）或 TalkBack（Android），進入聽力題 | 讀得出「語音：裝置合成，非真人錄音」 |

如果某一項沒有聲音：看畫面上有沒有出現「沒有聽到聲音？」提示，並告訴我是哪一台、哪一項。
