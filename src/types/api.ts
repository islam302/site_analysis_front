// ---------------------------------------------------------------------------
// API types for the Full Report (async website-analysis PDF) endpoint.
// These mirror FULL_REPORT_API.md exactly — nothing here is mocked.
// ---------------------------------------------------------------------------

/** Shared job lifecycle status (used by the status badge + full report). */
export type JobStatus = "pending" | "processing" | "completed" | "failed";

// --- Full Report (async PDF) -------------------------------------------------

export type FullReportStatus = JobStatus;

export type FullReportStrategy = "mobile" | "desktop";
export type FullReportLang = "en" | "ar";

export type ToolStatus = "ok" | "failed" | "skipped" | "pending" | string;

export interface FullReportToolsStatus {
  pagespeed?: ToolStatus;
  gtmetrix?: ToolStatus;
  accessibility?: ToolStatus;
  ssl?: ToolStatus;
  links?: ToolStatus;
  structured_data?: ToolStatus;
  [tool: string]: ToolStatus | undefined;
}

export interface FullReportStartRequest {
  url: string;
  strategy?: FullReportStrategy;
  lang?: FullReportLang;
}

export interface FullReportStartResponse {
  id: string;
  status: FullReportStatus;
  status_url: string;
}

export interface FullReportJob {
  id: string;
  url: string;
  strategy: FullReportStrategy;
  lang: FullReportLang;
  status: FullReportStatus;
  tools_status: FullReportToolsStatus;
  download_url: string | null;
  error_message: string;
  created_at: string;
  updated_at: string;
}

// --- Error envelope ----------------------------------------------------------

/**
 * Normalized shape we surface in the UI. The backend uses a couple of
 * envelopes ({ error, extra } and DRF's field-error dicts); `normalizeApiError`
 * flattens both into this.
 */
export interface NormalizedApiError {
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  retryAfter?: number; // seconds, from 429 responses
  raw?: unknown;
}
