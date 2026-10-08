// The help center's own script. Inside the app, window.dsx is the same store the native
// screens use; in a browser it is absent and the page is a plain help center.
const dsx = window.dsx;

if (dsx) {
  // Native -> web: the plan the reader picked on the native screen, live.
  dsx.global.watch("plan", (value) => {
    const plan = value || "Free";
    document.getElementById("plan").textContent = `Help for the ${plan} plan`;
    document.getElementById("priority").hidden = plan !== "Pro";
  });
}

for (const button of document.querySelectorAll("[data-topic]")) {
  button.addEventListener("click", () => {
    // Web -> native: the native home screen shows the last topic next to Help Center.
    if (dsx) dsx.global.set("support.lastTopic", button.dataset.topic);
  });
}
