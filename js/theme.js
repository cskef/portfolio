(() => {
  "use strict";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("fk-theme", theme); } catch (e) {}
    document.dispatchEvent(new CustomEvent("fk:themechange", { detail: { theme } }));
  }

  function initTheme() {
    let theme = document.documentElement.getAttribute("data-theme") || "dark";
    applyThemeSilently(theme);

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Sets the attribute without re-dispatching on first load (already set inline in <head>)
  function applyThemeSilently(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  window.fkTheme = { applyTheme };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
