import { useState } from "react";
export default function ChatModeSelection({ workspace, setHasChanges }) {
  const [chatMode, setChatMode] = useState(workspace?.chatMode || "chat");

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="chatMode" className="block input-label">
          Chat mode
        </label>
      </div>

      <div className="flex flex-col gap-y-1 mt-2">
        <div className="w-fit flex gap-x-1 items-center p-1 rounded-lg bg-zinc-800 ">
          <input type="hidden" name="chatMode" value={chatMode} />
          <button
            type="button"
            disabled={chatMode === "chat"}
            onClick={() => {
              setChatMode("chat");
              setHasChanges(true);
            }}
            className="transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md"
          >
            Chat
          </button>
          <button
            type="button"
            disabled={chatMode === "query"}
            onClick={() => {
              setChatMode("query");
              setHasChanges(true);
            }}
            className="transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md"
          >
            Query
          </button>
        </div>
        <p className="text-sm text-white/60">
          {chatMode === "chat" ? (
            <>
              <b>Chat</b> will provide answers with the LLM's general knowledge{" "}
              <i className="font-semibold">and</i> document context that is
              found.
            </>
          ) : (
            <>
              <b>Query</b> will provide answers{" "}
              <i className="font-semibold">only</i> if document context is
              found.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
