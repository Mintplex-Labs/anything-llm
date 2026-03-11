import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import {
  ATTACHMENTS_PROCESSED_EVENT,
  REMOVE_ATTACHMENT_EVENT,
} from "../../DnDWrapper";
import ParsedFilesMenu from "./ParsedFilesMenu";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem({
  workspaceSlug = null,
  workspaceThreadSlug = null,
}) {
  const { t } = useTranslation();
  const params = useParams();
  const slug = workspaceSlug || params.slug;
  const threadSlug = workspaceThreadSlug ?? params.threadSlug ?? null;
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [contextWindow, setContextWindow] = useState(Infinity);
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = () => {
    if (!slug) return;
    if (isEmbedding) return;
    setIsLoading(true);
    Workspace.getParsedFiles(slug, threadSlug)
      .then(({ files, contextWindow, currentContextTokenCount }) => {
        setFiles(files);
        setContextWindow(contextWindow);
        setCurrentTokens(currentContextTokenCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasParsedFiles = files.length > 0;

  /**
   * Handles the removal of an attachment from the parsed files
   * and triggers a re-fetch of the parsed files.
   * This function handles when the user clicks the X on an Attachment via the AttachmentManager
   * so we need to sync the state in the ParsedFilesMenu picker here.
   */
  async function handleRemoveAttachment(e) {
    const { document } = e.detail;
    await Workspace.deleteParsedFiles(slug, [document.id]);
    fetchFiles();
  }

  /**
   * Handles the click event for the attach item button.
   * @param {MouseEvent} e - The click event.
   * @returns {void}
   */
  function handleClick(e) {
    e?.target?.blur();
    document?.getElementById("dnd-chat-file-uploader")?.click();
    return;
  }

  function handlePointerEnter() {
    setIsHovering(true);
    fetchFiles();
  }

  function handlePointerLeave() {
    setIsHovering(false);
    if (!isEmbedding) setIsMenuOpen(false);
  }

  useEffect(() => {
    fetchFiles();
    window.addEventListener(ATTACHMENTS_PROCESSED_EVENT, fetchFiles);
    window.addEventListener(REMOVE_ATTACHMENT_EVENT, handleRemoveAttachment);
    return () => {
      window.removeEventListener(ATTACHMENTS_PROCESSED_EVENT, fetchFiles);
      window.removeEventListener(
        REMOVE_ATTACHMENT_EVENT,
        handleRemoveAttachment
      );
    };
  }, [slug, threadSlug]);

  useEffect(() => {
    if (isHovering && hasParsedFiles) {
      setIsMenuOpen(true);
      return;
    }

    if ((!hasParsedFiles || !isHovering) && !isEmbedding) {
      setIsMenuOpen(false);
    }
  }, [hasParsedFiles, isHovering, isEmbedding]);

  return (
    <div
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        id="attach-item-btn"
        data-tooltip-id={!hasParsedFiles ? "attach-item-btn" : undefined}
        data-tooltip-content={
          !hasParsedFiles ? t("chat_window.attach_file") : undefined
        }
        aria-label={t("chat_window.attach_file")}
        type="button"
        onClick={handleClick}
        className="group border-none relative flex justify-center items-center cursor-pointer w-8 h-8 rounded-full hover:bg-zinc-700 light:hover:bg-slate-200"
      >
        <div className="relative">
          <Plus
            className="w-[16px] h-[16px] pointer-events-none text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-600"
            weight="bold"
          />
          {hasParsedFiles && (
            <div className="absolute -top-2.5 -right-2 bg-white text-black light:invert text-[8px] rounded-full px-1 flex items-center justify-center">
              {files.length}
            </div>
          )}
        </div>
      </button>
      {isMenuOpen && hasParsedFiles && (
        <div className="absolute bottom-full left-0 mb-2 z-[99] w-[400px] rounded-lg bg-theme-bg-primary px-[5px] light:border-2 light:border-theme-modal-border shadow-xl">
          <ParsedFilesMenu
            onEmbeddingChange={setIsEmbedding}
            onClose={() => setIsMenuOpen(false)}
            isLoading={isLoading}
            files={files}
            setFiles={setFiles}
            currentTokens={currentTokens}
            setCurrentTokens={setCurrentTokens}
            contextWindow={contextWindow}
            workspaceSlug={slug}
            threadSlug={threadSlug}
          />
        </div>
      )}
    </div>
  );
}
