// Pure utilities (no side effects)

export const now = () => Date.now();
export const uid = () => Math.random().toString(36).slice(2, 10);

export const safeNumber = (v: unknown, def = 0) => (Number.isFinite(Number(v)) ? Number(v) : def);

export const getCryptoRandom = () => {
  const a = new Uint32Array(1);
  if (typeof window !== "undefined" && (window as any).crypto?.getRandomValues) {
    (window as any).crypto.getRandomValues(a);
    return (a[0] + 1) / 4294967297;
  }
  return Math.random();
};

export const normalizeWeights = (ws: number[]) => {
  const s = ws.reduce((acc, w) => acc + Math.max(w, 0), 0);
  return s > 0 ? ws.map((w) => Math.max(w, 0) / s) : ws.map(() => 0);
};

export const buildCdf = (ps: number[]) => {
  let acc = 0;
  return ps.map((p) => (acc += p));
};

export const pickIndexByCdf = (cdf: number[], r: number) => {
  let lo = 0,
    hi = cdf.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (r <= cdf[m]) hi = m;
    else lo = m + 1;
  }
  return lo;
};

// Round percentages to sum to 100 (2 decimals), add diff to last
export const percentRoundTo100 = (ps: number[]) => {
  const rounded = ps.map((p) => Math.round(p * 100) / 100);
  const total = Math.round(ps.reduce((a, b) => a + b, 0) * 100) / 100;
  const diff = Math.round((100 - total) * 100) / 100;
  if (rounded.length) rounded[rounded.length - 1] = Math.max(0, rounded[rounded.length - 1] + diff);
  return rounded;
};

// Stats utilities
export const erf = (x0: number) => {
  const sign = x0 < 0 ? -1 : 1;
  const x = Math.abs(x0);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
};

export const chiSquarePValue = (obs: number[], exp: number[]) => {
  const k = obs.length;
  let chi2 = 0;
  for (let i = 0; i < k; i++) {
    const e = exp[i];
    if (e > 0) chi2 += (obs[i] - e) ** 2 / e;
  }
  const df = Math.max(k - 1, 1);
  const t = Math.pow(chi2 / df, 1 / 3) - (1 - 2 / (9 * df));
  const z = t / Math.sqrt(2 / (9 * df));
  const p = 1 - 0.5 * (1 + erf(z / Math.SQRT2));
  return { chi2, df, p: Math.max(0, Math.min(1, p)) };
};

export const rmse = (a: number[], e: number[]) => Math.sqrt(a.reduce((s, v, i) => s + (v - e[i]) ** 2, 0) / a.length);

export const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

export const randomNiceColor = () => {
  const hues = [0, 30, 60, 120, 180, 210, 240, 270, 300];
  const h = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${h} 70% 55%)`;
};
