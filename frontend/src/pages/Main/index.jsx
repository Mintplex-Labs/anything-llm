import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Home from "./Home";
import DefaultChatContainer from "@/components/DefaultChat";
import NoWorkspaceAccess from "@/components/NoWorkspaceAccess";
import { isMobile } from "react-device-detect";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";
import { userFromStorage } from "@/utils/request";
import useWorkspaceAccess from "@/hooks/useWorkspaceAccess";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const { hasAccess, loading: workspaceLoading } = useWorkspaceAccess();

  if (loading || workspaceLoading) return <FullScreenLoader />;
  if (requiresAuth !== false)
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;

  const user = userFromStorage();
  
  const getMainComponent = () => {
    if (user?.role === "admin") {
      return <Home />;
    }
    
    if (user?.role === "default") {
      if (hasAccess === false) {
        return <NoWorkspaceAccess />;
      }
      return <DefaultChatContainer />;
    }
    
    if (user?.role === "manager") {
      if (hasAccess === false) {
        return <Home />;
      }
      return <DefaultChatContainer />;
    }
    
    return <DefaultChatContainer />;
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile ? <Sidebar /> : <SidebarMobileHeader />}
      {getMainComponent()}
    </div>
  );
}
