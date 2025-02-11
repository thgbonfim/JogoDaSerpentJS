// Configurações do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Tamanho de cada quadrado
const snakeColors = { head: "green", body: "lime" }; // Cores da cobrinha
let snake, food, direction, gameInterval, lives;

// Função para reiniciar o jogo
function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = generateFood();
  direction = "RIGHT";
  lives = 3; // Define o número de vidas
}

// Função para gerar comida aleatória
function generateFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
}

// Função para alterar a direção da cobrinha
function changeDirection(event) {
  if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
  if (event.keyCode == 38 && direction != "DOWN") direction = "UP";
  if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
  if (event.keyCode == 40 && direction != "UP") direction = "DOWN";
}

// Função para desenhar a cobrinha
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeColors.head : snakeColors.body;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

// Função para desenhar a comida
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Função para desenhar as vidas restantes
function drawLives() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Vidas: " + lives, 10, canvas.height - 10);
}

// Função para verificar colisões
function checkCollisions() {
  // Colisão com as paredes
  if (snake[0].x < 0 || snake[0].x >= 20 * box || snake[0].y < 0 || snake[0].y >= 20 * box) {
    return true;
  }

  // Colisão com o próprio corpo
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

// Função para verificar se a cobrinha comeu a comida
function checkFood() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    food = generateFood(); // Gera nova comida
    return true;
  }
  return false;
}

// Função que atualiza o estado do jogo
function update() {
  if (checkCollisions()) {
    lives--; // Perde uma vida em caso de colisão
    if (lives > 0) {
      resetGame(); // Reinicia o jogo, mas com as vidas restantes
    } else {
      endGame("Você perdeu todas as vidas!");
      return;
    }
  }

  let newHead;
  if (direction === "LEFT") newHead = { x: snake[0].x - box, y: snake[0].y };
  if (direction === "UP") newHead = { x: snake[0].x, y: snake[0].y - box };
  if (direction === "RIGHT") newHead = { x: snake[0].x + box, y: snake[0].y };
  if (direction === "DOWN") newHead = { x: snake[0].x, y: snake[0].y + box };

  snake.unshift(newHead); // Adiciona a nova cabeça

  if (!checkFood()) {
    snake.pop(); // Remove a cauda
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  drawFood(); // Desenha a comida
  drawSnake(); // Desenha a cobrinha
  drawLives(); // Desenha as vidas restantes
}

// Função para finalizar o jogo
function endGame(message) {
  alert(message);
  clearInterval(gameInterval); // Para o jogo
}

// Função que inicia o jogo
function startGame() {
  resetGame(); // Reinicia o jogo
  canvas.style.display = "block"; // Mostra o canvas
  document.getElementById("startBtn").style.display = "none"; // Esconde o botão
  gameInterval = setInterval(update, 100); // Inicia o jogo
}

// Função que é chamada quando o botão "Start" é clicado
document.getElementById("startBtn").addEventListener("click", startGame);

// Adiciona o evento de teclado para controlar a direção
document.addEventListener("keydown", changeDirection);
