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
    return '8/8/8/8/8/8/8/8'; 
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

document.getElementById('editor-clear-board-btn').onclick = () => {
    editorHasBlackKing = false;
    editorHasWhiteKnight = false;
    Array.from(board.children).forEach(square => {
        clearSquare(square);
    })
}


showPanel(editorDiv);