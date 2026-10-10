//
//  packages-lib.mjs - what a package page says that the manifest already knows, generated (never hand written):
//    · the "Works in" chip row under the title,
//    · the reference (actions, results, errors, events) at the <PackageReference/> line,
//    · the TypeScript surface the snippet test type-checks every doc sample against.
//  Input: data/packages.json (scripts/sync-packages.mjs, from the framework's despia.package-docs documents).
//
//  The docs model (owner 2026-10-10):
//    · Actions (dsx.module.x.y()) and events run anywhere your code runs: DSX pages and any web app inside Despia. One sample.
//    · Components (native UI) are DSX markup only: no "Web apps" chip, no web-app note.
//    · App-internal actions (manifest `reach: []`) never reach a page and are left off public pages.
//    · The "Web apps" chip links to the one page that carries every web-app difference (/web-apps); no per-page note.
//

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const WEB_APPS_ROUTE = "/web-apps";
const PLATFORM_LABEL = { ios: "iOS", android: "Android", macos: "macOS", web: "Browser" };
const PLATFORM_ORDER = ["ios", "android", "macos", "web"];

let cache = null;
export function loadPackages() {
  if (cache === null) cache = JSON.parse(readFileSync(join(root, "data", "packages.json"), "utf8"));
  return cache;
}

/** A page names its package by manifest path (`Core/Basics/Haptics`) - a command alone is not unique across the tree. */
export function packageFor(ref) {
  const { packages } = loadPackages();
  const hit = packages.find((p) => p.path === ref) ?? packages.filter((p) => p.command === ref);
  if (Array.isArray(hit)) return hit.length === 1 ? hit[0] : null;
  return hit;
}

/** The actions a page may show: the ones that reach a page (manifest `reach` absent or naming the page). */
export const pageActions = (pkg) => pkg.actions.filter((a) => a.page);

/** The "Works in" chips, derived from the manifest only. */
export function worksIn(pkg) {
  const actions = pageActions(pkg);
  const chips = ["DSX"];
  if (actions.length > 0 || pkg.events.length > 0) chips.push("Web apps");
  const platforms = new Set(actions.length > 0 ? actions.flatMap((a) => a.platforms) : pkg.targets);
  for (const p of PLATFORM_ORDER) if (platforms.has(p)) chips.push(PLATFORM_LABEL[p]);
  return chips;
}

/** The chip row as markdown: the web-app chip is the link to the web-app guide (the generated web-app note). */
export function chipRowMarkdown(pkg) {
  const chips = worksIn(pkg).map((c) => (c === "Web apps" ? `[Web apps](${WEB_APPS_ROUTE})` : c));
  return `**Works in:** ${chips.join(" · ")}`;
}

// ── the reference ───────────────────────────────────────────────────────────────────────────
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
const tick = (s) => `\`${String(s).replace(/`/g, "")}\``;
function fieldTable(fields) {
  if (fields.length === 0) return "";
  return ["| Name | Type | Description |", "| :-- | :-- | :-- |",
    ...fields.map((f) => `| ${tick(f.name)}${f.optional ? " (optional)" : ""} | ${cell(f.type)} | ${cell(f.description)} |`)].join("\n");
}
const jsValue = (v) => JSON.stringify(v, null, 2).replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, "$1:");

/** One call written the way the docs teach it: bare `dsx`, awaited. */
export function callSample(pkg, action, args) {
  const a = args !== undefined && args !== null && Object.keys(args).length > 0 ? jsValue(args) : "";
  return `${action.result.length > 0 ? "const result = " : ""}await dsx.module.${pkg.command}.${action.name}(${a})`;
}

