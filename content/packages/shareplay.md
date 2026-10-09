---
title: SharePlay
description: Start shared sessions from FaceTime with SharePlay.
package: shareplay
---

Start shared sessions from FaceTime with SharePlay.

Works with the Watch together package. Inside a FaceTime call or from the share sheet, people join with one tap. Needs the Group Activities capability on your app ID. iOS only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when people should watch or work together inside a FaceTime call, with one tap to join. It only carries the shared session, so you start it with the shared session calls. It does nothing on Android or the web.

## What native adds

Uses Apple's Group Activities, which lets a session start from a FaceTime call or the share sheet and keeps everyone in step.

## Install

```sh
despia add Core/SharePlay
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

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | SharePlay could not start the activity or find a screen to present the sharing sheet from. |  |

## Related packages

- Needs: [SharedSession](/packages/sharedsession)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
