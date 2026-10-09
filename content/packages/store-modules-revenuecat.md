---
title: RevenueCat
description: Sell subscriptions and in-app purchases with RevenueCat.
package: revenuecat
---

Sell subscriptions and in-app purchases with RevenueCat.

Lets your pages start a purchase, open a RevenueCat paywall or the customer center, and read products, offerings, purchase history and what a user is entitled to. Use it when your team already manages subscriptions in RevenueCat. Needs a RevenueCat account and its iOS and Android API keys.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when your subscriptions and in-app purchases are managed in RevenueCat and you want one call to sell, show a paywall and check what a person owns. Do not include it next to the standalone RevenueCat package, since an app uses one or the other.

## What native adds

Purchases run through the real App Store and Google Play billing sheets, and the paywall and customer center are RevenueCat's own native screens.

## Install

```sh
despia add Core/Store/Modules/RevenueCat
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

Attaches a paywall face to the open session so it is told the outcome. The paywall component does this itself when it mounts.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | The id of the paywall face that is attaching to or detaching from the open session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array of object | yes | The faces now attached to the session. |
| `status` | string | yes | The state of the session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: the inline paywall attaches**

```js
const result = await dsx.module.revenuecat.attach({"view":"inline"});
// resolves {"attached":["inline"],"status":"ready"}
```

### attributes

`dsx.module.revenuecat.attributes`

Sets subscriber attributes on the current RevenueCat customer, such as email or a custom key, so the customer can be matched to your own records.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributes` | object | no | Custom attributes by key. A null or empty value clears that attribute. |
| `displayName` | string | no | The customer's display name. |
| `email` | string | no | The customer's email address. |
| `phone` | string | no | The customer's phone number. |
| `pushToken` | string | no | The device push token to store on the customer. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `set` | array of object | yes | The attributes that were written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: sets reserved and custom attributes**

```js
const result = await dsx.module.revenuecat.attributes({"attributes":{"plan":"team"},"email":"a@b.co"});
// resolves {"set":["$email","plan"]}
```

### buy

`dsx.module.revenuecat.buy`

Buys a package on the open session from your own paywall button, and settles the same way the overlay paywall does. A second buy while one is running is refused.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `package` | string | no | The package to buy. Defaults to the one currently selected in the session. |
| `view` | string | no | The id of the paywall face that is attaching to or detaching from the open session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `package` | string | yes | The package that was bought. |
| `status` | string | yes | A short word saying how the purchase ended, such as purchased or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A purchase is already in progress on this session. | Wait for it to finish rather than buying twice. |
| `detached_view` | The named face is not attached to the open session. | Attach the face first, or pass the id of a face that is attached. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `settled` | The paywall session has already finished, by a purchase or a cancel. | Open a new session to buy again. |
| `unsupported_platform` | Store purchases are not available on the web. | Run the purchase on iOS or Android. |

**Example: buys the selected package**

```js
const result = await dsx.module.revenuecat.buy({"package":"annual"});
// resolves {"package":"annual","status":"completed"}
```

### catalog

`dsx.module.revenuecat.catalog`

Returns the products, offerings and prices in one shared envelope that is identical on iOS and Android, and also broadcasts it as products.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The id of the RevenueCat offering to use. When omitted or unknown, the current offering is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A short error code, set only when the envelope reports a failure. |
| `current` | string | no | The id of the current offering. |
| `offerings` | array of object | yes | Every offering with its packages. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | yes | The platform that answered, such as ios or android. |
| `products` | array of object | yes | Every product with its store title and price. |
| `provider` | string | yes | The name of the billing provider that answered, which is revenuecat. |
| `runtime` | number | yes | The version of the shared response envelope, the same on iOS and Android. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |

**Example: returns the unified catalog envelope**

```js
const result = await dsx.module.revenuecat.catalog({});
// resolves {"offerings":[],"ok":true,"products":[],"provider":"revenuecat","runtime":4}
```

### center

`dsx.module.revenuecat.center`

