// Герої-аватари гравців: власні векторні малюнки в tests/scripts/avatars/chars.mjs (кожен: id, назва, колір плитки, функція малювання).
// Запуск: cd tests && npm run avatars
// Результат: assets/avatars/<id>.svg, live/avatars.js (герої) і live/accessories.js (убори й окуляри).
// Потім: підняти AV_V у live/live-core.js, скопіювати assets/avatars/*.svg і live/avatars.js у quizflow-app.
// Новий герой: додати рядок у CHARS у chars.mjs і виконати скрипт.
import fs from "node:fs";
import { CHARS, bodyOf } from "./avatars/chars.mjs";
import { HATS, GLASSES, FIT, HAT_FIT, TALL } from "./avatars/acc.mjs";
import { SC } from "./avatars/chars.mjs";

const ROOT = new URL("../../", import.meta.url);
const OUT = new URL("assets/avatars/", ROOT);
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".svg") || f.endsWith(".webp")) fs.rmSync(new URL(f, OUT));
const list = [];
for (const c of CHARS) {
  const [id, name, bg] = c;
  if (!/^[a-z0-9-]{1,24}$/.test(id)) throw new Error("Невірний id: " + id);
  fs.writeFileSync(new URL(id + ".svg", OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 8 176 176">${bodyOf(c)}</svg>\n`);
  list.push({ id, name, bg });
}
fs.writeFileSync(new URL("live/avatars.js", ROOT),
  "// Згенеровано: cd tests && npm run avatars. Не редагувати вручну.\nexport const AVATARS = " + JSON.stringify(list, null, 2) + ";\n");

// ── Аксесуари: окремі шматки SVG з унікальними id; розміщення на героя рахується у браузері ──
const uniq = (svg, p) => svg.replace(/id="(a\d+)"/g, `id="${p}-$1"`).replace(/url\(#(a\d+)\)/g, `url(#${p}-$1)`);
const ell = (cx, cy, rx, ry, f, x = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`;
const hats = HATS.map(([id, name, fn]) => {
  const [dy, sy, sw] = HAT_FIT[id] || [0, 0, 0];
  const shadow = sw ? ell(100, sy + 2, sw, 7, "#1B0F3A", 'opacity=".18"') : "";
  return { id, name, dy, tall: TALL.has(id), svg: uniq(shadow + fn(), "h-" + id) };
});
const glasses = GLASSES.map(([id, name, fn]) => ({ id, name, svg: uniq(fn(), "g-" + id) }));
fs.writeFileSync(new URL("live/accessories.js", ROOT),
  "// Згенеровано: cd tests && npm run avatars. Не редагувати вручну.\nexport const HATS = " + JSON.stringify(hats) + ";\nexport const GLASSES = " + JSON.stringify(glasses) + ";\nexport const FIT = " + JSON.stringify(FIT) + ";\nexport const SC = " + JSON.stringify(SC) + ";\n");
console.log("готово:", list.length, "героїв,", hats.length, "убрів,", glasses.length, "окулярів");
