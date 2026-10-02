//
//  worker/index.ts — the docs site's Cloudflare Worker: the SAME stack the documentation
//  documents (v0-live-plan W7 runs on W1+W2+W3 by construction). Three faces, one worker:
//    · the SITE — Workers Static Assets serve the built tree; dynamic routes fall through
//      to the platform-free page handler (SSR); createWorkersHandler chains them,
//    · the MCP face at /mcp — free tools over streamable HTTP: docs_search, docs_fetch,
//      resolutions_search, troubleshooting_search, app_review_search, integrations_list,
//      integration_get, improvements_list, improvements_get (and the original search,
//      fetch-page, list-sections). The retrieval core is worker/search.ts (hybrid, cached,
//      lexical fast path); this file wires the platform: assets, edge cache, rate limit,
//    · the API host underneath, empty today and ready for the vector-search route.
//  One site, five spaces (modern, legacy, migrate, troubleshooting, app-review): every MCP tool takes a
//  `space` argument, and the old docs root keeps its v3 links: a v3 path asked of this host
//  (it used to bounce to setup.despia.com) 301s once to /legacy/... (redirects/docs-root.json,
//  generated; a path a modern page owns is never in it).
//
//  The search index and the nav model are BUILD ARTIFACTS imported into the bundle (the
//  worker deploys after `npm run build`, so wrangler inlines the exact tree it serves);
//  page markdown is read through the assets binding at call time — same bytes the /md/
//  routes serve, never a second copy.
//

import { createWorkersHandler, type WorkersEnv, type WorkersExecutionContext } from "@despia-native/server/bootloader-workers";

import registry from "../dist/registry.json";
import searchIndex from "../public/search-index.json";
import nav from "../public/nav.json";
import knowledge from "../public/knowledge/version.json";
import appReview from "../public/app-review.json";
import troubleshooting from "../public/troubleshooting.json";
import integrations from "../public/integrations.json";
import versions from "../public/versions.json";
import rootRedirects from "../redirects/docs-root.json";
import { createTools, SPACES, type Cache, type IndexPage, type VectorHit } from "./search.ts";

interface AssetsBinding { fetch(request: Request): Promise<Response> }

//  The assets binding, captured per isolate at the first event: tool handlers run inside
//  the host (which is platform-free and passes only string env), so the one platform
//  object they need is held here at the boundary — the same posture every bootloader takes.
let assets: AssetsBinding | null = null;
let supportOrigin = "https://support.despia.com";
let siteOrigin = "https://despia.com";

type Space = (typeof SPACES)[number];
function spaceArg(args: Record<string, unknown>): Space | "all" {
  const raw = typeof args["space"] === "string" ? args["space"].toLowerCase() : "all";
  return (SPACES as readonly string[]).includes(raw) ? raw as Space : "all";
}

//  The edge cache (Cloudflare's per-colo HTTP cache), keyed by tool + normalised arguments +
//  the content version, so a publish never serves a stale answer and nothing needs purging.
const edgeCache: Cache = {
  async get(key) {
    const c = (globalThis as unknown as { caches?: { default?: { match(r: Request): Promise<Response | undefined> } } }).caches?.default;
    if (c === undefined) return undefined;
    const hit = await c.match(new Request(`https://docs-mcp.cache/${encodeURIComponent(key)}`));
    return hit === undefined ? undefined : await hit.json();
  },
  async put(key, value) {
    const c = (globalThis as unknown as { caches?: { default?: { put(r: Request, res: Response): Promise<void> } } }).caches?.default;
    if (c === undefined) return;
    await c.put(new Request(`https://docs-mcp.cache/${encodeURIComponent(key)}`),
      new Response(JSON.stringify(value), { headers: { "content-type": "application/json", "cache-control": "public, max-age=86400" } }));
  },
};

async function supportSearch(q: string, space: string, limit: number, extra: Record<string, string> = {}): Promise<VectorHit[]> {
  const params = new URLSearchParams({ q, limit: String(limit), ...(space !== "all" ? { space } : {}), ...extra });
  const res = await fetch(`${supportOrigin}/v1/search?${params}`, { signal: AbortSignal.timeout(1500) });
  if (!res.ok) return [];
  const body = await res.json() as { hits?: VectorHit[] };
  return body.hits ?? [];
}
let improvementsMemo: { at: number; rows: Array<Record<string, unknown>> } | null = null;

