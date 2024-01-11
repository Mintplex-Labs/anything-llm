import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import { Navigate } from "react-router-dom";
import paths from "@/utils/paths";

export default function Login() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  if (loading) return <FullScreenLoader />;
  if (requiresAuth === false) return <Navigate to={paths.home()} />;

  return <PasswordModal mode={mode} />;
}
