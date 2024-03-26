import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import ChatService from "@/models/chatService";
import {
  ArrowCounterClockwise,
  Check,
  Copy,
  DotsThreeOutlineVertical,
  Envelope,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
}) {
  const [showingOptions, setShowOptions] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    setShowOptions(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="flex items-center relative rounded-t-2xl bg-black/10">
      <div className="flex justify-center items-center w-full h-[76px]">
        <img
          style={{ maxWidth: 48, maxHeight: 48 }}
          src={iconUrl ?? AnythingLLMIcon}
          alt={iconUrl ? "Brand" : "AnythingLLM Logo"}
        />
      </div>
      <div className="absolute right-0 flex gap-x-1 items-center px-[22px]">
        {settings.loaded && (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setShowOptions(!showingOptions)}
            className="hover:bg-gray-100 rounded-sm text-slate-800"
          >
            <DotsThreeOutlineVertical size={20} weight="fill" />
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className="hover:bg-gray-100 rounded-sm text-slate-800"
        >
          <X size={20} weight="bold" />
        </button>
      </div>
      <OptionsMenu
        settings={settings}
        showing={showingOptions}
        resetChat={handleChatReset}
        sessionId={sessionId}
        menuRef={menuRef}
      />
    </div>
  );
}

function OptionsMenu({ settings, showing, resetChat, sessionId, menuRef }) {
  if (!showing) return null;
  return (
    <div
      ref={menuRef}
      className="absolute z-10 bg-white flex flex-col gap-y-1 rounded-xl shadow-lg border border-gray-300 top-[64px] right-[46px]"
    >
      <button
        onClick={resetChat}
        className="flex items-center gap-x-2 hover:bg-gray-100 text-sm text-gray-700 py-2.5 px-4 rounded-xl"
      >
        <ArrowCounterClockwise size={24} />
        <p className="text-sm text-[#7A7D7E] font-bold">Reset Chat</p>
      </button>
      <ContactSupport email={settings.supportEmail} />
      <SessionID sessionId={sessionId} />
    </div>
  );
}

function SessionID({ sessionId }) {
  if (!sessionId) return null;

  const [sessionIdCopied, setSessionIdCopied] = useState(false);

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setSessionIdCopied(true);
    setTimeout(() => setSessionIdCopied(false), 1000);
  };

  if (sessionIdCopied) {
    return (
      <div className="flex items-center gap-x-2 hover:bg-gray-100 text-sm text-gray-700 py-2.5 px-4 rounded-xl">
        <Check size={24} />
        <p className="text-sm text-[#7A7D7E] font-bold">Copied!</p>
      </div>
    );
  }

  return (
    <button
      onClick={copySessionId}
      className="flex items-center gap-x-2 hover:bg-gray-100 text-sm text-gray-700 py-2.5 px-4 rounded-xl"
    >
      <Copy size={24} />
      <p className="text-sm text-[#7A7D7E] font-bold">Session ID</p>
    </button>
  );
}

function ContactSupport({ email = null }) {
  if (!email) return null;

  const subject = `Inquiry from ${window.location.origin}`;
  return (
    <a
      href={`mailto:${email}?Subject=${encodeURIComponent(subject)}`}
      className="flex items-center gap-x-2 hover:bg-gray-100 text-sm text-gray-700 py-2.5 px-4 rounded-xl"
    >
      <Envelope size={24} />
      <p className="text-sm text-[#7A7D7E] font-bold">Email Support</p>
    </a>
  );
}
