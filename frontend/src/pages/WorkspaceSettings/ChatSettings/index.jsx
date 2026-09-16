import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useState } from "react";
import AutosaveForm from "@/components/AutosaveForm";
import ChatHistorySettings from "./ChatHistorySettings";
import ChatPromptSettings from "./ChatPromptSettings";
import ChatTemperatureSettings from "./ChatTemperatureSettings";
import ChatModeSelection from "./ChatModeSelection";
import WorkspaceLLMSelection from "./WorkspaceLLMSelection";
import ChatQueryRefusalResponse from "./ChatQueryRefusalResponse";

export default function ChatSettings({ workspace }) {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    fetchSettings();
  }, []);

  const handleUpdate = async (formEl) => {
    const data = {};
    const form = new FormData(formEl);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);

    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!updatedWorkspace) {
      showToast(`Error: ${message}`, "error", { clear: true });
      // Keep hasChanges true on error so user can retry
      return false;
    }
    return true;
  };

  if (!workspace) return null;
  return (
    <div id="workspace-chat-settings-container" className="relative">
      <AutosaveForm
        onSave={handleUpdate}
        id="chat-settings-form"
        className="w-1/2 flex flex-col gap-y-[32px]"
      >
        <WorkspaceLLMSelection settings={settings} workspace={workspace} />
        <ChatModeSelection workspace={workspace} />
        <ChatHistorySettings workspace={workspace} />
        <ChatPromptSettings workspace={workspace} />
        <ChatQueryRefusalResponse workspace={workspace} />
        <ChatTemperatureSettings settings={settings} workspace={workspace} />
      </AutosaveForm>
    </div>
  );
}
