#!/usr/bin/env node
//
//  sync-packages.mjs - the package facts every package page is generated from.
//
//  The framework already turns each package's manifest (dsx.json) into ONE structured document,
//  `despia.package-docs` v1 (OpenSource/Engine/TypeScript/packages/project/src/package-docs.ts, a pure
//  function over package-docs-data.generated.ts, which CI keeps in step with ClosedSource/DSX/Modules).
//  This script runs that same function and keeps the part a docs page needs in data/packages.json, so a
//  fact is written once, in the manifest, and a page can never drift from it.
//
//  Read from git, never from a working tree (no checkout needed, nobody's uncommitted edits):
//    DESPIA_FRAMEWORK      a clone of the framework repository (despia-native/despia-framework)
//    DESPIA_FRAMEWORK_REF  the ref to read (default origin/dev)
//  `--check` exits 1 when data/packages.json differs from what the ref says (CI drift gate).
//

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.env.DESPIA_FRAMEWORK;
const ref = process.env.DESPIA_FRAMEWORK_REF ?? "origin/dev";
const check = process.argv.includes("--check");
if (repo === undefined || repo === "") {
  console.error("[docs.sync-packages] set DESPIA_FRAMEWORK to a clone of the framework repository");
  process.exit(1);
}
const git = (...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", maxBuffer: 256 << 20 });
const commit = git("rev-parse", ref).trim();
const SRC = "OpenSource/Engine/TypeScript/packages/project/src";

const tmp = mkdtempSync(join(tmpdir(), "despia-pkgdocs-"));
try {
  for (const f of ["package-docs.ts", "package-docs-data.generated.ts", "article.ts"]) writeFileSync(join(tmp, f), git("show", `${commit}:${SRC}/${f}`));
  const { PACKAGE_SOURCES } = await import(pathToFileURL(join(tmp, "package-docs-data.generated.ts")).href);
  const { buildPackageDocs } = await import(pathToFileURL(join(tmp, "package-docs.ts")).href);

  // The generated data drops `maturity` and `published` (catalog facts, not reference facts); read them from each dsx.json.
  const manifestOf = (path) => {
    try { return JSON.parse(git("show", `${commit}:ClosedSource/DSX/Modules/${path}/dsx.json`)); } catch { return {}; }
  };
  const keepParam = (p) => ({ name: p.name, type: p.type, optional: p.optional, description: p.description });
  const packages = [];
  for (const src of PACKAGE_SOURCES) {
    const command = src.manifest.command;
    if (typeof command !== "string" || command === "") continue;
    const d = buildPackageDocs(src, { all: PACKAGE_SOURCES });
    const raw = manifestOf(src.path);
    const rawActions = src.manifest.actions ?? {};
    const implemented = d.targets.filter((t) => t.implemented).map((t) => t.target);
    const icon = raw.listing?.icon ?? {};
    packages.push({
      command,
      // the catalog address (package-docs.ts packageSlugs: the last word, unique across the catalog) and its page
      slug: d.slug,
      url: d.url,
      // in the catalog: the manifest carries a `listing` (what the console's package explorer shows)
      listed: raw.listing !== undefined && raw.listing !== null,
      icon: { symbol: icon.symbol ?? null, tint: icon.tint ?? null, brand: icon.brand ?? null },
      path: src.path,
      title: d.title,
      summary: d.summary,
      description: d.description,
      category: d.category,
      maturity: typeof raw.maturity === "string" ? raw.maturity : "unrated",
      published: raw.published === true,
      targets: implemented,
      deviceClasses: d.deviceClasses,
      whenToUse: d.whenToUse,
      nativeValue: d.nativeValue,
      // `reach` (an action-level manifest key) names the surfaces an action is delivered to; an EMPTY list means the action
      // is app-internal (never reaches a page), a list without the page names other surfaces (watch, imessage).
      actions: d.actions.map((a) => {
        const decl = rawActions[a.name] ?? {};
        const reach = Array.isArray(decl.reach) ? decl.reach : null;
        return {
          name: a.name,
          call: a.call,
          description: a.description,
          whenToUse: a.whenToUse,
          whenNotToUse: a.whenNotToUse,
          since: a.since,
          platforms: Array.isArray(decl.platforms) ? decl.platforms : implemented,
          page: reach === null || reach.includes("page") || reach.includes("web"),
          reach,
          stream: decl.stream === true || decl.events !== undefined,
          params: a.params.map(keepParam),
          result: a.result.map(keepParam),
          errors: a.errors.map((e) => ({ code: e.code, message: e.message, description: e.description, whatToDo: e.whatToDo })),
          broadcasts: a.broadcasts,
          examples: a.examples.filter((x) => x.valid).map((x) => ({ title: x.title, args: x.args, result: x.result })),
        };
      }),
      events: d.events.map((e) => ({ name: e.name, description: e.description, payload: e.payload.map(keepParam) })),
      errors: d.errors.map((e) => ({ code: e.code, message: e.message, description: e.description, whatToDo: e.whatToDo })),
      config: d.config.filter((c) => c.editable).map((c) => ({ key: c.key, label: c.label, description: c.description, type: c.type })),
      permissions: d.permissions,
    });
  }
  packages.sort((a, b) => (a.command < b.command ? -1 : a.command > b.command ? 1 : a.path < b.path ? -1 : 1));
  // one package per line: a diff names the package that changed
  const out = `{"_note": "GENERATED by scripts/sync-packages.mjs from the framework's despia.package-docs documents. Regenerate, never edit.",\n"source": ${JSON.stringify({ ref, commit })},\n"packages": [\n${packages.map((p) => JSON.stringify(p)).join(",\n")}\n]}\n`;
  const file = join(root, "data", "packages.json");
  if (check) {
    let current = "";
    try { current = readFileSync(file, "utf8"); } catch { /* missing */ }
    const strip = (s) => s.replace(/"source": \{[^}]*\}/, "");
    if (strip(current) !== strip(out)) { console.error(`[docs.sync-packages] data/packages.json is stale against ${ref} (${commit.slice(0, 10)}): run npm run packages`); process.exit(1); }
    console.log(`[docs.sync-packages] data/packages.json matches ${ref} (${commit.slice(0, 10)})`);
  } else {
    writeFileSync(file, out);
    console.log(`[docs.sync-packages] ${packages.length} package(s) from ${ref} ${commit.slice(0, 10)} -> data/packages.json`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
