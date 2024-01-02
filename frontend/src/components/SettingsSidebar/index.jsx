import React, { useRef } from "react";
import paths from "../../utils/paths";
import useLogo from "../../hooks/useLogo";
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
  X,
  FileCode,
  Plugs,
} from "@phosphor-icons/react";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";

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
          <div className="h-[100%] flex flex-col w-full justify-between pt-4 overflow-y-hidden">
            <div className="h-auto sidebar-items">
              <div className="flex flex-col gap-y-2 h-[65vh] pb-8 overflow-y-scroll no-scroll">
                {/* Admin/manager Multi-user Settings */}
                {!!user && user?.role !== "default" && (
                  <>
                    {/* <Option
                      href={paths.settings.system()}
                      btnText="System Preferences"
                      icon={<SquaresFour className="h-5 w-5 flex-shrink-0" />}
                    /> */}
                    {/* <Option
                      href={paths.settings.invites()}
                      btnText="Invitation"
                      icon={
                        <EnvelopeSimple className="h-5 w-5 flex-shrink-0" />
                      }
                    /> */}
                    {/* <Option
                      href={paths.settings.users()}
                      btnText="Users"
                      icon={<Users className="h-5 w-5 flex-shrink-0" />}
                    />
                    <Option
                      href={paths.settings.workspaces()}
                      btnText="Workspaces"
                      icon={<BookOpen className="h-5 w-5 flex-shrink-0" />}
                    /> */}
                  </>
                )}

                <Option
                  href={paths.settings.chats()}
                  btnText="Workspace Chat"
                  icon={<ChatCenteredText className="h-5 w-5 flex-shrink-0" />}
                />

                <Option
                  href={paths.settings.appearance()}
                  btnText="Appearance"
                  icon={<Eye className="h-5 w-5 flex-shrink-0" />}
                />
                {/* <Option
                  href={paths.settings.apiKeys()}
                  btnText="API Keys"
                  icon={<Key className="h-5 w-5 flex-shrink-0" />}
                /> */}

                {(!user || user?.role === "admin") && (
                  <>
                    <Option
                      href={paths.settings.llmPreference()}
                      btnText="LLM Preference"
                      icon={<ChatText className="h-5 w-5 flex-shrink-0" />}
                    />
                    <Option
                      href={paths.settings.embeddingPreference()}
                      btnText="Embedding Preference"
                      icon={<FileCode className="h-5 w-5 flex-shrink-0" />}
                    />
                    <Option
                      href={paths.settings.vectorDatabase()}
                      btnText="Vector Database"
                      icon={<Database className="h-5 w-5 flex-shrink-0" />}
                    />
                    <Option
                      href={paths.settings.dataConnectors.list()}
                      btnText="Data Connectors"
                      icon={<Plugs className="h-5 w-5 flex-shrink-0" />}
                    />
                  </>
                )}
                {/* <Option
                  href={paths.settings.security()}
                  btnText="Security"
                  icon={<Lock className="h-5 w-5 flex-shrink-0" />}
                /> */}
              </div>
            </div>
            <div>
              {/* Footer */}
              <div className="flex justify-center mt-2">
                <div className="flex space-x-4">
                  <Link
                    target="_blank"
                    to={paths.github()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <GithubLogo weight="fill" className="h-5 w-5 " />
                  </Link>
                  <Link
                    target="_blank"
                    to={paths.docs()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <BookOpen weight="fill" className="h-5 w-5 " />
                  </Link>
                  <Link
                    target="_blank"
                    to={paths.discord()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
                  >
                    <DiscordLogo
                      weight="fill"
                      className="h-5 w-5 stroke-slate-200 group-hover:stroke-slate-200"
                    />
                  </Link>
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

const Option = ({ btnText, icon, href }) => {
  const isActive = window.location.hash?.replace("#", "") === href;
  return (
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
  );
};
