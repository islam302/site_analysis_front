import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { JobStatus } from "@/types/api";

interface Config {
  label: string;
  className: string;
  icon: React.ReactNode;
  spin?: boolean;
}

const MAP: Record<JobStatus, Config> = {
  pending: {
    label: "Pending",
    className: "text-ink-muted bg-muted-strong border-hairline",
    icon: <CircleDashed size={13} strokeWidth={1.75} />,
  },
  processing: {
    label: "Processing",
    className: "text-info bg-info-bg border-info-border",
    icon: <Loader2 size={13} strokeWidth={1.75} />,
    spin: true,
  },
  completed: {
    label: "Completed",
    className: "text-success bg-success-bg border-success-border",
    icon: <CheckCircle2 size={13} strokeWidth={1.75} />,
  },
  failed: {
    label: "Failed",
    className: "text-danger bg-danger-bg border-danger-border",
    icon: <XCircle size={13} strokeWidth={1.75} />,
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const cfg = MAP[status] ?? MAP.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-2xs font-medium",
        cfg.className,
        className,
      )}
    >
      <span className={cn("flex", cfg.spin && "animate-spin")}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
