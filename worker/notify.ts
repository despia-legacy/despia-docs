//
//  notify.ts - "Get notified" on Coming soon pages (owner 2026-10-10).
//
//  The page's form posts to /notify on this same origin (the page CSP allows form-action and connect-src 'self' only).
//  This route validates the email and forwards ONE JSON body to the waitlist endpoint:
//    { email, topic, source: "docs", consent: true }
//  WAITLIST_URL (a worker var) names the endpoint; default https://api.despia.com/v1/waitlist.
//  Two callers:
//    · docs.js (fetch, Accept: application/json): answers { ok } and the page shows the state inline;
//    · a plain HTML form POST (no JavaScript): answers 303 back to the page with ?notify=ok|invalid|error#notify, and
//      notifyStatus() writes that state into the page's form on the way out.
//  Nothing is stored here and nothing is logged beyond the platform's request log; no tracking.
//
const DEFAULT_WAITLIST = "https://api.despia.com/v1/waitlist";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPIC = /^[a-z0-9][a-z0-9/._-]{0,119}$/;

type Env = Record<string, unknown>;

export const NOTIFY_MESSAGES: Record<string, string> = {
  ok: "Thanks. We'll email you when it's ready.",
  invalid: "Enter a valid email address.",
  error: "That did not go through. Try again in a moment.",
};

async function readBody(request: Request): Promise<{ email: string; topic: string; back: string }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const j = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return { email: String(j["email"] ?? ""), topic: String(j["topic"] ?? ""), back: String(j["back"] ?? "") };
  }
  const form = await request.formData().catch(() => null);
  return { email: String(form?.get("email") ?? ""), topic: String(form?.get("topic") ?? ""), back: String(form?.get("back") ?? "") };
}

/** a same-origin path to return to, never an open redirect */
function safeBack(back: string, request: Request): string {
  const fallback = "/";
  if (back.startsWith("/") && !back.startsWith("//")) return back.split("?")[0].split("#")[0];
  try {
    const ref = new URL(request.headers.get("referer") ?? "");
    if (ref.origin === new URL(request.url).origin) return ref.pathname;
  } catch { /* no referer */ }
  return fallback;
}

export async function handleNotify(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const { email, topic, back } = await readBody(request);
  const answer = (state: "ok" | "invalid" | "error", status: number): Response => wantsJson
    ? new Response(JSON.stringify({ ok: state === "ok", state, message: NOTIFY_MESSAGES[state] }), { status, headers: { "content-type": "application/json" } })
    : new Response(null, { status: 303, headers: { location: `${safeBack(back, request)}?notify=${state}#notify` } });
  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL.test(cleanEmail) || cleanEmail.length > 254 || !TOPIC.test(topic)) return answer("invalid", 400);
  const endpoint = typeof env["WAITLIST_URL"] === "string" && env["WAITLIST_URL"] !== "" ? String(env["WAITLIST_URL"]) : DEFAULT_WAITLIST;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email: cleanEmail, topic, source: "docs", consent: true }),
    });
    return res.ok ? answer("ok", 200) : answer("error", 502);
  } catch {
    return answer("error", 502);
  }
}

/** The no-JavaScript half: a page reached with ?notify=<state> shows that state in its form. */
export function notifyStatus(res: Response, url: URL): Response {
  const state = url.searchParams.get("notify");
  const message = state !== null ? NOTIFY_MESSAGES[state] : undefined;
  if (message === undefined || !(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const Rewriter = (globalThis as unknown as { HTMLRewriter?: new () => { on(sel: string, h: { element(e: { setInnerContent(t: string): void; setAttribute(n: string, v: string): void }): void }): { transform(r: Response): Response } } }).HTMLRewriter;
  if (Rewriter === undefined) return res;
  return new Rewriter().on(".doc-notify-status", {
    element(e) { e.setInnerContent(message); e.setAttribute("data-state", state === "ok" ? "ok" : "error"); },
  }).transform(res);
}
