import { useState, useEffect } from "react";

const availableThemes = {
  default: "Default",
  light: "Light",
};

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme, availableThemes };
}
