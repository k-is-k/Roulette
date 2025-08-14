import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import RoulettePreview from "../../components/RoulettePreview";
import type { Project, Option } from "../../types";
import { safeNumber, randomNiceColor, uid } from "../../utils";
import { Equal, Plus, Trash2, Upload } from "lucide-react";

type Props = {
  active: Project;
  probs: number[];
  cdf: number[];
  sumDisplay: number;
  invalidReason: string | null;
  updateOptions: (fn: (opts: Option[]) => Option[]) => void;
  addOption: () => void;
  removeOption: (id: string) => void;
  toWeightMode: () => void;
  normalizePercent: () => void;
  equalize: () => void;
  patchActive: (patch: Partial<Project>) => void;
  highContrast: boolean;
  progress: number;
  targetAngle: number;
};

export default function EditTab({
  active,
  probs,
  cdf,
  sumDisplay,
  invalidReason,
  updateOptions,
  addOption,
  removeOption,
  toWeightMode,
  normalizePercent,
  equalize,
  patchActive,
  highContrast,
  progress,
  targetAngle,
}: Props) {
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseLine = (line: string) =>
    line
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((s) => s.replace(/^"|"$/g, "").replace(/""/g, '"').trim());

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = (await file.text()).replace(/\uFEFF/g, "");
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (!lines.length) return;
    const header = parseLine(lines[0].toLowerCase());
    const keys = ["label", "weight", "color", "icon", "description"];
    const hasHeader = header.some((h) => keys.includes(h));
    const idx = {
      label: hasHeader ? header.indexOf("label") : 0,
      weight: hasHeader ? header.indexOf("weight") : 1,
      color: hasHeader ? header.indexOf("color") : 2,
      icon: hasHeader ? header.indexOf("icon") : 3,
      description: hasHeader ? header.indexOf("description") : 4,
    };
    const start = hasHeader ? 1 : 0;
    const opts: Option[] = [];
    for (let i = start; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const label = cols[idx.label]?.trim();
      if (!label) continue;
      const weight = safeNumber(cols[idx.weight], 1);
      const color = cols[idx.color] || randomNiceColor();
      const icon = cols[idx.icon] || "";
      const description = cols[idx.description] || "";
      opts.push({ id: uid(), label, weight, color, icon, description });
    }
    if (opts.length) updateOptions((prev) => [...prev, ...opts]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="grid md:grid-cols-5 gap-4">
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{active.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="proj">プロジェクト名</Label>
              <Input id="proj" value={active.name} onChange={(e) => patchActive({ name: e.target.value })} />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label>入力モード</Label>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant={active.settings.inputMode === "weight" ? "default" : "outline"} onClick={toWeightMode}>
                    重み
                  </Button>
                  <Button size="sm" variant={active.settings.inputMode === "percent" ? "default" : "outline"} onClick={normalizePercent}>
                    ％
                  </Button>
                  <Button size="sm" variant="outline" onClick={equalize}>
                    <Equal className="w-4 h-4 mr-1" />均等
                  </Button>
                </div>
              </div>
              <div className="text-sm opacity-70">
                {active.settings.inputMode === "percent" ? (
                  <>
                    合計: <span className={Math.abs(sumDisplay - 100) > 1e-6 ? "text-red-500 font-semibold" : ""}>{sumDisplay.toFixed(2)}%</span>
                  </>
                ) : (
                  <>重み総和: {active.options.reduce((a, b) => a + safeNumber(b.weight), 0).toFixed(2)}</>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {active.options.map((o, idx) => (
              <div key={o.id} className="grid grid-cols-12 items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-white/5 shadow-sm">
                <div className="col-span-4 md:col-span-3">
                  <Input aria-label="選択肢名" value={o.label} onChange={(e) => updateOptions((opts) => opts.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)))} />
                </div>
                <div className="col-span-2">
                  <Input aria-label="色" type="color" value={o.color || "#888888"} onChange={(e) => updateOptions((opts) => opts.map((x) => (x.id === o.id ? { ...x, color: e.target.value } : x)))} />
                </div>
                <div className="col-span-2">
                  <Input aria-label="アイコン" placeholder="🎁" value={o.icon || ""} onChange={(e) => updateOptions((opts) => opts.map((x) => (x.id === o.id ? { ...x, icon: e.target.value } : x)))} />
                </div>
                <div className="col-span-3 md:col-span-3 flex items-center gap-2">
                  <Input
                    aria-label="重み/％"
                    type="number"
                    step="0.01"
                    min={0}
                    value={o.weight}
                    onChange={(e) => updateOptions((opts) => opts.map((x) => (x.id === o.id ? { ...x, weight: safeNumber(e.target.value, 0) } : x)))}
                  />
                  <span className="text-xs opacity-60">{active.settings.inputMode === "percent" ? "%" : "w"}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" aria-label="削除" onClick={() => removeOption(o.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {idx === active.options.length - 1 && (
                  <div className="col-span-12">
                    <Textarea
                      placeholder="説明（任意）"
                      value={o.description || ""}
                      onChange={(e) => updateOptions((opts) => opts.map((x) => (x.id === o.id ? { ...x, description: e.target.value } : x)))}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={addOption}>
                <Plus className="w-4 h-4 mr-1" />選択肢を追加
              </Button>
              <div>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" />CSVインポート
                </Button>
              </div>
            </div>
          </div>

          {invalidReason && <div className="text-sm text-red-600">{invalidReason}</div>}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">演出プレビュー</CardTitle>
        </CardHeader>
        <CardContent>
          <RoulettePreview
            options={active.options}
            probs={probs}
            cdf={cdf}
            progress={progress}
            targetAngle={targetAngle}
            preview={preview}
            setPreview={setPreview}
            highContrast={highContrast}
          />
          <div className="mt-3 space-y-2">
            <Label>演出時間（秒）</Label>
            <Slider value={[active.settings.spinsSec]} min={0.8} max={5} step={0.1} onValueChange={(v) => patchActive({ settings: { ...active.settings, spinsSec: v[0] } })} />
            <div className="flex items-center gap-3 text-sm opacity-70">
              <Switch checked={active.settings.sound} onCheckedChange={(v) => patchActive({ settings: { ...active.settings, sound: v } })} /> サウンド
            </div>
            <div className="flex items-center gap-3 text-sm opacity-70">
              <Switch checked={active.settings.haptics} onCheckedChange={(v) => patchActive({ settings: { ...active.settings, haptics: v } })} /> 触覚
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
