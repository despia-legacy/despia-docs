---
title: Bluetooth
description: Lets your web page ask for Bluetooth on iOS by adding the permission text the system requires.
package: bluetooth
---

Lets your web page ask for Bluetooth on iOS by adding the permission text the system requires.

Adds the Bluetooth purpose messages iOS insists on before any radio use, so a page or custom package that reaches Bluetooth through a web API can run. It adds no actions of its own; the message shown comes from its usage description setting. Full Bluetooth control from your app is the separate Bluetooth package.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your web page or a custom package touches Bluetooth and the iOS build must carry the usage text. If you want to scan and connect to devices from native code, use the Bluetooth package instead; this one only declares the permission text.

## Install

```sh
despia add Core/WebPlatform/Bluetooth
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
| `usage_description` | multiline | `Connect to and exchange data with nearby Bluetooth devices.` | The message shown when iOS asks the user for Bluetooth access. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
