---
title: Components
description: Every element the DSX language has, one page each, generated from the ledgers that keep them honest.
order: 3
section: components
element: 
category: 
scope: reference
platforms: web,ios,android,desktop
properties: []
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Components

76 components, one page each. Every page is a projection of the ledgers: the census for the attribute and event contract, the library matrix for the audited platform record, the web element ledger for the limits, and the catalog for the specimen. Nothing on a page is written by hand, so nothing on a page can quietly go stale.

69 of the 76 have a specimen the catalog serves today; the rest say so on their own page.

## Layout

<CardGroup cols="2">
<Card title="card" href="/components/card">
The base Web twin renders the surface word: the card corner, the raised ground, the elevation and the INSET, which is the part the two helper classes deliberately do not carry because their wearers pad themselves.
</Card>
<Card title="divider" href="/components/divider">
The base Web twin renders the semantic-token divider and accepts universal style/color overrides.
</Card>
<Card title="flow" href="/components/flow">
The structural twin provides wrapping flow layout with bounded reactive item and line spacing.
</Card>
<Card title="hstack" href="/components/hstack">
The base Web twin renders a horizontal flex stack with DSX spacing/alignment through the universal style contract.
</Card>
<Card title="scaffold" href="/components/scaffold">
The base Web twin provides an accessible adaptive split/stack shell with sidebar/content/inspector panes, authored widths, collapse policy, and labels.
</Card>
<Card title="scroll" href="/components/scroll">
The base Web twin provides vertical or horizontal overflow layout and renders child content through the common binding/style contract.
</Card>
<Card title="spacer" href="/components/spacer">
The base Web twin participates as flexible space in DSX stack layout and accepts universal size constraints.
</Card>
<Card title="stack" href="/components/stack">
The base Web twin provides the generic DSX flex/display container and universal spacing/alignment/style contract.
</Card>
<Card title="vstack" href="/components/vstack">
The base Web twin renders a vertical flex stack with DSX spacing/alignment and slot content through the universal style contract.
</Card>
<Card title="zstack" href="/components/zstack">
The base Web twin provides layered stack layout and DSX alignment through the universal style contract.
</Card>
</CardGroup>

## Display

<CardGroup cols="2">
<Card title="ChatBubble" href="/components/chatbubble">
The global Web twin renders the directional bubble, bound value/children, semantic colors, and bounded width.
</Card>
<Card title="ProgressRing" href="/components/progressring">
The global Web twin renders an accessible SVG progress ring with bound value/max, line width, colors, size, and label.
</Card>
<Card title="Skeleton" href="/components/skeleton">
The global Web twin renders a size/radius-aware loading placeholder hidden from assistive technology.
</Card>
<Card title="Table" href="/components/table">
The global Web twin renders the whole native Table contract: a semantic, scroll-contained table from bound rows, declared columns/fields (fields defaulting to the lowercased column labels), semantic tint, header cell traits and one combined accessibility element per row.
</Card>
<Card title="chip" href="/components/chip">
The base Web twin renders the pill word with its two independent axes: role is the STATUS voice off the system's own semantic pairs (accent, success, warning, danger, info) and selected is the chosen pose, so a chip may be a warning and selected at once.
</Card>
<Card title="footerCopy" href="/components/footercopy">
The base Web twin renders the closing line of a screen or a form at the footnote rung in the tertiary ink, the other half of the screen header word.
</Card>
<Card title="image" href="/components/image">
The base Web twin renders remote and relative images, every icon name in the shared cross-runtime sf-map corpus, the fixture's decorative-by-default accessibility contract, iconSize/fontSize geometry, semantic tint and the cache policy.
</Card>
<Card title="progress" href="/components/progress">
The base Web twin provides an accessible determinate progressbar with clamped bound value and semantic track/fill styling.
</Card>
<Card title="qrcode" href="/components/qrcode">
The rich Web twin generates deterministic SVG QR matrices with size, colors, correction level, accessible labeling, and fail-closed input handling.
</Card>
<Card title="screenHeader" href="/components/screenheader">
The base Web twin renders the screen's opening block, a display title over a callout subtitle in the secondary ink, both of them display copy through the localization seam and both painted server side so a reader meets the title rather than a box that grows when the client arrives.
</Card>
<Card title="spinner" href="/components/spinner">
The base Web twin provides an accessible status spinner with semantic color/scale styling and reduced-motion handling.
</Card>
<Card title="svg" href="/components/svg">
The media Web twin implements the fixture's full asset/src/d/viewBox/fill/width/height contract over the same static shape/path subset the native renderer draws (rect/circle/ellipse/line/polygon/polyline/path with M L H V C S Q T A Z absolute and relative), with semantic paint tokens, decorative-by-default accessibility, deterministic SSR, and fail-closed canonicalizing sanitization.
</Card>
<Card title="text" href="/components/text">
The base Web twin renders bound/value/inner content with semantic color and universal typography, the inline markdown vocabulary the native reference renders, and lineLimit tail truncation.
</Card>
</CardGroup>

