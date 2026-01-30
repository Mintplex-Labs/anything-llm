import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import { useState, useEffect } from "react";
import {
  getSystemTheme,
  normalizeThemeSetting,
  resolveTheme,
  THEME_OPTIONS,
} from "@/utils/theme";

const availableThemes = THEME_OPTIONS;

/**
 * Determines the current theme of the application
 * @returns {{theme: ('system' | 'dark' | 'light'), setTheme: function, availableThemes: object}} The current theme, a function to set the theme, and the available themes
 */
export function useTheme() {
  const [theme, _setTheme] = useState(() => {
    return normalizeThemeSetting(localStorage.getItem("theme"));
  });
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  useEffect(() => {
    if (!window?.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event) => setSystemTheme(event.matches ? "light" : "dark");

    // Safari < 14 uses addListener/removeListener.
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : resolveTheme(theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.body.classList.toggle("light", resolvedTheme === "light");
    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    _setTheme(normalizeThemeSetting(newTheme));
  }

  return { theme, setTheme, availableThemes };
}
