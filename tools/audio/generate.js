// 在瀏覽器裡產生音檔：kokoro-js（Kokoro-82M ONNX，跑在 Web Worker）→ Float32 → lamejs MP3 → PUT 到本機 devserver.py
// 工作檔格式：[{ out: "audio/...mp3", kbps?, speed?: 1, segments: [{ voice, text } | { pause: 秒 }] }]
// 網址參數：?jobs=a.json,b.json&workers=4&auto
//   workers：同時跑幾個 worker（每個各載入一份模型，約 300 MB 記憶體）；auto：開頁後自動開始

const SR = 24000;
const logEl = document.getElementById("log");
const log = (...a) => { logEl.textContent += a.join(" ") + "\n"; logEl.scrollTop = logEl.scrollHeight; };
window.__results = { status: "idle", items: [], errors: [] };

// 一個 worker 一次只處理一段文字
function makeWorker() {
  const w = new Worker(new URL("tts-worker.js", import.meta.url), { type: "module" });
  let seq = 0;
  const waiting = new Map();
  w.onmessage = e => { const cb = waiting.get(e.data.id); waiting.delete(e.data.id); if (cb) cb(e.data); };
  w.onerror = e => { for (const cb of waiting.values()) cb({ error: "worker error: " + (e.message || e) }); waiting.clear(); };
  return {
    say(text, voice, speed) {
      return new Promise((res, rej) => {
        const id = ++seq;
        waiting.set(id, d => d.error ? rej(new Error(d.error)) : res(d.pcm));
        w.postMessage({ id, text, voice, speed });
      });
    }
  };
}

function concat(parts) {
  const n = parts.reduce((s, p) => s + p.length, 0);
  const out = new Float32Array(n);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

function encodeMp3(f32, kbps) {
  const enc = new lamejs.Mp3Encoder(1, SR, kbps);
  const pcm = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const chunks = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const buf = enc.encodeBuffer(pcm.subarray(i, i + 1152));
    if (buf.length) chunks.push(buf);
  }
  const end = enc.flush();
  if (end.length) chunks.push(end);
  return new Blob(chunks, { type: "audio/mpeg" });
}

async function put(path, blob) {
  const r = await fetch("/__out/" + path, { method: "PUT", body: blob });
  if (!r.ok) throw new Error("PUT " + path + " → " + r.status);
}

async function runJob(worker, job, kbps) {
  const parts = [];
  let t = 0;
  const t0 = performance.now();
  for (const seg of job.segments) {
    if (seg.pause) { parts.push(new Float32Array(Math.round(seg.pause * SR))); t += seg.pause; continue; }
    const pcm = await worker.say(seg.text, seg.voice, seg.speed || job.speed || 1);
    parts.push(pcm);
    t += pcm.length / SR;
  }
  const blob = encodeMp3(concat(parts), kbps);
  await put(job.out, blob);
  return { out: job.out, seconds: +t.toFixed(2), bytes: blob.size, genSec: +((performance.now() - t0) / 1000).toFixed(1) };
}

async function run() {
  const files = document.getElementById("jobs").value.split(",").map(s => s.trim()).filter(Boolean);
  const kbps = +document.getElementById("kbps").value;
  const nWorkers = Math.max(1, Math.min(8, +(new URLSearchParams(location.search).get("workers") || 1)));
  window.__results = { status: "running", items: [], errors: [], started: Date.now() };
  try {
    const queue = [];
    for (const f of files) queue.push(...await (await fetch("/" + f)).json());
    const total = queue.length;
    log(`共 ${total} 段，${nWorkers} 個 worker`);
    const lane = async n => {
      const w = makeWorker();
      while (queue.length) {
        const job = queue.shift();
        try {
          const r = await runJob(w, job, job.kbps || kbps);
          window.__results.items.push(r);
          log(`✓ [${n}] ${window.__results.items.length}/${total}`, r.out, r.seconds + "s", "產生 " + r.genSec + "s");
        } catch (e) {
          window.__results.errors.push({ out: job.out, error: String(e) });
          log("✗", job.out, e);
        }
      }
    };
    await Promise.all(Array.from({ length: nWorkers }, (_, i) => lane(i + 1)));
    window.__results.status = "done";
    log("完成");
  } catch (e) {
    window.__results.status = "failed";
    window.__results.errors.push({ error: String(e) });
    log("失敗", e);
  }
}

document.getElementById("run").addEventListener("click", run);
window.__run = run;
const qp = new URLSearchParams(location.search);
if (qp.get("jobs")) {
  document.getElementById("jobs").value = qp.get("jobs");
  if (qp.has("auto")) run();
}
