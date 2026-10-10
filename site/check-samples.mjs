#!/usr/bin/env node
//
//  check-samples.mjs - no invented API ships in the docs.
//
//    node site/check-samples.mjs                       # call check only (every dsx.module.x.y exists in the catalog)
//    node site/check-samples.mjs --cli <despia.js>     # + compile every .dsx sample with the framework's own `despia lint`
//
//  Samples: every ```dsx fence in content-v2 (a fence marked `fragment` is a partial snippet and is not compiled), the home
//  page's sample, and the generated sample of every package page (read from dist-v2/docs-index.json, so build first).
//  Each whole .dsx sample becomes one component of a throwaway project (dist-v2/.samples) whose dsx.config.json adds every
//  package the samples call, exactly as `npx despia add <pkg>` would; then `despia lint` runs over it.
//
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { HOME_SAMPLE } from "./home.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cliAt = process.argv.indexOf("--cli");
const cli = cliAt > 0 ? process.argv[cliAt + 1] : null;
const pkgs = JSON.parse(readFileSync(join(repo, "data", "packages.json"), "utf8")).packages;
const CALLS = new Set(pkgs.flatMap((p) => (p.actions ?? []).map((a) => a.call)));
const commandOf = (call) => pkgs.find((p) => (p.actions ?? []).some((a) => a.call === call))?.command;

const samples = []; // { where, lang, text, fragment }
function scanMarkdown(where, md) {
  const re = /^```(\w+)([^\n]*)\n([\s\S]*?)^```/gm;
  for (const m of md.matchAll(re)) samples.push({ where, lang: m[1], text: m[3], fragment: /\bfragment\b/.test(m[2]) });
}
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return f.startsWith("._") ? [] : statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : []; });
for (const f of walk(join(repo, "content-v2"))) scanMarkdown(relative(repo, f), readFileSync(f, "utf8"));
samples.push({ where: "site/home.mjs (HOME_SAMPLE)", lang: "dsx", text: HOME_SAMPLE, fragment: false });
const index = join(repo, "dist-v2", "docs-index.json");
if (existsSync(index)) for (const p of JSON.parse(readFileSync(index, "utf8")).pages.filter((x) => x.section === "packages")) scanMarkdown(`package page ${p.url}`, p.markdown);

const problems = [];
const used = new Set();
for (const s of samples) {
  for (const m of s.text.matchAll(/\bdsx\??\.module((?:\??\.[A-Za-z_$][\w$]*)+)\s*\(/g)) {
    const call = `dsx.module${m[1].replace(/\?\./g, ".")}`;
    if (!CALLS.has(call)) problems.push(`${s.where}: ${call} is not an action in the package catalog`);
    else used.add(commandOf(call));
  }
}

const whole = samples.filter((s) => s.lang === "dsx" && !s.fragment);
let linted = 0;
if (cli) {
  const dir = join(repo, "dist-v2", ".samples");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "Components"), { recursive: true });
  const names = whole.map((s, i) => { const n = `Sample${String(i + 1).padStart(3, "0")}`; writeFileSync(join(dir, "Components", `${n}.dsx`), s.text.replace(/\n?$/, "\n")); return n; });
  writeFileSync(join(dir, "dsx.json"), JSON.stringify({ name: "docs-samples", command: "docssamples", scheme: "docssamples", version: "0.1.0" }) + "\n");
  writeFileSync(join(dir, "dsx.config.json"), JSON.stringify({ entry: names[0] ?? "Sample001", modules: [...used].filter(Boolean).sort() }, null, 2) + "\n");
  const r = spawnSync(process.execPath, [cli, "lint"], { cwd: dir, encoding: "utf8", timeout: 300000 });
  const outText = `${r.stdout}\n${r.stderr}`;
  for (const line of outText.split("\n")) {
    const m = /Components\/(Sample\d+)\.dsx:(\d+):\s*(error|warning):\s*(.*)$/.exec(line);
    if (!m) continue;
    const s = whole[names.indexOf(m[1])];
    if (m[3] === "error") problems.push(`${s.where}: line ${m[2]} of the sample: ${m[4]}`);
    else console.warn(`warning: ${s.where}: line ${m[2]}: ${m[4]}`);
  }
  const summary = /despia lint: .*/.exec(outText)?.[0];
  if (!summary) problems.push(`despia lint did not run: ${outText.trim().slice(0, 400)}`);
  console.log(summary);
  linted = whole.length;
}

console.log(`${samples.length} samples, ${whole.length} whole .dsx documents${cli ? ` (${linted} compiled with despia lint)` : " (pass --cli to compile them)"}, ${used.size} packages called`);
if (problems.length) { console.error(problems.map((p) => `  ✗ ${p}`).join("\n")); process.exit(1); }
console.log("samples ok");
