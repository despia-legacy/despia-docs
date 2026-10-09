---
title: Console
description: See what your telemetry would send, written to the log with nothing leaving the device.
package: console
---

See what your telemetry would send, written to the log with nothing leaving the device.

A development destination for telemetry that prints each batch of events to the app's log instead of sending it anywhere. It makes no network requests and needs no account, so you can check exactly what a real service would receive. You choose it while wiring up a project, then switch to a real destination.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it while you set up telemetry and want to see the events before you connect a real service. It is for development, not for collecting data from users.

## Install

```sh
despia add Core/Telemetry/Modules/Console
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

`dsx.module.console.send`

Writes a batch of telemetry events to the app log and finishes. It makes no network request at all.

**When to use it.** Choose it as the telemetry destination while developing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were dropped before this batch because the queue was full. |
| `dsn` | string | no | The address of a real destination; ignored here. |
| `endpoint` | string | no | The server address of a real destination; ignored here. |
| `environment` | string | no | The environment name, such as production or staging, shown with the batch. |
| `events` | array of object | yes | The batch of events to write to the log. |
| `release` | string | no | The app release the batch belongs to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events were written to the log. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform has no log to write to. | Use another telemetry destination there. |

**Example: logs each event and reports how many it wrote**

```js
const result = await dsx.module.console.send({"events":[{"code":"native_crash","eventId":"evt_1","message":"SIGSEGV"},{"code":"main_thread_hang","eventId":"evt_2"}]});
// resolves {"sent":2}
```

**Example: an empty batch logs nothing**

```js
const result = await dsx.module.console.send({"events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
