import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { ArrowCircleUpRight } from "@phosphor-icons/react";
import WelcomeBanner from "./Banner";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "@/components/Modals/ManageWorkspace";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "@/components/Modals/NewWorkspace";
import Workspace from "@/models/workspace";
import { useNavigate } from "react-router-dom";
import {
  ChecklistItem,
  CHECKLIST_STORAGE_KEY,
  useChecklistItems,
} from "../checklist";

const FOOTER_LINKS = [
  {
    title: "Docs",
    href: paths.docs(),
  },
  {
    title: "Tutorials",
    href: paths.docs(),
  },
  {
    title: "Github",
    href: paths.github(),
  },
];

export default function WelcomeChecklist({ onSkip }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const navigate = useNavigate();
  const checklistItems = useChecklistItems();

  const {
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
    showing: showingNewWsModal,
  } = useNewWorkspaceModal();
  const { showModal: showManageWsModal, hideModal: hideManageWsModal } =
    useManageWorkspaceModal();

  useEffect(() => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const completedItems = JSON.parse(stored);
      setCompletedCount(Object.keys(completedItems).length);
    }
  }, []);

  const updateCompletedCount = () => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const completedItems = JSON.parse(stored);
      setCompletedCount(Object.keys(completedItems).length);
    }
  };

  const handlers = {
    sendChat: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length > 0) {
        navigate(paths.workspace.chat(workspaces[0].slug));
      }
    },
    embedDocument: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length > 0) {
        setSelectedWorkspace(workspaces[0]);
        showManageWsModal();
      }
    },
    createWorkspace: () => {
      showNewWsModal();
    },
    setSlashCommand: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length > 0) {
        navigate(paths.workspace.chat(workspaces[0].slug));
        window.location.hash = "#slash-commands";
      }
    },
    setSystemPrompt: async () => {
      const workspaces = await Workspace.all();
      if (workspaces.length > 0) {
        navigate(paths.workspace.settings.chatSettings(workspaces[0].slug));
        window.location.hash = "#system-prompts";
      }
    },
    visitCommunityHub: () => {
      window.location.href = paths.communityHub.website();
    },
  };

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center gap-y-6 p-4 pt-20 md:pt-16 md:p-12">
      <WelcomeBanner />
      <div className="w-full max-w-[680px] min-h-[450px] flex flex-col rounded-[24px] border border-white/20 py-8 px-9">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white font-semibold text-lg">Getting Started</h1>
          <div className="flex items-center gap-x-2">
            {checklistItems.length - completedCount > 0 && (
              <p className="text-[#9F9FA0] text-xs">
                {checklistItems.length - completedCount} tasks left
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          {checklistItems.map((item) => (
            <ChecklistItem
              key={item.id}
              {...item}
              onAction={() => {
                handlers[item.handler]();
                updateCompletedCount();
              }}
            />
          ))}
        </div>
      </div>
      <button
        onClick={onSkip}
        className="text-white text-sm hover:opacity-70 transition-opacity mt-5"
      >
        Skip
      </button>
      <div className="flex justify-start items-center gap-8 mt-12">
        {FOOTER_LINKS.map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white text-sm hover:opacity-70 transition-opacity"
          >
            {link.title}
            <ArrowCircleUpRight size={18} weight="fill" />
          </a>
        ))}
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
