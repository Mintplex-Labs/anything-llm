import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import { useState, useEffect } from "react";

const availableThemes = {
  default: "Default",
  light: "Light",
};

/**
 * Determines the current theme of the application
 * @returns {{theme: ('default' | 'light'), setTheme: function, availableThemes: object}} The current theme, a function to set the theme, and the available themes
 */
export function useTheme() {
  const [theme, _setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    if (localStorage.getItem("theme") !== null) return;
    if (!window.matchMedia) return;
    if (window.matchMedia("(prefers-color-scheme: light)").matches)
      return _setTheme("light");
    _setTheme("default");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
  }, [theme]);

  // In development, attach keybind combinations to toggle theme
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    function toggleOnKeybind(e) {
      if (e.metaKey && e.key === ".") {
        e.preventDefault();
        setTheme((prev) => (prev === "light" ? "default" : "light"));
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
