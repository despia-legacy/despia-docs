---
title: HealthKit
description: Read and write Apple Health and Android Health Connect data.
package: healthkit
---

Read and write Apple Health and Android Health Connect data.

Reads steps, heart rate, sleep and workouts, saves measurements, and can send new samples to your server in the background. The same type names work on iOS and Android, and the first read of a type asks the person for permission. Needs a health usage description for iOS; iPads and some Android phones have no health store.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when your app shows or records health and fitness data on the device, or forwards it to your backend. If you want data from wearable brands through a cloud service, look at the Terra package instead.

## What native adds

Talks to Apple Health and Health Connect directly with their permission sheets and background delivery, which a web page cannot reach.

## Install

```sh
despia add Core/HealthKit
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### observe

`dsx.module.healthkit.observe`

Watches health types in the background and sends new samples to your server over HTTPS.

**When to use it.** Use it when your backend should receive health data without the app being open.

**When not to.** For data you only draw in the app, use read.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `frequency` | string | no | How often to deliver: immediate, hourly, daily or weekly; defaults to immediate. |
| `server` | string | no | The absolute HTTPS address that receives the data; it is remembered across launches. |
| `types` | array | yes | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |
| `userId` | string | no | Your id for the person, sent with the data; a random app-installation id is used when you leave it out. |

**Resolves with**

_None._

**Example: starts observing with an app user id and broadcasts the active list**

```js
const result = await dsx.module.healthkit.observe({"frequency":"immediate","server":"https://example.com/hook","types":["HKQuantityTypeIdentifierStepCount"],"userId":"account-fixture-123"});
```

**Example: starts anonymous observation with an installation-scoped id**

```js
const result = await dsx.module.healthkit.observe({"server":"https://example.com/hook","types":["HKQuantityTypeIdentifierStepCount"]});
```

### permission.manage

`dsx.module.healthkit.permission.manage`

Lets the person change a limited selection where the system has one; otherwise returns the current state unchanged.

**When to use it.** Call it from a settings row; it reports changed false where there is no selection to change.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `types` | array | no | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `changed` | boolean | yes | True when the selection was changed; false where the platform has no limited selection. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.healthkit.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.healthkit.permission.openSettings`

Opens this app's page in the system Settings so the person can change the health data permission.

**When to use it.** Use it after a refusal where canAsk is false, from a tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package, which is not in this build. | Add the App Settings package, or tell the person where to change the permission. |
| `unsupported_platform` | This platform has no system settings page to open. | Skip the settings row here and explain how to change the permission. |

**Example: opens the app page**

```js
const result = await dsx.module.healthkit.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.healthkit.permission.request`

Shows the system health data permission dialog when it can still be shown, and returns the resulting state.

