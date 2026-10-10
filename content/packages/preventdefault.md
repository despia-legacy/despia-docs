---
title: PreventDefault
description: Stop iOS from scrolling the page when the keyboard opens.
package: Core/Basics/PreventDefault
section: packages
group: Device and system
icon: iphone
order: 125
---

# PreventDefault

Turns off the built-in iOS keyboard autoscroll on the main web view, and can hand it back. Use it when your page manages its own message composer or sticky bar and the system scroll fights it. One call is enough, and the setting lasts for the session. You write the layout that reacts to the keyboard.

**When to use it.** Use it when your web page has a composer or sticky bar and iOS pushes the page around when the keyboard opens. Leave it alone if the default keyboard scrolling already works for your screens.

<PackageSample/>

<PackageReference/>
