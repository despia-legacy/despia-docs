---
title: Sounds
description: Ship your own notification sounds with the app.
package: sounds
---

Ship your own notification sounds with the app.

Bundles the .wav files you put in your assets folder so notifications can play them by name on iOS and Android. On Android each file becomes a raw resource that notification channels can use. Nothing ships by default: if you add no sounds, none are included. You choose the sound names in your notifications and push payloads.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your notifications should play your own sound instead of the system default. Skip it if the default sound is enough.

## Install

```sh
despia add Core/Notify/Modules/Sounds
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

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
