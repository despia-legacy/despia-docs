---
title: Background Location
description: Add the declarations an app needs to track location in the background.
package: backgroundlocation
---

Add the declarations an app needs to track location in the background.

Has no actions of its own. Adding it next to the location package makes the app declare background location to Apple and Google, which turns on background tracking, geofences, significant-change monitoring and visits. Leave it out if your app only asks where the person is while it is open.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it only when your app tracks location in the background or uses geofences or visits, because it makes the stores treat the app as a background location app. Leave it out otherwise and the background location calls will refuse.

## Install

```sh
despia add Core/Geo/Modules/BackgroundLocation
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

Device classes: phone.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_always_and_when_in_use` | multiline | `Your location is used in the background so arrival alerts and trip tracking keep working while the app is closed.` | The sentence iOS shows when the app asks to keep using location in the background. Say what happens while the app is closed, and why it is worth it. |

## Related packages

- Used by: [Geo](/packages/geo)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
