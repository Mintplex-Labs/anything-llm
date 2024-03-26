import Button from "@/components/Generic/Buttons/Button";
import { chatPrompt } from "@/utils/chat";
import { useEffect, useState } from "react";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const [settings, setSettings] = useState(
    JSON.parse(workspace.metaResponseSettings)
  );
  const [textareaSettings, setTextareaSettings] = useState({
    isDisabled: false,
    message: "",
    disableClasses: "",
  });

  useEffect(() => {
    console.log("ChatPromptSettings: ", settings);
    if (
      workspace.metaResponse &&
      Object.keys(settings).length > 0 &&
      Object.values(settings).some((feature) => feature.isEnabled)
    ) {
      console.log("Prompt is managed by Meta Response");
      setTextareaSettings({
        ...textareaSettings,
        isDisabled: true,
        message: "(Prompt is managed now by Meta Response)",
        disableClasses: "cursor-not-allowed bg-zinc-900 text-white/40",
      });
    }
  }, [settings]);

  return (
    <div className="relative">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          Prompt{" "}
          {textareaSettings.isDisabled && (
            <span className="text-xs text-red-500/80 text-right mt-1.5 ml-2">
              {textareaSettings.message}
            </span>
          )}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          The prompt that will be used on this workspace. Define the context and
          instructions for the AI to generate a response. You should to provide
          a carefully crafted prompt so the AI can generate a relevant and
          accurate response.
        </p>
      </div>
      <textarea
        name="openAiPrompt"
        rows={5}
        defaultValue={chatPrompt(workspace)}
        className={`${
          textareaSettings.isDisabled
            ? textareaSettings.disableClasses
            : " bg-zinc-900"
        }  text-white placeholder:text-white/20  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2`}
        placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
        required={true}
        wrap="soft"
        autoComplete="off"
        onChange={() => setHasChanges(true)}
        disabled={textareaSettings.isDisabled}
      />
    </div>
  );
}
