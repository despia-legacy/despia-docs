---
title: Lifecycle
description: The app shell's shared lifecycle and screen-ready events.
package: lifecycle
---

The app shell's shared lifecycle and screen-ready events.

Defines the events that report what is happening to the app, such as launch, going to the background, opening a link or a notification tap, and when a screen starts loading and becomes ready. Other packages listen to them so no behavior lives in the startup code. It has no calls of its own. You can read the screen phase in your markup.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

You do not call it. It is always included, and package authors use its events to react to app lifecycle and screen readiness.

## Install

```sh
despia add Mandatory/Lifecycle
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
