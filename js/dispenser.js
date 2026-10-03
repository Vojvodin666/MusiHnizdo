const DECOY_CHANCE = 0.25;
const GIFT_DURATION = 2.6;

export class Dispenser {
  constructor(players) {
    this.players = players;
    this.giftPending = {};
    for (const player of players) {
      this.giftPending[player.side] = false;
    }
  }

  tick(dt) {
    for (const player of this.players) {
      if (!player.activeFly) {
        player.receiveFly(this.nextFly(player.side));
      }
    }
  }

  nextFly(side) {
    if (this.giftPending[side]) {
      this.giftPending[side] = false;
      return { type: 'normal', duration: GIFT_DURATION, isGift: true };
    }

    const isDecoy = side === 'right' && Math.random() < DECOY_CHANCE;
    return {
      type: isDecoy ? 'decoy' : 'normal',
      duration: isDecoy ? 1.6 : 1.8,
    };
  }

  queueGift(side) {
    this.giftPending[side] = true;
  }
}
