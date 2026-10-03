const DECOY_CHANCE = 0.25;
const GIFT_DURATION = 2.6;
const CROSS_CHANCE = 0.2;

const OPPOSITE_SIDE = { left: 'right', right: 'left' };

export class Dispenser {
  constructor(players) {
    this.players = players;
    this.giftPending = {};
    this.crossingPending = {};
    for (const player of players) {
      this.giftPending[player.side] = false;
      this.crossingPending[player.side] = false;
    }
  }

  tick(dt) {
    for (const player of this.players) {
      if (!player.activeFly) {
        const fly = this.nextFly(player.side);
        if (fly) player.receiveFly(fly);
      }
    }
  }

  nextFly(side) {
    if (this.giftPending[side]) {
      this.giftPending[side] = false;
      return { type: 'normal', duration: GIFT_DURATION, isGift: true };
    }

    if (this.crossingPending[side]) {
      this.crossingPending[side] = false;
      return this.regularFly(side, true);
    }

    if (Math.random() < CROSS_CHANCE) {
      this.crossingPending[OPPOSITE_SIDE[side]] = true;
      return null;
    }

    return this.regularFly(side, false);
  }

  regularFly(side, fromSibling) {
    const isDecoy = side === 'right' && Math.random() < DECOY_CHANCE;
    return {
      type: isDecoy ? 'decoy' : 'normal',
      duration: isDecoy ? 1.6 : 1.8,
      fromSibling,
    };
  }

  queueGift(side) {
    this.giftPending[side] = true;
  }
}
