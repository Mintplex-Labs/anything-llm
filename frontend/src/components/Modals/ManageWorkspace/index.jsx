import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import { isMobileOnly } from "react-device-detect";
import useUser from "../../../hooks/useUser";
import DocumentSettings from "./Documents";
import DataConnectors from "./DataConnectors";
import { EmbeddingProgressProvider } from "@/EmbeddingProgressContext";
import { useModalEscape } from "@/hooks/useModalEscape";

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

  // Portaled because the mobile sidebar drawer that opens this is transformed,
  // which would otherwise trap a fixed full-screen sheet inside it.
  if (isMobileOnly) {
    return createPortal(
      <div className="fixed inset-0 z-99 flex flex-col bg-zinc-900 light:bg-white pt-[env(safe-area-inset-top)]">
        <div className="shrink-0 flex items-center justify-between gap-x-3 pl-5 pr-3 h-14">
          <h3 className="text-base font-semibold truncate text-slate-50 light:text-slate-900">
            {workspace.name}
          </h3>
          <button
            onClick={hideModal}
            type="button"
            aria-label="Close"
            className="border-none bg-transparent w-11 h-11 shrink-0 flex items-center justify-center rounded-xl text-slate-50 light:text-slate-900 active:bg-zinc-800 light:active:bg-slate-100"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <EmbeddingProgressProvider>
          <DocumentSettings workspace={workspace} variant="mobile" />
        </EmbeddingProgressProvider>
      </div>,
      document.getElementById("root")
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div className="backdrop h-full w-full absolute top-0 z-10" />
      <div className="absolute max-h-full w-fit transition duration-300 z-20 md:overflow-y-auto py-10">
        <div className="relative bg-zinc-900 light:bg-white rounded-[12px] shadow border-2 border-zinc-800 light:border-slate-300">
          <div className="flex items-start justify-between p-2 rounded-t relative">
            <button
              onClick={hideModal}
              type="button"
              className="z-29 border-none bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center text-zinc-50 light:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-100 transition-colors duration-200"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          {user?.role !== "default" && (
            <ModalTabSwitcher
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {selectedTab === "documents" ? (
            <EmbeddingProgressProvider>
              <DocumentSettings workspace={workspace} />
            </EmbeddingProgressProvider>
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
  const { t } = useTranslation();
  return (
    <div className="w-full flex justify-center z-10 relative">
      <div className="gap-x-2 flex justify-center -mt-[68px] mb-10 bg-zinc-900 light:bg-white p-1 rounded-xl shadow border-2 border-zinc-800 light:border-slate-300 w-fit">
        <button
          onClick={() => setSelectedTab("documents")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold hover:bg-zinc-800 light:hover:bg-sky-100 ${
            selectedTab === "documents"
              ? "bg-zinc-800 font-bold text-white light:bg-sky-100 light:text-sky-700"
              : "text-white/20 font-medium hover:text-white light:bg-white light:text-slate-500"
          }`}
        >
          {t("connectors.manage.documents")}
        </button>
        <button
          onClick={() => setSelectedTab("dataConnectors")}
          className={`border-none px-4 py-2 rounded-[8px] font-semibold hover:bg-zinc-800 light:hover:bg-sky-100 ${
            selectedTab === "dataConnectors"
              ? "bg-zinc-800 font-bold text-white light:bg-sky-100 light:text-sky-700"
              : "text-white/20 font-medium hover:text-white light:bg-white light:text-slate-500"
          }`}
        >
          {t("connectors.manage.data-connectors")}
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

  useModalEscape(showing, hideModal);

  return { showing, showModal, hideModal };
}
