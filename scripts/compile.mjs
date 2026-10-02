#!/usr/bin/env node
//
//  compile.mjs — the docs content compiler: a markdown tree in, a DSX site out.
//
//  This is the MDX idea with DSX as the component model, kept deliberately small: every
//  page is a markdown file with front matter; the compiler turns the tree into
//    · one generated DSX page component per document (the <markdown> element renders it —
//      block vocabulary corpus-pinned, innerHTML-free on every renderer),
//    · the route table (dsx.config.json "routes", from file paths + front matter),
//    · the navigation model (nav.json: sections and pages, ordered),
//    · the client search index (public/search-index.json — title/heading/body tokens per
//      page; fuzzy search runs client-side with no server dependency),
//    · the raw-markdown siblings (public/md/<route>.md — every page serves its source, the
//      copy-as-markdown contract),
//    · llms.txt and llms-full.txt at the site root.
//
//  Repo-local by design (v0-live-plan W7.1): it is extracted to a published package only
//  when a second consumer exists. No dependencies — front matter and markdown structure
//  are parsed with the same do-little discipline the runtime's own parser keeps.
//

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// The component reference pages are NOT generated here. They are written into content/
// components/ by the framework's own generator (ClosedSource/scripts/generate_component_docs.rb
// in despia-native/despia), from the ledgers that keep every fact on them honest, and they are
// committed like any other page. One generator, one shape, gated on the framework side by
// check_docs_coverage.rb (presence and drift) and check_docs_ai_ready.rb (front matter and the
// llms exports). This compiler treats them as ordinary content.

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const generatedDir = join(root, "Components", "pages");
const publicDir = join(root, "public");

/** Front matter: a leading `---` block of `key: value` lines. Absent is fine. */
function frontMatter(source) {
  if (!source.startsWith("---\n")) return { meta: {}, body: source };
  const end = source.indexOf("\n---", 4);
  if (end === -1) return { meta: {}, body: source };
  const meta = {};
  for (const line of source.slice(4, end).split("\n")) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body: source.slice(end + 4).replace(/^\n/, "") };
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (name.name.startsWith(".")) continue;
    const abs = join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(abs));
    else if (name.name.endsWith(".md")) out.push(abs);
  }
  return out;
}

/** file path → route: content/index.md → /, content/guides/ota.md → /guides/ota.
 *  A README.md is a directory's front page (the synced framework docs use README, not
 *  index): guides/combinations/README.md → /guides/combinations, so in-content links
 *  to the directory route resolve. */
function routeFor(file) {
  const rel = relative(contentDir, file).split(sep).join("/").replace(/\.md$/, "");
  if (rel === "index" || rel === "README") return "/";
  return "/" + rel.replace(/\/(index|README)$/, "");
}

/** route → the generated component's name (fieldless, deterministic, collision-free) */
function componentNameFor(route) {
  if (route === "/") return "PageIndex";
  return "Page" + route.split("/").filter(Boolean).map((s) => s.replace(/(^|[-_])([a-z0-9])/g, (_, __, c) => c.toUpperCase())).join("_");
}

function firstHeading(body) {
  const m = /^#\s+(.+)$/m.exec(body);
  return m === null ? null : m[1].trim();
}

