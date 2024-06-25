import React from "react";
import DefaultChatContainer from "../../components/DefaultChat";
import Sidebar from "../../components/Sidebar";
import PasswordModal, {
  usePasswordModal,
} from "../../components/Modals/Password";
import { FullScreenLoader } from "../../components/Preloader";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="w-screen overflow-hidden bg-sidebar flex"
    >
      {" "}
      <Sidebar />
      <DefaultChatContainer />
    </div>
  );
}
