---
title: Store
description: Sell subscriptions and purchases with a native paywall and one simple way to check what a user owns.
package: Core/Store
section: packages
group: Purchases and payments
icon: creditcard
order: 102
---

# Store

Shows a paywall you design in JSON, runs checkout, restores purchases and tells you which entitlements a user has, in the same shape on every platform. It works through Apple StoreKit 2 or RevenueCat. Use it for subscriptions, one-time purchases and paid features. Needs products set up in the App Store or Google Play, or a RevenueCat account.

**When to use it.** Reach for it when your app sells subscriptions or one-off purchases and you want one set of calls for paywall, checkout, restore and what a person owns, on both iOS and Android. If you already run everything in RevenueCat you can pick that as the provider and keep the same calls.

<PackageSample/>

## What you need on your side

- Products set up in App Store Connect and Google Play Console.
- The **provider** setting chooses who answers: `store` (the App Store and Google Play directly), `revenuecat` or `commerce`. With `revenuecat`, you also need what the [RevenueCat](/packages/revenuecat) page lists.
- If your server must check purchases itself, it talks to Apple's and Google's server APIs (or your provider's) with your own credentials.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
