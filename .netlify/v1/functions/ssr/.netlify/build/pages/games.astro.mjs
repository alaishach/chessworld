import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_VoOIF_L1.mjs';
import { b as getRegisteredGames, R as RATING_COLORS } from '../chunks/games_DM25tz1R.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const games = getRegisteredGames();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Games", "description": "All chess-inspired browser games on CHESSWORLD.GAMES", "data-astro-cid-snf5vnxa": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-snf5vnxa> <div class="page-header" data-astro-cid-snf5vnxa> <h1 data-astro-cid-snf5vnxa>GAMES</h1> <p data-astro-cid-snf5vnxa>Chess-inspired browser games built by the Zenith team.</p> </div> ${games.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-snf5vnxa> <div class="empty-icon" data-astro-cid-snf5vnxa>♟</div> <h2 data-astro-cid-snf5vnxa>No games yet</h2> <p data-astro-cid-snf5vnxa>The board is set. Waiting for the first move.</p> <a href="/docs" class="btn btn-primary" style="margin-top:1.5rem" data-astro-cid-snf5vnxa>Read the Docs →</a> </div>` : renderTemplate`<div class="games-grid" data-astro-cid-snf5vnxa> ${games.map((game) => renderTemplate`<a${addAttribute(`/games/${game.id}`, "href")} class="game-card" data-astro-cid-snf5vnxa> <div class="game-thumb" data-astro-cid-snf5vnxa> <img${addAttribute(`/games/${game.id}/${game.thumbnail}`, "src")}${addAttribute(game.title, "alt")} loading="lazy" data-astro-cid-snf5vnxa> <div class="game-overlay" data-astro-cid-snf5vnxa> <span class="play-btn" data-astro-cid-snf5vnxa>▶ Play</span> </div> </div> <div class="game-info" data-astro-cid-snf5vnxa> <div class="game-header" data-astro-cid-snf5vnxa> <h3 data-astro-cid-snf5vnxa>${game.title}</h3> <div class="game-header-right" data-astro-cid-snf5vnxa> <span class="rating-badge"${addAttribute(`background:${RATING_COLORS[game.rating].bg};color:${RATING_COLORS[game.rating].text};border-color:${RATING_COLORS[game.rating].text}30`, "style")} data-astro-cid-snf5vnxa> ${game.rating} </span> <span class="game-version" data-astro-cid-snf5vnxa>v${game.version}</span> </div> </div> <p class="game-desc" data-astro-cid-snf5vnxa>${game.description}</p> ${game.chessRelation && renderTemplate`<p class="chess-relation" data-astro-cid-snf5vnxa>♟ ${game.chessRelation}</p>`} <div class="game-footer" data-astro-cid-snf5vnxa> <div class="game-tags" data-astro-cid-snf5vnxa> ${game.tags.map((tag) => renderTemplate`<span class="tag" data-astro-cid-snf5vnxa>${tag}</span>`)} </div> <span class="game-author" data-astro-cid-snf5vnxa>by ${game.author}</span> </div> </div> </a>`)} </div>`} </div> ` })} `;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/index.astro", void 0);

const $$file = "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/index.astro";
const $$url = "/games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