## Input

<CardGroup cols="2">
<Card title="Checkbox" href="/components/checkbox">
The global Web twin uses a real checkbox input with bound state, label, change write-back, and keyboard/focus semantics.
</Card>
<Card title="RadioGroup" href="/components/radiogroup">
The global data-control twin renders real radio inputs from CSV or bound option data and writes the selected value back.
</Card>
<Card title="Signature" href="/components/signature">
The global Web twin is a real pointer-driven ink pad: a devicePixelRatio-scaled 2D canvas drawing the SHARED ink law (@despia-native/kernel signature-core: clamp, round-at-capture, midpoint quadratic curve), one bound write per stroke on pointer-up, and a server twin that renders the committed strokes as an inline SVG in the same normalized space, so a signed document has real first paint before the pad mounts.
</Card>
<Card title="button" href="/components/button">
The base Web twin renders real button/anchor semantics with label, icon, iconSize, bordered/prominent variants, destructive/cancel roles, href navigation, disabled gating, and tap/double-tap activation - the full button.json attribute contract.
</Card>
<Card title="calendar" href="/components/calendar">
The data-control twin renders a localized, keyboard-operable month grid with ISO binding, range constraints, marks, and month events.
</Card>
<Card title="combobox" href="/components/combobox">
The native-control twin implements an editable ARIA combobox/listbox with filtering, keyboard navigation, option binding, selection, and disabled state.
</Card>
<Card title="datepicker" href="/components/datepicker">
The native-control twin uses browser date/time controls with normalized DSX wire values, label, color, disabled state, and write-back.
</Card>
<Card title="otp" href="/components/otp">
The native-control twin implements a segmented one-time-code input with binding, paste/input normalization, completion event, and accessibility labeling.
</Card>
<Card title="picker" href="/components/picker">
The native-control twin uses a real select control with static/bound options, labels, disabled state, and value write-back.
</Card>
<Card title="pressable" href="/components/pressable">
The base Web twin provides whole-area button/anchor semantics with child content and universal tap, double-tap, long-press, and navigation wiring.
</Card>
<Card title="rangeslider" href="/components/rangeslider">
The native-control twin implements two bounded range inputs with normalized low/high constraints, throttled write-back, final commit, and accessible labels.
</Card>
<Card title="scopeBar" href="/components/scopebar">
The base Web twin renders the scopes under a search field as a wrapping rail of the chip word, with the tablist semantics, a roving tab stop and the two way write back the other option controls carry.
</Card>
<Card title="searchbar" href="/components/searchbar">
The Web twin is the composite search field the native reference draws: a leading magnifier, the real search input with binding, the Search placeholder default and submit, and a trailing clear button that writes the bound path back and fires on:clear.
</Card>
<Card title="segmented" href="/components/segmented">
The rich Web twin provides an accessible radiogroup with static/bound options, selection write-back, and arrow/Home/End keyboard behavior.
</Card>
<Card title="segmentedButton" href="/components/segmentedbutton">
The data-control twin implements single or multiple segmented selection, labels/icons, binding, keyboard traversal, and accessibility state.
</Card>
<Card title="slider" href="/components/slider">
The base Web twin uses a real range input with binding, min/max, input write-back, and semantic tint styling.
</Card>
<Card title="stars" href="/components/stars">
The rich Web twin renders fractional SVG star fills with read-only or radiogroup semantics, binding, and keyboard selection.
</Card>
<Card title="stepper" href="/components/stepper">
The base Web twin provides the visible label caption, named decrement/value/increment controls, semantic tint, fixture-default bounds, bound numeric updates and press-and-hold acceleration.
</Card>
<Card title="textarea" href="/components/textarea">
The base Web twin uses a real textarea with binding, placeholder, input, focus and blur events, and grows between minLines and maxLines exactly like the native lineLimit(min...max) contract.
</Card>
<Card title="textfield" href="/components/textfield">
The base Web twin uses a real text/password input with binding, placeholder, change, submit, focus and blur events, and maps the fixture's contentType/keyboard tokens onto autocomplete/inputmode/type.
</Card>
<Card title="toggle" href="/components/toggle">
The base Web twin uses a real checkbox input with switch semantics, bound state, change write-back, and accessible focus handling.
</Card>
<Card title="wheelpicker" href="/components/wheelpicker">
A real drum to the shared spec (PickerElements.kt, which carries the UIPickerView metrics): a 216px scroll-snap wheel of 32px rows, the selection band behind the centre row, off-centre rows dimmed, drag/fling/trackpad momentum and snap from the scroller itself, tap-to-centre, arrow/Home/End keys on a listbox role, a settled snap writing through the bind seam once, and bound writes scrolling the drum.
</Card>
</CardGroup>

