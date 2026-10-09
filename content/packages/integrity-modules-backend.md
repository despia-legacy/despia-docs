---
title: Backend
description: Server-side half of device integrity: reads and writes per-device flags that survive reinstalls.
package: backend
---

Server-side half of device integrity: reads and writes per-device flags that survive reinstalls.

Runs on your own server and talks to Apple DeviceCheck and Google Play Integrity. It checks a device claim sent by your app, then reads or writes a few flags tied to that physical device, such as "this device already used its free trial". Your keys stay on your server, and you decide what each flag means.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it on your server to stop one device from claiming a free trial or promotion again after reinstalling. It should gate a benefit, never a sign-in.

## Install

```sh
despia add Core/Integrity/Modules/Backend
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### recall

`dsx.module.backend.recall`

Reads the per-device flags for a device claim, and optionally writes them first. It checks the claim with Apple or Google before answering.

**When not to.** Do not call it from the app, since a device that could call it could clear its own flags. Call it only from your own server code.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `challenge` | string | yes | The one-time challenge your server issued for this claim. |
| `format` | string | yes | Which service made the claim: apple.devicecheck or google.playintegrity. |
| `set` | array of boolean | no | Values to write first, one entry per flag: true or false to write it, null to leave it alone. |
| `token` | string | yes | The token the device produced, as sent by your app. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bits` | array of boolean | yes | The flags after any write: two on Apple and three on Google. |
| `format` | string | yes | The claim format that was checked. |
| `known` | boolean | yes | False for a device your app never wrote to, in which case every flag is false. |
| `months` | array of string | yes | When each flag was last changed as YYYY-MM, or empty while it is unset. |
| `provider` | string | yes | The service that answered, Apple or Google. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request cannot be acted on; data.why says whether the token or challenge is missing, the format is unknown, set is invalid or the token is unreadable. | Check the value named in data.why and send a corrected request. |
| `forbidden` | The Play Integrity token does not prove this claim; data.why says it was made for another app or challenge, or is older than ten minutes. | Ask the app for a fresh claim with your current challenge. |
| `not_configured` | The server is missing setup for this service; data.why says whether a key setting is missing or Play Integrity device recall is not enabled. | Add the missing setting named in data.what, or enrol the app in device recall in the Play Console. |
| `unavailable` | Apple or Google did not answer usefully; data.why says whether it was rate limiting, an outage or an unexpected reply. | Try again later. |
| `upstream` | Apple or Google refused the request, for example because of an unknown key or an expired authentication token. | Check the keys and settings on your server, using data.vendorCode for the status. |

**Example: Read the device flags for an Apple claim and set the first one**

```js
const result = await dsx.module.backend.recall({"challenge":"challenge-issued-by-your-server","format":"apple.devicecheck","set":[true,null],"token":"device-token-from-your-app"});
// resolves {"bits":[true,false],"format":"apple.devicecheck","known":true,"months":["2026-10",""],"provider":"Apple"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `devicecheck_environment` | string | `development` | development for Xcode and TestFlight builds, production for the App Store. |
| `devicecheck_key_id` | string | `` | The key's ID from the same page (example 2X9R4HXF34). |
| `devicecheck_private_key` | secret | `` | The .p8 file of a key with DeviceCheck enabled, from Certificates, Identifiers & Profiles, Keys. It signs the requests that read and write a device's two bits. |
| `devicecheck_team_id` | string | `` | Your Apple Developer team ID (Membership details). |
| `play_package_name` | string | `` | The applicationId of your Android app. A token made for any other app is refused. |
| `play_service_account` | secret | `` | The JSON key of a Google Cloud service account in the project linked to your Play app, with the Play Integrity API enabled. |

## Related packages

- Needs: [Integrity](/packages/integrity)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
