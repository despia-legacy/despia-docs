---
title: Users are logged out when they reopen the app
description: Users close the app and land on the login page again when they reopen it.
symptom: After closing and reopening the native app, signed-in users land on /auth or /login again.
platform: legacy
packages: despia-native, authentication
order: 30
---

# Users are logged out when they reopen the app

**Symptom.** A user signs in, closes the app, reopens it and lands on `/auth` or `/login` again.

**Cause.** The session is stored where the app cannot read it back at launch: cookies set for the
wrong domain (or for `localhost`, which the Despia local server does not support), storage the
system cleared, a session that is only validated server side while the app is offline, or a login
page that never checks for an existing session and redirects.

**Fix.** On the login route, read the stored session first and redirect a signed-in user into the
app; store the token where the native app keeps it across launches, and validate it before
treating the user as signed out.

<Card title="The full Despia V3 write-up: Lost Auth Tokens" href="/legacy/roadblocks/runtime/lost-auth-tokens">
Diagnosis on device, the redirect pattern for React, and storage options that survive a restart.
</Card>
