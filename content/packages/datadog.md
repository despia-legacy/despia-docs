---
title: Datadog
description: Send your app's error and event logs to Datadog through your own relay.
package: datadog
---

Send your app's error and event logs to Datadog through your own relay.

Turns the events that Telemetry collects into Datadog log records and posts them to a relay on your own server, which forwards them to Datadog with your Datadog API key. The app never holds that key. You run the relay and choose when to turn this destination on.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you already use Datadog for logs and want crash and error events from the app to appear there. You must run an HTTPS relay that holds the API key, because Datadog says API keys must not ship in mobile or browser apps.

## Install

```sh
despia add Core/Telemetry/Modules/Datadog
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### send

`dsx.module.datadog.send`

Posts one batch of events to your relay as Datadog log records. Telemetry calls it for you; you select Datadog in the Telemetry settings.

**When not to.** Do not call it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were discarded before this batch because the queue was full. |
| `endpoint` | string | yes | The https address of your relay that forwards logs to Datadog. |
| `environment` | string | no | The environment name to tag logs with, such as production. |
| `events` | array of object | yes | The collected events to send in this batch. |
| `release` | string | no | The app release to tag logs with. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many log records the relay accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_endpoint` | Datadog needs the app owner's HTTPS relay URL. | Not recoverable by retrying. |
| `sink_unavailable` | The app owner's Datadog relay did not accept the batch. |  |

**Example: maps warning and error records for the owner relay**

```js
const result = await dsx.module.datadog.send({"endpoint":"https://logs.example.com/datadog","environment":"production","events":[{"code":"balance_mismatch","eventId":"evt_1","level":"warning","message":"balance differs"},{"code":"native_crash","eventId":"evt_2","level":"fatal","message":"SIGSEGV"}],"release":"1.4.0"});
// resolves {"sent":2}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
