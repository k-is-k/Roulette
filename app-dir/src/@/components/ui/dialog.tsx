import React, { createContext, useContext, useState } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogCtx = createContext<Ctx | null>(null);

export const Dialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>;
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactElement }> = ({ children }) => {
  const ctx = useContext(DialogCtx)!;
  return React.cloneElement(children, { onClick: () => ctx.setOpen(true) });
};

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  const ctx = useContext(DialogCtx)!;
  if (!ctx.open) return null;
  return (
    <div role="dialog" {...rest}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => <div {...props} />;
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => <h3 {...props} />;

export default Dialog;

