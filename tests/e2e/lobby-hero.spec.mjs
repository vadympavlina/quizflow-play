// Поки гра не запущена (лобі), учень може змінити героя, окуляри, капелюх і одяг; після старту гри — ні
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
  await dlg.locator('[data-tab="gls"]').click();                                // вкладка «Окуляри»
  await expect(dlg.locator('[data-r="g-gls"] [data-v=""]')).toBeVisible();
  await dlg.locator('[data-r="g-gls"] [data-v=""]').click();                    // без окулярів
  await dlg.locator('[data-tab="hat"]').click();                                // вкладка «Капелюх»
  await dlg.locator('[data-r="g-hat"] [data-v="crown"]').click();
  await dlg.locator('[data-tab="out"]').click();                                // вкладка «Одяг»
  await dlg.locator('[data-r="g-out"] [data-v="hoodie"]').click();
  await dlg.locator('[data-r="ok"]').click();
  await expect(dlg).toHaveCount(0);
  const p = (await readDb(page)).rooms["12345678"].players.p1;
  expect(p.avatar).toBe(heroId);
  expect(p.glasses ?? null).toBeNull();
  expect(p.hat).toBe("crown");
  expect(p.outfit).toBe("hoodie");
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
    expect(box.height, "шторка майже на весь екран").toBeGreaterThan(844 * 0.85);
    const tile = await page.locator(".hp-back.open [data-hero]").first().locator(".hp-f").boundingBox();
    expect(tile.width, "плитка героя велика, зручна для пальця").toBeGreaterThanOrEqual(78);
    await expect(page.locator(".hp-back.open .hp-nm").first()).toBeVisible();      // ім'я героя під плиткою
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
});

test("окремої кнопки немає: вибір відкривається натисканням на самого героя", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto(URL_);
  await expect(page.getByText("Змінити героя", { exact: true })).toHaveCount(0);      // немає видимого підпису-кнопки
  await expect(page.locator("#lo-change")).toHaveAttribute("aria-label", "Змінити героя");
  await page.locator("#lo-av").click();                                                // клік саме по аватару
  await expect(page.locator(".hp-back.open")).toBeVisible();
  expect(errors).toEqual([]);
});

test("вкладки «Герой» / «Окуляри» / «Капелюх» / «Одяг», навігація стрілками по сітці, Home/End", async ({ page, errors }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seed(page, { rooms: { "12345678": room() } }, "");
  await page.goto(URL_);
  await page.locator("#lo-change").click();
  const dlg = page.locator(".hp-back.open");
  await expect(dlg.locator("#hp-pan-hero")).toBeVisible();
  await expect(dlg.locator("#hp-pan-gls")).toBeHidden();
  await dlg.locator('[data-tab="gls"]').click();
  await expect(dlg.locator("#hp-pan-gls")).toBeVisible();
  await expect(dlg.locator("#hp-pan-hero")).toBeHidden();
  await expect(dlg.locator('[data-r="g-gls"] [data-v="round"]')).toHaveAttribute("aria-checked", "true");   // обрані окуляри відмічені
  await dlg.locator('[data-tab="hero"]').click();
  // стрілки: праворуч — наступний герой, униз — на цілий рядок сітки, Home/End — перший/останній
  const sel = () => dlg.locator('[data-hero][aria-checked="true"]').getAttribute("data-hero");
  const all = await dlg.locator("[data-hero]").evaluateAll(els => els.map(e => e.dataset.hero));
  const cols = await dlg.locator("#hp-pan-hero").evaluate(g => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  await dlg.locator('[data-hero][aria-checked="true"]').focus();
  const i0 = all.indexOf(await sel());
  await page.keyboard.press("ArrowRight"); expect(await sel()).toBe(all[i0 + 1]);
  await page.keyboard.press("ArrowDown"); expect(await sel()).toBe(all[i0 + 1 + cols]);
  await page.keyboard.press("Home"); expect(await sel()).toBe(all[0]);
  await page.keyboard.press("End"); expect(await sel()).toBe(all[all.length - 1]);
  expect(errors).toEqual([]);
});

test("вхід у гру: вікно вибору героя — зміни застосовуються лише після «Готово», Escape їх відкидає", async ({ page, errors }) => {
  await seed(page, { users: { t1: { role: "teacher", name: "Олена" } }, rooms: { "12345678": { status: "lobby", testTitle: "Тест", qCount: 3, hostUid: "t1", createdAt: Date.now(), players: {} } } });
  await page.goto("/?code=12345678");
  await expect(page.locator("#step-nick")).toBeVisible();
  const name0 = await page.locator("#hero-name").textContent();
  await page.locator("#av-open").click();
  const dlg = page.locator(".hp-back.open");
  await expect(dlg).toBeVisible();
  const other = dlg.locator("[data-hero]").filter({ hasNot: page.locator('[aria-checked="true"]') }).first();
  await other.click();
  await page.keyboard.press("Escape");                                              // відкинули
  await expect(dlg).toHaveCount(0);
  expect(await page.locator("#hero-name").textContent()).toBe(name0);
  await page.locator("#av-open2").click();
  const t2 = dlg.locator("[data-hero]").filter({ hasNot: page.locator('[aria-checked="true"]') }).nth(2);
  const nm = await t2.getAttribute("aria-label");
  await t2.click();
  await dlg.locator('[data-r="ok"]').click();                                       // зберегли
  await expect(dlg).toHaveCount(0);
  await expect(page.locator("#hero-name")).toHaveText(nm);
  expect(errors).toEqual([]);
});
