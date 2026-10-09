---
title: TabletSupport
description: Make your iOS app run natively on iPad as well as iPhone.
package: tabletsupport
---

Make your iOS app run natively on iPad as well as iPhone.

Builds the app for iPhone and iPad, with a resizable iPad window and all four iPad orientations, so it can join Split View and Stage Manager instead of running in iPhone compatibility mode. It is a build setting only: there is nothing to call and no code or extra libraries. The standard release profile turns it on. An iPhone-only app can exclude it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Leave it on if your app should be offered on iPad. Exclude it in the Config excluded list if your app is deliberately iPhone-only.

## Install

```sh
despia add Core/Basics/TabletSupport
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
