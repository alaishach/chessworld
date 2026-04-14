const boardEl = document.getElementById("board");
const restartBtn = document.getElementById("restart");

let selected = null;
let turn = "white";

let board = createInitialBoard();

function createInitialBoard() {
  const empty = Array(8).fill(null).map(() => Array(8).fill(null));

  // pawns
  for (let i = 0; i < 8; i++) {
    empty[1][i] = { type: "pawn", color: "black" };
    empty[6][i] = { type: "pawn", color: "white" };
  }

  // kings + queens
  empty[0][4] = { type: "king", color: "black" };
  empty[7][4] = { type: "king", color: "white" };

  empty[0][3] = { type: "queen", color: "black" };
  empty[7][3] = { type: "queen", color: "white" };

  return empty;
}

function draw() {
  boardEl.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const square = document.createElement("div");
      square.className = "square " + ((x + y) % 2 ? "dark" : "light");

      const piece = board[y][x];

      if (piece) {
        square.textContent = getPieceSymbol(piece);
      }

      if (selected && selected.x === x && selected.y === y) {
        square.classList.add("selected");
      }

      square.onclick = () => handleClick(x, y);

      boardEl.appendChild(square);
    }
  }
}

function getPieceSymbol(p) {
  const map = {
    king: "♚",
    queen: "♛",
    pawn: "♟"
  };
  return map[p.type];
}

function handleClick(x, y) {
  const piece = board[y][x];

  if (selected) {
    movePiece(selected.x, selected.y, x, y);
    selected = null;
    return;
  }

  if (piece && piece.color === turn) {
    selected = { x, y };
  }

  draw();
}

function movePiece(x1, y1, x2, y2) {
  const piece = board[y1][x1];
  const target = board[y2][x2];

  if (!piece) return;

  // simple movement (no full chess validation for MVP)
  board[y2][x2] = piece;
  board[y1][x1] = null;

  // 🎯 WIN CONDITION: queen capture
  if (target && target.type === "queen") {
    alert(`${turn} wins by capturing the queen!`);
    reset();
    return;
  }

  turn = turn === "white" ? "black" : "white";
  draw();
}

function reset() {
  board = createInitialBoard();
  turn = "white";
  selected = null;
  draw();
}

restartBtn.onclick = reset;

draw();