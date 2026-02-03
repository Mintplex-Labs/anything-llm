import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "@/components/Sidebar";
import PromptInput, {
  PROMPT_INPUT_EVENT,
} from "@/components/WorkspaceChat/ChatContainer/PromptInput";
import DnDFileUploaderWrapper, {
  DndUploaderContext,
  DnDFileUploaderProvider,
  PASTE_ATTACHMENT_EVENT,
} from "@/components/WorkspaceChat/ChatContainer/DnDWrapper";
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

export default function Home() {
  const [workspace, setWorkspace] = useState(null);
  const [threadSlug, setThreadSlug] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const pendingFilesRef = useRef([]);

  useEffect(() => {
    async function init() {
      const ws = await getTargetWorkspace();
      if (ws) setWorkspace(ws);
      setWorkspaceLoading(false);
    }
    init();
  }, []);

  // When workspace/thread becomes available and we have pending files, trigger upload
  useEffect(() => {
    if (workspace && threadSlug && pendingFilesRef.current.length > 0) {
      const files = pendingFilesRef.current;
      pendingFilesRef.current = [];
      window.dispatchEvent(
        new CustomEvent(PASTE_ATTACHMENT_EVENT, { detail: { files } })
      );
    }
  }, [workspace, threadSlug]);

  async function handleDropWithoutWorkspace(acceptedFiles) {
    setDragging(false);
    pendingFilesRef.current = acceptedFiles;
    const ws = await createDefaultWorkspace();
    if (!ws) return;
    setWorkspace(ws);
    const { thread } = await Workspace.threads.new(ws.slug);
    if (thread) setThreadSlug(thread.slug);
  }

  async function handleDropWithWorkspace(acceptedFiles) {
    setDragging(false);
    pendingFilesRef.current = acceptedFiles;
    const { thread } = await Workspace.threads.new(workspace.slug);
    if (thread) setThreadSlug(thread.slug);
  }

  if (workspaceLoading) {
    return (
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-hidden"
      />
    );
  }

  if (workspace && threadSlug) {
    return (
      <DnDFileUploaderProvider workspace={workspace} threadSlug={threadSlug}>
        <HomeContent
          workspace={workspace}
          setWorkspace={setWorkspace}
          threadSlug={threadSlug}
          setThreadSlug={setThreadSlug}
        />
      </DnDFileUploaderProvider>
    );
  }

  return (
    <DndUploaderContext.Provider
      value={{
        files: [],
        ready: true,
        dragging,
        setDragging,
        onDrop: workspace
          ? handleDropWithWorkspace
          : handleDropWithoutWorkspace,
        parseAttachments: () => [],
      }}
    >
      <HomeContent
        workspace={workspace}
        setWorkspace={setWorkspace}
        threadSlug={null}
        setThreadSlug={setThreadSlug}
      />
    </DndUploaderContext.Provider>
  );
}

function HomeContent({ workspace, setWorkspace, threadSlug, setThreadSlug }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedWorkspaceSlug, setSelectedWorkspaceSlug] = useState(null);
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const { files, parseAttachments } = useContext(DndUploaderContext);

  useEffect(() => {
    sessionStorage.removeItem(PENDING_HOME_MESSAGE);
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, {
        detail: { messageContent: "", writeMode: "replace" },
      })
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      let targetWorkspace = workspace;
      let targetThread = threadSlug;
      const attachments = parseAttachments();

      if (!targetWorkspace) {
        targetWorkspace = await createDefaultWorkspace();
        if (!targetWorkspace) {
          setLoading(false);
          return;
        }
        setWorkspace(targetWorkspace);
      }

      if (!targetThread) {
        const { thread } = await Workspace.threads.new(targetWorkspace.slug);
        targetThread = thread?.slug;
        if (thread) setThreadSlug(thread.slug);
      }

      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify({ message: message.trim(), attachments })
      );

      if (targetThread) {
        navigate(paths.workspace.thread(targetWorkspace.slug, targetThread));
      } else {
        navigate(paths.workspace.chat(targetWorkspace.slug));
      }
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
    let targetWorkspace = workspace;

    if (!targetWorkspace) {
      targetWorkspace = await createDefaultWorkspace();
      if (!targetWorkspace) return;
      setWorkspace(targetWorkspace);
    }

    setSelectedWorkspaceSlug(targetWorkspace.slug);
    showModal();
  }

  async function handleEditWorkspace() {
    let targetWorkspace = workspace;

    if (!targetWorkspace) {
      targetWorkspace = await createDefaultWorkspace();
      if (!targetWorkspace) return;
      setWorkspace(targetWorkspace);
    }

    navigate(paths.workspace.settings.generalAppearance(targetWorkspace.slug));
  }

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-hidden"
    >
      {isMobile && <SidebarMobileHeader />}
      <DnDFileUploaderWrapper>
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
              attachments={files}
              centered
              workspaceSlug={workspace?.slug}
              threadSlug={threadSlug}
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
      </DnDFileUploaderWrapper>
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
