import React from "react";
import useLogo from "@/hooks/useLogo";
import useQuery from "@/hooks/useQuery";
import illustration from "@/media/illustrations/login-illustration.svg";

/**
 * OAuth/OIDC Login page component.
 * Displays a "Sign in with SSO" button that redirects to the OAuth login endpoint.
 * @param {Object} props
 * @param {string} props.loginUrl - The OAuth login URL to redirect to
 */
export default function OIDCLogin({ loginUrl }) {
  const { loginLogo } = useLogo();
  const query = useQuery();
  const error = query.get("error");

  const handleSSOLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-theme-bg-primary flex flex-col md:flex-row items-center justify-center">
      <div
        style={{
          background: `
            radial-gradient(circle at center, transparent 40%, var(--theme-bg-primary) 100%),
            linear-gradient(180deg, #85F8FF 0%, #65A6F2 100%)
          `,
          width: "575px",
          filter: "blur(150px)",
          opacity: "0.4",
        }}
        className="absolute left-0 top-0 z-0 h-full w-full"
      />
      <div className="hidden md:flex md:w-1/2 md:h-full md:items-center md:justify-center">
        <img
          className="w-full h-full object-contain z-50"
          src={illustration}
          alt="login illustration"
        />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 z-50 relative md:-mt-20 mt-0 !border-none bg-theme-bg-secondary md:bg-transparent">
        <img
          src={loginLogo}
          alt="Logo"
          className="hidden relative md:flex rounded-2xl w-fit m-4 z-30 md:top-12 absolute max-h-[65px]"
          style={{ objectFit: "contain" }}
        />
        <div className="flex flex-col gap-y-4 w-full max-w-[400px] px-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-2">
              <p className="text-red-500 text-sm text-center">
                {decodeURIComponent(error).replace(/_/g, " ")}
              </p>
            </div>
          )}
          <p className="text-theme-text-secondary text-center mb-4">
            Sign in with your organization account
          </p>
          <button
            onClick={handleSSOLogin}
            className="w-full py-3 px-4 bg-primary-button text-white font-semibold rounded-lg hover:bg-primary-button/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Sign in with SSO
          </button>
        </div>
      </div>
    </div>
  );
}
