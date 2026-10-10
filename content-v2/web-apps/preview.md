---
title: Preview and test
description: Try your native calls in a browser with despia dev, where the browser answers what it can and simulates the rest, then run the real app on a simulator or your phone.
---

You can try your page's `dsx` calls before you build anything, without changing your code.

## The project

`despia dev` and `despia run` work on your app's Despia project. For a web app it is small: the app's screen is one web view showing your site, and the config lists the packages.

```dsx title="Components/App.dsx"
<DSXWebView
  origin="https://your-app.com"
  path="/"
  style="width: 100%; height: 100%"/>
```

```json title="dsx.config.json"
{
  "name": "My App",
  "entry": "App",
  "modules": ["dom", "haptic", "share", "clipboard"]
}
```

To work against your local dev server instead, point `origin` at it, for example `http://localhost:5173`.

## In a browser: despia dev

::: note Available in the next build
The web-view preview proxy and the simulated answers below ship with the next Despia CLI.
:::

```sh
npx @despia-native/cli dev
```

For every web-view address the project names (the Dom `host`, `webview_url` and `bridge_origins`, and each literal `origin="..."` in your markup), `dev` starts a local proxy and loads the web view through it. The proxy serves your page unchanged except for one script first in `<head>`: the same runtime a phone injects, with `dsx.packages` listing this project's packages, so `dsx.has("share")` answers as it would on the phone. Vite's hot reload keeps working through it. The terminal prints one line per proxied address.

What answers a call:

- A package the browser can run, runs for real: `haptic` vibrates where the browser can, `clipboard` uses the browser clipboard, `share` opens the browser's share sheet.
- A package the browser cannot run (Sign in with Apple, biometrics, the keychain) answers with a **simulated** result: `data.simulated` is `true`, `data.note` says why, the console warns, and an orange "Simulated in preview" note shows over the preview.

An address the project does not name loads as itself, without the bridge. Production builds carry none of this.

## On a simulator or your phone

```sh
npx @despia-native/cli device doctor
npx @despia-native/cli run --target ios
```

`device doctor` checks your Xcode and Android tools. `run` builds a debug app for a simulator or emulator, installs it, launches it and streams its log; `--target android` does the same for Android. Every call now answers for real.

For your own phone without local tools, build on Despia Cloud and install from the link:

```sh
npx @despia-native/cli build ios --cloud --project <project-id> --wait
```

## Checklist before you ship

- Every call is inside a handler or an effect, never in server code.
- Every package you call is in the app, or the call sits behind `dsx.has`.
- `cancelled` is handled as a normal choice, not an error.
- If the site also runs in normal browsers, read [If your site also runs outside Despia](/web-apps/outside-despia).
