import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_VoOIF_L1.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "404", "description": "Page not found" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="placeholder-page"> <div class="inner"> <h1>404</h1> <div class="placeholder-accent"></div> <p>This square is empty. The page you're looking for doesn't exist.</p> <a href="/" class="btn btn-outline" style="margin-top:1.5rem">← Back to Home</a> </div> </div> ` })}`;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/404.astro", void 0);

const $$file = "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
