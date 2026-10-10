---
title: Quickstart
description: Put your web app in an iOS and Android app, call a native feature, and build.
icon: bolt
order: 1
section:
---

# Quickstart

You need a web app with a public HTTPS address, and a Despia account. You do not need Xcode or Android Studio.

<Steps>
<Step title="Create the app">
Open the [Despia console](https://console.despia.com), choose **New app**, and enter your web app's address.
The console makes the iOS and Android app around it.
</Step>
<Step title="Add a package">
In the app, open **Packages** and add **Haptics**. Packages are the native features your app can call.
</Step>
<Step title="Call it from your web app">
Add one line where you want the phone to respond, for example after a save:

```js
await dsx.module.haptic.success()
```

Deploy your web app as usual. The app loads it from your address, so the change is live at once.
</Step>
<Step title="Build and try it">
Press **Build** in the console. Install the build on your phone from the link it gives you, tap your button, and
feel the haptic.
</Step>
</Steps>

## Prefer the terminal

The same steps with the CLI:

```sh title="Terminal"
npx @despia-native/cli login
npx @despia-native/cli add haptic
npx @despia-native/cli build ios --cloud
```

See [CLI](/cli) for every command.

## Start a new app instead

No web app yet? Create one with Despia's own framework:

```sh title="Terminal"
npm create @despia-native@latest my-app
cd my-app
npm install
npx @despia-native/cli dev
```

Open the address it prints. The page reloads on every save.

## Next

- [Web apps](/web-apps): native calls in React, Next.js and plain JavaScript.
- [Packages](/packages): every native feature, with an example each.
