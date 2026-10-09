---
title: PhotoLibrary
description: Lets your web pages pick photos from, and save images to, the user's photo library.
package: photolibrary
---

Lets your web pages pick photos from, and save images to, the user's photo library.

Supplies the permission messages iOS needs when your web content chooses a picture from the photo library or saves an image to it. It has no calls of its own: the page uses the normal web file picker and save sheet, and the system asks the user when they are first used. You write the two messages users see.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your web pages let people upload a photo or save an image to Photos. Without the messages, iOS can refuse photo access and App Review can reject the app. Skip it if your pages never touch the photo library.

## Install

```sh
despia add Core/WebPlatform/PhotoLibrary
```

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

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_add_description` | multiline | `Adding your desired picture to your Photos library` | The message shown when iOS asks permission to save images to the photo library. |
| `usage_description` | multiline | `Processing your chosen picture for additional use in the app` | The message shown when iOS asks the user for photo library access. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
