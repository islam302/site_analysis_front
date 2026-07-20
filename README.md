# Site Analysis — Full Report Frontend

A dense, professional demo/testing console for the **Full Report API** — the async
endpoint that generates a combined website-analysis PDF (PageSpeed, GTmetrix, WAVE
accessibility, SSL/TLS, broken links, structured data) in English or Arabic.

Every value in the UI comes from the live API — nothing is mocked. No
authentication — the endpoint is public. The full contract is in
[`FULL_REPORT_API.md`](FULL_REPORT_API.md).

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (formal, borders-over-shadows, single indigo accent)
- TanStack Query (polling, caching, retry rules)
- react-router-dom
- axios (single instance, no auth)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

| Script            | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Vite dev server                    |
| `npm run build`   | Typecheck (`tsc --noEmit`) + build |
| `npm run preview` | Serve the production build         |
| `npm run lint`    | Typecheck only                     |

## Configuration & the dev proxy

The API lives at:

```
https://una-ai-tools-apis.una-oic.org/site-analysis/api/v1
```

That host does **not** send `access-control-allow-origin`, so calling it directly
from the browser fails CORS. To avoid that, requests go through the **Vite dev
proxy**: the app uses a *relative* base URL, and Vite forwards `/site-analysis`
(API **and** media/PDFs) to the real host server-side. Same-origin, no CORS, and
it works from `localhost`, `127.0.0.1`, or your LAN IP.

| Variable                 | Default                                      | Purpose                              |
| ------------------------ | -------------------------------------------- | ------------------------------------ |
| `VITE_API_BASE_URL`      | `/site-analysis/api/v1`                      | Relative → goes through the proxy    |
| `VITE_API_PROXY_TARGET`  | `https://una-ai-tools-apis.una-oic.org`       | Where the proxy forwards             |

Point at a local backend instead:

```bash
VITE_API_PROXY_TARGET=http://localhost:8000
```

The footer **env/debug bar** shows the active base URL and proxy target.

> ⚠️ Never commit a `vite.config.js` / `vite.config.d.ts`. Vite resolves `.js`
> **before** `.ts`, so a stale compiled copy silently overrides `vite.config.ts`
> (this is why the build script uses `tsc --noEmit` — it must not emit).

## Endpoints used

| Step         | Method | Path                        |
| ------------ | ------ | --------------------------- |
| Start report | `POST` | `/api/v1/full_report/`      |
| Poll status  | `GET`  | `/api/v1/full_report/{id}/` |

## Flow

1. Enter a URL, pick strategy (defaults to **Desktop**) and language (defaults to **Arabic**).
2. `POST /full_report/` returns `{ id, status, status_url }` (`202`), instantly.
3. The job `id` is stored in the page URL (`?id=…`) so a refresh resumes polling.
4. Poll `GET /full_report/{id}/` every ~3s while `pending`/`processing`, with a
   live loading panel: sweep bar, elapsed timer, and a per-tool checklist.
5. On `completed`, the PDF `download_url` is offered as a download link.

`tools_status` values are `ok`, `failed`, or `skipped` — a `failed` or `skipped`
tool does **not** fail the report; that section is just marked "Could not run".

## Theming (light / dark)

Every color is a CSS variable holding space-separated RGB channels, so the whole
app re-themes from one `.dark` override in [`src/index.css`](src/index.css) —
Tailwind opacity modifiers (`bg-surface/90`) keep working.

- Toggle in the header cycles **Light → Dark → System**, persisted to
  `localStorage` (`sa.theme`) and following the OS while set to *System*.
- An inline script in `index.html` applies the theme before first paint, so
  there is no light flash on load.
- Token split: `accent` is the **fill** (buttons/brand, sized so white label text
  clears 4.5:1), `accent-ink` is accent as **foreground** (icons, focus rings),
  lifted in dark so it stays legible on dark surfaces.

The dark theme passes WCAG AA on all text/background pairs.

## Accessibility & UX notes

- Tool status never communicated by color alone (icon + label).
- Real `<button>`s, labeled inputs, focus-visible rings.
- Client-side URL validation before submit; 429 rate-limit surfaced with a live
  retry countdown; API error bodies surfaced with a Retry action.
- Quiet inline loading, never a full-page spinner; reduced-motion respected.
- Responsive down to 768px.

## Structure

```
src/
  api/          axios client, fullReport, error normalizer
  types/api.ts  the Full Report API contract as TypeScript types
  hooks/        useFullReport (start + polling), useElapsed
  components/   layout, env bar, rate-limit alert, UI primitives
  pages/        FullReport, NotFound
  lib/          config, query client, formatting, className helper
```
