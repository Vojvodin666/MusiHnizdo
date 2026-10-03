const SWING_DURATION = 0.25;

const HAIR_COLORS = {
  left: '#f2cf7e',
  right: '#6b4226',
};

const DRESS_COLORS = {
  left: '#f06292',
  right: '#64b5f6',
};

export class Player {
  constructor(side, canvas) {
    this.side = side;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.score = 0;
    this.activeFly = null;
    this.swingTimer = 0;
  }

  receiveFly(fly) {
    this.activeFly = fly;
  }

  handleAction(action) {
    if (action === 'swat') {
      this.swingTimer = SWING_DURATION;
    }

    if (!this.activeFly) return;

    if (action === 'swat' && this.activeFly.type === 'normal') {
      this.score += 1;
      this.activeFly = null;
    } else if (action === 'avoid' && this.activeFly.type === 'decoy') {
      this.activeFly = null;
    }
  }

  update(dt) {
    if (this.swingTimer > 0) {
      this.swingTimer = Math.max(0, this.swingTimer - dt);
    }
    // TODO: advance fly timers, mark missed flies
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawCharacter();
    // TODO: draw active fly
  }

  drawCharacter() {
    const { ctx, canvas, side } = this;
    const cx = canvas.width / 2;
    const groundY = canvas.height * 0.85;

    const swingProgress = this.swingTimer > 0 ? 1 - this.swingTimer / SWING_DURATION : 0;
    const armAngle = -0.3 + Math.sin(swingProgress * Math.PI) * 1.2;

    ctx.fillStyle = DRESS_COLORS[side];
    ctx.beginPath();
    ctx.moveTo(cx - 30, groundY);
    ctx.lineTo(cx + 30, groundY);
    ctx.lineTo(cx + 18, groundY - 70);
    ctx.lineTo(cx - 18, groundY - 70);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffe0bd';
    ctx.beginPath();
    ctx.arc(cx, groundY - 90, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = HAIR_COLORS[side];
    ctx.beginPath();
    ctx.arc(cx, groundY - 95, 24, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 24, groundY - 95, 6, 30);
    ctx.fillRect(cx + 18, groundY - 95, 6, 30);

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 7, groundY - 92, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 7, groundY - 92, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, groundY - 84, 6, 0, Math.PI, false);
    ctx.stroke();

    const shoulderX = cx + 20;
    const shoulderY = groundY - 65;
    const armLength = 35;
    const handX = shoulderX + Math.cos(armAngle) * armLength;
    const handY = shoulderY + Math.sin(armAngle) * armLength;

    ctx.strokeStyle = '#ffe0bd';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    const swatterAngle = armAngle - Math.PI / 2;
    const handleLength = 30;
    const tipX = handX + Math.cos(swatterAngle) * handleLength;
    const tipY = handY + Math.sin(swatterAngle) * handleLength;

    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(swatterAngle);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.strokeRect(-14, -10, 28, 20);
    for (let i = -10; i <= 10; i += 7) {
      ctx.beginPath();
      ctx.moveTo(i, -10);
      ctx.lineTo(i, 10);
      ctx.stroke();
    }
    for (let j = -7; j <= 7; j += 7) {
      ctx.beginPath();
      ctx.moveTo(-14, j);
      ctx.lineTo(14, j);
      ctx.stroke();
    }
    ctx.restore();
  }
}
