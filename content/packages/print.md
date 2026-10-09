---
title: PrintDocuments
description: Print a PDF or other document through the system print sheet.
package: print
---

Print a PDF or other document through the system print sheet.

Presents the system print sheet for a file in your app or for a web address it downloads first, and tells you whether printing went ahead. The person picks the printer and options in the system sheet. You supply the document and a job name.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for receipts, tickets, reports and other documents the person may want on paper. For sharing a file rather than printing it, use the share sheet.

## What native adds

The native print sheet finds nearby AirPrint and system printers and shows the real preview and options, which a web page's print dialog does not.

## Install

```sh
despia add Core/PrintDocuments
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

### document

`dsx.module.print.document`

Shows the system print sheet for a document, which is a file in your app or one downloaded from a web address.

**When to use it.** Use it behind a print button. Give either a path or a url.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `jobName` | string | no | The name shown for the job in the print queue. |
| `path` | string | no | A Files path of the document to print, such as cache:invoice.pdf or documents:report.pdf. Give either path or url. |
| `url` | string | no | A web address to download the document from before printing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `completed` | boolean | yes | True when printing went ahead; false when the person cancelled the print sheet. |
| `fallback` | string | no | On the web only, unknown means the browser cannot tell a cancel from a print, so completed only says the dialog closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cannot_print` | The system found no printable form of this document, so no print sheet can be shown. | Check that the file is a PDF or another printable type, then try again. |
| `download_failed` | Couldn't download the document to print. |  |
| `missing_param` | Pass the document as `path` (a Core/Files path) or `url`. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find an active screen to present the print sheet from. |  |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `print_failed` | The print job couldn't be completed. |  |
| `write_failed` | Couldn't save the document for printing. | Not recoverable by retrying. |

**Example: Print a PDF from the app files**

```js
const result = await dsx.module.print.document({"jobName":"Quarterly report","path":"documents:report.pdf"});
// resolves {"completed":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
