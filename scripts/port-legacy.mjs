#!/usr/bin/env node
//
//  port-legacy.mjs - the v3 (Mintlify) docs, ported into this site's own content pipeline.
//
//  Input:  legacy/mintlify/ - a read-only snapshot of despia-native/docs (SOURCE.json names the
//          commit): .mdx pages, docs.json (the navigation), images.
//  Output: content/legacy/<path>.md - one markdown page per .mdx, at the SAME path under /legacy
//          (case preserved: /local-intelligence/Introduction -> /legacy/local-intelligence/Introduction),
//          in the component vocabulary scripts/compile.mjs knows (Card, CardGroup, Steps/Step,
//          Tabs/Tab, CodeGroup, Note/Tip/Info/Warning/Danger, Accordion/AccordionGroup, Frame,
//          ParamField, ResponseField, Update, Video). Mintlify's indentation is normalised (every
//          tag at column 0, every body dedented), JSX attribute values become strings, Mintlify's
//          bare fence titles (```bash npm) become title="npm", internal links move under /legacy.
//          content/legacy/_nav.json - the docs.json navigation (groups, nesting, order), which the
//          compiler turns into the legacy sidebar.
//
//  The port is checked, not trusted: after converting, every page is scanned outside code for a
//  tag the compiler would not turn into a component (raw JSX/HTML would reach the reader as
//  text). One such tag fails the port with file and line. Nothing here edits v3 facts.
//

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "legacy", "mintlify");
const out = join(root, "content", "legacy");
const LEGACY = "/legacy";

if (!existsSync(join(src, "docs.json"))) {
  console.error("[docs.port-legacy] legacy/mintlify/docs.json missing - nothing to port");
  process.exit(1);
}

// ── lastmod: the live sitemap's own dates (inventory row per setup.despia.com page) ──────────
const inventoryFile = join(root, "redirects", "inventory", "setup.despia.com.tsv");
const lastmodOf = new Map();
if (existsSync(inventoryFile)) {
  for (const line of readFileSync(inventoryFile, "utf8").split("\n").slice(1)) {
    const cols = line.split("\t");
    if (cols.length >= 5 && cols[4] !== "") lastmodOf.set(cols[1], cols[4]);
  }
}

// ── the migration map (legacy path -> modern route), when one is known ─────────────────────
const mapFile = join(root, "migrate", "map.json");
const modernOf = new Map();
if (existsSync(mapFile)) {
  for (const row of JSON.parse(readFileSync(mapFile, "utf8")).entries ?? []) {
    if (row.v4 && row.v4.docs) modernOf.set(row.legacyPath, row.v4.docs);
  }
}

// ── navigation ────────────────────────────────────────────────────────────────────────────
const docsJson = JSON.parse(readFileSync(join(src, "docs.json"), "utf8"));
const navOrder = [];
/** A page's own Mintlify icon (FontAwesome name), from its front matter; compile.mjs maps it. */
function pageIcon(path) {
  const file = join(src, ...(path.slice(1) + ".mdx").split("/"));
  if (!existsSync(file)) return undefined;
  const m = /^icon:\s*"?([\w-]+)/m.exec(readFileSync(file, "utf8"));
  return m === null ? undefined : m[1];
}
function walkNav(items, groups) {
  const nodes = [];
  for (const item of items) {
    if (typeof item === "string") {
      navOrder.push({ path: "/" + item, groups });
      nodes.push({ page: LEGACY + "/" + item, icon: pageIcon("/" + item) });
    } else {
      const name = item.group;
      nodes.push({ group: name, ...(item.icon ? { icon: item.icon } : {}), ...(item.expanded ? { defaultOpen: true } : {}), pages: walkNav(item.pages ?? [], [...groups, name]) });
    }
  }
  return nodes;
}
const navTree = walkNav(docsJson.navigation.pages ?? [], []);

function walkFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(abs));
    else if (entry.name.endsWith(".mdx")) files.push(abs);
  }
  return files;
}
const allPaths = walkFiles(src)
  .map((abs) => "/" + relative(src, abs).split(sep).join("/").replace(/\.mdx$/, ""))
  .filter((p) => !p.startsWith("/snippets/")) // snippet sources are includes, never pages
  .sort();
