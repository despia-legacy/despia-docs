#!/usr/bin/env node
// Copies the framework's own highlighter and icon tables into site/vendor (verbatim, Apache-2.0 OpenSource).
//   DESPIA_FRAMEWORK=<framework checkout> node site/sync-vendor.mjs
import { copyFileSync } from "node:fs";
import { join } from "node:path";
const fw = process.env.DESPIA_FRAMEWORK;
if (!fw) { console.error("set DESPIA_FRAMEWORK to a despia-native/framework checkout"); process.exit(2); }
const here = new URL(".", import.meta.url).pathname;
copyFileSync(join(fw, "OpenSource/CodeEditor/src/canonical-grammar.js"), join(here, "vendor/despia-highlight.js"));
copyFileSync(join(fw, "OpenSource/Engine/TypeScript/packages/dom/dist/icons.generated.js"), join(here, "vendor/despia-icons.js"));
copyFileSync(join(fw, "OpenSource/CodeEditor/LICENSE"), join(here, "vendor/LICENSE-despia-opensource"));
console.log("vendor synced from", fw);
