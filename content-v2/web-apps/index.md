---
title: Your web app in a Despia app
description: Put the React, Next.js, Vue, Svelte or plain JavaScript app you already have inside an iOS and Android app, then call your first native feature from its own code.
---

Despia wraps your web app in a real iOS and Android app. Your pages run in the app's web view, and your own JavaScript calls native features with one line:

```js
await dsx.module.haptic.success();
```

There is nothing to install in your web app. Despia defines `dsx` before your page's scripts run, in every framework.

::: steps

### Create the app

Open the [Despia console](https://console.despia.com), choose **New app**, and enter your web app's HTTPS address. Or, from a terminal:

```sh
npx @despia-native/cli login
npx @despia-native/cli account create --web https://your-app.com
```

`--plan` checks the address and writes nothing, if you want to look first.

### Add a package

A package is one native feature. In the app, open **Packages** and add **Haptics**. The [package index](/web-apps/packages) lists every package with its call.

### Call it from your code

Put the call where the phone should respond, for example after a save succeeds:

```js
async function save() {
  await api.save(form);
  await dsx.module.haptic.success();
}
```

Deploy your site as usual. A hosted app loads your address, so the change is live in the app at once, without a store review.

### Build and try it

Press **Build** in the console, or:

```sh
npx @despia-native/cli build ios --cloud --project <project-id> --wait
```

`<project-id>` is the id `account create` printed, also shown in the app's settings in the console. Install the build from the link it gives you and tap your button.

:::

## What to read next

::: cards
- [Calling native features](/web-apps/native-features) {curlybraces} The one form, results, errors, `dsx.has` and events.
- [Frameworks](/web-apps/frameworks) {chevron.left.forwardslash.chevron.right} React, Next.js, Vue, Svelte and plain JavaScript.
- [Hosted or bundled](/web-apps/hosted-and-bundled) {shippingbox} Load your URL, or ship your build inside the app.
- [Preview and test](/web-apps/preview) {iphone} `despia dev` in a browser, then a simulator or your phone.
:::
