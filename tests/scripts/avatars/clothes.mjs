// Одяг v2. Арт у просторі 200×200: центр шиї (100,100), плечі нижче. back — під головою, front — поверх голови.
// fit: ks — масштаб героя, chin — де в кадрі (y) опиняється підборіддя героя; арт прив'язується так, що art y=100 → chin-5.
const lg = (id, a, b, c, x2 = .35, y2 = 1) => `<linearGradient id="cl-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
const rg = (id, a, b) => `<radialGradient id="cl-${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const F = (id) => `fill="url(#cl-${id})"`;
const gl = (d, w = 4, op = .35) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
const st = (d, c = '#000', op = .25, w = 2.4, dash = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
const mir = (s) => `${s}<g transform="translate(200 0) scale(-1 1)">${s}</g>`;
const BODY = 'M16 206 Q16 134 54 118 Q78 108 100 112 Q122 108 146 118 Q184 134 184 206Z';
const SHOULD = 'M26 172 Q30 136 58 122';          // лінія світла на плечі
const GOLD = lg('gold', '#FFE98A', '#FFC72A', '#E39410');
const btn = (x, y, c = 'cl-gold', r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${c})"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .3}" fill="#fff" fill-opacity=".7"/>`;

export const CLOTHES = [
  { id: 'hoodie', name: 'Худі', fit: { ks: .82, chin: 130 },
    back: `<defs>${lg('hd', '#9DB4FF', '#5F7DF2', '#3A52C4')}${lg('hd2', '#7A94F8', '#4C67DE', '#2E43A8')}${GOLD}</defs>
<path d="M30 140 Q22 92 62 76 Q100 66 138 76 Q178 92 170 140 Q100 162 30 140Z" ${F('hd2')}/>
<path d="${BODY}" ${F('hd')}/>`,
    front: `<path d="M44 132 Q70 152 100 152 Q130 152 156 132 Q170 144 170 172 Q100 150 30 172 Q30 144 44 132Z" ${F('hd2')}/>
<path d="M86 138 L84 164 M114 138 L116 164" stroke="#fff" stroke-opacity=".9" stroke-width="3.6" stroke-linecap="round"/><circle cx="84" cy="167" r="3.4" fill="#fff"/><circle cx="116" cy="167" r="3.4" fill="#fff"/>
<path d="M62 186 Q100 174 138 186 L142 206 L58 206Z" ${F('hd2')}/>${st('M62 186 Q100 174 138 186', '#fff', .25, 2.4, '3 4')}${gl(SHOULD, 4, .32)}` },
  { id: 'uniform', name: 'Шкільна форма', fit: { ks: .82, chin: 128 },
    back: `<defs>${lg('bz', '#52639A', '#34437A', '#1E2856')}${lg('sh', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('tie', '#FF8A8A', '#E03A44', '#A11E2E')}${GOLD}</defs>
<path d="${BODY}" ${F('bz')}/><path d="M72 112 L100 168 L128 112Z" ${F('sh')}/>`,
    front: `<path d="M74 110 L60 132 L88 138Z" ${F('sh')}/><path d="M126 110 L140 132 L112 138Z" ${F('sh')}/>
<path d="M60 128 L96 190 L40 168Q34 150 54 126Z" fill="#1A234E" fill-opacity=".6"/><path d="M140 128 L104 190 L160 168Q166 150 146 126Z" fill="#1A234E" fill-opacity=".6"/>
<path d="M93 128 L107 128 L109 138 L100 144 L91 138Z" ${F('tie')}/><path d="M92 141 L108 141 L113 186 L100 196 L87 186Z" ${F('tie')}/>${gl('M100 146 L100 184', 2.4, .3)}
<path d="M124 170 L146 170 L146 182 L124 182Z" fill="#fff" fill-opacity=".12"/>${btn(132, 176)}${gl(SHOULD, 4, .22)}` },
  { id: 'sweater', name: 'Светр', fit: { ks: .82, chin: 131 },
    back: `<defs>${lg('sw', '#FFB98A', '#F28A4A', '#C9582A')}${lg('sw2', '#FFD2B0', '#F6A56E', '#D26F36')}</defs>
<path d="${BODY}" ${F('sw')}/>${[150, 166, 182].map((y) => `<path d="M20 ${y + 10} Q100 ${y - 22} 180 ${y + 10}" fill="none" stroke="#FFF1E4" stroke-opacity=".75" stroke-width="7"/>`).join('')}`,
    front: `<path d="M66 116 Q100 136 134 116 L136 134 Q100 156 64 134Z" ${F('sw2')}/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${70 + i * 8.6} ${123 + Math.sin(i / 7 * Math.PI) * 9} l.8 12" stroke="#7A3314" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/>`).join('')}${gl('M70 122 Q100 140 130 122', 3, .4)}${gl(SHOULD, 4, .28)}` },
  { id: 'lab', name: 'Халат вченого', fit: { ks: .82, chin: 128 },
    back: `<defs>${lg('lc', '#FBFCFF', '#E3EAF7', '#A9B8D8')}${lg('ls', '#E3F0FF', '#BCD6F4', '#8FB0DE')}</defs>
<path d="${BODY}" ${F('lc')} stroke="#A3B2D4" stroke-opacity=".8" stroke-width="2"/><path d="M76 112 L100 158 L124 112Z" ${F('ls')}/>`,
    front: `${mir(`<path d="M76 110 L54 138 L94 164Z" ${F('lc')}/>`)}${st('M54 138 L94 164 M146 138 L106 164', '#8FA0C4', .6, 2)}
<path d="M100 166 L100 206" stroke="#8FA0C4" stroke-opacity=".55" stroke-width="2.4"/>
<path d="M74 118 Q74 146 100 154 Q126 146 126 118" fill="none" stroke="#3C4766" stroke-width="3.4" stroke-linecap="round"/><circle cx="100" cy="156" r="6" fill="#C9D3EA" stroke="#3C4766" stroke-width="2.4"/><circle cx="98.2" cy="154.2" r="1.7" fill="#fff" fill-opacity=".9"/>
<rect x="114" y="146" width="24" height="17" rx="3.6" fill="#F1F5FC" stroke="#9FB0D2" stroke-width="1.6"/><rect x="121" y="138" width="3.6" height="14" rx="1.8" fill="#3A7BE8"/><rect x="127" y="140" width="3.6" height="12" rx="1.8" fill="#E5343C"/>${gl(SHOULD, 4, .5)}` },
  { id: 'astro', name: 'Скафандр', fit: { ks: .8, chin: 126 },
    back: `<defs>${lg('as', '#FBFCFF', '#DDE5F5', '#9FB0D6')}${lg('ar', '#B9CBEA', '#7F97C6', '#4F6798')}${lg('ao', '#FFB36B', '#FF7A33', '#D14A12')}</defs>
<path d="${BODY}" ${F('as')} stroke="#A3B2D4" stroke-opacity=".8" stroke-width="2"/>
<ellipse cx="100" cy="124" rx="38" ry="13" fill="none" stroke="url(#cl-ar)" stroke-width="11"/><ellipse cx="100" cy="124" rx="38" ry="13" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" transform="translate(0 -2.5)"/>`,
    front: `<path d="M100 146 L100 176" stroke="#8C9AB8" stroke-width="2.6"/><rect x="95.4" y="146" width="9.2" height="11" rx="2.6" fill="#FF7A33"/>
<rect x="50" y="146" width="26" height="13" rx="3.2" ${F('ao')}/><path d="M63 148.4 l1.5 3.3 3.3 .5 -2.4 2.3 .6 3.3 -3-1.6 -3 1.6 .6-3.3 -2.4-2.3 3.3-.5z" fill="#fff" fill-opacity=".92"/>
<rect x="112" y="148" width="32" height="16" rx="4.2" fill="#C9D3EA"/><circle cx="121" cy="156" r="3.2" fill="#E5343C"/><circle cx="128.5" cy="156" r="3.2" fill="#3A7BE8"/><circle cx="136" cy="156" r="3.2" fill="#3FC47A"/>${gl(SHOULD, 4, .6)}` },
  { id: 'chef', name: 'Кухар', fit: { ks: .82, chin: 129 },
    back: `<defs>${lg('cf', '#FFFFFF', '#EDEAE6', '#C3BCB2')}${lg('cr', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('ck', '#FF9AA2', '#B01E2E')}</defs>
<path d="${BODY}" ${F('cf')} stroke="#B9B1A5" stroke-opacity=".8" stroke-width="2"/>`,
    front: `${st('M78 124 L88 176 M122 124 L112 176', '#B8B1A6', .5, 2.2)}<path d="M100 132 L100 176" stroke="#C9C3BA" stroke-width="2.2"/>
${mir(`<path d="M70 112 Q84 124 98 124 L98 134 Q82 134 68 122Z" fill="#fff"/><path d="M70 112 Q84 124 98 124" fill="none" stroke="#B8B1A6" stroke-opacity=".55" stroke-width="2"/>`)}
<path d="M76 120 Q100 128 124 120 L100 150Z" ${F('cr')}/>${mir(`<path d="M97 128 L83 118 L84 134Z" ${F('cr')}/>`)}<ellipse cx="100" cy="126" rx="6.6" ry="6" ${F('ck')}/>
${[142, 158].map((y) => `<circle cx="88" cy="${y}" r="3.4" fill="#B8B1A6"/><circle cx="112" cy="${y}" r="3.4" fill="#B8B1A6"/>`).join('')}${gl(SHOULD, 4, .7)}` },
  { id: 'tee', name: 'Футболка', fit: { ks: .84, chin: 132 },
    back: `<defs>${lg('te', '#7FE3E0', '#2FBFC0', '#1B8A92')}${lg('te2', '#46C7C9', '#1FA3A8', '#147079')}</defs>
<path d="${BODY}" ${F('te')}/>`,
    front: `<path d="M56 122 Q100 148 144 122 L146 134 Q100 160 54 134Z" ${F('te2')}/>${st('M58 128 Q100 152 142 128', '#fff', .35, 2, '2 3')}
<g transform="translate(100 144) scale(.82) translate(-100 -148)"><path d="M100 148 l3.8 7.8 8.6 1.2 -6.2 6 1.6 8.6 -7.8-4.2 -7.8 4.2 1.6-8.6 -6.2-6 8.6-1.2z" fill="#FFE27A"/><path d="M100 151 l2.4 5.6 6 .8 -4.4 4.2" fill="#fff" fill-opacity=".35"/></g>${gl(SHOULD, 4, .35)}` },
  { id: 'cape', name: 'Плащ героя', fit: { ks: .8, chin: 128 },
    back: `<defs>${lg('cp', '#FF8A8A', '#E5343C', '#9E1824')}${lg('cp2', '#C42632', '#8E1220', '#5E0A16')}${GOLD}${rg('cb', '#FFF3B0', '#E39410')}</defs>
<path d="M16 206 Q8 130 46 104 Q100 88 154 104 Q192 130 184 206 Q100 184 16 206Z" ${F('cp')}/><path d="M154 104 Q192 130 184 206 Q166 196 150 192 Q172 146 146 108Z" ${F('cp2')}/>`,
    front: `<path d="M70 116 Q100 134 130 116" fill="none" stroke="url(#cl-gold)" stroke-width="7" stroke-linecap="round"/><circle cx="70" cy="118" r="7.4" fill="url(#cl-cb)"/><circle cx="130" cy="118" r="7.4" fill="url(#cl-cb)"/>${gl('M30 150 Q32 122 54 108', 4, .32)}
<path d="M100 150 l6 12 13 2 -9.6 9 2.6 13 -12-6.6 -12 6.6 2.6-13 -9.6-9 13-2z" fill="#FFD34A" fill-opacity=".0"/>` },
  { id: 'scarf', name: 'Шарф', fit: { ks: .84, chin: 131 },
    back: `<defs>${lg('sc', '#FF8A8A', '#E5343C', '#A11E2E')}${lg('ct', '#6B7488', '#464E64', '#2A3045')}${GOLD}<clipPath id="cl-scb"><path d="M42 126 C42 115 68 114 100 126 C132 114 158 115 158 126 C158 145 134 158 100 160 C66 158 42 145 42 126Z"/></clipPath></defs>
<path d="${BODY}" ${F('ct')}/><path d="M100 160 L100 206" stroke="#1E2336" stroke-opacity=".5" stroke-width="2.6"/>${btn(92, 190, 'cl-gold', 3)}${btn(108, 190, 'cl-gold', 3)}`,
    front: `<path d="M42 126 C42 115 68 114 100 126 C132 114 158 115 158 126 C158 145 134 158 100 160 C66 158 42 145 42 126Z" ${F('sc')}/>
<g clip-path="url(#cl-scb)"><path d="M30 132 Q100 156 170 132 M30 144 Q100 168 170 144" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="6" stroke-linecap="round"/></g>
<path d="M112 152 L134 150 L136 170 Q124 175 113 171Z" ${F('sc')}/><path d="M113 160 L135 158 M113.5 166 L135.5 164" stroke="#fff" stroke-opacity=".9" stroke-width="4" stroke-linecap="round"/><path d="M115 172 l0 3.4 M121 173 l0 3.4 M127 173 l0 3.4 M133 172 l0 3.4" stroke="#A11E2E" stroke-width="2.2" stroke-linecap="round"/>` },
  { id: 'tux', name: 'Смокінг', fit: { ks: .84, chin: 131 },
    back: `<defs>${lg('tx', '#4A4A5C', '#2A2A38', '#14141E')}${lg('tl', '#5B5B70', '#34343F', '#1C1C26')}${lg('tw', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('bt', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('bk', '#FF9AA2', '#B01E2E')}${GOLD}</defs>
<path d="${BODY}" ${F('tx')}/><path d="M80 112 L100 176 L120 112Z" ${F('tw')}/>`,
    front: `${mir(`<path d="M80 112 L56 132 L88 182 L99 176 L92 138Z" ${F('tl')}/><path d="M80 112 L56 132 L62 134 L84 120Z" fill="#fff" fill-opacity=".14"/>`)}
${mir(`<path d="M88 114 L78 124 L95 130Z" ${F('tw')}/>`)}
${mir(`<path d="M98 131 Q86 120 74 124 Q71 132 76 139 Q89 141 98 135Z" ${F('bt')}/>`)}<ellipse cx="100" cy="131" rx="6.4" ry="7.4" ${F('bk')}/>${gl('M76 126 Q83 124 90 127', 2.8, .5)}${btn(100, 154, 'cl-gold', 2.8)}${btn(100, 166, 'cl-gold', 2.8)}${gl(SHOULD, 4, .2)}` },
  { id: 'sport', name: 'Спортивна кофта', fit: { ks: .82, chin: 130 },
    back: `<defs>${lg('sp', '#FF9AB8', '#F0508A', '#B02464')}${lg('sw3', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('rb', '#7FB4FF', '#2F6FE0', '#1A3FA0')}${GOLD}${rg('md', '#FFF3B0', '#E39410')}</defs>
<path d="${BODY}" ${F('sp')}/><path d="M24 156 Q100 132 176 156 L178 166 Q100 142 22 166Z" fill="#fff" fill-opacity=".85"/>`,
    front: `<path d="M60 120 Q100 150 140 120 L144 136 Q100 168 56 136Z" ${F('sw3')}/><path d="M100 152 L100 206" stroke="#B02464" stroke-width="3.2"/><rect x="96" y="150" width="8" height="12" rx="2.5" fill="#E7EAF4"/>
<path d="M86 134 L100 154 L92 158 L78 140Z" ${F('rb')}/><path d="M114 134 L100 154 L108 158 L122 140Z" fill="#E5343C"/>
<g transform="translate(0 -8)"><circle cx="100" cy="166" r="12" fill="url(#cl-md)"/><circle cx="100" cy="166" r="8.6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><path d="M100 159 l2.2 4.6 5 .7 -3.6 3.5 .8 5 -4.4 -2.4 -4.4 2.4 .8-5 -3.6-3.5 5-.7z" fill="#fff" fill-opacity=".92"/></g>${gl(SHOULD, 4, .3)}` },
  { id: 'aloha', name: 'Гавайська сорочка', fit: { ks: .82, chin: 130 },
    back: `<defs>${lg('al', '#6FE0B8', '#22B58A', '#14805E')}${lg('ac', '#B9F2DA', '#6FD6AE', '#2FA880')}${rg('f1', '#FFB5D3', '#E8508C')}${rg('f2', '#FFF3B0', '#F2A81E')}${rg('f3', '#C9B6FF', '#7A5CE6')}${rg('fc', '#FFF8C2', '#F2A81E')}<clipPath id="cl-alb"><path d="${BODY}"/></clipPath></defs>
<path d="${BODY}" ${F('al')}/><g clip-path="url(#cl-alb)"><path d="M58 150 q-10 8 -22 6 q6 -10 22 -6z M142 150 q10 8 22 6 q-6 -10 -22 -6z M70 176 q-10 6 -20 3 q6 -9 20 -3z M130 176 q10 6 20 3 q-6 -9 -20 -3z" fill="#14805E" fill-opacity=".55"/>${[[44, 138, 'f1', 1], [156, 138, 'f2', 1], [60, 160, 'f3', 1.1], [140, 160, 'f1', 1.1], [84, 178, 'f2', 1], [116, 178, 'f3', 1]].map(([x, y, c, k]) => `<g>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 5.2 * k}" rx="${3.6 * k}" ry="${5.2 * k}" fill="url(#cl-${c})" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${2.6 * k}" fill="url(#cl-fc)"/></g>`).join('')}</g>`,
    front: `${mir(`<path d="M80 111 Q66 124 60 134 Q78 152 94 160 L99 148 Q92 130 90 122Z" ${F('ac')}/><path d="M80 111 Q66 124 60 134" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.2" stroke-linecap="round"/>`)}
${gl(SHOULD, 4, .3)}` },
];
