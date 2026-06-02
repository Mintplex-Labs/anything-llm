import { useState, useEffect, useContext, useRef } from "react";
import ChatHistory from "./ChatHistory";
import { CLEAR_ATTACHMENTS_EVENT, DndUploaderContext } from "./DnDWrapper";
import PromptInput, {
  PROMPT_INPUT_EVENT,
  PROMPT_INPUT_ID,
} from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat, { ABORT_STREAM_EVENT } from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import handleSocketResponse, {
  websocketURI,
  AGENT_SESSION_END,
  AGENT_SESSION_START,
  setAgentSessionActive,
} from "@/utils/chat/agent";
import DnDFileUploaderWrapper from "./DnDWrapper";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ChatTooltips } from "./ChatTooltips";
import { MetricsProvider } from "./ChatHistory/HistoricalMessage/Actions/RenderMetrics";
import useChatContainerQuickScroll from "@/hooks/useChatContainerQuickScroll";
import {
  PENDING_HOME_MESSAGE,
  SWARMSY_LOCAL_USER_ACTIVE_RUNTIME,
} from "@/utils/constants";
import { clearPromptInputDraft } from "@/hooks/usePromptInputStorage";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import QuickActions from "@/components/lib/QuickActions";
import SuggestedMessages from "@/components/lib/SuggestedMessages";
import ChatSettingsMenu from "./ChatSettingsMenu";
import WorkspaceModelPicker from "./WorkspaceModelPicker";
import { ChatSidebarProvider } from "./ChatSidebar";
import SourcesSidebar from "./SourcesSidebar";
import MemoriesSidebar from "./MemoriesSidebar";
import {
  normalizeLocalUserOllamaRuntimeSelection,
  isLocalUserOllamaIntent,
} from "@/components/SwarmsyFirstRunOnboarding/handoff";
import { getPendingHomeMessageForDestination } from "@/utils/pendingHomeMessage";

function getStoredLocalUserRuntimeForWorkspace(workspaceSlug = "") {
  const storedRuntime = safeJsonParse(
    sessionStorage.getItem(SWARMSY_LOCAL_USER_ACTIVE_RUNTIME)
  );
  const storedRuntimeWorkspaceSlug = String(
    storedRuntime?.workspaceSlug || ""
  ).trim();
  const normalizedWorkspaceSlug = String(workspaceSlug || "").trim();

  if (
    !normalizedWorkspaceSlug ||
    !storedRuntime ||
    storedRuntimeWorkspaceSlug !== normalizedWorkspaceSlug
  ) {
    return {
      runtime: null,
      isLocalUserSession: false,
    };
  }

  return {
    runtime: normalizeLocalUserOllamaRuntimeSelection(storedRuntime),
    isLocalUserSession: isLocalUserOllamaIntent(storedRuntime),
  };
}

