let audioCtx = null;
let buzzNodes = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function ensureAudio() {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  startBuzz();
}

export function playSwat() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

export function startBuzz() {
  if (buzzNodes) return;
  const ctx = getContext();

  const gain = ctx.createGain();
  gain.gain.value = 0.03;
  gain.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 180;

  const osc2 = ctx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.value = 185;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 7;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain).connect(osc1.frequency);

  osc1.connect(gain);
  osc2.connect(gain);

  osc1.start();
  osc2.start();
  lfo.start();

  buzzNodes = { osc1, osc2, lfo };
}

export function stopBuzz() {
  if (!buzzNodes) return;
  const { osc1, osc2, lfo } = buzzNodes;
  osc1.stop();
  osc2.stop();
  lfo.stop();
  buzzNodes = null;
}
