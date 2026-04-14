import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

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

  const filePath = resolve(process.cwd(), 'games', game, ...file.split('/'));

  // Security: ensure the resolved path stays within the games directory
  const gamesRoot = resolve(process.cwd(), 'games');
  if (!filePath.startsWith(gamesRoot)) {
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
