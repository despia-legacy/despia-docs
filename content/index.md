---
title: Despia docs
label: Introduction
description: Turn your web app into an iOS and Android app with native features. Start here.
icon: house
order: 0
section:
---

# Despia docs

Despia puts your web app in a real iOS and Android app, and gives it native features from JavaScript:
sign in with Apple, payments, push notifications, haptics, the camera and more.

```js
await dsx.module.haptic.success()
```

That one line runs native code on the phone. There is nothing to install in your web app.

<CardGroup cols="2">
<Card title="Quickstart" href="/quickstart">
Your web app on a phone in a few minutes.
</Card>
<Card title="Web apps" href="/web-apps">
How native calls work in React, Next.js and plain JavaScript.
</Card>
<Card title="Packages" href="/packages">
Every native feature you can add, with one example each.
</Card>
<Card title="Move from Despia V3" href="/migrate">
Bring a V3 app over. Your V3 calls keep working.
</Card>
</CardGroup>

## What ships in 0.0.2

| Part | Status |
| :-- | :-- |
| Your web app in the app's web view | Ready |
| Native features from JavaScript (`dsx.module`) | Ready, per package (see [Packages](/packages)) |
| CLI, console and MCP | Ready |
| Despia V3 compatibility | Ready |
| Native screens drawn from DSX | [Coming soon](/native-ui) |
