# Dashboard Portal

Unified navigation shell for the Amani trading system dashboards. Embeds the Signal Dashboard and Predict Dashboard as iframes with health monitoring and tab-based routing.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Unit Tests | Vitest 4 + Testing Library |
| E2E Tests | Playwright (Chromium) |

## Architecture

```
src/
├── config.ts                  # TAB_CONFIG — routes, iframe URLs, health endpoints
├── components/
│   ├── NavBar.tsx             # Top nav with tab buttons + health status dots
│   └── DashboardFrame.tsx     # iframe wrapper component
├── hooks/
│   └── useServiceHealth.ts    # 30s health polling with CORS-aware fallback
├── utils/
│   ├── errorTracker.ts        # Global window error tracker
│   └── performanceMonitor.ts  # Page load + API timing monitor
├── __tests__/                 # Unit tests
├── App.tsx                    # Root: Routes generated from TAB_CONFIG
└── main.tsx                   # Entry: error/perf init + BrowserRouter
e2e/                           # Playwright E2E tests
```

## Pages & Routes

| Path | Label | iframe Source | Health Check |
|---|---|---|---|
| `/signal` | Signal | `VITE_SIGNAL_URL` (default `http://localhost:3080`) | `VITE_SIGNAL_URL` |
| `/predict` | Predict | `VITE_PREDICT_URL` (default `http://localhost:18828`) | `VITE_PREDICT_URL` |
| `/trading` | Trading | `VITE_SIGNAL_URL/trading` | `VITE_SIGNAL_URL` |
| `/system` | System | `VITE_SIGNAL_URL/advanced/system` | `VITE_SIGNAL_URL` |
| `*` | — | — | Redirects to `/signal` |

## iframe Integration

Each tab renders a `<DashboardFrame>` component that wraps an `<iframe>` filling the full viewport below the nav bar. The iframe sandbox policy grants: `allow-same-origin`, `allow-scripts`, `allow-popups`, `allow-forms`, `allow-downloads`. Top navigation is intentionally not allowed to prevent embedded dashboards from hijacking the parent URL.

The Signal, Trading, and System tabs all point to different paths on the Signal Dashboard. The Predict tab points to the Predict Dashboard.

## Health Check Mechanism

The `useServiceHealth` hook polls service URLs every 30 seconds with a two-stage strategy:

1. **Normal fetch** — if `res.ok`, status is `ok` (green dot)
2. **Opaque fetch** (`mode: 'no-cors'`) — if the server responds but CORS blocks reading, status is `reachable` (yellow dot)
3. **Both fail** — status is `down` (red dot)

Health URLs are deduplicated — Signal, Trading, and System share one check (SIGNAL_URL), so only 2 HTTP requests are made per cycle.

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_SIGNAL_URL` | `http://localhost:3080` | Signal Dashboard base URL (also used for `/trading` and `/system` sub-paths) |
| `VITE_PREDICT_URL` | `http://localhost:18828` | Predict Dashboard base URL |

Both are read via `import.meta.env` at **build time**. For Docker deployments, set these before running `docker compose build`.

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 8080)
npm run dev

# Build for production
npm run build
```

Ensure the Signal Dashboard (port 3080) and Predict Dashboard (port 18828) are running for full functionality.

## Testing

```bash
# Unit tests
npx vitest run

# E2E tests (requires dev server running)
npx playwright test
```

E2E specs: `portal` (smoke tests), `navigation` (tab routing), `responsive` (mobile/desktop).

## Docker

```bash
# Build (set VITE_* env vars before building)
VITE_SIGNAL_URL=http://signal:3080 VITE_PREDICT_URL=http://predict:18828 docker compose build

# Run
docker compose up -d
```

- Two-stage build: `node:20-alpine` → `nginx:alpine`
- Serves on port **8080**
- SPA fallback via `try_files $uri /index.html`
- Static assets cached 1 year with `immutable`
- No backend proxy — the portal only serves static files and embeds dashboards via iframe

## Deployment Architecture

```
                    ┌──────────────────────────┐
                    │   Dashboard Portal :8080  │
                    │   (nginx + static SPA)    │
                    └────────┬─────────────────┘
                             │ iframes
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   Signal    │  │   Signal    │  │   Predict   │
    │  Dashboard  │  │  /trading   │  │  Dashboard  │
    │   :3080     │  │  /adv/sys   │  │   :18828    │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                │                │
           ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │ Signal API  │  │  Data-Eng   │  │ Predict API │
    │   :18810    │  │   :8081     │  │   :18801    │
    └─────────────┘  └─────────────┘  └─────────────┘
```
