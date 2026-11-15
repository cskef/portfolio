(() => {
  "use strict";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("fk-theme", theme); } catch (e) {}
    syncThemeColor();
    document.dispatchEvent(new CustomEvent("fk:themechange", { detail: { theme } }));
  }

  // Couleur de la barre du navigateur (mobile) alignée sur le thème
  function syncThemeColor() {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  }

  function initTheme() {
    let theme = document.documentElement.getAttribute("data-theme") || "dark";
    applyThemeSilently(theme);

    syncThemeColor();

    const btn = document.getElementById("theme-toggle");
    btn?.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Révélation circulaire depuis le bouton quand le navigateur le permet
      if (document.startViewTransition && !reduce) {
        const r = btn.getBoundingClientRect();
        root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`);
        root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`);
        document.startViewTransition(() => applyTheme(next));
      } else {
        applyTheme(next);
      }
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
