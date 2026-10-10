# Despia Docs

The documentation platform for [Despia](https://github.com/despia-native/despia), and
deliberately also its showcase: this site is itself a DSX application, built on the exact
stack it documents.

- **Authoring**: pages are markdown with front matter under `content/`; the framework's own
  guides and skills sync in from the front door. `scripts/compile.mjs` turns the tree into
  DSX page components, the route table, the navigation model, a client-side search index,
  raw-markdown siblings for every page, and `llms.txt` + `llms-full.txt`.
- **The component reference** under `content/components/` is generated, never hand written:
  the framework's `ClosedSource/scripts/generate_component_docs.rb` projects it from the
  element census, the library matrix, the web element ledger and the catalog, one page per
  element plus the overview, each carrying machine-readable front matter (element, properties
  with types, actions, platforms, catalog version, ledger commit). Edit a ledger, not a page.
- **Rendering**: `dsx build` compiles the pages; `@despia-native/server` renders them on Cloudflare
  Workers. The `<markdown>` element paints the block vocabulary server-side, so first paint
  is the content.
- **Search**: client-side over the build-time index. No server dependency for the basic
  path.
- **Agents are first-class**: every page serves its raw markdown under `/md/…`, the site
  summarizes itself at `/llms.txt`, and the site runs its own MCP server at `/mcp` with
  `search`, `fetch-page` and `list-sections` tools over streamable HTTP.

```sh
npm install
npm run sync       # pull the framework docs from a front-door checkout (DESPIA_FRONT_DOOR=…)
npm run dev        # compile + serve + watch
npm run build      # compile + dsx build + assemble the servable tree in dist/
npx wrangler deploy
```

### Ask AI

The "Ask AI" panel (`Components/DocAsk.dsx`) asks the Worker's `POST /api/ask` (`worker/ask.ts`): the docs search picks
the pages, their sections become numbered passages, and the model answers from those passages only, streamed, with
`[n]` citations that link to the sections. Provider and model are the API's Support AI ones (OpenRouter,
`anthropic/claude-sonnet-4.5`, zero-retention routing). The account spend guard (`SPEND_GUARD` service binding) is read
first; when it pauses AI, or cannot be read, the panel shows the matching pages instead (fail closed).

```sh
npm run build                 # once (or after changing pages or components)
npm run dev:worker            # the Worker on http://127.0.0.1:5311: site + /api/ask + search + /mcp
npm test                      # includes tests/ask.test.mjs and tests/askpanel.test.mjs
```

Without a key the Worker answers with a clearly labelled **stub model** (the real passages and citations, no written
answer, nothing spent). To try a real model locally, put `OPENROUTER_API_KEY=...` in a git-ignored `.dev.vars`
file next to `wrangler.jsonc`; AI then stays paused until a spend guard is bound (fail closed), so also run the guard
Worker locally (`despia-spend-guard`, `wrangler dev` in its own folder) or test the paused fallback on purpose.
`npm run dev:worker -- --var DOCS_AI_PAUSED:1` shows the paused fallback. In production the key is a secret
(`npx wrangler secret put OPENROUTER_API_KEY`), never a file or a var.

CI builds from the public registry, boots the worker with `wrangler dev`, and probes SSR,
the markdown routes, `llms.txt` and the MCP face on every push; it goes green with the
0.1.0 registry wave.

## Issues and contributions

Docs-site bugs live here; framework issues live on
[`despia-native/despia`](https://github.com/despia-native/despia/issues). See
[CONTRIBUTING.md](https://github.com/despia-native/despia/blob/main/CONTRIBUTING.md) for
the workflow. Maintained by the Despia team.

## License

[Apache License 2.0](LICENSE).

---

Proudly built in the United Arab Emirates 🇦🇪

Despia LLC-FZ · Dubai, United Arab Emirates · [despia.com](https://despia.com) · support@despia.com
