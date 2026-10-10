---
title: AppsFlyer
description: Attribute installs and purchases to ad campaigns with AppsFlyer.
package: Core/AppsFlyer
section: packages
group: Analytics and attribution
icon: sparkles
order: 112
---

# AppsFlyer

Starts the AppsFlyer SDK at launch, logs in-app events and ad revenue, reports where an install came from and resolves OneLink deep links into your app. Does nothing until a dev key is set. Needs an AppsFlyer account, your dev key and, on iOS, your Apple app ID.

**When to use it.** Use it when you buy ads and need to know which campaign produced an install or a purchase. It does nothing until you set your AppsFlyer dev key.

<PackageSample/>

## What you need on your side

- An AppsFlyer account: the **dev key** and your **Apple app id** in the package settings.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
