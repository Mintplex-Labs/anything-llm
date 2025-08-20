import React from "react";
import "@/index.css";
import { usePasswordModal } from "@/components/Modals/Password";
import SingleUserAuth from "@/components/Modals/Password/SingleUserAuth";
import MultiUserAuth from "@/components/Modals/Password/MultiUserAuth";
import { FullScreenLoader } from "@/components/Preloader";
import { Navigate } from "react-router-dom";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import useSimpleSSO from "@/hooks/useSimpleSSO";
import useLogo from "@/hooks/useLogo";
import { useThemeContext } from "@/ThemeProvider";

/**
 * Login page that handles both single and multi-user login.
 *
 * If Simple SSO is enabled and no login is allowed, the user will be redirected to the SSO login page
 * which may not have a token so the login will fail.
 *
 * @returns {JSX.Element}
 */
export default function Login() {
  const query = useQuery();
  const { loading: ssoLoading, ssoConfig } = useSimpleSSO();
  const { loading, requiresAuth, mode } = usePasswordModal(!!query.get("nt"));
  const { loginLogo } = useLogo();
  const { theme } = useThemeContext();

  if (loading || ssoLoading) return <FullScreenLoader />;
  if (ssoConfig.enabled && ssoConfig.noLogin)
    return <Navigate to={paths.sso.login()} />;
  if (requiresAuth === false) return <Navigate to={paths.home()} />;

  return (
    <div
      className="onenew-page min-h-screen grid place-items-center p-6"
      data-theme={theme}
    >
      <div className="onenew-card w-full max-w-md p-6 md:p-8">
        {loginLogo && (
          <img src={loginLogo} alt="Logo" className="mx-auto h-12" />
        )}
        {mode === "single" ? <SingleUserAuth /> : <MultiUserAuth />}
      </div>
    </div>
  );
}
