import { f as createComponent, h as addAttribute, k as renderHead, r as renderTemplate, l as renderSlot, i as createAstro } from './astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title = "CHESSWORLD.GAMES", description = "A platform for chess-inspired browser games." } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const navLinks = [
    { href: "/games", label: "Games" },
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About" },
    { href: "/join", label: "Join" }
  ];
  return renderTemplate`<html lang="en" data-astro-cid-5hce7sga> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title === "CHESSWORLD.GAMES" ? title : `${title} \u2014 CHESSWORLD.GAMES`}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body data-astro-cid-5hce7sga> <nav class="nav" data-astro-cid-5hce7sga> <div class="container nav-inner" data-astro-cid-5hce7sga> <a href="/" class="nav-brand" data-astro-cid-5hce7sga>CHESSWORLD.GAMES</a> <ul class="nav-links" data-astro-cid-5hce7sga> ${navLinks.map((link) => renderTemplate`<li data-astro-cid-5hce7sga> <a${addAttribute(link.href, "href")}${addAttribute(["nav-link", { active: currentPath.startsWith(link.href) }], "class:list")} data-astro-cid-5hce7sga> ${link.label} </a> </li>`)} </ul> <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" data-astro-cid-5hce7sga> <span data-astro-cid-5hce7sga></span><span data-astro-cid-5hce7sga></span><span data-astro-cid-5hce7sga></span> </button> </div> </nav> <main data-astro-cid-5hce7sga> ${renderSlot($$result, $$slots["default"])} </main> <footer class="footer" data-astro-cid-5hce7sga> <div class="container footer-inner" data-astro-cid-5hce7sga> <span class="footer-brand" data-astro-cid-5hce7sga>CHESSWORLD.GAMES</span> <span class="footer-text" data-astro-cid-5hce7sga>A Zenith Project</span> <a href="https://github.com/alaishach/game.chessworld" target="_blank" rel="noopener" class="footer-link" data-astro-cid-5hce7sga>
GitHub ↗
</a> </div> </footer>  </body></html>`;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/layouts/Base.astro", void 0);

export { $$Base as $ };
