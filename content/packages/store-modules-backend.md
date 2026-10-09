---
title: Backend
description: The server side of App Store promotional offers.
package: backend
---

The server side of App Store promotional offers.

Core/Store's server half: the App Store promotional offer JWS, signed with your In-App Purchase key on your own server.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when you give subscribers an App Store promotional offer, because the offer must be signed with your private key, which belongs on your server. You do not need it for Google Play offers or for products without offers.

## Install

```sh
despia add Core/Store/Modules/Backend
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

### offerSignature

`dsx.module.backend.offerSignature`

Signs an App Store promotional offer for the signed-in customer so the app can apply it at checkout.

**When to use it.** Call it from your server just before checkout for a customer who qualifies for an offer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `offer` | string | yes | The id of a promotional offer from your allowed list. |
| `product` | string | yes | The product id the offer belongs to. |
| `transactionId` | string | no | Optional id of a past transaction of the customer, which Apple recommends including. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `jws` | string | yes | The signed offer token to pass to checkout as the offer signature. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | A promotional offer is signed for a signed in customer, and there is none. | Not recoverable by retrying. |
| `bad_request` | product and offer are required. | Not recoverable by retrying. |
| `forbidden` | This deployment does not sign that offer (it is not in APPLE_PROMOTIONAL_OFFERS). | Not recoverable by retrying. |
| `not_configured` | APPLE_IAP_PRIVATE_KEY, APPLE_IAP_KEY_ID, APPLE_IAP_ISSUER_ID, APPLE_BUNDLE_ID or APPLE_PROMOTIONAL_OFFERS is not set. | Not recoverable by retrying. |

**Example: Sign a promotional offer**

```js
const result = await dsx.module.backend.offerSignature({"offer":"winback_50","product":"pro.monthly"});
// resolves {"jws":"example-signed-offer"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `bundle_id` | string | `` | The iOS app's bundle ID the offer is signed for. |
| `iap_issuer_id` | string | `` | The issuer ID at the top of the In-App Purchase keys page. |
| `iap_key_id` | string | `` | The key's ID from the same page (example 2X9R4HXF34). |
| `iap_private_key` | secret | `` | The .p8 file App Store Connect gives you under Users and Access, Integrations, In-App Purchase. It signs promotional offers. |
| `promotional_offers` | string | `` | Comma separated offer identifiers, or product:offer pairs. An offer not listed is refused, so a client can never sign an offer you did not choose to hand out. |

## Related packages

- Needs: [Store](/packages/store)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
