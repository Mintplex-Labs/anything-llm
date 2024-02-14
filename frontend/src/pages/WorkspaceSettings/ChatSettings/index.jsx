import useGetProviderModels, {
  DISABLED_PROVIDERS,
} from "@/hooks/useGetProvidersModels";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import { chatPrompt } from "@/utils/chat";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";

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

function recommendedSettings(provider = null) {
  switch (provider) {
    case "mistral":
      return { temp: 0 };
    default:
      return { temp: 0.7 };
  }
}

function ChatModelSelection({ settings, workspace, setHasChanges }) {
  const { defaultModels, customModels, loading } = useGetProviderModels(
    settings?.LLMProvider
  );
  if (DISABLED_PROVIDERS.includes(settings?.LLMProvider)) return null;

  if (loading) {
    return (
      <div>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Chat model
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            The specific chat model that will be used for this workspace. If
            empty, will use the system LLM preference.
          </p>
        </div>
        <select
          name="chatModel"
          required={true}
          disabled={true}
          className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Chat model{" "}
          <span className="font-normal">({settings?.LLMProvider})</span>
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          The specific chat model that will be used for this workspace. If
          empty, will use the system LLM preference.
        </p>
      </div>

      <select
        name="chatModel"
        required={true}
        onChange={() => {
          setHasChanges(true);
        }}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option disabled={true} selected={workspace?.chatModel === null}>
          System default
        </option>
        {defaultModels.length > 0 && (
          <optgroup label="General models">
            {defaultModels.map((model) => {
              return (
                <option
                  key={model}
                  value={model}
                  selected={workspace?.chatModel === model}
                >
                  {model}
                </option>
              );
            })}
          </optgroup>
        )}
        {Array.isArray(customModels) && customModels.length > 0 && (
          <optgroup label="Custom models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={workspace?.chatModel === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
        {/* For providers like TogetherAi where we partition model by creator entity. */}
        {!Array.isArray(customModels) &&
          Object.keys(customModels).length > 0 && (
            <>
              {Object.entries(customModels).map(([organization, models]) => (
                <optgroup key={organization} label={organization}>
                  {models.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={workspace?.chatModel === model.id}
                    >
                      {model.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </>
          )}
      </select>
    </div>
  );
}

function ChatHistorySettings({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-white"
        >
          Chat History
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          The number of previous chats that will be included in the
          response&apos;s short-term memory.
          <i>Recommend 20. </i>
          Anything more than 45 is likely to lead to continuous chat failures
          depending on message size.
        </p>
      </div>
      <input
        name="openAiHistory"
        type="number"
        min={1}
        max={45}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiHistory ?? 20}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="20"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

function ChatPromptSettings({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Prompt
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
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
        required={true}
        wrap="soft"
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

function ChatTemperatureSettings({ settings, workspace, setHasChanges }) {
  const defaults = recommendedSettings(settings?.LLMProvider);
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          LLM Temperature
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This setting controls how &quot;random&quot; or dynamic your chat
          responses will be.
          <br />
          The higher the number (1.0 maximum) the more random and incoherent.
          <br />
          <i>Recommended: {defaults.temp}</i>
        </p>
      </div>
      <input
        name="openAiTemp"
        type="number"
        min={0.0}
        max={1.0}
        step={0.1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiTemp ?? defaults.temp}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="0.7"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
