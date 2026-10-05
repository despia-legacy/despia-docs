# Docs launch review: framework gaps (2026-10-03)

Framework files are not edited from the docs lane. Each gap names the cause and the evidence. Shots are
`shots/launch-2026-10-03/before/` (built before the wt-web framework merge: route cross-fade, registry
chunks, cascade sheet, role vocabulary, scroll-trap fixes). Re-check every gap against the `after/` set
once the docs are rebuilt with the wt-web CLI; drop a gap that the merge closed.

## G1. Collapsed split: the "Back" row and the detail NavBar are two bars at 390

- Cause: `dom/src/split.ts` ~200 appends its own `button.dsx-split-back` to the detail pane, above the
  author's content. The docs' `<NavBar system="false">` (space picker, version menu, Ask AI, appearance)
  is that content, so at 390 the page opens with a "‹ Back" row, then a second row of bar items.
- Evidence: `before/home-390-light.png`, `before/legacy-390-dark.png`, `before/agent-390-dark.png`.
- Ask: when the detail pane's first child is a NavBar, the split's Back takes the NavBar's leading slot
  (one 44 pt bar, as a SwiftUI NavigationSplitView collapsed to a stack). Related: STATUS gap 8.

## G2. MarkdownTable hugs its content and clips at 390

- Cause: `.dsx-markdown-table-frame` sizes to the table (464 px inside a 736 px column at 1440), and at
  390 the frame scrolls sideways with cells cut mid-word, no edge cue.
- Evidence: `before/table-1440-light.png`, `before/table-390-light.png`, metrics in `before/metrics.json`
  (`table.frame` 464 at every width; legacy page 706).
- Ask: the table fills the column (SwiftUI `Table` / M3 data table take the container width) and wraps
  cells before it scrolls; a sideways scroll only when a column cannot wrap.

## G3. Popover ground lets the page show through

- Cause: the popover surface computes to `color(srgb 1 1 1 / 0.94)` light and `rgb(15 14 19 / 0.94)` dark;
  page text under the agent menu is readable at 390.
- Evidence: `before/agent-390-dark.png`, `before/agent-390-light.png`, `before/metrics.json` (`popoverBg`).
- Ask: the material needs its backdrop blur (iOS menu material), or an opaque ground where blur is
  unavailable.

## G4. A link row inside a menu-like popover draws the navigation chevron

- Cause: `dom/src/structural-controls.ts` ~1471 gives every `a.dsx-pressable` row the disclosure ">",
  correct for a push inside the app; the docs' agent and "More" popovers are lists only because a stock
  `<menu>` row cannot carry an `href` (STATUS gap 9).
- Docs-side mitigation (in the uncommitted DocShell patch): link rows end in `arrow.up.right`, the
  platform glyph for leaving, which the stock rule already stands down for.
- Ask: `<menu>` items with `href` (closes gap 9 and this).

## Re-check 2026-10-05 (after shots in shots/launch-2026-10-03/after)
- G1 open: at 390 the Back row and the NavBar still sit on two rows (agent-390-light).
- G2 open: table scrollW equals clientW (462) at both widths, so the table still hugs its content; no change from before.
- G3 open: the popover ground still shows page text through it (agent-390-light), computed bg color(srgb 1 1 1 / 0.94) over blur.
- G4 closed on the site side: link rows now end in arrow.up.right and draw no chevron (popoverChevrons 0).
