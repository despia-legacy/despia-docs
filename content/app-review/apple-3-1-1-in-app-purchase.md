---
title: In-app purchase
description: Digital goods and services sold inside the app go through Apple's in-app purchase (and Google Play Billing on Android), with a working restore, and products that are configured and purchasable.
guideline: 3.1.1
store: Apple, Google
category: payments
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#in-app-purchase
legacySource: /legacy/store-rejections/common-rejection/in-app-purchases
cases: 0
order: 30
---

# In-app purchase

**Apple App Review Guideline 3.1.1** · Google Play: Payments policy. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

Digital goods and services sold inside the app go through Apple's in-app purchase (and Google Play Billing on Android), with a working restore, and products that are configured and purchasable.

## Why Despia apps hit it

Web apps often already sell through Stripe or a web checkout, link out to it, or show prices without the store's billing; restore buttons and sandbox-tested products get forgotten.

## How to fix it

**Despia V4 (DSX).** Use the [RevenueCat package](/packages/revenuecat): `await dsx.module.revenuecat.paywall()`, `purchase()` and `customer()`; configure the products in App Store Connect and Google Play Console first.

**Despia V3 (legacy).** The full walkthrough, with code: [In-app purchase in the legacy docs](/legacy/store-rejections/common-rejection/in-app-purchases).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. All digital content is now purchased with in-app purchase; the external checkout link has been removed from the app. Restore Purchases is available at [location]. The products [IDs] are ready for review and can be tested with the attached sandbox account.
```
