import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", size = "md", className = "", ...rest },
  ref
) {
  return <button ref={ref} className={className} {...rest} />;
});

export default Button;