export default function ChatContainer({
  workspace,
  threadSlug = null,
  knownHistory = [],
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
  const [socketId, setSocketId] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const { files, parseAttachments } = useContext(DndUploaderContext);
  const { chatHistoryRef } = useChatContainerQuickScroll();
  const pendingMessageChecked = useRef(false);
  const pendingResetRef = useRef(false);
  const initialStoredLocalRuntime = getStoredLocalUserRuntimeForWorkspace(
    workspace?.slug
  );
  const activeLocalUserRuntimeRef = useRef(initialStoredLocalRuntime.runtime);
  const isLocalUserSessionRef = useRef(
    initialStoredLocalRuntime.isLocalUserSession
  );

  const { pending: pendingHomeMessage } = getPendingHomeMessageForDestination({
    workspaceSlug: workspace?.slug,
    threadSlug,
  });
  const isEmpty = chatHistory.length === 0 && !pendingHomeMessage;

  /**
   * Keep chat history bottom-padding in sync with the prompt input's
   * actual rendered height so expanding input never covers messages.
   */
  useEffect(() => {
    if (isEmpty) return;
    const wrapper = document.getElementById("prompt-input-wrapper");
    const chatEl = document.getElementById("chat-history");
    if (!wrapper || !chatEl) return;

    const observer = new ResizeObserver(([entry]) => {
      const inputHeight =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight;
      chatEl.style.paddingBottom = `${inputHeight}px`;
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [isEmpty]);

  const { listening, resetTranscript } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });

  /**
   * Emit an update to the state of the prompt input without directly
   * passing a prop in so that it does not re-render constantly.
   * @param {string} messageContent - The message content to set
   * @param {'replace' | 'append'} writeMode - Replace current text or append to existing text (default: replace)
   */
  function setMessageEmit(messageContent = "", writeMode = "replace") {
    window.dispatchEvent(
      new CustomEvent(PROMPT_INPUT_EVENT, {
        detail: { messageContent, writeMode },
      })
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentMessage =
      document.getElementById(PROMPT_INPUT_ID)?.value || "";
    if (!currentMessage) return false;

    const activeRuntime = isLocalUserSessionRef.current
      ? activeLocalUserRuntimeRef.current
      : null;

    // Block Local User chat if this is a local user session but the runtime is
    // missing or invalid (e.g. model cleared). activeLocalUserRuntimeRef is
    // always either a valid normalized object or null — never {model: ""} — so
    // checking the session flag separately is the only reliable way to catch the
    // "in a local user session but no valid runtime" state.
    if (isLocalUserSessionRef.current && !activeRuntime) {
      window.toastr?.error(
        "Selected local Ollama model is no longer available. Recheck Ollama models and choose another.",
        "Local model unavailable",
        { timeOut: 8000 }
      );
      return false;
    }

    // Clear the localStorage draft for this thread/workspace so that if the
    // PromptInput remounts (empty→chat transition), it won't restore stale text
    clearPromptInputDraft(threadSlug ?? workspace.slug);

    const prevChatHistory = [
      ...chatHistory,
      {
        content: currentMessage,
        role: "user",
        attachments: parseAttachments(),
        runtime: activeRuntime,
      },
      {
        content: "",
        role: "assistant",
        pending: true,
        userMessage: currentMessage,
        runtime: activeRuntime,
        animate: true,
      },
    ];

    if (listening) {
      // Stop the mic if the send button is clicked
      endSTTSession();
    }
    setChatHistory(prevChatHistory);
    setMessageEmit("");
    setLoadingResponse(true);
  };

  function endSTTSession() {
    SpeechRecognition.stopListening();
    resetTranscript();
  }

  const regenerateAssistantMessage = (chatId) => {
    const filteredHistory = chatHistory.slice(0, -1);
    const lastUserMessage = filteredHistory.findLast(
      (msg) => msg.role === "user"
    );
    Workspace.deleteChats(workspace.slug, [chatId])
      .then(() =>
        sendCommand({
          text: lastUserMessage.content,
          autoSubmit: true,
          history: filteredHistory,
          attachments: lastUserMessage?.attachments,
          runtime: lastUserMessage?.runtime,
        })
      )
      .catch((e) => console.error(e));
  };

  /**
   * Send a command to the LLM prompt input.
   * @param {Object} options - Arguments to send to the LLM
   * @param {string} options.text - The text to send to the LLM
   * @param {boolean} options.autoSubmit - Determines if the text should be sent immediately or if it should be added to the message state (default: false)
   * @param {Object[]} options.history - The history of the chat prior to this message for overriding the current chat history
   * @param {import("./DnDWrapper").Attachment[]} options.attachments - The attachments to send to the LLM for this message
   * @param {Object|null} options.runtime - Optional runtime override for this message
   * @param {'replace' | 'append' | 'prepend'} options.writeMode - Replace current text or append to existing text (default: replace)
   * @returns {Promise<boolean>} Resolves to false if sending was blocked/no-op; otherwise true once send progression begins.
   */
  const sendCommand = async ({
    text = "",
    autoSubmit = false,
    history = [],
    attachments = [],
    runtime = null,
    writeMode = "replace",
  } = {}) => {
    // If we are not auto-submitting, we can just emit the text to the prompt input.
    if (!autoSubmit) {
      setMessageEmit(text, writeMode);
      return false;
    }

    // When auto-submitting without an explicit runtime override, inherit the
    // active Local User runtime so follow-up messages (suggested messages,
    // regenerate, quick actions) also use the selected Ollama model.
    const effectiveRuntime =
      runtime ??
      (isLocalUserSessionRef.current
        ? activeLocalUserRuntimeRef.current
        : null);

    // Block Local User chat if this is a local user session but the runtime is
    // missing or invalid. Same guard as handleSubmit — auto-submitted commands
    // (suggested messages, regenerate, quick actions) must not silently fall back
    // to the workspace/default provider when a local user session is expected.
    if (isLocalUserSessionRef.current && !effectiveRuntime) {
      window.toastr?.error(
        "Selected local Ollama model is no longer available. Recheck Ollama models and choose another.",
        "Local model unavailable",
        { timeOut: 8000 }
      );
      return false;
    }

    if (writeMode === "prepend") {
      const currentText = document.getElementById(PROMPT_INPUT_ID)?.value ?? "";
      text = currentText + " " + text;
    }

    // If we are auto-submitting in append mode
    // than we need to update text with whatever is in the prompt input + the text we are sending.
    // @note: `message` will not work here since it is not updated yet.
    // If text is still empty, after this, then we should just return.
    if (writeMode === "append") {
      const currentText = document.getElementById(PROMPT_INPUT_ID)?.value ?? "";
      text = currentText + text;
    }

    if (!text || text === "") return false;

    // Clear the localStorage draft so that if the PromptInput remounts
    // (e.g. /reset causing empty→chat or chat→empty transitions),
    // it won't restore stale text.
    clearPromptInputDraft(threadSlug ?? workspace.slug);

    // If we are auto-submitting
    // Then we can replace the current text since this is not accumulating.
    let prevChatHistory;
    if (history.length > 0) {
      // use pre-determined history chain.
      prevChatHistory = [
        ...history,
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: text,
          attachments,
          runtime: effectiveRuntime,
          animate: true,
        },
      ];
    } else {
      prevChatHistory = [
        ...chatHistory,
        {
          content: text,
          role: "user",
          attachments,
          runtime: effectiveRuntime,
        },
        {
          content: "",
          role: "assistant",
          pending: true,
          userMessage: text,
          attachments,
          runtime: effectiveRuntime,
          animate: true,
        },
      ];
    }

    setChatHistory(prevChatHistory);
    setMessageEmit("");
    setLoadingResponse(true);
    return true;
  };

  useEffect(() => {
    const scopedStoredRuntime = getStoredLocalUserRuntimeForWorkspace(
      workspace?.slug
    );
    activeLocalUserRuntimeRef.current = scopedStoredRuntime.runtime;
    isLocalUserSessionRef.current = scopedStoredRuntime.isLocalUserSession;
    pendingMessageChecked.current = false;
  }, [workspace?.slug, threadSlug]);

  useEffect(() => {
    if (pendingMessageChecked.current || !workspace?.slug) return;
    pendingMessageChecked.current = true;

    const { pending, shouldClearLegacy } = getPendingHomeMessageForDestination({
      workspaceSlug: workspace?.slug,
      threadSlug,
    });
    if (shouldClearLegacy) {
      sessionStorage.removeItem(PENDING_HOME_MESSAGE);
      return;
    }

    if (pending?.message) {
      // Mark this as a Local User session if the pending message carries a local
      // user Ollama intent (regardless of whether the model is valid), so the
      // missing-model guard can fire on follow-up messages if validation fails.
      const hasLocalUserIntent = isLocalUserOllamaIntent(pending?.runtime);
      if (hasLocalUserIntent) {
        isLocalUserSessionRef.current = true;
      } else {
        isLocalUserSessionRef.current = false;
        activeLocalUserRuntimeRef.current = null;
        sessionStorage.removeItem(SWARMSY_LOCAL_USER_ACTIVE_RUNTIME);
      }
      const runtime = normalizeLocalUserOllamaRuntimeSelection(
        pending?.runtime
      );
      // Persist the validated Local User runtime for the entire chat/session
      // so follow-up messages continue using the selected Ollama model.
      if (runtime) {
        activeLocalUserRuntimeRef.current = runtime;
        sessionStorage.setItem(
          SWARMSY_LOCAL_USER_ACTIVE_RUNTIME,
          JSON.stringify({
            ...runtime,
            workspaceSlug: workspace.slug,
          })
        );
      } else if (hasLocalUserIntent) {
        activeLocalUserRuntimeRef.current = null;
        sessionStorage.removeItem(SWARMSY_LOCAL_USER_ACTIVE_RUNTIME);
      }
      const timeoutId = setTimeout(async () => {
        const { pending: latestPending } = getPendingHomeMessageForDestination({
          workspaceSlug: workspace?.slug,
          threadSlug,
        });
        if (!latestPending?.message) return;

        const latestRuntime = normalizeLocalUserOllamaRuntimeSelection(
          latestPending?.runtime
        );
        const result = await sendCommand({
          text: latestPending.message,
          attachments: latestPending.attachments || [],
          runtime: latestRuntime,
          autoSubmit: true,
        });

        if (result !== false) {
          const { pending: currentPending } =
            getPendingHomeMessageForDestination({
              workspaceSlug: workspace?.slug,
              threadSlug,
            });

          if (
            currentPending?.workspaceSlug === latestPending.workspaceSlug &&
            currentPending?.threadSlug === latestPending.threadSlug &&
            currentPending?.message === latestPending.message &&
            JSON.stringify(currentPending?.attachments || []) ===
              JSON.stringify(latestPending?.attachments || []) &&
            JSON.stringify(currentPending?.runtime || null) ===
              JSON.stringify(latestPending?.runtime || null)
          ) {
            sessionStorage.removeItem(PENDING_HOME_MESSAGE);
          }
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [workspace?.slug, threadSlug]);

  useEffect(() => {
    async function fetchReply() {
      const promptMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
      const remHistory = chatHistory.length > 0 ? chatHistory.slice(0, -1) : [];
      var _chatHistory = [...remHistory];

      // Override hook for new messages to now go to agents until the connection closes
      if (!!websocket) {
        if (!promptMessage || !promptMessage?.userMessage) return false;
        const attachments = promptMessage?.attachments ?? parseAttachments();
        window.dispatchEvent(new CustomEvent(CLEAR_ATTACHMENTS_EVENT));
        websocket.send(
          JSON.stringify({
            type: "awaitingFeedback",
            feedback: promptMessage?.userMessage,
            attachments,
          })
        );

        // /reset during an active agent session should end the session AND
        // clear the chat in a single action. The send above triggers the
        // server to abort the agent and close the socket; fall through to the
        // /reset flow below which resets memory + clears chat history.
        if (promptMessage.userMessage.trim() !== "/reset") return;
        pendingResetRef.current = true;
      }

      if (!promptMessage || !promptMessage?.userMessage) return false;

      // If running and edit or regeneration, this history will already have attachments
      // so no need to parse the current state.
      const attachments = promptMessage?.attachments ?? parseAttachments();
      window.dispatchEvent(new CustomEvent(CLEAR_ATTACHMENTS_EVENT));

      await Workspace.multiplexStream({
        workspaceSlug: workspace.slug,
        threadSlug,
        prompt: promptMessage.userMessage,
        runtime: promptMessage?.runtime,
        chatHandler: (chatResult) =>
          handleChat(
            chatResult,
            setLoadingResponse,
            setChatHistory,
            remHistory,
            _chatHistory,
            setSocketId
          ),
        attachments,
      });
      return;
    }
    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory, workspace]);

  // TODO: Simplify this WSS stuff
  useEffect(() => {
    let socket = null;

    function handleWSS() {
      try {
        if (!socketId || !!websocket) return;
        socket = new WebSocket(
          `${websocketURI()}/api/agent-invocation/${socketId}`
        );
        socket.supportsAgentStreaming = false;

        window.addEventListener(ABORT_STREAM_EVENT, () => {
          setAgentSessionActive(false);
          window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
          socket?.close();
        });

        socket.addEventListener("message", (event) => {
          setLoadingResponse(true);
          try {
            handleSocketResponse(socket, event, setChatHistory);
          } catch {
            console.error("Failed to parse data");
            setAgentSessionActive(false);
            window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
            socket.close();
          }
          setLoadingResponse(false);
        });

        socket.addEventListener("close", (_event) => {
          setAgentSessionActive(false);
          window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
          // When the close was triggered by /reset, skip the "Agent session
          // complete." status - the pending /reset flow will clear history.
          if (pendingResetRef.current) {
            pendingResetRef.current = false;
          } else {
            setChatHistory((prev) => [
              ...prev.filter((msg) => !!msg.content),
              {
                uuid: v4(),
                type: "statusResponse",
                content: "Agent session complete.",
                role: "assistant",
                sources: [],
                closed: true,
                error: null,
                animate: false,
                pending: false,
              },
            ]);
          }
          setLoadingResponse(false);
          setWebsocket(null);
          setSocketId(null);
        });
        setWebsocket(socket);
        setAgentSessionActive(true);
        window.dispatchEvent(new CustomEvent(AGENT_SESSION_START));
        window.dispatchEvent(new CustomEvent(CLEAR_ATTACHMENTS_EVENT));
      } catch (e) {
        setChatHistory((prev) => [
          ...prev.filter((msg) => !!msg.content),
          {
            uuid: v4(),
            type: "abort",
            content: e.message,
            role: "assistant",
            sources: [],
            closed: true,
            error: e.message,
            animate: false,
            pending: false,
          },
        ]);
        setLoadingResponse(false);
        setWebsocket(null);
        setSocketId(null);
      }
    }
    handleWSS();

    return () => {
      if (socket) {
        setAgentSessionActive(false);
        window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
        socket.close();
      }
    };
  }, [socketId]);

  if (isEmpty) {
    return (
      <ChatSidebarProvider>
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative flex md:ml-[2px] md:mr-[16px] md:my-[16px] w-full h-full z-[2]"
        >
          <ChatSettingsMenu />
          <div className="flex-1 min-w-0 transition-all duration-500 relative md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-hidden border-none light:border-solid light:border light:border-theme-modal-border">
            {isMobile && <SidebarMobileHeader />}
            <WorkspaceModelPicker workspaceSlug={workspace.slug} />
            <DnDFileUploaderWrapper>
              <div className="flex flex-col h-full w-full items-center justify-center">
                <div className="flex flex-col items-center w-full max-w-[750px]">
                  <h1 className="text-white text-xl md:text-2xl mb-11 text-center">
                    {t("main-page.greeting")}
                  </h1>
                  <PromptInput
                    workspace={workspace}
                    submit={handleSubmit}
                    isStreaming={loadingResponse}
                    sendCommand={sendCommand}
                    attachments={files}
                    centered={true}
                  />
                  <QuickActions
                    hasAvailableWorkspace={!!workspace}
                    onCreateAgent={() => navigate(paths.settings.agentSkills())}
                    onEditWorkspace={() =>
                      navigate(
                        paths.workspace.settings.generalAppearance(
                          workspace.slug
                        )
                      )
                    }
                    onUploadDocument={() =>
                      document.getElementById("dnd-chat-file-uploader")?.click()
                    }
                  />
                </div>
                <SuggestedMessages
                  suggestedMessages={workspace?.suggestedMessages}
                  sendCommand={sendCommand}
                />
              </div>
            </DnDFileUploaderWrapper>
            <ChatTooltips />
          </div>
          <MemoriesSidebar workspace={workspace} />
        </div>
      </ChatSidebarProvider>
    );
  }

  return (
    <ChatSidebarProvider>
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative flex md:ml-[2px] md:mr-[16px] md:my-[16px] w-full h-full z-[2]"
      >
        <ChatSettingsMenu />
        <div className="flex-1 min-w-0 transition-all duration-500 relative md:rounded-[16px] bg-zinc-900 light:bg-white text-white light:text-slate-900 h-full overflow-hidden border-none light:border-solid light:border light:border-theme-modal-border">
          {isMobile && <SidebarMobileHeader />}
          <WorkspaceModelPicker workspaceSlug={workspace.slug} />
          <DnDFileUploaderWrapper>
            <div className="flex flex-col h-full w-full pb-20 md:pb-0">
              <div className="contents">
                <MetricsProvider>
                  <ChatHistory
                    ref={chatHistoryRef}
                    history={chatHistory}
                    workspace={workspace}
                    sendCommand={sendCommand}
                    updateHistory={setChatHistory}
                    regenerateAssistantMessage={regenerateAssistantMessage}
                    websocket={websocket}
                  />
                </MetricsProvider>
                <PromptInput
                  workspace={workspace}
                  submit={handleSubmit}
                  isStreaming={loadingResponse}
                  sendCommand={sendCommand}
                  attachments={files}
                  centered={false}
                />
              </div>
            </div>
          </DnDFileUploaderWrapper>
          <ChatTooltips />
        </div>
        <SourcesSidebar />
        <MemoriesSidebar workspace={workspace} />
      </div>
    </ChatSidebarProvider>
  );
}
