import React from "react";

type Props = {
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Switch: React.FC<Props> = ({ checked, onCheckedChange, ...rest }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...rest}
    />
  );
};

export default Switch;

