import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import { useState, useEffect, useMemo } from "react";

const availableThemes = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function getSystemResolvedTheme() {
  if (!window.matchMedia) return "default";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "default";
}

/**
 * Determines the current theme of the application
 * @returns {{theme: ('system' | 'light' | 'dark'), setTheme: function, availableThemes: object}} The current theme, a function to set the theme, and the available themes
 */
export function useTheme() {
  const [theme, _setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "default") return "dark"; // migrate legacy value
    return stored || "system";
  });

  const [systemTheme, setSystemTheme] = useState(getSystemResolvedTheme);

  // Listen for OS theme changes
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => setSystemTheme(e.matches ? "light" : "default");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Resolve to the CSS data-theme value: "default" (dark) or "light"
  const resolvedTheme = useMemo(() => {
    if (theme === "system") return systemTheme;
    if (theme === "light") return "light";
    return "default"; // dark
  }, [theme, systemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.body.classList.toggle("light", resolvedTheme === "light");
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
  }, [resolvedTheme, theme]);

  // In development, attach keybind combinations to toggle theme
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    function toggleOnKeybind(e) {
      if (e.metaKey && e.key === ".") {
        e.preventDefault();
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    }
    document.addEventListener("keydown", toggleOnKeybind);
    return () => document.removeEventListener("keydown", toggleOnKeybind);
  }, []);

  /**
   * Sets the theme of the application and runs any
   * other necessary side effects
   * @param {string} newTheme The new theme to set
   */
  function setTheme(newTheme) {
    _setTheme(newTheme);
  }

  return { theme, setTheme, availableThemes };
}
