import { ChatCenteredDots, FileArrowDown, Plus } from "@phosphor-icons/react";

export default function GetStarted() {
  return (
    <div>
      <h1 className="text-white uppercase text-sm font-semibold mb-6">
        Get Started
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="h-[45px] bg-[#36BFFA] rounded-lg text-black flex items-center justify-center gap-x-2.5">
          <ChatCenteredDots size={16} />
          Send Chat
        </button>
        <button className="h-[45px] bg-[#27282A] rounded-lg text-white flex items-center justify-center gap-x-2.5">
          <FileArrowDown size={16} />
          Embed a Document
        </button>
        <button className="h-[45px] bg-[#27282A] rounded-lg text-white flex items-center justify-center gap-x-2.5">
          <Plus size={16} />
          Create Workspace
        </button>
      </div>
    </div>
  );
}
