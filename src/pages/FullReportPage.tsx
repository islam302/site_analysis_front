import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Check,
  Download,
  FileText,
  Link2,
  Loader2,
  Minus,
  RotateCcw,
  X,
} from "lucide-react";
import { useFullReportJob, useStartFullReport } from "@/hooks/useFullReport";
import { useElapsed, formatDuration } from "@/hooks/useElapsed";
import { normalizeApiError } from "@/api/errors";
import { checkUrl, formatTimestamp, throughProxy, timeAgo } from "@/lib/format";
import { API_BASE_URL_IS_PROXIED } from "@/lib/config";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RateLimitAlert } from "@/components/RateLimitAlert";
import type {
  FullReportLang,
  FullReportStrategy,
  NormalizedApiError,
  ToolStatus,
} from "@/types/api";

const TOOL_LABELS: Record<string, string> = {
  pagespeed: "PageSpeed",
  gtmetrix: "GTmetrix",
  accessibility: "WAVE accessibility",
  ssl: "SSL / TLS",
  links: "Broken links",
  structured_data: "Structured data",
};

const TOOL_ORDER = [
  "pagespeed",
  "gtmetrix",
  "accessibility",
  "ssl",
  "links",
  "structured_data",
];

/** A tool counts as "resolved" once it's no longer waiting/pending. */
function isResolved(status: ToolStatus | undefined): boolean {
  return Boolean(status) && status !== "pending";
}

