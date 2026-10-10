// The Despia V4 docs (site/ia.mjs + content-v2, built by site/dsx-compile.mjs in the console's design). Holds:
//   · every IA page and every listed package has exactly one route, and its generated page exists;
//   · a package page carries the Coming soon notice exactly when the manifest says it is not published, and its
//     Platforms glance is the manifest's targets;
//   · the /packages Markdown twin lists every catalog package (the server halves keep their pages, out of the list);
//   · the old pipeline builds no V4 page any more: its routes are the legacy, migrate, troubleshooting, releases and
//     App Review spaces only;
//   · sidebar labels stay short enough for the sidebar and the phone tab bar;
//   · the docs' own CSS is one generated file holding only the rules it is allowed to hold.
// Run after `npm run compile`: node --test tests/v2.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPackages } from "../scripts/packages-lib.mjs";
import { SECTIONS, allPages } from "../site/ia.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "dsx.config.json"), "utf8"));
const byPath = new Map(config.routes.map((r) => [r.path, r]));
const listed = loadPackages().packages.filter((p) => p.listed !== false);
const SERVER_HALF = /\/Modules\/(Backend|Http)$/;
const source = (route) => {
  const r = byPath.get(route);
  assert.ok(r, `${route}: no route`);
  const file = join(root, "Components", "v2", `${r.component.replace(/^docs\./, "")}.dsx`);
  assert.ok(existsSync(file), `${route}: ${file} missing (run npm run compile)`);
  return readFileSync(file, "utf8");
};

test("every IA page and every listed package is one V4 page", () => {
  const paths = config.routes.map((r) => r.path);
  for (const { route } of allPages()) {
    assert.equal(paths.filter((x) => x === route).length, 1, route);
    if (route !== "/app-review") assert.match(byPath.get(route).component, /^docs\.V2/, route);
  }
  for (const p of listed) {
    assert.equal(paths.filter((x) => x === p.url).length, 1, p.url);
    assert.match(byPath.get(p.url).component, /^docs\.V2/, p.url);
  }
});

test("a package page says Coming soon exactly when the manifest is not published, and names its platforms", () => {
  const NAME = { ios: "iOS", android: "Android", web: "Web", macos: "macOS" };
  for (const p of listed) {
    const src = source(p.url);
    assert.equal(src.includes('title="Coming soon"'), p.published !== true, `${p.url}: published=${p.published}`);
    const platforms = (p.targets ?? []).map((t) => NAME[t] ?? t).join(", ");
    assert.ok(src.includes(`"title":"Platforms","value":${JSON.stringify(platforms)}`), `${p.url}: Platforms glance is not ${platforms}`);
  }
});

test("the /packages twin lists every catalog package", () => {
  const md = readFileSync(join(root, "public", "packages.md"), "utf8");
  for (const p of listed.filter((x) => !SERVER_HALF.test(x.path))) assert.ok(md.includes(`](${p.url})`), `/packages.md misses ${p.url}`);
});

test("the old pipeline builds only the spaces V4 does not own", () => {
  const old = config.routes.filter((r) => !r.component.startsWith("docs.V2")).map((r) => r.path);
  assert.ok(old.length > 0);
  for (const path of old) assert.match(path, /^\/(legacy|migrate|troubleshooting|releases|app-review)(\/|$)/, path);
  for (const stale of ["quickstart", "cli", "console", "deploying", "native-ui", "agents"]) {
    assert.ok(!existsSync(join(root, "public", `${stale}.md`)), `public/${stale}.md outlives its move`);
  }
});

test("sidebar labels fit the sidebar, area titles fit the phone tab bar", () => {
  const long = allPages().filter((p) => p.title.length > 32).map((p) => `${p.route}: "${p.title}"`);
  assert.deepEqual(long, []);
  for (const s of SECTIONS) assert.ok((s.tab ?? s.label).length <= 10, `${s.id}: tab label "${s.tab ?? s.label}"`);
});

test("the docs CSS is the generated DocsShell.css plus the legacy shell's, and holds only its allowed rules", () => {
  const css = readFileSync(join(root, "Components", "DocsShell.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim());
  const ALLOWED = /^(\.doc-article|\.doc-spaced|\.page-notice:not\(:has\(\+ \.dsx-list-group\)\)|\.dsx-codeblock, \.dsx-codeblock-sheet|\.doc-article > \.dsx-markdown|\.doc-article \.dsx-markdown|\.doc-section)/;
  for (const s of selectors) assert.match(s, ALLOWED, `DocsShell.css: unexpected rule ${s}`);
  assert.ok(!/\b(font-size|font-weight|letter-spacing|text-transform|font-family)\s*:/.test(css), "type styling in DocsShell.css");
});
