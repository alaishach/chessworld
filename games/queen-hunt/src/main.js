const boardEl  = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const statusEl = document.getElementById("status");

let selected = null;
let turn = "white";
let board = createInitialBoard();

// ── Piece symbols — white pieces use hollow glyphs, black use filled ──────
const SYMBOLS = {
  white: { king:"♔", queen:"♕", rook:"♖", bishop:"♗", knight:"♘", pawn:"♙" },
  black: { king:"♚", queen:"♛", rook:"♜", bishop:"♝", knight:"♞", pawn:"♟" },
};

function createInitialBoard() {
  const empty = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRow = ["rook","knight","bishop","queen","king","bishop","knight","rook"];

  for (let i = 0; i < 8; i++) {
    empty[0][i] = { type: backRow[i], color: "black" };
    empty[7][i] = { type: backRow[i], color: "white" };
    empty[1][i] = { type: "pawn", color: "black" };
    empty[6][i] = { type: "pawn", color: "white" };
  }
  return empty;
}

// ── Move validation ────────────────────────────────────────────────────────

function inBounds(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function getValidMoves(x, y) {
  const piece = board[y][x];
  if (!piece) return [];
  const moves = [];
  const { type, color } = piece;
  const enemy = color === "white" ? "black" : "white";

  const slide = (dx, dy) => {
    let nx = x + dx, ny = y + dy;
    while (inBounds(nx, ny)) {
      if (board[ny][nx]) {
        if (board[ny][nx].color === enemy) moves.push([nx, ny]);
        break;
      }
      moves.push([nx, ny]);
      nx += dx; ny += dy;
    }
  };

  const step = (dx, dy) => {
    const nx = x + dx, ny = y + dy;
    if (inBounds(nx, ny) && board[ny][nx]?.color !== color) moves.push([nx, ny]);
  };

  if (type === "rook")   { [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => slide(dx,dy)); }
  if (type === "bishop") { [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy]) => slide(dx,dy)); }
  if (type === "queen")  { [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy]) => slide(dx,dy)); }
  if (type === "king")   { [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy]) => step(dx,dy)); }
  if (type === "knight") { [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dx,dy]) => step(dx,dy)); }
  if (type === "pawn") {
    const dir = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
    // Forward
    if (inBounds(x, y + dir) && !board[y + dir][x]) {
      moves.push([x, y + dir]);
      // Double move from start
      if (y === startRow && !board[y + 2*dir][x]) moves.push([x, y + 2*dir]);
    }
    // Captures
    for (const dx of [-1, 1]) {
      if (inBounds(x + dx, y + dir) && board[y + dir][x + dx]?.color === enemy) {
        moves.push([x + dx, y + dir]);
      }
    }
  }

  return moves;
}

// ── Rendering ──────────────────────────────────────────────────────────────

function draw() {
  boardEl.innerHTML = "";

  const validMoveSet = selected
    ? new Set(getValidMoves(selected.x, selected.y).map(([mx,my]) => `${mx},${my}`))
    : new Set();

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const square = document.createElement("div");
      square.className = "square " + ((x + y) % 2 ? "dark" : "light");

      const piece = board[y][x];
      if (piece) square.textContent = SYMBOLS[piece.color][piece.type];

      if (selected && selected.x === x && selected.y === y) square.classList.add("selected");
      if (validMoveSet.has(`${x},${y}`)) square.classList.add("valid-move");

      square.onclick = () => handleClick(x, y);
      boardEl.appendChild(square);
    }
  }
}

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

// ── Game logic ─────────────────────────────────────────────────────────────

function handleClick(x, y) {
  const piece = board[y][x];

  if (selected) {
    const moves = getValidMoves(selected.x, selected.y);
    const isValid = moves.some(([mx, my]) => mx === x && my === y);

    if (isValid) {
      movePiece(selected.x, selected.y, x, y);
      selected = null;
      return;
    }

    // Clicked own piece — switch selection
    if (piece && piece.color === turn) {
      selected = { x, y };
      draw();
      return;
    }

    selected = null;
    draw();
    return;
  }

  if (piece && piece.color === turn) {
    selected = { x, y };
  }

  draw();
}

function movePiece(x1, y1, x2, y2) {
  const piece  = board[y1][x1];
  const target = board[y2][x2];

  board[y2][x2] = piece;
  board[y1][x1] = null;

  // Win condition: captured the queen
  if (target && target.type === "queen") {
    draw();
    const winner = turn.charAt(0).toUpperCase() + turn.slice(1);
    setStatus(`${winner} wins by capturing the queen!`);
    boardEl.style.pointerEvents = "none";
    return;
  }

  turn = turn === "white" ? "black" : "white";
  setStatus(`${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn`);
  draw();
}

function reset() {
  board    = createInitialBoard();
  turn     = "white";
  selected = null;
  boardEl.style.pointerEvents = "";
  setStatus("White's turn");
  draw();
}

restartBtn.onclick = reset;

setStatus("White's turn");
draw();
