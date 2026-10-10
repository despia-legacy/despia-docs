//
//  packages.mjs - the package catalog (/packages) and one page per package (/packages/<slug>), from data/packages.json
//  (scripts/sync-packages.mjs, the framework's own despia.package-docs documents). Nothing here is hand written: the
//  status is the manifest's `published` flag, the samples are built from each action's first manifest example.
//  Every package page shows the same call twice: in a DSX document, and from a converted web app (dsx.module in JS).
//
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPackages, groupOf, GROUP_ORDER } from "../scripts/packages-lib.mjs";
import { escapeHtml } from "./highlight.mjs";
import { renderMarkdown } from "./md.mjs";
import { icon, hasIcon } from "./icons.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = JSON.parse(readFileSync(join(repo, "data", "icons.json"), "utf8"));
const PLATFORM = { ios: "iOS", android: "Android", web: "Web", macos: "macOS" };

// a sub-package (Core/Store/Modules/RevenueCat) is named with its parent so two "RevenueCat" rows never look alike;
// the server halves of a package (Modules/Backend, Modules/Http) are not app features: they keep their pages but
// stay out of the catalog grid and the sidebar.
const parentOf = (p) => (/\/Modules\//.test(p.path) ? p.path.split("/Modules/").slice(-2)[0].split("/").pop() : null);
const SERVER_HALF = /\/Modules\/(Backend|Http)$/;
const named = (p) => ({ ...p, title: parentOf(p) ? `${p.title} (${parentOf(p)})` : p.title });
const allPackages = () => loadPackages().packages.filter((p) => p.listed !== false).map(named);
const packages = () => allPackages().filter((p) => !SERVER_HALF.test(p.path));
const available = (p) => p.published === true;

export function iconFor(p) {
  if (p.icon?.brand && hasIcon(p.icon.brand)) return { svg: icon(p.icon.brand), brand: true };
  if (p.icon?.symbol && hasIcon(p.icon.symbol)) return { svg: icon(p.icon.symbol), brand: false };
  const hay = `${p.title} ${p.summary}`.toLowerCase();
  const rule = ICONS.sections?.find?.((r) => new RegExp(r.match).test(hay));
  const name = rule?.icon && hasIcon(rule.icon) ? rule.icon : ICONS.groups[groupOf(p)] ?? "shippingbox";
  return { svg: icon(hasIcon(name) ? name : "shippingbox"), brand: false };
}

export function badge(p) {
  if (!available(p)) return `<span class="badge badge-muted">Soon</span>`;
  if (p.maturity === "alpha") return `<span class="badge badge-amber">Alpha</span>`;
  return "";
}

// a JS literal in the house style: single quotes, unquoted keys, 2-space indent
function lit(v, ind = "") {
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") return `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  if (typeof v !== "object") return String(v);
  const inner = ind + "  ";
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    const flat = `[${v.map((x) => lit(x, inner)).join(", ")}]`;
    return flat.length < 56 ? flat : `[\n${v.map((x) => inner + lit(x, inner)).join(",\n")}\n${ind}]`;
  }
  const keys = Object.keys(v);
  if (!keys.length) return "{}";
  const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
  const flat = `{ ${keys.map((k) => `${key(k)}: ${lit(v[k], inner)}`).join(", ")} }`;
  return flat.length < 56 && !flat.includes("\n") ? flat : `{\n${keys.map((k) => `${inner}${key(k)}: ${lit(v[k], inner)}`).join(",\n")}\n${ind}}`;
}

