// The "Works in" chip row on every package page is the manifest's answer, never a hand-written line:
//   · each package page's compiled markdown twin carries exactly the row derived from data/packages.json;
//   · no source page writes its own "Works in" line;
//   · the derivation follows the docs model: actions and events -> "DSX · Web apps"; components only -> "DSX" alone;
//     app-internal actions (reach: []) never count;
//   · with DESPIA_FRAMEWORK set, data/packages.json is checked fresh against the framework's dsx.json (sync --check).
// Run after `npm run compile`: node --test tests/chips.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chipRowMarkdown, loadPackages, packageFor, pageActions, shipState, worksIn } from "../scripts/packages-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".md") ? [join(dir, e.name)] : []));
const pages = walk(contentDir).filter((f) => !relative(contentDir, f).startsWith("legacy" + sep) && !relative(contentDir, f).startsWith("framework" + sep))
  .map((file) => {
    const src = readFileSync(file, "utf8");
    const fm = /^---\n([\s\S]*?)\n---/.exec(src)?.[1] ?? "";
    const meta = Object.fromEntries(fm.split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
    return { file, src, meta, route: meta.route ?? "/" + relative(contentDir, file).split(sep).join("/").replace(/\.md$/, "").replace(/\/index$/, "") };
  });
const packagePages = pages.filter((p) => p.meta.package);

test("package pages exist", () => assert.ok(packagePages.length >= 2));

test("every package page's chip row is the manifest's row", () => {
  for (const p of packagePages) {
    const pkg = packageFor(p.meta.package);
    assert.ok(pkg, `${p.route}: package ${p.meta.package} unknown`);
    const twin = join(root, "public", ...p.route.slice(1).split("/")) + ".md";
    assert.ok(existsSync(twin), `${twin} missing: run npm run compile first`);
    const state = shipState(p.meta);
    if (state.soon) { assert.ok(readFileSync(twin, "utf8").includes(`chips="${worksIn(pkg).join(",")}"`), `${p.route}: Coming soon chips`); continue; }
    const rows = readFileSync(twin, "utf8").split("\n").filter((l) => l.startsWith("**Works in:**"));
    assert.deepEqual(rows, [chipRowMarkdown(pkg)], p.route);
  }
});

test("no page writes its own Works in line", () => {
  for (const p of pages) assert.ok(!/^\*\*Works in:\*\*/m.test(p.src), `${p.route}: hand-written chip row`);
});

test("the derivation follows the docs model", () => {
  const { packages } = loadPackages();
  for (const pkg of packages) {
    const chips = worksIn(pkg);
    const reachable = pageActions(pkg).length > 0 || pkg.events.length > 0;
    assert.equal(chips[0], "DSX");
    assert.equal(chips.includes("Web apps"), reachable, `${pkg.path}: Web apps chip only when something reaches the page`);
    const internalOnly = pkg.actions.filter((a) => !a.page);
    for (const a of internalOnly) assert.ok(Array.isArray(a.reach), `${pkg.path}.${a.name}: hidden only by an explicit reach list`);
  }
  const haptic = packageFor("Core/Basics/Haptics");
  assert.deepEqual(worksIn(haptic), ["DSX", "Web apps", "iOS", "Android", "Browser"]);
  const apple = packageFor("Core/Auth/AppleAuth");
  assert.deepEqual(worksIn(apple), ["DSX", "Web apps", "iOS", "macOS"]);
});

test("data/packages.json matches the framework's manifests", { skip: process.env.DESPIA_FRAMEWORK ? false : "set DESPIA_FRAMEWORK to check against dsx.json" }, () => {
  execFileSync(process.execPath, [join(root, "scripts", "sync-packages.mjs"), "--check"], { stdio: "inherit", env: process.env });
});
