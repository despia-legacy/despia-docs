---
title: PostHog
description: Sends your app's error and crash reports to PostHog.
package: posthog
---

Sends your app's error and crash reports to PostHog.

Delivers each batch of telemetry to your PostHog project as exception events, so crashes appear in PostHog error tracking, with repeated crashes counted as one issue. Needs a PostHog project token, and you choose the PostHog host if you do not use the default.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your team already tracks product analytics in PostHog and wants crashes there too. For your own server, use the Http destination instead.

## Install

```sh
despia add Core/Telemetry/Modules/PostHog
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

### send

`dsx.module.posthog.send`

Sends one batch of events to PostHog. Each event becomes an exception capture, and repeated ones are counted as occurrences of the same issue.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were dropped before this batch because of limits. |
| `dsn` | string | no | Your PostHog project token, which starts with phc_. |
| `endpoint` | string | no | The PostHog host to send to, if you do not use the default. |
| `environment` | string | no | The environment name sent with the batch, such as production. |
| `events` | array of object | yes | The batch of events to deliver, each describing one error, trace or hang. |
| `release` | string | no | The app version sent with the batch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events PostHog accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_endpoint` | The PostHog host must be https, or http only for a local development host. | Use an https address. |
| `invalid_token` | That is not a PostHog project token, which is phc_ followed by 20 to 64 letters and digits. | Copy the project token from your PostHog settings. |
| `sink_unavailable` | PostHog did not accept the batch. A batch it rejects outright is not retried, and any other failure is. | Check the token and host, and try again later if it keeps failing. |

**Example: an empty batch is not a capture**

```js
const result = await dsx.module.posthog.send({"events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
