import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_VoOIF_L1.mjs';
export { renderers } from '../renderers.mjs';

const $$Join = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Join the Team", "description": "Join the CHESSWORLD.GAMES development team" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="placeholder-page"> <div class="inner"> <h1>JOIN</h1> <div class="placeholder-accent"></div> <p>
We will update this page soon.<br>
Please visit our repository for more information.
</p> <p style="margin-top:1rem"> <a href="https://github.com/alaishach/game.chessworld" target="_blank" rel="noopener">
https://github.com/alaishach/game.chessworld
</a> </p> </div> </div> ` })}`;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/join.astro", void 0);

const $$file = "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/join.astro";
const $$url = "/join";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Join,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
