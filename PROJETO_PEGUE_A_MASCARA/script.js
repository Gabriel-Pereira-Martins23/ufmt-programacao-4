// Seleção de Elementos do DOM

const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const gameArea = document.getElementById('game-area');

// Variáveis Globais de Estado do Jogo
let score = 0;
let isPlaying = false;
let gameInterval;
let gameTimeout;

// Configurações do Jogo
const GAME_DURATION_MS = 30000; // 30 segundos (tempo de jogo)
const ENEMY_SPAWN_MS = 800;    // Spawn a cada 800ms
const ENEMY_LIFESPAN_MS = 1000; // Tempo que a máscara fica visível

// --- Iniciar o Jogo ---
function startGame() {
    if (isPlaying) return;

    isPlaying = true;
    score = 0;
    updateScore();
    startBtn.disabled = true;
    startBtn.innerText = "Jogando...";
    gameArea.innerHTML = ''; // Limpa a área do jogo anterior

    // Configura o temporizador principal do jogo 
    gameTimeout = setTimeout(endGame, GAME_DURATION_MS);

    // Configura a geração contínua de inimigos 
    gameInterval = setInterval(spawnEnemy, ENEMY_SPAWN_MS);
}

// --- Gerar Inimigos ---
function spawnEnemy() {
    if (!isPlaying) return;

    // VOL PEGAR PARA ME APROFUNDAR NA LINGUAGEM
    // ACABEI GOSTANDO 

    // 1. Criar o elemento da máscara
    const enemy = document.createElement('div');
    enemy.className = 'mask-enemy';

    // 2. Definir posições aleatórias 
   
    const rect = gameArea.getBoundingClientRect();
    const maxX = rect.width - 100; // 100px é a largura da máscara
    const maxY = rect.height - 100;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    enemy.style.left = `${randomX}px`;
    enemy.style.top = `${randomY}px`;

    // 3. Adicionar o evento de clique 
    enemy.addEventListener('click', handleEnemyClick);

    // 4. Adicionar ao DOM 
    gameArea.appendChild(enemy);

    // 5. Configurar o desaparecimento automático
    setTimeout(() => {
        if (enemy.parentNode) {
            enemy.remove(); // (remove)
        }
    }, ENEMY_LIFESPAN_MS);
}

// --- Lidar com o Clique ---
function handleEnemyClick(event) {
    if (!isPlaying) return;

    // Obter o inimigo clicado
    const enemy = event.target;

    // Atualizar Pontuação
    score += 10;
    updateScore();

    // Feedback Visual obrigatório: Sangue
    createBloodSplat(event.clientX, event.clientY);

    // Mudar a cor dinamicamente 
    // Vamos fazer a pontuação piscar em verde

    scoreEl.style.color = '#00ff00';
    setTimeout(() => scoreEl.style.color = '#FF6347', 150);

    // Remover o inimigo clicado imediatamente
    enemy.remove();
}

// --- Criar Feedback Visual (Sangue) ---
function createBloodSplat(x, y) {
    const splat = document.createElement('div');
    splat.className = 'blood-splat';
    splat.style.left = `${x - gameArea.offsetLeft}px`;
    splat.style.top = `${y - gameArea.offsetTop}px`;
    gameArea.appendChild(splat);

    // Remover a partícula após a animação
    setTimeout(() => {
        if (splat.parentNode) splat.remove();
    }, 600);
}

// --- Funções Auxiliares ---
function updateScore() {
    scoreEl.innerText = score;
}

function endGame() {
    isPlaying = false;
    startBtn.disabled = false;
    startBtn.innerText = "Jogar Novamente";

    // Limpar intervalos
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);

    // Exibir pontuação final
    alert(`FIM DE JOGO! Sua pontuação final é: ${score}`);
    alert(`SO ISSO ??? QUANTA COMPETENCIA KKKKK`);
}

// --- Event Listeners ---
startBtn.addEventListener('click', startGame);

// Iniciar com uma pontuação padrão
updateScore();

// Efeito de Rastro de Glitter Rosa ao mover o mouse
window.addEventListener('mousemove', (event) => {

    // Cria o elemento do brilho
    const glitter = document.createElement('div');
    glitter.className = 'glitter-particle';
    
    // Posiciona exatamente onde o mouse está
    glitter.style.left = `${event.pageX - 3}px`;
    glitter.style.top = `${event.pageY - 3}px`;
    
    // Adiciona no corpo da página
    document.body.appendChild(glitter);
    
    // Remove do HTML após o fim da animação 
    setTimeout(() => {
        glitter.remove();
    }, 500);
});