---
title: Sign-in
description: Add sign-in to your app with one set of screens and actions, whichever service holds the account.
package: auth
---

Add sign-in to your app with one set of screens and actions, whichever service holds the account.

Gives every screen one place to read who is signed in and one set of actions for sign in, sign up, emailed codes, sign out and profile updates. Pick an account service (Despia identity, Supabase, Clerk or Firebase) and add sign-in options such as Google or Apple. Needs at least one of those packages.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app has accounts. It gives every screen the same sign-in state and actions, whichever account service you use. Skip it for apps with no sign-in.

## Install

```sh
despia add Core/Auth/Auth
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

### installation

`dsx.module.auth.installation`

Registers this copy of the app on the signed-in person's account under a name they can recognise, such as their phone model.

**When to use it.** Call it after sign-in if you let people see or limit the devices on their account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The name shown for this device in the person's device list, 1 to 120 characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installationId` | string | yes | The identifier of this app installation on the account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `device_limit_reached` | This account has reached its device limit. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `session_changed` | The account changed while this was running. Try again. |  |
| `signed_out` | Nobody is signed in, so there is no account to work on. | Send the person to your sign-in screen first, then call this again. |
| `storage_unavailable` | This device cannot keep the sign-in or the installation record. |  |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Register this phone on the account**

```js
const result = await dsx.module.auth.installation({"label":"iPhone 15"});
// resolves {"installationId":"inst_abc"}
```

### installations

`dsx.module.auth.installations`

Lists the app installations signed in to this account, one page at a time, with safe details only such as name, platform and last activity.

**When to use it.** Use it to build a devices screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cursor` | string | no | The nextCursor from the previous page; leave it out for the first page. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installations` | array of object | yes | The installations on this page, each with its id, label, platform, dates, and whether it is this device or the primary one. |
| `nextCursor` | string | yes | The cursor to pass to get the next page, empty when there are no more. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `session_changed` | The account changed while this was running. Try again. |  |
| `signed_out` | Nobody is signed in, so there is no account to work on. | Send the person to your sign-in screen first, then call this again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: List the first page of installations**

```js
const result = await dsx.module.auth.installations({});
// resolves {"installations":[{"createdAt":"2026-09-01T09:00:00Z","current":true,"id":"inst_abc","label":"iPhone 15","lastActiveAt":"2026-10-08T18:30:00Z","platform":"ios","primary":true}],"nextCursor":""}
```

### removeInstallation

`dsx.module.auth.removeInstallation`

Removes one installation from the account, which ends its sessions. Removing this device signs it out.

**When to use it.** Use it from a devices screen. The person must have signed in within the last five minutes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installationId` | string | yes | The identifier of the installation to remove, from the installations list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True once the installation has been removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `installation_not_found` | That installation is not one of this account's live installations. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `reauthentication_required` | Sign in again to remove an installation. |  |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `session_changed` | The account changed while this was running. Try again. |  |
| `signed_out` | Nobody is signed in, so there is no account to work on. | Send the person to your sign-in screen first, then call this again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Remove one installation**

```js
const result = await dsx.module.auth.removeInstallation({"installationId":"inst_old"});
// resolves {"removed":true}
```

### replaceInstallation

`dsx.module.auth.replaceInstallation`

Finishes a sign-in that was refused for reaching the device limit, by removing the installation the person chose and signing in.

**When to use it.** Call it after a sign-in fails with device_limit_reached and the person has picked which device to drop.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installationId` | string | yes | The installation to remove, chosen from the list in the device_limit_reached error. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `method` | string | yes | How the person signed in: password, passkey or idToken. |
| `provider` | string | yes | The name of the account service that holds the session. |
| `signedIn` | boolean | yes | True once the sign-in has settled and the person has a session. |
| `userId` | string | yes | The identifier of the signed-in account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `device_limit_reached` | This account has reached its device limit. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `storage_unavailable` | This device cannot keep the sign-in, so it was not completed. |  |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Remove an old phone and finish signing in**

```js
const result = await dsx.module.auth.replaceInstallation({"installationId":"inst_old"});
// resolves {"method":"code","provider":"clerk","signedIn":true,"userId":"user_123"}
```

### sendCode

`dsx.module.auth.sendCode`

Sends a one-time code to an email address or phone number and moves the sign-in to the awaiting code state.

