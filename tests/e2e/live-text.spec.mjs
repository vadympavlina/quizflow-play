// Гра наживо: у текстовому питанні зараховується будь-який із кількох допустимих варіантів
import { test, expect } from "./fixtures.mjs";

test("текстова відповідь: зараховується кожен з варіантів через / | , або", async ({ page, errors }) => {
  await page.goto("/404.html");
  const res = await page.evaluate(async () => {
    const { checkCorrect } = await import("/live/live-core.js?v=9");
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
    const { textAnswers, typeChip } = await import("/live/live-core.js?v=9");
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
    const m = await import("/live/live-core.js?v=9");
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

test("текстові й числові відповіді: лапки, крапка, дефіс, описка в довгому слові; числа з пробілами й одиницями", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const { checkCorrect } = await import("/live/live-core.js?v=9");
    const t = (c, v, type = "text") => checkCorrect({ type }, c, v);
    return {
      dot: t("Київ", "Київ."), quotes: t("Кобзар", "«Кобзар»"), hyphen: t("Івано-Франківськ", "івано франківськ"),
      typoLong: t("Шевченко", "Шевченка"), typoShort: t("кіт", "кот"), digits: t("1999", "1998"), other: t("Харків", "Львів"),
      numComma: t("3.5", "3,5", "number"), numSpace: t("1000", "1 000", "number"), numUnit: t("5", "5 см", "number"),
      numJunk: t("5", "5 6", "number"), numExp: t("1", "1e5", "number"),
    };
  });
  expect(r).toEqual({ dot: true, quotes: true, hyphen: true, typoLong: true, typoShort: false, digits: false, other: false,
    numComma: true, numSpace: true, numUnit: true, numJunk: false, numExp: false });
  expect(errors).toEqual([]);
});

test("перемішування варіантів: «Усе вищеперелічене» й «Жоден» лишаються на місці, решта рівномірно", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const { optionOrder, isPinnedOption } = await import("/live/live-core.js?v=9");
    const opts = ["Дніпро", "Усе вищеперелічене", "Дністер", "Південний Буг", "Жоден із варіантів"];
    let stay = true; const first = {};
    for (let i = 0; i < 3000; i++) { const o = optionOrder(opts, `p${i}:3`); if (o[1] !== 1 || o[4] !== 4 || [...o].sort().join() !== "0,1,2,3,4") stay = false; first[o[0]] = (first[o[0]] || 0) + 1; }
    return { stay, first, pins: ["А і Б", "Усе життя", "Дніпро", "Немає правильної відповіді"].map(isPinnedOption) };
  });
  expect(r.stay).toBe(true);
  expect(Object.keys(r.first).sort()).toEqual(["0", "2", "3"]);
  Object.values(r.first).forEach(v => expect(v).toBeGreaterThan(850));
  expect(r.pins).toEqual([true, false, false, true]);
  expect(errors).toEqual([]);
});

test("нічиї: порядок рівних не за алфавітом, серія правильних підряд і k у таблиці місць", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const { standings, rankMap } = await import("/live/live-core.js?v=9");
    const players = { zz: { nickname: "Ярик" }, aa: { nickname: "Аня" }, mm: { nickname: "Марко" } };
    const ans = { 0: { zz: { isCorrect: true, points: 1000 }, aa: { isCorrect: true, points: 1000 }, mm: { isCorrect: false, points: 0 } },
                  1: { zz: { isCorrect: true, points: 1000 }, aa: { isCorrect: true, points: 1000 }, mm: { isCorrect: true, points: 1000 } },
                  2: { zz: { isCorrect: true, points: 1000 }, aa: { isCorrect: false, points: 0 }, mm: { isCorrect: true, points: 1000 } } };
    const list = standings(players, ans), rm = rankMap(list);
    // порядок має залежати від коду гравця, а не від алфавіту: перевіряємо на багатьох парах
    let alphabetical = 0; const N = 300;
    for (let i = 0; i < N; i++) { const l = standings({ ["a" + i]: { nickname: "Аня" }, ["b" + i]: { nickname: "Яна" } }, { 0: { ["a" + i]: { isCorrect: true, points: 1 }, ["b" + i]: { isCorrect: true, points: 1 } } }); if (l[0].nickname === "Аня") alphabetical++; }
    return { zz: rm.zz, aa: rm.aa, mm: rm.mm, alphabetical, n: N };
  });
  expect(r.zz).toMatchObject({ k: 3, st: 3 }); expect(r.aa).toMatchObject({ k: 2, st: 0 }); expect(r.mm).toMatchObject({ k: 2, st: 2 });
  expect(r.alphabetical).toBeGreaterThan(r.n * 0.35); expect(r.alphabetical).toBeLessThan(r.n * 0.65);
  expect(errors).toEqual([]);
});
