#!/usr/bin/env node
//
//  dsx-compile.mjs - the Despia V4 docs as a DSX app, built from the SAME sources as the static preview:
//    site/ia.mjs (the IA), content-v2/**/*.md (the pages), data/packages.json (the catalog).
//
//  The look is the CONSOLE's (owner 2026-10-10: "the console's own custom design looks stunning"): its frame
//  (scaffold shell="automatic", SidebarList with the switcher pinned on top and the appearance row at the foot, the
//  sections; the tab bar on a phone), its page header (NavBar large with a description), its notices (Callout), its
//  cards (ItemCard in adaptive grids), its package explorer (searchbar, scopeBar, a ListGroup header per category),
//  its product page (ProductHeader, ListGroups), its search (CommandPalette, cmd+K) and its long form (<markdown>, the
//  way the console's Help reads an article). Nothing here restyles a stock component; Components/DocsShell.css only
//  sets the reading width of an article.
//
//    node site/dsx-compile.mjs            # writes Components/v2/*.dsx and merges the routes into dsx.config.json
//    node site/dsx-compile.mjs --only a,b # only these routes (fast iteration builds); the rest of the config untouched
//
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontMatter, renderMarkdown, slugify } from "./md.mjs";
import { SECTIONS, sectionOf, allPages } from "./ia.mjs";
import { HOME_SAMPLE } from "./home.mjs";
import { loadPackages, groupOf, GROUP_ORDER } from "../scripts/packages-lib.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(repo, "Components", "v2");
const CONTENT = join(repo, "content-v2");
const onlyAt = process.argv.indexOf("--only");
const ONLY = onlyAt > 0 ? new Set(process.argv[onlyAt + 1].split(",")) : null;
const RELEASE = JSON.parse(readFileSync(join(repo, "data", "release.json"), "utf8"));
const ICONS = JSON.parse(readFileSync(join(repo, "data", "icons.json"), "utf8"));
const WAITLIST = "https://api.despia.com/v1/waitlist";

// ── escaping ────────────────────────────────────────────────────────────────────────────────────────
// a value carried inside a code body (<variable>, <script>): JSON, with every character XML or the linter would read
// (< > & { } and the `dsx.` head) written as a \u escape, so the bytes are inert text in the document
const jsLiteral = (v) => JSON.stringify(v).replace(/"(?:[^"\\]|\\.)*"/g, (str) => str
  .replace(/[<>&{}]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`)
  .replace(/dsx\./g, "dsx\\u002e"));
// an attribute value: XML-escaped, and no {{ }} hole by accident
const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\{\{/g, "{ {");

// ── the docs' markdown subset -> DSX extended markdown (OpenSource/Documentation/guides/markdown.md) ─────────────
//   ::: note|tip|warning Title  -> :::note{title="Title"}       (a Callout)
//   ::: code-group              -> ::::tabs + :::tab{title=""}   (MarkdownTabs, one CodeBlock per tab)
//   ::: cards                   -> ::link-card{href title description}
//   ::: steps                   -> its ### headings numbered
//   ```dsx title="x" fragment   -> ```dsx title="x"              (a CodeBlock; the kernel's grammar colours it)
export function toDsxMarkdown(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  const stack = [];
  let step = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = /^(\s*)(```+)(\S*)(.*)$/.exec(line);
    if (fence) {
      const meta = fence[4].replace(/\bfragment\b/, "").trim();
      out.push(`${fence[1]}${fence[2]}${fence[3]}${meta ? " " + meta : ""}`);
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[2])) { out.push(lines[i]); i++; }
      if (i < lines.length) { out.push(lines[i]); i++; }
      continue;
    }
    const open = /^:::\s*(\S+)\s*(.*)$/.exec(line);
    if (open && line.trim() !== ":::") {
      const [, kind, arg] = open;
      i++;
      if (kind === "code-group") {
        const tabs = [];
        while (i < lines.length && lines[i].trim() !== ":::") {
          const f = /^(```+)(\S*)(.*)$/.exec(lines[i]);
          if (f) {
            const title = /title="([^"]+)"/.exec(f[3])?.[1] ?? f[2];
            const body = [];
            i++;
            while (i < lines.length && !lines[i].startsWith(f[1])) { body.push(lines[i]); i++; }
            i++;
            tabs.push({ title, lang: f[2], body });
          } else i++;
        }
        i++;
        out.push("::::tabs");
        for (const t of tabs) out.push(`:::tab{title="${t.title}"}`, "```" + t.lang, ...t.body, "```", ":::");
        out.push("::::");
        continue;
      }
      if (kind === "cards") {
        while (i < lines.length && lines[i].trim() !== ":::") {
          const c = /^-\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\{[\w.]+\})?\s*(.*)$/.exec(lines[i].trim());
          if (c) out.push(`::link-card{href="${c[2]}" title="${c[1].replace(/`/g, "")}" description="${c[3].replace(/`/g, "").replace(/"/g, "'")}"}`, "");
          i++;
        }
        i++;
        continue;
      }
      if (kind === "steps") { stack.push("steps"); step = 0; continue; }
      const tone = ["note", "tip", "warning"].includes(kind) ? kind : "note";
      out.push(arg ? `:::${tone}{title="${arg.replace(/"/g, "'")}"}` : `:::${tone}`);
      stack.push("callout");
      continue;
    }
    if (line.trim() === ":::" && stack.length) {
      const top = stack.pop();
      if (top === "callout") out.push(":::");
      i++;
      continue;
    }
    if (stack.includes("steps") && /^###\s+/.test(line)) { step += 1; out.push(line.replace(/^###\s+/, `### ${step}. `)); i++; continue; }
    out.push(line);
    i++;
  }
  return out.join("\n");
}

