---
title: Share sheet
description: Let people share text, links and files from your app through the phone's share sheet.
package: share
---

Let people share text, links and files from your app through the phone's share sheet.

Opens the native share sheet so users can send to Messages, Mail, WhatsApp, AirDrop, Files or copy to the clipboard. You can share a message, a link and attachments from your app's files together. No account or keys needed.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when the user wants to send something out of your app, such as a link, a message or a file, through whichever app they choose. It does not post to a specific network for you.

## What native adds

The user gets the real system share sheet with their own apps and contacts, and files go as true attachments.

## Install

```sh
despia add Core/SocialShare
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

### url

`dsx.module.share.url`

Opens the system share sheet with a message, a link and files, and resolves when the user shares or closes it.

**When to use it.** Call it from a share button. Closing the sheet is a normal answer, reported as completed false, not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `file` | string | no | A single file to attach, in the same forms as files. |
| `files` | array of string | no | A list of files to attach, each a file path from the app's storage or a File or Blob object. |
| `message` | string | no | Text to share. Surrounding spaces are trimmed. |
| `url` | string | no | A link to share. A value that is not a valid address is ignored. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activityType` | string | no | The system identifier of the chosen target. Only iOS can name it; it is empty on dismissal and on platforms that do not report it. |
| `completed` | boolean | yes | True when the user shared, false when they closed the sheet. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | There is no screen available to show the share sheet on. | Call it again while the app is in the foreground, from a user action. |
| `nothing_to_share` | None of the message, link or files produced anything to share. | Pass at least one non-empty message, a valid link or a file. |
| `share_failed` | The system could not show the share sheet or prepare the files. | Check that the files exist and try again. |

**Example: shares a message and a link, and names the chosen target on iOS**

```js
const result = await dsx.module.share.url({"message":"Check out this listing","url":"https://example.com/listings/cozy-loft"});
// resolves {"activityType":"com.apple.UIKit.activity.Message","completed":true}
```

**Example: a dismissed sheet resolves rather than failing**

```js
const result = await dsx.module.share.url({"url":"https://example.com"});
// resolves {"completed":false}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
