const editorDiv = document.getElementById('editor-div');
const gameDiv = document.getElementById('game-div');
const panels = [editorDiv, gameDiv];

const gameBoardDiv = document.getElementById('game-board-div');
const editorBoardDiv = document.getElementById('editor-board-div');

editorDiv.boardDiv = editorBoardDiv;
gameDiv.boardDiv = gameBoardDiv;

const editorFENTextarea = document.getElementById('editor-fen-textarea');

const gameCurrentMovesSpan = document.getElementById('game-current-moves-span');
const gameOptimalMovesSpan = document.getElementById('game-optimal-moves-span');

const whiteKnightElement = document.getElementById('white-knight');
const whitePawnElement = document.getElementById('white-pawn');
const blackKingElement = document.getElementById('black-king');
const blackQueenElement = document.getElementById('black-queen');
const blackRookElement = document.getElementById('black-rook');
const blackBishopElement = document.getElementById('black-bishop');
const blackKnightElement = document.getElementById('black-knight');
const blackPawnElement = document.getElementById('black-pawn');

const pieceElements = [
    whiteKnightElement, 
    whitePawnElement, 
    blackKingElement, 
    blackQueenElement, 
    blackRookElement, 
    blackBishopElement, 
    blackKnightElement, 
    blackPawnElement
];

let editorCurrentPiece = null;
let editorHasWhiteKnight = false;
let editorHasBlackKing = false;
let inEditor = true;
let isGameOver = false;


let bitboardWhiteOccupancy;
let bitboardBlackOccupancy;
let bitboardWhiteKnight;
let bitboardBlackKing;
let bitboardWhitePawns;
let bitboardBlackQueens;
let bitboardBlackRooks;
let bitboardBlackBishops;
let bitboardBlackKnights;
let bitboardBlackPawns;


function showPanel(panelDiv) {
    // editorFENTextarea.value = getFEN();
    panels.forEach(panel => {
        panel.classList.toggle('hidden', panel.id !== panelDiv.id);
    });
    panelDiv.boardDiv.appendChild(board);
}

function getFEN() {
    let res = '';
    let currentEmptySquares = 0;
    const squares = Array.from(board.children);

    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const piece = square.children[0];

        if (!piece) {
            currentEmptySquares++;
        } 
        else {
            if (currentEmptySquares) {
                res += currentEmptySquares;
                currentEmptySquares = 0;
            }

            switch (piece.getAttribute('class')) {
                case 'white-knight': res += 'N'; break;
                case 'white-pawn':   res += 'P'; break;

                case 'black-king':   res += 'k'; break;
                case 'black-queen':  res += 'q'; break;
                case 'black-rook':   res += 'r'; break;
                case 'black-bishop': res += 'b'; break;
                case 'black-knight': res += 'n'; break;
                case 'black-pawn':   res += 'p'; break;
            }
        }

        // end of rank
        if ((i + 1) % 8 === 0) {
            if (currentEmptySquares) {
                res += currentEmptySquares;
                currentEmptySquares = 0;
            }
            if (i !== 63) res += '/\n';
        }
    }

    return res;
}

function updateFENTextarea() {
    editorFENTextarea.value = getFEN();
}

// When converting from DOM square index to bitboard index and vice versa
function getOppositeTypeSquareIndex(index) {
    return (7 - Math.floor(index / 8)) * 8 + (index % 8);
}

