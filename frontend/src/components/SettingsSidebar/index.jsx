import React, { useEffect, useRef, useState } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import {
  House,
  List,
  Robot,
  Flask,
  Gear,
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
import System from "@/models/system";
import Option from "./MenuOption";

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
                    <SupportEmail />
                    <Link
                      hidden={
                        user?.hasOwnProperty("role") && user.role !== "admin"
                      }
                      to={paths.settings.privacy()}
                      className="text-darker hover:text-white text-xs leading-[18px] mx-3"
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
                <SupportEmail />
                <Link
                  hidden={user?.hasOwnProperty("role") && user.role !== "admin"}
                  to={paths.settings.privacy()}
                  className="text-darker hover:text-white text-xs leading-[18px] mx-3"
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

function SupportEmail() {
  const [supportEmail, setSupportEmail] = useState(paths.mailToMintplex());

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(
        supportEmail?.email
          ? `mailto:${supportEmail.email}`
          : paths.mailToMintplex()
      );
    };
    fetchSupportEmail();
  }, []);

  return (
    <Link
      to={supportEmail}
      className="text-darker hover:text-white text-xs leading-[18px] mx-3 mt-1"
    >
      Contact Support
    </Link>
  );
}

const SidebarOptions = ({ user = null, t }) => (
  <>
    <Option
      btnText={t("settings.ai-providers")}
      icon={<Gear className="h-5 w-5 flex-shrink-0" />}
      user={user}
      childOptions={[
        {
          btnText: t("settings.llm"),
          href: paths.settings.llmPreference(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.vector-database"),
          href: paths.settings.vectorDatabase(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.embedder"),
          href: paths.settings.embedder.modelPreference(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.text-splitting"),
          href: paths.settings.embedder.chunkingPreference(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: "Voice & Speech",
          href: paths.settings.audioPreference(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.transcription"),
          href: paths.settings.transcriptionPreference(),
          flex: true,
          roles: ["admin"],
        },
      ]}
    />
    <Option
      btnText={t("settings.admin")}
      icon={<UserCircleGear className="h-5 w-5 flex-shrink-0" />}
      user={user}
      childOptions={[
        {
          btnText: t("settings.users"),
          href: paths.settings.users(),
          roles: ["admin", "manager"],
        },
        {
          btnText: t("settings.workspaces"),
          href: paths.settings.workspaces(),
          roles: ["admin", "manager"],
        },
        {
          btnText: t("settings.workspace-chats"),
          href: paths.settings.chats(),
          flex: true,
          roles: ["admin", "manager"],
        },
        {
          btnText: t("settings.invites"),
          href: paths.settings.invites(),
          roles: ["admin", "manager"],
        },
        {
          btnText: t("settings.system"),
          href: paths.settings.system(),
          roles: ["admin", "manager"],
        },
      ]}
    />
    <Option
      btnText={t("settings.agent-skills")}
      icon={<Robot className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.agentSkills()}
      user={user}
      flex={true}
      roles={["admin"]}
    />
    <Option
      btnText={t("settings.customization")}
      icon={<PencilSimpleLine className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.appearance()}
      user={user}
      flex={true}
      roles={["admin", "manager"]}
    />
    <Option
      btnText={t("settings.tools")}
      icon={<Toolbox className="h-5 w-5 flex-shrink-0" />}
      user={user}
      childOptions={[
        {
          btnText: t("settings.embed-chats"),
          href: paths.settings.embedChats(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.embeds"),
          href: paths.settings.embedSetup(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.event-logs"),
          href: paths.settings.logs(),
          flex: true,
          roles: ["admin"],
        },
        {
          btnText: t("settings.api-keys"),
          href: paths.settings.apiKeys(),
          flex: true,
          roles: ["admin"],
        },
      ]}
    />
    <Option
      btnText={t("settings.security")}
      icon={<Nut className="h-5 w-5 flex-shrink-0" />}
      href={paths.settings.security()}
      user={user}
      flex={true}
      roles={["admin", "manager"]}
      hidden={user?.role}
    />
    <HoldToReveal key="exp_features">
      <Option
        btnText="Experimental Features"
        icon={<Flask className="h-5 w-5 flex-shrink-0" />}
        href={paths.settings.experimental()}
        user={user}
        flex={true}
        roles={["admin"]}
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
