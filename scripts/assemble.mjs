#!/usr/bin/env node
//
//  assemble.mjs — the deployable site directory: `dsx build`'s output plus the compile
//  step's public artifacts (nav, search index, md siblings, llms.txt), one tree the
//  Workers assets upload (or any static host) serves whole.
//

import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { createHash } from "node:crypto";

import { extractSharedStylesheet } from "@despia-native/cli";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const pub = join(root, "public");

if (!existsSync(dist)) {
  console.error("[docs.assemble] no dist/ — run `dsx build` first");
  process.exit(1);
}

// The shared system stylesheet: SSR inlines the complete layer stack into every page (right
// for a single app shell), which on a 90+ route static site means the same ~290KB repeated on
// every document. extractSharedStylesheet (from @despia-native/cli, the same code the despia
// package registry site already runs) pulls it into ONE cached site.css and rewrites every
// page to a <link>, before the public/ artifacts and docs.js are folded in below.
const cssResult = extractSharedStylesheet(dist);
console.log(`[docs.assemble] site.css extracted: ${cssResult.cssBytes} byte(s), ` +
  `${cssResult.blocks} shared block(s), ${cssResult.pages} page(s) relinked`);

for (const name of readdirSync(pub)) {
  cpSync(join(pub, name), join(dist, name), { recursive: true });
}

// The docs enhancement layer (public/docs.js: anchor ids, scroll-spy, search keys,
// aria-current) rides every exported page as a deferred script. Injected here, at the
// deployable-tree seam, so the SSR pipeline stays generic.
// Also at this seam: the per-page <link rel="canonical"> (from public/canonical.json, which the
// compiler writes: every page canonical at docs.despia.com, the promoted /migrate/guide at its
// modern original) and the markdown alternate. The route table has no per-route head rows yet
// (a framework gap, recorded in evidence/web-launch/STATUS.md), so the stamp lands here, on the
// same deployable-tree pass as docs.js.
const canonicalFile = join(pub, "canonical.json");
const canonical = existsSync(canonicalFile) ? JSON.parse(readFileSync(canonicalFile, "utf8")) : {};
// A strict Content-Security-Policy per page (PLAN-O O3): every inline <script> the SSR wrote is
// allowed by its own sha256, nothing else inline runs; scripts from this origin and the Support
// widget origin only; no plugins, no base or form hijack. frame-src admits the v3 pages' YouTube
// embeds. frame-ancestors cannot live in a meta tag: worker/index.ts sends it as a header.
const supportOrigin = (process.env.DOCS_SUPPORT_ORIGIN ?? "https://support.despia.com").replace(/\/+$/, "");
function cspFor(html) {
  const hashes = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1].trim() === "") continue;
    hashes.add(`'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`);
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${supportOrigin} ${[...hashes].join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    `connect-src 'self' ${supportOrigin}`,
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}
let enhanced = 0;
let stamped = 0;
let secured = 0;
const injectDocsScript = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) { injectDocsScript(abs); continue; }
    if (entry.name !== "index.html") continue;
    let html = readFileSync(abs, "utf8");
    const route = "/" + relative(dist, dirname(abs)).split(sep).join("/");
    const key = route === "/" ? "/" : route.replace(/\/$/, "");
    if (canonical[key] !== undefined && !html.includes('rel="canonical"') && html.includes("</head>")) {
      const md = key === "/" ? "/index.md" : `${key}.md`;
      html = html.replace("</head>", `<link rel="canonical" href="${canonical[key]}">\n<link rel="alternate" type="text/markdown" href="${md}">\n</head>`);
      stamped += 1;
    }
    if (!html.includes("/docs.js") && html.includes("</body>")) {
      html = html.replace("</body>", `<script defer src="/docs.js"></script>\n</body>`);
      enhanced += 1;
    }
    if (!html.includes('http-equiv="Content-Security-Policy"') && html.includes('<meta charset="utf-8">')) {
      html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="${cspFor(html)}">`);
      secured += 1;
    }
    writeFileSync(abs, html);
  }
};
injectDocsScript(dist);
console.log(`[docs.assemble] public/ artifacts folded into dist/ — one servable tree (${enhanced} page(s) carry docs.js, ${stamped} canonical + markdown alternate, ${secured} strict CSP)`);

// Cloudflare's _headers holds at most 100 rules; `dsx build` writes one `no-cache` rule per route
// and per index.html (938 for this site: a framework gap, see the lane doc). Fold them into ONE
// `/*` rule and keep each immutable (content-hashed) asset rule, which detaches the folded
// Cache-Control first (`! Cache-Control`) so the two values never merge.
{
  const headersFile = join(dist, "_headers");
  if (existsSync(headersFile)) {
    const rules = [];
    let at = null;
    for (const line of readFileSync(headersFile, "utf8").split("\n")) {
      if (line.startsWith("/")) { at = { path: line.trim(), headers: [] }; rules.push(at); continue; }
      if (at !== null && line.trim() !== "") at.headers.push(line.trim());
    }
    const noCache = (r) => r.headers.length === 1 && r.headers[0] === "Cache-Control: no-cache";
    const kept = rules.filter((r) => !noCache(r));
    const folded = rules.length - kept.length;
    if (folded > 0) {
      const out = ["/*", "  Cache-Control: no-cache"];
      for (const r of kept) {
        out.push(r.path);
        if (r.headers.some((h) => h.startsWith("Cache-Control:"))) out.push("  ! Cache-Control");
        for (const h of r.headers) out.push(`  ${h}`);
      }
      writeFileSync(headersFile, out.join("\n") + "\n");
      console.log(`[docs.assemble] _headers: ${folded} no-cache rule(s) folded into /*, ${kept.length} kept (${kept.length + 1} total, limit 100)`);
    }
  }
}