function validateFEN(fen) {
    const ranks = fen
        .trim()
        .split('/')
        .map(rank => rank.replace(/\s/g, ''));

    if (ranks.length !== 8) {
        throw new Error('FEN must have exactly 8 ranks');
    }

    let whiteKnightCount = 0;
    let blackKingCount = 0;

    const map = {
        'N': whiteKnightElement,
        'P': whitePawnElement,

        'k': blackKingElement,
        'q': blackQueenElement,
        'r': blackRookElement,
        'b': blackBishopElement,
        'n': blackKnightElement,
        'p': blackPawnElement,
    };

    const tempBoard = [];

    for (let r = 0; r < 8; r++) {
        const rank = ranks[r];
        let fileCount = 0;

        for (let i = 0; i < rank.length; i++) {
            const c = rank[i];

            if (c >= '1' && c <= '8') {
                const empty = Number(c);
                for (let j = 0; j < empty; j++) {
                    tempBoard.push(null);
                    fileCount++;
                }
            } else {
                const template = map[c];
                if (!template) {
                    throw new Error(`Invalid piece '${c}'`);
                }

                if (c === 'N') whiteKnightCount++;
                if (c === 'k') blackKingCount++;

                tempBoard.push(c);
                fileCount++;
            }
        }

        if (fileCount !== 8) {
            throw new Error(`Rank ${r + 1} must contain exactly 8 squares`);
        }
    }

    if (tempBoard.length !== 64) {
        throw new Error('FEN does not resolve to 64 squares');
    }

    if (whiteKnightCount !== 1) {
        throw new Error(`Expected exactly 1 white knight, got ${whiteKnightCount}`);
    }

    if (blackKingCount !== 1) {
        throw new Error(`Expected exactly 1 black king, got ${blackKingCount}`);
    }

    return tempBoard;
}
function parseFEN(fen) {
    const tempBoard = validateFEN(fen);

    const map = {
        'N': whiteKnightElement,
        'P': whitePawnElement,

        'k': blackKingElement,
        'q': blackQueenElement,
        'r': blackRookElement,
        'b': blackBishopElement,
        'n': blackKnightElement,
        'p': blackPawnElement,
    };

    const squares = Array.from(board.children);

    for (let i = 0; i < 64; i++) {
        const square = squares[i];
        square.replaceChildren();

        const char = tempBoard[i];
        if (!char) continue;

        const template = map[char];
        const clone = template.cloneNode(true);

        clone.classList.remove('editor-selected-piece');
        clone.setAttribute('class', template.id);
        clone.removeAttribute('id');

        square.appendChild(clone);
    }

    // sync state
    editorHasWhiteKnight = true;
    editorHasBlackKing = true;

    updateFENTextarea();
}


function clearSquare(square) {
    Array.from(square.children).forEach(child => {
        square.removeChild(child);
        if (child.getAttribute('class') === 'white-knight') editorHasWhiteKnight = false;
        if (child.getAttribute('class') === 'black-king') editorHasBlackKing = false;
    });
}



// document.getElementById('show-editor-btn').onclick = () => {
//     inEditor = true;
//     showPanel(editorDiv);
// };

// document.getElementById('show-game-btn').onclick = () => {
//     inEditor = false;
//     showPanel(gameDiv);
// };


function placePiece(piece, square) {
    const clone = piece.cloneNode(true);
    if (clone.id === 'black-king' && editorHasBlackKing) return;
    if (clone.id === 'white-knight' && editorHasWhiteKnight) return;

    clearSquare(square);

    clone.setAttribute('class', clone.id);

    if (clone.id === 'white-knight') editorHasWhiteKnight = true;
    if (clone.id === 'black-king') editorHasBlackKing = true;

    clone.removeAttribute('id'); 
    square.appendChild(clone);
}



const knightAttacks = new Array(64).fill(0n);

for (let sq = 0; sq < 64; sq++) {
    const x = sq % 8;
    const y = Math.floor(sq / 8);

    const moves = [
        [x+2, y+1], [x+2, y-1],
        [x-2, y+1], [x-2, y-1],
        [x+1, y+2], [x+1, y-2],
        [x-1, y+2], [x-1, y-2],
    ];

    let mask = 0n;

    for (const [nx, ny] of moves) {
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            const target = ny * 8 + nx;
            mask |= 1n << BigInt(target);
        }
    }

    knightAttacks[sq] = mask;
}





