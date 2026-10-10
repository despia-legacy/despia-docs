#!/usr/bin/env node
//
//  site/build.mjs - builds the Despia V4 docs to static HTML (dist-v2/), in about a second, with no install.
//
//    node site/build.mjs [outDir]
//
//  Inputs:  site/ia.mjs (the IA), content-v2/**/*.md (the pages), data/packages.json (the package catalog).
//  Outputs: one index.html per route, a .md twin per page, search.json, llms.txt, docs-index.json (the machine export
//           the general Despia MCP, `despia docs` and /v1/package-docs consume: contract in PLAN.md).
//
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, statSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderMarkdown, parseFrontMatter, inline } from "./md.mjs";
import { escapeHtml, highlightHtml } from "./highlight.mjs";
import { icon } from "./icons.mjs";
import { SECTIONS, sectionOf, allPages } from "./ia.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const out = resolve(process.argv[2] ?? join(repo, "dist-v2"));
const CONTENT = join(repo, "content-v2");
const SITE_CFG = JSON.parse(readFileSync(join(repo, "data", "site.json"), "utf8"));
const SITE = `${SITE_CFG.origin}${SITE_CFG.base}`; // https://despia.com/docs
const WAITLIST = process.env.DOCS_WAITLIST_URL ?? "https://api.despia.com/v1/waitlist";
const CONSOLE = "https://console.despia.com";
const RELEASE = JSON.parse(readFileSync(join(repo, "data", "release.json"), "utf8"));

const LOGO = `<svg class="logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${(await import("./vendor/despia-icons.js")).ICON_BRANDS["despia.logo.mono"].layers.map((l) => l.d).join(" ")}"/></svg>`;

const exportPages = [];   // docs-index.json
const searchRows = [];    // search.json

// ── chrome ─────────────────────────────────────────────────────────────────────────────────────────
function topbar(active) {
  const tabs = SECTIONS.map((s) => `<a class="tab" href="${s.href}"${active === s.id ? ' aria-current="true"' : ""}>${s.label}${s.badge ? `<span class="tab-badge">Preview</span>` : ""}</a>`).join("");
  return `<header class="topbar"><div class="topbar-inner">
  <a class="brand" href="/" aria-label="Despia docs home">${LOGO}<span>Despia</span><span class="brand-docs">Docs</span></a>
  <nav class="tabs" aria-label="Sections">${tabs}</nav>
  <div class="topbar-actions">
    <button class="search-trigger" type="button">${icon("magnifyingglass")}<span>Search docs</span><kbd>⌘K</kbd></button>
    <button class="icon-btn theme-toggle" type="button" aria-label="Switch between light and dark">${icon("circle.lefthalf.filled")}</button>
    <a class="btn btn-sm" href="${CONSOLE}">Console ${icon("arrow.up.right")}</a>
    <button class="icon-btn search-btn-compact" type="button" aria-label="Search the docs">${icon("magnifyingglass")}</button>
    <button class="icon-btn menu-btn" type="button" aria-label="Open the navigation">${icon("line.3.horizontal")}</button>
  </div>
</div></header>`;
}

function navTree(section, route) {
  if (!section) return "";
  if (section.id === "packages") return packagesNav(route);
  return section.groups.map((g) => `<div class="nav-group"><p class="nav-title">${escapeHtml(g.title)}</p><ul class="nav-list">`
    + g.pages.map(([r, t]) => `<li><a class="nav-link" href="${r}"${r === route ? ' aria-current="page"' : ""}>${escapeHtml(t)}</a></li>`).join("")
    + `</ul></div>`).join("");
}

function overlays(section, route) {
  const sheetTabs = SECTIONS.map((s) => `<a href="${s.href}"${section?.id === s.id ? ' aria-current="true"' : ""}>${s.label}</a>`).join("");
  return `<div class="dialog-backdrop" hidden><div class="search-panel" role="dialog" aria-label="Search the docs">
  <label class="search-field">${icon("magnifyingglass")}<input type="search" placeholder="Search the docs" aria-label="Search"><kbd>esc</kbd></label>
  <div class="search-results" role="listbox"></div></div></div>
<div class="sheet-backdrop" hidden><div class="sheet" role="dialog" aria-label="Navigation">
  <div class="sheet-head"><span>Menu</span><span style="flex:1"></span><button class="icon-btn theme-toggle-sheet theme-toggle" type="button" aria-label="Switch between light and dark">${icon("circle.lefthalf.filled")}</button><button class="icon-btn sheet-close" type="button" aria-label="Close the navigation">${icon("xmark")}</button></div>
  <div class="sheet-tabs">${sheetTabs}</div>
  <nav class="sheet-nav" aria-label="Pages">${navTree(section, route)}</nav>
</div></div>`;
}

function foot() {
  return `<footer class="site-foot"><span>© ${new Date().getFullYear()} Despia · Despia V4 ${escapeHtml(RELEASE.version ?? "")}</span>
<nav><a href="/llms.txt">llms.txt</a><a href="https://despia.com">despia.com</a><a href="${CONSOLE}">Console</a><a href="https://github.com/despia-native">GitHub</a></nav></footer>`;
}

