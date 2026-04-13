import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export type GameRating = 'E' | 'T' | 'M';

export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string;
}

export interface GameManifest {
  id: string;
  title: string;
  description: string;
  author: string;
  version: string;
  thumbnail: string;
  entry: string;
  tags: string[];
  rating: GameRating;
  chessRelation?: string;
  changelog: ChangelogEntry[];
}

export interface GameContent {
  manifest: GameManifest;
  description: string | null;
  rules: string | null;
}

export const RATING_LABELS: Record<GameRating, string> = {
  E: 'Everyone',
  T: 'Teen',
  M: 'Mature',
};

export const RATING_COLORS: Record<GameRating, { bg: string; text: string }> = {
  E: { bg: 'rgba(128, 237, 153, 0.15)', text: '#80ED99' },
  T: { bg: 'rgba(255, 209, 102, 0.15)', text: '#FFD166' },
  M: { bg: 'rgba(255, 107, 107, 0.15)', text: '#FF6B6B' },
};

function readMarkdown(path: string): string | null {
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

function loadManifest(gameId: string): GameManifest | null {
  const manifestPath = resolve(process.cwd(), 'games', gameId, 'game.json');
  if (!existsSync(manifestPath)) {
    console.warn(`No game.json found for registered game: ${gameId}`);
    return null;
  }
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    return { id: gameId, ...manifest };
  } catch {
    console.error(`Failed to parse game.json for: ${gameId}`);
    return null;
  }
}

function loadRegistry(): string[] {
  const registryPath = resolve(process.cwd(), 'games.registry.json');
  if (!existsSync(registryPath)) {
    console.warn('games.registry.json not found.');
    return [];
  }
  try {
    return JSON.parse(readFileSync(registryPath, 'utf-8'));
  } catch {
    console.error('Failed to parse games.registry.json');
    return [];
  }
}

export function getRegisteredGames(): GameManifest[] {
  const registry = loadRegistry();
  const games: GameManifest[] = [];
  for (const gameId of registry) {
    const manifest = loadManifest(gameId);
    if (manifest) games.push(manifest);
  }
  return games;
}

export function getGame(id: string): GameManifest | null {
  const registry = loadRegistry();
  if (!registry.includes(id)) return null;
  return loadManifest(id);
}

export function getGameContent(id: string): GameContent | null {
  const manifest = getGame(id);
  if (!manifest) return null;
  const base = resolve(process.cwd(), 'games', id);
  const description = readMarkdown(resolve(base, 'description.md'));
  const rules = readMarkdown(resolve(base, 'rules.md'));
  return { manifest, description, rules };
}
