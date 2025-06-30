import { useEffect, useState } from "react";
import System from "../models/system";

/**
 * Hook to fetch the app version.
 * @returns {Object} The app version.
 * @returns {string | null} version - The app version.
 * @returns {boolean} isLoading - Whether the app version is loading.
 */
export default function useAppVersion() {
  const [version, setVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    System.fetchAppVersion()
      .then(setVersion)
      .finally(() => setIsLoading(false));
  }, []);
  return { version, isLoading };
}
