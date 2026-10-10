---
title: Native features
description: Add a package, then call it from any action as dsx.module.<package>.<action>(). Results, errors, permissions and events work the same for every package.
---

Native features come from packages: maintained native code for iOS and Android, with one JavaScript API on top. You add a package to your project once, then call it from any document.

## Add a package

```sh
npx despia search camera
npx despia add contacts
```

`add` pins the package in `dsx.lock.json` and lists it under `"modules"` in `dsx.config.json`. Calling a package you have not added is a `despia lint` error, and the message gives you the `add` command to run.

Every package and its actions are in the [package catalog](/packages). `npx despia docs show <package>` prints the same page in your terminal.

## Call it

Every action is `dsx.module.<package>.<action>(args)`. It returns a promise, so you `await` it inside an action:

```dsx title="Components/ShareListing.dsx"
<stack style="padding: 20px">
  <head>
    <action as="share">
      await dsx.module.share.url({ url: 'https://example.com/listings/cozy-loft', message: 'Check out this listing' });
    </action>
  </head>
  <button label="Share" icon="square.and.arrow.up" on:tap="dsx.action.share()"/>
</stack>
```

The same call works from a converted web app. That is the point: one API, whether the app is DSX or a web app in a native shell.

## Results

An action resolves with a result object. Its fields are listed on each package page:

```dsx title="Components/Saved.dsx"
<stack style="gap: 12px; padding: 20px">
  <head>
    <variable as="theme">return 'light'</variable>
    <action as="load">
      const result = await dsx.module.storage.get({ key: 'theme' });
      if (result.found) {
        dsx.variable.theme = result.value;
      }
    </action>
    <action as="save">
      await dsx.module.storage.set({ key: 'theme', value: 'dark' });
      dsx.variable.theme = 'dark';
    </action>
  </head>
  <text value="Theme: {{ dsx.variable.theme }}" on:appear="dsx.action.load()"/>
  <button label="Use dark" on:tap="dsx.action.save()"/>
</stack>
```

## Errors

A call that fails rejects. The error carries `code`, a stable name you can branch on, and `message`, a sentence you can show. Each package page lists its codes.

```dsx fragment
<action as="unlock">
  try {
    await dsx.module.identityvault.read({ key: 'token' });
  } catch (err) {
    if (err.code === 'cancelled') { return; }
    dsx.variable.error = err.message;
  }
</action>
```

A cancelled sheet or dialog is a normal choice, not a failure: check for it and return quietly.

## Permissions

A package that needs a permission has the same three actions under `permission`: `status` reads the current state without showing anything, `request` shows the system dialog when it still can, and `openSettings` opens your app's page in Settings when only the user can change it.

```dsx title="Components/Invite.dsx"
<stack style="gap: 12px; padding: 20px">
  <head>
    <variable as="state">return ''</variable>
    <action as="pick">
      const access = await dsx.module.contacts.permission.request({ level: 'read' });
      dsx.variable.state = access.status;
      if (access.status === 'granted' || access.status === 'limited') {
        await dsx.module.contacts.pick({ multiple: true });
      }
    </action>
    <action as="settings">
      await dsx.module.contacts.permission.openSettings();
    </action>
  </head>
  <button label="Invite friends" on:tap="dsx.action.pick()"/>
  <button label="Open Settings" visible-if="dsx.variable.state === 'denied'" on:tap="dsx.action.settings()"/>
</stack>
```

`status` is one of `undetermined`, `granted`, `limited`, `denied`, `restricted` or `unavailable`, and `canAsk` tells you whether the system dialog can still appear. The permission texts the stores require come from the package, so you do not edit `Info.plist` or the Android manifest by hand.

## Platforms

Each package page lists the platforms it runs on. When a package runs on fewer platforms than your app, guard the call or the control that starts it. The catalog marks each package as available today or coming soon, and alpha packages are marked as alpha.

## Your own native code

A package is a folder: a `dsx.json` manifest, `swift/` and `kotlin/` folders, and components. Put your own in `Modules/<Name>/` in your project, and `npx despia package new` scaffolds one that already passes `npx despia package check`.
