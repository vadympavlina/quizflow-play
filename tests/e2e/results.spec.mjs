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
