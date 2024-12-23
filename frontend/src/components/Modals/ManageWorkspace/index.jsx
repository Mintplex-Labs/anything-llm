import React, { useState, useEffect, memo } from "react";
import { X } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import { isMobile } from "react-device-detect";
import useUser from "../../../hooks/useUser";
import DocumentSettings from "./Documents";
import DataConnectors from "./DataConnectors";
import ModalWrapper from "@/components/ModalWrapper";

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

  if (isMobile) {
    return (
      <ModalWrapper isOpen={true}>
        <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                Editing "{workspace.name}"
              </h3>
            </div>
            <button
              onClick={hideModal}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>
          </div>
          <div
            className="h-full w-full overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="py-7 px-9 space-y-2 flex-col">
              <p className="text-white">
                Editing these settings are only available on a desktop device.
                Please access this page on your desktop to continue.
              </p>
            </div>
          </div>
          <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className="absolute max-h-full w-fit transition duration-300 z-20 md:overflow-y-auto py-10">
        <div className="relative bg-theme-bg-secondary rounded-[12px] shadow border-2 border-theme-modal-border">
          <div className="flex items-start justify-between p-2 rounded-t border-theme-modal-border relative">
            <button
              onClick={hideModal}
              type="button"
              className="z-29 text-white bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={20} weight="bold" className="text-white" />
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
      <div className="gap-x-2 flex justify-center -mt-[68px] mb-10 bg-theme-bg-secondary p-1 rounded-xl shadow border-2 border-theme-modal-border w-fit">
        <button
          onClick={() => setSelectedTab("documents")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold hover:bg-theme-modal-border hover:bg-opacity-60 ${
            selectedTab === "documents"
              ? "bg-theme-modal-border font-bold text-white light:bg-[#E0F2FE] light:text-[#026AA2]"
              : "text-white/20 font-medium hover:text-white light:bg-white light:text-[#535862] light:hover:bg-[#E0F2FE]"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setSelectedTab("dataConnectors")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold hover:bg-theme-modal-border hover:bg-opacity-60 ${
            selectedTab === "dataConnectors"
              ? "bg-theme-modal-border font-bold text-white light:bg-[#E0F2FE] light:text-[#026AA2]"
              : "text-white/20 font-medium hover:text-white light:bg-white light:text-[#535862] light:hover:bg-[#E0F2FE]"
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

  function showModal() {
    if (user?.role !== "default") {
      setShowing(true);
    }
  }

  function hideModal() {
    setShowing(false);
  }

  useEffect(() => {
    function onEscape(event) {
      if (!showing || event.key !== "Escape") return;
      setShowing(false);
    }

    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [showing]);

  return { showing, showModal, hideModal };
}
