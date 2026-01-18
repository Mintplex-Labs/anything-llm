import React, { useEffect, useState } from "react";
import { FullScreenLoader } from "@/components/Preloader";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import {
  AUTH_TIMESTAMP,
  AUTH_TOKEN,
  AUTH_USER,
  OIDC_ID_TOKEN,
  OAUTH_ENABLED,
} from "@/utils/constants";
import System from "@/models/system";

/**
 * OAuth callback handler page.
 * Receives token and id_token from the backend OAuth callback,
 * stores them in localStorage, and redirects to the home page.
 */
export default function OAuthCallback() {
  const query = useQuery();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const token = query.get("token");
        const idToken = query.get("id_token");
        const errorParam = query.get("error");

        if (errorParam) {
          throw new Error(decodeURIComponent(errorParam).replace(/_/g, " "));
        }

        if (!token) {
          throw new Error("No authentication token received.");
        }

        // Clear any existing auth data
        window.localStorage.removeItem(AUTH_USER);
        window.localStorage.removeItem(AUTH_TOKEN);
        window.localStorage.removeItem(AUTH_TIMESTAMP);
        window.localStorage.removeItem(OIDC_ID_TOKEN);

        // Validate the token with the backend
        const valid = await System.checkAuth(token);
        if (!valid) {
          throw new Error("Authentication token validation failed.");
        }

        // Store authentication data
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.localStorage.setItem(AUTH_TIMESTAMP, Number(new Date()));
        window.localStorage.setItem(OAUTH_ENABLED, "true");

        // Store OIDC id_token for logout
        if (idToken) {
          window.localStorage.setItem(OIDC_ID_TOKEN, idToken);
        }

        // Fetch and store user info
        const userInfo = await System.refreshUser();
        if (!userInfo?.user) {
          throw new Error("Failed to fetch user information. Please try again.");
        }
        window.localStorage.setItem(AUTH_USER, JSON.stringify(userInfo.user));

        setReady(true);
      } catch (e) {
        console.error("OAuth callback error:", e);
        setError(e.message);
      }
    }

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-primary flex items-center justify-center flex-col gap-4">
        <p className="text-theme-text-primary font-mono text-lg">{error}</p>
        <p className="text-theme-text-secondary font-mono text-sm">
          Please try again or contact the system administrator.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-4 px-4 py-2 bg-primary-button text-white rounded-lg hover:bg-primary-button/90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (ready) {
    window.location.replace(paths.home());
    return null;
  }

  return <FullScreenLoader />;
}
