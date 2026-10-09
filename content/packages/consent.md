---
title: Tracking consent
description: Ask users for tracking consent and hold back analytics events until they agree.
package: consent
---

Ask users for tracking consent and hold back analytics events until they agree.

Stores the user's yes or no and blocks Airbridge tracking events until consent is granted. Includes a ready-made consent banner you can style or replace. It is off by default, so apps that leave it out track as before. Works with the Airbridge package.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app must get the user's permission before tracking, for example with Airbridge. Call grant after the user accepts and revoke when they change their mind. If you do not track users, leave it out.

## Install

```sh
despia add Core/Consent
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

### grant

`dsx.module.consent.grant`

Records that the user agreed to tracking and saves the answer, so held-back tracking events can be sent.

**When to use it.** Call it when the user taps accept on your consent screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `granted` | boolean | yes | True when tracking is now allowed. |
| `stored` | boolean | yes | True when the answer was saved on the device and will be remembered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `storage_unavailable` | This browser will not persist the consent answer, so it cannot be changed. |  |

**Example: grants consent**

```js
const result = await dsx.module.consent.grant({});
// resolves {"granted":true,"stored":true}
```

### revoke

`dsx.module.consent.revoke`

Records that the user withdrew consent and saves the answer, so tracking events are held back again.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `granted` | boolean | yes | True when tracking is allowed; false after a revoke. |
| `stored` | boolean | yes | True when the answer was saved on the device and will be remembered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `storage_unavailable` | This browser will not persist the consent answer, so it cannot be changed. |  |

**Example: revokes consent**

```js
const result = await dsx.module.consent.revoke({});
// resolves {"granted":false,"stored":true}
```

### status

`dsx.module.consent.status`

Reads the current consent answer without asking anything or changing it. Not yet answered counts as not granted.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `granted` | boolean | yes | True when the user has allowed tracking. |
| `stored` | boolean | yes | True when an answer has been saved on this device. |

**Example: reports current consent**

```js
const result = await dsx.module.consent.status({});
// resolves {"granted":false,"stored":true}
```

**Example: reads as not granted when storage cannot be read**

```js
const result = await dsx.module.consent.status({});
// resolves {"granted":false,"stored":false}
```

## Events

Read with `dsx.on(name, handler)`.

### changed

The user's consent answer changed, after a grant or a revoke.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `granted` | boolean | yes | True when tracking is now allowed. |
| `stored` | boolean | yes | True when the new answer was saved on the device. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
