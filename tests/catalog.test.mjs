// The public package catalog (owner 2026-10-10): every catalog package (data/packages.json `listed`) has exactly one page,
// at its framework address, and /packages lists every one of them. /modules and /catalog lead to /packages.
// Run after `npm run compile`: node --test tests/catalog.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPackages } from "../scripts/packages-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "dsx.config.json"), "utf8"));
const listed = loadPackages().packages.filter((p) => p.listed);

test("every catalog package has exactly one page at its address", () => {
  const paths = config.routes.map((r) => r.path);
  for (const p of listed) assert.equal(paths.filter((x) => x === p.url).length, 1, `${p.path}: ${p.url}`);
  const pkgRoutes = paths.filter((x) => x.startsWith("/packages/"));
  assert.equal(pkgRoutes.length, listed.length, "a /packages/ route with no catalog package");
});

test("the catalog index lists every package", () => {
  const md = readFileSync(join(root, "public", "packages.md"), "utf8");
  for (const p of listed) assert.ok(md.includes(`${p.url}.md)`), `/packages misses ${p.url}`);
});

test("/modules and /catalog lead to /packages", () => {
  const aliases = JSON.parse(readFileSync(join(root, "redirects", "modern-aliases.json"), "utf8")).aliases;
  assert.equal(aliases["/modules"], "/packages");
  assert.equal(aliases["/catalog"], "/packages");
});
