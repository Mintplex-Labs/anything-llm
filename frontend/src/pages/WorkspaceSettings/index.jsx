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
  User,
  Wrench,
} from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import GeneralAppearance from "./GeneralAppearance";
import ChatSettings from "./ChatSettings";
import VectorDatabase from "./VectorDatabase";
import Members from "./Members";
import useUser from "@/hooks/useUser";

const TABS = {
  "general-appearance": GeneralAppearance,
  "chat-settings": ChatSettings,
  "vector-database": VectorDatabase,
  members: Members,
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
  const { user } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <TabItem
            title="Members"
            icon={<User className="h-6 w-6" />}
            to={paths.workspace.settings.members(slug)}
            visible={["admin", "manager"].includes(user?.role)}
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
