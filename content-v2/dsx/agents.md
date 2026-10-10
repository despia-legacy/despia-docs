---
title: Use Despia with your AI agent
description: Connect your coding agent to Despia's hosted MCP server and to the CLI's own MCP server, install the agent skills, and give it the checks that keep its changes safe.
---

DSX is built to be operated by agents. The language is closed, every document can be checked, and every package has a known contract, so an agent can make a change and have a program, not its own judgement, tell it whether the change is right.

There are three ways to connect an agent. Most people use all three.

| Way in | What it gives the agent |
| :-- | :-- |
| The hosted MCP server, `https://mcp.despia.com/mcp` | The docs, the package catalog and every package's actions, with nothing to install |
| The local MCP server, `npx despia mcp` | Every `despia` command for the project on your machine |
| Agent skills | How to write, structure and review DSX apps |

## The hosted MCP server

The hosted server answers over HTTP. Its tools search and read these docs, list packages, read one package's actions and arguments, and look up a Despia V3 call's Despia V4 equivalent.

::: code-group
```sh title="Claude Code"
claude mcp add --transport http despia https://mcp.despia.com/mcp
```
```json title="Cursor"
{
  "mcpServers": {
    "despia": { "url": "https://mcp.despia.com/mcp" }
  }
}
```
```toml title="Codex"
[mcp_servers.despia]
url = "https://mcp.despia.com/mcp"
```
:::

| Tool | What it does |
| :-- | :-- |
| `docs_search`, `docs_get` | Search the docs and read one page as Markdown |
| `packages_list`, `packages_get` | The package catalog, and one package's page |
| `packages_action` | One action: its call, arguments, result and errors |
| `migration_guide`, `legacy_lookup` | Move a Despia V3 call to its Despia V4 equivalent |
| `env_check`, `webview_setup` | Check a converted web app's setup |

`/mcp` is public and read-only: the docs and package tools need no sign-in. A second address, `https://mcp.despia.com/mcp/account`, adds the Despia commands that act on one workspace, such as builds, testers and store releases. Your agent's MCP client signs you in to it with OAuth the first time it connects.

```sh
claude mcp add --transport http despia-account https://mcp.despia.com/mcp/account
```

## The local MCP server

`despia mcp` serves the whole `despia` command table to an agent over standard input and output. Each command becomes one tool, with the same checks it has in the terminal.

```sh
claude mcp add despia-cli -- npx despia mcp
npx despia mcp --list
```

A command that changes something outside the project, such as spending credits on a cloud build, is not run through MCP: the agent gets the exact terminal line to hand to you instead.

## Agent skills

Skills teach an agent how to write DSX well: the mental model, the element vocabulary, how to structure state, the traps that look right and are not. Install the pack into your agent:

```sh
npx skills add despia-native/skills
```

Each skill is listed, with its source, on [Agent skills](/dsx/agents/skills).

## The project tells the agent how it works

`npm create despia` writes an `AGENTS.md` and a `CLAUDE.md` into every new project. They tell an agent where documents live, which commands check its work and which are safe to run. Keep them, and add your own rules to them.

## The loop that keeps changes safe

Agents are good at doing the work and bad at checking it. Let the tools check:

1. **Lint and build before anything lands.** `npx despia lint` and `npx despia build` on the branch as it will stand.
2. **Take a checkpoint before a large change.** `npx despia checkpoint`, and `npx despia checkpoint back` to return.
3. **Ask before deleting.** `npx despia impact <target>` lists everything that depends on it.
4. **Guard the shell.** `npx despia guard check '<command>'` judges a command before the agent runs it; `npx despia guard install` wires it into Claude Code's hooks, showing the change first.
5. **One worktree per agent** when several work on one project, so they never edit the same copy.

## These docs as text

Every page has a Markdown twin: add `.md` to its address. [llms.txt](/llms.txt) lists every page, and **Copy page** at the top of each page copies it as Markdown for pasting into a chat.
