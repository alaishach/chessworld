import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const RATING_LABELS = {
  E: "Everyone",
  T: "Teen",
  M: "Mature"
};
const RATING_COLORS = {
  E: { bg: "rgba(128, 237, 153, 0.15)", text: "#80ED99" },
  T: { bg: "rgba(255, 209, 102, 0.15)", text: "#FFD166" },
  M: { bg: "rgba(255, 107, 107, 0.15)", text: "#FF6B6B" }
};
function readMarkdown(path) {
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
function loadManifest(gameId) {
  const manifestPath = resolve(process.cwd(), "games", gameId, "game.json");
  if (!existsSync(manifestPath)) {
    console.warn(`No game.json found for registered game: ${gameId}`);
    return null;
  }
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    return { id: gameId, ...manifest };
  } catch {
    console.error(`Failed to parse game.json for: ${gameId}`);
    return null;
  }
}
function loadRegistry() {
  const registryPath = resolve(process.cwd(), "games.registry.json");
  if (!existsSync(registryPath)) {
    console.warn("games.registry.json not found.");
    return [];
  }
  try {
    return JSON.parse(readFileSync(registryPath, "utf-8"));
  } catch {
    console.error("Failed to parse games.registry.json");
    return [];
  }
}
function getRegisteredGames() {
  const registry = loadRegistry();
  const games = [];
  for (const gameId of registry) {
    const manifest = loadManifest(gameId);
    if (manifest) games.push(manifest);
  }
  return games;
}
function getGame(id) {
  const registry = loadRegistry();
  if (!registry.includes(id)) return null;
  return loadManifest(id);
}
function getGameContent(id) {
  const manifest = getGame(id);
  if (!manifest) return null;
  const base = resolve(process.cwd(), "games", id);
  const description = readMarkdown(resolve(base, "description.md"));
  const rules = readMarkdown(resolve(base, "rules.md"));
  return { manifest, description, rules };
}

export { RATING_COLORS as R, RATING_LABELS as a, getRegisteredGames as b, getGameContent as g };
