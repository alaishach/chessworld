import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname, normalize, sep } from 'path';

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp3':  'audio/mpeg',
  '.ogg':  'audio/ogg',
  '.wav':  'audio/wav',
};

export const GET: APIRoute = async ({ params }) => {
  const { game, file } = params;

  if (!game || !file) {
    return new Response('Not found', { status: 404 });
  }

  // normalize() converts forward slashes to backslashes on Windows,
  // ensuring startsWith works correctly for the security check on all platforms
  const gamesRoot = normalize(resolve(process.cwd(), 'games'));
  const filePath  = normalize(resolve(process.cwd(), 'games', game, ...file.split('/')));

  // Append sep so 'games' can't be bypassed by a path like 'games-evil/...'
  if (!filePath.startsWith(gamesRoot + sep)) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const ext = extname(filePath).toLowerCase();
  const mime = MIME[ext] ?? 'application/octet-stream';

  const body = readFileSync(filePath);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
