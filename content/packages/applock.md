---
title: AppLock
description: Lock your app behind Face ID, Touch ID or the device passcode.
package: applock
---

Lock your app behind Face ID, Touch ID or the device passcode.

A biometric app lock that gates the app before any content is shown.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your app shows private content, such as messages or finances, and should ask for the device owner each time it starts. It is turned on in config and has nothing to call from a page.

## Install

```sh
despia add Core/AppLock
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background` | string | `#0B0B0F` | Background color (hex) of the lock screen. |
| `button` | string | `Unlock` | Label of the unlock / retry button on the lock screen. |
| `enabled` | boolean | `false` | Require Face ID / Touch ID (or device passcode) to open the app. |
| `logo` | string | `` | Bundled image-set name shown on the lock screen (optional). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The lock screen could not be presented. |  |

## Related packages

- Needs: [Biometric](/packages/biometric)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
