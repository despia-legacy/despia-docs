---
title: Clerk
description: Add sign-in, sign-up and account screens to your app with Clerk.
package: clerk
---

Add sign-in, sign-up and account screens to your app with Clerk.

Uses Clerk's native sign-in and sign-up views, email codes and social logins, and returns a session token for your own API calls. Use it if your users already live in Clerk. Needs a Clerk account and your publishable key.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when your people already have Clerk accounts or you want Clerk's sign-in, social logins, passkeys, organizations and prebuilt screens. If you do not use Clerk, use the Auth package instead.

## What native adds

Uses Clerk's native iOS views and Sign in with Apple, passkeys and the keychain, so sign-in feels like a system feature and works offline.

## Install

```sh
despia add Core/Clerk
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

### attach

`dsx.module.clerk.attach`

Connects a view to the open sign-in attempt so it hears the result.

**When to use it.** The inline views do this by themselves; call it only for a view you built.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | The name of the view to connect. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The views now connected to the attempt. |
| `status` | string | yes | Where the sign-in attempt currently stands. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | There is no open sign-in attempt, or it is not ready. | Call session first. |

**Example: the inline form attaches**

```js
const result = await dsx.module.clerk.attach({"view":"inline"});
// resolves {"attached":["inline"],"status":"ready"}
```

### attribution

`dsx.module.clerk.attribution`

Turns on or off sharing the signed-in person's id with OneSignal and AppsFlyer.

**When to use it.** Leave it on, or call it with enabled false to opt out.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | no | True shares the id after each sign-in; false clears it and stops sharing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always attribution for this call. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | Whether id sharing is now enabled or disabled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `unsupported_platform` | This feature does not exist on the web, where the browser already handles it. | Skip the call on the web. |

**Example: enables userId auto-sync**

```js
const result = await dsx.module.clerk.attribution({"enabled":true});
// resolves {"event":"attribution","ok":true,"status":"enabled"}
```

### authview

`dsx.module.clerk.authview`

Shows Clerk's prebuilt sign-in and sign-up sheet and waits until it closes.

**When to use it.** Use it when you want Clerk's ready-made screen; use manual to build your own.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismissable` | boolean | no | Whether the person can swipe the sheet away. |
| `mode` | string | no | Which flow to show: signin, signup or signinorup. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always authview for this call. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | How the sheet ended, such as presented or dismissed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `presentation_failed` | Clerk's own screen could not be shown. | Try again from a visible screen. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |

**Example: presents the vendor's own auth surface**

```js
const result = await dsx.module.clerk.authview({"mode":"signup"});
// resolves {"event":"authview","ok":true,"status":"presented"}
```

### close

`dsx.module.clerk.close`

Abandons the sign-in attempt; to sign in again you open a new one.

**When to use it.** Call it when the person cancels sign-in.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Where the attempt ended, such as closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | There is no open sign-in attempt, or it is not ready. | Call session first. |
| `settled` | The sign-in attempt has already ended. | Open a new attempt with session. |

**Example: abandons an open attempt**

```js
const result = await dsx.module.clerk.close({});
// resolves {"status":"canceled"}
```

### configure

`dsx.module.clerk.configure`

Gives Clerk your publishable key so sign-in can start.

**When to use it.** Call it first, unless you set the key in the package config.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | Your Clerk publishable key, which starts with pk_. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always ready for this call. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | Whether Clerk is now configured. |

**Example: configures with a publishable key**

```js
const result = await dsx.module.clerk.configure({"key":"pk_test_abc123"});
// resolves {"event":"ready","ok":true,"status":"configured"}
```

### createOrganization

`dsx.module.clerk.createOrganization`

Creates an organization with the signed-in person as its administrator.

**When to use it.** Call it from a create team screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The display name of the organization. |
| `slug` | string | no | A short URL-friendly name; Clerk makes one if you leave it out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `organization` | object | yes | The organization that was created. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `create_organization_failed` | The organization could not be created. | Check the name and slug and retry. |
| `missing_params` | A required value such as an identifier, code or password was not given. | Pass every value the chosen method needs. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |

**Example: creates an organization**

