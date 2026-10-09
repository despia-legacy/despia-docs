---
title: Sentry
description: Send your app's errors and crash reports to your own Sentry project.
package: sentry
---

Send your app's errors and crash reports to your own Sentry project.

Takes the errors the error reporting package has already captured and cleaned up, and sends each batch straight to your Sentry project over HTTPS. Nothing passes through Despia. You need a Sentry project and its DSN, and the error reporting package does the capturing.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it if your team already uses Sentry and you want app errors to land there. It only sends what the error reporting package captured.

## Install

```sh
despia add Core/Telemetry/Modules/Sentry
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

`dsx.module.sentry.send`

Sends one batch of captured errors to Sentry in a single request. The error reporting package calls it for you, with events already cleaned and de-duplicated.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were dropped on the device before this batch because of limits. |
| `dsn` | string | yes | Your Sentry project's DSN, the address that tells Sentry where events go. |
| `endpoint` | string | no | A custom address to send the data to, when you use one. |
| `environment` | string | no | The environment name to tag events with, such as production. |
| `events` | array of object | yes | The batch of captured events to send, each with an id, a code, a message, a level, a time and its trail of breadcrumbs. |
| `release` | string | no | The app version to tag events with, used to match crash reports to uploaded symbols. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events were sent to Sentry. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_dsn` | That does not parse as a Sentry DSN. | Not recoverable by retrying. |
| `sink_unavailable` | Sentry did not accept the batch. |  |

**Example: sends a batch as one envelope**

```js
const result = await dsx.module.sentry.send({"dsn":"https://abc@o1.ingest.example.com/42","environment":"production","events":[{"code":"native_crash","eventId":"evt_1","message":"SIGSEGV"}]});
// resolves {"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.sentry.send({"dsn":"https://abc@o1.ingest.example.com/42","events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
