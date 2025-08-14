import React, { createContext, useContext, useState } from "react";

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = createContext<TabsCtx | null>(null);

export const Tabs: React.FC<{ defaultValue: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ defaultValue, children, ...rest }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <Ctx.Provider value={{ value, setValue }}>
      <div {...rest}>{children}</div>
    </Ctx.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => (
  <div
    className={[
      "inline-grid gap-1 rounded-lg bg-white/60 p-1 border border-slate-200 shadow-sm",
      className,
    ].join(" ")}
    {...rest}
  >
    {children}
  </div>
);

export const TabsTrigger: React.FC<{ value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ value, children, className = "", ...rest }) => {
  const ctx = useContext(Ctx)!;
  const active = ctx.value === value;
  const base = "px-3 py-1.5 text-sm rounded-md transition";
  const style = active
    ? "bg-indigo-600 text-white shadow"
    : "text-slate-700 hover:bg-white";
  return (
    <button onClick={() => ctx.setValue(value)} aria-pressed={active} className={[base, style, className].join(" ")} {...rest}>
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string } & React.HTMLAttributes<HTMLDivElement>> = ({ value, children, ...rest }) => {
  const ctx = useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div {...rest}>{children}</div>;
};

export default Tabs;
