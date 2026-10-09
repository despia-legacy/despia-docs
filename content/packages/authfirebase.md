---
title: Firebase Auth
description: Sign people in with Firebase Authentication using email and password, Google or Apple.
package: authfirebase
---

Sign people in with Firebase Authentication using email and password, Google or Apple.

Keeps accounts in your Firebase project and signs people in with email and password, or with a Google or Apple credential. Gives you the Firebase ID token to check on your own server. Use it if your accounts already live in Firebase. Needs a Firebase project and its Web API key.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your accounts already live in a Firebase project and you want email and password, Google or Apple sign-in. It does not offer emailed codes, phone codes or passkeys, so use another sign-in package for those.

## Install

```sh
despia add Core/Auth/FirebaseAuth
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

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_key` | string | `` | Your Firebase project's Web API key (Project settings, General). It starts with AIza. |
| `endpoint` | string | `` | Leave blank for Firebase. For the local Auth emulator use http://127.0.0.1:9099 (http://10.0.2.2:9099 from the Android emulator). |

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
