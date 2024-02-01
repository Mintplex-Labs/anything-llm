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
  "chat-circle-dots": ChatCircleDots,
  headset: Headset,
  binoculars: Binoculars,
  magnifying: MagnifyingGlass,
  magic: MagicWand,
};

export default function OpenButton({ settings, isOpen, toggleOpen }) {
  if (isOpen) return null;
  const ChatIcon = CHAT_ICONS.hasOwnProperty(settings?.chatIcon)
    ? CHAT_ICONS[settings.chatIcon]
    : CHAT_ICONS.plus;
  return (
    <button
      onClick={toggleOpen}
      className="flex items-center justify-center p-4 rounded-full bg-blue-500 text-white text-2xl"
      aria-label="Toggle Menu"
    >
      <ChatIcon className="text-white" />
    </button>
  );
}
