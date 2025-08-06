import useUser from "@/hooks/useUser";
import { PaperclipHorizontal } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import ParsedFilesMenu from "./ParsedFilesMenu";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem({ workspace }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const tooltipRef = useRef(null);
  const { theme } = useTheme();
  const [isEmbedding, setIsEmbedding] = useState(false);

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
        className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer`}
      >
        <PaperclipHorizontal
          color="var(--theme-sidebar-footer-icon-fill)"
          className="w-[22px] h-[22px] pointer-events-none text-white rotate-90 -scale-y-100"
        />
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
          workspace={workspace}
          onEmbeddingChange={setIsEmbedding}
        />
      </Tooltip>
    </>
  );
}
