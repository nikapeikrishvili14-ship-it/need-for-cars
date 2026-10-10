// Engine sound for the home car selector. Only ever runs after the visitor
// turns sound on, so browsers allow playback (it follows a click).
//
// Plays the car's own clip (car.sound) — only requested when that path is set
// in data/cars.ts. Without one, or if it fails to load, a short synthesized
// rev plays instead.

let ctx: AudioContext | null = null;
let current: HTMLAudioElement | null = null;
const missing = new Set<string>();

export function playEngine(src?: string) {
  current?.pause();
  if (!src || missing.has(src)) return synthRev();

  const audio = new Audio(src);
  audio.volume = 0.6;
  current = audio;
  audio.play().catch(() => {
    missing.add(src);
    synthRev();
  });
}

/** Low, filtered sawtooth that revs up and settles — about 0.9 s. */
function synthRev() {
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.linearRampToValueAtTime(900, now + 0.28);
    filter.frequency.exponentialRampToValueAtTime(260, now + 0.9);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

    filter.connect(gain).connect(ctx.destination);

    for (const [type, mult] of [["sawtooth", 1], ["square", 0.5]] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(48 * mult, now);
      osc.frequency.exponentialRampToValueAtTime(150 * mult, now + 0.28);
      osc.frequency.exponentialRampToValueAtTime(70 * mult, now + 0.9);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 1);
    }
  } catch {
    // No Web Audio support — stay silent
  }
}