**When to use it.** Use it for passwordless sign-in when you want your own code entry screen. Follow it with verifyCode.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | yes | The email address or phone number to send the code to. |
| `intent` | string | no | Whether the code is for signing in or signing up, when the account service needs to know. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | yes | The address the code was sent to. |
| `status` | string | yes | Always awaitingCode once the code has been sent. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Send a one-time code to an email address**

```js
const result = await dsx.module.auth.sendCode({"identifier":"ada@example.com"});
// resolves {"identifier":"ada@example.com","status":"awaitingCode"}
```

### session

`dsx.module.auth.session`

Asks the account service again who is signed in and which sign-in methods it offers, and refreshes what your screens read.

**When to use it.** Use it after your app returns from the background or when you suspect the session changed elsewhere.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `signedIn` | boolean | yes | True when someone is signed in. |
| `userId` | string | yes | The identifier of the signed-in account, empty when nobody is signed in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Ask who is signed in**

```js
const result = await dsx.module.auth.session({});
// resolves {"signedIn":true,"userId":"user_123"}
```

### setPrimaryInstallation

`dsx.module.auth.setPrimaryInstallation`

Marks one of the person's installations as their primary device for account screens.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installationId` | string | yes | The identifier of the installation to make primary, from the installations list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `primaryInstallationId` | string | yes | The identifier of the installation that is now primary. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `installation_not_found` | That installation is not one of this account's live installations. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `session_changed` | The account changed while this was running. Try again. |  |
| `signed_out` | Nobody is signed in, so there is no account to work on. | Send the person to your sign-in screen first, then call this again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Make one phone the primary device**

```js
const result = await dsx.module.auth.setPrimaryInstallation({"installationId":"inst_abc"});
// resolves {"primaryInstallationId":"inst_abc"}
```

### signIn

`dsx.module.auth.signIn`

Signs the person in with the method you name: an emailed code, a password, a passkey, or a sign-in option such as Google or Apple.

**When to use it.** Call it from your sign-in button. For the code method it sends the code and you finish with verifyCode.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | no | The email address or phone number to sign in as, for the code and password methods. |
| `method` | string | no | How to sign in: code, password, passkey, or the name of a sign-in option such as google or apple. |
| `password` | string | no | The person's account password, used only with the password method. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | no | The address the code was sent to, trimmed. |
| `method` | string | no | How the person signed in: password, passkey or idToken. |
| `provider` | string | no | The name of the account service that answered. |
| `signedIn` | boolean | no | True once the session has settled, for every method except code. |
| `status` | string | no | Set to awaitingCode when a code was sent and you still need to call verifyCode. |
| `userId` | string | no | The identifier of the signed-in account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person closed the sign-in sheet before finishing. | Do nothing, or leave them on the sign-in screen. |
| `device_limit_reached` | This account has reached its device limit. |  |
| `invalid_token` | The sign-in could not be verified. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `storage_unavailable` | This device cannot keep the sign-in, so it was not completed. |  |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Start an emailed-code sign-in**

```js
const result = await dsx.module.auth.signIn({"identifier":"ada@example.com","method":"code"});
// resolves {"identifier":"ada@example.com","status":"awaitingCode"}
```

### signOut

`dsx.module.auth.signOut`

Signs the person out and clears their details, while the sign-in state stays ready for the next person.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `signedIn` | boolean | yes | False once the person has been signed out. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Sign the person out**

```js
const result = await dsx.module.auth.signOut({});
// resolves {"signedIn":false}
```

### signUp

`dsx.module.auth.signUp`

Creates an account and signs the person in, using the same methods as signIn, where the account service tells the two apart.

**When to use it.** Use it on a registration screen. If your account service treats both the same, signIn is enough.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | no | The email address or phone number for the new account. |
| `method` | string | no | How to sign up: code, password, passkey, or the name of a sign-in option such as google or apple. |
| `password` | string | no | The password for the new account, for the password method. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `identifier` | string | no | The address the code was sent to, trimmed. |
| `method` | string | no | How the person signed in: password, passkey or idToken. |
| `provider` | string | no | The name of the account service that answered. |
| `signedIn` | boolean | no | True once the session has settled, for every method except code. |
| `status` | string | no | Set to awaitingCode when a code was sent and you still need to call verifyCode. |
| `userId` | string | no | The identifier of the new account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person closed the sign-in sheet before finishing. | Do nothing, or leave them on the sign-in screen. |
| `device_limit_reached` | This account has reached its device limit. |  |
| `invalid_token` | The sign-in could not be verified. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `storage_unavailable` | This device cannot keep the sign-in, so it was not completed. |  |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Start creating an account with an emailed code**

