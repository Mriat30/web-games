var board;
const ROWS = 4;
const COLUMNS = 4
var score = 0;

window.onload = function() {
    initializeGame();
}

function initializeGame() {
    board = [
        [0,0,0,0], 
        [0,0,0,0], 
        [0,0,0,0], 
        [0,0,0,0]
    ];
    const boardElement = document.querySelector(".board");
    const fragmentSquare = document.createDocumentFragment();
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let boardSquare = document.createElement("div");
            boardSquare.id = `${i},${j}`;
            let number = board[i][j];
            updateSquare(boardSquare, number);
            fragmentSquare.appendChild(boardSquare);
        }
    }
    updateScore(0);
    boardElement.appendChild(fragmentSquare);
    generateTwo();
    generateTwo();
}

function restartGame() {
    const boardElement = document.querySelector(".board");
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
    initializeGame();
}

function updateSquare(boardSquare, newSquareNumber) {
    boardSquare.innerText = "";
    boardSquare.classList.value = ""; //reseteo el valor de la clase
    boardSquare.classList.add("board-square")
    if (newSquareNumber > 0) {
        if (newSquareNumber > 2048) {
            boardSquare.classList.add("board-square-2048");
        }
        else {

            boardSquare.innerText = newSquareNumber;
            boardSquare.classList.add("board-square-" + newSquareNumber.toString());
        }
    }
}

function updateScore(numberToAdd) {
    score += numberToAdd;
    scoreElement = document.querySelector(".score");
    scoreElement.innerText = `${score}`;
    checkWin();
}

function generateTwo() {
    let randomRow = Math.floor(Math.random() * board.length);
    let randomColumn = Math.floor(Math.random() * board[randomRow].length);
    if (board[randomRow][randomColumn] != 0) {
        return generateTwo();
    }
    let randomSquare = document.getElementById(`${randomRow},${randomColumn}`);
    updateSquare(randomSquare, 2);
    board[randomRow][randomColumn] = 2;
    checkLose();
}

function checkWin() {
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) { 
            if (board[row][column] === 2048) {
                alert('Felicitaciones completaste el juego, puedes continuar jugando si asi lo deseas');
            }
        }
    }
}

function checkLose() {
    if (boardIsLocked()) {
        for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
                if (board[row][column] === 0) {
                    return;
                }
            }
        }
        alert('Game Over!! Refresh the page to play again.')
        document.removeEventListener('keyup', control)
    }
}

function control(event) {
    if(event.key === "ArrowUp") {
        if(!moveUp()) {
            generateTwo();
            generateTwo();
        }
    }
    if(event.key === "ArrowDown") {
        if(!moveDown()) {
            generateTwo();
            generateTwo();
        }
    }
    if(event.key === "ArrowRight") {
        if(!moveRight()) {
            generateTwo();
            generateTwo();
        }
    }
    if(event.key === "ArrowLeft") {
        if(!moveLeft()) {
            generateTwo();
            generateTwo();
        }
    }
}

document.addEventListener("keyup", control);
document.querySelector(".newGameButton").addEventListener("click", restartGame);

function rowsAreEquals(newRow, actualRow) {
    for (let i = 0; i < ROWS; i++) {
        if (newRow[i] != actualRow[i]) {
            return false;
        }
    }
    return true;
}

function filterZero(row) {
    return row.filter((r) => r != 0);
}

function boardIsLocked() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] !== 0) {
                if (row > 0 && (board[row - 1][col] === 0 || board[row - 1][col] === board[row][col])) {
                    return false; 
                }
                if (row < board.length - 1 && (board[row + 1][col] === 0 || board[row + 1][col] === board[row][col])) {
                    return false; 
                }
                if (col > 0 && (board[row][col - 1] === 0 || board[row][col - 1] === board[row][col])) {
                    return false; 
                }
                if (col < board[row].length - 1 && (board[row][col + 1] === 0 || board[row][col + 1] === board[row][col])) {
                    return false; 
                }
            }
        }
    }
    return true;
}

function getNewRow(row) {
    newRow = filterZero(row);
    for (let i = 1; i < newRow.length; i++) {
        if (newRow[i] == newRow[i-1]) {
            updateScore(newRow[i-1]);
            newRow[i-1] *= 2;
            newRow[i] = 0;
        }    
    }
    newRow = filterZero(newRow);
    while (newRow.length < ROWS) {
        newRow.push(0);
    }
    return newRow;
}

function moveUp() {
    let boardIsLocked = true;
    for (let col = 0; col < COLUMNS; col++) {
        let actualColumn = [];
        for (let row = 0; row < ROWS; row++) {
            actualColumn.push(board[row][col]);
        }
        newColumn = getNewRow(actualColumn);
        if (!rowsAreEquals(newColumn, actualColumn)) {
            boardIsLocked = false;
            for (let i = 0; i < ROWS; i++) {
                let boardSquare = document.getElementById(`${i},${col}`);
                board[i][col] = newColumn[i];
                updateSquare(boardSquare, board[i][col]);
            }
        }
    }
    return boardIsLocked;
}


function moveDown() {
    let boardIsLocked = true;
    for (let col = 0; col < COLUMNS; col++) {
        let actualColumn = [];
        for (let row = 0; row < ROWS; row++) {
            actualColumn.push(board[row][col]);
        }
        newColumn = getNewRow(actualColumn.reverse()).reverse();        
        if (!rowsAreEquals(newColumn, actualColumn)) {
            boardIsLocked = false;
            for (let i = 0; i < ROWS; i++) {
                let boardSquare = document.getElementById(`${i},${col}`);
                board[i][col] = newColumn[i];
                updateSquare(boardSquare, board[i][col]);
            }
        }
    }
    return boardIsLocked;
}

function moveRight() {
    let boardIsLocked = true;
    for (let row = 0; row < ROWS; row++) {
        let actualRow = board[row];
        newRow = getNewRow(actualRow.reverse()).reverse();
        if (!rowsAreEquals(newRow, actualRow)) {
            boardIsLocked = false;
            for (let column = 0; column < COLUMNS; column++) {
                let newSquareNumber = newRow[column];
                let boardSquare = document.getElementById(`${row},${column}`);
                board[row][column] = newSquareNumber;
                updateSquare(boardSquare, newSquareNumber);
            }
        }
    }
    return boardIsLocked;
}

function moveLeft() {
    let boardIsLocked = true;
    for (let row = 0; row < ROWS; row++) {
        let actualRow = board[row];
        newRow = getNewRow(actualRow);
        if (!rowsAreEquals(newRow, actualRow)) {
            boardIsLocked = false;
            for (let column = 0; column < COLUMNS; column++) {
                let newSquareNumber = newRow[column];
                let boardSquare = document.getElementById(`${row},${column}`);
                board[row][column] = newSquareNumber;
                updateSquare(boardSquare, newSquareNumber);
            }
        }
    }
    return boardIsLocked;
}


