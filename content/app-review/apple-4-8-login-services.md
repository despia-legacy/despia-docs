---
title: Login services
description: An app that offers third-party or social login (Google, Facebook and so on) must also offer an equivalent login option that meets Apple's privacy requirements; Sign in with Apple is the usual answer.
guideline: 4.8
store: Apple
category: login
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#login-services
legacySource: /legacy/store-rejections/common-rejection/social-login-options
cases: 0
order: 90
---

# Login services

**Apple App Review Guideline 4.8**. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#login-services).

## What it means

An app that offers third-party or social login (Google, Facebook and so on) must also offer an equivalent login option that meets Apple's privacy requirements; Sign in with Apple is the usual answer.

## Why Despia apps hit it

Apps add Google login first (it is what the web app had) and ship to iOS without the equivalent option.

## How to fix it

**Despia V4 (DSX).** Add Sign in with Apple beside the other providers: `await dsx.module.appleauth.signIn()` from the [Sign in with Apple package](/packages/appleauth), and the [OAuth package](/packages/oauth) for web-based providers.

**Despia V3 (legacy).** The full walkthrough, with code: [Login services in the legacy docs](/legacy/store-rejections/common-rejection/social-login-options).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. Sign in with Apple is now offered alongside [Google] on the login screen, with the same account features. A demo account is attached for the review.
```