// ── names ───────────────────────────────────────────────────────────────────────────────────────────
const compName = (route) => "V2" + (route === "/" ? "Home" : route.split("/").filter(Boolean)
  .map((s) => s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase())).join("_"));

// ── the frame's data: sections, rows, the search palette ──────────────────────────────────────────────
const pkgs = loadPackages().packages.filter((p) => p.listed !== false && !/\/Modules\/(Backend|Http)$/.test(p.path));
const parentOf = (p) => (/\/Modules\//.test(p.path) ? p.path.split("/Modules/").slice(-2)[0].split("/").pop() : null);
const titleOf = (p) => (parentOf(p) ? `${p.title} (${parentOf(p)})` : p.title);
const SECTION_ICON = { dsx: "chevron.left.forwardslash.chevron.right", convert: "globe", packages: "shippingbox", ship: "paperplane" };
const GROUP_ICON = (g) => ICONS.groups[g] ?? "shippingbox";
const PAGE_ICON = {
  "/dsx": "sparkles", "/dsx/quickstart": "bolt", "/dsx/project": "folder", "/dsx/documents": "doc.text", "/dsx/data": "curlybraces",
  "/dsx/styling": "paintbrush", "/dsx/attributes": "tag", "/dsx/native-ui": "square.grid.2x2", "/dsx/navigation": "arrow.triangle.turn.up.right.diamond",
  "/dsx/packages": "shippingbox", "/dsx/platforms": "iphone", "/dsx/cli": "terminal", "/dsx/console": "macwindow", "/dsx/agents": "sparkles",
  "/dsx/agents/skills": "book", "/convert": "globe", "/convert/quickstart": "bolt", "/convert/native-features": "curlybraces",
  "/convert/react": "chevron.left.forwardslash.chevron.right", "/convert/detect": "safari", "/convert/from-v3": "arrow.up.circle",
  "/ship": "paperplane", "/ship/app-store-connect": "key", "/ship/google-play": "key", "/ship/builds": "hammer", "/ship/releases": "square.stack",
  "/app-review": "checkmark.shield",
};
const navData = {
  areas: [{ id: "home", title: "Home", icon: "house", path: "/" }].concat(SECTIONS.map((s) => ({ id: s.id, title: s.id === "ship" ? "Ship" : s.label, icon: SECTION_ICON[s.id], path: s.href }))),
  groups: SECTIONS.flatMap((s) => s.id === "packages"
    ? GROUP_ORDER.map((g) => ({ id: `packages-${g}`, section: "packages", title: g,
      rows: pkgs.filter((p) => p.published && groupOf(p) === g).sort((a, b) => titleOf(a).localeCompare(titleOf(b)))
        .map((p) => ({ id: p.url, title: titleOf(p), icon: GROUP_ICON(g), path: p.url })) })).filter((g) => g.rows.length)
    : s.groups.map((g) => ({ id: `${s.id}-${g.title}`, section: s.id, title: g.title,
      rows: g.pages.map(([route, title]) => ({ id: route, title, icon: PAGE_ICON[route] ?? "doc.text", path: route })) }))),
  palette: allPages().map((p) => ({ id: p.route, title: p.title, subtitle: p.description, icon: PAGE_ICON[p.route] ?? "doc.text",
    group: SECTIONS.find((s) => s.id === p.section).label, keywords: [p.group], path: p.route }))
    .concat(pkgs.map((p) => ({ id: p.url, title: titleOf(p), subtitle: p.summary, icon: "shippingbox", group: "Packages", keywords: [p.command], path: p.url }))),
};

function shell() {
  return `<!-- DocsShell: the docs' one frame, the console's own (despia-native/platform Components/Shell.dsx): ONE declaration,
     two forms. A regular window draws the stock SidebarList beside the page, the Despia switcher pinned at its top (the
     docs' areas, as the console's workspace switcher), the areas, the current area's groups, and Appearance pinned at its
     foot; a compact window (a phone) draws the tab bar from the areas (collapse="tabs"), each area's root page listing
     its pages. Each page brings its own NavBar (title, description, bar actions) as the first child of the slot.
     cmd+K is the console's CommandPalette over every page and package.
     GENERATED by site/dsx-compile.mjs (the rows come from site/ia.mjs and data/packages.json): edit the generator.
     <DocsShell area="dsx" route="/dsx/quickstart"> <NavBar …/> …page… </DocsShell> -->
<scaffold shell="automatic" collapse="tabs" sidebarLabel="Despia docs" contentLabel="Page">
  <head>
    <attribute as="area" default="'home'"/>
    <attribute as="route" default="'/'"/>
    <attribute as="md" default="''"/>
    <attribute as="toc" default="'[]'"/>

    <!-- nav reads no attribute, so it is a plain variable (evaluated once): a computed variable is re-evaluated on every
         read, and a repeat reads it once per row (the build profile: 74% of a docs build was re-evaluated computed
         bodies). The rest depends on the page's attributes, which a plain variable's first value cannot see. -->
    <variable as="nav">return docsNav()</variable>
    <variable as="areaTitle" computed="true">
      const hit = dsx.variable.nav.areas.find(a => a.id == dsx.attribute.area)
      return hit ? hit.title : 'Home'
    </variable>
    <variable as="areaMenu" computed="true">
      return [{ header: true, title: 'Despia V4 ${attr(RELEASE.version ?? "")}' }].concat(dsx.variable.nav.areas.map(a => ({
        title: a.title, icon: a.id == dsx.attribute.area ? 'checkmark' : a.icon, action: 'route.reset', args: { path: a.path } })))
    </variable>
    <variable as="tocRows" computed="true">
      const rows = JSON.parse(String(dsx.attribute.toc || '[]'))
      return rows.map(r => ({ id: r.id, title: r.title, href: '#' + r.id }))
    </variable>
    <variable as="groups" computed="true">return dsx.variable.nav.groups.filter(g => g.section == dsx.attribute.area)</variable>
    <variable as="areaPath" computed="true">
      const hit = dsx.variable.nav.areas.find(a => a.id == dsx.attribute.area)
      return hit ? hit.path : '/'
    </variable>
    <variable as="appearanceMenu">
      return [
        { header: true, title: 'Appearance' },
        { title: 'System', icon: 'circle.lefthalf.filled', action: 'appearance.set', args: { mode: 'system' } },
        { title: 'Light', icon: 'sun.max', action: 'appearance.set', args: { mode: 'light' } },
        { title: 'Dark', icon: 'moon', action: 'appearance.set', args: { mode: 'dark' } }
      ]
    </variable>

    <action as="open" input:path="dsx.this.value">dsx.module.route.select({ path: path })</action>

    <script>
      function docsNav() { return ${jsLiteral(navData)} }
    </script>
  </head>

  <SidebarList pane="sidebar" value="{{ dsx.attribute.route }}" a11yLabel="Documentation" on:change="dsx.action.open()">
    <menu slot="top" menu="{{ dsx.variable.areaMenu }}">
      <SettingsRow icon="despia.logo.mono" iconStyle="plain" title="Despia Docs" subtitle="{{ dsx.variable.areaTitle }}" valueIcon="chevron.up.chevron.down" tappable="true"/>
    </menu>

    <SidebarSection title="Docs" tab="items">
      <SidebarItem repeat="dsx.variable.nav.areas" key="id" value="{{ dsx.this.path }}" icon="{{ dsx.this.icon }}" title="{{ dsx.this.title }}"/>
    </SidebarSection>
    <SidebarSection repeat="dsx.variable.groups" key="id" title="{{ dsx.this.title }}" root="{{ dsx.variable.areaPath }}">
      <SidebarItem repeat="dsx.this.rows" key="id" value="{{ dsx.this.path }}" icon="{{ dsx.this.icon }}" title="{{ dsx.this.title }}"/>
    </SidebarSection>

    <menu slot="bottom" menu="{{ dsx.variable.appearanceMenu }}">
      <SettingsRow icon="circle.lefthalf.filled" title="Appearance" valueIcon="chevron.up.chevron.down" tappable="true"/>
    </menu>
  </SidebarList>

  <scroll pane="content">
    <slot/>
  </scroll>

  <!-- On this page: the scaffold's own inspector column on a wide window, a ListGroup of the page's sections -->
  <scroll pane="inspector">
    <ListGroup header="On this page" visible-if="dsx.variable.tocRows.length &gt;= 2">
      <SettingsRow repeat="dsx.variable.tocRows" key="id" title="{{ dsx.this.title }}" href="{{ dsx.this.href }}" lines="2"/>
    </ListGroup>
    <ListGroup header="This page" visible-if="dsx.attribute.md != ''">
      <SettingsRow icon="doc.plaintext" title="View as Markdown" href="{{ dsx.attribute.md }}" chevron="true"/>
      <SettingsRow icon="sparkles" title="Use with your agent" href="/dsx/agents" chevron="true"/>
    </ListGroup>
  </scroll>

  <CommandPalette present="dsx.global.docsSearch" commands="dsx.variable.nav.palette" label="Search the docs"/>
</scaffold>
`;
}

// ── a page ──────────────────────────────────────────────────────────────────────────────────────────
function pageMenu(md) {
  const ask = encodeURIComponent(`Read https://docs.despia.com${md} so I can ask questions about it.`);
  return `[{ header: true, title: 'This page' }, { title: 'View as Markdown', icon: 'doc.plaintext', href: '${md}' }, { separator: true }, { header: true, title: 'Ask about it in' }, { title: 'Claude', icon: 'sparkles', href: 'https://claude.ai/new?q=${ask}' }, { title: 'ChatGPT', icon: 'bubble.left', href: 'https://chatgpt.com/?q=${ask}' }]`;
}
const navBar = ({ title, description, md, large = true }) => `  <NavBar title="${attr(title)}"${large ? ` large="true" description="${attr(description)}"` : ""}>
    <button slot="trailing" icon="magnifyingglass" a11yLabel="Search the docs" shortcut="cmd+k" on:tap="dsx.action.search()"/>
    <menu slot="trailing" menu="{{ ${pageMenu(md)} }}">
      <button icon="ellipsis.circle" a11yLabel="Page options"/>
    </menu>
  </NavBar>`;
const notice = (topic, title, message, action) => `  <Callout class="page-notice" tone="info" title="${attr(title)}" message="${attr(message)}" action="${attr(action)}" on:action="dsx.variable.notify = true"/>
  <sheet detents="content" present="dsx.variable.notify" title="${attr(action)}" close="trailing" on:dismiss="dsx.variable.notify = false">
    <NotifyForm topic="${attr(topic)}"/>
  </sheet>`;

function page({ route, area, title, description, md, body, head = "", noticeFor = null, large = true, toc = [] }) {
  return `<!-- GENERATED by site/dsx-compile.mjs from ${route === "/" ? "content-v2/index.md" : `content-v2${route}.md`}: edit the source, not this file. -->
<DocsShell area="${area}" route="${route}" md="${md}" toc="${attr(JSON.stringify(toc))}">
  <head>
    <variable as="notify">return false</variable>
${head}    <action as="search">dsx.global.docsSearch = true</action>
  </head>
${navBar({ title, description, md, large })}
${noticeFor ? notice(...noticeFor) + "\n" : ""}${body}
</DocsShell>
`;
}

const article = (name) => `  <vstack class="doc-article">
    <markdown bind="dsx.variable.${name}" copyCode="true" externalLinks="true"/>
  </vstack>`;
const mdVar = (name, md) => `    <variable as="${name}">return ${jsLiteral(md)}</variable>\n`;

// a long page split at its ## headings: each section is its own <markdown> in a stack carrying the heading's id, so
// "On this page" links to it (#id) and the browser's own find and anchors work
function sectioned(md) {
  const lines = md.split("\n");
  const parts = [{ id: "", title: "", lines: [] }];
  let fence = null;
  for (const line of lines) {
    const f = /^(\s*)(```+|::::+)/.exec(line);
    if (fence === null && /^```/.test(line.trim())) fence = line.trim().match(/^`+/)[0];
    else if (fence !== null && line.trim().startsWith(fence)) fence = null;
    const h = fence === null ? /^##\s+(.+?)\s*$/.exec(line) : null;
    if (h && !line.startsWith("###")) parts.push({ id: slugify(h[1]), title: h[1].replace(/`/g, ""), lines: [line] });
    else parts[parts.length - 1].lines.push(line);
  }
  const used = new Set();
  for (const p of parts) { let id = p.id, n = 2; while (id && used.has(id)) id = `${p.id}-${n++}`; p.id = id; used.add(id); }
  const live = parts.filter((p) => p.lines.join("").trim() !== "");
  return {
    head: live.map((p, i) => mdVar(`md${i}`, p.lines.join("\n"))).join(""),
    body: `  <vstack class="doc-article">\n` + live.map((p, i) => p.id
      ? `    <vstack id="${p.id}" class="doc-section">\n      <markdown bind="dsx.variable.md${i}" copyCode="true" externalLinks="true"/>\n    </vstack>`
      : `    <markdown bind="dsx.variable.md${i}" copyCode="true" externalLinks="true"/>`).join("\n") + `\n  </vstack>`,
    toc: live.filter((p) => p.id).map((p) => ({ id: p.id, title: p.title })),
  };
}

