// Герої-аватари гравців: власні векторні малюнки (стиль «глина»), їх описано в tests/scripts/avatars/heroes.mjs.
// Запуск: cd tests && npm run avatars
// Результат: assets/avatars/<id>.svg, live/avatars.js (герої) і live/accessories.js (окуляри, капелюхи, одяг + дані підгонки на кожного героя).
// Потім: підняти AV_V у live/live-core.js, скопіювати assets/avatars/*.svg, live/avatars.js і live/accessories.js у quizflow-app.
// Новий герой: додати його опис у HEROES (heroes.mjs) і рядок у LIST (names.mjs).
import fs from "node:fs";
import { render, meta, pathPoints } from "./avatars/engine.mjs";
import { HEROES } from "./avatars/heroes.mjs";
import { LIST, HAT_OV } from "./avatars/names.mjs";
import { GLASSES } from "./avatars/glasses.mjs";
import { HATS } from "./avatars/hats.mjs";
import { CLOTHES } from "./avatars/clothes.mjs";

const ROOT = new URL("../../", import.meta.url);
const OUT = new URL("assets/avatars/", ROOT);
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".svg") || f.endsWith(".webp")) fs.rmSync(new URL(f, OUT));
const r2 = (n) => +n.toFixed(2);
const list = [], HF = {};
for (const [id, name, bg] of LIST) {
  if (!/^[a-z0-9-]{1,24}$/.test(id)) throw new Error("Невірний id: " + id);
  const spec = HEROES[id];
  if (!spec) throw new Error("Немає опису героя: " + id);
  fs.writeFileSync(new URL(id + ".svg", OUT), render(spec, "B") + "\n");
  const m = meta();
  const T = (x, y) => [100 + (x - m.cx) * m.k, 96 + (y - m.cy) * m.k];
  const pts = []; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, full = -1e9;
  for (const p of spec.parts) for (const [x, y] of pathPoints(p.d)) {
    const [X, Y] = T(x, y); full = Math.max(full, Y);
    if (p.head) { pts.push([X, Y]); x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); }
  }
  const topAt = (x) => { let r = 1e9; for (const [X, Y] of pts) if (Math.abs(X - x) < 2.5 && Y < r) r = Y; return r === 1e9 ? y0 + 20 : r; };
  const ht = []; for (let dx = 0; dx <= 90; dx += 5) ht.push(r2(Math.max(topAt(100 + dx), topAt(100 - dx))));
  // eyeY/eyeSpan — де очі; eyeTop — верх очей; top/w/bottom — голова; full — найнижча точка героя; ovTop — найвища (з вухами); ht — нижня межа капелюха на відстані 0,5,…,90 від центру
  HF[id] = { eyeY: r2(m.eyeY), eyeSpan: r2(m.eyeSpan), eyeTop: r2(m.eyeY - 11 * m.k), top: r2(y0), w: r2(x1 - x0), bottom: r2(y1), full: r2(full), ovTop: r2(m.top), ht };
  list.push({ id, name, bg });
}
fs.writeFileSync(new URL("live/avatars.js", ROOT),
  "// Згенеровано: cd tests && npm run avatars. Не редагувати вручну.\nexport const AVATARS = " + JSON.stringify(list, null, 2) + ";\n");
const glasses = GLASSES.map(({ id, name, svg }) => ({ id, name, svg }));
const hats = HATS.map(({ id, name, hw, y1, top, t, sink, svg }) => ({ id, name, hw, y1, top, t, sink, svg }));
const clothes = CLOTHES.map(({ id, name, fit, back, front }) => ({ id, name, fit, back, front }));
for (const x of [...glasses, ...hats, ...clothes]) if (!/^[a-z0-9-]{1,24}$/.test(x.id)) throw new Error("Невірний id: " + x.id);
fs.writeFileSync(new URL("live/accessories.js", ROOT),
  "// Згенеровано: cd tests && npm run avatars. Не редагувати вручну.\n"
  + "export const GLASSES = " + JSON.stringify(glasses) + ";\n"
  + "export const HATS = " + JSON.stringify(hats) + ";\n"
  + "export const CLOTHES = " + JSON.stringify(clothes) + ";\n"
  + "export const HF = " + JSON.stringify(HF) + ";\n"
  + "export const HAT_OV = " + JSON.stringify(HAT_OV) + ";\n");
console.log("готово:", list.length, "героїв,", glasses.length, "окулярів,", hats.length, "капелюхів,", clothes.length, "одягу");
