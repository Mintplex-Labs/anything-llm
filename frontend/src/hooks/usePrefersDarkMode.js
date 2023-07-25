export default function usePrefersDarkMode() {
  if (window?.matchMedia) {
    if (window?.matchMedia("(prefers-color-scheme: dark)")?.matches) {
      return true;
    }
    return false;
  }
  return false;
}
