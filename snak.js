// Variáveis
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Tamanho de cada quadrado (usado para movimentação)
const imageSize = 60; // Tamanho aumentado para as imagens, 60x60 pixels
const foodTimeout = 10000; // Tempo máximo para comer a comida (10 segundos)

let snake, food, direction, gameInterval, lives, foodCount, foodTimer, foodTimerStart, speed;
let enemies = []; // Lista de inimigos

// Carregar as imagens
const foodImage = new Image();
foodImage.src = 'cerebro.png'; // Substitua com o caminho para sua imagem de comida

const snakeImage = new Image();
snakeImage.src = '1.png'; // Substitua com o caminho para a imagem dos zumbis

const enemyImage = new Image();
enemyImage.src = '2.png'; // Imagem para o inimigo (agora com 2.png)

const backgroundImage = new Image();
backgroundImage.src = 'bg.png'; // Imagem do fundo (agora nomeada bg.png)

// Função para reiniciar o jogo
function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = generateFood(); // Gerar comida
  lives = 3;
  foodCount = 0;
  foodTimer = foodTimeout; // Inicia o temporizador da comida
  foodTimerStart = Date.now(); // Começa o tempo de comida
  speed = 100; // Velocidade inicial do jogo (100 ms)
  enemies = generateEnemies(); // Cria os inimigos
}

// Função para gerar comida (cérebro)
function generateFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
}

// Função para gerar inimigos
function generateEnemies() {
  const numEnemies = 3; // Quantidade de inimigos no jogo
  return Array.from({ length: numEnemies }, () => ({
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  }));
}

// Função para mover os inimigos de forma suave
function moveEnemies() {
  enemies.forEach(enemy => {
    let targetX = food.x;
    let targetY = food.y;

    // Determina qual o alvo mais próximo (comida ou cobra)
    const distanceToFood = Math.abs(enemy.x - targetX) + Math.abs(enemy.y - targetY);
    const distanceToPlayer = Math.abs(enemy.x - snake[0].x) + Math.abs(enemy.y - snake[0].y);

    if (distanceToFood < distanceToPlayer) {
      targetX = snake[0].x;
      targetY = snake[0].y;
    }

    // Calcula a direção de movimento
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // Distância total
    const moveSpeed = box; // Velocidade constante de movimento

    // Normaliza a direção e move o inimigo de forma suave
    const moveX = (dx / distance) * moveSpeed;
    const moveY = (dy / distance) * moveSpeed;

    // Atualiza a posição do inimigo
    enemy.x += moveX;
    enemy.y += moveY;

    // Garantir que os inimigos se movam dentro dos limites da tela
    if (enemy.x < 0) enemy.x = canvas.width - box;
    if (enemy.x >= canvas.width) enemy.x = 0;
    if (enemy.y < 0) enemy.y = canvas.height - box;
    if (enemy.y >= canvas.height) enemy.y = 0;
  });
}

// Função para desenhar os inimigos
function drawEnemies() {
  enemies.forEach(enemy => ctx.drawImage(enemyImage, enemy.x, enemy.y, imageSize, imageSize));
}

// Função para alterar a direção livremente
function changeDirection(event) {
  switch (event.keyCode) {
    case 37: // Esquerda
      snake[0].x -= box;
      break;
    case 38: // Cima
      snake[0].y -= box;
      break;
    case 39: // Direita
      snake[0].x += box;
      break;
    case 40: // Baixo
      snake[0].y += box;
      break;
  }
}

// Função para desenhar a cobra
function drawSnake() {
  ctx.drawImage(snakeImage, snake[0].x, snake[0].y, imageSize, imageSize); // Aumentado para imageSize (60x60)
}

// Função para desenhar a comida
function drawFood() {
  ctx.drawImage(foodImage, food.x, food.y, imageSize, imageSize);
}

