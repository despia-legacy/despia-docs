---
title: Error and crash reporting
description: Report crashes, hangs and errors from your app to the monitoring service you choose.
package: telemetry
---

Report crashes, hangs and errors from your app to the monitoring service you choose.

Catches native crashes, frozen screens, errors your app logs, failed package calls and uncaught page errors, then uploads them to Sentry, Datadog, Bugsnag or another listed service. Nothing is collected until you choose a service, and personal data can be redacted. Needs an account and project key with that service.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want to learn about crashes and errors on real devices, sent to a service you own. Nothing is collected or sent until you call configure, so it is also safe to leave in a build you do not want reporting yet.

## What native adds

It catches true native crashes and frozen screens, writes them to disk as they happen and uploads on the next launch, which a web page cannot do.

## Install

```sh
despia add Core/Telemetry
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

### breadcrumb

`dsx.module.telemetry.breadcrumb`

Records a short note about what the person was doing, so a later crash report shows the steps before it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `category` | string | yes | A group for the note, such as navigation or network. |
| `data` | object | no | Extra details to keep with the note. |
| `level` | string | no | How serious the note is, such as info or warning. |
| `message` | string | yes | What happened, in a short sentence. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the note was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |

**Example: records a breadcrumb**

```js
const result = await dsx.module.telemetry.breadcrumb({"category":"nav","message":"opened Checkout"});
// resolves {"ok":true}
```

**Example: scrubs a breadcrumb at enqueue, not at send**

```js
const result = await dsx.module.telemetry.breadcrumb({"category":"auth","message":"signed in as ada@example.com"});
// resolves {"ok":true}
```

### capture

`dsx.module.telemetry.capture`

Reports an error or message by hand, for problems your code catches itself. Crashes and failed calls are captured automatically.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `context` | object | no | Extra details to attach to this report. |
| `error` | object | no | The error to report, with an optional code and message. |
| `error.code` | string | no | A short error code to group the report by. |
| `error.message` | string | no | The error text shown on the report. |
| `fingerprint` | string | no | A value that groups reports together as one issue. |
| `level` | string | no | How serious the report is, such as error or warning. |
| `message` | string | no | A text message to report, when you have no error object. |
| `tags` | object | no | Labels to filter reports by. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `eventId` | string | yes | The id given to the queued event, useful to find it in your dashboard. |
| `sampled` | boolean | yes | True when the event was kept by sampling and will be sent. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Telemetry is off because the person did not give consent. | Do not send reports. Ask again only when it fits your consent flow. |
| `empty_event` | A capture needs a message or an error and got neither. | Pass a message or an error object. |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |

**Example: captures a message**

```js
const result = await dsx.module.telemetry.capture({"level":"error","message":"checkout failed"});
// resolves {"eventId":"evt_1","sampled":true}
```

**Example: an event the sample rate excluded says so instead of pretending**

```js
const result = await dsx.module.telemetry.capture({"fingerprint":"app|noisy|","message":"noisy"});
// resolves {"eventId":"evt_1","sampled":false}
```

### configure

`dsx.module.telemetry.configure`

Switches telemetry on by choosing where reports go and how they are sampled. Until it succeeds nothing is captured, queued or sent.

**When to use it.** Call it once at startup, after you have the person's consent if your app asks for it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dsn` | string | no | The project key from your own account with the service. |
| `endpoint` | string | no | For the http sink, the https address that receives batches. |
| `environment` | string | no | A name stamped on every report, such as production or staging. |
| `release` | string | no | The release name reports are grouped under, usually the app version. |
| `sampleRate` | number | no | The share of error events to send, from 0 to 1. |
| `scrub` | boolean | no | Set it to false to stop redacting emails, tokens and similar data before events are stored or sent. |
| `sink` | string | yes | Which reporting service receives events, such as sentry, http or console. |
| `tracesSampleRate` | number | no | The share of performance spans to send, from 0 to 1. It is 0 by default. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `configured` | boolean | yes | True when telemetry is now switched on. |
| `sink` | string | yes | The reporting service that was chosen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Telemetry is off because the person did not give consent. | Do not send reports. Ask again only when it fits your consent flow. |
| `invalid_dsn` | This service needs a project key and none was given. | Pass the project key from your own account with that service. |
| `invalid_endpoint` | This sink needs an https address and none was given. | Pass an https endpoint you control. |
| `unknown_sink` | No reporting service with that name is part of this build. | Use one of the listed services, or add its package to the app. |

**Example: configures the console sink, which needs nothing**

```js
const result = await dsx.module.telemetry.configure({"sink":"console"});
// resolves {"configured":true,"sink":"console"}
```

**Example: configures a vendor sink with a project key**

```js
const result = await dsx.module.telemetry.configure({"dsn":"https://abc@o1.ingest.example.com/42","environment":"staging","sampleRate":1,"sink":"sentry"});
// resolves {"configured":true,"sink":"sentry"}
```

### flush

`dsx.module.telemetry.flush`

