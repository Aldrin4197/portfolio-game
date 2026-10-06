export type SoundEffect = "jump" | "land" | "open" | "close" | "travel" | "select";
export interface AudioPreferences {
  enabled: boolean;
  music: boolean;
  effects: boolean;
  volume: number;
}
const STORAGE_KEY = "aldrin-world-audio";
const defaults: AudioPreferences = { enabled: false, music: true, effects: true, volume: 0.5 };

export function readAudioPreferences(): AudioPreferences {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return {
      enabled: typeof saved?.enabled === "boolean" ? saved.enabled : defaults.enabled,
      music: typeof saved?.music === "boolean" ? saved.music : defaults.music,
      effects: typeof saved?.effects === "boolean" ? saved.effects : defaults.effects,
      volume: typeof saved?.volume === "number" && Number.isFinite(saved.volume)
        ? Math.max(0, Math.min(1, saved.volume)) : defaults.volume,
    };
  } catch {
    return { ...defaults };
  }
}

// Original eight-bar C-major exploration theme, synthesized locally. No audio
// downloads, third-party recordings, or streaming services are required.
const chords = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50],
  [48, 52, 55], [40, 43, 47], [41, 45, 48], [43, 47, 50]];
const melody = [[72, 0, 76, 79, 0, 76, 74, 0], [72, 0, 69, 0, 76, 0, 72, 0],
  [69, 72, 77, 0, 76, 0, 72, 0], [71, 0, 74, 79, 0, 77, 74, 0],
  [76, 0, 79, 84, 0, 79, 76, 0], [74, 0, 71, 0, 67, 0, 71, 0],
  [69, 0, 72, 77, 0, 76, 74, 0], [71, 74, 79, 0, 74, 71, 72, 0]];
const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export function createGameAudio(initial: AudioPreferences, onError: () => void) {
  let preferences = { ...initial };
  let context: AudioContext | undefined;
  let master: GainNode | undefined;
  let musicGain: GainNode | undefined;
  let effectsGain: GainNode | undefined;
  let active = true;
  let disposed = false;
  let unlocked = false;
  let ducked = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let step = 0;
  let nextNote = 0;
  let lastEffect = -Infinity;
  const voices = new Map<OscillatorNode, GainNode>();
  const buses = new Map<OscillatorNode, GainNode>();

  function tone(bus: GainNode, hz: number, at: number, duration: number,
    volume: number, wave: OscillatorType = "triangle", endHz = hz) {
    if (!context) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(hz, at);
    oscillator.frequency.exponentialRampToValueAtTime(endHz, at + duration);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(volume, at + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope).connect(bus);
    voices.set(oscillator, envelope);
    buses.set(oscillator, bus);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
      voices.delete(oscillator);
      buses.delete(oscillator);
    };
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
  }

  function stopVoices(bus?: GainNode) {
    for (const [oscillator, envelope] of voices) {
      if (bus && buses.get(oscillator) !== bus) continue;
      oscillator.stop();
      oscillator.disconnect();
      envelope.disconnect();
      voices.delete(oscillator);
      buses.delete(oscillator);
    }
  }

  function stopMusic() {
    clearInterval(timer);
    timer = undefined;
    if (musicGain) stopVoices(musicGain);
  }

  function schedule() {
    if (!context || !musicGain || context.state !== "running") return;
    const eighth = 60 / 92 / 2;
    // Skip missed time after a stalled tab instead of playing a burst of notes.
    if (nextNote < context.currentTime) nextNote = context.currentTime + 0.03;
    while (nextNote < context.currentTime + 0.15) {
      const bar = Math.floor(step / 8) % chords.length;
      const beat = step % 8;
      const note = melody[bar][beat];
      if (note) tone(musicGain, frequency(note), nextNote, eighth * 1.4, 0.14);
      if (beat === 0) {
        chords[bar].forEach(n => tone(musicGain!, frequency(n + 12), nextNote, eighth * 7.5, 0.055, "sine"));
      }
      if (beat === 0 || beat === 4) {
        tone(musicGain, frequency(chords[bar][0]), nextNote, eighth * 2.5, 0.16);
      }
      step = (step + 1) % 64;
      nextNote += eighth;
    }
  }

  function syncMusic() {
    if (!context || !preferences.enabled || !preferences.music || !active || context.state !== "running") {
      stopMusic();
      return;
    }
    if (timer !== undefined) return;
    nextNote = context.currentTime + 0.04;
    schedule();
    timer = setInterval(schedule, 50);
  }

  async function unlock() {
    if (disposed || !preferences.enabled || !active) return;
    try {
      // Called from a trusted pointer/key event, satisfying mobile autoplay rules.
      if (!context) {
        context = new AudioContext();
        master = context.createGain();
        musicGain = context.createGain();
        effectsGain = context.createGain();
        master.gain.value = preferences.volume * 0.7;
        musicGain.gain.value = ducked ? 0.3 : 0.65;
        effectsGain.gain.value = 0.65;
        musicGain.connect(master);
        effectsGain.connect(master);
        master.connect(context.destination);
      }
      if (context.state !== "running") await context.resume();
      if (disposed) return;
      if (!active || !preferences.enabled) {
        await context.suspend();
        return;
      }
      unlocked = true;
      syncMusic();
    } catch {
      if (!disposed) onError();
    }
  }

  function effect(name: SoundEffect) {
    if (!context || !effectsGain || context.state !== "running" || !active ||
      !preferences.enabled || !preferences.effects || disposed) return;
    const at = context.currentTime;
    // One sound per action even when a dialog and its button both handle it.
    if (at - lastEffect < 0.045) return;
    lastEffect = at;
    switch (name) {
      case "jump": tone(effectsGain, 230, at, 0.18, 0.2, "triangle", 690); break;
      case "land": tone(effectsGain, 135, at, 0.1, 0.18, "sine", 55); break;
      case "open":
        [72, 76, 79].forEach((n, i) => tone(effectsGain!, frequency(n), at + i * 0.055, 0.16, 0.13));
        break;
      case "close": tone(effectsGain, 520, at, 0.13, 0.12, "triangle", 310); break;
      case "travel":
        [60, 67, 72, 79].forEach((n, i) => tone(effectsGain!, frequency(n), at + i * 0.075, 0.24, 0.15));
        break;
      case "select": tone(effectsGain, 880, at, 0.065, 0.07, "sine"); break;
    }
  }

  return {
    unlock,
    effect,
    setPreferences(value: AudioPreferences) {
      preferences = { ...value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* Storage can be unavailable. */ }
      if (context && master) master.gain.setTargetAtTime(preferences.volume * 0.7, context.currentTime, 0.03);
      if (!preferences.effects && effectsGain) stopVoices(effectsGain);
      if (!preferences.enabled) {
        stopMusic();
        stopVoices();
        void context?.suspend().catch(() => {});
      } else {
        syncMusic();
        void unlock();
      }
    },
    setActive(value: boolean) {
      active = value;
      if (!active) {
        stopMusic();
        stopVoices();
        void context?.suspend().catch(() => {});
      } else if (unlocked) void unlock();
    },
    setDucked(value: boolean) {
      ducked = value;
      if (context && musicGain) musicGain.gain.setTargetAtTime(value ? 0.3 : 0.65, context.currentTime, 0.1);
    },
    destroy() {
      disposed = true;
      stopMusic();
      stopVoices();
      void context?.close().catch(() => {});
    },
  };
}
