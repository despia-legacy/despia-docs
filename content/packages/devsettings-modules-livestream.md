---
title: Stream
description: Watch your app's logs live from a test device on your own relay.
package: stream
---

Watch your app's logs live from a test device on your own relay.

Sends the on-device log, error and diagnostic feed in batches over HTTPS to a relay that you own, so you can watch a test install as it runs. Each session is started after a confirmation, shows a live badge, and can be stopped at any time. It exists only on test builds and never sends data to Despia. You supply the relay and pair the device with a code.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it while testing on a real device when you want to follow logs from your desk, or to send a one-off report to yourself. It is not available in App Store builds, and it only talks to a relay you own.

## Install

```sh
despia add Core/DevSettings/Modules/LiveStream
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### send

`dsx.module.stream.send`

Sends one report with the recent logs and device facts to your relay, without a live session.

**When to use it.** Use it for a send report to developer button on a tester's device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A pairing code or dev://stream link from your dashboard, with the relay, session id and token inside. |
| `relay` | string | no | The https address of your live logs relay. |
| `sid` | string | no | The id of the live session. |
| `token` | string | no | The access token for the relay, when it gave one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `assertion` | boolean | yes | True when the relay accepted the sealed report. |
| `verdict` | string | yes | The relay's answer to the report. |

**Example: a sealed report reaches the paired relay and comes back genuine**

```js
const result = await dsx.module.stream.send({});
// resolves {"assertion":false,"verdict":"genuine"}
```

### start

`dsx.module.stream.start`

Starts a live logging session with a relay you own, after the person confirms.

**When to use it.** Call it after pairing the device by code, QR or link.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A pairing code or dev://stream link from your dashboard, with the relay, session id and token inside. |
| `relay` | string | no | The https address of your live logs relay. |
| `sid` | string | no | The id of the live session. |
| `token` | string | no | The access token for the relay, when it gave one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sid` | string | yes | The id of the live session. |
| `streaming` | boolean | yes | True once the session is running. |

**Example: starts a paired session and answers the session id**

```js
const result = await dsx.module.stream.start({"relay":"https://live.example.dev","sid":"s_9f2c","token":"t_4b1"});
// resolves {"sid":"s_9f2c","streaming":true}
```

### status

`dsx.module.stream.status`

Reports the state of the live session and how much is queued.

**When to use it.** Call it to draw a status row or badge.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | yes | How many old rows were discarded because the queue was full. |
| `paused` | boolean | yes | True while nobody is watching, so only a heartbeat is sent. |
| `queued` | number | yes | How many log rows wait to be acknowledged by the relay. |
| `sid` | string | yes | The id of the live session, empty when none runs. |
| `streaming` | boolean | yes | True while a session is live. |
| `viewers` | number | yes | How many people are watching, as reported by the relay. |

**Example: answers the idle state**

```js
const result = await dsx.module.stream.status({});
// resolves {"dropped":0,"paused":false,"queued":0,"sid":"","streaming":false,"viewers":0}
```

**Example: answers the live state**

```js
const result = await dsx.module.stream.status({});
// resolves {"dropped":0,"paused":false,"queued":0,"sid":"s_9f2c","streaming":true,"viewers":2}
```

### stop

`dsx.module.stream.stop`

Ends the live session; calling it with nothing running is harmless.

**When to use it.** Call it from a stop button or when you are done testing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when a session was running and is now stopped. |

**Example: stops a live session**

```js
const result = await dsx.module.stream.stop({});
// resolves {"stopped":true}
```

**Example: with nothing live, stop is a no-op**

```js
const result = await dsx.module.stream.stop({});
// resolves {"stopped":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `enabled` | boolean | `true` | Master switch for live log streaming on test installs (it never exists on App Store installs regardless of this value). |
| `grace_seconds` | number | `20` | How long a live session survives in the background before it stops itself. |
| `heartbeat_every` | number | `15` | While the wire is paused (nobody watching) or quiet, an empty batch is sent every this-many ticks so the relay's acks keep flowing. |
| `relay` | string | `` | The https origin of your own live-logs relay. Sessions started from a pairing code carry their relay with them; this is the standing default for Send report and code-less starts. |
| `require_confirm` | boolean | `true` | Show a native confirmation before a session starts. Always enforced on TestFlight and ad-hoc installs; turning this off only affects simulator and debug builds. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_streaming` | A live session is already running. | Stop it before starting another. |
| `cancelled` | The person declined the confirmation to start streaming. | Treat it as a choice; offer to start again later. |
| `channel_blocked` | Live streaming only exists on test builds, not in production. | Use a TestFlight, ad hoc or debug build. |
| `invalid_pairing` | The pairing is not usable: it needs a relay, a session id and optionally a token. | Create a new pairing in your dashboard or CLI and make sure the relay address is https. |
| `not_paired` | There is no live session and no pairing to send to. | Start a session or pass a pairing code first. |
| `relay_unreachable` | The relay did not accept the request. | Nothing is lost: queued rows retry by themselves, so only check your relay address if it keeps failing. |
| `seal_failed` | The report could not be sealed before sending. | Try again. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