Opens the RevenueCat customer center, where people manage or restore their subscription.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | A short word for the outcome, such as purchased or presented. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Signing the person in to RevenueCat with the given external id failed. | Check the id and the connection, then try again. |
| `no_activity` | On Android there is no foreground screen to show the sheet from. | Call again once the app is in the foreground. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `restore_failed` | The purchases could not be restored. | Try again, and check the device is online. |
| `unsupported` | This feature needs a newer OS version than the device runs, or the platform does not offer it. | Hide the entry point on this device, or offer another way. |

**Example: presents the customer center**

```js
const result = await dsx.module.revenuecat.center({"external_id":"user_123"});
// resolves {"status":"presented"}
```

### close

`dsx.module.revenuecat.close`

Closes the paywall session for good. Open a new one to buy again.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The state of the session after closing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `settled` | The paywall session has already finished, by a purchase or a cancel. | Open a new session to buy again. |

**Example: dismisses an open session**

```js
const result = await dsx.module.revenuecat.close({});
// resolves {"status":"canceled"}
```

### currencies

`dsx.module.revenuecat.currencies`

Reads the person's virtual currency balances, such as coins or gems, which survive a reinstall.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refresh` | boolean | no | Set it to true to skip the cache, for example after your server changed a balance. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `codes` | array of object | yes | The list of currency codes the balances cover. |
| `currencies` | object | yes | The balances, keyed by currency code. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `currencies_failed` | RevenueCat answered with an error while loading the virtual currency balances. | Try again later. Do not show a zero balance. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

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

Returns the person's entitlements, subscriptions and management link in one shared envelope, and also broadcasts it as customer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A short error code, set only when the envelope reports a failure. |
| `details` | object | yes | The detailed customer record from RevenueCat, kept as returned. |
| `entitlements` | object | yes | The entitlements the person holds, as RevenueCat reports them. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `management` | string | no | The link where the person manages their subscription, when the store provides one. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | yes | The platform that answered, such as ios or android. |
| `provider` | string | yes | The name of the billing provider that answered, which is revenuecat. |
| `runtime` | number | yes | The version of the shared response envelope, the same on iOS and Android. |
| `subscriptions` | array of string | yes | The ids of the subscriptions the person has. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | RevenueCat could not load the person's subscription information. | Try again, and do not treat the person as having no subscription. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: returns the unified customer envelope**

```js
const result = await dsx.module.revenuecat.customer({});
// resolves {"ok":true,"provider":"revenuecat","runtime":4}
```

### detach

`dsx.module.revenuecat.detach`

Detaches a paywall face from the session without dismissing the paywall or abandoning a purchase in progress.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | The id of the paywall face that is attaching to or detaching from the open session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array of object | yes | The faces still attached to the session. |
| `status` | string | yes | The state of the session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `detached_view` | The named face is not attached to the open session. | Attach the face first, or pass the id of a face that is attached. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: the inline paywall detaches without dismissing**

```js
const result = await dsx.module.revenuecat.detach({"view":"inline"});
// resolves {"attached":[],"status":"ready"}
```

### eligibility

`dsx.module.revenuecat.eligibility`

Checks whether this person would actually get the free trial or introductory price a product advertises.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `products` | array of object | yes | The product ids to check. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `eligibility` | object | yes | The answer for each product id you asked about. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: reports eligibility per product id**

```js
const result = await dsx.module.revenuecat.eligibility({"products":["pro_monthly"]});
// resolves {"eligibility":{"pro_monthly":"eligible"}}
```

### entitlements

`dsx.module.revenuecat.entitlements`

Lists the entitlements the person holds now and every entitlement they have ever had.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | array of object | yes | The entitlements that are active right now. |
| `all` | array of object | yes | Every entitlement, active or not. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | RevenueCat could not load the person's subscription information. | Try again, and do not treat the person as having no subscription. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: returns active and all entitlements**

```js
const result = await dsx.module.revenuecat.entitlements({});
// resolves {"active":[],"all":[]}
```

### history

`dsx.module.revenuecat.history`

Reads the person's purchase history as a list of purchase rows.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | RevenueCat could not load the person's subscription information. | Try again, and do not treat the person as having no subscription. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `unsupported` | This feature needs a newer OS version than the device runs, or the platform does not offer it. | Hide the entry point on this device, or offer another way. |

**Example: returns the purchase history list**

