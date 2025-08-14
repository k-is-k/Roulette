import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Roulette from "../../components/Roulette";
import type { Option, Project } from "../../types";
import { safeNumber } from "../../utils";
import { Loader2, Play, RefreshCcw, Shuffle, SquareChartGantt } from "lucide-react";
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

type SimResult = { counts: number[]; pval: number; rmsePct: number } | null;

type Props = {
  active: Project;
  probs: number[];
  cdf: number[];
  spinProgress: number;
  spinning: boolean;
  invalidReason: string | null;
  onStartPress: () => void;
  onStartRelease: () => void;
  doDraw: () => void;
  clearResult: () => void;
  resultOption: Option | null;
  simN: number;
  setSimN: (n: number) => void;
  simRunning: boolean;
  simResult: SimResult;
  runSimulation: () => void;
  highContrast: boolean;
  targetAngle: number;
};

export default function DrawTab({
  active,
  probs,
  cdf,
  spinProgress,
  spinning,
  invalidReason,
  onStartPress,
  onStartRelease,
  doDraw,
  clearResult,
  resultOption,
  simN,
  setSimN,
  simRunning,
  simResult,
  runSimulation,
  highContrast,
  targetAngle,
}: Props) {
  return (
    <div className="grid md:grid-cols-5 gap-4 items-stretch">
      <Card className="md:col-span-3 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">抽選</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl aspect-square">
            <Roulette
              options={active.options}
              probs={probs}
              cdf={cdf}
              progress={spinProgress}
              spinning={spinning}
              targetAngle={targetAngle}
              highContrast={highContrast}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              size="lg"
              className="px-10 text-xl"
              disabled={spinning || !!invalidReason}
              onMouseDown={onStartPress}
              onMouseUp={onStartRelease}
              onTouchStart={onStartPress}
              onTouchEnd={onStartRelease}
              aria-label="抽選開始"
            >
              {spinning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
              スタート
            </Button>
            <Button variant="outline" onClick={clearResult} disabled={spinning}>
              <RefreshCcw className="w-4 h-4 mr-2" />リセット
            </Button>
          </div>

          {resultOption && (
            <div className="mt-6 w-full max-w-md p-4 rounded-2xl shadow-lg bg-white/80 dark:bg-white/5 border flex items-center gap-3" role="status" aria-live="polite">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: resultOption.color }}>
                {resultOption.icon || "🎯"}
              </div>
              <div className="flex-1">
                <div className="text-sm opacity-70">結果</div>
                <div className="text-2xl font-bold">{resultOption.label}</div>
              </div>
              <Button onClick={doDraw} disabled={spinning}>
                <Shuffle className="w-4 h-4 mr-2" />もう一回
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">確率 & 操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm opacity-70">期待値（現在の設定）</div>
          <div className="grid grid-cols-2 gap-2">
            {active.options.map((o, i) => (
              <div key={o.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: o.color }} />
                <span className="text-sm">{o.label}</span>
                <span className="ml-auto text-sm font-mono">{(probs[i] * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t">
            <div className="text-sm opacity-70 mb-2">シミュレーション（ローカル）</div>
            <div className="flex items-center gap-2">
              <Input type="number" value={simN} min={100} step={100} onChange={(e) => setSimN(Math.max(100, safeNumber(e.target.value, 100)))} />
              <Button onClick={runSimulation} disabled={simRunning}>
                <SquareChartGantt className="w-4 h-4 mr-2" />
                {simRunning ? "実行中…" : "n回実行"}
              </Button>
            </div>
            {simResult && (
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  RMSE: <b>{simResult.rmsePct.toFixed(3)}%</b> / p値（カイ二乗適合度）: <b>{simResult.pval.toFixed(4)}</b>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RBarChart data={active.options.map((o, i) => ({ name: o.label, 実測: (simResult.counts[i] / simN) * 100, 期待: probs[i] * 100 }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="実測" />
                      <Bar dataKey="期待" />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
