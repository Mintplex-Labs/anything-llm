import AnythingLLMLogo from "@/assets/anything-llm-dark.png";
import { X } from "@phosphor-icons/react";

export default function ChatWindowHeader({ iconUrl = null, closeChat }) {
  return (
    <div className="flex justify-between items-center">
      <img
        style={{ maxWidth: 100, maxHeight: 20 }}
        src={iconUrl ?? AnythingLLMLogo}
        alt={iconUrl ? "Brand" : "AnythingLLM Logo"}
      />
      <button onClick={closeChat} className="text-xl font-bold">
        <X size={18} />
      </button>
    </div>
  );
}
