import React, { useState, useEffect, memo } from "react";
import { X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import System from "@/models/system";
import useUser from "@/hooks/useUser";
import DocumentSettings from "./Documents";

const noop = () => {};
const ManageWorkspace = ({ hideModal = noop, providedSlug = null }) => {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [settings, setSettings] = useState({});

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
      <div className="backdrop h-full w-full absolute top-0 z-10 pointer-events-none" />
      <div
        className={`absolute max-h-full w-fit transition duration-300 z-20 overflow-y-scroll py-10`}
      >
        <div className="relative bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-2 rounded-t border-gray-500/50 z-40 relative">
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <DocumentSettings workspace={workspace} systemSettings={settings} />
        </div>
      </div>
    </div>
  );
};

export default memo(ManageWorkspace);
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
