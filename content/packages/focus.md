---
title: Focus
description: Know when the app moves to the foreground or the background.
package: focus
---

Know when the app moves to the foreground or the background.

Gives you a live value that is true while the app, or the browser tab, is in front, plus events for each change. Use it to pause video or sensors when the app goes away and resume them when it returns. There is nothing to call and no permission to ask for.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to pause or resume work that should only run while the app is visible, such as video, polling or animations. It tells you about moving between foreground and background, not about which field has the keyboard.

## Install

```sh
despia add Core/Basics/Focus
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
