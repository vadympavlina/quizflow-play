// Рушій героїв: форми описані один раз (ліва половина дзеркалиться), стиль A/B/C змінює лише заливку й обводку.
import fs from 'fs';
export const mirrorPath = (d) => d.replace(/([MLCQ])([^MLCQZ]*)/g, (m, c, args) => {
  const n = args.trim().split(/[\s,]+/).map(Number); for (let i = 0; i < n.length; i += 2) n[i] = +(200 - n[i]).toFixed(2);
  return c + n.join(' ');
});
const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (h, t, p) => { const a = hex(h), b = hex(t); return toHex(a.map((v, i) => v + (b[i] - v) * p)); };
const INK = '#3A2147';
export function pathPoints(d) {
  const out = []; let cur = [0, 0], start = [0, 0];
  const re = /([MLCQZ])([^MLCQZ]*)/g; let m;
  while ((m = re.exec(d))) {
    const c = m[1], n = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === 'M') { cur = [n[0], n[1]]; start = cur; out.push(cur); }
    else if (c === 'L') { cur = [n[0], n[1]]; out.push(cur); }
    else if (c === 'C') for (let i = 0; i + 5 < n.length + 0; i += 6) { const p0 = cur, p1 = [n[i], n[i + 1]], p2 = [n[i + 2], n[i + 3]], p3 = [n[i + 4], n[i + 5]]; for (let t = .1; t <= 1.001; t += .1) { const u = 1 - t; out.push([u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]); } cur = p3; }
    else if (c === 'Q') for (let i = 0; i + 3 < n.length + 0; i += 4) { const p0 = cur, p1 = [n[i], n[i + 1]], p2 = [n[i + 2], n[i + 3]]; for (let t = .1; t <= 1.001; t += .1) { const u = 1 - t; out.push([u*u*p0[0] + 2*u*t*p1[0] + t*t*p2[0], u*u*p0[1] + 2*u*t*p1[1] + t*t*p2[1]]); } cur = p2; }
    else if (c === 'Z') cur = start;
  }
  return out;
}

