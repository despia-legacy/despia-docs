// Every package and component page is either SHIPPED or COMING SOON, and the data decides which (owner 2026-10-10, the
// 0.0.2 docs scope; rule in scripts/packages-lib.mjs shipState):
//   · package page: shipped iff the manifest says "published": true (data/packages.json, from the framework);
//   · component page: shipped iff its generated front matter `platforms` includes web (it renders through the web DOM).
// A Coming soon page's served markdown carries the ComingSoon block and NO code sample; a shipped page carries no
// ComingSoon block. Every page in the Packages section names its package. Run after `npm run compile`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { SHOW_UNSHIPPED, packageFor, shipState } from "../scripts/packages-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".md") ? [join(dir, e.name)] : []));
const pages = walk(contentDir)
  .filter((f) => { const r = relative(contentDir, f).split(sep).join("/"); return r.startsWith("packages/") || r.startsWith("components/"); })
  .map((file) => {
    const src = readFileSync(file, "utf8");
    const fm = /^---\n([\s\S]*?)\n---/.exec(src)?.[1] ?? "";
    const meta = {};
    for (const l of fm.split("\n")) { const i = l.indexOf(":"); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
    const route = meta.route ?? (meta.package && packageFor(meta.package) ? packageFor(meta.package).url : null) ?? "/" + relative(contentDir, file).split(sep).join("/").replace(/\.md$/, "").replace(/\/index$/, "");
    return { file, meta, route };
  });

test("the build under test is the real one (not the review preview)", () => assert.equal(SHOW_UNSHIPPED, false));

test("every Packages page names its package", () => {
  for (const p of pages.filter((p) => p.route.startsWith("/packages/"))) assert.ok(p.meta.package, `${p.route}: no package front matter`);
});
