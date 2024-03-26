import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import {
  ArrowUUpLeft,
  ChatText,
  Cube,
  Database,
  Wrench,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link, NavLink, useParams } from "react-router-dom";
import ChatSettings from "./ChatSettings";
import GeneralAppearance from "./GeneralAppearance";
import VectorDatabase from "./VectorDatabase";
import MetaResponse from "./MetaResponse";

const TABS = {
  "general-appearance": GeneralAppearance,
  "chat-settings": ChatSettings,
  "vector-database": VectorDatabase,
  "meta-response": MetaResponse,
};

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

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      try {
        const _workspace = await Workspace.bySlug(slug);
        if (!_workspace) {
          setLoading(false);
          return;
        }

        // const metaResponseSettings =
        //   _workspace.metaResponseSettings &&
        //   JSON.parse(_workspace.metaResponseSettings);

        const suggestedMessages = await Workspace.getSuggestedMessages(slug);
        setWorkspace({
          ..._workspace,
          suggestedMessages,
          // metaResponseSettings,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error getting suggested messages for workspace:", error);
      }
    }
    getWorkspace();
  }, [slug]);

  if (loading) return <FullScreenLoader />;

  const TabContent = TABS[tab];
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
      >
        <div className="flex gap-x-10 pt-6 pb-4 ml-16 mr-8 border-b-2 border-white border-opacity-10">
          <Link
            to={paths.workspace.chat(slug)}
            className="absolute top-2 left-2 md:top-4 md:left-4 transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border z-10"
          >
            <ArrowUUpLeft className="h-5 w-5" weight="fill" />
          </Link>
          <TabItem
            title="General Settings"
            icon={<Wrench className="h-6 w-6" />}
            to={paths.workspace.settings.generalAppearance(slug)}
          />
          <TabItem
            title="Chat Settings"
            icon={<ChatText className="h-6 w-6" />}
            to={paths.workspace.settings.chatSettings(slug)}
          />
          <TabItem
            title="Vector Database"
            icon={<Database className="h-6 w-6" />}
            to={paths.workspace.settings.vectorDatabase(slug)}
          />
          {workspace.metaResponse && (
            <TabItem
              title="Meta Response"
              icon={<Cube className="h-6 w-6" />}
              to={paths.workspace.settings.metaResponse(slug)}
            />
          )}
        </div>
        <div className="px-16 py-6">
          <TabContent
            slug={slug}
            workspace={workspace}
            setWorkspace={setWorkspace}
          />
        </div>
      </div>
    </div>
  );
}

function TabItem({ title, icon, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive
            ? "text-sky-400 pb-4 border-b-[4px] -mb-[19px] border-sky-400"
            : "text-white/60 hover:text-sky-400"
        } ` + " flex gap-x-2 items-center font-medium"
      }
    >
      {icon}
      <div>{title}</div>
    </NavLink>
  );
}
