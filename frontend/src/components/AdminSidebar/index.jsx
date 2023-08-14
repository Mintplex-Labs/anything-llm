import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Eye,
  GitHub,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "react-feather";
import IndexCount from "../Sidebar/IndexCount";
import LLMStatus from "../Sidebar/LLMStatus";
import paths from "../../utils/paths";
import Discord from "../Icons/Discord";
import useLogo from "../../hooks/useLogo";

export default function AdminSidebar() {
  const { logo } = useLogo();
  const sidebarRef = useRef(null);

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100% - 32px)" }}
        className="transition-all duration-500 relative m-[16px] rounded-[26px] bg-white dark:bg-black-900 min-w-[15.5%] p-[18px] "
      >
        <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
          {/* Header Information */}
          <div className="flex w-full items-center justify-between">
            <div className="flex shrink-0 max-w-[50%] items-center justify-start">
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
                className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-stone-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Primary Body */}
          <div className="h-[100%] flex flex-col w-full justify-between pt-4 overflow-y-hidden">
            <div className="h-auto sidebar-items dark:sidebar-items">
              <div className="flex flex-col gap-y-4 h-[65vh] pb-8 overflow-y-scroll no-scroll">
                <Option
                  href={paths.admin.system()}
                  btnText="System Preferences"
                  icon={<Settings className="h-4 w-4 flex-shrink-0" />}
                />
                <Option
                  href={paths.admin.invites()}
                  btnText="Invitation Management"
                  icon={<Mail className="h-4 w-4 flex-shrink-0" />}
                />
                <Option
                  href={paths.admin.users()}
                  btnText="User Management"
                  icon={<Users className="h-4 w-4 flex-shrink-0" />}
                />
                <Option
                  href={paths.admin.workspaces()}
                  btnText="Workspace Management"
                  icon={<BookOpen className="h-4 w-4 flex-shrink-0" />}
                />
                <Option
                  href={paths.admin.chats()}
                  btnText="Workspace Chat Management"
                  icon={<MessageSquare className="h-4 w-4 flex-shrink-0" />}
                />
                <Option
                  href={paths.admin.appearance()}
                  btnText="Appearance"
                  icon={<Eye className="h-4 w-4 flex-shrink-0" />}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-y-2">
                <div className="w-full flex items-center justify-between">
                  <LLMStatus />
                  <IndexCount />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between mt-2">
                <div className="flex gap-x-1 items-center">
                  <a
                    href={paths.github()}
                    className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                  >
                    <GitHub className="h-4 w-4 " />
                  </a>
                  <a
                    href={paths.docs()}
                    className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                  >
                    <BookOpen className="h-4 w-4 " />
                  </a>
                  <a
                    href={paths.discord()}
                    className="transition-all duration-300 p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-800 group"
                  >
                    <Discord className="h-4 w-4 stroke-slate-400 group-hover:stroke-slate-200 dark:group-hover:stroke-slate-200" />
                  </a>
                </div>
                <a
                  href={paths.mailToMintplex()}
                  className="transition-all duration-300 text-xs text-slate-200 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  @MintplexLabs
                </a>
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
      <div className="flex justify-between relative top-0 left-0 w-full rounded-b-lg px-2 pb-4 bg-white dark:bg-black-900 text-slate-800 dark:text-slate-200">
        <button
          onClick={() => setShowSidebar(true)}
          className="rounded-md bg-stone-200 p-2 flex items-center justify-center text-slate-800 hover:bg-stone-300 group dark:bg-stone-800 dark:text-slate-200 dark:hover:bg-stone-900 dark:border dark:border-stone-800"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex shrink-0 w-fit items-center justify-start">
          <img
            src={logo}
            alt="Logo"
            className="rounded w-full max-h-[40px]"
            style={{ objectFit: "contain" }}
          />
        </div>
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
          }  duration-500 fixed top-0 left-0 bg-black-900 bg-opacity-75 w-screen h-screen`}
          onClick={() => setShowSidebar(false)}
        />
        <div
          ref={sidebarRef}
          className="h-[100vh] fixed top-0 left-0  rounded-r-[26px] bg-white dark:bg-black-900 w-[70%] p-[18px] "
        >
          <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
            {/* Header Information */}
            <div className="flex w-full items-center justify-between">
              <div className="flex shrink-0 w-fit items-center justify-start">
                <img
                  src={logo}
                  alt="Logo"
                  className="rounded w-full max-h-[40px]"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex gap-x-2 items-center text-slate-500">
                <a
                  href={paths.home()}
                  className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-stone-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Primary Body */}
            <div className="h-full flex flex-col w-full justify-between pt-4 overflow-y-hidden ">
              <div className="h-auto md:sidebar-items md:dark:sidebar-items">
                <div
                  style={{ height: "calc(100vw - -3rem)" }}
                  className=" flex flex-col gap-y-4 pb-8 overflow-y-scroll no-scroll"
                >
                  <Option
                    href={paths.admin.system()}
                    btnText="System Preferences"
                    icon={<Settings className="h-4 w-4 flex-shrink-0" />}
                  />
                  <Option
                    href={paths.admin.invites()}
                    btnText="Invitation Management"
                    icon={<Mail className="h-4 w-4 flex-shrink-0" />}
                  />
                  <Option
                    href={paths.admin.users()}
                    btnText="User Management"
                    icon={<Users className="h-4 w-4 flex-shrink-0" />}
                  />
                  <Option
                    href={paths.admin.workspaces()}
                    btnText="Workspace Management"
                    icon={<BookOpen className="h-4 w-4 flex-shrink-0" />}
                  />
                  <Option
                    href={paths.admin.chats()}
                    btnText="Workspace Chat Management"
                    icon={<MessageSquare className="h-4 w-4 flex-shrink-0" />}
                  />
                  <Option
                    href={paths.admin.appearance()}
                    btnText="Appearance"
                    icon={<Eye className="h-4 w-4 flex-shrink-0" />}
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-y-2">
                  <div className="w-full flex items-center justify-between">
                    <LLMStatus />
                    <IndexCount />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between mt-2">
                  <div className="flex gap-x-1 items-center">
                    <a
                      href={paths.github()}
                      className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                    >
                      <GitHub className="h-4 w-4 " />
                    </a>
                    <a
                      href={paths.docs()}
                      className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                    >
                      <BookOpen className="h-4 w-4 " />
                    </a>
                    <a
                      href={paths.discord()}
                      className="transition-all duration-300 p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-800 group"
                    >
                      <Discord className="h-4 w-4 stroke-slate-400 group-hover:stroke-slate-200 dark:group-hover:stroke-slate-200" />
                    </a>
                  </div>
                  <a
                    href={paths.mailToMintplex()}
                    className="transition-all duration-300 text-xs text-slate-200 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    @MintplexLabs
                  </a>
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
  const isActive = window.location.pathname === href;
  return (
    <div className="flex gap-x-2 items-center justify-between">
      <a
        href={href}
        className={`flex flex-grow w-[75%] h-[36px] gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center ${
          isActive
            ? "bg-gray-100 dark:bg-stone-600"
            : "hover:bg-slate-100 dark:hover:bg-stone-900 "
        }`}
      >
        {icon}
        <p className="text-slate-800 dark:text-slate-200 text-xs leading-loose font-semibold whitespace-nowrap overflow-hidden ">
          {btnText}
        </p>
      </a>
    </div>
  );
};
