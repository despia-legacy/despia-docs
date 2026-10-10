---
title: RevenueCat
description: Sell subscriptions and in-app purchases with RevenueCat.
package: Core/Store/Modules/RevenueCat
section: packages
group: Purchases and payments
icon: creditcard
order: 101
---

# RevenueCat

Lets your pages start a purchase, open a RevenueCat paywall or the customer center, and read products, offerings, purchase history and what a user is entitled to. Use it when your team already manages subscriptions in RevenueCat. Needs a RevenueCat account and its iOS and Android API keys.

**When to use it.** Reach for it when your subscriptions and in-app purchases are managed in RevenueCat and you want one call to sell, show a paywall and check what a person owns. Do not include it next to the standalone RevenueCat package, since an app uses one or the other.

<PackageSample/>

## What you need on your side

- A RevenueCat project with your iOS and Android apps, and your products set up in App Store Connect and Google Play Console.
- RevenueCat's public SDK keys in the package settings: **API key** (`appl_...`) and **Android API key** (`goog_...`). These keys are meant to ship in apps.
- Optional: RevenueCat [webhooks](https://www.revenuecat.com/docs/integrations/webhooks) to your own backend, if your server needs to know about purchases and entitlements.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
