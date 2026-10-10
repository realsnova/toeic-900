# 01 語音引擎 spike：Kokoro-82M 能不能用

Type: prototype
Status: resolved（2026-10-11：使用者核准建議的聲音 af_heart、am_michael、bf_emma、bm_george，第二位說話者用 af_bella、am_fenrir、bf_isabella、bm_fable）
Phase: P0
Blocked by: —

## 要回答的問題

在本機 CPU 上用 Kokoro-82M 產生的英文語音，能不能當 TOEIC 聽力題的固定音檔？

## 做法（D-2 選 A，不安裝任何程式）

1. 用 `tools/audio/devserver.py` 啟動本機伺服器。它只用 Python 標準函式庫，只綁定 127.0.0.1，PUT 只能寫進 `audio/`。
2. 在內建瀏覽器窗格開啟 `tools/audio/generate.html`。頁面從 jsDelivr 載入 kokoro-js 1.2.1 和 lamejs 1.2.1，模型 `onnx-community/Kokoro-82M-v1.0-ONNX`（q8）會從 Hugging Face 下載到瀏覽器快取。
3. 確認授權：讀模型卡和 kokoro-js 的授權，記錄網址和版本。
4. 產生樣本（工作檔 `tools/audio/jobs/samples.json`）：
   - 8 個聲音各唸同一段含數字、時間、金額和人名的獨白；
   - 一段三人對話；
   - 一題 Part 2；
   - 兩種位元率的比較檔。
5. 量測產生速度。如果太慢，啟用跨來源隔離來使用多執行緒 WASM，或改用 WebGPU。
6. 在瀏覽器裡用 transformers.js 的 Whisper 把音檔轉回文字，和腳本比對。
7. 把樣本傳給使用者試聽。

## 完成條件

- [ ] 授權結論：可以或不可以，附上依據。
- [ ] 8 段樣本已經給使用者，使用者挑好 Part 2–4 要用的聲音（至少美式男女各 1、英式男女各 1）。
- [ ] 產生速度：全部 8 小時音訊預估要跑多久。
- [ ] 位元率選定。
- [ ] 轉寫比對的字詞錯誤率，以及需要讀音字典處理的字。
- [ ] 結論寫在本檔的 `## Answer`：採用 Kokoro，或改用備案（Azure F0 或 Piper）。

## 備註

- 使用者已在 D-2 同意，模型下載到瀏覽器快取，約 90 MB。
- 不使用 edge-tts（見 spec §3.3）。

## Answer（2026-10-10，待使用者挑聲音）

- **授權**：Kokoro-82M 權重為 Apache-2.0；模型卡寫明「可部署在正式環境」，訓練資料只用公有領域、寬鬆授權和大廠閉源 TTS 的合成音訊。來源：https://huggingface.co/hexgrad/Kokoro-82M（模型 SHA256 496dba11…，v1.0）。結論：可以產生音檔並在公開網站上散布；網站的內容權利聲明裡註明使用 Kokoro-82M。
- **可行性**：kokoro-js 1.2.1（q8，WASM）在內建瀏覽器窗格可以執行；模型第一次載入 30 秒。電腦沒有安裝任何程式。
- **聲音品質**（VOICES.md 的官方評等）：美式女聲 af_heart A、af_bella A-；美式男聲 am_michael、am_fenrir 都是 C+；英式女聲 bf_emma B-、bf_isabella C；英式男聲 bm_george、bm_fable 都是 C。男聲普遍較弱，由使用者試聽決定。
- **短句弱點**：官方說明 10–20 個 token 以下的短句品質較差。Part 2 的「(A)」這類標號不要單獨合成，要和回應句合成一句，例如「A. Through the expense portal…」。
- **速度**（單執行緒 WASM，沒有跨來源隔離）：每秒音訊約要 1.7–3 秒產生。P0 約 1.5 小時的音訊，預估要 3–4 小時；全部 8 小時的音訊預估要 15–20 小時。已經在 devserver 加上 COOP/COEP 來啟用多執行緒，下一輪量測。
- **大小**：40 kbps 每分鐘約 300 KB；32 kbps 約 235 KB；64 kbps 約 470 KB。
- **轉寫比對**（Whisper base.en，在瀏覽器裡執行）：8 個聲音的字詞錯誤率是 1.4–6.9%。差異全部是寫法不同（Harbor View／Harborview、Garage B／GarageB、6 P.M.／6PM）和人名 Okafor 的拼法；數字、時間、金額 100% 一致。比對程式要再把「合寫」和「分寫」視為相同。
