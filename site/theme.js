// Despia docs: apply the saved appearance before first paint (no flash). Kept external so the page CSP needs no hash.
try { var t = localStorage.getItem("despia-docs-theme"); if (t === "light" || t === "dark") document.documentElement.dataset.theme = t; } catch (e) {}
