import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "inverse" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 active:scale-95 shadow-md",
  inverse:
    "bg-inverse-surface text-inverse-on-surface hover:opacity-90 active:scale-95 shadow-md",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-label-md text-label-md transition-all disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