export let META = null;
export const meta = () => META;
export function render(spec, style) {
  const defs = []; let gid = 0; const grads = new Map();
  const dGrad = (c) => { // тонування у три ступені з чіткими межами (світло зліва-зверху)
    const k = 'd' + c; if (grads.has(k)) return grads.get(k);
    const id = 'g' + (gid++); grads.set(k, id);
    const lum = (hex(c)[0] * .3 + hex(c)[1] * .59 + hex(c)[2] * .11) / 255;
    const shade = lum > .72 ? mix(c, '#D79A74', .42) : mix(c, '#3a1740', .2), lit = mix(c, '#ffffff', .2);
    defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="78" cy="64" r="150"><stop offset="0" stop-color="${c}"/><stop offset=".69" stop-color="${c}"/><stop offset=".69" stop-color="${shade}"/><stop offset="1" stop-color="${shade}"/></radialGradient>`);
    return id;
  };
  const bGrad = (c) => { // глобальне світло зліва-зверху: однакове для всіх частин
    if (grads.has(c)) return grads.get(c);
    const id = 'g' + (gid++); grads.set(c, id);
    const lum = (hex(c)[0] * .3 + hex(c)[1] * .59 + hex(c)[2] * .11) / 255;
    const shade = lum > .72 ? mix(c, '#C98A63', .38) : mix(c, '#2a1030', .22);      // світлі кольори тінь тепла, а не сіра
    defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="72" cy="58" r="160"><stop offset="0" stop-color="${mix(c, '#ffffff', .3)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade}"/></radialGradient>`);
    return id;
  };
  const fillOf = (c) => style === 'B' ? `url(#${bGrad(c)})` : style === 'D' ? `url(#${dGrad(c)})` : c;
  const strokeOf = (w) => style === 'C' && w ? `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"` : '';
  let out = '';
  let META_ = null;
  const part = (p) => {
    const ds = p.m ? [p.d, mirrorPath(p.d)] : [p.d];
    for (const d of ds) out += p.stroke ? `<path d="${d}" fill="none" stroke="${style === 'C' ? INK : p.stroke.c}" stroke-width="${p.stroke.w}" stroke-linecap="round" stroke-linejoin="round" ${p.op ? `opacity="${p.op}"` : ''}/>` : `<path d="${d}" fill="${p.c === 'none' ? 'none' : fillOf(p.c)}" ${strokeOf(p.line ?? 0)} ${p.op ? `opacity="${p.op}"` : ''}/>`;
  };
  if (style === 'D') { // біла контурна обводка силуету, як у вирізаної наліпки (малюється під усім)
    for (const p of spec.parts) { if (p.c === 'none') continue; const ds = p.m ? [p.d, mirrorPath(p.d)] : [p.d]; for (const d of ds) out += `<path d="${d}" fill="#fff" stroke="#fff" stroke-width="15" stroke-linejoin="round"/>`; }
  }
  for (const p of spec.parts) part(p);
  // блиск на голові (лише B)
  if (style === 'D' && spec.gloss) out += `<path d="M${spec.gloss[0] - spec.gloss[2] * .8} ${spec.gloss[1] + 6} Q${spec.gloss[0] - spec.gloss[2] * .2} ${spec.gloss[1] - 9} ${spec.gloss[0] + spec.gloss[2] * .8} ${spec.gloss[1] - 6}" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" opacity=".55"/>`;
  if (style === 'B' && spec.gloss) out += `<ellipse cx="${spec.gloss[0]}" cy="${spec.gloss[1]}" rx="${spec.gloss[2]}" ry="${spec.gloss[3]}" fill="#fff" opacity=".3" filter="url(#bl)" transform="rotate(-14 ${spec.gloss[0]} ${spec.gloss[1]})"/>`;
  if (style === 'B') defs.push(`<filter id="bl" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3.4"/></filter><filter id="bb" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>`);
  // щоки
  for (const [x, y, r] of spec.blush || []) for (const X of [x, 200 - x]) out += style === 'D' ? `<circle cx="${X}" cy="${y}" r="${r}" fill="#FF8F7A" opacity=".5"/>` : style === 'B' ? `<ellipse cx="${X}" cy="${y}" rx="${r * 1.2}" ry="${r * .9}" fill="#FF8F7A" opacity=".5" filter="url(#bb)"/>` : `<circle cx="${X}" cy="${y}" r="${r}" fill="#FF9E8A" opacity="${style === 'C' ? .6 : .55}"/>`;
  // очі
  const e = spec.eyes;
  if (e) for (const X of [e.x, 200 - e.x]) {
    const sg = X < 100 ? 1 : -1; // дзеркало відблиску: світло завжди зліва-зверху, тож блиск зсунуто вліво на обох
    const hx = X + e.r * .32 - 0, hy = e.y - e.r * .38;
    if (style === 'C') out += `<ellipse cx="${X}" cy="${e.y - 2}" rx="${e.r * 1.12}" ry="${e.r * 1.3}" fill="#fff" ${strokeOf(3.5)}/><circle cx="${X + (X < 100 ? 2 : -2)}" cy="${e.y + 1}" r="${e.r * .68}" fill="${INK}"/><circle cx="${X + (X < 100 ? 5 : 1)}" cy="${e.y - 3}" r="${e.r * .26}" fill="#fff"/>`;
    else if (style === 'A' || style === 'D') out += `<circle cx="${X}" cy="${e.y}" r="${e.r}" fill="#2A1A3D"/><circle cx="${X + e.r * .34}" cy="${e.y - e.r * .38}" r="${e.r * .33}" fill="#fff"/><circle cx="${X - e.r * .3}" cy="${e.y + e.r * .38}" r="${e.r * .16}" fill="#fff"/>`;
    else { const gi = 'e' + (gid++); defs.push(`<radialGradient id="${gi}" cx=".36" cy=".3" r=".9"><stop offset="0" stop-color="#5E4380"/><stop offset="1" stop-color="#1E1030"/></radialGradient>`); out += `<circle cx="${X}" cy="${e.y}" r="${e.r}" fill="url(#${gi})"/><ellipse cx="${X + e.r * .36}" cy="${e.y - e.r * .4}" rx="${e.r * .4}" ry="${e.r * .34}" fill="#fff"/><circle cx="${X - e.r * .3}" cy="${e.y + e.r * .42}" r="${e.r * .18}" fill="#fff" opacity=".85"/>`; }
  }
  // брови лише в C
  if (style === 'C' && spec.brows) for (const X of [spec.eyes.x, 200 - spec.eyes.x]) out += `<path d="M${X - 14} ${spec.eyes.y - 22} Q${X} ${spec.eyes.y - 30} ${X + 14} ${spec.eyes.y - 22}" fill="none" ${strokeOf(4)}/>`;
  // ніс і рот
  for (const f of spec.face || []) {
    if (f.k === 'line') for (const d of f.m ? [f.d, mirrorPath(f.d)] : [f.d]) out += `<path d="${d}" fill="none" stroke="${f.c || '#2A1A3D'}" stroke-width="${f.w || 3}" stroke-linecap="round" stroke-linejoin="round" ${f.op ? `opacity="${f.op}"` : ''}/>`;
    if (f.k === 'shape' && f.m) out += `<path d="${mirrorPath(f.d)}" fill="${f.flat ? f.c : fillOf(f.c)}"/>`;
    if (f.k === 'nose' && f.c) out += `<path d="${f.d}" fill="${fillOf(f.c)}"/>`; else
    if (f.k === 'nose') out += style === 'C' ? `<path d="${f.d}" fill="${INK}" ${strokeOf(2.5)}/>` : `<path d="${f.d}" fill="${style === 'B' ? `url(#${bGrad('#3A2147')})` : '#2A1A3D'}"/>`;
    if (f.k === 'mouth') out += `<path d="${f.d}" fill="none" stroke="${style === 'C' ? INK : '#2A1A3D'}" stroke-width="${style === 'C' ? 3.6 : 3.2}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (f.k === 'shape') out += `<path d="${f.d}" fill="${f.c === 'none' ? 'none' : f.flat ? f.c : fillOf(f.c)}" ${strokeOf(f.line ?? 0)}/>`;
  }
  // нормалізація: центр між силуетом і лінією очей, масштаб так, щоб усе вмістилось у безпечне коло медальйона
  const pts = []; const addPath = (d) => pathPoints(d).forEach(p => pts.push(p));
  for (const p of spec.parts) { if (p.stroke) continue; addPath(p.d); if (p.m) addPath(mirrorPath(p.d)); }
  for (const f of spec.face || []) if (f.k === 'shape') { addPath(f.d); if (f.m) addPath(mirrorPath(f.d)); }
  if (e) for (const X of [e.x, 200 - e.x]) { pts.push([X - e.r, e.y - e.r], [X + e.r, e.y + e.r]); }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const bx = (Math.min(...xs) + Math.max(...xs)) / 2, byb = (Math.min(...ys) + Math.max(...ys)) / 2;
  const eyeY = e ? e.y : byb; const cy0 = byb * (spec.centerBias ?? .55) + eyeY * (1 - (spec.centerBias ?? .55)), cx0 = 100;
  const rOf = (arr) => Math.max(...arr.map(p => Math.hypot(p[0] - cx0, p[1] - cy0)));
  const headPts = []; for (const p of spec.parts) if (p.head && !p.stroke) { pathPoints(p.d).forEach(q => headPts.push(q)); if (p.m) pathPoints(mirrorPath(p.d)).forEach(q => headPts.push(q)); }
  const Rall = rOf(pts), Rhead = headPts.length ? rOf(headPts) : Rall;
  // голова займає «цільове» коло, а виступи (роги, вуха, антени) лише не мають виходити за безпечне
  const k = Math.max(.6, Math.min(1.2, (spec.target ?? 78) / Rhead, (spec.safe ?? 86) / Rall));
  META = { k, cx: cx0, cy: cy0, eyeY: 96 + (eyeY - cy0) * k, eyeSpan: e ? 2 * (100 - e.x) * k : 60, top: 96 + (Math.min(...ys) - cy0) * k, width: (Math.max(...xs) - Math.min(...xs)) * k };
  const wrapN = `<g transform="translate(100 96) scale(${k.toFixed(4)}) translate(${-cx0} ${-cy0.toFixed(2)})">${style === 'D' ? out : out}</g>`;
  out = wrapN;
  const wrapG = style === 'D' ? `<g transform="translate(100 96) scale(.9) translate(-100 -96)">${out}</g>` : out;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 8 176 176"><defs>${defs.join('')}</defs>${wrapG}</svg>`;
}

export const FOX = {
  gloss: [76, 66, 30, 11], blush: [[46, 134, 9]], brows: true,
  eyes: { x: 70, y: 110, r: 11.5 },
  parts: [
    { d: 'M36 88 Q26 46 40 18 Q46 13 53 19 L92 56 Z', c: '#F26B21', m: true, line: 5 },
    { d: 'M48 80 Q42 50 47 34 L76 58 Z', c: '#FFE0C6', m: true, line: 3.2 },
    { d: 'M100 44 C146 44 176 72 178 112 C180 142 146 168 100 168 C54 168 20 142 22 112 C24 72 54 44 100 44Z', c: '#FF8A3D', line: 5 },
    { d: 'M23 116 C44 110 72 124 100 158 C128 124 156 110 177 116 C174 144 144 168 100 168 C56 168 26 144 23 116Z', c: '#FFF3E4', line: 0 },
    { d: 'M23 116 C44 110 72 124 100 158 C128 124 156 110 177 116', c: 'none', line: 5 },
  ],
  face: [{ k: 'nose', d: 'M90 144 Q100 139 110 144 Q110 152 100 157 Q90 152 90 144Z' }, { k: 'mouth', d: 'M90 161 Q95 166 100 161 Q105 166 110 161' }],
};
export const BEAR = {
  gloss: [76, 66, 32, 11], blush: [[44, 136, 9]], brows: true,
  eyes: { x: 68, y: 108, r: 10.5 },
  parts: [
    { d: 'M26 52 C26 32 50 24 66 36 C76 44 78 58 74 66 L38 70 C30 66 26 60 26 52Z', c: '#A86A3E', m: true, line: 5 },
    { d: 'M38 52 C38 42 52 38 60 46 C64 52 64 58 62 60 L44 62 C40 60 38 56 38 52Z', c: '#E8B88E', m: true, line: 0 },
    { d: 'M100 42 C146 42 178 72 178 114 C178 146 146 168 100 168 C54 168 22 146 22 114 C22 72 54 42 100 42Z', c: '#B9784A', line: 5 },
    { d: 'M100 112 C128 112 142 128 142 144 C142 160 124 168 100 168 C76 168 58 160 58 144 C58 128 72 112 100 112Z', c: '#F4D8B4', line: 5 },
  ],
  face: [{ k: 'nose', d: 'M88 128 Q100 120 112 128 Q112 138 100 143 Q88 138 88 128Z' }, { k: 'mouth', d: 'M100 143 L100 150 M90 154 Q95 160 100 150 Q105 160 110 154' }],
};
export const OWL = {
  gloss: [76, 62, 32, 11], blush: [[46, 142, 8]], brows: false,
  eyes: { x: 70, y: 106, r: 13 },
  parts: [
    { d: 'M34 78 Q26 42 34 20 Q40 16 46 22 L84 52 Z', c: '#8A5A33', m: true, line: 5 },
    { d: 'M100 40 C148 40 178 70 178 112 C178 148 146 170 100 170 C54 170 22 148 22 112 C22 70 52 40 100 40Z', c: '#B5804F', line: 5 },
    { d: 'M100 104 C122 112 142 124 150 146 C140 164 122 170 100 170 C78 170 60 164 50 146 C58 124 78 112 100 104Z', c: '#F2DBB8', line: 0 },
    { d: 'M70 70 C92 70 104 88 104 106 C104 126 90 138 70 138 C50 138 36 126 36 106 C36 88 48 70 70 70Z', c: '#FFF3DE', m: true, line: 4 },
  ],
  face: [{ k: 'shape', d: 'M90 118 Q100 108 110 118 Q108 134 100 144 Q92 134 90 118Z', c: '#FFA42B', line: 4 }],
};
export function writeAll(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [id, sp] of Object.entries({ fox: FOX, bear: BEAR, owl: OWL })) for (const st of ['A', 'B', 'C', 'D']) fs.writeFileSync(`${dir}/${id}-${st}.svg`, render(sp, st));
}
