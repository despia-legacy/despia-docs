---
title: MCP
description: Let AI agents call chosen actions of your app as Model Context Protocol tools.
package: mcp
---

Let AI agents call chosen actions of your app as Model Context Protocol tools.

Turns the app into a local Model Context Protocol server, so an AI agent can call the actions you have chosen to expose. Each package opts its own actions in, and any that change something need approval. On desktop, an outside agent can connect only if the person agrees and the build allows it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want an AI agent, in the app or on a desktop, to read from or act in your app through tools you control. If you do not want agents to reach your app, leave it out.

## Install

```sh
despia add Core/MCP
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### server.consent

`dsx.module.mcp.server.consent`

Records whether the person allows a desktop agent to connect, by writing or removing a private pairing file. It is refused when the build does not allow desktop pairing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external` | boolean | yes | True to allow a desktop agent to connect, false to withdraw that permission. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `external` | boolean | yes | Whether desktop pairing is now allowed. |

**Example: Allow a desktop agent to connect**

```js
const result = await dsx.module.mcp.server.consent({"external":true});
// resolves {"external":true}
```

### server.start

`dsx.module.mcp.server.start`

Starts the local server on this device only and creates a session token for it. Agents can then call the declared tools.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `port` | number | yes | The local port the server is now listening on. |

**Example: Start the local server for agents on this device**

```js
const result = await dsx.module.mcp.server.start({});
// resolves {"port":48217}
```

### server.status

`dsx.module.mcp.server.status`

Reports how many tools are declared and whether the local server is running, and whether outside agents may connect.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `declared` | number | yes | How many tools the app has declared. |
| `external` | boolean | yes | True when the person has allowed a desktop agent to connect. |
| `externalAllowed` | boolean | yes | True when this build permits desktop agents to connect at all. |
| `port` | number | yes | The local port the server listens on, when it is running. |
| `running` | boolean | yes | True when the local server is running. |
| `transport` | boolean | yes | True when this build includes the server transport. |

**Example: Check whether the local server is running**

```js
const result = await dsx.module.mcp.server.status({});
// resolves {"declared":3,"external":false,"externalAllowed":true,"port":48217,"running":true,"transport":true}
```

### server.stop

`dsx.module.mcp.server.stop`

Stops the local server so no agent can call the tools any more.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `running` | boolean | yes | True if the server is still running, which is false after a successful stop. |

**Example: Stop the local server**

```js
const result = await dsx.module.mcp.server.stop({});
// resolves {"running":false}
```

### server.tools

`dsx.module.mcp.server.tools`

Lists the tools this app offers to agents, with their names, descriptions and inputs. It answers from the build, so you can show it before any server runs.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tools` | array of object | yes | The tools on offer, each with a name, a description, an input shape and what it changes, if anything. |

**Example: List the tools this app offers to agents**

```js
const result = await dsx.module.mcp.server.tools({});
// resolves {"tools":[{"description":"Lists the signed-in person's orders.","inputSchema":{"properties":{},"type":"object"},"mutates":false,"name":"orders_list"}]}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `external_pairing` | boolean | `false` | When this is on, the app can write a pairing file that a desktop agent (a coding assistant, a chat client) reads to reach the tools this app exposes. It is off by default, it only ever works on this device, and the person using the app still has to grant it in the app itself. Leave it off unless you are shipping a desktop build that needs it. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `external_pairing_disabled` | This build does not allow desktop pairing. |  |
| `pairing_failed` | Desktop pairing could not be written safely, so no token was published. |  |
| `server_start_failed` | The local MCP server could not start. The port may already be in use. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
