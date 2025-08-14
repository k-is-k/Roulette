export type Option = {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  description?: string;
  weight: number; // percent mode: %, weight mode: raw weight
};

export type HistoryItem = {
  id: string;
  projectId: string;
  drawnAt: number;
  resultOptionId: string;
  seed?: string;
  randSnapshot?: number[]; // [randomAngleDeg]
};

export type Project = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  theme: "roulette" | "simple";
  options: Option[];
  history: HistoryItem[];
  settings: {
    inputMode: "percent" | "weight";
    sound: boolean;
    haptics: boolean;
    highContrast: boolean;
    quickHoldMs: number;
    spinsSec: number;
  };
};
