import React, { createContext, useContext, useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { paletteStore } from "./palettes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const themeValue = useTheme();

  useEffect(() => {
    paletteStore.refresh();
  }, []);

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
