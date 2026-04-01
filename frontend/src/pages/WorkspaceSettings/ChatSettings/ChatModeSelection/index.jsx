import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function ChatModeSelection({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [chatMode, setChatMode] = useState(workspace?.chatMode || "chat");

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="chatMode" className="block input-label">
          {t("chat.mode.title")}
        </label>
      </div>

      <div className="flex flex-col gap-y-1 mt-2">
        <div className="w-fit flex gap-x-1 items-center p-1 rounded-lg bg-theme-settings-input-bg ">
          <input type="hidden" name="chatMode" value={chatMode} />
          <button
            type="button"
            disabled={chatMode === "automatic"}
            onClick={() => {
              setChatMode("automatic");
              setHasChanges(true);
            }}
            className="border-none transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md hover:bg-white/10"
          >
            {t("chat.mode.automatic.title")}
          </button>
          <button
            type="button"
            disabled={chatMode === "chat"}
            onClick={() => {
              setChatMode("chat");
              setHasChanges(true);
            }}
            className="border-none transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md hover:bg-white/10 light:hover:bg-black/10"
          >
            {t("chat.mode.chat.title")}
          </button>
          <button
            type="button"
            disabled={chatMode === "query"}
            onClick={() => {
              setChatMode("query");
              setHasChanges(true);
            }}
            className="border-none transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md hover:bg-white/10 light:hover:bg-black/10"
          >
            {t("chat.mode.query.title")}
          </button>
        </div>
        <ChatModeExplanation chatMode={chatMode} />
      </div>
    </div>
  );
}

/**
 * A component that displays the explanation for a given chat mode.
 * @param {'automatic' | 'chat' | 'query'} chatMode - The chat mode to display the explanation for.
 * @returns {JSX.Element} The component to display the explanation for the given chat mode.
 */
function ChatModeExplanation({ chatMode = "chat" }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-white/60">
      <b>{t(`chat.mode.${chatMode}.title`)}</b>{" "}
      <Trans
        i18nKey={`chat.mode.${chatMode}.description`}
        components={{ b: <b />, br: <br /> }}
      />
    </p>
  );
}
