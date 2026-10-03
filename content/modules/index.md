---
title: Modules
description: Native capabilities, UI and backends as modules: build your own, let an agent build one, or install one from the catalogue.
route: /framework/modules
section: modules
label: Overview
order: 1
---

# Modules

A module is how a capability reaches a Despia app: a camera, payments, haptics, a chat backend, a
design-system card. It declares what it offers in one manifest (`dsx.json`), implements it once per
platform (Swift, Kotlin, the web), can ship DSX components and a backend, and every app calls it the
same way: `dsx.module.<command>.<action>()`.

<CardGroup cols="2">
<Card title="Build a module" href="/framework/guides/build-a-module">
The walkthrough: the anatomy, one complete module from an empty folder to a release, and the rules
that bite.
</Card>
<Card title="Building with an agent: the skill" href="/framework/skills/writing-a-module">
The skill your coding agent reads (Claude Code, Codex, Cursor): the same recipe, written for an
agent.
</Card>
<Card title="Module catalogue" href="https://despia.com/modules">
Every first-party and community module, with its platforms, licence and install line.
</Card>
<Card title="Backends" href="https://despia.com/backends">
Full-stack modules and the backends a Despia app deploys to your own provider.
</Card>
</CardGroup>

## Related pages

- [Calling another module](/framework/skills/cross-module-calls): the three call shapes.
- [Module context](/framework/skills/module-state): values a module declares and others read.
- [Extracting a module](/framework/skills/extracting-a-module): turning app code into a module.
- [Writing a backend](/framework/skills/writing-a-backend): the `<server>` document a full-stack
  module carries.
