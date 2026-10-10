---
title: Notify
description: Receive and show push and local notifications in your app without a third-party push SDK.
package: Core/Notify
section: packages
group: Notifications
icon: bell
order: 108
---

# Notify

Handles the notification permission, the device token, Android channels, action buttons, badges, images, scheduled notifications and what happens when a user taps one. Use it when you want notifications built in rather than through OneSignal, Pushwoosh or Firebase. You send pushes from your own server with your own Apple push key.

**When to use it.** Reach for it when your app needs to remind, alert or message people outside the app, from your own server or from the device itself. If you already use a push vendor, keep it and use this package only for the local side.

<PackageSample/>

## What you need on your side

- Local notifications need nothing else.
- For remote pushes without a push service, your server sends them to Apple (APNs) and Google (FCM) with the token from the `notify.token` broadcast. Or use [OneSignal](/packages/onesignal), [Pushwoosh](/packages/pushwoosh) or [Firebase](/packages/firebase).

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
