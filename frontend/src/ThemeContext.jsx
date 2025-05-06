import React, { createContext, useContext } from "react";
import { useTheme } from "./hooks/useTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
