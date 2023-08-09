import React, { useEffect, useState } from "react";
import {
  Archive,
  Lock,
  X,
  Users,
  Database,
  MessageSquare,
} from "react-feather";
import ExportOrImportData from "./ExportImport";
import PasswordProtection from "./PasswordProtection";
import System from "../../../models/system";
import MultiUserMode from "./MultiUserMode";
import useUser from "../../../hooks/useUser";
import VectorDBSelection from "./VectorDbs";
import LLMSelection from "./LLMSelection";

const TABS = {
  llm: LLMSelection,
  exportimport: ExportOrImportData,
  password: PasswordProtection,
  multiuser: MultiUserMode,
  vectordb: VectorDBSelection,
};

const noop = () => false;
export default function SystemSettingsModal({ hideModal = noop }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("llm");
  const [settings, setSettings] = useState(null);
  const Component = TABS[selectedTab || "llm"];

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideModal}
      />
      <div className="relative w-full w-full md:w-1/2 max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex flex-col gap-y-1 border-b dark:border-gray-600 px-4 pt-4 ">
            <div className="flex items-start justify-between rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                System Settings
              </h3>
              <button
                onClick={hideModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="staticModal"
              >
                <X className="text-gray-300 text-lg" />
              </button>
            </div>
            <SettingTabs
              selectedTab={selectedTab}
              changeTab={setSelectedTab}
              settings={settings}
              user={user}
            />
          </div>
          {loading ? (
            <div className="w-full flex h-[400px] p-6">
              <div className="w-full flex h-full bg-gray-200 dark:bg-stone-600 animate-pulse rounded-lg" />
            </div>
          ) : (
            <Component hideModal={hideModal} user={user} settings={settings} />
          )}
        </div>
      </div>
    </div>
  );
}

function SettingTabs({ selectedTab, changeTab, settings, user }) {
  if (!settings) {
    return (
      <div className="w-full flex h-[60px] pb-2">
        <div className="w-full flex h-full bg-gray-200 dark:bg-stone-600 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <ul className="flex overflow-x-scroll no-scroll -mb-px text-sm gap-x-2 font-medium text-center text-gray-500 dark:text-gray-400">
      <SettingTab
        active={selectedTab === "llm"}
        displayName="LLM Choice"
        tabName="llm"
        icon={<MessageSquare className="h-4 w-4 flex-shrink-0" />}
        onClick={changeTab}
      />
      <SettingTab
        active={selectedTab === "vectordb"}
        displayName="Vector Database"
        tabName="vectordb"
        icon={<Database className="h-4 w-4 flex-shrink-0" />}
        onClick={changeTab}
      />
      <SettingTab
        active={selectedTab === "exportimport"}
        displayName="Export or Import"
        tabName="exportimport"
        icon={<Archive className="h-4 w-4 flex-shrink-0" />}
        onClick={changeTab}
      />
      {!settings?.MultiUserMode && (
        <>
          <SettingTab
            active={selectedTab === "multiuser"}
            displayName="Multi User Mode"
            tabName="multiuser"
            icon={<Users className="h-4 w-4 flex-shrink-0" />}
            onClick={changeTab}
          />
          <SettingTab
            active={selectedTab === "password"}
            displayName="Password Protection"
            tabName="password"
            icon={<Lock className="h-4 w-4 flex-shrink-0" />}
            onClick={changeTab}
          />
        </>
      )}
    </ul>
  );
}

function SettingTab({
  active = false,
  displayName,
  tabName,
  icon = "",
  onClick,
}) {
  const classes = active
    ? "text-blue-600 border-blue-600 active dark:text-blue-400 dark:border-blue-400 bg-blue-500 bg-opacity-5"
    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  return (
    <li className="mr-2">
      <button
        disabled={active}
        onClick={() => onClick(tabName)}
        className={
          "flex items-center gap-x-1 p-4 border-b-2 rounded-t-lg group whitespace-nowrap " +
          classes
        }
      >
        {icon} {displayName}
      </button>
    </li>
  );
}

export function useSystemSettingsModal() {
  const [showing, setShowing] = useState(false);
  const showModal = () => {
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
