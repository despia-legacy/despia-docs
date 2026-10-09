---
title: LegacyCrypto
description: Lets Android check the signatures on over-the-air updates that use the Ed25519 signing algorithm.
package: legacycrypto
---

Lets Android check the signatures on over-the-air updates that use the Ed25519 signing algorithm.

Adds a built-in Ed25519 signature check to Android, which lacks a usable one on many versions, including the newest. Without it, a correctly signed update bundle would be refused and the app would stay on the version it shipped with. It has no calls and nothing to configure, and it is included by default.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Keep it unless you sign your updates with ECDSA P-256 instead, which every Android version supports. If you leave it out and still sign with Ed25519, over-the-air updates will be refused on devices without a usable Ed25519 check.

## Install

```sh
despia add Core/LegacyCrypto
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
