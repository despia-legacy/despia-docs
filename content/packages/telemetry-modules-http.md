---
title: Http
description: Sends your app's error and crash reports to a web address you control, with no outside service.
package: http
---

Sends your app's error and crash reports to a web address you control, with no outside service.

Posts each batch of telemetry as one JSON document to an https address you choose, in a documented, stable shape. A small Worker and a table are enough for complete reporting, and the data stays on your own infrastructure. You write the endpoint that receives it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want crash and error reports on your own server instead of a vendor. If you already use a monitoring service, pick that one as the Telemetry destination instead.

## Install

```sh
despia add Core/Telemetry/Modules/Http
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

`dsx.module.http.send`

Posts one batch of events to your endpoint as a single JSON body. If the endpoint refuses it, the events stay queued and are retried later.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were dropped before this batch because of limits. |
| `dsn` | string | no | An optional project identifier, sent along if the destination uses one. |
| `endpoint` | string | yes | The https address that receives the batch. |
| `environment` | string | no | The environment name sent with the batch, such as production. |
| `events` | array of object | yes | The batch of events to deliver, each describing one error, trace or hang. |
| `release` | string | no | The app version sent with the batch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events were accepted by the endpoint. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_endpoint` | The endpoint must be an https address, because telemetry must not cross the network in plain text. | Use an https address. |
| `sink_unavailable` | The endpoint did not accept the batch. | Nothing is lost, as the events stay queued and are retried later. Check that your endpoint answers with a success status. |

**Example: posts a batch to the developer's endpoint**

```js
const result = await dsx.module.http.send({"endpoint":"https://events.example.com/ingest","events":[{"code":"native_crash","eventId":"evt_1"}],"release":"1.4.0"});
// resolves {"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.http.send({"endpoint":"https://events.example.com/ingest","events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
