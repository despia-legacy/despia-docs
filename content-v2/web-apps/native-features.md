---
title: Calling native features
description: The one form every native call takes, what it returns, how it fails, how to check that a build has a package, and how to listen to events.
---

Every native feature is called the same way, from any framework:

```js
const result = await dsx.module.contacts.pick({ multiple: true });
```

The form is always `await dsx.module.<package>.<action>(args)`: the call returns a promise. Each package's page lists its actions, their arguments and their result fields: start from the [package index](/web-apps/packages).

## The one form

| Part | Meaning |
| :-- | :-- |
| `dsx` | Defined by the app before your scripts run. Nothing to import. |
| `module` | The packages this app was built with. |
| `contacts` | The package, by its command name. |
| `pick` | The action. |
| `{ multiple: true }` | Its arguments, one plain object. Leave it out when the action takes none. |

Always `await` the call, or chain `.then`. A call you do not await still runs; you just cannot read its result or catch its error.

## Results

A call resolves with an object. Read the fields its package page lists:

```js
const result = await dsx.module.contacts.pick({ multiple: true });
if (!result.cancelled) {
  showInvites(result.contacts);
}
```

## Errors

A call that fails rejects. `code` is a stable name to branch on, `message` is a sentence you can show:

```js
try {
  await dsx.module.identityvault.read({ key: "token" });
} catch (err) {
  if (err.code === "cancelled") return; // the person closed the prompt
  showMessage(err.message);
}
```

The full shape is `{ event: "error", code, message, recoverable, data }`. A call with no answer after 30 seconds rejects with the code `timeout`.

## Is the package in this build?

An app contains the packages you added to it, and some packages exist only where the platform has the feature. Ask `dsx.has` before relying on one:

```js
if (dsx.has("contacts")) {
  await dsx.module.contacts.pick({ multiple: true });
} else {
  showEmailInvite();
}
```

`dsx.has` answers at once, with no round trip, for the build that is running. Never decide by operating system or user agent. `dsx.packages` lists everything the build carries.

## Permissions

A package that needs a permission has `permission.status`, `permission.request` and `permission.openSettings`:

```js
const access = await dsx.module.contacts.permission.request({ level: "read" });
if (access.status === "denied" && !access.canAsk) {
  await dsx.module.contacts.permission.openSettings();
}
```

`status` never shows a dialog, so you can call it whenever a screen appears.

## Events

Some packages report things that happen outside a call, such as a notification being opened. Listen with `dsx.on`, and call the function it returns to stop:

```js
const stop = dsx.on("notify", (event) => {
  if (event.event === "opened") openConversation(event.data);
});

stop(); // when you no longer need it
```

Each event is `{ event, data }`. A package page lists its events.

## Which pages can call

Only pages your app trusts get answers. Elsewhere `dsx` is still defined, but every call rejects at once with `origin_not_allowed`, and the message names the page's origin.

Trusted: your app's start address (exact scheme, host and port), the app's own bundled site, and any origin you add to the Dom package's `bridge_origins`. Not trusted unless you add them: `www` and other subdomains, other domains you navigate to (a sign-in provider, a checkout, a preview deploy), and `http://` when your app uses `https://`. Iframes never get `dsx`, whatever their origin.

```json title="dsx.config.json"
{
  "moduleConfig": {
    "dom": {
      "bridge_origins": ["www.example.com", "https://checkout.partner.com"],
      "bridge_subdomains": false
    }
  }
}
```

A bare host means HTTPS on the default port; an entry with a scheme matches that exact origin.
