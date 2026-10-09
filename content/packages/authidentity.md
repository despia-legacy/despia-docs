---
title: Despia Identity
description: Sign people in with emailed codes using your own self-hosted identity service.
package: authidentity
---

Sign people in with emailed codes using your own self-hosted identity service.

Emails a one-time code, checks it and keeps the person signed in, with no third-party account service. Use it when you want to own your user accounts. Needs the open Despia identity service deployed and its address.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want emailed one-time codes and to host your own accounts with the open identity service. If your accounts live in another service such as Firebase, Supabase or Clerk, use that package instead.

## Install

```sh
despia add Core/Auth/Identity
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
| `url` | string | `` | The address of your identity service deployment (OpenSource/Services/identity), for example https://id.example.com. |

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
