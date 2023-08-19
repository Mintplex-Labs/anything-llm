import React, { useEffect, useState } from "react";
import {
  X,
  Archive,
  Lock,
  Users,
  Database,
  MessageSquare,
  Eye,
} from "react-feather";
import SystemSettingsModal, {
  useSystemSettingsModal,
} from "../../Modals/Settings";
import useLogo from "../../../hooks/useLogo";
import System from "../../../models/system";

const OVERLAY_ID = "anything-llm-system-overlay";
const OVERLAY_CLASSES = {
  enabled: ["z-10", "opacity-1"],
  disabled: ["-z-10", "opacity-0"],
};

export default function SettingsOverlay() {
  const { logo } = useLogo();
  const [tab, setTab] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showing, hideModal, showModal } = useSystemSettingsModal();
  const selectTab = (tab = null) => {
    setTab(tab);
    showModal(true);
  };
  const handleModalClose = () => {
    hideModal();
    setTab(null);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div
      id={OVERLAY_ID}
      className="absolute left-0 rounded-[26px] top-0 w-full h-full opacity-0 -z-10 p-[18px] transition-all duration-300 bg-white dark:bg-black-900 flex flex-col overflow-x-hidden items-between"
    >
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
          <button
            onClick={() => {
              setTab(null);
              hideOverlay();
            }}
            className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-stone-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4 " />
          </button>
        </div>
      </div>

      <div className="h-[100%] flex flex-col w-full justify-between pt-4 overflow-y-hidden">
        <div className="h-auto sidebar-items dark:sidebar-items">
          <p className="text-sm leading-loose my-2 text-slate-800 dark:text-slate-200 ">
            Select a setting to configure
          </p>
          {loading ? (
            <div className="flex flex-col gap-y-4 h-[65vh] pb-8 overflow-y-scroll no-scroll">
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
              <div className="rounded-lg w-[90%] h-[36px] bg-stone-600 animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col gap-y-4 h-[65vh] pb-8 overflow-y-scroll no-scroll">
              {!settings?.MultiUserMode && (
                <Option
                  btnText="Appearance"
                  icon={<Eye className="h-4 w-4 flex-shrink-0" />}
                  isActive={tab === "appearance"}
                  onClick={() => selectTab("appearance")}
                />
              )}
              <Option
                btnText="LLM Preference"
                icon={<MessageSquare className="h-4 w-4 flex-shrink-0" />}
                isActive={tab === "llm"}
                onClick={() => selectTab("llm")}
              />
              <Option
                btnText="Vector Database"
                icon={<Database className="h-4 w-4 flex-shrink-0" />}
                isActive={tab === "vectordb"}
                onClick={() => selectTab("vectordb")}
              />
              <Option
                btnText="Export or Import"
                icon={<Archive className="h-4 w-4 flex-shrink-0" />}
                isActive={tab === "exportimport"}
                onClick={() => selectTab("exportimport")}
              />
              {!settings?.MultiUserMode && (
                <>
                  <Option
                    btnText="Password Protection"
                    icon={<Lock className="h-4 w-4 flex-shrink-0" />}
                    isActive={tab === "password"}
                    onClick={() => selectTab("password")}
                  />
                  <Option
                    btnText="Multi User Mode"
                    icon={<Users className="h-4 w-4 flex-shrink-0" />}
                    isActive={tab === "multiuser"}
                    onClick={() => selectTab("multiuser")}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {showing && !!tab && (
        <SystemSettingsModal tab={tab} hideModal={handleModalClose} />
      )}
    </div>
  );
}

const Option = ({ btnText, icon, isActive, onClick }) => {
  return (
    <div className="flex gap-x-2 items-center justify-between">
      <button
        onClick={onClick}
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
      </button>
    </div>
  );
};

function showOverlay() {
  document
    .getElementById(OVERLAY_ID)
    .classList.remove(...OVERLAY_CLASSES.disabled);
  document.getElementById(OVERLAY_ID).classList.add(...OVERLAY_CLASSES.enabled);
}

function hideOverlay() {
  document
    .getElementById(OVERLAY_ID)
    .classList.remove(...OVERLAY_CLASSES.enabled);
  document
    .getElementById(OVERLAY_ID)
    .classList.add(...OVERLAY_CLASSES.disabled);
}

export function useSystemSettingsOverlay() {
  return { showOverlay, hideOverlay };
}
