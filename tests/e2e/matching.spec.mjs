// Гра наживо, зіставлення на екрані учня: пункти зі слотами й банк варіантів, відповідь — масив номерів відповідей по пунктах,
// після розкриття — вірні й хибні пари з правильною відповіддю
import { test, expect, seed, readDb } from "./fixtures.mjs";

// у кімнаті відповіді перемішані; ключ викладача: Франція — Париж(2), Італія — Рим(0), Польща — Варшава(3), Іспанія — Мадрид(1)
const room = (over = {}) => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: true },
  questions: [{ type: "matching", text: "Зіставте країни з їхніми столицями", lefts: ["Франція", "Італія", "Польща", "Іспанія"], options: ["Рим", "Мадрид", "Париж", "Варшава"] }],
  players: { p1: { nickname: "x", active: true } }, ...over });
const open = async (page, over) => {
  await seed(page, { rooms: { "12345678": room(over) } }, "");
  await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
};
const chip = (page, t) => page.locator("#answers-grid .mt-chip", { hasText: t });
const slotText = page => page.locator("#answers-grid .mt-row .mt-slot").allInnerTexts();

test("екран учня: ярлик, чотири пункти, слоти, банк варіантів, без кнопки підтвердження", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await expect(page.locator("#q-type-wrap")).toContainText("Зіставте пари");
  await expect(page.locator("#answers-grid .mt-row")).toHaveCount(4);
  await expect(page.locator("#answers-grid .mt-row .num")).toHaveText(["1", "2", "3", "4"]);
  await expect(page.locator("#answers-grid .mt-row .txt")).toHaveText(["Франція", "Італія", "Польща", "Іспанія"]);
  await expect(page.locator("#answers-grid .mt-row").first()).toHaveClass(/sel/);
  expect((await slotText(page))[0]).toContain("Оберіть відповідь");
  await expect(page.locator("#answers-grid .mt-chip")).toHaveText(["Рим", "Мадрид", "Париж", "Варшава"]);
  await expect(page.locator("#confirm-btn")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("торкання: відповідь стає в слот, вибір іде до наступного пункту, повний набір відкриває підтвердження й записується", async ({ page, errors }) => {
  await open(page);
  await chip(page, "Париж").click();
  expect((await slotText(page))[0]).toContain("Париж");
  await expect(page.locator("#answers-grid .mt-row").nth(1)).toHaveClass(/sel/);       // вибір пішов на наступний пункт
  await expect(chip(page, "Париж")).toBeDisabled();
  await chip(page, "Рим").click(); await chip(page, "Варшава").click();
  await expect(page.locator("#confirm-btn")).toBeHidden();                              // ще не всі
  await chip(page, "Мадрид").click();
  await expect(page.locator("#confirm-btn")).toBeVisible();
  await expect(page.locator("#confirm-btn")).toContainText("Підтвердити відповіді");
  await page.locator("#confirm-btn").click();
  await expect.poll(async () => JSON.stringify((await readDb(page)).rooms["12345678"].answers?.[0]?.p1?.value)).toBe(JSON.stringify([2, 0, 3, 1]));
  await expect(page.locator("#lock-banner")).toBeVisible();
  await expect(page.locator("#answers-grid .mt-chip")).toHaveCount(0);                  // банк зникає
  await expect(page.locator("#answers-grid .mt-slot").first()).toBeDisabled();
  expect(errors).toEqual([]);
});

test("прибрати відповідь: торкання заповненого слота звільняє варіант і вибирає цей пункт; клавіша з цифрою вибирає пункт", async ({ page, errors }) => {
  await open(page);
  await chip(page, "Париж").click(); await chip(page, "Рим").click();
  await page.locator("#answers-grid .mt-slot").nth(0).click();
  expect((await slotText(page))[0]).toContain("Оберіть відповідь");
  await expect(chip(page, "Париж")).toBeEnabled();
  await expect(page.locator("#answers-grid .mt-row").first()).toHaveClass(/sel/);
  await page.keyboard.press("4");
  await expect(page.locator("#answers-grid .mt-row").nth(3)).toHaveClass(/sel/);
  await chip(page, "Мадрид").click();
  expect((await slotText(page))[3]).toContain("Мадрид");
  // пункт, що вже має відповідь, можна замінити: вибрати його назву й торкнутися іншого варіанта
  await page.locator("#answers-grid .mt-row button.txt").nth(1).click();
  await chip(page, "Варшава").click();
  expect((await slotText(page))[1]).toContain("Варшава");
  expect(errors).toEqual([]);
});

test("після перезавантаження повертаються власні пари", async ({ page, errors }) => {
  await open(page, { answers: { 0: { p1: { value: [2, 0, 3, 1], answeredAt: Date.now() } } } });
  const t = await slotText(page);
  expect(t.map(x => x.trim())).toEqual(["Париж", "Рим", "Варшава", "Мадрид"]);
  await expect(page.locator("#lock-banner")).toBeVisible();
  expect(errors).toEqual([]);
});

test("розкриття: вірні пари зелені, хибні червоні з правильною відповіддю, пояснення без балів", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, { status: "reveal", revealed: { 0: { correct: [2, 0, 3, 1], at: Date.now() } },
    answers: { 0: { p1: { value: [2, 1, 3, 0], answeredAt: Date.now(), isCorrect: false, points: 0 } } } });
  await expect(page.locator("#answers-grid .mt-row.ok")).toHaveCount(2);
  await expect(page.locator("#answers-grid .mt-row.bad")).toHaveCount(2);
  await expect(page.locator("#answers-grid .mt-row").nth(1)).toContainText("Правильно: Рим");
  await expect(page.locator("#answers-grid .mt-row").nth(3)).toContainText("Правильно: Мадрид");
  await expect(page.locator("#feedback")).toContainText("Не зовсім");
  await expect(page.locator("#feedback")).toContainText("Правильно 2 з 4");
  await expect(page.locator("#answers-grid .mt-chip")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("розкриття: усі пари вірні — усі рядки зелені", async ({ page, errors }) => {
  await open(page, { status: "reveal", revealed: { 0: { correct: [2, 0, 3, 1], at: Date.now() } },
    answers: { 0: { p1: { value: [2, 0, 3, 1], answeredAt: Date.now(), isCorrect: true, points: 900 } } } });
  await expect(page.locator("#answers-grid .mt-row.ok")).toHaveCount(4);
  await expect(page.locator("#feedback")).toContainText("Правильно");
  expect(errors).toEqual([]);
});

test("ядро: оцінювання лише всіх пар, відбір питань і перемішування без пар навпроти", async ({ page, errors }) => {
  await page.goto("/404.html");
  const r = await page.evaluate(async () => {
    const m = await import("/live/live-core.js?v=17");
    const mk = (rights, correct, n = rights.length) => ({ type: "matching", pairs: Array.from({ length: n }, (_, i) => ({ left: "П" + i, options: rights, correct: correct[i] })) });
    const q = mk(["A", "B", "C", "D"], [2, 0, 3, 1]);
    const sh = m.shuffleMatching(q, "seed");
    const noIdentity = Array.from({ length: 200 }, (_, i) => m.shuffleMatching(mk(["A", "B"], [0, 1]), "z" + i)).every(x => !x.correct.every((v, k) => v === k));
    return {
      full: m.checkCorrect({ type: "matching" }, [2, 0, 3, 1], [2, 0, 3, 1]), swap: m.checkCorrect({ type: "matching" }, [2, 0, 3, 1], [0, 2, 3, 1]), short: m.checkCorrect({ type: "matching" }, [2, 0, 3, 1], [2, 0, 3]),
      ok: m.isLiveQuestion(q), seven: m.isLiveQuestion(mk(["1", "2", "3", "4", "5", "6", "7"], [0, 1, 2, 3, 4, 5, 6])), one: m.isLiveQuestion(mk(["A"], [0])),
      // кожна пара має власні варіанти (так створює конструктор): у гру йдуть правильні відповіді, хибні варіанти ігноруються
      extra: m.isLiveQuestion({ type: "matching", pairs: [{ left: "a", options: ["x", "y", "z"], correct: 0 }, { left: "b", options: ["x", "y", "z"], correct: 1 }] }),
      differ: m.isLiveQuestion({ type: "matching", pairs: [{ left: "a", options: ["x", "q", "w"], correct: 0 }, { left: "b", options: ["e", "r", "y"], correct: 2 }] }),
      sameAnswer: m.isLiveQuestion({ type: "matching", pairs: [{ left: "a", options: ["x", "q"], correct: 0 }, { left: "b", options: ["w", "x"], correct: 1 }] }),
      badCorrect: m.isLiveQuestion({ type: "matching", pairs: [{ left: "a", options: ["x", "q"], correct: 5 }, { left: "b", options: ["w", "x"], correct: 1 }] }),
      own: m.shuffleMatching({ type: "matching", pairs: [{ left: "a", options: ["x", "q", "w"], correct: 0 }, { left: "b", options: ["e", "r", "y"], correct: 2 }, { left: "c", options: ["k", "l"], correct: 1 }] }, "s9"),
      dup: m.isLiveQuestion(mk(["A", "B"], [0, 0])), emptyLeft: m.isLiveQuestion({ type: "matching", pairs: [{ left: "", options: ["x", "y"], correct: 0 }, { left: "b", options: ["x", "y"], correct: 1 }] }),
      restored: sh.correct.map(c => sh.options[c]).join(""), lefts: sh.lefts.join(), sorted: [...sh.options].sort().join(""), noIdentity, chip: m.typeChip("matching"), types: m.LIVE_TYPES };
  });
  expect(r.full).toBe(true); expect(r.swap).toBe(false); expect(r.short).toBe(false);
  expect(r.ok).toBe(true); expect(r.seven).toBe(false); expect(r.one).toBe(false); expect(r.extra).toBe(true); expect(r.differ).toBe(true); expect(r.sameAnswer).toBe(false); expect(r.badCorrect).toBe(false); expect(r.dup).toBe(false);
  expect(r.own.correct.map(c => r.own.options[c]).join("")).toBe("xyl"); expect([...r.own.options].sort().join("")).toBe("lxy"); expect(r.emptyLeft).toBe(false);
  expect(r.restored).toBe("CADB"); expect(r.lefts).toBe("П0,П1,П2,П3"); expect(r.sorted).toBe("ABCD"); expect(r.noIdentity).toBe(true);
  expect(r.chip).toContain("Зіставте пари"); expect(r.types).toContain("matching");
  expect(errors).toEqual([]);
});

test("малий екран, шість пар з довгими відповідями: банк варіантів не ховається під кнопкою підтвердження", async ({ page, errors }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await open(page, { questions: [{ type: "matching", text: "Зіставте історичні події з їхніми датами та коротким описом наслідків",
    lefts: ["Переяславська рада", "Хрещення Русі", "Битва під Крутами", "Незалежність України", "Чорнобильська катастрофа", "Помаранчева революція"],
    options: ["1654 рік, союз із Московським царством", "988 рік", "1918 рік", "1991 рік, референдум 1 грудня", "1986 рік", "2004 рік"] }] });
  for (const t of ["1654", "988", "1918", "1991", "1986", "2004"]) await chip(page, t).click();
  await expect(page.locator("#confirm-btn")).toBeVisible();
  await page.mouse.wheel(0, 3000); await page.waitForTimeout(300);
  const g = await page.evaluate(() => ({ bank: document.querySelector(".mt-bank").getBoundingClientRect().bottom, dock: document.querySelector("#confirm-btn").getBoundingClientRect().top, w: document.documentElement.scrollWidth - innerWidth }));
  expect(g.bank).toBeLessThanOrEqual(g.dock); expect(g.w).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});
