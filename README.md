# Dashboard Portal

Unified portal for the Amani Trading System. Embeds **signal-dashboard** and **predict-dashboard** as iframes behind a tabbed navigation bar with live health indicators.

## Architecture

```
 Browser
 +----------------------------------------------+
 | NavBar  [Signal] [Predict] [Trading] [System] |
 |----------------------------------------------|
 | <iframe src="signal-dashboard or predict..."> |
 +----------------------------------------------+
        |                        |
   VITE_SIGNAL_URL         VITE_PREDICT_URL
   (default :3080)         (default :18828)
```

- **Portal** -- React SPA that provides navigation and iframe orchestration.
- **DashboardFrame** -- renders a full-viewport `<iframe>` with a restrictive `sandbox` policy (`allow-same-origin allow-scripts allow-popups allow-forms allow-downloads`).
- **NavBar** -- tab bar driven by `TAB_CONFIG` in `src/config.ts`. Each tab maps a route to an iframe URL.

### Tabs (defined in `src/config.ts`)

| Tab | Route | Iframe URL |
|---------|-----------|-------------------------------|
| Signal | `/signal` | `VITE_SIGNAL_URL` |
| Predict | `/predict` | `VITE_PREDICT_URL` |
| Trading | `/trading` | `VITE_SIGNAL_URL/trading` |
| System | `/system` | `VITE_SIGNAL_URL/advanced/system` |

The default route (`/*`) redirects to `/signal`.

## Health Check

The `useServiceHealth` hook (`src/hooks/useServiceHealth.ts`) polls each unique `healthUrl` every **30 seconds**:

1. `fetch(url)` with `cache: no-store` -- if `res.ok` -> **green** (`ok`).
2. If the response is not ok (e.g. non-2xx) -> **yellow** (`reachable`).
3. On CORS/network error, retries with `mode: no-cors` -- if that succeeds -> **yellow** (`reachable`).
4. Otherwise -> **red** (`down`).

Status is shown as a colored dot next to each tab label in the NavBar.

## Tech Stack

| Category | Library | Version |
|----------|---------|---------|
| Framework | React | 19.x |
| Bundler | Vite | 7.x |
| Language | TypeScript | 5.9 |
| Styling | Tailwind CSS (Vite plugin) | 4.x |
| Routing | react-router-dom | 7.x |
| Unit Tests | Vitest + Testing Library + jsdom | -- |
| E2E Tests | Playwright (Chromium) | -- |
| Linting | ESLint + typescript-eslint | -- |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_SIGNAL_URL` | `http://localhost:3080` | Base URL for signal-dashboard |
| `VITE_PREDICT_URL` | `http://localhost:18828` | Base URL for predict-dashboard |

Create a `.env` file in the project root (Vite loads it automatically):

```env
VITE_SIGNAL_URL=http://localhost:3080
VITE_PREDICT_URL=http://localhost:18828
```

## Development

```bash
npm install
npm run dev          # starts on http://localhost:8080
```

Make sure the upstream dashboards (signal, predict) are running for the iframes to load.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 8080) |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npx playwright test` | Run Playwright E2E tests |

## Production / Docker

```bash
docker compose up --build      # builds & runs on port 8080
```

The multi-stage `Dockerfile` builds the Vite app, then serves `dist/` with nginx. Nginx is configured for SPA fallback (`try_files $uri /index.html`) and 1-year cache headers for static assets.

## Observability Utilities

Initialized at startup in `src/main.tsx`:

- **ErrorTracker** (`src/utils/errorTracker.ts`) -- captures `window.error` and `unhandledrejection` events, retains the last 50 errors in memory. Access via `getRecentErrors()` / `getErrorCount()`.
- **PerformanceMonitor** (`src/utils/performanceMonitor.ts`) -- records page load time via Navigation Timing API and wraps `fetch()` to track `/api` response times (last 200 samples). Access via `getPerformanceMetrics()`.

## Project Structure

```
src/
  App.tsx                    # Router + layout
  config.ts                  # Tab definitions + env vars
  main.tsx                   # Entry point (init trackers)
  components/
    DashboardFrame.tsx       # Iframe wrapper
    NavBar.tsx               # Tab navigation + health dots
  hooks/
    useServiceHealth.ts      # Periodic health polling
  utils/
    errorTracker.ts          # Global error capture
    performanceMonitor.ts    # Page load + API timing
  __tests__/                 # Vitest unit tests
e2e/                         # Playwright E2E specs
```
