---
title: AppSettings
description: Open your app's page in the system Settings.
package: Core/Basics/AppSettings
section: packages
group: Device and system
icon: hammer
order: 122
---

# AppSettings

Sends the user to this app's page in the Settings app, or to a deeper page such as notifications, so they can switch back on a permission they denied earlier. The phone will not show the system prompt a second time, so this is the way back. It does not wait for the user to return. You write the button and the explanation around it.

**When to use it.** Use it from a button the user taps after a permission was denied, such as notifications or location. Do not call it automatically, and note that it cannot change a setting for the user.

<PackageSample/>

<PackageReference/>
