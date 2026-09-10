import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import useAutosaveForm from "@/hooks/useAutosaveForm";
import ChatHistorySettings from "./ChatHistorySettings";
import ChatPromptSettings from "./ChatPromptSettings";
import ChatTemperatureSettings from "./ChatTemperatureSettings";
import ChatModeSelection from "./ChatModeSelection";
import WorkspaceLLMSelection from "./WorkspaceLLMSelection";
import ChatQueryRefusalResponse from "./ChatQueryRefusalResponse";

export default function ChatSettings({ workspace }) {
  const [settings, setSettings] = useState({});
  const formEl = useRef(null);
  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    e?.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);

    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
      setHasChanges(false);
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
      // Keep hasChanges true on error so user can retry
    }
  };
  const { hasChanges, setHasChanges } = useAutosaveForm(formEl, handleUpdate);

  if (!workspace) return null;
  return (
    <div id="workspace-chat-settings-container" className="relative">
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        id="chat-settings-form"
        className="w-1/2 flex flex-col gap-y-[32px]"
      >
        <WorkspaceLLMSelection
          settings={settings}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ChatModeSelection
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ChatHistorySettings
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ChatPromptSettings
          workspace={workspace}
          setHasChanges={setHasChanges}
          hasChanges={hasChanges}
        />
        <ChatQueryRefusalResponse
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ChatTemperatureSettings
          settings={settings}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
      </form>
    </div>
  );
}
