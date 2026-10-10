---
title: Blank screens during login
description: Reviewers reject flows that show blank or white screens or look unresponsive, which often happens during an OAuth redirect.
guideline: 2.1
store: Apple
category: login
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#app-completeness
legacySource: /legacy/store-rejections/common-rejection/blank-screen-redirects
cases: 0
order: 100
---

# Blank screens during login

**Apple App Review Guideline 2.1**. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#app-completeness).

## What it means

Reviewers reject flows that show blank or white screens or look unresponsive, which often happens during an OAuth redirect.

## Why Despia apps hit it

Redirect-based OAuth leaves the app's web view on an empty page while the provider and the callback load; callback pages that wait for a JavaScript framework to boot show white until it does.

## How to fix it

**v4 (DSX).** Run sign-in in the system browser session with `dsx.module.oauth.start({ url, callback: "https" })` (`Core/Auth/OAuth`; see the HTTPS callback guide) so the app never shows the redirect pages.

**v3 (legacy).** The full walkthrough, with code: [Blank screens during login in the legacy docs](/legacy/store-rejections/common-rejection/blank-screen-redirects).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. Sign-in now runs in the system authentication sheet and returns directly to the app, and a loading state is shown while the session is created; no blank screen appears. A screen recording of the flow is attached.
```
