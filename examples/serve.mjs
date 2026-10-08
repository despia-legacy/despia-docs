#!/usr/bin/env node
// serve.mjs <dir> [port]: a static server for the examples' web side (no dependencies).
// /x serves x.html when it exists, so /settings works in a plain browser too.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const dir = resolve(process.argv[2] ?? ".");
const port = Number(process.argv[3] ?? 8791);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".dsx": "text/plain; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };

createServer((req, res) => {
  console.log(new Date().toISOString(), req.method, req.url);
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(dir, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  else if (!existsSync(file) && existsSync(file + ".html")) file += ".html";
  if (!file.startsWith(dir) || !existsSync(file)) { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  res.end(readFileSync(file));
}).listen(port, "127.0.0.1", () => console.log(`serving ${dir} on http://127.0.0.1:${port}`));
