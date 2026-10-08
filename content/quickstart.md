---
title: Quickstart
description: From an empty folder to a running Despia app, then on your phone, in five minutes.
order: 1
section:
---

# Quickstart

You need Node.js 22 or later. Nothing else: no Xcode or Android Studio for this part.

<Steps>
<Step title="Create the app">
```sh title="Terminal"
npm create despia@latest my-app
cd my-app
npm install
```

You get a complete project:

| Path | What it is |
|---|---|
| `dsx.json` | The app's identity: its name and `command`, which namespaces every component |
| `dsx.config.json` | Configuration: the first screen, routes, output folder |
| `Components/App.dsx` | Your first screen |
</Step>
<Step title="Run it">
```sh title="Terminal"
npx despia dev
```

Open the address it prints. `despia dev` builds, serves, and reloads on every save.
</Step>
<Step title="Make your first edit">
A DSX document is a head (its data and logic) and a body (pure markup). Replace
`Components/App.dsx` with this, save, and the page updates.
</Step>
</Steps>

This one runs right here: tap the button.

```xml live
<stack style="gap: 1rem; padding: 2rem; align-items: center">
  <head>
    <variable as="count">return 0</variable>
    <action as="bump">
      dsx.variable.count = dsx.variable.count + 1;
    </action>
  </head>
  <text value="Tapped {{ dsx.variable.count }} times"/>
  <button label="Tap me" on:tap="dsx.action.bump()"/>
</stack>
```

The same document draws as a SwiftUI screen on iPhone and a Material 3 screen on Android. Native UI
rendering is in early alpha: experiment with it freely, and ship production apps on the web view and
DSX DOM, which are stable in 0.1.0. Native UI becomes stable in 1.0.0.

## Ship it

| Goal | Command |
|---|---|
| Deploy the web app to your own host | `npx despia build`, then upload `dist/` |
| Change screens over the air | `npx despia ota build` ([self-hosted OTA](/framework/guides/combinations/c7-self-hosted-ota)) |
| Build the iOS and Android apps | Create the app in the Despia console and press **Build** |

## Next

- [A web app with native screens](/guides/web-app-with-native-screens): keep your web app, add native screens.
- [Using a Despia service on its own](/services/on-its-own): push, payments, chat and sync.
- [Use these docs with your agent](/agents): MCP, llms.txt and a markdown twin of every page.
