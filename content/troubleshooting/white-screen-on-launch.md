---
title: White screen on launch, no splash screen
description: The app opens to a blank white screen and the splash logo never appears.
symptom: On a fresh install the app shows a white screen immediately; the splash screen GIF never displays.
platform: legacy
packages: splash screen
order: 20
---

# White screen on launch, no splash screen

**Symptom.** On a fresh install the app shows a white screen immediately and the splash screen
logo never appears, which looks like a crash.

**Cause.** Almost always a splash GIF the iOS GIF decoder rejects: a missing global colour table,
zero or missing frame delays, an undefined logical screen size or corrupted frames. The decoder
fails silently, so the result is a white screen rather than an error.

**Fix.** Re-export the GIF with correct metadata (Canva's GIF export, or Photoshop's Save for Web)
with a transparent background, upload it again and rebuild. If the splash shows but the app is
still white, check the app URL is `https://` with a valid certificate.

<Card title="The full v3 write-up: Empty Pages" href="/legacy/roadblocks/runtime/empty-pages">
The GIF requirements table, URL and certificate checks, and the local server manifest checks.
</Card>
