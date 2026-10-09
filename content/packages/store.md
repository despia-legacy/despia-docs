---
title: In-app purchases and paywalls
description: Sell subscriptions and purchases with a native paywall and one simple way to check what a user owns.
package: store
---

Sell subscriptions and purchases with a native paywall and one simple way to check what a user owns.

Shows a paywall you design in JSON, runs checkout, restores purchases and tells you which entitlements a user has, in the same shape on every platform. It works through Apple StoreKit 2 or RevenueCat. Use it for subscriptions, one-time purchases and paid features. Needs products set up in the App Store or Google Play, or a RevenueCat account.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when your app sells subscriptions or one-off purchases and you want one set of calls for paywall, checkout, restore and what a person owns, on both iOS and Android. If you already run everything in RevenueCat you can pick that as the provider and keep the same calls.

## What native adds

Checkout runs through the real App Store and Google Play payment sheets, and refunds, subscription management and offer codes open the stores' own screens.

## Install

```sh
despia add Core/Store
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

### billingMessages

`dsx.module.store.billingMessages`

Shows Google Play's own in-app message about a billing problem, such as a declined card during a grace period, so the person can fix it without leaving the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `outcome` | string | yes | How the message ended, such as shown or dismissed. |
| `purchaseToken` | string | yes | The purchase token the message was about. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | There is no screen to show the purchase surface over, usually because the app is closing. | Call again once the app is in the foreground. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: shows nothing when no payment needs fixing**

```js
const result = await dsx.module.store.billingMessages({});
// resolves {"outcome":"no_action_needed","purchaseToken":""}
```

**Example: reports a subscription the customer recovered**

```js
const result = await dsx.module.store.billingMessages({});
// resolves {"outcome":"subscription_status_updated","purchaseToken":"tok_1"}
```

### catalog

`dsx.module.store.catalog`

Reads store products with their titles and prices for a list of ids, so you can show prices in your own screens.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product` | array of string | no | The product ids to look up. |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `products` | array of object | yes | The products found, each with its id, type, title and price. |
| `provider` | string | yes | Which purchase provider answered the request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: returns the unified catalog**

```js
const result = await dsx.module.store.catalog({"product":["pro_monthly"],"provider":"store"});
// resolves {"products":[],"provider":"storekit"}
```

### checkout

`dsx.module.store.checkout`

Starts the store payment sheet for one product and resolves with the outcome and the transaction.

**When to use it.** Use it behind your own buy button.

**When not to.** Use paywall if you want Despia to draw the choices.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `appAccountToken` | string | no | A UUID you choose that the store attaches to the transaction so your server can match it to an account. |
| `coins` | boolean | no | Set it to true when the product is a coin pack. |
| `externalId` | string | no | Your own id for the signed-in person, so the purchase belongs to your account. |
| `kind` | string | no | Whether you are buying a plan or a coin pack. |
| `offer` | string | no | The offer to buy: an offer id, basePlan:offerId on Google Play, or a Play offer token. Leave it out to take the first offer the store lists. |
| `offerSignature` | object | no | For an iOS promotional offer, the signature your server made, so the signing key never ships in the app. |
| `offerSignature.jws` | string | no | The signed promotional offer from your server, as a compact JWS. |
| `offerSignature.keyID` | string | no | The id of the key your server signed the offer with. |
| `offerSignature.nonce` | string | no | The one-time value your server used when signing the offer. |
| `offerSignature.signature` | string | no | The signature your server made for the promotional offer. |
| `offerSignature.timestamp` | int | no | When your server signed the offer, in milliseconds since 1970. |
| `product` | string | yes | The store product id to buy. |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entitlements` | array of string | no | The entitlements the person holds after the purchase. |
| `kind` | string | no | Whether it was a coin pack or a plan. Present only after a purchase. |
| `outcome` | string | yes | How checkout ended: purchased, pending, busy or failed. |
| `platform` | string | no | Which platform it ran on, ios or android. |
| `product` | string | yes | The product id that was bought. |
| `provider` | string | no | Which provider ran the purchase: storekit, play_store or revenuecat. |
| `raw` | object | no | The untouched provider response, present when RevenueCat is the provider. |
| `transaction` | object | no | The normalized store transaction for the purchase. |
| `transaction.appAccountToken` | string | no | The account token you passed in, as the store recorded it. |
| `transaction.currency` | string | no | The currency the purchase was charged in. |
| `transaction.environment` | string | no | Whether the purchase happened in production or in a sandbox. |
| `transaction.expiresDate` | int | no | When a subscription expires, in milliseconds since 1970. |
| `transaction.id` | string | no | The store's id for this transaction. |
| `transaction.originalId` | string | no | The id of the first transaction in a subscription chain. |
| `transaction.price` | number | no | The amount that was charged. |
| `transaction.productId` | string | yes | The store product id that was bought. |
| `transaction.purchaseDate` | int | yes | When the purchase happened, in milliseconds since 1970. |
| `transaction.quantity` | int | no | How many units were bought. |
| `transaction.type` | string | no | What kind of product the transaction was for. |
| `transaction.willRenew` | boolean | no | True when the subscription will renew on its own. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person closed the payment sheet without buying. | Treat it as a normal choice and leave the person where they were. |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `offer_signature_required` | A promotional offer on iOS needs a signature made by your server. | Have your server mint the signature and pass it as offerSignature. |
| `purchase_failed` | The store rejected the purchase. | Show a message and let the person try again. The error data carries the store's reason. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |
| `unknown_offer` | The named offer is not among the offers the store lists for this product and person. | Read the offers action to see which offers are available, then pass one of those. |
| `unsupported_provider` | No purchase provider with that name is in this build, or the chosen one cannot take offers. | Add the provider package or fix the provider setting. Offers are bought through the store provider. |

**Example: purchases a product directly**

```js
const result = await dsx.module.store.checkout({"product":"pro_monthly","provider":"store"});
// resolves {"outcome":"purchased","product":"pro_monthly"}
```

### dismiss

`dsx.module.store.dismiss`

Closes the open paywall and resolves it with the outcome you name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `outcome` | string | no | The outcome to resolve the paywall with. It defaults to dismissed. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismissed` | boolean | yes | True when a paywall was closed. |

