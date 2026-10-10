---
title: Spinner
description: Show or hide the page-load activity indicator.
package: Core/Basics/Spinner
section: packages
group: Device and system
icon: bolt
order: 123
---

# Spinner

Puts a centered activity indicator over the web surface and lets you show or hide it from your code. It only draws the spinner and does not decide when to spin: the app shell keeps the loading rules for splash and first load. It follows the live web view across page loads. You decide when to call show and hide.

**When to use it.** Use it when you want to show a loading spinner over the web surface yourself, for example during your own long task. You do not need it for normal page loads, which the app shell handles.

<PackageSample/>

<PackageReference/>
