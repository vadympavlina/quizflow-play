// Вікно вибору героя, окулярів, капелюха й одягу (вхід у гру й лобі). Самодостатнє: саме додає свої стилі й розмітку.
// openHeroPicker({ avatar, glasses, hat, outfit, hint, onSave }) — onSave(avatar, glasses, hat, outfit) зберігає вибір; якщо кине помилку, вікно лишається відкритим.
// Телефон: велика шторка знизу (перегляд, вкладки «Герой» / «Окуляри» / «Капелюх» / «Одяг», сітка з іменами, велика кнопка «Готово»).
// Великий екран: вікно по центру у дві колонки (ліворуч великий перегляд, праворуч вибір).
import { AVATARS, GLASSES, HATS, CLOTHES, avatarInner, avatarInfo, randomAvatar, esc } from "./live-core.js?v=15";

const CSS = `
.hp-back{--a:#5B4FE8;--a2:#4A3FD1;--ink:#1D1930;--ink2:#5F5876;--ink3:#8C86A3;--line:#E4E1F4;--soft:#F2F0FC;position:fixed;inset:0;z-index:60;background:rgba(20,14,60,.55);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .22s;font-family:'Manrope',system-ui,sans-serif}
.hp-back.open{opacity:1;pointer-events:auto}
.hp{position:relative;width:100%;max-width:560px;height:min(94dvh,860px);background:#fff;color:var(--ink);border-radius:28px 28px 0 0;display:flex;flex-direction:column;transform:translateY(40px);transition:transform .3s cubic-bezier(.22,1,.36,1);box-shadow:0 -20px 60px rgba(20,14,60,.35)}
.hp-back.open .hp{transform:none}
.hp::before{content:"";position:absolute;left:50%;top:8px;width:40px;height:5px;margin-left:-20px;border-radius:3px;background:#D8D3EE}
.hp button{font-family:inherit}
.hp button:focus-visible{outline:3px solid var(--a);outline-offset:2px}
.hp-side,.hp-main{display:contents}
.hp-x{position:absolute;top:18px;right:16px;z-index:2;appearance:none;border:0;background:var(--soft);color:var(--ink2);width:40px;height:40px;border-radius:50%;cursor:pointer;display:grid;place-items:center}
.hp-x svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round}
.hp-top{order:1;padding:26px 64px 0 20px}
.hp-top h2{margin:0;font-size:20px;font-weight:900;letter-spacing:-.01em}
.hp-prev{order:2;display:flex;align-items:center;gap:16px;padding:14px 20px 4px}
.hp-av{width:112px;height:112px;border-radius:32px;overflow:hidden;flex:0 0 auto;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
.hp-av img,.hp-av svg{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}
.hp-av.pop{animation:hpPop .32s cubic-bezier(.2,1.5,.3,1)}
@keyframes hpPop{from{transform:scale(.9)}to{transform:none}}
.hp-who{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:3px}
.hp-who b{font-size:24px;font-weight:900;letter-spacing:-.02em;line-height:1.1}
.hp-who span{font-size:14.5px;font-weight:600;color:var(--ink2)}
.hp-rnd{margin-top:8px;appearance:none;border:1.5px solid #D2CCEA;background:#fff;color:var(--ink);font:800 14px 'Manrope',system-ui,sans-serif;height:40px;padding:0 14px 0 12px;border-radius:12px;display:inline-flex;align-items:center;gap:8px;cursor:pointer}
.hp-rnd:hover{background:var(--soft)}
.hp-rnd svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hp-hint{order:3;margin:0;padding:8px 20px 12px;font-size:13px;line-height:1.4;font-weight:600;color:var(--ink3)}
.hp-tabs{order:4;margin:0 20px 2px;padding:4px;background:var(--soft);border-radius:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.hp-tab{appearance:none;border:0;background:transparent;height:44px;border-radius:12px;font:800 15px 'Manrope',system-ui,sans-serif;color:var(--ink2);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
.hp-tab i{font-style:normal;font-weight:700;font-size:12.5px;color:var(--ink3)}
@media (max-width:360px){.hp-tab{font-size:13.5px;gap:4px}}
.hp-tab[aria-selected=true]{background:#fff;color:var(--a);box-shadow:0 2px 8px rgba(40,30,110,.14)}
.hp-scroll{order:5;position:relative;flex:1;min-height:0;overflow-y:auto;padding:14px 20px 18px;overscroll-behavior:contain}
.hp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px 10px}
.hp-grid[hidden]{display:none}
.hp-t{appearance:none;border:0;background:none;padding:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;font:700 12.5px/1.2 'Manrope',system-ui,sans-serif;color:var(--ink2);min-width:0}
.hp-f{position:relative;width:100%;aspect-ratio:1;border-radius:22px;overflow:hidden;display:grid;place-items:center;transition:transform .15s,box-shadow .15s}
.hp-f img,.hp-f svg{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}
.hp-t:hover .hp-f{transform:translateY(-2px)}
.hp-t[aria-checked=true]{color:var(--a)}
.hp-t[aria-checked=true] .hp-f{box-shadow:0 0 0 3px #fff,0 0 0 6px var(--a),0 10px 20px rgba(91,79,232,.3);transform:scale(.96)}
.hp-chk{position:absolute;right:6px;top:6px;width:24px;height:24px;border-radius:50%;background:var(--a);color:#fff;display:none;place-items:center}
.hp-chk svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.hp-t[aria-checked=true] .hp-chk{display:grid}
.hp-nm{max-width:100%;text-align:center;overflow-wrap:anywhere;hyphens:auto}
.hp-foot{order:6;padding:12px 20px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--line);display:flex;flex-direction:column;gap:8px}
.hp-err{margin:0;font-size:13px;font-weight:700;color:#B91C1C}
.hp-ok{appearance:none;border:0;height:56px;border-radius:16px;background:linear-gradient(135deg,#6D5FF0,#4A3FD1);color:#fff;font:800 17px 'Manrope',system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 20px rgba(91,79,232,.35)}
.hp-ok:disabled{opacity:.6;cursor:progress}
@media (max-width:359px){.hp-grid{grid-template-columns:repeat(3,1fr)}.hp-av{width:92px;height:92px;border-radius:26px}.hp-who b{font-size:21px}}
@media (min-width:480px){.hp-back{align-items:center}.hp{width:calc(100% - 32px);max-width:640px;height:min(90dvh,820px);border-radius:28px}.hp::before{display:none}.hp-grid{grid-template-columns:repeat(5,1fr)}}
@media (min-width:820px){
  .hp{width:calc(100% - 48px);max-width:980px;height:min(88vh,720px);border-radius:30px;display:grid;grid-template-columns:340px minmax(0,1fr)}
  .hp-side{display:flex;flex-direction:column;padding:30px 26px 24px;background:linear-gradient(180deg,#F5F3FE,#ECE8FD);border-radius:30px 0 0 30px;min-height:0}
  .hp-main{display:flex;flex-direction:column;min-height:0}
  .hp-top{padding:0 0 18px}
  .hp-prev{flex-direction:column;align-items:flex-start;padding:0;gap:18px}
  .hp-av{width:100%;max-width:250px;height:auto;aspect-ratio:1;border-radius:38px}
  .hp-who b{font-size:28px}
  .hp-hint{padding:14px 0 0}
  .hp-foot{margin-top:auto;border:0;padding:0}
  .hp-tabs{margin:30px 66px 4px 26px;max-width:340px}
  .hp-scroll{padding:16px 26px 26px}
  .hp-grid{grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:20px 14px}
}
/* Низький екран (телефон горизонтально): дві колонки, кнопка «Готово» завжди в межах екрана, сітка героїв має достатньо місця */
@media (max-height:520px) and (min-width:480px){
  .hp-back{align-items:center}
  .hp{width:calc(100% - 24px);max-width:920px;height:calc(100dvh - 16px);border-radius:22px;display:grid;grid-template-columns:232px minmax(0,1fr)}
  .hp::before{display:none}
  .hp-side{display:flex;flex-direction:column;padding:14px 16px;background:linear-gradient(180deg,#F5F3FE,#ECE8FD);border-radius:22px 0 0 22px;min-height:0;overflow:hidden}
  .hp-main{display:flex;flex-direction:column;min-height:0}
  .hp-top{padding:0 0 8px}.hp-top h2{font-size:17px}
  .hp-prev{flex-direction:row;align-items:center;padding:0;gap:10px}
  .hp-av{width:72px;height:72px;max-width:none;aspect-ratio:auto;border-radius:20px}
  .hp-who b{font-size:18px}.hp-who span{font-size:12px}
  .hp-rnd{height:34px;margin-top:4px;font-size:12.5px;padding:0 10px 0 8px}
  .hp-hint{padding:8px 0 0;font-size:11.5px;line-height:1.35}
  .hp-foot{margin-top:auto;border:0;padding:0}
  .hp-ok{height:44px;font-size:15px;border-radius:14px}
  .hp-tabs{margin:12px 14px 4px;max-width:none}
  .hp-tab{height:36px;font-size:14px}
  .hp-scroll{padding:10px 14px 14px}
  .hp-grid{grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:12px 10px}
  .hp-x{top:10px;left:186px;right:auto;width:36px;height:36px}
}
@media (max-height:520px) and (min-width:480px) and (max-width:640px){.hp-tab{font-size:13px;gap:4px}.hp-tabs{padding:3px;gap:2px}}
@media (max-height:360px) and (min-width:480px){.hp-hint{display:none}}
@media (prefers-reduced-motion:reduce){.hp-back,.hp,.hp-f{transition:none}.hp-av.pop{animation:none}}`;