const inNav = new Set(navOrder.map((n) => n.path));
const orphans = allPaths.filter((p) => !inNav.has(p)); // live on setup.despia.com, never in its sidebar

// ── front matter ──────────────────────────────────────────────────────────────────────────
function parseFrontMatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const end = text.indexOf("\n---", 3);
  const meta = {};
  for (const line of text.slice(3, end).split("\n")) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line.trim());
    if (m === null) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    meta[m[1]] = value.replace(/\\"/g, '"');
  }
  return { meta, body: text.slice(end + 4).replace(/^\r?\n/, "") };
}

// ── links ─────────────────────────────────────────────────────────────────────────────────
const deadLinks = [];
function rewriteHref(href, pagePath) {
  if (href === undefined || href === null) return href;
  let h = href.trim();
  const setup = /^https?:\/\/setup\.despia\.com(\/[^\s]*)?$/.exec(h);
  if (setup !== null) h = setup[1] ?? "/introduction";
  if (h.startsWith("./") || h.startsWith("../")) h = posix.normalize(posix.join(posix.dirname(pagePath), h));
  if (!h.startsWith("/") || h.startsWith("//") || h.startsWith(LEGACY + "/")) return h;
  if (h.startsWith("/images/") || h.startsWith("/logo/")) return LEGACY + h;
  const [pathPart, hash = ""] = h.split("#");
  let clean = pathPart.replace(/\/$/, "") || "/introduction";
  if (clean === "/llms.txt" || clean === "/llms-full.txt") return LEGACY + clean;
  if (!allPaths.includes(clean)) {
    const resolved = resolveDead(clean);
    if (resolved === null) deadLinks.push(`${pagePath} -> ${clean}`);
    else clean = resolved;
  }
  return LEGACY + clean + (hash !== "" ? "#" + hash : "");
}
/** A link v3 itself served as a 404, resolved only when the target is unambiguous: the same
 *  page in another letter case or hyphenation, or a directory whose first sidebar page exists. */
function resolveDead(path) {
  const key = (p) => p.toLowerCase().replace(/-/g, "");
  const same = allPaths.filter((p) => key(p) === key(path));
  if (same.length === 1) return same[0];
  const under = navOrder.map((n) => n.path).filter((p) => key(p).startsWith(key(path) + "/"));
  if (under.length > 0) return under[0];
  return null;
}
function rewriteMarkdownLinks(line, pagePath) {
  // inline code spans are left alone; everything else gets its ](url) rewritten
  return line.split(/(`[^`]*`)/).map((part, i) => i % 2 === 1 ? part
    : part.replace(/\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_, url, title) => `](${rewriteHref(url, pagePath)}${title ?? ""})`))
    .join("");
}

// ── tags ──────────────────────────────────────────────────────────────────────────────────
const CALLOUTS = new Set(["Note", "Tip", "Info", "Warning", "Danger", "Check"]);
const BLOCKS = new Set(["Card", "CardGroup", "Columns", "Steps", "Step", "Tabs", "Tab", "CodeGroup", "Accordion",
  "AccordionGroup", "Frame", "ParamField", "ResponseField", "Update", "Expandable", "Icon", ...CALLOUTS]);
const HTML_BLOCKS = new Set(["iframe", "img", "video", "div", "br", "p"]);

/** Attribute list -> ordered [name, value] pairs. JSX braces become strings; a bare name is "true". */
function parseAttrs(text) {
  const attrs = [];
  let i = 0;
  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (i >= text.length) break;
    const nameMatch = /^[A-Za-z_:][\w:.-]*/.exec(text.slice(i));
    if (nameMatch === null) { i += 1; continue; }
    const name = nameMatch[0];
    i += name.length;
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (text[i] !== "=") { attrs.push([name, "true"]); continue; }
    i += 1;
    while (i < text.length && /\s/.test(text[i])) i += 1;
    const q = text[i];
    if (q === '"' || q === "'") {
      const end = text.indexOf(q, i + 1);
      attrs.push([name, text.slice(i + 1, end)]);
      i = end + 1;
    } else if (q === "{") {
      let depth = 0;
      let j = i;
      for (; j < text.length; j += 1) {
        if (text[j] === "{") depth += 1;
        else if (text[j] === "}") { depth -= 1; if (depth === 0) break; }
      }
      let value = text.slice(i + 1, j).trim();
      if (/^(["'`]).*\1$/s.test(value)) value = value.slice(1, -1);
      attrs.push([name, value]);
      i = j + 1;
    } else {
      const m = /^[^\s>]+/.exec(text.slice(i));
      attrs.push([name, m[0]]);
      i += m[0].length;
    }
  }
  return attrs;
}

function escAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}
function attrString(pairs) {
  return pairs.map(([k, v]) => ` ${k}="${escAttr(v)}"`).join("");
}

/** Find where a tag that opens at lines[i] (col `at`) ends its open part; may span lines. */
function readOpenTag(lines, i) {
  const first = lines[i];
  const m = /^(\s*)<([A-Za-z][A-Za-z0-9]*)/.exec(first);
  if (m === null) return null;
  let text = first.slice(m[0].length);
  let j = i;
  for (;;) {
    let quote = null;
    let brace = 0;
    for (let k = 0; k < text.length; k += 1) {
      const ch = text[k];
      if (quote !== null) { if (ch === quote) quote = null; continue; }
      if (ch === '"' || ch === "'") { quote = ch; continue; }
      if (ch === "{") { brace += 1; continue; }
      if (ch === "}") { brace -= 1; continue; }
      if (ch === ">" && brace === 0) {
        const selfClosing = text[k - 1] === "/";
        const attrText = text.slice(0, selfClosing ? k - 1 : k);
        return { indent: m[1], name: m[2], attrs: parseAttrs(attrText.replace(/\n/g, " ")), selfClosing, rest: text.slice(k + 1), endLine: j };
      }
    }
    j += 1;
    if (j >= lines.length) return null;
    text += "\n" + lines[j];
  }
}

function dedent(lines) {
  let min = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    const n = /^ */.exec(line.replace(/\t/g, "    "))[0].length;
    if (n < min) min = n;
  }
  if (min === Infinity || min === 0) return lines.map((l) => l.replace(/\t/g, "    "));
  return lines.map((l) => l.replace(/\t/g, "    ").slice(Math.min(min, /^ */.exec(l.replace(/\t/g, "    "))[0].length)));
}

