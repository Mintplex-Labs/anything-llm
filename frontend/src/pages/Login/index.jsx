import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";

export default function Login() {
  const { loading, mode } = usePasswordModal();
  if (loading) return <FullScreenLoader />;
  return <PasswordModal mode={mode} />;
}
