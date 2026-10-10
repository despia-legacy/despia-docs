---
title: If your site also runs outside Despia
description: When the same site also runs in normal browsers, write window.dsx?. for the calls that run in both places. This is the only page where that form appears.
---

Inside the Despia app, `dsx` exists. In a normal browser it does not, and a bare `dsx.module...` throws `ReferenceError: dsx is not defined`. If your site only ever runs in the app, you can skip this page.

## Calls that run in both places

Write `window.dsx?.` for code that also runs in a browser. Outside Despia it is `undefined`, and the call is skipped:

```js
await window.dsx?.module.haptic.success();
```

Code that only runs inside the app, such as a screen you only show there, can keep the bare `dsx`.

## Showing something only in the app

Check when you need the answer, not once at load. A check at call time also holds in frameworks that render on the server:

```js
function canShare() {
  return Boolean(window.dsx?.has("share"));
}
```

## A feature, not a platform

Ask whether the build has the package, never which browser or operating system is running:

```js
if (window.dsx?.has("contacts")) {
  await window.dsx.module.contacts.pick({ multiple: true });
} else {
  showEmailInvite();
}
```

## TypeScript

Add the optional global next to the [declaration](/web-apps/typescript):

```ts title="despia.d.ts"
interface Window {
  dsx?: Dsx;
}
```

## Local development in a browser

`next dev`, `vite` and the like in a normal browser have no `dsx`, so this form also keeps local development working. To try the native calls themselves without a phone, use [`despia dev`](/web-apps/preview).