const DSX_NOTICE = ["dsx", "Research preview", "DSX is available for research purposes. The production and commercial release is coming soon.", "Register interest"];

// ── write ───────────────────────────────────────────────────────────────────────────────────────────
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const routes = [];
const want = (r) => ONLY === null || ONLY.has(r);
const emit = (route, src, meta) => {
  const name = compName(route);
  writeFileSync(join(OUT, `${name}.dsx`), src);
  routes.push({ path: route, component: `docs.${name}`, meta, tabRoot: [ "/", "/dsx", "/convert", "/packages", "/ship"].includes(route) || undefined });
};
writeFileSync(join(repo, "Components", "DocsShell.dsx"), shell());

// content pages
for (const p of allPages()) {
  if (p.route === "/packages" || p.route === "/app-review" || !want(p.route)) continue;
  const f = [join(CONTENT, `${p.route.slice(1)}.md`), join(CONTENT, p.route.slice(1), "index.md")].find(existsSync);
  const { meta, body } = f ? parseFrontMatter(readFileSync(f, "utf8")) : { meta: {}, body: "" };
  const title = meta.title ?? p.title;
  const description = meta.description ?? p.description;
  const sec = sectioned(toDsxMarkdown(body));
  emit(p.route, page({ route: p.route, area: p.section, title, description, md: `${p.route}.md`, toc: sec.toc,
    head: sec.head, body: sec.body, noticeFor: p.section === "dsx" ? DSX_NOTICE : null }), { title, description });
}

