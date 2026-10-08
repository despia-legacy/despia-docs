#!/usr/bin/env node
//
//  check-examples.mjs - the example box (DocExample) behaves (owner 2026-10-09): on every page that carries one it
//  renders a live preview; switching Preview -> Code keeps the box's height (no layout shift); Expand removes the
//  30rem clip; the copy button copies the example's source. Optional: --shots <dir> <route,route,...> writes
//  390/1440 light/dark shots of the first example on each route.
//
//  Usage: node scripts/check-examples.mjs <origin> [--only <prefix>] [--shots <dir> <routes>]
//
import { createRequire } from "node:module";
import { join } from "node:path";

const args = process.argv.slice(2);
const origin = (args[0] ?? "").replace(/\/+$/, "");
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const only = opt("--only") ?? "";
const shotsDir = opt("--shots");
const shotRoutes = shotsDir === undefined ? [] : (args[args.indexOf("--shots") + 2] ?? "").split(",").filter(Boolean);
const require = createRequire(join(process.env.PLAYWRIGHT_FROM ?? process.cwd(), "package.json"));
const { chromium } = require("playwright");

const nav = await (await fetch(`${origin}/nav.json`)).json();
const routes = [...new Set((nav.spaces ?? []).flatMap((s) => (s.sections ?? []).flatMap((sec) => (sec.pages ?? []).map((p) => p.route))))]
  .filter((r) => r.startsWith(only) && (r.startsWith("/components") || r === "/quickstart")).sort();

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const failures = [];
let boxes = 0;
for (const route of routes) {
  await page.goto(origin + route, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const box = page.locator(".doc-example").first();
  if ((await box.count()) === 0) continue;
  boxes += 1;
  try {
    await box.scrollIntoViewIfNeeded();
    if ((await box.locator(".doc-example-preview").count()) === 0) { failures.push(`${route}: no live preview`); continue; }
    const before = (await box.boundingBox()).height;
    await box.locator('[role="radio"], input[type="radio"], label, button').filter({ hasText: "Code" }).first().click();
    await page.waitForTimeout(300);
    const after = (await box.boundingBox()).height;
    if (Math.abs(after - before) > 1) failures.push(`${route}: the box moved ${Math.round(after - before)}px switching to Code`);
    await box.locator(".doc-example-expand").click();
    await page.waitForTimeout(200);
    const clip = await box.locator(".doc-example-stage").evaluate((el) => getComputedStyle(el).maxHeight);
    if (clip !== "none") failures.push(`${route}: Expand did not open the box (max-height ${clip})`);
    await box.locator(".dsx-copybutton").click();
    await page.waitForTimeout(200);
    const copied = await page.evaluate(() => navigator.clipboard.readText().catch(() => ""));
    if (copied.trim() === "") failures.push(`${route}: copy put nothing on the clipboard`);
  } catch (error) {
    failures.push(`${route}: ${String(error.message ?? error).split("\n")[0]}`);
  }
}
await context.close();

for (const route of shotRoutes) {
  for (const scheme of ["light", "dark"]) {
    for (const width of [390, 1440]) {
      const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
      const p = await ctx.newPage();
      await p.goto(origin + route, { waitUntil: "networkidle" });
      await p.waitForTimeout(1200);
      const box = p.locator(".doc-example").first();
      await box.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      const name = route.split("/").pop() || "home";
      await box.screenshot({ path: `${shotsDir}/example-${name}-${width}-${scheme}.png` });
      await ctx.close();
    }
  }
}
await browser.close();
if (failures.length > 0) {
  console.error(`[docs.examples] ${failures.length} problem(s) in ${boxes} box(es):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`[docs.examples] ${boxes} page(s) with an example box: live preview, no shift switching tabs, expand and copy work`);
