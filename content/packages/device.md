---
title: Device
description: Read the device, the app's own identity, the screen, locale, battery and display capabilities.
package: Core/Device
section: packages
group: Device and system
icon: iphone
order: 116
---

# Device

Gives you plain answers about the phone or tablet the app runs on: hardware and OS, the app's version and first-launch state, screen size with real safe-area insets, language and region, battery and thermal state, and which hardware features exist. It needs no permission and never polls. You decide how your screens adapt to the answers.

**When to use it.** Reach for it when a screen must adapt to the device: safe-area padding, a first-launch welcome, a what's-new sheet, lighter effects on old or hot hardware, or locale-aware formatting. It does not tell you whether the user granted a permission; use the package that owns that feature.

<PackageSample/>

<PackageReference/>
