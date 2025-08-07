import useUser from "@/hooks/useUser";
import { PaperclipHorizontal } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import { ATTACHMENTS_PROCESSED_EVENT } from "../../DnDWrapper";
import { useTheme } from "@/hooks/useTheme";
import ParsedFilesMenu from "./ParsedFilesMenu";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { theme } = useTheme();
  const { slug, threadSlug = null } = useParams();
  const tooltipRef = useRef(null);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [contextWindow, setContextWindow] = useState(Infinity);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    if (!slug) return;
    setIsLoading(true);
    const { files, contextWindow, currentContextTokenCount } =
      await Workspace.getParsedFiles(slug, threadSlug);
    setFiles(files);
    setContextWindow(contextWindow);
    setCurrentTokens(currentContextTokenCount);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFiles();
    window.addEventListener(ATTACHMENTS_PROCESSED_EVENT, fetchFiles);
    return () =>
      window.removeEventListener(ATTACHMENTS_PROCESSED_EVENT, fetchFiles);
  }, [slug, threadSlug]);

  if (!!user && user.role === "default") return null;

  return (
    <>
      <button
        id="attach-item-btn"
        data-tooltip-id="tooltip-attach-item-btn"
        aria-label={t("chat_window.attach_file")}
        type="button"
        onClick={(e) => {
          e?.target?.blur();
          document?.getElementById("dnd-chat-file-uploader")?.click();
          return;
        }}
        onPointerEnter={fetchFiles}
        className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer`}
      >
        <div className="relative">
          <PaperclipHorizontal
            color="var(--theme-sidebar-footer-icon-fill)"
            className="w-[22px] h-[22px] pointer-events-none text-white rotate-90 -scale-y-100"
          />
          {files.length > 0 && (
            <div className="absolute -top-2 -left-2 bg-white text-black light:invert text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {files.length}
            </div>
          )}
        </div>
      </button>
      <Tooltip
        ref={tooltipRef}
        id="tooltip-attach-item-btn"
        place="top"
        opacity={1}
        clickable={!isEmbedding}
        delayShow={300}
        delayHide={isEmbedding ? null : 800}
        arrowColor={
          theme === "light"
            ? "var(--theme-modal-border)"
            : "var(--theme-bg-primary)"
        }
        className="z-99 !w-[400px] !bg-theme-bg-primary !px-[5px] !rounded-lg !pointer-events-auto light:border-2 light:border-theme-modal-border"
      >
        <ParsedFilesMenu
          onEmbeddingChange={setIsEmbedding}
          tooltipRef={tooltipRef}
          isLoading={isLoading}
          files={files}
          setFiles={setFiles}
          currentTokens={currentTokens}
          setCurrentTokens={setCurrentTokens}
          contextWindow={contextWindow}
        />
      </Tooltip>
    </>
  );
}
