---
title: AgeAssurance
description: Ask the phone's operating system for the user's age range.
package: ageassurance
---

Ask the phone's operating system for the user's age range.

Uses Apple's Declared Age Range on iOS and Google's Play Age Signals on Android to learn which age band the user is in, without asking for a birthdate. Both give the same answer shape, with a yes, no or unknown result for each age you test. It asks the system to show its own prompt. You write what your app does for each age group.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you must treat under-age users differently, for example to show or hide adult content. Check for yes with a strict true test, because unknown is not the same as no. If the system cannot answer, ask for a birthdate yourself.

## What native adds

The age comes from the operating system's own family and account data, which a web page cannot see.

## Install

```sh
despia add Core/AgeAssurance
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

### check

`dsx.module.ageassurance.check`

Asks the system for the user's age band and tells whether the user is at least each age you list; the system may show a prompt.

**When to use it.** Call it once when you need the answer, then read the result from the last action or the saved status.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `gates` | array of int | no | Up to three ages in whole years to test against; if left out, the ages set in the package settings are used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ageLower` | number | no | The lower bound of the user's age band in whole years; null when there is no band. |
| `ageUpper` | number | no | The upper bound of the user's age band in whole years; null when the band is open at the top or unknown. |
| `assurance` | string | no | How the age was established, or unknown when the system does not say. |
| `bridge` | number | no | The version of the answer format. |
| `error` | object | no | The error code and message when the call failed; null when it did not. |
| `error.code` | string | yes | A short machine readable reason the call failed, such as not_available or invalid_gates. |
| `error.message` | string | yes | The platform text or a plain explanation of why the call failed. |
| `gates` | object | no | Whether the user is at least each age you asked about, keyed by age: true, false, or null when the band cannot tell. |
| `ok` | boolean | no | True when the system gave an answer; false when age assurance is unavailable or the call failed. |
| `platform` | string | no | The platform that answered: ios, android or web. |
| `platformExtras` | object | no | Extra fields only one platform reports, grouped by platform name; empty when there are none. |
| `platformExtras.apple` | object | no | Extra age range details that only Apple reports, such as who declared the range. |
| `platformExtras.google` | object | no | Extra age range details that only Google reports, such as significant change status. |
| `provider` | string | no | Which service answered, or none when no age service exists on the device. |
| `runtime` | number | no | The runtime generation of the package that produced the answer. |
| `status` | string | no | The outcome: shared, declined, unavailable or error. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_gates` | Gates must be whole numbers of years. | Not recoverable by retrying. |
| `too_many_gates` | At most three age gates per request. | Not recoverable by retrying. |
| `unsupported_device` | This device has no age-range service: the OS ships no age assurance API (iOS below 26.2), Google Play services are absent, or this is a browser. | Not recoverable by retrying. |

**Example: band 13-16: below the floor is true, inside the band is null, above the ceiling is false**

```js
const result = await dsx.module.ageassurance.check({"gates":[13,15,17]});
// resolves {"ageLower":13,"ageUpper":16,"gates":{"13":true,"15":null,"17":false},"status":"shared"}
```

**Example: open 18+ band: the floor answers true, anything above it is unknown**

```js
const result = await dsx.module.ageassurance.check({"gates":[18,21]});
// resolves {"ageLower":18,"ageUpper":null,"gates":{"18":true,"21":null},"status":"shared"}
```

### forget

`dsx.module.ageassurance.forget`

Drops the saved age answer so the next account on the device does not inherit it.

**When to use it.** Call it at sign out or when the account changes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cleared` | boolean | yes | True when the saved answer was removed. |

**Example: acknowledges the clear even with no provider present**

```js
const result = await dsx.module.ageassurance.forget({});
// resolves {"cleared":true}
```

### last

`dsx.module.ageassurance.last`

Returns the most recent age answer without asking again, or an unavailable answer if nothing has been asked yet.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ageLower` | number | no | The lower bound of the user's age band in whole years; null when there is no band. |
| `ageUpper` | number | no | The upper bound of the user's age band in whole years; null when the band is open at the top or unknown. |
| `assurance` | string | no | How the age was established, or unknown when the system does not say. |
| `bridge` | number | no | The version of the answer format. |
| `error` | object | no | The error code and message when the call failed; null when it did not. |
| `error.code` | string | yes | A short machine readable reason the call failed, such as not_available or invalid_gates. |
| `error.message` | string | yes | The platform text or a plain explanation of why the call failed. |
| `gates` | object | no | Whether the user is at least each age you asked about, keyed by age: true, false, or null when the band cannot tell. |
| `ok` | boolean | no | True when the system gave an answer; false when age assurance is unavailable or the call failed. |
| `platform` | string | no | The platform that answered: ios, android or web. |
| `platformExtras` | object | no | Extra fields only one platform reports, grouped by platform name; empty when there are none. |
| `platformExtras.apple` | object | no | Extra age range details that only Apple reports, such as who declared the range. |
| `platformExtras.google` | object | no | Extra age range details that only Google reports, such as significant change status. |
| `provider` | string | no | Which service answered, or none when no age service exists on the device. |
| `runtime` | number | no | The runtime generation of the package that produced the answer. |
| `status` | string | no | The outcome: shared, declined, unavailable or error. |

**Example: answers unavailable before anything has been asked**

```js
const result = await dsx.module.ageassurance.last({});
// resolves {"ok":false,"status":"unavailable"}
```

### resolve

`dsx.module.ageassurance.resolve`

On Android, starts Google's verification step for the user and then returns a fresh answer; on iOS it reports that it is not supported.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `gates` | array of int | no | Up to three ages in whole years to test against; if left out, the ages set in the package settings are used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ageLower` | number | no | The lower bound of the user's age band in whole years; null when there is no band. |
| `ageUpper` | number | no | The upper bound of the user's age band in whole years; null when the band is open at the top or unknown. |
| `assurance` | string | no | How the age was established, or unknown when the system does not say. |
| `bridge` | number | no | The version of the answer format. |
| `error` | object | no | The error code and message when the call failed; null when it did not. |
| `error.code` | string | yes | A short machine readable reason the call failed, such as not_available or invalid_gates. |
| `error.message` | string | yes | The platform text or a plain explanation of why the call failed. |
| `gates` | object | no | Whether the user is at least each age you asked about, keyed by age: true, false, or null when the band cannot tell. |
| `ok` | boolean | no | True when the system gave an answer; false when age assurance is unavailable or the call failed. |
| `platform` | string | no | The platform that answered: ios, android or web. |
| `platformExtras` | object | no | Extra fields only one platform reports, grouped by platform name; empty when there are none. |
| `platformExtras.apple` | object | no | Extra age range details that only Apple reports, such as who declared the range. |
| `platformExtras.google` | object | no | Extra age range details that only Google reports, such as significant change status. |
| `provider` | string | no | Which service answered, or none when no age service exists on the device. |
| `runtime` | number | no | The runtime generation of the package that produced the answer. |
| `status` | string | no | The outcome: shared, declined, unavailable or error. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_gates` | Gates must be whole numbers of years. | Not recoverable by retrying. |
| `too_many_gates` | At most three age gates per request. | Not recoverable by retrying. |

**Example: answers a well-formed verdict, unsupported where the provider has no verification flow**

```js
const result = await dsx.module.ageassurance.resolve({"gates":[18]});
// resolves {"gates":{"18":null},"ok":false,"status":"error"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `default_gates` | list | `[13,16,18]` | The ages this app asks about when a call passes none. At most three, whole years. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
