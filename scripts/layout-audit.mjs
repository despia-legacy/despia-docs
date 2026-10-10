#!/usr/bin/env node
//
//  layout-audit.mjs - ONE CONTENT COLUMN (owner 2026-10-10: "Apple's level"). Visits every docs route (the generated
//  route table, dsx.config.json) in a real browser and measures the page's content column:
//    · edges: every block (prose, code card, table, callout, list platter, card, catalog row group, search field, the
//      Get notified form) starts and ends on the same leading and trailing edge, within 1px;
//    · rhythm: no two consecutive blocks touch (gap >= 8px) and the gaps are reported;
//    · overflow: nothing scrolls the page sideways; a block wider than the column is a violation;
//    · clipped radius: a rounded block whose child paints past its corner without clipping it.
//  Usage: node scripts/layout-audit.mjs <origin> [--widths 1440,1024,390] [--schemes light,dark] [--only <prefix>]
//         [--legacy <n sampled legacy pages, default 12>] [--out report.json]
//  Needs playwright-core (PLAYWRIGHT_FROM=<folder with node_modules/playwright-core>). Exit 1 on any violation.
//
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const origin = (args[0] ?? "").replace(/\/+$/, "");
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
if (!origin) { console.error("usage: node scripts/layout-audit.mjs <origin> [options]"); process.exit(64); }
const widths = opt("--widths", "1440,1024,390").split(",").map(Number);
const schemes = opt("--schemes", "light").split(",");
const only = opt("--only", "");
const legacyN = Number(opt("--legacy", "12"));
const out = opt("--out", "");
const require = createRequire(join(process.env.PLAYWRIGHT_FROM ?? root, "package.json"));
const { chromium } = require("playwright-core");

const config = JSON.parse(readFileSync(join(root, "dsx.config.json"), "utf8"));
const all = config.routes.map((r) => r.path).filter((p) => p.startsWith(only));
const legacy = all.filter((p) => p.startsWith("/legacy/"));
const routes = [...all.filter((p) => !p.startsWith("/legacy/")), ...legacy.filter((_, i) => i % Math.max(1, Math.floor(legacy.length / legacyN)) === 0).slice(0, legacyN)];

const BLOCKS = [
  ".doc-page .dsx-markdown > :not(.dsx-markdown-tabs)", ".doc-page .dsx-markdown-tabs",
  ".doc-page .dsx-list-group .dsx-collection-row", ".doc-page .dsx-grid .dsx-grid-aria-row",
  ".doc-page > .dsx-callout", ".doc-page > .dsx-codeblock", ".doc-page .dsx-searchbar-field", ".doc-page > .dsx-stack.dsx-hstack",
].join(", ");

const browser = await chromium.launch();
const report = [];
let n = 0;
for (const scheme of schemes) for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const route of routes) {
    n += 1;
    await page.goto(origin + route, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(250);
    const found = await page.evaluate((sel) => {
      const v = [];
      const col = document.querySelector(".doc-page");
      if (!col) return { v: ["no content column"], gaps: [] };
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
      // the column's edges = the edges of its list platters when it has any, else of its first block
      const blocks = [...document.querySelectorAll(sel)].filter(vis).filter((e) => !e.closest(".dsx-sheet, [role=dialog]"));
      // a markdown text block sizes to the column; its own text may be shorter, so measure the block box
      const edges = blocks.map((e) => { const r = e.getBoundingClientRect(); return { e, l: Math.round(r.left), r: Math.round(r.right) }; });
      if (edges.length > 0) {
        const count = new Map();
        for (const x of edges) count.set(`${x.l}|${x.r}`, (count.get(`${x.l}|${x.r}`) ?? 0) + 1);
        const [ref] = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0].split("|").map(Number);
        const refR = Number([...count.entries()].sort((a, b) => b[1] - a[1])[0][0].split("|")[1]);
        for (const x of edges) {
          if (Math.abs(x.l - ref) > 1 || Math.abs(x.r - refR) > 1) {
            const name = `${x.e.tagName.toLowerCase()}.${[...x.e.classList].slice(0, 2).join(".")}`;
            v.push(`edge ${x.l}..${x.r} vs column ${ref}..${refR}: ${name} "${(x.e.innerText || "").trim().slice(0, 30)}"`);
          }
        }
      }
      // rhythm: the column's direct blocks
      const kids = [...col.children].filter(vis);
      const gaps = [];
      for (let i = 1; i < kids.length; i += 1) {
        const g = Math.round(kids[i].getBoundingClientRect().top - kids[i - 1].getBoundingClientRect().bottom);
        gaps.push(g);
        if (g < 8) v.push(`blocks touch (${g}px) before "${(kids[i].innerText || "").trim().slice(0, 30)}"`);
      }
      // overflow
      if (document.documentElement.scrollWidth > window.innerWidth + 1) v.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${window.innerWidth})`);
      const cr = col.getBoundingClientRect();
      for (const e of col.querySelectorAll("*")) {
        const r = e.getBoundingClientRect();
        if (r.width > 0 && r.right > cr.right + 1 && !e.closest(".dsx-scroll-x, .dsx-codeblock-viewport, pre")) { v.push(`overflows the column: ${e.tagName.toLowerCase()}.${[...e.classList][0] ?? ""}`); break; }
      }
      // clipped radius
      for (const e of col.querySelectorAll(".dsx-codeblock, .dsx-card, .dsx-callout, .dsx-markdown-table")) {
        const cs = getComputedStyle(e);
        if (parseFloat(cs.borderTopLeftRadius) > 0 && cs.overflow === "visible") {
          const r = e.getBoundingClientRect();
          const kid = [...e.children].find((k) => { const kr = k.getBoundingClientRect(); return kr.left <= r.left + 0.5 && kr.top <= r.top + 0.5 && getComputedStyle(k).backgroundColor !== "rgba(0, 0, 0, 0)"; });
          if (kid) v.push(`radius not clipped: ${e.className.split(" ").slice(0, 2).join(".")}`);
        }
      }
      return { v: [...new Set(v)], gaps };
    }, BLOCKS);
    report.push({ route, width, scheme, violations: found.v, gaps: found.gaps });
  }
  await ctx.close();
}
await browser.close();
const bad = report.filter((r) => r.violations.length > 0);
const total = bad.reduce((s, r) => s + r.violations.length, 0);
if (out) writeFileSync(out, JSON.stringify({ origin, routes: routes.length, visits: n, violations: total, pages: report }, null, 1) + "\n");
const kinds = {};
for (const r of bad) for (const v of r.violations) { const k = v.split(/[ :(]/)[0]; kinds[k] = (kinds[k] ?? 0) + 1; }
console.log(`[docs.layout-audit] ${routes.length} route(s) x ${widths.length} width(s) x ${schemes.length} scheme(s) = ${n} visit(s); ${total} violation(s) on ${bad.length} visit(s) ${JSON.stringify(kinds)}`);
for (const r of bad.slice(0, 25)) console.log(`  ${r.scheme} ${r.width} ${r.route}: ${r.violations.slice(0, 3).join(" | ")}`);
process.exit(total > 0 ? 1 : 0);
