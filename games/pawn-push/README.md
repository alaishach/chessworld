# Pawn Push

A two-player strategy game played on a 6x6 board using chess pawns.

## How to Play

- **Players**: 2 (White and Black, on the same device)
- **Goal**: Get any of your pawns to the opposite end of the board
- **Turn**: Click one of your pawns, then click a valid square to move

### Movement Rules (same as chess pawns)
- Pawns move **forward one square** (toward the opponent's side)
- Pawns can **capture diagonally forward**
- No double-move on first move — keep it simple

### Winning
First player to reach the opponent's back row wins.

## Chess Relation

This game is built entirely around the pawn — the most underestimated piece in chess. The tension of pawn push mirrors real endgame pawn races. No queens, no knights — just the humble pawn doing its job.

## Technical Notes

- Vanilla JS, no dependencies
- Single HTML file with embedded CSS and JS
- No build step required
- State is managed in a plain JS object — easy to follow

## File Structure

```
pawn-push/
├── game.json       ← platform manifest
├── index.html      ← everything lives here
├── thumbnail.png   ← 16:9 preview screenshot
└── README.md       ← this file
```
