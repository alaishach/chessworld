const editorDiv = document.getElementById('editor-div');
const gameDiv = document.getElementById('game-div');

editorDiv.boardDiv = document.getElementById('editor-board-div');
gameDiv.boardDiv = document.getElementById('game-board-div');

const editorFENTextarea = document.getElementById('editor-fen-textarea');

const gameCurrentMovesSpan = document.getElementById('game-current-moves-span');
const gameOptimalMovesSpan = document.getElementById('game-optimal-moves-span');

// used for placing pieces in the editor
const whiteKnightElement = document.getElementById('white-knight');
const whitePawnElement = document.getElementById('white-pawn');
const blackKingElement = document.getElementById('black-king');
const blackQueenElement = document.getElementById('black-queen');
const blackRookElement = document.getElementById('black-rook');
const blackBishopElement = document.getElementById('black-bishop');
const blackKnightElement = document.getElementById('black-knight');
const blackPawnElement = document.getElementById('black-pawn');

let editorCurrentPiece = null;
let editorHasWhiteKnight = false;
let editorHasBlackKing = false;
let inEditor = true;
let isGameOver = false;

let bitboardWhiteOccupancy, bitboardBlackOccupancy, bitboardWhiteKnight, bitboardBlackKing, bitboardWhitePawns;
let bitboardBlackQueens, bitboardBlackRooks, bitboardBlackBishops, bitboardBlackKnights, bitboardBlackPawns;


const pieceMap = {
    'N': whiteKnightElement,
    'P': whitePawnElement,
    'k': blackKingElement,
    'q': blackQueenElement,
    'r': blackRookElement,
    'b': blackBishopElement,
    'n': blackKnightElement,
    'p': blackPawnElement,
};


function showPanel(panelDiv) {
    [editorDiv, gameDiv].forEach(panel => {
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


// Used when converting from DOM square index to bitboard index and vice versa
function getOppositeTypeSquareIndex(index) {
    return (7 - Math.floor(index / 8)) * 8 + (index % 8);
}


function validateFEN(fen) {
    const ranks = fen.split('/');
    if (ranks.length !== 8) throw new Error('FEN must have exactly 8 ranks');

    let whiteKnightCount = 0, blackKingCount = 0;
    const tempBoard = [], map = pieceMap;

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
            } 
            else {
                const template = map[c];
                if (!template) throw new Error(`Invalid piece '${c}'`);

                if (c === 'N') whiteKnightCount++;
                if (c === 'k') blackKingCount++;

                tempBoard.push(c);
                fileCount++;
            }
        }

        if (fileCount !== 8) throw new Error(`Rank ${r + 1} must contain exactly 8 squares`);
    }

    if (tempBoard.length !== 64) throw new Error('FEN does not resolve to 64 squares');
    if (whiteKnightCount !== 1) throw new Error(`Expected exactly 1 white knight, got ${whiteKnightCount}`);
    if (blackKingCount !== 1) throw new Error(`Expected exactly 1 black king, got ${blackKingCount}`);

    return tempBoard;
}


