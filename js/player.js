const SWING_DURATION = 0.25;
const FLIGHT_DURATION = 0.45;

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
    this.onMiss = null;
  }

  receiveFly(fly) {
    const { canvas } = this;
    const landX = 50 + Math.random() * (canvas.width - 100);
    const landY = canvas.height * 0.15 + Math.random() * (canvas.height * 0.35);

    let startX;
    let startY;
    if (Math.random() < 0.5) {
      startX = Math.random() < 0.5 ? -30 : canvas.width + 30;
      startY = landY;
    } else {
      startX = landX;
      startY = -30;
    }

    this.activeFly = {
      ...fly,
      phase: 'flying',
      flightTime: 0,
      startX,
      startY,
      landX,
      landY,
      x: startX,
      y: startY,
      timeLeft: fly.duration,
    };
  }

  handleAction(action) {
    if (action === 'swat') {
      this.swingTimer = SWING_DURATION;
    }

    if (!this.activeFly || this.activeFly.phase !== 'sitting') return;

    if (action === 'swat' && this.activeFly.type === 'normal') {
      this.score += this.activeFly.isGift ? 2 : 1;
      this.activeFly = null;
    } else if (action === 'avoid' && this.activeFly.type === 'decoy') {
      this.activeFly = null;
    }
  }

  update(dt) {
    if (this.swingTimer > 0) {
      this.swingTimer = Math.max(0, this.swingTimer - dt);
    }

    const fly = this.activeFly;
    if (!fly) return;

    if (fly.phase === 'flying') {
      fly.flightTime += dt;
      const t = Math.min(1, fly.flightTime / FLIGHT_DURATION);
      fly.x = fly.startX + (fly.landX - fly.startX) * t;
      fly.y = fly.startY + (fly.landY - fly.startY) * t;
      if (t >= 1) {
        fly.phase = 'sitting';
      }
    } else {
      fly.timeLeft -= dt;
      if (fly.timeLeft <= 0) {
        this.activeFly = null;
        if (this.onMiss) this.onMiss(fly);
      }
    }
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawCharacter();
    this.drawFly();
  }

  drawFly() {
    if (!this.activeFly) return;

    const { ctx, activeFly } = this;
    const { x, y, type, phase } = activeFly;
    const isDecoy = type === 'decoy';
    const isGift = Boolean(activeFly.isGift);

    if (phase === 'sitting') {
      const radius = isGift ? 60 : 45;
      const fraction = Math.max(0, activeFly.timeLeft / activeFly.duration);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isGift
        ? 'rgba(255, 193, 7, 0.4)'
        : isDecoy ? 'rgba(255, 213, 79, 0.35)' : 'rgba(255, 241, 118, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + fraction * Math.PI * 2);
      ctx.lineTo(x, y);
      ctx.fillStyle = isGift
        ? 'rgba(255, 152, 0, 0.55)'
        : isDecoy ? 'rgba(251, 140, 0, 0.5)' : 'rgba(251, 192, 45, 0.5)';
      ctx.fill();
    }

    if (isDecoy) {
      this.drawBee(x, y);
    } else {
      this.drawFlySprite(x, y, isGift);
    }
  }

  drawFlySprite(x, y, isGift = false) {
    const { ctx } = this;
    const scale = isGift ? 1.6 : 1;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x - 6 * scale, y - 5 * scale, 8 * scale, 4 * scale, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 6 * scale, y - 5 * scale, 8 * scale, 4 * scale, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isGift ? '#c9a227' : '#333';
    ctx.beginPath();
    ctx.ellipse(x, y, 10 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBee(x, y) {
    const { ctx } = this;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x - 6, y - 8, 8, 4, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 6, y - 8, 8, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbc02d';
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.fillRect(x - 10, y - 4, 4, 8);
    ctx.fillRect(x - 2, y - 4, 4, 8);
    ctx.fillRect(x + 6, y - 4, 4, 8);
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
