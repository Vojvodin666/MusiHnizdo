import { Player } from './player.js';
import { Dispenser } from './dispenser.js';
import { InputHandler } from './input.js';

const ROUND_SECONDS = 60;

export class Game {
  constructor(leftCanvas, rightCanvas) {
    this.players = {
      left: new Player('left', leftCanvas),
      right: new Player('right', rightCanvas),
    };
    this.dispenser = new Dispenser(Object.values(this.players));
    this.input = new InputHandler();
    this.input.onAction((side, action) => this.players[side].handleAction(action));

    this.timeLeft = ROUND_SECONDS;
    this.lastTimestamp = null;
  }

  start() {
    requestAnimationFrame((ts) => this.loop(ts));
  }

  loop(timestamp) {
    const dt = this.lastTimestamp ? (timestamp - this.lastTimestamp) / 1000 : 0;
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
    // TODO: show shared celebration screen
  }
}
