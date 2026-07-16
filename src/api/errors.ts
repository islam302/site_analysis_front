import { AxiosError } from "axios";
import type { NormalizedApiError } from "@/types/api";

// The backend uses a couple of error shapes:
//   1. { "error": "Validation failed.", "extra": { "url": ["Enter a valid URL."] } }
//   2. DRF field errors:  { "url": ["Enter a valid URL."] }  or { "detail": "..." }
// This flattens both into a single, UI-friendly NormalizedApiError.

function collectFieldErrors(
  obj: Record<string, unknown>,
): Record<string, string[]> | undefined {
  const out: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === "detail" || key === "error" || key === "extra") continue;
    if (Array.isArray(val)) {
      out[key] = val.map((v) => String(v));
    } else if (typeof val === "string") {
      out[key] = [val];
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function firstFieldMessage(
  fieldErrors: Record<string, string[]> | undefined,
): string | undefined {
  if (!fieldErrors) return undefined;
  for (const messages of Object.values(fieldErrors)) {
    if (messages.length) return messages[0];
  }
  return undefined;
}

export function normalizeApiError(err: unknown): NormalizedApiError {
  // Non-axios / thrown errors
  if (!(err instanceof AxiosError)) {
    if (err instanceof Error) return { message: err.message, raw: err };
    return { message: "Something went wrong.", raw: err };
  }

  const status = err.response?.status;

  // Network / no response
  if (!err.response) {
    const offline =
      err.code === "ERR_NETWORK" || err.message === "Network Error";
    return {
      status,
      message: offline
        ? "Could not reach the API. Check that the backend is running and the base URL is correct."
        : err.message || "Request failed.",
      raw: err,
    };
  }

  const data = err.response.data as unknown;

  // Rate limit hint
  let retryAfter: number | undefined;
  const retryHeader =
    err.response.headers?.["retry-after"] ??
    err.response.headers?.["Retry-After"];
  if (retryHeader != null) {
    const parsed = Number(retryHeader);
    if (!Number.isNaN(parsed)) retryAfter = parsed;
  }

  let message = "";
  let fieldErrors: Record<string, string[]> | undefined;

  if (data && typeof data === "object") {
    const rec = data as Record<string, unknown>;

    // Envelope form: { error, extra }
    if (typeof rec.error === "string") message = rec.error;
    if (rec.extra && typeof rec.extra === "object") {
      fieldErrors = collectFieldErrors(rec.extra as Record<string, unknown>);
    }

    // DRF "detail"
    if (!message && typeof rec.detail === "string") message = rec.detail;

    // DRF field errors at top level
    if (!fieldErrors) fieldErrors = collectFieldErrors(rec);

    // If we still have no top-line message, use the first field error.
    if (!message) {
      const fm = firstFieldMessage(fieldErrors);
      if (fm) message = fm;
    }
  } else if (typeof data === "string" && data.trim()) {
    message = data;
  }

  if (!message) {
    if (status === 429) message = "Rate limit reached. Please retry shortly.";
    else if (status === 401) message = "Your session has expired.";
    else if (status === 403) message = "You don't have access to this resource.";
    else if (status === 404) message = "Not found.";
    else if (status && status >= 500) message = "The server ran into an error.";
    else message = err.message || "Request failed.";
  }

  return { status, message, fieldErrors, retryAfter, raw: data };
}
