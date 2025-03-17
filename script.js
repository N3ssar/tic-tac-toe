let currentPlayer = "X";
let NUMBER_OF_ROWS = 3;
let turns = NUMBER_OF_ROWS ** 2;
let turnsCounter = 0;
let scoreX = 0;
let scoreO = 0;

const resetButton = document.querySelector("#reset");
const boardSizeSelect = document.querySelector("#board-size");
const applySizeButton = document.querySelector("#apply-size");
const scoreXElement = document.querySelector("#score-x");
const scoreOElement = document.querySelector("#score-o");

const createBoardArray = (numberOfRows) => {
  const board = [];
  for (let row = 0; row < numberOfRows; row++) {
    board.push(Array.from({ length: numberOfRows }, () => "_"));
  }
  return board;
};

let board = createBoardArray(NUMBER_OF_ROWS);

const checkRows = (currentPlayer) => {
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    let column = 0;
    let matched = true;

    while (column < NUMBER_OF_ROWS) {
      if (board[row][column] !== currentPlayer) {
        matched = false;
        break;
      }
      column++;
    }

    if (matched) return true;
  }
  return false;
};

const checkColumns = (currentPlayer) => {
  for (let column = 0; column < NUMBER_OF_ROWS; column++) {
    let row = 0;
    let matched = true;

    while (row < NUMBER_OF_ROWS) {
      if (board[row][column] !== currentPlayer) {
        matched = false;
        break;
      }
      row++;
    }

    if (matched) return true;
  }
  return false;
};

const checkDiagonals = (currentPlayer) => {
  let row = 0;
  let column = 0;
  let matched = true;

  while (row < NUMBER_OF_ROWS) {
    if (board[row][column] !== currentPlayer) {
      matched = false;
      break;
    }
    row++;
    column++;
  }

  return matched;
};

const checkReverseDiagonals = (currentPlayer) => {
  let row = 0;
  let column = NUMBER_OF_ROWS - 1;
  let matched = true;

  while (row < NUMBER_OF_ROWS) {
    if (board[row][column] !== currentPlayer) {
      matched = false;
      break;
    }
    row++;
    column--;
  }

  return matched;
};

const checkWin = (currentPlayer) => {
  return (
    checkRows(currentPlayer) ||
    checkColumns(currentPlayer) ||
    checkDiagonals(currentPlayer) ||
    checkReverseDiagonals(currentPlayer)
  );
};

const checkDraw = () => turnsCounter === turns;

const updateScore = (player) => {
  if (player === "X") {
    scoreX++;
    scoreXElement.textContent = scoreX;
  } else {
    scoreO++;
    scoreOElement.textContent = scoreO;
  }
};

const runWinEvent = () => {
  setTimeout(() => {
    alert(`Player ${currentPlayer} won!`);
    updateScore(currentPlayer);
    resetBoard();
  }, 100);
};

const runDrawEvent = () => {
  setTimeout(() => {
    alert("Draw!");
    resetBoard();
  }, 100);
};

const resetButtonClickHandler = () => {
  resetBoard();
};

const resetBoard = () => {
  board = createBoardArray(NUMBER_OF_ROWS);
  turnsCounter = 0;
  currentPlayer = "X";
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.querySelector(".value").textContent = "";
    cell.classList.remove("cell--X", "cell--O");
  });
};

const resetScores = () => {
  scoreX = 0;
  scoreO = 0;
  scoreXElement.textContent = "0";
  scoreOElement.textContent = "0";
};

const markPlayerInCell = (cell, player) => {
  cell.querySelector(".value").textContent = player;
  cell.classList.add(`cell--${player}`);
};

const getCellPlace = (index, numberOfRows) => {
  const row = Math.floor(index / numberOfRows);
  const column = index % numberOfRows;

  return [row, column];
};

const cellClickHandler = (event, index) => {
  const cell = event.currentTarget;
  const [row, column] = getCellPlace(index, NUMBER_OF_ROWS);
  if (board[row][column] === "_") {
    turnsCounter++;
    board[row][column] = currentPlayer;
    markPlayerInCell(cell, currentPlayer);

    if (checkWin(currentPlayer)) {
      runWinEvent();
    } else if (checkDraw()) {
      runDrawEvent();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }
};

const createBoard = () => {
  // Remove existing board if any
  const existingBoard = document.querySelector(".board");
  if (existingBoard) {
    existingBoard.remove();
  }

  let container = document.querySelector(".container");
  const gameControls = document.querySelector(".game-controls");
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");

  turns = NUMBER_OF_ROWS ** 2;

  for (let i = 0; i < turns; i++) {
    const cellElementString = `<div class="cell" role="button" tabindex="${
      i + 1
    }"><span class="value"></span></div>`;
    const cellElement = document
      .createRange()
      .createContextualFragment(cellElementString).firstChild;
    boardElement.appendChild(cellElement);
    cellElement.onclick = (event) => cellClickHandler(event, i);
    cellElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        cellClickHandler(event, i);
      }
    });
  }

  document.documentElement.style.setProperty("--grid-rows", NUMBER_OF_ROWS);
  container.insertBefore(boardElement, gameControls);
};
const changeBoardSize = () => {
  const newSize = parseInt(boardSizeSelect.value);
  if (newSize >= 3 && newSize <= 6) {
    NUMBER_OF_ROWS = newSize;
    board = createBoardArray(NUMBER_OF_ROWS);
    turnsCounter = 0;
    currentPlayer = "X";
    createBoard();
  }
};

resetButton.addEventListener("click", () => {
  resetBoard();
  resetScores();
});

applySizeButton.addEventListener("click", changeBoardSize);

createBoard();
