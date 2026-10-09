---
title: Preview
description: Show a live camera view inside your own screen that reads QR codes and barcodes.
package: preview
---

Show a live camera view inside your own screen that reads QR codes and barcodes.

Optional inline scanner surface over the callable Camera session. System scanner.scan does not require this component.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when the scanning view should sit inside your own layout and keep scanning while people watch it, for example a checkout or ticket check screen. Skip it if a full screen scan is enough, because the scan action of the Scanner package needs no component.

## Install

```sh
despia add Core/Scanner/Components/Preview
```

A commercial package: it is added the same way, and the build checks your plan includes it.

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

## Related packages

- Needs: chain:camera

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
