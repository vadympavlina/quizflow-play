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
    back: `<defs>${lg('lc', '#FFFFFF', '#F2F6FC', '#C8D3E8')}${lg('ls', '#7FE0C0', '#2FB88F', '#188262')}</defs>
<path d="${BODY}" ${F('lc')}/><path d="M78 112 L100 172 L122 112Z" ${F('ls')}/>`,
    front: `<path d="M76 110 L52 140 L96 160Z" ${F('lc')}/><path d="M124 110 L148 140 L104 160Z" ${F('lc')}/>${st('M52 140 L96 160 M148 140 L104 160', '#8FA0C4', .6, 2)}
<path d="M100 164 L100 206" stroke="#8FA0C4" stroke-opacity=".55" stroke-width="2.4"/><rect x="120" y="166" width="26" height="22" rx="4" fill="#E7EDF8"/>${st('M120 172 L146 172', '#8FA0C4', .6, 2)}<rect x="128" y="156" width="4" height="18" rx="2" fill="#3A7BE8"/><rect x="134" y="158" width="4" height="16" rx="2" fill="#E5343C"/>${gl(SHOULD, 4, .5)}` },
  { id: 'astro', name: 'Скафандр', fit: { ks: .8, chin: 126 },
    back: `<defs>${lg('as', '#FFFFFF', '#EEF2FA', '#BAC6DE')}${lg('ar', '#9FB4D8', '#6C84B4', '#455C8C')}${lg('ao', '#FFB36B', '#FF7A33', '#D14A12')}</defs>
<path d="${BODY}" ${F('as')}/>`,
    front: `<path d="M58 124 Q100 158 142 124" fill="none" stroke="url(#cl-ar)" stroke-width="15" stroke-linecap="round"/>${gl('M62 123 Q100 152 138 123', 3.4, .5)}${st('M60 130 Q100 164 140 130', '#2F4470', .3, 2.4)}
<rect x="36" y="160" width="32" height="15" rx="3.4" ${F('ao')}/><path d="M52 162 l1.8 4 4 .6 -3 2.8 .8 4 -3.6-2 -3.6 2 .8-4 -3-2.8 4-.6z" fill="#fff" fill-opacity=".92"/>
<rect x="104" y="166" width="46" height="24" rx="5.5" fill="#C9D3EA"/><circle cx="117" cy="178" r="4.2" fill="#E5343C"/><circle cx="129" cy="178" r="4.2" fill="#3A7BE8"/><circle cx="141" cy="178" r="4.2" fill="#3FC47A"/>${gl(SHOULD, 4, .6)}` },
  { id: 'chef', name: 'Кухар', fit: { ks: .82, chin: 129 },
    back: `<defs>${lg('cf', '#FFFFFF', '#F6F4F2', '#D7D2CC')}${lg('cr', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('ck', '#FF9AA2', '#B01E2E')}</defs>
<path d="${BODY}" ${F('cf')}/>`,
    front: `<path d="M74 110 L58 134 L92 146Z" fill="#fff"/><path d="M126 110 L142 134 L108 146Z" fill="#fff"/>${st('M58 134 L92 146 M142 134 L108 146', '#B8B1A6', .45, 2)}
<path d="M66 122 Q100 150 134 122 L132 134 Q100 160 68 134Z" ${F('cr')}/>${mir(`<path d="M97 152 L82 176 L98 170Z" ${F('cr')}/>`)}<ellipse cx="100" cy="150" rx="8" ry="7" ${F('ck')}/>
<path d="M100 164 L100 206" stroke="#C9C3BA" stroke-width="2.6"/>${[172, 188].map((y) => `<circle cx="84" cy="${y}" r="3.6" fill="#B8B1A6"/><circle cx="116" cy="${y}" r="3.6" fill="#B8B1A6"/>`).join('')}${gl(SHOULD, 4, .7)}` },
  { id: 'tee', name: 'Футболка', fit: { ks: .84, chin: 132 },
    back: `<defs>${lg('te', '#7FE3E0', '#2FBFC0', '#1B8A92')}${lg('te2', '#46C7C9', '#1FA3A8', '#147079')}</defs>
<path d="${BODY}" ${F('te')}/>`,
    front: `<path d="M56 122 Q100 148 144 122 L146 134 Q100 160 54 134Z" ${F('te2')}/>${st('M58 128 Q100 152 142 128', '#fff', .35, 2, '2 3')}
<path d="M100 148 l3.8 7.8 8.6 1.2 -6.2 6 1.6 8.6 -7.8-4.2 -7.8 4.2 1.6-8.6 -6.2-6 8.6-1.2z" fill="#FFE27A"/><path d="M100 151 l2.4 5.6 6 .8 -4.4 4.2" fill="#fff" fill-opacity=".35"/>${gl(SHOULD, 4, .35)}` },
  { id: 'cape', name: 'Плащ героя', fit: { ks: .8, chin: 128 },
    back: `<defs>${lg('cp', '#FF8A8A', '#E5343C', '#9E1824')}${lg('cp2', '#C42632', '#8E1220', '#5E0A16')}${GOLD}${rg('cb', '#FFF3B0', '#E39410')}</defs>
<path d="M16 206 Q8 130 46 104 Q100 88 154 104 Q192 130 184 206 Q100 184 16 206Z" ${F('cp')}/><path d="M154 104 Q192 130 184 206 Q166 196 150 192 Q172 146 146 108Z" ${F('cp2')}/>`,
    front: `<path d="M70 116 Q100 134 130 116" fill="none" stroke="url(#cl-gold)" stroke-width="7" stroke-linecap="round"/><circle cx="70" cy="118" r="7.4" fill="url(#cl-cb)"/><circle cx="130" cy="118" r="7.4" fill="url(#cl-cb)"/>${gl('M30 150 Q32 122 54 108', 4, .32)}
<path d="M100 150 l6 12 13 2 -9.6 9 2.6 13 -12-6.6 -12 6.6 2.6-13 -9.6-9 13-2z" fill="#FFD34A" fill-opacity=".0"/>` },
  { id: 'scarf', name: 'Шарф', fit: { ks: .84, chin: 131 },
    back: `<defs>${lg('sc', '#FF8A8A', '#E5343C', '#A11E2E')}${lg('ct', '#6B7488', '#464E64', '#2A3045')}${GOLD}</defs>
<path d="${BODY}" ${F('ct')}/><path d="M100 150 L100 206" stroke="#1E2336" stroke-opacity=".5" stroke-width="2.6"/>${btn(92, 184, 'cl-gold', 3)}${btn(108, 184, 'cl-gold', 3)}
`,
    front: `<path d="M30 98 Q100 126 170 98 L176 146 Q100 186 24 146Z" ${F('sc')}/>
<path d="M50 122 L46 150 M76 134 L72 162 M100 140 L100 168 M124 134 L128 162 M150 122 L154 150" stroke="#fff" stroke-opacity=".8" stroke-width="5.4" stroke-linecap="round"/>
<path d="M120 150 L152 154 L158 190 Q142 198 126 192Z" ${F('sc')}/><path d="M128 164 L154 168 M130 178 L156 182" stroke="#fff" stroke-opacity=".8" stroke-width="5.4" stroke-linecap="round"/>${gl('M40 116 Q76 142 112 148', 4, .38)}` },
  { id: 'tux', name: 'Смокінг', fit: { ks: .84, chin: 131 },
    back: `<defs>${lg('tx', '#4A4A5C', '#2A2A38', '#14141E')}${lg('tw', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('bt', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('bk', '#FF9AA2', '#B01E2E')}</defs>
<path d="${BODY}" ${F('tx')}/><path d="M74 112 L100 176 L126 112Z" ${F('tw')}/>`,
    front: `<path d="M74 110 L62 130 L90 136Z" ${F('tw')}/><path d="M126 110 L138 130 L110 136Z" ${F('tw')}/>
<path d="M62 126 L96 192 L40 170 Q34 148 54 124Z" fill="#0C0C14" fill-opacity=".55"/><path d="M138 126 L104 192 L160 170 Q166 148 146 124Z" fill="#0C0C14" fill-opacity=".55"/>
${mir(`<path d="M97 140 Q80 126 66 132 Q62 144 70 154 Q86 156 97 146Z" ${F('bt')}/>`)}<ellipse cx="100" cy="143" rx="8" ry="9.5" ${F('bk')}/>${gl('M70 132 Q78 129 88 133', 3, .5)}${btn(100, 170, 'cl-gold', 3)}${btn(100, 184, 'cl-gold', 3)}${gl(SHOULD, 4, .2)}` },
  { id: 'sport', name: 'Спортивна кофта', fit: { ks: .82, chin: 130 },
    back: `<defs>${lg('sp', '#FF9AB8', '#F0508A', '#B02464')}${lg('sw3', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('rb', '#7FB4FF', '#2F6FE0', '#1A3FA0')}${GOLD}${rg('md', '#FFF3B0', '#E39410')}</defs>
<path d="${BODY}" ${F('sp')}/><path d="M24 156 Q100 132 176 156 L178 166 Q100 142 22 166Z" fill="#fff" fill-opacity=".85"/>`,
    front: `<path d="M60 120 Q100 150 140 120 L144 136 Q100 168 56 136Z" ${F('sw3')}/><path d="M100 152 L100 206" stroke="#B02464" stroke-width="3.2"/><rect x="96" y="150" width="8" height="12" rx="2.5" fill="#E7EAF4"/>
<path d="M86 134 L100 154 L92 158 L78 140Z" ${F('rb')}/><path d="M114 134 L100 154 L108 158 L122 140Z" fill="#E5343C"/>
<circle cx="100" cy="166" r="12" fill="url(#cl-md)"/><circle cx="100" cy="166" r="8.6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><path d="M100 159 l2.2 4.6 5 .7 -3.6 3.5 .8 5 -4.4 -2.4 -4.4 2.4 .8-5 -3.6-3.5 5-.7z" fill="#fff" fill-opacity=".92"/>${gl(SHOULD, 4, .3)}` },
  { id: 'aloha', name: 'Гавайська сорочка', fit: { ks: .82, chin: 130 },
    back: `<defs>${lg('al', '#6FE0B8', '#22B58A', '#14805E')}${rg('f1', '#FFB5D3', '#E8508C')}${rg('f2', '#FFF3B0', '#F2A81E')}${rg('f3', '#C9B6FF', '#7A5CE6')}${rg('fc', '#FFF8C2', '#F2A81E')}</defs>
<path d="${BODY}" ${F('al')}/>${[[40, 160, 'f1'], [74, 178, 'f2'], [126, 170, 'f3'], [160, 156, 'f2'], [100, 196, 'f1'], [150, 192, 'f1'], [50, 192, 'f3']].map(([x, y, c]) => `<g>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 5}" rx="3.4" ry="5" fill="url(#cl-${c})" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="2.4" fill="url(#cl-fc)"/></g>`).join('')}`,
    front: `<path d="M72 110 L52 136 L86 148Z" fill="#17A47C"/><path d="M128 110 L148 136 L114 148Z" fill="#17A47C"/>${st('M52 136 L86 148 M148 136 L114 148', '#fff', .45, 2)}
<path d="M44 124 Q100 168 156 124" fill="none" stroke="#3FA66A" stroke-width="4.5" stroke-linecap="round"/>${[[46, 128, 'f1'], [64, 144, 'f2'], [84, 154, 'f3'], [100, 157, 'f1'], [116, 154, 'f2'], [136, 144, 'f3'], [154, 128, 'f1']].map(([x, y, c]) => `<g>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 6}" rx="4.2" ry="5.8" fill="url(#cl-${c})" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="3.2" fill="url(#cl-fc)"/></g>`).join('')}${gl(SHOULD, 4, .3)}` },
];