/** The searchable text: headings weighted by repetition, prose with markup stripped. */
function searchText(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>\n]*>/g, " ")
    .replace(/[#>*`_\[\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeForDsxAttr(source) {
  return source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── the sidebar label map ─────────────────────────────────────────────────────────────────
// Display names for the nav (title-cased, short); page h1s keep the source title. A route
// missing here derives: components split camelCase, everything else trims the title to the
// clause before a colon (or a spaced dash) and drops a trailing parenthetical.
const COMPONENT_LABELS = {
  hstack: "HStack", vstack: "VStack", zstack: "ZStack", qrcode: "QR Code", otp: "OTP",
  svg: "SVG", contextmenu: "Context Menu", confirmdialog: "Confirm Dialog",
  datepicker: "Date Picker", rangeslider: "Range Slider", searchbar: "Search Bar",
  textfield: "Text Field", textarea: "Text Area", menubar: "Menu Bar",
  chatbubble: "Chat Bubble", progressring: "Progress Ring", radiogroup: "Radio Group",
  segmentedbutton: "Segmented Button",
};
const PAGE_LABELS = {
  "/": "Introduction",
  "/quickstart": "Quickstart",
  "/system": "Design system",
  "/framework/guides": "Overview",
  "/framework/skills": "Overview",
  "/framework/reference/style": "Overview",
  "/framework/guides/codemagic-build": "Codemagic iOS build",
  "/framework/guides/combinations": "Combination matrix",
  "/framework/guides/combinations/c1-pure-dsx-app": "C1 · Pure DSX app",
  "/framework/guides/combinations/c2-web-app-plus-native": "C2 · Web app + native",
  "/framework/guides/combinations/c3-existing-app-despia-backend": "C3 · Despia backend only",
  "/framework/guides/combinations/c5-dsx-frontend-vendor-backend": "C5 · DSX + vendor backend",
  "/framework/guides/combinations/c7-self-hosted-ota": "C7 · Self-hosted OTA",
  "/framework/guides/despia-api": "The window.dsx API",
  "/framework/guides/native-export": "Native export",
  "/framework/guides/quickstart": "DSX quickstart",
  "/framework/skills/module-content": "Module content",
  "/framework/skills/module-state": "Module context",
  "/framework/skills/writing-a-module-internal": "Writing a module: internal",
  "/framework/skills/js-core": "JS core globals",
};
function componentLabel(route, title) {
  const slug = route.split("/").pop();
  if (COMPONENT_LABELS[slug] !== undefined) return COMPONENT_LABELS[slug];
  const spaced = String(title).replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
function pageLabel(page) {
  if (PAGE_LABELS[page.route] !== undefined) return PAGE_LABELS[page.route];
  if (page.route.startsWith("/components/")) return componentLabel(page.route, page.title);
  let label = String(page.title).replace(/`/g, "");
  label = label.split(/\s+[—–-]\s+|:\s+/)[0];
  label = label.replace(/\s*\([^)]*\)\s*$/, "");
  label = label.replace(/[—–]/g, "-");
  return label.trim() === "" ? page.title : label.trim();
}

/** nav section id for a route: the framework tree splits into Guides and Skills. */
function sectionFor(route, meta) {
  if (meta.section !== undefined && meta.section !== "framework") return meta.section;
  if (route.startsWith("/framework/guides")) return "guides";
  if (route.startsWith("/framework/skills")) return "skills";
  if (route.startsWith("/framework/reference/style")) return "styling";
  return route === "/" ? "" : route.split("/")[1];
}
const SECTION_RANK = { "": 0, guides: 1, components: 2, styling: 3, skills: 4 };

// ── the section splitter (rail anchors) ───────────────────────────────────────────────────
// A page body splits at its h2/h3 headings (fence-aware) so each section renders as its
// own <markdown> inside an anchor wrapper. The web renderer emits no DOM id, so the
// wrapper carries the slug as a `doc-anchor-<slug>` class token; the docs enhancement
// script promotes it to a real id (progressive enhancement, /public/docs.js).
function headingText(inline) {
  return inline.replace(/`([^`]*)`/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "").replace(/\s+/g, " ").trim();
}
function slugFor(text, taken) {
  let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");
  if (slug === "") slug = "section";
  let unique = slug;
  let n = 2;
  while (taken.has(unique)) { unique = `${slug}-${n}`; n += 1; }
  taken.add(unique);
  return unique;
}
function sectionize(body, bodyStart) {
  const taken = new Set();
  const chunks = [{ id: "", title: "", level: 0, lines: [], start: bodyStart }];
  let fence = null;
  let componentDepth = 0;
  body.split("\n").forEach((line, index) => {
    const opener = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence !== null) {
      chunks[chunks.length - 1].lines.push(line);
      if (opener !== null && opener[1].startsWith(fence[0]) && opener[1].length >= fence.length) fence = null;
      return;
    }
    if (opener !== null) {
      fence = opener[1];
      chunks[chunks.length - 1].lines.push(line);
      return;
    }
    // Component blocks are atomic: a heading inside one never splits the page (the
    // block must land whole in a single chunk for its close tag to balance).
    const closing = CLOSE_TAG.exec(line);
    if (closing !== null && componentDepth > 0) componentDepth -= 1;
    else {
      const open = parseOpenTag(line);
      if (open !== null && !open.selfClosing && !open.rest.trim().endsWith(`</${open.name}>`)) componentDepth += 1;
    }
    const heading = componentDepth === 0 ? /^(##|###)\s+(.+?)\s*$/.exec(line) : null;
    if (heading !== null) {
      const title = headingText(heading[2]);
      chunks.push({ id: slugFor(title, taken), title, level: heading[1].length, lines: [line], start: bodyStart + index });
      return;
    }
    chunks[chunks.length - 1].lines.push(line);
  });
  for (const chunk of chunks) chunk.body = chunk.lines.join("\n");
  return chunks.filter((chunk) => chunk.level > 0 || chunk.body.trim() !== "");
}

/** The page body as a JSE STRING LITERAL. A `<variable>` body is a raw code tag, so the
 *  markdown travels as data — a `{{ }}` inside a code example stays four literal braces on
 *  screen instead of becoming a live interpolation, and the linter never sees phantom
 *  bindings. `</` is escaped inside the string so the raw scan can never end early. */
function jseStringLiteral(source) {
  // Every character the document scanners read structurally travels as a \u escape: `<`
  // (a raw `<server>` in an example would open a block), `&` (entities decode before the
  // JSE parse, so `&quot;` would end the string), braces (never an interpolation) and the
  // `dsx.` reach (an example's `dsx.cookie` is prose, not a read the linter should check).
  return JSON.stringify(source)
    .replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026")
    .replace(/\{/g, "\\u007b").replace(/\}/g, "\\u007d")
    .replace(/\bdsx\./g, "dsx\\u002e");
}

// ── components in markdown ────────────────────────────────────────────────────────────────
// A line-anchored Capitalized tag is a COMPONENT BLOCK: the compiler emits it as a real
// DSX node in the generated page and recursively compiles its inner content (markdown
// runs become nested <markdown> chunks in the component's slot). Attributes pass through
// verbatim; fenced code is never scanned for tags, so examples stay text. The name must
// be known - a typo fails the build with file and line, never a silent passthrough. The
// /md siblings and the llms exports keep the source markdown verbatim, tags included.
const CALLOUT_SUGAR = { Note: "note", Info: "info", Tip: "tip", Warning: "warning", Danger: "danger" };
const COMPILER_TAGS = new Set(["Tabs", "Tab", "CodeGroup", ...Object.keys(CALLOUT_SUGAR)]);
const SYSTEM_TAGS = new Set(["Accordion"]);
const libraryComponents = readdirSync(join(root, "Components"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".dsx"))
  .map((entry) => entry.name.replace(/\.dsx$/, ""));
const KNOWN_COMPONENTS = new Set([...libraryComponents, ...COMPILER_TAGS, ...SYSTEM_TAGS]);

const OPEN_TAG = /^\s{0,3}<([A-Z][A-Za-z0-9]*)(?=[\s/>])/;
const CLOSE_TAG = /^\s{0,3}<\/([A-Z][A-Za-z0-9]*)>\s*$/;

/** Parse a line-anchored component open tag that closes on the same line (quotes may
 *  hold `>`); null when the line is not one. `rest` = content after the `>`. */
function parseOpenTag(line) {
  const m = OPEN_TAG.exec(line);
  if (m === null) return null;
  let i = m[0].length;
  let quote = null;
  while (i < line.length) {
    const ch = line[i];
    if (quote !== null) { if (ch === quote) quote = null; }
    else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === ">") break;
    i += 1;
  }
  if (i >= line.length) return null;
  const selfClosing = line[i - 1] === "/";
  const attrs = line.slice(m[0].length, selfClosing ? i - 1 : i).trim();
  return { name: m[1], attrs, selfClosing, rest: line.slice(i + 1) };
}

function fail(page, lineNo, message) {
  console.error(`[docs.compile] ${relative(root, page.file).split(sep).join("/")}:${lineNo}: ${message}`);
  process.exit(1);
}

/** Fence meta: ```lang title="file.ts". A bare info string (language alone) returns
 *  null - the fence stays inside its markdown run. Meta keys are a closed set. */
function parseFenceMeta(page, lineNo, marker, info) {
  if (info === "" || /^[A-Za-z0-9_+-]*$/.test(info)) return null;
  if (marker.length !== 3) fail(page, lineNo, `a fence carrying meta must open with exactly three marks`);
  const m = /^([A-Za-z0-9_+-]*)\s+(.*)$/.exec(info);
  if (m === null) fail(page, lineNo, `unreadable fence info "${info}"`);
  let title = "";
  let meta = m[2].trim();
  while (meta !== "") {
    const kv = /^([A-Za-z-]+)="([^"]*)"\s*(.*)$/.exec(meta);
    if (kv === null) fail(page, lineNo, `unreadable fence meta "${meta}" (expected key="value")`);
    if (kv[1] !== "title") fail(page, lineNo, `unknown fence meta key "${kv[1]}" (supported: title)`);
    title = kv[2];
    meta = kv[3].trim();
  }
  return { lang: m[1], title };
}

/** Find the balanced line-anchored `</name>` from `from`, fence-aware, counting nested
 *  same-name opens. Returns the close line's index; a missing close fails the build. */
function findClose(page, lines, from, name, startLine) {
  let depth = 1;
  let fence = null;
  for (let i = from; i < lines.length; i += 1) {
    const line = lines[i];
    const opener = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence !== null) {
      if (opener !== null && opener[1].startsWith(fence[0]) && opener[1].length >= fence.length) fence = null;
      continue;
    }
    if (opener !== null) { fence = opener[1]; continue; }
    const close = CLOSE_TAG.exec(line);
    if (close !== null && close[1] === name) {
      depth -= 1;
      if (depth === 0) return i;
      continue;
    }
    const open = parseOpenTag(line);
    if (open !== null && open.name === name && !open.selfClosing && !open.rest.trim().endsWith(`</${name}>`)) depth += 1;
  }
  fail(page, startLine + from - 1, `<${name}> never closes (expected a line-anchored </${name}>)`);
}

function attrValue(attrs, name) {
  const m = new RegExp(`${name}="([^"]*)"`).exec(attrs);
  return m === null ? null : m[1];
}

function pushMdVar(page, text) {
  return page.mdVars.push(text) - 1;
}

/** One titled fence as a code card: header bar (language chip, title) + the fence as a
 *  markdown chunk. docs.js adds the copy button into the bar; bare fences keep their
 *  floating button instead. */
function codeblockNode(page, meta, marker, body, indent) {
  const n = pushMdVar(page, `${marker}${meta.lang}\n${body.join("\n")}\n${marker}`);
  return [
    `${indent}<stack class="doc-codeblock">`,
    `${indent}  <hstack class="doc-codebar">`,
    ...(meta.lang !== "" ? [`${indent}    <text value="${escapeForDsxAttr(meta.lang)}" class="doc-codebar-lang"/>`] : []),
    ...(meta.title !== "" ? [`${indent}    <text value="${escapeForDsxAttr(meta.title)}" class="doc-codebar-title"/>`] : []),
    `${indent}  </hstack>`,
    `${indent}  <markdown bind="dsx.variable.md${n}"/>`,
    `${indent}</stack>`,
  ].join("\n");
}

/** The inner blocks of a container that accepts ONLY <name> children (Tabs -> Tab). */
function childBlocks(page, inner, name, parent) {
  const blocks = [];
  const lines = inner.lines;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i += 1; continue; }
    const tag = parseOpenTag(line);
    if (tag === null || tag.name !== name) fail(page, inner.startLine + i, `<${parent}> accepts only <${name}> children`);
    if (tag.selfClosing) fail(page, inner.startLine + i, `<${name}> needs body content`);
    const restTrim = tag.rest.trim();
    if (restTrim !== "") {
      const closeTok = `</${name}>`;
      if (!restTrim.endsWith(closeTok)) fail(page, inner.startLine + i, `<${name}> with inline content must close on the same line`);
      blocks.push({ tag, at: inner.startLine + i, inner: { lines: [restTrim.slice(0, -closeTok.length).trim()], startLine: inner.startLine + i } });
      i += 1;
      continue;
    }
    const end = findClose(page, lines, i + 1, name, inner.startLine);
    blocks.push({ tag, at: inner.startLine + i, inner: { lines: lines.slice(i + 1, end), startLine: inner.startLine + i + 1 } });
    i = end + 1;
  }
  if (blocks.length === 0) fail(page, inner.startLine, `<${parent}> needs at least one <${name}> child`);
  return blocks;
}

