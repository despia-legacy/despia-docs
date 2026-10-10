---
title: OneSignal
description: Send push notifications to your app's users through OneSignal.
package: Core/OneSignal
section: packages
group: Notifications
icon: bell
order: 109
---

# OneSignal

Registers the device with OneSignal, asks for notification permission and links each device to your signed-in user, so you can send pushes from the OneSignal dashboard. Use it when your team already runs its messaging on OneSignal. Needs a OneSignal account and your OneSignal App ID.  ## Set it up  1. Create an app in the [OneSignal dashboard](https://onesignal.com) and add your Apple push key and Firebase project. 2. Add **OneSignal** and paste your **OneSignal App ID**. 3. Build the app. The first launch registers the device; the permission prompt shows when your app asks for it.  ## Settings  \| Setting \| What it does \| \| --- \| --- \| \| OneSignal App ID \| Your OneSignal application ID \| \| Push enabled \| Turns OneSignal push on or off \| \| Open deeplink in browser \| Opens a tapped notification's link in Safari instead of the app \| 

**When to use it.** Add it when your team already sends push, email and text messages from OneSignal and you want devices linked to your signed-in people. If you do not use OneSignal, use the plain notifications package.

<PackageSample/>

## What you need on your side

- A OneSignal app and its **App ID** in the package settings (the App ID is public).
- Send pushes from the OneSignal dashboard or from your server with OneSignal's REST API. The REST API key is a secret: keep it on your server, never in the app.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
