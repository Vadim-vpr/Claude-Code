const board = document.querySelector('#board');
const status = document.querySelector('#status');
const turnIndicator = document.querySelector('#turn-indicator');
const newGameButton = document.querySelector('#new-game');
const modeSelect = document.querySelector('#mode');
const difficultySelect = document.querySelector('#difficulty');
const difficultyWrap = document.querySelector('#difficulty-wrap');
const scoreX = document.querySelector('#score-x');
const scoreO = document.querySelector('#score-o');
const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let cells = [], currentPlayer = 'X', gameActive = true, scores = { X: 0, O: 0 }, thinking = false;
function createBoard() { board.innerHTML = ''; cells = Array.from({ length: 9 }, (_, index) => { const cell = document.createElement('button'); cell.className = 'cell'; cell.type = 'button'; cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', `Клетка ${index + 1}`); cell.addEventListener('click', () => makeMove(index)); board.append(cell); return cell; }); }
function makeMove(index) { if (!gameActive || thinking || cells[index].textContent) return; markCell(index, currentPlayer); const line = getWinningLine(); if (line) return finishGame(`${currentPlayer === 'X' ? 'Капитан' : 'Штурман'} победил!`, line); if (cells.every((cell) => cell.textContent)) return finishGame('Ничья! Карта сокровищ осталась общей.'); currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; updateTurn(); if (modeSelect.value === 'bot' && currentPlayer === 'O') botMove(); }
function markCell(index, player) { cells[index].textContent = player; cells[index].classList.add(player.toLowerCase()); cells[index].disabled = true; cells[index].setAttribute('aria-label', `Клетка ${index + 1}: ${player}`); }
function getWinningLine() { return winningLines.find(([a,b,c]) => cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent); }
function botMove() { thinking = true; status.textContent = 'Штурман сверяется с картой...'; window.setTimeout(() => { const move = difficultySelect.value === 'captain' ? bestMove() : casualMove(); markCell(move, 'O'); thinking = false; const line = getWinningLine(); if (line) return finishGame('Штурман захватил палубу!', line); if (cells.every((cell) => cell.textContent)) return finishGame('Ничья! Карта сокровищ осталась общей.'); currentPlayer = 'X'; updateTurn(); }, 450); }
function casualMove() { const open = cells.map((cell, index) => cell.textContent ? null : index).filter((index) => index !== null); return open[Math.floor(Math.random() * open.length)]; }
function bestMove() { const open = cells.map((cell, index) => cell.textContent ? null : index).filter((index) => index !== null); let move = open.find((index) => wouldWin(index, 'O')); if (move !== undefined) return move; move = open.find((index) => wouldWin(index, 'X')); if (move !== undefined) return move; if (!cells[4].textContent) return 4; return open[0]; }
function wouldWin(index, player) { const values = cells.map((cell) => cell.textContent); values[index] = player; return winningLines.some(([a,b,c]) => values[a] === player && values[b] === player && values[c] === player); }
function finishGame(message, line = []) { gameActive = false; status.textContent = message; turnIndicator.textContent = 'Партия завершена'; line.forEach((index) => cells[index].classList.add('winner')); if (line.length) { scores[currentPlayer] += 1; scoreX.textContent = scores.X; scoreO.textContent = scores.O; } }
function updateTurn() { turnIndicator.textContent = `Ход ${currentPlayer}`; status.textContent = modeSelect.value === 'bot' ? (currentPlayer === 'X' ? 'Ваш ход, капитан' : 'Ход штурмана') : `Ходят ${currentPlayer === 'X' ? 'крестики' : 'нолики'}`; }
function startNewGame() { currentPlayer = 'X'; gameActive = true; thinking = false; createBoard(); updateTurn(); }
modeSelect.addEventListener('change', () => { difficultyWrap.hidden = modeSelect.value !== 'bot'; startNewGame(); }); difficultySelect.addEventListener('change', startNewGame); newGameButton.addEventListener('click', startNewGame); startNewGame();
const board = document.querySelector('#board');
const status = document.querySelector('#status');
const turnIndicator = document.querySelector('#turn-indicator');
const newGameButton = document.querySelector('#new-game');
const scoreX = document.querySelector('#score-x');
const scoreO = document.querySelector('#score-o');

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let cells = [];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0 };

function createBoard() {
  board.innerHTML = '';
  cells = Array.from({ length: 9 }, (_, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Клетка ${index + 1}`);
    cell.addEventListener('click', () => makeMove(index));
    board.append(cell);
    return cell;
  });
}

function makeMove(index) {
  if (!gameActive || cells[index].textContent) return;

  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());
  cells[index].setAttribute('aria-label', `Клетка ${index + 1}: ${currentPlayer}`);
  cells[index].disabled = true;

  const winningLine = getWinningLine();
  if (winningLine) {
    finishGame(`${currentPlayer} победил!`, winningLine);
    return;
  }

  if (cells.every((cell) => cell.textContent)) {
    finishGame('Ничья! Поле заполнено.');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurn();
}

function getWinningLine() {
  return winningLines.find(([a, b, c]) => {
    const value = cells[a].textContent;
    return value && value === cells[b].textContent && value === cells[c].textContent;
  });
}

function finishGame(message, winningLine = []) {
  gameActive = false;
  status.textContent = message;
  turnIndicator.textContent = 'Партия завершена';
  winningLine.forEach((index) => cells[index].classList.add('winner'));
  if (winningLine.length) {
    scores[currentPlayer] += 1;
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
  }
}

function updateTurn() {
  turnIndicator.textContent = `Ход ${currentPlayer}`;
  status.textContent = `Сейчас ходят ${currentPlayer === 'X' ? 'крестики' : 'нолики'}`;
}

function startNewGame() {
  currentPlayer = 'X';
  gameActive = true;
  createBoard();
  updateTurn();
}

newGameButton.addEventListener('click', startNewGame);
startNewGame();
