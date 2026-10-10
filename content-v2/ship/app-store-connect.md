---
title: App Store Connect key
description: Create the App Store Connect API key Despia uses to sign your iOS app and upload it to TestFlight and the App Store, and connect it once for your workspace.
---

Despia signs and uploads your iOS builds with an App Store Connect API key from your own Apple developer account. You create it once and connect it to your workspace; every app in the workspace can use it.

You need an [Apple Developer Program](https://developer.apple.com/programs/) membership, and the Account Holder or an Admin of that account to create the key.

::: steps

### Create the key

1. Open [App Store Connect](https://appstoreconnect.apple.com), then **Users and Access**, then **Integrations**, then **App Store Connect API**.
2. Under **Team Keys**, add a key. Give it a name you will recognise, such as `Despia`.
3. Choose the **App Manager** role.
4. Download the key. Its file name starts with `AuthKey_` and ends with the Key ID. Apple lets you download it only once, so keep it somewhere safe.

### Note the two ids

On the same page:

- the **Key ID**: ten characters, shown next to the key and in its file name;
- the **Issuer ID**: shown above the list of keys.

### Connect it

In the [console](https://console.despia.com), open **App Stores** and add App Store Connect: choose the `.p8` file and enter the Key ID and the Issuer ID. From a terminal:

```sh
npx @despia-native/cli stores add asc --file ./AuthKey.p8 --issuer-id <issuer-id> --key-id <key-id>
npx @despia-native/cli stores add asc --file ./AuthKey.p8 --issuer-id <issuer-id> --key-id <key-id> --apply
```

The first command checks everything and shows what it would do; `--apply` connects the key. `stores link asc` prints a short-lived link to upload the file in the console instead.

:::

## What Despia checks

Before it saves the key, Despia tests it with Apple and checks its role. Nothing is stored if the test fails, and the console shows the steps to fix it. The key is stored encrypted and never shown again.

```sh
npx @despia-native/cli stores list
npx @despia-native/cli stores test <connection-id>
npx @despia-native/cli stores role <connection-id>
```

## Why App Manager

Despia uses the key to register your app's bundle ID and its capabilities, manage signing, upload builds, manage TestFlight testers and submit for review. The App Manager role covers all of that for your apps. A key with a narrower role makes builds fail later, at signing or upload, so Despia checks the role when you connect it.

## If something is wrong

| Message | What to do |
| :-- | :-- |
| The key was rejected | Check the Key ID and Issuer ID match the file, and that the key was not revoked |
| The role is not enough | Create a new key with the App Manager role and connect that one |
| The key file cannot be read | Upload the original `.p8` file, unchanged |

Revoking the key in App Store Connect stops Despia's builds for every app that uses it. To replace a key, connect the new one first, then remove the old connection with `stores remove`.
