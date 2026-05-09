"use strict";

const THEME_KEY = "theme";

// Runs before React mounts so the page does not flash the wrong theme;
// Context cannot be read here because no React tree exists yet.
export default function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(savedTheme);
}
