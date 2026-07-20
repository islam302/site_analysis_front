// Central place for runtime config derived from the Vite environment.

// Relative by default → served through the dev proxy (vite.config.ts) locally
// and Vercel rewrites in production. Same-origin, so no CORS.
const DEFAULT_BASE_URL = "/site-analysis/api/v1";

function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw ?? DEFAULT_BASE_URL).trim() || DEFAULT_BASE_URL;
  // Strip a single trailing slash so we can join paths predictably.
  return value.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

/**
 * A relative base means requests flow through the proxy/rewrite, so absolute
 * backend URLs (e.g. the PDF download_url) should be rewritten to same-origin
 * paths too. See `throughProxy`.
 */
export const API_BASE_URL_IS_PROXIED = !/^https?:\/\//i.test(API_BASE_URL);
