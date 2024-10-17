import { useState, useEffect } from "react";

const availableThemes = {
  default: "Default",
  light: "Light",
};

/**
 * Determines the current theme of the application
 * @returns {{theme: string, setTheme: function, availableThemes: object}} The current theme, a function to set the theme, and the available themes
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme, availableThemes };
}
