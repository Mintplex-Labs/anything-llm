import {
  Plus,
  ChatCircleDots,
  Headset,
  Binoculars,
  MagnifyingGlass,
  MagicWand,
} from "@phosphor-icons/react";

const CHAT_ICONS = {
  plus: Plus,
  chatBubble: ChatCircleDots,
  support: Headset,
  search2: Binoculars,
  search: MagnifyingGlass,
  magic: MagicWand,
};

export default function OpenButton({ settings, isOpen, toggleOpen }) {
  if (isOpen) return null;
  const ChatIcon = CHAT_ICONS.hasOwnProperty(settings?.chatIcon)
    ? CHAT_ICONS[settings.chatIcon]
    : CHAT_ICONS.plus;
  return (
    <button
      style={{ backgroundColor: settings.buttonColor }}
      id="anything-llm-embed-chat-button"
      onClick={toggleOpen}
      className={`hover:allm-cursor-pointer allm-border-none allm-flex allm-items-center allm-justify-center allm-p-4 allm-rounded-full allm-text-white allm-text-2xl hover:allm-opacity-95`}
      aria-label="Toggle Menu"
    >
      <ChatIcon className="text-white" />
    </button>
  );
}
