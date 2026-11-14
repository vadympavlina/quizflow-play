// Звук фіналу, коли браузер його БЛОКУЄ (сторінку відкрито напряму, оновлено, iPhone): церемонія не йде мовчки, а чекає на дотик,
// який і вмикає звук, і запускає показ. Політика автовідтворення тут — як у справжньому браузері (потрібен жест).
import { test, expect, seed } from "./fixtures.mjs";

test.use({ launchOptions: { args: ["--autoplay-policy=document-user-activation-required"], ...(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {}) } });

const Q = [0, 1, 2].map(i => ({ type: "single", text: "Питання " + i, options: ["A", "B"] }));
const names = ["Марія Бондар", "Олег Шевчук", "Катя Мельник", "Дмитро Коваль", "Олена Ткач"];
const room = () => {
  const players = Object.fromEntries(names.map((n, i) => ["p" + i, { nickname: n }]));
  const correct = [3, 2, 2, 1, 0], answers = {};
  for (let q = 0; q < 3; q++) { answers[q] = {}; names.forEach((n, i) => { const ok = q < correct[i]; answers[q]["p" + i] = { value: ok ? 0 : 1, isCorrect: ok, points: ok ? 800 - i * 20 : 0 }; }); }
  return { status: "finished", scoring: "speed", testTitle: "Географія", questions: Q, players, answers };
};
const countOsc = () => { window.__osc = 0; const P = (window.BaseAudioContext || window.AudioContext).prototype, o = P.createOscillator; P.createOscillator = function () { window.__osc++; return o.apply(this, arguments); }; };
const running = page => page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length);
const open = async page => { await page.addInitScript(countOsc); await seed(page, { rooms: { "12345678": room() } }, ""); };
const URL = "/live/student-result?code=12345678&pid=p3&nickname=x";

test("звук заблоковано (iPhone, пряме відкриття): екран «Показати результати», дотик вмикає звук і запускає анімацію", async ({ page, errors }) => {
  await open(page);
  await page.goto(URL);
  const gate = page.locator(".gate button");
  await expect(gate).toBeVisible();
  await page.waitForTimeout(1500);
  expect(await running(page), "анімація ще не стартувала").toBe(0);
  expect(await page.evaluate(() => window.__osc), "звуку ще немає").toBe(0);
  await gate.click();
  await expect(page.locator(".gate")).toHaveCount(0);
  await expect.poll(() => running(page), { timeout: 4000 }).toBeGreaterThan(0);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.__osc), "після дотику звук пішов").toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("звук заблоковано, але вимкнений самим користувачем — екрана «торкніться» немає", async ({ page, errors }) => {
  await open(page);
  await page.evaluate(() => localStorage.setItem("qf_snd", "0"));
  await page.goto(URL);
  await expect.poll(() => running(page), { timeout: 4000 }).toBeGreaterThan(0);
  await expect(page.locator(".gate")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("звук заблоковано, але в системі «зменшити рух» — екрана «торкніться» немає", async ({ page, errors }) => {
  await open(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  await page.waitForTimeout(1500);
  await expect(page.locator(".gate")).toHaveCount(0);
  await expect(page.locator(".hero .nm")).toBeVisible();
  expect(errors).toEqual([]);
});
