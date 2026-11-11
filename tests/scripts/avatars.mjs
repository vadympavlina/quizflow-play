// Герої-аватари гравців: власні векторні малюнки в tests/scripts/avatars/chars.mjs (кожен: id, назва, колір плитки, функція малювання).
// Запуск: cd tests && npm run avatars
// Результат: assets/avatars/<id>.svg і live/avatars.js (список для сторінок гри).
// Потім: підняти AV_V у live/live-core.js, скопіювати assets/avatars/*.svg і live/avatars.js у quizflow-app.
// Новий герой: додати рядок у CHARS у chars.mjs і виконати скрипт.
import fs from "node:fs";
import { CHARS, bodyOf } from "./avatars/chars.mjs";

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
console.log("готово:", list.length, "героїв");