```js
const result = await dsx.module.auth.signUp({"identifier":"ada@example.com","method":"code"});
// resolves {"identifier":"ada@example.com","status":"awaitingCode"}
```

### token

`dsx.module.auth.token`

Returns the current access token so your own backend can check who is calling it. The token is given to the caller only and never shown on the screen state.

**When to use it.** Use it to add an Authorization header to requests to your own API.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | yes | The bearer token for the signed-in account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Read the access token for your backend**

```js
const result = await dsx.module.auth.token({});
// resolves {"token":"example-access-token"}
```

### updateProfile

`dsx.module.auth.updateProfile`

Changes the signed-in person's display name or picture address at the account service.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `imageUrl` | string | no | The address of the new profile picture. |
| `name` | string | no | The new display name to show for this person. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `method` | string | yes | How the person signed in: password, passkey or idToken. |
| `provider` | string | yes | The name of the account service that holds the session. |
| `signedIn` | boolean | yes | True once the sign-in has settled and the person has a session. |
| `userId` | string | yes | The identifier of the signed-in account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Change the display name**

```js
const result = await dsx.module.auth.updateProfile({"name":"Ada Lovelace"});
// resolves {"method":"code","provider":"clerk","signedIn":true,"userId":"user_123"}
```

### verifyCode

`dsx.module.auth.verifyCode`

Checks the code the person typed against the one sent earlier and signs them in when it matches.

**When to use it.** Call it after sendCode or after signIn with the code method.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | yes | The code the person received and typed in. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `method` | string | yes | How the person signed in: password, passkey or idToken. |
| `provider` | string | yes | The name of the account service that holds the session. |
| `signedIn` | boolean | yes | True once the sign-in has settled and the person has a session. |
| `userId` | string | yes | The identifier of the signed-in account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `device_limit_reached` | This account has reached its device limit. |  |
| `invalid_code` | That code is not right. Check it and try again. |  |
| `missing_param` | A required value is missing. | Not recoverable by retrying. |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. | Not recoverable by retrying. |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. | Not recoverable by retrying. |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `storage_unavailable` | This device cannot keep the sign-in, so it was not completed. |  |
| `unsupported_method` | This sign-in provider does not offer that method. | Not recoverable by retrying. |
| `unsupported_provider` | That sign-in provider package is not in this build. | Not recoverable by retrying. |

**Example: Check the code the person typed**

```js
const result = await dsx.module.auth.verifyCode({"code":"123456"});
// resolves {"method":"code","provider":"clerk","signedIn":true,"userId":"user_123"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `provider` | string | `` | The session provider package by name (identity, supabase, clerk). Empty picks the only one in the build. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person closed the sign-in sheet before finishing. | Do nothing, or leave them on the sign-in screen. |
| `device_limit_reached` | This account has reached its device limit. |  |
| `installation_not_found` | That installation is not one of this account's live installations. |  |
| `invalid_code` | That code is not right. Check it and try again. |  |
| `invalid_token` | The sign-in could not be verified. |  |
| `missing_param` | A required value is missing. |  |
| `network_unavailable` | Sign-in could not reach its service. Try again when you are back online. |  |
| `not_configured` | Sign-in is not configured for this app. |  |
| `provider_ambiguous` | More than one sign-in provider package is in this build. Name one in the provider setting. |  |
| `reauthentication_required` | Sign in again to remove an installation. |  |
| `rejected` | The sign-in service refused the request, for example because of a wrong password or an expired session. | Show the person a message and let them try again, or ask them to sign in again. |
| `session_changed` | The account changed while this was running. Try again. |  |
| `signed_out` | Nobody is signed in, so there is no account to work on. | Send the person to your sign-in screen first, then call this again. |
| `storage_unavailable` | This device cannot keep the sign-in or the installation record. |  |
| `unsupported_method` | This sign-in provider does not offer that method. |  |
| `unsupported_provider` | That sign-in provider package is not in this build. |  |

## Related packages

- Used by: [AppleAuth](/packages/appleauth), [AuthFirebase](/packages/authfirebase), [Google](/packages/google), [AuthIdentity](/packages/authidentity), [Meta](/packages/meta), [Supabase](/packages/supabase), [Clerk](/packages/clerk)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
