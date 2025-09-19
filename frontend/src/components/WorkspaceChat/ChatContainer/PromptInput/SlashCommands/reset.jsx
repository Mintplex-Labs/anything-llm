import React, { useEffect } from "react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { useTranslation } from "react-i18next";

export default function ResetCommand({
  setShowing,
  sendCommand,
  highlightedSlashCommand,
}) {
  const { t } = useTranslation();
  const isActiveAgentSession = useIsAgentSessionActive();

  useEffect(() => {
    const handleSelectHighlighted = (event) => {
      const { highlightedIndex } = event.detail;
      if (highlightedIndex === 0) {
        // Reset command is selected
        setShowing(false);
        sendCommand({ text: "/reset", autoSubmit: true });
      }
    };

    window.addEventListener(
      "selectHighlightedSlashCommand",
      handleSelectHighlighted
    );

    return () => {
      window.removeEventListener(
        "selectHighlightedSlashCommand",
        handleSelectHighlighted
      );
    };
  }, [setShowing, sendCommand]);

  if (isActiveAgentSession) return null; // cannot reset during active agent chat

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand({ text: "/reset", autoSubmit: true });
      }}
      className={`border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-col justify-start ${highlightedSlashCommand === 0 ? "bg-theme-action-menu-item-hover" : ""}`}
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">
          {t("chat_window.slash_reset")}
        </div>
        <div className="text-white text-opacity-60 text-sm">
          {t("chat_window.preset_reset_description")}
        </div>
      </div>
    </button>
  );
}
