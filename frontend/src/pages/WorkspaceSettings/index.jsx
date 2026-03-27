import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import {
  ArrowUUpLeft,
  ChatText,
  Database,
  Robot,
  User,
  UserFocus,
  Wrench,
} from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { Link, Navigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import GeneralAppearance from "./GeneralAppearance";
import ChatSettings from "./ChatSettings";
import VectorDatabase from "./VectorDatabase";
import Members from "./Members";
import WorkspaceAgentConfiguration from "./AgentConfig";
import Personalization from "./Personalization";
import useUser from "@/hooks/useUser";
import { useTranslation } from "react-i18next";
import System from "@/models/system";

const TABS = {
  "general-appearance": GeneralAppearance,
  "chat-settings": ChatSettings,
  "vector-database": VectorDatabase,
  members: Members,
  "agent-config": WorkspaceAgentConfiguration,
  personalization: Personalization,
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
  const { t } = useTranslation();
  const { slug, tab } = useParams();
  const { user } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(false);

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }

      const _settings = await System.keys();
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setWorkspace({
        ..._workspace,
        vectorDB: _settings?.VectorDB,
        suggestedMessages,
      });
      setMemoryEnabled(_settings?.MemoryEnabled === true);

      setLoading(false);
    }
    getWorkspace();
  }, [slug, tab]);

  if (loading) return <FullScreenLoader />;

  const isDefaultUser = user?.role === "default";

  // Redirect away from personalization tab when feature is disabled
  if (tab === "personalization" && !memoryEnabled) {
    if (isDefaultUser) {
      return <Navigate to={paths.workspace.chat(slug)} />;
    }
    return <Navigate to={paths.workspace.settings.generalAppearance(slug)} />;
  }

  // Default users can only access the personalization tab
  if (isDefaultUser && tab !== "personalization") {
    if (memoryEnabled) {
      return <Navigate to={paths.workspace.settings.personalization(slug)} />;
    }
    return <Navigate to={paths.workspace.chat(slug)} />;
  }

  const TabContent = TABS[tab];
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll"
      >
        <div className="flex gap-x-10 pt-6 pb-4 ml-16 mr-8 border-b-2 border-white light:border-theme-chat-input-border border-opacity-10">
          <Link
            to={paths.workspace.chat(slug)}
            className="absolute top-2 left-2 md:top-4 md:left-4 transition-all duration-300 p-2 rounded-full text-white bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover z-10"
          >
            <ArrowUUpLeft className="h-5 w-5" weight="fill" />
          </Link>
          <TabItem
            title={t("workspaces—settings.general")}
            icon={<Wrench className="h-6 w-6" />}
            to={paths.workspace.settings.generalAppearance(slug)}
            visible={!isDefaultUser}
          />
          <TabItem
            title={t("workspaces—settings.chat")}
            icon={<ChatText className="h-6 w-6" />}
            to={paths.workspace.settings.chatSettings(slug)}
            visible={!isDefaultUser}
          />
          <TabItem
            title={t("workspaces—settings.vector")}
            icon={<Database className="h-6 w-6" />}
            to={paths.workspace.settings.vectorDatabase(slug)}
            visible={!isDefaultUser}
          />
          <TabItem
            title={t("workspaces—settings.members")}
            icon={<User className="h-6 w-6" />}
            to={paths.workspace.settings.members(slug)}
            visible={["admin", "manager"].includes(user?.role)}
          />
          <TabItem
            title={t("workspaces—settings.agent")}
            icon={<Robot className="h-6 w-6" />}
            to={paths.workspace.settings.agentConfig(slug)}
            visible={!isDefaultUser}
          />
          <TabItem
            title={t("workspaces—settings.personalization")}
            icon={<UserFocus className="h-6 w-6" />}
            to={paths.workspace.settings.personalization(slug)}
            visible={memoryEnabled}
          />
        </div>
        <div className="px-16 py-6">
          <TabContent slug={slug} workspace={workspace} />
        </div>
      </div>
    </div>
  );
}

function TabItem({ title, icon, to, visible = true }) {
  if (!visible) return null;
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