function initBitboards() {
    bitboardWhiteOccupancy = 0n;
    bitboardBlackOccupancy = 0n;
    bitboardWhiteKnight = 0n;
    bitboardBlackKing = 0n;
    bitboardWhitePawns = 0n;
    bitboardBlackQueens = 0n;
    bitboardBlackRooks = 0n;
    bitboardBlackBishops = 0n;
    bitboardBlackKnights = 0n;
    bitboardBlackPawns = 0n;

    const fen = getRawFEN(editorFENTextarea.value);

    const rows = fen.split("/");

    for (let rank = 0; rank < 8; rank++) {
        let file = 0;

        for (const char of rows[rank]) {
            if (char >= "1" && char <= "8") {
                file += Number(char);
                continue;
            }

            const squareIndex = (7 - rank) * 8 + file;
            const location = 1n << BigInt(squareIndex);

            switch (char) {
                case "P": bitboardWhitePawns |= location; break;
                case "N": bitboardWhiteKnight |= location; break;

                case "p": bitboardBlackPawns |= location; break;
                case "n": bitboardBlackKnights |= location; break;
                case "k": bitboardBlackKing |= location; break;
                case "q": bitboardBlackQueens |= location; break;
                case "r": bitboardBlackRooks |= location; break;
                case "b": bitboardBlackBishops |= location; break;
            }

            if (char === char.toUpperCase()) {
                bitboardWhiteOccupancy |= location;
            } else {
                bitboardBlackOccupancy |= location;
            }

            file++;
        }
    }
}


function bitboardToString(bb) {
    let str = "";

    for (let rank = 7; rank >= 0; rank--) {
        let row = "";

        for (let file = 0; file < 8; file++) {
            const square = BigInt(rank * 8 + file);
            const bit = (bb & (1n << square)) !== 0n;

            row += bit ? "1 " : ". ";
        }

        str += row.trimEnd() + "\n";
    }

    return str;
}

function logBitboardsHexadecimal() {
    const bb = {
        whiteOccupancy: bitboardWhiteOccupancy,
        blackOccupancy: bitboardBlackOccupancy,
        whiteKnight: bitboardWhiteKnight,
        blackKing: bitboardBlackKing,
        whitePawns: bitboardWhitePawns,
        blackQueens: bitboardBlackQueens,
        blackRooks: bitboardBlackRooks,
        blackBishops: bitboardBlackBishops,
        blackKnights: bitboardBlackKnights,
        blackPawns: bitboardBlackPawns,
    };

    for (const [name, value] of Object.entries(bb)) {
        console.log(name);
        console.log(bitboardToString(value));
    }
}


function getKnightMoves(bitboardSquareIndex, ownPieces) {
    return knightAttacks[bitboardSquareIndex] & ~ownPieces; 
}

function getWhiteKnightBitboardSquareIndex() {
    for (let i = 0; i < 64; i++) {
        if (bitboardWhiteKnight & (1n << BigInt(i))) {
            return i;
        }
    }
}

function moveKnight(targetBitboardSquareIndex) {
    const DOMTargetIndex = getOppositeTypeSquareIndex(targetBitboardSquareIndex);
    const DOMCurrentIndex = getOppositeTypeSquareIndex(getWhiteKnightBitboardSquareIndex());

    const targetSquare = board.children[DOMTargetIndex];
    const currentSquare = board.children[DOMCurrentIndex];

    Array.from(targetSquare.children).forEach(child => {
        targetSquare.removeChild(child);
    });
    targetSquare.appendChild(currentSquare.children[0]);
    
    // moves white knight
    bitboardWhiteOccupancy ^= bitboardWhiteKnight;
    bitboardWhiteKnight = 1n << BigInt(targetBitboardSquareIndex);
    bitboardWhiteOccupancy ^= bitboardWhiteKnight;


    // white knight captures black piece
    const mask = ~(1n << BigInt(targetBitboardSquareIndex));

    bitboardBlackOccupancy &= mask;
    bitboardBlackKing      &= mask;
    bitboardBlackQueens    &= mask;
    bitboardBlackRooks     &= mask;
    bitboardBlackBishops   &= mask;
    bitboardBlackKnights   &= mask;
    bitboardBlackPawns     &= mask;

    console.log('==============================');
    logBitboardsHexadecimal();


}

