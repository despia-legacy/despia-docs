---
title: audio
description: The media Web twin implements the fixture's full transport/readout contract: headless HTMLMediaElement playback, reactive transport/scrubbing bindings, bounded ready/time/buffering/error events, a 15-second load deadline, teardown, feature-detected Media Session commands, and the session= playback/ambient category applied through the page-scoped Audio Session API where the engine has one.
order: 3
section: components
element: audio
category: media
scope: library
platforms: web,ios,android
properties: [{"name":"autoplay","type":"bool","default":"true"},{"name":"bind","type":"expr","default":null},{"name":"buffering","type":"state-key","default":null},{"name":"duration","type":"state-key","default":null},{"name":"loop","type":"bool","default":"false"},{"name":"muted","type":"bool","default":"false"},{"name":"nowArtist","type":"string","default":null},{"name":"nowPlaying","type":"bool","default":"false"},{"name":"nowTitle","type":"string","default":null},{"name":"on:ended","type":"action","default":null},{"name":"on:error","type":"action","default":null},{"name":"on:ready","type":"action","default":null},{"name":"on:remoteNext","type":"action","default":null},{"name":"on:remotePrev","type":"action","default":null},{"name":"on:timeupdate","type":"action","default":null},{"name":"paused","type":"expr","default":null},{"name":"reload","type":"number","default":"0"},{"name":"remoteSkip","type":"number","default":"15"},{"name":"scrubbing","type":"expr","default":null},{"name":"session","type":"enum","default":"playback","values":["playback","ambient"]},{"name":"speed","type":"number","default":"1"},{"name":"src","type":"url","default":null},{"name":"start","type":"number","default":"0"},{"name":"time","type":"state-key","default":null}]
actions: ["ended","error","ready","remoteNext","remotePrev","timeupdate"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# audio

The media Web twin implements the fixture's full transport/readout contract: headless HTMLMediaElement playback, reactive transport/scrubbing bindings, bounded ready/time/buffering/error events, a 15-second load deadline, teardown, feature-detected Media Session commands, and the session= playback/ambient category applied through the page-scoped Audio Session API where the engine has one.

<RefMeta platforms="Web,iOS,Android">
Category: Media - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<audio src="{{ dsx.variable.track }}" paused="dsx.variable.paused" bind="dsx.variable.pos"/>
```

`audio` takes no children.

## Catalog specimen

`AudioDefault.dsx`, verbatim from the catalog:

```dsx
<audio bind="dsx.variable.pos" style="width: 100%">
  <head>
    <variable as="pos">return 0</variable>
  </head>
</audio>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | Real-engine media-surfaces oracle (packages/dom/oracle/media-surfaces-browser.ts, run green this audit in Chromium): ready/time/duration/buffering readouts, paused two-way, ended + error events (bad source and load-deadline timeout), teardown inertness, and the session= category reflected (data-dsx-session, playback default; page-scoped Audio Session API applied while playing) - the full loading/error/empty axis of a headless transport; no rest/hover/pressed axis exists (aria-hidden headless element). |
| ios | review | 2026-08-18 | The headless state contract IS the states surface: two-way paused + bind position, buffering/time/duration readouts (published on change; time per whole second), scrubbing no-jump-back with one frame-precise seek on release, ready/ended/timeupdate/error events off real AVPlayer item observers (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Media/Audio/swift/AudioElement.swift header + AVPlayerItemDidPlayToEndTime/FailedToPlayToEndTime handlers). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | n/a | 2026-08-18 | headless playback element: renders no UI surface (MediaElements.kt - 'the headless `<audio>` twin'); playback state is two-way bound DATA (paused/bind/buffering keys) + on:error/on:ended events, not visual states. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `autoplay` | `bool` | `true` | Plays on mount unless `paused` is true. |
| `bind` | `expr` |  | Two-way position fraction - a `<slider>` sharing the key seeks; playback moves it. A value in the store at **load** is the starting state, not a seek. |
| `buffering` | `state-key` |  | Published read-only: `<spinner visible-if="buffering"/>`. |
| `duration` | `state-key` |  |  |
| `loop` | `bool` | `false` |  |
| `muted` | `bool` | `false` |  |
| `nowArtist` | `string` |  |  |
| `nowPlaying` | `bool` | `false` | Lock-screen / Control Center transport. `nowTitle` / `nowArtist` fill the widget (reactive); play/pause/±skip work out of the box (`remoteSkip` = step, default 15 s; pause writes the bound `paused` key). **Process-global** - use it on either `<audio>` or `<video>`, not both at once. |
| `nowTitle` | `string` |  |  |
| `on:ended` | `action` |  | `timeupdate` carries `{ time, duration }` ≤ once a second; `error` carries `{ message }` (bad/malformed URL, unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s). Play/pause are state (watch `paused`), not events. |
| `on:error` | `action` |  | `timeupdate` carries `{ time, duration }` ≤ once a second; `error` carries `{ message }` (bad/malformed URL, unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s). Play/pause are state (watch `paused`), not events. |
| `on:ready` | `action` |  | `timeupdate` carries `{ time, duration }` ≤ once a second; `error` carries `{ message }` (bad/malformed URL, unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s). Play/pause are state (watch `paused`), not events. |
| `on:remoteNext` | `action` |  | Lock-screen next/previous - the markup decides what a "track" is. |
| `on:remotePrev` | `action` |  | Lock-screen next/previous - the markup decides what a "track" is. |
| `on:timeupdate` | `action` |  | `timeupdate` carries `{ time, duration }` ≤ once a second; `error` carries `{ message }` (bad/malformed URL, unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s). Play/pause are state (watch `paused`), not events. |
| `paused` | `expr` |  | Two-way play/pause. |
| `reload` | `number` | `0` | A **changed** value reloads the current `src` - the tap-to-retry primitive after `on:error`. |
| `remoteSkip` | `number` | `15` |  |
| `scrubbing` | `expr` |  | The no-jump-back contract for custom scrubbers: while true it stops publishing `bind`/`time`; on release one frame-precise seek commits. Wire to `on:dragStart`/`on:dragEnd`. |
| `session` | `playback` \| `ambient` | `playback` | `playback` = audible past the silent switch (the music-app contract); `ambient` = respects the switch + mixes. Refcounted, shared with `<video>`'s session. |
| `speed` | `number` | `1` | Playback rate - applied live (no restart); every resume path honors it (podcasts at 1.5×). |
| `src` | `url` |  | Reactive - changing it swaps the track. |
| `start` | `number` | `0` | One-shot initial seek per asset **load** (continue-listening across sessions). |
| `time` | `state-key` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `ended` | `on:ended="..."` |
| `error` | `on:error="..."` |
| `ready` | `on:ready="..."` |
| `remoteNext` | `on:remoteNext="..."` |
| `remotePrev` | `on:remotePrev="..."` |
| `timeupdate` | `on:timeupdate="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The media Web twin implements the fixture's full transport/readout contract: headless HTMLMediaElement playback, reactive transport/scrubbing bindings, bounded ready/time/buffering/error events, a 15-second load deadline, teardown, feature-detected Media Session commands, and the session= playback/ambient category applied through the page-scoped Audio Session API where the engine has one.

**Known limits on the web**

- session= maps to the page-scoped Audio Session API where available (reflected as data-dsx-session and applied while the element plays); native audio categories, mixing, and silent-switch behavior otherwise remain OS policy a browser cannot reproduce.
- Media Session, codecs, autoplay, background playback, and remote controls remain browser/OS policy and are unavailable in some engines.
- Audio is selectively available to self-contained embeds. The latest locked production-equivalent qualification measured 46849 bytes gzip for audio and 46898 bytes for combined audio/video, leaving 3278 bytes below its declared 50176-byte qualification budget; the default self-contained widget budget remains 40960 bytes, and a build-time test pins these figures. The latest move (2026-09-20): three arms of the STATEMENT RUNNER became foldable, and one of them had a fold already. `__DSX_OPTIONAL_BLOCK_CONTROL__` (`throw`/`try`/`switch`) and `__DSX_OPTIONAL_DSX_STDLIB__` were written into the engine and given no roster key, so `embedDefines` set neither and every widget carried both; and the two block folds shed the EXPRESSION evaluator's copy of the machinery while the runner's copy stayed, because a class method is reachable through its class and no bundler can drop one. The runner's five block arms and its five effect verbs (`fetch:`, `remove:`, `animate:`, `resolve:`, `error:`) are module functions behind inline guards now, decided per slice by the words an author spells, and every figure above fell again without a budget moving. The move before (2026-09-08): the expression standard library became optional. `apply` (every bare `name(...)` builtin) and `applyMethod` (every `<value>.name(...)` method) are two switch statements 8360 minified bytes long, and both are reachable only through a call an author SPELLS, so a closed slice that spells none can never enter either one; they now fold behind `__DSX_OPTIONAL_STDLIB_FNS__` and `__DSX_OPTIONAL_STDLIB_METHODS__`, decided per slice against the kernel's own dispatch roster, and every figure above fell again without a budget moving. The move before (2026-09-07): cutting the module alias spine (409785085) took 86 second spellings of a chain head out of the module bus, and bus.ts is on every embed's common path, so every figure above fell without a budget moving. The move before (2026-09-06): three subsystems no self-contained slice can reach had been riding every embed, and removing them is what closed the overage; no budget moved. The custom-design sheet (the appearance lane's style text) now lives in its own module, because a bundler cannot drop a top level template literal from a module it already reached and the mount path only ever wanted the stamp. The standard color grammar that the DOM, the compiler and the SSR renderer share rides `__DSX_OPTIONAL_COLOR_VALUES__`: a slice with a color door keeps the whole grammar and the parity with it, a slice with none sheds it, and the lightbox and svg color doors are refused from an embed outright so playback never opens one. And two guards that RETURNED instead of folding at the reference, the reactive bridge tables in mount.ts and the ReDoS scanner in jse.ts, now fold where the name is used, which is the same law the recognizer and the link rungs already carry. The move before (2026-09-05): standard element color validation adds 248 bytes to audio and 253 bytes to combined playback. The move before (2026-09-04): retiring the Web growth carrier removes 283 bytes from audio and 285 bytes from combined playback while keeping the same qualification ceiling. The move before (2026-09-04): migrated style carriers add 2 bytes to the audio slice and 1 byte to the combined slice. The move before that (2026-09-03): the `-dsx-` plane's web fold (cssmap.ts dsxPropertyToDecls) taught the mount path to read a carrier word from a declaration as well as from an attribute (`node.attrs["grow"] ?? node.attrs["__grow"]`), +15 bytes on each playback embed. The fold TABLE is deliberately NOT in this figure: a `-dsx-` word that is not a declaration reaches the runtime through its carrier, and a hole in one rides that same carrier as the template, so the only runtime door needing the table is the whole-list override hole, which lives inside the style-formula fold and sheds with it. The move before (2026-09-03): the `class:` state-flag directive (dsx-css.md 4.3) is read on the mount path of every element, so its 67 bytes ride in every playback embed; the decision itself (`classDirectiveToken`) lives in cssmap.ts, the module the dom lane imports unconditionally, because declaring it beside the component-boundary laws put those tables back into every slice for 254 bytes. The move before (2026-09-03): the `transform` bridge word (184470a9, the whole function list as one matrix) is one more spelling in the cssmap vocabulary every embed carries, +2 bytes on each playback embed; the transform core itself stays behind the style-formulas fold. The move before (2026-09-02, fourth round): the text whitespace law (`.dsx-text { white-space: pre-line }`, the phones' own rule spelled on the web, +8 bytes) rides in, paid by folding the three author-facing registry sentences (reserved scheme, hollow module, ambiguous component tag) out of self-contained embeds behind __DSX_OPTIONAL_MODULE_DIAGNOSTICS__ - net −116 bytes on each playback embed. The move before (2026-09-02, third round): the has() law (f0e078de - a scheme is available only when its registration answers) put moduleAnswers into every embed's registry, and the hollow-module sentence it logs is pinned out of self-contained embeds (__DSX_OPTIONAL_MODULE_DIAGNOSTICS__), net +75 bytes on each playback embed. The move before (2026-09-02, second round): <video subtitle= quality=> (5ef01167) brought the MSE HLS lane (dom hls-lite.ts, 8.8 KB raw) into both playback embeds through the shared media factory, 333 bytes OVER the qualification; the lane is now pinned out of every self-contained embed (__DSX_OPTIONAL_HLS__, like the link and adopt planes) and the degradation is NAMED at the attach site: an .m3u8 source in an embed plays only where the browser demuxes HLS itself (Safari, iOS - the native pipeline, whose textTracks still carry the cues), and a browser that needs the lane reports it by name through the element's error door, never a silent black frame. The playback selection itself (subtitle=/quality= over the native textTracks, kernel playback-core.ts) stays and is most of the +1,474 this row moved. The move before it (2026-09-02) repaid a 6,319-byte drift the previous pin had not seen (51,473 measured against a rebuilt dist, 1,297 OVER the qualification) without touching the budget: one DSXStrings.localize("Video") in the shared media factory had pulled the whole message tier (kernel strings.ts + message.ts, 11.6 KB raw) into the AUDIO embed, and every factory-authored label now goes through elements.ts localizeLabel, which folds behind __DSX_OPTIONAL_STRINGS__ - 3,962 bytes; then 7 bytes back for the borderEdges bridge word (3ecc0b7e, one spelling in the cssmap vocabulary every embed carries; the per-edge module stays behind the style-formulas fold); the embed common path shed the motion trio, the depth-stack sheet prose, the boundary tables and the path matcher - 2,453 bytes (README, the EmbedCard row). The move before it: the pt-attribute plane went number-typed like the native parsers, 26 bytes, plus 11 from the @despia-native scope rename and 12 from the review round.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** Headless playback element: no visual presentation to adapt (element-support.json).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-audio`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Headless playback element: renders no UI surface (element-support.json: headless HTMLMediaElement); nothing to expose beyond the page it lives in. |
| ios | n/a | 2026-08-18 | Headless playback element: renders no UI surface (element-support.json: headless HTMLMediaElement); nothing to expose beyond the page it lives in. |
| android | n/a | 2026-08-18 | Headless playback element: renders no UI surface (element-support.json: headless HTMLMediaElement); nothing to expose beyond the page it lives in. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

