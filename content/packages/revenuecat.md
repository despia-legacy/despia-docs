---
title: RevenueCat
description: Sell subscriptions and in-app purchases with RevenueCat.
package: revenuecat
---

Sell subscriptions and in-app purchases with RevenueCat.

Lets your pages start a purchase, open a RevenueCat paywall or the customer center, and read products, offerings, purchase history and what a user is entitled to. Use it when your team already manages subscriptions in RevenueCat. Needs a RevenueCat account and its iOS and Android API keys.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your team already manages subscriptions and in-app purchases in RevenueCat and you want the app to buy, show paywalls and read entitlements. If you sell through the stores directly without RevenueCat, use the store purchase package instead.

## What native adds

Purchases run through StoreKit and Google Play Billing, which a web page cannot reach, and RevenueCat's native paywall and customer center come with it.

## Install

```sh
despia add Core/RevenueCat
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

### attach

`dsx.module.revenuecat.attach`

Connects a view to the open paywall session so it receives the outcome; the inline component does this itself on mount.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | A name for the view being connected, so several views can follow one session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The views currently connected to the session. |
| `status` | string | yes | The state of the paywall session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: the inline paywall attaches**

```js
const result = await dsx.module.revenuecat.attach({"view":"inline"});
// resolves {"attached":["inline"],"status":"ready"}
```

### attributes

`dsx.module.revenuecat.attributes`

Saves subscriber attributes on the current customer, such as email and name, so you can match them to your own records.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributes` | object | no | Custom attributes as key and value pairs; a null or empty value removes that attribute. |
| `displayName` | string | no | The name to show for the customer in RevenueCat. |
| `email` | string | no | The customer's email address. |
| `phone` | string | no | The customer's phone number. |
| `pushToken` | string | no | The device push token to save on the customer. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `set` | array | yes | The attribute keys that were saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | At least one attribute is required. | Not recoverable by retrying. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: sets reserved and custom attributes**

```js
const result = await dsx.module.revenuecat.attributes({"attributes":{"plan":"team"},"email":"a@b.co"});
// resolves {"set":["$email","plan"]}
```

### buy

`dsx.module.revenuecat.buy`

Buys a package on the open paywall session, for a custom paywall button that you design yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `package` | string | no | The package to buy; it defaults to the one currently selected in the session. |
| `view` | string | no | The name of the view that is making the purchase. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `package` | string | yes | The id of the package that was bought. |
| `status` | string | yes | How the purchase ended, such as purchased or cancelled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A purchase is already being made. |  |
| `detached_view` | That face is not attached to this session. | Not recoverable by retrying. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `settled` | This paywall session is finished. Open a new one to buy again. | Not recoverable by retrying. |
| `unsupported_platform` | RevenueCat store purchases are not available on the web. | Not recoverable by retrying. |

**Example: buys the selected package**

```js
const result = await dsx.module.revenuecat.buy({"package":"annual"});
// resolves {"package":"annual","status":"completed"}
```

### catalog

`dsx.module.revenuecat.catalog`

Returns the full product catalog as one envelope that looks the same on iOS and Android, and also broadcasts it as products.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The id of the offering to load; leave it out to use the current offering. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | no | True while the current RevenueCat user is anonymous. |
| `bridge` | number | no | The capability version of the native bridge, for feature detection. |
| `code` | string | no | A short error code when the envelope reports a failure, otherwise null. |
| `current` | string | no | The id of the current offering, when RevenueCat has one. |
| `offerings` | array of object | yes | Every offering with its packages. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | no | The platform that answered, such as ios or android. |
| `products` | array of object | yes | Every product with its store title and price. |
| `project` | string | no | The RevenueCat project the app is configured with, when known. |
| `provider` | string | yes | The billing provider that answered, always revenuecat. |
| `registered` | boolean | no | True once the current user has signed in with your own user id. |
| `runtime` | number | yes | The version of the shared envelope, the same on iOS and Android. |
| `user` | string | no | The RevenueCat app user id that is signed in now, when the SDK is ready. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Could not load the available offerings. |  |

**Example: returns the unified catalog envelope**

```js
const result = await dsx.module.revenuecat.catalog({});
// resolves {"offerings":[],"ok":true,"products":[],"provider":"revenuecat","runtime":4}
```