const DICE = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/></svg>`;
const CHECK = `<span class="hp-chk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>`;

let root, st = null;
const q = (n) => root.querySelector(`[data-r="${n}"]`);

const TABS = [{ k: "hero", l: "Герой" }, { k: "gls", l: "Окуляри" }, { k: "hat", l: "Капелюх" }, { k: "out", l: "Одяг" }];
const OPTS = { gls: { list: GLASSES, key: "glasses", none: "Без окулярів" }, hat: { list: HATS, key: "hat", none: "Без капелюха" }, out: { list: CLOTHES, key: "outfit", none: "Без одягу" } };

function build() {
  const style = document.createElement("style"); style.id = "hp-css"; style.textContent = CSS; document.head.appendChild(style);
  root = document.createElement("div");
  root.className = "hp-back"; root.setAttribute("aria-hidden", "true");
  root.innerHTML = `<div class="hp" role="dialog" aria-modal="true" aria-labelledby="hp-title">
    <button type="button" class="hp-x" aria-label="Закрити"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <div class="hp-side">
      <div class="hp-top"><h2 id="hp-title">Ваш герой</h2></div>
      <div class="hp-prev"><div class="hp-av" data-r="prev"></div><div class="hp-who"><b data-r="pname"></b><span data-r="pacc"></span><button type="button" class="hp-rnd" data-r="rnd">${DICE}Випадковий</button></div></div>
      <p class="hp-hint" data-r="hint"></p>
      <div class="hp-foot"><p class="hp-err" data-r="err" role="alert" hidden></p><button type="button" class="hp-ok" data-r="ok">Готово</button></div>
    </div>
    <div class="hp-main">
      <div class="hp-tabs" role="tablist" aria-label="Що змінити">${TABS.map(t => `<button type="button" class="hp-tab" role="tab" id="hp-tab-${t.k}" aria-controls="hp-pan-${t.k}" data-tab="${t.k}">${t.l}</button>`).join("")}</div>
      <div class="hp-scroll" data-r="scroll">
        ${TABS.map(t => `<div class="hp-grid" id="hp-pan-${t.k}" data-r="g-${t.k}" role="radiogroup" aria-labelledby="hp-tab-${t.k}"${t.k === "hero" ? "" : " hidden"}></div>`).join("")}
      </div>
    </div>
  </div>`;
  document.body.appendChild(root);
  q("g-hero").innerHTML = AVATARS.map(a => `<button type="button" class="hp-t" role="radio" aria-checked="false" tabindex="-1" data-hero="${esc(a.id)}" aria-label="${esc(a.name)}"><span class="hp-f" style="background:${esc(a.bg)}">${avatarInner("", a.id)}${CHECK}</span><span class="hp-nm">${esc(a.name)}</span></button>`).join("");
  q("g-hero").addEventListener("click", (e) => { const b = e.target.closest("[data-hero]"); if (b) setHero(b.dataset.hero); });
  for (const t of TABS) if (t.k !== "hero") q("g-" + t.k).addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { st[t.k] = b.dataset.v; paint(); } });
  root.querySelectorAll("[data-tab]").forEach(t => t.addEventListener("click", () => { st.tab = t.dataset.tab; paint(); }));
  q("rnd").addEventListener("click", () => setHero(randomAvatar()));
  root.querySelector(".hp-x").addEventListener("click", close);
  root.addEventListener("pointerdown", (e) => { if (e.target === root) close(); });
  // Стрілки по сітці (вгору/вниз — на рядок, вліво/вправо — на одну плитку), Home/End; вкладки — стрілками вліво/вправо
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.stopPropagation(); close(); return; }
    if (e.key === "Tab") {
      const f = [...root.querySelectorAll("button:not([disabled])")].filter(b => b.offsetParent !== null && (b.tabIndex >= 0 || b === document.activeElement)), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    const cur = document.activeElement;
    if (cur?.matches("[data-tab]") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault(); const n = TABS.length, i = TABS.findIndex(t => t.k === st.tab); st.tab = TABS[(i + (e.key === "ArrowRight" ? 1 : n - 1)) % n].k; paint(); root.querySelector(`[data-tab="${st.tab}"]`).focus(); return;
    }
    const grid = cur?.closest(".hp-grid"); if (!grid) return;
    const bs = [...grid.querySelectorAll("[role=radio]")], i = bs.indexOf(cur); if (i < 0) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length || 1;
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + cols, ArrowUp: i - cols, Home: 0, End: bs.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const nx = bs[Math.max(0, Math.min(bs.length - 1, to))]; nx.focus();
    if (nx.dataset.hero) setHero(nx.dataset.hero); else { st[st.tab] = nx.dataset.v; paint(); nx.focus(); }
  });
  q("ok").addEventListener("click", save);
}