**Example: dismisses with a chosen outcome**

```js
const result = await dsx.module.store.dismiss({"outcome":"unlocked"});
// resolves {"dismissed":true}
```

### entitlements

`dsx.module.store.entitlements`

Lists what the person owns right now, as entitlement ids from RevenueCat or product ids from the store.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entitlements` | array of string | yes | The ids the person is entitled to. |
| `provider` | string | yes | Which purchase provider answered the request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: queries provider-abstracted ownership**

```js
const result = await dsx.module.store.entitlements({"provider":"store"});
// resolves {"entitlements":[],"provider":"store"}
```

### manage

`dsx.module.store.manage`

Opens the store's own screen for managing subscriptions, where the person can cancel or change plan.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product` | string | no | On Android, opens that subscription's own row. On iOS, or when left out, it opens the subscription list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `presented` | boolean | yes | True when the store screen was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | There is no screen to show the purchase surface over, usually because the app is closing. | Call again once the app is in the foreground. |
| `unavailable` | The device cannot open this store screen, for example because the Play Store app is missing. | Hide the entry point or send the person to the store's website. |

**Example: presents the manage-subscriptions surface**

```js
const result = await dsx.module.store.manage({});
// resolves {"presented":true}
```

### offers

`dsx.module.store.offers`

Lists every offer a product carries, such as free trials and promotional prices, in one shape for both stores.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product` | string | yes | The store product id to read offers for. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `eligibleForIntro` | boolean | yes | True when the person can still use an introductory offer. |
| `offers` | array of object | yes | The offers, each with its kind, id and pricing phases. |
| `product` | string | yes | The product the offers belong to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_found` | The store answered and does not carry that product or purchase. | Check the id, that the product is cleared for sale and available in the person's region. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |
| `unsupported_platform` | This feature exists only in the App Store and Google Play, not on the web. | Hide it on the web, or use the checkout page of your payment provider there. |

**Example: lists a subscription's offers**

```js
const result = await dsx.module.store.offers({"product":"pro_monthly"});
// resolves {"eligibleForIntro":true,"offers":[],"product":"pro_monthly"}
```

### paywall

`dsx.module.store.paywall`

Builds and shows a native paywall from a JSON description of products, features and coins, and resolves when the person buys, restores or closes it.

**When to use it.** Use it when you want the paywall drawn natively from data without writing screen code.

