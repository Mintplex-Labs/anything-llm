import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import {
  ChatCenteredText,
  Eye,
  ChatText,
  Database,
  FileCode,
  Notepad,
  Key,
  ClosedCaptioning,
  EyeSlash,
  SplitVertical,
  Microphone,
  Robot,
  Flask,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import showToast from "@/utils/toast";

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const { logo } = useLogo();
  const { user } = useUser();
  const sidebarRef = useRef(null);

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
      href={paths.settings.apiKeys()}
      btnText="API Keys"
      icon={<Key className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
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
      href={paths.settings.llmPreference()}
      btnText={t("settings.llm")}
      icon={<ChatText className="h-5 w-5 flex-shrink-0" />}
      user={user}
      flex={true}
      allowedRole={["admin"]}
    />
    <Option
      href={paths.settings.audioPreference()}
      btnText="Text-to-speech Support"
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
