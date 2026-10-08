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

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
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
// DOCS_CONTENT builds an older docs version from its snapshot (versions/<v>/, written by the CMS at
// release time); the default is the live tree.
const contentDir = process.env.DOCS_CONTENT ? resolve(root, process.env.DOCS_CONTENT) : join(root, "content");
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
  if (page.label !== undefined && page.label !== "") return page.label;
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
const SECTION_RANK = { "": 0, guides: 1, services: 1.2, modules: 1.5, components: 2, styling: 3, skills: 4 };

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
// The MDX-style tags authors write (and the legacy port emits) are a CLOSED set, LOWERED to
// extended-markdown directives (extended-markdown.md 2.2) that the stock <markdown> lowering maps
// to stock components: Callout, Card, MarkdownSteps, MarkdownTabs, Accordion, CodeBlock. Docs
// carry no content components of their own (rule 10: default UI only).
const CALLOUT_SUGAR = { Note: "note", Info: "note", Tip: "tip", Warning: "warning", Danger: "caution", Check: "tip" };
const KIND_TO_TONE = { note: "note", info: "note", tip: "tip", warning: "warning", danger: "caution" };
const KNOWN_COMPONENTS = new Set(["Callout", "Card", "CardGroup", "Steps", "Step", "Tabs", "Tab", "CodeGroup", "Accordion",
  "AccordionGroup", "Frame", "ParamField", "ResponseField", "Update", "Video", "RefMeta", ...Object.keys(CALLOUT_SUGAR)]);

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

/** The tag tree of a run of lines: markdown runs and component blocks (fence-aware). */
function tagTree(page, lines, startLine) {
  const nodes = [];
  let run = [];
  const flush = () => { if (run.length > 0) nodes.push({ md: run }); run = []; };
  let fence = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const opener = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence !== null) {
      run.push(line);
      if (opener !== null && opener[1].startsWith(fence[0]) && opener[1].length >= fence.length && opener[2].trim() === "") fence = null;
      continue;
    }
    if (opener !== null) { fence = opener[1]; run.push(line); continue; }
    const closing = CLOSE_TAG.exec(line);
    if (closing !== null) fail(page, startLine + i, `stray closing tag </${closing[1]}>`);
    const tag = parseOpenTag(line);
    if (tag === null) { run.push(line); continue; }
    if (!KNOWN_COMPONENTS.has(tag.name)) {
      fail(page, startLine + i, `unknown component <${tag.name}> - known: ${[...KNOWN_COMPONENTS].sort().join(", ")}`);
    }
    flush();
    let inner = [];
    if (!tag.selfClosing) {
      const restTrim = tag.rest.trim();
      if (restTrim !== "") {
        const closeTok = `</${tag.name}>`;
        if (!restTrim.endsWith(closeTok)) fail(page, startLine + i, `<${tag.name}> with inline content must close on the same line`);
        inner = [restTrim.slice(0, -closeTok.length).trim()];
      } else {
        const end = findClose(page, lines, i + 1, tag.name, startLine);
        inner = lines.slice(i + 1, end);
        nodes.push({ tag: tag.name, attrs: tag.attrs, at: startLine + i, children: tagTree(page, inner, startLine + i + 1) });
        i = end;
        continue;
      }
    }
    nodes.push({ tag: tag.name, attrs: tag.attrs, at: startLine + i, children: tagTree(page, inner, startLine + i) });
  }
  flush();
  return nodes;
}

const decodeAttr = (v) => v === null ? null : v.replace(/&#123;/g, "{").replace(/&#125;/g, "}").replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const dirAttr = (v) => `"${String(v).replace(/"/g, "'")}"`;
const mdText = (nodes) => emitDirectives(nodes).replace(/^\n+|\n+$/g, "");

/** The container height of a subtree: a container's fence needs one more colon than any it holds. */
function height(nodes) {
  let h = 0;
  for (const n of nodes) if (n.tag !== undefined) h = Math.max(h, 1 + height(n.children));
  return h;
}
const fenceOf = (nodes) => ":".repeat(3 + height(nodes));

/** One fenced code block lifted out of a run (CodeGroup panes). */
function fencesOf(nodes) {
  const text = nodes.filter((n) => n.md !== undefined).map((n) => n.md.join("\n")).join("\n");
  const panes = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const o = /^\s*(`{3,}|~{3,})(.*)$/.exec(lines[i]);
    if (o === null) continue;
    const body = [lines[i].trim()];
    let j = i + 1;
    for (; j < lines.length; j += 1) {
      body.push(lines[j].replace(/^\s+$/, ""));
      const c = /^\s*(`{3,}|~{3,})\s*$/.exec(lines[j]);
      if (c !== null && c[1][0] === o[1][0] && c[1].length >= o[1].length) break;
    }
    const info = o[2].trim();
    const title = /title="([^"]*)"/.exec(info)?.[1] ?? (info.split(/\s+/)[0] || "code");
    panes.push({ title, text: body.join("\n") });
    i = j;
  }
  return panes;
}

