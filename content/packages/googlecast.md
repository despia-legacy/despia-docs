---
title: Google Cast
description: Cast your app's media to Chromecast and other Google Cast TVs.
package: googlecast
---

Cast your app's media to Chromecast and other Google Cast TVs.

Finds Google Cast receivers on the network, starts a session and plays and controls media on the TV. Works with the Cast to TV package, so you use the same cast calls. You can enter your own Cast receiver app id, or leave it blank to use Google's Default Media Receiver.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when you want people to play your app's video or audio on a Chromecast or other Google Cast TV. You do not call it directly: you use the Cast to TV calls and this package answers them for Google Cast receivers.

## What native adds

Uses Google's real Cast sender SDKs on iOS and Android, so receiver discovery, sessions and remote playback work the way people expect.

## Install

```sh
despia add Core/Cast/Modules/GoogleCast
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `local_network_usage` | string | `Find Cast devices on your network to play on your TV.` | Shown by iOS when the app first looks for Cast devices. |
| `receiver_app_id` | string | `` | Your registered receiver's 8 character id from the Google Cast SDK Developer Console. Leave blank for Google's Default Media Receiver. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The person closed the receiver chooser or ended the cast before it started. | Treat it as a normal choice and leave the cast controls as they were. |
| `invalid_position` | A position is 0 or more seconds. |  |
| `invalid_request` | The receiver refused the request. |  |
| `invalid_track` | That track id is not in this media (context.media.tracks). |  |
| `invalid_url` | Cast media is an http(s) URL. |  |
| `media_failed` | The receiver could not play that media. |  |
| `missing_content_type` | Give contentType: the URL has no known media extension. |  |
| `missing_param` | A required argument is missing. |  |
| `network_unavailable` | The receiver could not be reached on this network. |  |
| `no_queue` | No queue is loaded on the receiver. |  |
| `not_allowed` | The receiver does not allow that. |  |
| `not_configured` | The Cast Web Sender is not on this page (load cast_sender.js?loadCastFramework=1). |  |
| `not_connected` | No cast session is running. |  |
| `receiver_unavailable` | The receiver application is not available on that device. |  |
| `sdk_error` | Google's Cast SDK reported an error that has no more specific code. | Try again; if it keeps happening, check the receiver and the network and report the message in the error data. |
| `timed_out` | The receiver did not answer in time. |  |
| `unknown_device` | No discovered receiver has that id. |  |

## Related packages

- Needs: [Cast](/packages/cast)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
