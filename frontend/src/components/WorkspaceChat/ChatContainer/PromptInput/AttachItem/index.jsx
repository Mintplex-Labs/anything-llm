import useUser from "@/hooks/useUser";
import { PaperclipHorizontal } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import Admin from "@/models/admin";
import { useState, useEffect } from "react";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [permissions, setPermissions] = useState({
    default_workspace_dnd_file_upload: false,
  });

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const { settings } = await Admin.userPermissions();
        console.log("Fetched permissions:", settings);
        setPermissions({
          default_workspace_dnd_file_upload:
            settings?.default_workspace_dnd_file_upload === true,
        });
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
    fetchPermissions();
  }, []);

  const canUploadDndFile =
    !user ||
    user?.role !== "default" ||
    permissions.default_workspace_dnd_file_upload;

  if (!canUploadDndFile) return null;

  return (
    <>
      <button
        id="attach-item-btn"
        data-tooltip-id="attach-item-btn"
        data-tooltip-content={t("chat_window.attach_file")}
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
        id="attach-item-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-[99]"
      />
    </>
  );
}
