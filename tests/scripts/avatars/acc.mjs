// Аксесуари: координати героя 200x200, голова ~ (100,106), очі на y≈100 (±28), чоло ~ y 50.
let A = 0; const aid = () => "a" + (A++);
const INK = "#2A1740";
const ell = (cx, cy, rx, ry, f, x = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`;
const pth = (d, f, x = "") => `<path d="${d}" fill="${f}" ${x}/>`;
function celP(d, base, dark, shift = [-4, -5]) { const id = aid(); return `<clipPath id="${id}"><path d="${d}"/></clipPath>${pth(d, dark)}<g clip-path="url(#${id})"><path d="${d}" fill="${base}" transform="translate(${shift[0]} ${shift[1]})"/></g>`; }
const shine = (d) => pth(d, "#fff", 'opacity=".45"');

export const HATS = [
 ["crown", "Корона", () => celP("M58 62 L62 28 L82 48 L100 20 L118 48 L138 28 L142 62Q100 70 58 62Z", "#FFD43B", "#E0A60F") + ell(100, 38, 6, 6, "#FF4F7B") + ell(66, 42, 4, 4, "#4FC3F7") + ell(134, 42, 4, 4, "#4FC3F7") + pth("M64 56 Q100 64 136 56", "none", 'stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"')],
 ["cowboy", "Ковбой", () => celP("M24 66 Q40 78 70 66 L74 38 Q100 24 126 38 L130 66 Q160 78 176 66 Q164 88 100 86 Q36 88 24 66Z", "#B9772F", "#8E5518") + pth("M74 62 Q100 70 126 62 L126 54 Q100 62 74 54Z", "#6B3A12") + ell(100, 58, 6, 4.5, "#FFD43B")],
 ["wizard", "Чарівник", () => celP("M52 74 Q64 62 100 62 Q136 62 148 74 Q140 82 100 82 Q60 82 52 74Z", "#6B4EE0", "#4A33B0") + celP("M72 66 Q84 30 108 4 Q116 36 128 66Q100 74 72 66Z", "#7F63F2", "#5A40C8") + ell(104, 40, 5, 5, "#FFD43B") + ell(92, 54, 3, 3, "#FFD43B") + `<path d="M108 4 L112 -2" stroke="#FFD43B" stroke-width="3"/>`],
 ["grad", "Випускник", () => pth("M30 52 L100 30 L170 52 L100 74Z", "#2B2B4A") + pth("M70 62 L70 78 Q100 90 130 78 L130 62 L100 74Z", "#3D3D66") + `<path d="M100 52 L160 58 L160 78" stroke="#FFD43B" stroke-width="3" fill="none" stroke-linecap="round"/>` + ell(160, 80, 4, 6, "#FFD43B")],
 ["santa", "Ковпак", () => celP("M52 76 Q60 30 100 26 Q140 30 148 76Q100 86 52 76Z", "#E8352E", "#B81E1A") + ell(100, 20, 11, 11, "#fff", 'stroke="#E7E1F0" stroke-width="2"') + celP("M46 74 Q100 92 154 74 L154 88 Q100 106 46 88Z", "#FFFFFF", "#DCD3EA")],
 ["beanie", "Шапка", () => celP("M54 80 Q52 34 100 30 Q148 34 146 80Q100 92 54 80Z", "#2FA8E0", "#1D80B0") + `<path d="M66 70 Q66 48 80 40 M86 70 Q86 42 100 38 M106 70 Q106 42 114 38 M126 70 Q128 48 136 44" stroke="#fff" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/>` + celP("M52 78 Q100 92 148 78 L148 92 Q100 106 52 92Z", "#F2F6FB", "#C9D3E3") + ell(100, 26, 10, 10, "#FF4F7B")],
 ["bow", "Бант", () => celP("M100 56 Q62 28 56 52 Q54 72 100 62Z", "#FF5FA2", "#D9387F") + celP("M100 56 Q138 28 144 52 Q146 72 100 62Z", "#FF5FA2", "#D9387F") + ell(100, 58, 10, 9, "#FF86BC", 'stroke="#D9387F" stroke-width="2"')],
 ["halo", "Німб", () => ell(100, 30, 36, 10, "none", 'stroke="#FFD43B" stroke-width="8"') + ell(100, 30, 36, 10, "none", 'stroke="#fff" stroke-opacity=".5" stroke-width="2.5" transform="translate(0 -2)"')],
 ["horns", "Ріжки", () => celP("M60 66 Q40 44 52 24 Q70 36 80 58Z", "#E8352E", "#B81E1A") + celP("M140 66 Q160 44 148 24 Q130 36 120 58Z", "#E8352E", "#B81E1A")],
 ["headphones", "Навушники", () => `<path d="M42 110 Q40 40 100 38 Q160 40 158 110" stroke="#3B3F5C" stroke-width="9" fill="none" stroke-linecap="round"/>` + celP("M28 96 Q28 86 40 86 Q52 86 52 96 L52 124 Q52 134 40 134 Q28 134 28 124Z", "#FF5F7E", "#D13A5A") + celP("M172 96 Q172 86 160 86 Q148 86 148 96 L148 124 Q148 134 160 134 Q172 134 172 124Z", "#FF5F7E", "#D13A5A")],
 ["pirate", "Піратка", () => celP("M36 78 Q44 40 100 36 Q156 40 164 78 Q100 70 36 78Z", "#2B2B3A", "#15151F") + celP("M36 76 Q100 68 164 76 L164 88 Q100 80 36 88Z", "#C9302C", "#9A1F1C") + `<path d="M78 52 Q100 44 122 52" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>` + ell(100, 54, 9, 9, "#fff") + `<path d="M95 49 L105 59 M105 49 L95 59" stroke="#2B2B3A" stroke-width="2.4" stroke-linecap="round"/>`],
];
export const GLASSES = [
 ["round", "Круглі", () => `<circle cx="72" cy="100" r="22" fill="#9DDBFF" fill-opacity=".28" stroke="#2A1740" stroke-width="5"/><circle cx="128" cy="100" r="22" fill="#9DDBFF" fill-opacity=".28" stroke="#2A1740" stroke-width="5"/><path d="M94 98 Q100 92 106 98" stroke="#2A1740" stroke-width="5" fill="none"/><path d="M50 98 L34 92 M150 98 L166 92" stroke="#2A1740" stroke-width="5" stroke-linecap="round"/>` + `<path d="M58 90 Q64 84 72 84" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M114 90 Q120 84 128 84" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`],
 ["sun", "Сонцезахисні", () => celP("M46 88 Q46 84 52 84 L92 84 Q98 84 98 90 Q96 118 72 118 Q50 118 46 88Z", "#2B2B3A", "#15151F") + celP("M102 90 Q102 84 108 84 L148 84 Q154 84 154 88 Q150 118 128 118 Q104 118 102 90Z", "#2B2B3A", "#15151F") + `<path d="M98 90 L102 90" stroke="#15151F" stroke-width="5"/><path d="M48 90 L34 86 M152 90 L166 86" stroke="#15151F" stroke-width="5" stroke-linecap="round"/><path d="M58 92 L74 92 M112 92 L128 92" stroke="#fff" stroke-opacity=".4" stroke-width="3.5" stroke-linecap="round"/>`],
 ["hearts", "Серця", () => pth("M72 118 Q44 100 50 86 Q58 74 72 86 Q86 74 94 86 Q100 100 72 118Z", "#FF4F7B", 'stroke="#C42B55" stroke-width="4" stroke-linejoin="round"') + pth("M128 118 Q100 100 106 86 Q114 74 128 86 Q142 74 150 86 Q156 100 128 118Z", "#FF4F7B", 'stroke="#C42B55" stroke-width="4" stroke-linejoin="round"') + `<path d="M94 92 L106 92" stroke="#C42B55" stroke-width="4"/><path d="M52 90 L36 86 M148 90 L164 86" stroke="#C42B55" stroke-width="4" stroke-linecap="round"/>` + `<path d="M60 90 Q64 86 70 88" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`],
 ["star", "Зірки", () => { const star = (cx, cy) => pth(`M${cx} ${cy - 25} L${cx + 7} ${cy - 8} L${cx + 25} ${cy - 8} L${cx + 11} ${cy + 3} L${cx + 16} ${cy + 22} L${cx} ${cy + 11} L${cx - 16} ${cy + 22} L${cx - 11} ${cy + 3} L${cx - 25} ${cy - 8} L${cx - 7} ${cy - 8}Z`, "#FFD43B", 'stroke="#C98F0C" stroke-width="4" stroke-linejoin="round"'); return star(70, 100) + star(130, 100) + `<path d="M92 98 L108 98" stroke="#C98F0C" stroke-width="4"/>`; }],
 ["nerd", "Розумник", () => `<rect x="46" y="82" width="46" height="36" rx="8" fill="#9DDBFF" fill-opacity=".25" stroke="#7A3E12" stroke-width="5"/><rect x="108" y="82" width="46" height="36" rx="8" fill="#9DDBFF" fill-opacity=".25" stroke="#7A3E12" stroke-width="5"/><path d="M92 94 L108 94" stroke="#7A3E12" stroke-width="5"/><path d="M46 92 L32 88 M154 92 L168 88" stroke="#7A3E12" stroke-width="5" stroke-linecap="round"/><path d="M54 90 L66 90 M116 90 L128 90" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>`],
 ["d3", "3D", () => `<rect x="44" y="84" width="48" height="34" rx="6" fill="#FF3B3B" fill-opacity=".75" stroke="#2A1740" stroke-width="5"/><rect x="108" y="84" width="48" height="34" rx="6" fill="#2BC4FF" fill-opacity=".75" stroke="#2A1740" stroke-width="5"/><path d="M92 96 L108 96" stroke="#2A1740" stroke-width="5"/><path d="M44 94 L32 90 M156 94 L168 90" stroke="#2A1740" stroke-width="5" stroke-linecap="round"/>`],
];

