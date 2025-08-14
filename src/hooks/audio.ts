import { useCallback, useEffect, useRef } from "react";

export const useAudio = (enabled: boolean) => {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!enabled) return;
    try {
      ctxRef.current = ctxRef.current || new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    } catch {}
  }, [enabled]);

  const playClick = useCallback(() => {
    if (!enabled || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(660, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.03, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.18);
  }, [enabled]);

  const playFanfare = useCallback(() => {
    if (!enabled || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = "sawtooth";
    o2.type = "square";
    o1.frequency.setValueAtTime(523, ctx.currentTime);
    o2.frequency.setValueAtTime(784, ctx.currentTime);
    g.gain.setValueAtTime(0.02, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o1.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);
    o1.start();
    o2.start();
    o1.stop(ctx.currentTime + 0.5);
    o2.stop(ctx.currentTime + 0.5);
  }, [enabled]);

  return { playClick, playFanfare };
};
