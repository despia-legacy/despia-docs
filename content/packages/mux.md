---
title: Mux Data
description: Measure how well your videos play with Mux Data.
package: mux
---

Measure how well your videos play with Mux Data.

Sends what your video elements already measure, such as startup time, rebuffering, quality changes, pauses and watch progress, to Mux Data. Use it to see playback quality across devices. Needs a Mux account and your Mux Data environment key. iOS and Android only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you want to see how well your videos play across devices, with startup time, rebuffering and quality changes in Mux Data. It reports what the video element already measures; it does not change playback. Skip it if you do not use Mux.

## Install

```sh
despia add Core/Telemetry/Modules/Mux
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### qoe

`dsx.module.mux.qoe`

Sends one quality-of-experience event from a video element to Mux Data, such as a start, a stall or a quality change.

**When to use it.** Wire it to the video element's qoe event so every event is passed along.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | object | yes | The quality event the video element produced, passed on as it is. |
| `event.bitrate` | number | no | The video bitrate in bits per second, on quality change events. |
| `event.height` | number | no | The video height in pixels, on quality change events. |
| `event.position` | number | no | The playback position in seconds when the event happened. |
| `event.type` | string | yes | Which kind of quality event it is: load, startup, stall, stallEnd, pause, resume, progress, rendition or summary. Any other word sends nothing. |
| `player` | string | no | A name for the video when a screen has several. The default is main. |
| `video` | object | no | Details of the video being watched, shown in Mux Data. |
| `video.id` | string | no | Your own id for the video. |
| `video.series` | string | no | The series or collection the video belongs to. |
| `video.title` | string | no | The title of the video as it should appear in Mux Data. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many Mux Data events were sent for this call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | The user has not agreed to analytics, so Mux Data does not collect. | Nothing to fix; events start once consent is granted. |
| `invalid_env_key` | The Mux Data environment key is not valid. | Copy the key from Mux, under Settings and Environments, into the package settings. |
| `missing_param` | The event, which the video element supplies, was left out. | Pass the event from the video's qoe handler. |
| `not_configured` | The Mux Data script did not load on this page. | Set the environment key and check that the page can reach Mux. |

**Example: Report a stall from the video element**

```js
const result = await dsx.module.mux.qoe({"event":{"position":42.5,"type":"stall"},"player":"main","video":{"id":"ep-1","title":"Episode 1"}});
// resolves {"sent":1}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `env_key` | string | `` | The environment key from Mux, Settings, Environments (letters and digits). Public: it ships in every app that reports to Mux Data. |
| `player_name` | string | `DSX video` | How this app's player appears in Mux Data dashboards. |

## Related packages

- Needs: [Telemetry](/packages/telemetry)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
