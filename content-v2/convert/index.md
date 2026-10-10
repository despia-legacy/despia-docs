---
title: Convert overview
description: Convert puts the web app you already have into a native iOS and Android app, and lets it call native features from its own JavaScript. Available today.
---

Convert is the fastest way to a native app when you already have a web app. Despia builds an iOS and an Android app around it, and your web app calls native features with one line of JavaScript. You keep your stack, your hosting and your deploys.

```js
await dsx.module.haptic.success();
```

That line runs native code on the phone. There is nothing to install in your web app: Despia defines `dsx` before your scripts run.

## What you get

- **A real app in both stores**, built and signed on Despia Cloud. No Xcode or Android Studio needed.
- **Native features from JavaScript**: sign in with Apple, payments and subscriptions, push notifications, the camera, contacts, biometrics and more, through [packages](/packages).
- **Your web app stays yours.** It loads from your own address, so a deploy of your site updates the app at once, without a store review.
- **The same API as DSX.** `dsx.module.<package>.<action>()` is the same call in a converted web app and in a DSX app, so moving screens to DSX later changes nothing about how you call native features.

## How it relates to DSX

Convert and DSX are two routes into the same Despia V4 platform:

| | Convert | DSX |
| :-- | :-- | :-- |
| You start from | A web app you already have | Nothing, or a template |
| The screens are | Your web pages | DSX documents |
| Native features | `dsx.module` from your JavaScript | `dsx.module` from DSX actions |
| Status | Available today | Research preview |

You can start with Convert and move one screen at a time to DSX when DSX's production release ships.

## The path

::: steps

### Create the app

In the [console](https://console.despia.com), choose **New app** and enter your web app's address. See the [Quickstart](/convert/quickstart).

### Add native features

Add packages to the app, then call them from your code. See [Native features from JavaScript](/web-apps/native-features), and [React and Next.js](/web-apps/frameworks) for frameworks that render on the server.

### Build and ship

Connect your App Store Connect key and Google Play service account once, build, send the build to testers, and submit. See [Build and ship](/ship).

:::

::: cards
- [Quickstart](/convert/quickstart) {bolt} From your web app's address to a build on your phone.
- [Native features from JavaScript](/web-apps/native-features) {shippingbox} Calls, results, errors and events.
- [Running inside Despia](/web-apps/outside-despia) {globe} Keep one site working in the app and in a browser.
- [Moving from Despia V3](/convert/from-v3) {book} Bring a V3 app over.
:::
