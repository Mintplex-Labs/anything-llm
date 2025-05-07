import { DotsThreeVertical } from "@phosphor-icons/react";
import moment from "moment";
import { useRef, useState, useEffect } from "react";
import PromptHistory from "@/models/promptHistory";

export default function PromptHistoryItem({
  id,
  prompt,
  modifiedAt,
  user,
  onRestore,
  setHistory,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const deleteHistory = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this history item? This action cannot be undone."
      )
    ) {
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
          <span className="text-theme-home-text-secondary">
            {moment(modifiedAt).fromNow()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-xs cursor-pointer hover:text-primary-button"
            onClick={onRestore}
          >
            Restore
          </div>
          <div className="relative">
            <div
              ref={menuButtonRef}
              className="text-white cursor-pointer hover:text-primary-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <DotsThreeVertical size={16} weight="bold" />
            </div>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-6 bg-black light:bg-white rounded-lg z-50"
              >
                <div
                  className="px-[10px] py-[6px] text-xs text-white hover:bg-theme-hover cursor-pointer"
                  onClick={() => {
                    setShowMenu(false);
                    deleteHistory(id);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-white text-sm font-medium">{prompt}</div>
      </div>
    </div>
  );
}
