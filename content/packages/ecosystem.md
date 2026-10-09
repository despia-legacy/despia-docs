---
title: Ecosystem
description: Remember a value across all of a person's own devices, with no sign-in.
package: ecosystem
---

Remember a value across all of a person's own devices, with no sign-in.

Lets a variable marked as ecosystem persist follow the person to their other devices and survive a reinstall where the platform allows. On iOS it uses iCloud, on Android a backup copy, and on the web just this browser. You choose how conflicts are settled, such as keeping the newest or the largest value.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for small preferences and progress that should follow a person without an account, such as having finished onboarding. For private data or large content, use account-based storage instead.

## What native adds

iCloud and Android backup let values reach the person's other phones and survive a reinstall, which web storage cannot.

## Install

```sh
despia add Core/Basics/Ecosystem
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

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
