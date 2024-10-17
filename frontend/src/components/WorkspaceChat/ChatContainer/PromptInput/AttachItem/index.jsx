import useUser from "@/hooks/useUser";
import { PaperclipHorizontal } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem() {
  const { user } = useUser();
  if (!!user && user.role === "default") return null;

  return (
    <>
      <button
        id="attach-item-btn"
        data-tooltip-id="attach-item-btn"
        data-tooltip-content="Attach a file to this chat"
        aria-label="Attach a file to this chat"
        type="button"
        onClick={(e) => {
          e?.target?.blur();
          document?.getElementById("dnd-chat-file-uploader")?.click();
          return;
        }}
        className={`border-none relative flex justify-center items-center cursor-pointer group`}
      >
        <PaperclipHorizontal className="w-[22px] h-[22px] pointer-events-none rotate-90 -scale-y-100 text-theme-off-white group-hover:text-white" />
        <Tooltip
          id="attach-item-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </button>
    </>
  );
}