function setHero(id) { st.hero = id; q("prev").classList.remove("pop"); void q("prev").offsetWidth; q("prev").classList.add("pop"); paint(); }

function paint() {
  const info = avatarInfo(st.hero), bg = info?.bg || "";
  q("prev").innerHTML = avatarInner("", st.hero, { glasses: st.gls, hat: st.hat, outfit: st.out }); q("prev").style.background = bg;
  q("pname").textContent = info?.name || "";
  const names = [OPTS.gls, OPTS.hat, OPTS.out].map((o, i) => o.list.find(x => x.id === st[["gls", "hat", "out"][i]])?.name).filter(Boolean);
  q("pacc").textContent = names.length ? names.join(", ") : "Без аксесуарів";
  root.querySelectorAll("[data-tab]").forEach(t => { const on = t.dataset.tab === st.tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
  for (const t of TABS) q("g-" + t.k).hidden = st.tab !== t.k;
  q("g-hero").querySelectorAll("[data-hero]").forEach(b => { const on = b.dataset.hero === st.hero; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
  const tile = (k, id, name, inner) => `<button type="button" class="hp-t" role="radio" aria-checked="${id === st[k]}" tabindex="${id === st[k] ? 0 : -1}" data-v="${esc(id)}" aria-label="${esc(name)}"><span class="hp-f" style="background:${esc(bg)}">${inner}${CHECK}</span><span class="hp-nm">${esc(name)}</span></button>`;
  // перелік малюється лише для відкритої вкладки (перегляд кожного варіанта — окремий SVG)
  if (st.tab !== "hero") { const o = OPTS[st.tab]; q("g-" + st.tab).innerHTML = tile(st.tab, "", o.none, avatarInner("", st.hero)) + o.list.map(x => tile(st.tab, x.id, x.name, avatarInner("", st.hero, { [o.key]: x.id }))).join(""); }
}

async function save() {
  const ok = q("ok"), err = q("err");
  if (ok.disabled) return;
  ok.disabled = true; err.hidden = true;
  try { await st.onSave(st.hero, st.gls, st.hat, st.out); close(); }
  catch (e) { err.textContent = e?.message || "Не вдалося зберегти. Спробуйте ще раз."; err.hidden = false; }
  finally { ok.disabled = false; }
}

function close() {
  if (!root || !st) return;
  root.classList.remove("open"); root.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  const back = st.back; st = null;
  (back && back.isConnected ? back : document.body).focus?.();
}

export function openHeroPicker({ avatar, glasses, hat, outfit, hint, onSave }) {
  if (!root) build();
  st = { hero: avatar || randomAvatar(), gls: glasses || "", hat: hat || "", out: outfit || "", tab: "hero", onSave, back: document.activeElement };
  q("err").hidden = true;
  q("hint").textContent = hint || "Видно викладачу й усім у грі. Змінити можна, поки гра не почалась.";
  paint();
  root.setAttribute("aria-hidden", "false"); root.classList.add("open"); document.body.style.overflow = "hidden";
  // обрана плитка видна одразу: сітка з 24 героїв довша за екран телефона
  const sc = q("scroll"), sel = q("g-hero").querySelector('[aria-checked="true"]');
  requestAnimationFrame(() => { if (sel) sc.scrollTop = Math.max(0, sel.offsetTop - sc.clientHeight / 2 + sel.offsetHeight / 2); setTimeout(() => (sel || q("ok")).focus({ preventScroll: true }), 40); });
}
export const closeHeroPicker = close;
