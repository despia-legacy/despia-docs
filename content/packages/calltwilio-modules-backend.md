---
title: Backend
description: The server half of Twilio voice calls: hands out call tokens and answers Twilio's webhooks.
package: backend
---

The server half of Twilio voice calls: hands out call tokens and answers Twilio's webhooks.

Runs on your server so your Twilio secrets never ship inside the app. It creates short-lived access tokens for the signed-in caller, answers Twilio when a call starts with instructions on who to dial, and receives call status updates, checking Twilio's signature each time. You provide the Twilio settings.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you use Twilio Voice calling and need a server to sign tokens and answer Twilio. Do not call it from the app itself, because it holds secrets and only runs on a server.

## Install

```sh
despia add Core/CallTwilio/Modules/Backend
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

### accessToken

`dsx.module.backend.accessToken`

Creates a short-lived Twilio Voice access token for the person who is signed in, so their app can place and receive calls.

**When to use it.** Call it from your server when the app asks to start calling. It needs a signed-in caller.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `platform` | string | no | Which app is asking: ios, android or web. It picks the push credential for incoming calls, and web needs none. |
| `ttl` | number | no | How long the token lasts in seconds, up to 86400. Defaults to 3600. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expires` | number | yes | When the token stops working, in epoch seconds. |
| `identity` | string | yes | The caller's identity inside Twilio, taken from the signed-in person. |
| `token` | string | yes | The access token to give to the calling app. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | The Voice grant is for the signed in caller, and there is none. | Not recoverable by retrying. |
| `bad_request` | platform is ios, android or web. | Not recoverable by retrying. |
| `not_configured` | TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET or TWILIO_TWIML_APP_SID is not set. | Not recoverable by retrying. |

**Example: Create a one hour token for an iOS app**

```js
const result = await dsx.module.backend.accessToken({"platform":"ios","ttl":3600});
// resolves {"expires":1791500000,"identity":"user_123","token":"example-access-token"}
```

### status

`dsx.module.backend.status`

Receives Twilio's call progress updates and passes them on as an event your backend can react to.

**When to use it.** Set its address as the status callback of your Twilio app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the update was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No workflow event feed is installed on this deployment. | Not recoverable by retrying. |
| `unauthenticated` | The X-Twilio-Signature did not verify (401). | Not recoverable by retrying. |

**Example: Accept a call progress update**

```js
const result = await dsx.module.backend.status({});
// resolves {"ok":true}
```

### voice

`dsx.module.backend.voice`

Answers Twilio when a call starts, with instructions to dial the other person's app or a phone number.

**When to use it.** Set its address as the voice URL of your Twilio app. Twilio calls it, not your app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `twiml` | string | yes | The call instructions in Twilio's markup that tell it who to dial. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unauthenticated` | The X-Twilio-Signature did not verify (401). | Not recoverable by retrying. |

**Example: Answer Twilio when a call starts**

```js
const result = await dsx.module.backend.voice({});
// resolves {"twiml":"<Response><Dial><Client>user_456</Client></Dial></Response>"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `account_sid` | string | `` | AC… from the Twilio Console. |
| `api_key_secret` | secret | `` | The secret shown once when the API key was created. It signs Access Tokens. |
| `api_key_sid` | string | `` | SK…, a Standard API key created in the Twilio Console for this app. |
| `auth_token` | secret | `` | The account's Auth Token; it verifies X-Twilio-Signature on the voice and status webhooks. |
| `caller_id` | string | `` | An E.164 number the account owns, used when the app dials a phone number. Empty refuses number calls. |
| `push_credential_sid_apns` | string | `` | CR…, the VoIP push credential for iOS. Optional: without it iOS cannot receive incoming calls. |
| `push_credential_sid_fcm` | string | `` | CR…, the FCM push credential for Android. Optional: without it Android cannot receive incoming calls. |
| `twiml_app_sid` | string | `` | AP…, the TwiML App whose Voice URL is /calltwilio/voice on this backend. |
| `webhook_base_url` | string | `` | The https origin Twilio calls, when the backend sits behind a proxy that rewrites the host; the signature is over that URL. |

## Related packages

- Needs: [CallTwilio](/packages/calltwilio)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
