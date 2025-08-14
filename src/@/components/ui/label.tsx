import React from "react";

export const Label = ({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={["block text-sm font-medium text-slate-700 mb-1", className].join(" ")} {...props} />
);

export default Label;
