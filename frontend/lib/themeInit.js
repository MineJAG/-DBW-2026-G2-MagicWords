"use strict";

const THEME_KEY = "theme";

/**
 * Apply the saved light/dark theme to `<html>` before React mounts, so the
 * page never flashes the wrong theme on load. Reads `theme` from
 * `localStorage`, defaulting to `"dark"`.
 *
 * Runs imperatively (not through `ThemeContext`) because no React tree
 * exists yet at this point in the boot.
 *
 * @returns {void}
 */
export default function initializeTheme() {
  const savedTheme =
    localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(savedTheme);
}
