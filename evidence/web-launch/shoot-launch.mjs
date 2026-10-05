// Launch review matrix: docs home, Modules index, the Build a module guide, a legacy page, a table, a
// code block, search and the agent menu, at 1440 and 390, light and dark, 2x. Prints per-shot metrics
// for the known 390 items (page overflow, top-bar rows, table frame vs table width, popover ground).
// OUT=<dir> node evidence/web-launch/shoot-launch.mjs [filter]
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const dist = process.env.DIST ?? join(process.env.HOME, "despia_dsx/wt-docs-web/dist");
const out = process.env.OUT ?? "shots"; mkdirSync(out, { recursive: true });
const require = createRequire("/Volumes/DSX-SSD/worktrees/website/OpenSource/Engine/TypeScript/node_modules/x.js");
const { chromium } = require("playwright-core");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".md": "text/markdown" };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = [join(dist, path), join(dist, path, "index.html")].find((f) => existsSync(f) && statSync(f).isFile());
  if (!file) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(readFileSync(file));
});
await new Promise((r) => server.listen(8796, "127.0.0.1", r));
const base = "http://127.0.0.1:8796";
const browser = await chromium.launch();
const only = process.argv[2];
const guide = "/framework/guides/build-a-module";
const views = [
  { n: "home", path: "/" },
  { n: "modules", path: "/framework/modules" },
  { n: "guide", path: guide },
  { n: "legacy", path: "/legacy/introduction" },
  { n: "table", path: guide, scrollTo: ".dsx-markdown-table-frame" },
  { n: "code", path: guide, scrollTo: ".dsx-codeblock" },
  { n: "search", path: guide, search: "haptic" },
  { n: "agent", path: guide, click: "[aria-label=\"Open this page in an AI agent\"]" },
];
const report = [];
for (const v of views) for (const w of [1440, 390]) for (const dark of [false, true]) {
  const name = `${v.n}-${w}-${dark ? "dark" : "light"}`;
  if (only && !name.includes(only)) continue;
  const page = await browser.newPage({ viewport: { width: w, height: w > 500 ? 900 : 844 }, colorScheme: dark ? "dark" : "light", deviceScaleFactor: 2 });
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + v.path, { waitUntil: "networkidle" }); await page.waitForTimeout(600);
  if (v.scrollTo) { await page.evaluate((sel) => { const e = document.querySelector(".doc-page " + sel); e && e.scrollIntoView({ block: "start" }); let p = e; while (p) { if (p.scrollTop > 0) { p.scrollTop -= 90; break; } p = p.parentElement; } }, v.scrollTo); await page.waitForTimeout(300); }
  if (v.click) { const el = page.locator(v.click).last(); await el.click({ timeout: 3000 }).catch(e => errors.push("click " + e.message.split("\n")[0])); await page.waitForTimeout(600); }
  if (v.search && w < 500) { await page.getByRole("button", { name: "Back" }).first().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); }
  if (v.search) { await page.locator(".doc-sidebar input:visible").first().click({ timeout: 3000 }).catch(e => errors.push("search " + e.message.split("\n")[0])); await page.keyboard.type(v.search); await page.waitForTimeout(800); }
  const m = await page.evaluate(() => {
    const vis = (e) => e && e.getClientRects().length > 0;
    const doc = document.scrollingElement;
    const nav = [...document.querySelectorAll("[class*=navbar], nav")].find(vis);
    const navItems = nav ? [...nav.querySelectorAll("button, [role=button], select, a")].filter(vis).map((b) => Math.round(b.getBoundingClientRect().top)) : [];
    const frame = [...document.querySelectorAll(".doc-page .dsx-markdown-table-frame")].find(vis);
    const table = frame && frame.querySelector(".dsx-markdown-table, table");
    const pop = [...document.querySelectorAll("[popover], [role=dialog], [class*=popover]")].filter(vis).map((p) => getComputedStyle(p).backgroundColor);
    const chevrons = [...document.querySelectorAll("[class*=popover] [class*=chevron], [popover] [class*=chevron], [class*=popover] [class*=disclosure]")].filter(vis).length;
    return {
      overflowX: doc.scrollWidth - window.innerWidth,
      navRows: new Set(navItems).size,
      table: frame ? { frame: Math.round(frame.getBoundingClientRect().width), table: Math.round(table ? table.getBoundingClientRect().width : 0), scrollW: frame.scrollWidth, clientW: frame.clientWidth } : null,
      popoverBg: pop, popoverChevrons: chevrons,
    };
  });
  await page.screenshot({ path: join(out, name + ".png") });
  report.push({ name, ...m, errors });
  console.log(name, JSON.stringify(m), errors.join(" | "));
  await page.close();
}
writeFileSync(join(out, "metrics.json"), JSON.stringify(report, null, 2));
await browser.close(); server.close();