/** CodeGroup inner content: fenced blocks only, each one pane of the shared tab bar. */
function codeGroupPanes(page, inner) {
  const panes = [];
  const lines = inner.lines;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i += 1; continue; }
    const opener = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (opener === null) fail(page, inner.startLine + i, `<CodeGroup> accepts only fenced code blocks`);
    const marker = opener[1];
    if (marker.length !== 3) fail(page, inner.startLine + i, `<CodeGroup> fences must open with exactly three marks`);
    const info = opener[2].trim();
    const meta = parseFenceMeta(page, inner.startLine + i, marker, info) ?? { lang: info, title: "" };
    const body = [];
    i += 1;
    while (i < lines.length && !(lines[i].trim().startsWith(marker[0].repeat(3)) && lines[i].trim().replace(new RegExp(`^${marker[0]}+`), "") === "")) {
      body.push(lines[i]);
      i += 1;
    }
    if (i >= lines.length) fail(page, inner.startLine, `<CodeGroup> holds an unterminated fence`);
    i += 1;
    panes.push({ meta, marker, body });
  }
  if (panes.length === 0) fail(page, inner.startLine, `<CodeGroup> needs at least one fenced block`);
  return panes;
}

function componentNode(page, tag, inner, at, indent) {
  const attrs = tag.attrs === "" ? "" : ` ${tag.attrs}`;
  const sugar = CALLOUT_SUGAR[tag.name];
  if (sugar !== undefined) {
    if (inner === null) return `${indent}<Callout kind="${sugar}"${attrs}/>`;
    const children = compileBody(page, inner.lines, inner.startLine, `${indent}  `);
    return `${indent}<Callout kind="${sugar}"${attrs}>\n${children.join("\n")}\n${indent}</Callout>`;
  }
  if (tag.name === "Tab") fail(page, at, `<Tab> only lives inside <Tabs>`);
  if (tag.name === "Tabs") {
    if (inner === null) fail(page, at, `<Tabs> needs <Tab> children`);
    const panes = childBlocks(page, inner, "Tab", "Tabs").map((block) => {
      const title = attrValue(block.tag.attrs, "title");
      if (title === null) fail(page, block.at, `<Tab> needs a title="..."`);
      const children = compileBody(page, block.inner.lines, block.inner.startLine, `${indent}      `);
      return `${indent}    <stack tabTitle="${escapeForDsxAttr(title)}" class="doc-tab-pane">\n${children.join("\n")}\n${indent}    </stack>`;
    });
    return `${indent}<stack class="doc-tabs">\n${indent}  <tabs${attrs}>\n${panes.join("\n")}\n${indent}  </tabs>\n${indent}</stack>`;
  }
  if (tag.name === "CodeGroup") {
    if (inner === null) fail(page, at, `<CodeGroup> needs fenced blocks`);
    const panes = codeGroupPanes(page, inner).map((pane) => {
      const title = pane.meta.title !== "" ? pane.meta.title : (pane.meta.lang !== "" ? pane.meta.lang : "code");
      const n = pushMdVar(page, `${pane.marker}${pane.meta.lang}\n${pane.body.join("\n")}\n${pane.marker}`);
      return `${indent}    <stack tabTitle="${escapeForDsxAttr(title)}" class="doc-tab-pane"><markdown bind="dsx.variable.md${n}"/></stack>`;
    });
    return `${indent}<stack class="doc-codegroup">\n${indent}  <tabs${attrs}>\n${panes.join("\n")}\n${indent}  </tabs>\n${indent}</stack>`;
  }
  if (inner === null) return `${indent}<${tag.name}${attrs}/>`;
  const children = compileBody(page, inner.lines, inner.startLine, `${indent}  `);
  if (children.length === 0) return `${indent}<${tag.name}${attrs}/>`;
  return `${indent}<${tag.name}${attrs}>\n${children.join("\n")}\n${indent}</${tag.name}>`;
}

