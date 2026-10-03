import { Game } from './game.js';

function resizeCanvas(canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

const leftCanvas = document.getElementById('left-room');
const rightCanvas = document.getElementById('right-room');

[leftCanvas, rightCanvas].forEach(resizeCanvas);
window.addEventListener('resize', () => [leftCanvas, rightCanvas].forEach(resizeCanvas));

const game = new Game(leftCanvas, rightCanvas);
game.start();
