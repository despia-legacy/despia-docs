//
//  worker/search.ts — the docs MCP tools, platform-free (the worker wires the platform; the
//  bench and the tests import this file directly under node).
//
//  Retrieval is hybrid and cheap at volume (PLAN-I I2):
//    · LEXICAL runs in-process over the build-time index: tokenised, title/heading weighted,
//      no network. It is the whole answer for an exact identifier or API name
//      ("dsx.module.haptic.light", "<repeat>", "despia export ios", "4.2"): the fast path.
//    · VECTOR hits come from the Support knowledge API (GET /v1/search, CONTRACT.md). Documents
//      are embedded at publish (public/knowledge/chunks.json, keyed by contentVersion), so a
//      query costs at most ONE query embedding there, and the Support service caches it by
//      normalised query.
//    · The two lists merge by Reciprocal Rank Fusion (k = 60).
//    · Every answer is cached by (tool, normalised query, filters, contentVersion): the worker
//      backs the cache with the Cloudflare edge cache; a new publish changes contentVersion, so
//      nothing stale is ever served and nothing needs purging.
//  Filters on every search tool: space, package, version, platform (v4 / legacy).
//

export interface IndexPage { route: string; title: string; label?: string; space: string; section: string; text: string }
export interface Hit { route: string; title: string; space: string; section: string; url: string; markdown: string; score: number; via: string[] }
export interface Cache { get(key: string): Promise<unknown | undefined>; put(key: string, value: unknown): Promise<void> }
export interface VectorHit { url: string; title: string; space?: string; snippet?: string }
export interface ToolsInput {
  site: string;
  version: string;
  contentVersion: string;
  pages: IndexPage[];
  appReview: { guidelines: Array<Record<string, unknown>> };
  troubleshooting: { articles: Array<Record<string, unknown>> };
  integrations: { packages: Array<Record<string, unknown> & { command: string; package: string; docs?: Array<{ route: string }> }> };
  /** the Support knowledge API; null = lexical only (offline, no origin, or refused) */
  vector: ((q: string, space: string, limit: number) => Promise<VectorHit[]>) | null;
  /** despia.com/improvements.json (PLAN-J); null = unavailable */
  improvements: (() => Promise<Array<Record<string, unknown>>>) | null;
  /** resolved support answers (Support /v1/search, space resolutions) */
  resolutions: ((q: string, args: Record<string, string>, limit: number) => Promise<VectorHit[]>) | null;
  cache: Cache;
}

export const SPACES = ["modern", "legacy", "migrate", "troubleshooting", "releases", "app-review"] as const;
const PLATFORM_SPACES: Record<string, string[]> = {
  v4: ["modern", "migrate", "troubleshooting", "releases", "app-review"],
  legacy: ["legacy", "migrate", "troubleshooting", "app-review"],
};

const str = (args: Record<string, unknown>, k: string): string => (typeof args[k] === "string" ? (args[k] as string).trim() : "");
const num = (args: Record<string, unknown>, k: string, d: number, max: number): number => {
  const n = Number(args[k]);
  return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), max) : d;
};
export const normalise = (q: string): string => q.toLowerCase().replace(/\s+/g, " ").trim();

/** An exact identifier or API name: answered by the lexical fast path alone (no vector call). */
export function isIdentifier(q: string): boolean {
  const t = q.trim();
  if (t.includes(" ") && !/^despia\s+[a-z-]+(\s+[a-z-]+)?$/.test(t)) return false;
  return /[.<>/:_$()]|^[a-z]+[A-Z]\w*$|^\d+(\.\d+)+$|^despia\s/.test(t);
}

const tokens = (s: string): string[] => normalise(s).split(/[^a-z0-9.<>/_$-]+/).filter((t) => t.length >= 2);

