//
//  worker/index.ts — the docs site's Cloudflare Worker: the SAME stack the documentation
//  documents (v0-live-plan W7 runs on W1+W2+W3 by construction). Three faces, one worker:
//    · the SITE — Workers Static Assets serve the built tree; dynamic routes fall through
//      to the platform-free page handler (SSR); createWorkersHandler chains them,
//    · the MCP face at /mcp — search, fetch-page and list-sections served as tools over
//      streamable HTTP, so any agent consumes these docs natively (this replaces the
//      external docs-MCP dependency with our own product),
//    · the API host underneath, empty today and ready for the vector-search route.
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

interface AssetsBinding { fetch(request: Request): Promise<Response> }

//  The assets binding, captured per isolate at the first event: tool handlers run inside
//  the host (which is platform-free and passes only string env), so the one platform
//  object they need is held here at the boundary — the same posture every bootloader takes.
let assets: AssetsBinding | null = null;

function score(query: string): { route: string; title: string; section: string }[] {
  const needle = query.toLowerCase();
  const titleHits = searchIndex.pages.filter((p) => p.title.toLowerCase().includes(needle));
  const textHits = searchIndex.pages.filter(
    (p) => !p.title.toLowerCase().includes(needle) && p.text.toLowerCase().includes(needle),
  );
  return [...titleHits, ...textHits].slice(0, 8).map((p) => ({ route: p.route, title: p.title, section: p.section }));
}

const handler = createWorkersHandler(
  {
    routes: [],
    handlers: {
      docs: {
        search: (args) => {
          const query = typeof args["query"] === "string" ? args["query"] : "";
          if (query.length < 2) return { hits: [] };
          return { hits: score(query) };
        },
        listSections: () => nav,
        fetchPage: async (args) => {
          const route = typeof args["route"] === "string" ? args["route"] : "/";
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
      { name: "search", chain: "docs", action: "search", description: "Search the Despia documentation. Returns up to 8 pages with routes.", inputs: ["query"] },
      { name: "fetch-page", chain: "docs", action: "fetchPage", description: "Fetch one documentation page as raw markdown by its route (e.g. /guides/combinations).", inputs: ["route"] },
      { name: "list-sections", chain: "docs", action: "listSections", description: "List the documentation's sections and pages with their routes." },
    ],
  },
);

export default {
  fetch(request: Request, env: WorkersEnv, ctx: WorkersExecutionContext): Promise<Response> {
    const binding = env["ASSETS"];
    if (assets === null && typeof binding === "object" && binding !== null) assets = binding as AssetsBinding;
    return handler.fetch(request, env, ctx);
  },
  scheduled: handler.scheduled,
};
