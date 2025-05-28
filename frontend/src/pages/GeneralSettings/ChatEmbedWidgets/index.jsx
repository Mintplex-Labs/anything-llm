import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import { FullScreenLoader } from "@/components/Preloader";
import { useTranslation } from "react-i18next";
import EmbedConfigsView from "./EmbedConfigs";
import EmbedChatsView from "./EmbedChats";

export default function ChatEmbedWidgets() {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState("configs");
  const [showViewModal, setShowViewModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll"
      >
        <div className="flex h-full">
          {/* Left Panel - Navigation */}
          <div
            className={`h-full ${isMobile && !showViewModal ? "w-full" : "w-[300px]"} border-r border-theme-border-primary`}
          >
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-theme-border-primary">
                <h2 className="text-lg font-bold text-theme-text-primary">
                  {t("chat-embed-widgets.title", "Chat Embed Widgets")}
                </h2>
                <p className="text-sm text-theme-text-secondary mt-1">
                  {t(
                    "chat-embed-widgets.description",
                    "Manage your chat embed configurations and view chat history."
                  )}
                </p>
              </div>

              {/* Navigation Items */}
              <div className="flex-grow overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedView("configs");
                    if (isMobile) setShowViewModal(true);
                  }}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-theme-hover ${
                    selectedView === "configs" ? "bg-theme-selected" : ""
                  }`}
                >
                  <span className="text-theme-text-primary">
                    Embed Configurations
                  </span>
                  {selectedView === "configs" && (
                    <CaretRight className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedView("chats");
                    if (isMobile) setShowViewModal(true);
                  }}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-theme-hover ${
                    selectedView === "chats" ? "bg-theme-selected" : ""
                  }`}
                >
                  <span className="text-theme-text-primary">Embed Chats</span>
                  {selectedView === "chats" && (
                    <CaretRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div
            className={`h-full ${
              isMobile
                ? showViewModal
                  ? "w-full absolute inset-0 bg-theme-bg-secondary"
                  : "hidden"
                : "flex-grow"
            }`}
          >
            {isMobile && showViewModal && (
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-2 left-2 p-2 text-theme-text-primary hover:bg-theme-hover rounded-lg"
              >
                <CaretLeft className="h-6 w-6" />
              </button>
            )}
            <div className="p-4 md:p-8 h-full overflow-y-auto">
              {selectedView === "configs" ? (
                <EmbedConfigsView />
              ) : (
                <EmbedChatsView />
              )}
            </div>
          </div>
        </div>

        {hasChanges && (
          <ContextualSaveBar
            onSave={() => {
              // Handle save
              setHasChanges(false);
            }}
            onCancel={() => {
              // Handle cancel
              setHasChanges(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
