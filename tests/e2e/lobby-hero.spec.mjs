// Поки гра не запущена (лобі), учень може змінити героя й окуляри; після старту гри — ні
import { test, expect, seed, readDb } from "./fixtures.mjs";

const Q = [{ type: "single", text: "Питання", options: ["А", "Б"], correct: 0 }];
const room = (status = "lobby") => ({ status, currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "Тест", questions: Q,
  players: { p1: { nickname: "Оля", active: true, online: true, avatar: "fox", glasses: "round" } } });
const URL_ = "/live/play-student?code=12345678&pid=p1&nickname=%D0%9E%D0%BB%D1%8F";

test("лобі: «Змінити героя» відкриває вибір, збереження пише героя й окуляри в базу і оновлює аватар", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto(URL_);
  await expect(page.locator("#lobby-overlay")).toBeVisible();
  const before = await page.locator("#lo-av").innerHTML();
  await page.locator("#lo-change").click();
  const dlg = page.locator(".hp-back.open");
  await expect(dlg).toBeVisible();
  const heroes = dlg.locator("[data-hero]");
  expect(await heroes.count()).toBeGreaterThan(3);
  const target = heroes.filter({ hasNot: page.locator('[aria-checked="true"]') }).nth(1);
  const heroId = await target.getAttribute("data-hero");
  await target.click();
  await expect(dlg.locator(`[data-hero="${heroId}"]`)).toHaveAttribute("aria-checked", "true");
  await dlg.locator('[data-gl=""]').click();                                    // без окулярів
  await dlg.locator('[data-r="ok"]').click();
  await expect(dlg).toHaveCount(0);
  const p = (await readDb(page)).rooms["12345678"].players.p1;
  expect(p.avatar).toBe(heroId);
  expect(p.glasses ?? null).toBeNull();
  expect(p.nickname).toBe("Оля");                                               // ім'я не чіпаємо
  expect(await page.locator("#lo-av").innerHTML()).not.toBe(before);
  expect(errors).toEqual([]);
});

test("Escape закриває вибір без змін", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto(URL_);
  await page.locator("#lo-change").click();
  await expect(page.locator(".hp-back.open")).toBeVisible();
  await page.locator(".hp-back.open [data-hero]").nth(3).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".hp-back.open")).toHaveCount(0);
  expect((await readDb(page)).rooms["12345678"].players.p1.avatar).toBe("fox");
  expect(errors).toEqual([]);
});

test("гра розпочалась, поки вибір відкритий, — вікно закривається, лобі зникає", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto(URL_);
  await page.locator("#lo-change").click();
  await expect(page.locator(".hp-back.open")).toBeVisible();
  await page.evaluate(() => { const db = JSON.parse(localStorage.getItem("mockdb")); db.rooms["12345678"].status = "question"; db.rooms["12345678"].questionStartedAt = Date.now(); localStorage.setItem("mockdb", JSON.stringify(db)); window.dispatchEvent(new StorageEvent("storage", { key: "mockdb" })); });
  await expect(page.locator(".hp-back.open")).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator("#lobby-overlay")).toBeHidden();
  expect(errors).toEqual([]);
});

test.describe("телефон", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("вибір героя — знизу, у межах екрана", async ({ page, errors }) => {
    await seed(page, { rooms: { "12345678": room() } }, "");
    await page.goto(URL_);
    await page.locator("#lo-change").click();
    const box = await page.locator(".hp-back.open .hp").boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(390.5);
    expect(box.y + box.height).toBeLessThanOrEqual(844.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
});
