// Every code sample on a modern page is checked against the real package surface (data/packages.json, generated from
// the framework's manifests): a renamed package, action, argument or error code breaks this test, not the reader.
//   1. contract: every dsx.module.<pkg>.<action> names a page-reachable action, dsx.has("<pkg>") a real package, every
//      argument key a declared argument, every `err.code === "<code>"` a declared error of an action the sample calls;
//   2. types: every JS/TS/JSX/TSX/Vue/HTML sample is type-checked by the TypeScript compiler against the generated
//      `declare const dsx` surface (only diagnostics on lines that touch dsx count: the samples are fragments);
//   3. the docs model: no Legacy `despia()` call outside /legacy and the migration guide, no renderer names (DSXView,
//      DSXDom) in a code tab.
// Run: node --test tests/snippets.test.mjs (TYPESCRIPT=<path to typescript> when it is not in node_modules).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { expandPackagePage, loadPackages, pageActions, surfaceDts } from "../scripts/packages-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
// ours: the framework's synced pages, the generated component reference and the Legacy port have their own gates
const SKIP = ["legacy", "framework", "components", "migrate/map.md"];
const NO_V3 = ["legacy", "migrate"]; // the only places a V3 despia() call may appear

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".md") ? [join(dir, e.name)] : []));
}
const rel = (f) => relative(contentDir, f).split(sep).join("/");
const files = walk(contentDir).filter((f) => !SKIP.some((s) => rel(f) === s || rel(f).startsWith(s + "/")));

function bodyOf(file) {
  const src = readFileSync(file, "utf8");
  const pkg = /^---\n[\s\S]*?^package:\s*(.+)$[\s\S]*?^---$/m.exec(src)?.[1]?.trim();
  return pkg ? expandPackagePage(src, pkg, rel(file)).text : src;
}

/** fenced blocks: { lang, title, code, line } */
function fences(text) {
  const out = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const o = /^\s*(`{3,}|~{3,})\s*([A-Za-z0-9_+-]*)(.*)$/.exec(lines[i]);
    if (o === null) continue;
    const start = i;
    const body = [];
    for (i += 1; i < lines.length; i += 1) {
      const c = /^\s*(`{3,}|~{3,})\s*$/.exec(lines[i]);
      if (c !== null && c[1][0] === o[1][0] && c[1].length >= o[1].length) break;
      body.push(lines[i]);
    }
    out.push({ lang: o[2].toLowerCase(), title: /title="([^"]*)"/.exec(o[3])?.[1] ?? "", code: body.join("\n"), line: start + 1 });
  }
  return out;
}

const JS = new Set(["js", "javascript", "ts", "typescript", "jsx", "tsx", "mjs"]);
/** the script a sample runs, as TSX; markup samples contribute their dsx expressions */
function scriptOf(f) {
  if (JS.has(f.lang)) return f.code;
  if (f.lang === "vue" || f.lang === "html") return [...f.code.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
  if (f.lang === "xml" || f.lang === "dsx") {
    return [...f.code.matchAll(/(?:on:[a-z]+|visible-if|disabled-if)="([^"]*dsx\.(?:module|has)[^"]*)"/g)].map((m) => `void (${m[1].replace(/&quot;/g, '"')});`).join("\n");
  }
  return "";
}

/** the top-level keys of an object literal's text (nested objects and arrays are skipped) */
function topLevelKeys(text) {
  let depth = 0, token = "", keys = [], quote = null;
  for (const ch of text.slice(1, -1) + ",") {
    if (quote !== null) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if ("{[(".includes(ch)) { depth += 1; continue; }
    if ("}])".includes(ch)) { depth -= 1; continue; }
    if (depth > 0) continue;
    if (ch === ":" || ch === ",") { const k = token.trim(); if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k)) keys.push(k); token = ch === ":" ? "\u0000" : ""; continue; }
    if (token !== "\u0000") token += ch;
  }
  return keys;
}
const KERNEL = new Set(["route"]);
// a sample is a fragment: names it uses from the surrounding app (2304/2552 cannot find name, 18004 shorthand without a
// value, 1375/1378 top-level await) are not the surface under test
const FRAGMENT_CODES = new Set([2304, 2552, 18004, 1375, 1378]);

const samples = files.flatMap((file) => fences(bodyOf(file)).map((f) => ({ ...f, file: rel(file), script: scriptOf(f) })));
const { packages } = loadPackages();
const byCommand = new Map();
for (const p of packages) if (!byCommand.has(p.command)) byCommand.set(p.command, p);

test("samples exist (the test reads the pages it guards)", () => {
  assert.ok(samples.filter((s) => /dsx\.module\./.test(s.script)).length >= 10, "expected the package and web-app pages to carry dsx samples");
});