## Forms

<CardGroup cols="2">
<Card title="field" href="/components/field">
The form twin supplies labeled controls, shared form state, touched/dirty/error tracking, validation, secure inputs, and option fields.
</Card>
<Card title="form" href="/components/form">
The form twin manages namespace state, child fields, validity, scrolling, and submit actions/events using a real form element.
</Card>
</CardGroup>

## Structure

<CardGroup cols="2">
<Card title="Accordion" href="/components/accordion">
The global Web twin provides accessible disclosure semantics, reactive title/open state, toggle events, and the named header slot that REPLACES the default title + chevron.
</Card>
<Card title="MenuBar" href="/components/menubar">
The application-control Web twin implements bounded keyed items, canonical selection state and write-back, selection events, radio-menu semantics, keyboard and RTL navigation, the compact pill dock, and, at the shared desktop step, the WAI-ARIA menubar presentation: roving roots, per-root shadow-3 flyouts from nested items, submenu keyboard walk with Escape walking up, and right-aligned shortcut hints from the shortcut token grammar.
</Card>
<Card title="carousel" href="/components/carousel">
The structural twin renders accessible slides with two-way current-page binding, snap paging, selection dots, peek and spacing geometry, and change events - the full carousel.json attribute contract.
</Card>
<Card title="grid" href="/components/grid">
The structural/binding twin renders semantic grid rows/cells with responsive columns, keyed reconciliation, spacing, scroll, and reach-end handling - the full grid.json attribute contract (bind/key/columns/spacing/scroll/reachEnd).
</Card>
<Card title="list" href="/components/list">
The structural/binding twin implements the whole fixture contract: semantic rows, keyed identity, write-back scope, spacing/axis/scroll/alignment, reach-end, group_by sections in first-seen order, the swipe-action rails with both firing shapes and per-edge full-swipe commit, drag reorder that writes the moved array back through the bind seam and fires on:move with FINAL indices, and the horizontal autoscroll marquee - under the same construct gating List.swift uses (scroll="false" and a horizontal axis win over all three; a grouped list ignores reorder; an active reorder suppresses swipe) and with an SSR twin that paints the same first frame.
</Card>
<Card title="pager" href="/components/pager">
The structural/binding twin renders horizontal/vertical snap paging with two-way current-page binding, keyed bound pages, selection dots, and change events - the full pager.json attribute contract.
</Card>
<Card title="refreshable" href="/components/refreshable">
The data-control twin implements the fixture's on:refresh/busy contract: scroll-contained content, rubber-band pull on touch and fine pointers with the shared overscroll curve, a built-in always-visible 44px refresh control for keyboard and mouse with hover and focus-visible states, a polite live status region, aria-busy reflection, spin progress with reduced-motion collapse, and busy-gated completion.
</Card>
<Card title="sectionFooter" href="/components/sectionfooter">
The base Web twin renders the section footer from markup, and the bound twin is the list's group_footer_by attribute, which reads the footer off the section's first row exactly as the header reads the group value.
</Card>
<Card title="sectionHeader" href="/components/sectionheader">
The base Web twin renders the list section header from markup, writing the same class and the same part name the bound group_by emitter writes, so one look has two ways in and a reader hears the group's own name either way.
</Card>
<Card title="split" href="/components/split">
The structural twin provides the two/three-pane plan (paneRole resolution, collapseAt/expandAt width classes), the phone stack push with a back pop, the overlay sidebar, ARIA window-splitter dividers with drag and keyboard resize, and value/on:change detail routing.
</Card>
<Card title="tabs" href="/components/tabs">
The structural twin provides ARIA tabs/tabpanels, bound selection, icons/badges/titles, change events, and keyboard traversal.
</Card>
<Card title="toolbar" href="/components/toolbar">
The structural twin provides toolbar semantics, position/spacing, child content, and roving arrow/Home/End focus behavior.
</Card>
</CardGroup>

