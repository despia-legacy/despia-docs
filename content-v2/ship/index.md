---
title: Shipping overview
description: From a project to the App Store and Google Play: connect your store accounts once, build on Despia Cloud, test, submit and release.
---

Shipping works the same for a DSX app and a converted web app. Despia builds and signs the app on Despia Cloud with your own store credentials, and every step can run from the console, the CLI or your agent.

::: steps

### Connect your store accounts

Once per workspace: an [App Store Connect key](/ship/app-store-connect) for iOS and a [Google Play service account](/ship/google-play) for Android. Despia tests each one before it saves it.

### Build

Press **Build** in the console, or run `despia build ios --cloud` and `despia build android --cloud`. See [Builds](/ship/builds).

### Test

Send the build to TestFlight or a Google Play testing track, and invite testers. See [Releases](/ship/releases).

### Submit and release

Submit the build for review. When the store approves it, release it, all at once or to a share of your users first.

:::

## What ships where

| Change | How it reaches people |
| :-- | :-- |
| Your web app's code (Convert) | Deploy your site as usual. The app shows the new version on its next launch. |
| DSX screens, routes and styles | An over-the-air bundle. No store review. |
| Packages, permissions, the app icon and name, the bundle ID | A new store build. |

## Before you submit

- **The store listing.** `despia listing pull` writes your store text into files, `despia listing check` checks every field and screenshot against the store limits, and `despia listing push` uploads your edits.
- **Privacy answers.** `despia declarations` drafts the App Privacy and Data safety answers from the packages your app uses.
- **What the stores refuse.** `despia validate` checks a build for what an upload would reject.
- **App Review.** [App Review](/app-review) explains the guidelines apps run into and how to pass them.

::: cards
- [App Store Connect key](/ship/app-store-connect) {key} Connect iOS once.
- [Google Play service account](/ship/google-play) {key} Connect Android once.
- [Builds](/ship/builds) {hammer} Start, follow and download builds.
- [Releases](/ship/releases) {iphone} TestFlight, testing tracks and review.
:::
