import React, { memo, useCallback } from "react";
import { easeOutQuint } from "../utils";
import type { Option } from "../types";

type Props = {
  options: Option[];
  probs: number[];
  cdf: number[];
  progress: number;
  spinning: boolean;
  targetAngle: number;
  highContrast: boolean;
};

const Roulette = memo(function Roulette({
  options,
  probs,
  cdf,
  progress,
  spinning,
  targetAngle,
  highContrast,
}: Props) {
  const rot = (easeOutQuint(progress) * (targetAngle || 0)) % 360;
  const sepColor = highContrast ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.95)";
  const rimColor = highContrast ? "#333" : "#e5e7eb";
  const size = 460;
  const cx = size / 2,
    cy = size / 2;
  const R = size * 0.48;
  const rInner = size * 0.02;

  const toXY = useCallback(
    (radius: number, angleDeg: number) => {
      const a = ((angleDeg - 90) * Math.PI) / 180;
      return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    },
    [cx, cy]
  );

  const sectorPath = useCallback(
    (startDeg: number, endDeg: number) => {
      const large = endDeg - startDeg > 180 ? 1 : 0;
      const s = toXY(R, endDeg),
        e = toXY(R, startDeg);
      return `M ${cx} ${cy} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 0 ${e.x} ${e.y} Z`;
    },
    [R, cx, cy, toXY]
  );

  return (
    <div className="relative w-full h-full select-none">
      <div
        className="absolute inset-0 rounded-full shadow-xl flex items-center justify-center"
        style={{ background: highContrast ? "#111" : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.7))" }}
      >
        <div className="relative w-[92%] h-[92%]" style={{ transform: `rotate(${rot}deg)`, transition: spinning ? "none" : "transform 0.4s ease" }}>
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
            <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke={rimColor} strokeWidth={6} />
            {options.map((o, i) => {
              const p = probs[i] ?? 0;
              if (p <= 0) return null;
              const start = (i === 0 ? 0 : cdf[i - 1]) * 360;
              const end = cdf[i] * 360;
              return <path key={o.id} d={sectorPath(start, end)} fill={o.color || "#999"} stroke={sepColor} strokeWidth={4} strokeLinejoin="round" />;
            })}
            <circle cx={cx} cy={cy} r={rInner * 3} fill={highContrast ? "#111" : "#fff"} stroke={sepColor} strokeWidth={3} />
            {options.map((o, i) => {
              const p = probs[i] ?? 0;
              if (p <= 0) return null;
              const start = (i === 0 ? 0 : cdf[i - 1]) * 360;
              const end = cdf[i] * 360;
              const mid = (start + end) / 2;
              const pos = toXY(R * 0.7, mid);
              return (
                <g key={o.id + "-lbl"} transform={`translate(${pos.x},${pos.y}) rotate(${mid})`}>
                  <foreignObject x={-40} y={-26} width={80} height={52}>
                    <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center">
                      <div className="text-lg leading-none">{o.icon || ""}</div>
                      <div className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.06)", color: highContrast ? "#fff" : "#111" }}>
                        {o.label}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
        {/* pin */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent"
          style={{ borderBottomColor: highContrast ? "white" : "#111" }}
        />
      </div>
    </div>
  );
});

export default Roulette;
