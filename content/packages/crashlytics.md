---
title: Firebase Crashlytics
description: Report app crashes to Firebase Crashlytics.
package: crashlytics
---

Report app crashes to Firebase Crashlytics.

Uses Crashlytics as your crash reporter, with user ids, log lines and custom error records. It replaces the Error and crash reporting package's crash handler, so pick one of the two. Takes effect on the next launch. Needs your Firebase project set up in the app.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want crash reports in Firebase Crashlytics. Use it instead of the built-in crash reporter, never alongside it, because two reporters fight over the same system signals.

## What native adds

It records native crashes that a web page cannot see, including ones that kill the app.

## Install

```sh
despia add Core/Firebase/Modules/Crashlytics
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### identify

`dsx.module.crashlytics.identify`

Attaches reports to a user id you choose. Passing an empty id clears it.

**When to use it.** Call it after sign-in, and clear it on sign-out so the next person's crashes are not blamed on the last.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The user id to attach, or an empty text to clear it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The user id now attached, empty when cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: attributes reports to a user id**

```js
const result = await dsx.module.crashlytics.identify({"id":"user_123"});
// resolves {"id":"user_123"}
```

**Example: an empty id is the logout path and clears the attribution**

```js
const result = await dsx.module.crashlytics.identify({"id":""});
// resolves {"id":""}
```

### key

`dsx.module.crashlytics.key`

Saves facts about the app's state, such as the current plan or screen, that are attached to crash reports.

**When to use it.** Use it so a stack trace comes with the context needed to diagnose it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | A map of names to values. Numbers and booleans are kept as text and other types are skipped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many facts were saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_keys` | key needs a non-empty object of key/value pairs. | Not recoverable by retrying. |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: attaches the app state the next report will carry**

```js
const result = await dsx.module.crashlytics.key({"values":{"cart_items":3,"screen":"Checkout"}});
// resolves {"count":2}
```

### log

`dsx.module.crashlytics.log`

Adds a line to the trail kept with the next crash report, so a crash arrives with what the app did just before it.

**When to use it.** Call it on screen changes and key steps. It is cheap and makes no network request.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `message` | string | yes | The line to keep, such as opened Checkout. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the line was kept. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_message` | log needs a non-empty message. | Not recoverable by retrying. |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: records a breadcrumb line for the next report**

```js
const result = await dsx.module.crashlytics.log({"message":"opened Checkout"});
// resolves {"ok":true}
```

### pending

`dsx.module.crashlytics.pending`

Tells you whether a crash report from the previous run is waiting to be sent or deleted.

**When to use it.** Use it to decide whether to show a consent screen. It is false in the usual setup, where reports upload by themselves.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pending` | boolean | yes | True when a report is waiting. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: reports a crash from the previous run waiting for a decision**

```js
const result = await dsx.module.crashlytics.pending({});
// resolves {"pending":true}
```

**Example: reports nothing waiting on an ordinary launch**

```js
const result = await dsx.module.crashlytics.pending({});
// resolves {"pending":false}
```

### record

`dsx.module.crashlytics.record`

Records an error the app survived, so it shows up in Crashlytics as its own issue.

**When to use it.** Use it for handled errors you still want to track, such as a declined card. A log line only decorates the next crash.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | object | no | Extra facts that go with this one error only, as a map of names to values. |
| `message` | string | yes | What went wrong, in words. |
| `name` | string | no | A short name that groups similar errors, such as CheckoutError. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `recorded` | boolean | yes | True when the error was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `empty_event` | record needs a non-empty message. | Not recoverable by retrying. |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: records a caught error as its own issue**

```js
const result = await dsx.module.crashlytics.record({"keys":{"sku":"gold"},"message":"checkout failed: card declined","name":"CheckoutError"});
// resolves {"recorded":true}
```

### start

`dsx.module.crashlytics.start`

Turns on crash uploading. The first time on an install it takes effect from the next launch, and the answer tells you which.

**When to use it.** Call it after the person agrees to crash reporting, or at launch if you collect by default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `collect` | boolean | no | Whether to collect and upload crash reports. True by default; pass false to stop uploads. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `collecting` | boolean | yes | True when reports will be uploaded. |
| `effectiveFrom` | string | yes | When the choice applies: now, or next_launch if the app must restart first. |
| `started` | boolean | yes | True once the choice has been saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `handler_conflict` | Core/Telemetry is already configured and owns this app's crash handler. Two crash reporters truncate each other's reports; choose one. | Not recoverable by retrying. |
| `not_configured` | Firebase is not configured in this build, so Crashlytics has no app to report for. | Not recoverable by retrying. |

**Example: the first opt-in of an install is honest that it takes effect next launch**

```js
const result = await dsx.module.crashlytics.start({});
// resolves {"collecting":false,"effectiveFrom":"next_launch","started":true}
```

**Example: a launch that already carried the opt-in is collecting now**

```js
const result = await dsx.module.crashlytics.start({});
// resolves {"collecting":true,"effectiveFrom":"now","started":true}
```

### submit

`dsx.module.crashlytics.submit`

Uploads or deletes the waiting crash report, depending on the person's answer.

**When to use it.** Call it after the person answers a consent prompt. Sending false deletes the report and does not postpone it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `send` | boolean | yes | True to upload the report, false to delete it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deleted` | boolean | yes | True when the report was deleted. |
| `sent` | boolean | yes | True when the report was uploaded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | There is no unsent Crashlytics report to decide about. | Not recoverable by retrying. |
| `not_started` | Call crashlytics.start first; nothing is collected before the opt-in. | Not recoverable by retrying. |

**Example: uploads the waiting report once the user agreed**

```js
const result = await dsx.module.crashlytics.submit({"send":true});
// resolves {"deleted":false,"sent":true}
```

**Example: deletes it when they did not, rather than keeping it for later**

```js
const result = await dsx.module.crashlytics.submit({"send":false});
// resolves {"deleted":true,"sent":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `upload_symbols` | boolean | `false` | Upload the iOS dSYM and the Android R8 mapping file to Crashlytics on every build, so crash reports arrive readable. Needs the app's real Firebase identity (GoogleService-Info.plist on iOS, the Android Firebase app). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `handler_conflict` | Two crash handlers are installed: Firebase Crashlytics and Core/Telemetry. Reports from one of them will be incomplete. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
