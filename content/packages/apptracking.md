---
title: AppTracking
description: Ask the user for tracking permission and read their answer.
package: apptracking
---

Ask the user for tracking permission and read their answer.

Lets your app find out whether the user allows tracking and ask for it when you choose. On iOS it shows Apple's App Tracking Transparency dialog; on Android it reports the Google Play advertising ID opt-out. The framework never asks on launch, so you decide when to call it. You write the screen that explains why you ask and the code that turns tracking or personalised ads off.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app has cross-app tracking, personalised ads or attribution that depends on user consent, and you need to show the iOS tracking dialog at the right moment. Skip it if your app does no tracking, since nothing asks on launch.

## Install

```sh
despia add Core/WebPlatform/AppTracking
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### permission.openSettings

`dsx.module.apptracking.permission.openSettings`

Opens the app's page in the device Settings so the user can change the tracking choice. It needs the App Settings package.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The App Settings package is not part of this build, so Settings cannot be opened. | Add the App Settings package to your app, or tell the user to open Settings by hand. |

**Example: opens the app page**

```js
const result = await dsx.module.apptracking.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.apptracking.permission.request`

Shows Apple's tracking dialog while it can still appear and resolves with the user's answer. Later calls resolve at once with the standing answer, and on Android it resolves the current state.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True if the dialog could still be shown after this call, false once the answer is final. |
| `status` | string | yes | The tracking answer after the request: undetermined, granted, denied or restricted on iOS. On Android it is granted, denied or unavailable. |

**Example: resolves the user's allow after the dialog**

```js
const result = await dsx.module.apptracking.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

**Example: resolves the user's refusal after the dialog**

```js
const result = await dsx.module.apptracking.permission.request({});
// resolves {"canAsk":false,"status":"denied"}
```

### permission.status

`dsx.module.apptracking.permission.status`

Reads the current tracking answer without showing any dialog. Use it to decide whether to ask or to switch tracking off.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the iOS dialog can still be shown, false once the user has answered. |
| `status` | string | yes | The tracking answer: undetermined, granted, denied or restricted on iOS. On Android it is granted, denied or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.apptracking.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: the user allowed tracking**

```js
const result = await dsx.module.apptracking.permission.status({});
// resolves {"canAsk":false,"status":"granted"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `att_denied_show_ads` | boolean | `true` | Keep showing ads even when the user denies App Tracking Transparency. |
| `usage_description` | multiline | `Tracking is requested only for delivering personal notifications and accessing your personal account data. Moreover, it may be used to deliver personalized ads to you. This app will be functional regardless of which privacy option is chosen.` | The message shown when iOS asks permission to track the user across apps (ATT). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
