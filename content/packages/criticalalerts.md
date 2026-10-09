---
title: CriticalAlerts
description: Let urgent push notifications break through silent mode and Do Not Disturb on iPhone.
package: criticalalerts
---

Let urgent push notifications break through silent mode and Do Not Disturb on iPhone.

Adds the Apple critical alerts entitlement and its usage description to your iOS app, so urgent push notifications can sound even when the phone is silenced or in Do Not Disturb. Apple must approve critical alerts for your App ID before they work, and the message people see when iOS asks for permission is set in the package configuration. There is nothing to call: it only changes what your app is allowed to ask for.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app sends alerts people must not miss, such as health, safety or on-call alarms, and Apple has approved critical alerts for your App ID. Skip it for ordinary notifications, since Apple rejects apps that ask for it without a real need.

## Install

```sh
despia add Core/Basics/CriticalAlerts
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Required to deliver critical alerts that may be important for your safety or account security.` | The message shown when iOS asks the user for critical alerts. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
