---
title: video
description: The media Web twin implements the fixture's full contract: native HTML video rendering, active-page ownership, reactive transport/scrubbing/readout bindings, subtitles, bounded load/error state, accurate isolated target-frame previews, best-effort Media Session commands, the audio= playback/ambient category via the page-scoped Audio Session API where present, accessibility, and deterministic SSR.
order: 3
section: components
element: video
category: media
scope: library
platforms: web,ios,android
properties: [{"name":"active","type":"bool","default":"true"},{"name":"audio","type":"enum","default":"ambient","values":["playback","ambient"]},{"name":"autoplay","type":"bool","default":"true"},{"name":"bind","type":"expr","default":null},{"name":"buffering","type":"state-key","default":null},{"name":"cue","type":"state-key","default":null},{"name":"duration","type":"state-key","default":null},{"name":"gravity","type":"enum","default":"fill","values":["fill","fit"]},{"name":"loop","type":"bool","default":"false"},{"name":"muted","type":"bool","default":"false"},{"name":"nowArtist","type":"string","default":null},{"name":"nowPlaying","type":"bool","default":"false"},{"name":"nowTitle","type":"string","default":null},{"name":"on:ended","type":"action","default":null},{"name":"on:error","type":"action","default":null},{"name":"on:qoe","type":"action","default":null},{"name":"on:ready","type":"action","default":null},{"name":"on:remoteNext","type":"action","default":null},{"name":"on:remotePrev","type":"action","default":null},{"name":"on:timeupdate","type":"action","default":null},{"name":"paused","type":"expr","default":null},{"name":"pip","type":"bool","default":"false"},{"name":"preview","type":"state-key","default":null},{"name":"quality","type":"string","default":"auto"},{"name":"reload","type":"number","default":"0"},{"name":"remoteSkip","type":"number","default":"5"},{"name":"resolution","type":"state-key","default":null},{"name":"scrubbing","type":"expr","default":null},{"name":"speed","type":"number","default":"1"},{"name":"src","type":"url","default":null},{"name":"start","type":"number","default":"0"},{"name":"subtitle","type":"string","default":null},{"name":"subtitles","type":"bool","default":"false"},{"name":"time","type":"state-key","default":null},{"name":"tracks","type":"state-key","default":null},{"name":"variants","type":"state-key","default":null}]
actions: ["ended","error","qoe","ready","remoteNext","remotePrev","timeupdate"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# video

The media Web twin implements the fixture's full contract: native HTML video rendering, active-page ownership, reactive transport/scrubbing/readout bindings, subtitles, bounded load/error state, accurate isolated target-frame previews, best-effort Media Session commands, the audio= playback/ambient category via the page-scoped Audio Session API where present, accessibility, and deterministic SSR.

<RefMeta platforms="Web,iOS,Android">
Category: Media - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<video src="{{ dsx.variable.stream }}" paused="dsx.variable.paused" bind="dsx.variable.pos" gravity="fill"/>
```

`video` takes no children.

## Catalog specimen

`VideoDefault.dsx`, verbatim from the catalog:

```dsx
<video bind="dsx.variable.pos" style="width: 100%; aspect-ratio: 16 / 9">
  <head>
    <variable as="pos">return 0</variable>
  </head>
</video>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | Real-engine media-surfaces oracle (run green this audit in Chromium): active/inactive page-ownership handoff (an inactive preload never clobbers shared transport), scrubbing seek + isolated target-frame preview, unsafe-src rejection, ready/buffering/error lifecycle, teardown, and the audio= category reflected (data-dsx-session, ambient default) - loading/error/empty covered; no hover/pressed axis exists on the chrome-less surface. |
| ios | review | 2026-08-18 | State-driven playback: two-way paused/bind, buffering/time/duration readouts, scrubbing no-jump-back + one frame-precise commit, preview thumbnails while scrubbing, active gating for multi-video layouts, ready/ended/timeupdate/error events, subtitles legible-track selection (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Media/Video/swift/Video.swift header contract + AVPlayer observers). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: loading/error axis is the reactive contract: buffering (Bool key) + on:ready/on:ended/on:error events; scrubbing no-jump-back; paused/bind two-way state, no imperative calls (MediaElements.kt header, Video.swift behavior-for-behavior on ExoPlayer). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `active` | `bool` | `true` | Multi-video layouts (a pager mounts several): only the active video plays and publishes its bindings; an inactive one **preloads its asset** (loads, never plays, never touches the shared readouts) and is hard-paused and silent - and it **keeps its position**. Re-activation **resumes** there instantly (adopting + publishing its own position into the shared bindings, so a scrubber snaps to the resume point); a clip that already **finished restarts** from the top. Never write the position binding on a page change - the activating video owns it. |
| `audio` | `playback` \| `ambient` | `ambient` | `"playback"` claims the movie-playback audio session (sound with the silent switch on). Refcounted; released when the last claiming video unmounts (other apps' music resumes). |
| `autoplay` | `bool` | `true` | Re-arms when `active` flips back on. |
| `bind` | `expr` |  | Two-way position fraction - a scrubber sharing the key seeks the video, playback moves the fill. A value already in the store when the asset **loads** is adopted as the starting state (it never seeks retroactively); only writes made after load seek. |
| `buffering` | `state-key` |  | Published read-only: `<spinner visible-if="buffering"/>`. |
| `cue` | `state-key` |  | Published read-only: the TEXT of the active legible cue (`''` when none; several cues joined with a newline, trimmed). **Binding it suppresses the platform's own subtitle drawing** (AVPlayerLayer, ExoPlayer's SubtitleView, `::cue`) so the app draws the line itself, in its own type at its own position - the custom-UI law: the same pixels on three lanes. Unbound, the platform draws as before. |
| `duration` | `state-key` |  |  |
| `gravity` | `fill` \| `fit` | `fill` | `fill` / `fit`. |
| `loop` | `bool` | `false` |  |
| `muted` | `bool` | `false` |  |
| `nowArtist` | `string` |  |  |
| `nowPlaying` | `bool` | `false` | Lock-screen / Control Center transport (`MPNowPlayingInfo` + remote commands). `nowTitle` / `nowArtist` fill the widget (reactive); play/pause/±skip work out of the box (`remoteSkip` = step, default 5 s; pause writes the bound `paused` key). With several videos mounted, the **playing** one owns the widget. |
| `nowTitle` | `string` |  |  |
| `on:ended` | `action` |  | `timeupdate` carries `{ time, duration }` at most once a second; `error` carries `{ message }` when the active clip fails - a bad/malformed URL, an unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s (the load-timeout guard, so a dead origin never hangs forever on a spinner). An inactive preload that fails reports when it's swiped into view. Play/pause are state (watch the `paused` key), not events. |
| `on:error` | `action` |  | `timeupdate` carries `{ time, duration }` at most once a second; `error` carries `{ message }` when the active clip fails - a bad/malformed URL, an unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s (the load-timeout guard, so a dead origin never hangs forever on a spinner). An inactive preload that fails reports when it's swiped into view. Play/pause are state (watch the `paused` key), not events. |
| `on:qoe` | `action` |  | Quality of experience, PROPOSED (`OpenSource/Documentation/architecture/proposals/video-qoe.md`). Each event carries `{ type, … }`: `load` when a view starts; `startup` `{ startupMs }` once per view; `stall` `{ position, stalls }` for a wait after the first frame (never a seek's own buffering); `stallEnd` `{ stallMs, totalStallMs }`; `rendition` `{ height, bitrate, previousHeight, previousBitrate }` on a change; `summary` `{ startupMs, stalls, stallMs, height, bitrate }` once when the view ends; `pause` and `resume` around a pause; `progress` each whole second of playhead while playing. Every event carries `position`, the playhead in seconds. Counted by one fold on every renderer (`OpenSource/Conformance/media/qoe.json`). |
| `on:ready` | `action` |  | `timeupdate` carries `{ time, duration }` at most once a second; `error` carries `{ message }` when the active clip fails - a bad/malformed URL, an unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s (the load-timeout guard, so a dead origin never hangs forever on a spinner). An inactive preload that fails reports when it's swiped into view. Play/pause are state (watch the `paused` key), not events. |
| `on:remoteNext` | `action` |  | Lock-screen next/previous track - the markup decides (e.g. next episode). |
| `on:remotePrev` | `action` |  | Lock-screen next/previous track - the markup decides (e.g. next episode). |
| `on:timeupdate` | `action` |  | `timeupdate` carries `{ time, duration }` at most once a second; `error` carries `{ message }` when the active clip fails - a bad/malformed URL, an unplayable asset, mid-stream death, or a CDN that neither plays nor fails within ~15 s (the load-timeout guard, so a dead origin never hangs forever on a spinner). An inactive preload that fails reports when it's swiped into view. Play/pause are state (watch the `paused` key), not events. |
| `paused` | `expr` |  | Two-way play/pause. |
| `pip` | `bool` | `false` | Picture-in-Picture: auto-enters when the app backgrounds while playing; user can invoke from Control Center. |
| `preview` | `state-key` |  | While scrubbing: publishes scrub-frame thumbnails as tmp file-URLs - float `<image src="{{ preview }}"/>` above the thumb. |
| `quality` | `string` | `auto` | **A cap on the rendition ladder**: `auto` (the player's own adaptive selection) or a height (`720`, `480p`). The largest rung at or under the cap plays; below the whole ladder, the floor. Resolved against the published `variants` (playback-selection.json `capQuality`); a progressive asset has nothing to cap. Reactive; re-asserted per dsx.this. |
| `reload` | `number` | `0` | A **changed** value forces the current `src` to reload from scratch - the tap-to-retry primitive after `on:error` (bump a nonce). Unchanged = no effect. |
| `remoteSkip` | `number` | `5` |  |
| `resolution` | `state-key` |  | Published read-only: the height in pixels of the rendition rendering NOW (`videoHeight` / `presentationSize` / `videoFormat`), `0` until known, on change only - what `Auto(720p)` reads. |
| `scrubbing` | `expr` |  | The no-jump-back contract for **custom scrubbers**: while true the video stops publishing `bind`/`time` (the finger owns the position); on release one frame-precise seek commits. Wire to `on:dragStart`/`on:dragEnd`. |
| `speed` | `number` | `1` | Playback rate - applied live (no restart, no re-assert per render), and every resume path (play/pause, PiP, interruptions, remote play) honors it. |
| `src` | `url` |  | Reactive - changing it swaps the asset. An HLS master (`.m3u8`) plays on every lane: AVPlayer and ExoPlayer natively, and on the web through the renderer's own dependency-free MSE lane (`dom/src/hls-lite.ts` - VOD fMP4 ladders + WebVTT renditions) wherever `MediaSource` exists, so the ladder and the subtitle renditions publish as `variants`/`tracks` on Chrome, Firefox and desktop Safari exactly as they do natively; a browser with no MSE (iPhone Safari) keeps its native pipeline. Child URIs inherit the master URL's query string (a tokenized grant rides the whole tree). |
| `start` | `number` | `0` | One-shot initial seek, applied once per asset **load** (the HTML `#t=` twin - continue-watching across sessions). Never re-applied on re-activation or re-render; after load, position belongs to playback, the bindings and the resume logic. |
| `subtitle` | `string` |  | **The picker's word**: a BCP-47 tag (`ja`, `pt-BR`, `zh-Hant`) or `off`. Picks a legible track BY TAG against the published `tracks` list - exact tag, then primary language, else nothing (never the platform default) - through the renderer-neutral core in `Conformance/media/playback-selection.json`, so one request resolves identically on three renderers. Present at all, it wins over the bool `subtitles`. Reactive. |
| `subtitles` | `bool` | `false` | Embedded legible track (HLS closed captions / `.legible` group): `true` selects the preferred-language option, `false` deselects. Reactive. Assets with no legible group (most progressive MP4s) no-op. |
| `time` | `state-key` |  |  |
| `tracks` | `state-key` |  | Published read-only: the legible renditions the current item carries, `[{ lang, label }]` in declared order - `lang` as the asset tags it, `label` the asset's own name (an endonym, never translated by the engine); `[]` for a progressive asset. The list an option sheet renders. |
| `variants` | `state-key` |  | Published read-only: the video renditions of the ladder, `[{ height, bitrate }]` distinct heights ascending; `[]` for a progressive asset. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `ended` | `on:ended="..."` |
| `error` | `on:error="..."` |
| `qoe` | `on:qoe="..."` |
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

The media Web twin implements the fixture's full contract: native HTML video rendering, active-page ownership, reactive transport/scrubbing/readout bindings, subtitles, bounded load/error state, accurate isolated target-frame previews, best-effort Media Session commands, the audio= playback/ambient category via the page-scoped Audio Session API where present, accessibility, and deterministic SSR.

**Known limits on the web**

- audio= maps to the page-scoped Audio Session API where available (reflected as data-dsx-session and applied while the element plays); automatic background Picture-in-Picture is not promised and pip only feature-gates browser PiP availability.
- Target-frame preview requires the media to be canvas-readable (same-origin, blob, or CORS-enabled) and fails closed otherwise; codec, autoplay, subtitles, background playback, and Media Session behavior vary by browser/OS.
- Video is selectively available to self-contained embeds. The latest locked production-equivalent qualification measured 45088 bytes gzip for video and 45126 bytes for combined audio/video, leaving 5050 bytes below its declared 50176-byte qualification budget; the default self-contained widget budget remains 40960 bytes, and a build-time test pins these figures. The latest move (2026-09-20): three arms of the STATEMENT RUNNER became foldable, and one of them had a fold already. `__DSX_OPTIONAL_BLOCK_CONTROL__` (`throw`/`try`/`switch`) and `__DSX_OPTIONAL_DSX_STDLIB__` were written into the engine and given no roster key, so `embedDefines` set neither and every widget carried both; and the two block folds shed the EXPRESSION evaluator's copy of the machinery while the runner's copy stayed, because a class method is reachable through its class and no bundler can drop one. The runner's five block arms and its five effect verbs (`fetch:`, `remove:`, `animate:`, `resolve:`, `error:`) are module functions behind inline guards now, decided per slice by the words an author spells, and every figure above fell again without a budget moving. The move before (2026-09-08): the expression standard library became optional. `apply` (every bare `name(...)` builtin) and `applyMethod` (every `<value>.name(...)` method) are two switch statements 8360 minified bytes long, and both are reachable only through a call an author SPELLS, so a closed slice that spells none can never enter either one; they now fold behind `__DSX_OPTIONAL_STDLIB_FNS__` and `__DSX_OPTIONAL_STDLIB_METHODS__`, decided per slice against the kernel's own dispatch roster, and every figure above fell again without a budget moving. The move before (2026-09-07): cutting the module alias spine (409785085) took 86 second spellings of a chain head out of the module bus, and bus.ts is on every embed's common path, so every figure above fell without a budget moving. The move before (2026-09-06): three subsystems no self-contained slice can reach had been riding every embed, and removing them is what closed the overage; no budget moved. The custom-design sheet (the appearance lane's style text) now lives in its own module, because a bundler cannot drop a top level template literal from a module it already reached and the mount path only ever wanted the stamp. The standard color grammar that the DOM, the compiler and the SSR renderer share rides `__DSX_OPTIONAL_COLOR_VALUES__`: a slice with a color door keeps the whole grammar and the parity with it, a slice with none sheds it, and the lightbox and svg color doors are refused from an embed outright so playback never opens one. And two guards that RETURNED instead of folding at the reference, the reactive bridge tables in mount.ts and the ReDoS scanner in jse.ts, now fold where the name is used, which is the same law the recognizer and the link rungs already carry. The move before (2026-09-05): standard element color validation adds 248 bytes to video and 253 bytes to combined playback. The move before (2026-09-04): retiring the Web growth carrier removes 283 bytes from video and 285 bytes from combined playback while keeping the same qualification ceiling. The move before (2026-09-04): migrated style carriers add 2 bytes to the video slice and 1 byte to the combined slice. The move before that (2026-09-03): the `-dsx-` plane's web fold (cssmap.ts dsxPropertyToDecls) taught the mount path to read a carrier word from a declaration as well as from an attribute (`node.attrs["grow"] ?? node.attrs["__grow"]`), +15 bytes on each playback embed. The fold TABLE is deliberately NOT in this figure: a `-dsx-` word that is not a declaration reaches the runtime through its carrier, and a hole in one rides that same carrier as the template, so the only runtime door needing the table is the whole-list override hole, which lives inside the style-formula fold and sheds with it. The move before (2026-09-03): the `class:` state-flag directive (dsx-css.md 4.3) is read on the mount path of every element, so its 67 bytes ride in every playback embed; the decision itself (`classDirectiveToken`) lives in cssmap.ts, the module the dom lane imports unconditionally, because declaring it beside the component-boundary laws put those tables back into every slice for 254 bytes. The move before (2026-09-03): the `transform` bridge word (184470a9, the whole function list as one matrix) is one more spelling in the cssmap vocabulary every embed carries, +2 bytes on each playback embed; the transform core itself stays behind the style-formulas fold. The move before (2026-09-02, fourth round): the text whitespace law (`.dsx-text { white-space: pre-line }`, the phones' own rule spelled on the web, +8 bytes) rides in, paid by folding the three author-facing registry sentences (reserved scheme, hollow module, ambiguous component tag) out of self-contained embeds behind __DSX_OPTIONAL_MODULE_DIAGNOSTICS__ - net −116 bytes on each playback embed. The move before (2026-09-02, third round): the has() law (f0e078de - a scheme is available only when its registration answers) put moduleAnswers into every embed's registry, and the hollow-module sentence it logs is pinned out of self-contained embeds (__DSX_OPTIONAL_MODULE_DIAGNOSTICS__), net +75 bytes on each playback embed. The move before (2026-09-02, second round): <video subtitle= quality=> (5ef01167) brought the MSE HLS lane (dom hls-lite.ts, 8.8 KB raw) into both playback embeds through the shared media factory, 336 bytes OVER the qualification; the lane is now pinned out of every self-contained embed (__DSX_OPTIONAL_HLS__, like the link and adopt planes) and the degradation is NAMED at the attach site: an .m3u8 source in an embed plays only where the browser demuxes HLS itself (Safari, iOS - the native pipeline, whose textTracks still carry the cues), and a browser that needs the lane reports it by name through the element's error door, never a silent black frame. The playback selection itself (subtitle=/quality= over the native textTracks, kernel playback-core.ts) stays and is most of the +1,474 this row moved. The move before it (2026-09-02) repaid a 6,322-byte drift the previous pin had not seen (51,478 measured against a rebuilt dist, 1,302 OVER the qualification) without touching the budget: one DSXStrings.localize("Video") in the shared media factory had pulled the whole message tier (kernel strings.ts + message.ts, 11.6 KB raw) into both playback embeds, and every factory-authored label now goes through elements.ts localizeLabel, which folds behind __DSX_OPTIONAL_STRINGS__ - 3,965 bytes; then 7 bytes back for the borderEdges bridge word (3ecc0b7e, one spelling in the cssmap vocabulary every embed carries; the per-edge module stays behind the style-formulas fold); the embed common path shed the motion trio, the depth-stack sheet prose, the boundary tables and the path matcher - 2,453 bytes (README, the EmbedCard row). The move before it: the pt-attribute plane went number-typed like the native parsers, 26 bytes, plus 11 from the @despia-native scope rename and 12 from the review round.

**Implementation notes.** subtitle/quality + tracks/variants/resolution (2026-09-02): the option-sheet contract for a player that lets a viewer pick a legible track by language and pin a rendition height; the choice itself is the renderer-neutral core in Conformance/media/playback-selection.json (TS kernel playback-core · Kotlin :core PlaybackCore · Swift Engine/Swift/PlaybackCore), so three renderers resolve one request identically against the lists they publish.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** Declared identical at all widths: fills its container with gravity= mapping to object-fit (fit=contain asserted in the oracle this audit; fill=cover default), playsinline, no directional chrome so RTL-safe by construction; safe-area not applicable (no edge-attached chrome).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-video`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | Default accessible name 'Video' and authored a11yLabel both asserted in the oracle this audit; controls=false keeps the page's own accessible transport authoritative; subtitles= drives text-track modes (language-preferred); the audio twin stays aria-hidden; demo sweeps 0 serious/critical. |
| ios | review | 2026-08-18 | Chrome-less by contract (controls are authored DSX and carry the control a11y); embedded captions via subtitles= legible-track selection; the system remote transport (MPNowPlayingInfo) is itself an assistive surface. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Media/Video/swift/Video.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: no controller chrome BY CONTRACT (MediaElements.kt: PlayerView, no controller - controls are authored markup, which carries its own semantics); the surface itself is content. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

