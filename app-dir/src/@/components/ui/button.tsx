import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
};

const base =
  "inline-flex items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
  outline:
    "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 shadow-sm",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-9 w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", size = "md", className = "", ...rest },
  ref
) {
  const cls = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
  return <button ref={ref} className={cls} {...rest} />;
});

export default Button;
