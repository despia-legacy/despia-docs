---
title: Moving from Despia V3
description: Bring a Despia V3 app to Despia V4. The move is free, your V3 calls can keep working, and you replace them one at a time.
---

Despia V3 apps call native features through `despia("scheme://...")` from the `despia-native` package. Despia V4 calls them as `dsx.module.<package>.<action>()`. You do not have to change everything at once.

## Ask for the move

The move of a V3 app to Despia V4 is free. Ask for it in the console, or from a terminal:

```sh
npx @despia-native/cli login
npx @despia-native/cli v3 list
npx @despia-native/cli v3 request
npx @despia-native/cli v3 status
```

`v3 list` shows the V3 apps matched to your confirmed email. `v3 request` asks for the move of every V3 app you own or administer; support approves it within 48 hours. Once approved, `v3 convert` moves one app into a Despia V4 workspace and shows the package plan first.

## Keep the old calls working

The [V3 compatibility package](/packages/legacy) keeps the old `window.despia` calls working after the move, so the app behaves as before on day one. Then move one call at a time.

## Move a call

Each V3 scheme has a Despia V4 package and action. For example, a haptic:

::: code-group
```js title="Despia V3"
despia("successhaptic://");
```
```js title="Despia V4"
await dsx.module.haptic.success();
```
:::

The [migration map](/migrate/map) lists every V3 feature and the Despia V4 package and action it moves to, with the gaps marked. The hosted MCP server's `legacy_lookup` tool answers the same question for your agent.

## What changes for you

- **Every call returns a promise** that resolves with a result object, listed on the package's page.
- **Errors are explicit.** A failed call rejects with `code` and `message` you can branch on and show.
- **Packages are chosen per app.** Your build includes the packages you add, and `dsx.has()` tells your code which ones are there.
- **One API for both routes.** The same calls work if you later move screens to DSX.

## Next

::: cards
- [Native features from JavaScript](/convert/native-features) {shippingbox} The full calling model.
- [Packages](/packages) {book} Every package and its actions.
:::
