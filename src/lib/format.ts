// Formatting helpers: relative time, URL validation, JSON stringify.

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 minutes ago", "just now", etc. Returns "" for unparseable input. */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSeconds = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 5) return "just now";

  for (const [unit, secondsInUnit] of UNITS) {
    if (abs >= secondsInUnit || unit === "second") {
      const value = Math.round(diffSeconds / secondsInUnit);
      return rtf.format(value, unit);
    }
  }
  return "just now";
}

/** Full, locale-formatted timestamp for tooltips / headers. */
export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Client-side URL validation before submit. We accept http(s) URLs with a
 * host that has a dot (or is localhost). Adds https:// if the scheme is
 * missing so users can type "example.com".
 */
export interface UrlCheck {
  ok: boolean;
  normalized?: string;
  reason?: string;
}

export function checkUrl(raw: string): UrlCheck {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Enter a URL." };

  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: "URL must start with http:// or https://" };
  }

  const host = parsed.hostname;
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  if (!isLocalhost && !host.includes(".")) {
    return { ok: false, reason: "Enter a full domain, e.g. example.com" };
  }

  return { ok: true, normalized: parsed.toString() };
}

/** Pretty-print any JSON-ish value; falls back to String() on cycles. */
export function stringifyRaw(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    // raw_data sometimes arrives as a JSON string — re-parse for pretty output.
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * When the app talks to the backend through the dev proxy, rewrite an absolute
 * backend URL (e.g. the PDF download_url) to a same-origin relative path so it
 * flows through the proxy too — works from localhost, 127.0.0.1, or a LAN IP.
 */
export function throughProxy(absoluteUrl: string, proxied: boolean): string {
  if (!proxied || !absoluteUrl) return absoluteUrl;
  try {
    const u = new URL(absoluteUrl);
    return u.pathname + u.search;
  } catch {
    return absoluteUrl;
  }
}

/** Truncate a URL in the middle for compact table display. */
export function truncateMiddle(str: string, max = 60): string {
  if (str.length <= max) return str;
  const keep = Math.floor((max - 1) / 2);
  return `${str.slice(0, keep)}…${str.slice(str.length - keep)}`;
}