/** Compile a run of markdown lines into DSX nodes: markdown chunks (page variables +
 *  <markdown> binds), component blocks (real DSX nodes, inner content recursed) and
 *  titled fences (code cards). The recursion IS the authoring system. */
function compileBody(page, lines, startLine, indent) {
  const nodes = [];
  let run = [];
  const flushRun = () => {
    const text = run.join("\n").replace(/^\n+/, "").replace(/\n+$/, "");
    run = [];
    if (text.trim() === "") return;
    nodes.push(`${indent}<markdown bind="dsx.variable.md${pushMdVar(page, text)}"/>`);
  };
  let i = 0;
  let fence = null;
  while (i < lines.length) {
    const line = lines[i];
    const opener = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence !== null) {
      run.push(line);
      if (opener !== null && opener[1].startsWith(fence[0]) && opener[1].length >= fence.length) fence = null;
      i += 1;
      continue;
    }
    if (opener !== null) {
      const meta = parseFenceMeta(page, startLine + i, opener[1], opener[2].trim());
      if (meta === null) {
        fence = opener[1];
        run.push(line);
        i += 1;
        continue;
      }
      flushRun();
      const marker = opener[1];
      const body = [];
      i += 1;
      while (i < lines.length && !(lines[i].trim().startsWith(marker) && lines[i].trim().replace(new RegExp(`^${marker[0]}+`), "") === "")) {
        body.push(lines[i]);
        i += 1;
      }
      if (i >= lines.length) fail(page, startLine, `unterminated fence`);
      i += 1;
      nodes.push(codeblockNode(page, meta, marker, body, indent));
      continue;
    }
    const closing = CLOSE_TAG.exec(line);
    if (closing !== null) fail(page, startLine + i, `stray closing tag </${closing[1]}>`);
    const tag = parseOpenTag(line);
    if (tag !== null) {
      if (!KNOWN_COMPONENTS.has(tag.name)) {
        fail(page, startLine + i, `unknown component <${tag.name}> - known: ${[...KNOWN_COMPONENTS].sort().join(", ")}. Add Components/${tag.name}.dsx to extend the set.`);
      }
      flushRun();
      let inner = null;
      if (!tag.selfClosing) {
        const restTrim = tag.rest.trim();
        if (restTrim !== "") {
          const closeTok = `</${tag.name}>`;
          if (!restTrim.endsWith(closeTok)) fail(page, startLine + i, `<${tag.name}> with inline content must close on the same line`);
          inner = { lines: [restTrim.slice(0, -closeTok.length).trim()], startLine: startLine + i };
        } else {
          const end = findClose(page, lines, i + 1, tag.name, startLine);
          inner = { lines: lines.slice(i + 1, end), startLine: startLine + i + 1 };
          i = end;
        }
      }
      nodes.push(componentNode(page, tag, inner, startLine + i, indent));
      i += 1;
      continue;
    }
    run.push(line);
    i += 1;
  }
  flushRun();
  return nodes;
}

