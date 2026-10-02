// Proof screenshots of the built docs (dist/) served the way Workers Static Assets serves it
// (drop-trailing-slash). Usage: node evidence/web-launch/shoot.mjs  (playwright-core + chromium
// from the fleet tree's existing install; nothing is installed).
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, "..", "..", "dist");
const out = join(here, "shots");
const require = createRequire(join(process.env.HOME, "despia_dsx/wt-fleet2/node_modules/x.js"));
const { chromium } = require("playwright-core");

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const cands = [join(dist, path), join(dist, path, "index.html")];
  const file = cands.find((f) => existsSync(f) && statSync(f).isFile());
  if (!file) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(8791, "127.0.0.1", r));
const base = "http://127.0.0.1:8791";
const browser = await chromium.launch();
const shots = [
  { name: "01-modern-page", path: "/framework/guides/routing", w: 1440, h: 1000 },
  { name: "02-legacy-steps-tabs-cards", path: "/legacy/payments/stripe/introduction", w: 1440, h: 1400, scrollTo: ".doc-steps" },
  { name: "03-legacy-cards", path: "/legacy/introduction", w: 1440, h: 1000, scrollTo: ".doc-tiles" },
  { name: "04-legacy-steps", path: "/legacy/deployment/apple-ios/automatic", w: 1440, h: 1000, scrollTo: ".doc-steps" },
  { name: "05-migration-map", path: "/migrate/map", w: 1440, h: 1000 },
  { name: "06-switcher-open", path: "/legacy/introduction", w: 1440, h: 760, click: ".doc-switcher-btn" },
  { name: "07-page-actions-open", path: "/migrate", w: 1440, h: 760, click: ".doc-actions-more" },
  { name: "08-search-all-spaces", path: "/legacy/introduction", w: 1440, h: 760, search: "haptic" },
  { name: "09-troubleshooting", path: "/troubleshooting", w: 1440, h: 1000 },
  { name: "10-mobile-legacy", path: "/legacy/native-features/haptic-feedback", w: 390, h: 844 },
  { name: "11-mobile-switcher", path: "/migrate/map", w: 390, h: 844, click: ".doc-switcher-btn" },
  { name: "12-legacy-dark", path: "/legacy/local-intelligence/reference", w: 1440, h: 1000, dark: true, scrollTo: ".doc-field" },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, colorScheme: s.dark ? "dark" : "light", deviceScaleFactor: s.w < 500 ? 3 : 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  if (s.scrollTo) await page.locator(s.scrollTo).first().scrollIntoViewIfNeeded().catch(() => {});
  if (s.scrollTo) await page.evaluate(() => window.scrollBy(0, -120));
  if (s.click) { await page.locator(s.click).first().click(); await page.waitForTimeout(400); }
  if (s.search) {
    await page.locator(".doc-search-inline input").first().fill(s.search);
    await page.waitForTimeout(500);
    await page.getByText("All spaces").first().click().catch(() => {});
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: join(out, `${s.name}.png`) });
  console.log(`${s.name}: ${s.path}${errors.length ? "  ERRORS: " + errors.join(" | ") : ""}`);
  await page.close();
}
await browser.close();
server.close();