### center

`dsx.module.revenuecat.center`

Opens the RevenueCat customer center, where the user can manage or restore subscriptions.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Presented once the customer center is on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Could not sign you in. |  |
| `no_activity` | No foreground screen is available to present this. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `restore_failed` | Could not restore your purchases. |  |
| `unsupported` | This feature is not available on this OS version. | Not recoverable by retrying. |

**Example: presents the customer center**

```js
const result = await dsx.module.revenuecat.center({"external_id":"user_123"});
// resolves {"status":"presented"}
```

### close

`dsx.module.revenuecat.close`

Closes the paywall session for good; open a new session to buy again.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The final state of the closed session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `settled` | This paywall session is finished. Open a new one to buy again. | Not recoverable by retrying. |

**Example: dismisses an open session**

```js
const result = await dsx.module.revenuecat.close({});
// resolves {"status":"canceled"}
```

### currencies

`dsx.module.revenuecat.currencies`

Reads the user's virtual currency balances, such as coins or gems, which survive a reinstall.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refresh` | boolean | no | Pass true to ignore the cached balance, for example after your server granted coins. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `codes` | array | yes | The list of currency codes the user has. |
| `currencies` | object | yes | The balances keyed by currency code. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `currencies_failed` | Couldn't load your balances. |  |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: returns the wallet by code**

```js
const result = await dsx.module.revenuecat.currencies({});
// resolves {"codes":[],"currencies":{}}
```

**Example: reads through the cache after a server-side grant**

```js
const result = await dsx.module.revenuecat.currencies({"refresh":true});
// resolves {"codes":[],"currencies":{}}
```

### customer

`dsx.module.revenuecat.customer`

Returns the customer's entitlements, subscriptions and management links as one envelope, and also broadcasts it as customer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | no | True while the current RevenueCat user is anonymous. |
| `bridge` | number | no | The capability version of the native bridge, for feature detection. |
| `code` | string | no | A short error code when the envelope reports a failure, otherwise null. |
| `details` | object | no | The lifecycle record of each entitlement, keyed by entitlement id. |
| `entitlements` | object | no | The entitlements the person holds, by id. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `management` | string | no | The link where the person manages their subscription, when the store gives one. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | no | The platform that answered, such as ios or android. |
| `project` | string | no | The RevenueCat project the app is configured with, when known. |
| `provider` | string | yes | The billing provider that answered, always revenuecat. |
| `registered` | boolean | no | True once the current user has signed in with your own user id. |
| `runtime` | number | yes | The version of the shared envelope, the same on iOS and Android. |
| `subscriptions` | array of string | no | The ids of the active subscriptions the person has. |
| `user` | string | no | The RevenueCat app user id that is signed in now, when the SDK is ready. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | Could not load your subscription info. |  |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: returns the unified customer envelope**

```js
const result = await dsx.module.revenuecat.customer({});
// resolves {"ok":true,"provider":"revenuecat","runtime":4}
```

### detach

`dsx.module.revenuecat.detach`

Disconnects a view from the paywall session without closing the paywall or abandoning a purchase in progress.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | The name of the view to disconnect. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The views still connected to the session. |
| `status` | string | yes | The state of the paywall session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `detached_view` | That face is not attached to this session. | Not recoverable by retrying. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: the inline paywall detaches without dismissing**

```js
const result = await dsx.module.revenuecat.detach({"view":"inline"});
// resolves {"attached":[],"status":"ready"}
```

### eligibility

`dsx.module.revenuecat.eligibility`

Tells whether this customer can still get the free trial or introductory price a product advertises.

**When to use it.** Check it before showing 7 days free on a paywall.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `products` | array | yes | The product ids to check, as a list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `eligibility` | object | yes | The answer for each product id you asked about. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | At least one product id is required. | Not recoverable by retrying. |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: reports eligibility per product id**

```js
const result = await dsx.module.revenuecat.eligibility({"products":["pro_monthly"]});
// resolves {"eligibility":{"pro_monthly":"eligible"}}
```

### entitlements

`dsx.module.revenuecat.entitlements`

Lists the active entitlements and all entitlements of the current user, sorted by id.

**When to use it.** Use it to decide which features to unlock.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | array | yes | The entitlements the user currently has access to. |
| `all` | array | yes | Every entitlement the user has ever had, active or not. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | Could not load your subscription info. |  |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: returns active and all entitlements**

