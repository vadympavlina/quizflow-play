// Гра наживо: у текстовому питанні зараховується будь-який із кількох допустимих варіантів
import { test, expect } from "./fixtures.mjs";

test("текстова відповідь: зараховується кожен з варіантів через / | , або", async ({ page, errors }) => {
  await page.goto("/404.html");
  const res = await page.evaluate(async () => {
    const { checkCorrect } = await import("/live/live-core.js?v=8");
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
    const { textAnswers, typeChip } = await import("/live/live-core.js?v=8");
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
  const list = await page.evaluate(async () => (await import("/live/avatars.js?v=3")).AVATARS);
  expect(list.length).toBeGreaterThanOrEqual(24);
  expect(new Set(list.map(a => a.id)).size).toBe(list.length);
  for (const a of list) {
    expect(a.id).toMatch(/^[a-z0-9-]{1,24}$/);
    const r = await request.get(`/assets/avatars/${a.id}.svg`);
    expect(r.status(), a.id).toBe(200);
  }
  expect(errors).toEqual([]);
});

test("убори й окуляри: файл є, id допустимі, avatarInner складає inline-SVG з унікальними id", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const m = await import("/live/live-core.js?v=8");
    const one = m.avatarInner("Марія", "fox", { hat: "crown", glasses: "sun" });
    const bare = m.avatarInner("Марія", "fox", {});
    const none = m.avatarInner("Марія К.", "", { hat: "crown" });
    return { hats: m.HATS.map(h => h.id), gl: m.GLASSES.map(g => g.id), one, bare, none, bad: m.avatarInner("<b>", "fox", { hat: "<script>" }) };
  });
  expect(r.hats.length).toBeGreaterThanOrEqual(11);
  expect(r.gl.length).toBeGreaterThanOrEqual(6);
  for (const id of [...r.hats, ...r.gl]) expect(id).toMatch(/^[a-z0-9-]{1,24}$/);
  expect(r.one).toContain("<svg"); expect(r.one).toContain("h-crown-"); expect(r.one).toContain("g-sun");
  expect(r.bare).toContain("<img");
  expect(r.none).toBe("МК");                 // без героя лишаються ініціали
  expect(r.bad).not.toContain("<script");   // невідомий убір ігнорується
  expect(errors).toEqual([]);
});
