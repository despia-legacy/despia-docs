---
title: App Tracking Transparency
description: Tracking a user across other companies' apps and websites needs the App Tracking Transparency prompt first, the choice must be respected, and the App Store privacy labels must match.
guideline: 5.1.2
store: Apple
category: privacy
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing
legacySource: /legacy/store-rejections/common-rejection/tracking-transparency
cases: 0
order: 70
---

# App Tracking Transparency

**Apple App Review Guideline 5.1.2**. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing).

## What it means

Tracking a user across other companies' apps and websites needs the App Tracking Transparency prompt first, the choice must be respected, and the App Store privacy labels must match.

## Why Despia apps hit it

Ad and attribution SDKs, or web tracking added later through an over-the-air update, track without the prompt, or the privacy labels say "no tracking".

## How to fix it

**v4 (DSX).** Request permission with `dsx.module.apptracking.permission.request()` (package `Core/WebPlatform/AppTracking`) before any tracking SDK starts, and keep the privacy labels in step with every package that tracks.

**v3 (legacy).** The full walkthrough, with code: [App Tracking Transparency in the legacy docs](/legacy/store-rejections/common-rejection/tracking-transparency).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. The app now shows the App Tracking Transparency prompt before [SDK] starts, and does not track when permission is denied. The App Privacy section in App Store Connect has been updated to declare [data types].
```