Sends what is queued now and tells you what is left. It also runs when the app goes to the background.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `timeout` | number | no | The longest to wait for the send, in milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pending` | number | yes | How many events are still waiting. |
| `sent` | number | yes | How many events were sent. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |
| `sink_unavailable` | The reporting service did not accept the batch. | Nothing is lost. The events stay queued and are retried later. |

**Example: flushes an empty queue without touching the network**

```js
const result = await dsx.module.telemetry.flush({});
// resolves {"pending":0,"sent":0}
```

**Example: sends what is queued**

```js
const result = await dsx.module.telemetry.flush({});
// resolves {"pending":0,"sent":3}
```

### identify

`dsx.module.telemetry.identify`

Tells the reporting service who the affected person is, using only the fields you choose to pass.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributes` | object | no | Extra details about the person to attach to reports. |
| `email` | string | no | The person's email address, sent only because you passed it. |
| `id` | string | no | Your own id for the person. |
| `username` | string | no | The person's username as it should appear on reports. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id now attached to reports. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |

**Example: identifies a user by id**

```js
const result = await dsx.module.telemetry.identify({"id":"user_123"});
// resolves {"id":"user_123"}
```

**Example: clears the identity when called with nothing**

```js
const result = await dsx.module.telemetry.identify({});
// resolves {"id":""}
```

### setContext

`dsx.module.telemetry.setContext`

Attaches one key and value to every report from now on, such as a plan name or tenant.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the detail, such as plan. |
| `value` | string | yes | What to record under that name, as text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the detail was stored. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_key` | A context key must not be empty. | Pass a non-empty key. |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |

**Example: attaches a dimension to every later event**

```js
const result = await dsx.module.telemetry.setContext({"key":"plan","value":"pro"});
// resolves {"ok":true}
```

**Example: a sensitive key redacts its value rather than refusing the call**

```js
const result = await dsx.module.telemetry.setContext({"key":"authorization","value":"Bearer sk_live_REPLACE_ME"});
// resolves {"ok":true}
```

### trace.end

`dsx.module.telemetry.trace.end`

Closes a performance span and reports how long it was open.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that trace.start returned. |
| `status` | string | no | How the work ended, such as ok or error. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durationMs` | number | yes | How long the span was open, in milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |
| `unknown_trace` | No open span has that id. | Pass the id that trace.start returned, and end each span only once. |

**Example: closes a span and reports its duration**

```js
const result = await dsx.module.telemetry.trace.end({"id":"trace_1","status":"ok"});
// resolves {"durationMs":0}
```

### trace.start

`dsx.module.telemetry.trace.start`

Opens a performance span so you can time a piece of work. Spans are sent only when tracesSampleRate is above 0.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | A name for the work being timed. |
| `op` | string | no | The kind of operation, such as http or ui.load. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id to pass to trace.end. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Telemetry has not been switched on yet, so nothing can be recorded. | Call configure first with a sink and its project key. |

**Example: opens a span and returns its id**

```js
const result = await dsx.module.telemetry.trace.start({"name":"checkout","op":"ui.load"});
// resolves {"id":"trace_1"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `anr_threshold_ms` | number | `5000` | How long the main thread may be blocked before it is reported as a hang. |
| `auto_start` | boolean | `false` | Configure telemetry at launch from these values, instead of waiting for a telemetry.configure call in the app. |
| `batch_size` | number | `32` | How many events are sent in one request. |
| `dedupe_window_ms` | number | `60000` | Repeats of the same issue inside this window are counted rather than sent again. |
| `dsn` | string | `` | The project key from your own Sentry or PostHog account. Despia never sees it and never receives your reports. |
| `endpoint` | string | `` | For the http sink, the https address a batch of events is sent to. Any server you control works, so a small Worker and a table is complete telemetry with no vendor. |
| `environment` | string | `` | The environment name stamped on every report, such as production or staging. Empty follows the build's own channel. |
| `provider` | string | `` | Which provider package receives crash and error reports: sentry, posthog, http (your own endpoint), or console (development only). Leave empty to collect nothing. |
| `queue_capacity` | number | `200` | How many events are held while offline. When it is full the oldest are dropped, and the drop itself is reported. |
| `release` | string | `` | The release identifier reports are grouped under. Empty uses the app version and build number. |
| `sample_rate` | number | `1` | The share of error events that are sent, from 0 to 1. Sampling is by issue, so a rare crash is never lost to a busy one. |
| `scrub` | boolean | `true` | Redacts anything shaped like an email, a token, a phone number, a card number or a home folder path before an event is stored or sent. |
| `sink` | string | `` | Retired spelling of `provider`; still read as the same choice. Set `provider` instead. |
| `trace_provider` | string | `` | Optional: the trace row (for example firebaseperformance) that trace.start and trace.end also start and stop live. Empty means spans stay with the sink. |
| `traces_sample_rate` | number | `0` | The share of performance spans that are sent, from 0 to 1. Off by default. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Telemetry is off because the person did not give consent. | Do not send reports. Ask again only when it fits your consent flow. |
| `queue_full` | The offline queue is full, so the oldest events were dropped. | Nothing to do. The drop is reported with the next batch. |
| `sink_unavailable` | The reporting service did not accept the batch. | Nothing is lost. The events stay queued and are retried later. |

## Related packages

- Used by: [FirebasePerformance](/packages/firebaseperformance), [LogRocket](/packages/logrocket), [Mux](/packages/mux)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
