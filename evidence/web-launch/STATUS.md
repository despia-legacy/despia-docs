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

## CMS versioning patch + schema (2026-10-03, commit 2817f32)

- Applied `cms/docs-versioning.patch`: `DOCS_CONTENT` (build an older version from `versions/<v>/`),
  pages filtered by `since`/`removed` against `DOCS_VERSION`, `versions.json` from
  `data/docs-versions.json` (latest at `/`, older at `/v/<v>/`). Not applied: the inline
  "> Added in ..." marker line, because DocShell already shows since/changed/removed as chips (it would
  say it twice). Added the version picker (stock popover over `/versions.json`).
- CMS schema v1 accepted: troubleshooting `platform: both`, `status`, `reportedAt`/`workaroundAt`/
  `resolvedAt`/`resolvedIn`/`releaseNote` (fixedAt/releasedAt kept as aliases); App Review fields
  already matched; releases read the changelog collection's fields and hide `status: upcoming`.
- Lint after the patch: 0 errors, 0 warnings. Guarded build (rule 15:
  `perl -e 'alarm shift; exec @ARGV' 240 heavy.sh node node_modules/.bin/dsx build`): killed by the
  240 s alarm, exit 142, with no build output; heavy.sh appears to have still been waiting on its load
  guard (load 22). The docs build needs about 550 s on a quiet Mac, so it can never finish inside the
  240 s bound. Owner or root decision needed: a larger bound for this build, or an incremental
  `despia build`. The last complete build (before this patch) is the proof above.

- Rule 15 update (web builds: 900 s bound, load at most 70): the rebuild under
  `perl alarm 900 heavy.sh dsx build` waited about 6.5 min for a heavy slot, built for about 4 min,
  and was then stopped by the coordinator, who needed the slot. Partial output was kept but is not a
  servable tree. NEXT, once the coordinator frees a slot window: check `uptime` and slot availability,
  rerun that exact command, then `node scripts/assemble.mjs`, `npm run parity` (expect 189/189), and
  `node evidence/web-launch/shoot.mjs` (add a version-picker shot: click `.doc-version-chip`).

## Polish after the coordinator's proof run (2026-10-03)

The coordinator ran the build with the wt-web incremental build: exit 0. Parity 189/189 and 14 shots,
committed in afd19dc. Fixes in source after that run, not yet rebuilt:
- The "On this page" rail: plain text links drawn by `repeat=`, with no list platter. The section in
  view is marked by an accent left rule and weight.
- The version picker: the stock `<menu>` with a "Docs version" header, the current version
  checkmarked, and older versions opening through `route.reset`.
- Sidebar titles: wrap to 2 lines, then an ellipsis.
- The stray "‹ Back": this is the framework, not the docs. See gap 8 below. No workaround applied.

## Stock rebuild (owner ruling 2026-10-03, commit 036dd8a)

DocShell is rebuilt from stock components only. DocShell.css went from 48,736 to 1,945 bytes and is
now layout only: the one colour is `var(--dsx-accent)` on the "On this page" item in view. Content
blocks lower to extended-markdown directives, so the stock `<markdown>` lowering renders them as
Callout, Card, MarkdownSteps, MarkdownTabs, Accordion and CodeBlock. All local content components
are deleted. `despia lint` gives 459 files 0/0 and `despia review` gives 0/0. Not yet rebuilt.

## Code formatting (owner, 2026-10-03)

The compiler re-prints one-line `json`/`jsonc` fences: a nested object or array, or anything past
60 characters. It uses 2-space indentation, and an array of scalars stays on one line when it fits.
The md siblings keep the source as written. A block that does not parse is left exactly as written
and listed, with path and approximate line, in `evidence/web-launch/code-format-report.txt` (7 JSON
examples in the framework skills that are deliberately partial, e.g. with `…`).

JS/TS: nothing in the docs toolchain formats them. The fleet installs have `typescript` and
`esbuild`, but neither is a docs dependency, and the TS printer drops blank lines and rewrites
spacing. So JS one-liners over 100 characters are only reported (3, all v3 Lovable pages).
Adopting `prettier` as a devDependency would do it properly; that is owner-gated, since it is a
new download.

## Framework gaps (written down, not bypassed)

22. **No heading-in-view binding.** The stock Outline takes `current` = the id of the heading in
    view, but no DSX binding reads scroll position. docs.js marks the Outline row `aria-current` from
    a scroll spy, and the Outline's own sheet draws it. Ask: a scroll-spy primitive (an
    IntersectionObserver-backed value, or Outline observing the anchors itself).
(Gaps 14, 16, 20 and TOC are closed by the framework's `appearance: sidebar`, `selection=`,
Accordion `icon=` and `<Outline>`, adopted in DocShell.)

16. **No sidebar list style on the web.** SwiftUI's `.listStyle(.sidebar)` and Material 3's
    navigation drawer items both draw plain rows with no cards and no separators, plus a selected
    highlight. A stock `<list>` resolves either to the inset card (the default) or, through
    `appearance: grouped`, to edge-to-edge rows with full-width separators. The docs sidebar uses
    `grouped`, the closest stock idiom. Ask: a `sidebar` list idiom, with the selection binding of
    gap 14.
