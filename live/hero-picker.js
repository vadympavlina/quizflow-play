// Вікно вибору героя й окулярів (для учня в лобі). Самодостатнє: сам додає свої стилі й розмітку.
// openHeroPicker({ name, avatar, glasses, onSave }) — onSave(avatar, glasses) зберігає вибір; якщо кине помилку, вікно лишається відкритим.
import { AVATARS, GLASSES, avatarInner, avatarInfo, randomAvatar, esc } from "./live-core.js?v=13";

const CSS = `
.hp-back{position:fixed;inset:0;z-index:60;background:rgba(20,14,60,.55);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .22s;font-family:'Manrope',system-ui,sans-serif}
.hp-back.open{opacity:1;pointer-events:auto}
.hp{width:100%;max-width:460px;max-height:min(88dvh,640px);background:#fff;color:#1D1930;border-radius:26px 26px 0 0;display:flex;flex-direction:column;transform:translateY(40px);transition:transform .28s cubic-bezier(.22,1,.36,1);box-shadow:0 -20px 60px rgba(20,14,60,.35)}
.hp-back.open .hp{transform:none}
@media (min-width:600px){.hp-back{align-items:center}.hp{border-radius:26px;max-height:min(86vh,680px)}}
.hp-top{display:flex;align-items:center;justify-content:space-between;padding:16px 18px 6px}
.hp-top h2{margin:0;font-size:18px;font-weight:900}
.hp-x{appearance:none;border:0;background:#F2F0FC;color:#5F5876;width:36px;height:36px;border-radius:50%;cursor:pointer;display:grid;place-items:center}
.hp-x svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round}
.hp button:focus-visible{outline:3px solid #5B4FE8;outline-offset:2px}
.hp-body{overflow-y:auto;padding:12px 18px;overscroll-behavior:contain}
.hp-prev{display:flex;align-items:center;gap:14px;padding:6px 18px 12px;border-bottom:1px solid #E4E1F4}
.hp-prev .av{width:84px;height:84px;border-radius:24px;overflow:hidden;flex:0 0 auto;display:grid;place-items:center}
.hp-prev b{display:block;font-size:19px}
.hp-prev span{font-size:13px;color:#8C86A3}
.hp-lbl{font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#8C86A3;margin:6px 0 8px}
.hp-heroes{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:3px;margin:0 -3px}
.hp-gls{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:3px;margin:0 -3px 4px}
.hp-b{appearance:none;border:2px solid transparent;border-radius:16px;padding:0;aspect-ratio:1;cursor:pointer;overflow:hidden;position:relative;display:grid;place-items:center;font-weight:800;font-size:12px;color:#8C86A3;transition:transform .15s,border-color .15s,box-shadow .15s}
.hp-b img,.hp-b svg{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}
.hp-b[aria-checked=true]{border-color:#5B4FE8;box-shadow:0 0 0 3px rgba(91,79,232,.28);transform:scale(1.05);z-index:1}
.hp-err{margin:8px 18px 0;font-size:13px;font-weight:700;color:#B91C1C}
.hp-foot{padding:10px 18px calc(14px + env(safe-area-inset-bottom));display:flex;gap:10px;border-top:1px solid #E4E1F4}
.hp-btn{flex:1;appearance:none;border:1.5px solid #D2CCEA;background:#fff;color:#1D1930;font:800 15px 'Manrope',system-ui,sans-serif;height:48px;border-radius:14px;cursor:pointer}
.hp-btn.pri{background:linear-gradient(135deg,#6D5FF0,#4A3FD1);border-color:transparent;color:#fff}
.hp-btn:disabled{opacity:.6;cursor:progress}
@media (prefers-reduced-motion:reduce){.hp-back,.hp{transition:none}}`;

let root, st = null;
const $ = (s) => root.querySelector(s);

