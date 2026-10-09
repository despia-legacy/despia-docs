---
title: Kiosk
description: Lock an Android device to your app so people cannot leave it, for shared or public devices.
package: kiosk
---

Lock an Android device to your app so people cannot leave it, for shared or public devices.

Turns a company-owned Android device into a kiosk: it keeps people in your app and any other apps you allow, and can hide the status bar, the lock screen and some system buttons. It works only on Android, only after the device has been set up once so your app is its device owner, and an unlock code lets staff exit. You write the screens and choose the allowed apps.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for shared tablets, point-of-sale terminals and public displays that must stay in one app. Do not use it for ordinary consumer apps, and note it has no iOS or web version.

## What native adds

It uses Android's own device-owner lock mode, which prevents leaving the app in ways a normal app cannot.

## Install

```sh
despia add Core/Extensions/Kiosk
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | no |
| macos | no |

Device classes: phone, tablet.

## Actions

### allowlist

`dsx.module.kiosk.allowlist`

Sets which apps the device may run while locked. Your own app is always included so you cannot lock yourself out.

**When to use it.** Call it before enter if the device needs apps such as a payment or launcher app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `packages` | array of string | no | The package names of the extra apps to allow. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowlist` | array of string | yes | The full list of allowed apps, including your own. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_package` | One or more entries is not a valid Android package name. | Not recoverable by retrying. |
| `not_device_owner` | Only the device owner can set the lock task allowlist. | Not recoverable by retrying. |

**Example: always includes this app's own package even when the caller forgot it**

```js
const result = await dsx.module.kiosk.allowlist({"packages":["com.example.launcher"]});
// resolves {"allowlist":["com.example.kiosk","com.example.launcher"]}
```

**Example: dedupes a repeated entry**

```js
const result = await dsx.module.kiosk.allowlist({"packages":["com.example.launcher","com.example.launcher"]});
// resolves {"allowlist":["com.example.kiosk","com.example.launcher"]}
```

### bootLaunch

`dsx.module.kiosk.bootLaunch`

Chooses whether the app opens again by itself after the device restarts, for example after a power cut.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | True to relaunch the app after every restart. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | Whether relaunch after restart is now on. |

**Example: turns boot relaunch on**

```js
const result = await dsx.module.kiosk.bootLaunch({"enabled":true});
// resolves {"enabled":true}
```

**Example: turns boot relaunch off**

```js
const result = await dsx.module.kiosk.bootLaunch({"enabled":false});
// resolves {"enabled":false}
```

### enter

`dsx.module.kiosk.enter`

Locks the device to the allowed apps, starting with the screen that is showing now.

**When to use it.** Call it when the shift or session starts. It refuses if the device has not been set up for it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | True once the device is locked. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `lock_task_denied` | The OS refused to start lock task for this package. Call kiosk.allowlist first, or check for a competing device-management app. |  |
| `not_device_owner` | This app is not the device owner, so lock task cannot start. Provision it as the device owner with the adb set-device-owner command from the Kiosk package guide, on a clean device or work profile. | Not recoverable by retrying. |

**Example: enters lock task when the device owner is permitted**

```js
const result = await dsx.module.kiosk.enter({});
// resolves {"locked":true}
```

**Example: calling enter again while already locked is idempotent, not an error**

```js
const result = await dsx.module.kiosk.enter({});
// resolves {"locked":true}
```

### exit

`dsx.module.kiosk.exit`

Unlocks the device after checking the unlock code. A wrong code leaves it locked.

**When to use it.** Call it from a staff-only screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `unlockCode` | string | yes | The code staff type to unlock, checked against the code in your settings. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | False once the device has been unlocked. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_code` | The unlock code did not match this app's configured code. |  |

**Example: exits lock task on the correct code**

```js
const result = await dsx.module.kiosk.exit({"unlockCode":"7482"});
// resolves {"locked":false}
```

### policy

`dsx.module.kiosk.policy`

Chooses what a locked device still allows, such as the home button or notifications, whether the status bar and lock screen are shown, and a few system restrictions.

**When to use it.** Use it to tighten the kiosk before calling enter. An unknown word is refused instead of ignored.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `features` | array of string | no | Which system features stay available while locked, such as home or notifications. |
| `keyguardDisabled` | boolean | no | Set to true to skip the lock screen. |
| `restrictions` | array of string | no | Extra system restrictions to turn on, from the supported list such as DISALLOW_SAFE_BOOT. |
| `statusBarDisabled` | boolean | no | Set to true to hide the status bar. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `features` | array of string | yes | The features that are now available while locked. |
| `keyguardDisabled` | boolean | yes | Whether the lock screen is now skipped. |
| `restrictions` | array of string | yes | The restrictions now in force. |
| `statusBarDisabled` | boolean | yes | Whether the status bar is now hidden. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `feature_denied` | The OS refused this policy call. |  |
| `not_device_owner` | Only the device owner can set lock task policy. | Not recoverable by retrying. |
| `unknown_feature` | One or more feature words is not in the declared vocabulary (home, overview, notifications, systemInfo, keyguard, globalActions, blockActivityStartInTask). | Not recoverable by retrying. |
| `unknown_restriction` | One or more restrictions is not in this package's documented set (README). | Not recoverable by retrying. |

**Example: applies a declared feature set and reports it back**

```js
const result = await dsx.module.kiosk.policy({"features":["home","globalActions"]});
// resolves {"features":["home","globalActions"],"keyguardDisabled":false,"restrictions":[],"statusBarDisabled":false}
```

### status

`dsx.module.kiosk.status`

Reports live whether this app is the device owner, is allowed to lock the device, is locked now, and which apps are allowed.

**When to use it.** Use it to show setup progress or to hide kiosk controls on a device that is not provisioned.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowlist` | array of string | yes | The package names of the apps the device is locked to. |
| `deviceOwner` | boolean | yes | True when this app has been set up as the device owner. |
| `lockTaskPermitted` | boolean | yes | True when the system allows this app to lock the device. |
| `locked` | boolean | yes | True when the device is locked to the allowed apps now. |

**Example: an unprovisioned app reports itself honestly: not the device owner, not locked, no allowlist**

```js
const result = await dsx.module.kiosk.status({});
// resolves {"allowlist":[],"deviceOwner":false,"lockTaskPermitted":false,"locked":false}
```

**Example: a provisioned, locked device owner reports its live allowlist**

```js
const result = await dsx.module.kiosk.status({});
// resolves {"allowlist":["com.example.kiosk"],"deviceOwner":true,"lockTaskPermitted":true,"locked":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `allowlist` | list | `[]` | Extra package names kiosk.enter() locks the device to, beyond this app's own package (which is always included). |
| `boot_launch` | boolean | `false` | Whether KioskBootReceiver relaunches this app right after the device finishes booting. |
| `unlock_code` | string | `000000` | The PIN kiosk.exit(unlockCode) is compared against. Change this per app: core_packages.json -> { "Kiosk": { "unlock_code": "483920" } }. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_code` | The unlock code did not match. |  |
| `feature_denied` | The OS refused a policy call. |  |
| `invalid_package` | Not a valid Android package name. |  |
| `lock_task_denied` | The OS refused a lock task call. |  |
| `not_device_owner` | This app has not been set up as the device owner, so the system will not let it lock the device. | Run the one-time device owner setup on a freshly reset device, then try again. |
| `unknown_feature` | Not a declared lock task feature word. |  |
| `unknown_restriction` | Not in this package's documented user-restriction set. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
