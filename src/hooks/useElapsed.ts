import { useEffect, useState } from "react";

/**
 * Live elapsed time (ms) since `sinceIso`, ticking every second while `active`.
 * Freezes once inactive so the final duration stays on screen.
 */
export function useElapsed(sinceIso: string | undefined, active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [active, sinceIso]);

  if (!sinceIso) return 0;
  const start = new Date(sinceIso).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, now - start);
}

/** Format a millisecond duration as m:ss (or s only under a minute). */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
