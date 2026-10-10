# Despia docs v2: plan (lane docs-v2, 2026-10-10)

Repo despia-native/docs, branch `wip/claude/docs-v2` (from 5097c09). Worktree `/Volumes/PortableSSD/lanes/claude-docs-v2`
(off the wedged disk image). Phase A preview: `http://127.0.0.1:5311` (python static server over `dist-v2/`).

## Architecture (owner ruling 2026-10-10 evening: the docs are built on DSX)

- **Content is renderer independent**: site/ia.mjs (the IA), content-v2/**/*.md (the pages), data/packages.json (the
  catalog). Both renderers read the same files; docs-index.json, llms.txt and the .md twins come from them.
- **The shipping site is DSX** (`npm run build`: compile -> `node site/build.mjs` (export + twins) -> `node
  site/dsx-compile.mjs` -> `despia build` -> assemble). site/dsx-compile.mjs writes Components/DocsShell.dsx and
  Components/v2/*.dsx in the CONSOLE's design language (owner: "do NOT port v2 1:1"; use the console's own components
  and arrangement): DocsShell = the console's Shell (scaffold shell="automatic" collapse="tabs", SidebarList with the
  switcher pinned on top and Appearance at the foot, SidebarSections, the phone tab bar, CommandPalette on cmd+K); a
  page = NavBar large + description, Callout notice, the article as <markdown> sections (the console's Help article),
  "On this page" in the scaffold's inspector column; /packages = the console's Package Explorer (searchbar, scopeBar,
  ListGroup header per category, ItemCard grid; ListGroup rows with IconTile on a phone); a package page = the
  console's product page (ProductHeader, About | At a Glance ListGroups) + the reference.
- **The static site/build.mjs output is a preview and the pixel spec only**; it never ships.
- **No framework change was needed**: <markdown> already lowers a fence to the stock CodeBlock, which highlights with the
  kernel's shared grammar (DSX = markup + CSS + JS in one). Its palette is deliberately greyscale; the docs set the
  CodeBlock's public --dsx-codeblock-* knobs to the CodeEditor theme.js colours in Components/DocsShell.css. The console
  is untouched (pixel identical by construction).
- One marked workaround in DocsShell.css (the article's inline inset) until the framework's prose layout lands.

## Rulings folded in (2026-10-10 night)

- **One sample form**: every native call in every sample is `await dsx.module.<package>.<action>(...)`, the same in a DSX
  app and in any web app inside Despia; one sample per package page. `window.dsx?.` appears only on
  /web-apps/outside-despia. Enforced by site/check-samples.mjs (fails on a call without `await`, and on `window.dsx`
  anywhere else in content-v2).
- **Web apps section** (lane webapp-howto, branch wip/claude/webapp-howto from 81fbc58): /web-apps/*; the old
  /convert/native-features, /convert/react, /convert/detect 301 to its pages.
- **Hosting at https://despia.com/docs** (data/site.json: origin + base). Canonical, sitemap (siteUrl), llms.txt,
  docs-index.json URLs, the setup.despia.com table (-> https://despia.com/docs/legacy/...) and the worker (BASE stripped
  on the way in, put back on every redirect; docs.despia.com 301s every path under despia.com/docs) are done.
  FRAMEWORK GAP: DSX has no base path. The build already writes page-relative script and registry URLs (../main.js,
  ../_registry/...), but absolute /icon.svg, /manifest.webmanifest, /fonts/..., every route href (/dsx/...) and the client
  router's paths assume the site root. Needed in the framework: a `basePath` in dsx.config.json honoured by the SSR head,
  route hrefs, dsx.module.route and the service worker scope.
  The marketing site must add `Sitemap: https://despia.com/docs/sitemap.xml` to despia.com/robots.txt.
  OWNER HARD RULE: nothing on despia.com (no route, DNS or Worker) and no deploy until the owner says go; previews only
  on workers.dev or a staging host.

## Information architecture (top tabs = sections; every page title)

```
Home  /                                   the Despia V4 vision; two routes: DSX (primary, research preview) / Convert (today)
DSX  /dsx                                 [Research preview notice + Register interest on EVERY page]
  Get started
    What is DSX                 /dsx                       (written, Phase A)
    Quickstart                  /dsx/quickstart
    Project structure           /dsx/project
  The model
    Pages and components        /dsx/documents
    Data and state              /dsx/data
    Styling is CSS              /dsx/styling
    Attributes are data         /dsx/attributes
  Building
    Native UI                   /dsx/native-ui
    Navigation                  /dsx/navigation
    Native features             /dsx/packages
    iOS, Android and web        /dsx/platforms
  Tools
    The despia CLI              /dsx/cli
    The console                 /dsx/console
    Use Despia with your AI agent  /dsx/agents   (mcp.despia.com, local MCP via `despia mcp`, skills)
    Agent skills                /dsx/agents/skills
Convert  /convert
  Get started
    Convert overview            /convert
    Quickstart                  /convert/quickstart
  Your web app
    Native features from JavaScript  /convert/native-features   (old /web-apps content, condensed)
    React and Next.js           /convert/react
    Running inside Despia       /convert/detect
  Moving over
    Moving from Despia V3       /convert/from-v3
Packages  /packages                       (written, Phase A) catalog: search, status segmented control, category chips, dense grid
  <one page per package>        /packages/<slug>  (generated: DSX sample + Convert JS sample, when to use, actions, params, results)
Build and ship  /ship
  Before your first build
    Shipping overview           /ship
    App Store Connect key       /ship/app-store-connect
    Google Play service account /ship/google-play
  Builds and releases
    Builds                      /ship/builds
    Releases                    /ship/releases
    App Review                  /app-review   (existing App Review space)
Outside the tabs (reachable by URL, search, footer): /legacy/* (V3), /troubleshooting, /releases, /migrate/* (map)
```

Pages not written yet build as a short "Being written" page so no link is a 404. The 301 table (`redirects/`) is
untouched; Phase B retargets the moved pages (/quickstart, /web-apps, /cli, /console, /deploying, /native-ui, /agents,
/migrate) to their new addresses and adds rows for them.

## Visual system of the static preview (structure only; the DSX site takes the console's look)

- Type: Inter (variable). Body 15.5 px / 1.7 in articles (16 px on phones), UI 14 px, sidebar 14 px, small 12.5-13 px.
  H1 32 px / 650 / -0.022em; H2 22 px / 640; H3 17 px / 620; lede 17 px secondary. Home hero 52 px (36 px phone).
- Widths: top bar 56 px (52 phone); sidebar 268 px; article max 720 px; TOC 216 px sticky from 1200 px; packages
  catalog 1040 px; home 1120 px. Phone gutters 20 px.
- Sidebar: group titles 12.5 px semibold; rows 30 px (28 px nested), radius 6, active = accent-muted fill + accent ink;
  collapsible groups are `<details>` with the chevron inline on the right and children indented under a 1 px guide.
- Colour: the console's DSX tokens by value (label #16151c / #f5f5f7, secondary #5b5a67 / #a9a9ae, accent #6538d4 /
  #9075ff, separators 10-16 % ink). Light and dark both via `prefers-color-scheme` + a manual toggle (stored locally).
- Components: top tabs, search dialog (Cmd-K, /), code block (filename header, language tag, copy), code group (tabs:
  "DSX" / "Convert (JavaScript)"), callout (note/tip/warning), link cards, badges, segmented control, chips, package
  card (36 px icon tile, bold name, status badge, 2-line summary), research-preview notice with inline email form,
  pager, TOC with scroll-spy, phone menu sheet (section tabs + section tree + appearance).
- Code: kernel highlight kinds -> CodeEditor `theme.js` colours (despia-light / despia-dark). DSX-specific scopes from
  theme.js recovered from the token stream: `{{ }}` holes and the `dsx` head accent-bold, the plane word
  (variable/module/action) soft accent, CSS selectors accent and properties blue inside `<style>`.
- Formatting of .dsx samples follows the framework docs' conventions (2-space indent, `<head>` first, `;`-terminated
  statements in code bodies, `{{ x }}` with inner spaces, self-closing leaf elements). The CLI has no formatter command
  (the framework CLI command table lists none); if one lands, the build runs every sample through it.

## Machine export (the one source for the general MCP, `despia docs` and /v1/package-docs)

`dist/docs-index.json` (built every time):

```json
{
  "format": "despia-docs-index", "version": 1, "release": "0.0.2", "site": "https://docs.despia.com", "generated": "<ISO>",
  "sections": { "dsx": "...", "convert": "...", "packages": "...", "ship": "...", "home": "..." },
  "pages": [
    { "slug": "dsx/quickstart", "url": "/dsx/quickstart", "title": "...", "description": "...",
      "section": "dsx | convert | packages | ship | home",
      "headings": [{ "id": "one-document-three-languages", "title": "...", "level": 2 }],
      "markdown": "<the page body in Markdown, front matter removed>" }
  ]
}
```

Rules: `slug` is stable (it is the URL without the leading slash; "index" for /); a page is never removed without a
redirect; `markdown` is the same text as the page's `.md` twin minus its title line; package pages are included
(section "packages") with their generated reference. Also built: a `.md` twin per page (`<url>.md`), `llms.txt`,
`search.json`. Status: format v1 is stable for the MCP-side switch once Phase B fills the pages (the shape will not
change; more pages arrive).

Docs-site MCP (owner ruling): the docs worker's `/mcp`, `worker/tools.ts` and `scripts/mcp-tools.mjs` are removed in
Phase B (with a 301 /mcp -> https://mcp.despia.com); not done in Phase A because the worker change needs a typecheck on
the Mini.

## Status

- Phase B done on the branch: every page in the tree written and fact-checked (219 whole .dsx samples compiled with the
  framework's `despia lint`, 0 errors; every dsx.module call checked against the catalog; every attribute checked against
  the framework reference: site/check-samples.mjs), 301s for every moved page (redirects/v2-moves.json, one hop), the
  docs MCP removed (/mcp 301/308 to https://mcp.despia.com/mcp), the DSX build wired (site/dsx-compile.mjs).
- Next: full-build timing and the build profile, layout audit at every width, owner review of the DSX shots.
