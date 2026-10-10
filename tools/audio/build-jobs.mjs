// 產生音檔工作檔，並更新 audio/clips.js（App 用來判斷哪些段落有音檔）
// 只用 Node 內建模組，不需要安裝任何套件（D-2）。
//
// 用法（在 worktree 根目錄）：
//   node tools/audio/build-jobs.mjs            列出缺少的音檔，切成 4 份工作檔 tools/audio/jobs/todo-1..4.json
//   node tools/audio/build-jobs.mjs --split 6  切成 6 份
//   node tools/audio/build-jobs.mjs --index    只重寫 audio/clips.js（掃描 audio/v1/ 已有的檔案）
//   node tools/audio/build-jobs.mjs --keys     只輸出所有段落的鍵（測試用）
//
// 聲音分配（使用者 2026-10-10 核准）：美式 W af_heart、M am_michael、W2 af_bella、M2 am_fenrir；
// 英式 W bf_emma、M bm_george、W2 bf_isabella、M2 bm_fable；旁白 am_michael。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "audio", "v1");
const JOB_DIR = path.join(ROOT, "tools", "audio", "jobs");
const VOICES = {
  us: { W: "af_heart", M: "am_michael", W2: "af_bella", M2: "am_fenrir" },
  uk: { W: "bf_emma", M: "bm_george", W2: "bf_isabella", M2: "bm_fable" }
};
const NARRATOR = "am_michael";
const TURN_PAUSE = 0.45;
// Kokoro 一次最多處理約 510 個音素，超過的部分會被直接丟掉（2026-10-11 抽查發現 Part 4 獨白全部被截尾）。
// 長的段落依句子切成 ≤220 字元的片段分別合成，片段之間停 0.18 秒。
const CHUNK_MAX = 220, CHUNK_PAUSE = 0.18;
function chunks(text) {
  if (text.length <= CHUNK_MAX) return [text];
  const sentences = text.split(/(?<=[.!?])\s+(?=["'A-Z0-9])/);
  const out = [];
  for (const s of sentences) {
    if (out.length && (out[out.length - 1] + " " + s).length <= CHUNK_MAX) out[out.length - 1] += " " + s;
    else out.push(s);
  }
  return out;
}
const say = (voice, text) => chunks(text).flatMap((t, i) => (i ? [{ pause: CHUNK_PAUSE }] : []).concat([{ voice, text: t }]));

const ctx = {};
vm.createContext(ctx);
for (const f of ["js/data/listening.js", "js/audio.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
const { PART2, PART34, ClipKey, ListenScript, fnv1a } = vm.runInContext("({ PART2, PART34, ClipKey, ListenScript, fnv1a })", ctx);

// 沒有標註腔調的舊題：用內容雜湊決定，結果固定、不受題目順序影響
const bit = (text, n) => (parseInt(fnv1a(text), 16) >>> n) & 1;
const accOf = (item, text) => item.acc || (bit(text, 0) ? "uk" : "us");

const clips = new Map(); // key -> { acc, segments }
const add = (key, acc, segments) => {
  const prev = clips.get(key);
  if (prev && JSON.stringify(prev.segments) !== JSON.stringify(segments)) {
    // 同一段文字在不同題目裡被分配到不同聲音：保留第一個（內容相同，音檔共用）
    return;
  }
  clips.set(key, { acc, segments });
};

// Part 2：問句一段；每個回應各產生 A/B/C 三個版本（標號和句子一起念，避免短句念錯）
PART2.forEach(item => {
  const acc = accOf(item, item.q);
  const asker = bit(item.q, 1) ? "W" : "M";
  const replier = asker === "W" ? "M" : "W";
  add(ClipKey.q(item.q), acc, [{ voice: VOICES[acc][asker], text: item.q }]);
  item.opts.forEach(o => ["A", "B", "C"].forEach(L =>
    add(ClipKey.r(L, o), acc, [{ voice: VOICES[acc][replier], text: `${L}. ${o}` }])));
});

// Part 3/4：整段一個檔案
PART34.forEach(set => {
  const sig = set.turns.map(t => t.t).join(" ");
  const acc = accOf(set, sig);
  const narratorGender = set.ng || (bit(sig, 1) ? "W" : "M");
  const segs = [];
  set.turns.forEach((t, i) => {
    if (i) segs.push({ pause: TURN_PAUSE });
    const g = t.s === "N" ? narratorGender : t.s;
    segs.push(...say(VOICES[acc][g], t.t));
  });
  add(ClipKey.c(set.turns), acc, segs);
});

// 完整聽力測驗的旁白：各 Part 說明、題組開場、念題目（題號照正式考試：Part 2 從 7 開始）
const forms = [...new Set([...PART2, ...PART34].map(x => x.form).filter(Boolean))];
forms.forEach(form => {
  let num = 7;
  const p2 = PART2.filter(x => x.form === form);
  if (p2.length) add(ClipKey.n(ListenScript.directions["Part 2"]), "n", say(NARRATOR, ListenScript.directions["Part 2"]));
  num += p2.length;
  let lastPart = null;
  PART34.filter(x => x.form === form).forEach(set => {
    if (set.type !== lastPart) {
      const d = ListenScript.directions[set.type];
      add(ClipKey.n(d), "n", say(NARRATOR, d));
      lastPart = set.type;
    }
    const intro = ListenScript.setIntro(set, num, num + set.qs.length - 1);
    add(ClipKey.n(intro), "n", [{ voice: NARRATOR, text: intro }]);
    set.qs.forEach(q => {
      const t = ListenScript.question(num++, q.q);
      add(ClipKey.n(t), "n", [{ voice: NARRATOR, text: t }]);
    });
  });
});

if (process.argv.includes("--redo-long")) {
  let n = 0;
  for (const [k, c] of clips) {
    if (c.segments.some(x => x.pause === CHUNK_PAUSE)) {
      const f = path.join(OUT_DIR, k + ".mp3");
      if (fs.existsSync(f)) { fs.unlinkSync(f); n++; }
    }
  }
  console.log(`刪除 ${n} 個含長段落的舊音檔，重新產生`);
}
const have = new Set(fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)) : []);

function writeIndex() {
  const keys = { us: [], uk: [], n: [] };
  for (const [k, c] of clips) if (have.has(k)) keys[c.acc].push(k);
  Object.values(keys).forEach(a => a.sort());
  const body = `// 自動產生：node tools/audio/build-jobs.mjs --index。列出 audio/v1/ 已有的音檔（依腔調分組），沒列出的段落改用裝置語音。\n` +
    `const AUDIO_CLIPS = ${JSON.stringify({ engine: "kokoro-82m-v1.0 q8 (kokoro-js 1.2.1)", kbps: 40, total: clips.size, keys })};\n`;
  fs.writeFileSync(path.join(ROOT, "audio", "clips.js"), body);
  const n = keys.us.length + keys.uk.length + keys.n.length;
  console.log(`audio/clips.js：${n} / ${clips.size} 段有音檔`);
}

// --verify <檔名>：輸出抽查用的工作檔（全部 Part 3/4 對話與旁白，加上隨機 80 段 Part 2），給 verify.html 轉寫比對
if (process.argv.includes("--verify")) {
  const out = process.argv[process.argv.indexOf("--verify") + 1] || "tools/audio/jobs/verify.json";
  const all = [...clips].map(([k, c]) => ({ out: `audio/v1/${k}.mp3`, key: k, segments: c.segments }));
  const p2 = all.filter(j => /^[qr]/.test(j.key)).sort(() => Math.random() - 0.5).slice(0, 80);
  const rest = all.filter(j => /^[cn]/.test(j.key));
  fs.writeFileSync(path.join(ROOT, out), JSON.stringify(rest.concat(p2)));
  console.log(`抽查工作檔 ${out}：${rest.length + p2.length} 段`);
  process.exit(0);
}
// --keys：只輸出所有段落的鍵（JSON），測試用來確認 App 和建置工具算出的鍵一致
if (process.argv.includes("--keys")) {
  process.stdout.write(JSON.stringify([...clips.keys()]));
  process.exit(0);
}
fs.mkdirSync(OUT_DIR, { recursive: true });
if (process.argv.includes("--index")) {
  writeIndex();
} else {
  const split = Number(process.argv[process.argv.indexOf("--split") + 1]) || 4;
  const todo = [...clips].filter(([k]) => !have.has(k))
    .map(([k, c]) => ({ out: `audio/v1/${k}.mp3`, key: k, segments: c.segments }));
  // 依字數平均分配到各份工作檔（長的對話先分）
  const size = j => j.segments.reduce((s, x) => s + (x.text ? x.text.length : 0), 0);
  todo.sort((a, b) => size(b) - size(a));
  const buckets = Array.from({ length: split }, () => ({ jobs: [], chars: 0 }));
  todo.forEach(j => { const b = buckets.reduce((m, x) => x.chars < m.chars ? x : m); b.jobs.push(j); b.chars += size(j); });
  fs.mkdirSync(JOB_DIR, { recursive: true });
  buckets.forEach((b, i) => fs.writeFileSync(path.join(JOB_DIR, `todo-${i + 1}.json`), JSON.stringify(b.jobs)));
  const chars = todo.reduce((s, j) => s + size(j), 0);
  console.log(`共 ${clips.size} 段；已有 ${have.size}；待產生 ${todo.length} 段、約 ${chars} 字（約 ${Math.round(chars / 1000)} 分鐘音訊），分成 ${split} 份`);
  writeIndex();
}