export function createTools(input: ToolsInput) {
  const { site, pages } = input;
  const lower = pages.map((p) => ({ p, title: p.title.toLowerCase(), label: (p.label ?? "").toLowerCase(), text: p.text.toLowerCase() }));
  //  An inverted index built once per isolate: token -> pages, title tokens kept apart. A query
  //  then touches only the pages that hold one of its words (postings), never the whole corpus.
  const postings = new Map<string, number[]>();
  const titleTokens = lower.map((e) => new Set(tokens(`${e.title} ${e.label}`)));
  lower.forEach((e, i) => {
    for (const t of new Set([...tokens(e.text), ...titleTokens[i]])) {
      const list = postings.get(t);
      if (list === undefined) postings.set(t, [i]); else list.push(i);
    }
  });
  const byPackage = new Map<string, Set<string>>();
  for (const m of input.integrations.packages) {
    const routes = new Set((m.docs ?? []).map((d) => d.route));
    byPackage.set(m.package.toLowerCase(), routes);
    byPackage.set(m.command.toLowerCase(), routes);
  }
  const mdOf = (route: string) => `${site}${route === "/" ? "/index" : route}.md`;
  const hitOf = (p: IndexPage, score: number, via: string): Hit =>
    ({ route: p.route, title: p.title, space: p.space, section: p.section, url: site + p.route, markdown: mdOf(p.route), score, via: [via] });

  /** the filters every search tool takes, as one predicate over a page */
  function filterOf(args: Record<string, unknown>, fixedSpace?: string): { ok: (p: IndexPage) => boolean; note: string | null; space: string } {
    const space = fixedSpace ?? (SPACES as readonly string[]).find((s) => s === str(args, "space").toLowerCase()) ?? "all";
    const platform = str(args, "platform").toLowerCase();
    const pkg = str(args, "package").toLowerCase();
    const version = str(args, "version");
    const allowed = PLATFORM_SPACES[platform] ?? null;
    const pkgRoutes = pkg === "" ? null : byPackage.get(pkg) ?? byPackage.get(pkg.replace(/^dsx\.module\./, "")) ?? new Set<string>();
    const note = version !== "" && version !== "latest" && version !== input.version
      ? `docs version ${version} is not published; these results are ${input.version} (latest)` : null;
    return {
      space,
      note,
      ok: (p) => (space === "all" || p.space === space) && (allowed === null || allowed.includes(p.space)) && (pkgRoutes === null || pkgRoutes.has(p.route)),
    };
  }

  function lexical(q: string, ok: (p: IndexPage) => boolean, limit: number): Hit[] {
    const needle = normalise(q);
    const words = tokens(q);
    if (needle.length < 2) return [];
    const score = new Map<number, number>();
    for (const w of words) {
      for (const i of postings.get(w) ?? []) score.set(i, (score.get(i) ?? 0) + (titleTokens[i].has(w) ? 2 : 1));
    }
    if (score.size === 0 || isIdentifier(q)) {
      // the substring pass: an identifier is matched as written (dsx.module.haptic inside
      // dsx.module.haptic.light()), and a query with no whole-word hit still finds fragments
      lower.forEach((e, i) => {
        const inTitle = e.title.includes(needle);
        const inText = e.text.includes(needle);
        if (inTitle || inText) score.set(i, (score.get(i) ?? 0) + (inTitle ? 6 : 3));
      });
    }
    const scored: Hit[] = [];
    for (const [i, base] of score) {
      const e = lower[i];
      if (!ok(e.p)) continue;
      let s2 = base;
      if (e.title === needle || e.label === needle) s2 += 12;
      if (e.title.includes(needle) || e.label.includes(needle)) s2 += 6;
      if (words.length > 1 && e.text.includes(needle)) s2 += 3;
      scored.push(hitOf(e.p, s2, "lexical"));
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /** Reciprocal Rank Fusion of the lexical list and the vector list (k = 60). */
  function fuse(lists: Hit[][], limit: number): Hit[] {
    const out = new Map<string, Hit>();
    for (const list of lists) {
      list.forEach((h, rank) => {
        const key = h.route || h.url;
        const prev = out.get(key);
        const add = 1 / (60 + rank + 1);
        if (prev === undefined) out.set(key, { ...h, score: add });
        else { prev.score += add; prev.via = [...new Set([...prev.via, ...h.via])]; }
      });
    }
    return [...out.values()].sort((a, b) => b.score - a.score).slice(0, limit)
      .map((h) => ({ ...h, score: Math.round(h.score * 10000) / 10000 }));
  }

  async function cached<T>(tool: string, args: Record<string, unknown>, run: () => Promise<T>): Promise<T & { cached?: boolean }> {
    const key = `${tool}|${input.contentVersion}|${Object.keys(args).sort().map((k) => `${k}=${normalise(String(args[k]))}`).join("&")}`;
    const hit = await input.cache.get(key);
    if (hit !== undefined) return { ...(hit as T), cached: true };
    const value = await run();
    await input.cache.put(key, value);
    return value;
  }

  async function docsSearch(args: Record<string, unknown>, fixedSpace?: string) {
    const query = str(args, "query");
    const limit = num(args, "limit", 8, 20);
    if (query.length < 2) return { hits: [], mode: "empty" };
    return cached(`docs_search:${fixedSpace ?? ""}`, args, async () => {
      const f = filterOf(args, fixedSpace);
      const lex = lexical(query, f.ok, limit * 2);
      if (isIdentifier(query) || input.vector === null) {
        return { hits: lex.slice(0, limit), mode: "lexical", contentVersion: input.contentVersion, version: input.version, ...(f.note ? { note: f.note } : {}) };
      }
      let vec: Hit[] = [];
      try {
        const raw = await input.vector(query, f.space, limit * 2);
        vec = raw.map((v) => {
          const route = v.url.startsWith(site) ? (v.url.slice(site.length) || "/") : "";
          const page = pages.find((p) => p.route === route);
          return page !== undefined ? hitOf(page, 0, "vector") : null;
        }).filter((h): h is Hit => h !== null && f.ok(pages.find((p) => p.route === h.route)!));
      } catch { vec = []; }
      return { hits: fuse([lex, vec], limit), mode: vec.length > 0 ? "hybrid" : "lexical", contentVersion: input.contentVersion, version: input.version, ...(f.note ? { note: f.note } : {}) };
    });
  }

  const match = (row: Record<string, unknown>, q: string): boolean =>
    q === "" || tokens(q).every((w) => JSON.stringify(row).toLowerCase().includes(w));

  return {
    docs_search: (args: Record<string, unknown>) => docsSearch(args),
    troubleshooting_search: (args: Record<string, unknown>) => cached("troubleshooting_search", args, async () => {
      const q = str(args, "query");
      const platform = str(args, "platform").toLowerCase();
      const pkg = str(args, "package").toLowerCase();
      const rows = input.troubleshooting.articles.filter((a) => match(a, q)
        && (platform === "" || String(a["platform"]).toLowerCase() === (platform === "legacy" ? "legacy" : "v4"))
        && (pkg === "" || ((a["packages"] as string[]) ?? []).some((p) => p.toLowerCase().includes(pkg))));
      return { articles: rows.slice(0, num(args, "limit", 8, 20)).map((a) => ({ ...a, url: site + a["route"], markdown: mdOf(String(a["route"])) })) };
    }),
    app_review_search: (args: Record<string, unknown>) => cached("app_review_search", args, async () => {
      const q = str(args, "query");
      const store = str(args, "store").toLowerCase();
      const guideline = str(args, "guideline");
      const category = str(args, "category").toLowerCase();
      const platform = str(args, "platform").toLowerCase();
      const rows = input.appReview.guidelines.filter((g) => match(g, q)
        && (store === "" || ((g["stores"] as string[]) ?? []).some((s) => s.toLowerCase() === store))
        && (guideline === "" || String(g["guideline"]).startsWith(guideline))
        && (category === "" || String(g["category"]).toLowerCase() === category)
        && (platform === "" || ((g["platforms"] as string[]) ?? []).some((p) => p.toLowerCase() === platform)));
      return { guidelines: rows.slice(0, num(args, "limit", 10, 50)) };
    }),
    resolutions_search: async (args: Record<string, unknown>) => {
      const q = str(args, "query");
      if (q.length < 2) return { resolutions: [] };
      if (input.resolutions === null) return { resolutions: [], note: "the resolutions index is not reachable from this deployment" };
      return cached("resolutions_search", args, async () => {
        try {
          const filters: Record<string, string> = {};
          for (const k of ["package", "version", "platform"]) if (str(args, k) !== "") filters[k] = str(args, k);
          return { resolutions: await input.resolutions!(q, filters, num(args, "limit", 8, 20)) };
        } catch { return { resolutions: [], note: "the resolutions index did not answer" }; }
      });
    },
    integrations_list: (args: Record<string, unknown>) => cached("integrations_list", args, async () => {
      const q = str(args, "query");
      const platform = str(args, "platform").toLowerCase();
      const licence = str(args, "license").toLowerCase();
      const rows = input.integrations.packages.filter((m) => match({ name: m["name"], command: m.command, package: m.package, description: m["description"] }, q)
        && (platform === "" || ((m["platforms"] as string[]) ?? []).includes(platform))
        && (licence === "" || (licence === "open" ? m["commercial"] !== true : licence === "commercial" ? m["commercial"] === true : String(m["license"]).toLowerCase() === licence)));
      return { total: rows.length, packages: rows.slice(0, num(args, "limit", 50, 250)).map((m) => ({
        name: m["name"], command: m.command, package: m.package, api: m["api"], license: m["license"], commercial: m["commercial"],
        platforms: m["platforms"], version: m["version"], description: m["description"], llms: `${site}/modules/${m.command}/llms.txt` })) };
    }),
    integration_get: async (args: Record<string, unknown>) => {
      const key = str(args, "package").toLowerCase().replace(/^dsx\.module\./, "") || str(args, "command").toLowerCase();
      const m = input.integrations.packages.find((p) => p.command.toLowerCase() === key || p.package.toLowerCase() === key);
      if (m === undefined) throw { reason: "not_found", message: `no package ${key}; integrations_list finds one` };
      return { ...m, docs: (m.docs ?? []).map((d) => ({ ...d, markdown: mdOf(d.route) })), llms: `${site}/modules/${m.command}/llms.txt` };
    },
    improvements_list: async (args: Record<string, unknown>) => {
      if (input.improvements === null) return { improvements: [], note: "the improvements ledger is not reachable" };
      return cached("improvements_list", args, async () => {
        const pkg = str(args, "package").toLowerCase();
        const kind = str(args, "kind").toLowerCase();
        const since = str(args, "since");
        let rows: Array<Record<string, unknown>> = [];
        try { rows = await input.improvements!(); } catch { return { improvements: [], note: "the improvements ledger did not answer" }; }
        rows = rows.filter((e) => (pkg === "" || JSON.stringify(e["scope"] ?? "").toLowerCase().includes(pkg))
          && (kind === "" || String(e["kind"] ?? "").toLowerCase() === kind)
          && (since === "" || String(e["date"] ?? "") >= since || String(e["version"] ?? "") >= since));
        return { improvements: rows.slice(0, num(args, "limit", 20, 100)) };
      });
    },
    improvements_get: async (args: Record<string, unknown>) => {
      const id = str(args, "id");
      if (input.improvements === null) throw { reason: "unavailable", message: "the improvements ledger is not reachable" };
      const rows = await input.improvements();
      const row = rows.find((e) => e["id"] === id || e["slug"] === id);
      if (row === undefined) throw { reason: "not_found", message: `no improvement ${id}` };
      return row;
    },
    // the original three, kept for agents already configured against them
    search: (args: Record<string, unknown>) => docsSearch(args),
  };
}
