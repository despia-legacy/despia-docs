---
title: AppClip
description: Offer a small App Clip that loads part of your app without a full install.
package: appclip
---

Offer a small App Clip that loads part of your app without a full install.

Adds an iOS App Clip, a tiny version of your app that opens from a link, QR code or NFC tag and loads a web address you choose. It is off by default. You need an App Clip identifier, a link to the full app and an associated domain from Apple.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when people should be able to try a task, like paying or ordering, without installing the whole app first. If you do not plan to publish an App Clip, leave it out.

## What native adds

App Clips are an iOS feature that opens from system surfaces such as Maps, Messages and QR codes, which a web page cannot do.

## Install

```sh
despia add Core/Extensions/AppClip
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

### status

`dsx.module.appclip.status`

Tells you whether this build includes an App Clip. It never asks for anything and never fails.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when the App Clip is part of this build. |

**Example: reports the App Clip ships in this build**

```js
const result = await dsx.module.appclip.status({});
// resolves {"available":true}
```

**Example: reports no App Clip when the package was excluded from the build**

```js
const result = await dsx.module.appclip.status({});
// resolves {"available":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `url` | string | `` | The web address the App Clip opens (without the https:// prefix). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
