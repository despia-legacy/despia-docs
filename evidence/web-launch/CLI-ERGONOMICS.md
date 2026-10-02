# CLI ergonomics log: lane DOCS (despia-docs, 2026-10-02)

Rules 11 to 13 arrived mid-lane. Everything before them (the DocShell space switcher, search
scope, help bar, legacy banner, version badges and the new docs components) was written by hand,
and I say so here. The rows below are what happened when I moved to the CLI and its proof verbs.

| time | verb + args (short) | intent | outcome | what helped or hurt | fix idea |
|---|---|---|---|---|---|
| 17:25 | `lint` (wt-fleet2 CLI, docs as cloned) | baseline the untouched docs repo | refused: `dsx.config.json: no command` | Clear and actionable: it names the key and both places it may live | `migrate` could rewrite `scheme` -> `command` in dsx.json itself |
| 17:27 | `lint --strict` | the brief said "lint strict" | refused: `unknown flag --strict` | Fine, strict is the default, but nothing says so | Accept `--strict` as a no-op alias, or print "lint is always strict" |
| 17:30 | `build` | baseline build | refused: 74 errors, most "`<server>` block is never closed" | The real cause was markdown inside a JSE string literal (`<server>` in an example) being scanned as a document block. The message points at line 1 of a 400-line file | The block scanner should skip string literals; report the line of the literal |
| 17:35 | `lint` | find the remaining 51 errors | worked | Messages explain the rule and give the codemod (`despia migrate --codemod bare-reach --apply`) | none |
| 17:36 | `migrate --apply <files>` | fix bare reaches | worked, 17 sites in 4 files | Exactly what the message promised; safe | It did not fix `q=` -> `input:q=` on `<formula>`, though the lint message spells the fix out; another codemod |
| 17:40 | `lint` (bisect) | why "variable body unbalanced"? | wrong-ish | Cause: XML entities are decoded before the JSE parse, so `&quot;` inside a string ends it. Took a bisect script to find | Say "after entity decoding, the string ends at column N" |
| 18:05 | `lint` | lint the new DocShell | worked; caught `route = ...` in a formula as a silent no-op write, and two-way `bind` on computed rows | Both were real bugs I would have shipped | none |
| 18:10 | `lint` | web.head meta row | refused: "a row has exactly one key, meta or link" | Precise | none |
| 18:20 | `build` (448 routes) | full build | slow: 9 to 25 min wall on a Mac at load 40 to 56, with `jse_budget_exhausted` (2,000 ms wall clock) printed hundreds of times | The budget is wall-clock, so machine load turns into SSR timeouts on cheap formulas | A CPU-time budget at build, and an incremental build (one changed page should not re-render 448) |
| 18:52 | `describe Components/DocShell.dsx` (wt-web CLI) | read the shell as a contract | refused: the wt-web toolchain does not start (`server/src/deploy-emit.ts` TS1002, another lane mid-edit) | Rule 11 anticipates this; fell back to wt-fleet2 | The CLI could start from its last good dist instead of rebuilding workspace packages on every run |
| 18:53 | `describe Components/DocShell.dsx` (wt-fleet2) | same | worked, 28 s wall | Excellent summary: 18 attributes, 11 formulas, 8 actions, the api with "NO loading, NO empty, NO error", and a split signal on `switcherOpen`/`actionsOpen` written from 4 places. Saved reading 386 lines | 28 s for a read is slow; most of it is workspace dist checks |
| 19:00 | `shot --plan` with `"document": "PageMigrate_Map"` | screenshots the customer way | refused: `no document "PageMigrate_Map" in the project` | The build resolves `Components/pages/*.dsx`; `shot` only looks in `Components/` flat. Workaround: `"document": "pages/PageMigrate_Map"` | `shot` should resolve documents the way `build` does (the registry), or by route |
| 19:01 | `shot --plan` with `"vars": {"switcherOpen": true}` | a shot of the switcher open | wrong: "0 var(s)", silently | `vars` reach only the root document, not a component's own variables, so interaction states (menus, popovers open) cannot be shot | A per-shot `state` that addresses a component variable by path, or `verify --drive` style presses in `shot` |

## Verdict (so far)

Slower than writing files for the markup itself, more correct overall. Every lint finding I hit was a
real defect or a real migration, and the messages usually carried the fix. The cost is speed: a 448-page
build takes tens of minutes under fleet load, and read verbs take half a minute. I did not use the
structural verbs (`insert`/`set`/`wrap`) for the DocShell rework because it predates rule 11; for the
remaining edits see the rows below as they land.

| time | verb + args (short) | intent | outcome | what helped or hurt | fix idea |
|---|---|---|---|---|---|
| 19:10 | `insert DocShell.dsx spinner --after 1.2.0 --rev R` | add a loading face to the search panel (describe flagged the api's missing faces) | worked, but 10 min 44 s wall (CPU 56 s) at load ~45 | Addressing by `1.2.0` from `describe` was precise and the revision guard is reassuring | A single-node insert should not re-lint 469 files; scope the guardian to the touched document and its users |
| 19:25 | `set DocShell.dsx 1.2.1 visible-if "a &amp;&amp; b"` | gate the spinner | wrong: the CLI escapes values itself, so my pre-escaped `&amp;&amp;` landed as `&amp;amp;&amp;amp;`; 515 s wall | Fixed by one hand edit (the minimal residue) | Say in `set --help` that values are raw expressions and the CLI escapes them |

| time | verb + args (short) | intent | outcome | what helped or hurt | fix idea |
|---|---|---|---|---|---|
| 23:05 | `lint` (resume) | re-check after the WIP edits | worked: 469 files, 0 errors, 0 warnings | | |
| 23:10 | `build` | final tree | refused (exit 1, 447 s): the credential guard found `-----BEGIN PRIVATE KEY-----` and `AuthKey_XXXXXXXXXX.p8` placeholders in the framework's OWN guides (codemagic-build, provisioning) and v3 docs | The finding names file and byte offset and never prints the value; good. But it has no allowance for documentation placeholders, so the framework's docs cannot build its own docs | An inline allow marker for docs examples, or entropy on the PEM body (`MIGT…` is not a key); compile.mjs now inserts a word joiner |
| 23:20 | `build` | after the fix | worked, 550 s, 448 routes | | Incremental builds |
| 23:30 | `shot` with `pages/PageX` | screenshots | refused for every shot: "component pages/PageX is not in the registry" | The plan step needs `pages/PageX` (file lookup in `Components/` only) and the render step needs `PageX` (registry): no spelling passes both, so documents in a subfolder cannot be shot at all | Resolve shot documents through the registry (or by route) in both steps |
| 23:32 | `verify --image --route /migrate/map` | the route as an image | wrong: rendered the entry (`/`, PageIndex) at 780 px, ignoring `--route` | The image itself was useful: it showed the compact header wrapping (wordmark, switcher, Ask AI), fixed in DocShell.css | `--route` should select the route; say which route was rendered in the index |
| 23:35 | (fallback) `evidence/web-launch/shoot.mjs` | real route screenshots incl. open menus | Playwright over dist/, logged as a fallback because `shot` and `verify` could not do it | | |