function shell({ route, title, description, body, section, sidebar = true, md }) {
  const fullTitle = route === "/" ? "Despia docs" : `${title} · Despia docs`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description ?? "")}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description ?? "")}">
<link rel="canonical" href="${SITE}${route}">
${md ? `<link rel="alternate" type="text/markdown" href="${md}">` : ""}
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/InterVariable-latin.woff2" as="font" type="font/woff2" crossorigin>
<script src="/theme.js"></script>
<link rel="stylesheet" href="/style.css">
</head>
<body>
${topbar(section?.id)}
<div class="layout${sidebar && section ? "" : " no-sidebar"}">
${sidebar && section ? `<aside class="sidebar" aria-label="${escapeHtml(section.label)} pages">${navTree(section, route)}</aside>` : ""}
${body}
</div>
${foot()}
${overlays(section, route)}
<script src="/app.js" defer></script>
</body>
</html>`;
}

const notice = () => `<div class="notice" data-notify data-topic="dsx" data-endpoint="${WAITLIST}">
  <span class="notice-icon">${icon("flask")}</span>
  <div class="notice-body">
    <div class="notice-row"><p><strong>Research preview.</strong> DSX is available for research purposes. The production and commercial release is coming soon.</p>
    <button class="btn btn-sm" type="button" data-notify-open>${icon("envelope")}Register interest</button></div>
    <form class="notify" hidden novalidate><input class="input" type="email" name="email" placeholder="you@company.com" autocomplete="email" aria-label="Email address" required><button class="btn btn-sm btn-accent" type="submit">Notify me</button></form>
    <p class="notify-msg" hidden aria-live="polite"></p>
  </div>
</div>`;

function articlePage({ route, title, description, html, headings, section, mdPath, eyebrow, wide = false, extraTop = "" }) {
  const flat = section?.groups.flatMap((g) => g.pages) ?? [];
  const at = flat.findIndex(([r]) => r === route);
  const prev = at > 0 ? flat[at - 1] : null;
  const next = at >= 0 && at < flat.length - 1 ? flat[at + 1] : null;
  const toc = headings.filter((h) => h.level <= 3);
  const ask = encodeURIComponent(`Read ${SITE}${mdPath} so I can ask questions about it.`);
  const body = `<main class="main${wide ? " wide" : ""}" id="content">
<article class="article">
  <div class="breadcrumb"><span class="eyebrow">${escapeHtml(eyebrow ?? "")}</span>
    <div class="page-actions">
      <div class="split"><button class="btn btn-sm" type="button" data-copy-page="${mdPath}">${icon("doc.on.doc")}<span>Copy page</span></button><a class="btn btn-sm" href="${mdPath}" aria-label="View this page as Markdown">${icon("chevron.down")}</a></div>
      <a class="btn btn-sm" href="https://claude.ai/new?q=${ask}" rel="noopener">${icon("sparkles")}<span>Ask AI</span></a>
    </div>
  </div>
  <h1>${inline(title)}</h1>
  ${description ? `<p class="lede">${inline(description)}</p>` : ""}
  ${section?.id === "dsx" ? notice() : ""}
  ${extraTop}
  <div class="prose">${html}</div>
  ${prev || next ? `<nav class="pager" aria-label="Previous and next">${prev ? `<a class="prev" href="${prev[0]}"><small>Previous</small><span>${escapeHtml(prev[1])}</span></a>` : ""}${next ? `<a class="next" href="${next[0]}"><small>Next</small><span>${escapeHtml(next[1])}</span></a>` : ""}</nav>` : ""}
  <div class="page-foot"><span>Despia V4 ${escapeHtml(RELEASE.version ?? "")}</span><a href="https://github.com/despia-native/docs/blob/main/content-v2${route === "/" ? "/index" : route}.md">Edit this page</a></div>
</article>
${toc.length >= 2 ? `<nav class="toc" aria-label="On this page"><p class="toc-title">${icon("text.alignleft")}On this page</p><ul>${toc.map((h) => `<li><a class="${h.level === 3 ? "l3" : ""}" href="#${h.id}">${escapeHtml(h.title)}</a></li>`).join("")}</ul>
<div class="toc-extra"><a href="${mdPath}">${icon("doc.plaintext")}View as Markdown</a><a href="/dsx/agents">${icon("terminal")}Use with your agent</a></div></nav>` : ""}
</main>`;
  return shell({ route, title, description, body, section, md: mdPath });
}

// ── write helpers ──────────────────────────────────────────────────────────────────────────────────
function writeRoute(route, html) {
  const dir = join(out, route === "/" ? "" : route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}
const mdUrl = (route) => (route === "/" ? "/index.md" : `${route}.md`);
function writeMd(route, text) {
  const file = join(out, mdUrl(route).slice(1));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
function record({ route, title, description, section, markdown, headings, featured = false }) {
  exportPages.push({ slug: route === "/" ? "index" : route.slice(1), url: route, title, description: description ?? "", section: section ?? "home",
    headings: headings.map(({ id, title: t, level }) => ({ id, title: t, level })), markdown });
  searchRows.push({ url: route, title, description: description ?? "", section: ({ dsx: "DSX", convert: "Convert", packages: "Packages", ship: "Build and ship" })[section] ?? "Despia docs",
    headings: headings.map((h) => h.title), text: markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#*`>|_\[\]()-]/g, " ").replace(/\s+/g, " ").slice(0, 1600), featured });
}