## Overlay

<CardGroup cols="2">
<Card title="Drawer" href="/components/drawer">
The application-control Web twin implements BOTH declared presentations: the modal drawer (adaptive geometry, focus containment and restoration, background inerting, Escape and scrim dismissal, bounded content, 120px drag dismissal) and, at the shared desktop step, the standing drawer pinned in flow (collapse-to-rail control, keyboard- and pointer-resizable drag hairline within min/max, honest complementary semantics, no scrim or focus trap).
</Card>
<Card title="alert" href="/components/alert">
The overlay twin provides modal alert semantics, focus containment/restoration, bound presentation, normalized actions, and dismissal.
</Card>
<Card title="confirmDialog" href="/components/confirmdialog">
The overlay twin provides an adaptive confirm dialog with modal semantics, normalized actions, focus containment/restoration, and dismissal.
</Card>
<Card title="contextmenu" href="/components/contextmenu">
The overlay twin supports context-click and long-press opening, nested actions, roles, separators, keyboard traversal and focus restoration, on the same long-press timing the native gesture recognizer uses.
</Card>
<Card title="lightbox" href="/components/lightbox">
The media Web twin provides a shared-top-layer modal gallery with bounded safe sources, reactive presentation/index, focus containment/restoration, keyboard and RTL paging, pointer swipe, interactive drag dismissal, responsive controls, deterministic SSR, and the native zoom ladder: pinch (pointer pairs and trackpad ctrl+wheel) and double-tap zoom toward the focal point (1..4x), pan while zoomed with the native lock (pager and dismiss-drag disabled, chrome hidden), Escape unwinding zoom before dismissal, per-page zoom reset.
</Card>
<Card title="menu" href="/components/menu">
The overlay twin provides anchored nested menus with normalized actions, roles, separators, focus management, and keyboard traversal.
</Card>
<Card title="popover" href="/components/popover">
The overlay twin provides an anchored, viewport-aware popover with trigger semantics, dismissal, keyboard handling, and focus restoration.
</Card>
<Card title="sheet" href="/components/sheet">
The overlay twin implements modal sheet/inset/full modes, normalized detents, title/close/action chrome, focus containment/restoration, and dismissal.
</Card>
</CardGroup>

