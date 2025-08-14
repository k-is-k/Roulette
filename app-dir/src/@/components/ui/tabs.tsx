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

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export const TabsTrigger: React.FC<{ value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ value, children, ...rest }) => {
  const ctx = useContext(Ctx)!;
  return (
    <button onClick={() => ctx.setValue(value)} aria-pressed={ctx.value === value} {...rest}>
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

