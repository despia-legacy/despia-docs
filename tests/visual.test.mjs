// The rendered site, measured in a real browser (owner 2026-10-10 rules). Skipped unless DOCS_ORIGIN names a served
// build (`npm run build`, then any static server over dist/, or `npx wrangler dev`). Needs playwright-core and a
// Chromium: PLAYWRIGHT_FROM=<folder with node_modules/playwright-core>.
//   For every key page, light and dark:
//   · the scheme is real: body, sidebar and content backgrounds are dark in dark and light in light;
//   · contrast (WCAG): body text >= 4.5:1, secondary text >= 3:1, on the background actually behind it;
//   · no "[object Object]" anywhere on the page, no broken image;
//   · rhythm: adjacent blocks of the content column never touch;
//   · no line breaks inside a word in headings, table headers and sidebar rows;
//   · the sidebar search field spans the row inset (left/right inset equal to the rows', within 1px).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { join } from "node:path";

const origin = (process.env.DOCS_ORIGIN ?? "").replace(/\/+$/, "");
const PAGES = ["/", "/quickstart", "/web-apps", "/packages", "/packages/haptic", "/packages/appleauth", "/cli", "/legacy/introduction"];

test("rendered pages meet the visual rules", { skip: origin === "" ? "set DOCS_ORIGIN to a served build" : false, timeout: 600000 }, async () => {
  const require = createRequire(join(process.env.PLAYWRIGHT_FROM ?? process.cwd(), "package.json"));
  const { chromium } = require("playwright-core");
  const browser = await chromium.launch();
  const problems = [];
  for (const scheme of ["light", "dark"]) {
    for (const route of PAGES) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      const found = await page.evaluate((wantDark) => {
        const out = [];
        const rgb = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const v = m[1].split(",").map((x) => parseFloat(x)); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
        const lum = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        // an unpainted page shows the canvas, which follows the colour scheme
        const canvas = wantDark ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
        const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c && c.a > 0.5) return c; } return canvas; };
        // scheme
        for (const sel of [".dsx-scaffold-sidebar", ".dsx-sidebar-list", ".doc-page"]) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const dark = lum(bgOf(el)) < 0.2;
          if (dark !== wantDark) out.push(`${sel}: background is ${dark ? "dark" : "light"} in ${wantDark ? "dark" : "light"} mode`);
        }
        // contrast on visible text
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n = 0;
        while (walker.nextNode() && n < 400) {
          const t = walker.currentNode;
          if (!t.textContent.trim()) continue;
          const el = t.parentElement;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          if (cs.visibility === "hidden" || cs.display === "none" || r.width === 0 || r.height === 0 || parseFloat(cs.opacity) < 0.5) continue;
          if (el.closest("pre, code, [aria-hidden=true], .dsx-codeblock")) continue;
          n += 1;
          const fg = rgb(cs.color);
          if (!fg) continue;
          const c = ratio(fg, bgOf(el));
          const secondary = fg.a < 0.9 || parseFloat(cs.fontSize) < 14;
          if (c < (secondary ? 3 : 4.5)) out.push(`contrast ${c.toFixed(2)} for "${t.textContent.trim().slice(0, 30)}"`);
        }
        // [object Object] and broken images
        if (document.body.innerText.includes("[object Object]")) out.push("[object Object] on the page");
        for (const img of document.querySelectorAll("img")) if (img.complete && img.naturalWidth === 0) out.push(`broken image ${img.getAttribute("src")}`);
        // rhythm: content blocks never touch
        const col = document.querySelector(".doc-page");
        if (col) {
          const kids = [...col.children].filter((k) => k.getBoundingClientRect().height > 0);
          for (let i = 1; i < kids.length; i += 1) {
            const gap = kids[i].getBoundingClientRect().top - kids[i - 1].getBoundingClientRect().bottom;
            if (gap < 8) out.push(`content blocks touch (${gap.toFixed(0)}px) before "${(kids[i].innerText || "").slice(0, 30)}"`);
          }
        }
        // no word broken across lines
        for (const el of document.querySelectorAll("h1, h2, h3, th, [role=heading], .dsx-sidebar-item-title")) {
          const range = document.createRange();
          for (const node of el.childNodes) {
            if (node.nodeType !== 3) continue;
            const words = node.textContent.split(/(\s+)/);
            let offset = 0;
            for (const w of words) {
              if (w.trim().length > 1) {
                range.setStart(node, offset); range.setEnd(node, offset + w.length);
                if (range.getClientRects().length > 1) out.push(`word broken across lines: "${w}"`);
              }
              offset += w.length;
            }
          }
        }
        // the sidebar search spans the row inset
        const search = document.querySelector(".dsx-sidebar-list .dsx-searchbar-field");
        const row = document.querySelector(".dsx-sidebar-item-action");
        if (search && row) {
          const s = search.getBoundingClientRect(); const r = row.getBoundingClientRect();
          if (Math.abs(s.left - r.left) > 1 || Math.abs(s.right - r.right) > 1) out.push(`search inset ${s.left.toFixed(0)}..${s.right.toFixed(0)} vs rows ${r.left.toFixed(0)}..${r.right.toFixed(0)}`);
        }
        return out;
      }, scheme === "dark");
      for (const f of found) problems.push(`${scheme} ${route}: ${f}`);
      await ctx.close();
    }
  }
  await browser.close();
  assert.deepEqual([...new Set(problems)], []);
});
