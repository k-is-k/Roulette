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

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => {
  const ctx = useContext(DialogCtx)!;
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div
        role="dialog"
        className={[
          "relative z-10 w-[90%] max-w-lg rounded-2xl bg-white p-4 md:p-5 border border-slate-200 shadow-xl",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={["mb-2", className].join(" ")} {...props} />
);
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => (
  <h3 className={["text-lg font-semibold", className].join(" ")} {...props} />
);

export default Dialog;