const files = walk(contentDir);
if (files.length === 0) {
  console.error("[docs.compile] content/ holds no markdown — nothing to build");
  process.exit(1);
}

rmSync(generatedDir, { recursive: true, force: true });
mkdirSync(generatedDir, { recursive: true });
mkdirSync(join(publicDir, "md"), { recursive: true });

const pages = files.map((file) => {
  const source = readFileSync(file, "utf8");
  const { meta, body } = frontMatter(source);
  const route = meta.route ?? routeFor(file);
  const title = meta.title ?? firstHeading(body) ?? relative(contentDir, file);
  const section = sectionFor(route, meta);
  return {
    file,
    route,
    title,
    section,
    order: Number(meta.order ?? 1000),
    description: meta.description ?? "",
    body,
    bodyStart: source.split("\n").length - body.split("\n").length + 1,
    component: componentNameFor(route),
  };
}).sort((a, b) => a.order - b.order || (a.route < b.route ? -1 : 1));

/** Hand-authored pages: real DSX documents at the Components root (never generated —
 *  this compiler owns and wipes only Components/pages). Each entry joins the route
 *  table, the nav model and the search index exactly like a compiled page; having no
 *  markdown source, they stay out of the /md siblings and the llms exports. */
const handAuthored = [
  {
    route: "/system",
    component: "System",
    title: "System",
    section: "",
    order: 2,
    description: "The design system as a living page: every element in its states.",
    search: "design system gallery elements states buttons fields selection toggle segmented picker slider stepper list rows cards surfaces tabs sheet typography color tokens spacing radius",
  },
];