// home: the vision, the two routes as the console's cards, the sample, popular packages, build and ship
if (want("/")) {
  const tiles = ["haptic", "appleauth", "push", "revenuecat"].map((c) => pkgs.find((p) => p.command === c || p.slug === c)).filter(Boolean);
  const card = (p) => ({ id: p.url, title: titleOf(p), summary: p.summary, brand: p.icon?.brand ?? "", icon: p.icon?.symbol ?? GROUP_ICON(groupOf(p)), path: p.url });
  const sample = "## One document, three languages\n\nA screen is one `.dsx` file: markup for the structure, a `<style>` sheet in standard CSS, and JavaScript in its actions and holes. The same document runs on iOS, Android and the web.\n\n```dsx title=\"Components/Counter.dsx\"\n" + HOME_SAMPLE + "\n```";
  const head = mdVar("sample", sample)
    + `    <variable as="routes">return ${jsLiteral([
      { id: "dsx", title: "Build a native app with DSX", summary: "Start from nothing and build the whole app in DSX: screens, navigation, data and native features, for every platform at once.", icon: "chevron.left.forwardslash.chevron.right", status: "Research preview", statusIcon: "flask", path: "/dsx" },
      { id: "convert", title: "Convert your web app", summary: "Put the web app you already have in a native iOS and Android app, and call native features from its JavaScript.", icon: "globe", status: "Available today", statusIcon: "checkmark.circle.fill", path: "/convert" },
    ])}</variable>\n`
    + `    <variable as="features">return ${jsLiteral(tiles.map(card))}</variable>\n`
    + `    <variable as="ship">return ${jsLiteral([
      { id: "asc", title: "App Store Connect key", summary: "The API key Despia uses to sign and upload iOS builds.", brand: "appstore.logo", icon: "", path: "/ship/app-store-connect" },
      { id: "play", title: "Google Play service account", summary: "The service account Despia uses to upload Android builds.", brand: "google.play.logo", icon: "", path: "/ship/google-play" },
      { id: "cli", title: "The despia CLI", summary: "Create, run, lint, build and ship from the terminal.", brand: "", icon: "terminal", path: "/dsx/cli" },
      { id: "agents", title: "Use your AI agent", summary: "Connect mcp.despia.com and install the agent skills.", brand: "", icon: "sparkles", path: "/dsx/agents" },
    ])}</variable>\n`
    + `    <action as="go" input:path="dsx.this.path">dsx.module.route.push({ path: path })</action>\n`;
  const body = `  <grid bind="dsx.variable.routes" key="id" columns="adaptive" minimum="300" scroll="false">
    <ItemCard title="{{ dsx.this.title }}" summary="{{ dsx.this.summary }}" icon="{{ dsx.this.icon }}" status="{{ dsx.this.status }}" statusIcon="{{ dsx.this.statusIcon }}" href="{{ dsx.this.path }}"/>
  </grid>
  <vstack class="doc-article doc-spaced">
    <markdown bind="dsx.variable.sample" copyCode="true"/>
  </vstack>
  <ListGroup header="Native features" footer="Every package has one example for a DSX app and one for a converted web app."/>
  <grid bind="dsx.variable.features" key="id" columns="adaptive" minimum="300" scroll="false">
    <ItemCard title="{{ dsx.this.title }}" summary="{{ dsx.this.summary }}" brand="{{ dsx.this.brand }}" icon="{{ dsx.this.icon }}" href="{{ dsx.this.path }}"/>
  </grid>
  <ListGroup header="Build and ship"/>
  <grid bind="dsx.variable.ship" key="id" columns="adaptive" minimum="300" scroll="false">
    <ItemCard title="{{ dsx.this.title }}" summary="{{ dsx.this.summary }}" brand="{{ dsx.this.brand }}" icon="{{ dsx.this.icon }}" href="{{ dsx.this.path }}"/>
  </grid>`;
  const title = "Despia V4";
  const description = "Build real native apps for iOS, Android and the web from one document, or convert the web app you already have. AI agents can read, change and check the whole app.";
  emit("/", page({ route: "/", area: "home", title, description, md: "/index.md", head, body }), { title: "Despia docs", description });
}

