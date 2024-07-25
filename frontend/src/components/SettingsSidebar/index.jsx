import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import {
  Robot,
  Flask,
  Gear,
  UserCircleGear,
  PencilSimpleLine,
  Nut,
  Toolbox,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import showToast from "@/utils/toast";
import System from "@/models/system";
import Option from "./MenuOption";
import { FineTuningAlert } from "@/pages/FineTuning/Banner";

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const { logo } = useLogo();
  const { user } = useUser();
  const sidebarRef = useRef(null);

  return (
    <>
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
                    hidden={
                      user?.hasOwnProperty("role") && user.role !== "admin"
                    }
                    to={paths.settings.privacy()}
                    className="text-darker hover:text-white text-xs leading-[18px] mx-3"
                  >
                    {t("settings.privacy")}
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
      <FineTuningAlert />
    </>
  );
}

function SupportEmail() {
  const { t } = useTranslation();
  return (
    <Link
      to={paths.mailToMintplex()}
      className="text-darker hover:text-white text-xs leading-[18px] mx-3 mt-1"
    >
      {t("settings.contact")}
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
          btnText: t("settings.voice-speech"),
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
          btnText: t("settings.workspace-chats"),
          href: paths.settings.chats(),
          flex: true,
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
    <HoldToReveal key="exp_features">
      <Option
        btnText={t("settings.experimental-features")}
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
