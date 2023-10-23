import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import { X } from "react-feather";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import { isMobile } from "react-device-detect";

const DocumentSettings = lazy(() => import("./Documents"));
const WorkspaceSettings = lazy(() => import("./Settings"));

const noop = () => {};
const ManageWorkspace = ({ hideModal = noop, providedSlug = null }) => {
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
  }, [providedSlug, slug]);

  if (!workspace) return null;

  if (isMobile) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
        <div className="backdrop h-full w-full absolute top-0 z-10" />
        <div className={`absolute max-h-full transition duration-300 z-20`}>
          <div className="relative max-w-lg mx-auto bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
            <div className="p-6">
              <h1 className="text-white text-lg font-semibold">
                Editing "{workspace.name}"
              </h1>
              <p className="text-white mt-4">
                Editing these settings are only available on a desktop device.
                Please access this page on your desktop to continue.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={hideModal}
                  type="button"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className={`absolute max-h-full w-3/4 transition duration-300 z-20`}>
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
          <Suspense fallback={<div>Loading...</div>}>
            <div className={selectedTab === "documents" ? "" : "hidden"}>
              <DocumentSettings workspace={workspace} fileTypes={fileTypes} />
            </div>
            <div className={selectedTab === "settings" ? "" : "hidden"}>
              <WorkspaceSettings workspace={workspace} fileTypes={fileTypes} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(ManageWorkspace);
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
