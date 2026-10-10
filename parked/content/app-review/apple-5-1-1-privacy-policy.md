---
title: Privacy policy
description: Every app that collects or shares data needs a reachable privacy policy, linked in the store listing and inside the app, that matches what the app and its SDKs actually do.
guideline: 5.1.1
store: Apple, Google
category: privacy
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage
legacySource: /legacy/store-rejections/common-rejection/privacy-policy
cases: 0
order: 50
---

# Privacy policy

**Apple App Review Guideline 5.1.1** · Google Play: User Data policy. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

Every app that collects or shares data needs a reachable privacy policy, linked in the store listing and inside the app, that matches what the app and its SDKs actually do.

## Why Despia apps hit it

Analytics, crash reporting, push and payment SDKs all collect data; policies are missing, 404, hosted on staging, generic templates, or differ between the app and the listing.

## How to fix it

**v4 (DSX).** List every package the app adds (analytics, push, payments) in the policy; link it from the app's settings screen and from App Store Connect.

**v3 (legacy).** The full walkthrough, with code: [Privacy policy in the legacy docs](/legacy/store-rejections/common-rejection/privacy-policy).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. The privacy policy is now available at [URL], linked from [Settings > Privacy] in the app and from the App Store listing. It describes the data the app and its SDKs ([list]) collect and how users can request deletion.
```
