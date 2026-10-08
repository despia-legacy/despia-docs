---
title: Use these docs with your agent
description: Give Claude Code, Cursor, Codex or any MCP client the Despia documentation: an MCP server, llms.txt and a markdown twin of every page.
order: 2
section:
---

# Use these docs with your agent

Agents read the same pages you do, in the shape that suits them. There are three ways in.

| Way in | Address | Best for |
|---|---|---|
| MCP server | `https://docs.despia.com/mcp` | Agents that search and read on their own |
| llms.txt | [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt) | One file with the whole map, or the whole text |
| Markdown twin | any page address + `.md` | Pasting one page as context |

## Connect the MCP server

The server answers over HTTP. Its tools search the docs, read a page as markdown, search the
troubleshooting and App Review articles, and look up a package.

<Tabs>
<Tab title="Claude Code">
```sh title="Terminal"
claude mcp add --transport http despia-docs https://docs.despia.com/mcp
```
</Tab>
<Tab title="Cursor">
```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "despia-docs": { "url": "https://docs.despia.com/mcp" }
  }
}
```
</Tab>
<Tab title="Codex">
```toml title="~/.codex/config.toml"
[mcp_servers.despia-docs]
url = "https://docs.despia.com/mcp"
```
</Tab>
</Tabs>

| Tool | What it does |
|---|---|
| `docs_search` | Search every space (Despia V4, Legacy (V3), Migration, Troubleshooting, App Review) |
| `docs_fetch` | Read one page as markdown |
| `troubleshooting_search` | Symptom, cause and fix |
| `app_review_search` | Apple and Google review guidelines, and how Despia apps pass them |
| `integrations_list`, `integration_get` | Packages: actions, platforms, licence, install line |

## Copy a page

Every page has **Copy page** above its title: it copies the page as markdown. The menu next to it
opens the page in Claude or ChatGPT, with the page as context.

## One source

The website, the Help panel in the Despia console, Despia Support's answers and these agent
endpoints all read the same pages. A fix to a page reaches all of them on the next deploy.
