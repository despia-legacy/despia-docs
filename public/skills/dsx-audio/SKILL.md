---
name: dsx-audio
description: "Build audio in a DSX app: one JSON graph of players, buses, taps and live inputs moved by eight verbs (graph.set, set, play, pause, stop, seek, route.pick, route.set), intents and claims instead of ever touching the audio session, ducking as a rule on the node, the lock screen now-playing surface, recording a voice memo or a bus (audio.record), rendering and analysing files (audio.edit), speech in and out, the per-platform limits, and which parts are still in progress. Use before writing any playback, mixing, recording, voice or podcast feature, and before reaching for AVAudioSession, audio focus or the Web Audio API directly."
---

<!-- GENERATED from OpenSource/Skills/audio.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Audio in a DSX app: players, mixing, recording, editing, speech

> Audience: anyone writing an app that plays, mixes, records, edits or speaks audio (an audiobook,
> a streaming player, a voice memo, a podcast editor, a voice assistant). The exhaustive references are
> the package READMEs: [Core/Audio](https://github.com/despia-native/despia/tree/main/ClosedSource/DSX/Modules/Core/Audio/README.md),
> [Record](https://github.com/despia-native/despia/tree/main/ClosedSource/DSX/Modules/Core/Audio/Modules/Record/README.md) and
> [Edit](https://github.com/despia-native/despia/tree/main/ClosedSource/DSX/Modules/Core/Audio/Modules/Edit/README.md);
> the design is
> [proposals/audio-revamp.md](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/proposals/audio-revamp.md). This page is the
> map and the rules that decide what you write. If a row says "in progress", the call exists in the
> contract and answers a typed refusal today; do not build on it yet.

## 1. One owner, three packages

`Core/Audio` (`dsx.module.audio`) is the only owner of the app's audio session (AVAudioSession on Apple,
audio focus and attributes on Android) and of the lock screen and notification now-playing surface. Nothing
else in your app, and no package, sets a session category or requests focus. Its two children:

| you want | use |
|---|---|
| play, queue, mix, route, a lock screen player | `dsx.module.audio` |
| a voice note, field capture, recording a bus of the mix | `dsx.module.audio.record` |
| render a project of clips to a file; peaks, loudness, silences, chapters of a file | `dsx.module.audio.edit` |
| text to speech | `dsx.module.speechsynthesis` |
| speech to text (the Web Speech API polyfill) | `dsx.module.speechrecognition` |
| a single sound effect or a plain element | the `<audio>` element |

The `<audio>` and `<video>` elements, NativeVideo, Call, SpeechSynthesis and SpeechRecognition all post
claims on Core/Audio, so a call pauses a book and gives it back only if it was playing.

## 2. The graph: declare what should sound

You describe the whole thing as one JSON document and call a handful of verbs. Times are seconds.

```js
await dsx.module.audio.graph.set({ graph: { nodes: [
  { kind: "player", id: "book", intent: "spoken", nowPlaying: true, resume: "book:dune",
    items: [{ id: "dune", src: "documents:books/dune.m4b", title: "Dune", artist: "Frank Herbert" }],
    rate: 1.5, remote: { skip: [-30, 30], next: "chapter", rates: [1, 1.25, 1.5, 2] } }
] } })
await dsx.module.audio.play({ id: "book" })
```

| verb | arguments |
|---|---|
| `graph.set` | `{ graph }`, reconciled by node id (a surviving node keeps its position) |
| `set` | `{ id, ramp?, ...properties }`, any live change, optionally ramped over seconds |
| `play` / `pause` / `stop` | `{ id }`; `play` also takes `at` (graph-clock seconds) |
| `seek` | `{ id }` plus exactly one of `to`, `by`, `item` or `chapter` |
| `route.pick` / `route.set` | the system route sheet, or an output (`speaker`, `receiver`, `bluetooth`, `wired`, a device id) |

There is no `volume`, `speed`, `fade`, `sleep`, `bookmark` or `duck` verb. Each is a property (`gain`,
`rate`, `sleep`, `duck`) or a rule, changed with `graph.set` or `set`. Node kinds are `player`, `bus`, `tap`,
`input` and `output`; a source is an `https://` URL or a Core/Files path (`documents:`, `cache:`, `temp:`,
`shared:`, `bundle:`, `inbox:`), and a base64 string, an absolute path or `file://` is `invalid_source`.

A player's `intent` (`media`, `spoken`, `ambient`, `sfx`, `voice`) is what lets the platform pick the right
session. You never set the session: it is computed from what is sounding, the graph's `others` word
(`interrupt`, `duck`, `mix`) and the claims other packages hold.

### Ducking and layering are rules

```js
{ kind: "player", id: "music", src: "documents:bed.m4a", duck: { when: ["record"], to: 0.2, ramp: 0.25 } }
```

A node that should drop under a recording, a call or a voice says so in its own `duck`. There is no page
script and no `ducked` event to write.

### Live input

An `input` node (`source`, `voiceProcessing`, `monitor`, `channels`) follows `play`, `pause` and `stop`
like a player: declaring it opens nothing, `play({ id })` opens the microphone and needs the grant. Without
it `play` fails `permission_denied`. A `tap` node measures another node (`level`, `spectrum`, `waveform`).
Effects (`eq`, `compressor`, `reverb`, `delay` and the rest of the table in the proposal) and buses run on
the mix tier, which runs on web, iOS and Android.

## 3. Reading state and events

```xml
<text value="{{ dsx.module.audio.context.players.book.position }}" format="duration"/>
```

`dsx.module.audio.context` publishes `players.<id>`, `inputs.<id>`, `session`, `route`, `taps`, `tier`
and `claim`. Events are one broadcast, `audio`, with `{ type, id, ... }` for `item`, `chapter`, `ended`,
`interrupted`, `resumed`, `route`, `remote` (a lock screen button, a headset), `sleep` and `error`:

```js
dsx.on("audio", (e) => { if (e.data.type === "remote" && e.data.button === "like") like(e.data.id); });
```

## 4. Record a voice memo

```xml
<button label="Record" on:tap="dsx.module.audio.record.start({ to: 'documents:memos/note.m4a' })"/>
<LevelMeter level="{{ dsx.global.audio.record.level }}"/>
<text value="{{ dsx.global.audio.record.duration }}" format="duration"/>
<button label="Stop" on:tap="const take = await dsx.module.audio.record.stop(); dsx.variable.path = take.path"/>
```

`state`, `duration` (seconds), `level` (0 to 1, linear in decibels against a -60 dBFS floor) and `peak`
carry the whole UI. `start` is a stream that resolves when the take ends and it asks for the microphone
just in time. A phone call, a headset unplug or backgrounding pauses the take with the bytes kept
(`interrupted`, then `resumable`) and it never resumes by itself; `stop` works from there and the partial
take is a file. `start({ from: "main" })` records a bus of the live mix instead of the microphone, which
needs the graph on the mix tier. m4a works everywhere; opus is refused on iOS and flac where the browser has no
encoder, with `unsupported_format` instead of a substituted lossy file.

## 5. Edit and export

`dsx.module.audio.edit.render({ project, to, format })` mixes a project (tracks of clips with `gain`, `pan`,
`effects`, fades and ducking, and a master `loudness` effect) down to m4a, opus, flac or wav, offline,
and resolves the finished file's integrated loudness and true peak. `analyze({ path, peaks, loudness,
silences, chapters })` reads a file; `peaks` feeds a waveform. The laws are the corpus in
`OpenSource/Conformance/audio`, so the three renderers produce the same file. Playing a project live
through a player node's `project` is in progress and answers `mix_unavailable` today.

## 6. Speech

`dsx.module.speechsynthesis` speaks (stream output) or renders a file; on iOS and Android a stream holds a
`spoken` claim and ducks other audio while it speaks. `dsx.module.speechrecognition` holds a `record` claim
while it listens and fails `not-allowed` without the microphone grant. Neither touches the session.

## 7. Limits that are the operating system

- iOS: a playback session's output is the user's choice, so `route.set` answers `picker_only` and
  `route.pick` opens the AirPlay sheet. The lock screen has three free custom buttons.
- Web: audible playback needs a user gesture (`gesture_required`); a page cannot duck other tabs; the
  Media Session has no rate or custom buttons.
- Cross-origin media needs CORS for `pan`, `gain` above 1, embedded chapters and offline caching on web.

## 8. Not finished yet

Each of these is a named backlog row, not a platform limit, and answers a typed refusal where it is
reachable: `output` nodes and `socket` endpoints, a player `project`, the Vocal pack effects (`tune`,
`robot`, `vocoder`, `harmony`, `denoise`, `isolate`), the packaged player components, desktop facets,
CarPlay and Android Auto browse trees, and the device proof of a take interrupted by a real call.

## 9. Refusals to expect

Graph shape: `invalid_graph`, `invalid_id`, `invalid_value`, `unknown_value`, `unknown_node`, `bus_cycle`,
`out_of_range`, `invalid_source`. Engine tier: `offline_only`, `stream_tier_only`, `mix_unavailable`.
Runtime: `session_failed`, `gesture_required`, `picker_only`, `unsupported_platform`, `permission_denied`.
Each carries `{ path }` naming the node and property.
