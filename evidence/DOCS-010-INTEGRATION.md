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

Tests: 10 executed/selected, 8 pass, 1 fail (DocShell spacePick expected Legacy v3, got empty),
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