// Função para desenhar o fundo
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Função para desenhar as informações no canvas
function drawInfo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  drawBackground(); // Desenha o fundo
  drawFood(); // Desenha a comida
  drawSnake(); // Desenha a cobra
  drawEnemies(); // Desenha os inimigos
  
  // Desenha o tempo restante de comida
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Tempo para comida: " + Math.ceil(foodTimer / 1000), 10, 30);
}

// Função para atualizar as informações fora do canvas
function updateRankDisplay() {
  let rank = "";
  if (foodCount >= 50) rank = "Master";
  else if (foodCount >= 20) rank = "Ouro";
  else if (foodCount >= 10) rank = "Prata";

  // Atualiza os elementos do ranking na div
  document.getElementById('rankText').textContent = "Rank: " + rank;
  document.getElementById('livesText').textContent = "Vidas: " + lives;
  document.getElementById('foodText').textContent = "Comida: " + foodCount;
  document.getElementById('timeText').textContent = "Tempo: " + Math.ceil(foodTimer / 1000); // Tempo restante de comida
}

// Função para verificar colisões com os inimigos
function checkEnemyCollisions() {
  enemies.forEach(enemy => {
    if (snake[0].x === enemy.x && snake[0].y === enemy.y) {
      lives--;
      // Exibe uma animação simples (pode ser customizada)
      alert("Você foi pego por um inimigo!");
      if (lives <= 0) endGame("Você perdeu todas as vidas!");
    }
  });
}

// Função para verificar colisões com as bordas do canvas
function checkCollisions() {
  if (snake[0].x < 0) snake[0].x = canvas.width - box;
  if (snake[0].x >= canvas.width) snake[0].x = 0;
  if (snake[0].y < 0) snake[0].y = canvas.height - box;
  if (snake[0].y >= canvas.height) snake[0].y = 0;
}

// Função para verificar se a cobra comeu a comida
function checkFood() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    food = generateFood(); // Nova comida
    foodCount++; // Aumenta o contador de comida
    foodTimer = foodTimeout; // Reinicia o temporizador da comida
    foodTimerStart = Date.now(); // Reinicia o contador de tempo ao comer
    return true;
  }
  return false;
}

// Função para atualizar o estado do jogo
function update() {
  const elapsedTime = Date.now() - foodTimerStart;
  foodTimer = foodTimeout - elapsedTime;

  if (foodTimer <= 0) {
    // Se o tempo acabar, a cobra perde uma vida
    lives--;
    if (lives > 0) {
      foodTimerStart = Date.now(); // Reinicia o temporizador
      food = generateFood(); // Nova comida
    } else {
      endGame("Você perdeu todas as vidas!");
      return;
    }
  }

  moveEnemies(); // Move os inimigos
  checkEnemyCollisions(); // Verifica colisões com os inimigos
  checkCollisions(); // Verificação de colisões (com as paredes ou com o próprio corpo)

  if (checkFood()) {
    // Se a comida foi comida, o zumbi não cresce
  }

  drawInfo(); // Desenha as informações no canvas
  updateRankDisplay(); // Atualiza as informações fora do canvas
}

// Função de fim de jogo
function endGame(message) {
  alert(message);
  clearInterval(gameInterval);
  document.getElementById("gameOverMessage").style.display = "block";
  document.getElementById("restartBtn").style.display = "inline-block";
  document.getElementById("startBtn").style.display = "none";
}

// Função para reiniciar o jogo
function restartGame() {
  document.getElementById("gameOverMessage").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("startBtn").style.display = "inline-block";
  startGame();
}

// Função para iniciar o jogo
function startGame() {
  resetGame();
  canvas.style.display = "block"; // Exibe o canvas
  document.getElementById("startBtn").style.display = "none"; // Esconde o botão "Start"
  document.getElementById("gameOverMessage").style.display = "none"; // Garante que a mensagem de fim de jogo está oculta
  document.getElementById("restartBtn").style.display = "none"; // Garante que o botão de reiniciar está oculto até o fim do jogo
  gameInterval = setInterval(update, speed); // Inicia o jogo
}

// Eventos
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.addEventListener("keydown", changeDirection); // Permite o controle da cobra
