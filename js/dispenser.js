const DECOY_CHANCE = 0.25;

export class Dispenser {
  constructor(players) {
    this.players = players;
  }

  tick(dt) {
    for (const player of this.players) {
      if (!player.activeFly) {
        player.receiveFly(this.nextFly(player.side));
      }
    }
  }

  nextFly(side) {
    const isDecoy = side === 'right' && Math.random() < DECOY_CHANCE;
    return {
      type: isDecoy ? 'decoy' : 'normal',
      duration: isDecoy ? 1.6 : 1.8,
    };
  }
}
