#!/usr/bin/env node
//
//  check-stability.mjs - the native UI alpha, held (owner 2026-10-09). After `npm run compile`: every alpha page
//  (data/stability.json, front matter) sits in the alpha section of the sidebar and opens with the alpha callout,
//  and no stable page tells a reader native UI is production ready. Exit 1 names every page that breaks a rule.
//
import { claimsNativeProductionReady } from "./stability-claims.mjs";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stability = JSON.parse(readFileSync(join(root, "data", "stability.json"), "utf8"));
const index = JSON.parse(readFileSync(join(root, "public", "search-index.json"), "utf8"));
const nav = JSON.parse(readFileSync(join(root, "public", "nav.json"), "utf8"));
const modern = nav.spaces.find((s) => s.id === "modern");
const alphaSection = modern.sections.find((s) => s.name === stability.section);
const inAlphaSection = new Set((alphaSection?.pages ?? []).map((p) => p.route));
const pagesDir = join(root, "Components", "pages");
const pageFiles = Object.fromEntries([
  ...readdirSync(pagesDir).filter((f) => f.startsWith("Page")).map((f) => [f, readFileSync(join(pagesDir, f), "utf8")]),
  ...readdirSync(join(root, "Components")).filter((f) => f.endsWith(".dsx")).map((f) => [f, readFileSync(join(root, "Components", f), "utf8")]),
]);
const fileOf = (route) => Object.entries(pageFiles).find(([, text]) => text.includes(`route="${route}"`));

const problems = [];
let alpha = 0;
for (const page of index.pages) {
  const file = fileOf(page.route);
  if (page.alpha) {
    alpha += 1;
    if (!inAlphaSection.has(page.route)) problems.push(`${page.route}: alpha, but not in the "${stability.section}" section`);
    // DocShell draws the alpha note (AlphaNote, from data/stability.json) on every page it is told is alpha
    if (file === undefined || !file[1].includes('stability="alpha"')) problems.push(`${page.route}: alpha, but no alpha callout`);
  } else if (claimsNativeProductionReady(page.text)) {
    problems.push(`${page.route}: a stable page says native UI is production ready`);
  }
}
if (problems.length > 0) {
  console.error(`[docs.stability] ${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`[docs.stability] ${alpha} alpha page(s), all in "${stability.section}" with the callout; no stable page calls native UI production ready`);