const board = document.createElement('div');
board.classList.add('board');
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');

    // checker pattern
    if ((row + col) % 2 === 0) {
      square.classList.add('light');
    } else {
      square.classList.add('dark');
    }

    const squareIndex = getOppositeTypeSquareIndex(row * 8 + col);
    const squareMask = 1n << BigInt(squareIndex);

    square.addEventListener('click', () => {
        if (inEditor) {
            if (editorCurrentPiece) {
                placePiece(editorCurrentPiece, square);
            }
            else {
                clearSquare(square);
            }
            updateFENTextarea();
        }
        else {
            if (isGameOver) return;
            const knightSquare = getWhiteKnightBitboardSquareIndex();
            if ((squareMask & getKnightMoves(knightSquare, bitboardWhiteOccupancy)) === 0n) return;
            moveKnight(squareIndex);
            if (bitboardBlackKing === 0n) {
                isGameOver = true;
                editorHasBlackKing = false;
            }
            incrementCurrentMovesCounter();
        }
    });

    board.appendChild(square);
  }
}


function resetCurrentMovesCounter() {
    gameCurrentMovesSpan.textContent = 0;
    gameCurrentMovesSpan.classList.remove('game-decent');
    gameCurrentMovesSpan.classList.remove('game-bad');
    gameCurrentMovesSpan.classList.add('game-perfect');
}

function incrementCurrentMovesCounter() {
    const optimalMoves = Number(gameOptimalMovesSpan.textContent);
    const currentMoves = Number(gameCurrentMovesSpan.textContent);
    const newMoves = currentMoves + 1;
    gameCurrentMovesSpan.textContent = newMoves;


    if (newMoves >= 2 * optimalMoves) {
        gameCurrentMovesSpan.classList.remove('game-decent');
        gameCurrentMovesSpan.classList.add('game-bad');
    }
    else if (newMoves >= 1.5 * optimalMoves) {
        gameCurrentMovesSpan.classList.remove('game-perfect');
        gameCurrentMovesSpan.classList.add('game-decent');
    }

}

pieceElements.forEach(pieceElement => {
    pieceElement.addEventListener('click', () => {
        if (pieceElement === editorCurrentPiece) {
            editorCurrentPiece.classList.remove('editor-selected-piece');
            editorCurrentPiece = null;
        }
        else {
            editorCurrentPiece = pieceElement;
            pieceElements.forEach(piece => {
                piece.classList.remove('editor-selected-piece');
            });
            pieceElement.classList.add('editor-selected-piece');
        }
        

    });
});

editorFENTextarea.addEventListener('change', () => parseFEN(editorFENTextarea.value));

document.getElementById('editor-clear-board-btn').onclick = () => {
    editorHasBlackKing = false;
    editorHasWhiteKnight = false;
    Array.from(board.children).forEach(square => {
        clearSquare(square);
    });
    updateFENTextarea();
}

const editorCopyFENbtn = document.getElementById('editor-copy-fen-btn');
editorCopyFENbtn.onclick = async () => {
    const fen = getFEN();
    try {
        await navigator.clipboard.writeText(editorFENTextarea.value);
        editorCopyFENbtn.textContent = 'Copied!';
        setTimeout(() => {
            editorCopyFENbtn.textContent = 'Copy FEN';
        }, 1500);
    } 
    catch (err) {
        console.error('Copy failed:', err);
    }

};



function getRawFEN(fen) {
    return fen.replaceAll(/\s/g, '');
}

const editorPlayBtn = document.getElementById('editor-play-btn');
editorPlayBtn.onclick = () => {
    try {
        validateFEN(editorFENTextarea.value);
    }
    catch (e) {
        console.error(e);
        return;
    }

    resetCurrentMovesCounter();
    inEditor = false;
    isGameOver = false;
    showPanel(gameDiv);
    initBitboards();
    logBitboardsHexadecimal();


};

const gameEditBtn = document.getElementById('game-edit-btn');
gameEditBtn.onclick = () => {
    updateFENTextarea();
    inEditor = true;
    showPanel(editorDiv);
};

const gameRestartLevelBtn = document.getElementById('game-restart-level-btn');
gameRestartLevelBtn.onclick = () => {
    isGameOver = false;
    parseFEN(editorFENTextarea.value);
    resetCurrentMovesCounter();
    initBitboards();
    logBitboardsHexadecimal();
};

updateFENTextarea();
showPanel(editorDiv);