const tools = createTools({
  site: "https://docs.despia.com",
  version: versions.latest,
  contentVersion: knowledge.contentVersion,
  pages: searchIndex.pages as IndexPage[],
  appReview: appReview as never,
  troubleshooting: troubleshooting as never,
  integrations: integrations as never,
  vector: (q, space, limit) => supportSearch(q, space, limit),
  resolutions: (q, filters, limit) => supportSearch(q, "resolutions", limit, filters),
  improvements: async () => {
    if (improvementsMemo !== null && Date.now() - improvementsMemo.at < 300_000) return improvementsMemo.rows;
    const res = await fetch(`${siteOrigin}/improvements.json`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error(String(res.status));
    const body = await res.json() as { entries?: Array<Record<string, unknown>> };
    improvementsMemo = { at: Date.now(), rows: body.entries ?? [] };
    return improvementsMemo.rows;
  },
  cache: edgeCache,
});

async function fetchPage(args: Record<string, unknown>) {
  let route = typeof args["route"] === "string" ? args["route"] : "/";
  // a space-relative route (space: legacy, route: /introduction) resolves inside the space
  const space = spaceArg(args);
  const prefix = space === "all" || space === "modern" ? "" : `/${space}`;
  if (prefix !== "" && route !== prefix && !route.startsWith(`${prefix}/`)) route = route === "/" ? prefix : `${prefix}${route}`;
  route = route.replace(/^https:\/\/docs\.despia\.com/, "").replace(/\.md$/, "") || "/";
  const mdPath = route === "/" ? "/md/index.md" : `/md${route}.md`;
  if (assets === null) throw new Error("assets binding not captured yet");
  const res = await assets.fetch(new Request(`https://assets.local${mdPath}`));
  if (res.status !== 200) throw { reason: "not_found", message: `no page at ${route}` };
  return { route, url: `https://docs.despia.com${route}`, version: versions.latest, markdown: await res.text() };
}

const FILTERS = "Filters: space (modern | legacy | migrate | troubleshooting | releases | app-review), package (a package path such as Core/Basics/Haptics or its command, haptic), version (docs version; latest by default), platform (v4 | legacy).";
const handler = createWorkersHandler(
  {
    routes: [],
    handlers: {
      docs: {
        docsSearch: (args) => tools.docs_search(args),
        docsFetch: (args) => fetchPage(args),
        resolutionsSearch: (args) => tools.resolutions_search(args),
        troubleshootingSearch: (args) => tools.troubleshooting_search(args),
        appReviewSearch: (args) => tools.app_review_search(args),
        integrationsList: (args) => tools.integrations_list(args),
        integrationGet: (args) => tools.integration_get(args),
        improvementsList: (args) => tools.improvements_list(args),
        improvementsGet: (args) => tools.improvements_get(args),
        search: (args) => tools.search(args),
        listSections: (args) => {
          const space = spaceArg(args);
          return space === "all" ? nav : { space, ...nav.spaces.find((s) => s.id === space) };
        },
        fetchPage: (args) => fetchPage(args),
      },
    },
    buildInfo: { site: "despia-docs" },
  },
  undefined,
  {
    siteRegistry: registry as never,
    mcpTools: [
      { name: "docs_search", chain: "docs", action: "docsSearch", description: `Search the Despia documentation, hybrid (keyword index + the Support knowledge base's vectors, fused). Exact identifiers (dsx.module.haptic.light, <repeat>, despia export ios, 4.2) take the keyword fast path. Use this BEFORE guessing a Despia API, attribute, CLI flag or package name. ${FILTERS} Returns ranked pages with url and markdown url.`, inputs: ["query", "space", "package", "version", "platform", "limit"] },
      { name: "docs_fetch", chain: "docs", action: "docsFetch", description: "Fetch one documentation page as markdown by its route or URL, in any space (e.g. /framework/guides/routing, /legacy/native-features/haptic-feedback, /migrate/map, /app-review/apple-4-2-minimum-functionality).", inputs: ["route", "space", "version"] },
      { name: "resolutions_search", chain: "docs", action: "resolutionsSearch", description: "Search anonymised, approved answers to real support questions (the Support knowledge base). Filters: package, version, platform (v4 | legacy).", inputs: ["query", "package", "version", "platform", "limit"] },
      { name: "troubleshooting_search", chain: "docs", action: "troubleshootingSearch", description: "Search the troubleshooting articles: symptom, cause and fix. Filters: package, platform (v4 | legacy).", inputs: ["query", "package", "platform", "limit"] },
      { name: "app_review_search", chain: "docs", action: "appReviewSearch", description: "Search the App Review knowledge base: one entry per Apple guideline or Google Play policy, what it means, why Despia apps hit it, how to fix it, a reviewer reply. Filters: store (apple | google), guideline (e.g. 4.2, 5.1.1), category (metadata, payments, privacy, minimum functionality, login, design), platform (v4 | legacy).", inputs: ["query", "store", "guideline", "category", "platform", "limit"] },
      { name: "integrations_list", chain: "docs", action: "integrationsList", description: "List Despia packages (integrations): name, command (dsx.module.<command>), package path, licence, platforms, version. Filters: query, platform (ios | android | web | macos), license (open | commercial | an SPDX-style id).", inputs: ["query", "platform", "license", "limit"] },
      { name: "integration_get", chain: "docs", action: "integrationGet", description: "One Despia package by command (haptic) or path (Core/Basics/Haptics): actions, licence, platforms, install line, the docs pages that use it and its v3 predecessors.", inputs: ["package"] },
      { name: "improvements_list", chain: "docs", action: "improvementsList", description: "List entries of the Improvements ledger (despia.com/improvements): how DSX and its packages got better, with evidence. Filters: package, kind (dx, api, performance, reliability, platform-parity, native-fidelity, docs, tooling, security, support), since (a date or version).", inputs: ["package", "kind", "since", "limit"] },
      { name: "improvements_get", chain: "docs", action: "improvementsGet", description: "One Improvements ledger entry by id.", inputs: ["id"] },
      // the first three tools, kept for agents already configured against them
      { name: "search", chain: "docs", action: "search", description: `Search the Despia documentation (same as docs_search). ${FILTERS}`, inputs: ["query", "space", "package", "version", "platform"] },
      { name: "fetch-page", chain: "docs", action: "fetchPage", description: "Fetch one documentation page as raw markdown by its route (same as docs_fetch).", inputs: ["route", "space"] },
      { name: "list-sections", chain: "docs", action: "listSections", description: "List the sections and pages of one documentation space (modern, legacy, migrate, troubleshooting, releases, app-review) or of all of them (all, the default).", inputs: ["space"] },
    ],
  },
);

//  Per-IP rate limit for /mcp, per isolate (a token bucket: 60 calls a minute, bursts of 20).
//  It keeps one noisy client from spending the vector budget; a zone-wide limit is the
//  Cloudflare rate limiting rule the owner attaches at deploy (STATUS, owner-gated).
const buckets = new Map<string, { tokens: number; at: number }>();
function allow(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip) ?? { tokens: 20, at: now };
  b.tokens = Math.min(20, b.tokens + ((now - b.at) / 60_000) * 60);
  b.at = now;
  if (buckets.size > 10_000) buckets.clear();
  if (b.tokens < 1) { buckets.set(ip, b); return false; }
  b.tokens -= 1;
  buckets.set(ip, b);
  return true;
}

export default {
  fetch(request: Request, env: WorkersEnv, ctx: WorkersExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const moved = (rootRedirects as Record<string, string>)[url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname];
    if (moved !== undefined) return Promise.resolve(Response.redirect(`${url.origin}${moved}${url.search}`, 301));
    if (url.pathname === "/mcp" && request.method === "POST" && !allow(request.headers.get("cf-connecting-ip") ?? "local")) {
      return Promise.resolve(new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32029, message: "rate limited: 60 calls a minute per client" } }),
        { status: 429, headers: { "content-type": "application/json", "retry-after": "10" } }));
    }
    if (typeof env["SUPPORT_ORIGIN"] === "string" && env["SUPPORT_ORIGIN"] !== "") supportOrigin = String(env["SUPPORT_ORIGIN"]).replace(/\/+$/, "");
    if (typeof env["SITE_ORIGIN"] === "string" && env["SITE_ORIGIN"] !== "") siteOrigin = String(env["SITE_ORIGIN"]).replace(/\/+$/, "");
    const binding = env["ASSETS"];
    if (assets === null && typeof binding === "object" && binding !== null) assets = binding as AssetsBinding;
    return handler.fetch(request, env, ctx);
  },
  scheduled: handler.scheduled,
};