```js
const result = await dsx.module.revenuecat.entitlements({});
// resolves {"active":[],"all":[]}
```

### history

`dsx.module.revenuecat.history`

Returns the purchase history of the current user as a list of purchase rows.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | Could not load your subscription info. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `unsupported` | This feature is not available on this OS version. | Not recoverable by retrying. |

**Example: returns the purchase history list**

```js
const result = await dsx.module.revenuecat.history({});
// resolves []
```

### login

`dsx.module.revenuecat.login`

Signs a user in to RevenueCat with your own user id, merging any purchases made while anonymous into that account.

**When to use it.** Call it when your own sign-in completes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | yes | Your own id for the signed-in user, which RevenueCat will attach purchases to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | yes | True while the current RevenueCat user is anonymous. |
| `bridge` | number | no | The capability version of the native bridge, for feature detection. |
| `code` | string | no | A short error code when the envelope reports a failure, otherwise null. |
| `entitlements` | object | no | The entitlements the person holds, by id. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `new` | boolean | no | True when RevenueCat created this user just now. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | no | The platform that answered, such as ios or android. |
| `project` | string | no | The RevenueCat project the app is configured with, when known. |
| `provider` | string | no | The billing provider that answered, always revenuecat. |
| `registered` | boolean | no | True once the current user has signed in with your own user id. |
| `runtime` | number | no | The version of the shared envelope, the same on iOS and Android. |
| `user` | string | no | The RevenueCat app user id that is signed in now, when the SDK is ready. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Could not sign you in. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: binds the user and resolves the unified user envelope**

```js
const result = await dsx.module.revenuecat.login({"external_id":"user_123"});
// resolves {"anonymous":false,"ok":true}
```

### logout

`dsx.module.revenuecat.logout`

Signs the user out of RevenueCat and switches to a fresh anonymous user so the next person on a shared device does not see the old entitlements.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | yes | True while the current RevenueCat user is anonymous. |
| `bridge` | number | no | The capability version of the native bridge, for feature detection. |
| `code` | string | no | A short error code when the envelope reports a failure, otherwise null. |
| `entitlements` | object | no | The entitlements the person holds, by id. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `new` | boolean | no | True when RevenueCat created this user just now. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | no | The platform that answered, such as ios or android. |
| `project` | string | no | The RevenueCat project the app is configured with, when known. |
| `provider` | string | no | The billing provider that answered, always revenuecat. |
| `registered` | boolean | no | True once the current user has signed in with your own user id. |
| `runtime` | number | no | The version of the shared envelope, the same on iOS and Android. |
| `user` | string | no | The RevenueCat app user id that is signed in now, when the SDK is ready. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `logout_failed` | Could not sign you out. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: rotates to a fresh anonymous user**

```js
const result = await dsx.module.revenuecat.logout({});
// resolves {"anonymous":true,"ok":true}
```

### offering

`dsx.module.revenuecat.offering`

Returns the offering that RevenueCat marks as current, with its packages and store-priced products.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | array of object | yes | Every offering with its packages and store-priced products. |
| `current` | string | yes | The id of the current offering, or null when RevenueCat has none. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Could not load the available offerings. |  |

**Example: returns the current offering and all offerings (alt name of offerings)**

```js
const result = await dsx.module.revenuecat.offering({});
// resolves {"all":[],"current":"default"}
```

### offerings

`dsx.module.revenuecat.offerings`

Returns the current offering and all other offerings, each with its packages and store-priced products.

**When to use it.** Use it to draw your own paywall with live prices.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | array of object | yes | Every offering with its packages and store-priced products. |
| `current` | string | yes | The id of the current offering, or null when RevenueCat has none. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Could not load the available offerings. |  |

**Example: returns the current offering and all offerings**

```js
const result = await dsx.module.revenuecat.offerings({});
// resolves {"all":[],"current":"default"}
```

### paywall

`dsx.module.revenuecat.paywall`

Shows the RevenueCat paywall for an offering as a native sheet; the outcome arrives as a result broadcast.

