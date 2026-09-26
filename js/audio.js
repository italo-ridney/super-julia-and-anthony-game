let ctx = null;
let loopTimer = null;
let loopGain = null;
let audioUnlocked = false;
let pendingLoop = null;

function midiToFreq(m) {
  return 440 * 2 ** ((m - 69) / 12);
}

function ensureCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const c = ensureCtx();
  if (c && c.state === 'suspended') c.resume();
  if (pendingLoop) {
    const name = pendingLoop;
    pendingLoop = null;
    audio.playLoop(name);
  }
}

export const audio = {
  hookFirstGesture() {
    const onGesture = () => unlockAudio();
    window.addEventListener('keydown', onGesture, { once: true });
    window.addEventListener('pointerdown', onGesture, { once: true });
  },
  beep(freq, durSec, type = 'square', gain = 0.06) {
    if (!audioUnlocked) return;
    const c = ctx;
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + durSec);
  },
  stopLoop() {
    if (loopTimer) clearInterval(loopTimer);
    loopTimer = null;
    if (loopGain) loopGain.gain.value = 0;
  },
  playLoop(name) {
    this.stopLoop();
    if (!audioUnlocked) {
      pendingLoop = name;
      return;
    }
    const c = ctx;
    if (!c) return;
    const loops = {
      title: { notes: [64, 67, 71, 76, 74, 71, 69, 67], frames: 20, type: 'square', gain: 0.035 },
      grass: { notes: [72, 76, 79, 76, 72, 74, 76, 72, 69, 72, 76, 74, 67, 71, 74, 72], frames: 15, type: 'square', gain: 0.035 },
      cave: { notes: [52, 55, 59, 64], frames: 25, type: 'square', gain: 0.035 },
      sky: { notes: [79, 83, 86, 83, 81, 79, 76, 79], frames: 12, type: 'square', gain: 0.035 },
      mountain: { notes: [60, 62, 65, 67, 65, 62], frames: 18, type: 'square', gain: 0.035 },
      castle: { notes: [52, 52, 50, 52, 55, 54], frames: 14, type: 'sawtooth', gain: 0.03 },
      boss: { notes: [52, 52, 50, 52, 55, 54], frames: 14, type: 'sawtooth', gain: 0.03 },
    };
    const spec = loops[name];
    if (!spec) return;
    let i = 0;
    const ms = (spec.frames / 60) * 1000;
    loopTimer = setInterval(() => {
      this.beep(midiToFreq(spec.notes[i % spec.notes.length]), spec.frames / 60, spec.type, spec.gain);
      i++;
    }, ms);
  },
  sfxJump() { this.beep(520, 0.08); },
  sfxCoin() { this.beep(980, 0.06); setTimeout(() => this.beep(1320, 0.06), 60); },
  sfxStomp() { this.beep(180, 0.1, 'triangle'); },
  sfxPowerup() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.beep(f, 0.07), i * 70));
  },
  sfxDamage() { this.beep(120, 0.2); },
  sfxFireball() { this.beep(640, 0.08); },
  sfxStarSpin() { this.beep(523, 0.15); this.beep(784, 0.15); },
  sfxDeath() { this.beep(400, 0.2); setTimeout(() => this.beep(80, 0.2), 200); },
  sfxClear() { this.sfxPowerup(); },
  sfxBossHit() { this.beep(80, 0.12); },
};
