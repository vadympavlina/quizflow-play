// Розгорнута відповідь на екрані учня: довший текст, відповідь зараховує викладач
import { test, expect, seed, readDb } from "./fixtures.mjs";

const room = (status, answers) => ({ status, currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "Есе",
  questions: [{ type: "long", text: "Поясніть, чому небо блакитне" }], players: { p1: { nickname: "Ася", active: true, online: true } }, answers,
  ...(status === "reveal" ? { revealed: { 0: { correct: null, at: Date.now() } } } : {}) });
const URL = "/live/play-student?code=12345678&pid=p1&nickname=x";

test("розгорнута відповідь: поле приймає до 500 символів і відправляє відповідь", async ({ page, errors }) => {
  await seed(page, { rooms: { "12345678": room("question") } }, "");
  await page.goto(URL);
  const inp = page.locator("#text-inp");
  await expect(inp).toBeVisible();
  await expect(inp).toHaveAttribute("maxlength", "500");
  await expect(page.locator(".tchip.long")).toContainText("Розгорнута відповідь");
  await inp.fill("а".repeat(400));
  await page.locator("#text-submit").click();
  await expect.poll(async () => ((await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value || "").length).toBe(400);
  expect(errors.filter(e => !/answers|permission/.test(e))).toEqual([]);
});

test("розгорнута відповідь: до оцінки викладача — «Чекаємо», після зарахування — «Правильно»", async ({ page, errors }) => {
  const mine = { value: "Релей", answeredAt: Date.now() - 5000, isCorrect: false, points: 0 };
  await seed(page, { rooms: { "12345678": room("reveal", { 0: { p1: mine } }) } }, "");
  await page.goto(URL);
  await expect(page.locator("#feedback")).toContainText("Чекаємо оцінку викладача");
  await page.evaluate(() => { const d = JSON.parse(localStorage.getItem("mockdb")); Object.assign(d.rooms["12345678"].answers[0].p1, { isCorrect: true, points: 800, gradedByTeacher: true }); localStorage.setItem("mockdb", JSON.stringify(d)); });
  await page.goto(URL);
  await expect(page.locator("#feedback")).toContainText("Правильно");
  expect(errors).toEqual([]);
});
