# Lane DOCS: STATUS (web launch, 2026-10-02)

Tree: `~/despia_dsx/wt-docs-web` (despia-docs, branch `web-launch`). Nothing deployed, nothing pushed.

## Done (commits)

| Commit | What |
|---|---|
| 262a718 | Builds on the current toolchain: `dsx.json` `command` (was `scheme`), markdown travels as fully escaped JSE literals (`<`, `>`, `&`, braces, `dsx.` as `\u` escapes) so example code is never scanned as markup. Took the tree from 74 build errors to 0. |
| ba3131c | One site, spaces Modern `/`, Legacy `/legacy`, Migration `/migrate`, Troubleshooting `/troubleshooting`. Legacy port, migration map, troubleshooting index, DocShell switcher + scoped search + vector merge + Ask AI + page actions + legacy banner, per-space sidebars, md siblings, llms pairs, sitemap with lastmod, canonical table, MCP `space`, setup.despia.com redirects, parity checker. |
| f3a3ffe | App Review space (`/app-review`): 13 guideline entries + filterable, fuzzy-searchable database index; `html_handling: drop-trailing-slash`. |
| 70713c6 | Rule 10: new chrome on stock components (`button`, `chip`, `popover`, list `row`, stock `Card`, `Callout`, `Banner`); local `Card.dsx` / `Callout.dsx` deleted (compiler lowers Note/Tip/Info/Warning/Danger and `<Callout kind>` to stock `<Callout tone>`). Releases space, help bar (PLAN-K K1), version badges + "Improved in" markers, integrations snapshot, knowledge chunks. |
| e36b5c4 | MCP tools (PLAN-I I2 + PLAN-J): `docs_search`, `docs_fetch`, `resolutions_search`, `troubleshooting_search`, `app_review_search`, `integrations_list`, `integration_get`, `improvements_list`, `improvements_get` (+ the original three); hybrid core with an inverted index, edge cache, per-IP rate limit; bench. |

Later commits on this branch: see `git log`; the proof numbers below are from the final build.

## Pipeline

`npm run compile` = `port-legacy.mjs` (Mintlify snapshot `legacy/mintlify/` at despia-native/docs
origin/main baa4c05 -> `content/legacy/**.md`, leak-checked) -> `migrate-map.mjs` (`migrate/map.json`
-> `/migrate/map` + `/migrate-map.json`) -> `compile.mjs` (all spaces) -> `mcp-tools.mjs`.
Then `dsx build` + `assemble.mjs` (canonical + markdown alternate stamped per page, docs.js).
`npm run redirects` writes `redirects/` (CSV, Worker, `docs-root.json`); `npm run parity` checks.
`npm run integrations` refreshes `data/integrations.json` from the framework tree (DESPIA_FRAMEWORK).
Build used the wt-fleet2 toolchain by symlink (`node_modules/@despia-native/* -> wt-fleet2 packages`,
gitignored), per LANE-RULES 4. `DOCS_SUPPORT_ORIGIN`, `DOCS_VERSION`, `DOCS_IMPROVEMENTS` are the build knobs.

## Legacy port

- 189 pages = every setup.despia.com sitemap URL (186 in docs.json nav + 3 live-but-unlisted:
  `/authentication/payments/test`, `/extensions/introduction`, `/refernce`), exact paths under
  `/legacy`, case preserved (`/legacy/local-intelligence/Introduction`). The checkout's `components`
  branch (87 DSX component pages) is v4 material already in Modern and is not legacy.
- Mapped: Card, CardGroup/Columns, Steps/Step, Tabs/Tab, CodeGroup (bare `bash npm` titles),
  Note/Tip/Info/Warning/Danger/Check, Accordion/AccordionGroup/Expandable, Frame, ParamField,
  ResponseField, Update, iframe (YouTube, 57) -> Video (stock WebView), img, br/u/b/i/code, MDX
  comments and ESM. The port fails on any tag left outside code: 0 leaks.
- Internal links rewritten under /legacy; 39 dead v3 links resolved by unambiguous case/hyphen/
  directory match; 16 links that were 404 on v3 itself are left and listed in
  `content/legacy/_dead-links.txt` (generated).
