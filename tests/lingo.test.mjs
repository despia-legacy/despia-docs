// The Lingo pages are GENERATED from the DSX glossary dataset (framework repo,
// OpenSource/Documentation/reference/lingo/glossary.json) by scripts/generate-lingo.ts --docs <this repo>.
// These tests pin what the generated pages must say, and, when a framework checkout is next to this repo
// (DESPIA_FRAMEWORK, default ../build-lingo), that they are not stale.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const page = (name) => readFileSync(join(root, "content", "lingo", name), "utf8");
const front = (text) => Object.fromEntries(/^---\n([\s\S]*?)\n---/.exec(text)[1].split("\n").map((l) => l.split(/:\s*/, 2)));

test("the Lingo pages carry front matter, the generated marker and the right routes", () => {
  const index = page("index.md");
  const pvm = page("package-vs-module.md");
  assert.equal(front(index).route, "/lingo");
  assert.equal(front(pvm).route, "/lingo/package-vs-module");
  for (const text of [index, pvm]) {
    assert.match(text, /Generated from the DSX glossary/);
    assert.equal(front(text).section, "lingo");
    assert.doesNotMatch(text, /[\u2013\u2014]/, "no em or en dashes");
  }
});

test("package or module: the ruling is on the page, with the other meanings of package", () => {
  const pvm = page("package-vs-module.md");
  assert.match(pvm, /A package is a module, and a module is a package/);
  assert.match(pvm, /dsx\.module/);
  for (const w of ["Kotlin", "Swift", "npm", "Gradle"]) assert.match(pvm, new RegExp(w));
});

test("the Lingo index lists at least 60 terms", () => {
  const index = page("index.md");
  const n = Number(/The words DSX uses, (\d+) of them/.exec(index)?.[1]);
  assert.ok(n >= 60, `${n} terms`);
  assert.ok((index.match(/^### /gm) ?? []).length >= 60);
});

const framework = resolve(process.env.DESPIA_FRAMEWORK ?? join(root, "..", "build-lingo"));
const generator = join(framework, "OpenSource/Engine/TypeScript/scripts/generate-lingo.ts");
test("the pages are current against the framework glossary (skipped without a checkout)", { skip: !existsSync(generator) }, () => {
  execFileSync(process.execPath, ["--experimental-strip-types", "--no-warnings", generator, "--check", "--docs", root], { stdio: "pipe" });
});
