import { useState } from "react";
import { X, CircleNotch, Warning } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { useParams } from "react-router-dom";
import { nFormatter } from "@/utils/numbers";
import showToast from "@/utils/toast";
import pluralize from "pluralize";
import { PARSED_FILE_ATTACHMENT_REMOVED_EVENT } from "../../../DnDWrapper";
import useUser from "@/hooks/useUser";

export default function ParsedFilesMenu({
  onEmbeddingChange,
  tooltipRef,
  files,
  setFiles,
  currentTokens,
  setCurrentTokens,
  contextWindow,
  isLoading,
}) {
  const { user } = useUser();
  const canEmbed = !user || user.role !== "default";
  const initialContextWindowLimitExceeded =
    contextWindow &&
    currentTokens >= contextWindow * Workspace.maxContextWindowLimit;
  const { slug, threadSlug = null } = useParams();
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedProgress, setEmbedProgress] = useState(1);
  const [contextWindowLimitExceeded, setContextWindowLimitExceeded] = useState(
    initialContextWindowLimitExceeded
  );

  async function handleRemove(e, file) {
    e.preventDefault();
    e.stopPropagation();
    if (!file?.id) return;

    const success = await Workspace.deleteParsedFiles(slug, [file.id]);
    if (!success) return;

    // Update the local files list and current tokens
    setFiles((prev) => prev.filter((f) => f.id !== file.id));

    // Dispatch an event to the DnDFileUploaderWrapper to update the files list in attachment manager if it exists
    window.dispatchEvent(
      new CustomEvent(PARSED_FILE_ATTACHMENT_REMOVED_EVENT, {
        detail: { document: file },
      })
    );
    const { currentContextTokenCount } = await Workspace.getParsedFiles(
      slug,
      threadSlug
    );
    const newContextWindowLimitExceeded =
      contextWindow &&
      currentContextTokenCount >=
        contextWindow * Workspace.maxContextWindowLimit;
    setCurrentTokens(currentContextTokenCount);
    setContextWindowLimitExceeded(newContextWindowLimitExceeded);
  }

  /**
   * Handles the embedding of the files when the user exceeds the context window limit
   * and opts to embed the files into the workspace instead.
   * @returns {Promise<void>}
   */
  async function handleEmbed() {
    if (!files.length) return;
    setIsEmbedding(true);
    onEmbeddingChange?.(true);
    setEmbedProgress(1);
    try {
      let completed = 0;
      await Promise.all(
        files.map((file) =>
          Workspace.embedParsedFile(slug, file.id).then(() => {
            completed++;
            setEmbedProgress(completed + 1);
          })
        )
      );
      setFiles([]);
      const { currentContextTokenCount } = await Workspace.getParsedFiles(
        slug,
        threadSlug
      );
      setCurrentTokens(currentContextTokenCount);
      setContextWindowLimitExceeded(
        currentContextTokenCount >=
          contextWindow * Workspace.maxContextWindowLimit
      );
      showToast(
        `${files.length} ${pluralize("file", files.length)} embedded successfully`,
        "success"
      );
      tooltipRef?.current?.close();
    } catch (error) {
      console.error("Failed to embed files:", error);
      showToast("Failed to embed files", "error");
    }
    setIsEmbedding(false);
    onEmbeddingChange?.(false);
    setEmbedProgress(1);
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-theme-text-primary">
          Current Context ({files.length} files)
        </div>
        <div
          // If the user cannot see the embed CTA, show a tooltip
          {...(contextWindowLimitExceeded &&
            !canEmbed && {
              "data-tooltip-id": "context-window-limit-exceeded",
              "data-tooltip-content":
                "You have exceeded the context window limit. Some files may be truncated or excluded from chat responses. Responses may hallucinate or lack relevant information.",
            })}
          className={`flex items-center gap-x-1 ${contextWindowLimitExceeded && !canEmbed ? "cursor-pointer" : ""}`}
        >
          {contextWindowLimitExceeded && (
            <Warning size={14} className="text-orange-600" />
          )}
          <div
            className={`text-xs ${contextWindowLimitExceeded ? "text-orange-600" : "text-theme-text-secondary"}`}
          >
            {nFormatter(currentTokens)} /{" "}
            {contextWindow ? nFormatter(contextWindow) : "--"} tokens
          </div>
        </div>
      </div>
      {contextWindowLimitExceeded && canEmbed && (
        <div className="flex flex-col gap-2 p-2 bg-theme-bg-secondary light:bg-theme-bg-primary rounded">
          <div className="flex items-start gap-2">
            <Warning
              className="flex-shrink-0 mt-1 text-yellow-500 light:text-yellow-600"
              size={16}
            />
            <div className="text-xs text-theme-text-primary">
              Your context window is getting full. Some files may be truncated
              or excluded from chat responses. We recommend embedding these
              files directly into your workspace for better results.
            </div>
          </div>
          <button
            onClick={handleEmbed}
            disabled={isEmbedding}
            className="border-none disabled:opacity-50 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-primary-button hover:bg-theme-button-primary-hover text-white font-medium rounded transition-colors shadow-sm"
          >
            {isEmbedding ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                Embedding {embedProgress} of {files.length} files...
              </>
            ) : (
              "Embed Files into Workspace"
            )}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {files.length > 0 &&
          files.map((file, i) => (
            <div
              key={i}
              className={
                "flex items-center justify-between gap-2 p-2 text-xs bg-theme-bg-secondary rounded"
              }
            >
              <div className="truncate flex-1 text-theme-text-primary">
                {file.title}
              </div>
              <button
                onClick={(e) => handleRemove(e, file)}
                className="border-none text-theme-text-secondary hover:text-theme-text-primary"
                disabled={isEmbedding}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-theme-text-secondary text-center py-2">
            <CircleNotch size={16} className="animate-spin" />
            Loading...
          </div>
        )}
        {!isLoading && files.length === 0 && (
          <div className="text-xs text-theme-text-secondary text-center py-2">
            No files found
          </div>
        )}
      </div>
    </div>
  );
}
