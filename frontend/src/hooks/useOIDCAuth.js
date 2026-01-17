import { useEffect, useState } from "react";
import System from "@/models/system";

/**
 * Checks if OAuth/OIDC impersonation mode is enabled.
 * Returns the OAuth configuration including the login URL.
 * @returns {{loading: boolean, oauthConfig: {enabled: boolean, loginUrl: string | null}}}
 */
export default function useOIDCAuth() {
  const [loading, setLoading] = useState(true);
  const [oauthConfig, setOauthConfig] = useState({
    enabled: false,
    loginUrl: null,
  });

  useEffect(() => {
    async function checkOAuthConfig() {
      try {
        const settings = await System.keys();
        setOauthConfig({
          enabled: settings?.OAuthEnabled || false,
          loginUrl: settings?.OAuthLoginUrl || null,
        });
      } catch (e) {
        console.error("Failed to check OAuth config:", e);
      } finally {
        setLoading(false);
      }
    }
    checkOAuthConfig();
  }, []);

  return { loading, oauthConfig };
}
