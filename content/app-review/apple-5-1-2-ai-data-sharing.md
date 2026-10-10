---
title: Sharing personal data with AI services
description: Before personal data is sent to a third-party AI service, the app must say so clearly and get the user's permission.
guideline: 5.1.2
store: Apple
category: privacy
platform: v4, legacy
official: https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing
legacySource: /legacy/store-rejections/common-rejection/ai-processing
cases: 0
order: 80
---

# Sharing personal data with AI services

**Apple App Review Guideline 5.1.2**. Read the official text: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing).

## What it means

Before personal data is sent to a third-party AI service, the app must say so clearly and get the user's permission.

## Why Despia apps hit it

Chat and AI features post user content to model APIs with the disclosure only in the terms of service, or with consent given on the web but not kept in the app.

## How to fix it

**Despia V4 (DSX).** Ask with a native confirm before the first AI call, say which service receives the data, and store the answer (for example with `await dsx.module.identityvault.write(...)`, from the [Identity Vault package](/packages/identityvault)).

**Despia V3 (legacy).** The full walkthrough, with code: [Sharing personal data with AI services in the legacy docs](/legacy/store-rejections/common-rejection/ai-processing).

## Reply to the reviewer

Adapt it to what you actually changed; reply in App Store Connect (Resolution Center) only after the fix is in the build you submit.

```text
Thank you. Before any content is sent to [AI provider], the app now explains what is shared and asks for permission in a native dialog; nothing is sent if the user declines. The choice is stored and can be changed in [Settings].
```
