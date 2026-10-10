---
title: Native features from JavaScript
description: How your web app calls native features with dsx.module, reads results, handles errors, listens to events, and which pages are allowed to call.
---

Inside a Despia app, your web app calls a native feature with one line:

```js
await dsx.module.haptic.success();
```

`dsx` is defined before your scripts run, in React, Next.js, Vue, Svelte and plain JavaScript alike. There is nothing to install or import.

## The short version

| Topic | What to know |
| :-- | :-- |
| Calls | `dsx.module.<package>.<action>(args)` returns a promise. `await` it. |
| Results | A call resolves with an object; each package page lists its fields. |
| Errors | A failed call rejects with `code` and `message`. |
| Events | `dsx.on("<package>", handler)` returns a function that stops listening. |
| Feature detection | `dsx.has("<package>")` before you rely on a package some builds may lack. |
| Server rendering | Call `dsx` only in the browser: handlers and effects. See [React and Next.js](/convert/react). |
| Site also runs outside Despia | Write `window.dsx?.` there. See [Running inside Despia](/convert/detect). |
| Other domains and iframes | Calls from an untrusted origin reject with `origin_not_allowed`. Iframes get no `dsx`. |

## Calls and results

```js
const result = await dsx.module.contacts.pick({ multiple: true });
if (!result.cancelled) {
  showInvites(result.contacts);
}
```

Every action, its arguments and its result fields are on its package's page in the [catalog](/packages).

## Errors

A call that fails rejects with an error object. `code` is a stable name you can branch on; `message` is a sentence you can show.

```js
try {
  await dsx.module.identityvault.read({ key: "token" });
} catch (err) {
  if (err.code === "cancelled") return; // the person closed the prompt: a normal choice
  showMessage(err.message);
}
```

The full shape is `{ event: "error", code, message, recoverable, data }`; `data` carries details when a package has any. A call with no answer after 30 seconds rejects with the code `timeout`.

## Permissions

A package that needs a permission has `permission.status`, `permission.request` and `permission.openSettings`:

```js
const access = await dsx.module.contacts.permission.request({ level: "read" });
if (access.status === "denied" && !access.canAsk) {
  await dsx.module.contacts.permission.openSettings();
}
```

`status` is one of `undetermined`, `granted`, `limited`, `denied`, `restricted` or `unavailable`. `status` never shows a dialog, so you can call it whenever a screen appears.

## Feature detection

Your app's build includes the packages you added to it, and some packages exist only where the platform has the feature. Ask `dsx.has` before relying on one:

```js
if (dsx.has("contacts")) {
  await dsx.module.contacts.pick({ multiple: true });
} else {
  showEmailInvite();
}
```

Never decide by operating system or user agent. `dsx.has` answers for the build that is running, at once, with no round trip.

## Events

Some packages report things that happen outside a call: a notification was opened, the app came back to the foreground. Listen with `dsx.on`, and call the function it returns to stop:

```js
const stop = dsx.on("notify", (event) => {
  if (event.event === "opened") openConversation(event.data);
});

stop(); // later, when you no longer need it
```

Each event is `{ event, data }`. The events of each package are on its page.

## Which pages can call

Native calls work only from pages your app trusts. On any other page `dsx` is still there, but every call rejects at once with `origin_not_allowed`, and the message names the page's origin.

Trusted by default:

- your app's start URL, with exactly that scheme, host and port;
- the hosts bundled in your app's configuration, over HTTPS on the default port;
- the app's own local content and the schemes Despia packages serve;
- any origin you list in `bridge_origins`.

Not trusted unless you say so: `www` and other subdomains, pages you redirect to on another domain (a sign-in provider, a checkout, a preview deploy), `http://` when you configured `https://`, and iframes, which never get `dsx` whatever their origin.

Set the policy on the **Dom** package in your project's `dsx.config.json`:

```json title="dsx.config.json"
{
  "moduleConfig": {
    "dom": {
      "bridge_policy": "app",
      "bridge_origins": ["www.example.com", "*.example.com", "https://checkout.partner.com"],
      "bridge_subdomains": false
    }
  }
}
```

An entry with a scheme matches that exact origin; a bare host means HTTPS on the default port; `*.example.com` takes every subdomain. `bridge_policy` also takes `none` (no page gets the bridge) and `full` (every page does, an opt-in you should rarely need).

## TypeScript

`dsx` is a global the page receives at runtime. Declare it once in a `.d.ts` file:

```ts title="despia.d.ts"
interface DsxError {
  event: "error";
  code: string;
  message?: string;
  recoverable?: boolean;
  data?: unknown;
}

interface Dsx {
  module: any;
  has(name: string): boolean;
  on(source: string, handler: (event: { event: string; data: unknown }) => void): () => void;
}

declare const dsx: Dsx;

interface Window {
  dsx?: Dsx;
}
```

`module` stays `any` because each package adds its own actions.
