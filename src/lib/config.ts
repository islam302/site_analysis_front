// Central place for runtime config derived from the Vite environment.

// Relative by default → served through the Vite dev proxy (see vite.config.ts),
// which forwards to the backend. Same-origin, so no CORS.
const DEFAULT_BASE_URL = "/api/v1";

function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw ?? DEFAULT_BASE_URL).trim() || DEFAULT_BASE_URL;
  // Strip a single trailing slash so we can join paths predictably.
  return value.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

/** Whether the env var was explicitly provided (vs. falling back to default). */
export const API_BASE_URL_IS_DEFAULT =
  !import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL.trim() === "";

/** Relative base means requests go through the dev proxy (no CORS). */
export const API_BASE_URL_IS_PROXIED = !/^https?:\/\//i.test(API_BASE_URL);

/** Display-only: where the proxy forwards, when known. */
export const API_PROXY_TARGET =
  import.meta.env.VITE_API_PROXY_TARGET?.trim() || "http://localhost:8000";

export const APP_MODE = import.meta.env.MODE;
