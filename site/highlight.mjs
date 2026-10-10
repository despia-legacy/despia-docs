//
//  highlight.mjs - code blocks coloured at BUILD time with Despia's own highlighter.
//
//  vendor/despia-highlight.js is OpenSource/CodeEditor/src/canonical-grammar.js, copied verbatim
//  (site/sync-vendor.mjs): the kernel's grammar table (kernel/src/jse/highlight-grammar.ts +
//  highlight-grammars.generated.ts), the same tokens a <code> element colours on device. A .dsx
//  sample is ONE language there: markup, the <style> sheet (CSS) and every code body / {{ }} hole
//  (JSE) come out of one pass, so a page never stitches three highlighters together.
//
//  Output is static spans (`<span class="t-keyword">`), coloured by site/style.css with the
//  CodeEditor theme.js palette for light and dark. No highlighting JavaScript ships to the browser.
//
import { highlightCode, grammarFor } from "./vendor/despia-highlight.js";

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);

/** The label a code block's header shows for its fence language. */
const LABEL = {
  dsx: "DSX", js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript", jsx: "JSX",
  tsx: "TSX", css: "CSS", html: "HTML", xml: "XML", json: "JSON", sh: "Terminal", bash: "Terminal", shell: "Terminal",
  swift: "Swift", kotlin: "Kotlin", yaml: "YAML", md: "Markdown", text: "Text", diff: "Diff",
};
export const languageLabel = (lang) => LABEL[lang] ?? (lang ? lang.toUpperCase() : "Text");

/** Highlight `source` as `lang`; an unknown language is escaped plain text. Returns inner HTML of <code>. */
export function highlightHtml(source, lang) {
  const id = (lang || "").toLowerCase();
  if (!id || id === "text" || !grammarFor(id)) return escapeHtml(source);
  const lines = highlightCode(source, id);
  // theme.js scopes the kernel's kinds do not separate on their own, recovered from the token stream:
  //   hole.dsx       the {{ }} of a hole (accent, bold)
  //   namespace.dsx  the `dsx` head (accent, bold); plane.dsx the word after it (variable, module, action, ...)
  //   selector.css / property.css inside a <style> sheet (accent / blue), where the kernel says attribute / property
  let css = id === "css";
  let prev = [];
  return lines.map((row) => row.spans.map(({ text, kind }) => {
    let k = kind;
    if (id === "dsx" && kind === "tag" && text === "style") css = prev[0]?.text === "<";
    if (id === "dsx" || id === "js" || id === "javascript" || id === "ts" || id === "typescript") {
      if (kind === "ident" && text === "dsx") k = "namespace";
      else if (kind === "property" && prev[0]?.text === "." && prev[1]?.text === "dsx") k = "plane";
    }
    if (id === "dsx" && (text === "{{" || text === "}}")) k = "hole";
    if (css && kind === "attribute") k = "selector";
    else if (css && kind === "property") k = "cssprop";
    if (kind !== "plain") prev = [{ text, kind }, ...prev].slice(0, 2);
    if (!k || k === "plain") return escapeHtml(text);
    return `<span class="t-${k}">${escapeHtml(text)}</span>`;
  }).join("")).join("\n");
}
