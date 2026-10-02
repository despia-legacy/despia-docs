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
