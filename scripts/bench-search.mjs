#!/usr/bin/env node
//
//  bench-search.mjs - throughput and cost inputs of the docs MCP search core (worker/search.ts),
//  measured on this machine over the real build artifacts. Three runs of 1,000 queries:
//    1. cold, lexical only (every query computed, no vector service);
//    2. cold, hybrid (a stub vector service answering in ~0 ms, so this measures our own CPU);
//    3. warm (every query a cache hit, the steady state at volume).
//  Also counts how many queries take the identifier fast path (no embedding, no vector call).
//  Usage: node --experimental-strip-types scripts/bench-search.mjs
//
import { readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { createTools, isIdentifier } = await import(join(root, "worker", "search.ts"));
const read = (p) => JSON.parse(readFileSync(join(root, "public", p), "utf8"));
const index = read("search-index.json");

const base = ["push notification permission", "dsx.module.haptic.light", "<repeat> key", "despia export ios", "4.2",
  "revenuecat paywall", "sign in with apple", "offline storage", "deep links", "camera roll", "oauth callback",
  "app tracking transparency", "local server", "white screen", "service worker ota", "theme dark mode", "routing",
  "how do I migrate from v3", "minimum functionality", "in app purchase restore", "dsx.variable", "despia add",
  "biometrics face id", "background location", "file picker", "share sheet", "widgets live activities", "accordion open",
  "segmented control", "safe area insets"];
const queries = Array.from({ length: 1000 }, (_, i) => `${base[i % base.length]}${i >= base.length ? ` ${["", "docs", "v4", "legacy", "example"][i % 5]}` : ""}`.trim());

function makeTools(vector, cache) {
  return createTools({
    site: "https://docs.despia.com", version: "0.1.0", contentVersion: "bench",
    pages: index.pages, appReview: read("app-review.json"), troubleshooting: read("troubleshooting.json"),
    integrations: read("integrations.json"), vector, resolutions: null, improvements: null, cache,
  });
}
const mapCache = () => { const m = new Map(); return { get: async (k) => m.get(k), put: async (k, v) => { m.set(k, v); } }; };
const noCache = { get: async () => undefined, put: async () => {} };
let vectorCalls = 0;
const stubVector = async (q) => { vectorCalls += 1; return index.pages.slice(0, 6).map((p) => ({ url: `https://docs.despia.com${p.route}`, title: p.title })); };

async function run(label, tools, qs) {
  const t0 = process.hrtime.bigint();
  for (const q of qs) await tools.docs_search({ query: q, space: "all" });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(`${label.padEnd(34)} ${qs.length} queries in ${ms.toFixed(0)} ms: ${(ms / qs.length).toFixed(2)} ms/query, ${Math.round(qs.length / (ms / 1000))} queries/s`);
  return ms / qs.length;
}

console.log(`[bench] ${index.pages.length} pages in the index; node ${process.version}`);
const lex = await run("cold, lexical only", makeTools(null, noCache), queries);
vectorCalls = 0;
const hyb = await run("cold, hybrid (stub vector)", makeTools(stubVector, noCache), queries);
const hybVector = vectorCalls;
const cached = makeTools(stubVector, mapCache());
for (const q of queries) await cached.docs_search({ query: q, space: "all" });
const warm = await run("warm (cache hits)", cached, queries);
const ids = queries.filter((q) => isIdentifier(q)).length;
console.log(`[bench] identifier fast path: ${ids}/1000 queries skip the vector call; vector calls on the cold hybrid run: ${hybVector}/1000`);
console.log(JSON.stringify({ msPerQuery: { lexical: +lex.toFixed(3), hybridCpu: +hyb.toFixed(3), warm: +warm.toFixed(3) }, fastPath: ids, vectorCallsPer1000Cold: hybVector }));
