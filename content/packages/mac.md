---
title: Mac
description: Give your app a proper Mac window with sensible minimum size and the standard reload shortcut.
package: mac
---

Give your app a proper Mac window with sensible minimum size and the standard reload shortcut.

On the Mac version of your app, it sets a minimum window size before the first frame and adds the standard Command-R reload command to the menu. There is nothing to call; it works by being included. It does nothing on iPhone or iPad.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your app also runs on the Mac, so the window behaves like a Mac window. You do not call it from your pages.

## Install

```sh
despia add Core/Extensions/Mac
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: desktop.

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
