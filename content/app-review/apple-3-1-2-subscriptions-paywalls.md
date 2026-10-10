---
title: Subscriptions and paywalls
description: A paywall must state what is bought, the price and billing period, and the trial terms clearly, be easy to dismiss, and never trick the user into a purchase.
guideline: 3.1.2
store: Apple, Google
category: payments
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#subscriptions
legacySource: /legacy/store-rejections/common-rejection/deceptive-paywalls
cases: 0
order: 40
---

# Subscriptions and paywalls

**Apple App Review Guideline 3.1.2** · Google Play: Subscriptions policy. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#subscriptions), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

A paywall must state what is bought, the price and billing period, and the trial terms clearly, be easy to dismiss, and never trick the user into a purchase.

## Why Despia apps hit it

Conversion-optimised web paywalls carry dark patterns: tiny prices, the most expensive plan preselected, hidden close buttons, "Continue" that buys, fake urgency or social proof.

## How to fix it

**Despia V4 (DSX).** Present store products with `await dsx.module.revenuecat.paywall()` (the store's own terms and prices), keep a visible close control, and show price, period and trial end next to the purchase button.

**Despia V3 (legacy).** The full walkthrough, with code: [Subscriptions and paywalls in the legacy docs](/legacy/store-rejections/common-rejection/deceptive-paywalls).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. The paywall now shows the full price and billing period beside each plan, states when the free trial ends and what is charged after it, preselects no plan, and has a visible close button. A screenshot of the updated paywall is attached.
```
