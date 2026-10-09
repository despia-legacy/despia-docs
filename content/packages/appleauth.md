---
title: Sign in with Apple
description: Let people sign in to your app with their Apple ID.
package: appleauth
---

Let people sign in to your app with their Apple ID.

Shows Apple's native sign-in sheet and returns an ID token, authorization code, email and name for your account service to verify. The build turns on the Sign in with Apple entitlement for you. Needs an Apple Developer account with Sign in with Apple enabled on your app ID. iOS only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want a one-tap Apple sign-in on iOS that gives your account service an identity token to verify. It is the right choice for any iOS app that also offers other social sign-ins, since the App Store expects Apple as an option.

## What native adds

People use Apple's own sign-in sheet with Face ID and Hide My Email, which a web form cannot offer.

## Install

```sh
despia add Core/Auth/AppleAuth
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### signIn

`dsx.module.appleauth.signIn`

Shows Apple's native sign-in sheet and returns the identity token, authorization code, nonce, Apple user id and, on the first sign-in only, the person's name and email.

**When to use it.** Call it from your sign-in button, then send the identity token and nonce to your account service.

**When not to.** Do not use it to read a name or email again later, since Apple sends them only the first time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `nonce` | string | no | A random value your backend minted to tie this sign-in to a request. Leave it out and one is created for you. |
| `scopes` | string | no | Which details to ask for, as a space or comma list of name and email. It defaults to both. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | yes | A single-use authorization code, for a backend that redeems one. |
| `email` | string | yes | The person's email, sent only on the first authorization and empty afterwards. |
| `familyName` | string | yes | The person's last name, sent only on the first authorization and empty afterwards. |
| `givenName` | string | yes | The person's first name, sent only on the first authorization and empty afterwards. |
| `idToken` | string | yes | The signed token to send to whatever verifies the sign-in. If it is missing the sign-in was refused. |
| `nonce` | string | yes | The raw nonce, which a verifier hashes and compares with the one inside the token. |
| `realUserStatus` | string | yes | Apple's own signal about whether this is a real person: likelyReal, unknown or unsupported. |
| `userIdentifier` | string | yes | Apple's stable id for this person in your app. Store it, since it is the one field that always arrives. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another Sign in with Apple request is already running. | Wait for the first request to finish before starting another. |
| `cancelled` | The person closed the Sign in with Apple sheet without finishing. | Treat it as a normal choice and leave them on the sign-in screen. |
| `failed` | Sign in with Apple did not complete for another reason. | Show a message and let the person try again. |
| `invalid_credential` | Apple finished but returned no identity token, which can happen for a password or passkey credential. | Ask the person to try signing in again. |
| `unavailable` | There is no app window to show the sign-in sheet over. | Call it again once the app is on screen. |

**Example: returns the identity token, the code and the RAW nonce the caller passed**

```js
const result = await dsx.module.appleauth.signIn({"nonce":"n0nce-from-the-caller"});
// resolves {"code":"c_apple_authorization","email":"someone@privaterelay.appleid.com","familyName":"Lovelace","givenName":"Ada","idToken":"eyJ.apple.identity.token","nonce":"n0nce-from-the-caller","realUserStatus":"likelyReal","userIdentifier":"001234.abcdef.1234"}
```

**Example: a later sign-in for the same Apple ID carries no name or email**

```js
const result = await dsx.module.appleauth.signIn({});
// resolves {"code":"c_apple_authorization","email":"","familyName":"","givenName":"","idToken":"eyJ.apple.identity.token","nonce":"minted-by-the-module","realUserStatus":"likelyReal","userIdentifier":"001234.abcdef.1234"}
```

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
