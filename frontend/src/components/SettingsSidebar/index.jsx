import React, { useRef } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import {
  ChatCenteredText,
  Eye,
  ChatText,
  Database,
  X,
  FileCode,
  Plugs,
  Notepad,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Footer from "../Footer";

export default function SettingsSidebar() {
  const { logo } = useLogo();
  const { user } = useUser();
  const sidebarRef = useRef(null);

  return (
    <>
      <div
        ref={sidebarRef}
        className="transition-all duration-500 relative m-[16px] rounded-[26px] bg-sidebar border-4 border-accent min-w-[250px] p-[18px]"
      >
        <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
          {/* Header Information */}
          <div className="flex w-full items-center justify-between">
            <div className="flex shrink-0 max-w-[65%] items-center justify-start ml-2">
              <img
                src={logo}
                alt="Logo"
                className="rounded max-h-[40px] max-w-[100%]"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="flex gap-x-2 items-center text-slate-500">
              <Link
                to={paths.home()}
                className="transition-all duration-300 p-2 flex items-center justify-center rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              >
                <X className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="text-white text-opacity-60 text-sm font-medium uppercase mt-4 mb-0 ml-2">
            Settings
          </div>
          {/* Primary Body */}
          <div className="h-full flex flex-col w-full justify-between pt-4 overflow-y-scroll no-scroll">
            <div className="h-auto sidebar-items">
              {/* Options */}
              <div className="flex flex-col gap-y-2 h-full pb-8 overflow-y-scroll no-scroll">
                <SidebarOptions user={user} />
              </div>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Option = ({
  btnText,
  icon,
  href,
  childLinks = [],
  flex = false,
  user = null,
  allowedRole = [],
  subOptions = null,
  hidden = false,
}) => {
  if (hidden) return null;

  const hasActiveChild = childLinks.includes(
    window.location.hash?.replace("#", "")
  );
  const isActive = window.location.hash?.replace("#", "") === href;

  // Option only for multi-user
  if (!flex && !allowedRole.includes(user?.role)) return null;

  // Option is dual-mode, but user exists, we need to check permissions
  if (flex && !!user && !allowedRole.includes(user?.role)) return null;

  return (
    <>
      <div className="flex gap-x-2 items-center justify-between text-white">
        <Link
          to={href}
          className={`
          transition-all duration-[200ms]
          flex flex-grow w-[75%] h-[36px] gap-x-2 py-[5px] px-4 rounded justify-start items-center border
          ${
            isActive
              ? "bg-menu-item-selected-gradient border-slate-100 border-opacity-50 font-medium"
              : "hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent"
          }
        `}
        >
          {React.cloneElement(icon, { weight: isActive ? "fill" : "regular" })}
          <p className="text-sm leading-loose text-opacity-60 whitespace-nowrap overflow-hidden ">
            {btnText}
          </p>
        </Link>
      </div>
      {!!subOptions && (isActive || hasActiveChild) && (
        <div
          className={`ml-4 ${
            hasActiveChild ? "" : "border-l-2 border-slate-400"
          } rounded-r-lg`}
        >
          {subOptions}
        </div>
      )}
    </>
  );
};

const SidebarOptions = ({ user = null }) => (
  <>
    <Option
      href={paths.settings.chats()}
      btnText="Workspace Chat"
      icon={<ChatCenteredText className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.appearance()}
      btnText="Appearance"
      icon={<Eye className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />

    <Option
      href={paths.settings.llmPreference()}
      btnText="LLM Preference"
      icon={<ChatText className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.embeddingPreference()}
      btnText="Embedding Preference"
      icon={<FileCode className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.vectorDatabase()}
      btnText="Vector Database"
      icon={<Database className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.dataConnectors.list()}
      btnText="Data Connectors"
      icon={<Plugs className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.logs()}
      btnText="Event Logs"
      icon={<Notepad className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
  </>
);
