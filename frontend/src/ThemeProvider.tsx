import React, { createContext, useContext, type ReactNode } from "react";
import { useTheme } from "./hooks/useTheme";

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  availableThemes: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
