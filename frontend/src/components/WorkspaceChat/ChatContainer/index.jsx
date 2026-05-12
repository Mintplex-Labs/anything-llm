import { useEffect, useContext, useRef } from "react";
import ChatHistory from "./ChatHistory";
import { DndUploaderContext } from "./DnDWrapper";
import PromptInput, {
  PROMPT_INPUT_EVENT,
  PROMPT_INPUT_ID,
} from "./PromptInput";
import Workspace from "@/models/workspace";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import { useNavigate } from "react-router-dom";
import DnDFileUploaderWrapper from "./DnDWrapper";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ChatTooltips } from "./ChatTooltips";
import { MetricsProvider } from "./ChatHistory/HistoricalMessage/Actions/RenderMetrics";
import useChatContainerQuickScroll from "@/hooks/useChatContainerQuickScroll";
import { PENDING_HOME_MESSAGE } from "@/utils/constants";
import { clearPromptInputDraft } from "@/hooks/usePromptInputStorage";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import QuickActions from "@/components/lib/QuickActions";
import SuggestedMessages from "@/components/lib/SuggestedMessages";
import TextSizeMenu from "./TextSizeMenu";
import WorkspaceModelPicker from "./WorkspaceModelPicker";
import SourcesSidebar, { SourcesSidebarProvider } from "./SourcesSidebar";
import { useChatThreadDrafts } from "@/contexts/ChatThreadDraftProvider";

export default function ChatContainer({
  workspace,
  threadSlug = null,
  knownHistory = [],
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    getDraft,
    mergeServerHistory,
    setMessages,
    startStream,
    respondToApproval,
    getChatKey,
  } = useChatThreadDrafts();
  const chatKey = getChatKey(workspace?.slug, threadSlug);
  const draft = getDraft(workspace?.slug, threadSlug);
  const chatHistory = draft?.messages || knownHistory;
  const loadingResponse = !!draft?.isStreaming;
  const { files, parseAttachments } = useContext(DndUploaderContext);
  const { chatHistoryRef } = useChatContainerQuickScroll();
  const pendingMessageChecked = useRef(false);

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

  useEffect(() => {
    if (!workspace?.slug) return;
    mergeServerHistory({
      workspaceSlug: workspace.slug,
      threadSlug,
      history: knownHistory,
    });
  }, [workspace?.slug, threadSlug, knownHistory, mergeServerHistory]);

  function updateChatHistory(messagesOrUpdater) {
    if (!chatKey) return;
    setMessages(chatKey, messagesOrUpdater);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentMessage =
      document.getElementById(PROMPT_INPUT_ID)?.value || "";
    if (!currentMessage) return false;

    // Clear the localStorage draft for this thread/workspace so that if the
    // PromptInput remounts (empty→chat transition), it won't restore stale text
    clearPromptInputDraft(threadSlug ?? workspace.slug);

    const attachments = parseAttachments();

    if (listening) {
      // Stop the mic if the send button is clicked
      endSTTSession();
    }
    setMessageEmit("");
    startStream({
      workspaceSlug: workspace.slug,
      threadSlug,
      prompt: currentMessage,
      attachments,
      history: chatHistory,
      parseAttachments,
      sendToExistingAgent: !!draft?.isAgentRunning,
    });
  };

  function endSTTSession() {
    SpeechRecognition.stopListening();
    resetTranscript();
  }

  const regenerateAssistantMessage = (chatId) => {
    const updatedHistory = chatHistory.slice(0, -1);
    const lastUserMessage = updatedHistory.slice(-1)[0];
    Workspace.deleteChats(workspace.slug, [chatId])
      .then(() =>
        sendCommand({
          text: lastUserMessage.content,
          autoSubmit: true,
          history: updatedHistory,
          attachments: lastUserMessage?.attachments,
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
   * @param {Object[import("./DnDWrapper").Attachment]} options.attachments - The attachments to send to the LLM for this message
   * @param {'replace' | 'append' | 'prepend'} options.writeMode - Replace current text or append to existing text (default: replace)
   * @returns {void}
   */
  const sendCommand = async ({
    text = "",
    autoSubmit = false,
    history = [],
    attachments = [],
    writeMode = "replace",
  } = {}) => {
    // If we are not auto-submitting, we can just emit the text to the prompt input.
    if (!autoSubmit) {
      setMessageEmit(text, writeMode);
      return;
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

    setMessageEmit("");
    startStream({
      workspaceSlug: workspace.slug,
      threadSlug,
      prompt: text,
      attachments,
      history: history.length > 0 ? history : chatHistory,
      parseAttachments,
      sendToExistingAgent: !!draft?.isAgentRunning,
    });
  };

  useEffect(() => {
    if (pendingMessageChecked.current || !workspace?.slug) return;
    pendingMessageChecked.current = true;

    const pending = safeJsonParse(sessionStorage.getItem(PENDING_HOME_MESSAGE));
    if (pending?.message) {
      setTimeout(() => {
        sessionStorage.removeItem(PENDING_HOME_MESSAGE);
        sendCommand({
          text: pending.message,
          attachments: pending.attachments || [],
          autoSubmit: true,
        });
      }, 100);
    }
  }, [workspace?.slug]);

  const isEmpty =
    chatHistory.length === 0 && !sessionStorage.getItem(PENDING_HOME_MESSAGE);

  if (isEmpty) {
    return (
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-hidden border-none light:border-solid light:border light:border-theme-modal-border"
      >
        {isMobile && <SidebarMobileHeader />}
        <TextSizeMenu />
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
                    paths.workspace.settings.generalAppearance(workspace.slug)
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
    );
  }

  return (
    <SourcesSidebarProvider>
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative flex md:ml-[2px] md:mr-[16px] md:my-[16px] w-full h-full z-[2]"
      >
        <TextSizeMenu />
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
                    updateHistory={updateChatHistory}
                    regenerateAssistantMessage={regenerateAssistantMessage}
                    chatKey={chatKey}
                    approvalState={draft?.pendingApproval}
                    onToolApprovalResponse={respondToApproval}
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
      </div>
    </SourcesSidebarProvider>
  );
}
