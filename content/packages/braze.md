---
title: Braze
description: Send events to Braze and show its push, content cards and in-app messages.
package: braze
---

Send events to Braze and show its push, content cards and in-app messages.

Works with the Product analytics package: it logs your events in Braze, receives push through the Notifications package, lists content cards as data you can display and draws in-app messages. Needs a Braze account, your SDK API key and your SDK endpoint.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your marketing team runs campaigns in Braze and you want its events, push, content cards and in-app messages in your app. It needs your Braze SDK key and endpoint; without them it does nothing.

## Install

```sh
despia add Core/Growth/Modules/Braze
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, desktop.

## Actions

### cards.click

`dsx.module.braze.cards.click`

Records that the person tapped a content card in Braze. Opening the card's link is up to your markup.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the card that was tapped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the click was logged. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | No card id was given. | Pass the card's id. |
| `not_configured` | Braze has no SDK key or endpoint set. | Set the key and endpoint in the package config. |
| `not_started` | Braze is not running yet. | Try again after Braze has started. |
| `unknown_card` | No live content card has that id. | Use an id from cards.list. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: Record a tap on a card**

```js
const result = await dsx.module.braze.cards.click({"id":"c-1"});
// resolves {"ok":true}
```

### cards.dismiss

`dsx.module.braze.cards.dismiss`

Dismisses a content card: Braze records it and the card leaves the list.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the card to dismiss. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the card was dismissed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | No card id was given. | Pass the card's id. |
| `not_configured` | Braze has no SDK key or endpoint set. | Set the key and endpoint in the package config. |
| `not_started` | Braze is not running yet. | Try again after Braze has started. |
| `unknown_card` | No live content card has that id. | Use an id from cards.list. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: Dismiss a card**

```js
const result = await dsx.module.braze.cards.dismiss({"id":"c-1"});
// resolves {"ok":true}
```

### cards.list

`dsx.module.braze.cards.list`

Asks Braze for fresh content cards and returns the list, which you can draw in your own layout.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cards` | array of object | yes | The content cards that are live for this person. |
| `unviewed` | number | yes | How many of those cards the person has not seen yet. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Braze has no SDK key or endpoint set. | Set the key and endpoint in the package config. |
| `not_started` | Braze is not running yet, because there is no key or consent. | Try again after Braze has started. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: List the live content cards**

```js
const result = await dsx.module.braze.cards.list({});
// resolves {"cards":[{"created":1791400000,"description":"Ten percent off your first order.","expiresAt":1794000000,"extras":{},"id":"c-1","imageUrl":"https://example.com/offer.png","pinned":false,"title":"Welcome offer","url":"https://example.com/offer","viewed":false}],"unviewed":1}
```

### cards.view

`dsx.module.braze.cards.view`

Records that the person saw a content card, which Braze needs for its impression counts. Call it once when the card appears.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the card that was shown. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the impression was logged. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | No card id was given. | Pass the card's id. |
| `not_configured` | Braze has no SDK key or endpoint set. | Set the key and endpoint in the package config. |
| `not_started` | Braze is not running yet. | Try again after Braze has started. |
| `unknown_card` | No live content card has that id. | Use an id from cards.list. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: Record that a card was seen**

```js
const result = await dsx.module.braze.cards.view({"id":"c-1"});
// resolves {"ok":true}
```

### messages.click

`dsx.module.braze.messages.click`

Handles a tap on the in-app message that is showing: logs the click, closes the message, shows the next one and opens the link if there is one.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `button` | string | no | The id of the button that was tapped; leave out when the body was tapped. |
| `open` | boolean | no | Set false to log the click without opening the link. |
| `url` | string | no | The link tapped inside an HTML message. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The link that belongs to the tap, whether or not it was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_message` | No in-app message is showing. | Call it only while a message is on screen. |
| `unknown_button` | The message on screen has no button with that id. | Use a button id from the message. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: Tap the button of the in-app message**

```js
const result = await dsx.module.braze.messages.click({"button":"0"});
// resolves {"url":"https://example.com/offer"}
```

### messages.dismiss

`dsx.module.braze.messages.dismiss`

Closes the in-app message that is showing and shows the next one waiting.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the message was closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_message` | No in-app message is showing. | Call it only while a message is on screen. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: Close the in-app message**

```js
const result = await dsx.module.braze.messages.dismiss({});
// resolves {"ok":true}
```

### send

`dsx.module.braze.send`

Sends a batch of your app's events to Braze. The product analytics package calls it for you.

**When not to.** You rarely call it yourself; log events through the product analytics package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | Your Braze SDK endpoint, the cluster host such as sdk.iad-01.braze.com. |
| `events` | array of object | yes | The batch of events to send, each with its name, properties and time. |
| `token` | string | yes | Your Braze SDK API key, a UUID from Settings in Braze. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | yes | How many events were refused and thrown away. |
| `sent` | number | yes | How many events were handed to Braze. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | The person has not given consent, so Braze is not running. | Ask for consent, then try again. |
| `invalid_api_key` | The key is not a Braze SDK API key. | Copy the SDK API key, a UUID, from Settings in Braze. |
| `invalid_endpoint` | The endpoint is not a Braze cluster host. | Use the SDK endpoint host shown in your Braze dashboard. |
| `key_mismatch` | Braze is already running in this app with a different key or endpoint. | Use one key and endpoint for the whole app. |
| `not_configured` | Braze has no SDK key or endpoint set. | Set the key and endpoint in the package config, or load the Braze Web SDK on the page. |
| `unsupported_platform` | Braze has no SDK for this platform. | Skip Braze on this platform. |

**Example: an empty batch is not a call**

```js
const result = await dsx.module.braze.send({"endpoint":"sdk.iad-01.braze.com","events":[],"token":"3f1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d"});
// resolves {"dropped":0,"sent":0}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_key` | string | `` | Settings, App Settings, your app's API key (a UUID). Leave blank to start Braze only when Growth selects it. |
| `endpoint` | string | `` | Your cluster's SDK host, for example sdk.iad-01.braze.com or sdk.fra-02.braze.eu. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
