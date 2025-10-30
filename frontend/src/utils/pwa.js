/**
 * Detects if the application is running as a standalone PWA
 * @returns {boolean} True if running as standalone PWA
 */
export function isStandalonePWA() {
  if (typeof window === "undefined") return false;

  // Check if running in standalone mode (PWA installed)
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true || // iOS Safari
    document.referrer.includes("android-app://"); // Android TWA

  return isStandalone;
}
