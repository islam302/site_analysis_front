import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { NormalizedApiError } from "@/types/api";

/**
 * Rate-limit (429) surface. The validator is throttled at 10/min and 200/day;
 * we show the API message plus a live countdown from the Retry-After hint.
 */
export function RateLimitAlert({
  error,
  onRetry,
}: {
  error: NormalizedApiError;
  onRetry?: () => void;
}) {
  const [remaining, setRemaining] = useState<number>(error.retryAfter ?? 0);

  useEffect(() => {
    setRemaining(error.retryAfter ?? 0);
  }, [error]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(t);
  }, [remaining]);

  const canRetry = remaining <= 0;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded border border-warn-border bg-warn-bg px-3 py-2.5"
    >
      <span className="mt-0.5 shrink-0 text-warn">
        <Timer size={16} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-warn">Rate limit reached</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {error.message || "You've hit the validation rate limit."}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          Limits: <span className="tabular-nums">10</span> requests/min ·{" "}
          <span className="tabular-nums">200</span>/day.
          {error.retryAfter != null && (
            <>
              {" "}
              {remaining > 0 ? (
                <>
                  Retry in{" "}
                  <span className="font-medium tabular-nums text-warn">
                    {remaining}s
                  </span>
                  .
                </>
              ) : (
                <span className="font-medium text-ink-muted">
                  You can retry now.
                </span>
              )}
            </>
          )}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          disabled={!canRetry}
          className="shrink-0"
        >
          {canRetry ? "Retry" : `Wait ${remaining}s`}
        </Button>
      )}
    </div>
  );
}
