#!/usr/bin/env node
//
//  migrate-map.mjs - the v3 to v4 feature map, generated from migrate/map.json (the one source:
//  every legacy page, the real v4 package/API it moves to, its status and the evidence path).
//  Writes content/migrate/map.md (the human page, grouped by the v3 sidebar) and
//  public/migrate-map.json (the machine copy the support AI and agents read). Never hand-edit
//  either output; fix migrate/map.json.
//

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(readFileSync(join(root, "migrate", "map.json"), "utf8"));
const site = (() => { const c = JSON.parse(readFileSync(join(root, "data", "site.json"), "utf8")); return `${c.origin}${c.base}`; })();

const STATUS_LABEL = { mapped: "Mapped", partial: "Partial", "not-applicable": "Not applicable", unknown: "Unknown" };
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
const code = (s) => (s ? "`" + String(s).replace(/`/g, "'") + "`" : "");

const counts = {};
for (const e of map.entries) counts[e.status] = (counts[e.status] ?? 0) + 1;

const groups = [];
for (const e of map.entries) {
  const name = e.group === "" ? "Get started" : e.group.split(" > ")[0];
  let g = groups.find((x) => x.name === name);
  if (g === undefined) { g = { name, rows: [] }; groups.push(g); }
  g.rows.push(e);
}

const lines = [
  "---",
  "title: v3 to v4 feature map",
  "description: Every Despia v3 feature and the v4 package or API it moves to, generated from the legacy navigation and the framework's own names.",
  "route: /migrate/map",
  "space: migrate",
  "section: Move to v4",
  "label: Feature map",
  "order: 3",
  "---",
  "",
  "# v3 to v4 feature map",
  "",
  `Every page of the v3 docs, with the v4 package or API that replaces it. ${map.entries.length} rows: ` +
    Object.entries(STATUS_LABEL).map(([k, v]) => `${counts[k] ?? 0} ${v.toLowerCase()}`).join(", ") + ".",
  "",
  "- **Mapped**: v4 has the same capability (often a one-to-one call).",
  "- **Partial**: v4 covers it differently or only in part; read the note.",
  "- **Not applicable**: store, deployment or third-party guidance with no Despia API to move.",
  "- **Unknown**: no v4 equivalent found yet. Ask support before you migrate that feature.",
  "",
  "Old `despia('scheme://...')` calls keep running through the optional `Core/Legacy` package while you move page by page; see the [step-by-step guide](/convert/from-v3). The same table is served as JSON at [/migrate-map.json](/migrate-map.json).",
  "",
];
for (const g of groups) {
  lines.push(`## ${g.name}`, "", "| v3 page | Status | v4 package | v4 API | Notes |", "|---|---|---|---|---|");
  for (const e of g.rows) {
    const v4 = e.v4 ?? {};
    const docs = v4.docs ? ` [Docs](${v4.docs})` : "";
    lines.push(`| [${cell(e.legacyTitle)}](/legacy${e.legacyPath}) | ${STATUS_LABEL[e.status] ?? e.status} | ${cell(code(v4.package))} | ${cell(code(v4.api))} | ${cell(e.note)}${docs} |`);
  }
  lines.push("");
}
mkdirSync(join(root, "content", "migrate"), { recursive: true });
writeFileSync(join(root, "content", "migrate", "map.md"), lines.join("\n"));

writeFileSync(join(root, "public", "migrate-map.json"), JSON.stringify({
  version: map.version,
  generatedAt: map.generatedAt,
  statuses: map.statuses,
  entries: map.entries.map((e) => ({
    legacyPath: e.legacyPath,
    legacyUrl: `${site}/legacy${e.legacyPath}`,
    legacyMd: `${site}/legacy${e.legacyPath}.md`,
    legacyTitle: e.legacyTitle,
    group: e.group,
    status: e.status,
    v4: e.v4 === null ? null : { package: e.v4.package ?? null, api: e.v4.api ?? null, docs: e.v4.docs ? site + e.v4.docs : null },
    note: e.note,
  })),
}, null, 1) + "\n");
console.log(`[docs.migrate-map] ${map.entries.length} row(s) (${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ")}) -> content/migrate/map.md, public/migrate-map.json`);
