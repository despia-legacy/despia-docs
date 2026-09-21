#!/usr/bin/env node
//
//  generate-components.mjs — the component reference generator: one markdown page per
//  supported library component, written into content/components/ for compile.mjs to
//  consume like any other page (route, nav, search, /md sibling, llms.txt all come free).
//
//  Sources (read-only, the Trinity ledgers): the census (stack-elements.json) for the
//  attribute/event contract and the example, the Trinity matrix (matrix.json) for scope,
//  web-grammar status and the per-renderer adaptivity declarations, the web element ledger
//  for the web twin's class hooks, and the dom package sources for the real --dsx-*
//  customization variables (the skin sheets are template literals in packages/dom/src).
//
//  The source tree is a front-door checkout, resolved like sync-content.mjs:
//  DESPIA_FRONT_DOOR, else .front-door/ (the CI checkout), else ../despia. When the
//  checkout is missing or predates the Trinity matrix, generation soft-skips so the build
//  keeps working from whatever content/components/ already holds; when it is present, the
//  directory is wiped and rebuilt (the compile.mjs precedent), so removed components
//  clean themselves up. Deterministic: same inputs, same bytes.
//
//  House law for generated prose: no em or en dashes (the published-prose gate); source
//  strings are rewritten " — " -> " - " and tight dashes -> hyphens on the way through.
//

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** One line per component: the role a reader scans first. Curated here (the census has no
 *  role field); a component missing from this map still gets a page with a derived line. */
const ROLES = {
  Accordion: "A collapsible disclosure row: a tappable title that opens and closes its body content.",
  ChatBubble: "A directional message bubble for conversation UIs, tinted by sender side.",
  Checkbox: "A binary check control bound to a Bool, with label and change write-back.",
  Drawer: "The navigation drawer: modal over compact layouts, standing and pinnable on desktop widths.",
  MenuBar: "The desktop menu bar idiom: horizontal roots with keyboard menus, collapsing to the sheet idiom on compact.",
  ProgressRing: "A circular determinate progress indicator drawn as a ring.",
  RadioGroup: "A single-choice group of radio rows built from static or bound options.",
  Skeleton: "A loading placeholder block that mirrors the size and radius of the content it stands in for.",
  Table: "A data table from bound rows and declared columns, scroll-contained inside its own frame.",
  alert: "The modal alert dialog: title, message and normalized actions, presented by state.",
  button: "The system button: label, icon, variants and roles, the primary tap target of the grammar.",
  calendar: "A month-grid date control with ISO binding, range constraints and marked dates.",
  carousel: "A snap-paging slide container with selection dots and two-way current-page binding.",
  combobox: "An editable text field over a filtered option list, the type-ahead choice control.",
  confirmDialog: "The two-action confirmation dialog, presented by state and resolved through its actions.",
  contextmenu: "A context menu on right-click and long-press, with nested actions, roles and separators.",
  datepicker: "The platform date and time picker bound to a normalized wire value.",
  divider: "A hairline rule on the semantic separator token.",
  field: "A labeled form control inside a form: shared state, validation, touched and error tracking.",
  flow: "A wrapping flow layout: children pack left to right at ideal size and break on overflow.",
  form: "The form container: one state namespace for its fields, validity, and the submit action.",
  grid: "A column grid over bound rows: responsive column counts, keyed reconciliation, spacing and scroll.",
  hstack: "The horizontal stack: the fixed-axis preset of stack for row layout.",
  image: "Remote, bundled and icon imagery: one element for pictures and the shared icon corpus.",
  list: "The platform list over bound rows: keyed identity, row templates, swipe actions and reordering.",
  menu: "An anchored dropdown menu with normalized actions, roles, separators and submenus.",
  otp: "The segmented one-time-code input with paste normalization and a completion event.",
  pager: "A full-size snap pager over bound pages with two-way current-page binding.",
  picker: "The single-choice picker: platform select semantics over static or bound options.",
  popover: "An anchored, viewport-aware popover presented from its trigger content.",
  pressable: "A whole-area tap target around arbitrary children: button or link semantics without chrome.",
  progress: "The linear determinate progress bar with a clamped bound value.",
  qrcode: "A deterministic QR code rendered from its value, with size, colors and correction level.",
  rangeslider: "The dual-thumb range control binding a low and high value inside shared bounds.",
  scaffold: "The adaptive app shell: sidebar, content and inspector panes that collapse by width class.",
  scroll: "The scrolling viewport: vertical by default, indicators hidden, children scroll.",
  searchbar: "The composite search field: leading magnifier, live binding and the platform search affordances.",
  segmented: "The segmented single-choice control with radio semantics and arrow-key traversal.",
  segmentedButton: "The Material segmented button row: single or multiple selection with labels and icons.",
  sheet: "The bottom sheet presented by state: detents, chrome, and swipe or control dismissal.",
  slider: "The continuous value slider bound to a number inside min and max.",
  spacer: "Flexible space that expands along the parent stack's axis to push and distribute siblings.",
  spinner: "The indeterminate activity spinner with semantic tint and reduced-motion handling.",
  split: "The two or three pane adaptive container: stack push on phones, pinned panes with draggable dividers on desktop.",
  stack: "The generic container: one element, CSS decides column, row or layered layout.",
  stars: "The star rating row: fractional fills, read-only or interactive radio semantics.",
  stepper: "The increment and decrement control for a bounded numeric value.",
  tabs: "The tab container: each child pane names its own tab; the bar renders from the panes.",
  text: "The text element: bound or literal content with the semantic type ramp and inline markdown.",
  textarea: "The multi-line text input growing between minLines and maxLines.",
  textfield: "The single-line text input: binding, placeholder, content types and submit semantics.",
  toggle: "The on-off switch bound to a Bool.",
  toolbar: "The action row pinned to an edge, with roving focus across its controls.",
  vstack: "The vertical stack: the fixed-axis preset of stack for column layout.",
  zstack: "The layered stack: children overlap in declaration order with nine-point alignment.",
};

