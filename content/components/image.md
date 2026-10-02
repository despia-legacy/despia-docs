---
title: image
description: The base Web twin renders remote and relative images, every icon name in the shared cross-runtime sf-map corpus, the fixture's decorative-by-default accessibility contract, iconSize/fontSize geometry, semantic tint and the cache policy.
order: 3
section: components
element: image
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"a11yLabel","type":"string","default":null},{"name":"allowDownscaling","type":"bool","default":"true"},{"name":"asset","type":"string","default":null},{"name":"blurRadius","type":"number","default":"0"},{"name":"cache","type":"enum","default":"default","values":["default","none"]},{"name":"cachePolicy","type":"enum","default":"memoryDisk","values":["memory","disk","memoryDisk","none"]},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"contentFit","type":"enum","default":"cover","values":["cover","contain","fill","none","scaleDown"]},{"name":"contentPosition","type":"string","default":"center"},{"name":"fallback","type":"string","default":"none"},{"name":"fontSize","type":"number","default":"24"},{"name":"icon","type":"sf-symbol","default":null},{"name":"iconSize","type":"number","default":"24"},{"name":"on:error","type":"action","default":"none"},{"name":"on:load","type":"action","default":"none"},{"name":"placeholder","type":"string","default":"none"},{"name":"placeholderFit","type":"string","default":"cover"},{"name":"priority","type":"enum","default":"normal","values":["low","normal","high"]},{"name":"recyclingKey","type":"string","default":"none"},{"name":"sources","type":"string","default":null},{"name":"src","type":"url","default":null},{"name":"systemImage","type":"sf-symbol","default":null},{"name":"tint","type":"color","default":null}]
actions: ["error","load"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# image

The base Web twin renders remote and relative images, every icon name in the shared cross-runtime sf-map corpus, the fixture's decorative-by-default accessibility contract, iconSize/fontSize geometry, semantic tint and the cache policy.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<image icon="heart.fill" iconSize="24" style="color: var(--dsx-accent)"/>
```

`image` takes no children.

## Catalog specimen

`ImageDefault.dsx`, verbatim from the catalog:

```dsx
<image icon="heart.fill" iconSize="24">
  <head/>
</image>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: src loads (naturalWidth>0) with a11yLabel alt, icon mode draws, broken src renders labelled browser fallback at reserved box - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Remote loads show the placeholder wash, fade in on decode (withAnimation easeIn 0.15) with a stale-URL ticket guard, and keep the placeholder on failure - fail-open (CachedRemoteImage, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Image/swift/DSXImageCache.swift:189-227); asset and SF Symbol paths render synchronously; bounded decode policy guards dimensions (safeBundledImage, Image.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: loading/error axis: cold remote load fades in over 0.15s easeIn, warm mount renders first-frame, failure keeps the 6%-white placeholder fail-open; cache tiers memory LRU 200 -> content-plane disk/single-flight (ImageElements.kt header); GIF animates API 28+, static first frame below (pinned). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `a11yLabel` | `string` |  |  |
| `allowDownscaling` | `bool` | `true` |  |
| `asset` | `string` |  |  |
| `blurRadius` | `number` | `0` |  |
| `cache` | `default` \| `none` | `default` |  |
| `cachePolicy` | `memory` \| `disk` \| `memoryDisk` \| `none` | `memoryDisk` | `cache` remains the legacy alias. |
| `color` | `color` | `var(--dsx-label)` | Symbol tint. The default follows the same token as text. |
| `contentFit` | `cover` \| `contain` \| `fill` \| `none` \| `scaleDown` | `cover` | How the image fills its box. |
| `contentPosition` | `string` | `center` | Which part survives the crop. |
| `fallback` | `string` | `none` | Shown when the source fails. |
| `fontSize` | `number` | `24` |  |
| `icon` | `sf-symbol` |  |  |
| `iconSize` | `number` | `24` |  |
| `on:error` | `action` | `none` |  |
| `on:load` | `action` | `none` |  |
| `placeholder` | `string` | `none` | A blurhash, a thumbhash, or a URL. Decoded and shown until the real bytes land. |
| `placeholderFit` | `string` | `cover` |  |
| `priority` | `low` \| `normal` \| `high` | `normal` | `high` |
| `recyclingKey` | `string` | `none` | Identity across a recycled row, so a reused view does not flash the previous image. |
| `sources` | `string` |  | Responsive candidates beside `src`, comma separated, width first (`400:/hero-400.jpg, 800:/hero-800.jpg`). The web emits `srcset`/`sizes` and the browser chooses; the natives take the narrowest candidate at least as wide as the box times the screen scale. |
| `src` | `url` |  | Remote image (async, fills, placeholder while loading). |
| `systemImage` | `sf-symbol` |  |  |
| `tint` | `color` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `error` | `on:error="..."` |
| `load` | `on:load="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders remote and relative images, every icon name in the shared cross-runtime sf-map corpus, the fixture's decorative-by-default accessibility contract, iconSize/fontSize geometry, semantic tint and the cache policy.

**Known limits on the web**

- A NATIVE app-bundle asset key (asset="AppLogo") has no browser equivalent - a browser has no app bundle. A path or URL asset resolves normally; a bare key stamps data-dsx-unresolved="asset" and keeps its accessible name, so the gap is inspectable rather than a silent blank box.
- cache="none" is expressed as a per-mount cache-bust key; the default rides the browser's own HTTP memory/disk cache, which is the platform's equivalent of the native image cache tier.
- The web icon tier is generated from OpenSource/Conformance/icons/sf-map.json and covers all 99 corpus rows; 89 draw a 24x24 stroke vector and 10 pictographic rows (apple.logo, bitcoinsign.circle.fill, books.vertical, crown.fill, flame.fill, metronome, pianokeys, target, tuningfork, waveform.badge.magnifyingglass) deliberately draw the corpus's own unicode fallback glyph instead.
- Thirteen names the in-repo web previews author live in the corpus web_extra section rather than icons, because an icons row also pins a Material Symbols codepoint that the bundled Android subset font must carry.
- The responsive source contract is the browser's to resolve: the twin emits the sources= candidates as srcset plus a sizes hint and never names the file it expects, because a browser may legally take a wider candidate it has already cached. sizes is the measured box in CSS pixels, or auto when no layout has happened yet (and always auto from the server twin, which has no layout). allowDownscaling="false" withholds both, so the author's full size src paints. Pinned by packages/dom/test/image-dom.test.ts and by the sourceCandidates section of OpenSource/Conformance/image/resolution.json.
- on:progress is unsupported here, with the reason rather than a faked number: an `<img>` reports no byte progress, and making fetch the image transport would move every image off the HTTP cache tier that cachePolicy and on:load cacheType are defined against, onto a CORS surface an `<img>` does not have. A bound handler stamps data-dsx-unsupported="progress" so the absence is inspectable. The two native lanes do not support it either, for their own reason: the bytes are fetched by the shared content plane (DSXImageCache on Apple, DSXContent single flight transfers on Android) rather than by the element adapter, and that plane exposes no per byte callback, so the element cannot report one without inventing a number.

**Implementation notes.** Icon glyph renders at font weight .semibold (Image.swift:23). Android resolves SF names through OpenSource/Conformance/icons/sf-map.json (StackIcons.kt).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-image`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | a11yLabel -> alt on img, icon-only images labelled; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | Decorative-unless-labeled convention: without a11yLabel every path is accessibilityHidden(true) (the alt-empty twin, documented in-file); labeled images ride the kernel pass (a11yLabel + a11yTrait=image). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Image/swift/Image.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: a11yLabel= announces via the style chain's semantics (step 18); the icon path clears raw PUA glyph text semantics so junk never reads (ImageElements.kt:113-114 clearAndSetSemantics); bitmap paths pass contentDescription=null = decorative Compose convention (ImageElements.kt:32,194). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

