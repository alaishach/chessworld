# Bishop Maze

A single-file browser puzzle game built for CHESSWORLD.GAMES.

## How it works

Pure vanilla HTML, CSS, and JavaScript — no build step, no dependencies. Everything is in `index.html`.

The game renders a grid using CSS Grid, tracks bishop position and valid diagonal moves in JS, and uses inline SVG for the bishop and goal pieces.

## Structure

```
bishop-maze/
├── index.html      ← entire game (HTML + CSS + JS)
├── game.json       ← platform manifest
├── description.md  ← shown above the game iframe
├── rules.md        ← shown below the game iframe
├── thumbnail.png   ← 16:9 preview screenshot
└── README.md       ← this file
```

## Local development

No build step needed. Just open `index.html` in a browser.

To test within the platform:

```bash
npm run dev
```

Temporarily add `"bishop-maze"` to `games.registry.json` (do not commit this change), then visit `/games/bishop-maze`.

## Level design

Levels are defined as plain JS objects in `index.html` under the `LEVELS` array. Each level specifies:

- `size` — grid dimensions (NxN)
- `walls` — array of `[row, col]` blocked squares
- `start` — bishop starting position
- `goal` — target position
- `par` — target move count

To add or modify levels, edit the `LEVELS` array directly.

## Author

zenith-dev