/** Published-prose law: no em or en dashes. Spaced dashes read as a clause hyphen. */
function prose(source) {
  return String(source ?? "")
    .replace(/ [—–] /g, " - ")
    .replace(/[—–]/g, "-");
}

/** Source strings rendered THROUGH markdown: a `*` in a glob or a `_` in an identifier is
 *  literal text, never emphasis. */
function mdText(source) {
  return prose(source).replace(/([*_])/g, "\\$1");
}

function tableCell(source) {
  return mdText(source).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function frontDoor() {
  if (process.env.DESPIA_FRONT_DOOR) return resolve(process.env.DESPIA_FRONT_DOOR);
  const ci = join(docsRoot, ".front-door");
  if (existsSync(ci)) return ci;
  return resolve(docsRoot, "..", "despia");
}

/** Every template literal in the dom package sources that carries a skin layer: the
 *  sheets are authored as `@layer dsx-…` strings, so this IS the stylesheet corpus. */
function domSheets(domSrc) {
  const out = [];
  for (const name of readdirSync(domSrc).sort()) {
    if (!name.endsWith(".ts")) continue;
    const text = readFileSync(join(domSrc, name), "utf8");
    for (const match of text.matchAll(/`(@layer dsx-[a-z-]+ \{[\s\S]*?)`/g)) out.push(match[1]);
  }
  return out;
}

/** selector-chain scanner: for each declaration region, the stack of selectors above it.
 *  Good enough for the skin sheets (no strings containing braces). */
function cssRegions(css) {
  const regions = [];
  const stack = [];
  let pending = "";
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "{") {
      stack.push({ selector: pending.replace(/\s+/g, " ").trim(), body: "" });
      pending = "";
    } else if (ch === "}") {
      const top = stack.pop();
      if (top !== undefined) regions.push({ chain: [...stack.map((f) => f.selector), top.selector], body: top.body });
      pending = "";
    } else {
      if (stack.length > 0) stack[stack.length - 1].body += ch;
      pending = ch === ";" ? "" : pending + ch;
    }
  }
  return regions;
}