function parseFEN(fen) {

    const tempBoard = validateFEN(fen);
    const squares = Array.from(board.children), map = pieceMap;

    for (let i = 0; i < 64; i++) {
        const square = squares[i];
        square.replaceChildren();

        const char = tempBoard[i];
        if (!char) continue;

        const template = map[char];
        placePieceFEN(template, square);
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


function placePieceEditor(piece, square)  {
    if (piece.id === 'black-king' && editorHasBlackKing) return;
    if (piece.id === 'white-knight' && editorHasWhiteKnight) return;

    placePieceFEN(piece, square);
}


function placePieceFEN(piece, square) {
    const clone = piece.cloneNode(true);
    clone.setAttribute('class', clone.id);

    clearSquare(square);

    if (clone.id === 'white-knight') editorHasWhiteKnight = true;
    if (clone.id === 'black-king') editorHasBlackKing = true;

    clone.removeAttribute('id'); 
    square.appendChild(clone);
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


// for debugging
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

// this too
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

function get1BitIndex(bitboard) {
    for (let i = 0; i < 64; i++) {
        if (bitboard & (1n << BigInt(i))) {
            return i;
        }
    }
}

function getAllAttackedSquaresFromState(s) {
    const occupancy = getOccupancy(s);

    let attacked = 0n;

    for (let i = 0; i < 64; i++) {
        const mask = 1n << BigInt(i);

        if (s.blackQueens & mask) {
            let blockers = occupancy & rookMasks[i];
            attacked |= rookTable[i].get(blockers);

            blockers = occupancy & bishopMasks[i];
            attacked |= bishopTable[i].get(blockers);
        }
        else if (s.blackRooks & mask) {
            const blockers = occupancy & rookMasks[i];
            attacked |= rookTable[i].get(blockers);
        }
        else if (s.blackBishops & mask) {
            const blockers = occupancy & bishopMasks[i];
            attacked |= bishopTable[i].get(blockers);
        }
        else if (s.blackKnights & mask) {
            attacked |= knightAttacks[i];
        }
        else if (s.blackPawns & mask) {
            attacked |= blackPawnAttacks[i];
        }
    }

    return attacked | kingAttacks[get1BitIndex(bitboardBlackKing)];
}


function moveKnight(targetBitboardSquareIndex) {

    const DOMTargetIndex = getOppositeTypeSquareIndex(targetBitboardSquareIndex);
    const DOMCurrentIndex = getOppositeTypeSquareIndex(get1BitIndex(bitboardWhiteKnight));

    const targetSquare = board.children[DOMTargetIndex];
    const currentSquare = board.children[DOMCurrentIndex];

    targetSquare.replaceChildren(currentSquare.children[0]);

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
}


const rookTable = Array.from({ length: 64 }, () => new Map());
const rookMasks = new Array(64).fill(0n);

// directions: up, down, left, right
const rookDirections = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];

const bishopTable = Array.from({ length: 64 }, () => new Map());
const bishopMasks = new Array(64).fill(0n);

// diagonals: NE, NW, SE, SW
const bishopDirections = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
];

function genMaskWrapper(func, directions) {
    return (sq, blockers) => {
        const x = sq % 8;
        const y = Math.floor(sq / 8);

        let maskReference = [0n];

        for (const [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;

            while (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
                const shouldBreak = func(maskReference, nx, ny, sq, blockers);
                if (shouldBreak) break;

                nx += dx;
                ny += dy;
            }
        }

        return maskReference[0];
    }
}

const genMaskCallback = (maskReference, nx, ny, sq, blockers) => {
    maskReference[0] |= 1n << BigInt(ny * 8 + nx);
    return false;
};

const genAttackCallback = (maskReference, nx, ny, sq, blockers) => {
    const idx = ny * 8 + nx;
    const bit = 1n << BigInt(idx);
    maskReference[0] |= bit;
    return blockers & bit;
}

const genRookMask = genMaskWrapper(genMaskCallback, rookDirections);
const genRookAttacks = genMaskWrapper(genAttackCallback, rookDirections);
const genBishopMask = genMaskWrapper(genMaskCallback, bishopDirections);
const genBishopAttacks = genMaskWrapper(genAttackCallback, bishopDirections);


function buildTableWrapper(genMask, masks, genAttacks, table) {
    return () => {
        for (let sq = 0; sq < 64; sq++) {

            const mask = genMask(sq);
            masks[sq] = mask;
            const relevantSquares = [];

            for (let i = 0; i < 64; i++) {
                if (mask & (1n << BigInt(i))) {
                    relevantSquares.push(i);
                }
            }

            const subsets = 1 << relevantSquares.length;

            for (let subset = 0; subset < subsets; subset++) {

                let blockers = 0n;

                for (let i = 0; i < relevantSquares.length; i++) {
                    if (subset & (1 << i)) {
                        blockers |= 1n << BigInt(relevantSquares[i]);
                    }
                }

                const attacks = genAttacks(sq, blockers);
                table[sq].set(blockers, attacks);
            }
        }
    };
}

const buildRookTables = buildTableWrapper(genRookMask, rookMasks, genRookAttacks, rookTable);
const buildBishopTables = buildTableWrapper(genBishopMask, bishopMasks, genBishopAttacks, bishopTable);


function buildFixedPieceAttacksWrapper(attacks, directions) {
    return () => {
        for (let sq = 0; sq < 64; sq++) {

            const x = sq % 8;
            const y = Math.floor(sq / 8);

            let mask = 0n;

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    const idx = ny * 8 + nx;
                    mask |= 1n << BigInt(idx);
                }
            }

            attacks[sq] = mask;
        }
    }

}


