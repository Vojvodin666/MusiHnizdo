const CONFETTI_COLORS = ['#f06292', '#64b5f6', '#fbc02d', '#81c784', '#ba68c8'];
const CONFETTI_COUNT = 40;

const overlay = document.getElementById('celebration');
const confettiLayer = document.getElementById('confetti-layer');
const messageEl = document.getElementById('celebration-message');
const playAgainButton = document.getElementById('play-again');

export function showCelebration(totalScore) {
  messageEl.textContent = `Spolu jste chytily ${totalScore} much!`;
  overlay.classList.add('visible');
  spawnConfetti();
}

export function hideCelebration() {
  overlay.classList.remove('visible');
  confettiLayer.innerHTML = '';
}

export function onPlayAgain(callback) {
  playAgainButton.addEventListener('click', callback);
}

function spawnConfetti() {
  confettiLayer.innerHTML = '';
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    confettiLayer.appendChild(piece);
  }
}
