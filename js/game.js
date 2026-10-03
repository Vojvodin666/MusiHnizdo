import { Player } from './player.js';
import { Dispenser } from './dispenser.js';
import { InputHandler } from './input.js';
import { showCelebration, hideCelebration, onPlayAgain } from './celebration.js';
import { ensureAudio, playSwat, stopBuzz } from './audio.js';

const ROUND_SECONDS = 60;
const MAX_DT = 0.1;

export class Game {
  constructor(leftCanvas, rightCanvas) {
    this.players = {
      left: new Player('left', leftCanvas),
      right: new Player('right', rightCanvas),
    };
    this.dispenser = new Dispenser(Object.values(this.players));
    this.players.left.onMiss = () => this.dispenser.queueGift('right');
    this.players.right.onMiss = () => this.dispenser.queueGift('left');

    this.input = new InputHandler();
    this.input.onAction((side, action) => {
      ensureAudio();
      if (action === 'swat') playSwat();
      this.players[side].handleAction(action);
    });

    this.timeLeft = ROUND_SECONDS;
    this.lastTimestamp = null;

    onPlayAgain(() => this.restart());
  }

  start() {
    requestAnimationFrame((ts) => this.loop(ts));
  }

  loop(timestamp) {
    const dt = this.lastTimestamp ? Math.min((timestamp - this.lastTimestamp) / 1000, MAX_DT) : 0;
    this.lastTimestamp = timestamp;

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.endRound();
      return;
    }

    this.dispenser.tick(dt);
    for (const player of Object.values(this.players)) {
      player.update(dt);
      player.render();
    }

    requestAnimationFrame((ts) => this.loop(ts));
  }

  endRound() {
    stopBuzz();
    showCelebration({
      leftName: this.players.left.name,
      leftScore: this.players.left.score,
      rightName: this.players.right.name,
      rightScore: this.players.right.score,
    });
  }

  restart() {
    hideCelebration();
    this.timeLeft = ROUND_SECONDS;
    this.lastTimestamp = null;
    for (const player of Object.values(this.players)) {
      player.score = 0;
      player.activeFly = null;
    }
    this.start();
  }
}
