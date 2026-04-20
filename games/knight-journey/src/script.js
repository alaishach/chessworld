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


function showPanel(panelDiv) {
    editorFENTextarea.value = getFEN();
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

function parseFEN(fen) {
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

    // TEMP board representation (length 64)
    const tempBoard = [];

    // -------- PHASE 1: VALIDATION + BUILD --------
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

    // -------- PHASE 2: APPLY --------
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



document.getElementById('show-editor-btn').onclick = () => {
    showPanel(editorDiv);
};

document.getElementById('show-game-btn').onclick = () => {
    showPanel(gameDiv);
};



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

    square.addEventListener('click', () => {
        if (editorCurrentPiece) {
            const clone = editorCurrentPiece.cloneNode(true);
            if (clone.id === 'black-king' && editorHasBlackKing) return;
            if (clone.id === 'white-knight' && editorHasWhiteKnight) return;

            clearSquare(square);
    
            clone.setAttribute('class', clone.id);

            if (clone.id === 'white-knight') editorHasWhiteKnight = true;
            if (clone.id === 'black-king') editorHasBlackKing = true;

            clone.removeAttribute('id'); 
            square.appendChild(clone);
        }
        else {
            clearSquare(square);
        }
        updateFENTextarea();
    });

    board.appendChild(square);
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
            console.log(editorCurrentPiece.id);
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
        await navigator.clipboard.writeText(fen.replaceAll(/\s/g, ''));
        editorCopyFENbtn.textContent = 'Copied!';
        setTimeout(() => {
            editorCopyFENbtn.textContent = 'Copy FEN';
        }, 1500);
    } 
    catch (err) {
        console.error('Copy failed:', err);
    }

};


showPanel(editorDiv);