const knightAttacks = new Array(64).fill(0n);
const knightDirs = [
    [ 2,  1], [ 2, -1], [-2,  1], [-2, -1],
    [ 1,  2], [ 1, -2], [-1,  2], [-1, -2],
];
const buildKnightAttacks = buildFixedPieceAttacksWrapper(knightAttacks, knightDirs);

const kingAttacks = new Array(64).fill(0n);
const kingDirs = [
    [1, 1],  [1, 0],  [1, -1],
    [0, 1],           [0, -1],
    [-1, 1], [-1, 0], [-1, -1],
];
const buildKingAttacks = buildFixedPieceAttacksWrapper(kingAttacks, kingDirs);

const blackPawnAttacks = new Array(64).fill(0n);
const blackPawnDirs = [[-1, -1], [1, -1]];
const buildBlackPawnAttacks = buildFixedPieceAttacksWrapper(blackPawnAttacks, blackPawnDirs);


function cloneState(s) {
    return {
        knight: s.knight,

        blackQueens: s.blackQueens,
        blackRooks: s.blackRooks,
        blackBishops: s.blackBishops,
        blackKnights: s.blackKnights,
        blackPawns: s.blackPawns,

        whitePawns: s.whitePawns,
    };
}

function getCurrentState() {
    return {
        knight: get1BitIndex(bitboardWhiteKnight),

        blackQueens: bitboardBlackQueens,
        blackRooks: bitboardBlackRooks,
        blackBishops: bitboardBlackBishops,
        blackKnights: bitboardBlackKnights,
        blackPawns: bitboardBlackPawns,

        whitePawns: bitboardWhitePawns,
    };
}


function hashState(s) { 
    return (
        s.knight + "|" +
        s.blackQueens + "|" +
        s.blackRooks + "|" +
        s.blackBishops + "|" +
        s.blackKnights + "|" +
        s.blackPawns + "|" +
        s.whitePawns
    );
}


function getOccupancy(s) {
    return (
        s.blackQueens |
        s.blackRooks |
        s.blackBishops |
        s.blackKnights |
        s.blackPawns |
        s.whitePawns |
        bitboardBlackKing |
        (1n << BigInt(s.knight))
    );
}


function bfsKnightToKing(initialState) {

    const queue = [];
    const visited = new Set();

    queue.push({
        state: initialState,
        path: [initialState.knight]
    });

    visited.add(hashState(initialState));

    while (queue.length > 0) {

        const node = queue.shift();
        const s = node.state;

        if (s.knight === get1BitIndex(bitboardBlackKing)) {
            return node.path;
        }

        const attacked = getAllAttackedSquaresFromState(s);
        const moves = getKnightMoves(s.knight, bitboardWhitePawns) & ~attacked;

        for (let to = 0; to < 64; to++) {

            const toMask = 1n << BigInt(to);
            if ((moves & toMask) === 0n) continue;

            const ns = cloneState(s);

            const fromMask = 1n << BigInt(s.knight);

            ns.knight = to;

            const clearMask = ~toMask;

            ns.blackQueens &= clearMask; 
            ns.blackRooks &= clearMask;
            ns.blackBishops &= clearMask;
            ns.blackKnights &= clearMask;
            ns.blackPawns &= clearMask;

            const key = hashState(ns);
            if (visited.has(key)) continue;

            visited.add(key);

            queue.push({
                state: ns,
                path: [...node.path, to]
            });
        }
    }
    throw new Error('Unsolvable position.');
}


