import React, { useState, useEffect, memo } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import { isMobileOnly } from "react-device-detect";
import useUser from "../../../hooks/useUser";
import DocumentSettings from "./Documents";
import DataConnectors from "./DataConnectors";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
} from "@/components/lib/Modal";
import { EmbeddingProgressProvider } from "@/EmbeddingProgressContext";

const noop = () => {};
const ManageWorkspace = ({ hideModal = noop, providedSlug = null }) => {
  const { t } = useTranslation();
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

  if (isMobileOnly) {
    return (
      <Modal isOpen={true} onClose={hideModal} size="md">
        <ModalHeader
          title={`${t("connectors.manage.editing")} "${workspace.name}"`}
          onClose={hideModal}
        />
        <ModalBody>
          <p className="text-zinc-300 light:text-slate-700">
            {t("connectors.manage.desktop-only")}
          </p>
        </ModalBody>
        <ModalFooter className="justify-end">
          <ModalPrimaryButton type="button" onClick={hideModal}>
            {t("connectors.manage.dismiss")}
          </ModalPrimaryButton>
        </ModalFooter>
      </Modal>
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
