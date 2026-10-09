# Docs 0.1.0 integration — source WIP only

Baseline: 4321a498126771703fb547e15d6f910fc594da98, ancestor of all three freshly verified remote branches.
This is the DSX docs lineage (web-launch/web-launch-docs), unrelated to old main.
No unrelated-history merge, main replacement or domain switch is authorized or performed.

Reviewed queue, merged in order without conflicts:
- 1547a613244fdca3f144913128fa395ae39d0eb3 (local HTTPS CDN guide)
- 253cf463f87f5faf1eef71227c407a7ea96ddc97 (253 package pages and index)
- b69443d107c9302636e01f1391b775e0906445bf (Lingo)

Normal local content sync from framework 5b48291f16c3d02fbc970f5f35a10795705b5988
OpenSource imported 163 framework pages. Normal compile passed: 736 routes and 12 MCP tools.
Generated route/config and code-format-report changes are from those normal scripts, not hand edits.
Supported canonical CLI lint passed: 891 files, zero errors, zero warnings, 544 notices.
The existing npm lint --strict invocation is unsupported by this CLI and remains an explicit script/tool mismatch.

Tests: 10 selected (9 executed), 8 pass, 1 fail (DocShell spacePick expected Legacy v3, got empty),
1 skip (no matching final glossary checkout). DocShell and its test source are byte-identical to
baseline; that does not substitute for a baseline runtime test or waive the failure.
Build uses the existing 5b canonical CLI with a 1 GiB heap cap; status is recorded separately.
Expression-budget refusals are retained as gaps even if the process exits successfully.
No render/SSR acceptance, live preview, publication, deployment or final-framework build claimed.

CDN guide remains exactly the reviewed 1547 source. It describes the queued HTTPS-only iOS and
Android designs, not the old numeric TLS candidate or a completed merged-engine production release.
Stable webview/native UI alpha scope remains unchanged. Actual per-platform device gaps and
first-unlock proof limits remain governed by the native receipts, not inferred from this docs build.

Private logs: lane-reports/private/codex-docs-010-integration (compile, sync, tests, lint and build).
Next: final framework/toolchain sync, reconcile npm script flags/alias, DocShell test and expression
budget refusals, complete build/assembly and SSR/MCP probes before any separately approved deploy.

Scope guard on the actual 5b-synced content: RED, two stable imported pages assert native UI
production readiness (/framework/guides/quickstart and /framework/guides/release-status).
These framework pages were not edited or stripped in the docs repository. Final framework
source sync must pass this guard before release; zero lint errors does not waive it.

Final preparation build: supported canonical `despia build` EXIT 0, 3,239 output files.
Normal assemble EXIT 0: 736 pages relinked with shared stylesheet, docs.js, canonical and
markdown alternate links, strict CSP. Fourteen jse_budget_exhausted refusals remain recorded;
this successful process exit is not a rendering acceptance or release waiver.
Static output is available in this owned worktree's dist/ for later qualified preview.
No browser/server was started. Normal npm scripts still require the final CLI alias/flag
compatibility; this run used the supported canonical command directly, not a fake dsx shim.

## Source-quality follow-up

DocShell's failed test mounted it without the `spaces` JSON that `scripts/compile.mjs:947–948` supplies to every generated page. The fixture now reads that same declaration from generated `public/nav.json`, asserts the Legacy (V3) catalog label, and keeps the scope/query/space-picker/space-label/breadcrumb behavior assertions. Breadcrumbs use the authored `title` property, rather than the obsolete test's `label`. No component or generated route was changed.

The lint script now calls the actual package bin, `despia lint`, without unsupported `--strict`. The normal npm script passed against the canonical 5b CLI: 891 files, zero errors/warnings, 544 notices. Own local bin links were used for package resolution; shared dependencies were not modified.

The stability checker had two false positives: both imported guides say native UI is alpha and production-ready **only from 1.0.0**. Its proximity regex discarded that qualification. A narrow helper exempts only that complete explicit future clause; tests retain refusal of current/ambiguous claims, a 0.1.0 claim, and a current claim beside the future clause. Actual old validator reproduces both failures; fixed checker passes all 125 alpha pages. Imported framework source remains unchanged. Guide blobs are identical between 5b and nonfinal train 0fb3aa5: quickstart `99d285ec9d505d782a6c66a2b7d3c0731974f9c5`, release-status `61290eeca304912989dca8b79a569d36da050305`.

Tests: 12 selected, 11 passed, zero failed, one existing glossary-check skip without its checkout. No assertion was removed.

Source-neutral SSR replay of the shipping registry reproduced all 14 budget refusals across 12 routes: `/components/attributes`, `/migrate/map` (two), `/framework/guides/cli`, `/framework/reference/style/feature-queries`, `/framework/reference/style/media-features`, `/framework/reference/style/selectors`, `/framework/reference/style/write-this-instead` (two), `/packages`, `/packages/audio`, `/packages/dom`, `/packages/mount`, `/legacy/best-practices/backend/revenuecat/webhooks`. Actual built HTML contains SSR and the corresponding page owner (registry names are `docs.Name`, emitted owners `Name`). This does not establish complete render success: a refused expression returns null. Private route/HTML size and expression diagnostics are retained; no production engine source was patched and no refusal budget was raised.

The kernel JSE source subtree and server `static.ts` are byte-unchanged 5b→0fb3aa5. That train is not final or fully qualified. No fresh build or final-train rendering claim follows from this comparison.

Expression-level replay identified 13 refusals of stock `MarkdownTable`'s `dsx.variable.tableRows` and one of stock `CodeBlock`'s `dsx.variable.codeShown` (the legacy RevenueCat webhooks page). Actual HTML parsing finds exactly 13 empty table bodies on the 11 affected table routes; other tables on those pages still have rows. This is real incomplete rendered content, not a harmless diagnostic. The code refusal is also retained as incomplete-content risk; no universal whole-page blank claim. Engine owner request: inspect `ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Core/MarkdownTable.dsx:37–41` (computed tableBody read again inside each row) and `.../CodeBlock.dsx:154–156` (computed codeRows expansion), with actual large public input. Both files are byte-unchanged 5b→nonfinal 0fb. Fix the stock derivation rather than delete docs content or raise/disable evaluation guards. No engine fix was made by this lane.

Actual normal `npm run lint` passed after correcting its executable to the current CLI package's declared `despia` bin as well as removing obsolete `--strict`. Historical `dsx` tooling/name mismatch remains in untouched build/dev scripts; final operator commands used the actual canonical bin explicitly. This follow-up does not claim normal `npm run build` is repaired or that the intended final framework is frozen.
