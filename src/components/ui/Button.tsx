import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-1.5 rounded font-medium " +
  "transition-colors select-none disabled:cursor-not-allowed disabled:opacity-55 " +
  "border focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover",
  secondary:
    "bg-surface text-ink border-hairline hover:bg-stone-50",
  ghost:
    "bg-transparent text-ink-muted border-transparent hover:bg-stone-100 hover:text-ink",
  danger:
    "bg-white text-danger border-hairline hover:bg-red-50 hover:border-red-200",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
