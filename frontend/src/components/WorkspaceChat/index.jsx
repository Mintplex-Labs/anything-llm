import React, { useCallback, useEffect, useRef, useState } from "react";
import Workspace from "@/models/workspace";
import LoadingChat from "./LoadingChat";
import ChatContainer from "./ChatContainer";
import paths from "@/utils/paths";
import ModalWrapper from "../ModalWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DnDFileUploaderProvider } from "./ChatContainer/DnDWrapper";
import { WarningCircle } from "@phosphor-icons/react";
import {
  TTSProvider,
  useWatchForAutoPlayAssistantTTSResponse,
} from "../contexts/TTSProvider";
import { PENDING_HOME_MESSAGE } from "@/utils/constants";
import { useChatThreadDrafts } from "@/contexts/ChatThreadDraftProvider";
import { setEventDelegatorForCodeSnippets } from "@/utils/chat/codeBlockCopy";

export default function WorkspaceChat({ loading, workspace }) {
  useWatchForAutoPlayAssistantTTSResponse();
  const { threadSlug = null } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    getDraft,
    mergeServerHistory,
    getRunningThread,
    getThreadPath,
    getThreadActivity,
    clearThreadActivity,
  } = useChatThreadDrafts();
  // Stores { key, workspace, history } currently rendered. Lags the props so
  // the previous chat stays mounted until the next one's history is ready,
  // avoiding a skeleton/loader flash on workspace/thread switches.
  const [loaded, setLoaded] = useState(null);
  const restoredChatKeysRef = useRef(new Set());
  const setLoadedIfChanged = useCallback((next) => {
    setLoaded((prev) => {
      if (
        prev?.key === next.key &&
        prev?.workspace === next.workspace &&
        prev?.threadSlug === next.threadSlug &&
        prev?.history === next.history
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function getHistory() {
      if (loading) return;
      if (!workspace?.slug) {
        setLoadedIfChanged({ key: "none", workspace: null, history: [] });
        return false;
      }

      const key = `${workspace.slug}:${threadSlug ?? "default"}`;
      const runningThread = getRunningThread(workspace.slug);
      if (
        !location.state?.userSelectedThread &&
        runningThread &&
        !threadSlug &&
        runningThread.threadSlug &&
        (runningThread.threadSlug || null) !== (threadSlug || null)
      ) {
        navigate(getThreadPath(workspace.slug, runningThread.threadSlug), {
          replace: true,
        });
        return false;
      }

      const draft = getDraft(workspace.slug, threadSlug);
      if (draft) {
        setLoadedIfChanged({
          key,
          workspace,
          threadSlug,
          history: [],
        });
      }

      const chatHistory = threadSlug
        ? await Workspace.threads.chatHistory(workspace.slug, threadSlug)
        : await Workspace.chatHistory(workspace.slug);
      if (cancelled) return;
      if (!restoredChatKeysRef.current.has(key)) {
        restoredChatKeysRef.current.add(key);
        mergeServerHistory({
          workspaceSlug: workspace.slug,
          threadSlug,
          history: chatHistory,
        });
      }

      if (!draft) {
        setLoadedIfChanged({
          key,
          workspace,
          threadSlug,
          history: chatHistory,
        });
      }
    }
    getHistory();
    return () => {
      cancelled = true;
    };
  }, [
    workspace,
    loading,
    threadSlug,
    getDraft,
    getRunningThread,
    getThreadPath,
    location.state?.userSelectedThread,
    mergeServerHistory,
    navigate,
    setLoadedIfChanged,
  ]);

  useEffect(() => {
    if (!workspace?.slug) return;
    const activity = getThreadActivity(workspace.slug, threadSlug);
    if (["completed", "failed"].includes(activity?.status)) {
      clearThreadActivity(workspace.slug, threadSlug);
    }
  }, [workspace?.slug, threadSlug, getThreadActivity, clearThreadActivity]);

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
          <ModalWrapper isOpen={true}>
            <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
              <div className="relative p-6 border-b rounded-t border-theme-modal-border">
                <div className="w-full flex gap-x-2 items-center">
                  <WarningCircle
                    className="text-red-500 w-6 h-6"
                    weight="fill"
                  />
                  <h3 className="text-xl font-semibold text-red-500 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Workspace not found
                  </h3>
                </div>
              </div>
              <div className="py-7 px-9 space-y-2 flex-col">
                <p className="text-white text-sm">
                  The workspace you're looking for is not available. It may have
                  been deleted or you may not have access to it.
                </p>
              </div>
              <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
                <a
                  href={paths.home()}
                  className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
                >
                  Return to homepage
                </a>
              </div>
            </div>
          </ModalWrapper>
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

export { setEventDelegatorForCodeSnippets };