const entries = [...pages, ...handAuthored].sort((a, b) => a.order - b.order || (a.route < b.route ? -1 : 1));

const duplicate = entries.map((p) => p.route).filter((r, i, all) => all.indexOf(r) !== i);
if (duplicate.length > 0) {
  console.error(`[docs.compile] duplicate route(s): ${[...new Set(duplicate)].join(" · ")}`);
  process.exit(1);
}

// ── the nav model (sections in reading rank, display labels, prev/next order) ─────────────
const sections = [];
for (const page of entries) {
  const name = page.section === "" ? "Start" : page.section.replace(/(^|-)([a-z])/g, (_, __, c) => " " + c.toUpperCase()).trim();
  let section = sections.find((s) => s.name === name);
  if (section === undefined) { section = { name, rank: SECTION_RANK[page.section] ?? 9, pages: [] }; sections.push(section); }
  section.pages.push({ route: page.route, title: page.title, label: pageLabel(page), section: name });
}
sections.sort((a, b) => a.rank - b.rank);
const flatNav = sections.flatMap((s) => s.pages);
const neighborsOf = (route) => {
  const at = flatNav.findIndex((p) => p.route === route);
  return { prev: at > 0 ? flatNav[at - 1] : null, next: at >= 0 && at < flatNav.length - 1 ? flatNav[at + 1] : null };
};

