---
title: SceneAR
description: Place 3D scene content on real surfaces seen through the camera.
package: ar
---

Place 3D scene content on real surfaces seen through the camera.

Lets a 3D scene run in augmented reality, with the camera behind it and parts of the scene attached to flat surfaces the device finds, such as a floor or table. You write the scene and say what happens when a surface is found. It is off by default, works together with the AR package that owns the camera session, and for now only renders in AR on iOS.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when a 3D scene should appear in the person's room, for example to place furniture or a product. Skip it for ordinary 3D scenes, which need nothing extra.

## What native adds

It uses the phone's camera and surface detection, which only native apps can reach.

## Install

```sh
despia add Core/Scene/Modules/AR
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
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
