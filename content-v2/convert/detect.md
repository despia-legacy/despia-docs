---
title: Running inside Despia
description: Keep one site working inside the app and in a normal browser, and detect the features a build has.
---

Most converted web apps also run as a normal website. Inside the Despia app, `dsx` exists. In a browser, it does not, and a bare `dsx.module...` throws `ReferenceError: dsx is not defined`.

## Calls that also run in a browser

Write `window.dsx?.` for code that runs in both places. Outside Despia it is `undefined`, and the call is skipped:

```js
window.dsx?.module.haptic.success();
```

Code that only runs inside the app, such as a screen you only show there, can keep the bare `dsx`.

## Showing something only in the app

Check at the moment you need it, not once when the page loads. The answer is the same, and a check at call time also covers code that moves between pages and frameworks that render on the server.

```js
function shareButtonVisible() {
  return Boolean(window.dsx?.has("share"));
}
```

## Detecting a feature, not a platform

Ask whether the build has the package, never which operating system the person uses:

```js
if (window.dsx?.has("contacts")) {
  await window.dsx.module.contacts.pick({ multiple: true });
} else {
  showEmailInvite();
}
```

`has` answers for the build that is actually running, so it stays right when you add or remove a package later. User agent checks drift; `has` does not.

## A web view inside your app

When a Despia app shows a web view that hosts another web app, each page gets its own `dsx`, connected to the same app, and the same rules about [which pages can call](/convert/native-features) apply.
