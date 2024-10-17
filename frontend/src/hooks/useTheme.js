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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    if (localStorage.getItem("theme") !== null) return; // no need to set theme if it's already set
    if (!window.matchMedia) return; // no need to set theme if the browser doesn't support it
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return setTheme("light");
    setTheme("default");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme, availableThemes };
}
