---
name: building-dsx-apps-with-agents
description: "Plan and build a large piece of a DSX project with one or many agents, the way the Despia fleet learned to: never estimate an undefined blob; name the pieces, sort them by shape, size them S/M/L in a plan file committed with the project, build two or three hard representatives end to end, record what each really cost, and forecast from the measured repeats, where the first of a shape is architecture and repeats that stay dear are an engine gap. Then check the tree before it lands (despia build and despia lint, only your own hunks committed), prove on the exported app, red before green, quote the runner instead of typing counts, one device per agent, despia guard before deleting, and a failure ledger of mechanisms. Use when handed a large or vague item, before giving any estimate, and whenever more than one agent works in one project."
---

<!-- GENERATED from OpenSource/Skills/building-with-agents.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Building a DSX app with agents: plan from measurements, check before you land

> Audience: an agent (or a person directing several) about to plan or build a large piece of a
> DSX project, alone or beside other agents. The loop around each single change is
> [`review-your-app.md`](../reviewing-dsx-apps/SKILL.md); deleting anything is
> [`deleting-safely.md`](../deleting-dsx-safely/SKILL.md); every command and flag is
> [`using-the-cli.md`](../using-the-despia-cli/SKILL.md), and when that page and `despia --help` disagree, the
> help is right. The design behind this page is
> `OpenSource/Documentation/architecture/proposals/agent-safety.md`, Decisions 1 to 11.

The Despia team builds DSX with a fleet of agents working on one repository at once. This page is
what that fleet learned, as instructions for your project. There are two lessons:

1. **Plan from measurements, never from a guess.** A queue item that says "fifty integrations"
   isn't small or large. It's unknown, and every number put on it is invented.
2. **Many agents share a project safely only through checks they can't skip.** A rule in a prompt
   gets forgotten. A gate that refuses doesn't.

The CLI runs no AI. It doesn't plan your work or write your code. It refuses a stale edit, a
dangerous shell command and a broken build, the same way every time.

## Part 1: you can't estimate an undefined blob

### The method

1. **Name the pieces.** Write down every concrete member of the item, one line each. Stop when
   none is left. "The integrations" isn't a piece; "Stripe checkout" is.
2. **Sort them by shape.** A shape is a kind of work whose members can share a template. For
   example: an audit of something that exists, an extension of an existing package, a new package,
   an adapter for one vendor SDK, a server route set, a CLI verb. Use few shapes. A shape with one
   member teaches nothing.
3. **Size each piece S, M or L,** and write down why. A size is a guess until something
   measures it.
4. **Build two or three hard representatives end to end,** one per hardest shape, before
   anything else. End to end means proven where it runs: on the exported app, not in a
   preview (Part 2).
5. **Measure what each really cost.**
6. **Forecast from the measurements.** The first item of a shape is architecture: it builds the
   template, and its cost isn't a unit cost. The repeats are the unit cost.
7. **If the repeats don't get cheap, stop and fix the engine.** Ten repeats that each cost what
   the first did mean something is missing: a component to extract, a primitive the framework
   lacks, a template nobody wrote. That's a gap to fix, not a number to shrink.

### Keep the plan as data

Keep the pieces in a file committed with the project, one row per item (its shape, its size, its
state and, once finished, its cost and where the cost came from), so every agent reads and writes
the same list.

- **A cost has a source, and the source is recorded:** the time from start to done, the span of
  the commits it took (the commit you started from to your last one), or the proof time a test
  run reported.
- **A typed number is a claim.** Use one only for work done before the list existed, and label it
  claimed, not measured.
- **Nothing measured, no number.** A shape with no finished repeat has no forecast. Build a
  representative; don't fill the gap with your own estimate.
- **An engine gap is a status, not an opinion.** A shape whose repeats stay above half the cost of
  the first, over at least two repeats, is an engine gap.
- **Every forecast names its inputs:** the items the number came from, their costs and sources,
  and the ratio of repeat to first.

