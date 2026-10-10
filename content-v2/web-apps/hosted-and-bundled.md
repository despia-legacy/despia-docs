---
title: Hosted or bundled
description: The app either loads your site from its address, or ships your static build inside the app and serves it from a local origin. When to use which, and how your dev server fits in.
---

A Despia app shows your web app in one of two ways. The Dom package's `web_source` setting chooses:

| | Hosted (`remote`, the default) | Bundled (`bundled`) |
| :-- | :-- | :-- |
| The app loads | your HTTPS address | files inside the app |
| A change goes live | when you deploy | with the next app build |
| Works offline | what your site caches | yes |
| Server code, API routes | yes | no, static files only |
| Page origin | your domain | a local app origin (see below) |

## Hosted: the app loads your address

This is what **New app** in the console sets up. Your site keeps its hosting and its deploys; the app always opens the current version. Use it for server-rendered apps (Next.js with a server, Remix, SvelteKit with a server), for apps that change daily, and whenever you are not sure.

## Bundled: the app ships your build

::: note Available in the next build
Bundled mode and the debug-build dev server described below ship with the next Despia build. Today the app loads your hosted address.
:::

Export your app as static files, put them in a project folder, and set the Dom package to bundled:

```json title="dsx.config.json"
{
  "moduleConfig": {
    "dom": {
      "web_source": "bundled",
      "web_bundle_path": "Assets/Web/",
      "web_spa_fallback": true
    }
  }
}
```

The folder needs an `index.html` at its top. It is the output of your framework's static build: `dist/` for Vite (React, Vue, Svelte), `out/` for Next.js with `output: "export"`, `build/` for SvelteKit with the static adapter. Copy that output into `web_bundle_path`.

What the build checks, by name: the folder must stay inside the project and contain no symbolic links, at most 20,000 files and 256 MB, and no control characters or backslashes in names. Files whose names start with a dot are left out. Folders starting with an underscore, such as Next.js's `_next`, are kept.

`web_spa_fallback` (on by default) answers `index.html` for an unknown path without a file extension, so your client router handles deep links. A missing path with an extension, such as a missing `.js` file, is a 404, so a broken asset fails loudly.

Things to know about the bundled origins:

- Your API sees requests from `app://localhost` (iOS) or `https://appassets.androidplatform.net` (Android). Allow both in your server's CORS settings.
- On iOS there are no service workers in bundled mode, and cookies last for the session only. Keep tokens in [secure storage](/packages/identityvault), not cookies.
- The bundled site is an app origin, so it can call `dsx` with no extra setting.

## Your dev server in a debug build

A release build never loads `http://localhost`: on a phone, localhost is the phone, not your computer. The app shows the reason on screen instead of a blank page.

A debug build (from `despia run`) may load a dev server on your machine, such as Vite's `http://localhost:5173`. On the iOS simulator, localhost is your Mac. On Android, forward the port first:

```sh
adb reverse tcp:5173 tcp:5173
```

Loading a page does not give it the bridge. Native calls answer only when the dev server is the app's origin or is listed in `bridge_origins`. To try your dev server on a real phone, use an HTTPS tunnel to it as the app's address. See [Preview and test](/web-apps/preview).
