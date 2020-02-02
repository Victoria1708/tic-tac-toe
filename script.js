const grid = document.getElementById('grid');
const gridContainer = document.createElement('tbody');
grid.appendChild(gridContainer);
const playAgainBtn = document.getElementById('play-again-btn');
playAgainBtn.addEventListener('click', onPlayAgainBtnClick);

const GRID_SIZE = 10;
const X_SYMBOL = 'X';
const O_SYMBOL = 'O';
const AXIS_TO_DIRECTION = {
    horizontal: ['left', 'right'],
    vertical: ['down', 'top'],
    leftDiagonal: ['topLeft', 'downRight'],
    rightDiagonal: ['downLeft', 'topRight']
};
const WINNER_CELL_CLASS = 'winner-cell';
const DIRECTION_TO_COORDS = {
    left: [0, -1],
    right: [0, 1],
    down: [1, 0],
    top: [-1, 0],
    topLeft: [-1, -1],
    downRight: [1, 1],
    downLeft: [1, -1],
    topRight: [-1, 1]
};
let winnerExists = false;
let nextSymbol = X_SYMBOL;

initGame();

function initGame() {
    for (let r = 0; r < GRID_SIZE; r++) {
        const row = createRow(r);
        for (let c = 0; c < GRID_SIZE; c++) {
            row.appendChild(createCell(r, c, onCellClick));
        }
        gridContainer.appendChild(row);
    }
}

function onCellClick(event) {
    if (winnerExists) {
        return;
    }
    const cell = event.currentTarget;
    const currentSymbol = cell.innerHTML;
    if (currentSymbol) {
        return;
    }
    cell.innerHTML = nextSymbol;
    nextSymbol = nextSymbol === X_SYMBOL ? O_SYMBOL : X_SYMBOL;
    const winnerLine = getWinnerLine(cell);
    if (winnerLine) {
        winnerExists = true;
        highlightWinnerLine(winnerLine);
        setTimeout(showWinnerModal, 0, cell.innerHTML);
    }
}

function getWinnerLine(currentCell) {
    const horizontalLine = getLine(currentCell, 'horizontal');
    if (horizontalLine.length >= 5) {
        return horizontalLine;
    }
    const verticalLine = getLine(currentCell, 'vertical');
    if (verticalLine.length >= 5) {
        return verticalLine;
    }
    const leftDiagonal = getLine(currentCell, 'leftDiagonal');
    if (leftDiagonal.length >= 5) {
        return leftDiagonal;
    }
    const rightDiagonal = getLine(currentCell, 'rightDiagonal');
    if (rightDiagonal.length >= 5) {
        return rightDiagonal;
    }
    return null;
}

function getLine(startCell, axis) {
    const currentSymbol = startCell.innerHTML;
    const result = [startCell];
    const directions = AXIS_TO_DIRECTION[axis];
    directions.forEach(function (direction) {
        const rowIndex = +startCell.getAttribute('r');
        const colIndex = +startCell.getAttribute('c');
        let nextCoords = goToDirection(rowIndex, colIndex, direction);
        while (isInGridAria(nextCoords.row, nextCoords.col)) {
            const nextCell = document.querySelector(`td[r='${nextCoords.row}'][c='${nextCoords.col}']`);
            if (!nextCell || nextCell.innerHTML !== currentSymbol) {
                break;
            }
            result.push(nextCell);
            nextCoords = goToDirection(nextCoords.row, nextCoords.col, direction);
        }
    });
    return result;
}

function isInGridAria(row, col) {
    return col >= 0 && col < GRID_SIZE && row < GRID_SIZE && row >= 0;
}

function highlightWinnerLine(winnerLine) {
    winnerLine.forEach(function (cellElement) {
        cellElement.classList.add(WINNER_CELL_CLASS);
    })
}

function showWinnerModal(currentSymbol) {
    alert(currentSymbol + ' is winner!');
}

function createRow(rowIndex) {
    const row = document.createElement('tr');
    row.setAttribute('r', rowIndex);
    return row;
}

function createCell(rowIndex, colIndex, clickListener) {
    const cell = document.createElement('td');
    cell.setAttribute('r', rowIndex);
    cell.setAttribute('c', colIndex);
    cell.addEventListener('click', clickListener);
    return cell;
}

function goToDirection(startRowIndex, startColIndex, direction) {
    const directionCoords = DIRECTION_TO_COORDS[direction];
    return {
        row: startRowIndex + directionCoords[0],
        col: startColIndex + directionCoords[1]
    };
}

function onPlayAgainBtnClick() {
    const cells = grid.querySelectorAll(`td`);
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.innerHTML = '';
        cell.classList.remove(WINNER_CELL_CLASS);
    }
    winnerExists = false;
    nextSymbol = X_SYMBOL;
}