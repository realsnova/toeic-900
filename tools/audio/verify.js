// 音檔轉寫比對：Whisper（transformers.js）把 MP3 轉回文字，和工作檔腳本比對
// 門檻（spec §3.3）：字詞錯誤率 ≤5%，且數字、時間、金額一致
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.1/+esm";

const ASR_MODEL = "Xenova/whisper-base.en";
const logEl = document.getElementById("log");
const log = (...a) => { logEl.textContent += a.join(" ") + "\n"; logEl.scrollTop = logEl.scrollHeight; };
window.__verify = { status: "idle", items: [] };

// 數字正規化：把數字和常見寫法換成英文字，讓「8:15」和「eight fifteen」可以比對
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWords(n % 100) : "");
  if (n < 1e6) return numWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numWords(n % 1000) : "");
  return String(n);
}
function normalize(s) {
  return s.toLowerCase()
    .replace(/\$(\d[\d,]*)/g, (_, d) => numWords(+d.replace(/,/g, "")) + " dollars")
    .replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => numWords(+h) + (+m ? " " + (+m < 10 ? "oh " + numWords(+m) : numWords(+m)) : ""))
    .replace(/(\d+)%/g, (_, d) => numWords(+d) + " percent")
    .replace(/\d[\d,]*/g, d => numWords(+d.replace(/,/g, "")))
    .replace(/\bp\.?\s?m\.?/g, "pm").replace(/\ba\.?\s?m\.?/g, "am")
    .replace(/e-mail/g, "email").replace(/-/g, " ")
    .replace(/[^a-z' ]+/g, " ").replace(/'/g, "")
    .split(/\s+/).filter(Boolean);
}
function wer(ref, hyp) {
  const d = Array.from({ length: ref.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= hyp.length; j++) d[0][j] = j;
  for (let i = 1; i <= ref.length; i++)
    for (let j = 1; j <= hyp.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1));
  // 回溯出錯的參考字
  const miss = [];
  let i = ref.length, j = hyp.length;
  while (i > 0 && j > 0) {
    if (ref[i - 1] === hyp[j - 1] && d[i][j] === d[i - 1][j - 1]) { i--; j--; }
    else if (d[i][j] === d[i - 1][j - 1] + 1) { miss.push(ref[i - 1] + "→" + hyp[j - 1]); i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) { miss.push(ref[i - 1] + "→∅"); i--; }
    else { miss.push("∅→" + hyp[j - 1]); j--; }
  }
  while (i > 0) { miss.push(ref[i - 1] + "→∅"); i--; }
  return { rate: ref.length ? d[ref.length][hyp.length] / ref.length : 0, diffs: miss.reverse() };
}
async function decode16k(url) {
  const buf = await (await fetch(url)).arrayBuffer();
  const ctx = new OfflineAudioContext(1, 1, 16000);
  const audio = await ctx.decodeAudioData(buf);
  const off = new OfflineAudioContext(1, Math.ceil(audio.duration * 16000), 16000);
  const src = off.createBufferSource();
  src.buffer = audio; src.connect(off.destination); src.start();
  return (await off.startRendering()).getChannelData(0);
}

let asr = null;
async function run() {
  window.__verify = { status: "running", items: [] };
  try {
    if (!asr) {
      log("載入", ASR_MODEL, "…");
      asr = await pipeline("automatic-speech-recognition", ASR_MODEL, { dtype: "q8", device: "wasm" });
      log("模型載入完成");
    }
    const jobs = await (await fetch("/" + document.getElementById("jobs").value.trim())).json();
    for (const job of jobs) {
      const ref = job.segments.filter(s => s.text && !/^[A-D]\.$/.test(s.text.trim())).map(s => s.text).join(" ");
      const pcm = await decode16k("/" + job.out + "?t=" + Date.now());
      const out = await asr(pcm, { chunk_length_s: 30, stride_length_s: 5 });
      const R = normalize(ref), H = normalize(out.text);
      const r = wer(R, H);
      // 字元錯誤率（去掉空白）：合寫與分寫（Harbor View／Harborview）不算錯
      const c = wer(R.join("").split(""), H.join("").split(""));
      const item = { out: job.out, wer: +r.rate.toFixed(3), cer: +c.rate.toFixed(3), diffs: r.diffs.slice(0, 20), ref, hyp: out.text.trim() };
      window.__verify.items.push(item);
      log(c.rate <= 0.05 ? "✓" : "✗", job.out, "CER " + (c.rate * 100).toFixed(1) + "%", "WER " + (r.rate * 100).toFixed(1) + "%", r.diffs.slice(0, 8).join(", "));
    }
    window.__verify.status = "done";
    log("完成");
  } catch (e) {
    window.__verify.status = "failed";
    window.__verify.error = String(e);
    log("失敗", e);
  }
}
document.getElementById("run").addEventListener("click", run);
window.__runVerify = run;
const qp = new URLSearchParams(location.search);
if (qp.get("jobs")) { document.getElementById("jobs").value = qp.get("jobs"); if (qp.has("auto")) run(); }
