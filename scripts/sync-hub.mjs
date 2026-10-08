//
//  sync-hub.mjs - the Help hub's published articles as docs pages, and its docs announcements as the site banner (lane
//  SUPPORT-HUB; framework ClosedSource/Cloud/api/src/help, ClosedSource/Documentation/internal/lanes/SUPPORT-HUB.md).
//
//  ONE CONTENT MODEL. Despia Support keeps one set of articles (docs, troubleshooting, guides, changelog, blog) that staff
//  write and maintain in the Support Inbox's Help Center, that Support's AI cites and that the console's Help shows. This
//  script is how docs.despia.com reads them: every PUBLISHED, PUBLIC article becomes a markdown page with front matter in
//  the tree compile.mjs already turns into the site, at the address the hub links to:
//
//    troubleshooting  content/troubleshooting/<slug>.md   /troubleshooting/<slug>   (symptom = the summary)
//    guides           content/guides/<slug>.md            /guides/<slug>
//    docs             content/help/<slug>.md              /help/<slug>
//    changelog        content/releases/<slug>.md          /releases/<slug>          (date = published)
//    blog             not here: the blog lives on despia.com
//
//  A page this script writes says so in its front matter (`source: help-hub`). Only those pages are ever rewritten or
//  removed (an article unpublished in the hub leaves the site on the next sync); a hand written page is never touched,
//  and an article whose address a hand written page already holds is skipped with a warning.
//
//  The docs-channel announcements go to public/announcements.json, which DocShell reads like the search index.
//
//  OFFLINE IS NOT A DELETION. A hub that does not answer (not deployed yet, a network error, a 5xx) changes nothing and
//  exits 0; only a successful read of every space rewrites the tree. Idempotent: no timestamps, sorted output, so a second
//  run leaves `git status` clean.
//
//  Usage: node scripts/sync-hub.mjs [--from <snapshot.json>] [--check]
//  Env:   HELP_API  the API origin (default https://api.despia.com)
//
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SPACE_DIRS = { troubleshooting: "troubleshooting", guides: "guides", docs: "help", changelog: "releases" };
const MARK = "help-hub";

/** Front matter in the site's own flat dialect (compile.mjs frontMatter): one `key: value` per line, split at the first
 *  colon, never quoted, so a value is only ever flattened onto one line. */
function frontMatter(fields) {
  const line = ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v).replace(/\s+/g, " ").trim()}`;
  return `---\n${Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)).map(line).join("\n")}\n---\n`;
}

/** One article as the page the site compiles. */
export function pageOf(a) {
  const date = (a.publishedAt ?? a.updatedAt ?? "").slice(0, 10);
  const common = { title: a.title, description: a.summary, source: MARK, hub: a.id };
  const meta = a.space === "troubleshooting"
    ? { ...common, symptom: a.summary, platform: "v4", packages: (a.tags ?? []).join(", "), codes: a.codes ?? [], order: 50 }
    : a.space === "changelog"
      ? { ...common, summary: a.summary, date, package: (a.tags ?? [])[0] ?? "dsx" }
      : { ...common, codes: a.codes ?? [] };
  const body = String(a.body ?? "").trim();
  return `${frontMatter(meta)}\n# ${a.title}\n\n${body}\n`;
}

function managed(file) {
  try { return /^---\n[\s\S]*?\nsource: help-hub\n[\s\S]*?---\n/.test(readFileSync(file, "utf8")); } catch { return false; }
}

/** The hub's published articles with bodies, and the docs announcements, or null when the hub did not answer. */
async function readHub(api, fetchImpl = fetch) {
  const get = async (path) => {
    const res = await fetchImpl(`${api}${path}`, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`${path} answered ${res.status}`);
    return await res.json();
  };
  try {
    const articles = [];
    for (const space of Object.keys(SPACE_DIRS)) {
      const list = (await get(`/v1/help/articles?space=${space}&limit=200`)).items ?? [];
      for (const s of list) articles.push((await get(`/v1/help/articles/${encodeURIComponent(s.space)}/${encodeURIComponent(s.slug)}`)).article);
    }
    const announcements = (await get("/v1/help/announcements?channel=docs")).items ?? [];
    return { articles, announcements };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

/** Write the tree for one hub snapshot. Answers what changed. */
export function writeTree(root, snap, { check = false } = {}) {
  const written = []; const removed = []; const skipped = [];
  const wanted = new Map();
  for (const a of [...snap.articles].sort((x, y) => `${x.space}/${x.slug}`.localeCompare(`${y.space}/${y.slug}`))) {
    const dir = SPACE_DIRS[a.space];
    if (dir === undefined || a.status !== "published" || a.audience !== "public" || !/^[a-z0-9][a-z0-9-]{0,95}$/.test(a.slug)) continue;
    wanted.set(join(root, "content", dir, `${a.slug}.md`), pageOf(a));
  }
  for (const [file, text] of wanted) {
    if (existsSync(file) && !managed(file)) { skipped.push(file); continue; }
    if (existsSync(file) && readFileSync(file, "utf8") === text) continue;
    written.push(file);
    if (!check) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); }
  }
  for (const dir of new Set(Object.values(SPACE_DIRS))) {
    const abs = join(root, "content", dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs).sort()) {
      const file = join(abs, name);
      if (name.endsWith(".md") && !wanted.has(file) && managed(file)) { removed.push(file); if (!check) rmSync(file); }
    }
  }
  const news = `${JSON.stringify({ items: snap.announcements.map((n) => ({ id: n.id, title: n.title, body: n.body, kind: n.kind, link: n.link ?? null })) }, null, 1)}\n`;
  const newsFile = join(root, "public", "announcements.json");
  if (!existsSync(newsFile) || readFileSync(newsFile, "utf8") !== news) { written.push(newsFile); if (!check) { mkdirSync(dirname(newsFile), { recursive: true }); writeFileSync(newsFile, news); } }
  return { written, removed, skipped };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const args = process.argv.slice(2);
  const from = args.includes("--from") ? args[args.indexOf("--from") + 1] : null;
  const check = args.includes("--check");
  const api = (process.env.HELP_API ?? "https://api.despia.com").replace(/\/+$/, "");
  const snap = from ? JSON.parse(readFileSync(from, "utf8")) : await readHub(api);
  if (snap.error) { console.log(`sync-hub: the hub at ${api} did not answer (${snap.error}); nothing changed`); process.exit(0); }
  const r = writeTree(root, snap, { check });
  for (const f of r.skipped) console.warn(`sync-hub: ${f.slice(root.length + 1)} is hand written; the hub article with that address was skipped`);
  console.log(`sync-hub: ${snap.articles.length} published articles, ${r.written.length} written, ${r.removed.length} removed${check ? " (check)" : ""}`);
  if (check && (r.written.length > 0 || r.removed.length > 0)) process.exit(1);
}

export { readHub };
