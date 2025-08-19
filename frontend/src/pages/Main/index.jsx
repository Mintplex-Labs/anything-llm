import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Home from "./Home";
import DefaultChatContainer from "@/components/DefaultChat";
import AppLayout from "@/layouts/AppLayout";
import { userFromStorage } from "@/utils/request";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false)
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;

  const user = userFromStorage();
  return (
    <AppLayout>
      {!!user && user?.role !== "admin" ? <DefaultChatContainer /> : <Home />}
    </AppLayout>
  );
}
