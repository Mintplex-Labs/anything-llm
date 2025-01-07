import React from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <>
      <UserMenu>
        <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
          {!isMobile && <Sidebar />}
          <DefaultChatContainer />
        </div>
      </UserMenu>
    </>
  );
}
