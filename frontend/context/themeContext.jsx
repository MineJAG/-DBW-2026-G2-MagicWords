import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

/**
 * Stores the current theme ("light" or "dark") and keeps it in sync with
 * `localStorage` and the `<html>` tag's class so the CSS can react to it.
 *
 * Starts with whatever was saved in `localStorage["theme"]`, or the system
 * preference if nothing is saved yet.
 *
 * @param {{ children: import("react").ReactNode }}
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to read the current theme and change it.
 *
 * @returns {{
 *   theme: "light" | "dark",   // current theme
 *   setTheme: (value: "light" | "dark") => void,   // switch the theme
 * }}
 */
export function useTheme() {
  return useContext(ThemeContext);
}
