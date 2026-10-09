---
title: Supabase Auth
description: Give every visitor an account from first launch with Supabase and keep it when they sign in.
package: supabase
---

Give every visitor an account from first launch with Supabase and keep it when they sign in.

Creates an anonymous Supabase user at first launch, so purchases and progress have an owner before any login screen. When the person later signs in, the same account is linked, so nothing is lost. Needs a Supabase project, its URL and publishable key.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app's accounts live in Supabase and you want every visitor to have an account from the first launch, then add email, phone, Apple or Google sign-in later without losing their data. Skip it if your backend does its own authentication.

## What native adds

The session is kept in secure device storage and refreshed for you, and Sign in with Apple uses the native sheet instead of a web page.

## Install

```sh
despia add Core/Auth/Supabase
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

### auth.getSession

`dsx.module.supabase.auth.getSession`

Returns the current session, refreshing it first when it is about to expire. Being signed out is a normal answer, not an error.

**When to use it.** Call it on screens that need to know who the user is.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `email` | string | yes | The user's email address, when they have one. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `phone` | string | yes | The user's phone number, when they have one. |
| `providers` | array of string | yes | The sign-in methods linked to this account. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `session_expired` | The saved session is no longer valid. Sign in again. |  |

**Example: a signed-out build resolves the empty session rather than failing**

```js
const result = await dsx.module.supabase.auth.getSession({});
// resolves {"accessToken":"","anonymous":false,"email":"","expiresAt":0,"phone":"","providers":[],"signedIn":false,"userId":""}
```

### auth.getUserIdentities

`dsx.module.supabase.auth.getUserIdentities`

Lists the sign-in methods linked to this account, for a settings screen that shows what is connected.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many sign-in methods are linked. |
| `identities` | array of object | yes | The linked sign-in methods, each with its id and provider. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `not_signed_in` | There is no session to read identities from. |  |

**Example: an anonymous account has no identities at all**

```js
const result = await dsx.module.supabase.auth.getUserIdentities({});
// resolves {"count":0,"identities":[]}
```

### auth.refreshSession

`dsx.module.supabase.auth.refreshSession`

Forces a fresh access token now. Use it after your own backend answered 401 and you want a new token before you retry.

**When not to.** getSession already refreshes when needed, so you do not need this in normal use.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `not_signed_in` | There is no session to refresh. |  |
| `session_expired` | The saved session is no longer valid. Sign in again. |  |

**Example: Refresh the signed-in session**

```js
const result = await dsx.module.supabase.auth.refreshSession({});
// resolves {"accessToken":"eyJ-example-access-token","anonymous":false,"expiresAt":1790000000,"signedIn":true,"userId":"3f6c1a52-0000-4000-8000-000000000001"}
```

### auth.resetPasswordForEmail

`dsx.module.supabase.auth.resetPasswordForEmail`

Sends a password recovery email. The reply is the same whether or not the address has an account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The email address to send the recovery link to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | boolean | yes | True when the recovery email was requested. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | `email` must be an email address. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. |  |

**Example: accepts the request without confirming the address exists**

```js
const result = await dsx.module.supabase.auth.resetPasswordForEmail({"email":"someone@example.com"});
// resolves {"sent":true}
```

### auth.signInAnonymously

`dsx.module.supabase.auth.signInAnonymously`

Creates a guest account at first launch, or returns the one you already have. Safe to call every time the root screen appears.

**When not to.** Do not use it to sign in someone who already has an email or password account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Extra profile values to store on the new guest user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `created` | boolean | yes | True when this call created a new guest user instead of reusing one. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `anonymous_disabled` | This project does not allow anonymous sign-ins. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. |  |

**Example: a live session is returned untouched, nothing is minted**

```js
const result = await dsx.module.supabase.auth.signInAnonymously({});
// resolves {"accessToken":"","anonymous":true,"created":false,"expiresAt":0,"signedIn":true,"userId":"11111111-1111-4111-8111-111111111111"}
```

### auth.signInWithIdToken

`dsx.module.supabase.auth.signInWithIdToken`

Signs in with a token issued by a native sign-in, such as the Sign in with Apple sheet. For a guest the account is linked instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | no | The provider's access token, when it issues one. |
| `idToken` | string | yes | The identity token from the native sign-in. |
| `nonce` | string | no | The raw nonce that was used to request the token, if any. |
| `provider` | string | yes | The provider that issued the token, such as apple or google. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `linked` | boolean | yes | True when the provider was attached to a guest account. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `identity_already_exists` | That sign-in method already belongs to another account. |  |
| `invalid_credentials` | The provider's token was rejected. |  |
| `invalid_param` | Pass a `provider` and the `idToken` it issued. | Not recoverable by retrying. |
| `manual_linking_disabled` | This project does not allow linking a sign-in method to an existing user. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `provider_unavailable` | That sign-in provider is not available on this build. | Not recoverable by retrying. |

**Example: exchanges an Apple id_token for a session**

```js
const result = await dsx.module.supabase.auth.signInWithIdToken({"idToken":"eyJ.apple.token","provider":"apple"});
// resolves {"accessToken":"eyJ.access.token","anonymous":false,"expiresAt":1793000000,"linked":false,"signedIn":true,"userId":"33333333-3333-4333-8333-333333333333"}
```

**Example: an anonymous session links Apple to the id it already has**

```js
const result = await dsx.module.supabase.auth.signInWithIdToken({"idToken":"eyJ.apple.token","provider":"apple"});
// resolves {"accessToken":"eyJ.access.token","anonymous":false,"expiresAt":1793000000,"linked":true,"signedIn":true,"userId":"11111111-1111-4111-8111-111111111111"}
```

### auth.signInWithOAuth

`dsx.module.supabase.auth.signInWithOAuth`

Starts sign-in with a web provider such as Google or GitHub in the system sign-in sheet. For a guest it links the provider to the same account.

**When not to.** For Sign in with Apple on iOS use signInWithIdToken, which shows the native sheet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `onConflict` | string | no | What to do when that account already belongs to another user. |
| `provider` | string | yes | The provider to use, such as google or github; it must be listed in the package settings. |
| `scopes` | string | no | Extra permissions to ask the provider for, separated by spaces. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `linking` | boolean | yes | True when this attaches the provider to a guest account. |
| `mode` | string | yes | Whether the call signed in or linked an account. |
| `provider` | string | yes | The provider that was used. |
| `started` | boolean | yes | True when the sign-in sheet was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The user closed the sign-in sheet before finishing. | Treat it as the user's choice and let them try again. |
| `identity_already_exists` | That sign-in method already belongs to another account. |  |
| `invalid_credential` | Apple returned no identity token to exchange. |  |
| `invalid_param` | `provider` must be one of the providers this build declares. | Not recoverable by retrying. |
| `manual_linking_disabled` | This project does not allow linking a sign-in method to an existing user. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `provider_unavailable` | That sign-in provider is not available on this build. | Not recoverable by retrying. |

**Example: acks the started sheet rather than waiting out a human**

```js
const result = await dsx.module.supabase.auth.signInWithOAuth({"provider":"google"});
// resolves {"linking":false,"mode":"browser","provider":"google","started":true}
```

**Example: an anonymous session starts the LINK authorize flow**

```js
const result = await dsx.module.supabase.auth.signInWithOAuth({"provider":"google"});
// resolves {"linking":true,"mode":"native","provider":"google","started":true}
```

### auth.signInWithOtp

`dsx.module.supabase.auth.signInWithOtp`

Sends a one-time code or magic link to an email address or phone number. Finish with verifyOtp.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The email address to send to; give this or phone. |
| `onConflict` | string | no | What to do when that address already belongs to another account. |
| `phone` | string | no | The phone number to send an SMS to; give this or email. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channel` | string | yes | How the code was sent, email or sms. |
| `destination` | string | yes | The address or number the code was sent to. |
| `linking` | boolean | yes | True when the code adds a sign-in method to a guest account instead of logging in. |
| `sent` | boolean | yes | True when the code was handed to the mail or SMS service. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `identity_already_exists` | That sign-in method already belongs to another account. |  |
| `invalid_param` | Pass exactly one of `email` or `phone`. | Not recoverable by retrying. |
| `manual_linking_disabled` | This project does not allow linking a sign-in method to an existing user. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. |  |

