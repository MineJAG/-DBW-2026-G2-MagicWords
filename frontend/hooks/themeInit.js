"use strict";

const THEME_KEY = "theme";

export default function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(savedTheme);
}

//this had to be made so that it doesnt flash when the page loads
//also context could not be called because its in react and this needs to run before react
