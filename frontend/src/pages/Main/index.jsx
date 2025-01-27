import React from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";
import paths from "@/utils/paths";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth) return window.location.replace(paths.login());

  return (
    <>
      <UserMenu>
        <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
          {!isMobile && <Sidebar />}
          <DefaultChatContainer />
        </div>
      </UserMenu>
    </>
  );
}
