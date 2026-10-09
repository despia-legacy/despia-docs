---
title: Scanner
description: Scan QR codes, barcodes and paper documents with the camera.
package: scanner
---

Scan QR codes, barcodes and paper documents with the camera.

Opens the phone's own scanner to read a QR code or barcode, or to scan a paper document into pages with the text read off them. It also gives you a scanner preview you can place inside your own layout. QR and barcode scanning stay free.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when people need to scan a QR code, a barcode or a paper document. If you want your own camera screen with scanning on top, use the scanner preview in your layout instead.

## What native adds

It uses the system scanners, VisionKit on iOS and Google's scanner on Android, which are fast and handle focus and edge detection for you.

## Install

```sh
despia add Core/Scanner
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

### scan

`dsx.module.scanner.scan`

Opens the system scanner for a code or a document and resolves with what was read. Backing out resolves as cancelled.

**When to use it.** Use it for a one-off scan, such as a ticket or a receipt.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `facing` | string | no | On the web code sheet only, which camera to use: back, the default, or front. |
| `for` | string | yes | What to scan, either code or document. |
| `formats` | array of string | no | For codes only, the code types to read. Left out, QR, EAN-8 and EAN-13 are read on the phone, and everything the reader knows on the web. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the person backed out without scanning. |
| `format` | string | no | For a code, the type of code that was read, such as qr. |
| `pages` | array of object | no | For a document, the scanned pages, each with a file path and the text read from it. |
| `result` | string | no | The older name for value, kept so existing pages still work. |
| `type` | string | no | The older name for format, kept so existing pages still work. |
| `value` | string | no | For a code, the text the code contains. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | The camera is in use by something else. | Close the other camera feature, then try again. |
| `camera_unavailable` | This device has no usable camera. | Offer another way to enter the code. |
| `invalid_param` | The for value must be code or document. | Pass for as code or document. |
| `no_presenter` | There is no screen to show the scanner over. | Call again once the app is on screen. |
| `permission_denied` | The person has not allowed camera access. | Ask them to enable the camera in Settings, then try again. |
| `scan_in_progress` | A scan is already open, and only one can run at a time. | Wait for the open scan to finish. |
| `scanner_failed` | The scanner could not finish. | Let the person try again. |
| `scanner_unsupported` | This device has no document scanner. | Offer a normal photo capture instead. |
| `unsupported_platform` | This browser has no barcode detector and the bundled reader did not load. | Use a browser that supports the Barcode Detector, or scan in the app. |

**Example: reads a code**

```js
const result = await dsx.module.scanner.scan({"for":"code","formats":["qr"]});
// resolves {"format":"qr","value":"https://despia.com"}
```

**Example: a document is its pages as Files paths**

```js
const result = await dsx.module.scanner.scan({"for":"document"});
// resolves {"pages":[{"path":"cache:despia-scan/scan-1.jpg","text":"INVOICE 42"}]}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Scanning codes and documents with your camera.` | The message shown when iOS asks the user for camera access to scan a code or a document. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | The camera is in use by something else. | Close the other camera feature, then try again. |
| `camera_unavailable` | This device has no usable camera. | Offer another way to enter the code. |
| `invalid_param` | The for value must be code or document. | Pass for as code or document. |
| `no_presenter` | There is no screen to show the scanner over. | Call again once the app is on screen. |
| `permission_denied` | The person has not allowed camera access. | Ask them to enable the camera in Settings, then try again. |
| `scan_in_progress` | A scan is already open, and only one can run at a time. | Wait for the open scan to finish. |
| `scanner_failed` | The scanner could not finish. | Let the person try again. |
| `scanner_unsupported` | This device has no document scanner. | Offer a normal photo capture instead. |
| `unsupported_platform` | This browser has no barcode detector and the bundled reader did not load. | Use a browser that supports the Barcode Detector, or scan in the app. |

## Related packages

- Works better with: chain:camera

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
