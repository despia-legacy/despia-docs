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
// Mandatory modules every app has without `despia add` (not in the package catalog). Source: the framework's
// OpenSource/Documentation/guides/routing.md, "Navigating".
const MANDATORY = ["dsx.module.route.push", "dsx.module.route.pop", "dsx.module.route.replace", "dsx.module.route.reset"];
MANDATORY.forEach((c) => CALLS.add(c));
const commandOf = (call) => pkgs.find((p) => (p.actions ?? []).some((a) => a.call === call))?.command;

const samples = []; // { where, lang, text, fragment }
function scanMarkdown(where, md) {
  const re = /^```(\w+)([^\n]*)\n([\s\S]*?)^```/gm;
  for (const m of md.matchAll(re)) samples.push({ where, lang: m[1], text: m[3], fragment: /\bfragment\b/.test(m[2]), file: /title="Components\/([A-Z]\w*)\.dsx"/.exec(m[2])?.[1] });
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
    else if (!MANDATORY.includes(call)) used.add(commandOf(call));
  }
}

// THE ONE FORM (owner 2026-10-10): every native call in every sample is `await dsx.module.<package>.<action>(...)`,
// the same in a DSX app and in any web app inside Despia. `window.dsx` appears in ONE place only: the web-app guide's
// section for sites that also run outside Despia (content-v2/web-apps/outside-despia.md).
const WINDOW_DSX_HOME = "content-v2/web-apps/outside-despia.md";
for (const s of samples) {
  if (!["js", "ts", "tsx", "jsx", "javascript", "typescript", "dsx", "html", "vue"].includes(s.lang)) continue;
  if (/window\.dsx/.test(s.text) && s.where !== WINDOW_DSX_HOME && !/^interface Window/m.test(s.text)) problems.push(`${s.where}: a sample uses window.dsx (only ${WINDOW_DSX_HOME} may)`);
  for (const m of s.text.matchAll(/(\S+\s+)?\b(?:window\.)?dsx\??\.module((?:\??\.[A-Za-z_$][\w$]*)+)\s*\(/g)) {
    if (!/await\s+$/.test(m[1] ?? "")) problems.push(`${s.where}: dsx.module${m[2]}(...) without await (write \`await dsx.module${m[2]}(...)\`)`);
  }
}
// and nowhere else in the prose either
for (const f of walk(join(repo, "content-v2"))) {
  const rel = relative(repo, f);
  if (rel !== WINDOW_DSX_HOME && /window\.dsx/.test(readFileSync(f, "utf8"))) problems.push(`${rel}: mentions window.dsx (only ${WINDOW_DSX_HOME} may)`);
}

const whole = samples.filter((s) => s.lang === "dsx" && !s.fragment);

// ── the vocabulary check (what `despia lint` lets through): every attribute on an element whose attribute table the
//    framework reference publishes must be in that table or universal; every dsx.action/variable/formula/attribute a
//    sample reads must be declared in that sample. data/dsx-facts.json comes from site/sync-dsx-facts.mjs.
const FACTS = JSON.parse(readFileSync(join(repo, "data", "dsx-facts.json"), "utf8"));
// tabTitle / tabIcon: set on a <tabs> child (StackReference, `tabs`); pane: a <scaffold> child (StackReference, `scaffold`)
const UNIVERSAL = new Set([...FACTS.universal, "class", "style", "slot", "pane", "key", "as", "tabTitle", "tabIcon"]);
const CODE_TAGS = new Set(["script", "functions", "action", "formula", "variable", "var", "let", "style"]);
const HEAD_ATTRS = { variable: ["as", "computed", "type", "sample", "comment", "persist"], attribute: ["as", "default", "type", "comment"], ...FACTS.headLanguageAttrs };
function scanTags(src) {
  const out = [];
  let i = 0;
  while ((i = src.indexOf("<", i)) >= 0) {
    if (src.startsWith("<!--", i)) { i = src.indexOf("-->", i) + 3; if (i < 3) break; continue; }
    const m = /^<([A-Za-z][\w.-]*)/.exec(src.slice(i, i + 80));
    if (!m) { i++; continue; }
    const tag = m[1];
    let j = i + m[0].length;
    const attrs = [];
    while (j < src.length && src[j] !== ">" && !(src[j] === "/" && src[j + 1] === ">")) {
      const a = /^\s+([^\s=/>]+)(?:="([^"]*)")?/.exec(src.slice(j));
      if (!a) { j++; continue; }
      attrs.push({ name: a[1], value: a[2] ?? "" });
      j += a[0].length;
    }
    const selfClosing = src[j] === "/";
    out.push({ tag, attrs });
    i = j + 1;
    if (CODE_TAGS.has(tag) && !selfClosing) { const end = src.indexOf(`</${tag}>`, i); if (end > 0) { out[out.length - 1].body = src.slice(i, end); i = end; } }
  }
  return out;
}
for (const s of whole) {
  const tags = scanTags(s.text);
  const declared = { action: new Set(), variable: new Set(), formula: new Set(), attribute: new Set(), api: new Set(), context: new Set() };
  for (const t of tags) {
    const as = t.attrs.find((a) => a.name === "as")?.value;
    if (as && declared[t.tag]) declared[t.tag].add(as);
    if (as && (t.tag === "var" || t.tag === "let")) declared.variable.add(as);
  }
  for (const t of tags) {
    const known = HEAD_ATTRS[t.tag] ?? FACTS.elements[t.tag];
    if (!known || !known.length) continue;
    for (const { name } of t.attrs) {
      if (UNIVERSAL.has(name) || known.includes(name) || /^(aria-|data-|class:|input:|on:appear|on:disappear)/.test(name) || /:(ios|android|web|macos|phone|tablet|desktop)$/.test(name)) continue;
      problems.push(`${s.where}: <${t.tag} ${name}=…> is not an attribute of <${t.tag}> in the framework reference`);
    }
  }
  for (const m of s.text.matchAll(/\bdsx\.(action|variable|formula|attribute|api|context)\.([A-Za-z_$][\w$]*)/g)) {
    if (!declared[m[1]].has(m[2])) problems.push(`${s.where}: dsx.${m[1]}.${m[2]} is used but this sample declares no <${m[1]} as="${m[2]}">`);
  }
}
let linted = 0;
if (cli) {
  const dir = join(repo, "dist-v2", ".samples");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "Components"), { recursive: true });
  // a sample titled Components/Name.dsx compiles as Name.dsx (the first one with that name), so a page that uses
  // <Name/> defined in another sample on the same page resolves it, exactly as it would in a real project
  const taken = new Set();
  const names = whole.map((s, i) => { const n = s.file && !taken.has(s.file) ? (taken.add(s.file), s.file) : `Sample${String(i + 1).padStart(3, "0")}`; writeFileSync(join(dir, "Components", `${n}.dsx`), s.text.replace(/\n?$/, "\n")); return n; });
  writeFileSync(join(dir, "dsx.json"), JSON.stringify({ name: "docs-samples", command: "docssamples", scheme: "docssamples", version: "0.1.0" }) + "\n");
  writeFileSync(join(dir, "dsx.config.json"), JSON.stringify({ entry: names[0] ?? "Sample001", modules: [...used].filter(Boolean).sort() }, null, 2) + "\n");
  const r = spawnSync(process.execPath, [cli, "lint"], { cwd: dir, encoding: "utf8", timeout: 300000 });
  const outText = `${r.stdout}\n${r.stderr}`;
  for (const line of outText.split("\n")) {
    const m = /Components\/(\w+)\.dsx:(\d+):\s*(error|warning):\s*(.*)$/.exec(line);
    if (!m) continue;
    const s = whole[names.indexOf(m[1])];
    if (m[3] === "error") problems.push(`${s.where}: line ${m[2]} of the sample: ${m[4]}`);
    else if (/unknown element tag/.test(m[4])) problems.push(`${s.where}: line ${m[2]} of the sample: ${m[4]}`);
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
