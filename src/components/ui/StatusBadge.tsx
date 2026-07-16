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
    className: "text-ink-muted bg-stone-100 border-stone-200",
    icon: <CircleDashed size={13} strokeWidth={1.75} />,
  },
  processing: {
    label: "Processing",
    className: "text-info bg-sky-50 border-sky-200",
    icon: <Loader2 size={13} strokeWidth={1.75} />,
    spin: true,
  },
  completed: {
    label: "Completed",
    className: "text-success bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={13} strokeWidth={1.75} />,
  },
  failed: {
    label: "Failed",
    className: "text-danger bg-red-50 border-red-200",
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