**Example: sends a magic link to an email**

```js
const result = await dsx.module.supabase.auth.signInWithOtp({"email":"someone@example.com"});
// resolves {"channel":"email","destination":"someone@example.com","linking":false,"sent":true}
```

**Example: an anonymous session sends the address-change code instead**

```js
const result = await dsx.module.supabase.auth.signInWithOtp({"email":"someone@example.com"});
// resolves {"channel":"email","destination":"someone@example.com","linking":true,"sent":true}
```

### auth.signInWithPassword

`dsx.module.supabase.auth.signInWithPassword`

Signs in with an email or phone and a password. For a guest it links that sign-in method to the same account, so nothing is lost.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The email address; give this or phone. |
| `onConflict` | string | no | What to do when that sign-in already belongs to another account. |
| `password` | string | yes | The password for the account being signed in. |
| `phone` | string | no | The phone number; give this or email. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `linked` | boolean | yes | True when the sign-in method was attached to the existing guest account. |
| `needsConfirmation` | boolean | yes | True when the user must confirm the address before the link takes effect. |
| `replacedUserId` | string | no | The guest user id that was replaced, when the app switched to an existing account. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `email_not_confirmed` | Confirm the email address before signing in. |  |
| `identity_already_exists` | That sign-in method already belongs to another account. |  |
| `invalid_credentials` | That email, phone or password is not right. |  |
| `invalid_param` | Pass exactly one of `email` or `phone`, plus a `password`. | Not recoverable by retrying. |
| `manual_linking_disabled` | This project does not allow linking a sign-in method to an existing user. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. |  |