function getShortestPath() {
    const startState = {
        knight: get1BitIndex(bitboardWhiteKnight),
        blackQueens: bitboardBlackQueens,
        blackRooks: bitboardBlackRooks,
        blackBishops: bitboardBlackBishops,
        blackKnights: bitboardBlackKnights,
        blackPawns: bitboardBlackPawns,

        whitePawns: bitboardWhitePawns,
    };

    const path = bfsKnightToKing(startState);
    return path;
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
                placePieceEditor(editorCurrentPiece, square);
            }
            else {
                clearSquare(square);
            }
            updateFENTextarea();
        }
        else {
            if (isGameOver) return;
            const knightSquare = get1BitIndex(bitboardWhiteKnight);
            if ((squareMask & getKnightMoves(knightSquare, bitboardWhiteOccupancy)) === 0n) return;
            
            const attackedSquares = getAllAttackedSquaresFromState(getCurrentState());

            if ((squareMask & attackedSquares) !== 0n) return;


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


    if (newMoves > optimalMoves && newMoves <= 1.5 * optimalMoves) {
        gameCurrentMovesSpan.classList.remove('game-perfect');
        gameCurrentMovesSpan.classList.add('game-decent');
    }
    if (newMoves > 1.5 * optimalMoves) {
        gameCurrentMovesSpan.classList.remove('game-decent');
        gameCurrentMovesSpan.classList.add('game-bad');
    }
    
}


const pieceElements = [ 
    whiteKnightElement, whitePawnElement, blackKingElement, blackQueenElement, 
    blackRookElement, blackBishopElement, blackKnightElement, blackPawnElement
];

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

editorFENTextarea.addEventListener('change', () => parseFEN(getRawFEN(editorFENTextarea.value)));

document.getElementById('editor-clear-board-btn').onclick = () => {
    Array.from(board.children).forEach(square => {
        clearSquare(square);
    });
    updateFENTextarea();
}

const editorCopyFENbtn = document.getElementById('editor-copy-fen-btn');
editorCopyFENbtn.onclick = async () => {
    const fen = getFEN();
    try {
        await navigator.clipboard.writeText(getRawFEN(editorFENTextarea.value));
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
    return fen.trim().replaceAll(/\s/g, '');
}


function squareNameFromIndex(index) {
    const file = index % 8;
    const rank = Math.floor(index / 8);

    const files = "abcdefgh";

    return files[file] + (rank + 1);
}

let shortestPath;

const editorPlayBtn = document.getElementById('editor-play-btn');
editorPlayBtn.onclick = () => {
    initBitboards();

    try {
        validateFEN(getRawFEN(editorFENTextarea.value));
    }
    catch (e) {
        console.error(e);
        return;
    }
    try {
        shortestPath = getShortestPath();
    }
    catch(e) {
        console.error(e);
        return;
    }
    
    resetCurrentMovesCounter();
    gameOptimalMovesSpan.textContent = shortestPath.length - 1;
    inEditor = false;
    isGameOver = false;
    showPanel(gameDiv);


};

const gameEditBtn = document.getElementById('game-edit-btn');
gameEditBtn.onclick = () => {
    updateFENTextarea();
    inEditor = true;
    showPanel(editorDiv);
};


const gameShowSolutionBtn = document.getElementById('game-show-solution-btn');
gameShowSolutionBtn.onclick = () => {
    gameRestartLevelBtn.onclick();
    isGameOver = true;

    let i = 1;
    const interval = setInterval(() => {
        moveKnight(shortestPath[i++]);
        incrementCurrentMovesCounter();
        if (i == shortestPath.length) clearInterval(interval);
    }, 1000);
};

const gameRestartLevelBtn = document.getElementById('game-restart-level-btn');
gameRestartLevelBtn.onclick = () => {
    isGameOver = false;
    parseFEN(getRawFEN(editorFENTextarea.value));
    resetCurrentMovesCounter();
    initBitboards();
};

window.parent.addEventListener('load', () => {
    updateFENTextarea();
    buildRookTables();
    buildBishopTables();
    buildKnightAttacks();
    buildKingAttacks();
    buildBlackPawnAttacks();
    showPanel(editorDiv);
});