#!/usr/bin/env node
//
//  assemble.mjs — the deployable site directory: `dsx build`'s output plus the compile
//  step's public artifacts (nav, search index, md siblings, llms.txt), one tree the
//  Workers assets upload (or any static host) serves whole.
//

import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const pub = join(root, "public");

if (!existsSync(dist)) {
  console.error("[docs.assemble] no dist/ — run `dsx build` first");
  process.exit(1);
}
for (const name of readdirSync(pub)) {
  cpSync(join(pub, name), join(dist, name), { recursive: true });
}

// The docs enhancement layer (public/docs.js: anchor ids, scroll-spy, search keys,
// aria-current) rides every exported page as a deferred script. Injected here, at the
// deployable-tree seam, so the SSR pipeline stays generic.
let enhanced = 0;
const injectDocsScript = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) { injectDocsScript(abs); continue; }
    if (entry.name !== "index.html") continue;
    const html = readFileSync(abs, "utf8");
    if (html.includes("/docs.js") || !html.includes("</body>")) continue;
    writeFileSync(abs, html.replace("</body>", `<script defer src="/docs.js"></script>\n</body>`));
    enhanced += 1;
  }
};
injectDocsScript(dist);
console.log(`[docs.assemble] public/ artifacts folded into dist/ — one servable tree (${enhanced} page(s) carry docs.js)`);
