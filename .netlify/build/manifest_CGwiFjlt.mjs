import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_CarCqUpx.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Documents/-My%20Stuff-/2.%20Creative%20Stuff/1.%20Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/challenge","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/challenge\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"challenge","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/challenge.ts","pathname":"/api/challenge","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/gamestate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/gamestate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"gamestate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/gamestate.ts","pathname":"/api/gamestate","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"},{"type":"external","src":"/_astro/docs.wzH4NmNa.css"}],"routeData":{"route":"/docs","isIndex":false,"type":"page","pattern":"^\\/docs\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs.astro","pathname":"/docs","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"},{"type":"external","src":"/_astro/_game_.Chs4SN0Q.css"}],"routeData":{"route":"/games/[game]","isIndex":false,"type":"page","pattern":"^\\/games\\/([^/]+?)\\/?$","segments":[[{"content":"games","dynamic":false,"spread":false}],[{"content":"game","dynamic":true,"spread":false}]],"params":["game"],"component":"src/pages/games/[game].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"},{"type":"inline","content":".games-grid[data-astro-cid-snf5vnxa]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;padding-bottom:4rem}.game-card[data-astro-cid-snf5vnxa]{display:block;background:#415a7733;border:1px solid rgba(119,141,169,.2);border-radius:12px;overflow:hidden;text-decoration:none;transition:all .25s ease}.game-card[data-astro-cid-snf5vnxa]:hover{border-color:#3a86ff66;transform:translateY(-4px);box-shadow:0 8px 32px #0000004d}.game-thumb[data-astro-cid-snf5vnxa]{position:relative;aspect-ratio:16/9;background:#415a7780;overflow:hidden}.game-thumb[data-astro-cid-snf5vnxa] img[data-astro-cid-snf5vnxa]{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}.game-card[data-astro-cid-snf5vnxa]:hover .game-thumb[data-astro-cid-snf5vnxa] img[data-astro-cid-snf5vnxa]{transform:scale(1.04)}.game-overlay[data-astro-cid-snf5vnxa]{position:absolute;inset:0;background:#1b263b99;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}.game-card[data-astro-cid-snf5vnxa]:hover .game-overlay[data-astro-cid-snf5vnxa]{opacity:1}.play-btn[data-astro-cid-snf5vnxa]{background:var(--color-primary);color:#fff;padding:.6rem 1.5rem;border-radius:6px;font-weight:600;font-size:.95rem;letter-spacing:.02em}.game-info[data-astro-cid-snf5vnxa]{padding:1.25rem}.game-header[data-astro-cid-snf5vnxa]{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.5rem}.game-header-right[data-astro-cid-snf5vnxa]{display:flex;align-items:center;gap:.4rem;flex-shrink:0}.rating-badge[data-astro-cid-snf5vnxa]{font-family:var(--font-mono);font-size:.65rem;font-weight:600;padding:.15rem .45rem;border-radius:3px;border:1px solid;letter-spacing:.04em}.game-header[data-astro-cid-snf5vnxa] h3[data-astro-cid-snf5vnxa]{font-size:1.2rem;color:var(--color-text-primary)}.game-version[data-astro-cid-snf5vnxa]{font-family:var(--font-mono);font-size:.7rem;color:var(--color-border)}.game-desc[data-astro-cid-snf5vnxa]{font-size:.875rem;color:var(--color-text-secondary);line-height:1.55;margin-bottom:.6rem}.chess-relation[data-astro-cid-snf5vnxa]{font-size:.8rem;color:var(--color-secondary);margin-bottom:.75rem;font-style:italic}.game-footer[data-astro-cid-snf5vnxa]{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}.game-tags[data-astro-cid-snf5vnxa]{display:flex;gap:.35rem;flex-wrap:wrap}.game-author[data-astro-cid-snf5vnxa]{font-size:.75rem;color:var(--color-border);font-family:var(--font-mono);flex-shrink:0}.empty-state[data-astro-cid-snf5vnxa]{text-align:center;padding:6rem 2rem}.empty-icon[data-astro-cid-snf5vnxa]{font-size:4rem;margin-bottom:1.5rem;opacity:.3}.empty-state[data-astro-cid-snf5vnxa] h2[data-astro-cid-snf5vnxa]{font-size:2rem;color:var(--color-text-primary);margin-bottom:.75rem}.empty-state[data-astro-cid-snf5vnxa] p[data-astro-cid-snf5vnxa]{color:var(--color-text-secondary)}\n"}],"routeData":{"route":"/games","isIndex":true,"type":"page","pattern":"^\\/games\\/?$","segments":[[{"content":"games","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/games/index.astro","pathname":"/games","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"}],"routeData":{"route":"/join","isIndex":false,"type":"page","pattern":"^\\/join\\/?$","segments":[[{"content":"join","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/join.astro","pathname":"/join","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const e=document.getElementById(\"navToggle\"),n=document.querySelector(\".nav-links\");e?.addEventListener(\"click\",()=>{n?.classList.toggle(\"open\")});\n"}],"styles":[{"type":"external","src":"/_astro/about.BKylWDHm.css"},{"type":"inline","content":".hero[data-astro-cid-j7pv25f6]{position:relative;min-height:calc(100vh - var(--nav-height));display:flex;align-items:center;overflow:hidden}.hero-inner[data-astro-cid-j7pv25f6]{position:relative;z-index:2;padding:5rem 0}.hero-eyebrow[data-astro-cid-j7pv25f6]{font-family:var(--font-mono);font-size:.8rem;color:var(--color-secondary);letter-spacing:.15em;text-transform:uppercase;margin-bottom:1rem}.hero-title[data-astro-cid-j7pv25f6]{font-size:clamp(4rem,12vw,9rem);color:var(--color-text-primary);line-height:1;margin-bottom:1.5rem}.dot[data-astro-cid-j7pv25f6]{color:var(--color-accent)}.hero-sub[data-astro-cid-j7pv25f6]{font-size:clamp(1rem,2vw,1.2rem);color:var(--color-text-secondary);max-width:520px;line-height:1.7;margin-bottom:2.5rem}.hero-actions[data-astro-cid-j7pv25f6]{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3rem}.hero-stat[data-astro-cid-j7pv25f6]{display:flex;align-items:baseline;gap:.5rem}.stat-num[data-astro-cid-j7pv25f6]{font-family:var(--font-display);font-size:2.5rem;color:var(--color-accent);line-height:1}.stat-label[data-astro-cid-j7pv25f6]{font-size:.9rem;color:var(--color-border)}.hero-board[data-astro-cid-j7pv25f6]{position:absolute;right:-5%;top:50%;transform:translateY(-50%) rotate(12deg);display:grid;grid-template-columns:repeat(8,1fr);width:min(50vw,480px);aspect-ratio:1;opacity:.06;pointer-events:none}.cell[data-astro-cid-j7pv25f6]{background:var(--color-bg-surface)}.cell[data-astro-cid-j7pv25f6].light{background:var(--color-text-primary)}.features[data-astro-cid-j7pv25f6]{padding:5rem 0;border-top:1px solid rgba(119,141,169,.15)}.features-grid[data-astro-cid-j7pv25f6]{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem}.feature-card[data-astro-cid-j7pv25f6]{background:#415a7740;border:1px solid rgba(119,141,169,.2);border-radius:12px;padding:2rem;transition:border-color .2s,transform .2s}.feature-card[data-astro-cid-j7pv25f6]:hover{border-color:#3a86ff4d;transform:translateY(-2px)}.feature-icon[data-astro-cid-j7pv25f6]{font-size:2rem;margin-bottom:1rem;line-height:1}.feature-card[data-astro-cid-j7pv25f6] h3[data-astro-cid-j7pv25f6]{font-size:1.3rem;color:var(--color-text-primary);margin-bottom:.75rem}.feature-card[data-astro-cid-j7pv25f6] p[data-astro-cid-j7pv25f6]{color:var(--color-text-secondary);font-size:.95rem;line-height:1.6}.preview[data-astro-cid-j7pv25f6]{padding:4rem 0;border-top:1px solid rgba(119,141,169,.15)}.section-title[data-astro-cid-j7pv25f6]{font-size:2rem;color:var(--color-text-primary);margin-bottom:2rem;letter-spacing:.08em}.games-preview[data-astro-cid-j7pv25f6]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;margin-bottom:2rem}.game-card[data-astro-cid-j7pv25f6]{background:#415a7733;border:1px solid rgba(119,141,169,.2);border-radius:12px;overflow:hidden;text-decoration:none;transition:all .2s;display:block}.game-card[data-astro-cid-j7pv25f6]:hover{border-color:#3a86ff66;transform:translateY(-3px)}.game-thumb[data-astro-cid-j7pv25f6]{aspect-ratio:16/9;background:#415a7766;overflow:hidden}.game-thumb[data-astro-cid-j7pv25f6] img[data-astro-cid-j7pv25f6]{width:100%;height:100%;object-fit:cover}.game-info[data-astro-cid-j7pv25f6]{padding:1.25rem}.game-info[data-astro-cid-j7pv25f6] h3[data-astro-cid-j7pv25f6]{font-size:1.2rem;color:var(--color-text-primary);margin-bottom:.4rem}.game-info[data-astro-cid-j7pv25f6] p[data-astro-cid-j7pv25f6]{font-size:.875rem;color:var(--color-text-secondary);margin-bottom:.75rem;line-height:1.5}.game-tags[data-astro-cid-j7pv25f6]{display:flex;gap:.4rem;flex-wrap:wrap}.preview-cta[data-astro-cid-j7pv25f6]{text-align:center;margin-top:1rem}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/404.astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/about.astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/docs.astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/[game].astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/index.astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/join.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/challenge@_@ts":"pages/api/challenge.astro.mjs","\u0000@astro-page:src/pages/api/gamestate@_@ts":"pages/api/gamestate.astro.mjs","\u0000@astro-page:src/pages/docs@_@astro":"pages/docs.astro.mjs","\u0000@astro-page:src/pages/games/[game]@_@astro":"pages/games/_game_.astro.mjs","\u0000@astro-page:src/pages/games/index@_@astro":"pages/games.astro.mjs","\u0000@astro-page:src/pages/join@_@astro":"pages/join.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CGwiFjlt.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.Cux8uoNw.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/about.BKylWDHm.css","/_astro/docs.wzH4NmNa.css","/_astro/_game_.Chs4SN0Q.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"DPcEsBxSH0iVCizDxZwXKZNSGH1tYrMZW3iMRP4KcnQ=","experimentalEnvGetSecretEnabled":false});

export { manifest };
