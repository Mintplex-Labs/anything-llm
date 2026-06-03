import React, { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import LoadingChat from "./LoadingChat";
import ChatContainer from "./ChatContainer";
import paths from "@/utils/paths";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/lib/Modal";
import { useParams } from "react-router-dom";
import { DnDFileUploaderProvider } from "./ChatContainer/DnDWrapper";
import { WarningCircle } from "@phosphor-icons/react";
import {
  TTSProvider,
  useWatchForAutoPlayAssistantTTSResponse,
} from "../contexts/TTSProvider";
import { PENDING_HOME_MESSAGE } from "@/utils/constants";

export default function WorkspaceChat({ loading, workspace }) {
  useWatchForAutoPlayAssistantTTSResponse();
  const { threadSlug = null } = useParams();
  // Stores { key, workspace, history } currently rendered. Lags the props so
  // the previous chat stays mounted until the next one's history is ready,
  // avoiding a skeleton/loader flash on workspace/thread switches.
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    async function getHistory() {
      if (loading) return;
      if (!workspace?.slug) {
        setLoaded({ key: "none", workspace: null, history: [] });
        return false;
      }

      const chatHistory = threadSlug
        ? await Workspace.threads.chatHistory(workspace.slug, threadSlug)
        : await Workspace.chatHistory(workspace.slug);

      setLoaded({
        key: `${workspace.slug}:${threadSlug ?? "default"}`,
        workspace,
        threadSlug,
        history: chatHistory,
      });
    }
    getHistory();
  }, [workspace, loading, threadSlug]);

  const hasPendingMessage = !!sessionStorage.getItem(PENDING_HOME_MESSAGE);
  if (loaded === null) {
    if (hasPendingMessage) {
      return (
        <div className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full" />
      );
    }
    return <LoadingChat />;
  }
  if (!loading && !workspace) {
    return (
      <>
        {loading === false && !workspace && (
          <Modal isOpen={true} size="md">
            <ModalHeader
              title={
                <span className="flex items-center gap-x-2 text-red-500">
                  <WarningCircle className="w-5 h-5" weight="fill" />
                  Workspace not found
                </span>
              }
            />
            <ModalBody>
              <p className="text-zinc-300 light:text-slate-700 text-sm">
                The workspace you're looking for is not available. It may have
                been deleted or you may not have access to it.
              </p>
            </ModalBody>
            <ModalFooter className="justify-end">
              <a
                href={paths.home()}
                className="flex items-center justify-center h-[34px] px-4 rounded-lg text-sm font-medium border-none bg-zinc-50 light:bg-slate-900 text-zinc-950 light:text-white hover:opacity-80 transition-all duration-200"
              >
                Return to homepage
              </a>
            </ModalFooter>
          </Modal>
        )}
        <LoadingChat />
      </>
    );
  }

  setEventDelegatorForCodeSnippets();
  return (
    <TTSProvider>
      <DnDFileUploaderProvider
        workspace={loaded.workspace}
        threadSlug={loaded.threadSlug}
      >
        <ChatContainer
          key={loaded.key}
          workspace={loaded.workspace}
          threadSlug={loaded.threadSlug}
          knownHistory={loaded.history}
        />
      </DnDFileUploaderProvider>
    </TTSProvider>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;
  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type"
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);
  target.classList.add("text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", true);

  setTimeout(() => {
    target.classList.remove("text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
}

// Listens and hunts for all data-code-snippet clicks.
export function setEventDelegatorForCodeSnippets() {
  document?.addEventListener("click", function (e) {
    const target = e.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}
