---
title: Deploying
description: From a build to TestFlight, Google Play testing and the stores.
icon: paperplane
order: 12
section:
---

# Deploying

Your web app ships the usual way: deploy it to your own host and the app shows the new version on its next launch.
The app itself ships through the stores, in three steps.

<Steps>
<Step title="Connect your store accounts">
In the console, open **App Stores** and add App Store Connect (an API key) and Google Play (a service account).
You do this once per workspace.
</Step>
<Step title="Build">
Press **Build** in your app, or run `despia build ios --cloud` and `despia build android --cloud`.
</Step>
<Step title="Send to testers, then submit">
Invite testers from the build, or with `despia testers add`. When you are happy, submit the build for review from
the app's **Submissions** page.
</Step>
</Steps>

## The store listing

Edit your app's name, description, keywords and screenshots as files, then upload them:

```sh title="Terminal"
despia listing pull --project <project-id>
despia listing check
despia listing push --project <project-id> --apply
```

`listing check` tells you what the stores would refuse (lengths, screenshot sizes) before you upload.
