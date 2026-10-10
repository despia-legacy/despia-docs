---
title: Google Play service account
description: Create the Google Cloud service account Despia uses to upload your Android app to Google Play, give it access in Play Console, and connect it once for your workspace.
---

Despia uploads your Android builds to Google Play with a service account: a Google Cloud identity with a JSON key, which you invite into your Play Console like a team member.

You need a [Google Play developer account](https://play.google.com/console) and a Google Cloud project you can manage.

::: steps

### Enable the two APIs

In the [Google Cloud console](https://console.cloud.google.com), in the project you will use, enable:

- the **Google Play Android Developer API**;
- the **Google Play Developer Reporting API**.

Despia checks both when you connect the account, and gives you the direct link to enable one that is off.

### Create the service account and its key

1. In Google Cloud, open **IAM and Admin**, then **Service Accounts**, and create a service account. Name it `despia`.
2. Open it, go to **Keys**, add a key, and choose **JSON**. A `.json` file downloads.
3. Copy the service account's email address. It ends in `.iam.gserviceaccount.com`.

### Give it access in Play Console

In [Play Console](https://play.google.com/console), open **Users and permissions** and invite the service account's email. Give it admin access to the account, or at least admin access to the app you will ship. Without release permissions it cannot upload.

### Connect it

In the [console](https://console.despia.com), open **App Stores** and add Google Play with the JSON file. From a terminal:

```sh
npx @despia-native/cli stores add play --file despia-service-account.json
npx @despia-native/cli stores add play --file despia-service-account.json --apply
```

:::

## Create the app listing first

Google Play lets you create an app's listing, with its package name, before the first upload. Do that in Play Console (**Create app**) with the same package name your Despia app uses. Despia then finds the app with your service account and can send the very first build to Play remotely. If the package name is not there yet, the console tells you and links to the page that creates it.

## What Despia checks

When you connect the account, Despia checks that the key works, that both APIs are enabled, and which apps and permissions the service account can see. Nothing is stored if a check fails.

```sh
npx @despia-native/cli stores details <connection-id>
npx @despia-native/cli stores role <connection-id> --package com.example.app
```

`role` checks the service account's release permissions on one package.

## If something is wrong

| Message | What to do |
| :-- | :-- |
| An API is not enabled | Open the link Despia gives you, enable the API, and connect again |
| The app is not found | Create the app in Play Console with the right package name, or invite the service account to it |
| Not allowed to release | Give the service account admin access to the app in Play Console |
