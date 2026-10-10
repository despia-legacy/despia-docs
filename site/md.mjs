//
//  md.mjs - the docs' markdown, rendered at build time to static HTML.
//
//  The subset the docs are written in (and nothing else, so a page never depends on a renderer quirk):
//    front matter (key: value), # headings (ids from the text), paragraphs, - / 1. lists (nested by indent),
//    ```lang title="File.dsx" fences, | tables |, > quotes, --- rules, and inline `code`, **bold**, *em*, [links](/x).
//  Directives, one per line, closed by a line holding only ":::":
//    ::: note | tip | warning [Title]   a callout
//    ::: code-group                     consecutive fences become tabs (the fence title is the tab label)
//    ::: cards                          "- [Title](/href) icon: text" items become a link-card grid
//    ::: steps                          the ### headings inside become numbered steps
//  Returns { html, headings: [{ id, title, level }] }.
//
import { escapeHtml, highlightHtml, languageLabel } from "./highlight.mjs";
import { icon } from "./icons.mjs";

export function parseFrontMatter(src) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: src.slice(m[0].length) };
}

export const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/`/g, "").replace(/&[a-z]+;/g, "")
  .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

export function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = escapeHtml(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const ext = /^https?:/.test(href);
    return `<a href="${href}"${ext ? ' rel="noopener"' : ""}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[+i])}</code>`);
  return s;
}

function codeBlock(lang, meta, text) {
  const title = /title="([^"]+)"/.exec(meta || "")?.[1];
  const label = title ?? languageLabel(lang);
  return `<figure class="code" data-lang="${escapeHtml(lang || "text")}"><figcaption><span class="code-title">${escapeHtml(label)}</span>`
    + (title ? `<span class="code-lang">${escapeHtml(languageLabel(lang))}</span>` : "")
    + `<button class="code-copy" type="button" aria-label="Copy code">${icon("doc.on.doc")}</button></figcaption>`
    + `<pre><code>${highlightHtml(text.replace(/\n$/, ""), lang)}</code></pre></figure>`;
}

export function renderMarkdown(src, ctx = {}) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const headings = [];
  const used = new Set();
  const out = [];
  let i = 0;

  const headingId = (title) => {
    let id = slugify(title) || "section";
    let n = 2;
    while (used.has(id)) id = `${slugify(title)}-${n++}`;
    used.add(id);
    return id;
  };

  function readFence() {
    const open = /^(\s*)(`{3,})(\S*)\s*(.*)$/.exec(lines[i]);
    const fence = open[2];
    const body = [];
    i++;
    while (i < lines.length && !lines[i].trim().startsWith(fence)) {
      body.push(lines[i].slice(open[1].length));
      i++;
    }
    i++;
    return { lang: open[3], meta: open[4], text: body.join("\n") };
  }

  function block(stopAtDirectiveEnd) {
    const html = [];
    while (i < lines.length) {
      const line = lines[i];
      if (stopAtDirectiveEnd && line.trim() === ":::") { i++; return html.join("\n"); }
      if (!line.trim()) { i++; continue; }

      let m;
      if ((m = /^:::\s*(\S+)\s*(.*)$/.exec(line))) {
        i++;
        const kind = m[1];
        const arg = m[2];
        if (kind === "code-group") {
          const tabs = [];
          while (i < lines.length && lines[i].trim() !== ":::") {
            if (/^\s*```/.test(lines[i])) tabs.push(readFence()); else i++;
          }
          i++;
          const name = `cg${ctx.cg = (ctx.cg ?? 0) + 1}`;
          html.push(`<div class="code-group" data-group="${name}"><div class="code-tabs" role="tablist">`
            + tabs.map((t, k) => `<button role="tab" type="button" aria-selected="${k === 0}" data-tab="${k}">${escapeHtml(/title="([^"]+)"/.exec(t.meta)?.[1] ?? languageLabel(t.lang))}</button>`).join("")
            + `</div>` + tabs.map((t, k) => `<div class="code-pane" data-pane="${k}"${k ? " hidden" : ""}>${codeBlock(t.lang, t.meta.replace(/title="[^"]+"/, ""), t.text)}</div>`).join("") + `</div>`);
        } else if (kind === "cards") {
          const items = [];
          while (i < lines.length && lines[i].trim() !== ":::") {
            const c = /^-\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\{([\w.]+)\})?\s*(.*)$/.exec(lines[i].trim());
            if (c) items.push(c);
            i++;
          }
          i++;
          html.push(`<div class="cards">` + items.map(([, t, href, ic, text]) =>
            `<a class="card" href="${href}">${ic ? `<span class="card-icon">${icon(ic)}</span>` : ""}<span class="card-title">${inline(t)}</span><span class="card-text">${inline(text)}</span></a>`).join("") + `</div>`);
        } else if (kind === "steps") {
          html.push(`<div class="steps">${block(true)}</div>`);
        } else {
          const tone = ["note", "tip", "warning", "info"].includes(kind) ? kind : "note";
          const ic = { note: "info.circle", info: "info.circle", tip: "lightbulb", warning: "exclamationmark.triangle" }[tone];
          html.push(`<aside class="callout callout-${tone}"><span class="callout-icon">${icon(ic)}</span><div class="callout-body">`
            + (arg ? `<p class="callout-title">${inline(arg)}</p>` : "") + block(true) + `</div></aside>`);
        }
        continue;
      }
      if (/^\s*```/.test(line)) { const f = readFence(); html.push(codeBlock(f.lang, f.meta, f.text)); continue; }
      if ((m = /^(#{1,4})\s+(.*?)\s*$/.exec(line))) {
        const level = m[1].length;
        const title = m[2];
        const id = headingId(title);
        if (level >= 2 && level <= 3) headings.push({ id, title: title.replace(/`/g, ""), level });
        html.push(`<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inline(title)}</h${level}>`);
        i++;
        continue;
      }
      if (/^---+\s*$/.test(line)) { html.push("<hr>"); i++; continue; }
      if (/^\|/.test(line)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        const cells = (r) => r.replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
        const head = cells(rows[0]);
        const body = rows.slice(2).map(cells);
        html.push(`<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>`
          + body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") + `</tbody></table></div>`);
        continue;
      }
      if (/^>\s?/.test(line)) {
        const q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
        html.push(`<blockquote>${renderMarkdown(q.join("\n"), ctx).html}</blockquote>`);
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(line)) { html.push(list()); continue; }
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(\s*```|#{1,4}\s|:::|\||>|\s*([-*]|\d+\.)\s+)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
      html.push(`<p>${inline(para.join(" "))}</p>`);
    }
    return html.join("\n");
  }

  function list() {
    const indent = /^(\s*)/.exec(lines[i])[1].length;
    const ordered = /^\s*\d+\./.test(lines[i]);
    const items = [];
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        if (i + 1 < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i + 1]) && /^(\s*)/.exec(lines[i + 1])[1].length >= indent) { i++; continue; }
        break;
      }
      const ind = /^(\s*)/.exec(line)[1].length;
      const m = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(line);
      if (ind < indent) break;
      if (ind > indent && items.length) {
        if (m) { items[items.length - 1].sub.push(list()); continue; }
        items[items.length - 1].text += " " + line.trim(); i++; continue;
      }
      if (!m) { if (items.length) items[items.length - 1].text += " " + line.trim(); i++; continue; }
      items.push({ text: m[2], sub: [] });
      i++;
    }
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((it) => `<li>${inline(it.text)}${it.sub.join("")}</li>`).join("")}</${tag}>`;
  }

  return { html: block(false), headings };
}