```js
const result = await dsx.module.clerk.createOrganization({"name":"Acme"});
// resolves {"organization":{"id":"org_9","name":"Acme"}}
```

### detach

`dsx.module.clerk.detach`

Disconnects a view from the sign-in attempt without cancelling the attempt.

**When to use it.** Call it when a view you built goes away.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | The name of the view to disconnect. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The views still connected to the attempt. |
| `status` | string | yes | Where the sign-in attempt currently stands. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | There is no open sign-in attempt, or it is not ready. | Call session first. |

**Example: the inline form detaches without abandoning**

```js
const result = await dsx.module.clerk.detach({"view":"inline"});
// resolves {"attached":[],"status":"ready"}
```

### invitations

`dsx.module.clerk.invitations`

Lists pending organization invitations, and accepts one when you give its id.

**When to use it.** Call it to show invitations, then again with accept when the person agrees.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accept` | string | no | The id of the invitation to accept; leave empty to only list. |
| `limit` | number | no | The most invitations to return. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accepted` | string | yes | The id of the invitation that was accepted, or empty. |
| `invitations` | array | yes | The pending invitations after the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invitation_not_found` | That invitation is not in the person's list. | Reload the invitations and pick one from the list. |
| `invitations_failed` | The invitations could not be loaded or accepted. | Retry; check the network. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |

**Example: lists the pending invitations**

```js
const result = await dsx.module.clerk.invitations({});
// resolves {"accepted":"","invitations":[]}
```

### leaveOrganization

`dsx.module.clerk.leaveOrganization`

Removes the signed-in person from an organization; with no id it leaves the active one.

**When to use it.** Call it from a leave button on a profile screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `organization` | string | no | The id of the organization to leave; empty means the active one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `organization` | string | yes | The id of the organization that was left. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `leave_organization_failed` | The person could not leave the organization. | Retry; check the network. |
| `missing_params` | A required value such as an identifier, code or password was not given. | Pass every value the chosen method needs. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |

**Example: leaves the named organization**

```js
const result = await dsx.module.clerk.leaveOrganization({"organization":"org_9"});
// resolves {"organization":"org_9"}
```

### manual

`dsx.module.clerk.manual`

Runs a sign-in or sign-up flow step by step so you can build your own screens.

**When to use it.** Use it for a custom form; for Clerk's ready-made screen call authview instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | no | Which step of a multi-step flow to run, such as prepare or verify. |
| `code` | string | no | The one-time code the person typed, for the verify step. |
| `emailAddress` | string | no | The email address for sign-up or for the code and reset flows. |
| `firstName` | string | no | The first name to save on sign-up. |
| `identifier` | string | no | The email address, username or phone number to sign in as. |
| `lastName` | string | no | The last name to save on sign-up. |
| `method` | string | yes | Which flow to run: password, oauth, apple, email_code, phone_code, passkey, second_factor, enterprise_sso, reset_password or ticket. |
| `newPassword` | string | no | The new password for the reset password flow. |
| `password` | string | no | The person's account password, for the password method. |
| `phoneNumber` | string | no | The phone number for sign-up or for the phone code flow. |
| `provider` | string | no | The sign-in provider name for the oauth flow, such as google. |
| `ticket` | string | no | The sign-in ticket for the ticket flow. |
| `type` | string | no | Whether the password flow signs in or signs up: signin or signup. |
| `username` | string | no | The username for sign-in or sign-up. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `emailAddress` | string | no | The primary email address of the signed-in person. |
| `event` | string | yes | The kind of answer this is, such as signIn. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | Where the flow stands, such as complete or needs_second_factor. |
| `userId` | string | no | The signed-in person's Clerk id, once there is a user. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `apple_failed` | Sign in with Apple could not be completed. | Let the person retry or choose another method. |
| `auth_failed` | Clerk rejected the credentials that were given. | Show an error and let the person try again. |
| `email_code_failed` | That email code could not be sent or verified. |  |
| `enterprise_sso_failed` | The enterprise single sign-on could not be completed. | Check the email domain is set up for SSO and retry. |
| `missing_params` | A required value such as an identifier, code or password was not given. | Pass every value the chosen method needs. |
| `missing_state` | A verify or reset step ran without a start step before it in this app session. | Run the start step first, in the same app session. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |
| `oauth_failed` | The social sign-in could not be completed or was cancelled. | Let the person retry or choose another method. |
| `passkey_failed` | That passkey sign-in could not be completed. |  |
| `phone_code_failed` | That phone code could not be sent or verified. |  |
| `prepare_not_needed` | That second factor is an authenticator code and needs no prepare step. | Skip prepare and go straight to verify. |
| `reset_password_failed` | That password reset could not be completed. |  |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `second_factor_failed` | That second factor could not be sent or verified. |  |
| `ticket_failed` | That Clerk ticket could not be redeemed. |  |
| `unknown_method` | That sign-in method does not exist. | Use one of the supported methods such as password, oauth, apple, email_code, phone_code, passkey, second_factor, enterprise_sso, reset_password or ticket. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |
| `use_native_apple` | Apple sign-in must use the native Apple method. | Use the apple method instead of oauth with provider apple. |

**Example: Sign in with a password**

```js
const result = await dsx.module.clerk.manual({"identifier":"ada@example.com","method":"password","password":"correct-horse-battery"});
// resolves {"emailAddress":"ada@example.com","event":"signIn","ok":true,"status":"complete","userId":"user_123"}
```

### organizations

`dsx.module.clerk.organizations`

Lists the organizations the signed-in person belongs to.

**When to use it.** Call it to fill an organization switcher.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `limit` | number | no | The most organizations to return. |
| `offset` | number | no | How many organizations to skip, for paging. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activeId` | string | yes | The id of the active organization, or empty for the personal account. |
| `memberships` | array | yes | The person's organization memberships, with role and organization details. |
| `total` | number | yes | How many organizations the person belongs to in all. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |
| `organizations_failed` | The organization list could not be loaded. | Retry; check the network. |

