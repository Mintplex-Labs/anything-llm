import React, { useEffect, useRef, useState } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import {
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
  House,
  List,
  FileCode,
  Notepad,
  CodeBlock,
  Barcode,
  ClosedCaptioning,
  EyeSlash,
  SplitVertical,
  Microphone,
  Robot,
  Flask,
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
  childLinks = [],
  flex = false,
  user = null,
  allowedRole = [],
  subOptions = null,
  hidden = false,
}) => {
  if (hidden) return null;

  const hasActiveChild = childLinks.includes(window.location.pathname);
  const isActive = window.location.pathname === href;

  // Option only for multi-user
  if (!flex && !allowedRole.includes(user?.role)) return null;

  // Option is dual-mode, but user exists, we need to check permissions
  if (flex && !!user && !allowedRole.includes(user?.role)) return null;

  return (
    <>
      <div className="flex gap-x-2 items-center justify-between">
        <Link
          to={href}
          className={`
          transition-all duration-[200ms]
          flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-[4px] justify-start items-center
          hover:bg-workspace-item-selected-gradient hover:text-white hover:font-medium
          ${
            isActive
              ? "bg-menu-item-selected-gradient font-medium border-outline text-white"
              : "hover:bg-menu-item-selected-gradient text-zinc-200"
          }
        `}
        >
          {React.cloneElement(icon, { weight: isActive ? "fill" : "regular" })}
          <p className="text-sm leading-loose whitespace-nowrap overflow-hidden ">
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

const SidebarOptions = ({ user = null, t }) => (
  <>
    <Option
      href={paths.settings.system()}
      btnText={t("settings.system")}
      icon={<SquaresFour className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.invites()}
      btnText={t("settings.invites")}
      icon={<EnvelopeSimple className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.users()}
      btnText={t("settings.users")}
      icon={<Users className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.workspaces()}
      btnText={t("settings.workspaces")}
      icon={<BookOpen className="h-5 w-5 flex-shrink-0" />}
      user={user}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.chats()}
      btnText={t("settings.workspace-chats")}
      icon={<ChatCenteredText className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />

    <Option
      href={paths.settings.agentSkills()}
      btnText="Agent Skills"
      icon={<Robot className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.appearance()}
      btnText={t("settings.appearance")}
      icon={<Eye className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
    />
    <Option
      href={paths.settings.apiKeys()}
      btnText={t("settings.api-keys")}
      icon={<Key className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.llmPreference()}
      btnText={t("settings.llm")}
      icon={<ChatText className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.audioPreference()}
      btnText="Voice and Speech Support"
      icon={<Microphone className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.transcriptionPreference()}
      btnText={t("settings.transcription")}
      icon={<ClosedCaptioning className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.embedder.modelPreference()}
      childLinks={[paths.settings.embedder.chunkingPreference()]}
      btnText={t("settings.embedder")}
      icon={<FileCode className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
      subOptions={
        <>
          <Option
            href={paths.settings.embedder.chunkingPreference()}
            btnText={t("settings.text-splitting")}
            icon={<SplitVertical className="h-5 w-5 flex-shrink-0" />}
            user={user}
            flex={true}
            allowedRole={["admin"]}
          />
        </>
      }
    />
    <Option
      href={paths.settings.vectorDatabase()}
      btnText={t("settings.vector-database")}
      icon={<Database className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.embedSetup()}
      childLinks={[paths.settings.embedChats()]}
      btnText={t("settings.embeds")}
      icon={<CodeBlock className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
      subOptions={
        <>
          <Option
            href={paths.settings.embedChats()}
            btnText={t("settings.embed-chats")}
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
      btnText={t("settings.security")}
      icon={<Lock className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin", "manager"]}
      hidden={user?.role}
    />
    <Option
      href={paths.settings.logs()}
      btnText={t("settings.event-logs")}
      icon={<Notepad className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.privacy()}
      btnText={t("settings.privacy")}
      icon={<EyeSlash className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <HoldToReveal>
      <Option
        href={paths.settings.experimental()}
        btnText="Experimental Features"
        icon={<Flask className="h-5 w-5 flex-shrink-0" />}
        user={user}
        flex={true}
        allowedRole={["admin"]}
      />
    </HoldToReveal>
  </>
);

function HoldToReveal({ children, holdForMs = 3_000 }) {
  let timeout;
  const [showing, setShowing] = useState(
    window.localStorage.getItem(
      "anythingllm_experimental_feature_preview_unlocked"
    )
  );

  useEffect(() => {
    const onPress = (e) => {
      if (!["Control", "Meta"].includes(e.key)) return;
      timeout = setTimeout(() => {
        setShowing(true);
        // Setting toastId prevents hook spam from holding control too many times or the event not detaching
        showToast("Experimental feature previews unlocked!", {
          toastId: "anythingllm_experimental_feature_preview_unlocked",
        });
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
