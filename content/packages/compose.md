---
title: Compose
description: Opens the system text message or email composer with your message filled in, for the user to send.
package: compose
---

Opens the system text message or email composer with your message filled in, for the user to send.

Presents the phone's own SMS or mail composer prefilled with recipients, subject, text and attachments. The user reads it and taps send themselves, so no permission is needed and the app never sends anything silently. You decide the content and when to offer the button.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for contact support, share by text or email buttons where the user should see and approve the message. To send mail from your server, use a backend instead.

## What native adds

The system composer uses the user's own mail and messages apps and accounts, and needs no permission or mail server. A web page can only open a basic mailto link.

## Install

```sh
despia add Core/Compose
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

### capabilities

`dsx.module.compose.capabilities`

Tells you which app would handle email links on this device, when the system will say.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `defaultMailClient` | string | no | The package or bundle id of the app that opens email links, if the system names it. |

**Example: a phone with Gmail as the default client**

```js
const result = await dsx.module.compose.capabilities({});
// resolves {"defaultMailClient":"com.google.android.gm"}
```

**Example: iOS never names the default client, so the field is absent**

```js
const result = await dsx.module.compose.capabilities({});
// resolves {}
```

### mail

`dsx.module.compose.mail`

Opens the system mail composer with recipients, subject, text and attachments filled in. The user taps send, and the app never sends it for them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attachments` | array of string | no | Files to attach, as Files paths. |
| `bcc` | array of string | no | The email addresses to copy without showing them to others. |
| `body` | string | no | The text of the email. |
| `cc` | array of string | no | The email addresses to copy. |
| `isHtml` | boolean | no | Set to true if the body is HTML instead of plain text. |
| `subject` | string | no | The subject line of the email. |
| `to` | array of string | no | The email addresses to send to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `isHtml` | boolean | no | True if the body was given as HTML. |
| `result` | string | yes | How it ended: sent, cancelled, saved (a mail draft), failed or unknown. Android and the web cannot tell, so they answer unknown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attachment_failed` | An attachment could not be prepared for the composer. | Check that the file path exists and that the file is readable. |
| `no_composer` | No composer could be opened on this device right now. | Try again, or offer another way to contact. |
| `too_many_recipients` | The message has more recipients than one message may have. | Send to fewer people, or split it into several messages. |
| `unsupported_device` | No mail app is set up on this device. | Check support with dsx.has before offering the button, or show an address to copy. |

**Example: the user sends the prefilled mail**

```js
const result = await dsx.module.compose.mail({"body":"Attached.","subject":"Receipt","to":["jane@example.com"]});
// resolves {"result":"sent"}
```

**Example: the user saves it as a draft**

```js
const result = await dsx.module.compose.mail({"subject":"Receipt","to":["jane@example.com"]});
// resolves {"result":"saved"}
```

### sms

`dsx.module.compose.sms`

Opens the system text message composer with recipients, text and attachments filled in. The user taps send, and the app never sends it for them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attachments` | array of string | no | Files to attach, as Files paths. |
| `body` | string | no | The text of the message. |
| `to` | array of string | no | The phone numbers to send to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `result` | string | yes | How it ended: sent, cancelled, saved (a mail draft), failed or unknown. Android and the web cannot tell, so they answer unknown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attachment_failed` | An attachment could not be prepared for the composer. | Check that the file path exists and that the file is readable. |
| `no_composer` | No composer could be opened on this device right now. | Try again, or offer another way to contact. |
| `too_many_recipients` | The message has more recipients than one message may have. | Send to fewer people, or split it into several messages. |
| `unsupported_device` | This device cannot send text messages, for example a tablet with no SIM. | Check support with dsx.has before offering the button. |

**Example: the user sends the prefilled message**

```js
const result = await dsx.module.compose.sms({"body":"On my way","to":["+15551234567"]});
// resolves {"result":"sent"}
```

**Example: the user backs out**

```js
const result = await dsx.module.compose.sms({"body":"On my way","to":["+15551234567"]});
// resolves {"result":"cancelled"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `max_recipients` | number | `100` | How many recipients one message may carry before the app refuses to open the composer. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
