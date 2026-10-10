// The writing standard (owner 2026-10-10): public pages are for an app developer with two minutes. This fails the build
// on what must never reach a reader, and on tables with no rows.
//   Never in public docs: proposal or decision references, internal doc file paths in prose, PROPOSED / retired lint
//   names, constitution articles, lane or coordinator notes.
// Scope: every public content page except the Legacy (V3) port, which is the V3 docs as they were.
// Allow-list: `.md` is fine inside code and inside a link target (the markdown twins are a feature); "lane" inside a
// longer word (e.g. "plane") never matches the word boundary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".md") ? [join(dir, e.name)] : []));
const pages = walk(contentDir).filter((f) => !relative(contentDir, f).split(sep).join("/").startsWith("legacy/"));

/** prose only: fenced code, inline code and link targets are not prose */
const prose = (text) => text.replace(/^---\n[\s\S]*?\n---/, "").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "")
  .replace(/\]\([^)]*\)/g, "]").replace(/<[A-Z][^>]*>/g, "");

const BANNED = [
  [/proposals\//, "a proposal path"],
  [/\bDecision \d/, "a decision reference"],
  [/\bPROPOSED\b/, "PROPOSED"],
  [/\bArticle \d/, "a constitution article"],
  [/\b[\w-]+\.md\b/, "a doc file name in prose"],
  [/\b(lane|coordinator)\b/i, "a lane or coordinator note"],
  [/\bretired\b/i, "a retirement note (history)"],
];

test("public pages follow the writing standard", () => {
  const problems = [];
  for (const f of pages) {
    const text = prose(readFileSync(f, "utf8"));
    text.split("\n").forEach((line, i) => {
      for (const [re, why] of BANNED) if (re.test(line)) problems.push(`${relative(root, f)}: ${why}: ${line.trim().slice(0, 100)}`);
    });
  }
  assert.deepEqual(problems, []);
});

test("no table without rows", () => {
  const problems = [];
  for (const f of pages) {
    const lines = readFileSync(f, "utf8").replace(/```[\s\S]*?```/g, "").split("\n");
    for (let i = 1; i < lines.length; i += 1) {
      if (/^\s*\|?\s*:?-{2,}/.test(lines[i]) && lines[i - 1].trim().startsWith("|") && !(lines[i + 1] ?? "").trim().startsWith("|")) {
        problems.push(`${relative(root, f)}:${i}: a table with a header and no rows`);
      }
    }
  }
  assert.deepEqual(problems, []);
});
