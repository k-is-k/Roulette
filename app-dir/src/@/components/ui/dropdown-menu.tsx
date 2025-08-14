import React, { createContext, useContext, useState } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const MenuCtx = createContext<Ctx | null>(null);

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <MenuCtx.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></MenuCtx.Provider>;
};

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactElement }> = ({ children }) => {
  const ctx = useContext(MenuCtx)!;
  return React.cloneElement(children, {
    onClick: () => ctx.setOpen(!ctx.open),
    "aria-expanded": ctx.open,
  });
};

export const DropdownMenuContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => {
  const ctx = useContext(MenuCtx)!;
  if (!ctx.open) return null;
  return (
    <div className={["absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white shadow-lg p-1 z-50", className].join(" ")} {...rest}>
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...rest }) => (
  <button className={["w-full text-left px-3 py-2 text-sm rounded hover:bg-slate-100", className].join(" ")} {...rest}>{children}</button>
);

export default DropdownMenu;