// the package catalog: the console's own Package Explorer arrangement
if (want("/packages")) {
  const items = pkgs.slice().sort((a, b) => (GROUP_ORDER.indexOf(groupOf(a)) - GROUP_ORDER.indexOf(groupOf(b))) || (Number(b.published) - Number(a.published)) || titleOf(a).localeCompare(titleOf(b))).map((p) => ({ id: p.url, title: titleOf(p), summary: p.summary, category: groupOf(p), brand: p.icon?.brand ?? "", symbol: p.icon?.symbol ?? GROUP_ICON(groupOf(p)),
    status: p.published ? (p.maturity === "alpha" ? "Alpha" : "Available") : "Coming soon", statusIcon: p.published ? (p.maturity === "alpha" ? "flask" : "checkmark.circle.fill") : "clock",
    search: `${p.title} ${p.command} ${p.summary}`.toLowerCase(), path: p.url }));
  const cats = ["All"].concat(GROUP_ORDER.filter((g) => items.some((i) => i.category === g)));
  const head = `    <variable as="query">return ''</variable>
    <variable as="category">return 'All'</variable>
    <variable as="items">return ${jsLiteral(items)}</variable>
    <variable as="categories">return '${cats.join(",")}'</variable>
    <variable as="compact" computed="true">return dsx.screen.width &lt; 760</variable>
    <variable as="sections" computed="true">
      const q = String(dsx.variable.query || '').trim().toLowerCase()
      const rows = dsx.variable.items.filter(i => (dsx.variable.category == 'All' || i.category == dsx.variable.category) &amp;&amp; (q == '' || i.search.includes(q)))
      const names = rows.map(r => r.category).filter((x, i, all) => all.indexOf(x) == i)
      return names.map(n => ({ id: n, title: n, rows: rows.filter(r => r.category == n) }))
    </variable>
    <variable as="noMatch" computed="true">return dsx.variable.sections.length == 0</variable>
`;
  const body = `  <searchbar bind="dsx.variable.query" placeholder="Search ${items.length} packages"/>
  <scopeBar bind="dsx.variable.category" options="{{ dsx.variable.categories }}" visible-if="!dsx.variable.compact"/>
  <ListGroup visible-if="dsx.variable.compact">
    <SettingsRow icon="line.3.horizontal.decrease.circle" title="Category"><picker aria-label="Category" bind="dsx.variable.category" options="{{ dsx.variable.categories }}"/></SettingsRow>
  </ListGroup>
  <ListGroup visible-if="dsx.variable.noMatch">
    <SettingsRow icon="magnifyingglass" title="No package matches" subtitle="Try another word or category."/>
  </ListGroup>
  <stack repeat="dsx.variable.sections" key="id" visible-if="!dsx.variable.compact">
    <ListGroup header="{{ dsx.this.title }}"/>
    <grid bind="dsx.this.rows" key="id" columns="adaptive" minimum="300" scroll="false">
      <ItemCard title="{{ dsx.this.title }}" summary="{{ dsx.this.summary }}" brand="{{ dsx.this.brand }}" icon="{{ dsx.this.symbol }}"
                statusIcon="{{ dsx.this.statusIcon }}" status="{{ dsx.this.status }}" href="{{ dsx.this.path }}"/>
    </grid>
  </stack>
  <ListGroup repeat="dsx.variable.sections" key="id" header="{{ dsx.this.title }}" visible-if="dsx.variable.compact">
    <SettingsRow repeat="dsx.this.rows" key="id" title="{{ dsx.this.title }}" subtitle="{{ dsx.this.summary }}" lines="2" chevron="true" href="{{ dsx.this.path }}">
      <IconTile slot="leading" brand="{{ dsx.this.brand }}" icon="{{ dsx.this.symbol }}" name="{{ dsx.this.title }}"/>
    </SettingsRow>
  </ListGroup>`;
  const title = "Packages";
  const description = "Native features for your app, each with one API that works the same in a DSX app and in a converted web app.";
  emit("/packages", page({ route: "/packages", area: "packages", title, description, md: "/packages.md", head, body }), { title, description });
}

