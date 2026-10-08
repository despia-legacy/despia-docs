// The web app's own code. Two Despia touch points, both feature-detected, so the same page
// still works in a normal browser.
const session = { name: "Maya Chen", email: "maya@example.com", plan: "Pro" };
const bookings = [
  { id: 1, title: "Morning Flow", when: "Tue 08:00 · Room 2" },
  { id: 2, title: "Strength Basics", when: "Wed 18:30 · Room 1" },
  { id: 3, title: "Yin & Breath", when: "Fri 19:00 · Room 2" },
];

document.getElementById("who").textContent = `Signed in as ${session.name}`;
document.getElementById("bookings").innerHTML = bookings
  .map((b) => `<li><strong>${b.title}</strong><span>${b.when}</span></li>`)
  .join("");

const dsx = window.dsx; // present only inside the app

if (dsx) {
  // 1. Share data: the native screen reads dsx.global.session.
  dsx.global.set("session", session);

  // A default the native screen can toggle (kept if it is already set).
  dsx.global.get("prefs").then((prefs) => {
    if (prefs == null) dsx.global.set("prefs", { reminders: true });
  });

  // 2. Hear back: the native Settings screen writes dsx.global.prefs.
  dsx.global.watch("prefs", (prefs) => {
    const on = prefs && prefs.reminders;
    document.getElementById("reminders").textContent = `Class reminders: ${on ? "on" : "off"}`;
  });

  // 3. Navigate: /settings is a native screen in routes.json. A push keeps the web page
  //    underneath, so Back (and the edge swipe) returns to it.
  document.getElementById("settings").addEventListener("click", (event) => {
    event.preventDefault();
    dsx.module.route.push({ path: "/settings" });
  });
}
