---
title: Migrating from v3
description: Move a Despia v3 app (despia-native, URL-scheme calls) to Despia v4 and DSX, one page at a time.
route: /migrate
space: migrate
section: Migrate
label: Overview
order: 1
---

# Migrating from v3

Despia v3 apps call the native runtime through `despia('scheme://...')` from the `despia-native`
package. Despia v4 is DSX: your app's documents render as native iOS, native Android and the web,
and native features are packages called as `dsx.module.<package>.<action>()`.

You do not have to move everything at once. The optional `Core/Legacy` package keeps the old
`despia()` calls working while you move one page, then the next.

<CardGroup cols="2">
<Card title="Step-by-step guide" href="/migrate/guide">
Convert the bundle, read the report, pin the packages and move off the old API page by page.
</Card>
<Card title="Feature map" href="/migrate/map">
Every v3 feature and the v4 package or API it moves to, with honest gaps marked.
</Card>
<Card title="Legacy docs" href="/legacy/introduction">
The full v3 documentation, unchanged, for apps that stay on v3.
</Card>
<Card title="Troubleshooting" href="/troubleshooting">
Symptom, cause and fix for problems on v4 and on the v3 runtime.
</Card>
</CardGroup>
