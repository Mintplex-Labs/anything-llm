import React, { useState, useEffect } from "react";
import { X } from "react-feather";
import DocumentSettings from "./Documents";
import WorkspaceSettings from "./Settings";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";

const TABS = {
  "documents": DocumentSettings,
  "settings": WorkspaceSettings,
};

const DIALOG_ID = "manage-workspace-modal";

const noop = () => false;
export default function ManageWorkspace({
  hideModal = noop,
  providedSlug = null,
}) {
  const { slug } = useParams();
  const [selectedTab, setSelectedTab] = useState("documents");
  const [workspace, setWorkspace] = useState(null);
  const [fileTypes, setFileTypes] = useState(null);

  const CurrentTab = TABS[selectedTab || "documents"];

  useEffect(() => {
    async function checkSupportedFiletypes() {
      const acceptedTypes = await System.acceptedDocumentTypes();
      setFileTypes(acceptedTypes ?? {});

      console.log(acceptedTypes);
    }
    checkSupportedFiletypes();
  }, []);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(providedSlug ?? slug);
      setWorkspace(workspace);
    }
    fetchWorkspace();
  }, [selectedTab, slug]);

  if (!workspace) return null;

  return (
    <dialog id={DIALOG_ID} className="bg-transparent outline-none">
      <div className={`relative max-h-full transition duration-300`}>
        <div className="relative bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
          <div className="absolute top-[-18px] left-1/2 transform -translate-x-1/2 bg-sidebar-button p-1 rounded-xl shadow border-2 border-slate-300/10">
            <div className="flex gap-x-1">
              <button
                onClick={() => setSelectedTab("documents")}
                className={`px-4 py-2 rounded-[8px] font-semibold text-white hover:bg-switch-selected hover:bg-opacity-60 ${
                  selectedTab === "documents"
                    ? "bg-switch-selected shadow-md"
                    : "bg-sidebar-button"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setSelectedTab("settings")}
                className={`px-4 py-2 rounded-[8px] font-semibold text-white hover:bg-switch-selected hover:bg-opacity-60 ${
                  selectedTab === "settings"
                    ? "bg-switch-selected shadow-md"
                    : "bg-sidebar-button"
                }`}
              >
                Settings
              </button>
            </div>
          </div>
          <div className="flex items-start justify-between p-2 rounded-t border-gray-500/50">
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <CurrentTab workspace={workspace} fileTypes={fileTypes} />
        </div>
      </div>
    </dialog>
  );
}

export function useManageWorkspaceModal() {
  const [showing, setShowing] = useState(true);

  const showModal = () => {
    document.getElementById(DIALOG_ID)?.showModal();
    setShowing(true);
  };

  const hideModal = () => {
    document.getElementById(DIALOG_ID)?.close();
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