// ── the generated page components ─────────────────────────────────────────────────────────
for (const page of pages) {
  const mdRoute = page.route === "/" ? "/md/index.md" : `/md${page.route}.md`;
  const chunks = sectionize(page.body, page.bodyStart);
  const toc = chunks.filter((c) => c.level > 0).map((c) => ({ id: c.id, title: c.title, level: c.level }));
  const { prev, next } = neighborsOf(page.route);
  const sectionName = flatNav.find((p) => p.route === page.route)?.section ?? "";
  page.mdVars = [];
  const blocks = chunks.map((chunk) => {
    if (chunk.level === 0) return compileBody(page, chunk.lines, chunk.start, "    ").join("\n");
    const nodes = compileBody(page, chunk.lines, chunk.start, "      ");
    return `    <stack class="doc-section doc-anchor-${chunk.id}">\n${nodes.join("\n")}\n    </stack>`;
  }).filter((block) => block !== "").join("\n");
  const vars = page.mdVars.map((text, i) =>
    `    <variable as="md${i}">return ${jseStringLiteral(text)}</variable>`).join("\n");
  const shellAttrs = [
    `title="${escapeForDsxAttr(page.title)}"`,
    `label="${escapeForDsxAttr(pageLabel(page))}"`,
    `route="${page.route}"`,
    `md="${mdRoute}"`,
    `section="${escapeForDsxAttr(sectionName)}"`,
    `toc="${escapeForDsxAttr(JSON.stringify(toc))}"`,
    ...(prev !== null ? [`prev="${prev.route}"`, `prevLabel="${escapeForDsxAttr(prev.label)}"`] : []),
    ...(next !== null ? [`next="${next.route}"`, `nextLabel="${escapeForDsxAttr(next.label)}"`] : []),
  ].join(" ");
  writeFileSync(join(generatedDir, `${page.component}.dsx`), `<scroll theme="{{ dsx.global.docs &amp;&amp; dsx.global.docs.theme ? dsx.global.docs.theme : '' }}" style="background: var(--dsx-background)">
  <head>
    <!-- GENERATED by scripts/compile.mjs from ${relative(root, page.file).split(sep).join("/")} - edit the markdown, not this file. -->
${vars}
  </head>
  <DocShell ${shellAttrs}>
${blocks}
  </DocShell>
</scroll>
`);
  const mdOut = join(publicDir, "md", ...(page.route === "/" ? ["index.md"] : (page.route.slice(1) + ".md").split("/")));
  mkdirSync(dirname(mdOut), { recursive: true });
  writeFileSync(mdOut, readFileSync(page.file));
}

