// Фінал для учня: місце, відповіді й місце серед інших (швидкість та «Точність»)
import { test, expect, seed } from "./fixtures.mjs";

const Q = [0, 1, 2].map(i => ({ type: "single", text: "Питання " + i, options: ["A", "B"] }));
const room = scoring => {
  const names = ["Марія Бондар", "Олег Шевчук", "Катя Мельник", "Дмитро <i>Коваль</i>", "Олена Ткач"];
  const players = Object.fromEntries(names.map((n, i) => ["p" + i, { nickname: n }]));
  const correct = [3, 2, 2, 1, 0];
  const answers = {};
  for (let q = 0; q < 3; q++) { answers[q] = {}; names.forEach((n, i) => { const ok = q < correct[i]; answers[q]["p" + i] = { value: ok ? 0 : 1, isCorrect: ok, points: scoring === "correct" ? (ok ? 1000 : 0) : (ok ? 800 + i : 0) }; }); }
  return { status: "finished", scoring, testTitle: "Географія", questions: Q, players, answers };
};

for (const scoring of ["speed", "correct"]) {
  test(`результат учня (${scoring}): місце, плитки й список`, async ({ page, errors }) => {
    await seed(page, { rooms: { "12345678": room(scoring) } }, "");
    await page.goto("/live/student-result?code=12345678&pid=p3&nickname=x");
    await page.waitForTimeout(600);
    await expect(page.locator(".hero .nm")).toContainText("Дмитро");
    await expect(page.locator(".hero .nm i i")).toHaveCount(0);           // розмітка в імені не виконується
    await expect(page.locator(".ans div")).toHaveCount(3);
    await expect(page.locator(".rw.me")).toContainText("Дмитро");
    if (scoring === "correct") await expect(page.locator(".hero")).not.toContainText("балів");
    expect(errors).toEqual([]);
  });
}

test("результат учня: дотик по екрану не переривав анімацію (її не можна скасувати випадково)", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room("speed") } }, "");
  await page.goto("/live/student-result?code=12345678&pid=p3&nickname=x");
  const running = () => page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length);
  await expect.poll(running, { message: "анімація стартує", timeout: 4000 }).toBeGreaterThan(0);
  const vp = page.viewportSize();
  for (const [fx, fy] of [[.3, .3], [.7, .5], [.5, .8], [.2, .6]]) { await page.mouse.click(vp.width * fx, vp.height * fy); await page.waitForTimeout(60); }
  expect(await running(), "після кліків анімація досі йде").toBeGreaterThan(0);
  await page.waitForTimeout(9000);
  expect(await running(), "сама доходить до кінця").toBe(0);
  await expect(page.locator(".hero .nm")).toContainText("Дмитро");
  expect(errors).toEqual([]);
});

// Звук фіналу: Web Audio не стартує без жесту користувача. Рахуємо створені осцилятори — це і є озвучення анімації.
const countOsc = () => { window.__osc = 0; const P = (window.BaseAudioContext || window.AudioContext).prototype, o = P.createOscillator; P.createOscillator = function () { window.__osc++; return o.apply(this, arguments); }; };

test("результат учня: після дотику на попередній сторінці анімація йде зі звуком сама", async ({ page, errors }) => {
  await page.addInitScript(countOsc);
  await seed(page, { rooms: { "12345678": room("speed") } }, "");
  await page.mouse.click(5, 5);                                            // учень щойно торкався екрана (відповідав)
  await page.evaluate(() => { location.href = "/live/student-result?code=12345678&pid=p3&nickname=x"; });
  await page.waitForTimeout(3500);
  expect(await page.evaluate(() => window.__osc), "звуки створюються").toBeGreaterThan(0);
  await expect(page.getByText("Щоб почути звук")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("результат учня: сторінку відкрито напряму (браузер блокує звук) — підказка, а після «Ще раз» звук є", async ({ page, errors }) => {
  await page.addInitScript(countOsc);
  await seed(page, { rooms: { "12345678": room("speed") } }, "");
  await page.goto("/live/student-result?code=12345678&pid=p3&nickname=x");
  await expect(page.getByText("Щоб почути звук")).toBeVisible({ timeout: 4000 });
  expect(await page.evaluate(() => window.__osc), "без жесту звуку немає").toBe(0);
  await page.locator("#replay").click();
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => window.__osc), "після кліку звук пішов").toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
