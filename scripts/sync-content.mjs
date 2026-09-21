#!/usr/bin/env node
//
//  sync-content.mjs — pull the framework's own documentation from the front door
//  (despia-native/despia) into content/framework/, so one pipeline serves external
//  developers and our own pages (v0-live-plan W7.2).
//
//  The source is a LOCAL CHECKOUT of the front door: ../despia by default,
//  DESPIA_FRONT_DOOR to point elsewhere (CI clones it first — see the workflow). The sync
//  is a copy, not a transform: the compiler reads markdown wherever it comes from, and
//  front matter is optional (title falls back to the first heading, section to the path).
//

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const door = resolve(process.env.DESPIA_FRONT_DOOR ?? join(root, "..", "despia"));

if (!existsSync(join(door, "Documentation"))) {
  console.error(`[docs.sync] no front-door checkout at ${door} — clone despia-native/despia there or set DESPIA_FRONT_DOOR`);
  process.exit(1);
}

const target = join(root, "content", "framework");
rmSync(target, { recursive: true, force: true });

// Curated on purpose: guides and skills are page-sized and audience-facing; the
// architecture corpus stays on GitHub where its own cross-links live. Growing this list
// is editing one array.
const sync = [
  { from: "Documentation/guides", to: "guides" },
  { from: "Skills", to: "skills" },
];

let copied = 0;
for (const entry of sync) {
  const source = join(door, entry.from);
  if (!existsSync(source)) continue;
  for (const name of readdirSync(source, { recursive: true })) {
    const rel = String(name);
    if (!rel.endsWith(".md")) continue;
    const dest = join(target, entry.to, rel);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(source, rel), dest);
    copied += 1;
  }
}
console.log(`[docs.sync] ${copied} page(s) from ${door} → content/framework/`);
