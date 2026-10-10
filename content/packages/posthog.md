---
title: PostHog
description: Send your app's analytics events to PostHog.
package: Core/Growth/Modules/PostHog
section: packages
group: Analytics and attribution
icon: sparkles
order: 113
---

# PostHog

Works with the Product analytics package: it takes the events it collects and delivers them to your PostHog project. PostHog accepts events without confirming it kept them, so check its activity view when you first connect. Needs a PostHog account and your project key.

**When to use it.** Use it when you analyse your product in PostHog. It sends the events your app already records to your PostHog project; you do not call it yourself.

<PackageSample/>

## What you need on your side

- A PostHog project. `send()` takes its project token (the public key PostHog gives you for client apps).

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

<PackageReference/>
