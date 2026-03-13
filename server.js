import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8080;
const SIGNAL_TARGET =
  process.env.SIGNAL_DASHBOARD_URL || "http://localhost:3080";
const PREDICT_TARGET =
  process.env.PREDICT_DASHBOARD_URL || "http://localhost:18828";

const app = express();

// Reverse proxy: /signal/* → signal-dashboard (path prefix stripped)
app.use(
  "/signal",
  createProxyMiddleware({
    target: SIGNAL_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/signal": "" },
    ws: true,
  }),
);

// Reverse proxy: /predict/* → predict-dashboard (path prefix stripped)
app.use(
  "/predict",
  createProxyMiddleware({
    target: PREDICT_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/predict": "" },
    ws: true,
  }),
);

// Serve built static files with long-term caching for hashed assets
const distDir = path.join(__dirname, "dist");
app.use(
  express.static(distDir, {
    maxAge: "1y",
    immutable: true,
    index: false, // let the SPA fallback handle "/"
  }),
);

// SPA fallback — serve index.html for any non-file route
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`dashboard-portal listening on :${PORT}`);
});
