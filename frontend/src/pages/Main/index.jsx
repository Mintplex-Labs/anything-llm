import React from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import WelcomeChecklist from "./WelcomeChecklist";
import Home from "./Home";
import Appearance from "@/models/appearance";
export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const { legacyHomeScreen } = Appearance.getSettings();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {legacyHomeScreen ? (
        <>
          {!isMobile && <Sidebar />}
          <DefaultChatContainer />
        </>
      ) : (
        <Home />
      )}

      {/* <WelcomeChecklist /> */}
    </div>
  );
}