// one page per package: the console's product page arrangement (ProductHeader, About | At a Glance, then the reference)
const { packageMarkdownFor } = await import("./packages.mjs");
for (const p of pkgs) {
  if (!want(p.url) && !(ONLY && ONLY.has("/packages/*"))) continue;
  const glance = [
    { id: "status", icon: "circle.badge.checkmark", title: "Status", value: p.published ? (p.maturity === "alpha" ? "Alpha" : "Available") : "Coming soon" },
    { id: "platforms", icon: "iphone", title: "Platforms", value: (p.targets ?? []).map((t) => ({ ios: "iOS", android: "Android", web: "Web", macos: "macOS" })[t] ?? t).join(", ") },
    { id: "call", icon: "curlybraces", title: "Call", value: `dsx.module.${p.command}` },
    { id: "group", icon: GROUP_ICON(groupOf(p)), title: "Category", value: groupOf(p) },
  ];
  const md = packageMarkdownFor(p);
  const sec = sectioned(toDsxMarkdown(p.description && md.startsWith(p.description) ? md.slice(p.description.length).trimStart() : md));
  const head = sec.head + `    <variable as="glance">return ${jsLiteral(glance)}</variable>\n`;
  const body = `  <ProductHeader title="${attr(titleOf(p))}" subtitle="${attr(p.summary)}" brand="${attr(p.icon?.brand ?? "")}" icon="${attr(p.icon?.symbol ?? GROUP_ICON(groupOf(p)))}"/>
  <grid columns="adaptive" minimum="420" scroll="false">
    <ListGroup header="About">
      <SettingsRow title="${attr(p.description ?? p.summary)}" lines="12"/>
    </ListGroup>
    <ListGroup header="At a Glance">
      <SettingsRow repeat="dsx.variable.glance" key="id" icon="{{ dsx.this.icon }}" title="{{ dsx.this.title }}" value="{{ dsx.this.value }}"/>
    </ListGroup>
  </grid>
${sec.body}`;
  emit(p.url, page({ route: p.url, area: "packages", title: titleOf(p), description: p.summary, md: `${p.url}.md`, head, body, large: false, toc: sec.toc,
    noticeFor: p.published ? null : [p.slug, "Coming soon", "This package is not available yet. Leave your email and we will tell you when it is.", "Get notified"] }), { title: titleOf(p), description: p.summary });
}