**When not to.** Use checkout instead if you draw your own buttons and only need the payment step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent` | string | no | The accent colour used for buttons and highlights. |
| `actions` | array of string | no | Names of your own actions the layout may fire, each sent back to you as an event of that name. |
| `appAccountToken` | string | no | A UUID you choose that the store attaches to the transaction so your server can match it to an account. |
| `balance` | number | no | The person's current coin balance, shown on a coin paywall. |
| `coins` | array of object | no | The coin pack rows to show, each with a product id and a coin amount. |
| `countdown` | number | no | A number of seconds for a countdown shown on the paywall. |
| `cta` | string | no | The text on the main buy button. |
| `data` | object | no | The whole paywall as one object. Any top-level paywall key here wins, and other keys become named state the layout can read. |
| `display` | string | no | How the paywall is displayed on screen. |
| `entitlement` | string | no | The entitlement the paywall is selling, used to check whether the person already has it. |
| `externalId` | string | no | Your own id for the signed-in person, so the purchase belongs to your account. |
| `features` | array of string | no | The feature lines listed on the paywall. |
| `footer` | object | no | Content for the bottom of the paywall, such as links to terms. |
| `footer.fineprint` | string | no | The small print shown at the bottom of the paywall. |
| `footer.restore` | boolean | no | The label of the restore purchases link in the footer. |
| `header` | object | no | Content for the top of the paywall. |
| `header.subtitle` | string | no | The line shown under the header title. |
| `header.title` | string | no | The heading shown at the top of the paywall. |
| `mode` | string | no | How the paywall is presented. |
| `products` | array of object | no | The subscription or purchase rows to show, each with a store product id and a title. |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |
| `restore` | boolean | no | Set it to true to show a restore purchases button. |
| `subtitle` | string | no | The line under the heading. |
| `template` | string | no | The built-in paywall layout to use. |
| `theme` | object | no | Colours and styling overrides for the paywall. |
| `theme.accent` | string | no | The accent colour used for buttons and highlights. |
| `theme.display` | string | no | How the paywall is displayed, such as a sheet or full screen. |
| `theme.mode` | string | no | Whether the paywall uses light, dark or the system appearance. |
| `title` | string | no | The main heading of the paywall. |
| `token` | string | no | A token passed through to the provider with the purchase. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entitlements` | array of string | yes | The entitlements the person holds after the paywall closed. |
| `outcome` | string | yes | How the paywall ended: purchased, restored, dismissed or busy. |
| `purchase` | object | no | The purchase details, present when a purchase completed. |
| `purchase.entitlements` | array of string | no | The entitlements the person holds after the purchase. |
| `purchase.kind` | string | no | Whether the purchase was a coin pack or a plan. |
| `purchase.outcome` | string | yes | How the purchase ended, such as purchased. |
| `purchase.platform` | string | no | Which platform the purchase ran on, ios or android. |
| `purchase.product` | string | yes | The product id that was bought. |
| `purchase.provider` | string | no | Which provider ran the purchase. |
| `purchase.raw` | object | no | The untouched provider response, when RevenueCat is the provider. |
| `purchase.transaction` | object | no | The normalized store transaction for the purchase. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | There is no screen to show the purchase surface over, usually because the app is closing. | Call again once the app is in the foreground. |

**Example: presents a tiers paywall then resolves on dismiss**

```js
const result = await dsx.module.store.paywall({"externalId":"user_123","products":[{"price":"$9.99","productId":"pro_monthly","title":"Pro"}],"provider":"revenuecat","template":"tiers"});
// resolves {"entitlements":[],"outcome":"dismissed"}
```

### product

`dsx.module.store.product`

Reads one product from the store with its title, description, price and subscription details.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product` | string | yes | The store product id to look up. |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `description` | string | no | The product description from the store. |
| `id` | string | yes | The store product id of the product that was found. |
| `introductory_offer` | object | no | The introductory offer, present only when RevenueCat is the provider. |
| `introductory_offer.cycles` | int | yes | How many billing cycles the introductory price applies for. |
| `introductory_offer.offer_id` | string | no | The store's identifier for the free trial or introductory price. |
| `introductory_offer.payment_mode` | string | yes | How the offer is paid, such as a free trial or pay as you go. |
| `introductory_offer.period` | string | yes | The length of one introductory period as a code, such as P1W. |
| `introductory_offer.period_count` | int | yes | How many period units one introductory period lasts. |
| `introductory_offer.period_unit` | string | yes | The unit of the introductory period, such as day, week or month. |
| `introductory_offer.price` | object | yes | The introductory price, formatted for the person's currency. |
| `price` | object | no | The store price, absent on Google Play when no price is listed. |
| `price.amount` | number | yes | The price as a number in the store's currency. |
| `price.amount_micros` | int | yes | The price in millionths of the currency unit, to avoid rounding. |
| `price.currency` | string | yes | The currency code of the price, such as USD. |
| `price.formatted` | string | yes | The price as text, ready to show in the person's currency. |
| `store` | string | no | Which store the product comes from, app_store or play_store. |
| `subscription` | object | no | The subscription details, present only for subscriptions. |
| `subscription.group_id` | string | no | The subscription group the product belongs to. |
| `subscription.period` | string | no | The billing period as a code, such as P1M. |
| `subscription.period_count` | int | yes | How many period units one billing period lasts. |
| `subscription.period_unit` | string | yes | The unit of the billing period, such as month or year. |
| `title` | string | no | The product name shown in the store. |
| `type` | string | no | What kind of product it is, such as auto_renewable, consumable or non_consumable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_found` | The store answered and does not carry that product or purchase. | Check the id, that the product is cleared for sale and available in the person's region. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: returns one product's unified metadata**

