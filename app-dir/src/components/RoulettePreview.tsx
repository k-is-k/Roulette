import React from "react";
import Roulette from "./Roulette";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import type { Option } from "../types";

type Props = {
  options: Option[];
  probs: number[];
  cdf: number[];
  progress: number;
  targetAngle: number;
  preview: boolean;
  setPreview: (v: boolean) => void;
  highContrast: boolean;
};

export default function RoulettePreview({
  options,
  probs,
  cdf,
  progress,
  targetAngle,
  preview,
  setPreview,
  highContrast,
}: Props) {
  return (
    <div>
      <div className="w-full aspect-square">
        <Roulette options={options} probs={probs} cdf={cdf} progress={preview ? progress : 0} spinning={preview} targetAngle={targetAngle} highContrast={highContrast} />
      </div>
      <div className="mt-2">
        <Button variant="outline" size="sm" onClick={() => setPreview(!preview)}>
          {preview ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {preview ? "停止" : "再生"}
        </Button>
      </div>
    </div>
  );
}
