---
title: Payments
description: Take payments in your app with one set of calls, whichever payment provider you use.
package: Core/Payments
section: packages
group: Purchases and payments
icon: creditcard
order: 103
---

# Payments

Gives your app one way to start a payment, manage saved cards, link a bank account and open a customer portal, drawn by the payment package you add, such as Stripe. Add the provider packages you need and nothing more. Needs an account with that provider.

**When to use it.** Use it to take payments inside your app through one set of calls, whichever provider package you add. Choose it before wiring a provider's own calls, so you can change provider later. Do not use it for in-app purchases of digital goods, which belong to the stores.

<PackageSample/>

## What you need on your side

- An account with your payment provider (for example Stripe) and your own backend.
- Your backend creates the payment objects and hands the page their client secrets (`payment_intent_client_secret`, `setup_intent_client_secret`, `ephemeral_key_secret`) and the provider's publishable key. The secret API key stays on your server and never goes into the app.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
