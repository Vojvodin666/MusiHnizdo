export class Dispenser {
  constructor(players) {
    this.players = players;
  }

  tick(dt) {
    for (const player of this.players) {
      if (!player.activeFly) {
        player.receiveFly(this.nextFly());
      }
    }
  }

  nextFly() {
    return { type: 'normal' };
  }
}
