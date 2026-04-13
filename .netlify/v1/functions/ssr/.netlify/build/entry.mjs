import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_CGwiFjlt.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/challenge.astro.mjs');
const _page4 = () => import('./pages/api/gamestate.astro.mjs');
const _page5 = () => import('./pages/docs.astro.mjs');
const _page6 = () => import('./pages/games/_game_.astro.mjs');
const _page7 = () => import('./pages/games.astro.mjs');
const _page8 = () => import('./pages/join.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/challenge.ts", _page3],
    ["src/pages/api/gamestate.ts", _page4],
    ["src/pages/docs.astro", _page5],
    ["src/pages/games/[game].astro", _page6],
    ["src/pages/games/index.astro", _page7],
    ["src/pages/join.astro", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0bc59424-b135-4e40-8187-51e457efdac9"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
