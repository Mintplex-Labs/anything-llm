import React from "react";
import DefaultChatContainer from "../../components/DefaultChat";
import Sidebar from "../../components/Sidebar";
import { usePasswordModal } from "../../components/Modals/Password";
import { FullScreenLoader } from "../../components/Preloader";
import { FineTuningAlert } from "../FineTuning/Banner";

export default function Main() {
  const { loading } = usePasswordModal();
  if (loading) return <FullScreenLoader />;

  return (
    <>
      <div
        style={{ height: "calc(100vh - 40px)" }}
        className="w-screen overflow-hidden bg-sidebar flex"
      >
        <Sidebar />
        <DefaultChatContainer />
      </div>
      <FineTuningAlert />
    </>
  );
}
