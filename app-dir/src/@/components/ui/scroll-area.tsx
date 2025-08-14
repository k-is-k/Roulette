import React from "react";

export const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ overflow: "auto", ...(style || {}) }} {...rest}>
    {children}
  </div>
);

export default ScrollArea;

