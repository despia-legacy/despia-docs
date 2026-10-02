---
title: Website-style design
description: The app must look and behave like an app on the device: a title bar, bottom tabs or a navigation stack, touch-sized controls. Reviewers often cite this together with 4.2 as "a repackaged website".
guideline: 4.0
store: Apple
category: design
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#design
legacySource: /legacy/store-rejections/common-rejection/non-mobile-design
cases: 0
order: 20
---

# Website-style design

**Apple App Review Guideline 4.0**. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#design).

## What it means

The app must look and behave like an app on the device: a title bar, bottom tabs or a navigation stack, touch-sized controls. Reviewers often cite this together with 4.2 as "a repackaged website".

## Why Despia apps hit it

Responsive web layouts carry desktop patterns into the app: drawer menus, top bars with many links, link-column footers, cookie banners, headers that hide on scroll.

## How to fix it

**v4 (DSX).** DSX renders native chrome by default (system tab bar, navigation bar, sheets), so a v4 screen starts from the platform's own layout instead of a web one.

**v3 (legacy).** The full walkthrough, with code: [Website-style design in the legacy docs](/legacy/store-rejections/common-rejection/non-mobile-design).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you for the feedback. We have rebuilt the app's navigation to follow iOS conventions: [bottom tab bar with N sections, native navigation titles and back gestures], and removed web-only elements such as [cookie banner / footer links]. Screenshots of the updated flow are attached.
```
