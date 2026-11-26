// Вікно вибору героя на телефоні горизонтально: кнопка «Готово» і сітка героїв у межах екрана, нічого не обрізано
import { test, expect, seed } from "./fixtures.mjs";

const room = { status: "lobby", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T",
  questions: [{ type: "single", text: "Q", options: ["А", "Б"], correct: 0 }], players: { p1: { nickname: "Оля", active: true, avatar: "cat" } } };
for (const [w, h] of [[568, 320], [667, 375], [844, 390], [932, 430]]) {
  test(`вибір героя горизонтально ${w}×${h}: «Готово» видно, сітка має місце`, async ({ page, errors }) => {
    await page.setViewportSize({ width: w, height: h });
    await seed(page, { rooms: { "12345678": room } }, "");
    await page.goto("/live/play-student?code=12345678&pid=p1&nickname=%D0%9E%D0%BB%D1%8F"); await page.waitForTimeout(1200);
    await page.locator("#lo-change").click();
    const dlg = page.locator(".hp-back.open"); await expect(dlg).toBeVisible(); await page.waitForTimeout(450);
    const box = async sel => page.locator(sel).first().evaluate(e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; });
    const ok = await box('[data-r="ok"]'), grid = await box(".hp-scroll"), dlgBox = await box(".hp");
    expect(ok.b).toBeLessThanOrEqual(h); expect(ok.t).toBeGreaterThanOrEqual(0); expect(ok.h).toBeGreaterThanOrEqual(40);
    expect(dlgBox.b).toBeLessThanOrEqual(h + 1); expect(dlgBox.r).toBeLessThanOrEqual(w + 1); expect(dlgBox.l).toBeGreaterThanOrEqual(-1);
    expect(grid.h).toBeGreaterThanOrEqual(h * 0.55);                                   // сітка не лишилась смужкою
    for (const t of ["hero", "gls", "hat", "out"]) {
      await dlg.locator(`[data-tab="${t}"]`).click(); await page.waitForTimeout(250);
      const tile = await box(`[data-r="g-${t}"] .hp-t`); expect(tile.b).toBeGreaterThan(0); expect(tile.r).toBeLessThanOrEqual(w);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await dlg.locator('[data-r="ok"]').click(); await expect(page.locator(".hp-back.open")).toHaveCount(0);   // закрити вікно можна
    expect(errors).toEqual([]);
  });
}
