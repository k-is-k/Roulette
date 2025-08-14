import React from "react";

type Props = {
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Switch: React.FC<Props> = ({ checked, onCheckedChange, className = "", ...rest }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={["h-5 w-5 accent-indigo-600", className].join(" ")}
      {...rest}
    />
  );
};

export default Switch;
