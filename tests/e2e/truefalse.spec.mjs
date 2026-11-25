// Гра наживо, питання «Правда / Неправда» на екрані учня: два варіанти зі значками, порядок не перемішується, відповідь зараховується
import { test, expect, seed, readDb } from "./fixtures.mjs";

const room = (over = {}) => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: true },
  questions: [{ type: "truefalse", text: "Вода кипить при 100 °C на рівні моря", options: ["Правда", "Неправда"] }],
  players: { p1: { nickname: "x", active: true } }, ...over });

test("екран учня: ярлик, два варіанти зі значками, «Правда» завжди перша навіть при перемішуванні", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
  await expect(page.locator("#q-type-wrap")).toContainText("Правда чи неправда");
  const btns = page.locator("#answers-grid .ans");
  await expect(btns).toHaveCount(2);
  await expect(btns.nth(0)).toContainText("Правда"); await expect(btns.nth(1)).toContainText("Неправда");
  await expect(btns.nth(0).locator(".letter svg")).toHaveCount(1);               // значок, а не буква
  await expect(btns.nth(1).locator(".letter svg")).toHaveCount(1);
  await expect(page.locator("#q-hint")).toContainText("Правда");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  const [b0, b1] = [await btns.nth(0).boundingBox(), await btns.nth(1).boundingBox()];
  expect(b0.x + b0.width).toBeLessThanOrEqual(390); expect(b1.x + b1.width).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});

test("відповідь «Неправда» (клавіша 2) записується індексом 1", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1000);
  await page.keyboard.press("2");
  await expect.poll(async () => (await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value).toBe(1);
  expect(errors).toEqual([]);
});

test("перевірка відповіді: правильна лише та, що збігається з ключем; ярлик типу в ядрі", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const m = await import("/live/live-core.js?v=15");
    const q = { type: "truefalse" };
    return { yes: m.checkCorrect(q, [0], 0), no: m.checkCorrect(q, [0], 1), both: m.checkCorrect(q, [1], [0, 1]), none: m.checkCorrect(q, [1], null),
      types: m.LIVE_TYPES, chip: m.typeChip("truefalse"), mark0: m.optMark("truefalse", 0), markL: m.optMark("single", 2) };
  });
  expect(r.yes).toBe(true); expect(r.no).toBe(false); expect(r.both).toBe(false); expect(r.none).toBe(false);
  expect(r.types).toContain("truefalse");
  expect(r.chip).toContain("Правда чи неправда");
  expect(r.mark0).toContain("<svg"); expect(r.markL).toBe("C");
  expect(errors).toEqual([]);
});
