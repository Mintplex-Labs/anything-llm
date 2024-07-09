import React, { useEffect, useRef, useState } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import {
  House,
  List,
  Robot,
  Flask,
  Gear,
  CaretRight,
  UserCircleGear,
  PencilSimpleLine,
  Nut,
  Toolbox,
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { USER_BACKGROUND_COLOR } from "@/utils/constants";
import { isMobile } from "react-device-detect";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import showToast from "@/utils/toast";

export default function SettingsSidebar() {
  const { t } = useTranslation();
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

  if (isMobile) {
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
            className="h-[100vh] fixed top-0 left-0 rounded-r-[26px] bg-sidebar w-[80%] p-[18px]"
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
              <div className="h-full flex flex-col w-full justify-between pt-4 overflow-y-scroll no-scroll">
                <div className="h-auto md:sidebar-items md:dark:sidebar-items">
                  <div className="flex flex-col gap-y-4 pb-[60px] overflow-y-scroll no-scroll">
                    <SidebarOptions user={user} t={t} />
                    <div className="h-[1.5px] bg-[#3D4147] mx-3 mt-[14px]" />
                    <Link
                      to={paths.mailToMintplex()}
                      className="text-[#F4F4F4] hover:text-white text-xs leading-[18px] mx-3 mt-1"
                    >
                      Support
                    </Link>
                    <Link
                      to={paths.settings.privacy()}
                      className="text-[#F4F4F4] hover:text-white text-xs leading-[18px] mx-3"
                    >
                      Privacy & Data
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 pt-2 bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Link
        to={paths.home()}
        className="flex shrink-0 max-w-[55%] items-center justify-start mx-[38px] my-[18px]"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded max-h-[24px]"
          style={{ objectFit: "contain" }}
        />
      </Link>
      <div
        ref={sidebarRef}
        className="transition-all duration-500 relative m-[16px] rounded-[16px] bg-sidebar border-2 border-outline min-w-[250px] p-[10px] h-[calc(100%-76px)]"
      >
        <div className="w-full h-full flex flex-col overflow-x-hidden items-between min-w-[235px]">
          <div className="text-white text-opacity-60 text-sm font-medium uppercase mt-[4px] mb-0 ml-2">
            {t("settings.title")}
          </div>
          <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
            <div className="h-auto sidebar-items">
              <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                <SidebarOptions user={user} t={t} />
                <div className="h-[1.5px] bg-[#3D4147] mx-3 mt-[14px]" />
                <Link
                  to={paths.mailToMintplex()}
                  className="text-[#F4F4F4] hover:text-white text-xs leading-[18px] mx-3 mt-1"
                >
                  Support
                </Link>
                <Link
                  to={paths.settings.privacy()}
                  className="text-[#F4F4F4] hover:text-white text-xs leading-[18px] mx-3"
                >
                  Privacy & Data
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 pt-4 pb-3 rounded-b-[16px] bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md z-10">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
const Option = ({
  btnText,
  icon,
  href,
  childOptions = [],
  flex = false,
  user = null,
  allowedRole = [],
  hidden = false,
  isChild = false,
}) => {
  const storageKey = `anything_llm_menu_${btnText
    .replace(/\s+/g, "_")
    .toLowerCase()}_expanded`;
  const location = window.location.pathname;
  const hasChildren = childOptions.length > 0;

  const [isExpanded, setIsExpanded] = useState(() => {
    if (hasChildren) {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
      return childOptions.some((child) => child.href === location);
    }
    return false;
  });

  useEffect(() => {
    if (hasChildren) {
      const shouldExpand = childOptions.some(
        (child) => child.href === location
      );
      if (shouldExpand && !isExpanded) {
        setIsExpanded(true);
        localStorage.setItem(storageKey, JSON.stringify(true));
      }
    }
  }, [location]);

  if (hidden) return null;
  if (!flex && !allowedRole.includes(user?.role)) return null;
  if (flex && !!user && !allowedRole.includes(user?.role)) return null;

  const isActive = hasChildren
    ? (!isExpanded && childOptions.some((child) => child.href === location)) ||
      location === href
    : location === href;

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);
      localStorage.setItem(storageKey, JSON.stringify(newExpandedState));
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center justify-between w-full
          transition-all duration-300
          rounded-[6px]
          ${
            isActive
              ? "bg-white/5 font-medium border-outline"
              : "hover:bg-white/5"
          }
        `}
      >
        <Link
          to={href}
          className={`flex flex-grow items-center px-[12px] h-[32px] font-medium ${
            isChild ? "text-white/70 hover:text-white" : "text-white"
          }`}
          onClick={hasChildren ? handleClick : undefined}
        >
          {icon}
          <p
            className={`${
              isChild ? "text-xs" : "text-sm"
            } leading-loose whitespace-nowrap overflow-hidden ml-2 ${
              isActive ? "text-white" : ""
            } ${!icon && "pl-5"}`}
          >
            {btnText}
          </p>
        </Link>
        {hasChildren && (
          <button onClick={handleClick} className="p-2 text-white">
            <CaretRight
              size={16}
              weight="bold"
              className={`transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="mt-1 rounded-r-lg w-full">
          {childOptions.map((childOption, index) => (
            <Option
              key={index}
              {...childOption}
              user={user}
              flex={flex}
              allowedRole={childOption.allowedRole || allowedRole}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarOptions = ({ user = null, t }) => (
  <>
    <Option
      btnText={t("settings.ai-providers")}
      icon={<Gear className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
      childOptions={[
        {
          btnText: t("settings.llm"),
          href: paths.settings.llmPreference(),
          allowedRole: ["admin"],
        },
        {
          btnText: t("settings.vector-database"),
          href: paths.settings.vectorDatabase(),
          allowedRole: ["admin"],
        },
        {
          btnText: t("settings.embedder"),
          href: paths.settings.embedder.modelPreference(),
          allowedRole: ["admin"],
        },
        {
          btnText: "Voice & Speech",
          href: paths.settings.audioPreference(),
          allowedRole: ["admin"],
        },
        {
          btnText: t("settings.transcription"),
          href: paths.settings.transcriptionPreference(),
          allowedRole: ["admin"],
        },
      ]}
    />
    <Option
      btnText={t("settings.admin")}
      icon={<UserCircleGear className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
      flex={true}
      childOptions={[
        {
          btnText: t("settings.users"),
          href: paths.settings.users(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.workspaces"),
          href: paths.settings.workspaces(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.workspace-chats"),
          href: paths.settings.chats(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.invites"),
          href: paths.settings.invites(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.system"),
          href: paths.settings.system(),
          allowedRole: ["admin", "manager"],
        },
      ]}
    />
    <Option
      btnText={t("settings.agent-skills")}
      icon={<Robot className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.agentSkills()}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      btnText={t("settings.customization")}
      icon={<PencilSimpleLine className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.appearance()}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      btnText={t("settings.tools")}
      icon={<Toolbox className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
      flex={true}
      childOptions={[
        {
          btnText: t("settings.embed-chats"),
          href: paths.settings.embedChats(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.embeds"),
          href: paths.settings.embedSetup(),
          allowedRole: ["admin", "manager"],
        },
        {
          btnText: t("settings.event-logs"),
          href: paths.settings.logs(),
          allowedRole: ["admin"],
        },
        {
          btnText: t("settings.api-keys"),
          href: paths.settings.apiKeys(),
          allowedRole: ["admin"],
        },
      ]}
    />
    <Option
      btnText={t("settings.security")}
      icon={<Nut className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.security()}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
      hidden={user?.role}
    />
    <HoldToReveal key="exp_features">
      <Option
        btnText="Experimental Features"
        icon={<Flask className="h-5 w-5 flex-shrink-0" />}
        href={paths.settings.experimental()}
        user={user}
        flex={true}
        allowedRole={["admin"]}
      />
    </HoldToReveal>
  </>
);

function HoldToReveal({ children, holdForMs = 3_000 }) {
  let timeout = null;
  const [showing, setShowing] = useState(
    window.localStorage.getItem(
      "anythingllm_experimental_feature_preview_unlocked"
    )
  );

  useEffect(() => {
    const onPress = (e) => {
      if (!["Control", "Meta"].includes(e.key) || timeout !== null) return;
      timeout = setTimeout(() => {
        setShowing(true);
        // Setting toastId prevents hook spam from holding control too many times or the event not detaching
        showToast("Experimental feature previews unlocked!");
        window.localStorage.setItem(
          "anythingllm_experimental_feature_preview_unlocked",
          "enabled"
        );
        window.removeEventListener("keypress", onPress);
        window.removeEventListener("keyup", onRelease);
        clearTimeout(timeout);
      }, holdForMs);
    };
    const onRelease = (e) => {
      if (!["Control", "Meta"].includes(e.key)) return;
      if (showing) {
        window.removeEventListener("keypress", onPress);
        window.removeEventListener("keyup", onRelease);
        clearTimeout(timeout);
        return;
      }
      clearTimeout(timeout);
    };

    if (!showing) {
      window.addEventListener("keydown", onPress);
      window.addEventListener("keyup", onRelease);
    }
    return () => {
      window.removeEventListener("keydown", onPress);
      window.removeEventListener("keyup", onRelease);
    };
  }, []);

  if (!showing) return null;
  return children;
}