**Example: lists the user's memberships with the active one named**

```js
const result = await dsx.module.clerk.organizations({});
// resolves {"activeId":"","memberships":[],"total":0}
```

### session

`dsx.module.clerk.session`

Opens the sign-in attempt that the inline Clerk views use and publishes it.

**When to use it.** Call it before mounting the inline sign-in views.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | no | Which flow the attempt is for: signin, signup or signinorup. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | yes | The id of the sign-in attempt. |
| `status` | string | yes | Where the attempt stands, such as open or complete. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A sign-in attempt is already open. | Close it first, or keep using it. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |

**Example: opens the attempt the inline form binds to**

```js
const result = await dsx.module.clerk.session({"mode":"signin"});
// resolves {"session":"auth_1","status":"ready"}
```

### sessions

`dsx.module.clerk.sessions`

Lists the sessions on this device, or ends one of them when you give its id.

**When to use it.** Use it for an account switcher or a sign out of other sessions screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `revoke` | string | no | The id of the session to end; leave empty to only list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activeId` | string | yes | The id of the session currently in use on this device. |
| `revoked` | string | yes | The id of the session that was ended, or empty. |
| `sessions` | array | yes | The sessions on this device, each with its status and pending task. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `revoke_session_failed` | The session could not be ended. | Retry; check the network. |
| `session_not_found` | That session id is not on this device. | Reload the sessions and pick one from the list. |

**Example: lists the sessions on this client**

```js
const result = await dsx.module.clerk.sessions({});
// resolves {"activeId":"","revoked":"","sessions":[]}
```

### setOrganization

`dsx.module.clerk.setOrganization`

Switches the active organization, or back to the personal account when you pass an empty id.

**When to use it.** Call it when the person picks an organization.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `organization` | string | no | The id of the organization to activate; empty means the personal account. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `orgId` | string | yes | The id of the now active organization, or empty. |
| `orgSlug` | string | yes | The short name of the now active organization, or empty. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |
| `set_active_failed` | The active organization could not be changed. | Retry with an organization the person belongs to. |

**Example: switches the active organization and republishes the plane**

```js
const result = await dsx.module.clerk.setOrganization({"organization":"org_9"});
// resolves {"orgId":"org_9","orgSlug":"acme"}
```

### signout

`dsx.module.clerk.signout`

Ends the session and clears the stored identity and cookies.

**When to use it.** Call it from a sign out button.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always signOut for this call. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | Whether the sign-out finished, such as complete. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `signout_failed` | Sign-out could not be completed. | Try again; check the network. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |

**Example: signs out and empties the auth plane**

```js
const result = await dsx.module.clerk.signout({});
// resolves {"event":"signOut","ok":true,"status":"complete"}
```

### ssr

`dsx.module.clerk.ssr`

Makes the native session readable by your own web server by writing session cookies.

**When to use it.** Use it only to change the defaults; it is on by default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domains` | string | no | Comma separated list of domains the cookies apply to, replacing the default. |
| `enabled` | boolean | no | False removes all session cookies. |
| `header` | string | no | An extra request header to attach the token to; Authorization sends it as a Bearer token. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domains` | array of string | yes | The domains the session cookies are written for. |
| `event` | string | yes | The kind of answer this is, such as ssr. |
| `header` | string | no | The request header name your server can check, when one is set. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | Whether cookie sharing is now enabled or disabled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |
| `unsupported_platform` | This feature does not exist on the web, where the browser already handles it. | Skip the call on the web. |

**Example: Share the session with your own server**

```js
const result = await dsx.module.clerk.ssr({"domains":"example.com","enabled":true});
// resolves {"domains":["example.com"],"event":"ssr","ok":true,"status":"enabled"}
```

### status

`dsx.module.clerk.status`

Reads who is signed in, working offline from what the device already holds.

**When to use it.** Call it at launch or after an edit to draw the account.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `emailAddress` | string | no | The primary email address of the signed-in person. |
| `event` | string | yes | The kind of answer this is, always state for this call. |
| `firstName` | string | no | The first name of the signed-in person. |
| `imageUrl` | string | no | The link to the signed-in person's picture. |
| `isConfigured` | boolean | no | True once configure has been called with a publishable key. |
| `isSignedIn` | boolean | yes | True when a person is signed in on this device. |
| `lastName` | string | no | The last name of the signed-in person. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `publishableKey` | string | no | The Clerk publishable key in use. |
| `session` | object | no | The current session, when one exists. |
| `user` | object | no | The signed-in person's record, when someone is signed in. |
| `userId` | string | no | The signed-in person's Clerk id. |
| `username` | string | no | The username of the signed-in person. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |

**Example: returns the auth state snapshot**

```js
const result = await dsx.module.clerk.status({});
// resolves {"event":"state","isSignedIn":false,"ok":true}
```

### submit

`dsx.module.clerk.submit`

Reports that a view submitted a step, so a double submit cannot happen.

**When to use it.** The inline views call it for you; use it for a view you built.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | no | The outcome the view reports for the step. |
| `view` | string | no | The name of the view that submitted. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Where the sign-in attempt stands after this step. |
| `step` | string | yes | The step the attempt moved to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A submit is already in progress on this attempt. | Wait for it to finish before submitting again. |
| `not_ready` | There is no open sign-in attempt, or it is not ready. | Call session first. |
| `settled` | The sign-in attempt has already ended. | Open a new attempt with session. |

**Example: submits a factor on the open attempt**

```js
const result = await dsx.module.clerk.submit({"status":"needs_first_factor"});
// resolves {"status":"confirming","step":"first_factor"}
```

### task

`dsx.module.clerk.task`

Reads or shows the step the person must finish before their session is fully active, such as setting up two-step verification.

**When to use it.** Call it when a sign-in ends pending, and pass present true to show Clerk's screen for the step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `present` | boolean | no | True to show Clerk's screen for the pending step. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sessionId` | string | yes | The id of the session that has the pending step. |
| `status` | string | yes | Whether the session is active or pending. |
| `task` | string | yes | The pending step, such as chooseOrganization or setupMFA, or empty when nothing is pending. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |
| `unsupported_task` | This build has no screen for that pending task. | Send the person to your own handling or the Clerk dashboard flow for that task. |

