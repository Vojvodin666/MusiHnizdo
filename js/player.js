export class Player {
  constructor(side, canvas) {
    this.side = side;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.score = 0;
    this.activeFly = null;
  }

  receiveFly(fly) {
    this.activeFly = fly;
  }

  handleAction(action) {
    if (!this.activeFly) return;

    if (action === 'swat' && this.activeFly.type === 'normal') {
      this.score += 1;
      this.activeFly = null;
    } else if (action === 'avoid' && this.activeFly.type === 'decoy') {
      this.activeFly = null;
    }
  }

  update(dt) {
    // TODO: advance fly timers, mark missed flies
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // TODO: draw room background, player character, active fly
  }
}
