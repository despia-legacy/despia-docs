---
title: OAuth
description: Sign users in with Google, Apple, GitHub or any other OAuth provider in the system sign-in sheet.
package: oauth
---

Sign users in with Google, Apple, GitHub or any other OAuth provider in the system sign-in sheet.

Opens your provider's sign-in page in the trusted system browser sheet and hands you back every value the provider sent to your redirect address, such as the code or the tokens. It checks the state value for you and can create and redeem a PKCE challenge. You write the authorize address and exchange the code with your own backend or the provider.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for social or enterprise sign-in with providers that refuse to load inside an embedded web view. If you only need a native Apple or Google button, use that provider's own package instead.

## What native adds

The system sign-in sheet shares the user's existing browser sessions, so people are often already signed in, and providers that block embedded web views accept it.

## Install

```sh
despia add Core/Auth/OAuth
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

### capabilities

`dsx.module.oauth.capabilities`

Tells you whether this device can return a sign-in through your own https host and through the custom URL scheme right now.

**When to use it.** Call it before choosing between the https callback and the custom scheme.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customScheme` | boolean | yes | True when the app has a custom URL scheme set up for sign-in returns. |
| `httpsCallback` | boolean | yes | True when this device can return a sign-in through your own https host. |

**Example: Check which return paths work now**

```js
const result = await dsx.module.oauth.capabilities({});
// resolves {"customScheme":true,"httpsCallback":true}
```

### exchange

`dsx.module.oauth.exchange`

Swaps an authorization code for tokens at your token endpoint, using the PKCE verifier created by a start or session call with pkce set. The verifier is only ever sent to an address you listed in the token endpoints setting.

**When not to.** Do not use it if your backend redeems the code; send the code to the backend instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `client_id` | string | no | Your client id at the provider, if it expects one. |
| `code` | string | yes | The authorization code returned by start. |
| `redirect_uri` | string | no | The redirect address used in the authorize request, if the provider expects it again. |
| `token_url` | string | yes | The https address of the provider's token endpoint; it must be listed in the token endpoints setting. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `access_token` | string | no | The access token issued by the provider. |
| `expires_in` | number | no | How many seconds the access token stays valid. |
| `id_token` | string | no | The signed identity token, when the provider issues one. |
| `refresh_token` | string | no | A token you can use to get a new access token, when the provider issues one. |
| `scope` | string | no | The permissions the provider actually granted. |
| `token_type` | string | no | The kind of token, usually Bearer. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `auth_failed` | The token exchange did not complete. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `not_configured` | The token URL is not an https origin listed in token_endpoints. | Not recoverable by retrying. |
| `pkce_unsupported` | No PKCE verifier is held for this exchange. | Not recoverable by retrying. |

**Example: Swap an authorization code for tokens**

```js
const result = await dsx.module.oauth.exchange({"client_id":"my-client","code":"abc","redirect_uri":"https://example.com/callback","token_url":"https://oauth2.example/token"});
// resolves {"access_token":"example-access-token","expires_in":3600,"scope":"openid profile","token_type":"Bearer"}
```

### session

`dsx.module.oauth.session`

Runs the same sign-in sheet as start but hands back only the raw redirect address, for packages that read the callback themselves.

