// Капелюхи v2: без обводок, градієнти + відблиски (як у героїв). Центр x=100, низ — y1. id градієнтів фіксовані (однакові на сторінці — безпечно).
const lg = (id, a, b, c, x2 = 0.5, y2 = 1) => `<linearGradient id="hg-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
const rg = (id, a, b) => `<radialGradient id="hg-${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const F = (id) => `fill="url(#hg-${id})"`;
const gloss = (d, w = 4, op = .55) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
const mir = (s) => `${s}<g transform="translate(200 0) scale(-1 1)">${s}</g>`;
const gem = (x, y, r, id) => `<circle cx="${x}" cy="${y}" r="${r}" ${F(id)}/><circle cx="${x - r * .3}" cy="${y - r * .35}" r="${r * .32}" fill="#fff" fill-opacity=".8"/>`;

export const HATS = [
  { id: 'crown', name: 'Корона', hw: 44, y1: 106, top: 34, t: .62, sink: 0, svg: `<defs>${lg('gold', '#FFE98A', '#FFC72A', '#E39410')}${rg('ruby', '#FF8FA6', '#E0264D')}${rg('sap', '#9BDCFF', '#2B86E0')}${rg('pearl', '#FFFFFF', '#FFD3E0')}</defs>
<path d="M58 104 Q54 102 55 96 L54 60 Q54 52 61 56 L80 72 Q87 76 90 68 L96 50 Q100 43 104 50 L110 68 Q113 76 120 72 L139 56 Q146 52 146 60 L145 96 Q146 102 142 104 Q100 114 58 104Z" ${F('gold')}/>
<path d="M55 90 Q100 102 145 90 L145 96 Q146 102 142 104 Q100 114 58 104 Q54 102 55 96Z" fill="#B87408" fill-opacity=".28"/>
${gem(100, 92, 6, 'ruby')}${gem(76, 90, 4.4, 'sap')}${gem(124, 90, 4.4, 'sap')}
<circle cx="59" cy="53" r="6" ${F('pearl')}/><circle cx="100" cy="42" r="6.4" ${F('pearl')}/><circle cx="141" cy="53" r="6" ${F('pearl')}/>
${gloss('M62 66 L61 84', 3.5, .6)}${gloss('M91 62 L97 50', 3, .5)}` },
  { id: 'cowboy', name: 'Ковбой', hw: 70, y1: 108, top: 44, t: .98, sink: 0, svg: `<defs>${lg('tan', '#E6B26A', '#C08240', '#8F5A26')}${lg('brim', '#D79C55', '#AD7336', '#7E4E20')}${lg('strap', '#7A4A24', '#5A3418', '#3E2410')}</defs>
<path d="M68 100 Q64 66 72 56 Q80 46 100 52 Q120 46 128 56 Q136 66 132 100Z" ${F('tan')}/>
<path d="M84 52 Q100 62 116 52" fill="none" stroke="#7E4E20" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>
<path d="M68 86 Q100 96 132 86 L132 99 Q100 109 68 99Z" ${F('strap')}/><rect x="94" y="88" width="12" height="11" rx="3.5" fill="#FFD34A"/><rect x="97" y="91" width="6" height="5" rx="2" fill="#B9760C"/>
<path d="M28 84 Q32 108 100 108 Q168 108 172 84 Q168 76 158 84 Q140 98 100 98 Q60 98 42 84 Q32 76 28 84Z" ${F('brim')}/>
${gloss('M78 60 Q90 52 104 54', 4, .4)}${gloss('M44 90 Q60 102 88 104', 3, .3)}` },
  { id: 'wizard', name: 'Чарівник', hw: 52, y1: 110, top: 6, t: .66, sink: 0, svg: `<defs>${lg('vio', '#9C86FF', '#6B52E6', '#3D2AA6')}${lg('vio2', '#7C66F2', '#5440CC', '#33228A')}${lg('gold2', '#FFE98A', '#FFC72A', '#E39410')}</defs>
<path d="M62 102 Q72 72 82 46 Q90 22 110 12 Q120 8 119 15 Q112 24 115 36 Q122 64 140 102Z" ${F('vio')}/>
<ellipse cx="100" cy="102" rx="54" ry="10" ${F('vio2')}/>
<path d="M62 94 Q100 108 140 94 L141 102 Q100 116 61 102Z" ${F('gold2')}/>
<path d="M92 56 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6z" fill="#FFE98A"/><circle cx="108" cy="42" r="3" fill="#FFE98A"/><circle cx="84" cy="80" r="2.6" fill="#FFE98A" fill-opacity=".9"/>
${gloss('M86 40 Q80 60 72 84', 3.5, .45)}` },
  { id: 'grad', name: 'Випускник', hw: 66, y1: 106, top: 46, t: .92, sink: 0, svg: `<defs>${lg('nv', '#5A58A8', '#3A3874', '#25234F')}${lg('nv2', '#33316A', '#25234F', '#18163A')}${lg('gt', '#FFE98A', '#FFC72A', '#E39410')}</defs>
<path d="M72 84 L72 98 Q100 114 128 98 L128 84Z" ${F('nv2')}/>
<path d="M34 78 Q34 83 40 85 L96 103 Q100 104 104 103 L160 85 Q166 83 166 78 L166 72 Q166 68 160 66 L104 47 Q100 46 96 47 L40 66 Q34 68 34 72Z" fill="#18163A"/>
<path d="M34 72 Q34 76 40 78 L96 96 Q100 97 104 96 L160 78 Q166 76 166 72 Q166 68 160 66 L104 48 Q100 47 96 48 L40 66 Q34 68 34 72Z" ${F('nv')}/>
${gloss('M48 70 L92 55', 3.5, .32)}
<path d="M100 72 Q128 72 148 80" fill="none" stroke="#FFC72A" stroke-width="3.2" stroke-linecap="round"/><circle cx="100" cy="72" r="4.6" ${F('gt')}/>
<path d="M143 82 L153 82 L155 102 Q148 107 141 102Z" ${F('gt')}/><circle cx="148" cy="82" r="3.6" ${F('gt')}/>` },
  { id: 'santa', name: 'Ковпак', hw: 56, y1: 110, top: 28, t: .74, sink: 0, svg: `<defs>${lg('red', '#FF7A6B', '#E5372F', '#A91F22')}${lg('fur', '#FFFFFF', '#F6F2FC', '#D6CCE8')}${rg('pom', '#FFFFFF', '#DCD2EE')}</defs>
<path d="M56 98 Q52 52 98 42 Q148 50 146 98Z" ${F('red')}/>
<path d="M50 92 Q50 82 62 82 L138 82 Q150 82 150 92 L150 100 Q150 110 138 110 L62 110 Q50 110 50 100Z" ${F('fur')}/>
<circle cx="66" cy="110" r="0" fill="none"/>
<circle cx="100" cy="40" r="11.5" ${F('pom')}/>
${gloss('M66 70 Q74 54 92 48', 4.5, .4)}` },
  { id: 'beanie', name: 'Шапка', hw: 54, y1: 110, top: 26, t: .74, sink: 0, svg: `<defs>${lg('bl', '#7CCBFF', '#2F9BE6', '#1B66B8')}${lg('bl2', '#3CA6F0', '#2380D0', '#175AA0')}${rg('pk', '#FFB5D3', '#E8508C')}</defs>
<path d="M58 96 Q54 50 100 42 Q146 50 142 96Z" ${F('bl')}/>
<path d="M82 52 Q76 74 76 94 M100 46 L100 94 M118 52 Q124 74 124 94" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.6" stroke-linecap="round"/>
<path d="M52 92 Q52 88 58 88 L142 88 Q148 88 148 92 L148 102 Q148 110 140 110 L60 110 Q52 110 52 102Z" ${F('bl2')}/>
<path d="M70 92 L70 108 M86 92 L86 108 M102 92 L102 108 M118 92 L118 108 M134 92 L134 108" stroke="#fff" stroke-opacity=".16" stroke-width="3"/>
<circle cx="100" cy="40" r="11" ${F('pk')}/>
${gloss('M68 68 Q74 54 90 48', 4.5, .45)}` },
  { id: 'bow', name: 'Бант', hw: 48, y1: 118, top: 80, t: .5, sink: 0, svg: `<defs>${lg('pn', '#FFB0D0', '#FF5E9C', '#D3376F')}${rg('kn', '#FFC4DC', '#E8508C')}</defs>
${mir(`<path d="M96 102 Q74 76 54 84 Q44 100 56 116 Q78 118 96 106Z" ${F('pn')}/><path d="M94 104 Q74 98 60 110" fill="none" stroke="#B72A5F" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>`)}
<ellipse cx="100" cy="104" rx="11" ry="12" ${F('kn')}/>
${gloss('M60 88 Q68 82 80 86', 3.6, .55)}` },
  { id: 'halo', name: 'Німб', hw: 48, y1: 112, top: 88, t: .72, sink: -12, svg: `<defs>${lg('hl', '#FFF3B0', '#FFD84A', '#E5A417')}</defs>
<ellipse cx="100" cy="102" rx="46" ry="12" fill="#FFE98A" fill-opacity=".28"/>
<ellipse cx="100" cy="102" rx="42" ry="9.5" fill="none" stroke="url(#hg-hl)" stroke-width="9"/>
<path d="M64 98 Q80 91 100 91" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>` },
  { id: 'horns', name: 'Ріжки', hw: 40, y1: 102, top: 66, t: .62, sink: 6, svg: `<defs>${lg('hr', '#FF9A7A', '#E8453C', '#A82424')}</defs>
${mir(`<path d="M58 102 Q48 98 52 84 Q56 70 62 66 Q70 64 76 74 Q82 84 84 94 Q86 102 76 103Z" ${F('hr')}/>${gloss('M58 86 Q58 78 62 72', 3, .6)}`)}` },
  { id: 'headphones', name: 'Навушники', hw: 88, y1: 130, top: 34, t: 1, sink: 0, svg: `<defs>${lg('hb', '#6A6496', '#4A4470', '#2E2950')}${lg('cp', '#FF9BB3', '#FF5C7C', '#D03458')}${lg('pad', '#E0476B', '#B8284A', '#8E1C38')}</defs>
<path d="M32 98 Q32 38 100 38 Q168 38 168 98" fill="none" stroke="url(#hg-hb)" stroke-width="11" stroke-linecap="round"/>
<path d="M44 80 Q52 48 100 45" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.5" stroke-linecap="round"/>
${mir(`<rect x="14" y="80" width="32" height="50" rx="15" ${F('cp')}/><rect x="25" y="91" width="16" height="28" rx="8" ${F('pad')}/>${gloss('M20 92 Q20 86 26 84', 3.4, .6)}`)}` },
];
