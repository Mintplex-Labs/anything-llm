import React, { useEffect, useState } from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Home from "./Home";
import DefaultChatContainer from "@/components/DefaultChat";
import { isMobile } from "react-device-detect";
import Sidebar from "@/components/Sidebar";
import System from "@/models/system";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const [ismultiUser, setIsMultiUser] = useState(false);

  useEffect(() => {
    async function checkMultiUserMode() {
      const isMultiUser = await System.isMultiUserMode();
      setIsMultiUser(isMultiUser);
    }
    checkMultiUserMode();
  }, []);

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {ismultiUser ? (
        <>
          {!isMobile && <Sidebar />}
          <DefaultChatContainer />
        </>
      ) : (
        <Home />
      )}
    </div>
  );
}
