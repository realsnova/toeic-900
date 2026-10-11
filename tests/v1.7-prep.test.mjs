// v1.7.0 考前補強（2026-10-11 使用者要求）：單字與錯題不排到考試之後、錯題本用 FSRS 排重考日、15 分鐘診斷測驗
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));

test("PREP-1 考前：單字卡不排到考試之後（最晚考試前一天），間隔與記憶強度不變；考後照常", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(10)`);
  const card = { i: 30, e: 2.5, due: app.run("todayStr()"), n: 4, s: 40, d: 4, l: app.run("todayStr(-30)") };
  app.run(`S.vocab.alpha = ${JSON.stringify(card)}; vq = [{ w: "alpha" }]`);
  const iv = plain(app.run(`(() => { const iv = FSRS.preview(S.vocab.alpha, todayStr()); Object.keys(iv).forEach(r => { iv[r] = capDays(iv[r], todayStr()); }); return iv; })()`));
  assert.ok(iv.good <= 9 && iv.easy <= 9, JSON.stringify(iv));
  app.run(`rateCard({ w: "alpha" }, "good")`);
  const c = plain(app.run("S.vocab.alpha"));
  assert.equal(c.due, app.run("todayStr(9)"), "考試前一天");
  assert.ok(c.i > 9, "間隔照記憶曲線，只提前複習日");
  // 考試前一天（含）之後不再提前
  app.run(`S.exam = todayStr(1)`);
  app.run(`S.vocab.beta = ${JSON.stringify(card)}; vq = [{ w: "beta" }]; rateCard({ w: "beta" }, "good")`);
  assert.ok(app.run("S.vocab.beta.due") > app.run("todayStr(1)"));
});

test("PREP-3 錯題本用 FSRS 排重考日：答錯明天重考、跨天答對往後排；移出條件不變；到期的優先出題", () => {
  const app = loadApp();
  app.run(`S.exam = todayStr(60); wbMark("p5", 4, false)`);
  let e = plain(app.run(`S.wb.p5["p5-0004"]`));
  assert.equal(e.due, app.run("todayStr(1)"));
  assert.ok(e.s > 0 && e.d >= 1);
  assert.equal(app.run(`wbIsDue("p5", 4)`), false);
  assert.equal(app.run("wrongDueCount()"), 0);
  // 隔天答對：連對 1 次，重考日往後排
  app.run(`todayStr = ((orig) => (o = 0) => orig(o + 1))(todayStr)`);
  assert.equal(app.run(`wbIsDue("p5", 4)`), true);
  assert.equal(app.run("wrongDueCount()"), 1);
  app.run(`wbMark("p5", 4, true)`);
  e = plain(app.run(`S.wb.p5["p5-0004"]`));
  assert.equal(e.n, 1);
  assert.ok(e.due > app.run("todayStr(1)"), e.due);
  // 舊紀錄（沒有重考日）視為今天到期
  app.run(`S.wb.p5["p5-0008"] = { n: 0, last: null }`);
  assert.equal(app.run(`wbIsDue("p5", 8)`), true);
  // 練習輪：到期的錯題優先
  app.run(`for (let i = 20; i < 40; i++) S.wb.p5[recId("p5", i)] = { n: 0, last: null, due: todayStr(5) }`);
  const ids = plain(app.run(`drawRound("p5seen", PART5.length, 10, wbKeys("p5").map(Number), null, i => isFormItem("p5", i))`));
  assert.ok(ids.includes(8), "到期的錯題要排進來");
});

test("PREP-2 診斷測驗：Part 5 的 13 項、Part 2 的 5 項技能各 2 題，不用完整測驗的題；做完弱項馬上生效", () => {
  const app = loadApp();
  app.run(`switchTab = () => {}; withVoices = f => f();`);
  app.run("startDiag()");
  const d = plain(app.run("diag"));
  assert.equal(d.p5.length, 26);
  assert.equal(d.l2.length, 10);
  const sk = plain(app.run(`diag.p5.map(i => PART5[i].sk)`));
  assert.equal(new Set(sk).size, 13);
  assert.equal(app.run(`diag.p5.concat(diag.l2.map(i => -1)).filter(i => i >= 0 && isFormItem("p5", i)).length`), 0);
  // 模擬作答：關係詞全錯、其他全對
  app.run(`diag.p5.forEach(i => { const ok = PART5[i].sk !== "g-rel"; diagRecord("p5", i, ok); wbMark("p5", i, ok, { diag: true }); });
    diag.l2.forEach(i => { diagRecord("l2", i, true); wbMark("l2", i, true, { diag: true }); });
    diagFinish();`);
  assert.equal(app.run("S.diag.date"), app.run("todayStr()"));
  assert.deepEqual(plain(app.run(`S.diag.res["g-rel"]`)), [0, 2]);
  assert.deepEqual(plain(app.run(`weakSkills("p5")`)), ["g-rel"], "診斷 2 題就生效");
  assert.equal(app.run(`S.mastery["g-rel"].dg`), 1);
  // 重新載入後診斷結果與標記仍在
  const again = loadApp({ storage: { toeic900: app.run("JSON.stringify(S)") } });
  assert.deepEqual(plain(again.run(`weakSkills("p5")`)), ["g-rel"]);
  again.run("renderers.home(); renderers.stats()");
});

test("PREP-4 診斷結果三方合併：另一台重新診斷的較新結果不會被這台的舊結果蓋回", () => {
  const app = loadApp();
  const X = { date: "2026-10-11", res: { "p5-tense": [1, 2] } }, Y = { date: "2026-10-15", res: { "p5-tense": [2, 2] } };
  const out = app.run(`(() => { const b = sanitizeState(Object.assign(defaultState(), { diag: ${JSON.stringify(X)} }));
    const l = sanitizeState(Object.assign(defaultState(), { diag: ${JSON.stringify(X)}, updatedAt: 2 }));
    const r = sanitizeState(Object.assign(defaultState(), { diag: ${JSON.stringify(Y)}, updatedAt: 1 }));
    return JSON.stringify([Merge.records(b, l, r).diag, Merge.records(null, defaultState(), r).diag]); })()`);
  assert.deepEqual(JSON.parse(out), [Y, Y]);
});
