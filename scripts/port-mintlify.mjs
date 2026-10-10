#!/usr/bin/env node
//
//  port-mintlify.mjs - ONE-OFF importer: the Modern API pages written in the Mintlify repo (despia-legacy/docs,
//  branch wip/claude/docs-modern-api) become pages of this site, in this site's docs model:
//    · one sample per feature, `dsx.module.<pkg>.<action>()`, bare `dsx` (web-app differences live on /web-apps only);
//    · the reference (actions, results, errors, events, settings) and the "Works in" chips are GENERATED from the
//      manifest at build time (<PackageReference/>, <PackageSample/>, front matter `package:`), never copied;
//    · Mintlify-only furniture (snippet imports, connector callout, V4 pre-release banners, env checks) is dropped.
//  Kept for traceability; after the import the pages are ordinary content, edited by hand.
//    MINTLIFY_REPO=<clone> [MINTLIFY_REF=origin/wip/claude/docs-modern-api] node scripts/port-mintlify.mjs
//  Never overwrites a page that exists unless --force (the pilots are hand written).
//

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { packageFor } from "./packages-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.env.MINTLIFY_REPO;
const ref = process.env.MINTLIFY_REF ?? "origin/wip/claude/docs-modern-api";
const force = process.argv.includes("--force");
if (!repo) { console.error("[docs.port-mintlify] set MINTLIFY_REPO"); process.exit(1); }
const show = (path) => execFileSync("git", ["-C", repo, "show", `${ref}:${path}`], { encoding: "utf8", maxBuffer: 64 << 20 });
const aliases = JSON.parse(readFileSync(join(root, "redirects", "modern-aliases.json"), "utf8")).aliases;

// the Mintlify Modern API nav's package categories, in its order
const CATEGORIES = [
  ["Purchases and payments", ["revenuecat", "store", "payments"]],
  ["Sign-in and identity", ["oauth", "clerk", "biometric", "identityvault"]],
  ["Notifications", ["notify", "onesignal", "pushwoosh", "firebase"]],
  ["Analytics and attribution", ["appsflyer", "posthog", "apptracking"]],
  ["Device and system", ["haptic", "device", "uuid", "systembars", "flashlight", "motion", "clipboard", "settings", "spinner", "pulltorefresh", "preventdefault", "apprating", "quickactions", "actionsheet"]],
  ["Media, files and sharing", ["camera", "scanner", "print", "filesharing", "fileupload", "fileviewer", "share", "wallet", "browser"]],
  ["Health", ["health", "terra"]],
  ["Connectivity", ["nfc", "websocket", "nearby", "bluetooth"]],
  ["Speech", ["speechrecognition", "speechsynthesis"]],
  ["Data and contacts", ["storage", "contacts"]],
  ["Compliance", ["ageassurance"]],
];
// a command that names more than one manifest: the one the Mintlify generator used (gen.py PREFER)
const PREFER = { revenuecat: "Core/Store/Modules/RevenueCat", posthog: "Core/Growth/Modules/PostHog", health: "Core/HealthKit" };
const FA = { coins: "creditcard", store: "creditcard", "credit-card": "creditcard", key: "key", "user-lock": "person.crop.circle", fingerprint: "faceid",
  vault: "lock.shield", bell: "bell", "bell-ring": "bell", fire: "bolt", "chart-pie-simple": "sparkles", "chart-column": "sparkles", "user-shield": "lock.shield",
  waveform: "iphone", mobile: "iphone", bars: "iphone", flashlight: "bolt", compass: "location", clipboard: "doc.text", gear: "hammer", spinner: "bolt",
  "arrows-rotate": "arrow.left.arrow.right", hand: "iphone", star: "checkmark.seal", bolt: "bolt", list: "list.bullet", camera: "camera", qrcode: "camera",
  print: "paperplane", "share-from-square": "paperplane", upload: "paperplane", file: "doc.text", "share-nodes": "paperplane", wallet: "creditcard",
  globe: "globe", "heart-pulse": "faceid", webhook: "link", wifi: "network", plug: "network", "tower-broadcast": "network", bluetooth: "network",
  microphone: "mic", "volume-high": "mic", database: "externaldrive", "address-book": "person.2", "id-card": "person.crop.circle" };

// non-package pages: Mintlify path -> [new content file, section, order, label]
const PAGES = {
  "packages/overview": ["packages/index.md", "packages", 1, "Overview"],
  "packages/concepts": ["packages/concepts.md", "packages", 2, "Concepts"],
  "packages/add-a-package": ["packages/add.md", "packages", 3, "Add a package"],
  "packages/broadcasts": ["packages/broadcasts.md", "packages", 4, "Broadcasts"],
  "packages/push-notifications": ["packages/push-notifications.md", "packages", 5, "Push notifications"],
  "packages/migrate-from-v3": ["migrate/web-view-apps.md", "Move to v4", 3, "Web view apps from V3"],
  "packages/legacy-map": ["migrate/legacy-map.md", "Move to v4", 4, "Legacy to Modern map"],
  "packages/ai-tools": ["ai-tools.md", "", 4, "Use Despia from your AI tool"],
  "packages/store-listing": ["cli/store-listing.md", "cli", 2, "Store listing"],
  "packages/cli-stores": ["cli/stores.md", "cli", 3, "Stores and testers"],
  "packages/cli-workspace": ["cli/workspace.md", "cli", 4, "Workspace and projects"],
  "packages/cli-v3": ["cli/v3.md", "cli", 5, "Despia V3 apps"],
  "packages/custom-packages": ["modules/your-own-packages.md", "modules", 3, "Your own packages"],
  "mcp/overview": ["mcp/overview.md", "mcp", 1, "Overview"],
  "mcp/build-web-view-app": ["mcp/build-web-view-app.md", "mcp", 2, "Build a web view app"],
  "mcp/claude-code": ["mcp/claude-code.md", "mcp", 10, null], "mcp/claude": ["mcp/claude.md", "mcp", 11, null],
  "mcp/codex": ["mcp/codex.md", "mcp", 12, null], "mcp/chatgpt": ["mcp/chatgpt.md", "mcp", 13, null],
  "mcp/cursor": ["mcp/cursor.md", "mcp", 14, null], "mcp/vscode": ["mcp/vscode.md", "mcp", 15, null],
  "mcp/windsurf": ["mcp/windsurf.md", "mcp", 16, null], "mcp/lovable": ["mcp/lovable.md", "mcp", 17, null],
  "mcp/base44": ["mcp/base44.md", "mcp", 18, null], "mcp/replit": ["mcp/replit.md", "mcp", 19, null],
  "mcp/bolt": ["mcp/bolt.md", "mcp", 20, null], "mcp/other-tools": ["mcp/other-tools.md", "mcp", 21, null],
  "mcp/troubleshooting": ["mcp/troubleshooting.md", "mcp", 30, "Troubleshooting"],
};
const MCP_GROUP = /^mcp\/(claude-code|claude|codex|chatgpt|cursor|vscode|windsurf|lovable|base44|replit|bolt|other-tools)$/;

