---
title: iOS, Android and web
description: One document runs on three platforms. What each one renders today, how a screen adapts to the window, and what is measured rather than claimed.
---

A `.dsx` document is executed by three kernels: Swift on iOS, Kotlin on Android and TypeScript on the web. They share the same conformance tests, so a document computes, routes and fails the same way everywhere.

## What runs where today

| | Status in Despia V4 0.0.2 |
| :-- | :-- |
| Web (DSX DOM) | Production |
| iOS and Android app, drawn by DSX DOM | Production |
| Native features through packages | Per package: see the [catalog](/packages) |
| macOS desktop | Production |
| Drawing with SwiftUI and Jetpack Compose (DSX View) | Alpha, production with DSX 1.0.0 |
| Windows and Linux desktop | Preview |

The same documents work in every row. When DSX View reaches production, your app's screens move to SwiftUI and Compose without a rewrite.

## The look follows the platform

An unstyled control takes the look of the platform it runs on. A Despia app is meant to look like an iPhone app on an iPhone and an Android app on Android, so the target for native rendering is close agreement in layout and type, not pixel identity with the web. Colours that the platform owns, such as the system background, come from the platform.

Your CSS still wins. When you style an element, every platform draws your declarations.

## One screen, every window size

DSX adapts by size class, the way the platforms do: a compact width (a phone), and a regular width (an iPad, a Mac, a desktop window). The same rule applies on every platform:

- A sheet rises from the bottom on a phone and is presented centred on an iPad, a Mac or a wide browser window.
- A `<scaffold>` shows a sidebar beside the content on a wide window and collapses to a single column on a phone.
- Back buttons become breadcrumbs on the web in a wide window.

```dsx title="Components/Shell.dsx"
<scaffold shell="automatic" sidebarLabel="Library" contentLabel="Album">
  <stack pane="sidebar" style="padding: 16px; gap: 8px">
    <text value="Albums"/>
  </stack>
  <stack pane="content" style="padding: 20px">
    <text value="Pick an album"/>
  </stack>
</scaffold>
```

For your own layouts, use CSS media queries on width in your sheets, or a container that measures itself.

## Safe areas and edge to edge

Apps draw edge to edge on both phones. Keep content clear of the notch, the home indicator and the Android navigation bar with CSS padding and the inset variables, not with attributes.

## Testing on devices

`npx despia run --target ios` and `npx despia run --target android` build for a simulator or emulator on your machine, install the app and stream its log. `npx despia device doctor` checks your Xcode and Android tools first.

```sh
npx despia device doctor
npx despia run --target ios
npx despia logs --target ios
```

Cloud builds for the stores do not need Xcode or Android Studio at all. See [Build and ship](/ship).
