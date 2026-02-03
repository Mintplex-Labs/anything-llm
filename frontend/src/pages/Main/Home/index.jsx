import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "@/components/Sidebar";
import PromptInput, {
  PROMPT_INPUT_EVENT,
} from "@/components/WorkspaceChat/ChatContainer/PromptInput";
import { DndUploaderContext } from "@/components/WorkspaceChat/ChatContainer/DnDWrapper";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "@/components/Modals/ManageWorkspace";
import { useTranslation } from "react-i18next";
import {
  LAST_VISITED_WORKSPACE,
  PENDING_HOME_MESSAGE,
} from "@/utils/constants";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedWorkspaceSlug, setSelectedWorkspaceSlug] = useState(null);
  const { showing, showModal, hideModal } = useManageWorkspaceModal();

  useEffect(() => {
    sessionStorage.removeItem(PENDING_HOME_MESSAGE);
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, {
        detail: { messageContent: "", writeMode: "replace" },
      })
    );
  }, []);

  async function getTargetWorkspace() {
    const lastVisited = safeJsonParse(
      localStorage.getItem(LAST_VISITED_WORKSPACE)
    );
    if (lastVisited?.slug) {
      const workspace = await Workspace.bySlug(lastVisited.slug);
      if (workspace) return workspace;
    }

    const workspaces = await Workspace.all();
    return workspaces.length > 0 ? workspaces[0] : null;
  }

  async function createDefaultWorkspace() {
    const { workspace, message: errorMsg } = await Workspace.new({
      name: "My Workspace",
    });
    if (!workspace) {
      showToast(errorMsg || "Failed to create workspace", "error");
      return null;
    }
    return workspace;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      let workspace = await getTargetWorkspace();

      // No workspace exists -> create one and navigate to default thread
      if (!workspace) {
        workspace = await createDefaultWorkspace();
        if (!workspace) {
          setLoading(false);
          return;
        }
        sessionStorage.setItem(
          PENDING_HOME_MESSAGE,
          JSON.stringify({ message: message.trim() })
        );
        navigate(paths.workspace.chat(workspace.slug));
        return;
      }

      // Workspace exists -> create a new thread and navigate to it
      const { thread, error } = await Workspace.threads.new(workspace.slug);
      if (!thread) {
        showToast(error || "Failed to create thread", "error");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify({ message: message.trim() })
      );
      navigate(paths.workspace.thread(workspace.slug, thread.slug));
    } catch (error) {
      console.error("Error submitting message:", error);
      showToast("Failed to send message", "error");
      setLoading(false);
    }
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function sendCommand({ text = "", autoSubmit = false }) {
    setMessage(text);
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, {
        detail: { messageContent: text, writeMode: "replace" },
      })
    );
    if (autoSubmit && text) {
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      }, 0);
    }
  }

  async function handleUploadDocument() {
    let workspace = await getTargetWorkspace();

    if (!workspace) {
      workspace = await createDefaultWorkspace();
      if (!workspace) return;
    }

    setSelectedWorkspaceSlug(workspace.slug);
    showModal();
  }

  async function handleEditWorkspace() {
    let workspace = await getTargetWorkspace();

    if (!workspace) {
      workspace = await createDefaultWorkspace();
      if (!workspace) return;
    }

    navigate(paths.workspace.settings.generalAppearance(workspace.slug));
  }

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-hidden"
    >
      {isMobile && <SidebarMobileHeader />}
      <DndUploaderContext.Provider
        value={{
          files: [],
          ready: false,
          dragging: false,
          setDragging: () => { },
          onDrop: () => { },
          parseAttachments: () => [],
        }}
      >
        <div className="flex flex-col h-full w-full items-center justify-center">
          <div className="flex flex-col items-center w-full max-w-[650px] px-4">
            <h1 className="text-white text-xl md:text-2xl mb-11 text-center">
              {t("home.greeting", "How may I make your day easier today?")}
            </h1>
            <PromptInput
              submit={handleSubmit}
              onChange={handleChange}
              isStreaming={loading}
              sendCommand={sendCommand}
              attachments={[]}
              centered
            />
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <QuickActionButton
                label="Create an Agent"
                onClick={() => navigate(paths.settings.agentSkills())}
              />
              <QuickActionButton
                label="Edit Workspace"
                onClick={handleEditWorkspace}
              />
              <QuickActionButton
                label="Upload a Document"
                onClick={handleUploadDocument}
              />
            </div>
          </div>
        </div>
      </DndUploaderContext.Provider>
      {showing && (
        <ManageWorkspace
          hideModal={hideModal}
          providedSlug={selectedWorkspaceSlug}
        />
      )}
    </div>
  );
}

function QuickActionButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full bg-theme-bg-chat-input text-white/80 text-sm font-normal leading-5 hover:bg-white/5 transition-colors"
    >
      {label}
    </button>
  );
}