- Banner "Legacy docs (Despia v3)" on every page (stock Banner) + link to the modern equivalent
  when the map knows one, else the migration map. Route titles carry "(Despia v3)".

## Migration map

189 rows: 115 mapped, 26 partial, 48 not applicable, 0 unknown (MCP Server mapped to this site's
`/mcp`). Every v4 name verified in the framework tree (`Core/Legacy/legacy-map.json`, module
`dsx.json` command/actions, OpenSource guides); evidence paths in `migrate/map.json`. Finding: v3
schemes with a v4 package but no Legacy translation row (old code silently dropped until rewritten):
`websocket://`, `bluetooth://`, `ageassurance://`, `terra://`, `posthog://`, `localcdn://`,
`sandbox://`, `fileviewer://`, `preventdefault://`, `audio://` (framework rows for the Legacy owner).

## Redirects and parity

`redirects/setup.despia.com.csv` (Cloudflare Bulk Redirects, 382 exact rows: 189 pages + 189 `.md` +
`/`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`) and `redirects/setup-worker/` (same table + a
path-preserving catch-all; a list cannot hold the catch-all beside the root row). docs.despia.com
old-root behaviour: `redirects/docs-root.json` (v3 path on the new root -> /legacy, never a path a
modern page owns) wired in `worker/index.ts`. Parity: see Proof.

## Search, agents, MCP

- Client search: keyword index instantly, scoped to the space or "All spaces"; vector hits from
  `GET {support}/v1/search?q=&space=` merge in under "Related" after a 300 ms debounce; offline or
  refused = keyword only, silently.
- Agent-first: `<route>.md` sibling for every page (also `/md/...`), `/llms.txt` root index (+ modern),
  `/<space>/llms.txt` + `llms-full.txt` per space, `/modules/<command>/llms.txt` per package (212),
  `/migrate-map.json`, `/app-review.json`, `/troubleshooting.json`, `/integrations.json`,
  `/knowledge/chunks.json` (5,161 heading-aware chunks + contentVersion for publish-time embedding),
  `/mcp-tools.json` (tool definitions for the CLI proxy).
- Help bar on every page (stock buttons): Copy for AI, Open in Claude, Ask AI, Ask a human, More
  (View as Markdown, ChatGPT, Connect to Cursor = MCP install deeplink, Propose an edit, Request a
  feature). The widget intents load `{support}/widget.js` on first tap and mount
  `<despia-support mode="docs" intent space page markdown origin>`; inert when unreachable.

### Cost and throughput (PLAN-I I2), measured with `npm run bench`

Measured on this Mac while the fleet ran (load average about 41), 448 pages, 1,000 queries:
- lexical (keyword) path: 1.93 ms/query (518 queries/s on one core);
- hybrid, our own CPU with an instant stub vector service: 3.27 ms/query;
- warm (edge-cache hit): ~0.002 ms/query of compute;
- 69 of 1,000 queries are exact identifiers and skip the vector call entirely.
Cost per 1,000 queries (no cache hits, worst case): 1,000 Worker requests + ~3.3 CPU-seconds +
931 Support `/v1/search` calls, each at most one bge-m3 query embedding of a few tokens (documents
are embedded at publish from `knowledge/chunks.json`, never per query). At Cloudflare list prices
(to verify at deploy: Workers $0.30 per million requests and $0.02 per million CPU-ms; Workers AI
bge-m3 about $0.012 per million input tokens) that is about $0.0004 + $0.00007 + under $0.0001 of
embedding, so well under one tenth of a cent per 1,000 cold queries before caching. Every repeated
query is an edge-cache hit keyed by query + filters + contentVersion.

## Framework gaps (written down, not bypassed)

1. No per-route head rows (canonical, alternate): `assemble.mjs` stamps `<link rel=canonical>` and
   the markdown alternate into the built HTML.
2. The build's sitemap has no `<lastmod>`: the compiler writes `sitemap.xml` (front matter / live v3
   date / git date) and it replaces the build's.
3. Stock components missing on web for docs needs: no web `MarkdownSteps`/`MarkdownTabs`/`Figure`/
   `FieldRow`/`LinkCard` (ios/android only), so `Steps/Step`, `Frame`, `ParamField`, `ResponseField`,
   `Update`, `CardGroup`, `AccordionGroup` stay local DocShell compositions; stock `Card` has no icon
   (Mintlify Card icons are dropped).
4. The pre-existing DocShell chrome (sidebar rows, search panel, pager, rail) is still pressable +
   text compositions with token-only CSS, not stock list/NavigationSplitView-class components; rule 10
   wants it recomposed from defaults (a follow-up larger than this lane; no literal colours anywhere).
5. Copy as Markdown uses docs.js (clipboard) because the docs project does not carry `Core/Clipboard`;
   the widget loader is in docs.js too (no DSX element loads a third-party script lazily).
6. SSR under heavy machine load logs `jse_budget_exhausted` (2,000 ms wall clock) on a few pages;
   the formulas involved are cheap and the pages render on the client. Worth a budget that is CPU
   rather than wall-clock time at build.
7. The build guard flags PEM/Apple-key placeholders inside docs code examples (`MIGT...`) in
   registry.json; they are documentation placeholders, not keys.

## Contract proposals (SUPPORT-CORE owns CONTRACT.md)

- `Article.space` gains `troubleshooting`, `releases`, `app-review`, `resolutions`; `/v1/search`
  accepts `space=resolutions` (used by `resolutions_search`) and `package`, `version`, `platform`.
- Widget (`<despia-support>`): attributes `mode="docs"`, `intent` (ask-ai, ask-human, propose-edit,
  request-feature), `space`, `page`, `markdown`, `origin`, and an `open()` method.

## STOPPED 2026-10-02 ~19:30 (owner usage limit): state and how to resume

- Last commit is WIP (see `git log`): CSP stamping (`assemble.mjs` per-page meta CSP with inline-script
  sha256s; `worker/index.ts` security headers), the search-panel loading spinner (added with
  `despia insert` / `despia set`, one hand fix), `dsx.shots.json`, CLI-ERGONOMICS.md. Lint was green
  (469 files, 0 errors, 0 warnings) before these last edits; NOT re-run after them.
- NOT done: a complete build of the final tree. Two full builds were started; the first (pre App
  Review) finished, the next were killed by time limits on a Mac at load 40 to 56 (dsx build of 448
  routes takes 20 to 60 min here). So: no parity run on the final tree, no screenshots yet
  (`evidence/web-launch/shots/` is empty).
- Resume, in order:
  1. `npm run compile && node node_modules/.bin/dsx lint` (expect 0/0).
  2. `rm -rf dist && node node_modules/.bin/dsx build && node scripts/assemble.mjs` (long; run in the background).
  3. `node scripts/redirects.mjs && node scripts/setup-parity.mjs` (target 189/189 + 189 .md + extras).
  4. Screenshots the customer way: `despia shot` with `dsx.shots.json` (documents are addressed as
     `pages/PageX` because shot does not search `Components/pages`); interaction states (switcher open,
     help menu open) cannot be shot by `shot` (vars reach only the root): use `despia verify --image`
     or, as a logged fallback, `evidence/web-launch/shoot.mjs` (Playwright over dist/).
  5. `npx wrangler deploy --dry-run --outdir dist-worker` to type-check/bundle the worker (no deploy).
  6. `despia review` on DocShell and the new components; commit.

## Open items

- Versioned docs: badges (`since`/`changed`/`removed` front matter), `versions.json` and the version
  chip are in; per-version builds under `/v/<version>/` and the selector menu wait for a second
  release and the CMS lane's `cms/docs-versioning.patch` (not present yet).
- Releases: space, index, RSS (`/releases/rss.xml`), JSON Feed, llms are in; no notes yet (0.1.0 is
  not released; content arrives from CMS/ROADMAP lanes).
- Troubleshooting: 3 seeds derived from v3 roadblocks (link, not duplicate); "Fixed fast" cards
  render only from real `reportedAt`/`releasedAt` front matter (none yet).
- App Review: 13 entries (11 from v3 store-rejections + 2.3 metadata + account deletion); cases arrive
  from the content engine (`cases` front matter).

## Owner-gated

Deploy of the docs Worker and of the setup.despia.com redirect Worker/list, DNS cutover, the zone rate
limiting rule, SUPPORT_ORIGIN / SITE_ORIGIN worker vars.
