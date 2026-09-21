---
title: Despia documentation
description: One set of DSX documents, rendered as native iOS, native Android, an installable PWA and a server-rendered site.
order: 0
section:
---

# Despia documentation

Write DSX documents once and ship them four ways: a native iOS app, a native Android app, an installable PWA, and a server-rendered site.

Despia is a web-optional native runtime. None of the four targets is a port: the semantics are pinned by shared conformance corpora, and the same markup that renders this page renders a `UIStackView` on iOS and a Compose column on Android.

What that is proven to mean is written down rather than implied. Runtime behavior is held to 857 conformance assertions on the TypeScript kernel and 2,775 tests on the Kotlin kernel, on every pull request. The web renderer is verified against its own committed reference render, which every skin change re-records so the diff is the review. Native rendering is held to a budgeted near-pixel contract with a published gap ledger, because an app should look like the platform it runs on. [Platform support](/framework/guides/platform-support) is the full picture: what is measured, what is budgeted, what is still verified by review, and every element the web renderer does not implement.

```sh
npm create despia@latest my-app
cd my-app
npm install
npx despia dev
```

## Where to start

- **[Quickstart](/quickstart)** takes you from an empty directory to a running app.
- **[The design system](/system)** is a living page: every element the grammar ships, rendered by the same runtime this site documents.
- **[The combination matrix](/framework/guides/combinations)** shows every supported way of pairing Despia with what you already have: a web app you keep, a backend you keep, a vendor's API, or nothing yet.
- **[Writing a backend](/framework/skills/writing-a-backend)** is the whole server story: routes, workers, MCP tools, one deploy command.
- **[Platform support](/framework/guides/platform-support)** is the honest map of what runs where, and what the cross-platform claim is measured to mean.

## This site is the proof

These pages are themselves a DSX application: markdown compiled to DSX documents, server-rendered on Cloudflare Workers by `@despia-native/server`, searched client-side from a build-time index, and served to agents over the site's own MCP face at `/mcp`. Every page serves its raw markdown under `/md`, and the whole site is summarized at [/llms.txt](/llms.txt).
