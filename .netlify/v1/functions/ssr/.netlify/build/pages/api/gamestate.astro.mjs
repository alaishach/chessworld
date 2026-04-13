export { renderers } from '../../renderers.mjs';

const stateStore = /* @__PURE__ */ new Map();
const GET = async ({ url }) => {
  const game = url.searchParams.get("game");
  const session = url.searchParams.get("session");
  if (!game || !session) {
    return new Response(JSON.stringify({ error: "Missing game or session parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const key = `${game}:${session}`;
  const state = stateStore.get(key) ?? null;
  return new Response(JSON.stringify({ game, session, state }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request, url }) => {
  const game = url.searchParams.get("game");
  const session = url.searchParams.get("session");
  if (!game || !session) {
    return new Response(JSON.stringify({ error: "Missing game or session parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const key = `${game}:${session}`;
  stateStore.set(key, body);
  return new Response(JSON.stringify({ success: true, game, session }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