// the routes: v2 rows replace the rows they own, every other row (legacy, migrate, troubleshooting, app-review) stays
const cfgPath = join(repo, "dsx.config.json");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const owned = new Set(routes.map((r) => r.path));
const moved = new Set(Object.keys(JSON.parse(readFileSync(join(repo, "redirects", "v2-moves.json"), "utf8")).moves));
cfg.routes = routes.concat(cfg.routes.filter((r) => !owned.has(r.path) && !moved.has(r.path) && !r.component.startsWith("docs.V2")));
cfg.entry = "V2Home";
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
writeFileSync(join(repo, "Components", "DocsShell.css"), `/*
  DocsShell: the one rule the console has no screen for: a long-form article keeps a reading width. Everything else on a
  docs page is the console's own components, unstyled.
*/
.doc-article { align-items: stretch; max-width: 46rem; }
.doc-spaced { margin-block: var(--dsx-page-header-spacing, 1.5rem); }

/* THE CONSOLE'S OWN PAGE RHYTHM (despia-native/platform Components/HelpSheet.css, owner 2026-10-10): a notice in the
   page's flow keeps the page's spacing token from what follows it; a list group brings its own section spacing. */
.page-notice:not(:has(+ .dsx-list-group)) { margin-block-end: var(--dsx-page-header-spacing, 1.5rem); }

/* CODE COLOURS: the CodeBlock's public knobs (--dsx-codeblock-*, guides/markdown.md "Code blocks") set to the Despia
   editor themes (OpenSource/CodeEditor/src/theme.js, despia-light / despia-dark), so a .dsx sample reads as markup, CSS
   and JavaScript in one block. The tokens are the kernel's own highlight(); only the palette is the docs'. */
.dsx-codeblock, .dsx-codeblock-sheet {
  --dsx-codeblock-keyword: light-dark(#6d28d9, #a78bfa);
  --dsx-codeblock-tag: light-dark(#6d28d9, #a78bfa);
  --dsx-codeblock-string: light-dark(#047857, #34d399);
  --dsx-codeblock-regex: light-dark(#047857, #34d399);
  --dsx-codeblock-number: light-dark(#1d4ed8, #60a5fa);
  --dsx-codeblock-call: light-dark(#1d4ed8, #60a5fa);
  --dsx-codeblock-attribute: light-dark(#1d4ed8, #60a5fa);
  --dsx-codeblock-type: light-dark(#1d4ed8, #60a5fa);
  --dsx-codeblock-literal: light-dark(#4c1d95, #c4b5fd);
  --dsx-codeblock-meta: light-dark(#4c1d95, #c4b5fd);
  --dsx-codeblock-comment: light-dark(#737373, #8a8a8a);
}

/* WORKAROUND, delete when the framework's prose layout lands (wip/claude/dsx-web-desktop-polish: "the missing prose /
   long-form layout rules"): a <markdown> block is not on the page's content inset yet, so the article takes the inset
   the console's cards and list groups stand on. */
.doc-article { margin-inline: var(--dsx-grid-inset-inline, 20px); }
`);
// ── the renderer-independent outputs, from the same sources (site/build.mjs writes them; this copies them into public/,
//    which the build folds into dist): docs-index.json (the export the general Despia MCP reads), llms.txt, and the
//    Markdown twin of every v2 page at <route>.md and /md/<route>.md (the worker's page fetch reads the latter).
const v2out = join(repo, "dist-v2");
if (existsSync(join(v2out, "docs-index.json"))) {
  const pub = join(repo, "public");
  const index = JSON.parse(readFileSync(join(v2out, "docs-index.json"), "utf8"));
  writeFileSync(join(pub, "docs-index.json"), JSON.stringify(index));
  for (const pg of index.pages) {
    const twin = readFileSync(join(v2out, pg.url === "/" ? "index.md" : `${pg.url.slice(1)}.md`), "utf8");
    for (const f of [join(pub, pg.url === "/" ? "index.md" : `${pg.url.slice(1)}.md`), join(pub, "md", pg.url === "/" ? "index.md" : `${pg.url.slice(1)}.md`)]) {
      mkdirSync(dirname(f), { recursive: true });
      writeFileSync(f, twin);
    }
  }
  const spaces = ["", "## Other spaces", "",
    "- [Legacy (V3)](https://docs.despia.com/legacy/llms.txt): despia-native and the V3 runtime",
    "- [Migration](https://docs.despia.com/migrate/llms.txt): move a V3 app to V4",
    "- [Troubleshooting](https://docs.despia.com/troubleshooting/llms.txt): symptom, cause, fix",
    "- [Releases](https://docs.despia.com/releases/llms.txt): release notes",
    "- [App Review](https://docs.despia.com/app-review/llms.txt): Apple and Google review guidelines", ""];
  writeFileSync(join(pub, "llms.txt"), readFileSync(join(v2out, "llms.txt"), "utf8") + spaces.join("\n"));
  console.log(`[docs.v2] export: public/docs-index.json (${index.pages.length} pages), llms.txt, Markdown twins`);
} else console.warn("[docs.v2] dist-v2/docs-index.json missing: run `node site/build.mjs` first for the export and the twins");
console.log(`[docs.v2] ${routes.length} page(s) -> Components/v2, routes merged into dsx.config.json (${cfg.routes.length} rows)`);
