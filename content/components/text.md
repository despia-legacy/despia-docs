---
title: text
description: The base Web twin renders bound/value/inner content with semantic color and universal typography, the inline markdown vocabulary the native reference renders, and lineLimit tail truncation.
order: 3
section: components
element: text
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"lineLimit","type":"number","default":null},{"name":"markdown","type":"bool","default":"false"},{"name":"type","type":"enum","default":"body","values":["display","title1","title2","title3","headline","body","reading","callout","footnote","label","caption","caption2"]},{"name":"value","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# text

The base Web twin renders bound/value/inner content with semantic color and universal typography, the inline markdown vocabulary the native reference renders, and lineLimit tail truncation.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Also answers to `label` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<text type="headline" value="Hello, DSX"/>
```

`text` takes children: text. The same element answers to `label`.

## Catalog specimen

`TextDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 6px">
  <head/>
  <text type="headline" value="Hello, DSX"/>
  <text value="A body line at the default rung."/>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| ios | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| android | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  | Bind to a store key/path; takes precedence over inline text. |
| `color` | `color` | `var(--dsx-label)` | Foreground color. The default follows the adaptive label token. |
| `lineLimit` | `number` |  |  |
| `markdown` | `bool` | `false` |  |
| `type` | `display` \| `title1` \| `title2` \| `title3` \| `headline` \| `body` \| `reading` \| `callout` \| `footnote` \| `label` \| `caption` \| `caption2` | `body` |  |
| `value` | `string` |  | Static text (interpolated). |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`text` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders bound/value/inner content with semantic color and universal typography, the inline markdown vocabulary the native reference renders, and lineLimit tail truncation.

**Known limits on the web**

- markdown= implements the INLINE vocabulary Text(AttributedString(markdown:)) renders on the reference runtime - emphasis, strong emphasis, code, strikethrough and links. Block constructs (headings, lists, quotes) stay their literal run of text on every runtime, exactly as SwiftUI's Text collapses them.
- A markdown link target is restricted to http/https/mailto/tel and relative URLs; any other scheme renders as plain text rather than a live navigation, and the parse is bounded to 16384 characters, 512 inline nodes and 8 levels of nesting.
- lineLimit uses the browser line-clamp box, so the ellipsis and the exact break position are engine-owned typography rather than a pinned glyph count.

**Implementation notes.** `markdown` is the same INLINE vocabulary on all three renderers: iOS Text(AttributedString(markdown:)), web packages/dom/src/markdown.ts, Android markdownInlineAnnotated (MarkdownBlocks.parseInline into AnnotatedString). Block intents still collapse on `<text>`; the block-level `<markdown>` element answers OpenSource/Conformance/markdown/blocks.json. WHITESPACE IS `pre-line` ON EVERY RENDERER: runs of spaces and tabs collapse to one space and a newline is a forced break. iOS StackLayoutSeam.preLine, Android StackStyle.preLine, and the web `.dsx-text { white-space: pre-line }` implement it (theme.ts; pinned by dom/test/theme.test.ts). Measured 2026-09-02 before the law was spelled on all three: the phones applied the collapse only when the value carried a newline ("a  ·  b" kept both spaces), and the web collapsed the runs but ignored the newlines.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-text`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | Plain text remains native text, while authored href turns it into a focusable link with Enter activation; lineLimit changes presentation without hiding the accessible string (elements.ts text; mount.test.ts; element-support-ledger.test.ts). |
| ios | review | 2026-08-18 | System Text: static-text semantics carrying the actual string; markdown renders AttributedString; the unstyled default rides the platform type ramp; the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Text/swift/Text.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: BasicText exposes its string to the a11y tree; color default rides the semantic label token (system-defaults base pass, ElementDefaults.TEXT_COLOR). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

