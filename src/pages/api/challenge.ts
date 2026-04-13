import type { APIRoute } from 'astro';

/**
 * Daily Challenge API
 * Returns a deterministic seed value for the current UTC day.
 * All players get the same value on the same day.
 * Games can use this seed to generate a consistent daily puzzle/challenge.
 *
 * GET /api/challenge?game=your-game-name
 */
export const GET: APIRoute = async ({ url }) => {
  const game = url.searchParams.get('game');

  if (!game) {
    return new Response(JSON.stringify({ error: 'Missing game parameter.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = new Date();
  const dateKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

  // Simple deterministic seed from date + game name
  const raw = `${game}:${dateKey}`;
  let seed = 0;
  for (let i = 0; i < raw.length; i++) {
    seed = (seed * 31 + raw.charCodeAt(i)) >>> 0;
  }

  // Calculate milliseconds until next UTC midnight
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const expiresIn = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

  return new Response(
    JSON.stringify({
      game,
      date: dateKey,
      seed,
      expiresInSeconds: expiresIn,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${expiresIn}`,
      },
    }
  );
};
