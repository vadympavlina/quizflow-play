// Перетягування: впорядкування (за будь-яке місце картки мишею, довге натискання пальцем) і зіставлення (варіант на пункт, обмін, скидання)
import { test, expect, seed, readDb } from "./fixtures.mjs";

const ordRoom = () => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: true },
  questions: [{ type: "ordering", text: "Порядок", options: ["Перший", "Другий", "Третій", "Четвертий"] }], players: { p1: { nickname: "x", active: true } } });
const mtRoom = () => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: true },
  questions: [{ type: "matching", text: "Пари", lefts: ["Франція", "Італія", "Польща"], options: ["Рим", "Варшава", "Париж"] }], players: { p1: { nickname: "x", active: true } } });
const open = async (page, room) => {
  await seed(page, { rooms: { "12345678": room } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
};
const texts = page => page.locator("#answers-grid .ord-card .txt").allInnerTexts();
const center = async loc => { const b = await loc.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
const slots = page => page.locator("#answers-grid .mt-row .mt-slot").allInnerTexts();

test("впорядкування: мишею картку можна тягнути за будь-яке місце (за текст, не лише за ручку)", async ({ page, errors }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, ordRoom());
  const cards = page.locator("#answers-grid .ord-card");
  const [sx, sy] = await center(cards.nth(3).locator(".txt")), [, ty] = await center(cards.nth(0));
  await page.mouse.move(sx, sy); await page.mouse.down();
  await page.mouse.move(sx, sy - 40, { steps: 4 }); await page.mouse.move(sx, ty - 10, { steps: 10 });
  await expect(page.locator("#answers-grid .ord-card.drag")).toHaveCount(1);
  await page.mouse.up();
  expect(await texts(page)).toEqual(["Четвертий", "Перший", "Другий", "Третій"]);
  await expect(page.locator("#answers-grid .ord-card .num")).toHaveText(["1", "2", "3", "4"]);
  await page.locator("#confirm-btn").click();
  await expect.poll(async () => JSON.stringify((await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value)).toBe("[3,0,1,2]");
  expect(errors).toEqual([]);
});

test("впорядкування: палець — довге натискання на картці піднімає її, швидкий свайп гортає сторінку", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, ordRoom());
  const fire = (type, x, y) => page.evaluate(([type, x, y]) => {
    const t = document.querySelectorAll("#answers-grid .ord-card")[0].querySelector(".txt");
    (type === "pointerdown" ? t : document.querySelector("#answers-grid")).dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: "touch", clientX: x, clientY: y, button: 0 }));
  }, [type, x, y]);
  const cards = page.locator("#answers-grid .ord-card");
  const [x, y] = await center(cards.nth(0).locator(".txt")), [, y3] = await center(cards.nth(2));
  // швидкий рух до таймера — картка не піднімається
  await fire("pointerdown", x, y); await fire("pointermove", x, y + 30); await page.waitForTimeout(350); await fire("pointerup", x, y + 30);
  await expect(cards.nth(0)).not.toHaveClass(/drag/);
  expect(await texts(page)).toEqual(["Перший", "Другий", "Третій", "Четвертий"]);
  // тримаємо — піднімається й тягнеться
  await fire("pointerdown", x, y); await page.waitForTimeout(350);
  await expect(cards.nth(0)).toHaveClass(/drag/);
  await fire("pointermove", x, y3 + 10); await fire("pointerup", x, y3 + 10);
  expect((await texts(page))[0]).not.toBe("Перший");
  expect(errors).toEqual([]);
});

test("зіставлення: варіант з банку перетягується на пункт, перетягування між пунктами міняє місцями, поза пунктами — повертає в банк", async ({ page, errors }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, mtRoom());
  const rows = page.locator("#answers-grid .mt-row"), chip = t => page.locator("#answers-grid .mt-chip", { hasText: t });
  const drag = async (from, to) => { const [fx, fy] = await center(from), [tx, ty] = to; await page.mouse.move(fx, fy); await page.mouse.down(); await page.mouse.move(fx + 5, fy + 5, { steps: 2 }); await page.mouse.move(tx, ty, { steps: 8 }); await page.mouse.up(); };
  await drag(chip("Париж"), await center(rows.nth(0)));          // Франція — Париж
  expect((await slots(page))[0]).toContain("Париж");
  await expect(chip("Париж")).toBeDisabled();
  await drag(chip("Рим"), await center(rows.nth(2)));            // Рим — на третій пункт
  expect((await slots(page))[2]).toContain("Рим");
  await drag(rows.nth(2).locator(".mt-slot"), await center(rows.nth(0)));   // обмін: Рим ↔ Париж
  expect((await slots(page)).slice(0, 3).map(s => s.replace(/\s+/g, " ").trim())).toEqual([expect.stringContaining("Рим"), expect.stringContaining("Оберіть"), expect.stringContaining("Париж")]);
  await drag(rows.nth(2).locator(".mt-slot"), [640, 780]);       // викинули за межі — назад у банк
  await expect(chip("Париж")).toBeEnabled();
  // клік працює як раніше
  await page.waitForTimeout(100);
  await rows.nth(1).locator("button.txt").click(); await chip("Варшава").click();
  expect((await slots(page))[1]).toContain("Варшава");
  expect(errors).toEqual([]);
});
