import React from "react";

export const Card = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={[
      "rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm",
      className,
    ].join(" ")}
    {...props}
  />
);
export const CardHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={["px-4 py-3 md:px-5", className].join(" ")} {...props} />
);
export const CardTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={["font-semibold", className].join(" ")} {...props} />
);
export const CardContent = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={["px-4 py-4 md:px-5 md:py-5", className].join(" ")} {...props} />
);

export default Card;
