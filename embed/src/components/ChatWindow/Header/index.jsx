import AnythingLLMLogo from "@/assets/anything-llm-dark.png";
import ChatService from "@/models/chatService";
import {
  DotsThreeOutlineVertical,
  Envelope,
  Lightning,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
}) {
  const [showingOptions, setShowOptions] = useState(false);

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    setShowOptions(false);
  };

  return (
    <div className="flex justify-between items-center relative">
      <img
        style={{ maxWidth: 100, maxHeight: 20 }}
        src={iconUrl ?? AnythingLLMLogo}
        alt={iconUrl ? "Brand" : "AnythingLLM Logo"}
      />
      <div className="flex gap-x-1 items-center">
        {settings.loaded && (
          <button
            type="button"
            onClick={() => setShowOptions(!showingOptions)}
            className="hover:bg-gray-100 rounded-sm text-slate-800"
          >
            <DotsThreeOutlineVertical
              size={18}
              weight={!showingOptions ? "regular" : "fill"}
            />
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className="hover:bg-gray-100 rounded-sm text-slate-800"
        >
          <X size={18} />
        </button>
      </div>
      <OptionsMenu
        settings={settings}
        showing={showingOptions}
        resetChat={handleChatReset}
      />
    </div>
  );
}

function OptionsMenu({ settings, showing, resetChat }) {
  if (!showing) return null;
  return (
    <div className="absolute z-10 bg-white flex flex-col gap-y-1 rounded-lg shadow-lg border border-gray-300 top-[23px] right-[20px] max-w-[150px]">
      <button
        onClick={resetChat}
        className="flex items-center gap-x-1 hover:bg-gray-100 text-sm text-gray-700 p-2 rounded-lg"
      >
        <Lightning size={14} />
        <p>Reset Chat</p>
      </button>
      <ContactSupport email={settings.supportEmail} />
    </div>
  );
}

function ContactSupport({ email = null }) {
  if (!email) return null;

  const subject = `Inquiry from ${window.location.origin}`;
  return (
    <a
      href={`mailto:${email}?Subject=${encodeURIComponent(subject)}`}
      className="flex items-center gap-x-1 hover:bg-gray-100 text-sm text-gray-700 p-2 rounded-lg"
    >
      <Envelope size={14} />
      <p>Email support</p>
    </a>
  );
}
