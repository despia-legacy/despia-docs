#!/usr/bin/env node
//
//  sync-integrations.mjs - the package catalogue as a committed snapshot (data/integrations.json):
//  one row per Despia package that has a callable command, read from the framework's own
//  manifests (ClosedSource/PackageCatalog.json + every ClosedSource/DSX/Modules/**/dsx.json and the
//  README's first paragraph). The docs MCP tools integrations_list / integration_get and the
//  per-module llms.txt read this snapshot, so a public build never needs the framework tree.
//  Source: DESPIA_FRAMEWORK (default ../wt-fleet2). Re-run after a catalogue change.
//

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fw = resolve(process.env.DESPIA_FRAMEWORK ?? join(root, "..", "wt-fleet2"));
const modules = join(fw, "ClosedSource", "DSX", "Modules");
if (!existsSync(modules)) { console.error(`[docs.integrations] no framework tree at ${fw} (set DESPIA_FRAMEWORK)`); process.exit(1); }

const catalog = JSON.parse(readFileSync(join(fw, "ClosedSource", "PackageCatalog.json"), "utf8"));
const byCommand = new Map((catalog.packages ?? []).map((p) => [p.command, p]));

function manifests(dir, depth = 0) {
  if (depth > 4) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory() || e.name.startsWith(".") || ["swift", "kotlin", "web", "shared", "node_modules", "Components", "tests"].includes(e.name)) return [];
    const abs = join(dir, e.name);
    return [...(existsSync(join(abs, "dsx.json")) ? [abs] : []), ...manifests(abs, depth + 1)];
  });
}
function firstParagraph(readme) {
  const lines = readme.split("\n");
  const out = [];
  for (const line of lines.slice(1)) {
    if (line.trim() === "") { if (out.length > 0) break; continue; }
    if (/^(#|```|\||<)/.test(line.trim())) { if (out.length > 0) break; continue; }
    out.push(line.trim());
  }
  return out.join(" ");
}

const rows = [];
for (const dir of manifests(modules)) {
  let m;
  try { m = JSON.parse(readFileSync(join(dir, "dsx.json"), "utf8")); } catch { continue; }
  if (typeof m.command !== "string" || m.command === "") continue;
  const path = relative(modules, dir).split(sep).join("/");
  const cat = byCommand.get(m.command) ?? {};
  const readme = existsSync(join(dir, "README.md")) ? readFileSync(join(dir, "README.md"), "utf8") : "";
  const actions = Array.isArray(m.actions) ? m.actions.map((a) => (typeof a === "string" ? a : a.name)).filter(Boolean)
    : (m.actions && typeof m.actions === "object" ? Object.keys(m.actions) : []);
  rows.push({
    command: m.command,
    name: m.name ?? cat.name ?? m.command,
    package: path,
    tier: cat.tier ?? path.split("/")[0],
    version: m.version ?? cat.version ?? null,
    license: m.license ?? null,
    commercial: m.commercial === true,
    shelf: m.shelf ?? null,
    platforms: cat.implementedOn ?? m.platforms ?? [],
    description: (typeof m.description === "string" && m.description !== "" ? m.description : firstParagraph(readme)).slice(0, 400),
    actions: actions.filter((a) => !String(a).startsWith("_")).slice(0, 80),
    api: `dsx.module.${m.command}`,
    install: `despia add ${path}`,
  });
}
rows.sort((a, b) => a.command.localeCompare(b.command));
const dedup = rows.filter((r, i) => rows.findIndex((x) => x.command === r.command) === i);
mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(join(root, "data", "integrations.json"), JSON.stringify({
  source: "despia-native/despia ClosedSource/PackageCatalog.json + ClosedSource/DSX/Modules/**/dsx.json",
  catalogVersion: catalog.version ?? null,
  packages: dedup,
}, null, 1) + "\n");
console.log(`[docs.integrations] ${dedup.length} package(s) with a command -> data/integrations.json`);