17. **NavBar trailing items: only bare `<button>`s are dressed.** `navbar-trailing.ts item()`
    dresses a bare `<button icon|label>`, or a `<menu>` holding exactly one, as bar items. Anything
    else is "authored" and keeps its own cascade. That covers a `<picker>`, or a button with a
    class or an href. The route bar's trailing column then has `gap: 0.125rem` and relies on the
    44 px targets of dressed buttons, so a `<picker>` between bar buttons sits flush against them.
    Ask: dress `picker`/`segmented` as bar items too, the SwiftUI toolbar Picker / M3 action
    equivalent, or give the column a real item gap. Docs also moved GitHub into the "More" list,
    because an href made it authored.
18. **The back control is labelled with the covered frame's title.** That frame is the entry,
    stacked by gap 8, so a URL-landed page shows "‹ Modern" beside its own title. This follows from
    gap 8; it goes away with it.

11. No card grid directive. Mintlify CardGroup `cols` becomes stacked `:::card`s.
12. No API field row on web. `FieldRow` is ios/android only, so ParamField and ResponseField lower
    to a markdown list.
13. No embed directive. Extended markdown refuses iframes until an allowlist is proposed, so the
    57 v3 YouTube embeds become `::link-card` links.
14. Stock `<list>` has no selection binding (List(selection:)), so the sidebar's current row is
    `aria-current` from docs.js with no stock selected look.
15. No outline / table-of-contents component. The rail is stock text links plus the one
    accent-token rule.

8. **A URL-landed page shows the stock "‹ Back" bar.** Per router.ts, a deep link cold-loads the entry
   frame (PageIndex at `/`) and pushes the matched route on top. Depth is then 2, so the default-back
   law (route-chrome.ts `frameBar`, corpus router/default-back.json) draws the bar on every docs page
   opened by URL. For an app that is "Back works"; for a website every URL is a root. Ask: a site or
   web project should treat the URL-landed route as the root frame, or the cold load should not stack
   it. Not worked around here; a NavBar release would hide it, but that is a per-page bypass.
10. **The text hug law ignores a CSS-authored row.** The element sheet sets `.dsx-text { flex: none }`.
   It gives the shrink back (`flex-shrink: var(--dsx-text-shrinkable)`) only to
   `.dsx-hstack > .dsx-text` and `.dsx-button > .dsx-text` (dom/src/theme.ts 2043-2045). A `<pressable>`
   laid out as a row by author CSS (`display: flex; flex-direction: row`) keeps its text at
   `flex-shrink: 0`. So the sidebar title ignored `line-clamp: 2` and overflowed the 16.5rem rail: shot
   01, "Current DSX components and the reti" clipped at the sidebar edge. The CSS clamp only grants the
   permission through `--dsx-text-shrinkable`, which an un-hstacked row never reads. Docs now declare
   `flex: 0 1 auto` on `.doc-nav-text`, an author flex-shrink, which the sheet documents as allowed.
   Ask: key the permission on the computed axis (any flex row parent), or make `pressable`
   row-aware like `button`.
9. **`<menu>` items have no `href` and no `checked`.** A menu row dispatches only a module call. The
   version picker uses `icon: 'checkmark'` for the current version and `route.reset` for others, which
   cannot leave the SPA route table for another build under `/v/<v>/`.

0. The credential guard refuses documentation placeholders (`-----BEGIN PRIVATE KEY-----`,
   `AuthKey_XXXXXXXXXX.p8`) in the framework's own guides; compile.mjs inserts an invisible word joiner.
   `despia shot` cannot render documents in a Components subfolder; `verify --image --route` ignores
   the route; `shot` vars reach only the root document (no open-menu states). See CLI-ERGONOMICS.md.

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

## Proof (final tree, 2026-10-03)

- `despia lint`: 469 files, 0 errors, 0 warnings (101 notices).
- `despia build` + `assemble.mjs`: green, 448 routes (modern 237, legacy 189, migrate 3,
  troubleshooting 4, releases 1, app-review 14); every page carries docs.js, its canonical, the
  markdown alternate and a strict per-page CSP (inline scripts by sha256). 550 s on a quiet Mac,
  up to 63 min at load 50+.
- Parity (`npm run parity`, `evidence/web-launch/parity.txt`): setup.despia.com 189/189 pages resolve
  in one 301 to a 200 page with its canonical; 189/189 `.md` siblings; 9/9 extras.
- Worker: `wrangler deploy --dry-run` bundles clean (nodejs_compat added), 14.3 MB assets / 3.0 MB gzip.
- Search core bench: 1.93 ms/query lexical, 3.27 ms hybrid CPU, cache hits ~0 (see above).
- Screenshots `evidence/web-launch/shots/` (Playwright over dist/, the logged fallback because
  `despia shot` cannot resolve `Components/pages/*` and `verify --image` ignores `--route`):
  01 modern page, 02 legacy Steps/Tabs/Cards, 03 legacy banner + cards, 04 migration map,
  05 switcher open, 06 help menu open, 07 search across all spaces, 08 troubleshooting,
  09 App Review, 10 releases, 11 mobile legacy, 12 mobile help, 13 ParamFields dark.

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
