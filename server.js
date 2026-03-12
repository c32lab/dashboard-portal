import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

const app = express();

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
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`dashboard-portal listening on :${PORT}`);
});