**Example: signs a returning user in**

```js
const result = await dsx.module.supabase.auth.signInWithPassword({"email":"returning@example.com","password":"correct-horse-battery-staple"});
// resolves {"accessToken":"eyJ.access.token","anonymous":false,"expiresAt":1793000000,"linked":false,"needsConfirmation":false,"signedIn":true,"userId":"33333333-3333-4333-8333-333333333333"}
```

**Example: an anonymous session KEEPS its user id and links the credential**

```js
const result = await dsx.module.supabase.auth.signInWithPassword({"email":"upgrading@example.com","password":"correct-horse-battery-staple"});
// resolves {"accessToken":"eyJ.access.token","anonymous":true,"expiresAt":1793000000,"linked":true,"needsConfirmation":true,"signedIn":true,"userId":"11111111-1111-4111-8111-111111111111"}
```

### auth.signOut

`dsx.module.supabase.auth.signOut`

Ends the session on this device, or on every device. A guest account cannot sign out unless you force it, because signing out would lose the account for good.

**When not to.** For a guest, link a sign-in method first instead of signing out.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `force` | boolean | no | Set true to sign out an anonymous guest and abandon its account. |
| `scope` | string | no | Which sessions to end: local (this device, the default), global (all devices) or others (all but this one). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `signedOut` | boolean | yes | True when the session was ended. |
| `wasAnonymous` | boolean | yes | True when the session that ended belonged to a guest. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `anonymous_signout_refused` | Signing out an anonymous account deletes it for good. Link a sign-in method first. | Not recoverable by retrying. |
| `invalid_param` | `scope` must be local, global or others. | Not recoverable by retrying. |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |

**Example: signs a permanent user out**

```js
const result = await dsx.module.supabase.auth.signOut({});
// resolves {"signedOut":true,"wasAnonymous":false}
```

**Example: force discards the anonymous account when the caller means it**

```js
const result = await dsx.module.supabase.auth.signOut({"force":true});
// resolves {"signedOut":true,"wasAnonymous":true}
```

### auth.signUp

`dsx.module.supabase.auth.signUp`

Creates a permanent account with an email or phone number and a password. A guest should use signInWithPassword instead, which keeps their data.

**When not to.** Not for a guest who already has an anonymous account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Extra profile values to store on the user. |
| `email` | string | no | The new account's email address; give this or phone. |
| `password` | string | yes | The password for the new account. |
| `phone` | string | no | The new account's phone number; give this or email. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `needsConfirmation` | boolean | yes | True when the user must confirm their address before they can sign in. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `identity_already_exists` | This device already has an anonymous account. Use signInWithPassword to keep it. |  |
| `invalid_param` | Pass exactly one of `email` or `phone`, plus a `password`. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. |  |
| `user_already_exists` | An account already exists for that email or phone. |  |
| `weak_password` | That password does not meet the project's requirements. |  |

**Example: a project with confirmations on creates the user and waits**

```js
const result = await dsx.module.supabase.auth.signUp({"email":"new@example.com","password":"correct-horse-battery-staple"});
// resolves {"accessToken":"","expiresAt":0,"needsConfirmation":true,"signedIn":false,"userId":"22222222-2222-4222-8222-222222222222"}
```

### auth.unlinkIdentity

`dsx.module.supabase.auth.unlinkIdentity`

