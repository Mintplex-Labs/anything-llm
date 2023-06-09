import React from "react";
import DefaultChatContainer from "../../components/DefaultChat";
import Sidebar from "../../components/Sidebar";
import SidebarPlaceholder from "../../components/Sidebar/Placeholder";
import ChatPlaceholder from "../../components/WorkspaceChat/LoadingChat";
import PasswordModal, {
  usePasswordModal,
} from "../../components/Modals/Password";

export default function Main() {
  const { requiresAuth } = usePasswordModal();
  if (requiresAuth === null || requiresAuth) {
    return (
      <>
        {requiresAuth && <PasswordModal />}
        <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
          <SidebarPlaceholder />
          <ChatPlaceholder />
        </div>
      </>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      <Sidebar />
      <DefaultChatContainer />
    </div>
  );
}
