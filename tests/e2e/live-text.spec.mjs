// Гра наживо: у текстовому питанні зараховується будь-який із кількох допустимих варіантів
import { test, expect } from "./fixtures.mjs";

test("текстова відповідь: зараховується кожен з варіантів через / | , або", async ({ page, errors }) => {
  await page.goto("/404.html");
  const res = await page.evaluate(async () => {
    const { checkCorrect } = await import("/live/live-core.js?v=7");
    const q = { type: "text" };
    const ok = (correct, v) => checkCorrect(q, correct, v);
    return {
      whole: ok("Київ", "київ"),
      slash1: ok("Київ / м. Київ", "Київ"),
      slash2: ok("Київ / м. Київ", "  М.  КИЇВ "),
      pipe: ok("так | yes", "yes"),
      comma: ok("кіт, кішка", "Кішка"),
      or: ok("HTML або HyperText Markup Language", "html"),
      wrong: ok("Київ / м. Київ", "Львів"),
      empty: ok("Київ / м. Київ", "  "),
    };
  });
  expect(res).toEqual({ whole: true, slash1: true, slash2: true, pipe: true, comma: true, or: true, wrong: false, empty: false });
  expect(errors).toEqual([]);
});

test("показ відповідей: варіанти тексту розбиваються, число з комою — ні; ярлик типу питання виразний", async ({ page, errors }) => {
  await page.goto("/404.html");
  const res = await page.evaluate(async () => {
    const { textAnswers, typeChip } = await import("/live/live-core.js?v=7");
    return {
      text: textAnswers("Київ / м. Київ", "text"),
      num: textAnswers("3,5", "number"),
      empty: textAnswers("", "text"),
      multi: typeChip("multi"), single: typeChip("single"), txt: typeChip("text"), num2: typeChip("number"),
    };
  });
  expect(res.text).toEqual(["Київ", "м. Київ"]);
  expect(res.num).toEqual(["3,5"]);
  expect(res.empty).toEqual([]);
  expect(res.single).toContain("Одна правильна відповідь");
  expect(res.multi).toContain("Кілька правильних відповідей");
  expect(res.txt).toContain("Впишіть відповідь");
  expect(res.num2).toContain("Введіть число");
  expect(errors).toEqual([]);
});

test("герої: список без дублікатів, ids допустимі, є картинка для кожного", async ({ page, request, errors }) => {
  await page.goto("/404.html");
  const list = await page.evaluate(async () => (await import("/live/avatars.js?v=2")).AVATARS);
  expect(list.length).toBeGreaterThanOrEqual(24);
  expect(new Set(list.map(a => a.id)).size).toBe(list.length);
  for (const a of list) {
    expect(a.id).toMatch(/^[a-z0-9-]{1,24}$/);
    const r = await request.get(`/assets/avatars/${a.id}.svg`);
    expect(r.status(), a.id).toBe(200);
  }
  expect(errors).toEqual([]);
});
