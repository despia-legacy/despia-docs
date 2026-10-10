---
title: Firebase
description: Send push notifications to your app's users through Firebase Cloud Messaging.
package: Core/Firebase
section: packages
group: Notifications
icon: bolt
order: 111
---

# Firebase

Sets up your app's Firebase identity and registers each device with Firebase Cloud Messaging, so you can send pushes from the Firebase console or your server. Use it when your team already runs on Firebase. Needs a Firebase project; on Android it asks for the Firebase App ID, API key, project ID and sender ID, and on iOS your GoogleService-Info.plist.

**When to use it.** Use it when your team sends push notifications through Firebase Cloud Messaging. If you use another push provider such as OneSignal, you do not need it.

<PackageSample/>

## What you need on your side

- A Firebase project with your Android app, and its app id, API key, project id and sender id in the package settings.
- Send pushes from your server through Firebase Cloud Messaging with a service account that stays on your server.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
