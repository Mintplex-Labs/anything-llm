import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import useLoginMode from "@/hooks/useLoginMode";
import ModalWrapper from "@/components/ModalWrapper";
import SwarmsyLocalUserSettingsHub from "@/components/SwarmsyLocalUserSettingsHub";
import { useLocalUserSettingsHub } from "@/components/SwarmsyLocalUserSettingsHub/useLocalUserSettingsHub";
import TextSizeRow from "./TextSize";
import MemoriesRow from "./Memories";
import LocalUserSettingsHubRow from "./LocalUserSettingsHubRow";

function LocalUserSettingsHubModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen}>
      <LocalUserSettingsHubModalInner onClose={onClose} />
    </ModalWrapper>
  );
}

function LocalUserSettingsHubModalInner({ onClose }) {
  const localUserSettingsHubController = useLocalUserSettingsHub();

  return (
    <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-theme-sidebar-border bg-theme-bg-primary p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-theme-text-primary">
          Local User Settings Hub
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-3 py-1 text-sm text-theme-text-primary"
        >
          Close
        </button>
      </div>
      <SwarmsyLocalUserSettingsHub
        controller={localUserSettingsHubController}
      />
    </div>
  );
}

export default function ChatSettingsMenu() {
  const location = useLocation();
  const mode = useLoginMode();
  const [showMenu, setShowMenu] = useState(false);
  const [showLocalUserSettingsHub, setShowLocalUserSettingsHub] =
    useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    setShowMenu(false);
    setShowLocalUserSettingsHub(false);
  }, [location.pathname]);

  function openLocalUserSettingsHub() {
    setShowMenu(false);
    setShowLocalUserSettingsHub(true);
  }

  const hasUserIcon = mode !== null;

  return (
    <>
      <div
        className={`absolute top-3 md:top-5 z-30 ${hasUserIcon ? "right-[55px] md:right-[67px]" : "right-4 md:right-6"}`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className={`group border-none cursor-pointer flex items-center justify-center w-[35px] h-[35px] rounded-full transition-all ${
            showMenu
              ? "bg-zinc-700 light:bg-slate-200"
              : "hover:bg-zinc-700 light:hover:bg-slate-200"
          }`}
        >
          <SlidersHorizontal
            size={18}
            className={
              showMenu
                ? "text-white light:text-slate-800"
                : "text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-800"
            }
          />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-[42px] bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3.5 w-[226px] flex flex-col gap-1.5 shadow-lg"
          >
            <TextSizeRow />
            <LocalUserSettingsHubRow onOpen={openLocalUserSettingsHub} />
            <MemoriesRow onClose={() => setShowMenu(false)} />
          </div>
        )}
      </div>
      <LocalUserSettingsHubModal
        isOpen={showLocalUserSettingsHub}
        onClose={() => setShowLocalUserSettingsHub(false)}
      />
    </>
  );
}
