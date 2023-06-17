import React, { useState, useEffect } from "react";
import { Archive, Sliders, UploadCloud, X } from "react-feather";
import DocumentSettings from "./Documents";
import WorkspaceSettings from "./Settings";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import UploadToWorkspace from "./Upload";

const TABS = {
  documents: DocumentSettings,
  settings: WorkspaceSettings,
  upload: UploadToWorkspace,
};

const noop = () => false;
export default function ManageWorkspace({
  hideModal = noop,
  providedSlug = null,
}) {
  const { slug } = useParams();
  const [selectedTab, setSelectedTab] = useState("documents");
  const [workspace, setWorkspace] = useState(null);
  const [fileTypes, setFileTypes] = useState(null);

  useEffect(() => {
    async function checkSupportedFiletypes() {
      const acceptedTypes = await System.acceptedDocumentTypes();
      setFileTypes(acceptedTypes ?? {});
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

  const Component = TABS[selectedTab || "documents"];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideModal}
      />
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex flex-col gap-y-1 border-b dark:border-gray-600 px-4 pt-4 ">
            <div className="flex items-start justify-between rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update "{workspace.name}"
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
            <WorkspaceSettingTabs
              selectedTab={selectedTab}
              changeTab={setSelectedTab}
            />
          </div>
          <Component
            hideModal={hideModal}
            workspace={workspace}
            fileTypes={fileTypes}
          />
        </div>
      </div>
    </div>
  );
}

function WorkspaceSettingTabs({ selectedTab, changeTab }) {
  return (
    <div>
      <ul className="flex md:flex-wrap overflow-x-scroll no-scroll -mb-px text-sm gap-x-2 font-medium text-center text-gray-500 dark:text-gray-400">
        <WorkspaceTab
          active={selectedTab === "documents"}
          displayName="Documents"
          tabName="documents"
          icon={<Archive className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
        <WorkspaceTab
          active={selectedTab === "upload"}
          displayName="Upload Docs"
          tabName="upload"
          icon={<UploadCloud className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
        <WorkspaceTab
          active={selectedTab === "settings"}
          displayName="Settings"
          tabName="settings"
          icon={<Sliders className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
      </ul>
    </div>
  );
}

function WorkspaceTab({
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

export function useManageWorkspaceModal() {
  const [showing, setShowing] = useState(false);
  const showModal = () => {
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
