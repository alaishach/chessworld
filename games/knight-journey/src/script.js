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

    board.appendChild(square);
  }
}




showPanel(editorDiv);