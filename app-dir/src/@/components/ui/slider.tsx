import React from "react";

type Props = {
  value: [number];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (v: [number]) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Slider: React.FC<Props> = ({ value, min, max, step, onValueChange, className = "", ...rest }) => {
  const v = value?.[0] ?? 0;
  return (
    <input
      type="range"
      value={v}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={["w-full accent-indigo-600", className].join(" ")}
      {...rest}
    />
  );
};

export default Slider;
