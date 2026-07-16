import { useState } from "react";
import { ArrowRight, Copy, Check, Server } from "lucide-react";
import {
  API_BASE_URL,
  API_BASE_URL_IS_DEFAULT,
  API_BASE_URL_IS_PROXIED,
  API_PROXY_TARGET,
  APP_MODE,
} from "@/lib/config";
import { cn } from "@/lib/cn";

/**
 * Small env/debug bar shown in the footer — makes it obvious which backend
 * the UI is talking to when testing against different environments.
 */
export function EnvBar() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(API_BASE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 text-2xs text-ink-faint">
        <span className="inline-flex items-center gap-1.5">
          <Server size={12} strokeWidth={1.75} />
          <span className="uppercase tracking-wide">API base</span>
        </span>
        <button
          type="button"
          onClick={copy}
          title="Copy API base URL"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-ink"
        >
          {API_BASE_URL}
          {copied ? (
            <Check size={12} className="text-success" />
          ) : (
            <Copy
              size={12}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </button>
        {API_BASE_URL_IS_PROXIED && (
          <span
            className="inline-flex items-center gap-1 font-mono text-xs text-ink-faint"
            title="Requests go through the Vite dev proxy (same-origin, no CORS)."
          >
            <ArrowRight size={11} strokeWidth={1.75} />
            {API_PROXY_TARGET}
          </span>
        )}
        {API_BASE_URL_IS_DEFAULT && (
          <span
            className={cn(
              "rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5",
              "font-medium text-warn",
            )}
            title="VITE_API_BASE_URL is not set — using the built-in default."
          >
            default
          </span>
        )}
        <span className="ml-auto font-mono uppercase tracking-wide">
          mode:{APP_MODE}
        </span>
      </div>
    </div>
  );
}