Disconnects one sign-in method from the account. The last remaining one cannot be removed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identityId` | string | yes | The id of the sign-in method to remove, from getUserIdentities. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `remaining` | number | yes | How many sign-in methods are still linked. |
| `unlinked` | boolean | yes | True when the method was removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | `identityId` must name one of this account's identities. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `not_signed_in` | There is no session to unlink from. |  |
| `single_identity` | An account keeps at least one sign-in method. | Not recoverable by retrying. |

**Example: unlinks one of two identities**

```js
const result = await dsx.module.supabase.auth.unlinkIdentity({"identityId":"44444444-4444-4444-8444-444444444444"});
// resolves {"remaining":1,"unlinked":true}
```

### auth.updateUser

`dsx.module.supabase.auth.updateUser`

Changes the signed-in user's email, phone, password or profile values. A new email or phone usually stays pending until confirmed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Profile values to store on the user. |
| `email` | string | no | A new email address for the account. |
| `password` | string | no | A new password; also how a guest or social account adds one. |
| `phone` | string | no | A new phone number for the account. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The user's email address after the call. |
| `pending` | boolean | yes | True when the change waits for the user to confirm it. |
| `phone` | string | yes | The user's phone number after the call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `identity_already_exists` | That sign-in method already belongs to another account. |  |
| `invalid_param` | Pass at least one of `email`, `phone`, `password` or `data`. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `not_signed_in` | There is no session to update. |  |
| `weak_password` | That password does not meet the project's requirements. |  |

**Example: an email change waits for confirmation**

```js
const result = await dsx.module.supabase.auth.updateUser({"email":"moved@example.com"});
// resolves {"email":"moved@example.com","pending":true,"phone":"","userId":"33333333-3333-4333-8333-333333333333"}
```

### auth.verifyOtp

`dsx.module.supabase.auth.verifyOtp`

Checks the code the user received and signs them in, or links the address to their guest account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The email address the code was sent to. |
| `phone` | string | no | The phone number the code was sent to. |
| `token` | string | yes | The code or token the user received. |
| `type` | string | no | The kind of code; normally worked out for you, so pass it only when the flow started elsewhere. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accessToken` | string | yes | The current access token to send to your backend. |
| `anonymous` | boolean | yes | True when the signed-in user is an anonymous guest with no sign-in method yet. |
| `expiresAt` | number | yes | When the access token expires, in epoch seconds. |
| `linked` | boolean | yes | True when the address was attached to a guest account. |
| `signedIn` | boolean | yes | True when there is a signed-in user after this call. |
| `userId` | string | yes | The id of the signed-in user, which stays the same when a guest links a sign-in method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_credentials` | That code is not right. |  |
| `invalid_param` | Pass a `token` and the address it was sent to. | Not recoverable by retrying. |
| `network_unavailable` | The Supabase project could not be reached. |  |
| `not_configured` | No Supabase project is configured for this build. | Not recoverable by retrying. |
| `otp_expired` | That code has expired. Ask for a new one. |  |

**Example: redeems a magic-link code into a session**

```js
const result = await dsx.module.supabase.auth.verifyOtp({"email":"someone@example.com","token":"123456"});
// resolves {"accessToken":"eyJ.access.token","anonymous":false,"expiresAt":1793000000,"linked":false,"signedIn":true,"userId":"33333333-3333-4333-8333-333333333333"}
```

### capabilities

`dsx.module.supabase.capabilities`

Reports which sign-in buttons this build can show, based on the settings, what the project allows and what this device can do.

**When to use it.** Call it before drawing a sign-in screen so you only offer working methods.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | yes | True when the project allows anonymous sign-in. |
| `appleLane` | string | yes | How Sign in with Apple runs on this device, natively or in the browser. |
| `configured` | boolean | yes | True when a Supabase project is set up. |
| `declared` | array of string | yes | The providers listed in the package settings. |
| `guideline48` | object | yes | Whether App Store rule 4.8 asks for Sign in with Apple and whether this build meets it. |
| `guideline48.required` | boolean | yes | True when offering other social sign-ins means Sign in with Apple is also required. |
| `guideline48.satisfied` | boolean | yes | True when this build already meets that requirement. |
| `manualLinking` | boolean | yes | True when the project lets a user link another sign-in method to an existing account. |
| `projectRef` | string | yes | The short reference id of the project. |
| `providers` | array of string | yes | The sign-in providers you can offer on this device right now. |

**Example: an unconfigured build answers honestly instead of failing**

```js
const result = await dsx.module.supabase.capabilities({});
// resolves {"anonymous":false,"appleLane":"unavailable","configured":false,"declared":[],"guideline48":{"required":false,"satisfied":true},"manualLinking":false,"projectRef":"","providers":[]}
```

### configure

`dsx.module.supabase.configure`

Selects the Supabase project at run time. Use it only when the project is chosen after launch; a project set in the package settings is ready at boot.

**When not to.** Skip it when the project URL and key are in the package settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonKey` | string | yes | The project's publishable (anon) key. |
| `url` | string | yes | The https address of your Supabase project. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the project was set. |
| `projectRef` | string | yes | The short reference id of the project. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | `url` must be the project's https URL and `anonKey` its publishable key. | Not recoverable by retrying. |

