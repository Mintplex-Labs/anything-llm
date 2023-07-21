import React from "react";
import DefaultChatContainer from "../../components/DefaultChat";
import Sidebar from "../../components/Sidebar";
import SidebarPlaceholder from "../../components/Sidebar/Placeholder";
import ChatPlaceholder from "../../components/WorkspaceChat/LoadingChat";
import PasswordModal, {
  usePasswordModal,
} from "../../components/Modals/Password";
import { isMobile } from "react-device-detect";

export default function Main() {
  const { requiresAuth, mode } = usePasswordModal();
  if (requiresAuth === null || requiresAuth) {
    return (
      <>
        {requiresAuth && <PasswordModal mode={mode} />}
        <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
          {!isMobile && <SidebarPlaceholder />}
          <ChatPlaceholder />
        </div>
      </>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      {!isMobile && <Sidebar />}
      <DefaultChatContainer />
    </div>
  );
}
