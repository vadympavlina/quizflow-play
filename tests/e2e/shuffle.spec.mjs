// Перемішування варіантів у лайв-грі: правильна відповідь не «прилипає» до одного місця, колір і буква — за місцем на екрані
import { test, expect, seed } from "./fixtures.mjs";

const Q = (n) => Array.from({ length: n }, (_, i) => ({ type: "single", text: "Питання " + (i + 1), options: ["Перша", "Друга", "Третя", "Четверта"], correct: 2 }));
const room = (questions, shuffle = true) => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T",
  options: { shuffle }, questions, players: Object.fromEntries(["p1", "pA", "pB", "pC"].map(id => [id, { nickname: "x", active: true }])) });

test("правильна «третя» в усіх питаннях не стоїть на одному місці: підряд ніколи на тому самому, розподіл рівний", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room(Q(2)) } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(800);
  const r = await page.evaluate(async () => {
    const { optionOrderFor } = await import("/live/live-core.js");
    const qs = Array.from({ length: 12 }, () => ({ options: ["Перша", "Друга", "Третя", "Четверта"] }));
    const pos = [0, 0, 0, 0]; let repeats = 0, bad = 0, firstSlot = 0, total = 0, identity = 0;
    for (let p = 0; p < 300; p++) {
      let prev = null;
      for (let q = 0; q < qs.length; q++) {
        const o = optionOrderFor(qs, q, "pid" + p);
        if ([...o].sort().join() !== "0,1,2,3") bad++;
        if (o.join() === "0,1,2,3") identity++;
        const at = o.indexOf(2); pos[at]++; total++; if (at === 0) firstSlot++;
        if (prev && prev.indexOf(2) === at) repeats++;
        prev = o;
      }
    }
    // детермінованість: той самий учень бачить той самий порядок після перезавантаження
    const same = JSON.stringify(optionOrderFor(qs, 7, "abc")) === JSON.stringify(optionOrderFor(qs, 7, "abc"));
    return { pos, repeats, bad, total, same, identity };
  });
  expect(r.bad).toBe(0);
  expect(r.same).toBe(true);
  expect(r.repeats).toBe(0);                                  // жоден варіант не стоїть на тому самому місці у двох питаннях підряд
  for (const c of r.pos) expect(c / r.total).toBeGreaterThan(.2);   // кожне з 4 місць трапляється приблизно в чверті випадків
  for (const c of r.pos) expect(c / r.total).toBeLessThan(.3);
  expect(r.identity / r.total).toBeLessThan(.1);              // порядок «як у конструкторі» — лише випадково (1 із 24)
  expect(errors).toEqual([]);
});

test("закріплені варіанти («Усе вищеперелічене») лишаються на місці, решта перемішується", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room(Q(1)) } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(800);
  const r = await page.evaluate(async () => {
    const { optionOrderFor } = await import("/live/live-core.js");
    const qs = Array.from({ length: 10 }, () => ({ options: ["А", "Б", "В", "Усе вищеперелічене"] }));
    let pinnedMoved = 0, seen = new Set();
    for (let q = 0; q < qs.length; q++) { const o = optionOrderFor(qs, q, "z"); if (o[3] !== 3) pinnedMoved++; seen.add(o.slice(0, 3).join()); }
    return { pinnedMoved, kinds: seen.size };
  });
  expect(r.pinnedMoved).toBe(0);
  expect(r.kinds).toBeGreaterThan(2);
  expect(errors).toEqual([]);
});

test("екран учня: кольори й букви йдуть за місцем (А червона, Б жовта…), а не за варіантом; цифра й буква натискають кнопку на цьому місці", async ({ page, errors }) => {
  const q = Q(6);
  await seed(page, { rooms: { "12345678": room(q) } }, "");
  const seen = new Set();
  for (const pid of ["p1", "pA", "pB", "pC"]) {
    await page.goto(`/live/play-student?code=12345678&pid=${pid}&nickname=x`); await page.waitForTimeout(700);
    const info = await page.evaluate(() => [...document.querySelectorAll("#answers-grid .ans")].map(b => ({ cls: b.className.split(" ")[1], letter: b.querySelector(".letter").textContent, i: +b.dataset.i, txt: b.querySelector(".txt").textContent })));
    expect(info.map(x => x.cls)).toEqual(["a", "b", "c", "d"]);
    expect(info.map(x => x.letter)).toEqual(["A", "B", "C", "D"]);
    expect([...info.map(x => x.i)].sort()).toEqual([0, 1, 2, 3]);
    expect(info.every(x => x.txt === ["Перша", "Друга", "Третя", "Четверта"][x.i])).toBe(true);   // текст іде разом із варіантом
    seen.add(info.map(x => x.i).join());
  }
  expect(seen.size).toBeGreaterThan(1);                         // у різних учнів порядок різний
  // буква «C» вибирає кнопку на третьому місці, а відповідь пишеться номером варіанта
  await page.goto("/live/play-student?code=12345678&pid=pB&nickname=x"); await page.waitForTimeout(700);
  const third = await page.evaluate(() => +document.querySelectorAll("#answers-grid .ans")[2].dataset.i);
  await page.keyboard.press("c");
  await expect.poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem("mockdb") || "{}")?.rooms?.["12345678"]?.answers?.[0]?.pB?.value))).toBe(third);
  expect(errors).toEqual([]);
});
