import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";

import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import React from "react";
import { isMobile } from "react-device-detect";

export default function InsightBotUpload() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <UserMenu>
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        {!isMobile && <Sidebar />}
        {/* <DefaultChatContainer /> */}
      </div>
    </UserMenu>
  );
}