**Example: configures a project and reports its ref**

```js
const result = await dsx.module.supabase.configure({"anonKey":"sb_publishable_example","url":"https://abcdefghijklmnopqrst.supabase.co"});
// resolves {"ok":true,"projectRef":"abcdefghijklmnopqrst"}
```

## Events

Read with `dsx.on(name, handler)`.

### authChanged

The signed-in state changed, for example after a sign-in, a link, a token refresh or a sign-out.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | no | True when the user is a guest. |
| `event` | string | yes | What happened: anonymous, signedIn, signedOut, linked, refreshed, updated or oauthStarted. |
| `linking` | boolean | no | True when the change attached a sign-in method to a guest account. |
| `provider` | string | no | The provider involved, when the change came from one. |
| `signedIn` | boolean | no | True when there is a signed-in user now. |
| `userId` | string | no | The id of the user who is now signed in. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `anon_key` | string | `` | The public key that ships in the app. Its only authority is what your Row Level Security policies grant it. |
| `project_url` | string | `` | Your project's API URL, e.g. https://abcdefghijklmnopqrst.supabase.co. Find it under Project Settings, Data API. |
| `providers` | list | `[]` | Which of email_password, email_otp, phone_otp, google, apple, facebook the app wants. What is actually offerable is the intersection of this, what the project has enabled, and what the platform can run. |
| `redirect_to` | string | `` | Where a social sign-in comes back to. Must also be listed under Authentication, URL Configuration, Redirect URLs in your Supabase project. |
| `refresh_skew_seconds` | number | `60` | How far ahead of expiry to renew the access token. 60 suits most apps. |
| `session_store` | string | `auto` | auto (default) uses the encrypted vault when the build has it and the ordinary key/value store otherwise. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `anonymous_disabled` | This project does not allow anonymous sign-ins. |  |
| `anonymous_signout_refused` | Signing out an anonymous account deletes it for good. Link a sign-in method first. | Link a sign-in method first, or pass force only if abandoning the account is intended. |
| `cancelled` | The user closed the sign-in sheet before finishing. |  |
| `email_not_confirmed` | Confirm the email address before signing in. |  |
| `http_error` | Supabase answered with an unexpected status. |  |
| `identity_already_exists` | That sign-in method already belongs to another account. | Ask the user to sign in with that method instead, or choose another. |
| `invalid_credential` | The provider returned no usable credential. |  |
| `invalid_credentials` | That email, phone or password is not right. |  |
| `invalid_param` | A parameter is missing or malformed. | Fix the argument named in the message and call again. |
| `manual_linking_disabled` | This project does not allow linking a sign-in method to an existing user. |  |
| `network_unavailable` | The Supabase project could not be reached. | Check the connection and try again. |
| `not_configured` | No Supabase project is configured for this build. | Set the project URL and publishable key in the package settings, or call configure. |
| `not_signed_in` | There is no session to act on. |  |
| `otp_expired` | That code has expired. Ask for a new one. | Request a new code. |
| `over_request_rate_limit` | Too many attempts. Wait a moment and try again. | Wait a moment before trying again. |
| `provider_unavailable` | That sign-in provider is not available on this build. |  |
| `session_expired` | The saved session is no longer valid. Sign in again. | Send the user to sign in again. |
| `single_identity` | An account keeps at least one sign-in method. | Add another sign-in method before removing this one. |
| `user_already_exists` | An account already exists for that email or phone. |  |
| `weak_password` | That password does not meet the project's requirements. | Ask for a longer or stronger password. |

## Related packages

- Needs: [Auth](/packages/auth), [ValueStore](/packages/storage)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
