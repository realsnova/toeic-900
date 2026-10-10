// 在 Web Worker 裡執行 Kokoro：背景分頁的主執行緒計時器會被瀏覽器大幅節流，worker 不受影響
import { KokoroTTS } from "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
let tts = null;

self.onmessage = async e => {
  const { id, text, voice, speed } = e.data;
  try {
    if (!tts) tts = await KokoroTTS.from_pretrained(MODEL_ID, { dtype: "q8", device: "wasm" });
    const audio = await tts.generate(text, { voice, speed: speed || 1 });
    const pcm = audio.audio;
    self.postMessage({ id, pcm }, [pcm.buffer]);
  } catch (err) {
    self.postMessage({ id, error: String(err && err.message || err) });
  }
};
