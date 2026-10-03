import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const dist = process.env.DIST ?? join(process.env.HOME, "despia_dsx/wt-docs-web/dist");
const out = process.env.OUT ?? "shots"; mkdirSync(out, { recursive: true });
const require = createRequire(join(process.env.HOME, "despia_dsx/wt-fleet2/OpenSource/Engine/TypeScript/node_modules/x.js"));
const { chromium } = require("playwright-core");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".md": "text/markdown" };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = [join(dist, path), join(dist, path, "index.html")].find((f) => existsSync(f) && statSync(f).isFile());
  if (!file) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(readFileSync(file));
});
await new Promise((r) => server.listen(8795, "127.0.0.1", r));
const base = "http://127.0.0.1:8795";
const browser = await chromium.launch();
const only = process.argv[2];
const views = [
  { n: "page", path: "/framework/guides/build-a-module" },
  { n: "table", path: "/framework/guides/build-a-module", scrollTo: ".dsx-markdown-table" },
  { n: "code", path: "/framework/guides/build-a-module", scrollTo: ".dsx-codeblock" },
  { n: "callout", path: "/framework/skills/writing-a-module" },
  { n: "search", path: "/framework/guides/build-a-module", search: "haptic" },
  { n: "agent", path: "/framework/guides/build-a-module", click: "[aria-label=\"Open this page in an AI agent\"]" },
];
for (const v of views) for (const w of [1440, 390]) for (const dark of [false, true]) {
  const name = `${v.n}-${w}-${dark ? "dark" : "light"}`;
  if (only && !name.includes(only)) continue;
  const page = await browser.newPage({ viewport: { width: w, height: w > 500 ? 900 : 844 }, colorScheme: dark ? "dark" : "light", deviceScaleFactor: 2 });
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + v.path, { waitUntil: "networkidle" }); await page.waitForTimeout(500);
  if (v.scrollTo) { await page.evaluate((sel) => { const e = document.querySelector(".doc-page " + sel); e && e.scrollIntoView({ block: "start" }); let p = e; while (p) { if (p.scrollTop > 0) { p.scrollTop -= 90; break; } p = p.parentElement; } }, v.scrollTo); await page.waitForTimeout(300); }
  if (v.click) { const el = page.locator(v.click).last(); await el.click({ timeout: 3000 }).catch(e => errors.push("click " + e.message.split("\n")[0])); await page.waitForTimeout(500); }
  if (v.search && w < 500) { await page.getByRole("button", { name: "Back" }).first().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); }
  if (v.search) { await page.locator(".doc-sidebar input:visible").first().click({ timeout: 3000 }).catch(e => errors.push("search " + e.message.split("\n")[0])); await page.keyboard.type(v.search); await page.waitForTimeout(700); }
  await page.screenshot({ path: join(out, name + ".png") });
  console.log(name, errors.join(" | "));
  await page.close();
}
await browser.close(); server.close();