function escapeRegExp(source) {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The component's real customization surface: every --dsx-* variable declared or read
 *  inside a rule whose selector chain names one of the component's classes, minus the
 *  global token plane (declared in @layer dsx-tokens), which /system documents once. */
function componentVariables(sheets, classes) {
  const globals = new Set();
  const names = new Set();
  const matchers = classes.map((cls) => new RegExp(`\\.${escapeRegExp(cls)}(?![A-Za-z0-9_-])`));
  for (const sheet of sheets) {
    const regions = cssRegions(sheet);
    if (sheet.startsWith("@layer dsx-tokens")) {
      for (const region of regions) {
        for (const match of region.body.matchAll(/(--dsx-[a-z0-9-]+)\s*:/g)) globals.add(match[1]);
      }
      continue;
    }
    for (const region of regions) {
      if (!matchers.some((m) => region.chain.some((sel) => m.test(sel)))) continue;
      for (const match of region.body.matchAll(/--dsx-[a-z0-9-]+/g)) names.add(match[0]);
    }
  }
  return [...names].filter((n) => !globals.has(n)).sort();
}

/** Deterministic pretty-printer for the census one-line examples. Quote-aware tag scan;
 *  an element wrapping only text stays on one line. */
function prettyDsx(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] === "<") {
      let j = i + 1;
      let quote = null;
      while (j < source.length) {
        const ch = source[j];
        if (quote !== null) { if (ch === quote) quote = null; }
        else if (ch === '"' || ch === "'") quote = ch;
        else if (ch === ">") break;
        j += 1;
      }
      tokens.push({ kind: "tag", text: source.slice(i, j + 1) });
      i = j + 1;
    } else {
      const j = source.indexOf("<", i);
      const end = j === -1 ? source.length : j;
      const text = source.slice(i, end).trim();
      if (text !== "") tokens.push({ kind: "text", text });
      i = end;
    }
  }
  const lines = [];
  let depth = 0;
  for (let t = 0; t < tokens.length; t += 1) {
    const token = tokens[t];
    if (token.kind === "text") { lines.push("  ".repeat(depth) + token.text); continue; }
    const open = !token.text.startsWith("</") && !token.text.endsWith("/>") && !token.text.startsWith("<!--");
    const close = token.text.startsWith("</");
    if (close) depth = Math.max(0, depth - 1);
    const next = tokens[t + 1];
    const after = tokens[t + 2];
    if (open && next?.kind === "text" && after?.kind === "tag" && after.text.startsWith("</")) {
      lines.push("  ".repeat(depth) + token.text + next.text + after.text);
      t += 2;
      continue;
    }
    lines.push("  ".repeat(depth) + token.text);
    if (open) depth += 1;
  }
  return lines.join("\n");
}

function attributeNotes(row) {
  const parts = [];
  if (row.doc) parts.push(prose(row.doc).replace(/\s+/g, " ").trim());
  if (Array.isArray(row.enum)) parts.push((row.type === "enum" || !row.enumOpen ? "One of: " : "Known values: ") + row.enum.map((v) => `\`${v}\``).join(", ") + (row.enumOpen ? " (open set)." : "."));
  if (row.of) parts.push(`Evaluates to ${row.of}.`);
  if (row.min !== undefined || row.max !== undefined) {
    const bounds = [row.min !== undefined ? `min ${row.min}` : null, row.max !== undefined ? `max ${row.max}` : null].filter(Boolean).join(", ");
    parts.push(`Bounds: ${bounds}.`);
  }
  if (row.unit) parts.push(`Unit: ${row.unit}.`);
  return parts.join(" ");
}

function defaultCell(row) {
  if (row.default === null || row.default === undefined) return "none";
  if (row.default === "") return '`""`';
  return `\`${String(row.default)}\``;
}

const CHILDREN_SENTENCES = {
  none: "a self-closing leaf: it renders no children of its own.",
  children: "a container: its children render inside it.",
  rowTemplate: "a bound collection: its single child is the row template, rendered once per bound row in its own item scope.",
  text: "a text carrier: its element content is its value.",
};

function adaptivityNote(renderer, cell) {
  const label = { web: "Web", ios: "iOS", android: "Android" }[renderer];
  if (!cell || cell.value === null || cell.value === undefined) {
    const pending = renderer === "web" ? "Adaptivity notes pending (no dated stamp in the Trinity matrix yet)." : "Native notes pending (no dated adaptivity stamp in the Trinity matrix yet).";
    return `- **${label}**: ${pending}`;
  }
  if (cell.value === "n/a") return `- **${label}**: Not applicable (${mdText(cell.evidence)}, decided ${cell.verified}).`;
  const state = cell.value === true ? "declared and verified" : cell.value === "review" ? "verified by review" : "audited red";
  return `- **${label}** (${state} ${cell.verified}): ${mdText(cell.evidence)}`;
}