**When to use it.** Use it from an explicit step such as onboarding or a settings row.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `types` | array | no | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `requested` | boolean | no | True when the system sheet was shown by this call. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.healthkit.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.healthkit.permission.status`

Reads the health data permission without ever showing a dialog.

**When to use it.** Call it on a settings screen to decide what to show.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `types` | array | no | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.healthkit.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.healthkit.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### read

`dsx.module.healthkit.read`

Reads health data for the types you list, as daily totals or as individual samples.

**When to use it.** Call it to show steps, heart rate, sleep or similar; the first read of a type asks for permission.

**When not to.** For a running feed to your server, use observe instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | number | no | How many days back to read; defaults to 1. |
| `raw` | boolean | no | True returns each stored sample with its source instead of one daily total. |
| `types` | array | no | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |

**Resolves with**

_None._

**Example: resolves daily aggregates keyed by type**

```js
const result = await dsx.module.healthkit.read({"days":2,"types":["HKQuantityTypeIdentifierStepCount"]});
// resolves {"HKQuantityTypeIdentifierStepCount":[{"date":"2026-08-21T00:00:00Z","unit":"count","value":7640}]}
```

**Example: resolves raw samples with source when raw is set**

```js
const result = await dsx.module.healthkit.read({"days":1,"raw":true,"types":["HKQuantityTypeIdentifierStepCount"]});
// resolves {"HKQuantityTypeIdentifierStepCount":[{"endDate":"2026-08-21T09:19:45Z","source":"com.apple.health","startDate":"2026-08-21T09:12:03Z","unit":"count","value":432}]}
```

### status

`dsx.module.healthkit.status`

Reports whether health data exists on this device and which types are allowed.

**When to use it.** Call it before offering health features; it always answers, even when health data is unavailable.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `types` | array | no | Health type identifiers such as HKQuantityTypeIdentifierStepCount; the same names are used on iOS and Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when Health data can be used on this device. |
| `reason` | string | no | Why Health is unavailable, set only when available is false. |
| `requested` | boolean | yes | True when the user has already been asked for the types, so the permission prompt will not show again. |
| `types` | object | yes | The permission state of each type you asked about, keyed by the health type identifier. |

**Example: resolves availability with per-type authorization**

```js
const result = await dsx.module.healthkit.status({"types":["HKQuantityTypeIdentifierStepCount"]});
// resolves {"available":true,"requested":true,"types":{"HKQuantityTypeIdentifierStepCount":{"read":"unknown","write":"undetermined"}}}
```

**Example: resolves (never rejects) when Health is unavailable**

```js
const result = await dsx.module.healthkit.status({});
// resolves {"available":false,"reason":"healthkit_unavailable","requested":false,"types":{}}
```

### unobserve

`dsx.module.healthkit.unobserve`

Stops watching health types for background delivery.

**When to use it.** Call it when the person turns health sharing off.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `types` | array | no | The types to stop watching, or all to stop everything. |

**Resolves with**

_None._

**Example: stops observing and broadcasts the active list**

```js
const result = await dsx.module.healthkit.unobserve({"types":["HKQuantityTypeIdentifierStepCount"]});
```

### workouts

`dsx.module.healthkit.workouts`

Lists the person's workouts for the last days, with the totals you ask for.

**When to use it.** Call it to show a workout history.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | number | no | How many days back to list; defaults to 1. |
| `included` | array | no | Totals to add to each workout, such as HKQuantityTypeIdentifierActiveEnergyBurnedSum. |

**Resolves with**

_None._

**Example: returns recent workouts**

```js
const result = await dsx.module.healthkit.workouts({"days":7,"included":["HKQuantityTypeIdentifierHeartRateAverage"]});
// resolves [{"activityType":"running","calories":250,"duration":1800}]
```

### write

`dsx.module.healthkit.write`

Saves one health value, such as a weight, to Apple Health or Health Connect.

**When to use it.** Call it when the person logs a measurement in your app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | yes | The health type identifier to save, for example HKQuantityTypeIdentifierBodyMass. |
| `unit` | string | no | The unit of the value, for example kg; leave out to use the type's default unit. |
| `value` | number | yes | The number to save, in the unit of the type or the unit you give. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | yes | The health type that was written. |
| `value` | number | yes | The number that was saved. |
| `written` | boolean | yes | True when the value was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `healthkit_unavailable` | This device has no health store, for example an iPad or an Android phone without Health Connect. | Hide health features here; check status first. |
| `invalid_argument` | The type or the numeric value is missing. | Pass the health type identifier and a number as value. |
| `invalid_type` | That health type is not known or cannot be written. | Use a valid type identifier such as HKQuantityTypeIdentifierBodyMass. |
| `permission_denied` | The person has not allowed writing this health type. | Ask for permission, or send them to Settings to allow it. |
| `write_failed` | The health store refused to save the value. | Check the value and unit, then try again. |

**Example: stores a sample**

```js
const result = await dsx.module.healthkit.write({"type":"HKQuantityTypeIdentifierBodyMass","value":75.5});
// resolves {"type":"HKQuantityTypeIdentifierBodyMass","value":75.5,"written":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_share_description` | multiline | `Read your health and workout data to sync it with the app.` | The message shown when iOS asks permission to read Health data. |
| `usage_update_description` | multiline | `Save the health data you choose to record in the app.` | The message shown when iOS asks permission to save data to Health. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `healthkit_unavailable` | This device has no health store, for example an iPad or an Android phone without Health Connect. | Hide health features here; check status first. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
