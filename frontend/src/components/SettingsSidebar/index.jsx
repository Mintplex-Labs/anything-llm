import React, { useEffect, useRef, useState } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import {
  DiscordLogo,
  EnvelopeSimple,
  SquaresFour,
  Users,
  BookOpen,
  ChatCenteredText,
  Eye,
  Key,
  ChatText,
  Database,
  Lock,
  GithubLogo,
  House,
  X,
  List,
  FileCode,
  Plugs,
  Notepad,
  CodeBlock,
  Barcode,
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { USER_BACKGROUND_COLOR } from "@/utils/constants";

export default function SettingsSidebar() {
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const { user } = useUser();

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100% - 32px)" }}
        className="transition-all duration-500 relative m-[16px] rounded-[26px] bg-sidebar border-4 border-accent min-w-[250px] p-[18px]"
      >
        <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
          {/* Header Information */}
          <div className="flex w-full items-center justify-between">
            <div className="flex shrink-0 max-w-[65%] items-center justify-start ml-2">
              <img
                src={logo}
                alt="Logo"
                className="rounded max-h-[40px]"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="flex gap-x-2 items-center text-slate-500">
              <a
                href={paths.home()}
                className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="text-white text-opacity-60 text-sm font-medium uppercase mt-4 mb-0 ml-2">
            Settings
          </div>
          {/* Primary Body */}
          <div className="h-[100%] flex flex-col w-full justify-between pt-4 overflow-y-hidden">
            <div className="h-auto sidebar-items">
              <div className="flex flex-col gap-y-2 h-[100%] pb-8 overflow-y-scroll no-scroll">
                <Option
                  href={paths.settings.system()}
                  btnText="System Preferences"
                  icon={<SquaresFour className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  allowedRole={["admin", "manager"]}
                />
                <Option
                  href={paths.settings.invites()}
                  btnText="Invitation"
                  icon={<EnvelopeSimple className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  allowedRole={["admin", "manager"]}
                />
                <Option
                  href={paths.settings.users()}
                  btnText="Users"
                  icon={<Users className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  allowedRole={["admin", "manager"]}
                />
                <Option
                  href={paths.settings.workspaces()}
                  btnText="Workspaces"
                  icon={<BookOpen className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  allowedRole={["admin", "manager"]}
                />
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
                  href={paths.settings.apiKeys()}
                  btnText="API Keys"
                  icon={<Key className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  flex={true}
                  allowedRole={["admin"]}
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
                  href={paths.settings.embedSetup()}
                  childLinks={[paths.settings.embedChats()]}
                  btnText="Embedded Chat"
                  icon={<CodeBlock className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  flex={true}
                  allowedRole={["admin"]}
                  subOptions={
                    <>
                      <Option
                        href={paths.settings.embedChats()}
                        btnText="Embedded Chat History"
                        icon={<Barcode className="h-5 w-5 flex-shrink-0" />}
                        user={user}
                        flex={true}
                        allowedRole={["admin"]}
                      />
                    </>
                  }
                />
                <Option
                  href={paths.settings.security()}
                  btnText="Security"
                  icon={<Lock className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  flex={true}
                  allowedRole={["admin", "manager"]}
                />
                <Option
                  href={paths.settings.logs()}
                  btnText="Events Logs"
                  icon={<Notepad className="h-5 w-5 flex-shrink-0" />}
                  user={user}
                  flex={true}
                  allowedRole={["admin"]}
                />
              </div>
            </div>
            <div>
              {/* Footer */}
              <div className="flex justify-center mt-2">
                <div className="flex space-x-4">
                  <a
                    href={paths.github()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <GithubLogo weight="fill" className="h-5 w-5 " />
                  </a>
                  <a
                    href={paths.docs()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <BookOpen weight="fill" className="h-5 w-5 " />
                  </a>
                  <a
                    href={paths.discord()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <DiscordLogo
                      weight="fill"
                      className="h-5 w-5 stroke-slate-200 group-hover:stroke-slate-200"
                    />
                  </a>
                  {/* <button className="invisible transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border">
                    <DotsThree className="h-5 w-5 group-hover:stroke-slate-200" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SidebarMobileHeader() {
  const { logo } = useLogo();
  const { user } = useUser();
  const sidebarRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBgOverlay, setShowBgOverlay] = useState(false);

  useEffect(() => {
    function handleBg() {
      if (showSidebar) {
        setTimeout(() => {
          setShowBgOverlay(true);
        }, 300);
      } else {
        setShowBgOverlay(false);
      }
    }
    handleBg();
  }, [showSidebar]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-2 bg-sidebar text-slate-200 shadow-lg h-16">
        <button
          onClick={() => setShowSidebar(true)}
          className="rounded-md p-2 flex items-center justify-center text-slate-200"
        >
          <List className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-center flex-grow">
          <img
            src={logo}
            alt="Logo"
            className="block mx-auto h-6 w-auto"
            style={{ maxHeight: "40px", objectFit: "contain" }}
          />
        </div>
        <div className="w-12"></div>
      </div>
      <div
        style={{
          transform: showSidebar ? `translateX(0vw)` : `translateX(-100vw)`,
        }}
        className={`z-99 fixed top-0 left-0 transition-all duration-500 w-[100vw] h-[100vh]`}
      >
        <div
          className={`${
            showBgOverlay
              ? "transition-all opacity-1"
              : "transition-none opacity-0"
          }  duration-500 fixed top-0 left-0 ${USER_BACKGROUND_COLOR} bg-opacity-75 w-screen h-screen`}
          onClick={() => setShowSidebar(false)}
        />
        <div
          ref={sidebarRef}
          className="h-[100vh] fixed top-0 left-0  rounded-r-[26px] bg-sidebar w-[80%] p-[18px] "
        >
          <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
            {/* Header Information */}
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="flex shrink-1 w-fit items-center justify-start">
                <img
                  src={logo}
                  alt="Logo"
                  className="rounded w-full max-h-[40px]"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex gap-x-2 items-center text-slate-500 shrink-0">
                <a
                  href={paths.home()}
                  className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                >
                  <House className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Primary Body */}
            <div className="h-full flex flex-col w-full justify-between pt-4 overflow-y-hidden ">
              <div className="h-auto md:sidebar-items md:dark:sidebar-items">
                <div
                  style={{ height: "calc(100vw-3rem)" }}
                  className=" flex flex-col gap-y-4 pb-8 overflow-y-scroll no-scroll"
                >
                  <Option
                    href={paths.settings.system()}
                    btnText="System Preferences"
                    icon={<SquaresFour className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    allowedRole={["admin", "manager"]}
                  />
                  <Option
                    href={paths.settings.invites()}
                    btnText="Invitation"
                    icon={<EnvelopeSimple className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    allowedRole={["admin", "manager"]}
                  />
                  <Option
                    href={paths.settings.users()}
                    btnText="Users"
                    icon={<Users className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    allowedRole={["admin", "manager"]}
                  />
                  <Option
                    href={paths.settings.workspaces()}
                    btnText="Workspaces"
                    icon={<BookOpen className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    allowedRole={["admin", "manager"]}
                  />
                  <Option
                    href={paths.settings.chats()}
                    btnText="Workspace Chat"
                    icon={
                      <ChatCenteredText className="h-5 w-5 flex-shrink-0" />
                    }
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
                    href={paths.settings.apiKeys()}
                    btnText="API Keys"
                    icon={<Key className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    flex={true}
                    allowedRole={["admin"]}
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
                    href={paths.settings.embedSetup()}
                    childLinks={[paths.settings.embedChats()]}
                    btnText="Embedded Chat"
                    icon={<CodeBlock className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    flex={true}
                    allowedRole={["admin"]}
                    subOptions={
                      <>
                        <Option
                          href={paths.settings.embedChats()}
                          btnText="Embedded Chat History"
                          icon={<Barcode className="h-5 w-5 flex-shrink-0" />}
                          user={user}
                          flex={true}
                          allowedRole={["admin"]}
                        />
                      </>
                    }
                  />
                  <Option
                    href={paths.settings.security()}
                    btnText="Security"
                    icon={<Lock className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    flex={true}
                    allowedRole={["admin", "manager"]}
                  />
                  <Option
                    href={paths.settings.logs()}
                    btnText="Events Logs"
                    icon={<Notepad className="h-5 w-5 flex-shrink-0" />}
                    user={user}
                    flex={true}
                    allowedRole={["admin"]}
                  />
                </div>
              </div>
              <div>
                {/* Footer */}
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-4">
                    <a
                      href={paths.github()}
                      className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                    >
                      <GithubLogo weight="fill" className="h-5 w-5 " />
                    </a>
                    <a
                      href={paths.docs()}
                      className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                    >
                      <BookOpen weight="fill" className="h-5 w-5 " />
                    </a>
                    <a
                      href={paths.discord()}
                      className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                    >
                      <DiscordLogo
                        weight="fill"
                        className="h-5 w-5 stroke-slate-200 group-hover:stroke-slate-200"
                      />
                    </a>
                    {/* <button className="invisible transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border">
                    <DotsThree className="h-5 w-5 group-hover:stroke-slate-200" />
                  </button> */}
                  </div>
                </div>
              </div>
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
}) => {
  const hasActiveChild = childLinks.includes(window.location.pathname);
  const isActive = window.location.pathname === href;

  // Option only for multi-user
  if (!flex && !allowedRole.includes(user?.role)) return null;

  // Option is dual-mode, but user exists, we need to check permissions
  if (flex && !!user && !allowedRole.includes(user?.role)) return null;
  return (
    <>
      <div className="flex gap-x-2 items-center justify-between text-white">
        <a
          href={href}
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
        </a>
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