/** The hero's platform chips, read from the Trinity matrix row: a renderer earns its
 *  chip by having a grammar cell that is not audited red or unsupported. */
function platformChips(matrixRow) {
  const chips = [];
  const cell = (renderer) => matrixRow.renderers?.[renderer]?.grammar?.value;
  if (cell("web") === "supported") chips.push("Web");
  if (cell("ios") !== undefined && cell("ios") !== "unsupported") chips.push("iOS");
  if (cell("android") !== undefined && cell("android") !== "unsupported") chips.push("Android");
  return chips;
}

function pageFor(tag, element, matrixRow, webRow, sheets) {
  const slug = tag.toLowerCase();
  const role = ROLES[tag] ?? `The ${tag} element, a ${element.category} component of the DSX grammar.`;
  const attrs = Object.keys(element.attributes ?? {}).sort();
  const hasPerChild = attrs.some((name) => element.attributes[name].perChild);
  const classes = String(element.webClass ?? "").split(/\s+/).filter(Boolean);
  const variables = classes.length > 0 ? componentVariables(sheets, classes) : [];
  const aliases = (element.aliases ?? []).slice().sort();
  const events = (element.events ?? []).slice().sort();

  const lines = [];
  lines.push("---");
  lines.push(`title: ${tag}`);
  lines.push(`description: ${prose(role)}`);
  lines.push("order: 3");
  lines.push(`component: ${tag}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${tag}`);
  lines.push("");
  lines.push(prose(role));
  lines.push("");
  // The hero meta: platform chips over a dot-separated meta line, rendered by the
  // RefMeta component (Components/RefMeta.dsx); the body stays ordinary markdown so
  // the code chips and the gallery link keep working, in /md and llms.txt too.
  const meta = [`Category: ${element.category}`];
  if (aliases.length > 0) meta.push(`Aliases: ${aliases.map((a) => `\`${a}\``).join(", ")}`);
  meta.push("Live specimens: the [System gallery](/system)");
  lines.push(`<RefMeta platforms="${platformChips(matrixRow).join(",")}">`);
  lines.push(meta.join(" · ") + ".");
  lines.push("</RefMeta>");
  lines.push("");
  lines.push("## Example");
  lines.push("");
  lines.push("```dsx");
  lines.push(prettyDsx(element.example ?? ""));
  lines.push("```");
  lines.push("");
  lines.push("## Anatomy");
  lines.push("");
  const anatomy = [`\`<${tag}>\` is ${CHILDREN_SENTENCES[element.children] ?? "documented in the census."}`];
  if (element.notes) anatomy.push(mdText(element.notes).replace(/\s+/g, " ").trim());
  lines.push(anatomy.join(" "));
  lines.push("");
  lines.push("## Attributes");
  lines.push("");
  if (attrs.length === 0) {
    lines.push("This element declares no attributes of its own beyond the universal set.");
  } else {
    const head = ["Name", "Type", "Default", ...(hasPerChild ? ["Per child"] : []), "Notes"];
    lines.push(`| ${head.join(" | ")} |`);
    lines.push(`|${head.map(() => "---").join("|")}|`);
    for (const name of attrs) {
      const row = element.attributes[name];
      const cells = [`\`${name}\``, row.type ?? "", defaultCell(row), ...(hasPerChild ? [row.perChild ? "yes" : ""] : []), tableCell(attributeNotes(row))];
      lines.push(`| ${cells.join(" | ")} |`);
    }
  }
  lines.push("");
  lines.push("Every element also accepts the [universal attributes](https://github.com/despia-native/despia/blob/main/Documentation/reference/StackReference.md#universal-attributes): `id`, `class`, `style`, `visible-if`, the `a11y*` set, `anim`/`enter`/`exit`, and the universal gestures (`on:tap`, `on:longpress`, `on:appear`, ...).");
  lines.push("");
  lines.push("## Events");
  lines.push("");
  if (events.length === 0) {
    lines.push("This element emits no events of its own; the universal gesture events still apply.");
  } else {
    lines.push("| Event | Handled with | Notes |");
    lines.push("|---|---|---|");
    for (const event of events) {
      const doc = element.attributes?.[`on:${event}`]?.doc;
      lines.push(`| \`${event}\` | \`on:${event}\` | ${doc ? tableCell(doc) : ""} |`);
    }
  }
  lines.push("");
  lines.push("## Platform presentation");
  lines.push("");
  lines.push("The adaptivity declarations from the Trinity matrix (a declared phone, tablet and desktop presentation per renderer; identical is legal, accidental is not):");
  lines.push("");
  for (const renderer of ["web", "ios", "android"]) {
    lines.push(adaptivityNote(renderer, matrixRow.renderers?.[renderer]?.adaptivity));
  }
  lines.push("");
  lines.push("## Customization");
  lines.push("");
  if (classes.length > 0) {
    lines.push(`Class hook${classes.length > 1 ? "s" : ""} on the web twin: ${classes.map((c) => `\`.${c}\``).join(", ")} (an authored class, style or theme sheet can restyle the element without replacing its behavior; the defaults live in the weak \`dsx-elements\` layer).`);
  } else {
    lines.push("This element renders no dedicated web class; style it through the universal `style`/`class` attributes.");
  }
  lines.push("");
  if (variables.length > 0) {
    lines.push(`Component-scoped custom properties read by its sheet${variables.length > 1 ? "s" : ""}:`);
    lines.push("");
    for (const name of variables) lines.push(`- \`${name}\``);
    lines.push("");
    lines.push("Override them on the element, an ancestor, or `:root`. The global token plane (colors, spacing, radius, motion) applies as well; the [System gallery](/system) documents it.");
  } else {
    lines.push("No component-scoped custom properties: this element styles itself from the global token plane (colors, spacing, radius, motion) documented on the [System gallery](/system).");
  }
  lines.push("");
  if (webRow?.status) {
    lines.push(`Web grammar status: ${webRow.status} (the web element ledger).`);
    lines.push("");
  }
  return { slug, text: lines.join("\n") };
}

