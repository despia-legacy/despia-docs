---
title: DSXView
description: Show a screen fetched from your server as a native view inside the app.
package: dsxview
---

Show a screen fetched from your server as a native view inside the app.

The native twin of the web view element: it fetches a screen's definition from your server, keeps a copy for offline use, and draws it as native views that share the app's state. You write the screen on the server and place the element where it should appear.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when part of your app should update from the server without a new app release but still look native. For a full web page use the web view element instead.

## What native adds

The remote screen is drawn with native views rather than a web page, so it scrolls and animates like the rest of the app.

## Install

```sh
despia add Mandatory/Foundation/Components/Views/DSXView
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
