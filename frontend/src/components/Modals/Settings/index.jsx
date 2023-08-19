import React, { useEffect, useState } from "react";
import { X } from "react-feather";
import ExportOrImportData from "./ExportImport";
import PasswordProtection from "./PasswordProtection";
import System from "../../../models/system";
import MultiUserMode from "./MultiUserMode";
import useUser from "../../../hooks/useUser";
import VectorDBSelection from "./VectorDbs";
import LLMSelection from "./LLMSelection";
import Appearance from "./Appearance";

export const TABS = {
  llm: LLMSelection,
  exportimport: ExportOrImportData,
  password: PasswordProtection,
  multiuser: MultiUserMode,
  vectordb: VectorDBSelection,
  appearance: Appearance,
};

const noop = () => false;
export default function SystemSettingsModal({ tab = null, hideModal = noop }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const Component = TABS[tab || "llm"];

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