```js
const result = await dsx.module.revenuecat.history({});
// resolves []
```

### login

`dsx.module.revenuecat.login`

Binds RevenueCat to your signed-in user and merges any purchases made anonymously before sign-in. Also broadcasts the user as user.

**When to use it.** Call it right after your own sign-in succeeds.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | yes | Your own id for the signed-in person. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | yes | True while the current RevenueCat user is anonymous. |
| `code` | string | no | A short error code, set only when the envelope reports a failure. |
| `entitlements` | object | yes | The entitlements the person holds, as RevenueCat reports them. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `new` | boolean | yes | True when RevenueCat created this user just now. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | yes | The platform that answered, such as ios or android. |
| `provider` | string | yes | The name of the billing provider that answered, which is revenuecat. |
| `runtime` | number | yes | The version of the shared response envelope, the same on iOS and Android. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Signing the person in to RevenueCat with the given external id failed. | Check the id and the connection, then try again. |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: binds the user and resolves the unified user envelope**

```js
const result = await dsx.module.revenuecat.login({"external_id":"user_123"});
// resolves {"anonymous":false,"ok":true}
```

### logout

`dsx.module.revenuecat.logout`

Switches RevenueCat to a fresh anonymous user so a shared device never shows the previous account's entitlements. It counts as success if the user was already anonymous.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymous` | boolean | yes | True while the current RevenueCat user is anonymous. |
| `code` | string | no | A short error code, set only when the envelope reports a failure. |
| `entitlements` | object | yes | The entitlements the person holds, as RevenueCat reports them. |
| `entitlements.active` | array of string | yes | The entitlements that are active right now. |
| `entitlements.all` | array of string | yes | Every entitlement the person has had, active or not. |
| `new` | boolean | yes | True when a new anonymous user was created. |
| `ok` | boolean | yes | True when the call succeeded and the envelope carries real data. |
| `platform` | string | yes | The platform that answered, such as ios or android. |
| `provider` | string | yes | The name of the billing provider that answered, which is revenuecat. |
| `runtime` | number | yes | The version of the shared response envelope, the same on iOS and Android. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `logout_failed` | RevenueCat could not switch back to an anonymous user. | Try again, and check the device is online. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: rotates to a fresh anonymous user**

```js
const result = await dsx.module.revenuecat.logout({});
// resolves {"anonymous":true,"ok":true}
```

### offering

`dsx.module.revenuecat.offering`

Reads the same offerings list as offerings, kept as the singular spelling for pages that call it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | array of object | yes | Every offering, each with its packages and products. |
| `current` | string | no | The id of the current offering, absent when none is marked current. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |

**Example: returns the current offering and all offerings (alt name of offerings)**

```js
const result = await dsx.module.revenuecat.offering({});
// resolves {"all":[],"current":"default"}
```

### offerings

`dsx.module.revenuecat.offerings`

Lists the RevenueCat offerings with their packages and store-priced products, and says which one is current.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | array of object | yes | Every offering, each with its packages and products. |
| `current` | string | no | The id of the current offering, absent when none is marked current. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |

**Example: returns the current offering and all offerings**

```js
const result = await dsx.module.revenuecat.offerings({});
// resolves {"all":[],"current":"default"}
```

### paywall

`dsx.module.revenuecat.paywall`

Shows a RevenueCat paywall sheet for an offering so the person can pick and buy.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The id of the RevenueCat offering to use. When omitted or unknown, the current offering is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `offering` | string | yes | The id of the offering the paywall showed. |
| `status` | string | yes | A short word for the outcome, such as purchased or presented. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Signing the person in to RevenueCat with the given external id failed. | Check the id and the connection, then try again. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `no_activity` | On Android there is no foreground screen to show the sheet from. | Call again once the app is in the foreground. |
| `no_default_offering` | The project loaded but has no offering marked as current. | Mark an offering as current in the RevenueCat dashboard. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |
| `unsupported` | This feature needs a newer OS version than the device runs, or the platform does not offer it. | Hide the entry point on this device, or offer another way. |

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

