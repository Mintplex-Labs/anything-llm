import React, { useState, useEffect } from "react";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "@/components/Modals/ManageWorkspace";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "@/components/Modals/NewWorkspace";
import Workspace from "@/models/workspace";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { ChecklistItem } from "./ChecklistItem";
import {
  CHECKLIST_HIDDEN,
  CHECKLIST_STORAGE_KEY,
  CHECKLIST_ITEMS,
} from "./constants";

export default function Checklist() {
  const [isHidden, setIsHidden] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const navigate = useNavigate();

  const {
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
    showing: showingNewWsModal,
  } = useNewWorkspaceModal();
  const { showModal: showManageWsModal, hideModal: hideManageWsModal } =
    useManageWorkspaceModal();

  useEffect(() => {
    const hidden = window.localStorage.getItem(CHECKLIST_HIDDEN);
    setIsHidden(!!hidden);

    const checkWorkspaceAndUpdateCount = async () => {
      const workspaces = await Workspace.all();
      const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY) || "{}";
      const completedItems = JSON.parse(stored);

      if (workspaces.length > 0) {
        completedItems["create_workspace"] = true;
      } else if (completedItems["create_workspace"]) {
        delete completedItems["create_workspace"];
      }

      window.localStorage.setItem(
        CHECKLIST_STORAGE_KEY,
        JSON.stringify(completedItems)
      );
      setCompletedCount(Object.keys(completedItems).length);
    };

    checkWorkspaceAndUpdateCount();
  }, []);

  const handleClose = () => {
    window.localStorage.setItem(CHECKLIST_HIDDEN, "true");
    setIsHidden(true);
  };

  // TODO: Refactor this - this will re-render many times.
  const handlers = {
    sendChat: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before starting a chat.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(paths.workspace.chat(workspaces[0].slug));
      return true;
    },
    embedDocument: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before embedding documents.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      setSelectedWorkspace(workspaces[0]);
      showManageWsModal();
      return true;
    },
    createWorkspace: () => {
      showNewWsModal();
      return true;
    },
    setSlashCommand: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before setting up slash commands.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(paths.workspace.chat(workspaces[0].slug));
      window.location.hash = "#slash-commands";
      return true;
    },
    setSystemPrompt: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before setting up system prompts.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(paths.workspace.settings.chatSettings(workspaces[0].slug));
      window.location.hash = "#system-prompts";
      return true;
    },
    visitCommunityHub: () => {
      window.location.href = paths.communityHub.website();
      return true;
    },
  };

  if (isHidden) return null;

  return (
    <div>
      <div className="rounded-lg p-4 lg:p-6 -mb-6 bg-theme-home-bg-card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-x-3">
            <h1 className="text-theme-home-text uppercase text-sm font-semibold">
              Getting Started
            </h1>
            {CHECKLIST_ITEMS.length - completedCount > 0 && (
              <p className="text-theme-home-text-secondary text-xs">
                {CHECKLIST_ITEMS.length - completedCount} tasks left
              </p>
            )}
          </div>

          <div className="flex items-center gap-x-2">
            <button
              onClick={handleClose}
              className="text-theme-home-text bg-theme-home-bg-button px-2 py-1 rounded-xl hover:bg-white/10 transition-colors text-xs"
            >
              close
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHECKLIST_ITEMS.map((item) => (
            <ChecklistItem
              key={item.id}
              {...item}
              onAction={() => handlers[item.handler]()}
            />
          ))}
        </div>
      </div>
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      {selectedWorkspace && (
        <ManageWorkspace
          providedSlug={selectedWorkspace.slug}
          hideModal={() => {
            setSelectedWorkspace(null);
            hideManageWsModal();
          }}
        />
      )}
    </div>
  );
}
