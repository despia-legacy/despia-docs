---
title: Plaid
description: Let users link their bank account with Plaid.
package: plaid
---

Let users link their bank account with Plaid.

Opens Plaid Link so a user can pick their bank and connect it, and tells your app whether they finished or cancelled. Your server creates the link token and receives the result. Works with the Payments package. Needs a Plaid account.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your server needs the user to connect a bank account, for example to check balances or start bank payments. Your server creates the link token and swaps the result for an access token; the app never does either.

## Install

```sh
despia add Core/Payments/Modules/Plaid
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### close

`dsx.module.plaid.close`

Closes the open Link session; it ends the same way as the user closing it.

**When not to.** On Android it only ends the app's session, because the Plaid screen cannot be closed from code.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | no | Identifies the session that was closed. |
| `status` | string | yes | The final status of the session, canceled when closed this way. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No Plaid Link session is open. |  |

**Example: closes an open Link session as canceled**

```js
const result = await dsx.module.plaid.close({});
// resolves {"status":"canceled"}
```

### link

`dsx.module.plaid.link`

Opens Plaid Link so the user can pick a bank and connect it, then reports whether they finished or closed it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `link_token` | string | yes | The link token your server created with Plaid; the app can never create one. |
| `received_redirect_uri` | string | no | Web only: the address the bank sent the user back to, passed when Link resumes after a bank sign-in. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accounts` | array | no | The accounts the user chose to share. |
| `error` | string | no | A readable reason when Link could not complete. |
| `institution` | string | no | The name of the bank the user connected. |
| `publicToken` | string | no | Only present when linked: the one-time token your server swaps for an access token; do not store it in markup. |
| `session` | string | no | Identifies the Link session that just ended, for your logs. |
| `status` | string | yes | How it ended: linked when the user connected a bank, canceled when they closed Link. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Plaid Link session is already open. |  |
| `link_failed` | Plaid Link could not complete. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present Plaid Link. | Not recoverable by retrying. |
| `not_ready` | Plaid Link is not ready yet. Please try again in a moment. |  |
| `sdk_not_linked` | The Plaid Link SDK is not linked in this build. | Not recoverable by retrying. |

**Example: opens Link and settles a linked account**

```js
const result = await dsx.module.plaid.link({"link_token":"link-sandbox-abc"});
// resolves {"accounts":["acc_1"],"institution":"First Platypus Bank","publicToken":"public-sandbox-abc","session":"link_1","status":"linked"}
```

**Example: a user dismiss is canceled, not a failure**

```js
const result = await dsx.module.plaid.link({"link_token":"link-sandbox-cancel"});
// resolves {"status":"canceled"}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Plaid Link session is already open. |  |
| `cancelled` | The bank link was cancelled. |  |
| `link_failed` | Plaid Link could not complete. |  |
| `missing_param` | A required parameter is missing. |  |
| `no_presenter` | Couldn't find a screen to present Plaid Link. |  |
| `not_ready` | Plaid Link is not ready yet. Please try again in a moment. |  |
| `sdk_not_linked` | The Plaid Link SDK is not linked in this build. |  |

## Related packages

- Needs: [Payments](/packages/payments)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