## Media

<CardGroup cols="2">
<Card title="audio" href="/components/audio">
The media Web twin implements the fixture's full transport/readout contract: headless HTMLMediaElement playback, reactive transport/scrubbing bindings, bounded ready/time/buffering/error events, a 15-second load deadline, teardown, feature-detected Media Session commands, and the session= playback/ambient category applied through the page-scoped Audio Session API where the engine has one.
</Card>
<Card title="video" href="/components/video">
The media Web twin implements the fixture's full contract: native HTML video rendering, active-page ownership, reactive transport/scrubbing/readout bindings, subtitles, bounded load/error state, accurate isolated target-frame previews, best-effort Media Session commands, the audio= playback/ambient category via the page-scoped Audio Session API where present, accessibility, and deterministic SSR.
</Card>
</CardGroup>

## Scene

<CardGroup cols="2">
<Card title="canvas" href="/components/canvas">
The `<canvas>` surface renders the shared display list into an HTML canvas, with the SSR SVG path byte-identical to the native twins.
</Card>
<Card title="scene" href="/components/scene">
The DSX-native scene root renders in the browser through the in-kernel WebGL surface installed by registerSceneSurface, over the same corpus-pinned scene fold (transform composition, projection, picking) the two native lanes and the Compose desktop rasterizer read, so a scene cannot mean one thing here and another on a phone.
</Card>
</CardGroup>

## Data

<CardGroup cols="2">
<Card title="chart" href="/components/chart">
The rich Web twin renders accessible SVG line, area, bar and point charts from bound data - multi-series with palette or single color=, stacked= areas and bars (domain from the stack totals, bands closing on the previous layer), legend= at the census positions (a figcaption, so assistive tech reads it as the caption), xType=time positioning by parsed timestamps with the kernel timeTicks ladder, y2Key/y2Color riding a labeled secondary axis, animate= draw-in (reduced-motion instant), interpolation=linear|smooth|monotone|step, grids, and deterministic downsampling.
</Card>
<Card title="map" href="/components/map">
The rich Web twin renders a REAL basemap when tiles= names a source - a self-hosted Protomaps .pmtiles archive (range-read, MVT-decoded, canvas-painted in the Despia neutral language with archive-metadata attribution) or a raster {z}/{x}/{y} template - plus accessible pins and pointer/keyboard pan/zoom; without tiles= it is the honest offline coordinate plane.
</Card>
</CardGroup>

## Web

<CardGroup cols="2">
<Card title="DSXView" href="/components/dsxview">
The rich Web twin mounts the screen component src names from this build's compiled registry (the web reading of the native rule that a shipped tag of the same name always wins), with reactive src re-resolution, the stable dsx-view lifecycle events, and a labelled unavailable state.
</Card>
<Card title="DSXWebView" href="/components/dsxwebview">
The rich Web twin mounts the composed app web surface as the same policy-constrained iframe WebView rides, resolving path against this page's own origin (an explicit origin wins) with the shared lifecycle events and the named-surface controls the Dom facet targets.
</Card>
<Card title="WebView" href="/components/webview">
The rich Web twin provides a policy-constrained iframe, lifecycle events, named controls, safe URL schemes, and ephemeral isolation.
</Card>
</CardGroup>

## Beyond the elements

<CardGroup cols="2">
<Card title="Declarations" href="/components/declarations">
The tags that render nothing and declare everything: state, actions, formulas, styles, slots.
</Card>
<Card title="Universal attributes" href="/components/attributes">
The vocabulary every element carries: accessibility, animation, class, style, platform suffixes.
</Card>
<Card title="Native first elements" href="/components/native-only">
The rows whose essence is a platform or vendor runtime the web renderer does not ship.
</Card>
</CardGroup>

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

