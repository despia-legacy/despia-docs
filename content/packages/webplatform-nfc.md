---
title: NFC
description: Adds the NFC permission text iOS needs when a page or package touches NFC.
package: nfc
---

Adds the NFC permission text iOS needs when a page or package touches NFC.

Declares the sentence iOS shows before it lets the app scan NFC tags, so a page or a custom package that reaches NFC does not crash for lack of it. You get no commands from it; the NFC package provides reading and writing. Web NFC itself only works in Chrome on Android, not inside an in-app web view. You write the permission sentence.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when a page or custom code in your app touches NFC on iOS and you need the required permission text. For reading and writing tags from your layouts, use the NFC package instead.

## Install

```sh
despia add Core/WebPlatform/NFC
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

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Read and write NFC tags.` | The message shown when iOS asks the user for NFC tag scanning. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
