import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import { ChatText, Database, PencilSimpleLine } from "@phosphor-icons/react";
import GeneralInfo from "./GeneralInfo";
import ChatSettings from "./ChatSettings";
import VectorDatabase from "./VectorDatabase";

export default function WorkspaceSettings() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowWorkspaceChat />;
}

function ShowWorkspaceChat() {
  const { slug, tab } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
      });
      setLoading(false);
    }
    getWorkspace();
  }, [slug]);

  const tabClickHandler = (selectedTab) => {
    navigate(`/workspace/${slug}/settings/${selectedTab}`);
  };

  const tabsMapping = {
    "general-info": GeneralInfo,
    "chat-settings": ChatSettings,
    "vector-database": VectorDatabase,
  };

  const TabContent = tabsMapping[tab];

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        <div className="flex gap-x-10 pt-8 pb-4 mx-8 border-b-2 border-white border-opacity-10">
          <TabItem
            title="General Info"
            icon={<PencilSimpleLine className="h-6 w-6" />}
            isActive={tab === "general-info"}
            onClick={() => tabClickHandler("general-info")}
          />
          <TabItem
            title="Chat Settings"
            icon={<ChatText className="h-6 w-6" />}
            isActive={tab === "chat-settings"}
            onClick={() => tabClickHandler("chat-settings")}
          />
          <TabItem
            title="Vector Database"
            icon={<Database className="h-6 w-6" />}
            isActive={tab === "vector-database"}
            onClick={() => tabClickHandler("vector-database")}
          />
        </div>
        <div className="px-8 py-6">
          <TabContent slug={slug} workspace={workspace} />
        </div>
      </div>
    </div>
  );
}

function TabItem({ title, icon, isActive, onClick }) {
  return (
    <button
      className={`flex gap-x-2 text-sky-400 text-white/60 hover:text-sky-400 font-medium ${
        isActive ? "text-sky-400" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <div>{title}</div>
    </button>
  );
}
