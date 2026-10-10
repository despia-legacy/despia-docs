---
title: Agent skills
description: Skills teach a coding agent how to write, structure, review and ship DSX apps. Install the pack once and your agent loads the right one when it needs it.
---

A skill is a short, focused guide written for an agent: when to use it, the rules, and worked examples. Agents that support skills (Claude Code, Cursor, Codex and others) read the description of each one and load it when the task matches.

## Install

```sh
npx skills add despia-native/skills
```

The pack installs into your agent's skills folder. Run the same command again to update it.

## The skills

| Skill | What it teaches | Where |
| :-- | :-- | :-- |
| [Building DSX apps with agents](/skills/building-dsx-apps-with-agents/SKILL.md) | Plan and build a large piece of a DSX project with one or many agents, with measured plans and safe parallel work. | With the public release |
| [Deleting safely](/skills/deleting-dsx-safely/SKILL.md) | Delete a file, a component, an action, a formula, a variable, a route, an entity or a package without breaking anything. | With the public release |
| [Designing DSX apps](/skills/designing-dsx-apps/SKILL.md) | The design bar for DSX apps. | In the pack |
| [Audio](/skills/dsx-audio/SKILL.md) | Build audio in a DSX app. | With the public release |
| [Components and reuse](/skills/dsx-components-and-reuse/SKILL.md) | Cut a DSX app into one root, panels and a library of configurable primitives, and never write the same markup twice. | With the public release |
| [Runtime traps](/skills/dsx-runtime-traps/SKILL.md) | The DSX spellings that run, report success and do the wrong thing. | With the public release |
| [UI without flashing](/skills/dsx-ui-without-flashing/SKILL.md) | Build DSX screens that never flash, jump or draw a blank. | With the public release |
| [Integrating a native SDK](/skills/integrating-a-native-sdk/SKILL.md) | Wrap a vendor's native SDK as a DSX package the right way. | With the public release |
| [Reviewing DSX apps](/skills/reviewing-dsx-apps/SKILL.md) | The loop to run before and after every change to a DSX project. | With the public release |
| [Structuring DSX apps](/skills/structuring-dsx-apps/SKILL.md) | Where DSX state goes and when one document has become two. | With the public release |
| [Thinking in DSX](/skills/thinking-in-dsx/SKILL.md) | The React and React Native to DSX translation table. | In the pack |
| [Using the despia CLI](/skills/using-the-despia-cli/SKILL.md) | The whole despia command surface, structural verbs first. | With the public release |
| [Writing DSX apps](/skills/writing-dsx-apps/SKILL.md) | Write correct DSX app markup. | In the pack |

Skills marked "With the public release" are written and published here so you can read them now; they join the installable pack when DSX's production release ships. Each link opens the skill's own `SKILL.md`, which you can also copy into your agent by hand.

## Where to start

- New to DSX: **Thinking in DSX** maps what you know from React and React Native to DSX, then **Writing DSX apps** covers the vocabulary.
- Building something large: **Structuring DSX apps** and **Components and reuse**.
- Before every change lands: **Reviewing DSX apps**.

Skills work best with the [MCP servers](/dsx/agents) connected, so the agent can check the docs and the package contracts while it works.
