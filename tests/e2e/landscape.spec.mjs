// Телефон горизонтально: кнопки відповідей не схлопуються до смужок і не накладаються, горизонтального скролу немає
import { test, expect, seed } from "./fixtures.mjs";

const room = (q) => ({ status: "question", currentQ: 0, questionStartedAt: Date.now(), timePerQ: 60, scoring: "speed", testTitle: "T", options: { shuffle: false },
  questions: [q], players: { p1: { nickname: "x", active: true } } });
const Q = [
  { type: "single", text: "Яка столиця Франції?", options: ["Рим", "Париж", "Мадрид", "Берлін"] },
  { type: "multi", text: "Які з цих країн є в Європі?", options: ["Польща", "Японія", "Італія", "Бразилія"] },
  { type: "truefalse", text: "Вода кипить при 100 °C на рівні моря", options: ["Правда", "Неправда"] },
];
for (const [w, h] of [[844, 390], [667, 375], [568, 320]]) for (const q of Q) {
  test(`горизонтальний телефон ${w}×${h}: ${q.type} — кнопки відповідей читаються`, async ({ page, errors }) => {
    await page.setViewportSize({ width: w, height: h });
    await seed(page, { rooms: { "12345678": room(q) } }, "");
    await page.goto("/live/play-student?code=12345678&pid=p1&nickname=x"); await page.waitForTimeout(1200);
    const boxes = await page.locator("#answers-grid .ans").evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }));
    expect(boxes.length).toBe(q.options.length);
    for (const [, , bw, bh] of boxes) { expect(bh).toBeGreaterThanOrEqual(44); expect(bw).toBeGreaterThan(100); }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      expect(a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]).toBe(false);   // кнопки не накладаються
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
