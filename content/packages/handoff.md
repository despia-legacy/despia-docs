---
title: Handoff
description: Let people start in your app on an iPhone and continue on a Mac or iPad.
package: handoff
---

Let people start in your app on an iPhone and continue on a Mac or iPad.

Advertises what the person is doing so a nearby Apple device offers to pick it up, with a web address as a fallback for devices without your app. It checks the activity type and payload size for you, because Apple fails silently when either is wrong. You decide the activity types and what small identifiers to hand over.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when a task, such as reading a recipe or editing a note, makes sense to continue on another Apple device. Hand over an identifier and fetch the rest on the other side; do not try to pass whole documents.

## What native adds

It uses Apple's continuity, which shows the app on the other device's dock or app switcher with no sign-in or setup. Android and the web check the same rules but have no device-to-device handoff.

## Install

```sh
despia add Core/Handoff
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### advertise

`dsx.module.handoff.advertise`

Offers what the person is doing to nearby Apple devices, replacing any activity offered before.

**When to use it.** Call it when the screen or its state changes. Call stop when the screen is left.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | string | yes | The activity type, written as a reverse-DNS name that your app declares, such as com.yourcompany.app.viewing. |
| `payload` | object | no | A small set of strings, whole numbers and booleans, up to 3072 bytes, that your app reads on the other device to restore the screen. |
| `title` | string | no | A short title for the activity, such as the name of the recipe being viewed. |
| `url` | string | no | A web address that devices without your app open instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | string | yes | The activity type that is being offered. |
| `advertising` | boolean | yes | True while an activity is being offered to nearby devices. |
| `payloadBytes` | int | yes | The size of the payload in bytes, out of a limit of 3072. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_activity` | That is not a reverse-DNS activity type. | Not recoverable by retrying. |
| `invalid_payload` | A handoff payload holds strings, whole numbers and booleans. | Not recoverable by retrying. |
| `invalid_url` | A handoff fallback is an http or https URL. | Not recoverable by retrying. |
| `not_declared` | This build does not declare that activity type, so nothing would ever see it. | Not recoverable by retrying. |
| `payload_too_large` | That payload is too large to advertise; hand over an identifier instead. | Not recoverable by retrying. |

**Example: advertises a screen with a pointer to its state**

```js
const result = await dsx.module.handoff.advertise({"activity":"com.example.viewing","payload":{"id":"42"},"title":"Pasta carbonara"});
// resolves {"activity":"com.example.viewing","advertising":true,"payloadBytes":11}
```

**Example: a web fallback lets a device without the app still land somewhere useful**

```js
const result = await dsx.module.handoff.advertise({"activity":"com.example.viewing","payload":{"id":"42"},"title":"Pasta","url":"https://example.com/recipes/42"});
// resolves {"activity":"com.example.viewing","advertising":true,"payloadBytes":11}
```

### current

`dsx.module.handoff.current`

Reports which activity, if any, is being offered right now.

**When to use it.** Use it when a screen reopens and needs to decide whether to advertise again. It changes nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | string | yes | The activity type that is being offered. |
| `advertising` | boolean | yes | True while an activity is being offered to nearby devices. |
| `payloadBytes` | int | yes | The size of the payload in bytes, out of a limit of 3072. |

**Example: nothing is advertised on a fresh launch**

```js
const result = await dsx.module.handoff.current({});
// resolves {"activity":"","advertising":false,"payloadBytes":0}
```

**Example: reports the live activity**

```js
const result = await dsx.module.handoff.current({});
// resolves {"activity":"com.example.viewing","advertising":true,"payloadBytes":11}
```

### stop

`dsx.module.handoff.stop`

Stops offering the current activity to nearby devices.

**When to use it.** Use it when the person leaves the screen. It does nothing if nothing is being offered.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `advertising` | boolean | yes | True while an activity is being offered; false after stopping. |

**Example: stops a live advertisement**

```js
const result = await dsx.module.handoff.stop({});
// resolves {"advertising":false}
```

**Example: stopping nothing is a no-op, so a teardown path needs no bookkeeping**

```js
const result = await dsx.module.handoff.stop({});
// resolves {"advertising":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `activity_types` | list | `[]` | The reverse-DNS activity types this app advertises, e.g. com.yourcompany.app.viewing. |
| `stop_on_background` | boolean | `true` | Withdraw the handoff offer when the app leaves the screen. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
