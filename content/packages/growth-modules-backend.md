---
title: Backend
description: Receive Apple ad postbacks and mint deep links on your own server.
package: backend
---

Receive Apple ad postbacks and mint deep links on your own server.

The server half of Growth. It receives and verifies the attribution postbacks Apple sends for App Store ad campaigns, stores them so a workflow can read them, and creates signed deep links with short codes. It runs on your own deployment, and you supply the keys and the link domain.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you run ad campaigns on the App Store and want Apple's attribution reports, or you need to create shareable deep links that survive an install. It is server code, so it is not called from the app.

## Install

```sh
despia add Core/Growth/Modules/Backend
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

### appattributionPostback

`dsx.module.backend.appattributionPostback`

Receives an AdAttributionKit postback from Apple, checks its signed token and stores it as an anonymous attribution record. Repeats are counted once.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributionId` | string | yes | The id of the stored attribution record. |
| `duplicate` | boolean | yes | True when Apple sent this postback before and nothing new was stored. |
| `ok` | boolean | yes | True when the postback was verified and accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | Not an AdAttributionKit postback with a jws-string and a postback-identifier. | Not recoverable by retrying. |
| `forbidden` | A development postback, and GROWTH_ACCEPT_DEVELOPMENT_POSTBACKS is not true (403). | Not recoverable by retrying. |
| `not_configured` | No queue is installed on this deployment. | Not recoverable by retrying. |
| `unauthenticated` | The JWS does not verify with the Apple key its kid names (401). | Not recoverable by retrying. |

**Example: Accept an AdAttributionKit postback from Apple**

```js
const result = await dsx.module.backend.appattributionPostback({});
// resolves {"attributionId":"adattributionkit:3b9d8c1e-5a47-4f60-8e2a-91c0d7a4b6f2","duplicate":false,"ok":true}
```

### drainPostbacks

`dsx.module.backend.drainPostbacks`

Turns each stored Apple postback into a workflow event so your own workflow can react to it. It runs automatically on a schedule.

**When not to.** You do not call it yourself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `drained` | number | yes | How many stored postbacks were read. |
| `emitted` | number | yes | How many workflow events were created. |
| `failed` | number | no | How many postbacks could not be turned into events. |
| `ok` | boolean | yes | True when the run finished. |
| `queue` | string | yes | The name of the queue that was read. |

**Example: Turn the stored postbacks into workflow events**

```js
const result = await dsx.module.backend.drainPostbacks({});
// resolves {"drained":3,"emitted":3,"ok":true,"queue":"growth_apple_postbacks"}
```

### link

`dsx.module.backend.link`

Creates a signed deep link to a screen in your app, with campaign details, an optional expiry and an optional short code. The link still works after a fresh install.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `adGroup` | string | no | The ad group the link belongs to. |
| `campaign` | string | no | The campaign name to attribute installs to. |
| `code` | boolean | no | Set true to also create a short code that opens the same link. |
| `creative` | string | no | The ad creative the link belongs to. |
| `expires` | string | no | How long the link stays valid, as a duration such as 7d. |
| `expiresAt` | number | no | The exact time the link expires, in epoch milliseconds. |
| `params` | object | no | Extra values passed to that screen. |
| `referrer` | string | no | A value to carry through a Play Store install, if you set your own. |
| `route` | string | yes | The screen or path in your app the link opens. |
| `source` | string | no | Where the link is shared, such as a newsletter. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | The short code for this link, when you asked for one. |
| `expiresAt` | number | yes | When the link stops working, in epoch milliseconds. |
| `payload` | string | yes | The signed link data the app verifies. |
| `referrer` | string | yes | The value to put in a Play Store link so the install carries the link. |
| `url` | string | yes | The full link you can share with people. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The route, params, expiry or a campaign fact is not valid. | Not recoverable by retrying. |
| `not_configured` | GROWTH_LINK_PRIVATE_KEY and GROWTH_LINK_DOMAIN are not set on this deployment, or code: true was asked and no enabled package registers the growth_link_code entity. | Not recoverable by retrying. |

**Example: Create a signed link to a screen with a campaign and a short code**

```js
const result = await dsx.module.backend.link({"campaign":"spring-sale","code":true,"expires":"7d","route":"/promo/spring","source":"newsletter"});
// resolves {"code":"K7M2QX9A","expiresAt":1760604800000,"payload":"eyJyIjoiL3Byb21vL3NwcmluZyJ9.c2ln","referrer":"dsx_link=eyJyIjoiL3Byb21vL3NwcmluZyJ9.c2ln","url":"https://links.example.com/l/eyJyIjoiL3Byb21vL3NwcmluZyJ9.c2ln"}
```

### resolveCode

`dsx.module.backend.resolveCode`

Looks up a short link code and returns the signed link data the app verifies. Unknown and expired codes answer the same way.

**When not to.** You do not call it from your own code; the app calls it on first open.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | yes | The eight character short code from a link. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `payload` | string | yes | The signed link data to verify in the app. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | That is not an 8 character link code. | Not recoverable by retrying. |
| `not_configured` | No enabled package registers the growth_link_code entity, for example because the server data package is excluded. | Not recoverable by retrying. |
| `not_found` | No such code, or it has expired. | Not recoverable by retrying. |
| `rate_limited` | Too many tries for this code prefix. Wait a minute. |  |

**Example: Look up a short link code**

```js
const result = await dsx.module.backend.resolveCode({"code":"K7M2QX9A"});
// resolves {"payload":"eyJyIjoiL3Byb21vL3NwcmluZyJ9.c2ln"}
```

### skadnetworkPostback

`dsx.module.backend.skadnetworkPostback`

Receives a SKAdNetwork postback from Apple, checks its signature and stores it as an anonymous attribution record. Repeats of the same postback are counted once.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributionId` | string | yes | The id of the stored attribution record. |
| `duplicate` | boolean | yes | True when Apple sent this postback before and nothing new was stored. |
| `ok` | boolean | yes | True when the postback was verified and accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | Not a SKAdNetwork 3.0 or 4.0 postback carrying every signed field. | Not recoverable by retrying. |
| `not_configured` | No queue is installed on this deployment. | Not recoverable by retrying. |
| `unauthenticated` | The attribution-signature does not verify with Apple's key (401). | Not recoverable by retrying. |

**Example: Accept a SKAdNetwork postback from Apple**

```js
const result = await dsx.module.backend.skadnetworkPostback({});
// resolves {"attributionId":"skadnetwork:6f1c2b9e-77aa-4c2e-9d11-5e0b7c1a2f33:0","duplicate":false,"ok":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `accept_development_postbacks` | boolean | `false` | Off in production: only postbacks Apple signs with its production key count. Turn on while testing with AdAttributionKit Developer Mode, whose postbacks Apple signs with a development key. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