// [dy, висота тіні під капелюхом, ширина тіні] — де нижній край убору сідає на голову
export const HAT_FIT = { crown: [-6, 70, 44], cowboy: [-16, 74, 56], wizard: [-14, 70, 46], grad: [-12, 66, 48], santa: [-22, 66, 50], beanie: [-24, 66, 50], bow: [-8, 0, 0], halo: [-2, 0, 0], horns: [-6, 0, 0], headphones: [2, 0, 0], pirate: [-18, 68, 56] };
// Підгонка під кожного героя: капелюх [dx, dy, scale], окуляри [dx, dy, scale] (у координатах героя до масштабування плитки)
export const FIT = {
  cat: { hat: [0, 0, 1], gl: [0, 0, 1] }, dog: { hat: [0, 0, 1], gl: [0, 0, 1] }, bear: { hat: [0, 0, 1], gl: [0, 0, 1] },
  panda: { hat: [0, 0, 1], gl: [0, 0, 1] }, fox: { hat: [0, 0, 1], gl: [0, 0, 1] }, bunny: { hat: [0, 8, .95], gl: [0, 6, 1] },
  wolf: { hat: [0, 0, 1], gl: [0, 0, 1] }, raccoon: { hat: [0, 0, 1], gl: [0, -2, .94] }, lion: { hat: [0, 4, .9], gl: [0, 2, .86] },
  tiger: { hat: [0, 0, 1], gl: [0, 0, 1] }, koala: { hat: [0, 0, 1], gl: [0, 2, .92] }, pig: { hat: [0, 0, 1], gl: [0, 0, 1] },
  monkey: { hat: [0, 0, 1], gl: [0, 1, 1] }, frog: { hat: [0, 18, .62], gl: [0, -38, 1.18] }, owl: { hat: [0, 0, 1], gl: [0, -2, 1.18] },
  penguin: { hat: [0, 0, 1], gl: [0, 4, 1] }, chick: { hat: [0, 0, 1], gl: [0, 0, 1] }, unicorn: { hat: [0, 6, .86], gl: [0, 6, 1] },
  dragon: { hat: [0, 0, 1], gl: [0, 0, 1] }, monster: { hat: [0, -12, 1], gl: [0, -4, 1] }, alien: { hat: [0, 0, 1], gl: [0, 0, 1.2] },
  robot: { hat: [0, 4, .94], gl: [0, -10, .84] }, ghost: { hat: [0, -4, 1], gl: [0, 0, 1] }, hamster: { hat: [0, 6, .96], gl: [0, 2, 1] },
};
const place = (f, body) => { const [dx, dy, s] = f; return `<g transform="translate(${100 + dx} ${100 + dy}) scale(${s}) translate(-100 -100)">${body}</g>`; };
export function dressExtra(charId, hatId, glId) {
  const f = FIT[charId] || { hat: [0, 0, 1], gl: [0, 0, 1] };
  let out = "";
  if (glId) out += place(f.gl, GLASSES.find(h => h[0] === glId)?.[2]() || "");
  if (hatId) {
    const h = HATS.find(x => x[0] === hatId); if (h) {
      const [dy, sy, sw] = HAT_FIT[hatId] || [0, 0, 0];
      const shadow = sw ? ell(100, sy + 2, sw, 7, "#1B0F3A", 'opacity=".18"') : "";
      out += place([f.hat[0], f.hat[1] + dy, f.hat[2]], shadow + h[2]());
    }
  }
  return out;
}
export const hatOf = (id) => HATS.find(h => h[0] === id)?.[2]() || "";
export const glassesOf = (id) => GLASSES.find(h => h[0] === id)?.[2]() || "";


// Високі убори потребують запасу зверху: тоді вікно (viewBox) ширше
export const TALL = new Set(["wizard", "crown", "grad", "santa", "beanie", "halo", "pirate", "cowboy", "horns"]);
export const viewBoxFor = (hatId) => TALL.has(hatId) ? "0 -22 200 200" : "12 8 176 176";
