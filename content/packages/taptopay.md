---
title: Tap to Pay
description: Turn the phone itself into a card reader for in-person payments.
package: taptopay
---

Turn the phone itself into a card reader for in-person payments.

Checks whether this phone can accept contactless cards and why not if it cannot, then turns the phone into a reader in the Terminal package. Works with the Payments and Terminal packages. Needs a real device with NFC, iOS 16.4 or later or Android 11 or later, and does not work in simulators.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when your app takes in-person card payments with the phone itself as the reader, together with the Terminal package. Check availability first, because simulators and many devices cannot do it.

## What native adds

Uses the phone's NFC reader and Apple's own Tap to Pay education, which a web page cannot reach.

## Install

```sh
despia add Core/Payments/Modules/TapToPay
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### education

`dsx.module.taptopay.education`

Shows Apple's how to tap guide for merchants, which Apple requires you to offer for Tap to Pay.

**When to use it.** Call it from an onboarding step before the merchant takes their first payment.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `presented` | boolean | yes | True when the guide was shown. |
| `reason` | string | yes | Why it was not shown, such as unsupported_device or unsupported_platform. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | The system is busy presenting another reader screen. |  |
| `education_failed` | Apple's Tap to Pay education could not be shown. |  |
| `network_unavailable` | Apple's education content could not be downloaded. |  |
| `not_ready` | No view controller to present Apple's Tap to Pay education from. |  |
| `unsupported_device` | This device cannot take a Tap to Pay payment: a simulator or emulator, a phone without the OS payment framework or contactless hardware, or a browser. | Not recoverable by retrying. |
| `unsupported_platform` | A browser has no contactless card reader: no ProximityReader and no NFC payment API (Web NFC handles NDEF tags only). | Not recoverable by retrying. |

**Example: Show the Tap to Pay guide**

```js
const result = await dsx.module.taptopay.education({});
// resolves {"presented":true,"reason":""}
```

## Related packages

- Needs: [Payments](/packages/payments), payments.terminal

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