export function generateComponentPages() {
  const door = frontDoor();
  const outDir = join(docsRoot, "content", "components");
  const need = {
    census: join(door, "Documentation", "reference", "stack-elements.json"),
    matrix: join(door, "Conformance", "library", "matrix.json"),
    webLedger: join(door, "Web", "support", "element-support.json"),
    domSrc: join(door, "Web", "packages", "dom", "src"),
  };
  const missing = Object.values(need).filter((p) => !existsSync(p));
  if (missing.length > 0) {
    const kept = existsSync(outDir) ? readdirSync(outDir).filter((n) => n.endsWith(".md")).length : 0;
    console.log(`[docs.components] front door at ${door} lacks ${missing.length} ledger(s) (${missing[0]} ...) - keeping the ${kept} existing page(s)`);
    return;
  }

  const census = JSON.parse(readFileSync(need.census, "utf8"));
  const matrix = JSON.parse(readFileSync(need.matrix, "utf8"));
  const webLedger = JSON.parse(readFileSync(need.webLedger, "utf8"));
  const sheets = domSheets(need.domSrc);

  const supported = Object.keys(matrix.components ?? {}).sort().filter((tag) => {
    const row = matrix.components[tag];
    return row.scope === "library" && row.renderers?.web?.grammar?.value === "supported";
  });
  if (supported.length === 0) {
    console.error("[docs.components] the matrix names no supported library component - refusing to wipe the pages");
    process.exit(1);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const tag of supported) {
    const element = census.elements?.[tag];
    if (element === undefined) {
      console.error(`[docs.components] matrix component <${tag}> has no census row - census and matrix disagree`);
      process.exit(1);
    }
    const { slug, text } = pageFor(tag, element, matrix.components[tag], webLedger.elements?.[tag], sheets);
    writeFileSync(join(outDir, `${slug}.md`), text + "\n");
  }
  console.log(`[docs.components] ${supported.length} reference page(s) from ${door} -> content/components/`);
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateComponentPages();
}
