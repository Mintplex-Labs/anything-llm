import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import { useState, useEffect, useCallback } from "react";

const availableThemes = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

/**
 * Resolves the effective theme based on user preference and system setting
 * @param {string} preference - The user's theme preference (system, light, dark)
 * @returns {string} The effective theme to apply (light or dark)
 */
function resolveEffectiveTheme(preference) {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  // "system" - detect from OS
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

/**
 * Determines the current theme of the application
 * @returns {{theme: ('system' | 'light' | 'dark'), effectiveTheme: ('light' | 'dark'), setTheme: function, availableThemes: object}}
 */
export function useTheme() {
  const [theme, _setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    // Migrate old "default" to "dark" for users upgrading
    if (stored === "default") return "dark";
    // Only accept valid theme values
    if (stored && availableThemes[stored]) return stored;
    return "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    const stored = localStorage.getItem("theme") || "system";
    return resolveEffectiveTheme(stored);
  });

  // Apply the effective theme to DOM
  const applyTheme = useCallback((effective) => {
    // Use "default" for data-theme when dark (matches ALLM's CSS)
    document.documentElement.setAttribute("data-theme", effective === "light" ? "light" : "default");
    document.body.classList.toggle("light", effective === "light");
    window.dispatchEvent(new Event(REFETCH_LOGO_EVENT));
  }, []);

  // Update effective theme when preference changes
  useEffect(() => {
    const effective = resolveEffectiveTheme(theme);
    setEffectiveTheme(effective);
    applyTheme(effective);
    localStorage.setItem("theme", theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes when "system" is selected
  useEffect(() => {
    if (theme !== "system") return;
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      const effective = resolveEffectiveTheme("system");
      setEffectiveTheme(effective);
      applyTheme(effective);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  // In development, attach keybind combinations to cycle theme
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    function toggleOnKeybind(e) {
      if (e.metaKey && e.key === ".") {
        e.preventDefault();
        _setTheme((prev) => {
          const themes = Object.keys(availableThemes);
          const currentIndex = themes.indexOf(prev);
          return themes[(currentIndex + 1) % themes.length];
        });
      }
    }
    document.addEventListener("keydown", toggleOnKeybind);
    return () => document.removeEventListener("keydown", toggleOnKeybind);
  }, []);

  /**
   * Sets the theme preference of the application
   * @param {string} newTheme The new theme preference (system, light, dark)
   */
  function setTheme(newTheme) {
    _setTheme(newTheme);
  }

  return { theme, effectiveTheme, setTheme, availableThemes };
}
