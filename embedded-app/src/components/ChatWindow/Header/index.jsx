import AnythingLLMLogo from "@/assets/anything-llm-dark.png";
import { X } from "@phosphor-icons/react";

export default function ChatWindowHeader({ closeChat }) {
  return (
    <div className="flex justify-between items-center">
      <img
        style={{ width: 100 }}
        src={AnythingLLMLogo}
        alt="AnythingLLM Logo"
      />
      <button onClick={closeChat} className="text-xl font-bold">
        <X size={18} />
      </button>
    </div>
  );
}
