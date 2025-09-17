import React, { useEffect, useState } from "react";
import { FullScreenLoader } from "@/components/Preloader";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import System from "@/models/system";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";

export default function SimpleSSOPassthrough() {
  const query = useQuery();
  const redirectPath = query.get("redirectTo") || paths.home();
  const noLoginRedirect = query.get("nlr") || null;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function validateSimpleSSOLoginToken() {
      try {
        if (!query.get("token")) {
          if (!!noLoginRedirect) {
            debugger;
            // If a noLoginRedirect is provided, redirect to that webpage when no token is provided.
            return window.location.replace(noLoginRedirect);
          } else {
            // Otherwise, show no token error
            throw new Error("No token provided.");
          }
        }

        // Clear any existing auth data
        window.localStorage.removeItem(AUTH_USER);
        window.localStorage.removeItem(AUTH_TOKEN);
        window.localStorage.removeItem(AUTH_TIMESTAMP);

        // Validate the token since it's provided. If the token is invalid, show an error
        System.simpleSSOLogin(query.get("token"))
          .then((res) => {
            if (!res.valid) throw new Error(res.message);

            window.localStorage.setItem(AUTH_USER, JSON.stringify(res.user));
            window.localStorage.setItem(AUTH_TOKEN, res.token);
            window.localStorage.setItem(AUTH_TIMESTAMP, Number(new Date()));
            setReady(res.valid);
          })
          .catch((e) => {
            setError(e.message);
          });
      } catch (e) {
        setError(e.message);
      }
    }
    validateSimpleSSOLoginToken();
  }, []);

  if (error) {
    if (!!noLoginRedirect)
      setTimeout(() => {
        window.location.replace(noLoginRedirect);
      }, 8_000);
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-primary flex items-center justify-center flex-col gap-4">
        <p className="text-theme-text-primary font-mono text-lg">{error}</p>
        <p className="text-theme-text-secondary font-mono text-sm">
          Please contact the system administrator about this error.
        </p>
        {!!noLoginRedirect && (
          <p className="text-theme-text-secondary font-mono text-sm">
            You will be redirected to{" "}
            <Link
              className="text-theme-text-primary font-mono text-sm hover:underline"
              to={noLoginRedirect}
            >
              {noLoginRedirect}
            </Link>{" "}
            shortly...
          </p>
        )}
      </div>
    );
  }

  if (ready) return window.location.replace(redirectPath);

  // Loading state by default
  return <FullScreenLoader />;
}
