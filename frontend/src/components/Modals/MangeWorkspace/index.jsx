import React, { useState, useEffect, memo } from "react";
import { X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import System from "@/models/system";
import useUser from "@/hooks/useUser";
import DocumentSettings from "./Documents";
import DataConnectors from "./DataConnectors";

const noop = () => {};
const ManageWorkspace = ({ hideModal = noop, providedSlug = null }) => {
  const { slug } = useParams();
  const { user } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [settings, setSettings] = useState({});
  const [selectedTab, setSelectedTab] = useState("documents");

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    getSettings();
  }, []);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(providedSlug ?? slug);
      setWorkspace(workspace);
    }
    fetchWorkspace();
  }, [providedSlug, slug]);

  if (!workspace) return null;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className="absolute max-h-full w-fit transition duration-300 z-20 md:overflow-y-auto py-10">
        <div className="relative bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-2 rounded-t border-gray-500/50 relative">
            <button
              onClick={hideModal}
              type="button"
              className="z-50 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>

          {user?.role !== "default" && (
            <ModalTabSwitcher
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {selectedTab === "documents" ? (
            <DocumentSettings workspace={workspace} systemSettings={settings} />
          ) : (
            <DataConnectors workspace={workspace} systemSettings={settings} />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ManageWorkspace);

const ModalTabSwitcher = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full flex justify-center z-10 relative">
      <div className="gap-x-2 flex justify-center -mt-[68px] mb-10 bg-sidebar-button p-1 rounded-xl shadow border-2 border-slate-300/10 w-fit">
        <button
          onClick={() => setSelectedTab("documents")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold text-white hover:bg-switch-selected hover:bg-opacity-60 ${
            selectedTab === "documents"
              ? "bg-switch-selected shadow-md font-bold"
              : "bg-sidebar-button text-white/20 font-medium hover:text-white"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setSelectedTab("dataConnectors")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold text-white hover:bg-switch-selected hover:bg-opacity-60 ${
            selectedTab === "dataConnectors"
              ? "bg-switch-selected shadow-md font-bold"
              : "bg-sidebar-button text-white/20 font-medium hover:text-white"
          }`}
        >
          Data Connectors
        </button>
      </div>
    </div>
  );
};
export function useManageWorkspaceModal() {
  const { user } = useUser();
  const [showing, setShowing] = useState(false);

  const showModal = () => {
    if (user?.role !== "default") {
      setShowing(true);
    }
  };

  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
