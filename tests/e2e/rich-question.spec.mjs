// Форматування питання з конструктора (жирний, колір) має бути видно на екрані гри
import { test, expect, seed } from "./fixtures.mjs";

const room = text => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T",
  questions: [{ type: "single", text, options: ["A", "B"], correct: 0 }], players: { p1: { nickname: "x", active: true } } });

test("жирне відрізняється від звичайного тексту, темний колір отримує світлу плашку", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room('Яка <b>найбільша</b> планета? <span style="color:#d00000">Червоний</span> і <span style="color:#ffd23f">жовтий</span>') } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const q = document.querySelector("#q-text"), b = q.querySelector("b"), sp = [...q.querySelectorAll("span")];
    return { base: +getComputedStyle(q).fontWeight, bold: +getComputedStyle(b).fontWeight, darkBg: sp[0].style.background, lightBg: sp[1].style.background };
  });
  expect(r.bold - r.base).toBeGreaterThanOrEqual(200);
  expect(r.darkBg).toContain("255");      // темно-червоний на темному екрані: світла плашка
  expect(r.lightBg).toBe("");             // жовтий і так читається
  expect(errors).toEqual([]);
});

test("поле відповіді й заблоковані варіанти читаються: без напівпрозорого тла й прозорості тексту", async ({ page, errors }) => {
  const q = [{ type: "text", text: "Столиця?" }];
  await seed(page, { rooms: { "12345678": { status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", questions: q, players: { p1: { nickname: "x", active: true } } } } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1000);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById("text-inp")).backgroundColor)).toBe("rgb(255, 255, 255)");
  expect(await page.evaluate(() => [...document.styleSheets].flatMap(s => [...s.cssRules]).find(r => r.selectorText === ".ans.locked:not(.picked)")?.style.filter || "")).not.toMatch(/opacity/);
  expect(errors).toEqual([]);
});
