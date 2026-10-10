// Despia docs - the little the pages do in the browser: appearance, search, the phone menu, copy buttons, code tabs,
// the On this page highlight, the package filters and the register-interest form. Everything renders without it.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  // appearance: system -> light -> dark
  const root = document.documentElement;
  $$(".theme-toggle").forEach((b) => b.addEventListener("click", () => {
    const cur = root.dataset.theme || "system";
    const next = cur === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark") : cur === "light" ? "dark" : "light";
    root.dataset.theme = next; store.set("despia-docs-theme", next);
  }));

  // copy code
  $$(".code-copy").forEach((b) => b.addEventListener("click", async () => {
    const code = b.closest(".code").querySelector("pre").innerText;
    try { await navigator.clipboard.writeText(code); b.classList.add("done"); setTimeout(() => b.classList.remove("done"), 1400); } catch {}
  }));
  // copy page (the page's markdown twin)
  $$("[data-copy-page]").forEach((b) => b.addEventListener("click", async () => {
    try {
      const text = await (await fetch(b.dataset.copyPage)).text();
      await navigator.clipboard.writeText(text);
      const label = b.querySelector("span"); const was = label.textContent; label.textContent = "Copied"; setTimeout(() => (label.textContent = was), 1400);
    } catch {}
  }));

  // code groups
  $$(".code-group").forEach((g) => {
    const tabs = $$("[role=tab]", g);
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", String(x === t)));
      $$(".code-pane", g).forEach((p) => (p.hidden = p.dataset.pane !== t.dataset.tab));
    }));
  });

  // On this page
  const tocLinks = $$(".toc a[href^='#']");
  if (tocLinks.length) {
    const targets = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    const onScroll = () => {
      let cur = targets[0];
      for (const t of targets) if (t.getBoundingClientRect().top < 120) cur = t;
      tocLinks.forEach((a) => a.classList.toggle("active", a.hash.slice(1) === cur?.id));
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // phone menu
  const sheet = $(".sheet-backdrop");
  $$(".menu-btn").forEach((b) => b.addEventListener("click", () => { sheet.hidden = false; document.body.style.overflow = "hidden"; }));
  const closeSheet = () => { sheet.hidden = true; document.body.style.overflow = ""; };
  sheet?.addEventListener("click", (e) => { if (e.target === sheet || e.target.closest(".sheet-close")) closeSheet(); });

  // search
  const dlg = $(".dialog-backdrop");
  const input = $(".search-field input");
  const list = $(".search-results");
  let index = null; let sel = 0;
  const open = async () => {
    dlg.hidden = false; input.value = ""; input.focus(); render("");
    if (!index) { try { index = await (await fetch("/search.json")).json(); } catch { index = []; } render(input.value); }
  };
  const close = () => { dlg.hidden = true; };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function render(q) {
    if (!index) { list.innerHTML = `<div class="search-empty">Loading…</div>`; return; }
    const n = q.trim().toLowerCase();
    let hits = index;
    if (n) {
      hits = index.map((p) => {
        const t = p.title.toLowerCase(); const x = (p.text || "").toLowerCase();
        const score = t === n ? 100 : t.startsWith(n) ? 60 : t.includes(n) ? 40 : (p.headings || []).some((h) => h.toLowerCase().includes(n)) ? 20 : x.includes(n) ? 5 : 0;
        return { p, score };
      }).filter((h) => h.score).sort((a, b) => b.score - a.score).map((h) => h.p);
    } else hits = index.filter((p) => p.featured);
    hits = hits.slice(0, 12); sel = 0;
    list.innerHTML = hits.length ? hits.map((p, i) => `<a href="${p.url}" aria-selected="${i === 0}"><span class="r-title">${esc(p.title)}</span><span class="r-meta">${esc(p.section)}${p.description ? " · " + esc(p.description) : ""}</span></a>`).join("")
      : `<div class="search-empty">No results for “${esc(q)}”</div>`;
  }
  $$(".search-trigger, .search-btn-compact").forEach((b) => b.addEventListener("click", open));
  input?.addEventListener("input", () => render(input.value));
  dlg?.addEventListener("click", (e) => { if (e.target === dlg) close(); });
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.hidden ? open() : close(); }
    else if (e.key === "/" && dlg.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    else if (!dlg.hidden) {
      const items = $$("a", list);
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1)));
        items.forEach((a, i) => a.setAttribute("aria-selected", String(i === sel))); items[sel]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && items[sel]) location.href = items[sel].href;
    } else if (e.key === "Escape" && sheet && !sheet.hidden) closeSheet();
  });

  // register interest (POST /v1/waitlist on api.despia.com)
  $$("[data-notify]").forEach((box) => {
    const toggle = $("[data-notify-open]", box); const form = $("form", box); const msg = $(".notify-msg", box);
    toggle?.addEventListener("click", () => { form.hidden = false; toggle.hidden = true; $("input", form).focus(); });
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $("input", form).value.trim();
      const say = (state, text) => { msg.hidden = false; msg.dataset.state = state; msg.textContent = text; };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return say("error", "Enter a valid email address.");
      const btn = $("button", form); btn.disabled = true;
      try {
        const r = await fetch(box.dataset.endpoint, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({ email, topic: box.dataset.topic, source: "docs", consent: true }) });
        if (r.ok) { form.hidden = true; say("ok", "Thanks. We'll email you when the production release is ready."); }
        else say("error", "That did not go through. Try again in a moment.");
      } catch { say("error", "That did not go through. Try again in a moment."); }
      btn.disabled = false;
    });
  });

  // package catalog filters
  const cat = $("[data-catalog]");
  if (cat) {
    const state = { q: "", status: "all", group: "all" };
    const cards = $$(".pk", cat); const groups = $$(".pk-group", cat); const count = $(".pk-count"); const empty = $(".pk-empty", cat);
    const apply = () => {
      let shown = 0;
      cards.forEach((c) => {
        const ok = (state.status === "all" || c.dataset.status === state.status) && (state.group === "all" || c.dataset.group === state.group)
          && (!state.q || c.dataset.search.includes(state.q));
        c.hidden = !ok; if (ok) shown++;
      });
      groups.forEach((g) => (g.hidden = !$$(".pk:not([hidden])", g).length));
      if (count) count.textContent = `${shown} package${shown === 1 ? "" : "s"}`;
      if (empty) empty.hidden = shown > 0;
    };
    $(".pk-search input")?.addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); apply(); });
    $$("[data-status]", $(".segmented")).forEach((b) => b.addEventListener("click", () => {
      state.status = b.dataset.status; $$("button", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); apply();
    }));
    $$(".chip[data-group]").forEach((b) => b.addEventListener("click", () => {
      state.group = b.dataset.group; $$(".chip[data-group]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); apply();
    }));
    apply();
  }
})();
