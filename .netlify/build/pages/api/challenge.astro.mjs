export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  const game = url.searchParams.get("game");
  if (!game) {
    return new Response(JSON.stringify({ error: "Missing game parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const now = /* @__PURE__ */ new Date();
  const dateKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const raw = `${game}:${dateKey}`;
  let seed = 0;
  for (let i = 0; i < raw.length; i++) {
    seed = seed * 31 + raw.charCodeAt(i) >>> 0;
  }
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const expiresIn = Math.floor((tomorrow.getTime() - now.getTime()) / 1e3);
  return new Response(
    JSON.stringify({
      game,
      date: dateKey,
      seed,
      expiresInSeconds: expiresIn
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${expiresIn}`
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