function samples(p, a) {
  const args = a.examples?.[0]?.args ?? {};
  const hasArgs = Object.keys(args).length > 0;
  const call = `${a.call}(${hasArgs ? lit(args, "    ").trimStart() : ""})`;
  const dsxCall = `${a.call}(${hasArgs ? lit(args, "      ") : ""})`;
  const meaningful = (a.result ?? []).filter((r) => r.name !== "ok");
  const resultVar = meaningful.length ? "const result = await " : "await ";
  const dsx = `<stack>
  <head>
    <action as="run">
      ${resultVar}${dsxCall};
    </action>
  </head>
  <button label="${escapeAttr(labelFor(p, a))}" on:tap="dsx.action.run()"/>
</stack>`;
  const js = `${resultVar}${call.replace(/\n {4}/g, "\n")}`;
  return { dsx, js };
}
const escapeAttr = (s) => s.replace(/"/g, "'");
const labelFor = (p, a) => `${a.name.charAt(0).toUpperCase()}${a.name.slice(1).replace(/([A-Z])/g, " $1").toLowerCase()}`;

export function packageMarkdownFor(p) { return packageMarkdown(p); }

function packageMarkdown(p) {
  const actions = (p.actions ?? []).filter((a) => a.reach === null || (Array.isArray(a.reach) && a.reach.length));
  const PREFER = ["success", "show", "signIn", "login", "purchase", "request", "start", "open", "get", "play", "pick", "share", "scan"];
  const lead = PREFER.map((n) => actions.find((a) => a.name === n && a.examples?.length)).find(Boolean)
    ?? actions.find((a) => a.examples?.length) ?? actions[0];
  const md = [];
  if (p.description) md.push(p.description, "");
  if (lead) {
    const s = samples(p, lead);
    md.push("## Use it", "", `One call, the same in a DSX app and in a converted web app.`, "", "::: code-group",
      "```dsx title=\"DSX\"", s.dsx, "```", "```js title=\"Convert (JavaScript)\"", s.js, "```", ":::", "");
  }
  if (p.whenToUse || p.nativeValue) {
    md.push("## When to use it", "");
    if (p.whenToUse) md.push(p.whenToUse, "");
    if (p.nativeValue) md.push(`**Why native:** ${p.nativeValue}`, "");
  }
  if (actions.length) {
    md.push("## Actions", "");
    for (const a of actions) {
      md.push(`### \`${a.name}\``, "", a.description ?? "", "");
      if (a.params?.length) {
        md.push("| Parameter | Type | Description |", "| :-- | :-- | :-- |");
        for (const x of a.params) md.push(`| \`${x.name}\`${x.optional ? "" : " (required)"} | ${x.type} | ${(x.description ?? "").replace(/\|/g, "\\|")} |`);
        md.push("");
      }
      if (a.result?.length) {
        md.push("| Result | Type | Description |", "| :-- | :-- | :-- |");
        for (const x of a.result) md.push(`| \`${x.name}\` | ${x.type} | ${(x.description ?? "").replace(/\|/g, "\\|")} |`);
        md.push("");
      }
    }
  }
  return md.join("\n");
}

export function packagesNav(route) {
  const all = packages().filter(available);
  const groups = GROUP_ORDER.map((g) => [g, all.filter((p) => groupOf(p) === g).sort((a, b) => a.title.localeCompare(b.title))]).filter(([, l]) => l.length);
  return `<div class="nav-group"><p class="nav-title">Catalog</p><ul class="nav-list">
<li><a class="nav-link" href="/packages"${route === "/packages" ? ' aria-current="page"' : ""}>${icon("square.grid.2x2")}<span class="lbl">All packages</span><span class="nav-count">${packages().length}</span></a></li></ul></div>
<div class="nav-group"><p class="nav-title">Available now</p><ul class="nav-list">`
    + groups.map(([g, list]) => {
      const open = list.some((p) => p.url === route);
      return `<li><details class="nav-sub"${open ? " open" : ""}><summary class="nav-link">${icon(ICONS.groups[g] ?? "shippingbox")}<span class="lbl">${escapeHtml(g)}</span><span class="nav-count">${list.length}</span>${icon("chevron.right", "icon chev")}</summary><ul class="nav-list">`
        + list.map((p) => `<li><a class="nav-link" href="${p.url}"${p.url === route ? ' aria-current="page"' : ""}>${escapeHtml(p.title)}</a></li>`).join("") + `</ul></details></li>`;
    }).join("") + `</ul></div>`;
}

export function buildPackages({ shell, articlePage, writeRoute, writeMd, record, section }) {
  const all = packages();
  const groups = GROUP_ORDER.map((g) => [g, all.filter((p) => groupOf(p) === g).sort((a, b) => (available(b) - available(a)) || a.title.localeCompare(b.title))]).filter(([, l]) => l.length);
  const nAvail = all.filter(available).length;

  // the catalog
  const toolbar = `<div class="pk-toolbar">
  <label class="pk-search">${icon("magnifyingglass")}<input class="input" type="search" placeholder="Filter packages" aria-label="Filter packages"></label>
  <div class="segmented" role="group" aria-label="Status">
    <button type="button" data-status="all" aria-pressed="true">All <span class="n">${all.length}</span></button>
    <button type="button" data-status="available" aria-pressed="false">Available <span class="n">${nAvail}</span></button>
    <button type="button" data-status="soon" aria-pressed="false">Coming soon <span class="n">${all.length - nAvail}</span></button>
  </div>
  <span class="pk-count">${all.length} packages</span>
</div>
<div class="chips" role="group" aria-label="Category"><button class="chip" type="button" data-group="all" aria-pressed="true">All</button>${groups.map(([g, l]) => `<button class="chip" type="button" data-group="${escapeHtml(g)}" aria-pressed="false">${escapeHtml(g)} <span class="n">${l.length}</span></button>`).join("")}</div>`;
  const grid = groups.map(([g, list]) => `<section class="pk-group"><h2 id="${g.toLowerCase().replace(/[^a-z]+/g, "-")}">${escapeHtml(g)} <span class="n">${list.length}</span></h2><div class="pk-grid">`
    + list.map((p) => {
      const ic = iconFor(p);
      return `<a class="pk" href="${p.url}" data-status="${available(p) ? "available" : "soon"}" data-group="${escapeHtml(g)}" data-search="${escapeHtml(`${p.title} ${p.command} ${p.summary}`.toLowerCase())}">
<span class="pk-icon${ic.brand ? " brand" : ""}">${ic.svg}</span><span class="pk-name"><span>${escapeHtml(p.title)}</span>${badge(p)}</span><span class="pk-sum">${escapeHtml(p.summary ?? "")}</span></a>`;
    }).join("") + `</div></section>`).join("");
  const html = `<div data-catalog>${toolbar}${grid}<p class="pk-empty" hidden>No package matches. Try another word or category.</p></div>`;
  const intro = "Native features for your app, each with one API that works the same in a DSX app and in a converted web app. Available packages ship today; the rest are coming soon.";
  writeRoute("/packages", articlePage({ route: "/packages", title: "Packages", description: intro, html: "", headings: [], section, mdPath: "/packages.md", eyebrow: "Packages", wide: true, extraTop: html }));
  const catMd = `# Packages\n\n${intro}\n\n` + groups.map(([g, list]) => `## ${g}\n\n` + list.map((p) => `- [${p.title}](${p.url})${available(p) ? "" : " (coming soon)"}: ${p.summary}`).join("\n")).join("\n\n") + "\n";
  writeMd("/packages", catMd);
  record({ route: "/packages", title: "Packages", description: intro, section: "packages", markdown: catMd, headings: [], featured: true });

  // one page per package
  for (const p of allPackages()) {
    const md = packageMarkdown(p);
    const { html: body, headings } = renderMarkdown(md);
    const ic = iconFor(p);
    const plat = (p.targets ?? []).map((t) => `<span class="badge badge-muted">${PLATFORM[t] ?? t}</span>`).join("");
    const status = available(p) ? (p.maturity === "alpha" ? `<span class="badge badge-amber"><span class="dot"></span>Alpha</span>` : `<span class="badge badge-green"><span class="dot"></span>Available</span>`) : `<span class="badge badge-muted"><span class="dot"></span>Coming soon</span>`;
    const head = `<div class="pk-meta">${status}${plat}<code class="badge badge-muted badge-code">dsx.module.${escapeHtml(p.command)}</code></div>`
      + (available(p) ? "" : `<div class="notice" data-notify data-topic="${escapeHtml(p.slug)}" data-endpoint="https://api.despia.com/v1/waitlist"><span class="notice-icon">${icon("bell")}</span><div class="notice-body"><div class="notice-row"><p><strong>Coming soon.</strong> This package is not available yet.</p><button class="btn btn-sm" type="button" data-notify-open>${icon("envelope")}Get notified</button></div><form class="notify" hidden novalidate><input class="input" type="email" placeholder="you@company.com" autocomplete="email" aria-label="Email address"><button class="btn btn-sm btn-accent" type="submit">Notify me</button></form><p class="notify-msg" hidden aria-live="polite"></p></div></div>`);
    writeRoute(p.url, articlePage({ route: p.url, title: p.title, description: p.summary, html: body, headings, section, mdPath: `${p.url}.md`, eyebrow: `Packages · ${groupOf(p)}`, extraTop: head }));
    writeMd(p.url, `# ${p.title}\n\n> ${p.summary}\n\n${md}`);
    record({ route: p.url, title: p.title, description: p.summary, section: "packages", markdown: md, headings });
  }
}
