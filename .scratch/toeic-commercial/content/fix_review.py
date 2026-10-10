# v1.5.0 獨立審查的修正（2026-10-11）
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]

def edit(rel, pairs):
    p = ROOT / rel
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:70], s.count(a))
        s = s.replace(a, b)
    p.write_text(s, encoding="utf-8")

edit("js/app.js", [
# 1. L1 的成績紀錄在重新載入或同步後保留 mode
('if (typeof m.mode === "string" && (["full", "listen", "read"].includes(m.mode) || /^R\\d{1,2}$/.test(m.mode))) out.mode = m.mode;',
 'if (typeof m.mode === "string" && (["full", "listen", "read"].includes(m.mode) || /^[LR]\\d{1,2}$/.test(m.mode))) out.mode = m.mode;'),
# 2. 聽力測驗不重置閱讀模考的 3 天週期
("""  const dates = (S.mocks || []).filter(m => m && m.mode !== "listen")""",
 """  // 只考聽力（聽力節、完整聽力測驗）不算：這裡排的是閱讀模考
  const dates = (S.mocks || []).filter(m => m && m.mode !== "listen" && !isListenForm(formOf(m.mode)))"""),
# 小問題：今天做完聽力測驗，菜單的聽力項目顯示已完成
("""    !mockDue && nextForm(true)
      ? { label: `${nextForm(true).name}（約 ${nextForm(true).mins} 分鐘）`, detail: "照正式考試節奏連續播放，練專注力與題目預讀", done: false, tab: "mock", est: `${nextForm(true).mins} 分` }""",
 """    !mockDue && lfToday
      ? { label: formOf(lfToday.mode).name, detail: "今天已完成", done: true, tab: "mock", est: `${formOf(lfToday.mode).mins} 分` }
      : !mockDue && nextForm(true)
      ? { label: `${nextForm(true).name}（約 ${nextForm(true).mins} 分鐘）`, detail: "照正式考試節奏連續播放，練專注力與題目預讀", done: false, tab: "mock", est: `${nextForm(true).mins} 分` }"""),
("""  const mockDue = readDone > 0 || daysSinceMock() >= 3;""",
 """  const mockDue = readDone > 0 || daysSinceMock() >= 3;
  const lfToday = (S.mocks || []).find(m => m && m.date === todayStr() && isListenForm(formOf(m.mode)));"""),
# 4. iOS：第一段是音檔時，也在點擊當下解鎖語音合成，之後的備援語音才念得出來
("""    const onStart = () => { played = true; if (warned) hideSilentHelp(); };
    const clipRate = opts.clipRate || TTS.rate();""",
 """    const onStart = () => { played = true; if (warned) hideSilentHelp(); };
    const clipRate = opts.clipRate || TTS.rate();
    // iOS 只允許在點擊當下第一次發聲：第一段是音檔時，同步送出一段無聲的語音解鎖語音合成，
    // 否則之後音檔缺少或失敗時，改用的裝置語音會被擋下。每次開啟只需要一次。
    if (anyClip && TTS.ok && !TTS.unlocked) {
      TTS.unlocked = true;
      try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* 忽略 */ }
    }"""),
# 5. 只有「全部段落都有音檔」才略過裝置語音檢查
("""  // 內建題目都有預先產生的音檔，不需要裝置的英文語音
  if (AudioClips.ready ||""",
 """  // 內建題目全部都有預先產生的音檔時，不需要裝置的英文語音
  if (AudioClips.complete ||"""),
("""  if (!TTS.ok && !AudioClips.ready) {""", """  if (!TTS.ok && !AudioClips.complete) {"""),
("""  const src = parts ? audioSource(parts) : (AudioClips.ready ? "all" : "none");""",
 """  const src = parts ? audioSource(parts) : (AudioClips.complete ? "all" : AudioClips.ready ? "mixed" : "none");"""),
])

edit("js/audio.js", [
("""  accent: {},   // 鍵 -> "us" | "uk" | "n"（旁白）""",
 """  accent: {},   // 鍵 -> "us" | "uk" | "n"（旁白）
  complete: false, // 內建題目的所有段落都有音檔（建置工具記錄的總段數都在）"""),
("""  load(index) {
    AudioClips.accent = {};
    if (!index || typeof index !== "object") return;
    Object.keys(index).forEach(acc => (Array.isArray(index[acc]) ? index[acc] : []).forEach(k => { AudioClips.accent[k] = acc; }));
  },""",
 """  load(index, total) {
    AudioClips.accent = {};
    AudioClips.complete = false;
    if (!index || typeof index !== "object") return;
    Object.keys(index).forEach(acc => (Array.isArray(index[acc]) ? index[acc] : []).forEach(k => { AudioClips.accent[k] = acc; }));
    const n = Object.keys(AudioClips.accent).length;
    AudioClips.complete = Number.isInteger(total) && total > 0 && n >= total;
  },"""),
("""AudioClips.load(typeof AUDIO_CLIPS !== "undefined" ? AUDIO_CLIPS.keys : null);""",
 """AudioClips.load(typeof AUDIO_CLIPS !== "undefined" ? AUDIO_CLIPS.keys : null, typeof AUDIO_CLIPS !== "undefined" ? AUDIO_CLIPS.total : 0);"""),
])

# 3. 聽力測驗交卷或放棄時，不刪除閱讀測驗的作答進度
edit("js/mock.js", [
("""    if (formOf(Mock.s.mode)) Mock.clearProgress();""",
 """    if (formOf(Mock.s.mode) && !isListenForm(formOf(Mock.s.mode))) Mock.clearProgress(); // 聽力測驗沒有暫存，不可刪掉閱讀測驗的進度"""),
("""    if (formOf(s.mode)) Mock.clearProgress();""",
 """    if (formOf(s.mode) && !isListenForm(formOf(s.mode))) Mock.clearProgress();"""),
])

edit("tools/audio/build-jobs.mjs", [
("""    `const AUDIO_CLIPS = ${JSON.stringify({ engine: "kokoro-82m-v1.0 q8 (kokoro-js 1.2.1)", kbps: 40, keys })};\\n`;""",
 """    `const AUDIO_CLIPS = ${JSON.stringify({ engine: "kokoro-82m-v1.0 q8 (kokoro-js 1.2.1)", kbps: 40, total: clips.size, keys })};\\n`;"""),
])

edit("tests/v1.3.1-ai.test.mjs", [
("""  assert.match(app.run("APP_VERSION"), /^1\\.4\\.\\d+$/);""",
 """  assert.match(app.run("APP_VERSION"), /^1\\.5\\.\\d+$/);"""),
])
print("ok")