```js
const result = await dsx.module.store.product({"product":"pro_monthly","provider":"store"});
// resolves {"id":"pro_monthly"}
```

### receipts

`dsx.module.store.receipts`

Lists the person's transactions the store knows about, for example to send to your server for checking.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provider` | string | yes | Which purchase provider answered the request. |
| `transactions` | array of object | yes | The transactions, each with its product id, type and environment. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: returns unified past transactions**

```js
const result = await dsx.module.store.receipts({"provider":"store"});
// resolves {"provider":"storekit","transactions":[]}
```

### redeemCode

`dsx.module.store.redeemCode`

Takes the person to the store's own screen for redeeming an offer code.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A code to prefill. Android uses it, iOS ignores it because Apple's sheet takes the typed code. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `presented` | boolean | yes | True when the redemption screen was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | There is no screen to show the purchase surface over, usually because the app is closing. | Call again once the app is in the foreground. |
| `unavailable` | The device cannot open this store screen, for example because the Play Store app is missing. | Hide the entry point or send the person to the store's website. |
| `unsupported_platform` | This feature exists only in the App Store and Google Play, not on the web. | Hide it on the web, or use the checkout page of your payment provider there. |

**Example: presents the redemption surface**

```js
const result = await dsx.module.store.redeemCode({"code":"SPRING24"});
// resolves {"presented":true}
```

### refund

`dsx.module.store.refund`

Shows Apple's refund request sheet for a purchase the person already made.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product` | string | no | The product to find the transaction for when no transaction id is given. |
| `transaction` | string | no | The original transaction id. Leave it out to use the most recent purchase for the product, or the most recent one overall. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `outcome` | string | yes | How the refund request ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `duplicate_request` | A refund request for this purchase is already in progress. | Wait for the first request to finish. |
| `ineligible` | This purchase cannot be refunded through Apple. | Point the person to your own support instead. |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `no_presenter` | There is no screen to show the purchase surface over, usually because the app is closing. | Call again once the app is in the foreground. |
| `not_found` | The store answered and does not carry that product or purchase. | Check the id, that the product is cleared for sale and available in the person's region. |
| `refund_failed` | Apple could not send the refund request. | Try again later. |

**Example: presents the refund sheet and reports the outcome**

```js
const result = await dsx.module.store.refund({"product":"pro_monthly"});
// resolves {"outcome":"success"}
```

### restore

`dsx.module.store.restore`

Asks the store to bring back purchases the person made before, for example on a new phone.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |
| `sync` | boolean | no | Set it to true to also sync with the store before restoring. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `restored` | boolean | yes | True when the restore completed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |

**Example: restores silently**

```js
const result = await dsx.module.store.restore({"sync":false});
// resolves {"restored":true}
```

### select

`dsx.module.store.select`

Marks a product as chosen, as plain state, so a plan picker drawn in any markup can drive the paywall. It works on every platform including the web.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `productId` | string | yes | The id of the product the person picked in your plan picker. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `selectedProduct` | string | yes | The id of the product now selected. |

**Example: selects a plan and publishes it**

```js
const result = await dsx.module.store.select({"productId":"pro.yearly"});
// resolves {"selectedProduct":"pro.yearly"}
```

### storefront

`dsx.module.store.storefront`

Reads which country's store the person is using, as a country code.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alpha3` | string | yes | The three-letter country code of the store. |
| `countryCode` | string | yes | The two-letter country code of the store. |
| `id` | string | yes | The store's own identifier for the storefront. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The device cannot open this store screen, for example because the Play Store app is missing. | Hide the entry point or send the person to the store's website. |