// ── the generated sidebar (DocNav) ────────────────────────────────────────────────────────
// The whole nav model as static markup: every row a real SSR'd anchor, grouped under
// uppercase micro-labels, the active row resolved from the route attribute at render
// time (class formula, S1). No api fetch, no client dependency.
const navRows = sections.map((section) => {
  const label = `  <text value="${escapeForDsxAttr(section.name)}" class="doc-nav-label"/>`;
  const rows = section.pages.map((p) =>
    `  <pressable href="${p.route}" on:tap="dsx.event('navigate')" class="doc-nav-link{{ dsx.attribute.route === '${p.route}' ? ' is-active' : '' }}"><text value="${escapeForDsxAttr(p.label)}" class="doc-nav-text"/></pressable>`);
  return [label, ...rows].join("\n");
}).join("\n");
writeFileSync(join(generatedDir, "DocNav.dsx"), `<stack class="doc-nav" role="navigation" a11yLabel="Documentation">
  <head>
    <!-- GENERATED by scripts/compile.mjs (the nav model as static markup) - edit the content tree, not this file. -->
    <attribute as="route" default="''"/>
    <event as="navigate"/>
  </head>
${navRows}
</stack>
`);

// ── the generated /system card wall (SystemCards) ─────────────────────────────────────────
// The component reference as a card grid: name + one-line role per card, every card a
// real anchor. Roles come from each reference page's front-matter description.
const cardRoleFor = (description) => {
  const clause = String(description).replace(/\.\s*$/, "").split(": ")[0].trim();
  return clause.charAt(0).toUpperCase() + clause.slice(1);
};
const cardRows = entries.filter((p) => p.route.startsWith("/components/")).map((p) =>
  `  <pressable href="${p.route}" class="doc-card">
    <text value="${escapeForDsxAttr(componentLabel(p.route, p.title))}" class="doc-card-name"/>
    <text value="${escapeForDsxAttr(cardRoleFor(p.description))}" class="doc-card-role"/>
  </pressable>`).join("\n");
writeFileSync(join(generatedDir, "SystemCards.dsx"), `<stack class="doc-cardwall">
  <head>
    <!-- GENERATED by scripts/compile.mjs (the component reference as a card grid). -->
  </head>
${cardRows}
</stack>
`);

// ── the route table ───────────────────────────────────────────────────────────────────────
const config = JSON.parse(readFileSync(join(root, "dsx.config.json"), "utf8"));
config.routes = entries.map((p) => ({
  path: p.route,
  component: `docs.${p.component}`,
  meta: { title: p.title, ...(p.description !== "" ? { description: p.description } : {}) },
}));
writeFileSync(join(root, "dsx.config.json"), JSON.stringify(config, null, 2) + "\n");

writeFileSync(join(publicDir, "nav.json"), JSON.stringify({
  sections: sections.map((s) => ({ name: s.name, pages: s.pages.map(({ route, title, label }) => ({ route, title, label })) })),
}, null, 1) + "\n");

// ── the client search index ───────────────────────────────────────────────────────────────
writeFileSync(join(publicDir, "search-index.json"), JSON.stringify({
  pages: entries.map((p) => ({
    route: p.route,
    title: p.title,
    label: pageLabel(p),
    section: p.section,
    text: (p.body === undefined ? (p.search ?? p.description) : searchText(p.body)).slice(0, 4000),
  })),
}, null, 1) + "\n");

// ── llms.txt + llms-full.txt ──────────────────────────────────────────────────────────────
// llms speaks markdown, so it lists only markdown-backed pages (hand-authored DSX has
// no /md sibling to link).
const mdRoutes = new Set(pages.map((p) => p.route));
const site = "https://docs.despia.com";
writeFileSync(join(publicDir, "llms.txt"), [
  "# Despia documentation",
  "",
  "> Documentation for Despia, the web-optional native runtime: one set of DSX documents",
  "> rendered as native iOS, native Android, an installable PWA and a server-rendered site.",
  "",
  "Every page serves its raw markdown at the sibling path under /md/.",
  "",
  ...sections.filter((s) => s.pages.some((p) => mdRoutes.has(p.route))).flatMap((s) => [
    `## ${s.name}`,
    "",
    ...s.pages.filter((p) => mdRoutes.has(p.route))
      .map((p) => `- [${p.title}](${site}${p.route === "/" ? "/md/index.md" : `/md${p.route}.md`})`),
    "",
  ]),
].join("\n"));
writeFileSync(join(publicDir, "llms-full.txt"),
  pages.map((p) => `# ${p.title}\n(${site}${p.route})\n\n${p.body}`).join("\n\n---\n\n"));

console.log(`[docs.compile] ${pages.length} page(s) + ${handAuthored.length} hand-authored → Components/pages (+ DocNav, SystemCards), routes, nav, search index, md copies, llms.txt`);
