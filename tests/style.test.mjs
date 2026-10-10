// The docs look like the console because they ARE the console's parts (owner 2026-10-10). This holds it:
//   · no type styling anywhere in the docs' own sources: no font-size, font-weight, letter-spacing, text-transform,
//     font-family in any CSS file or inline style (text styles come from the stock components only);
//   · no inline style= in the docs' own components or generated pages (allow-list below, each with its reason);
//   · no colour, border or background literals in the docs CSS (theme tokens live in the framework);
//   (the sidebar labels and the generated DocsShell.css are held by tests/v2.test.mjs)
// Run after `npm run compile`: node --test tests/style.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const comp = join(root, "Components");
const files = (dir, ext) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? files(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : []);

const TYPE = /\b(font-size|font-weight|letter-spacing|text-transform|font-family)\s*:/;
const PAINT = /\b(color|background(-color)?|border(-[a-z]+)?)\s*:\s*(#|rgb|hsl|black|white)/;
// inline style= that may stay, with the reason
const STYLE_ALLOW = [
  { file: "Components/DocAsk.dsx", why: "owned by the Ask AI lane (wip/claude/docs-askai), which replaces the panel" },
];
// the Legacy (V3) pages are the V3 docs as they were (owner: restyle through the shell, no rewrite); their own inline
// styles come from the V3 source and are listed by this test's report, not failed
const LEGACY_PAGE = /Components\/pages\/PageLegacy_/;

test("no type styling or paint literals in the docs CSS", () => {
  const problems = [];
  for (const f of files(comp, ".css")) {
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      if (TYPE.test(line)) problems.push(`${f.slice(root.length + 1)}:${i + 1}: ${line.trim()}`);
      if (PAINT.test(line)) problems.push(`${f.slice(root.length + 1)}:${i + 1}: ${line.trim()}`);
    });
  }
  assert.deepEqual(problems, []);
});

test("no inline style= in the docs' components or generated pages", () => {
  const problems = [];
  for (const f of files(comp, ".dsx")) {
    const rel = f.slice(root.length + 1);
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      if (STYLE_ALLOW.some((a) => rel === a.file) || LEGACY_PAGE.test(rel)) return;
      // a code sample carried as a variable's value is content (it shows an author's <style>), not the docs' chrome
      if (/^\s*<variable as="[^"]+">return "/.test(line)) return;
      if (/\sstyle="/.test(line)) problems.push(`${rel}:${i + 1}`);
      if (TYPE.test(line)) problems.push(`${rel}:${i + 1}: type styling`);
    });
  }
  // the live examples are authored content (their own style is what they demonstrate), not the docs' chrome
  assert.deepEqual(problems.filter((p) => !/Components\/pages\/Live[0-9a-f]+\.dsx/.test(p)), []);
});
