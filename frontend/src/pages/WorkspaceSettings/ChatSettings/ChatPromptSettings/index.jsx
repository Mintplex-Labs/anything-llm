import { useEffect, useState, useRef, Fragment } from "react";
import { chatPrompt } from "@/utils/chat";
import { useTranslation } from "react-i18next";
import SystemPromptVariable from "@/models/systemPromptVariable";
import Highlighter from "react-highlight-words";
import { Link, useSearchParams } from "react-router-dom";
import paths from "@/utils/paths";
import ChatPromptHistory from "./ChatPromptHistory";
import PublishEntityModal from "@/components/CommunityHub/PublishEntityModal";
import { useModal } from "@/hooks/useModal";

// TODO: Move to backend and have user-language sensitive default prompt
const DEFAULT_PROMPT =
  "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [availableVariables, setAvailableVariables] = useState([]);
  const [prompt, setPrompt] = useState(chatPrompt(workspace));
  const [isEditing, setIsEditing] = useState(false);
  const [showPromptHistory, setShowPromptHistory] = useState(false);
  const promptRef = useRef(null);
  const promptHistoryRef = useRef(null);
  const historyButtonRef = useRef(null);
  const [searchParams] = useSearchParams();
  const {
    isOpen: showPublishModal,
    closeModal: closePublishModal,
    openModal: openPublishModal,
  } = useModal();
  const [currentPrompt, setCurrentPrompt] = useState(chatPrompt(workspace));

  useEffect(() => {
    async function setupVariableHighlighting() {
      const { variables } = await SystemPromptVariable.getAll();
      setAvailableVariables(variables);
    }
    setupVariableHighlighting();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "focus-system-prompt")
      setIsEditing(true);
  }, [searchParams]);

  useEffect(() => {
    if (isEditing && promptRef.current) {
      promptRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        promptHistoryRef.current &&
        !promptHistoryRef.current.contains(event.target) &&
        historyButtonRef.current &&
        !historyButtonRef.current.contains(event.target)
      ) {
        setShowPromptHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRestore = (prompt) => {
    setPrompt(prompt);
    setShowPromptHistory(false);
    setHasChanges(true);
  };

  const handlePublishClick = (prompt) => {
    setCurrentPrompt(prompt);
    setShowPromptHistory(false);
    openPublishModal();
  };

  return (
    <>
      <ChatPromptHistory
        ref={promptHistoryRef}
        workspaceSlug={workspace.slug}
        show={showPromptHistory}
        onRestore={handleRestore}
        onPublishClick={handlePublishClick}
        onClose={() => {
          setShowPromptHistory(false);
        }}
      />
      <div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <label htmlFor="name" className="block input-label">
              {t("chat.prompt.title")}
            </label>
          </div>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {t("chat.prompt.description")}
          </p>
          <p className="text-white text-opacity-60 text-xs font-medium mb-2">
            You can insert{" "}
            <Link
              to={paths.settings.systemPromptVariables()}
              className="text-primary-button"
            >
              prompt variables
            </Link>{" "}
            like:{" "}
            {availableVariables.slice(0, 3).map((v, i) => (
              <Fragment key={v.key}>
                <span className="bg-theme-settings-input-bg px-1 py-0.5 rounded">
                  {`{${v.key}}`}
                </span>
                {i < availableVariables.length - 1 && ", "}
              </Fragment>
            ))}
            {availableVariables.length > 3 && (
              <Link
                to={paths.settings.systemPromptVariables()}
                className="text-primary-button"
              >
                +{availableVariables.length - 3} more...
              </Link>
            )}
          </p>
        </div>

        <input type="hidden" name="openAiPrompt" defaultValue={prompt} />
        <div className="relative w-full flex flex-col items-end">
          <button
            ref={historyButtonRef}
            type="button"
            className="text-theme-text-secondary hover:text-white light:hover:text-black text-xs font-medium"
            onClick={(e) => {
              e.preventDefault();
              setShowPromptHistory(!showPromptHistory);
            }}
          >
            {showPromptHistory ? "Hide History" : "View History"}
          </button>
          <div className="relative w-full">
            <span
              className={`${!!prompt ? "hidden" : "block"} text-sm pointer-events-none absolute top-2 left-0 p-2.5 w-full h-full !text-theme-settings-input-placeholder opacity-60`}
            >
              {DEFAULT_PROMPT}
            </span>
            {isEditing ? (
              <textarea
                ref={promptRef}
                autoFocus={true}
                rows={5}
                onFocus={(e) => {
                  const length = e.target.value.length;
                  e.target.setSelectionRange(length, length);
                }}
                onBlur={(e) => {
                  setIsEditing(false);
                  setPrompt(e.target.value);
                }}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setHasChanges(true);
                }}
                onPaste={(e) => {
                  setPrompt(e.target.value);
                  setHasChanges(true);
                }}
                style={{
                  resize: "vertical",
                  overflowY: "scroll",
                  minHeight: "150px",
                }}
                defaultValue={prompt}
                className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2"
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                style={{
                  resize: "vertical",
                  overflowY: "scroll",
                  minHeight: "150px",
                }}
                className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2"
              >
                <Highlighter
                  className="whitespace-pre-wrap"
                  highlightClassName="bg-cta-button p-0.5 rounded-md"
                  searchWords={availableVariables.map((v) => `{${v.key}}`)}
                  autoEscape={true}
                  caseSensitive={true}
                  textToHighlight={prompt}
                />
              </div>
            )}
          </div>
          <div className="w-full flex flex-row items-center justify-between pt-2">
            {prompt !== DEFAULT_PROMPT && (
              <>
                <button
                  type="button"
                  onClick={() => handleRestore(DEFAULT_PROMPT)}
                  className="text-theme-text-primary hover:text-white light:hover:text-black text-xs font-medium"
                >
                  Clear
                </button>
                <PublishPromptCTA
                  hidden={
                    isEditing ||
                    prompt === DEFAULT_PROMPT ||
                    prompt?.trim().length < 10
                  }
                  onClick={() => {
                    setCurrentPrompt(prompt);
                    openPublishModal();
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <PublishEntityModal
        show={showPublishModal}
        onClose={closePublishModal}
        entityType="system-prompt"
        entity={currentPrompt}
      />
    </>
  );
}

function PublishPromptCTA({ hidden = false, onClick }) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-none text-primary-button hover:text-white light:hover:text-black text-xs font-medium"
    >
      Publish to Community Hub
    </button>
  );
}
