import React, { createContext, useContext, useState } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const MenuCtx = createContext<Ctx | null>(null);

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <MenuCtx.Provider value={{ open, setOpen }}>{children}</MenuCtx.Provider>;
};

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactElement }> = ({ children }) => {
  const ctx = useContext(MenuCtx)!;
  return React.cloneElement(children, {
    onClick: () => ctx.setOpen(!ctx.open),
    "aria-expanded": ctx.open,
  });
};

export const DropdownMenuContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  const ctx = useContext(MenuCtx)!;
  if (!ctx.open) return null;
  return <div {...rest}>{children}</div>;
};

export const DropdownMenuItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
  <button {...rest}>{children}</button>
);

export default DropdownMenu;

