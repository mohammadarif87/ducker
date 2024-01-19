// Select the relevant elements from the HTML
const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// Nested Array
const gridMatrix = [
  ['', '', '', '', '', '', '', '', ''],
  [
    'river',
    'wood',
    'wood',
    'river',
    'wood',
    'river',
    'river',
    'river',
    'river',
  ],
  ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
  ['', '', '', '', '', '', '', '', ''],
  ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
  ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
  ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
];

// Initialise variables that control the game "settings"
const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6];
const duckPosition = { x: 4, y: 8 };
let contentBeforeDuck = '';
let time = 15;

function drawGrid() {
  grid.innerHTML = '';

  // Fore each row in the gridMatrix, we need to process what is going to be drawn / displayed on the screen
  gridMatrix.forEach(function (gridRow, gridRowIndex) {
    gridRow.forEach(function (cellContent, cellContentIndex) {
      // Given the current grid row, create a cell for the grid in the game based on the cellContact

      // <div></div>
      const cellDiv = document.createElement('div');
      // <div class="cell"></div>
      cellDiv.classList.add('cell');

      if (riverRows.includes(gridRowIndex)) {
        // [1, 2]
        cellDiv.classList.add('river');
      } else if (roadRows.includes(gridRowIndex)) {
        // [4, 5, 6]
        cellDiv.classList.add('road');
      }

      // '' in the array ==> "falsy" so this if statement will only work with "truthy" cells
      if (cellContent) {
        cellDiv.classList.add(cellContent);
      }

      grid.appendChild(cellDiv);
    });
  });
}

function placeDuck() {
  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
  gridMatrix[duckPosition.y][duckPosition.x] = 'duck';
  // gridMatrix[8][4];
}

function moveDuck(event) {
  const key = event.key;
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (duckPosition.y > 0) duckPosition.y--;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (duckPosition.y < 8) duckPosition.y++;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (duckPosition.x > 0) duckPosition.x--;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (duckPosition.x < 8) duckPosition.x++;
      break;
  }

  render();
}

function updateDuckPosition() {
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  if (contentBeforeDuck === 'wood') {
    if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
    else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
  }
}

function checkPosition() {
  if (duckPosition.y === victoryRow) endGame('duck-arrived');
  else if (contentBeforeDuck === 'river') endGame('duck-drowned');
  else if (contentBeforeDuck === 'car' || contentBeforeDuck === 'bus')
    endGame('duck-hit');
}

// Game Win/Loss Logic
function endGame(reason) {
  // Victory
  if (reason === 'duck-arrived') {
    endGameText.innerHTML = 'YOU<br>WIN';
    endGameScreen.classList.add('win');
  }

  gridMatrix[duckPosition.y][duckPosition.x] = reason;

  // Stop the countdown timer
  clearInterval(countdownLoop);
  // Stop the game loop
  clearInterval(renderLoop);
  // Stop the player from being able to control the duck
  document.removeEventListener('keyup', moveDuck);
  // Display the game over screen
  endGameScreen.classList.remove('hidden');
}

function countdown() {
  if (time !== 0) {
    time--;
    timer.innerText = time.toString();
  }

  if (time === 0) {
    // end the game -- player has lost!
    endGame();
  }
}

// RUNNING THE GAME
function render() {
  placeDuck();
  checkPosition();
  drawGrid();
}

// anonymous function
const renderLoop = setInterval(function () {
  // console.log('contentBeforeDuck:', contentBeforeDuck);
  updateDuckPosition();
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

document.addEventListener('keyup', moveDuck);

playAgainBtn.addEventListener('click', function () {
  location.reload();
});
