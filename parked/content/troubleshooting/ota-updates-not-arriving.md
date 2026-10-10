---
title: OTA updates never reach the app
description: Changes deployed to production do not appear in the native app, even after force-closing it.
symptom: Production deploys show in the browser but the installed app keeps loading the old version (a watermark that survives a licence upgrade is the same symptom).
platform: legacy
packages: despia-native, service worker
order: 10
---

# OTA updates never reach the app

**Symptom.** Production deploys show up in a browser, but the installed Despia app keeps loading
the old version after closing and reopening. Some devices update and others do not. A watermark
that is still visible after moving to a commercial licence is the same symptom.

**Cause.** A service worker or PWA build plugin (`vite-plugin-pwa`, `next-pwa`,
`@angular/service-worker`, `workbox-webpack-plugin`, `@vue/cli-plugin-pwa`) caches the app and
answers every request from that cache, so the native container never fetches the new build.

**Fix.** Remove the PWA plugin and unregister the service worker (or configure it to never cache
the app shell), then rebuild and reinstall the app once.

<Card title="The full v3 write-up: No OTA Updates" href="/legacy/roadblocks/runtime/no-ota-updates">
Every framework's removal steps, the unregister snippet and how to verify the fix.
</Card>
