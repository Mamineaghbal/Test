document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const startScreen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart');
  const gameBoard = document.getElementById('game-board'); // Now safe to access
  const scoreDisplay = document.getElementById('score');

  // Game state
  const gridSize = 20;
  let snake = [];
  let food = {};
  let direction = 'right';
  let score = 0;
  let gameInterval = null;
  const speed = 150;

  // Initialize game
  function initGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    draw(); // Render immediately
    gameInterval = setInterval(gameLoop, speed);
  }

  function generateFood() {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        return generateFood();
      }
    }
  }

  function gameLoop() {
    moveSnake();
    if (checkCollision()) {
      clearInterval(gameInterval);
      alert('Game Over! 🐍');
      return;
    }
    draw();
  }

  function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
      case 'up':    head.y--; break;
      case 'down':  head.y++; break;
      case 'left':  head.x--; break;
      case 'right': head.x++; break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreDisplay.textContent = `Score: ${score}`;
      generateFood();
    } else {
      snake.pop();
    }
  }

  function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  function draw() {
    // Clear board
    gameBoard.innerHTML = '';

    // Draw snake
    snake.forEach(segment => {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'snake');
      cell.style.gridColumn = segment.x + 1;
      cell.style.gridRow = segment.y + 1;
      gameBoard.appendChild(cell);
    });

    // Draw food
    const foodCell = document.createElement('div');
    foodCell.classList.add('cell', 'food');
    foodCell.style.gridColumn = food.x + 1;
    foodCell.style.gridRow = food.y + 1;
    gameBoard.appendChild(foodCell);
  }

  // Keyboard controls — only work during gameplay
  document.addEventListener('keydown', (e) => {
    // Only respond if game is active (gameScreen is visible)
    if (gameScreen.style.display !== 'block') return;

    switch (e.key) {
      case 'ArrowUp':    if (direction !== 'down') direction = 'up'; break;
      case 'ArrowDown':  if (direction !== 'up') direction = 'down'; break;
      case 'ArrowLeft':  if (direction !== 'right') direction = 'left'; break;
      case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
  });

  // Button handlers
  startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    initGame();
  });

  restartButton.addEventListener('click', () => {
    initGame();
  });
});