// ── content pages ──────────────────────────────────────────────────────────────────────────────────
function contentFile(route) {
  const f = join(CONTENT, route === "/" ? "index.md" : `${route.slice(1)}.md`);
  const g = join(CONTENT, route.slice(1), "index.md");
  return existsSync(f) ? f : existsSync(g) ? g : null;
}

for (const page of allPages()) {
  if (page.route === "/packages" || page.route === "/app-review") continue;
  const section = sectionOf(page.route);
  const file = contentFile(page.route);
  let meta = { title: page.title, description: page.description };
  let body = `::: note Being written\nThis page is part of the new Despia V4 docs and is being written now.\n:::\n`;
  if (file) { const fm = parseFrontMatter(readFileSync(file, "utf8")); meta = { ...meta, ...fm.meta }; body = fm.body; }
  const ctx = {};
  const { html, headings } = renderMarkdown(body, ctx);
  writeRoute(page.route, articlePage({ route: page.route, title: meta.title, description: meta.description, html, headings, section, mdPath: mdUrl(page.route), eyebrow: `${section.label} · ${page.group}` }));
  writeMd(page.route, `# ${meta.title}\n\n${meta.description ? `> ${meta.description}\n\n` : ""}${body}`);
  record({ route: page.route, title: meta.title, description: meta.description, section: section.id, markdown: body, headings, featured: Boolean(file) && page.route.split("/").length <= 3 });
}

// ── packages ───────────────────────────────────────────────────────────────────────────────────────
const { buildPackages, packagesNav } = await import("./packages.mjs");
buildPackages({ shell, articlePage, writeRoute, writeMd, record, section: SECTIONS.find((s) => s.id === "packages") });

// ── home ───────────────────────────────────────────────────────────────────────────────────────────
const { homePage } = await import("./home.mjs");
writeRoute("/", shell({ route: "/", title: "Despia docs", description: "Despia V4: build real native apps with DSX, or convert the web app you already have.", body: homePage(), section: null, sidebar: false, md: "/index.md" }));
const homeMd = readFileSync(join(CONTENT, "index.md"), "utf8");
writeMd("/", homeMd);
record({ route: "/", title: "Despia docs", description: "Despia V4: build real native apps with DSX, or convert the web app you already have.", section: "home", markdown: homeMd, headings: [] });

// ── assets + machine outputs ───────────────────────────────────────────────────────────────────────
for (const f of ["style.css", "app.js", "theme.js", "favicon.svg"]) copyFileSync(join(here, f), join(out, f));
mkdirSync(join(out, "fonts"), { recursive: true });
const fontSrc = [join(repo, "dist", "fonts"), join(repo, "public", "fonts")].find((d) => existsSync(join(d, "InterVariable-latin.woff2")));
if (fontSrc) for (const f of readdirSync(fontSrc)) copyFileSync(join(fontSrc, f), join(out, "fonts", f));
else if (existsSync(join(here, "fonts"))) for (const f of readdirSync(join(here, "fonts"))) copyFileSync(join(here, "fonts", f), join(out, "fonts", f));

writeFileSync(join(out, "search.json"), JSON.stringify(searchRows));
writeFileSync(join(out, "docs-index.json"), JSON.stringify({
  format: "despia-docs-index", version: 1, release: RELEASE.version ?? null, site: SITE, generated: new Date().toISOString(),
  sections: { dsx: "DSX (research preview)", convert: "Convert", packages: "Packages", ship: "Build and ship", home: "Home" },
  pages: exportPages,
}, null, 0));
const llms = ["# Despia docs", "", "> Despia V4: build real native iOS, Android and web apps with DSX, or convert an existing web app. Every page has a Markdown twin at <url>.md.", ""];
for (const s of [...SECTIONS.map((x) => x.id), "home"]) {
  const rows = exportPages.filter((p) => p.section === s);
  if (!rows.length) continue;
  llms.push(`## ${({ dsx: "DSX", convert: "Convert", packages: "Packages", ship: "Build and ship", home: "Start" })[s]}`, "");
  for (const p of rows) llms.push(`- [${p.title}](${SITE}${mdUrl(p.url)})${p.description ? `: ${p.description}` : ""}`);
  llms.push("");
}
writeFileSync(join(out, "llms.txt"), llms.join("\n"));
console.log(`built ${exportPages.length} pages -> ${out}`);