**Example: answers empty when nothing is pending, rather than failing**

```js
const result = await dsx.module.clerk.task({});
// resolves {"sessionId":"sess_1","status":"","task":""}
```

**Example: reports a pending choose-organization task**

```js
const result = await dsx.module.clerk.task({});
// resolves {"sessionId":"sess_1","status":"","task":"chooseOrganization"}
```

### token

`dsx.module.clerk.token`

Returns the current session token for calling your own API, refreshing it when it is about to expire.

**When to use it.** Call it before each API request that needs the signed-in person.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always token for this call. |
| `jwt` | string | yes | The session token to send to your own API, or null when nobody is signed in. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `token_fetch_failed` | The session token could not be refreshed, usually because the network is down. | Retry when the network is back; the previous token is kept. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |

**Example: returns null with no session rather than failing**

```js
const result = await dsx.module.clerk.token({});
// resolves {"event":"token","jwt":null,"ok":true}
```

### userprofile

`dsx.module.clerk.userprofile`

Shows Clerk's prebuilt account screen and waits until it closes.

**When to use it.** Call it from an account or settings row.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismissable` | boolean | no | Whether the person can swipe the sheet away. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of answer this is, always userprofile for this call. |
| `ok` | boolean | yes | True when the call worked and the result carries real data. |
| `status` | string | yes | How the sheet ended, such as closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |
| `presentation_failed` | Clerk's own screen could not be shown. | Try again from a visible screen. |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |

**Example: Show the account screen**

```js
const result = await dsx.module.clerk.userprofile({"dismissable":true});
// resolves {"event":"userprofile","ok":true,"status":"closed"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `publishable_key` | string | `` | Your Clerk publishable key (pk_test_... or pk_live_...). Leave it empty to configure Clerk at run time with configure(). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `apple_failed` | Sign in with Apple could not be completed. | Let the person retry or choose another method. |
| `auth_failed` | Clerk rejected the credentials that were given. | Show an error and let the person try again. |
| `configure_failed` | Clerk could not be configured with that key. | Check the key and retry. |
| `email_code_failed` | That email code could not be sent or verified. |  |
| `enterprise_sso_failed` | The enterprise single sign-on could not be completed. | Check the email domain is set up for SSO and retry. |
| `error` | The Clerk request failed for a reason with no more specific code. | Retry; read the message in the error data. |
| `invalid_key` | The key is missing or does not start with pk_. | Pass your Clerk publishable key. |
| `missing_params` | A required value such as an identifier, code or password was not given. | Pass every value the chosen method needs. |
| `missing_state` | A verify or reset step ran without a start step before it in this app session. | Run the start step first, in the same app session. |
| `not_configured` | Clerk has no publishable key yet. | Call configure with your key first, or set the key in the package config. |
| `not_signed_in` | This needs a signed-in person and nobody is signed in. | Sign the person in first, then retry. |
| `oauth_failed` | The social sign-in could not be completed or was cancelled. | Let the person retry or choose another method. |
| `passkey_failed` | That passkey sign-in could not be completed. |  |
| `phone_code_failed` | That phone code could not be sent or verified. |  |
| `prepare_not_needed` | That second factor is an authenticator code and needs no prepare step. | Skip prepare and go straight to verify. |
| `presentation_failed` | Clerk's own screen could not be shown. | Try again from a visible screen. |
| `reconfigure_failed` | Clerk could not be reconfigured with the new key. | Check the key and retry. |
| `reconfigure_in_progress` | Another configure call is still running. | Wait for it to finish. |
| `reset_password_failed` | That password reset could not be completed. |  |
| `sdk_not_linked` | The Clerk SDK is not part of this build. | Include the Clerk package in the build, or hide sign-in on this build. |
| `second_factor_failed` | That second factor could not be sent or verified. |  |
| `signout_failed` | Sign-out could not be completed. | Try again; check the network. |
| `ticket_failed` | That Clerk ticket could not be redeemed. |  |
| `token_fetch_failed` | The session token could not be refreshed, usually because the network is down. | Retry when the network is back; the previous token is kept. |
| `unknown_command` | That Clerk command does not exist in this build. | Check the command name. |
| `unknown_method` | That sign-in method does not exist. | Use one of the supported methods such as password, oauth, apple, email_code, phone_code, passkey, second_factor, enterprise_sso, reset_password or ticket. |
| `unsupported_os` | This feature needs iOS 17 or newer. | Hide the feature on older systems. |
| `use_native_apple` | Apple sign-in must use the native Apple method. | Use the apple method instead of oauth with provider apple. |

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
