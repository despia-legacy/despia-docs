---
title: Despia documentation
description: Build native iOS and Android apps, a web app and a back end from one set of DSX documents. Start here, by what you want to do.
order: 0
section:
---

# Despia documentation

Build a native iOS app, a native Android app, a web app and its back end from one set of DSX
documents. Pick what you want to do.

<CardGroup cols="2">
<Card title="Build a new app" href="/quickstart">
From an empty folder to a running app in five minutes.
</Card>
<Card title="Move from Despia V3" href="/migrate">
Bring a V3 app to V4 in one step: every V3 call keeps working.
</Card>
<Card title="Add native screens to a web app" href="/guides/web-app-with-native-screens">
Keep your web app, make Settings or checkout native, ship them over the air.
</Card>
<Card title="Use Despia services" href="/services/on-its-own">
Push, payments, chat and sync, alone or together, on your own cloud.
</Card>
<Card title="Look up an API" href="/components">
Every component, attribute and package action, with examples.
</Card>
</CardGroup>

## Five lines to a running app

```sh title="Terminal"
npm create despia@latest my-app
cd my-app
npm install
npx despia dev
```

Then follow the [Quickstart](/quickstart) for your first edit and your first build.

## For AI agents

Every page has a markdown twin (add `.md` to its address), the whole site is summarized at
[/llms.txt](/llms.txt) and [/llms-full.txt](/llms-full.txt), and the docs answer over MCP at
`/mcp`. [Use these docs with your agent](/agents) has the setup for Claude Code, Cursor and Codex.
