import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...props },
  ref
) {
  const base =
    "h-9 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500";
  return <input ref={ref} className={[base, className].join(" ")} {...props} />;
});

export default Input;
