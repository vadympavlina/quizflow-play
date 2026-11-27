// Одяг v4. Арт у просторі 200×200: шия по центру (100), підборіддя героя лягає приблизно на y=120.
// back — під головою (плечі, тил коміра, капюшон), front — поверх голови (коміри, що обіймають підборіддя, деталі).
// fit: ks — масштаб героя, chin — де в кадрі (y) опиняється підборіддя.
// Принципи: плечі починаються вище за підборіддя (ховаються за головою — жодних щілин), об'єм як у героїв
// (світло зліва згори, затемнення до країв, блік на плечі), контур трохи темніший за тканину, деталі великі й прості.
const lg = (id, a, b, c, x2 = .35, y2 = 1) => `<linearGradient id="cl-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
const rg = (id, a, b) => `<radialGradient id="cl-${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const F = (id) => `fill="url(#cl-${id})"`;
const mir = (s) => `${s}<g transform="translate(200 0) scale(-1 1)">${s}</g>`;
const gl = (d, w = 4, op = .35) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
const ln = (d, c, w = 2.4, op = 1, dash = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
// Плечі: широкі, округлі, верх за головою (y≈104), краї виходять за коло
const BODY = 'M6 212 C6 152 28 124 62 112 C76 107 88 104 100 104 C112 104 124 107 138 112 C172 124 194 152 194 212Z';
// Об'єм: затемнення до країв і вниз + блік на лівому плечі (спільні для всіх)
const SHADE = `<radialGradient id="cl-shade" cx=".42" cy=".12" r=".95"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>`;
const vol = (edge) => `<path d="${BODY}" fill="url(#cl-shade)"/><path d="${BODY}" fill="none" stroke="${edge}" stroke-width="2.4" stroke-opacity=".55"/>${gl('M22 176 C26 146 40 128 62 118', 5, .32)}`;
const body = (fid, edge) => `<path d="${BODY}" ${F(fid)}/>${vol(edge)}`;
const btn = (x, y, fill, r = 3.4, edge = '#00000033') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${edge}" stroke-width="1"/><circle cx="${x - r * .32}" cy="${y - r * .32}" r="${r * .32}" fill="#fff" fill-opacity=".75"/>`;
const GOLD = lg('gold', '#FFEFA0', '#FFC72A', '#D98A0C');
const star = (cx, cy, r, fill) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`); } return `<path d="M${p.join(' L')}Z" fill="${fill}" stroke-linejoin="round"/>`; };
const flower = (x, y, k, c) => `<g>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${(y - 5.2 * k).toFixed(1)}" rx="${(3.8 * k).toFixed(1)}" ry="${(5.4 * k).toFixed(1)}" fill="url(#cl-${c})" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${(2.8 * k).toFixed(1)}" fill="url(#cl-fc)"/></g>`;
const FIT = { ks: .78, chin: 127 };
// Комір-кільце навколо шиї (вид спереду): верхня половина еліпса — за головою (back), нижня — поверх (front).
// Так комір обіймає шию, а не лежить пласкою смугою під підборіддям.
const RX = 55, RY = 13, RC = 117;
const arcU = (rx = RX, ry = RY, cy = RC) => `M${100 - rx} ${cy} A${rx} ${ry} 0 0 1 ${100 + rx} ${cy}`;
const arcD = (rx = RX, ry = RY, cy = RC) => `M${100 - rx} ${cy} A${rx} ${ry} 0 0 0 ${100 + rx} ${cy}`;
const ringBack = (w, c, edge, o = {}) => `<ellipse cx="100" cy="${o.cy ?? RC}" rx="${o.rx ?? RX}" ry="${o.ry ?? RY}" fill="${o.inner ?? edge}"/><path d="${arcU(o.rx, o.ry, o.cy)}" fill="none" stroke="${edge}" stroke-opacity=".55" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${arcU(o.rx, o.ry, o.cy)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const ringFront = (w, c, edge, o = {}) => `<path d="${arcD(o.rx, o.ry, o.cy)}" fill="none" stroke="${edge}" stroke-opacity=".5" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${arcD(o.rx, o.ry, o.cy)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="${arcD(o.rx, o.ry, o.cy)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="${Math.max(1.6, w / 4)}" stroke-linecap="round" transform="translate(0 ${-w / 4})"/>`;


export const CLOTHES = [
  // Худі: капюшон лежить за головою й на плечах, товстий край капюшона обіймає шию, шнурки з наконечниками, кишеня
  { id: 'hoodie', name: 'Худі', fit: FIT,
    back: `<defs>${SHADE}${lg('hd', '#9DB4FF', '#5F7DF2', '#3A52C4')}${lg('hd2', '#7A94F8', '#4C67DE', '#2E43A8')}</defs>
<path d="M34 150 C24 104 54 74 100 72 C146 74 176 104 166 150 Z" ${F('hd2')}/>${body('hd', '#2A3C9A')}${ringBack(20, '#4560D6', '#2A3C9A', { rx: 60, ry: 17 })}`,
    front: `${ringFront(20, '#5873E8', '#2A3C9A', { rx: 60, ry: 17 })}
${ln('M88 146 L86 168', '#fff', 3.6, .95)}${ln('M112 146 L114 168', '#fff', 3.6, .95)}<rect x="82.6" y="166" width="6.8" height="10" rx="3" fill="#DDE4FF"/><rect x="110.6" y="166" width="6.8" height="10" rx="3" fill="#DDE4FF"/>
<path d="M60 194 Q100 184 140 194 L144 214 L56 214Z" fill="#000" fill-opacity=".12"/>${ln('M60 194 Q100 184 140 194', '#fff', 2.2, .35)}` },

  // Шкільна форма: темно-синій піджак, біла сорочка з комірцем, червона краватка, емблема
  { id: 'uniform', name: 'Шкільна форма', fit: FIT,
    back: `<defs>${SHADE}${lg('un', '#4A5C9C', '#2E3E78', '#1C2752')}${lg('sh', '#FFFFFF', '#F2F5FC', '#C9D2EA')}${lg('ti', '#FF7A86', '#E0303E', '#9E1424')}${GOLD}</defs>
${body('un', '#121A3A')}<path d="M74 110 L100 178 L126 110 Z" ${F('sh')}/>`,
    front: `${mir(`<path d="M74 110 L60 134 L100 178 L84 124 Z" fill="#26346A"/><path d="M74 110 L60 134 L66 136 L80 118Z" fill="#fff" fill-opacity=".14"/>`)}
${mir(`<path d="M80 112 L88 130 L99 120 Z" ${F('sh')} stroke="#AEB8D6" stroke-width="1.2"/>`)}
<path d="M95 122 L105 122 L107 132 L100 136 L93 132Z" ${F('ti')}/><path d="M94 134 L106 134 L109 172 L100 182 L91 172Z" ${F('ti')}/>${ln('M97 140 L95 166', '#fff', 1.6, .35)}
<path d="M128 156 L148 154 L149 172 L130 174Z" fill="#1C2752" fill-opacity=".6"/>${btn(139, 164, 'url(#cl-gold)', 4.2)}` },

  // Светр: в'язаний комір-гольф обіймає шию, рубчики, широкі світлі смуги
  { id: 'sweater', name: 'Светр', fit: FIT,
    back: `<defs>${SHADE}${lg('sw', '#FFB27A', '#F5803F', '#C9561E')}${lg('sw2', '#FF9C5C', '#E86A2C', '#B24614')}<clipPath id="cl-swb"><path d="${BODY}"/></clipPath></defs>
<path d="${BODY}" ${F('sw')}/><g clip-path="url(#cl-swb)">${[150, 172, 194].map((y) => `<path d="M0 ${y} Q100 ${y - 22} 200 ${y}" fill="none" stroke="#FFE3C8" stroke-opacity=".85" stroke-width="9"/>`).join('')}</g>${vol('#9A3E0C')}${ringBack(20, '#C9561E', '#9A3E0C')}<path d="${arcU()}" fill="none" stroke="#7A2E06" stroke-opacity=".35" stroke-width="18" stroke-dasharray="1.8 5"/>`,
    front: `${ringFront(20, '#E86A2C', '#9A3E0C')}<path d="${arcD(RX, RY, RC)}" fill="none" stroke="#9A3E0C" stroke-opacity=".38" stroke-width="18" stroke-dasharray="1.8 5"/>` },

  // Халат вченого: білий з блакитними тінями, широкі лацкани, блакитна сорочка, кишеня з ручками
  { id: 'lab', name: 'Халат вченого', fit: FIT,
    back: `<defs>${SHADE}${lg('lc', '#FFFFFF', '#E6ECF8', '#AFBEDC')}${lg('ls', '#D8EBFF', '#9FC4F0', '#6F98D6')}</defs>
${body('lc', '#8396BE')}<path d="M76 110 L100 162 L124 110Z" ${F('ls')}/>`,
    front: `${mir(`<path d="M76 110 L56 140 L98 166 L86 126Z" ${F('lc')} stroke="#8EA0C6" stroke-width="1.6" stroke-linejoin="round"/>`)}
${ln('M100 166 L100 214', '#8EA0C6', 2.2, .8)}${btn(108, 182, '#E6ECF8', 3.2, '#8EA0C6')}${btn(108, 200, '#E6ECF8', 3.2, '#8EA0C6')}
<rect x="122" y="150" width="26" height="20" rx="4" fill="#F2F6FD" stroke="#8EA0C6" stroke-width="1.6"/><rect x="129" y="140" width="4" height="16" rx="2" fill="#3A7BE8"/><rect x="136" y="142" width="4" height="14" rx="2" fill="#E5343C"/><rect x="129" y="140" width="4" height="4" rx="1.5" fill="#1E4FA8"/>` },

  // Скафандр: металеве кільце-комір навколо шиї, білий костюм зі швами, нашивка й панель
  { id: 'astro', name: 'Скафандр', fit: FIT,
    back: `<defs>${SHADE}${lg('as', '#FFFFFF', '#E3E9F6', '#A6B4D4')}${lg('ar', '#D3DEF2', '#8FA4CC', '#566E9E')}${lg('ao', '#FFB36B', '#FF7A33', '#D14A12')}</defs>
${body('as', '#7C8DB4')}${ln('M30 168 Q34 150 48 138', '#9AA8C8', 2.4, .7)}${ln('M170 168 Q166 150 152 138', '#9AA8C8', 2.4, .7)}
<path d="M40 120 C40 108 70 102 100 102 C130 102 160 108 160 120" fill="none" stroke="#6F84B0" stroke-width="12"/>`,
    front: `<path d="M40 120 C40 130 68 134 100 134 C132 134 160 130 160 120" fill="none" stroke="url(#cl-ar)" stroke-width="12" stroke-linecap="round"/>${gl('M46 124 C60 129 80 131 100 131', 3, .55)}
<rect x="56" y="150" width="26" height="14" rx="3.4" ${F('ao')}/>${star(69, 157, 5, '#fff')}
<rect x="114" y="149" width="32" height="17" rx="4.6" fill="#C9D3EA" stroke="#7C8DB4" stroke-width="1.4"/><circle cx="122" cy="157.5" r="3.2" fill="#E5343C"/><circle cx="130" cy="157.5" r="3.2" fill="#3A7BE8"/><circle cx="138" cy="157.5" r="3.2" fill="#3FC47A"/>` },

  // Кухар: двобортний білий кітель зі стійкою, червона хустка з вузлом, два ряди ґудзиків
  { id: 'chef', name: 'Кухар', fit: FIT,
    back: `<defs>${SHADE}${lg('cf', '#FFFFFF', '#EEEAE5', '#C2BAAE')}${lg('cr', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('ck', '#FF9AA2', '#B01E2E')}</defs>
${body('cf', '#9E9585')}${ringBack(9, '#E6E0D8', '#A89F90')}`,
    front: `${ringFront(9, '#F8F5F1', '#A89F90')}
<path d="M68 124 C80 129 92 131 100 131 C108 131 120 129 132 124 L100 152Z" ${F('cr')}/>${mir(`<path d="M98 132 L84 144 L90 156 L99 140Z" ${F('cr')}/>`)}<ellipse cx="100" cy="134" rx="7.4" ry="6.6" ${F('ck')}/>
${ln('M100 152 C104 170 104 194 100 214', '#B3AA9A', 2, .8)}${[162, 180, 198].map((y) => btn(86, y, '#D9D2C6', 3.4, '#9E9585') + btn(116, y, '#D9D2C6', 3.4, '#9E9585')).join('')}` },

  // Футболка: в'язаний круглий комір, принт-зірка
  { id: 'tee', name: 'Футболка', fit: FIT,
    back: `<defs>${SHADE}${lg('te', '#7FE3E0', '#2FBFC0', '#1B8A92')}${GOLD}</defs>
${body('te', '#0E5E66')}${ringBack(8, '#178C92', '#0E5E66')}`,
    front: `${ringFront(8, '#22A9AE', '#0E5E66')}${`<path d="${arcD(RX, RY, RC)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-dasharray="3 3" transform="translate(0 2)"/>`}
${star(100, 156, 11, 'url(#cl-gold)')}${star(100, 156, 5, '#FFF7C2')}` },

  // Плащ героя: синій костюм, червоний плащ за плечима й на плечах, золоті застібки, емблема-блискавка
  { id: 'cape', name: 'Плащ героя', fit: FIT,
    back: `<defs>${SHADE}${lg('cs', '#6F8CFF', '#3D5BE0', '#2236A8')}${lg('cp', '#FF7A86', '#E3303C', '#9E1424')}${lg('cp2', '#C42632', '#8E1220', '#5E0A16')}${GOLD}${rg('cb', '#FFF3B0', '#E39410')}</defs>
<path d="M0 214 C0 150 20 118 56 108 L100 104 L144 108 C180 118 200 150 200 214Z" ${F('cp2')}/>${body('cs', '#16247A')}`,
    front: `${mir(`<path d="M56 108 C36 118 22 140 18 172 C30 160 44 148 66 140 C70 132 72 120 74 112Z" ${F('cp')}/>`)}
<path d="M62 122 C76 128 90 130 100 130 C110 130 124 128 138 122" fill="none" stroke="url(#cl-gold)" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="122" r="6.4" fill="url(#cl-cb)" stroke="#B57410" stroke-width="1"/><circle cx="136" cy="122" r="6.4" fill="url(#cl-cb)" stroke="#B57410" stroke-width="1"/>
<circle cx="100" cy="154" r="11.5" fill="#FFD34A" stroke="#C98A0E" stroke-width="2"/><path d="M102.6 144.6 L94.2 155.2 L99.5 155.2 L96.4 163.6 L105.8 151.6 L100.5 151.6 Z" fill="#E3303C"/>` },

  // Шарф: зимова куртка, товстий шарф обмотаний навколо шиї (смуги поперек), звисає кінець з торочками
  { id: 'scarf', name: 'Шарф', fit: FIT,
    back: `<defs>${SHADE}${lg('ct', '#5E8FA8', '#3A6A84', '#22465C')}${GOLD}</defs>
${body('ct', '#16303F')}${ln('M100 150 L100 214', '#16303F', 2.6, .6)}${btn(90, 192, 'url(#cl-gold)', 3.2)}${btn(110, 192, 'url(#cl-gold)', 3.2)}
${ln('M44 114 Q100 94 156 114', '#A11E2E', 20)}`,
    front: `${ln('M44 118 Q100 140 156 118', '#E5343C', 24)}<path d="M44 118 Q100 140 156 118" fill="none" stroke="#fff" stroke-opacity=".92" stroke-width="24" stroke-dasharray="5 9" stroke-dashoffset="2"/>${gl('M46 112 Q100 132 154 112', 3, .35)}${ln('M44 129 Q100 151 156 129', '#7E1020', 2, .35)}
<path d="M114 144 L136 140 L140 180 Q126 186 116 182Z" fill="#E5343C"/>${[152, 164].map((y) => `<path d="M115 ${y} L137 ${y - 4} L137.6 ${y + 1} L115.4 ${y + 5}Z" fill="#fff" fill-opacity=".92"/>`).join('')}${ln('M118 184 l0 6 M124 185 l0 6 M130 185 l0 6 M136 183 l0 6', '#B01E2E', 2.4)}` },

  // Смокінг: чорний піджак з атласними лацканами, біла сорочка, червоний метелик, запонки
  { id: 'tux', name: 'Смокінг', fit: FIT,
    back: `<defs>${SHADE}${lg('tx', '#4A4A5C', '#2A2A38', '#14141E')}${lg('tl', '#5E5E74', '#363644', '#1C1C26')}${lg('tw', '#FFFFFF', '#F4F6FC', '#CDD5EC')}${lg('bt', '#FF8A8A', '#E03A44', '#A11E2E')}${rg('bk', '#FF9AA2', '#B01E2E')}${GOLD}</defs>
${body('tx', '#000')}<path d="M78 110 L100 182 L122 110Z" ${F('tw')}/>`,
    front: `${mir(`<path d="M78 110 L58 132 L92 186 L99 180 L90 132Z" ${F('tl')}/><path d="M78 110 L58 132 L64 134 L84 118Z" fill="#fff" fill-opacity=".16"/>`)}
${mir(`<path d="M84 114 L90 128 L99 122Z" ${F('tw')} stroke="#AEB8D6" stroke-width="1"/>`)}
${mir(`<path d="M99 132 C90 122 78 122 74 128 C72 136 76 144 82 146 C90 146 96 140 99 136Z" ${F('bt')}/>`)}<ellipse cx="100" cy="134" rx="7" ry="8" ${F('bk')}/>${gl('M78 128 C84 125 90 127 94 130', 2.6, .5)}${btn(100, 158, 'url(#cl-gold)', 2.8)}${btn(100, 170, 'url(#cl-gold)', 2.8)}` },

  // Спортивна кофта: стійка на блискавці, білі смуги на плечах, медаль на стрічці
  { id: 'sport', name: 'Спортивна кофта', fit: FIT,
    back: `<defs>${SHADE}${lg('sp', '#FF9AB8', '#F0508A', '#B02464')}${lg('sp2', '#FF7AA6', '#DE3E78', '#9C1B54')}${lg('rb', '#7FB4FF', '#2F6FE0', '#1A3FA0')}${rg('md', '#FFF3B0', '#E39410')}</defs>
${body('sp', '#7C1440')}${ln('M18 186 C22 150 38 128 64 116', '#fff', 7, .9)}${ln('M182 186 C178 150 162 128 136 116', '#fff', 7, .9)}${ringBack(13, '#C42E66', '#7C1440')}`,
    front: `${ringFront(13, '#E24A82', '#7C1440')}
${ln('M100 128 L100 214', '#7C1440', 3)}<rect x="96.4" y="124" width="7.2" height="11" rx="2.4" fill="#E7EAF4" stroke="#7C1440" stroke-width="1"/>
<path d="M80 132 L100 150 L94 154 L74 138Z" ${F('rb')}/><path d="M120 132 L100 150 L106 154 L126 138Z" fill="#E5343C"/>
<circle cx="100" cy="158" r="10" fill="url(#cl-md)" stroke="#B57410" stroke-width="1.4"/><circle cx="100" cy="158" r="6.8" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>${star(100, 158, 4.6, '#fff')}` },

  // Гавайська сорочка: м'який розкритий комір, квіти й листя по всій сорочці
  { id: 'aloha', name: 'Гавайська сорочка', fit: FIT,
    back: `<defs>${SHADE}${lg('al', '#6FE0B8', '#22B58A', '#14805E')}${lg('ac', '#B9F2DA', '#6FD6AE', '#2FA880')}${rg('f1', '#FFB5D3', '#E8508C')}${rg('f2', '#FFF3B0', '#F2A81E')}${rg('f3', '#C9B6FF', '#7A5CE6')}${rg('fc', '#FFF8C2', '#F2A81E')}<clipPath id="cl-alb"><path d="${BODY}"/></clipPath></defs>
<path d="${BODY}" ${F('al')}/><g clip-path="url(#cl-alb)"><path d="M40 150 q-12 10 -24 6 q6 -12 24 -6z M160 150 q12 10 24 6 q-6 -12 -24 -6z M60 176 q-12 8 -22 4 q6 -11 22 -4z M140 176 q12 8 22 4 q-6 -11 -22 -4z" fill="#0E6A4C" fill-opacity=".55"/>${flower(28, 142, 1.1, 'f1')}${flower(172, 142, 1.1, 'f2')}${flower(50, 158, 1.15, 'f3')}${flower(150, 158, 1.15, 'f1')}${flower(70, 178, 1.1, 'f2')}${flower(130, 178, 1.1, 'f3')}${flower(100, 200, 1.1, 'f1')}</g>
<path d="M78 110 L100 146 L122 110Z" fill="#118060"/>${vol('#0B5A40')}`,
    front: `${mir(`<path d="M78 110 C70 118 62 128 58 138 C74 150 86 158 96 164 L99 150 C92 136 88 124 86 116Z" ${F('ac')} stroke="#2FA880" stroke-width="1.4"/>`)}
${ln('M100 150 L100 214', '#0B5A40', 2, .5)}${btn(100, 172, '#F4FFF9', 3, '#0B5A40')}${btn(100, 192, '#F4FFF9', 3, '#0B5A40')}` },
];
