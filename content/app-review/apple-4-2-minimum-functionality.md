---
title: Minimum functionality
description: The app has to be more than a website or a brochure in an app shell: real navigation, real depth, and features people expect from an app in its category. Reviewers judge perceived value, not the technology.
guideline: 4.2
store: Apple
category: minimum functionality
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#minimum-functionality
legacySource: /legacy/store-rejections/common-rejection/minimum-functionality
cases: 0
order: 10
---

# Minimum functionality

**Apple App Review Guideline 4.2** · Google Play: Spam and minimum functionality. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality).

## What it means

The app has to be more than a website or a brochure in an app shell: real navigation, real depth, and features people expect from an app in its category. Reviewers judge perceived value, not the technology.

## Why Despia apps hit it

Shipping from web code is fast, so landing pages, single-screen apps and website layouts (sidebars, hamburger menus, desktop footers) get submitted. The same submission built in SwiftUI would be rejected too.

## How to fix it

**Despia V4 (DSX).** Build screens with DSX's native defaults (tab bar, navigation stack, native controls) rather than a web layout, and use native capabilities where they serve the app (push, haptics, offline).

**Despia V3 (legacy).** The full walkthrough, with code: [Minimum functionality in the legacy docs](/legacy/store-rejections/common-rejection/minimum-functionality).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you for the review. Since the last submission we have [added native tab navigation / offline support / push notifications for X]. The app now lets users [core task] without a browser: [steps a reviewer can follow]. A demo account is attached in App Review Information.
```
