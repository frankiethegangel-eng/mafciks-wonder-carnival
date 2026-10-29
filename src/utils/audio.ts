/**
 * Web Audio API synthesized sound generator.
 * Zero external audio files or dependencies. Works completely offline.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /** Soft musical chime note */
  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.25, volume: number = 0.15) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio might be blocked or unavailable, safe ignore
    }
  }

  public playClick() {
    this.playTone(520, 'triangle', 0.08, 0.08);
  }

  public playPop() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // safe ignore
    }
  }

  public playSparkle() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.1), i * 65);
    });
  }

  public playBell(noteIdx: number) {
    // 1: C5 (523Hz), 2: E5 (659Hz), 3: G5 (784Hz), 4: C6 (1046Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.5];
    const freq = frequencies[noteIdx - 1] || 600;
    this.playTone(freq, 'sine', 0.45, 0.2);
  }

  public playWin() {
    // Bright celebratory carnival arpeggio
    const chord = [392, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.35, 0.18);
      }, idx * 80);
    });
  }
}

export const sound = new SoundController();
