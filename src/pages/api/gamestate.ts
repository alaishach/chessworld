import type { APIRoute } from 'astro';

// In-memory store for local dev. Replace with a real DB (e.g. Supabase, PlanetScale) for production.
const stateStore = new Map<string, unknown>();

export const GET: APIRoute = async ({ url }) => {
  const game = url.searchParams.get('game');
  const session = url.searchParams.get('session');

  if (!game || !session) {
    return new Response(JSON.stringify({ error: 'Missing game or session parameter.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = `${game}:${session}`;
  const state = stateStore.get(key) ?? null;

  return new Response(JSON.stringify({ game, session, state }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, url }) => {
  const game = url.searchParams.get('game');
  const session = url.searchParams.get('session');

  if (!game || !session) {
    return new Response(JSON.stringify({ error: 'Missing game or session parameter.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = `${game}:${session}`;
  stateStore.set(key, body);

  return new Response(JSON.stringify({ success: true, game, session }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
