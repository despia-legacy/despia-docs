#!/usr/bin/env node
//
//  setup-parity.mjs - every setup.despia.com URL in the live inventory resolves in ONE hop to
//  a built page that answers 200. For each row of redirects/inventory/setup.despia.com.tsv:
//    1. the generated redirect Worker (redirects/setup-worker/index.js) answers 301 with a
//       Location on https://docs.despia.com/legacy/<same path, same case>;
//    2. the Bulk Redirects CSV carries the same row (the two forms never disagree);
//    3. the target is a page in dist/ (the tree Workers Static Assets serves with
//       html_handling drop-trailing-slash: /x answers /x/index.html with a 200, no redirect)
//       and no rule on docs.despia.com moves it again (docs-root.json never names /legacy/...);
//    4. the page carries its canonical tag at that same URL, and its .md sibling exists.
//  Plus the extras: /, the .md siblings, /llms.txt, /llms-full.txt, /sitemap.xml.
//  `--live <origin>` repeats step 3 over HTTP against a running worker (wrangler dev).
//  Exit code 1 unless every row passes. Prints N/N.
//

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = "https://docs.despia.com";
const dist = join(root, "dist");
const liveAt = process.argv.indexOf("--live");
const live = liveAt === -1 ? null : process.argv[liveAt + 1].replace(/\/+$/, "");

const rows = readFileSync(join(root, "redirects", "inventory", "setup.despia.com.tsv"), "utf8").split("\n").slice(1)
  .map((l) => l.split("\t")).filter((c) => c[0] === "setup.despia.com").map((c) => c[1]);
const { target } = await import(pathToFileURL(join(root, "redirects", "setup-worker", "index.js")).href);
const worker = (await import(pathToFileURL(join(root, "redirects", "setup-worker", "index.js")).href)).default;
const csv = new Map(readFileSync(join(root, "redirects", "setup.despia.com.csv"), "utf8").split("\n").slice(1)
  .filter(Boolean).map((l) => l.split(",")).map((c) => [c[0], c[1]]));
const rootTable = JSON.parse(readFileSync(join(root, "redirects", "docs-root.json"), "utf8"));
if (!existsSync(dist)) { console.error("[parity] no dist/ - run `npm run build` first"); process.exit(1); }

/** what Workers Static Assets (drop-trailing-slash) answers for a docs.despia.com path */
function served(path) {
  if (Object.prototype.hasOwnProperty.call(rootTable, path)) return { status: 301 };
  const rel = path.replace(/^\/+/, "");
  const file = [join(dist, rel), join(dist, rel, "index.html"), join(dist, `${rel}.html`)]
    .find((f) => existsSync(f) && !f.endsWith("/") && (f.endsWith(".html") || !existsSync(join(f, "index.html"))));
  return file === undefined ? { status: 404 } : { status: 200, file };
}

async function check(path, wantPage) {
  const res = await worker.fetch(new Request(`https://setup.despia.com${path}`));
  const location = res.headers.get("location") ?? "";
  if (res.status !== 301) return `worker answered ${res.status}`;
  if (target(`https://setup.despia.com${path}`) !== location) return `worker and target() disagree`;
  if (csv.get(`setup.despia.com${path}`) !== location) return `CSV row missing or different (${csv.get(`setup.despia.com${path}`)})`;
  if (!location.startsWith(DOCS + "/")) return `Location ${location} leaves docs.despia.com`;
  const to = location.slice(DOCS.length);
  const hop = served(to);
  if (hop.status !== 200) return `${to} answers ${hop.status} (a second hop or a miss)`;
  if (wantPage) {
    const html = readFileSync(hop.file, "utf8");
    if (!html.includes(`<link rel="canonical" href="${location}">`)) return `${to} lacks canonical ${location}`;
    if (!existsSync(join(dist, `${to.slice(1)}.md`))) return `${to}.md sibling missing`;
  }
  if (live !== null) {
    const r = await fetch(live + to, { redirect: "manual" });
    if (r.status !== 200) return `live ${live}${to} answered ${r.status}`;
  }
  return null;
}

const failures = [];
let pass = 0;
for (const path of rows) {
  const problem = await check(path, true);
  if (problem === null) pass += 1;
  else failures.push(`${path}: ${problem}`);
}
const extras = ["/", ...rows.slice(0, 5).map((p) => `${p}.md`), "/llms.txt", "/llms-full.txt", "/sitemap.xml"];
let extraPass = 0;
for (const path of extras) {
  const problem = await check(path, path === "/");
  if (problem === null) extraPass += 1;
  else failures.push(`${path} (extra): ${problem}`);
}
// every .md sibling of the 189 (not just the sample) resolves too
let mdPass = 0;
for (const path of rows) {
  const problem = await check(`${path}.md`, false);
  if (problem === null) mdPass += 1;
  else failures.push(`${path}.md: ${problem}`);
}

console.log(`[parity] setup.despia.com pages: ${pass}/${rows.length} resolve in one 301 to a 200 page with its canonical${live ? ` (live: ${live})` : ""}`);
console.log(`[parity] .md siblings: ${mdPass}/${rows.length}; extras (/, llms.txt, llms-full.txt, sitemap.xml, .md sample): ${extraPass}/${extras.length}`);
if (failures.length > 0) {
  console.error(`[parity] ${failures.length} failure(s):\n  ${failures.slice(0, 40).join("\n  ")}`);
  process.exit(1);
}
