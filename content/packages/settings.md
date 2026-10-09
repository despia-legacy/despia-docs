---
title: AppSettings
description: Open your app's page in the system Settings.
package: settings
---

Open your app's page in the system Settings.

Sends the user to this app's page in the Settings app, or to a deeper page such as notifications, so they can switch back on a permission they denied earlier. The phone will not show the system prompt a second time, so this is the way back. It does not wait for the user to return. You write the button and the explanation around it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it from a button the user taps after a permission was denied, such as notifications or location. Do not call it automatically, and note that it cannot change a setting for the user.

## What native adds

Only the native app can open the system Settings page for itself; a web page has no way to.

## Install

```sh
despia add Core/Basics/AppSettings
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone, desktop.

## Actions

### app

`dsx.module.settings.app`

Opens this app's own page in the system Settings, where the user can change its permissions.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |

**Example: opens this app's page in Settings**

```js
const result = await dsx.module.settings.app({});
// resolves {"ok":true}
```

### battery

`dsx.module.settings.battery`

On Android, asks the system to let the app ignore battery optimization; on iOS it fails with unsupported_platform.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.battery({});
// resolves {"ok":true}
```

### bluetooth

`dsx.module.settings.bluetooth`

Opens the Bluetooth settings on Android; on iOS it fails with unsupported_platform because Apple allows no such link.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.bluetooth({});
// resolves {"ok":true}
```

### defaults

`dsx.module.settings.defaults`

Opens the system default apps page, which needs iOS 18.2 or later on iPhone.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_os` | Default Apps settings requires iOS 18.3+ | Not recoverable by retrying. |

**Example: opens the default-apps section**

```js
const result = await dsx.module.settings.defaults({});
// resolves {"ok":true}
```

### locale

`dsx.module.settings.locale`

Opens the Android per-app language settings on Android 13 and later; on iOS it fails with unsupported_platform.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.locale({});
// resolves {"ok":true}
```

### location

`dsx.module.settings.location`

Opens the location settings on Android; on iOS it fails with unsupported_platform because Apple allows no such link.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.location({});
// resolves {"ok":true}
```

### notifications

`dsx.module.settings.notifications`

Opens this app's notification settings page, which needs iOS 15.4 or later on iPhone.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |

**Example: opens this app's notification settings**

```js
const result = await dsx.module.settings.notifications({});
// resolves {"ok":true}
```

### overlay

`dsx.module.settings.overlay`

Opens the Android page where the user allows drawing over other apps; on iOS it fails with unsupported_platform.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.overlay({});
// resolves {"ok":true}
```

### wifi

`dsx.module.settings.wifi`

Opens the Wi-Fi settings on Android; on iOS it fails with unsupported_platform because Apple allows no such link.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Settings URL can't be opened | Not recoverable by retrying. |
| `unsupported_platform` | That settings page is Android-only; iOS ships no public equivalent. | Not recoverable by retrying. |

**Example: opens the page on Android**

```js
const result = await dsx.module.settings.wifi({});
// resolves {"ok":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
