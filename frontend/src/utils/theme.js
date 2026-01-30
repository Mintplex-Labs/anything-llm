const THEME_STORAGE_KEY = "theme";

export const THEME_OPTIONS = Object.freeze({
  system: "System",
  dark: "Dark",
  light: "Light",
});

export function normalizeThemeSetting(value) {
  if (value === "default") return "dark"; 
  if (value === "system" || value === "dark" || value === "light") return value;
  return "system";
}

export function getSystemTheme() {
  if (!window?.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(themeSetting) {
  const normalized = normalizeThemeSetting(themeSetting);
  return normalized === "system" ? getSystemTheme() : normalized;
}

export function getStoredThemeSetting() {
  try {
    return normalizeThemeSetting(window?.localStorage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

export function getResolvedThemeFromStorage() {
  return resolveTheme(getStoredThemeSetting());
}

