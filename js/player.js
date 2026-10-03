const SWING_DURATION = 0.25;
const FLIGHT_DURATION = 1.3;
const WOBBLE_AMOUNT = 22;

const LANDING_SPOTS = [
  { xFrac: 0.3, yFrac: 0.22 },
  { xFrac: 0.7, yFrac: 0.18 },
  { xFrac: 0.5, yFrac: 0.36 },
];

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
    const spot = LANDING_SPOTS[Math.floor(Math.random() * LANDING_SPOTS.length)];
    const landX = spot.xFrac * canvas.width;
    const landY = spot.yFrac * canvas.height;

    let startX;
    let startY;
    if (fly.fromSibling) {
      startX = this.side === 'left' ? canvas.width + 30 : -30;
      startY = landY;
    } else if (Math.random() < 0.5) {
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
      wobbleSeed: Math.random() * Math.PI * 2,
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
      const baseX = fly.startX + (fly.landX - fly.startX) * t;
      const baseY = fly.startY + (fly.landY - fly.startY) * t;

      const dx = fly.landX - fly.startX;
      const dy = fly.landY - fly.startY;
      const len = Math.hypot(dx, dy) || 1;
      const perpX = -dy / len;
      const perpY = dx / len;
      const wobble = Math.sin(t * Math.PI) * Math.sin(fly.wobbleSeed + fly.flightTime * 6) * WOBBLE_AMOUNT;

      fly.x = baseX + perpX * wobble;
      fly.y = baseY + perpY * wobble;

      if (t >= 1) {
        fly.phase = 'sitting';
        fly.x = fly.landX;
        fly.y = fly.landY;
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
    this.drawFlowers();
    this.drawCharacter();
    this.drawFly();
  }

  drawFlowers() {
    const { canvas } = this;
    for (const spot of LANDING_SPOTS) {
      this.drawFlower(spot.xFrac * canvas.width, spot.yFrac * canvas.height);
    }
  }

  drawFlower(x, y) {
    const { ctx } = this;
    const petalOffsets = [
      [0, -10], [9, -3], [6, 8], [-6, 8], [-9, -3],
    ];

    ctx.fillStyle = '#f48fb1';
    for (const [ox, oy] of petalOffsets) {
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFly() {
    if (!this.activeFly) return;

    const { activeFly } = this;
    const { x, y, type } = activeFly;
    const isDecoy = type === 'decoy';
    const isGift = Boolean(activeFly.isGift);

    if (isDecoy) {
      this.drawBee(x, y);
    } else {
      this.drawFlySprite(x, y, isGift);
    }
  }

  drawFlySprite(x, y, isGift = false) {
    const { ctx } = this;
    const scale = isGift ? 1.6 : 1;
    const bodyColor = isGift ? '#c9a227' : '#333';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x - 6 * scale, y - 5 * scale, 8 * scale, 4 * scale, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 6 * scale, y - 5 * scale, 8 * scale, 4 * scale, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(x, y, 10 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    const headX = x;
    const headY = y - 10 * scale;
    const headRadius = 5 * scale;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    const eyeRadius = 2.6 * scale;
    const eyeOffsetX = 2.8 * scale;
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(headX - eyeOffsetX, headY - 1 * scale, eyeRadius, 0, Math.PI * 2);
    ctx.arc(headX + eyeOffsetX, headY - 1 * scale, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(headX - eyeOffsetX + scale, headY - 2 * scale, eyeRadius * 0.35, 0, Math.PI * 2);
    ctx.arc(headX + eyeOffsetX + scale, headY - 2 * scale, eyeRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(headX, headY + headRadius * 0.5);
    ctx.lineTo(headX, headY + headRadius * 0.5 + 5 * scale);
    ctx.stroke();
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

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 9, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(x - 12, y - 9, 24, 18);
    ctx.fillStyle = '#333';
    for (let sx = x - 9; sx <= x + 9; sx += 8) {
      ctx.fillRect(sx, y - 9, 4, 18);
    }
    ctx.restore();

    const headX = x;
    const headY = y - 11;
    const headRadius = 5;
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(headX - 2, headY - 1, 1.6, 0, Math.PI * 2);
    ctx.arc(headX + 2, headY - 1, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(headX - 2, headY - 1, 0.8, 0, Math.PI * 2);
    ctx.arc(headX + 2, headY - 1, 0.8, 0, Math.PI * 2);
    ctx.fill();
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
