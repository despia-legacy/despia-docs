---
title: Despia Commerce
description: Verify purchases and keep entitlements on your own server, with no third party in between.
package: commerce
---

Verify purchases and keep entitlements on your own server, with no third party in between.

Sends every App Store and Google Play purchase to your own Despia Commerce deployment, which verifies the store's signature and keeps the entitlements. Your app then asks that server what the signed-in person owns. Works with the Store package and any sign-in provider. Needs a Despia Commerce deployment of your own.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you want your own server to verify store purchases and decide what each person owns, instead of a third-party service. It does not show a payment sheet; the store package still does the buying.

## Install

```sh
despia add Core/Store/Modules/Commerce
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

### entitlements

`dsx.module.commerce.entitlements`

Asks your Commerce server what the signed-in person owns right now.

**When to use it.** Use it to unlock features, including on the web where there is no store purchase.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | no | Your own user id for the person; it is only cross-checked against the signed-in session and refused if it names someone else. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customer` | string | yes | The id your Commerce server uses for the signed-in person. |
| `entitlements` | array of string | yes | The names of what the person owns, such as pro. |
| `known` | boolean | yes | True when your server already has records for this person. |
| `provider` | string | yes | Names the purchase provider that answered, which is commerce here. |
| `rows` | array of object | yes | The detailed entitlement records from your server. |

**Example: Read what the signed-in person owns**

```js
const result = await dsx.module.commerce.entitlements({});
// resolves {"customer":"user_123","entitlements":["pro"],"known":true,"provider":"commerce","rows":[{"active":true,"entitlement":"pro","lifetime":false,"revoked":false,"source":"app_store","validFrom":"2026-09-01T00:00:00Z","validUntil":"2026-10-01T00:00:00Z"}]}
```

### restore

`dsx.module.commerce.restore`

Sends every store-signed purchase the device still holds to your Commerce server and returns what the person owns afterwards.

**When to use it.** Use it for a restore purchases button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | no | Your own user id for the person; it is only cross-checked against the signed-in session and refused if it names someone else. |
| `platform` | string | yes | Which store made the purchases: apple or google. |
| `transactions` | array of string | no | The signed StoreKit transactions or Play purchase tokens to check. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customer` | string | yes | The id your Commerce server uses for the signed-in person. |
| `entitlements` | array of string | yes | The names of what the person owns, such as pro. |
| `known` | boolean | yes | True when your server already has records for this person. |
| `provider` | string | yes | Names the purchase provider that answered, which is commerce here. |
| `restored` | boolean | yes | True when the purchases were checked and ownership was restored. |
| `rows` | array of object | yes | The detailed entitlement records from your server. |

**Example: Restore the purchases the device holds**

```js
const result = await dsx.module.commerce.restore({"platform":"ios","transactions":["example-signed-transaction"]});
// resolves {"customer":"user_123","entitlements":["pro"],"known":true,"provider":"commerce","restored":true,"rows":[{"active":true,"entitlement":"pro","lifetime":false,"revoked":false,"source":"app_store","validFrom":"2026-09-01T00:00:00Z","validUntil":"2026-10-01T00:00:00Z"}]}
```

### verify

`dsx.module.commerce.verify`

Sends a purchase signed by the store to your Commerce server to check it, and returns what the person owns as a result.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | no | Your own user id for the person; it is only cross-checked against the signed-in session and refused if it names someone else. |
| `platform` | string | yes | Which store made the purchase: apple or google. |
| `purchaseToken` | string | no | For google, the purchase token from Play Billing. |
| `transaction` | string | no | For apple, the signed transaction text from StoreKit. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customer` | string | yes | The id your Commerce server uses for the signed-in person. |
| `entitlements` | array of string | yes | The names of what the person owns, such as pro. |
| `known` | boolean | yes | True when your server already has records for this person. |
| `provider` | string | yes | Names the purchase provider that answered, which is commerce here. |
| `rows` | array of object | yes | The detailed entitlement records from your server. |
| `transaction` | object | no | The purchase as your server checked it. |

**Example: Verify an App Store purchase**

```js
const result = await dsx.module.commerce.verify({"platform":"ios","transaction":"2000000123456789"});
// resolves {"customer":"user_123","entitlements":["pro"],"known":true,"provider":"commerce","rows":[{"active":true,"entitlement":"pro","lifetime":false,"revoked":false,"source":"app_store","validFrom":"2026-09-01T00:00:00Z","validUntil":"2026-10-01T00:00:00Z"}],"transaction":{"id":"2000000123456789","productId":"pro.monthly"}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `endpoint` | string | `` | The address of your own Despia Commerce deployment, for example https://commerce.example.com. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | Sign the person in first: Despia Commerce answers about the signed in person. |  |
| `missing_param` | A required parameter is missing. |  |
| `network_unavailable` | Despia Commerce could not be reached. Purchases are safe; try again when you are back online. |  |
| `not_configured` | Set the Commerce endpoint to your Despia Commerce deployment. |  |
| `rejected` | Despia Commerce refused the request. |  |
| `subject_mismatch` | The externalId names somebody other than the signed in person. |  |

## Related packages

- Needs: [Store](/packages/store)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
