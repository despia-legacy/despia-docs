---
title: LegacyIAP
description: Keeps old v1 and v2 in-app purchase links working by answering them with the store package.
package: iap
---

Keeps old v1 and v2 in-app purchase links working by answering them with the store package.

The v1/v2 in app purchase verbs for old WebView pages (the legacy-legacy purchase path; v3 bought through RevenueCat), answered by Core/Store: successUrl and expiredUrl loads, the v3 purchase globals, the App Store receipt and the ad removal flag.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it only for an old v1 or v2 app whose pages still call the inapppurchase, inappsubscription or restoreinapppurchases links. New apps should call the store package directly.

## Install

```sh
despia add Core/Legacy/Modules/IAP
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### last

`dsx.module.iap.last`

Returns the last purchase completed during this app session, or an empty result if there has been none.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `planID` | string | no | The product id that was bought. |
| `purchaseToken` | string | no | The Play purchase token; only present on Android. |
| `subreceipts` | string | no | On iOS the App Store receipt as base64 text for your server to verify; on Android the list of product ids. |
| `transactionID` | string | no | The store's transaction id for the purchase. |
| `transactionIdentifier` | string | no | The Play order id; only present on Android. |

**Example: answers empty before any purchase**

```js
const result = await dsx.module.iap.last({});
// resolves {}
```

### purchase

`dsx.module.iap.purchase`

Buys a one-off product for an old page and answers at once; the outcome arrives as the purchased broadcast and by loading your success or expired page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `consumable` | boolean | no | On Android, consume the purchase after success instead of only acknowledging it, for products that can be bought again. |
| `expiredUrl` | string | no | A page address to load if the purchase is cancelled or fails, and later when the subscription for this product has expired. |
| `product` | string | yes | The store product id to buy. |
| `removeAds` | boolean | no | Pass true to remember that ads are removed once the purchase succeeds. |
| `successUrl` | string | no | A page address to load in the app after the purchase completes. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True as soon as the purchase has been started; it does not mean the purchase succeeded. |

**Example: starts a purchase**

```js
const result = await dsx.module.iap.purchase({"product":"com.app.pro","successUrl":"https://app.example.com/ok"});
// resolves {"started":true}
```

### restore

`dsx.module.iap.restore`

Restores the user's earlier purchases and reports their product ids in the restored broadcast when any exist.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True as soon as the restore has been started. |

**Example: starts a restore**

```js
const result = await dsx.module.iap.restore({});
// resolves {"started":true}
```

### subscribe

`dsx.module.iap.subscribe`

Starts an auto-renewing subscription purchase for an old page and answers at once; the outcome arrives as the purchased broadcast.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `consumable` | boolean | no | On Android, consume the purchase after success instead of only acknowledging it, for products that can be bought again. |
| `expiredUrl` | string | no | A page address to load if the purchase is cancelled or fails, and later when the subscription for this product has expired. |
| `product` | string | yes | The store product id to buy. |
| `successUrl` | string | no | A page address to load in the app after the purchase completes. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True as soon as the purchase has been started; it does not mean the purchase succeeded. |

**Example: starts a subscription**

```js
const result = await dsx.module.iap.subscribe({"product":"com.app.monthly"});
// resolves {"started":true}
```

## Events

Read with `dsx.on(name, handler)`.

### purchased

A purchase or subscription finished successfully; it carries the same details that the last action returns.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `planID` | string | yes | The product id that was bought. |
| `purchaseToken` | string | no | The Play purchase token; only present on Android. |
| `subreceipts` | string | yes | On iOS the App Store receipt as base64 text for your server to verify; on Android the list of product ids. |
| `transactionID` | string | yes | The store's transaction id for the purchase. |
| `transactionIdentifier` | string | no | The Play order id; only present on Android. |

### restored

A restore found purchases the user already owns; it does not fire when there are none.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `productIds` | array of string | yes | The product ids that were restored. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter, the product id, was not supplied. | Pass the product id of the item to buy. |

## Related packages

- Needs: [Store](/packages/store)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
