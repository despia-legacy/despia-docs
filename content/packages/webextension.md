---
title: WebExtension
description: Ship a Safari web extension with your app and share state and a sign-in with it.
package: webextension
---

Ship a Safari web extension with your app and share state and a sign-in with it.

Packages one standard web extension as a Safari extension inside your iOS app and as a zip for the Chrome Web Store. Your app can push values for the extension to read, lend it a revocable sign-in token, hear messages it sends back, and send people to Settings to switch it on. It is off by default; you write the extension's pages and decide what it does.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want your product to live in the browser too, for example to act on pages a user visits while signed in to your app. Skip it if you have no browser-side feature, since it adds an extra target to the app.

## What native adds

A Safari extension reaches the user's real browsing and shares the app's data and sign-in through the app group, which a web page on its own cannot do.

## Install

```sh
despia add Core/Extensions/WebExtension
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | yes |
| macos | no |

## Actions

### authStatus

`dsx.module.webextension.authStatus`

Tells you whether the extension currently holds a sign-in token and for which account. The token itself is never returned.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accountId` | string | yes | The id of the account the token was granted for. |
| `authenticated` | boolean | yes | True when the extension holds a valid token. |
| `expiresAt` | number | yes | When the token expires, in epoch milliseconds. |

**Example: reports signed-out before any grant**

```js
const result = await dsx.module.webextension.authStatus({});
// resolves {"accountId":"","authenticated":false,"expiresAt":0}
```

### clear

`dsx.module.webextension.clear`

Removes every value you pushed to the extension, so it starts with nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the shared values were cleared. |

**Example: drops every pushed var**

```js
const result = await dsx.module.webextension.clear({});
// resolves {"ok":true}
```

### grant

`dsx.module.webextension.grant`

Gives the extension a revocable sign-in token so it can act for the signed-in user. It is kept in the secure shared keychain and only the extension itself can read it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accountId` | string | no | The id of the account the token belongs to. |
| `expiresAt` | number | no | When the token expires, in epoch milliseconds. |
| `token` | string | yes | The sign-in token to lend to the extension; it must not be empty. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the token was stored for the extension. |

**Example: mints a scoped extension credential into the shared keychain**

```js
const result = await dsx.module.webextension.grant({"accountId":"u_1","expiresAt":0,"token":"ext_abc"});
// resolves {"ok":true}
```

### openSettings

`dsx.module.webextension.openSettings`

Opens the app's page in Settings so the user can switch the extension on, since iOS gives apps no direct way to enable it.

**When to use it.** Call it from a tap after explaining how to turn the extension on.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Settings was opened. |

**Example: opens this app's Settings page (the extension is enabled under Safari's settings)**

```js
const result = await dsx.module.webextension.openSettings({});
// resolves {"ok":true}
```

### revoke

`dsx.module.webextension.revoke`

Takes the sign-in token back from the extension, for example when the user signs out of the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the token was removed. |

**Example: drops the extension credential (the extension answers not_authenticated from here on)**

```js
const result = await dsx.module.webextension.revoke({});
// resolves {"ok":true}
```

### status

`dsx.module.webextension.status`

Tells you whether the extension has ever been used and how many of its messages are waiting. Use it to show setup progress.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lastSeen` | number | yes | When the extension last talked to the app, in epoch milliseconds. |
| `queued` | number | yes | How many messages from the extension are waiting to be delivered. |
| `used` | boolean | yes | True when the extension has talked to the app at least once, so it is switched on. |

**Example: reports whether the extension has run with the shared container reachable**

```js
const result = await dsx.module.webextension.status({});
// resolves {"lastSeen":0,"queued":0,"used":false}
```

### update

`dsx.module.webextension.update`

Pushes values for the extension to read, merging them with what is already shared. The extension reads them the next time it asks.

**When to use it.** Call it when something the extension shows changes, such as the user's plan.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `vars` | object | no | The values to share with the extension; they are merged into the existing ones. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the values were saved for the extension. |

**Example: merges vars for the extension's next read**

```js
const result = await dsx.module.webextension.update({"vars":{"plan":"pro"}});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### message

The extension sent a message to the app, delivered when the app is in the foreground.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The name of the event the extension sent. |
| `origin` | string | yes | The page or extension context that the message came from. |
| `payload` | object | yes | The data the extension sent with the event. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `content_matches` | string | `https://*.despia.com/*` | Match patterns for the pages the extension's content script may run on (comma-separated WebExtension match patterns). |
| `oauth_authorize_url` | string | `` | The authorization endpoint for the extension's standalone sign-in (Chrome/Edge/Firefox desktop only; Safari borrows the app's session instead). Leave empty to disable the fallback. |
| `oauth_client_id` | string | `` | The public client id for the extension. It uses PKCE, so there is no secret, and you should never put a client secret anywhere near the extension. |
| `oauth_scopes` | string | `` | Space-separated scopes for the extension's standalone sign-in. Keep them narrower than the app's own. |
| `oauth_token_url` | string | `` | The token endpoint the extension exchanges its PKCE code at. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `cannot_open` | The app's Settings page could not be opened on this device. | Ask the user to open Settings and find the app manually. |
| `missing_token` | A grant was requested without a token, so there was nothing to lend to the extension. | Pass a non-empty token. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
