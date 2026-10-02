//
//  worker/tools.ts — the docs MCP tool definitions, one source for the worker (/mcp) and for
//  the CLI's proxy (`despia mcp`): scripts/mcp-tools.mjs writes public/mcp-tools.json from this
//  list in the same shape as the CLI's docs-mcp-tools.json (name, description, inputSchema).
//

type Input = { type: "string" | "number"; description: string; enum?: string[] };
export interface DocsTool { name: string; action: string; description: string; inputs: Record<string, Input>; required?: string[] }

const space: Input = { type: "string", enum: ["modern", "legacy", "migrate", "troubleshooting", "releases", "app-review", "all"], description: "Restrict to one documentation space. Omit (or all) to search every space." };
const pkg: Input = { type: "string", description: "A Despia package path (Core/Basics/Haptics) or its command (haptic): only pages that use it." };
const version: Input = { type: "string", description: "Docs version (latest by default). An unpublished version answers latest with a note." };
const platform: Input = { type: "string", enum: ["v4", "legacy"], description: "Which Despia the user is on. v4 = DSX; legacy = Despia v3 (despia-native)." };
const limit: Input = { type: "number", description: "Most results to return." };
const query: Input = { type: "string", description: "Plain words or an exact identifier (dsx.module.haptic.light, <repeat>, despia export ios, 4.2)." };

export const DOCS_TOOLS: DocsTool[] = [
  { name: "docs_search", action: "docsSearch", required: ["query"], description: "Search the Despia documentation, hybrid (keyword index fused with the Support knowledge base's vectors). Exact identifiers take the keyword fast path. Use this BEFORE guessing a Despia API, attribute, CLI flag or package name. Returns ranked pages with url and markdown url.", inputs: { query, space, package: pkg, version, platform, limit } },
  { name: "docs_fetch", action: "docsFetch", required: ["route"], description: "Fetch one documentation page as markdown by its route or URL, in any space (e.g. /framework/guides/routing, /legacy/native-features/haptic-feedback, /migrate/map, /app-review/apple-4-2-minimum-functionality).", inputs: { route: { type: "string", description: "The page route or its docs.despia.com URL." }, space, version } },
  { name: "resolutions_search", action: "resolutionsSearch", required: ["query"], description: "Search anonymised, approved answers to real support questions (the Support knowledge base).", inputs: { query, package: pkg, version, platform, limit } },
  { name: "troubleshooting_search", action: "troubleshootingSearch", required: [], description: "Search the troubleshooting articles: symptom, cause and fix.", inputs: { query, package: pkg, platform, limit } },
  { name: "app_review_search", action: "appReviewSearch", required: [], description: "Search the App Review knowledge base: one entry per Apple guideline or Google Play policy; what it means, why Despia apps hit it, how to fix it, a reviewer reply.", inputs: { query, store: { type: "string", enum: ["apple", "google"], description: "The store." }, guideline: { type: "string", description: "A guideline number prefix, e.g. 4.2 or 5.1.1." }, category: { type: "string", enum: ["metadata", "payments", "privacy", "minimum functionality", "login", "design"], description: "The category." }, platform, limit } },
  { name: "integrations_list", action: "integrationsList", required: [], description: "List Despia packages: name, command (dsx.module.<command>), package path, licence, platforms, version.", inputs: { query, platform: { type: "string", enum: ["ios", "android", "web", "macos"], description: "Only packages implemented on this platform." }, license: { type: "string", description: "open, commercial, or a licence id." }, limit } },
  { name: "integration_get", action: "integrationGet", required: ["package"], description: "One Despia package by command (haptic) or path (Core/Basics/Haptics): actions, licence, platforms, install line, the docs pages that use it and its v3 predecessors.", inputs: { package: pkg } },
  { name: "improvements_list", action: "improvementsList", required: [], description: "List entries of the Improvements ledger (despia.com/improvements): how DSX and its packages got better, with evidence.", inputs: { package: pkg, kind: { type: "string", enum: ["dx", "api", "performance", "reliability", "platform-parity", "native-fidelity", "docs", "tooling", "security", "support"], description: "The kind of improvement." }, since: { type: "string", description: "A date (YYYY-MM-DD) or version." }, limit } },
  { name: "improvements_get", action: "improvementsGet", required: ["id"], description: "One Improvements ledger entry by id.", inputs: { id: { type: "string", description: "The entry id." } } },
  { name: "search", action: "search", required: ["query"], description: "Search the Despia documentation (same as docs_search; kept for agents configured against the first tool set).", inputs: { query, space, package: pkg, version, platform } },
  { name: "fetch-page", action: "fetchPage", required: ["route"], description: "Fetch one documentation page as raw markdown by its route (same as docs_fetch).", inputs: { route: { type: "string", description: "The page route." }, space } },
  { name: "list-sections", action: "listSections", required: [], description: "List the sections and pages of one documentation space, or of all of them.", inputs: { space } },
];