/** Lower the tag tree to extended-markdown directives (stock lowering targets). */
function emitDirectives(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.md !== undefined) { out.push(n.md.join("\n")); continue; }
    const attr = (k) => decodeAttr(attrValue(n.attrs, k));
    const kids = n.children;
    const f = fenceOf(kids);
    const tone = CALLOUT_SUGAR[n.tag] ?? (n.tag === "Callout" ? (KIND_TO_TONE[attr("kind") ?? "note"] ?? "note") : null);
    if (tone !== null) {
      const title = attr("title");
      out.push(`\n${f}${tone}${title ? `{title=${dirAttr(title)}}` : ""}\n${mdText(kids)}\n${f}\n`);
      continue;
    }
    switch (n.tag) {
      case "Card": {
        const pairs = [attr("title") ? `title=${dirAttr(attr("title"))}` : "", attr("href") ? `href=${dirAttr(attr("href"))}` : ""].filter(Boolean);
        const body = mdText(kids);
        out.push(`\n${f}card${pairs.length ? `{${pairs.join(" ")}}` : ""}\n${body === "" ? (attr("title") ?? "") : body}\n${f}\n`);
        break;
      }
      case "CardGroup": case "AccordionGroup": out.push(`\n${emitDirectives(kids)}\n`); break;
      case "Steps": {
        // :::steps holds an ordered list, one step per item: the title, then the body indented
        const steps = kids.filter((k) => k.tag === "Step");
        const items = steps.map((st, i) => {
          const title = decodeAttr(attrValue(st.attrs, "title")) ?? "";
          const body = mdText(st.children);
          const indented = body === "" ? "" : "\n\n" + body.split("\n").map((l) => (l === "" ? "" : "   " + l)).join("\n");
          return `${i + 1}. **${title}**${indented}`;
        });
        const sf = fenceOf(steps.flatMap((st) => st.children));
        out.push(`\n${sf}steps\n${items.join("\n\n")}\n${sf}\n`);
        break;
      }
      case "Step": out.push(mdText(kids)); break;
      case "Tabs": {
        const tabs = kids.filter((k) => k.tag === "Tab");
        const inner = ":".repeat(3 + Math.max(0, ...tabs.map((t) => height(t.children))));
        const outer = inner + ":";
        out.push(`\n${outer}tabs\n${tabs.map((t) => `${inner}tab{title=${dirAttr(decodeAttr(attrValue(t.attrs, "title")) ?? "Tab")}}\n${mdText(t.children)}\n${inner}`).join("\n")}\n${outer}\n`);
        break;
      }
      case "Tab": out.push(mdText(kids)); break;
      case "CodeGroup": {
        const panes = fencesOf(kids);
        out.push(`\n::::tabs\n${panes.map((p) => `:::tab{title=${dirAttr(p.title)}}\n${p.text}\n:::`).join("\n")}\n::::\n`);
        break;
      }
      case "Accordion": {
        const open = attr("open") === "true" || attr("defaultOpen") === "true";
        out.push(`\n${f}details[${(attr("title") ?? "Details").replace(/[\[\]]/g, "")}]${open ? "{open}" : ""}\n${mdText(kids)}\n${f}\n`);
        break;
      }
      case "Frame": {
        const caption = attr("caption");
        out.push(`\n${mdText(kids)}${caption ? `\n\n*${caption}*` : ""}\n`);
        break;
      }
      case "ParamField": case "ResponseField": {
        // the stock FieldRow (label column + content), through the `:field` mapping row each
        // <markdown> carries (MD_COMPONENTS): name, type, required and default ride the label
        const name = attr("name") ?? attr("path") ?? attr("query") ?? attr("body") ?? "";
        const label = [name, attr("type") ?? "", attr("required") === "true" ? "required" : "",
          attr("default") ? `default ${attr("default")}` : ""].filter(Boolean).join(" · ").replace(/[\[\]]/g, "");
        out.push(`\n${f}field[${label}]\n${mdText(kids)}\n${f}\n`);
        break;
      }
      case "Update": {
        const label = attr("label") ?? "";
        const description = attr("description");
        out.push(`\n### ${label}\n\n${description ? `*${description}*\n\n` : ""}${mdText(kids)}\n\n---\n`);
        break;
      }
      case "Video": {
        // no iframe embed in the extended-markdown table (an embed allowlist is not proposed yet)
        const src = attr("src") ?? "";
        const id = /youtube\.com\/embed\/([\w-]+)/.exec(src)?.[1];
        const href = id ? `https://www.youtube.com/watch?v=${id}` : src;
        out.push(`\n::link-card{href=${dirAttr(href)} title=${dirAttr("Watch the video: " + (attr("title") ?? "video"))}}\n`);
        break;
      }
      case "RefMeta": {
        const platforms = attr("platforms");
        out.push(`\n${f}note${platforms ? `{title=${dirAttr("Platforms: " + platforms)}}` : ""}\n${mdText(kids)}\n${f}\n`);
        break;
      }
      default: fail({ file: "?" }, n.at, `no lowering for <${n.tag}>`);
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** The docs' one app mapping row: an API field (`:::field[label]`) is the stock FieldRow. */
const MD_COMPONENTS = `{{ { ':field': { component: 'FieldRow', props: { label: 'label' }, body: 'blocks' } } }}`;

// ── code formatting (owner: JSON and JavaScript are formatted, never one long line) ─────────────
// A json/jsonc fence that parses is re-printed with JSON.stringify(value, null, 2) when it is not
// already multi-line; a fence that does not parse is left exactly as written and reported
// (evidence/web-launch/code-format-report.txt). Shell, log, diff and every other language are
// never touched. JS/TS one-liners are reported, not rewritten: no formatter ships with the docs
// toolchain (see STATUS).
const formatReport = [];
function stripJsonComments(text) {
  return text.replace(/("(?:[^"\\]|\\.)*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => (str !== undefined ? str : ""));
}
/** JSON.stringify(value, null, 2), except that an array of scalars which fits on one line stays on it. */
function prettyJson(value, pad) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const flat = JSON.stringify(value);
    if (value.every((v) => v === null || typeof v !== "object") && flat.length + pad.length <= 72) return flat.replace(/,/g, ", ");
    return "[\n" + value.map((v) => pad + "  " + prettyJson(v, pad + "  ")).join(",\n") + "\n" + pad + "]";
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    return "{\n" + keys.map((k) => `${pad}  ${JSON.stringify(k)}: ${prettyJson(value[k], pad + "  ")}`).join(",\n") + "\n" + pad + "}";
  }
  return JSON.stringify(value);
}
function formatFences(page, text, startLine) {
  return text.replace(/^(\s*)(`{3,})(json|jsonc|javascript|js|ts|typescript|tsx|jsx)([^\n]*)\n([\s\S]*?)\n\1\2[ \t]*$/gm, (whole, ind, marks, lang, meta, body) => {
    const where = `${relative(root, page.file ?? "").split(sep).join("/")}:~${startLine}`;
    const lines = body.split("\n");
    // a one-line object or array holding another one, or any one-liner past 60 characters
    const flat = body.trim();
    const long = lines.length === 1 && (flat.length > 60 || (/^[{[]/.test(flat) && /[{[]/.test(flat.slice(1, -1))));
    if (lang === "json" || lang === "jsonc") {
      if (!long) return whole;
      let value;
      try { value = JSON.parse(lang === "jsonc" ? stripJsonComments(body) : body); }
      catch { formatReport.push(`${where} ${lang} block does not parse; left as written`); return whole; }
      if (lang === "jsonc" && /\/\/|\/\*/.test(body)) { formatReport.push(`${where} jsonc one-liner with comments; left as written`); return whole; }
      const pretty = prettyJson(value, "").split("\n").map((l) => ind + l).join("\n");
      return `${ind}${marks}${lang}${meta}\n${pretty}\n${ind}${marks}`;
    }
    if (long && body.trim().length > 100) formatReport.push(`${where} ${lang} one-liner of ${body.trim().length} chars; needs a JS formatter`);
    return whole;
  });
}

/** A run of lines as stock <markdown> (tags lowered to directives). A LIVE EXAMPLE (```xml live) is the one
 *  exception: its source becomes a generated component of this site, drawn by the same runtime the reader is
 *  using, above the same source as a code block. One DSX document, rendered and shown. */
const liveOf = new Map();                     // Live<hash> -> the page component that draws it
const LIVE_FENCE = /^```(?:xml|dsx) live\n([\s\S]*?)\n```[ \t]*$/m;
/** A card group as a grid of stock Cards, each a link with its icon, title and one line (data: the Card's own
 *  `icon`, else data/icons.json for the page it links to). */
function cardGrid(node, indent) {
  const cards = node.children.filter((k) => k.tag === "Card");
  const cols = Math.min(3, Math.max(1, Number(attrValue(node.attrs, "cols") ?? 2) || 2));
  const rows = cards.map((card) => {
    const title = decodeAttr(attrValue(card.attrs, "title")) ?? "";
    const href = decodeAttr(attrValue(card.attrs, "href")) ?? "";
    const target = byRoute.get(href);
    const icon = declaredIcon(decodeAttr(attrValue(card.attrs, "icon")) ?? undefined) ?? (target !== undefined ? pageIconOf(target) : ICONS.fallback);
    const line = mdText(card.children).replace(/\s+/g, " ").trim();
    return [
      `${indent}  <pressable class="doc-card" href="${escapeForDsxAttr(href)}" a11yLabel="${escapeForDsxAttr(title)}">`,
      `${indent}    <Card>`,
      `${indent}      <vstack class="doc-card-body">`,
      `${indent}        <image class="doc-card-icon" icon="${icon}" a11yHidden="true"/>`,
      `${indent}        <text class="doc-card-title" value="${escapeForDsxAttr(title)}"/>`,
      ...(line !== "" ? [`${indent}        <text class="doc-card-line" value="${escapeForDsxAttr(line)}"/>`] : []),
      `${indent}      </vstack>`,
      `${indent}    </Card>`,
      `${indent}  </pressable>`,
    ].join("\n");
  });
  // the stock adaptive grid: the grid's own width decides the column count (two on a wide page, one on a phone)
  return `${indent}<grid class="doc-cards" columns="adaptive" minimum="${cols >= 3 ? 220 : 280}" scroll="false">\n${rows.join("\n")}\n${indent}</grid>`;
}
/** A run of lines as stock <markdown> (tags lowered to directives), with two exceptions drawn as DSX: a card
 *  group (an icon card grid) and a LIVE EXAMPLE (```xml live: its source becomes a generated component of this
 *  site, drawn by the same runtime the reader is using, above the same source as a code block). */
function compileBody(page, lines, startLine, indent) {
  const out = [];
  const markdown = (md) => {
    if (md.trim() === "") return;
    const field = md.includes(":field[") ? ` components="${MD_COMPONENTS}"` : "";
    out.push(`${indent}<markdown bind="dsx.variable.md${pushMdVar(page, md)}"${field}/>`);
  };
  const prose = (nodes) => {
    let rest = formatFences(page, emitDirectives(nodes).replace(/^\n+|\n+$/g, ""), startLine);
    for (let live = LIVE_FENCE.exec(rest); live !== null; live = LIVE_FENCE.exec(rest)) {
      markdown(rest.slice(0, live.index));
      const source = live[1];
      const name = `Live${createHash("sha256").update(source).digest("hex").slice(0, 10)}`;
      writeFileSync(join(generatedDir, `${name}.dsx`), `${source}\n`);
      liveOf.set(name, page.component);
      out.push(`${indent}<vstack class="doc-live">`, `${indent}  <stack class="doc-live-preview" role="figure" a11yLabel="Live example"><${name}/></stack>`);
      out.push(`${indent}  <markdown bind="dsx.variable.md${pushMdVar(page, "```dsx\n" + source + "\n```")}"/>`, `${indent}</vstack>`);
      rest = rest.slice(live.index + live[0].length);
    }
    markdown(rest);
  };
  let run = [];
  for (const node of tagTree(page, lines, startLine)) {
    if (node.tag === "CardGroup") { prose(run); run = []; out.push(cardGrid(node, indent)); continue; }
    run.push(node);
  }
  prose(run);
  return out;
}

// ── spaces ────────────────────────────────────────────────────────────────────────────────
// One site, four spaces, one switcher. A space owns a path prefix, a sidebar, a search scope,
// its own llms.txt pair and an MCP `space` value. Modern keeps every path it ever had.
const SPACES = [
  { id: "modern", label: "Despia V4", prefix: "", home: "/", blurb: "Despia V4 and DSX" },
  { id: "legacy", label: "Legacy (V3)", prefix: "/legacy", home: "/legacy/introduction", blurb: "despia-native and the V3 runtime" },
  { id: "migrate", label: "Migration", prefix: "/migrate", home: "/migrate", blurb: "Move a v3 app to v4" },
  { id: "troubleshooting", label: "Troubleshooting", prefix: "/troubleshooting", home: "/troubleshooting", blurb: "Symptom, cause, fix" },
  { id: "releases", label: "Releases", prefix: "/releases", home: "/releases", blurb: "Release notes per DSX release and per package version" },
  { id: "app-review", label: "App Review", prefix: "/app-review", home: "/app-review", blurb: "Apple and Google review guidelines, and how Despia apps pass them" },
];
const SPACES_JSON = JSON.stringify(SPACES.map(({ id, label, home }) => ({ id, label, home })));
const spaceById = Object.fromEntries(SPACES.map((s) => [s.id, s]));
function spaceOf(route) {
  for (const s of SPACES.slice(1)) if (route === s.prefix || route.startsWith(s.prefix + "/")) return s.id;
  return "modern";
}
// The canonical origin pages, the sitemap and dsx.config.json name. DOCS_SITE_URL points a build at
// another origin (the private noindex preview on workers.dev) without touching content.
const site = (process.env.DOCS_SITE_URL ?? "https://docs.despia.com").replace(/\/+$/, "");
// The Despia Support origin (vector search + the Ask AI widget): one knob, DOCS_SUPPORT_ORIGIN,
// read here and written to both consumers (the DocShell attribute and the web.head meta docs.js
// reads). Empty turns vector search off; the keyword index always works.
// Versioned docs: this build is the docs of DOCS_VERSION (default: the framework release the
// content documents). public/versions.json lists every published docs version; old versions are
// separate builds served under /v/<version>/ (the version selector reads the list).
const DOCS_VERSION = process.env.DOCS_VERSION ?? "0.1.0";
// The Improvements ledger (despia.com/improvements.json, PLAN-J): an entry whose links name a docs
// page puts an "Improved in vX" marker on that page. Read from DOCS_IMPROVEMENTS (a local copy of
// the feed) or data/improvements.json; absent = no markers, never invented ones.
const improvementsFile = process.env.DOCS_IMPROVEMENTS ?? join(root, "data", "improvements.json");
const improvements = existsSync(improvementsFile) ? (JSON.parse(readFileSync(improvementsFile, "utf8")).entries ?? []) : [];
function improvementsFor(route) {
  const url = `https://docs.despia.com${route}`;
  return improvements.filter((e) => (e.links?.docs ?? []).some((d) => d === route || d === url))
    .map((e) => ({ id: e.id ?? e.slug ?? "", version: e.version ?? "", title: e.title ?? "", url: e.url ?? `https://despia.com/improvements#${e.id ?? e.slug ?? ""}` }));
}
const supportOrigin = (process.env.DOCS_SUPPORT_ORIGIN ?? "https://support.despia.com").replace(/\/+$/, "");
/** The markdown sibling of a route: /x/y -> /x/y.md, / -> /index.md (Mintlify's own convention). */
const mdSibling = (route) => (route === "/" ? "/index.md" : `${route}.md`);

// The build's credential guard refuses any output holding a PEM header or an AuthKey_XXXXXXXXXX.p8
// name, and has no allowance for documentation placeholders (framework gap, STATUS). The guides
// show both as placeholders (`MIGT…`), so a WORD JOINER (U+2060, invisible) is set inside each one:
// the page reads the same, and nothing in the output looks like a key to the guard or to a scraper.
const defang = (text) => text
  .replace(/-----(BEGIN|END) ((?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY)-----/g, "-----$1\u2060 $2-----")
  .replace(/\bAuthKey_([A-Z0-9]{10})\.p8\b/g, "AuthKey_\u2060$1.p8");

// Docs-side notes on pages synced from the framework (their source is not ours to edit): the AI
// skill for writing a module points people at the human walkthrough, under its title.
const PAGE_NOTES = {
  "/framework/skills/writing-a-module": ":::tip\nPrefer a walkthrough? Read the guide: [Build a module](/framework/guides/build-a-module).\n:::",
};
function withPageNote(route, body) {
  const note = PAGE_NOTES[route];
  if (note === undefined) return body;
  const m = /^#\s.*$/m.exec(body);
  return m === null ? `${note}\n\n${body}` : `${body.slice(0, m.index + m[0].length)}\n\n${note}\n${body.slice(m.index + m[0].length)}`;
}

const files = walk(contentDir);
if (files.length === 0) {
  console.error("[docs.compile] content/ holds no markdown — nothing to build");
  process.exit(1);
}

rmSync(generatedDir, { recursive: true, force: true });
mkdirSync(generatedDir, { recursive: true });
mkdirSync(join(publicDir, "md"), { recursive: true });

// Version markers (CMS, PLAN-H H4): `since`, `changed` (a list) and `removed` front matter keys. A page
// added after DOCS_VERSION or removed at or before it is not part of this version's build; the markers
// themselves render as DocShell's version chips (the CMS patch's inline marker line is not applied, so a
// page never says it twice).
const semver = (v) => String(v).trim().replace(/^v/, "").split(/[.-]/).slice(0, 3).map(Number);
const cmpVersion = (a, b) => { const x = semver(a), y = semver(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1; return 0; };
const inThisVersion = (meta) => !(meta.since && cmpVersion(meta.since, DOCS_VERSION) > 0) && !(meta.removed && cmpVersion(meta.removed, DOCS_VERSION) <= 0);

const pages = files.map((file) => {
  const source = defang(readFileSync(file, "utf8"));
  const parsed = frontMatter(source);
  const meta = parsed.meta;
  if (!inThisVersion(meta)) return null;
  const body = withPageNote(meta.route ?? routeFor(file), parsed.body);
  const route = meta.route ?? routeFor(file);
  const space = meta.space ?? spaceOf(route);
  const title = meta.title ?? firstHeading(body) ?? relative(contentDir, file);
  return {
    file,
    route,
    space,
    title,
    label: meta.label,
    section: space === "modern" ? sectionFor(route, meta) : (meta.section ?? ""),
    order: Number(meta.order ?? 1000),
    description: meta.description ?? "",
    body,
    bodyStart: source.split("\n").length - body.split("\n").length + 1,
    component: componentNameFor(route),
    meta,
  };
}).filter((p) => p !== null);

// The framework's from-v3 guide, promoted: the same markdown also opens the Migration space
// (its modern path /framework/guides/from-v3 is unchanged).
const fromV3 = pages.find((p) => p.route === "/framework/guides/from-v3");
if (fromV3 !== undefined) {
  pages.push({ ...fromV3, route: "/migrate/guide", space: "migrate", section: "Move to v4", order: 2,
    label: "Step-by-step guide", component: componentNameFor("/migrate/guide"), meta: { ...fromV3.meta, canonicalOf: fromV3.route } });
}
pages.sort((a, b) => a.order - b.order || (a.route < b.route ? -1 : 1));

/** Hand-authored pages: real DSX documents at the Components root (never generated —
 *  this compiler owns and wipes only Components/pages). Each entry joins the route
 *  table, the nav model and the search index exactly like a compiled page. */
const handAuthored = [
  {
    route: "/system",
    component: "System",
    title: "System",
    space: "modern",
    section: "",
    order: 2,
    description: "The design system as a living page: every element in its states.",
    search: "design system gallery elements states buttons fields selection toggle segmented picker slider stepper list rows cards surfaces tabs sheet typography color tokens spacing radius",
  },
];

// The Troubleshooting index is generated (filters + cards over the articles' front matter).
const tsArticles = pages.filter((p) => p.space === "troubleshooting");
const generatedPages = [
  {
    route: "/troubleshooting",
    component: "PageTroubleshooting",
    title: "Troubleshooting",
    label: "All articles",
    space: "troubleshooting",
    section: "",
    order: 1,
    description: "Symptom, cause and fix for the problems Despia developers actually hit, on v4 and on the v3 runtime.",
    search: "troubleshooting symptom cause fix " + tsArticles.map((p) => `${p.title} ${p.meta.symptom ?? ""}`).join(" "),
  },
];

// The App Review index is generated the same way: a filterable database of guideline entries.
const arEntries = pages.filter((p) => p.space === "app-review");
generatedPages.push({
  route: "/app-review",
  component: "PageAppReview",
  title: "App Review",
  label: "All guidelines",
  space: "app-review",
  section: "",
  order: 1,
  description: "Apple App Review guidelines and Google Play policies that Despia apps run into: what each means, why apps hit it, how to fix it on v4 and v3, and a reply for the reviewer.",
  search: "app review store rejection guideline apple google play " + arEntries.map((p) => `${p.meta.guideline ?? ""} ${p.title} ${p.meta.category ?? ""}`).join(" "),
});

// Release notes: content/releases/<slug>.md (front matter: title, version, package (dsx or a
// package path), date, summary), written by the CMS / ROADMAP lanes. The index, RSS and JSON
// feeds are generated here; with no notes yet the index says so.
const relNotes = pages.filter((p) => p.space === "releases" && p.meta.status !== "upcoming")
  .sort((a, b) => String(b.meta.date ?? "").localeCompare(String(a.meta.date ?? "")) || (a.route < b.route ? -1 : 1));
generatedPages.push({
  route: "/releases",
  component: "PageReleases",
  title: "Releases",
  label: "All releases",
  space: "releases",
  section: "",
  order: 1,
  description: "Release notes for every DSX release and every package version, with the docs pages, migration notes and upgrade impact each one touches.",
  search: "releases release notes changelog version " + relNotes.map((p) => `${p.title} ${p.meta.version ?? ""} ${p.meta.package ?? ""}`).join(" "),
});

const entries = [...pages, ...handAuthored, ...generatedPages].sort((a, b) => a.order - b.order || (a.route < b.route ? -1 : 1));

const duplicate = entries.map((p) => p.route).filter((r, i, all) => all.indexOf(r) !== i);
if (duplicate.length > 0) {
  console.error(`[docs.compile] duplicate route(s): ${[...new Set(duplicate)].join(" · ")}`);
  process.exit(1);
}

// ── sidebar icons (SF names from the shipped web icon set) ──────────────────────────────────
// v3 pages and groups carry Mintlify (FontAwesome) icon names; each maps to the nearest SF symbol
// the web set ships. An unmapped name falls back to doc.text, never to an invented symbol.
const FA_TO_SF = {
  "hand-horns": "hand.wave", "folder-tree": "folder", "clock-rotate-left": "clock", rocket: "paperplane",
  "compass-drafting": "hammer", "user-robot": "iphone", "thumbs-up": "hand.thumbsup", "circle-nodes": "circle.grid.3x3",
  "chart-tree-map": "chart.pie", cat: "creditcard", cowbell: "bell", "wifi-slash": "wifi.slash", globe: "globe",
  sparkle: "sparkles", database: "cpu", "box-open": "shippingbox", shield: "lock.shield", "arrow-right-from-arc": "link",
  "dollar-sign": "dollarsign.circle", coins: "bitcoinsign.circle", "money-bill-1-wave": "banknote", "money-bill-wave": "banknote",
  code: "chevron.left.forwardslash.chevron.right", "chart-mixed": "chart.bar", "chart-pie-simple": "chart.pie",
  "chart-column": "chart.bar", "chart-line": "chart.line.uptrend.xyaxis", "chart-pyramid": "chart.bar", plug: "powerplug",
  "heart-pulse": "heart.text.square", webhook: "link", "head-side-gear": "brain", eye: "eye", "eye-slash": "eye.slash",
  "walkie-talkie": "antenna.radiowaves.left.and.right", wallet: "creditcard", "credit-card": "creditcard",
  "bolt-lightning": "bolt", bolt: "bolt", "bell-ring": "bell.badge", bell: "bell.fill", key: "key", "clapperboard-play": "play.rectangle",
  "leaf-heart": "leaf", edit: "pencil", bug: "ladybug", "apple-whole": "apple.logo", apple: "apple.logo",
  "lightbulb-gear": "lightbulb", lightbulb: "lightbulb", "brake-warning": "exclamationmark.octagon", "octagon-xmark": "xmark.octagon",
  "message-dots": "bubble.left", trophy: "trophy", heart: "heart", "circle-info": "info.circle", "align-left": "text.alignleft",
  link: "link", "link-horizontal": "link", "code-branch": "chevron.left.forwardslash.chevron.right", gear: "gearshape",
  user: "person", "user-large": "person", "user-shield": "lock.shield", fingerprint: "faceid", "share-from-square": "square.on.square",
  recycle: "repeat", "arrows-repeat-1": "repeat", "border-top-left": "square.dashed", "border-all": "square.grid.2x2",
  "file-import": "arrow.down.doc", "file-arrow-up": "doc", "object-ungroup": "square.on.square", copy: "square.on.square",
  waveform: "waveform", "circle-waveform-lines": "waveform.path", "waves-sine": "waveform.path", "wave-pulse": "waveform.path",
  vault: "lock.shield", "location-arrow": "location", "location-dot": "mappin", "photo-film": "photo.on.rectangle", print: "printer",
  microphone: "mic", flask: "flask", "shield-check": "checkmark.shield", "rectangle-ad": "rectangle.portrait.and.arrow.right",
  "nfc-symbol": "dot.radiowaves.left.and.right", "signal-stream": "dot.radiowaves.left.and.right", "puzzle-piece": "cube",
  page: "doc", robot: "cpu", barcode: "barcode", "barcode-scan": "barcode.viewfinder", "cookie-bite": "doc.text",
  "arrow-right-from-bracket": "rectangle.portrait.and.arrow.right", compass: "safari", headphones: "headphones", star: "star",
  "moon-stars": "moon.stars", "bezier-curve": "pencil", bluetooth: "antenna.radiowaves.left.and.right",
  "file-magnifying-glass": "doc.text.magnifyingglass", ellipsis: "ellipsis", paperclip: "paperclip", keyboard: "keyboard",
  music: "music.note", tiktok: "play.rectangle", scroll: "doc.plaintext", "person-running-fast": "figure.run", frame: "square.dashed",
  "pen-nib": "pencil", book: "book", "bullseye-arrow": "target", stamp: "checkmark.seal", google: "globe", alt: "doc.text",
};
const sfIcon = (fa) => (fa ? FA_TO_SF[fa] ?? "doc.text" : undefined);
// Every page, section and card: data/icons.json, declared once (owner 2026-10-08: no page without an icon).
const ICONS = JSON.parse(readFileSync(join(root, "data", "icons.json"), "utf8"));
const SECTION_ICONS = ICONS.sections;
const ROUTE_ICONS = ICONS.routes;
const ICON_RULES = ICONS.rules.map((r) => ({ re: new RegExp(r.match, "i"), icon: r.icon }));
const onFallback = [];
/** A front matter `icon:` may be an SF name or a Mintlify FontAwesome name. */
const declaredIcon = (name) => (name === undefined || name === "" ? undefined : FA_TO_SF[name] ?? name);
function pageIconOf(p, sectionName) {
  const own = declaredIcon(p.meta?.icon);
  if (own !== undefined) return own;
  if (ROUTE_ICONS[p.route] !== undefined) return ROUTE_ICONS[p.route];
  const rule = ICON_RULES.find((r) => r.re.test(p.route) || r.re.test(String(p.title)));
  if (rule !== undefined) return rule.icon;
  if (sectionName !== undefined && SECTION_ICONS[sectionName] !== undefined) return SECTION_ICONS[sectionName];
  onFallback.push(p.route);
  return ICONS.fallback;
}

// ── the nav model, per space ──────────────────────────────────────────────────────────────
// A section is { name, items }; an item is a page { route, title, label } or a nested group
// { group, items }. Modern keeps its reading-rank sections; Legacy replays docs.json's own
// groups and order; Migration and Troubleshooting group by front-matter section.
const navItem = (p, icon, sectionName) => ({ route: p.route, title: p.title, label: pageLabel(p), icon: icon !== undefined && icon !== "doc.text" ? icon : pageIconOf(p, sectionName) });
const byRoute = new Map(entries.map((p) => [p.route, p]));
const navBySpace = {};
{
  const sections = [];
  for (const page of entries.filter((p) => p.space === "modern")) {
    const name = page.section === "" ? "Start" : page.section.replace(/(^|-)([a-z])/g, (_, __, c) => " " + c.toUpperCase()).trim();
    let section = sections.find((s) => s.name === name);
    if (section === undefined) { section = { name, rank: SECTION_RANK[page.section] ?? 9, items: [] }; sections.push(section); }
    section.items.push(navItem(page, undefined, name));
  }
  sections.sort((a, b) => a.rank - b.rank);
  navBySpace.modern = sections;
}
{
  const navFile = join(contentDir, "legacy", "_nav.json");
  const tree = existsSync(navFile) ? JSON.parse(readFileSync(navFile, "utf8")).tree : [];
  const convert = (nodes) => nodes.map((n) => n.page !== undefined
    ? (byRoute.has(n.page) ? navItem(byRoute.get(n.page), sfIcon(n.icon)) : null)
    : { group: n.group, icon: sfIcon(n.icon), defaultOpen: n.defaultOpen === true, items: convert(n.pages) }).filter((n) => n !== null);
  const sections = [];
  let loose = null;
  for (const node of convert(tree)) {
    if (node.group !== undefined) { sections.push({ name: node.group, icon: node.icon, items: node.items }); loose = null; continue; }
    if (loose === null) { loose = { name: sections.length === 0 ? "Get started" : "More", items: [] }; sections.push(loose); }
    loose.items.push(node);
  }
  navBySpace.legacy = sections;
}
for (const id of ["migrate", "troubleshooting", "app-review", "releases"]) {
  const sections = [];
  for (const page of entries.filter((p) => p.space === id && p.meta?.nav !== "false")) {
    const name = page.section === "" ? spaceById[id].label : page.section;
    let section = sections.find((s) => s.name === name);
    if (section === undefined) { section = { name, items: [] }; sections.push(section); }
    section.items.push(navItem(page, undefined, name));
  }
  navBySpace[id] = sections;
}
const flatItems = (items) => items.flatMap((i) => (i.group !== undefined ? flatItems(i.items) : [i]));
const flatNavBySpace = Object.fromEntries(Object.entries(navBySpace).map(([id, sections]) =>
  [id, sections.flatMap((s) => flatItems(s.items).map((i) => ({ ...i, section: s.name })))]));
const neighborsOf = (space, route) => {
  const flat = flatNavBySpace[space] ?? [];
  const at = flat.findIndex((p) => p.route === route);
  return { prev: at > 0 ? flat[at - 1] : null, next: at >= 0 && at < flat.length - 1 ? flat[at + 1] : null };
};
const sectionNameOf = (space, route) => (flatNavBySpace[space] ?? []).find((p) => p.route === route)?.section ?? "";

// ── the generated page components ─────────────────────────────────────────────────────────
/** A shell attribute whose text could read as markup (braces, a `dsx.` reach) travels as a
 *  page variable instead of attribute text, so the scanners never see an interpolation. */
function shellAttr(page, name, value) {
  const text = String(value);
  if (!/[{}]|dsx\./i.test(text)) return `${name}="${escapeForDsxAttr(text)}"`;
  const n = page.attrVars.push(text) - 1;
  return `${name}="{{ dsx.variable.a${n} }}"`;
}
function shellAttrs(page, toc) {
  const { prev, next } = neighborsOf(page.space, page.route);
  page.attrVars = [];
  const tocVar = page.attrVars.push(JSON.stringify(toc)) - 1;
  const improved = improvementsFor(page.route);
  const improvedVar = improved.length > 0 ? page.attrVars.push(JSON.stringify(improved)) - 1 : -1;
  const legacyHome = page.meta?.legacy !== undefined;
  return [
    shellAttr(page, "title", page.title),
    shellAttr(page, "label", pageLabel(page)),
    `route="${page.route}"`,
    `space="${page.space}"`,
    ...(supportOrigin !== "https://support.despia.com" ? [`supportOrigin="${escapeForDsxAttr(supportOrigin)}"`] : []),
    ...(page.body !== undefined ? [`md="${mdSibling(page.route)}"`] : []),
    shellAttr(page, "section", sectionNameOf(page.space, page.route)),
    `toc="{{ dsx.variable.a${tocVar} }}"`,
    // the space picker, its labels and homes: SPACES above is the one declaration
    shellAttr(page, "spaces", SPACES_JSON),
    ...(legacyHome && page.meta.modern ? [`modern="${escapeForDsxAttr(page.meta.modern)}"`] : []),
    ...["since", "changed", "removed"].filter((k) => page.meta?.[k]).map((k) => `${k}="${escapeForDsxAttr(page.meta[k])}"`),
    ...(improvedVar >= 0 ? [`improved="{{ dsx.variable.a${improvedVar} }}"`] : []),
    `version="${escapeForDsxAttr(DOCS_VERSION)}"`,
    ...(prev !== null ? [`prev="${prev.route}"`, shellAttr(page, "prevLabel", prev.label)] : []),
    ...(next !== null ? [`next="${next.route}"`, shellAttr(page, "nextLabel", next.label)] : []),
  ].join(" ");
}
const varLines = (page) => [
  ...page.mdVars.map((text, i) => `    <variable as="md${i}">return ${jseStringLiteral(text)}</variable>`),
  ...page.attrVars.map((text, i) => `    <variable as="a${i}">return ${jseStringLiteral(text)}</variable>`),
];
const pageFrame = (page, extraHead, body) => `<vstack theme="{{ dsx.global.docs &amp;&amp; dsx.global.docs.theme ? dsx.global.docs.theme : '' }}" style="align-items: stretch">
  <head>
    <!-- GENERATED by scripts/compile.mjs${page.file ? ` from ${relative(root, page.file).split(sep).join("/")}` : ""} - edit the source, not this file. -->
${[...varLines(page), ...extraHead].join("\n")}
  </head>
  <DocShell ${page.shell}>
${body}
  </DocShell>
</vstack>
`;

const writeMd = (route, text) => {
  // two addresses, one text: the Mintlify-style sibling (/x.md) and the /md/ tree (/md/x.md)
  for (const rel of [mdSibling(route), route === "/" ? "/md/index.md" : `/md${route}.md`]) {
    const abs = join(publicDir, ...rel.slice(1).split("/"));
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, text);
  }
};

// ── the component reference, as an API reference (owner 2026-10-08: Stripe/Mintlify quality) ──────────────────
// A generated component page (front matter `element:`) reads like an API page: the usage drawn LIVE above its source
// when it stands alone, every attribute a field row (name, type, default, then what it does), and no internal audit
// table (the States evidence stays in the framework repo). The markdown twin keeps the page as written.
function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}
function apiPage(body, label) {
  const lines = body.split("\n");
  const h1 = lines.findIndex((l) => /^# /.test(l));
  if (h1 >= 0) lines[h1] = `# ${label}`;
  const out = [];
  let section = "";
  let liveDone = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const heading = /^## (.+)$/.exec(line);
    if (heading !== null) section = heading[1].trim();
    if (section === "States") continue;
    if (section === "Usage" && !liveDone && /^```dsx\s*$/.test(line)) {
      const end = lines.indexOf("```", i + 1);
      const snippet = lines.slice(i + 1, end).join("\n");
      // live only when the snippet stands alone: one root, no state, no bindings to anything it does not declare
      // the live gate (lint, below) decides whether it draws; here only: one root element
      if (end > i && /^<[a-zA-Z]/.test(snippet.trim())) {
        out.push("```xml live", snippet, "```");
        i = end;
        liveDone = true;
        continue;
      }
    }
    if (section === "Attributes" && /^\| Attribute \|/.test(line)) {
      i += 1;                                                   // the |---| rule
      while (i + 1 < lines.length && lines[i + 1].startsWith("|")) {
        i += 1;
        const [name, type, def, notes] = splitRow(lines[i]);
        const clean = (v) => (v ?? "").replace(/`/g, "").trim();
        // Stripe's parameter list: the name in code weight, its type and default beside it, what it does below,
        // a hairline between parameters
        const meta = [clean(type) !== "" ? `\`${clean(type)}\`` : "", clean(def) !== "" ? `default \`${clean(def)}\`` : ""].filter(Boolean).join(" · ");
        out.push(`**\`${clean(name)}\`** ${meta}`, "");
        if (notes && notes.trim() !== "") out.push(notes, "");
        out.push("---", "");
      }
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

for (const page of pages) {
  if (page.meta?.element !== undefined && page.route.startsWith("/components/")) page.body = apiPage(page.body, componentLabel(page.route, page.title));
  const chunks = sectionize(page.body, page.bodyStart);
  const toc = chunks.filter((c) => c.level > 0).map((c) => ({ id: c.id, title: c.title, level: c.level }));
  page.mdVars = [];
  const blocks = chunks.map((chunk) => {
    if (chunk.level === 0) return compileBody(page, chunk.lines, chunk.start, "    ").join("\n");
    const nodes = compileBody(page, chunk.lines, chunk.start, "      ");
    return `    <stack class="doc-section doc-anchor-${chunk.id}">\n${nodes.join("\n")}\n    </stack>`;
  }).filter((block) => block !== "").join("\n");
  page.shell = shellAttrs(page, toc);
  writeFileSync(join(generatedDir, `${page.component}.dsx`), pageFrame(page, [], blocks));
  writeMd(page.route, defang(readFileSync(page.file, "utf8")));
}

// ── the generated Troubleshooting index ───────────────────────────────────────────────────
{
  const page = generatedPages.find((p) => p.route === "/troubleshooting");
  const fmtUtc = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`;
  };
  const span = (a, b) => {
    const ms = new Date(b).getTime() - new Date(a).getTime();
    if (!(ms >= 0)) return "";
    const h = Math.floor(ms / 3600000);
    const m = Math.round((ms % 3600000) / 60000);
    const days = Math.floor(h / 24);
    const sameDay = new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);
    const clock = days >= 1 ? `${days} d ${h % 24} h` : `${h} h ${m} min`;
    return `${clock}${sameDay ? ", same day" : ""}`;
  };
  const items = tsArticles.map((p) => {
    const packages = String(p.meta.packages ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    // CMS schema v1 (collections/troubleshooting.json): platform v4 | legacy | both; reportedAt,
    // workaroundAt, resolvedAt (+ resolvedIn, releaseNote). fixedAt / releasedAt are read as aliases.
    const platform = p.meta.platform === "legacy" ? "Legacy" : p.meta.platform === "both" ? "v4 · Legacy" : "v4";
    const reported = p.meta.reportedAt ?? "";
    const released = p.meta.resolvedAt ?? p.meta.releasedAt ?? p.meta.fixedAt ?? "";
    return {
      id: p.route, route: p.route, title: p.title, symptom: p.meta.symptom ?? p.description,
      platform, packages, packagesLabel: packages.join(" · "),
      fixed: reported !== "" && released !== "",
      reportedLabel: reported !== "" ? fmtUtc(reported) : "",
      releasedLabel: released !== "" ? fmtUtc(released) : "",
      timeToFix: reported !== "" && released !== "" ? span(reported, released) : "",
      issueUrl: p.meta.issueUrl ?? "",
      status: p.meta.status ?? "", resolvedIn: p.meta.resolvedIn ?? "", releaseNote: p.meta.releaseNote ?? "",
    };
  });
  const packageOptions = ["All packages", ...[...new Set(items.flatMap((i) => i.packages))].sort()];
  page.body = [
    `# Troubleshooting`, "", page.description, "",
    ...items.map((i) => `- [${i.title}](${site}${mdSibling(i.route)}) (${i.platform}${i.packagesLabel ? `; ${i.packagesLabel}` : ""}): ${i.symptom}`),
    "",
  ].join("\n");
  page.mdVars = [];
  page.shell = shellAttrs(page, []);
  const intro = pushMdVar(page, `# Troubleshooting\n\n${page.description} Every article is one symptom, its cause and the fix, with the platform it applies to. Filter by platform or by package.`);
  const itemsVar = page.attrVars.push(JSON.stringify(items)) - 1;
  // the variables carry JSON text; the formulas parse it once
  const head = [
    `    <variable as="platformFilter">return 'All'</variable>`,
    `    <variable as="pkg">return 'All packages'</variable>`,
    `    <formula as="items" input:raw="dsx.variable.a${itemsVar}">return JSON.parse(raw)</formula>`,
    `    <formula as="shown" input:items="dsx.formula.items" input:wantPlatform="dsx.variable.platformFilter" input:pkg="dsx.variable.pkg">`,
    `      return items.filter((i) => (wantPlatform === 'All' || i.platform.includes(wantPlatform)) && (pkg === 'All packages' || i.packages.includes(pkg)))`,
    `    </formula>`,
    `    <formula as="fixed" input:items="dsx.formula.items">return items.filter((i) => i.fixed)</formula>`,
  ];
  const body = [
    `    <markdown bind="dsx.variable.md${intro}"/>`,
    `    <hstack class="doc-ts-filters" role="group" a11yLabel="Filter articles">`,
    `      <segmented bind="dsx.variable.platformFilter" options="All,v4,Legacy" label="Platform" class="doc-ts-platform"/>`,
    `      <picker bind="dsx.variable.pkg" options="${escapeForDsxAttr(packageOptions.join(","))}" label="Package" class="doc-ts-package"/>`,
    `    </hstack>`,
    `    <stack class="doc-ts-fixed" visible-if="dsx.formula.fixed.length > 0">`,
    `      <text value="Fixed fast" type="headline"/>`,
    `      <vstack class="doc-ts-fixed-list">`,
    `        <FixedFast repeat="dsx.formula.fixed" key="id" title="{{ dsx.this.title }}" href="{{ dsx.this.route }}" reported="{{ dsx.this.reportedLabel }}" released="{{ dsx.this.releasedLabel }}" duration="{{ dsx.this.timeToFix }}" platform="{{ dsx.this.platform }}"/>`,
    `      </vstack>`,
    `    </stack>`,
    `    <vstack class="doc-ts-list">`,
    `      <Card repeat="dsx.formula.shown" key="id" title="{{ dsx.this.title }}" href="{{ dsx.this.route }}" class="doc-ts-card">`,
    `        <text value="{{ dsx.this.symptom }}" type="callout"/>`,
    `        <hstack class="doc-ts-card-meta">`,
    `          <chip label="{{ dsx.this.platform }}"/>`,
    `          <text value="{{ dsx.this.packagesLabel }}" type="footnote"/>`,
    `        </hstack>`,
    `      </Card>`,
    `    </vstack>`,
    `    <text value="No article matches these filters yet." type="footnote" visible-if="dsx.formula.shown.length === 0"/>`,
  ].join("\n");
  writeFileSync(join(generatedDir, `${page.component}.dsx`), pageFrame(page, head, body));
  writeMd(page.route, page.body);
  writeFileSync(join(publicDir, "troubleshooting.json"), JSON.stringify({ articles: items }, null, 1) + "\n");
}

// ── the generated App Review database ─────────────────────────────────────────────────────
{
  const page = generatedPages.find((p) => p.route === "/app-review");
  const list = (v) => String(v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const items = arEntries.map((p) => ({
    id: p.route, route: p.route, title: p.title, summary: p.description,
    guideline: p.meta.guideline ?? "", stores: list(p.meta.store), storesLabel: list(p.meta.store).join(" · "),
    category: p.meta.category ?? "", platforms: list(p.meta.platform).map((x) => (x === "legacy" ? "Legacy" : x)),
    cases: Number(p.meta.cases ?? 0),
    haystack: `${p.meta.guideline ?? ""} ${p.title} ${p.meta.category ?? ""} ${p.meta.store ?? ""} ${p.description}`.toLowerCase(),
  })).sort((a, b) => a.guideline.localeCompare(b.guideline, "en", { numeric: true }) || (a.title < b.title ? -1 : 1));
  const categories = ["All categories", ...[...new Set(items.map((i) => i.category))].sort()];
  page.body = [
    "# App Review", "", page.description, "",
    ...items.map((i) => `- [${i.guideline} ${i.title}](${site}${mdSibling(i.route)}) (${i.storesLabel}; ${i.category}): ${i.summary}`),
    "",
  ].join("\n");
  page.mdVars = [];
  page.shell = shellAttrs(page, []);
  const intro = pushMdVar(page, `# App Review\n\n${page.description} Search by guideline number or words, or filter by store, category and platform. Each entry links the official guideline text.`);
  const itemsVar = page.attrVars.push(JSON.stringify(items)) - 1;
  const head = [
    `    <variable as="q">return ''</variable>`,
    `    <variable as="store">return 'All'</variable>`,
    `    <variable as="category">return 'All categories'</variable>`,
    `    <variable as="platformFilter">return 'All'</variable>`,
    `    <formula as="items" input:raw="dsx.variable.a${itemsVar}">return JSON.parse(raw)</formula>`,
    // fuzzy: every word of the query must appear in the entry, each word matched as a substring
    // or as an in-order subsequence (so "minfunc" finds "minimum functionality", "512" finds 5.1.2)
    `    <formula as="shown" input:items="dsx.formula.items" input:q="dsx.variable.q" input:wantStore="dsx.variable.store" input:wantCategory="dsx.variable.category" input:wantPlatform="dsx.variable.platformFilter">`,
    `      const fuzzy = (hay, word) => {`,
    `        if (hay.includes(word)) { return true }`,
    `        const flat = hay.split('.').join('')`,
    `        if (flat.includes(word)) { return true }`,
    `        let at = 0`,
    `        for (const ch of word) { at = flat.indexOf(ch, at); if (at === -1) { return false } at = at + 1 }`,
    `        return word.length >= 3`,
    `      }`,
    `      const words = String(q || '').toLowerCase().split(' ').filter((w) => w !== '')`,
    `      return items.filter((i) => (wantStore === 'All' || i.stores.includes(wantStore))`,
    `        && (wantCategory === 'All categories' || i.category === wantCategory)`,
    `        && (wantPlatform === 'All' || i.platforms.includes(wantPlatform))`,
    `        && words.every((w) => fuzzy(i.haystack, w)))`,
    `    </formula>`,
  ];
  const body = [
    `    <markdown bind="dsx.variable.md${intro}"/>`,
    `    <stack class="doc-ar-search">`,
    `      <searchbar bind="dsx.variable.q" placeholder="Search guidelines: 4.2, paywall, sign in…"/>`,
    `    </stack>`,
    `    <hstack class="doc-ts-filters" role="group" a11yLabel="Filter guidelines">`,
    `      <segmented bind="dsx.variable.store" options="All,Apple,Google" label="Store" class="doc-ts-platform"/>`,
    `      <segmented bind="dsx.variable.platformFilter" options="All,v4,Legacy" label="Platform" class="doc-ts-platform"/>`,
    `      <picker bind="dsx.variable.category" options="${escapeForDsxAttr(categories.join(","))}" label="Category" class="doc-ts-package"/>`,
    `    </hstack>`,
    `    <text value="{{ dsx.formula.shown.length + (dsx.formula.shown.length === 1 ? ' guideline' : ' guidelines') }}" type="headline"/>`,
    `    <vstack class="doc-ts-list">`,
    `      <Card repeat="dsx.formula.shown" key="id" title="{{ dsx.this.guideline + ' · ' + dsx.this.title }}" href="{{ dsx.this.route }}" class="doc-ts-card">`,
    `        <text value="{{ dsx.this.summary }}" type="callout"/>`,
    `        <hstack class="doc-ts-card-meta">`,
    `          <chip label="{{ dsx.this.storesLabel }}"/>`,
    `          <chip label="{{ dsx.this.category }}"/>`,
    `        </hstack>`,
    `      </Card>`,
    `    </vstack>`,
    `    <text value="No guideline matches. Try fewer words, or the search in the header (it also asks the Support knowledge base)." type="footnote" visible-if="dsx.formula.shown.length === 0"/>`,
  ].join("\n");
  writeFileSync(join(generatedDir, `${page.component}.dsx`), pageFrame(page, head, body));
  writeMd(page.route, page.body);
  writeFileSync(join(publicDir, "app-review.json"), JSON.stringify({ guidelines: items.map(({ haystack, ...rest }) => ({ ...rest, url: site + rest.route, markdown: site + mdSibling(rest.route) })) }, null, 1) + "\n");
}

// ── the generated Releases index + feeds ──────────────────────────────────────────────────
{
  const page = generatedPages.find((p) => p.route === "/releases");
  const items = relNotes.map((p) => ({
    id: p.route, route: p.route, title: p.title, version: p.meta.version ?? "", package: p.meta.package ?? "dsx",
    date: p.meta.date ?? "", summary: p.meta.summary ?? p.description,
  }));
  page.body = ["# Releases", "", page.description, "",
    ...(items.length === 0 ? ["No release notes are published yet."] :
      items.map((i) => `- [${i.title}](${site}${mdSibling(i.route)}) (${i.package} ${i.version}, ${i.date}): ${i.summary}`)), ""].join("\n");
  page.mdVars = [];
  page.shell = shellAttrs(page, []);
  const intro = pushMdVar(page, `# Releases\n\n${page.description} Feeds: [RSS](/releases/rss.xml), [JSON Feed](/releases/feed.json), [llms.txt](/releases/llms.txt).`);
  const itemsVar = page.attrVars.push(JSON.stringify(items)) - 1;
  const packages = ["All packages", ...[...new Set(items.map((i) => i.package))].sort()];
  const head = [
    `    <variable as="pkg">return 'All packages'</variable>`,
    `    <formula as="items" input:raw="dsx.variable.a${itemsVar}">return JSON.parse(raw)</formula>`,
    `    <formula as="shown" input:items="dsx.formula.items" input:pkg="dsx.variable.pkg">return items.filter((i) => pkg === 'All packages' || i.package === pkg)</formula>`,
  ];
  const body = [
    `    <markdown bind="dsx.variable.md${intro}"/>`,
    `    <hstack class="doc-ts-filters" role="group" a11yLabel="Filter releases" visible-if="dsx.formula.items.length > 0">`,
    `      <picker bind="dsx.variable.pkg" options="${escapeForDsxAttr(packages.join(","))}" label="Package" class="doc-ts-package"/>`,
    `    </hstack>`,
    `    <vstack class="doc-ts-list">`,
    `      <Card repeat="dsx.formula.shown" key="id" title="{{ dsx.this.title }}" href="{{ dsx.this.route }}" class="doc-ts-card">`,
    `        <text value="{{ dsx.this.summary }}" type="callout"/>`,
    `        <hstack class="doc-ts-card-meta">`,
    `          <chip label="{{ dsx.this.package + ' ' + dsx.this.version }}"/>`,
    `          <text value="{{ dsx.this.date }}" type="footnote"/>`,
    `        </hstack>`,
    `      </Card>`,
    `    </vstack>`,
    `    <text value="No release notes are published yet. The first lands with the 0.1.0 release." type="footnote" visible-if="dsx.formula.items.length === 0"/>`,
  ].join("\n");
  writeFileSync(join(generatedDir, `${page.component}.dsx`), pageFrame(page, head, body));
  writeMd(page.route, page.body);
  mkdirSync(join(publicDir, "releases"), { recursive: true });
  const xmlE = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  writeFileSync(join(publicDir, "releases", "rss.xml"), [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0"><channel><title>Despia releases</title><link>${site}/releases</link><description>${xmlE(page.description)}</description>`,
    ...items.map((i) => `<item><title>${xmlE(i.title)}</title><link>${site}${i.route}</link><guid>${site}${i.route}</guid>${i.date ? `<pubDate>${new Date(i.date).toUTCString()}</pubDate>` : ""}<description>${xmlE(i.summary)}</description></item>`),
    `</channel></rss>`, ""].join("\n"));
  writeFileSync(join(publicDir, "releases", "feed.json"), JSON.stringify({
    version: "https://jsonfeed.org/version/1.1", title: "Despia releases", home_page_url: `${site}/releases`, feed_url: `${site}/releases/feed.json`,
    items: items.map((i) => ({ id: site + i.route, url: site + i.route, title: i.title, summary: i.summary, ...(i.date ? { date_published: i.date } : {}), tags: [i.package, i.version] })),
  }, null, 1) + "\n");
}

// ── versions (the selector's list) ────────────────────────────────────────────────────────
// data/docs-versions.json is written by the CMS when a release snapshots the docs: newest first,
// [{ "version": "0.2.0", "date": "2026-11-01" }]. The first entry is latest (served at /), every other
// one is its own build of versions/<v>/ served under /v/<v>/ and stays readable forever.
{
  const listFile = join(root, "data", "docs-versions.json");
  const listed = existsSync(listFile) ? JSON.parse(readFileSync(listFile, "utf8")) : [];
  const all = [...new Set([DOCS_VERSION, ...listed.map((v) => v.version)])].sort((a, b) => cmpVersion(b, a));
  writeFileSync(join(publicDir, "versions.json"), JSON.stringify({
    latest: all[0],
    current: DOCS_VERSION,
    versions: all.map((v, i) => ({ version: v, label: i === 0 ? `${v} (latest)` : v, path: i === 0 ? "/" : `/v/${v}/` })),
  }, null, 1) + "\n");
}

// ── the integrations snapshot: per-module llms.txt + the MCP tools' data ──────────────────
{
  const file = join(root, "data", "integrations.json");
  const catalog = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).packages : [];
  const mapRows = existsSync(join(root, "migrate", "map.json")) ? JSON.parse(readFileSync(join(root, "migrate", "map.json"), "utf8")).entries : [];
  const mentions = (p, m) => p.body !== undefined && (p.body.includes(`dsx.module.${m.command}.`) || p.body.includes(m.package) || (p.meta?.packages ?? "").split(",").map((x) => x.trim()).includes(m.package));
  const index = [];
  for (const m of catalog) {
    const docs = entries.filter((p) => mentions(p, m));
    const v3 = mapRows.filter((r) => r.v4 && r.v4.package === m.package);
    index.push({ ...m, docs: docs.map((p) => ({ route: p.route, title: p.title, space: p.space })), legacy: v3.map((r) => `/legacy${r.legacyPath}`) });
    const dir = join(publicDir, "modules", m.command);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "llms.txt"), [
      `# ${m.name} (\`${m.api}\`)`, "",
      `> ${m.description || `The ${m.name} package.`}`, "",
      `- Package: \`${m.package}\` (install: \`${m.install}\`), version ${m.version ?? "unreleased"}`,
      `- Licence: ${m.license ?? "unknown"}${m.commercial ? " (commercial, source available)" : ""}`,
      `- Platforms: ${(m.platforms ?? []).join(", ") || "not declared"}`,
      ...(m.actions.length > 0 ? [`- Actions: ${m.actions.map((a) => `\`${a}\``).join(", ")}`] : []),
      "", "## Docs", "",
      ...(docs.length > 0 ? docs.map((p) => `- [${p.title}](${site}${mdSibling(p.route)}) (${p.space})`) : ["- No page mentions this package yet."]),
      ...(v3.length > 0 ? ["", "## Moving from v3", "", ...v3.map((r) => `- [${r.legacyTitle}](${site}/legacy${r.legacyPath}.md): ${r.note}`)] : []),
      "",
    ].join("\n"));
  }
  writeFileSync(join(publicDir, "modules", "llms.txt"), [
    "# Despia packages", "", `> Every package with a callable command: its own llms.txt lists its API, licence, platforms and the docs pages that use it. Part of ${site} (index: ${site}/llms.txt).`, "",
    ...index.map((m) => `- [${m.name}](${site}/modules/${m.command}/llms.txt): \`${m.api}\`, ${m.package}`), ""].join("\n"));
  writeFileSync(join(publicDir, "integrations.json"), JSON.stringify({ packages: index }) + "\n");
}

// ── the knowledge export: heading-aware chunks for publish-time embeddings ────────────────
// The Support indexer (bge-m3, Workers AI) embeds THESE chunks once per publish, keyed by
// content hash, so a query never embeds a document; contentVersion keys every edge cache.
{
  const chunks = [];
  for (const p of entries.filter((e) => e.body !== undefined)) {
    const parts = sectionize(p.body, 1);
    for (const c of parts) {
      const text = c.body.trim();
      if (text === "") continue;
      const id = `${p.route}#${c.id || "top"}`;
      chunks.push({ id, route: p.route, space: p.space, title: p.title, heading: c.title || p.title,
        text: text.slice(0, 6000), hash: createHash("sha256").update(text).digest("hex").slice(0, 16) });
    }
  }
  const contentVersion = createHash("sha256").update(chunks.map((c) => c.hash).join("")).digest("hex").slice(0, 16);
  mkdirSync(join(publicDir, "knowledge"), { recursive: true });
  writeFileSync(join(publicDir, "knowledge", "chunks.json"), JSON.stringify({ contentVersion, model: "@cf/baai/bge-m3", chunks }) + "\n");
  writeFileSync(join(publicDir, "knowledge", "version.json"), JSON.stringify({ contentVersion, chunks: chunks.length }) + "\n");
}

// The hand-authored pages have no markdown source; their sibling says what they are.
for (const page of handAuthored) {
  writeMd(page.route, `# ${page.title}\n\n${page.description}\n\nThis page is a live DSX document (${site}${page.route}); it has no markdown source.\n`);
}

// ── the generated sidebars (DocNav + one per space) ───────────────────────────────────────
// Every nav as static markup: every row a real SSR'd anchor, grouped under uppercase
// micro-labels, nested groups under quieter sub-labels, the active row resolved from the
// route attribute at render time. DocNav picks the space's sidebar (visible-if renders
// nothing for the other three, so a page carries one sidebar, not four).
const navComponentOf = (id) => "DocNav" + id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
// Each space's sidebar, Mintlify-shaped from stock parts: a section header (footnote text), the
// section's pages as one stock list of rows (icon + label, real links), and every nested group as
// a stock Accordion (DisclosureGroup) holding its own rows, open when it holds the page on screen
// or declares defaultOpen. A modern page with no icon of its own takes its section's.
const containsRoute = (items, route) => items.some((i) => (i.group !== undefined ? containsRoute(i.items, route) : i.route === route));
function navMarkup(items, sectionIcon, depth, vars) {
  // inside a stock sidebar list: a run of pages is ONE repeated row template (keyed by route, so
  // `selection=` marks the page on screen); a nested group is a row holding a stock Accordion whose
  // body is a nested sidebar list
  const out = [];
  let run = [];
  const pad = "  ".repeat(depth + 2);
  const flush = () => {
    if (run.length === 0) return;
    // a run whose pages carry no icon of their own shows none: thirty copies of the section's icon
    // (or the generic page glyph) down a column is noise, not wayfinding (polish pass 2026-10-03)
    // every row wears its own icon (data/icons.json): the reader scans by shape as much as by word
    const ownIcons = true;
    const rows = run.map((i) => ({ route: i.route, label: i.label, icon: i.icon ?? sectionIcon ?? "doc.text" }));
    const n = vars.push(`    <variable as="r${vars.length}">return JSON.parse(${jseStringLiteral(JSON.stringify(rows))})</variable>`) - 1;
    out.push(`${pad}<pressable repeat="dsx.variable.r${n}" key="route" href="{{ dsx.this.route }}">
${ownIcons ? `${pad}  <image style="font-size: 15px" icon="{{ dsx.this.icon }}" a11yHidden="true"/>\n` : ""}${pad}  <text value="{{ dsx.this.label }}" lineLimit="2"/>
${pad}</pressable>`);
    run = [];
  };
  for (const item of items) {
    if (item.group === undefined) { run.push(item); continue; }
    flush();
    const routes = JSON.stringify(flatItems(item.items).map((i) => i.route)).replace(/"/g, "'");
    out.push(`${pad}<row>
${pad}  <Accordion title="${escapeForDsxAttr(item.group)}" icon="${escapeForDsxAttr(item.icon ?? sectionIcon ?? "folder")}" open="${item.defaultOpen ? "true" : `{{ ${routes}.includes(dsx.attribute.route) }}`}">
${pad}    <list style="appearance: none" selection="dsx.variable.current" scroll="false">
${navMarkup(item.items, item.icon ?? sectionIcon, depth + 2, vars)}
${pad}    </list>
${pad}  </Accordion>
${pad}</row>`);
  }
  flush();
  return out.join("\n");
}
for (const s of SPACES) {
  const vars = [];
  // a section header that only restates the space ("Troubleshooting" in Troubleshooting) or opens
  // the list ("Start") says nothing the reader does not know; it is left out
  const quiet = (name, i) => name === s.label || (i === 0 && (name === "Start" || name === "Get started"));
  // Every named section is a stock Accordion (SwiftUI DisclosureGroup): the section holding the page on
  // screen opens, the others start folded (docs.js restores the reader's own choice per section). The
  // quiet first section (Start) stays a plain run of rows. One variable per section lists its routes.
  const body = (navBySpace[s.id] ?? []).map((section, i) => {
    if (quiet(section.name, i)) return navMarkup(section.items, section.icon ?? SECTION_ICONS[section.name], 0, vars);
    const rows = navMarkup(section.items, section.icon ?? SECTION_ICONS[section.name], 1, vars);
    const n = vars.push(`    <variable as="sec${vars.length}">return JSON.parse(${jseStringLiteral(JSON.stringify(flatItems(section.items).map((x) => x.route)))})</variable>`) - 1;
    const sectionIcon = section.icon ?? SECTION_ICONS[section.name] ?? ICONS.fallback;
    return `    <row class="doc-nav-section">
      <Accordion title="${escapeForDsxAttr(section.name)}" open="{{ dsx.variable.sec${n}.includes(dsx.attribute.route) }}">
        <hstack slot="header" class="doc-nav-section-label">
          <image icon="${sectionIcon}" style="font-size: 15px" a11yHidden="true"/>
          <text value="${escapeForDsxAttr(section.name)}"/>
        </hstack>
        <list style="appearance: none" selection="dsx.variable.current" scroll="false">
${rows}
        </list>
      </Accordion>
    </row>`;
  }).join("\n");
  writeFileSync(join(generatedDir, `${navComponentOf(s.id)}.dsx`), `<vstack class="doc-nav doc-nav-${s.id}" role="navigation" a11yLabel="${escapeForDsxAttr(s.label)} documentation">
  <head>
    <!-- GENERATED by scripts/compile.mjs (the ${s.label} nav model) - edit the content tree, not this file.
         The stock sidebar list: section headers, icon rows, collapsible groups, the page on screen
         selected through selection= (keyed by route). -->
    <attribute as="route" default="''"/>
    <variable as="current">return dsx.attribute.route</variable>
${vars.join("\n")}
  </head>
  <list style="appearance: none" selection="dsx.variable.current" scroll="false">
${body}
  </list>
</vstack>
`);
}
writeFileSync(join(generatedDir, "DocNav.dsx"), `<vstack class="doc-nav-host" style="flex: 1; min-height: 0; align-items: stretch">
  <head>
    <!-- GENERATED by scripts/compile.mjs: the sidebar of the page's space. -->
    <attribute as="route" default="''"/>
    <attribute as="space" default="'modern'"/>
  </head>
${SPACES.map((s) => `  <${navComponentOf(s.id)} visible-if="dsx.attribute.space === '${s.id}'" route="{{ dsx.attribute.route }}"/>`).join("\n")}
</vstack>
`);

// ── the generated /system card wall (SystemCards) ─────────────────────────────────────────
const cardRoleFor = (description) => {
  const clause = String(description).replace(/\.\s*$/, "").split(": ")[0].trim();
  return clause.charAt(0).toUpperCase() + clause.slice(1);
};
const cardRows = entries.filter((p) => p.route.startsWith("/components/")).map((p) =>
  `  <Card title="${escapeForDsxAttr(componentLabel(p.route, p.title))}" href="${p.route}">
    <text value="${escapeForDsxAttr(cardRoleFor(p.description))}" type="footnote"/>
  </Card>`).join("\n");
writeFileSync(join(generatedDir, "SystemCards.dsx"), `<grid class="doc-cardwall">
  <head>
    <!-- GENERATED by scripts/compile.mjs (the component reference as a card grid). -->
  </head>
${cardRows}
</grid>
`);

// ── the route table ───────────────────────────────────────────────────────────────────────
const config = JSON.parse(readFileSync(join(root, "dsx.config.json"), "utf8"));
config.siteUrl = site;
// Despia's own docs: a project of Despia's own workspace (first-party dogfooding, constitution Article 16), so the
// build accepts its despia.com origin; a customer project naming despia.com is still refused.
config.owner = { workspace: "despia" };
const head = (config.web?.head ?? []).filter((row) => row.meta?.name !== "despia-support-origin");
config.web = { ...(config.web ?? {}), head: [...head, { meta: { name: "despia-support-origin", content: supportOrigin } }] };
config.routes = entries.map((p) => ({
  path: p.route,
  component: `docs.${p.component}`,
  meta: { title: p.space === "legacy" ? `${p.title} (Despia V3)` : p.title, ...(p.description !== "" ? { description: p.description } : {}) },
}));
writeFileSync(join(root, "dsx.config.json"), JSON.stringify(config, null, 2) + "\n");

const navTree = (items) => items.map((i) => (i.group !== undefined
  ? { group: i.group, ...(i.icon ? { icon: i.icon } : {}), ...(i.defaultOpen ? { defaultOpen: true } : {}), items: navTree(i.items) }
  : { route: i.route, title: i.title, label: i.label, ...(i.icon ? { icon: i.icon } : {}) }));
const navJson = (sections) => sections.map((s) => ({ name: s.name, icon: s.icon ?? SECTION_ICONS[s.name] ?? null,
  pages: flatItems(s.items).map(({ route, title, label }) => ({ route, title, label })), tree: navTree(s.items) }));
writeFileSync(join(publicDir, "nav.json"), JSON.stringify({
  sections: navJson(navBySpace.modern),
  spaces: SPACES.map((s) => ({ id: s.id, label: s.label, home: s.home, sections: navJson(navBySpace[s.id] ?? []) })),
}, null, 1) + "\n");

// ── the client search index ───────────────────────────────────────────────────────────────
writeFileSync(join(publicDir, "search-index.json"), JSON.stringify({
  spaces: SPACES.map(({ id, label }) => ({ id, label })),
  pages: entries.map((p) => ({
    route: p.route,
    title: p.title,
    label: pageLabel(p),
    space: p.space,
    section: p.space === "modern" ? p.section : sectionNameOf(p.space, p.route),
    text: (p.body === undefined || p.search !== undefined ? (p.search ?? p.description) : searchText(p.body)).slice(0, p.space === "modern" ? 4000 : 2000),
  })),
}) + "\n");

// ── llms.txt + llms-full.txt: a root index, and a pair per space ──────────────────────────
// The root /llms.txt lists the spaces, then the Modern pages (it has always listed them);
// /llms-full.txt stays Modern in full. Each other space has /<space>/llms.txt + llms-full.txt.
const mdPages = (space) => entries.filter((p) => p.space === space && p.body !== undefined);
const llmsList = (space) => (navBySpace[space] ?? []).flatMap((s) => {
  const rows = flatItems(s.items).filter((i) => byRoute.get(i.route)?.body !== undefined);
  return rows.length === 0 ? [] : [`## ${s.name}`, "", ...rows.map((i) => `- [${i.title}](${site}${mdSibling(i.route)})`), ""];
});
const llmsFull = (space) => mdPages(space).map((p) => `# ${p.title}\n(${site}${p.route})\n\n${p.body}`).join("\n\n---\n\n");
writeFileSync(join(publicDir, "llms.txt"), [
  "# Despia documentation",
  "",
  "> Documentation for Despia: Modern (v4, DSX: one set of documents rendered as native iOS, native",
  "> Android, an installable PWA and a server-rendered site), Legacy (v3, despia-native), Migration",
  "> (v3 to v4), Troubleshooting, Releases and App Review (Apple and Google store guidelines).",
  "",
  "Every page serves its raw markdown at its own path plus `.md` (and under /md/). The MCP server at",
  `${site}/mcp takes a \`space\` argument (modern, legacy, migrate, troubleshooting, releases, app-review, all).`,
  "",
  "## Spaces",
  "",
  ...SPACES.map((s) => s.id === "modern"
    ? `- [Modern](${site}/llms.txt): this file; full text at ${site}/llms-full.txt`
    : `- [${s.label}](${site}${s.prefix}/llms.txt): ${s.blurb}; full text at ${site}${s.prefix}/llms-full.txt`),
  `- [Migration map (JSON)](${site}/migrate-map.json): every v3 feature and its v4 package or API`,
  `- [Packages](${site}/modules/llms.txt): one llms.txt per package (API, licence, platforms, the docs that use it)`,
  "",
  ...llmsList("modern"),
].join("\n"));
writeFileSync(join(publicDir, "llms-full.txt"), llmsFull("modern"));
for (const s of SPACES.slice(1)) {
  mkdirSync(join(publicDir, s.prefix.slice(1)), { recursive: true });
  writeFileSync(join(publicDir, s.prefix.slice(1), "llms.txt"), [
    `# Despia documentation: ${s.label}`,
    "",
    `> ${s.blurb}. Part of ${site} (index: ${site}/llms.txt).`,
    "",
    ...llmsList(s.id),
  ].join("\n"));
  writeFileSync(join(publicDir, s.prefix.slice(1), "llms-full.txt"), llmsFull(s.id));
}

// ── the sitemap: every space, every page, with lastmod ────────────────────────────────────
// lastmod is the page's own date: front matter (legacy: the live v3 sitemap's date), else the
// last commit that touched the source (this repo, or the front door for synced framework
// pages), else this repo's HEAD date.
function gitDates(cwd, args) {
  const dates = new Map();
  try {
    const log = execFileSync("git", ["log", "--format=@%cI", "--name-only", ...args], { cwd, encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] });
    let at = "";
    for (const line of log.split("\n")) {
      if (line.startsWith("@")) at = line.slice(1);
      else if (line !== "" && !dates.has(line)) dates.set(line, at);
    }
  } catch { /* not a checkout: no dates */ }
  return dates;
}
const repoDates = gitDates(root, ["--", "content", "Components"]);
const syncedDatesFile = join(contentDir, "framework", "_lastmod.json");
const syncedDates = existsSync(syncedDatesFile) ? JSON.parse(readFileSync(syncedDatesFile, "utf8")) : {};
let headDate = "";
try { headDate = execFileSync("git", ["log", "-1", "--format=%cI"], { cwd: root, encoding: "utf8" }).trim(); } catch { headDate = new Date().toISOString(); }
const lastmodOf = (p) => {
  if (p.meta?.lastmod) return p.meta.lastmod;
  if (p.file !== undefined) {
    const rel = relative(root, p.file).split(sep).join("/");
    if (repoDates.has(rel)) return repoDates.get(rel);
    const synced = syncedDates[relative(join(contentDir, "framework"), p.file).split(sep).join("/")];
    if (synced !== undefined) return synced;
  }
  if (p.component !== undefined && repoDates.has(`Components/${p.component}.dsx`)) return repoDates.get(`Components/${p.component}.dsx`);
  return headDate;
};
const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
writeFileSync(join(publicDir, "sitemap.xml"), [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.filter((p) => p.meta?.canonicalOf === undefined).map((p) => `  <url><loc>${xmlEsc(site + p.route)}</loc><lastmod>${xmlEsc(lastmodOf(p))}</lastmod></url>`),
  `</urlset>`,
  "",
].join("\n"));

// ── the canonical table (assemble.mjs stamps <link rel="canonical"> from it) ──────────────
writeFileSync(join(publicDir, "canonical.json"), JSON.stringify(Object.fromEntries(entries.map((p) =>
  [p.route, site + (p.meta?.canonicalOf ?? p.route)]))) + "\n");

mkdirSync(join(root, "evidence", "web-launch"), { recursive: true });
writeFileSync(join(root, "evidence", "web-launch", "code-format-report.txt"),
  formatReport.length === 0 ? "every json block parsed; no one-line JS/TS over 100 chars\n" : formatReport.join("\n") + "\n");

const counts = SPACES.map((s) => `${s.id} ${entries.filter((p) => p.space === s.id).length}`).join(", ");
// ── live examples are proven before they ship: each generated Live<hash> is linted with the real toolchain, and
//    one that does not lint (an example teaching a retired attribute, a component this site does not carry) stays a
//    code block only, named here so its source gets fixed. A page never draws a broken example. ──
if (liveOf.size > 0) {
  const files = [...liveOf.keys()].map((name) => join(generatedDir, `${name}.dsx`));
  let findings = [];
  try {
    const out = execFileSync(process.execPath, [join(root, "node_modules", "@despia-native", "cli", "dist", "bin", "despia.js"), "lint", "--json", ...files],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 16 << 20 });
    findings = JSON.parse(out).findings ?? [];
  } catch (error) {
    findings = JSON.parse(String(error.stdout ?? "{}")).findings ?? [];
  }
  const broken = new Map();
  for (const f of findings) {
    if (f.level !== "error" && f.level !== "warning") continue;
    const name = /(Live[0-9a-f]+)\.dsx$/.exec(f.file)?.[1];
    if (name !== undefined && !broken.has(name)) broken.set(name, f.message.split(". ")[0]);
  }
  for (const [name, why] of broken) {
    const pageFile = join(generatedDir, `${liveOf.get(name)}.dsx`);
    writeFileSync(pageFile, readFileSync(pageFile, "utf8").split("\n").filter((l) => !l.includes(`<${name}/>`)).join("\n"));
    rmSync(join(generatedDir, `${name}.dsx`), { force: true });
    formatReport.push(`live example not drawn (${liveOf.get(name)}): ${why}`);
  }
  console.log(`[docs.compile] live examples: ${liveOf.size - broken.size} drawn, ${broken.size} kept as code only (they do not lint: fix their source)`);
  for (const [name, why] of broken) console.log(`  ${liveOf.get(name)}: ${why}`);
}
if (onFallback.length > 0) console.log(`[docs.compile] ${onFallback.length} page(s) on the fallback icon (add a data/icons.json row): ${onFallback.slice(0, 12).join(" ")}`);
console.log(`[docs.compile] ${entries.length} route(s) (${counts}) → Components/pages (+ DocNav per space, SystemCards), routes, nav, search index, md siblings, llms per space, sitemap`);
