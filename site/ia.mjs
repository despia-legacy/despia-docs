//
//  ia.mjs - THE information architecture of the Despia V4 docs, declared once (PLAN.md shows the same tree).
//  Top tabs = the sections. Each section's sidebar = its groups, in reading order. A page that is in the tree but has no
//  content file yet builds as a short "being written" page so no link in the chrome is ever a 404.
//  section ids are also the export's `section` field (dist/docs-index.json): dsx | convert | packages | ship | home.
//
export const SECTIONS = [
  {
    id: "dsx", label: "DSX", href: "/dsx", badge: "Research preview",
    groups: [
      { title: "Get started", pages: [
        ["/dsx", "What is DSX", "The framework for real native apps: one document, every platform, operable by AI agents."],
        ["/dsx/quickstart", "Quickstart", "Scaffold a DSX app, run it, edit it, build it."],
        ["/dsx/project", "Project structure", "dsx.json, dsx.config.json, Components/ and Modules/: what each file is for."],
      ] },
      { title: "The model", pages: [
        ["/dsx/documents", "Pages and components", "A .dsx document is markup, CSS and code in one file. Components compose with slots."],
        ["/dsx/data", "Data and state", "Variables, formulas, actions and APIs: state that drives the screen."],
        ["/dsx/styling", "Styling is CSS", "Standard CSS in style= and <style> sheets. No styling attributes."],
        ["/dsx/attributes", "Attributes are data", "Attributes carry data into a component; presentation never rides on them."],
      ] },
      { title: "Building", pages: [
        ["/dsx/native-ui", "Native UI", "The built-in elements and components, drawn natively on each platform."],
        ["/dsx/navigation", "Navigation", "Routes, tabs, stacks, sheets and deep links."],
        ["/dsx/packages", "Native features", "Add a package and call dsx.module from any page."],
        ["/dsx/platforms", "iOS, Android and web", "What each platform renders and how one document adapts to it."],
      ] },
      { title: "Tools", pages: [
        ["/dsx/cli", "The despia CLI", "Create, run, lint, build and ship from the terminal."],
        ["/dsx/console", "The console", "Projects, builds, store connections and your team."],
        ["/dsx/agents", "Use Despia with your AI agent", "Connect mcp.despia.com or the local MCP server, and install the skills."],
        ["/dsx/agents/skills", "Agent skills", "The skills that teach a coding agent to write DSX."],
      ] },
    ],
  },
  {
    id: "convert", label: "Convert", href: "/convert",
    groups: [
      { title: "Get started", pages: [
        ["/convert", "Convert overview", "Bring your existing web app into a native iOS and Android app, today."],
        ["/convert/quickstart", "Quickstart", "From your web app's URL to a build on your phone."],
      ] },
      { title: "Moving over", pages: [
        ["/convert/from-v3", "Moving from Despia V3", "Your V3 calls keep working. Move each one when you are ready."],
      ] },
    ],
  },
  {
    id: "packages", label: "Packages", href: "/packages",
    groups: [], // the catalog builds its own sidebar from data/packages.json (site/packages.mjs)
  },
  {
    id: "ship", label: "Build and ship", href: "/ship",
    groups: [
      { title: "Before your first build", pages: [
        ["/ship", "Shipping overview", "From a project to the App Store and Google Play."],
        ["/ship/app-store-connect", "App Store Connect key", "Create the API key Despia uses to sign and upload iOS builds."],
        ["/ship/google-play", "Google Play service account", "Create the service account Despia uses to upload Android builds."],
      ] },
      { title: "Builds and releases", pages: [
        ["/ship/builds", "Builds", "Start a build, follow it, and download what it made."],
        ["/ship/releases", "Releases", "TestFlight, internal testing and store review."],
        ["/app-review", "App Review", "The App Store and Google Play rules apps run into, and how to pass them."],
      ] },
    ],
  },
];

export const sectionOf = (route) => {
  if (route === "/") return null;
  for (const s of SECTIONS) {
    if (route === s.href || route.startsWith(s.href + "/")) return s;
    if (s.groups.some((g) => g.pages.some(([r]) => r === route))) return s;
  }
  return null;
};

export const allPages = () => SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.pages.map(([route, title, description]) => ({ route, title, description, section: s.id, group: g.title }))));
