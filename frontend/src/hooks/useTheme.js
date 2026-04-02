import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import { useState, useEffect } from "react";

const availableThemes = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

/**
 * @typedef {'system' | 'light' | 'dark'} ThemeOption
 */

/**
 * @typedef {Object} UseThemeResult
 * @property {ThemeOption} theme - The current theme preference stored in localStorage.
 * @property {(newTheme: ThemeOption) => void} setTheme - Sets the theme preference.
 * @property {{system: string, light: string, dark: string}} availableThemes - Map of theme keys to display names.
 * @property {boolean} isLight - Whether the resolved theme is light (explicitly or via system preference).
 */

/**
 * Determines the current theme of the application.
 * "system" follows the OS preference, "light" and "dark" force that mode.
 * @returns {UseThemeResult}
 */
export function useTheme() {
  const [theme, _setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "default") return "dark"; // migrate legacy value
    return stored || "system";
  });

  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  );

  // Listen for OS level theme changes
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => setSystemTheme(e.matches ? "light" : "dark");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

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
        _setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    }
    document.addEventListener("keydown", toggleOnKeybind);
    return () => document.removeEventListener("keydown", toggleOnKeybind);
  }, []);

  /**
   * Sets the theme of the application and runs any
   * other necessary side effects
   * @param {ThemeOption} newTheme The new theme to set
   */
  function setTheme(newTheme) {
    _setTheme(newTheme);
  }

  return {
    theme,
    setTheme,
    availableThemes,
    isLight: resolvedTheme === "light",
  };
}
