import React from "react";
import { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import { Navigate } from "react-router-dom";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import { API_BASE } from "@/utils/constants";
export default function SuspendedUser() {
  const query = useQuery();
  const { loading, requiresAuth } = usePasswordModal(!!query.get("nt"));
  if (loading) return <FullScreenLoader />;
  if (requiresAuth === false) return <Navigate to={paths.home()} />;
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <h1>
        Your account has been suspended by the admin. Contact your admin and try
        again
      </h1>
      <button
        className="text-white bg-theme-action-menu-item-hover text-left px-4 py-1.5 rounded-md w-fit"
        onClick={() => {
          return (window.location.href = `${API_BASE}/auth`);
        }}
      >
        Return to login
      </button>
    </div>
  );
}
