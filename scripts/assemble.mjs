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
// Coming soon pages (scripts/packages-lib.mjs shipState): the compiler leaves an empty `.doc-notify` stack whose class
// names the topic; here it becomes a plain HTML form that posts with no JavaScript (worker/notify.ts answers a 303 back
// and writes the state in), which docs.js upgrades to an inline fetch. Same origin only: the page CSP's form-action and
// connect-src are 'self'. DOCS_NOTIFY_ACTION points a build at another handler.
const notifyAction = process.env.DOCS_NOTIFY_ACTION ?? "/notify";
const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const NOTIFY_STYLE = `<style id="doc-notify-style">
.doc-notify-form{display:flex;flex-direction:column;gap:.5rem;max-width:30rem;padding:1rem;border:1px solid var(--dsx-separator,rgba(127,127,127,.3));border-radius:12px}
.doc-notify-form label{font-weight:600}
.doc-notify-row{display:flex;gap:.5rem;flex-wrap:wrap}
.doc-notify-row input{flex:1 1 14rem;min-width:0;font:inherit;padding:.55rem .75rem;border-radius:8px;border:1px solid var(--dsx-separator,rgba(127,127,127,.4));background:var(--dsx-background,transparent);color:inherit}
.doc-notify-row button{font:inherit;font-weight:600;padding:.55rem 1rem;border-radius:8px;border:0;background:var(--dsx-accent,#0a84ff);color:#fff;cursor:pointer}
.doc-notify-row button[disabled]{opacity:.6;cursor:default}
.doc-notify-consent{margin:0;font-size:.8125rem;opacity:.7}
.doc-notify-status{margin:0;font-size:.875rem;min-height:1.25em}
.doc-notify-status[data-state=ok]{color:var(--dsx-green,#30a14e)}
.doc-notify-status[data-state=error]{color:var(--dsx-red,#d73a49)}
</style>`;
const notifyForm = (topic, back) => `<form class="doc-notify-form" id="notify" method="post" action="${escapeHtml(notifyAction)}">` +
  `<input type="hidden" name="topic" value="${escapeHtml(topic)}"><input type="hidden" name="back" value="${escapeHtml(back)}">` +
  `<label for="notify-email">Get notified when it's ready</label>` +
  `<div class="doc-notify-row"><input id="notify-email" type="email" name="email" required maxlength="254" autocomplete="email" placeholder="you@example.com"><button type="submit">Notify me</button></div>` +
  `<p class="doc-notify-consent">We'll email you when it's ready. Unsubscribe anytime.</p>` +
  `<p class="doc-notify-status" role="status" aria-live="polite"></p></form>`;
let notifyForms = 0;
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
    html = html.replace(/(<div class="[^"]*\bdoc-notify doc-notify-topic-([a-z0-9-]+)\b[^"]*"[^>]*>)(<\/div>)/g, (_, open, slug, close) => {
      notifyForms += 1;
      return `${open}${notifyForm(slug.replace(/--/g, "/"), key)}${close}`;
    });
    if (html.includes("doc-notify-form") && !html.includes("doc-notify-style")) html = html.replace("</head>", `${NOTIFY_STYLE}\n</head>`);
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
console.log(`[docs.assemble] ${notifyForms} Coming soon notify form(s) written`);
console.log(`[docs.assemble] public/ artifacts folded into dist/ — one servable tree (${enhanced} page(s) carry docs.js, ${stamped} canonical + markdown alternate, ${secured} strict CSP)`);