**When to use it.** Use it when you have designed the paywall in RevenueCat and want it shown as is.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The id of the offering to show; if it is left out or unknown, the current offering is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `offering` | string | yes | The id of the offering that was shown. |
| `status` | string | yes | Presented once the paywall sheet is on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Could not sign you in. |  |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `no_activity` | No foreground screen is available to present this. |  |
| `no_default_offering` | RevenueCat has no default offering set up for this project, so there is nothing to show. | Mark an offering as current in the RevenueCat dashboard, or pass an offering id. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Could not load the available offerings. |  |
| `unsupported` | This feature is not available on this OS version. | Not recoverable by retrying. |

**Example: presents the default offering**

```js
const result = await dsx.module.revenuecat.paywall({"external_id":"user_123"});
// resolves {"offering":"default","status":"presented"}
```

**Example: presents for the current (anonymous) RevenueCat user when external_id is omitted**

```js
const result = await dsx.module.revenuecat.paywall({});
// resolves {"offering":"default","status":"presented"}
```

### placement

`dsx.module.revenuecat.placement`

Returns the offering that RevenueCat targeting picks for a named placement, so different moments in the app can show different paywalls.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `placement` | string | yes | The name of the placement you set up in RevenueCat, such as onboarding. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `found` | boolean | yes | True when RevenueCat has an offering for that placement. |
| `offering` | object | yes | The offering chosen for that placement. |
| `placement` | string | yes | The placement name you asked about. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A placement id is required. | Not recoverable by retrying. |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Couldn't load the available offerings. |  |

**Example: returns the offering targeted at a placement**

```js
const result = await dsx.module.revenuecat.placement({"placement":"onboarding"});
// resolves {"found":true,"offering":{},"placement":"onboarding"}
```

**Example: reports no offering rather than falling back to the default one**

```js
const result = await dsx.module.revenuecat.placement({"placement":"unconfigured"});
// resolves {"found":false,"offering":{},"placement":"unconfigured"}
```

### products

`dsx.module.revenuecat.products`

Returns the store products from your RevenueCat offerings, either all of them or only the ids you name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product_ids` | array | no | The product ids to load, as a list; leave it out to get every product across all offerings. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Could not load the available offerings. |  |

**Example: returns products for the given ids**

```js
const result = await dsx.module.revenuecat.products({"product_ids":["coins_100"]});
// resolves []
```

### purchase

`dsx.module.revenuecat.purchase`

Starts a purchase for a product, trying each product you list in order and stopping at the first the store accepts.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `product` | array | yes | The product to buy as an id, or id:plan, or a list of them in the order to try. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active_entitlements` | array of string | no | The entitlements active after the purchase. |
| `customer_info` | object | no | The customer summary after the purchase, in the shape whoami returns. |
| `plan_id` | string | no | The base plan id of the product that was bought, when it has one. |
| `product_id` | string | yes | The store product id that was bought. |
| `status` | string | yes | How the purchase ended, purchased when it went through. |
| `transaction` | object | no | The store transaction of the purchase in one shape on every platform. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Could not sign you in. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `no_activity` | No foreground screen is available to present this. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `product_not_found` | We could not find that product in the store. | Not recoverable by retrying. |
| `purchase_failed` | The purchase could not be completed. |  |
| `unknown_error` | An unknown error occurred during the purchase. |  |
| `user_cancelled` | The user closed the purchase sheet without buying. | Treat it as a normal choice and do not show an error. |

**Example: buys a product and resolves the unified shape**

```js
const result = await dsx.module.revenuecat.purchase({"external_id":"user_123","product":["coins_100:monthly"]});
// resolves {"product_id":"coins_100","status":"purchased"}
```

**Example: buys as the current (anonymous) RevenueCat user when external_id is omitted**

```js
const result = await dsx.module.revenuecat.purchase({"product":["coins_100"]});
// resolves {"product_id":"coins_100","status":"purchased"}
```

### redeem

`dsx.module.revenuecat.redeem`

Opens Apple's sheet where the user enters a subscription offer code; this works on iOS only.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Presented when the redeem sheet was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `unsupported` | This feature is not available on this OS version. | Not recoverable by retrying. |

**Example: presents the redemption sheet**

```js
const result = await dsx.module.revenuecat.redeem({});
// resolves {"status":"presented"}
```

### session

`dsx.module.revenuecat.session`

Opens a paywall session that an inline paywall component draws into your layout, without showing anything on its own.

