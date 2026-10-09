---
title: Persona
description: Verify your users' identity with Persona's checks inside your app.
package: persona
---

Verify your users' identity with Persona's checks inside your app.

Opens Persona's identity verification flow from a template you set up, or resumes one your server created, and tells your app when the person finishes or leaves. Your server reads the real result with your Persona API key. iOS and Android only. Needs a Persona account, plus camera permission text.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you must confirm who a person is with a government ID and a selfie, for example for finance or age checks. The result on the device is only a report; your server must read the real verdict from Persona.

## Install

```sh
despia add Core/Persona
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### start

`dsx.module.persona.start`

Opens Persona's identity check from a template, or resumes one your server created, and finishes when the person completes or leaves it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inquiryId` | string | no | The id of a check your server already created, to resume it. Give this or templateId. |
| `referenceId` | string | no | Your own id for the person, so you can match the check to your records. |
| `sessionToken` | string | no | The session value your server received with the inquiry, needed when resuming one. |
| `templateId` | string | no | The Persona template id that defines the check. Give this or inquiryId. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inquiryId` | string | no | The id of the check, when Persona gave one. |
| `status` | string | yes | How the check ended on the device, such as completed, failed, canceled, pending or unknown. Your server holds the final decision. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Persona check is already open. | Wait for the open check to finish. |
| `invalid_param` | The value is not a Persona template or inquiry id. | Copy the id from your Persona dashboard. |
| `missing_param` | Neither a template id nor an inquiry id was given. | Pass templateId or inquiryId. |
| `not_configured` | On the web, Persona needs a web SDK version in the package config. | Set the web SDK version in the package config. |
| `sdk_error` | Persona could not run the check. | Try again, and contact Persona if it keeps failing. |
| `unavailable` | No screen can show the Persona flow right now. | Try again while the app is in the foreground. |

**Example: starts a template inquiry**

```js
const result = await dsx.module.persona.start({"templateId":"itmpl_Abc123"});
// resolves {"inquiryId":"inq_1","status":"completed"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `camera_usage_description` | string | `This app uses the camera to verify your identity.` | Why the app uses the camera during identity verification (iOS asks with this text). |
| `environment` | string | `sandbox` | sandbox while testing, production for real inquiries. |
| `web_sdk_version` | string | `` | The embedded flow version to load on the web (e.g. 5.1.2); Persona publishes versioned files only. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
