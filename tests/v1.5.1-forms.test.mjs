// v1.5.1：完整聽力測驗第 2 回（L2）；每一回聽力測驗都要符合正式考試的配置，且音檔鍵和建置工具一致
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { loadApp } from "./helpers/load-app.mjs";

const plain = v => JSON.parse(JSON.stringify(v));
const ROOT = path.resolve(import.meta.dirname, "..");

test("FORMS-listen 每一回聽力測驗：Part 2 25 題、Part 3 13 組、Part 4 10 組，題號 7–100，圖表與新制題型齊全", () => {
  const app = loadApp();
  const ids = plain(app.run(`FORMS.filter(isListenForm).map(f => f.id)`));
  assert.deepEqual(ids, ["L1", "L2"]);
  for (const id of ids) {
    const p2 = plain(app.run(`PART2.filter(q => q.form === "${id}")`));
    const sets = plain(app.run(`PART34.filter(s => s.form === "${id}")`));
    const p3 = sets.filter(s => s.type === "Part 3"), p4 = sets.filter(s => s.type === "Part 4");
    assert.equal(p2.length, 25, id);
    assert.equal(p3.length, 13, id);
    assert.equal(p4.length, 10, id);
    assert.deepEqual(p3.map(s => !!s.graphic), [...Array(10).fill(false), true, true, true], id);
    assert.deepEqual(p4.map(s => !!s.graphic), [...Array(8).fill(false), true, true], id);
    assert.ok(p3.filter(s => s.turns.some(t => t.s === "M2" || t.s === "W2")).length >= 2, id);
    const intent = list => list.flatMap(s => s.qs).filter(q => /^(Why does the (wo)?man say|What does the (wo)?man imply|Why does the speaker say)/.test(q.q)).length;
    assert.ok(intent(p3) >= 2 && intent(p4) >= 2, `${id} 意圖題不足`);
    sets.forEach(s => { if (s.graphic) assert.ok(s.graphic.split("\n").every(l => l.length <= 34), `${id} ${s.title} 圖表太寬`); });
    const paper = plain(app.run(`Mock.buildFormPaper("${id}")`));
    assert.deepEqual(paper.listening.map(x => x.num), Array.from({ length: 94 }, (_, i) => i + 7), id);
  }
  // 各回的情境不重複（標題不同）
  const titles = plain(app.run(`PART34.map(s => s.title)`));
  assert.equal(new Set(titles).size, titles.length, "Part 3/4 題組標題重複");
  const qs = plain(app.run(`PART2.map(q => q.q.toLowerCase())`));
  assert.equal(new Set(qs).size, qs.length, "Part 2 問句重複");
});

test("FORMS-keys 所有聽力測驗的旁白與題目音檔鍵，建置工具都會產生", () => {
  const built = new Set(JSON.parse(execFileSync(process.execPath, [path.join(ROOT, "tools/audio/build-jobs.mjs"), "--keys"], { encoding: "utf8" })));
  const app = loadApp();
  const keys = plain(app.run(`FORMS.filter(isListenForm).flatMap(f => Mock.buildFormPaper(f.id).listening.flatMap(x =>
    [...(x.pre || []), ...(x.ask ? [x.ask] : []), ...(x.type === "l2" ? l2Audio(x.ref, x.order) : l34Audio(x.set))].map(p => p.clip)))`));
  assert.deepEqual(keys.filter(k => !built.has(k)), []);
});

test("FORMS-reserve 第 2 回的題目也不出現在一般練習", () => {
  const app = loadApp();
  const form = new Set(plain(app.run(`PART2.map((q, i) => q.form ? i : -1).filter(i => i >= 0)`)));
  for (let r = 0; r < 15; r++) {
    app.run("startL2(); TTS.stop()");
    plain(app.run("l2s.ids")).forEach(i => assert.equal(form.has(i), false, `練習抽到完整測驗的題目 ${i}`));
  }
  assert.equal(app.run(`nextForm(true).id`), "L1");
  app.run(`S.mocks = [{ date: todayStr(-5), mode: "L1", lR: 60, lT: 94, rR: 0, rT: 0 }]`);
  assert.equal(app.run(`nextForm(true).id`), "L2", "做完第 1 回後菜單改排第 2 回");
});
