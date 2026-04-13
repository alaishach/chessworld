import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_VoOIF_L1.mjs';
import { b as getRegisteredGames } from '../chunks/games_DM25tz1R.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const games = getRegisteredGames();
  const gameCount = games.length;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "CHESSWORLD.GAMES", "description": "Chess-inspired browser games built by the Zenith team.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="hero-inner" data-astro-cid-j7pv25f6> <div class="hero-eyebrow" data-astro-cid-j7pv25f6>A Zenith Project</div> <h1 class="hero-title" data-astro-cid-j7pv25f6>CHESSWORLD<span class="dot" data-astro-cid-j7pv25f6>.</span>GAMES</h1> <p class="hero-sub" data-astro-cid-j7pv25f6>
Browser games built by developers who think in systems.<br data-astro-cid-j7pv25f6>
Chess-inspired. Community-driven. Open to contributors.
</p> <div class="hero-actions" data-astro-cid-j7pv25f6> <a href="/games" class="btn btn-primary" data-astro-cid-j7pv25f6>Browse Games</a> <a href="/docs" class="btn btn-outline" data-astro-cid-j7pv25f6>Start Building</a> </div> <div class="hero-stat" data-astro-cid-j7pv25f6> <span class="stat-num" data-astro-cid-j7pv25f6>${gameCount}</span> <span class="stat-label" data-astro-cid-j7pv25f6>${gameCount === 1 ? "game" : "games"} available</span> </div> </div> </div> <div class="hero-board" aria-hidden="true" data-astro-cid-j7pv25f6> ${Array.from({ length: 64 }).map((_, i) => renderTemplate`<div${addAttribute(["cell", { light: (Math.floor(i / 8) + i) % 2 === 0 }], "class:list")} data-astro-cid-j7pv25f6></div>`)} </div> </section> <section class="features" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="features-grid" data-astro-cid-j7pv25f6> <div class="feature-card" data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-j7pv25f6>♟</div> <h3 data-astro-cid-j7pv25f6>Chess-Inspired</h3> <p data-astro-cid-j7pv25f6>Every game on this platform draws from chess in some way — strategy, structure, rules, or aesthetics.</p> </div> <div class="feature-card" data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-j7pv25f6>⚡</div> <h3 data-astro-cid-j7pv25f6>Developer Freedom</h3> <p data-astro-cid-j7pv25f6>Use any stack you want. React, Svelte, vanilla JS, canvas — if it runs in a browser, it belongs here.</p> </div> <div class="feature-card" data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-j7pv25f6>🔒</div> <h3 data-astro-cid-j7pv25f6>Curated Quality</h3> <p data-astro-cid-j7pv25f6>Every game is reviewed before going live. We're not just looking for polish — we're looking for how you think.</p> </div> </div> </div> </section> ${gameCount > 0 && renderTemplate`<section class="preview" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <h2 class="section-title" data-astro-cid-j7pv25f6>LATEST GAMES</h2> <div class="games-preview" data-astro-cid-j7pv25f6> ${games.slice(0, 3).map((game) => renderTemplate`<a${addAttribute(`/games/${game.id}`, "href")} class="game-card" data-astro-cid-j7pv25f6> <div class="game-thumb" data-astro-cid-j7pv25f6> <img${addAttribute(`/games/${game.id}/${game.thumbnail}`, "src")}${addAttribute(game.title, "alt")} loading="lazy" data-astro-cid-j7pv25f6> </div> <div class="game-info" data-astro-cid-j7pv25f6> <h3 data-astro-cid-j7pv25f6>${game.title}</h3> <p data-astro-cid-j7pv25f6>${game.description}</p> <div class="game-tags" data-astro-cid-j7pv25f6> ${game.tags.map((tag) => renderTemplate`<span class="tag" data-astro-cid-j7pv25f6>${tag}</span>`)} </div> </div> </a>`)} </div> <div class="preview-cta" data-astro-cid-j7pv25f6> <a href="/games" class="btn btn-outline" data-astro-cid-j7pv25f6>View All Games →</a> </div> </div> </section>`}` })} `;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/index.astro", void 0);

const $$file = "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