Finds the offering that RevenueCat's targeting rules pick for a named placement, so one app can show a different paywall at different moments.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `placement` | string | yes | The name of the placement set up in the RevenueCat dashboard. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `found` | boolean | yes | True when the placement has a matching offering. |
| `offering` | object | yes | The offering chosen for that placement. |
| `placement` | string | yes | The placement name that was asked about. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |

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

Lists store products with their store-priced details, either every product in all offerings or a set you name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `product_ids` | array of object | no | A list of store product ids to look up. Leave it out to get every product across all offerings. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |

**Example: returns products for the given ids**

```js
const result = await dsx.module.revenuecat.products({"product_ids":["coins_100"]});
// resolves []
```

### purchase

`dsx.module.revenuecat.purchase`

Buys a product through the store's payment sheet and tells you what the person owns afterwards. It tries the products you list in order and stops at the first one the store returns.

**When to use it.** Use it for a custom buy button.

**When not to.** Use paywall instead when you want RevenueCat to show the choices.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `product` | array of object | yes | The product to buy as id or id:plan, or a list of them to try in order. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active_entitlements` | array of string | yes | The ids of the entitlements active after the purchase. |
| `customer_info` | object | yes | The full RevenueCat customer record after the purchase. |
| `plan_id` | string | no | The plan that was bought, empty when the product has no plan. |
| `product_id` | string | yes | The id of the product that was bought. |
| `status` | string | yes | A short word for the outcome, such as purchased or presented. |
| `transaction` | object | yes | The store transaction details for the purchase. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `login_failed` | Signing the person in to RevenueCat with the given external id failed. | Check the id and the connection, then try again. |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `no_activity` | On Android there is no foreground screen to show the sheet from. | Call again once the app is in the foreground. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `product_not_found` | The store answered and does not carry the requested product id. | Check the product id in App Store Connect or Google Play and in the RevenueCat dashboard. |
| `purchase_failed` | The store could not complete the purchase. | Show a message and let the person try again. |
| `unknown_error` | The vendor returned neither a success nor an error it recognises. | Let the person try again, and report it if it keeps happening. |
| `user_cancelled` | The person closed the payment sheet without buying. | Treat it as a normal choice, not a failure. Leave the person where they were. |

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

Opens Apple's offer-code redemption sheet on iOS. On Android it reports unsupported, since Google Play codes are redeemed in the Play Store app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | A short word saying the sheet was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `unsupported` | This feature needs a newer OS version than the device runs, or the platform does not offer it. | Hide the entry point on this device, or offer another way. |

**Example: presents the redemption sheet**

```js
const result = await dsx.module.revenuecat.redeem({});
// resolves {"status":"presented"}
```

### session

`dsx.module.revenuecat.session`

Opens the paywall session that a paywall component on your page binds to. It shows nothing by itself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external_id` | string | no | Your own id for the signed-in person. Leave it out to act as the current, possibly anonymous, RevenueCat user. |
| `offering` | string | no | The offering to show in the session. Defaults to the current offering. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `offering` | string | yes | The id of the offering the session shows. |
| `session` | string | yes | The id of the session that was opened. |
| `status` | string | yes | A short word for the outcome, such as purchased or presented. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A paywall session is already open. | Close the open session before opening another. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `settled` | The paywall session has already finished, by a purchase or a cancel. | Open a new session to buy again. |

**Example: opens the session the inline paywall binds to**

```js
const result = await dsx.module.revenuecat.session({"offering":"default"});
// resolves {"offering":"default","session":"pay_1","status":"ready"}
```

### sync

`dsx.module.revenuecat.sync`

Sends the purchases already on this device up to RevenueCat without the store's restore prompt. Use it once after moving an app onto RevenueCat.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entitlements` | array of object | yes | The entitlements the person holds after the sync. |
| `synced` | boolean | yes | True when the purchases were sent. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `sync_failed` | RevenueCat rejected the purchases the device tried to sync. | Try again, and contact RevenueCat support if it keeps failing. |

**Example: syncs the local receipt and returns the entitlements it produced**

```js
const result = await dsx.module.revenuecat.sync({});
// resolves {"entitlements":[],"synced":true}
```

### whoami

`dsx.module.revenuecat.whoami`

