import React from "react";

export const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", style, ...rest }) => (
  <div className={["overflow-auto", className].join(" ")} style={{ ...(style || {}) }} {...rest}>
    {children}
  </div>
);

export default ScrollArea;
