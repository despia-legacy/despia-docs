---
title: Screenshot protection
description: Hide your app's content in screenshots and screen recordings, and find out when someone tries.
package: screenshield
---

Hide your app's content in screenshots and screen recordings, and find out when someone tries.

Blanks the app in screenshots and screen recordings and tells your screens when a capture is attempted, so you can blur sensitive content or warn the person. Use it for banking, health or private content. It only works while the screen capture prevention setting in the Security package is on. On Android versions before 14 it blocks capture without the notice.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it for banking, health or private content that should not appear in screenshots or screen recordings, or when you want to warn the person that a capture was attempted. It only works while the screen capture prevention setting in the Security package is on.

## What native adds

The operating system itself hides the app in captures, which a web page cannot do.

## Install

```sh
despia add Core/ScreenShield
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Events

Read with `dsx.on(name, handler)`.

### captureattempt

Sent when the system reports a screenshot or the start of a screen recording while the app is on screen, so you can blur content or warn the person.

_None._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