Reads who the current RevenueCat user is and a summary of their subscriptions, and also broadcasts the user as user.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active_entitlement_ids` | array of string | yes | The ids of every entitlement the person can use right now. |
| `active_subscription_ids` | array of string | yes | The ids of every subscription that is currently running for the person. |
| `all_purchased_product_ids` | array of string | yes | The ids of every product the person has ever bought. |
| `app_user_id` | string | yes | The id RevenueCat currently uses for this user. |
| `first_seen` | string | no | When RevenueCat first saw this user, as an ISO 8601 date. |
| `is_anonymous` | boolean | yes | True when the user has not been signed in with your own id. |
| `original_app_user_id` | string | yes | The first id RevenueCat knew this user by. |
| `request_date` | string | no | When RevenueCat answered, as an ISO 8601 date. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | RevenueCat could not load the person's subscription information. | Try again, and do not treat the person as having no subscription. |
| `network_unavailable` | The device could not reach RevenueCat, so nothing is known about the catalogue or the account. | Ask the person to check their connection and try again. Their purchases are safe. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |

**Example: returns the customer info object**

```js
const result = await dsx.module.revenuecat.whoami({});
// resolves {"app_user_id":"user_123","is_anonymous":false}
```

## Events

Read with `dsx.on(name, handler)`.

### center

Fires when the customer center is closed or the person acts in it.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `result` | object | yes | What happened in the customer center. |

### customerInfo

Fires after every purchase, restore, sign-in or SDK update with the person's RevenueCat customer record.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customerInfo` | object | yes | The full customer record from RevenueCat. |

### session.changed

Fires when the paywall session moves to a new state.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attempts` | number | yes | How many purchase attempts the session has made. |
| `session` | string | yes | The id of the paywall session that changed. |
| `status` | string | yes | The new state of the session. |

### session.settled

Fires when the paywall session ends, by a purchase, a failure or a cancel.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | yes | The error code when the session failed. |
| `notify` | boolean | yes | True when the outcome should be shown to the person. |
| `package` | string | yes | The package involved in the purchase. |
| `session` | string | yes | The id of the paywall session that ended. |
| `status` | string | yes | Whether the session succeeded, failed or was canceled. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `androidApiKey` | string | `` | Your RevenueCat public Google Play API key. |
| `apiKey` | string | `` | Your RevenueCat public API key. |
| `projectId` | string | `` | Your RevenueCat project id, used by the page side and not needed by the SDK. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `customer_info_failed` | RevenueCat could not load the person's subscription information. | Try again, and do not treat the person as having no subscription. |
| `login_failed` | Signing the person in to RevenueCat with the given external id failed. | Check the id and the connection, then try again. |
| `logout_failed` | RevenueCat could not switch back to an anonymous user. | Try again, and check the device is online. |
| `missing_param` | A parameter the action needs was not supplied. | Add the missing parameter and call again. |
| `no_activity` | On Android there is no foreground screen to show the sheet from. | Call again once the app is in the foreground. |
| `no_default_offering` | The project loaded but has no offering marked as current. | Mark an offering as current in the RevenueCat dashboard. |
| `not_ready` | RevenueCat has not finished starting, usually because the API key is missing or the SDK is still configuring. | Check that the API key is set in the package config, then try the call again a moment later. |
| `offerings_failed` | RevenueCat could not load the offerings, which is usually the network or an unfinished dashboard setup. | Check the connection and the offerings in the RevenueCat dashboard, then try again. |
| `product_not_found` | The store answered and does not carry the requested product id. | Check the product id in App Store Connect or Google Play and in the RevenueCat dashboard. |
| `purchase_failed` | The store could not complete the purchase. | Show a message and let the person try again. |
| `restore_failed` | The purchases could not be restored. | Try again, and check the device is online. |
| `unknown_error` | The vendor returned neither a success nor an error it recognises. | Let the person try again, and report it if it keeps happening. |
| `unsupported` | This feature needs a newer OS version than the device runs, or the platform does not offer it. | Hide the entry point on this device, or offer another way. |
| `user_cancelled` | The person closed the payment sheet without buying. | Treat it as a normal choice, not a failure. Leave the person where they were. |

## Related packages

- Needs: [Store](/packages/store)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
