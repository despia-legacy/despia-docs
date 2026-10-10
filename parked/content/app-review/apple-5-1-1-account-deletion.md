---
title: Account deletion
description: An app that lets people create an account must also let them start deleting that account from inside the app.
guideline: 5.1.1
store: Apple, Google
category: privacy
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage
cases: 0
order: 130
---

# Account deletion

**Apple App Review Guideline 5.1.1** · Google Play: User Data policy (account deletion). Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

An app that lets people create an account must also let them start deleting that account from inside the app.

## Why Despia apps hit it

The web app handles deletion by email or in a web dashboard only.

## How to fix it

**v4 (DSX).** The fix is in the app's content and store listing, not in an API.

**v3 (legacy).** The same fix applies; see [Store rejections](/legacy/store-rejections/introduction) for how to resubmit.

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. Account deletion is now available in [Settings > Account > Delete account]; it deletes the account and its data [immediately / within N days], and the user is told what happens before confirming.
```
