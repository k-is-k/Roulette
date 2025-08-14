import { Project } from "./types";
import { now, uid, randomNiceColor } from "./utils";

const STORAGE_KEY = "waku2-lottery-v2"; // v2: near-miss removed, stop-angle judge

export const storage = {
  save(projects: Project[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {}
  },
  load(): Project[] {
    if (typeof window === "undefined") return [];
    try {
      // v1 → v2 migrate (ignore settings.nearMiss)
      const rawV2 = localStorage.getItem(STORAGE_KEY);
      if (rawV2) return JSON.parse(rawV2);

      const rawV1 = localStorage.getItem("waku2-lottery-v1");
      if (!rawV1) return [];
      const v1 = JSON.parse(rawV1);
      return (Array.isArray(v1) ? v1 : []).map((p: any) => ({
        ...p,
        settings: {
          inputMode: p?.settings?.inputMode ?? "weight",
          sound: !!p?.settings?.sound,
          haptics: !!p?.settings?.haptics,
          highContrast: !!p?.settings?.highContrast,
          quickHoldMs: Number(p?.settings?.quickHoldMs ?? 450),
          spinsSec: Number(p?.settings?.spinsSec ?? 3.2),
        },
      }));
    } catch {
      return [];
    }
  },
};

export const DEFAULT_PROJECT = (): Project => ({
  id: uid(),
  name: "新規プロジェクト",
  createdAt: now(),
  updatedAt: now(),
  theme: "roulette",
  options: [
    { id: uid(), label: "A賞", color: "#22c55e", icon: "🎉", weight: 1 },
    { id: uid(), label: "B賞", color: "#3b82f6", icon: "🎁", weight: 1 },
    { id: uid(), label: "ハズレ", color: "#ef4444", icon: "💦", weight: 1 },
  ],
  history: [],
  settings: { inputMode: "weight", sound: true, haptics: true, highContrast: false, quickHoldMs: 450, spinsSec: 3.2 },
});
