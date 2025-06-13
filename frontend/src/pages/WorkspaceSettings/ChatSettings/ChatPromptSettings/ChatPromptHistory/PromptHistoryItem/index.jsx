import { DotsThreeVertical } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";
import PromptHistory from "@/models/promptHistory";
import { useTranslation } from "react-i18next";
import moment from "moment";
import truncate from "truncate";

const MAX_PROMPT_LENGTH = 200; // chars

export default function PromptHistoryItem({
  id,
  prompt,
  modifiedAt,
  user,
  onRestore,
  setHistory,
  onPublishClick,
}) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const deleteHistory = async (id) => {
    if (window.confirm(t("chat.prompt.history.deleteConfirm"))) {
      const { success } = await PromptHistory.delete(id);
      if (success) {
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item.id !== id)
        );
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <div className="text-xs">
          {user && (
            <>
              <span className="text-primary-button">{user.username}</span>{" "}
              <span className="mx-1 text-white">•</span>
            </>
          )}
          <span className="text-white opacity-50 light:opacity-100">
            {moment(modifiedAt).fromNow()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border-none text-sm cursor-pointer text-theme-text-primary hover:text-primary-button"
            onClick={onRestore}
          >
            {t("chat.prompt.history.restore")}
          </button>
          <div className="relative">
            <button
              type="button"
              ref={menuButtonRef}
              className="border-none text-theme-text-secondary cursor-pointer hover:text-primary-button flex items-center justify-center"
              onClick={() => setShowMenu(!showMenu)}
            >
              <DotsThreeVertical size={16} weight="bold" />
            </button>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-6 bg-theme-bg-popup-menu rounded-lg z-50 min-w-[200px]"
              >
                <button
                  type="button"
                  className="px-[10px] py-[6px] text-sm text-white hover:bg-theme-sidebar-item-hover rounded-t-lg cursor-pointer border-none w-full text-left whitespace-nowrap"
                  onClick={() => {
                    setShowMenu(false);
                    onPublishClick(prompt);
                  }}
                >
                  {t("chat.prompt.history.publish")}
                </button>
                <button
                  type="button"
                  className="px-[10px] py-[6px] text-sm text-white hover:bg-red-500/60 light:hover:bg-red-300/80 rounded-b-lg cursor-pointer border-none w-full text-left whitespace-nowrap"
                  onClick={() => {
                    setShowMenu(false);
                    deleteHistory(id);
                  }}
                >
                  {t("chat.prompt.history.delete")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-theme-text-primary text-sm font-medium break-all whitespace-pre-wrap">
          {prompt.length > MAX_PROMPT_LENGTH && !expanded ? (
            <>
              {truncate(prompt, MAX_PROMPT_LENGTH)}{" "}
              <button
                type="button"
                className="text-theme-text-secondary hover:text-primary-button border-none"
                onClick={() => setExpanded(!expanded)}
              >
                {t("chat.prompt.history.expand")}
              </button>
            </>
          ) : (
            prompt
          )}
        </div>
      </div>
    </div>
  );
}
