// Гра наживо, впорядкування на екрані учня: картки зі стрілками й ручкою, відповідь — масив номерів у порядку учня,
// після розкриття — правильний порядок з позначками «у вас: N»
import { test, expect, seed, readDb } from "./fixtures.mjs";

// options — пункти в перемішаному вигляді; правильна послідовність (ключ викладача): Б, А, Г, В
const room = (over = {}) => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: true },
  questions: [{ type: "ordering", text: "Розташуйте події від найдавнішої до найновішої", options: ["Битва під Крутами", "Хрещення Русі", "Проголошення незалежності України", "Заснування Києва (за літописом)"] }],
  players: { p1: { nickname: "x", active: true } }, ...over });
const open = async (page, over) => {
  await seed(page, { rooms: { "12345678": room(over) } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
};
const texts = page => page.locator("#answers-grid .ord-card .txt").allInnerTexts();

test("екран учня: ярлик, чотири картки з номерами, ручка, стрілки й кнопка підтвердження", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await expect(page.locator("#q-type-wrap")).toContainText("Розставте за порядком");
  const cards = page.locator("#answers-grid .ord-card");
  await expect(cards).toHaveCount(4);
  expect(await texts(page)).toEqual(["Битва під Крутами", "Хрещення Русі", "Проголошення незалежності України", "Заснування Києва (за літописом)"]);
  await expect(page.locator("#answers-grid .ord-card .num")).toHaveText(["1", "2", "3", "4"]);
  await expect(cards.first().locator(".grip svg")).toHaveCount(1);
  await expect(cards.first().locator('[data-d="-1"]')).toHaveAttribute("aria-disabled", "true");
  await expect(cards.last().locator('[data-d="1"]')).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator("#confirm-btn")).toBeVisible();
  await expect(page.locator("#confirm-btn")).toContainText("Підтвердити порядок");
  await expect(page.locator("#confirm-cnt")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  for (let i = 0; i < 4; i++) { const b = await cards.nth(i).boundingBox(); expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(390); }
  expect(errors).toEqual([]);
});

test("стрілки переставляють картки, номери оновлюються, підтвердження записує порядок учня", async ({ page, errors }) => {
  await open(page);
  const cards = page.locator("#answers-grid .ord-card");
  await cards.nth(1).locator('[data-d="-1"]').click();      // Хрещення вгору
  await cards.nth(3).locator('[data-d="-1"]').click();      // «Заснування» (лишилось четвертим) вгору
  expect(await texts(page)).toEqual(["Хрещення Русі", "Битва під Крутами", "Заснування Києва (за літописом)", "Проголошення незалежності України"]);
  await expect(page.locator("#answers-grid .ord-card .num")).toHaveText(["1", "2", "3", "4"]);
  await page.locator("#confirm-btn").click();
  await expect.poll(async () => JSON.stringify((await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value)).toBe(JSON.stringify([1, 0, 3, 2]));
  await expect(page.locator("#lock-banner")).toBeVisible();
  await expect(page.locator("#confirm-btn")).toBeHidden();
  // після відправки порядок закріплений: стрілки не діють
  await cards.nth(0).locator('[data-d="1"]').click({ force: true });
  expect(await texts(page)).toEqual(["Хрещення Русі", "Битва під Крутами", "Заснування Києва (за літописом)", "Проголошення незалежності України"]);
  expect(errors).toEqual([]);
});

test("перетягування за ручку: картка їде за курсором і займає нове місце", async ({ page, errors }) => {
  await open(page);
  const cards = page.locator("#answers-grid .ord-card");
  const g = await cards.nth(0).locator(".grip").boundingBox(), last = await cards.nth(3).boundingBox();
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
  await page.mouse.down();
  await page.mouse.move(g.x + g.width / 2, g.y + 60, { steps: 4 });
  await expect(page.locator("#answers-grid .ord-card.drag")).toHaveCount(1);
  await page.mouse.move(g.x + g.width / 2, last.y + last.height / 2 + 4, { steps: 10 });
  await page.mouse.up();
  await expect(page.locator("#answers-grid .ord-card.drag")).toHaveCount(0);
  expect(await texts(page)).toEqual(["Хрещення Русі", "Проголошення незалежності України", "Заснування Києва (за літописом)", "Битва під Крутами"]);
  await expect(page.locator("#answers-grid .ord-card .num")).toHaveText(["1", "2", "3", "4"]);
  await page.locator("#confirm-btn").click();
  await expect.poll(async () => JSON.stringify((await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value)).toBe(JSON.stringify([1, 2, 3, 0]));
  expect(errors).toEqual([]);
});

test("після перезавантаження повертається власний порядок", async ({ page, errors }) => {
  await open(page, { answers: { 0: { p1: { value: [3, 2, 1, 0], answeredAt: Date.now() } } } });
  expect(await texts(page)).toEqual(["Заснування Києва (за літописом)", "Проголошення незалежності України", "Хрещення Русі", "Битва під Крутами"]);
  await expect(page.locator("#lock-banner")).toBeVisible();
  expect(errors).toEqual([]);
});

test("розкриття: правильний порядок, позначки «у вас: N», пояснення без балів", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // правильно: Б, А, Г, В = індекси [1,0,3,2]; учень поставив [0,1,2,3]
  await open(page, { status: "reveal", revealed: { 0: { correct: [1, 0, 3, 2], at: Date.now() } },
    answers: { 0: { p1: { value: [0, 1, 2, 3], answeredAt: Date.now(), isCorrect: false, points: 0 } } } });
  expect(await texts(page)).toEqual(["Хрещення Русі", "Битва під Крутами", "Заснування Києва (за літописом)", "Проголошення незалежності України"]);
  await expect(page.locator("#answers-grid .ord-card.bad")).toHaveCount(4);
  await expect(page.locator("#answers-grid .ord-card").nth(0).locator(".res")).toContainText("у вас: 2");
  await expect(page.locator("#answers-grid .ord-card").nth(1).locator(".res")).toContainText("у вас: 1");
  await expect(page.locator("#feedback")).toContainText("Не зовсім");
  await expect(page.locator("#feedback")).toContainText("На своїх місцях 0 з 4");
  await expect(page.locator("#confirm-btn")).toBeHidden();
  expect(errors).toEqual([]);
});

test("розкриття: правильна відповідь — усі картки зелені з позначкою", async ({ page, errors }) => {
  await open(page, { status: "reveal", revealed: { 0: { correct: [1, 0, 3, 2], at: Date.now() } },
    answers: { 0: { p1: { value: [1, 0, 3, 2], answeredAt: Date.now(), isCorrect: true, points: 900 } } } });
  await expect(page.locator("#answers-grid .ord-card.ok")).toHaveCount(4);
  await expect(page.locator("#answers-grid .ord-card .res svg")).toHaveCount(4);
  await expect(page.locator("#feedback")).toContainText("Правильно");
  expect(errors).toEqual([]);
});

test("ядро: оцінювання лише повного порядку, ключ і перемішування пунктів", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const m = await import("/live/live-core.js?v=15");
    const q = { type: "ordering" };
    const sh = m.shuffleOrdering({ items: ["a", "b", "c", "d"] }, "seed1");
    const unique = new Set(Array.from({ length: 40 }, (_, i) => m.shuffleOrdering({ items: ["a", "b", "c"] }, "s" + i).options.join())).size;
    const never = Array.from({ length: 200 }, (_, i) => m.shuffleOrdering({ items: ["a", "b"] }, "t" + i)).every(x => x.options.join("") !== "ab");
    return { full: m.checkCorrect(q, [2, 0, 1], [2, 0, 1]), swap: m.checkCorrect(q, [2, 0, 1], [0, 2, 1]), sorted: m.checkCorrect(q, [2, 0, 1], [0, 1, 2]),
      short: m.checkCorrect(q, [2, 0, 1], [2, 0]), obj: m.checkCorrect(q, { 0: 2, 1: 0, 2: 1 }, { 0: 2, 1: 0, 2: 1 }), none: m.checkCorrect(q, [2, 0, 1], null),
      okItems: m.isLiveQuestion({ type: "ordering", items: ["a", "b"] }), tooMany: m.isLiveQuestion({ type: "ordering", items: ["1", "2", "3", "4", "5", "6", "7"] }), one: m.isLiveQuestion({ type: "ordering", items: ["a"] }),
      chip: m.typeChip("ordering"), types: m.LIVE_TYPES,
      // за ключем correct із пунктами options відновлюється вихідна послідовність
      restored: sh.correct.map(i => sh.options[i]).join(""), shuffled: sh.options.join("") !== "abcd", unique, never };
  });
  expect(r.full).toBe(true); expect(r.swap).toBe(false); expect(r.sorted).toBe(false); expect(r.short).toBe(false); expect(r.obj).toBe(true); expect(r.none).toBe(false);
  expect(r.okItems).toBe(true); expect(r.tooMany).toBe(false); expect(r.one).toBe(false);
  expect(r.chip).toContain("Розставте за порядком"); expect(r.types).toContain("ordering");
  expect(r.restored).toBe("abcd"); expect(r.shuffled).toBe(true); expect(r.unique).toBeGreaterThan(3); expect(r.never).toBe(true);
  expect(errors).toEqual([]);
});