**When not to.** For an ordinary sign-in in your own app use start, which also splits the parameters for you.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ephemeral` | boolean | no | Set true to run the sheet without the browser's saved sessions. |
| `host` | string | no | An https domain to return through instead of the custom scheme; iOS 17.4 and later only. |
| `path` | string | no | The path prefix of the https callback when you use host. |
| `pkce` | boolean | no | Set true to create a PKCE challenge you can redeem with exchange. |
| `proofs` | boolean | no | Set true to attach the proof checks the calling package needs. |
| `url` | string | yes | The full authorize address of the provider. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The full redirect address the provider sent the user to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `auth_failed` | Sign-in did not complete. |  |
| `blocked` | The browser blocked the sign-in window. Start sign-in from a tap. |  |
| `cancelled` | The user closed the sign-in sheet, or a newer sign-in replaced it, before finishing. | Treat it as the user's choice and stop any spinner. |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `nonce_mismatch` | The sign-in response did not match this request. |  |
| `not_configured` | No app callback URL scheme is configured. | Not recoverable by retrying. |
| `state_mismatch` | The sign-in response did not belong to this sign-in request. |  |

**Example: resolves the raw callback url when the session completes**

```js
const result = await dsx.module.oauth.session({"url":"https://idp.example/authorize?client_id=app&state=s1"});
// resolves {"url":"myapp://oauth?code=abc&state=s1"}
```

### start

`dsx.module.oauth.start`

Opens the provider's authorize address in the system sign-in sheet and waits for the user to finish. You get back the redirect address and every parameter it carried, or a clear refusal such as cancelled.

**When to use it.** Use it as the one call for a normal sign-in; read the code or tokens from the returned parameters.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `callback` | string | no | Set to https to return through your own https host instead of the custom URL scheme. |
| `ephemeral` | boolean | no | Set true to run the sheet without the browser's saved sessions, so the user always signs in fresh. |
| `host` | string | no | An https domain to return through instead of the custom scheme; iOS 17.4 and later only. |
| `path` | string | no | The path prefix of the https callback when you use host; defaults to /. |
| `pkce` | boolean | no | Set true to create a PKCE challenge now and redeem it later with exchange. |
| `url` | string | yes | The full authorize address of your provider, including client id and redirect address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `params` | object | yes | Every query and fragment parameter of that address, by name, such as code, state or access_token. |
| `url` | string | yes | The full redirect address the provider sent the user to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `auth_failed` | Sign-in did not complete. |  |
| `blocked` | The browser blocked the sign-in window. Start sign-in from a tap. |  |
| `cancelled` | The user closed the sign-in sheet, or a newer sign-in replaced it, before finishing. | Treat it as the user's choice and stop any spinner. |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `nonce_mismatch` | The sign-in response did not match this request. |  |
| `state_mismatch` | The sign-in response did not belong to this sign-in request. |  |

**Example: resolves the callback params when the session completes**

```js
const result = await dsx.module.oauth.start({"url":"https://idp.example/authorize?client_id=app&state=s1"});
// resolves {"params":{"code":"abc","state":"s1"},"url":"myapp://oauth?code=abc&state=s1"}
```

## Events

Read with `dsx.on(name, handler)`.

### error

A sign-in could not complete because the callback host is not linked to the app; its fields say which host and which system code.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | int | yes | The numeric code the system reported. |
| `host` | string | yes | The https host that failed to associate with the app. |
| `reason` | string | yes | A short word for what went wrong, such as cancelled or failed. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_link_paths` | list | `[]` | The path your provider redirects to, so the sign-in return keeps working when Android App Links are narrowed. |
| `native_apple_signin` | boolean | `true` | Open the native Apple sheet when the page calls the Apple JS SDK with usePopup: true. |
| `native_apple_signin_origins` | list | `[]` | Additional https origins of your own that may use the native Apple sheet. |
| `token_endpoints` | list | `[]` | The https origins this app may redeem an authorization code at, for example https://oauth2.googleapis.com. Leave it empty if the app does not use device-held PKCE. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `association_failed` | The sign-in callback host is not associated with this app. | Check that the app's associated domains and your site's association file list this host, or use the custom scheme. |
| `auth_failed` | Sign-in did not complete. | Show a retry option; if it keeps failing check the authorize address and the redirect address registered at the provider. |
| `cancelled` | The user closed the sign-in sheet, or a newer sign-in replaced it, before finishing. | Treat it as the user's choice; stop any spinner and let them try again. |
| `missing_param` | A required parameter is missing. | Pass the missing parameter named in the error. |
| `no_browser` | No browser is available to present the sign-in. |  |
| `nonce_mismatch` | The sign-in response did not match this request. | Discard the response and start the sign-in again. |
| `not_configured` | No app callback URL scheme is configured. | Set up the app's URL scheme or list the token endpoint in the settings. |
| `pkce_unsupported` | PKCE cannot be applied to this authorization request. | Redeem the code on your backend instead. |
| `state_mismatch` | The sign-in response did not belong to this sign-in request. | Discard the response and start the sign-in again. |
| `unsupported` | This sign-in method is not available on this platform. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
