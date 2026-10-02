---
title: Collecting data the app does not need
description: Only ask for personal data the app's features need; anything optional must be clearly optional and explained.
guideline: 5.1.1
store: Apple, Google
category: privacy
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage
legacySource: /legacy/store-rejections/common-rejection/user-specific-data
cases: 0
order: 60
---

# Collecting data the app does not need

**Apple App Review Guideline 5.1.1** · Google Play: User Data policy. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

Only ask for personal data the app's features need; anything optional must be clearly optional and explained.

## Why Despia apps hit it

Sign-up forms copied from the web ask for gender, birthday or phone number that no feature uses.

## How to fix it

**v4 (DSX).** Remove fields no feature reads; mark the rest optional with the reason next to the field.

**v3 (legacy).** The full walkthrough, with code: [Collecting data the app does not need in the legacy docs](/legacy/store-rejections/common-rejection/user-specific-data).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. We removed the [birthday / gender / phone] fields from sign-up; the app now asks only for [email], which is needed for [account recovery]. [Field] remains optional and is used for [feature].
```