When you're handed a large item, run the method before you write code. Report the named pieces,
the shapes and the representatives you'll build first, not a date.

## Part 2: many agents, one project

Every failure below happened to the Despia fleet. The fix is always a mechanism, never a
reminder. Use the built ones. Where the mechanism is still a proposal, follow the discipline by
hand, and don't claim the gate ran.

| What goes wrong | What you do | The DSX mechanism |
|---|---|---|
| A commit carries another agent's staged or half-finished hunks | Commit only your own files or hunks, never the shared index | by hand: commit named paths (or a patch of only your hunks) through a private index; there is no `despia` verb for landing |
| A fix made from an old copy silently deletes lines another agent just landed | Check every line you remove was in the revision you read | by hand: blame each removed line against your base before you commit |
| A landing leaves the branch unparseable, or broken | Check the tree the branch will hold, not only your files | `despia build` (the guardian first: parse, lint, state, the loop check) and `despia lint` on the merged tree; don't land when either fails |
| An edit lands against a document that changed since you read it | State the revision you read | `despia revision`, then the editing verbs with `--rev`; a stale revision is refused. `despia resolve` says whether a node you hold is still there |
| "Passed" or "151 cases" with nothing behind it | Quote the runner's own summary line; never type a count | today by hand; the claim check (Decision 6, **proposed, not in 0.1.0**) will compare a landing message's counts against the runner's output |
| A green preview reported as a native proof | Prove on the exported app, on a simulator, an emulator or a device | `despia export`, `despia run --target ios` or `--target android`; a preview container proves nothing about the app you ship |
| A fix proven by a test the author's path never reaches | Write the failing case where the author writes: the markup, the declared action, the module call | red before green: run the new case, watch it fail for the reason you expect, then fix |
| A behaviour proven on one platform and claimed on all | Prove it on each platform it claims: web, Android, iOS | one corpus or one drive, run per platform |
| Two agents boot the same simulator, or the machine drowns in parallel builds | One device per agent, shut down after the proof; builds one or two at a time | `despia run` locks its export directory, so two runs of one project queue; device and machine leases (despia `lease`, Decision 5, **proposed, not in 0.1.0**) are not shipped |
| `rm -rf $DIR/*` with `$DIR` empty | Delete only literal paths inside the project; write `"${DIR:?}"` | `despia guard check '<command>'` judges a command before it runs; `despia guard install` wires the judge into Claude Code's hooks (a diff first, `--write` to apply, `despia guard uninstall --write` restores the exact bytes) |
| Code left in place because nobody knows what depends on it | Ask before deleting | `despia impact <target>` ([`deleting-safely.md`](../deleting-dsx-safely/SKILL.md)) |
| A large change goes wrong and there's no way back | Checkpoint first | `despia checkpoint`, `despia checkpoint back` |
| Nobody can say what an agent changed | Read the list the agent didn't write | `despia change list`: what the editing session holds for review, each revision approved or put back |

**Per-agent workspaces.** Give each agent its own git worktree where your harness can (Claude
Code's worktree isolation, or `git worktree add`), and record the commit it started from. Where
agents share one checkout, commit only your own paths or hunks.

## Part 3: keep your own failure ledger

When an agent fails in a new way, add a row to a file in your project: the symptom, the root
cause, the mechanism that makes it impossible, and a state (open, partial, mitigated). A row is
never deleted, and its state only moves forward. The open rows are the backlog of mechanisms to
build, which is better than a longer prompt. The Despia fleet's own ledger is
`ClosedSource/release/agent-failure-register.json` in the framework repository, where every row
above started.

## The loop, per item

```sh
despia checkpoint --label "before <id>"
# write the failing case at the author's entry point; run it; watch it fail
# make it pass; then lint, drive and prove on the exported app
despia lint
despia verify --drive
despia run --target ios
despia build
# commit only the files you changed, with the red and the green you saw in the message
```

Record the item's measured cost in your plan file when it lands.