export function referenceMarkdown(pkg) {
  const out = [];
  const actions = pageActions(pkg);
  if (actions.length > 0) {
    out.push("## Actions", "");
    out.push("| Call | What it does | Platforms |", "| :-- | :-- | :-- |");
    for (const a of actions) out.push(`| [${tick(`dsx.module.${pkg.command}.${a.name}()`)}](#${a.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "")}) | ${cell(a.description)} | ${a.platforms.filter((p) => PLATFORM_LABEL[p]).map((p) => PLATFORM_LABEL[p]).join(", ")} |`);
    out.push("");
    for (const a of actions) {
      out.push(`### ${a.name}`, "");
      if (a.description) out.push(a.description, "");
      if (a.whenToUse) out.push(`**When to use it.** ${a.whenToUse}${a.whenNotToUse ? ` ${a.whenNotToUse}` : ""}`, "");
      const ex = a.examples[0];
      out.push("```js", callSample(pkg, a, ex?.args), "```", "");
      if (a.params.length > 0) out.push("**Arguments**", "", fieldTable(a.params), "");
      if (a.result.length > 0) out.push("**Result**", "", fieldTable(a.result), "");
      if (ex !== undefined && ex.result !== undefined && ex.result !== null) out.push("```json title=\"Example result\"", JSON.stringify(ex.result, null, 2), "```", "");
      if (a.errors.length > 0) {
        out.push("**Errors** (`err.code`)", "", "| Code | When | What to do |", "| :-- | :-- | :-- |",
          ...a.errors.map((e) => `| ${tick(e.code)} | ${cell(e.description ?? e.message)} | ${cell(e.whatToDo)} |`), "");
      }
    }
  }
  if (pkg.events.length > 0) {
    out.push("## Events", "");
    for (const e of pkg.events) {
      out.push(`### ${e.name}`, "");
      if (e.description) out.push(e.description, "");
      out.push("```js", `dsx.module.${pkg.command}.on("${e.name}", (data) => {\n  // ...\n})`, "```", "");
      if (e.payload.length > 0) out.push(fieldTable(e.payload), "");
    }
  }
  if (pkg.config.length > 0) {
    out.push("## Settings", "", "Set these on the package in the console, or in your project's package config.", "",
      "| Key | Type | What it does |", "| :-- | :-- | :-- |",
      ...pkg.config.map((c) => `| ${tick(c.key)} | ${cell(c.type)} | ${cell(c.description ?? c.label)} |`), "");
  }
  out.push(`<sub>Generated from the package manifest (\`${pkg.path}/dsx.json\`).</sub>`, "");
  return out.join("\n");
}

/** Expand a package page body: the chip row under the h1, the reference at the <PackageReference/> line. */
export function expandPackagePage(body, ref, where) {
  const pkg = packageFor(ref);
  if (pkg === null || pkg === undefined) throw new Error(`${where}: front matter package "${ref}" is not in data/packages.json (run npm run packages)`);
  let text = body;
  const h1 = /^#\s.*$/m.exec(text);
  const row = chipRowMarkdown(pkg);
  text = h1 === null ? `${row}\n\n${text}` : `${text.slice(0, h1.index + h1[0].length)}\n\n${row}\n${text.slice(h1.index + h1[0].length)}`;
  text = text.replace(/^<PackageReference\s*\/>\s*$/m, () => referenceMarkdown(pkg));
  return { text, pkg };
}