function build() {
  const style = document.createElement("style"); style.id = "hp-css"; style.textContent = CSS; document.head.appendChild(style);
  root = document.createElement("div");
  root.className = "hp-back"; root.setAttribute("aria-hidden", "true");
  root.innerHTML = `<div class="hp" role="dialog" aria-modal="true" aria-labelledby="hp-title">
    <div class="hp-top"><h2 id="hp-title">Ваш герой</h2><button type="button" class="hp-x" aria-label="Закрити"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="hp-prev"><div class="av" data-r="prev"></div><div><b data-r="pname"></b><span>Видно викладачу й усім у грі. Змінити можна, поки гра не почалась.</span></div></div>
    <div class="hp-body">
      <div class="hp-lbl" id="hp-hl">Герой</div><div class="hp-heroes" data-r="heroes" role="radiogroup" aria-labelledby="hp-hl"></div>
      <div class="hp-lbl" id="hp-gl" style="margin-top:14px">Окуляри</div><div class="hp-gls" data-r="gls" role="radiogroup" aria-labelledby="hp-gl"></div>
    </div>
    <div class="hp-err" data-r="err" role="alert" hidden></div>
    <div class="hp-foot"><button type="button" class="hp-btn" data-r="rnd">Випадковий</button><button type="button" class="hp-btn pri" data-r="ok">Готово</button></div>
  </div>`;
  document.body.appendChild(root);
  const r = (n) => root.querySelector(`[data-r="${n}"]`);
  r("heroes").innerHTML = AVATARS.map(a => `<button type="button" class="hp-b" role="radio" aria-checked="false" data-hero="${esc(a.id)}" aria-label="${esc(a.name)}" title="${esc(a.name)}" style="background:${a.bg}">${avatarInner("", a.id)}</button>`).join("");
  r("heroes").addEventListener("click", (e) => { const b = e.target.closest("[data-hero]"); if (b) { st.hero = b.dataset.hero; paint(); } });
  r("gls").addEventListener("click", (e) => { const b = e.target.closest("[data-gl]"); if (b) { st.gls = b.dataset.gl; paint(); } });
  r("heroes").addEventListener("keydown", (e) => {
    const bs = [...r("heroes").querySelectorAll("[data-hero]")], i = bs.indexOf(document.activeElement);
    if (i < 0 || !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault(); const nx = bs[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : bs.length - 1)) % bs.length]; nx.focus(); st.hero = nx.dataset.hero; paint();
  });
  r("rnd").addEventListener("click", () => { st.hero = randomAvatar(); paint(); });
  root.querySelector(".hp-x").addEventListener("click", close);
  root.addEventListener("pointerdown", (e) => { if (e.target === root) close(); });
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.stopPropagation(); close(); return; }
    if (e.key !== "Tab") return;
    const f = [...root.querySelectorAll("button:not([disabled])")], first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  r("ok").addEventListener("click", save);
}

function paint() {
  const r = (n) => root.querySelector(`[data-r="${n}"]`), bg = avatarInfo(st.hero)?.bg || "";
  r("prev").innerHTML = avatarInner("", st.hero, { glasses: st.gls }); r("prev").style.background = bg;
  r("pname").textContent = (avatarInfo(st.hero)?.name || "") + (st.gls ? " · " + (GLASSES.find(g => g.id === st.gls)?.name || "") : "");
  r("heroes").querySelectorAll("[data-hero]").forEach(b => b.setAttribute("aria-checked", b.dataset.hero === st.hero));
  const glBtn = (id, name, inner) => `<button type="button" class="hp-b" role="radio" aria-checked="${id === st.gls}" data-gl="${esc(id)}" aria-label="${esc(name)}" title="${esc(name)}" style="background:${bg}">${inner}</button>`;
  r("gls").innerHTML = glBtn("", "Без окулярів", "без") + GLASSES.map(g => glBtn(g.id, g.name, avatarInner("", st.hero, { glasses: g.id }))).join("");
}

async function save() {
  const ok = root.querySelector('[data-r="ok"]'), err = root.querySelector('[data-r="err"]');
  if (ok.disabled) return;
  ok.disabled = true; err.hidden = true;
  try { await st.onSave(st.hero, st.gls); close(); }
  catch (e) { err.textContent = e?.message || "Не вдалося зберегти. Спробуйте ще раз."; err.hidden = false; }
  finally { ok.disabled = false; }
}

function close() {
  if (!root || !st) return;
  root.classList.remove("open"); root.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  const back = st.back; st = null;
  (back && back.isConnected ? back : document.body).focus?.();
}

export function openHeroPicker({ avatar, glasses, onSave }) {
  if (!root) build();
  st = { hero: avatar || randomAvatar(), gls: glasses || "", onSave, back: document.activeElement };
  root.querySelector('[data-r="err"]').hidden = true;
  paint();
  root.setAttribute("aria-hidden", "false"); root.classList.add("open"); document.body.style.overflow = "hidden";
  setTimeout(() => root.querySelector('[data-r="ok"]').focus({ preventScroll: true }), 60);
}
export const closeHeroPicker = close;
