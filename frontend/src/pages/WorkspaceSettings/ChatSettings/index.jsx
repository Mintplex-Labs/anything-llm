import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import ChatModelSelection from "./ChatModelSelection";
import ChatHistorySettings from "./ChatHistorySettings";
import ChatPromptSettings from "./ChatPromptSettings";
import ChatTemperatureSettings from "./ChatTemperatureSettings";
import ChatModeSelection from "./ChatModeSelection";

export default function ChatSettings({ workspace }) {
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const formEl = useRef(null);
  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <form
      ref={formEl}
      onSubmit={handleUpdate}
      className="w-1/2 flex flex-col gap-y-6"
    >
      <ChatModeSelection workspace={workspace} setHasChanges={setHasChanges} />
      <ChatModelSelection
        settings={settings}
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      <ChatHistorySettings
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      <ChatPromptSettings workspace={workspace} setHasChanges={setHasChanges} />
      <ChatTemperatureSettings
        settings={settings}
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      {hasChanges && (
        <button
          type="submit"
          className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {saving ? "Updating..." : "Update workspace"}
        </button>
      )}
    </form>
  );
}
