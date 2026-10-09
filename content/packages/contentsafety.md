---
title: Image safety check
description: Detect explicit images on the device so your content rules can hold or block them.
package: contentsafety
---

Detect explicit images on the device so your content rules can hold or block them.

Checks photos for explicit or suggestive content and passes the result to the Content policy package, which decides what to do. The image never leaves the device. On iOS it uses Apple's own detector, which respects the Sensitive Content Warning setting. Works with the Content policy package.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your app lets people share photos and you want explicit images flagged on the device, before sending or after receiving. It only produces a score, and your content rules decide what happens next.

## What native adds

Detection runs on the device, so the photo never leaves it, and on Apple devices it uses the system's own detector and the person's Sensitive Content Warning setting.

## Install

```sh
despia add Core/ContentSafety
```

A commercial package: it is added the same way, and the build checks your plan includes it.

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

## Related packages

- Needs: [Policy](/packages/policy)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