// ── the typed surface (snippet test) ────────────────────────────────────────────────────────
const TS_TYPE = { string: "string", number: "number", int: "number", float: "number", double: "number", boolean: "boolean", bool: "boolean" };
const tsType = (t) => TS_TYPE[t] ?? (String(t).startsWith("array") ? "any[]" : "any");
const ident = (s) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s) ? s : JSON.stringify(s));
function objType(fields) {
  const top = fields.filter((f) => !f.name.includes("."));
  return `{ ${top.map((f) => `${ident(f.name)}${f.optional ? "?" : ""}: ${tsType(f.type)}`).join("; ")} }`;
}
/** `declare const dsx` with every page-reachable action of every package, typed from the manifest. */
export function surfaceDts() {
  const { packages } = loadPackages();
  const seen = new Set();
  const mods = [];
  for (const p of packages) {
    if (seen.has(p.command) || !/^[a-z][a-z0-9]*$/.test(p.command)) continue;
    seen.add(p.command);
    // dotted action names (`auth.signInWithIdToken`) are groups: dsx.module.supabase.auth.signInWithIdToken(...)
    const tree = { kids: new Map() };
    for (const a of pageActions(p)) {
      const args = a.params.filter((f) => !f.name.includes("."));
      const allOptional = args.every((f) => f.optional);
      const param = args.length === 0 ? "args?: Record<string, never>, handler?: (update: any) => void" : `args${allOptional ? "?" : ""}: ${objType(args)}, handler?: (update: any) => void`;
      let node = tree;
      for (const seg of a.name.split(".")) { if (!node.kids.has(seg)) node.kids.set(seg, { kids: new Map() }); node = node.kids.get(seg); }
      node.fn = `(${param}) => Promise<${a.result.length > 0 ? objType(a.result) : "any"}>`;
    }
    const render = (node, pad) => [...node.kids].map(([name, n]) => {
      const obj = n.kids.size > 0 ? `{\n${render(n, pad + "  ")}\n${pad}}` : null;
      const type = n.fn && obj ? `(${n.fn}) & ${obj}` : n.fn ? n.fn : obj;
      return `${pad}${ident(name)}: ${type};`;
    }).join("\n");
    const members = [render(tree, "    ")].filter((x) => x !== "");
    members.push(`    on(event: ${p.events.length > 0 ? p.events.map((e) => JSON.stringify(e.name)).join(" | ") : "string"}, handler: (data: any, envelope?: any) => void): () => void;`);
    mods.push(`  ${ident(p.command)}: {\n${members.join("\n")}\n  };`);
  }
  return `// GENERATED from data/packages.json by scripts/packages-lib.mjs: the page surface the docs teach.
interface DsxError { event: "error"; code: string; message?: string; recoverable?: boolean; data?: any }
interface DsxModules {
${mods.join("\n")}
}
// the kernel's own schemes (no manifest: the router and the app state plane live in the kernel)
interface DsxModules {
  route: { push(args: { path?: string; [k: string]: any } | string): Promise<any>; pop(args?: any): Promise<any>; replace(args: any): Promise<any>; reset(args?: any): Promise<any>; pushComponent(args: any): Promise<any> };
}
interface DsxSurface {
  module: DsxModules;
  global: { get(path: string): Promise<any>; set(path: string, value: any): Promise<any>; watch(path: string, handler: (value: any) => void): { stop(): void } };
  version(name: string): string | null;
  packages: Array<{ name: string; version?: string; scheme?: string }>;
  has(name: keyof DsxModules | (string & {})): boolean;
  on(event: string, handler: (envelope: any) => void): () => void;
}
declare const dsx: DsxSurface;
interface Window { dsx?: DsxSurface }
`;
}

// ── shipped or coming soon (owner 2026-10-10, the 0.0.2 docs scope) ──────────────────────────
// Decided from data, never by hand:
//   · a package page ships when its manifest says `"published": true` (the catalog's own "offered to people" flag,
//     project-core status.ts); otherwise it is Coming soon;
//   · a component page ships when its generated front matter `platforms` includes `web` (it renders through the web
//     DOM in 0.0.2); otherwise it is Coming soon.
// DOCS_SHOW_UNSHIPPED=1 builds every page in full (a review preview, never a deploy).
const COMPONENT_PLATFORM = { web: "Web apps", ios: "iOS", android: "Android", desktop: "Desktop", macos: "macOS" };
export function shipState(meta) {
  if (meta.package) {
    const pkg = packageFor(meta.package);
    if (!pkg) return { soon: false };
    return pkg.published === true ? { soon: false, pkg } : { soon: true, pkg, chips: worksIn(pkg), topic: `packages/${pkg.command}`,
      summary: [pkg.description ?? pkg.summary, pkg.nativeValue].filter(Boolean).join(" ") };
  }
  if (meta.element) {
    const platforms = String(meta.platforms ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (platforms.includes("web")) return { soon: false };
    return { soon: true, chips: ["DSX", ...platforms.map((p) => COMPONENT_PLATFORM[p] ?? p)], topic: `components/${String(meta.element).toLowerCase()}`,
      summary: meta.description ?? "" };
  }
  return { soon: false };
}
export const SHOW_UNSHIPPED = process.env.DOCS_SHOW_UNSHIPPED === "1";

/** The Coming soon page body: title, the planned chips (greyed), one paragraph, the notify form. */
export function comingSoonMarkdown(title, state) {
  return `# ${title}

<ComingSoon topic="${state.topic}" chips="${state.chips.join(",")}"/>

**Coming soon.** ${state.summary}

This page fills in when it ships. Leave your email above and we'll tell you when it's ready.
`;
}