/** Parse a run of lines into nodes: { md: [lines] } | { tag, attrs, children, inline }. */
function parseNodes(lines, file) {
  const nodes = [];
  let run = [];
  const flush = () => { if (run.length > 0) nodes.push({ md: run }); run = []; };
  let fence = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const opener = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence !== null) {
      run.push(line);
      if (opener !== null && opener[1][0] === fence[0] && opener[1].length >= fence.length && line.trim().replace(/^[`~]+/, "") === "") fence = null;
      continue;
    }
    if (opener !== null) { fence = opener[1]; run.push(line); continue; }
    if (/^\s*\{\/\*[\s\S]*?\*\/\}\s*$/.test(line)) continue; // MDX comment line
    if (/^\s*\{\/\*/.test(line)) { // multi-line MDX comment
      while (i < lines.length && !/\*\/\}\s*$/.test(lines[i])) i += 1;
      continue;
    }
    if (/^\s*(import|export)\s/.test(line) && run.every((l) => l.trim() === "")) continue; // MDX ESM
    const tagHead = /^\s*<([A-Za-z][A-Za-z0-9]*)[\s>/]/.exec(line + " ");
    if (tagHead !== null && (BLOCKS.has(tagHead[1]) || HTML_BLOCKS.has(tagHead[1]))) {
      const open = readOpenTag(lines, i);
      if (open === null) throw new Error(`${file}:${i + 1}: unterminated <${tagHead[1]}>`);
      flush();
      const name = open.name;
      if (open.selfClosing || name === "br" || name === "img") {
        nodes.push({ tag: name, attrs: open.attrs, children: [] });
        if (open.rest.trim() !== "") run.push(open.rest);
        i = open.endLine;
        continue;
      }
      const closeTok = `</${name}>`;
      const restTrim = open.rest.trim();
      if (restTrim.endsWith(closeTok) && !restTrim.slice(0, -closeTok.length).includes(`<${name}`)) {
        nodes.push({ tag: name, attrs: open.attrs, children: parseNodes([restTrim.slice(0, -closeTok.length).trim()], file) });
        i = open.endLine;
        continue;
      }
      // block form: find the balanced close, fence-aware
      let depth = 1;
      let innerFence = null;
      const inner = restTrim !== "" ? [open.rest] : [];
      let j = open.endLine + 1;
      for (; j < lines.length; j += 1) {
        const l = lines[j];
        const o = /^\s*(`{3,}|~{3,})/.exec(l);
        if (innerFence !== null) {
          if (o !== null && o[1][0] === innerFence[0] && o[1].length >= innerFence.length && l.trim().replace(/^[`~]+/, "") === "") innerFence = null;
          inner.push(l);
          continue;
        }
        if (o !== null) { innerFence = o[1]; inner.push(l); continue; }
        const opens = (l.match(new RegExp(`<${name}(?=[\\s>/])`, "g")) ?? []).length
          - (l.match(new RegExp(`<${name}(?=[\\s][^>]*/>)`, "g")) ?? []).length;
        const closes = (l.match(new RegExp(`</${name}>`, "g")) ?? []).length;
        depth += opens - closes;
        if (depth <= 0) {
          const before = l.slice(0, l.lastIndexOf(closeTok));
          if (before.trim() !== "") inner.push(before);
          break;
        }
        inner.push(l);
      }
      if (j >= lines.length) throw new Error(`${file}:${i + 1}: <${name}> never closes`);
      nodes.push({ tag: name, attrs: open.attrs, children: parseNodes(dedent(inner), file) });
      i = j;
      continue;
    }
    run.push(line);
  }
  flush();
  return nodes;
}

const attr = (node, name) => (node.attrs.find(([k]) => k === name) ?? [])[1];

/** A markdown run, normalised: dedented, fences titled the compiler's way, inline HTML mapped. */
function emitMarkdown(lines, pagePath) {
  const outLines = [];
  let fence = null;
  for (const raw of dedent(lines)) {
    const opener = /^(\s*)(`{3,}|~{3,})(.*)$/.exec(raw);
    if (fence !== null) {
      outLines.push(raw);
      if (opener !== null && opener[2][0] === fence[0] && opener[2].length >= fence.length && opener[3].trim() === "") fence = null;
      continue;
    }
    if (opener !== null) {
      fence = opener[2];
      outLines.push(opener[1] + opener[2] + fenceInfo(opener[3].trim(), opener[2]));
      continue;
    }
    let line = raw;
    // inline HTML that the markdown element would print as text
    line = line.split(/(`[^`]*`)/).map((part, i) => i % 2 === 1 ? part : part
      .replace(/<br\s*\/?>/gi, line.trim().startsWith("|") ? " " : "  \n")
      .replace(/<\/?u>/g, "")
      .replace(/<\/?(strong|b)>/g, "**")
      .replace(/<\/?(em|i)>/g, "*")
      .replace(/<\/?code>/g, "`")
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")).join("");
    outLines.push(rewriteMarkdownLinks(line, pagePath));
  }
  return outLines.join("\n").replace(/^\n+|\n+$/g, "");
}

/** ```bash npm -> ```bash title="npm"; a filename-ish or quoted bare title is kept as the title. */
function fenceInfo(info, marker) {
  if (info === "") return "";
  const m = /^([A-Za-z0-9_+#.-]*)(?:\s+(.*))?$/.exec(info);
  if (m === null) return "";
  let lang = m[1];
  let rest = (m[2] ?? "").trim();
  // Mintlify meta words that are not a title
  rest = rest.replace(/\b(lines|wrap|expandable|highlight=\S+|focus=\S+|icon="[^"]*"|icon=\S+)\b/g, "").trim();
  if (rest.startsWith("title=")) rest = rest.replace(/^title=/, "");
  rest = rest.replace(/^["']|["']$/g, "").replace(/"/g, "'").trim();
  if (lang === "jsx" || lang === "tsx" || lang === "js" || lang === "ts" || lang === "") lang = lang || "";
  if (marker.length !== 3 || rest === "") return lang;
  return `${lang} title="${rest}"`;
}

function emitNodes(nodes, pagePath) {
  const parts = [];
  for (const node of nodes) {
    if (node.md !== undefined) {
      const text = emitMarkdown(node.md, pagePath);
      if (text.trim() !== "") parts.push(text);
      continue;
    }
    const block = emitTag(node, pagePath);
    if (block !== "") parts.push(block);
  }
  return parts.join("\n\n");
}

function wrap(name, attrs, body) {
  if (body.trim() === "") return `<${name}${attrString(attrs)}/>`;
  return `<${name}${attrString(attrs)}>\n${body}\n</${name}>`;
}

function emitTag(node, pagePath) {
  const body = () => emitNodes(node.children, pagePath);
  switch (node.tag) {
    case "Note": case "Tip": case "Info": case "Warning": case "Danger": case "Check": {
      const kind = node.tag === "Check" ? "Tip" : node.tag;
      const title = attr(node, "title");
      return wrap(kind, title !== undefined ? [["title", title]] : [], body());
    }
    case "CardGroup": case "Columns":
      return wrap("CardGroup", [["cols", attr(node, "cols") ?? "2"]], body());
    case "Card": {
      const pairs = [];
      if (attr(node, "title") !== undefined) pairs.push(["title", attr(node, "title")]);
      if (attr(node, "href") !== undefined) pairs.push(["href", rewriteHref(attr(node, "href"), pagePath)]);
      return wrap("Card", pairs, body());
    }
    case "Steps": return wrap("Steps", [], body());
    case "Step": return wrap("Step", [["title", attr(node, "title") ?? ""]], body());
    case "Tabs": return `<Tabs>\n${node.children.filter((c) => c.tag === "Tab").map((c) => emitTag(c, pagePath)).join("\n")}\n</Tabs>`;
    case "Tab": {
      const inner = body();
      return `<Tab title="${escAttr(attr(node, "title") ?? "Tab")}">\n${inner.trim() === "" ? "&nbsp;" : inner}\n</Tab>`;
    }
    case "CodeGroup": {
      // fences only: every non-fence line inside a Mintlify CodeGroup is whitespace
      const fences = node.children.filter((c) => c.md !== undefined).map((c) => emitMarkdown(c.md, pagePath)).join("\n\n");
      return `<CodeGroup>\n${fences}\n</CodeGroup>`;
    }
    case "AccordionGroup": return wrap("AccordionGroup", [], body());
    case "Accordion": case "Expandable": {
      const open = attr(node, "defaultOpen") === "true" ? "true" : "false";
      return `<Accordion title="${escAttr(attr(node, "title") ?? "Details")}" open="${open}">\n${body() || "&nbsp;"}\n</Accordion>`;
    }
    case "Frame": return wrap("Frame", attr(node, "caption") !== undefined ? [["caption", attr(node, "caption")]] : [], body());
    case "ParamField": {
      const where = ["path", "query", "body", "header"].find((k) => attr(node, k) !== undefined) ?? "path";
      const pairs = [["name", attr(node, where) ?? ""], ["kind", where]];
      for (const k of ["type", "default"]) if (attr(node, k) !== undefined) pairs.push([k, attr(node, k)]);
      if (attr(node, "required") === "true") pairs.push(["required", "true"]);
      return wrap("ParamField", pairs, body());
    }
    case "ResponseField": {
      const pairs = [["name", attr(node, "name") ?? ""]];
      for (const k of ["type", "default"]) if (attr(node, k) !== undefined) pairs.push([k, attr(node, k)]);
      if (attr(node, "required") === "true") pairs.push(["required", "true"]);
      return wrap("ResponseField", pairs, body());
    }
    case "Update":
      return wrap("Update", [["label", attr(node, "label") ?? ""], ["description", attr(node, "description") ?? ""]], body());
    case "iframe": case "video": {
      const s = attr(node, "src") ?? "";
      return `<Video src="${escAttr(s)}" title="${escAttr(attr(node, "title") ?? "Video")}"/>`;
    }
    case "img": {
      const s = rewriteHref(attr(node, "src") ?? "", pagePath);
      return `![${(attr(node, "alt") ?? "").replace(/[\[\]]/g, "")}](${s})`;
    }
    case "br": return "";
    case "Icon": return "";
    case "div": case "p": return body();
    default:
      throw new Error(`${pagePath}: no mapping for <${node.tag}>`);
  }
}

// ── the leak check: nothing outside code may still look like a tag the compiler would not map
const COMPILED = new Set(["Card", "CardGroup", "Steps", "Step", "Tabs", "Tab", "CodeGroup", "Note", "Tip", "Info", "Warning",
  "Danger", "Accordion", "AccordionGroup", "Frame", "ParamField", "ResponseField", "Update", "Video", "Callout"]);
function leaks(text) {
  const found = [];
  let fence = null;
  text.split("\n").forEach((line, n) => {
    const o = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence !== null) { if (o !== null && o[1][0] === fence[0] && o[1].length >= fence.length) fence = null; return; }
    if (o !== null) { fence = o[1]; return; }
    const prose = line.replace(/`[^`]*`/g, "").replace(/="[^"]*"/g, '=""');
    const tag = /^\s*<\/?([A-Za-z][A-Za-z0-9]*)/.exec(prose);
    if (tag !== null && COMPILED.has(tag[1])) return; // a compiled component line
    const m = /<\/?([A-Za-z][A-Za-z0-9-]*)(\s[^>]*)?\/?>/.exec(prose);
    if (m !== null) found.push(`${n + 1}: ${m[0]}`);
    if (/\{\/\*|\*\/\}/.test(prose)) found.push(`${n + 1}: MDX comment`);
  });
  return found;
}

// ── port ──────────────────────────────────────────────────────────────────────────────────
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const orderOf = new Map(navOrder.map((n, i) => [n.path, i]));
const problems = [];
let ported = 0;
for (const path of allPaths) {
  const file = join(src, ...(path.slice(1) + ".mdx").split("/"));
  const { meta, body } = parseFrontMatter(readFileSync(file, "utf8").replace(/\r\n/g, "\n"));
  let converted;
  try {
    converted = emitNodes(parseNodes(body.split("\n"), path), path);
  } catch (error) {
    problems.push(String(error.message ?? error));
    continue;
  }
  const leaked = leaks(converted);
  for (const l of leaked) problems.push(`content/legacy${path}.md:${l}`);
  const nav = navOrder.find((n) => n.path === path);
  const title = meta.title ?? path.split("/").pop();
  const fm = [
    "---",
    `title: ${title.replace(/\n/g, " ")}`,
    ...(meta.description ? [`description: ${meta.description.replace(/\n/g, " ")}`] : []),
    ...(meta.sidebarTitle ? [`label: ${meta.sidebarTitle}`] : []),
    `route: ${LEGACY}${path}`,
    `space: legacy`,
    `section: ${nav !== undefined && nav.groups.length > 0 ? nav.groups[0] : "Get started"}`,
    `group: ${nav !== undefined ? nav.groups.join(" > ") : ""}`,
    `order: ${orderOf.has(path) ? 3000 + orderOf.get(path) : 9000}`,
    `nav: ${nav !== undefined ? "true" : "false"}`,
    ...(lastmodOf.has(path) ? [`lastmod: ${lastmodOf.get(path)}`] : []),
    ...(modernOf.has(path) ? [`modern: ${modernOf.get(path)}`] : []),
    `legacy: ${path}`,
    "---",
    "",
  ].join("\n");
  const h1 = /^#\s/m.test(converted.split("\n").find((l) => l.trim() !== "") ?? "") ? "" : `# ${title}\n\n`;
  const dest = join(out, ...(path.slice(1) + ".md").split("/"));
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${fm}${h1}${converted}\n`);
  ported += 1;
}

writeFileSync(join(out, "_nav.json"), JSON.stringify({ tree: navTree, orphans: orphans.map((p) => LEGACY + p) }, null, 1) + "\n");

// the v3 images ride under /legacy/images, /legacy/logo (the pages and favicons reference them)
for (const dir of ["images", "logo"]) {
  if (existsSync(join(src, dir))) cpSync(join(src, dir), join(root, "public", "legacy", dir), { recursive: true });
}

if (problems.length > 0) {
  console.error(`[docs.port-legacy] ${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`[docs.port-legacy] ${ported} page(s) -> content/legacy (${navOrder.length} in nav, ${orphans.length} live but unlisted: ${orphans.join(", ")}); ${deadLinks.length} internal link(s) to pages v3 never had`);
if (deadLinks.length > 0) writeFileSync(join(out, "_dead-links.txt"), deadLinks.join("\n") + "\n");
