---
title: Bugsnag
description: Send your app's crash and error reports to your own Bugsnag project.
package: bugsnag
---

Send your app's crash and error reports to your own Bugsnag project.

Lets the error reporting package deliver its crash and error reports straight to Bugsnag over HTTPS, using your project API key. Nothing passes through Despia. It only carries the reports, while the telemetry package does the capturing, redacting and queueing.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your team already tracks errors in Bugsnag, including a self-hosted Bugsnag. You choose it as the sink when you configure telemetry.

## Install

```sh
despia add Core/Telemetry/Modules/Bugsnag
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

`dsx.module.bugsnag.send`

Sends one batch of already redacted events to Bugsnag in a single request. The telemetry package calls it for you.

**When not to.** You do not call it yourself. Choose bugsnag as the sink in telemetry.configure.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events the device had to discard because its queue was full. |
| `dsn` | string | yes | Your Bugsnag project API key. |
| `endpoint` | string | no | The notify address of a self-hosted Bugsnag. Leave it out to use Bugsnag's own. |
| `environment` | string | no | The environment name to stamp on the events, such as production. |
| `events` | array of object | yes | The batch of events to send, already redacted, sampled and de-duplicated. |
| `release` | string | no | The release name events are grouped under. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events Bugsnag accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_api_key` | The key is not a Bugsnag project API key, which has 32 hexadecimal characters. | Copy the project API key from your Bugsnag settings. |
| `invalid_endpoint` | The Bugsnag endpoint must use https, or http only to a local development host. | Fix the endpoint address. |
| `sink_unavailable` | Bugsnag did not accept the batch of events. | Nothing is lost, since the events stay queued and are retried later. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.bugsnag.send({"dsn":"0123456789abcdef0123456789abcdef","environment":"production","events":[{"code":"native_crash","eventId":"evt_1","level":"fatal","message":"SIGSEGV (signal 11)"}]});
// resolves {"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.bugsnag.send({"dsn":"0123456789abcdef0123456789abcdef","events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
