---
title: Spam and copies
description: Apps that duplicate others already on the store, or that ship many near-identical variants, are rejected.
guideline: 4.3
store: Apple, Google
category: minimum functionality
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#spam
legacySource: /legacy/store-rejections/common-rejection/spam-and-copies
cases: 0
order: 110
---

# Spam and copies

**Apple App Review Guideline 4.3** · Google Play: Spam policy (repetitive content). Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#spam), [Google Play policy center](https://play.google.com/about/developer-content-policy/).

## What it means

Apps that duplicate others already on the store, or that ship many near-identical variants, are rejected.

## Why Despia apps hit it

Generic to-do, notes, calculator or AI-chat wrappers without a distinct audience or feature; the same app submitted under several names.

## How to fix it

**v4 (DSX).** The fix is in the app's content and store listing, not in an API.

**v3 (legacy).** The full walkthrough, with code: [Spam and copies in the legacy docs](/legacy/store-rejections/common-rejection/spam-and-copies).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. [App] is built for [specific audience] and differs from similar apps in [feature]. We have made this clear in the first screens and the App Store description, and consolidated [variants] into a single app.
```