**Example: answers the storefront country**

```js
const result = await dsx.module.store.storefront({});
// resolves {"alpha3":"ARE","countryCode":"AE","id":"143481"}
```

### subscription

`dsx.module.store.subscription`

Reads the renewal state of the person's active subscription, including grace period and billing problems, which entitlements alone cannot tell you.

**When to use it.** Use it to show a banner such as please update your payment method.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `group` | string | no | On iOS, a subscription group id to read the status for. It is ignored elsewhere. |
| `product` | string | no | Limit the answer to one product id. Leave it out to read every active subscription. |
| `provider` | string | no | Which provider answers, such as store or revenuecat. Leave it out to use the provider this app has set. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `billingIssue` | boolean | yes | True when the store is having trouble charging the person. |
| `gracePeriodEndsAt` | number | yes | When the grace period ends, in milliseconds since 1970, or 0 when none applies. |
| `provider` | string | yes | Which purchase provider answered the request. |
| `renewsAt` | number | yes | When the next renewal is due, in milliseconds since 1970, or 0 when unknown. |
| `state` | string | yes | The subscription state, such as active, grace period or expired. |
| `subscriptions` | array of object | yes | Every active subscription with its own state and renewal time. |
| `willRenew` | boolean | yes | True when the subscription will renew on its own. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The store could not be reached, so nothing is known about the person's purchases. | Ask the person to check their connection and try again. Their purchases are safe. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |

**Example: reports an active renewing subscription**

```js
const result = await dsx.module.store.subscription({"provider":"store"});
// resolves {"billingIssue":false,"gracePeriodEndsAt":0,"provider":"store","renewsAt":0,"state":"subscribed","subscriptions":[],"willRenew":true}
```

**Example: separates a grace period from an expiry**

```js
const result = await dsx.module.store.subscription({"provider":"revenuecat"});
// resolves {"billingIssue":true,"gracePeriodEndsAt":0,"provider":"revenuecat","renewsAt":0,"state":"in_grace_period","subscriptions":[],"willRenew":true}
```

### update

`dsx.module.store.update`

Changes what a paywall that is already open shows, by name, without closing it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | The values to change. An array replaces that list and anything else sets that value. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `updated` | boolean | yes | True when the open paywall took the change. |

**Example: patches a live sheet**

```js
const result = await dsx.module.store.update({"data":{"balance":50}});
// resolves {"updated":true}
```

## Events

Read with `dsx.on(name, handler)`.

### impression

Fires when the paywall has been built and shown.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `coins` | int | yes | How many coin rows the paywall shows. |
| `products` | int | yes | How many product rows the paywall shows. |
| `template` | string | yes | The paywall layout that was shown. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `provider` | string | `` | Optional: which provider runs purchases and answers what a person owns (store, revenuecat or commerce). Empty means the one provider package this app includes, or the App Store and Google Play directly. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | The provider answers about the signed-in person, and nobody is signed in. | Sign the person in first, then call again. |
| `invalid_identity` | The externalId is not valid for this provider, for example it is longer than Google Play allows. | Use a shorter id of at most 64 characters. |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `not_configured` | The chosen purchase provider is missing a required setting. | Fill in the provider's settings, for example the endpoint for Despia Commerce. |
| `provider_ambiguous` | Two purchase providers are in this build and none is chosen. | Set which provider to use in the store settings. |
| `provider_unavailable` | The chosen purchase provider is not part of this build. | Add the provider's package to the app. |
| `rejected` | The purchase provider refused the request. | Check the provider's settings and the details you sent. |
| `store_unavailable` | The store cannot be used on this device, for example an emulator or a phone without Google Play services. | Test on a device with the store installed, or hide purchases here. |
| `subject_mismatch` | The externalId names somebody other than the person who is signed in. | Pass the signed-in person's id, or leave externalId out. |
| `unsupported_by_provider` | The chosen provider cannot do this on this platform. | Use a provider that supports it, or skip this call here. |
| `unsupported_provider` | No purchase provider with that name is in this build, or the chosen one cannot take offers. | Add the provider package or fix the provider setting. Offers are bought through the store provider. |

## Related packages

- Used by: [LegacyIAP](/packages/iap), [Backend](/packages/store-modules-backend), [Commerce](/packages/commerce), [RevenueCat](/packages/store-modules-revenuecat)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
