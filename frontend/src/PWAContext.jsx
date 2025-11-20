import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Detects if the application is running as a standalone PWA
 * @returns {boolean} True if running as standalone PWA
 */
function isStandalonePWA() {
  if (typeof window === "undefined") return false;

  const matchesStandaloneDisplayMode =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(display-mode: standalone)")?.matches
      : false;

  const isIOSStandalone = window.navigator?.standalone === true; // iOS Safari
  const androidReferrer =
    typeof document !== "undefined" && document?.referrer
      ? document.referrer.includes("android-app://")
      : false;

  return Boolean(
    matchesStandaloneDisplayMode || isIOSStandalone || androidReferrer
  );
}

const PWAModeContext = createContext({ isPWA: false });
export function PWAModeProvider({ children }) {
  const [isPWA, setIsPWA] = useState(() => isStandalonePWA());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : null;

    const updateStatus = () => setIsPWA(isStandalonePWA());

    updateStatus();

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", updateStatus);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(updateStatus);
    }

    window.addEventListener("appinstalled", updateStatus);
    window.addEventListener("visibilitychange", updateStatus);

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener("change", updateStatus);
      } else if (mediaQuery?.removeListener) {
        mediaQuery.removeListener(updateStatus);
      }

      window.removeEventListener("appinstalled", updateStatus);
      window.removeEventListener("visibilitychange", updateStatus);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.body.classList.toggle("pwa", isPWA);
    document.documentElement?.setAttribute(
      "data-pwa",
      isPWA ? "true" : "false"
    );

    return () => {
      document.body.classList.remove("pwa");
      document.documentElement?.removeAttribute("data-pwa");
    };
  }, [isPWA]);

  const value = useMemo(() => ({ isPWA }), [isPWA]);

  return (
    <PWAModeContext.Provider value={value}>{children}</PWAModeContext.Provider>
  );
}

export function usePWAMode() {
  return useContext(PWAModeContext);
}
