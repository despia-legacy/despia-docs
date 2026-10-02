//
//  worker/index.ts — the docs site's Cloudflare Worker: the SAME stack the documentation
//  documents (v0-live-plan W7 runs on W1+W2+W3 by construction). Three faces, one worker:
//    · the SITE — Workers Static Assets serve the built tree; dynamic routes fall through
//      to the platform-free page handler (SSR); createWorkersHandler chains them,
//    · the MCP face at /mcp — search, fetch-page and list-sections served as tools over
//      streamable HTTP, so any agent consumes these docs natively (this replaces the
//      external docs-MCP dependency with our own product),
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
import rootRedirects from "../redirects/docs-root.json";

interface AssetsBinding { fetch(request: Request): Promise<Response> }

//  The assets binding, captured per isolate at the first event: tool handlers run inside
//  the host (which is platform-free and passes only string env), so the one platform
//  object they need is held here at the boundary — the same posture every bootloader takes.
let assets: AssetsBinding | null = null;

const SPACES = ["modern", "legacy", "migrate", "troubleshooting", "app-review"] as const;
type Space = (typeof SPACES)[number];
function spaceArg(args: Record<string, unknown>): Space | "all" {
  const raw = typeof args["space"] === "string" ? args["space"].toLowerCase() : "all";
  return (SPACES as readonly string[]).includes(raw) ? raw as Space : "all";
}

function score(query: string, space: Space | "all"): { route: string; title: string; space: string; section: string; markdown: string }[] {
  const needle = query.toLowerCase();
  const pool = space === "all" ? searchIndex.pages : searchIndex.pages.filter((p) => p.space === space);
  const titleHits = pool.filter((p) => p.title.toLowerCase().includes(needle));
  const textHits = pool.filter(
    (p) => !p.title.toLowerCase().includes(needle) && p.text.toLowerCase().includes(needle),
  );
  return [...titleHits, ...textHits].slice(0, 8).map((p) => ({
    route: p.route, title: p.title, space: p.space, section: p.section,
    markdown: `https://docs.despia.com${p.route === "/" ? "/index" : p.route}.md`,
  }));
}

const handler = createWorkersHandler(
  {
    routes: [],
    handlers: {
      docs: {
        search: (args) => {
          const query = typeof args["query"] === "string" ? args["query"] : "";
          if (query.length < 2) return { hits: [] };
          return { hits: score(query, spaceArg(args)) };
        },
        listSections: (args) => {
          const space = spaceArg(args);
          return space === "all" ? nav : { space, ...nav.spaces.find((s) => s.id === space) };
        },
        fetchPage: async (args) => {
          let route = typeof args["route"] === "string" ? args["route"] : "/";
          // a space-relative route (space: legacy, route: /introduction) resolves inside the space
          const space = spaceArg(args);
          const prefix = space === "all" || space === "modern" ? "" : `/${space}`;
          if (prefix !== "" && route !== prefix && !route.startsWith(`${prefix}/`)) route = route === "/" ? prefix : `${prefix}${route}`;
          const mdPath = route === "/" ? "/md/index.md" : `/md${route}.md`;
          if (assets === null) throw new Error("assets binding not captured yet");
          const res = await assets.fetch(new Request(`https://assets.local${mdPath}`));
          if (res.status !== 200) {
            throw { reason: "not_found", message: `no page at ${route}` };
          }
          return { route, markdown: await res.text() };
        },
      },
    },
    buildInfo: { site: "despia-docs" },
  },
  undefined,
  {
    siteRegistry: registry as never,
    mcpTools: [
      { name: "search", chain: "docs", action: "search", description: "Search the Despia documentation. space: modern (v4, DSX), legacy (v3, despia-native), migrate (v3 to v4), troubleshooting, app-review (store guidelines), or all (default). Returns up to 8 pages with routes and markdown URLs.", inputs: ["query", "space"] },
      { name: "fetch-page", chain: "docs", action: "fetchPage", description: "Fetch one documentation page as raw markdown by its route, in any space (e.g. /framework/guides/routing, /legacy/native-features/haptic-feedback, /migrate/map).", inputs: ["route", "space"] },
      { name: "list-sections", chain: "docs", action: "listSections", description: "List the sections and pages of one documentation space (modern, legacy, migrate, troubleshooting, app-review) or of all of them (all, the default).", inputs: ["space"] },
    ],
  },
);

export default {
  fetch(request: Request, env: WorkersEnv, ctx: WorkersExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const moved = (rootRedirects as Record<string, string>)[url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname];
    if (moved !== undefined) return Promise.resolve(Response.redirect(`${url.origin}${moved}${url.search}`, 301));
    const binding = env["ASSETS"];
    if (assets === null && typeof binding === "object" && binding !== null) assets = binding as AssetsBinding;
    return handler.fetch(request, env, ctx);
  },
  scheduled: handler.scheduled,
};