**When to use it.** Use it when you build the paywall inside your own screen instead of the native sheet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in user; leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The id of the offering to use; it defaults to the current offering. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `offering` | string | yes | The id of the offering the session uses. |
| `session` | string | yes | The id of the paywall session that was opened. |
| `status` | string | yes | The state of the session, such as open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A paywall session is already open. Close it before opening another. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `settled` | This paywall session is finished. Open a new one to buy again. | Not recoverable by retrying. |

**Example: opens the session the inline paywall binds to**

```js
const result = await dsx.module.revenuecat.session({"offering":"default"});
// resolves {"offering":"default","session":"pay_1","status":"ready"}
```

### sync

`dsx.module.revenuecat.sync`

Sends the purchases already on this device to RevenueCat without the store's restore prompt.

**When to use it.** Call it once after moving an app to RevenueCat, or after a purchase made outside the RevenueCat SDK.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entitlements` | array | yes | The entitlements the user has after the sync. |
| `synced` | boolean | yes | True when the sync finished. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `sync_failed` | Couldn't sync your purchases. |  |

**Example: syncs the local receipt and returns the entitlements it produced**

```js
const result = await dsx.module.revenuecat.sync({});
// resolves {"entitlements":[],"synced":true}
```

### whoami

`dsx.module.revenuecat.whoami`

Returns the current RevenueCat user with a summary of their active subscriptions, and also broadcasts it as user.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active_entitlement_ids` | array of string | no | The ids of the entitlements active right now. |
| `active_subscription_ids` | array of string | no | The ids of the subscriptions active right now. |
| `all_purchased_product_ids` | array of string | no | The ids of every product the customer has ever bought. |
| `app_user_id` | string | yes | The current RevenueCat app user id. |
| `first_seen` | string | no | When RevenueCat first saw this customer, as an ISO 8601 date. |
| `is_anonymous` | boolean | yes | True while the current user is anonymous. |
| `latest_expiration_date` | string | no | The latest date any entitlement expires, as an ISO 8601 date. |
| `management_url` | string | no | The link where the customer manages their subscription. |
| `original_app_user_id` | string | no | The first app user id RevenueCat saw for this customer. |
| `original_application_version` | string | no | The app version the customer first installed, when known. |
| `original_purchase_date` | string | no | The date of the first purchase, as an ISO 8601 date. |
| `request_date` | string | no | When RevenueCat answered, as an ISO 8601 date. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | Could not load your subscription info. |  |
| `network_unavailable` | RevenueCat could not be reached. Your purchases are safe; try again when you are back online. |  |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |

**Example: returns the customer info object**

```js
const result = await dsx.module.revenuecat.whoami({});
// resolves {"app_user_id":"user_123","is_anonymous":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `androidApiKey` | string | `` | Your RevenueCat public Google Play API key. |
| `android_enabled` | boolean | `true` | Whether the Android RevenueCat SDK is included in the exported app; changing it needs a new export. |
| `apiKey` | string | `` | Your RevenueCat public API key. |
| `ios_enabled` | boolean | `true` | Whether the iOS RevenueCat SDK is included in the exported app; changing it needs a new export. |
| `projectId` | string | `` | The RevenueCat project id, kept so the web side of the app can refer to the project. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | Couldn't load your subscription info. |  |
| `login_failed` | Couldn't sign you in. |  |
| `logout_failed` | Couldn't sign you out. |  |
| `missing_param` | A required parameter is missing. |  |
| `no_activity` | No foreground screen is available to present. |  |
| `no_default_offering` | RevenueCat has no default offering set up for this project, so there is nothing to show. | Mark an offering as current in the RevenueCat dashboard, or pass an offering id. |
| `not_ready` | RevenueCat is still starting up. Please try again in a moment. |  |
| `offerings_failed` | Couldn't load the available offerings. |  |
| `product_not_found` | We couldn't find that product in the store. |  |
| `purchase_failed` | The purchase couldn't be completed. |  |
| `restore_failed` | The purchase restore couldn't be completed. |  |
| `unknown_error` | An unknown error occurred during the purchase. |  |
| `unsupported` | This feature requires a newer OS version. |  |
| `user_cancelled` | The user closed the purchase sheet without buying. | Treat it as a normal choice and do not show an error. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