test("every dsx call in a sample names the real surface", () => {
  const problems = [];
  for (const s of samples) {
    const where = `${s.file}:${s.line}`;
    const called = [];
    for (const m of s.script.matchAll(/dsx\??\.module\.([A-Za-z0-9_]+)((?:\.[A-Za-z0-9_]+)+)\s*\(\s*(\{[^()]*\})?/g)) {
      const [, cmd, path, argText] = m;
      const action = path.slice(1);
      const pkg = byCommand.get(cmd);
      if (pkg === undefined && KERNEL.has(cmd)) continue;
      if (pkg === undefined) { problems.push(`${where}: no package "${cmd}"`); continue; }
      if (action === "on") continue;
      const decl = pageActions(pkg).find((a) => a.name === action);
      if (decl === undefined) { problems.push(`${where}: ${cmd} has no page action "${action}"`); continue; }
      called.push(decl);
      if (argText !== undefined) {
        const keys = topLevelKeys(argText);
        for (const k of keys) if (!decl.params.some((p) => p.name === k)) problems.push(`${where}: ${cmd}.${action} has no argument "${k}"`);
      }
    }
    for (const m of s.script.matchAll(/dsx\??\.has\(\s*["']([^"']+)["']\s*\)/g)) if (!byCommand.has(m[1])) problems.push(`${where}: dsx.has("${m[1]}") names no package`);
    if (called.length > 0) {
      const codes = new Set(called.flatMap((a) => a.errors.map((e) => e.code)));
      for (const m of s.script.matchAll(/\.code\s*===?\s*["']([^"']+)["']/g)) if (!codes.has(m[1])) problems.push(`${where}: error code "${m[1]}" is not declared by ${called.map((a) => a.name).join(", ")}`);
    }
  }
  assert.deepEqual(problems, []);
});

test("the docs model: no V3 despia() on modern pages, no renderer tabs", () => {
  const problems = [];
  for (const file of walk(contentDir)) {
    const r = rel(file);
    if (NO_V3.some((s) => r.startsWith(s + "/")) || r.startsWith("framework/") || r.startsWith("components/")) continue;
    const text = readFileSync(file, "utf8");
    for (const f of fences(text)) {
      if (/(^|[^.\w])despia\s*\(\s*["'`]/.test(f.code)) problems.push(`${r}:${f.line}: Legacy despia() call on a modern page`);
    }
    for (const m of text.matchAll(/<Tab title="([^"]+)"/g)) if (/DSXView|DSXDom/i.test(m[1])) problems.push(`${r}: a tab keyed by renderer ("${m[1]}")`);
  }
  assert.deepEqual(problems, []);
});

test("every sample type-checks against the generated dsx surface", () => {
  const require = createRequire(import.meta.url);
  let ts;
  try { ts = require(process.env.TYPESCRIPT ?? "typescript"); } catch { ts = null; }
  if (ts === null) { assert.fail("typescript is not installed (npm install, or TYPESCRIPT=<path>)"); }
  const vfs = new Map();
  vfs.set("/surface.d.ts", surfaceDts());
  // the libraries the samples import, as loose modules: only the dsx surface is under test
  vfs.set("/stubs.d.ts", ['declare module "react" { export function useState<T>(v: T): [T, (v: T) => void]; export function useEffect(f: () => any, d?: any[]): void; }',
    'declare module "jose" { export const createRemoteJWKSet: any; export const jwtVerify: any; }',
    'declare module "@supabase/supabase-js" { export const createClient: any; }',
    'declare module "node:crypto" { export const createHash: any; }',
    "declare namespace JSX { interface IntrinsicElements { [name: string]: any } }",
    "declare const process: any;"].join("\n"));
  const checked = samples.filter((s) => /\bdsx\b/.test(s.script));
  checked.forEach((s, i) => vfs.set(`/s${i}.tsx`, `export {};\n${s.script}\n`));
  const options = { strict: false, noImplicitAny: false, jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, lib: ["lib.es2022.d.ts", "lib.dom.d.ts"], skipLibCheck: true, noEmit: true, types: [] };
  const host = ts.createCompilerHost(options);
  const read = host.getSourceFile.bind(host);
  host.getSourceFile = (name, lang) => (vfs.has(name) ? ts.createSourceFile(name, vfs.get(name), lang) : read(name, lang));
  host.fileExists = ((exists) => (name) => vfs.has(name) || exists(name))(host.fileExists.bind(host));
  host.readFile = ((readFile) => (name) => vfs.get(name) ?? readFile(name))(host.readFile.bind(host));
  const program = ts.createProgram([...vfs.keys()], options, host);
  const problems = [];
  for (const d of ts.getPreEmitDiagnostics(program)) {
    if (d.file === undefined || !/^\/s\d+\.tsx$/.test(d.file.fileName)) continue;
    const { line } = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
    const text = d.file.text.split("\n")[line] ?? "";
    if (!/\bdsx\b/.test(text)) continue; // a fragment's own free variables are not the surface
    if (FRAGMENT_CODES.has(d.code)) continue;
    const s = checked[Number(/\d+/.exec(d.file.fileName)[0])];
    problems.push(`${s.file}:${s.line + line - 1}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`);
  }
  assert.deepEqual(problems, []);
  console.log(`[snippets] ${checked.length} sample(s) type-checked against ${byCommand.size} package(s)`);
});