function splitFrontMatter(src) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  const meta = {};
  if (m) for (const line of m[1].split("\n")) { const i = line.indexOf(":"); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1"); }
  return { meta, body: m ? src.slice(m[0].length) : src };
}

/** link targets: Mintlify modern paths -> this site (the alias table), anchors kept */
function relink(text) {
  return text.replace(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g, (all, path, hash = "") => {
    const to = aliases[path];
    if (to === undefined) return all;
    return to.includes("#") ? `](${to})` : `](${to}${hash})`;
  }).replace(/href="(\/[^"#]*)(#[^"]*)?"/g, (all, path, hash = "") => {
    const to = aliases[path];
    return to === undefined ? all : `href="${to.includes("#") ? to : to + hash}"`;
  });
}

/** Mintlify MDX -> this site's markdown: drop the furniture, keep the prose and the components this site renders */
function clean(body) {
  let t = body
    .replace(/^import .*$\n?/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "")                                  // hidden TODO-VERIFY notes
    .replace(/^<(ConnectorCallout|EnvNew|EnvMigration|NpmVersion|MayChange|TestIt|SsrRule|DsxTypes|NotAvailable|PowersyncDiscontinued)\s*\/>\s*$\n?/gm, "")
    .replace(/^<Info>Modern API\.[^\n]*<\/Info>\s*$\n?/gm, "")
    .replace(/^<Warning>Alpha\. This feature[^\n]*<\/Warning>\s*$\n?/gm, "")
    .replace(/^<Tip>\*\*Browser only:[^\n]*<\/Tip>\s*$\n?/gm, "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/className=/g, "class=");
  // code: bare dsx (the one form the docs teach), no per-page environment guard
  t = t.replace(/^\s*const dsx = (?:window\.dsx|typeof window !== 'undefined' \? window\.dsx : undefined)\s*;?\s*$\n?/gm, "")
    .replace(/window\.dsx\?\./g, "dsx.").replace(/window\.dsx!?\./g, "dsx.");
  return relink(t).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/** the package page: Mintlify's prose, minus every section the generator now writes */
const GENERATED = new Set(["Call it from JavaScript", "Actions", "Action reference", "Broadcasts", "Configuration"]);
function packagePage(cmd, group, order) {
  const src = show(`packages/${cmd}.mdx`);
  const { meta, body } = splitFrontMatter(src);
  const ref = PREFER[cmd] ?? cmd;
  const pkg = packageFor(ref);
  if (!pkg) throw new Error(`no manifest for ${cmd}`);
  const parts = clean(body).split(/^(?=## )/m);
  const intro = parts[0].trim();
  const kept = parts.slice(1).filter((p) => !GENERATED.has(/^## (.+)$/m.exec(p)[1].trim()));
  const icon = FA[meta.icon] ?? "shippingbox";
  return `---
title: ${meta.title ?? pkg.title}
description: ${meta.description ?? pkg.summary ?? ""}
package: ${pkg.path}
section: packages
group: ${group}
icon: ${icon}
order: ${order}
---

# ${meta.title ?? pkg.title}

${intro}

<PackageSample/>

${kept.map((k) => k.trim()).join("\n\n")}${kept.length > 0 ? "\n\n" : ""}<PackageReference/>
`;
}

let written = 0;
let skipped = 0;
const write = (rel, text) => {
  const file = join(root, "content", rel);
  if (existsSync(file) && !force) { skipped += 1; return; }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  written += 1;
};

let order = 100;
for (const [group, cmds] of CATEGORIES) for (const cmd of cmds) { order += 1; write(`packages/${cmd}.md`, packagePage(cmd, group, order)); }

for (const [from, [to, section, ord, label]] of Object.entries(PAGES)) {
  const { meta, body } = splitFrontMatter(show(`${from}.mdx`));
  const space = to.startsWith("migrate/");
  const fm = [`title: ${meta.title}`, `description: ${meta.description ?? ""}`, ...(space ? [`section: ${section}`] : [`section: ${section}`]),
    ...(label ? [`label: ${label}`] : []), `order: ${ord}`, ...(MCP_GROUP.test(from) ? ["group: Install guides"] : [])];
  write(to, `---\n${fm.join("\n")}\n---\n\n# ${meta.title}\n\n${clean(body)}`);
}
console.log(`[docs.port-mintlify] ${written} page(s) written, ${skipped} kept as they are (exists; --force to overwrite) from ${ref}`);
