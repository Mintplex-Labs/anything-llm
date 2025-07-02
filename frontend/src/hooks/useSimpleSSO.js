import { useEffect, useState } from "react";
import System from "@/models/system";

/**
 * Checks if Simple SSO is enabled and if the user should be redirected to the SSO login page.
 * @returns {{loading: boolean, ssoConfig: {enabled: boolean, noLogin: boolean}}}
 */
export default function useSimpleSSO() {
  const [loading, setLoading] = useState(true);
  const [ssoConfig, setSsoConfig] = useState({
    enabled: false,
    noLogin: false,
  });

  useEffect(() => {
    async function checkSsoConfig() {
      try {
        const settings = await System.keys();
        setSsoConfig({
          enabled: settings?.SimpleSSOEnabled,
          noLogin: settings?.SimpleSSONoLogin,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkSsoConfig();
  }, []);

  return { loading, ssoConfig };
}
