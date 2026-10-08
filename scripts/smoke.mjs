#!/usr/bin/env node
//
//  smoke.mjs - every page of a deployed docs site boots without a failure screen (owner 2026-10-08: a docs page
//  showed "Root plan exhausted ... root.component_missing"). Loads every route in /nav.json (every space) in a
//  real browser, waits for the client boot, and fails on a root-plan screen, a "root." error code, an uncaught page
//  error, or a page whose title heading never draws.
//
//  Usage: node scripts/smoke.mjs <origin> [--only <prefix>] [--concurrency 4]
//  Needs Playwright (resolved from PLAYWRIGHT_FROM, a folder with node_modules/playwright, else this project).
//
import { createRequire } from "node:module";
import { join } from "node:path";

const args = process.argv.slice(2);
const origin = (args[0] ?? "").replace(/\/+$/, "");
if (origin === "") { console.error("usage: node scripts/smoke.mjs <origin> [--only <prefix>] [--concurrency N]"); process.exit(64); }
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const only = opt("--only", "");
const concurrency = Number(opt("--concurrency", "4"));
const require = createRequire(join(process.env.PLAYWRIGHT_FROM ?? process.cwd(), "package.json"));
const { chromium } = require("playwright");

const nav = await (await fetch(`${origin}/nav.json`)).json();
const routes = [...new Set((nav.spaces ?? []).flatMap((s) => (s.sections ?? []).flatMap((sec) => (sec.pages ?? []).map((p) => p.route))))]
  .filter((r) => r.startsWith(only)).sort();
console.log(`[docs.smoke] ${routes.length} page(s) on ${origin}`);

const browser = await chromium.launch();
const failures = [];
let next = 0;
async function worker() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e.message ?? e).slice(0, 200)));
  while (next < routes.length) {
    const route = routes[next++];
    pageErrors = [];
    try {
      await page.goto(origin + route, { waitUntil: "load", timeout: 30000 });
      await page.waitForFunction(() => document.readyState === "complete", null, { timeout: 15000 });
      await page.waitForTimeout(1200);
      const text = await page.evaluate(() => document.body.innerText);
      const problems = [];
      if (/Root plan exhausted/i.test(text)) problems.push("root plan exhausted screen");
      const code = /\broot\.(?:component_missing|[a-z_]*(?:failed|missing|exhausted|refused|timeout))\b/.exec(text);
      if (code !== null) problems.push(`error code ${code[0]}`);
      if (pageErrors.length > 0) problems.push(`page error: ${pageErrors[0]}`);
      if ((await page.locator('[role="heading"][aria-level="1"]').count()) === 0) problems.push("no page title drawn");
      if (problems.length > 0) failures.push(`${route}: ${problems.join("; ")}`);
    } catch (error) {
      failures.push(`${route}: ${String(error.message ?? error).split("\n")[0]}`);
    }
  }
  await context.close();
}
await Promise.all(Array.from({ length: concurrency }, worker));
await browser.close();
if (failures.length > 0) {
  console.error(`[docs.smoke] ${failures.length} page(s) failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`[docs.smoke] ${routes.length} page(s) boot with no failure screen`);
