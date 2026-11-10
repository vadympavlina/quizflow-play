// Учень приєднується до гри: код → ім'я → сторінка гри; з гри можна повернутися на вхід (корінь play)
import { test, expect, seed } from "./fixtures.mjs";

const ROOM = { status: "lobby", testTitle: "Географія світу", qCount: 8, hostUid: "t1", createdAt: Date.now(), players: {} };

test("приєднання за кодом: вхід → гра → повернення на вхід", async ({ page, errors }) => {
  await seed(page, { users: { t1: { role: "teacher", name: "Олена" } }, rooms: { "12345678": ROOM } });
  await page.goto("/?code=12345678");
  await expect(page.locator("#step-nick")).toBeVisible();
  await page.fill("#inp-nick", "Марія К.");
  await page.click("#btn-join");
  await page.waitForURL(/\/live\/play-student\?code=12345678&pid=/);
  // «Приєднатись до іншої гри» веде на корінь цього ж піддомену
  const href = await page.locator("#end-link").getAttribute("href");
  expect(href).toBe("../");
  await page.goto("/live/play-student?code=12345678"); // без pid — повертає на вхід
  await page.waitForURL(url => new URL(url).pathname === "/");
  // сторінка гри з неповною кімнатою в моку кидає «no room», без pid — «bad params»: це штатні зупинки, не поломка
  expect(errors.filter(e => !/bad params|no room/.test(e))).toEqual([]);
});
