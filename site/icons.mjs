//
//  icons.mjs - the docs draw the same symbols the framework draws: vendor/despia-icons.js is the DSX DOM's
//  icons.generated.js (OpenSource/Conformance/icons/sf-map.json, Boxicons fill paths + brand marks), copied verbatim.
//  icon("bolt") -> inline <svg>, sized by CSS (1em by default), currentColor unless a brand mark carries its own paint.
//
import { ICON_VECTORS, ICON_BRANDS, ICON_TWIN } from "./vendor/despia-icons.js";

const ALIAS = { "info.circle": "info.circle", "doc.on.doc": "doc.on.doc" };

export function icon(name, cls = "icon") {
  const key = ALIAS[name] ?? name;
  const brand = ICON_BRANDS[key];
  if (brand) {
    const paths = brand.layers.map((l) => {
      const fill = brand.paint === "brand" && l.fill ? l.fill : (brand.ink && brand.ink.startsWith("#") ? brand.ink : "currentColor");
      return `<path d="${l.d}" fill="${fill}"${l.rule ? ` fill-rule="${l.rule}"` : ""}/>`;
    }).join("");
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
  }
  const d = ICON_VECTORS[key] ?? ICON_VECTORS[ICON_TWIN?.[key]] ?? ICON_VECTORS[key.replace(/\.fill$/, "")] ?? ICON_VECTORS[key + ".fill"];
  if (!d) return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`;
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
}

export const hasIcon = (name) => Boolean(ICON_BRANDS[name] || ICON_VECTORS[name] || ICON_VECTORS[name?.replace(/\.fill$/, "")]);
