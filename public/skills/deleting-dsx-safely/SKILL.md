---
name: deleting-dsx-safely
description: "Delete a file, a component, an action, a formula, a variable, a route, an entity or a package without breaking anything: ask despia impact first, read breaks, degrades, unaffected and cascade, fix what it names and ask again, and use despia impact --unreachable to find what is already dead. Use before removing anything from a DSX project, and before leaving a legacy file in place because its dependents are unknown."
---

<!-- GENERATED from OpenSource/Skills/deleting-safely.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Deleting safely: ask the framework, then delete

An agent keeps a legacy file because it cannot see what depends on it. So the file stays, a
second one is written beside it, and a year later the project is half sediment. The fix is not
courage. It is that **DSX can answer the question**: nothing is imported, every reach resolves by
name, and the framework already knows every dependent.

**The rule.** Before deleting a file, a component, an action, a formula, a variable, a route, an
entity or a package, ask `despia impact`. Delete when it answers nothing. When it answers
something, fix those sites first and ask again.

```
despia impact Components/Cart.dsx
despia impact 'Checkout#pay'
despia impact entity:order
despia impact Checkout.dsx:42
```

A target is a path (a document or a directory), a declaration however a kind spells it, a node id
of the application graph, or a span. Add `--json` for one object instead of prose; the same verb
is the MCP tool `despia_impact`.

## Read the answer

Four groups, and they mean different things:

- **breaks** - these would fail to resolve. A call to an action that is gone, a read of a formula
  that is gone, a route reaching an entity that is gone. Fix every one of these before deleting.
- **degrades** - these still build and change meaning. A handler that would never fire, a watch
  with no writer, a screen nothing reaches. Decide about each one; do not skip them, because
  nothing will fail loudly.
- **unaffected** - what you might expect to break and does not. A document only DECLARES the
  thing you are deleting; losing a child is not losing a dependency.
- **cascade** - what the target reaches that nothing else does, and so becomes dead the moment
  you delete. Delete those in the same change, or you have traded one dead thing for three.

Every row carries the file, the line, the reaching expression and the kind of edge, so each one
is a place you can open. A row that says **possibly** is a reach the graph could see and could
not decide, such as an action name computed at runtime, or a site whose bytes name the target
while no kind drew an edge for it (those say `text`). Treat `possibly` as a reach. It is the one
direction this tool is allowed to be wrong in.

## Find what is already dead

```
despia impact --unreachable
```

A component no document mounts, an action nobody calls and no handler names, a formula or a
variable nobody reads, a route nothing calls, an entity no route reaches, a package the project
declares and never calls, an event nobody emits or nobody handles, a `<functions>` name never
called. Each finding says either **safe to delete: nothing reaches it**, or where its name is
still written so you fix those sites first.

What the runtime reaches never appears: the entry route, the delegate questions a package
answers, the jobs and queues and sockets the platform invokes, the tools an `<mcp>` row
publishes. You are not being asked to delete your entry route.

## Ask before the change lands

```
despia impact --proposed
despia impact --proposed --against ../base-checkout
```

The same question asked of a change: what resolves today and would not after, what nothing would
reach any more, new ungated doors, new egress hosts. Use it on a branch before you open a review,
and again after you fix what it named.

## The loop

1. Ask impact for the thing you want to remove.
2. Nothing? Delete it, and delete its cascade in the same change.
3. Something? Fix those exact sites, then ask again. Do not delete around a dependent, and do not
   leave a shim behind: a shim is a second thing to delete later.
4. Run the build. `despia build` refuses an unknown reach with a sentence naming the site, so a
   dependent nobody fixed is a red build and not a surprise in production.

## What this does not answer

The answer is as complete as the application graph's edges, and the graph says so out loud: an
unreadable manifest or a document that will not parse lands in `problems` and the rest is still
answered. Read the problems before you trust an empty answer. A target the project does not have
is reported as **unresolved** and exits non zero, which is a different answer from "nothing
reaches it": check the spelling before you conclude anything.

See [the application graph](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/app-graph.md) for the kinds, the node ids
and where each edge comes from.
