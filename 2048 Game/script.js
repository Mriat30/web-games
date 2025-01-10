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
    scoreElement = document.querySelector(".scoreConteiner");
    scoreElement.innerText = `score: ${score}`;
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
}

document.addEventListener("keyup", (e)=> {
    if(e.key === "ArrowUp") {
        if(!moveUp()) {
            generateTwo();
            generateTwo();
        }
    }
    if(e.key === "ArrowDown") {
        if(!moveDown()) {
            generateTwo();
            generateTwo();
        }
    }
    if(e.key === "ArrowRight") {
        if(!moveRight()) {
            generateTwo();
            generateTwo();
        }
    }
    if(e.key === "ArrowLeft") {
        if(!moveLeft()) {
            generateTwo();
            generateTwo();
        }
    }   
});

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
    let boardIsBlocked = true;
    for (let col = 0; col < COLUMNS; col++) {
        let actualColumn = [];
        for (let row = 0; row < ROWS; row++) {
            actualColumn.push(board[row][col]);
        }
        newColumn = getNewRow(actualColumn);
        if (!rowsAreEquals(newColumn, actualColumn)) {
            boardIsBlocked = false;
            for (let i = 0; i < ROWS; i++) {
                let boardSquare = document.getElementById(`${i},${col}`);
                board[i][col] = newColumn[i];
                updateSquare(boardSquare, board[i][col]);
            }
        }
    }
    return boardIsBlocked;
}


function moveDown() {
    let boardIsBlocked = true;
    for (let col = 0; col < COLUMNS; col++) {
        let actualColumn = [];
        for (let row = 0; row < ROWS; row++) {
            actualColumn.push(board[row][col]);
        }
        newColumn = getNewRow(actualColumn.reverse()).reverse();        
        if (!rowsAreEquals(newColumn, actualColumn)) {
            boardIsBlocked = false;
            for (let i = 0; i < ROWS; i++) {
                let boardSquare = document.getElementById(`${i},${col}`);
                board[i][col] = newColumn[i];
                updateSquare(boardSquare, board[i][col]);
            }
        }
    }
    return boardIsBlocked;
}

function moveRight() {
    let boardIsBlocked = true;
    for (let row = 0; row < ROWS; row++) {
        let actualRow = board[row];
        newRow = getNewRow(actualRow.reverse()).reverse();
        if (!rowsAreEquals(newRow, actualRow)) {
            boardIsBlocked = false;
            for (let column = 0; column < COLUMNS; column++) {
                let newSquareNumber = newRow[column];
                let boardSquare = document.getElementById(`${row},${column}`);
                board[row][column] = newSquareNumber;
                updateSquare(boardSquare, newSquareNumber);
            }
        }
    }
    return boardIsBlocked;
}

function moveLeft() {
    let boardIsBlocked = true;
    for (let row = 0; row < ROWS; row++) {
        let actualRow = board[row];
        newRow = getNewRow(actualRow);
        if (!rowsAreEquals(newRow, actualRow)) {
            boardIsBlocked = false;
            for (let column = 0; column < COLUMNS; column++) {
                let newSquareNumber = newRow[column];
                let boardSquare = document.getElementById(`${row},${column}`);
                board[row][column] = newSquareNumber;
                updateSquare(boardSquare, newSquareNumber);
            }
        }
    }
    return boardIsBlocked;
}


