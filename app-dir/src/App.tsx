import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HeaderBar from "./components/HeaderBar";
import EditTab from "./components/tabs/EditTab";
import DrawTab from "./components/tabs/DrawTab";
import StatsTab from "./components/tabs/StatsTab";

import type { Option, Project, HistoryItem } from "./types";
import {
  safeNumber,
  normalizeWeights,
  buildCdf,
  percentRoundTo100,
  getCryptoRandom,
  chiSquarePValue,
  rmse,
  randomNiceColor,
  uid,
  now,
  pickIndexByCdf,
} from "./utils";
import { storage, DEFAULT_PROJECT } from "./storage";
import { useAudio } from "./hooks/audio";
import { useHaptics } from "./hooks/haptics";

export default function App() {
  // --------------- 状態
  const [projects, setProjects] = useState<Project[]>(() => {
    const s = storage.load();
    return s.length ? s : [DEFAULT_PROJECT()];
  });
  const [activeId, setActiveId] = useState<string>(() => projects[0]?.id || "");

  const active = useMemo(() => projects.find((p) => p.id === activeId)!, [projects, activeId]);

  // ローカル保存
  useEffect(() => storage.save(projects), [projects]);

  // --------------- ユーティリティ更新関数
  const patchActive = useCallback(
    (patch: Partial<Project>) =>
      setProjects((prev) => prev.map((p) => (p.id === activeId ? { ...p, ...patch, updatedAt: now() } : p))),
    [activeId]
  );

  const updateOptions = useCallback(
    (fn: (opts: Option[]) => Option[]) => patchActive({ options: fn(active.options) }),
    [active.options, patchActive]
  );

  const addOption = useCallback(
    () =>
      updateOptions((opts) => [
        ...opts,
        { id: uid(), label: `選択肢${opts.length + 1}`, color: randomNiceColor(), icon: "", weight: 1 },
      ]),
    [updateOptions]
  );

  const removeOption = useCallback((id: string) => updateOptions((opts) => opts.filter((o) => o.id !== id)), [updateOptions]);

  const equalize = useCallback(() => updateOptions((opts) => opts.map((o) => ({ ...o, weight: 1 }))), [updateOptions]);

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== id);
        if (next.length === 0) {
          const d = DEFAULT_PROJECT();
          setActiveId(d.id);
          return [d];
        }
        if (id === activeId) setActiveId(next[0].id);
        return next;
      });
    },
    [activeId]
  );

  const normalizePercent = useCallback(() => {
    const probs = normalizeWeights(active.options.map((o) => o.weight));
    const percents = percentRoundTo100(probs.map((p) => p * 100));
    updateOptions((opts) => opts.map((o, i) => ({ ...o, weight: percents[i] })));
    patchActive({ settings: { ...active.settings, inputMode: "percent" } });
  }, [active.options, active.settings, updateOptions, patchActive]);

  const toWeightMode = useCallback(() => patchActive({ settings: { ...active.settings, inputMode: "weight" } }), [active.settings, patchActive]);

  // --------------- 確率とCDF
  const { probs, cdf, sumDisplay, invalidReason } = useMemo(() => {
    const mode = active.settings.inputMode;
    const weights = active.options.map((o) => Math.max(0, safeNumber(o.weight)));

    let probs = normalizeWeights(weights);
    let displaySum = 100;
    let invalid: string | null = null;

    if (mode === "percent") {
      const total = weights.reduce((a, b) => a + b, 0);
      displaySum = total;
      if (Math.abs(total - 100) > 1e-6) invalid = `合計が100%ではありません（現在: ${total.toFixed(2)}%）`;
      probs = total > 0 ? weights.map((w) => w / total) : weights.map(() => 0);
    }

    return { probs, cdf: buildCdf(probs), sumDisplay: displaySum, invalidReason: invalid };
  }, [active.options, active.settings.inputMode]);

  // --------------- 抽選・演出
  const [spinning, setSpinning] = useState(false);
  const [lastResultId, setLastResultId] = useState<string | null>(null);
  const [spinProgress, setSpinProgress] = useState(0);
  const spinDurationRef = useRef<number>(active.settings.spinsSec * 1000);
  const targetAngleRef = useRef<number>(0);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    spinDurationRef.current = active.settings.spinsSec * 1000;
  }, [active.settings.spinsSec]);

  const resultOption = useMemo(() => active.options.find((o) => o.id === lastResultId) || null, [active, lastResultId]);

  const haptic = useHaptics(active.settings.haptics);
  const { playClick, playFanfare } = useAudio(active.settings.sound);

  const doDraw = useCallback(() => {
    if (active.options.length === 0) return;
    if (active.settings.inputMode === "percent" && Math.abs(sumDisplay - 100) > 1e-6) return;

    const randomAngleDeg = Math.floor(getCryptoRandom() * 36000) / 100; // 0.01度精度
    const spinRounds = 5 + Math.floor(getCryptoRandom() * 3); // 5,6,7周

    targetAngleRef.current = 360 * spinRounds + randomAngleDeg;

    setSpinning(true);
    setLastResultId(null);
    playClick();
    haptic.light();

    const startTs = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTs) / spinDurationRef.current);
      setSpinProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else {
        const finalRot = targetAngleRef.current % 360;
        const theta = (360 - finalRot + 360) % 360;
        const rUnit = theta / 360; // [0,1)
        const idx = pickIndexByCdf(cdf, rUnit);
        const winner = active.options[idx];

        setSpinning(false);
        setLastResultId(winner?.id ?? null);
        playFanfare();
        haptic.success();
        const h: HistoryItem = {
          id: uid(),
          projectId: active.id,
          drawnAt: now(),
          resultOptionId: winner?.id ?? "",
          randSnapshot: [randomAngleDeg],
        };
        setProjects((prev) =>
          prev.map((pr) => (pr.id === active.id ? { ...pr, history: [h, ...pr.history].slice(0, 5000), updatedAt: now() } : pr))
        );
      }
    };
    requestAnimationFrame(tick);
  }, [active, cdf, sumDisplay, playClick, playFanfare, haptic]);

  const onStartPress = useCallback(() => {
    holdTimerRef.current = window.setTimeout(() => {
      spinDurationRef.current = Math.max(600, active.settings.spinsSec * 1000 * 0.35);
    }, active.settings.quickHoldMs) as unknown as number;
  }, [active.settings.quickHoldMs, active.settings.spinsSec]);

  const onStartRelease = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    spinDurationRef.current = active.settings.spinsSec * 1000;
    doDraw();
  }, [active.settings.spinsSec, doDraw]);

  // --------------- シミュレーション
  const [simN, setSimN] = useState(10000);
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState<{ counts: number[]; pval: number; rmsePct: number } | null>(null);

  const runSimulation = useCallback(async () => {
    if (active.options.length === 0) return;
    setSimRunning(true);
    await new Promise((r) => setTimeout(r, 16));
    const counts = Array(active.options.length).fill(0);
    const cdfLocal = buildCdf(probs);
    for (let i = 0; i < simN; i++) {
      const angle = getCryptoRandom() * 360;
      const rUnit = ((360 - (angle % 360)) % 360) / 360;
      counts[pickIndexByCdf(cdfLocal, rUnit)]++;
    }
    const expected = probs.map((p) => p * simN);
    const { p: pval } = chiSquarePValue(counts, expected);
    const actualPct = counts.map((c) => (c / simN) * 100);
    const expectedPct = probs.map((p) => p * 100);
    setSimResult({ counts, pval, rmsePct: rmse(actualPct, expectedPct) });
    setSimRunning(false);
  }, [active.options.length, probs, simN]);

  const highContrast = active.settings.highContrast;

  // --------------- UI
  return (
    <div className={`min-h-screen ${highContrast ? "bg-black text-white" : "bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900"}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <HeaderBar
          projects={projects}
          activeId={activeId}
          setActiveId={setActiveId}
          onCreateProject={() => setProjects((prev) => [DEFAULT_PROJECT(), ...prev])}
          onDeleteProject={deleteProject}
          onToggleSound={() => patchActive({ settings: { ...active.settings, sound: !active.settings.sound } })}
          onToggleHaptics={() => patchActive({ settings: { ...active.settings, haptics: !active.settings.haptics } })}
          onToggleHighContrast={() => patchActive({ settings: { ...active.settings, highContrast: !active.settings.highContrast } })}
          sound={active.settings.sound}
          haptics={active.settings.haptics}
          highContrastEnabled={active.settings.highContrast}
        />

        <Tabs defaultValue="edit">
          <TabsList className="grid grid-cols-3 md:w-[520px]">
            <TabsTrigger value="edit">編集</TabsTrigger>
            <TabsTrigger value="draw">抽選</TabsTrigger>
            <TabsTrigger value="stats">履歴/統計</TabsTrigger>
          </TabsList>

          {/* 編集 */}
          <TabsContent value="edit" className="mt-4">
            <EditTab
              active={active}
              probs={probs}
              cdf={cdf}
              sumDisplay={sumDisplay}
              invalidReason={invalidReason}
              updateOptions={updateOptions}
              addOption={addOption}
              removeOption={removeOption}
              toWeightMode={toWeightMode}
              normalizePercent={normalizePercent}
              equalize={equalize}
              patchActive={patchActive}
              highContrast={highContrast}
              progress={spinProgress}
              targetAngle={targetAngleRef.current}
            />
          </TabsContent>

          {/* 抽選 */}
          <TabsContent value="draw" className="mt-4">
            <DrawTab
              active={active}
              probs={probs}
              cdf={cdf}
              spinProgress={spinProgress}
              spinning={spinning}
              invalidReason={invalidReason}
              onStartPress={onStartPress}
              onStartRelease={onStartRelease}
              doDraw={doDraw}
              clearResult={() => setLastResultId(null)}
              resultOption={resultOption}
              simN={simN}
              setSimN={setSimN}
              simRunning={simRunning}
              simResult={simResult}
              runSimulation={runSimulation}
              highContrast={highContrast}
              targetAngle={targetAngleRef.current}
            />
          </TabsContent>

          {/* 履歴/統計 */}
          <TabsContent value="stats" className="mt-4">
            <StatsTab active={active} patchActive={patchActive} />
          </TabsContent>
        </Tabs>

        <footer className="mt-8 text-center text-xs opacity-60">
          <div>乱数: Web Crypto / 停止角から判定 / CDF+二分探索 / ローカル保存</div>
        </footer>
      </div>
    </div>
  );
}
