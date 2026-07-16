import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

type Tone = "error" | "warning" | "info";

const TONES: Record<
  Tone,
  { border: string; bg: string; icon: React.ReactNode; text: string }
> = {
  error: {
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-danger",
    icon: <XCircle size={16} strokeWidth={1.75} />,
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-warn",
    icon: <AlertTriangle size={16} strokeWidth={1.75} />,
  },
  info: {
    border: "border-sky-200",
    bg: "bg-sky-50",
    text: "text-info",
    icon: <Info size={16} strokeWidth={1.75} />,
  },
};

export function Alert({
  tone = "error",
  title,
  children,
  onRetry,
  retrying,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}) {
  const cfg = TONES[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded border px-3 py-2.5",
        cfg.border,
        cfg.bg,
        className,
      )}
    >
      <span className={cn("mt-0.5 shrink-0", cfg.text)}>{cfg.icon}</span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className={cn("text-sm font-medium", cfg.text)}>{title}</p>
        )}
        {children && (
          <div className="mt-0.5 break-words text-sm text-ink-muted">
            {children}
          </div>
        )}
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          loading={retrying}
          className="shrink-0"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
