---
title: AppTracking
description: Ask the user for tracking permission and read their answer.
package: Core/WebPlatform/AppTracking
section: packages
group: Analytics and attribution
icon: lock.shield
order: 114
---

# AppTracking

Lets your app find out whether the user allows tracking and ask for it when you choose. On iOS it shows Apple's App Tracking Transparency dialog; on Android it reports the Google Play advertising ID opt-out. The framework never asks on launch, so you decide when to call it. You write the screen that explains why you ask and the code that turns tracking or personalised ads off.

**When to use it.** Use it when your app has cross-app tracking, personalised ads or attribution that depends on user consent, and you need to show the iOS tracking dialog at the right moment. Skip it if your app does no tracking, since nothing asks on launch.

<PackageSample/>

<PackageReference/>
