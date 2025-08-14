import React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className = "", ...props },
  ref
) {
  return <textarea ref={ref} className={className} {...props} />;
});

export default Textarea;

