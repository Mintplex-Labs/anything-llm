import React from "react";
import { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import { Navigate } from "react-router-dom";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import { API_BASE } from "@/utils/constants";
export default function Login() {
  const query = useQuery();
  const { loading, requiresAuth, mode } = usePasswordModal(!!query.get("nt"));
  if (loading) return <FullScreenLoader />;
  if (requiresAuth === false) return <Navigate to={paths.home()} />;
  window.location.href = `${API_BASE}/auth`;
  return null;
}
