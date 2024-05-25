import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import React, { useState } from "react";

import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import { isMobile } from "react-device-detect";
import InsightBotFileUpload from "./InsightBotUploadComponent"; // Ensure the correct import path

export default function InsightBotUpload() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const fetchKeys = async (force = false) => {
    // Implement the logic to fetch keys or other necessary data after file upload
    console.log("Fetching keys...", force);
  };

  const handleSetLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleSetLoadingMessage = (message) => {
    setLoadingMessage(message);
  };

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <UserMenu>
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        {!isMobile && <Sidebar />}
        <div className="flex-grow p-4">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="text-white text-lg">{loadingMessage}</div>
            </div>
          )}
          <InsightBotFileUpload
            fetchKeys={fetchKeys}
            setLoading={handleSetLoading}
            setLoadingMessage={handleSetLoadingMessage}
          />
        </div>
      </div>
    </UserMenu>
  );
}