export function FullReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportId = searchParams.get("id");

  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<FullReportStrategy>("desktop");
  const [lang, setLang] = useState<FullReportLang>("ar");
  const [clientError, setClientError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null);

  const start = useStartFullReport();
  const jobQuery = useFullReportJob(reportId);
  const job = jobQuery.data;

  const isActive = job?.status === "pending" || job?.status === "processing";
  const isCompleted = job?.status === "completed";
  const isFailed = job?.status === "failed";
  // Between clicking generate and the first status response arriving.
  const isStarting = start.isPending || (Boolean(reportId) && !job && jobQuery.isLoading);
  const busy = isStarting || isActive;

  const liveElapsed = useElapsed(job?.created_at, isActive || isStarting);
  // While running, show a live timer; once finished, show the true run time
  // (created_at → updated_at) so a resumed/already-done job reads correctly.
  const displayDuration =
    job && (isCompleted || isFailed)
      ? Math.max(
          0,
          new Date(job.updated_at).getTime() -
            new Date(job.created_at).getTime(),
        )
      : liveElapsed;

  const submit = async () => {
    setApiError(null);
    const check = checkUrl(url);
    if (!check.ok) {
      setClientError(check.reason ?? "Enter a valid URL.");
      return;
    }
    setClientError(null);

    try {
      const res = await start.mutateAsync({
        url: check.normalized ?? url,
        strategy,
        lang,
      });
      // Persist the id in the URL so a refresh resumes polling (docs: don't lose it).
      setSearchParams({ id: res.id });
    } catch (err) {
      setApiError(normalizeApiError(err));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const reset = () => {
    setSearchParams({});
    setApiError(null);
    start.reset();
  };

  // Always render the full 6-tool checklist so it fills in as results arrive.
  const toolEntries = useMemo(() => {
    const status = job?.tools_status ?? {};
    const known = TOOL_ORDER.map((k) => ({
      key: k,
      status: status[k] as ToolStatus | undefined,
    }));
    const extra = Object.keys(status)
      .filter((k) => !TOOL_ORDER.includes(k))
      .map((k) => ({ key: k, status: status[k] as ToolStatus }));
    return [...known, ...extra];
  }, [job?.tools_status]);

  const resolvedCount = toolEntries.filter((t) => isResolved(t.status)).length;
  const totalTools = toolEntries.length;

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Full website report
          </h1>
          <p className="max-w-2xl text-sm text-ink-muted">
            Generate a combined analysis PDF — PageSpeed, GTmetrix, WAVE
            accessibility, SSL/TLS, broken links, and structured data — with a
            recommendations section, in English or Arabic. The report runs in the
            background and usually takes 20–60 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="relative">
            <Link2
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              inputMode="url"
              aria-label="URL to analyze"
              aria-invalid={clientError ? true : undefined}
              value={url}
              disabled={busy}
              onChange={(e) => {
                setUrl(e.target.value);
                if (clientError) setClientError(null);
              }}
              placeholder="https://example.com"
              className="h-11 w-full rounded-lg border border-hairline bg-surface pl-9 pr-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-accent-ink focus-visible:ring-2 focus-visible:ring-accent-ink/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-ink-muted"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-40">
              <Select
                label="Strategy"
                value={strategy}
                disabled={busy}
                options={[
                  { value: "mobile", label: "Mobile" },
                  { value: "desktop", label: "Desktop" },
                ]}
                onChange={(e) =>
                  setStrategy(e.target.value as FullReportStrategy)
                }
              />
            </div>
            <div className="w-40">
              <Select
                label="Language"
                value={lang}
                disabled={busy}
                options={[
                  { value: "en", label: "English" },
                  { value: "ar", label: "Arabic" },
                ]}
                onChange={(e) => setLang(e.target.value as FullReportLang)}
              />
            </div>
            <Button
              type="submit"
              className="h-9 px-5"
              loading={busy}
              disabled={busy}
              icon={
                !busy ? <FileText size={16} strokeWidth={1.75} /> : undefined
              }
            >
              {busy ? "Generating…" : "Generate report"}
            </Button>
            {(reportId || isCompleted || isFailed) && !busy && (
              <Button
                type="button"
                variant="secondary"
                className="h-9"
                onClick={reset}
                icon={<RotateCcw size={15} strokeWidth={1.75} />}
              >
                New report
              </Button>
            )}
          </div>

          {clientError && (
            <p className="text-xs text-danger" role="alert">
              {clientError}
            </p>
          )}
        </form>

        {apiError &&
          (apiError.status === 429 ? (
            <RateLimitAlert error={apiError} onRetry={submit} />
          ) : (
            <Alert tone="error" title="Couldn't start the report" onRetry={submit}>
              {apiError.message}
              {apiError.fieldErrors?.url && (
                <span className="mt-0.5 block font-mono text-xs">
                  {apiError.fieldErrors.url[0]}
                </span>
              )}
            </Alert>
          ))}
      </section>

      {/* Job panel */}
      {reportId && (
        <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {/* Loading sweep bar — visible only while the job is in flight */}
          {busy && (
            <div
              className="progress-indeterminate h-0.5 w-full bg-muted-strong"
              role="progressbar"
              aria-label="Report generation in progress"
            />
          )}

          <div className="space-y-4 p-4">
            {jobQuery.isError ? (
              <Alert
                tone="error"
                title={
                  normalizeApiError(jobQuery.error).status === 404
                    ? "Report not found"
                    : "Couldn't load report status"
                }
                onRetry={() => jobQuery.refetch()}
                retrying={jobQuery.isFetching}
              >
                {normalizeApiError(jobQuery.error).message}
              </Alert>
            ) : isStarting ? (
              <div className="flex items-center gap-2.5 text-sm text-ink-muted">
                <Loader2 size={15} className="animate-spin text-accent-ink" />
                Queuing your report…
              </div>
            ) : job ? (
              <>
                {/* Status header */}
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={job.status} />
                  <span className="font-mono text-xs text-ink-muted">
                    {job.strategy} · {job.lang.toUpperCase()}
                  </span>
                  {(isActive || isCompleted || isFailed) && (
                    <span
                      className="text-xs text-ink-faint"
                      title={formatTimestamp(job.updated_at)}
                    >
                      {isActive ? "started" : "updated"} {timeAgo(job.created_at)}
                    </span>
                  )}
                  {(isActive || isCompleted) && (
                    <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-ink-muted">
                      {isActive && (
                        <Loader2 size={12} className="animate-spin text-accent-ink" />
                      )}
                      {formatDuration(displayDuration)}
                    </span>
                  )}
                </div>

                <p className="break-all font-mono text-sm text-ink">{job.url}</p>

                {/* Active loading message */}
                {isActive && (
                  <div className="rounded border border-hairline bg-muted-strong px-3.5 py-3">
                    <p className="text-sm font-medium text-ink">
                      {job.status === "pending"
                        ? "Queued — waiting for a worker…"
                        : "Analyzing your site…"}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      This can take up to a minute. You can keep this tab open —
                      the page keeps its place if you refresh.
                    </p>
                  </div>
                )}

                {isFailed && (
                  <Alert tone="error" title="Report failed" onRetry={submit}>
                    {job.error_message ||
                      "The report job failed without a message."}
                  </Alert>
                )}

                {/* Per-tool checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xs font-medium uppercase tracking-wide text-ink-faint">
                      Analysis tools
                    </h2>
                    <span className="font-mono text-2xs tabular-nums text-ink-faint">
                      {resolvedCount}/{totalTools} done
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {toolEntries.map((t) => (
                      <ToolStatusRow
                        key={t.key}
                        label={TOOL_LABELS[t.key] ?? t.key}
                        status={t.status}
                        finished={!isActive}
                      />
                    ))}
                  </div>
                </div>

                {/* Completed — download */}
                {isCompleted && (
                  <div className="flex flex-wrap items-center gap-3 rounded border border-success-border bg-success-bg px-3.5 py-3">
                    <Check size={16} className="text-success" strokeWidth={2} />
                    <span className="text-sm text-ink">
                      Report ready
                      <span className="text-ink-muted">
                        {" "}
                        · finished in {formatDuration(displayDuration)}
                      </span>
                    </span>
                    {job.download_url ? (
                      <a
                        href={throughProxy(
                          job.download_url,
                          API_BASE_URL_IS_PROXIED,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex h-9 items-center gap-1.5 rounded border border-accent bg-accent px-3.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
                      >
                        <Download size={15} strokeWidth={1.75} />
                        Download PDF
                      </a>
                    ) : (
                      <span className="ml-auto text-xs text-ink-faint">
                        No download URL returned.
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

function ToolStatusRow({
  label,
  status,
  finished,
}: {
  label: string;
  status: ToolStatus | undefined;
  finished: boolean;
}) {
  const cfg = toolStatusConfig(status, finished);
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded border px-3 py-2 transition-colors",
        cfg.pending ? "border-hairline bg-muted" : "border-hairline",
      )}
    >
      <span
        className={cn(
          "text-sm",
          cfg.pending ? "text-ink-muted" : "text-ink",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          cfg.className,
        )}
      >
        {cfg.icon}
        {cfg.label}
      </span>
    </div>
  );
}

function toolStatusConfig(
  status: ToolStatus | undefined,
  finished: boolean,
): {
  label: string;
  className: string;
  icon: React.ReactNode;
  pending: boolean;
} {
  switch (status) {
    case "ok":
      return {
        label: "OK",
        className: "text-success",
        icon: <Check size={13} strokeWidth={2} />,
        pending: false,
      };
    case "failed":
      return {
        label: "Could not run",
        className: "text-danger",
        icon: <X size={13} strokeWidth={2} />,
        pending: false,
      };
    case "skipped":
      return {
        label: "Skipped",
        className: "text-ink-faint",
        icon: <Minus size={13} strokeWidth={2} />,
        pending: false,
      };
    default:
      // No status yet: "waiting" while active, or (defensively) "done" if the
      // job already finished but this tool never reported.
      if (finished) {
        return {
          label: "Done",
          className: "text-success",
          icon: <Check size={13} strokeWidth={2} />,
          pending: false,
        };
      }
      return {
        label: "Waiting…",
        className: "text-ink-faint",
        icon: <Loader2 size={13} className="animate-spin" />,
        pending: true,
      };
  }
}
