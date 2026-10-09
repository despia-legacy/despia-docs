---
title: Twilio Voice
description: Make and receive voice calls with Twilio.
package: calltwilio
---

Make and receive voice calls with Twilio.

Works with the Calls package. Places calls to Twilio clients and receives incoming calls on the phone's call screen. Needs a Twilio account and a server that issues Twilio access tokens. Voice only, on iOS, Android and the web.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it with the Calls package when your voice calls run on Twilio. Your server must mint Twilio access tokens; this package never needs your Auth Token or API secret.

## What native adds

Incoming calls ring on the phone's native call screen even when the app is closed, which a web page cannot do.

## Install

```sh
despia add Core/CallTwilio
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

### register

`dsx.module.calltwilio.register`

Registers this device with Twilio so incoming calls can reach it.

**When to use it.** Call it after token, when the person is ready to receive calls.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deviceToken` | string | no | On iOS and Android, the push token that the Calls package register action gave you; the web needs none. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the device is registered with Twilio. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | An argument is missing or malformed. | Not recoverable by retrying. |
| `join_failed` | Twilio refused the call for another reason; twilioCode and twilioMessage name it. |  |
| `network_unavailable` | Twilio could not be reached (31005, 31009, 31530, 53001). |  |
| `not_configured` | No Access Token was handed over (token), or Twilio cannot find the TwiML App (21218) or the account lacks Voice (20403). | Not recoverable by retrying. |
| `token_expired` | The Access Token expired (20104, the web SDK's 31205): hand a fresh one to token. |  |
| `token_invalid` | Twilio refused the Access Token (20101 to 20107, 20151, 20157, 51007, and the web SDK's 31201, 31202, 31204): mint a new one on your server. |  |

**Example: Register this device for incoming calls**

```js
const result = await dsx.module.calltwilio.register({"deviceToken":"push-token-from-the-calls-package"});
// resolves {"ok":true}
```

### token

`dsx.module.calltwilio.token`

Hands Twilio your access token so the app can place and receive calls.

**When to use it.** Call it after sign-in and again whenever your server issues a fresh token, since tokens expire.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | yes | The Twilio access token your server created for this user. Never pass an Auth Token or API secret. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the token was stored. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | An argument is missing or malformed. | Not recoverable by retrying. |

**Example: Give Twilio the access token your server created**

```js
const result = await dsx.module.calltwilio.token({"token":"twilio-access-token-made-by-your-server"});
// resolves {"ok":true}
```

### unregister

`dsx.module.calltwilio.unregister`

Removes this device's registration so it stops receiving incoming calls.

**When to use it.** Call it when the person signs out.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deviceToken` | string | no | On iOS and Android, the push token that was registered; the web needs none. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the device is no longer registered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `join_failed` | Twilio refused the call for another reason; twilioCode and twilioMessage name it. |  |
| `network_unavailable` | Twilio could not be reached (31005, 31009, 31530, 53001). |  |
| `token_expired` | The Access Token expired (20104, the web SDK's 31205): hand a fresh one to token. |  |
| `token_invalid` | Twilio refused the Access Token (20101 to 20107, 20151, 20157, 51007, and the web SDK's 31201, 31202, 31204): mint a new one on your server. |  |

**Example: Stop receiving incoming calls on this device**

```js
const result = await dsx.module.calltwilio.unregister({"deviceToken":"push-token-from-the-calls-package"});
// resolves {"ok":true}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | An argument is missing or malformed. |  |
| `join_failed` | Twilio refused the call for another reason; twilioCode and twilioMessage name it. |  |
| `network_unavailable` | Twilio could not be reached (31005, 31009, 31530, 53001). |  |
| `not_configured` | No Access Token was handed over (token), or Twilio cannot find the TwiML App (21218) or the account lacks Voice (20403). |  |
| `permission_denied` | The microphone permission is not granted (31401, 31402, 31208). |  |
| `token_expired` | The Access Token expired (20104, the web SDK's 31205): hand a fresh one to token. |  |
| `token_invalid` | Twilio refused the Access Token (20101 to 20107, 20151, 20157, 51007, and the web SDK's 31201, 31202, 31204): mint a new one on your server. |  |

## Related packages

- Needs: [Call](/packages/call)
- Used by: [Backend](/packages/calltwilio-modules-backend)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
