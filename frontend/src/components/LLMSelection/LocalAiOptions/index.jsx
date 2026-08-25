import React, { useEffect, useState } from "react";
import { Info, CaretDown, CaretUp } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { LOCALAI_COMMON_URLS } from "@/utils/constants";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import LocalAiConnection from "@/models/localAiConnection";
import showToast from "@/utils/toast";

export default function LocalAiOptions({ settings, showAlert = false }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "localai",
    initialBasePath: settings?.LocalAiBasePath,
    ENDPOINTS: LOCALAI_COMMON_URLS,
  });
  const [apiKeyValue, setApiKeyValue] = useState(settings?.LocalAiApiKey);
  const [apiKey, setApiKey] = useState(settings?.LocalAiApiKey);

  return (
    <div className="w-full flex flex-col gap-y-7">
      {!settings?.credentialsOnly && <LocalAiConnectionManager />}
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              LocalAI as your LLM requires you to set an embedding service to
              use.
            </p>
          </div>
          <a
            href={paths.settings.embedder.modelPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        {!settings?.credentialsOnly && (
          <>
            <LocalAIModelSelection
              settings={settings}
              basePath={basePath.value}
              apiKey={apiKey}
            />
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-2">
                Model context window
              </label>
              <input
                type="number"
                name="LocalAiTokenLimit"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="4096"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.LocalAiTokenLimit}
                required={true}
                autoComplete="off"
              />
            </div>
          </>
        )}
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-2">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              Local AI API Key{" "}
              <p className="!text-xs !italic !font-thin">optional</p>
            </label>
          </div>
          <input
            type="password"
            name="LocalAiApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-mysecretkey"
            defaultValue={settings?.LocalAiApiKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setApiKeyValue(e.target.value)}
            onBlur={() => setApiKey(apiKeyValue)}
          />
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-center gap-4">
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white text-sm font-semibold">
                Local AI Base URL
              </label>
              {loading ? (
                <PreLoader size="6" />
              ) : (
                <>
                  {!basePathValue.value && (
                    <button
                      onClick={handleAutoDetectClick}
                      className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                    >
                      Auto-Detect
                    </button>
                  )}
                </>
              )}
            </div>
            <input
              type="url"
              name="LocalAiBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://localhost:8080/v1"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_CONNECTION = {
  name: "",
  base_url: "http://localhost:8080/v1",
  api_key: "",
  model: "",
  token_limit: 4096,
};

function LocalAiConnectionManager() {
  const [connections, setConnections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(EMPTY_CONNECTION);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setConnections(await LocalAiConnection.all());
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function selectConnection(id) {
    setSelectedId(id);
    const connection = connections.find((item) => String(item.id) === id);
    setDraft(
      connection ? { ...connection, api_key: "" } : { ...EMPTY_CONNECTION }
    );
  }

  async function saveConnection() {
    setSaving(true);
    const data = {
      name: draft.name,
      base_url: draft.base_url,
      model: draft.model,
      token_limit: Number(draft.token_limit),
      ...(draft.api_key ? { api_key: draft.api_key } : {}),
    };
    const result = selectedId
      ? await LocalAiConnection.update(selectedId, data)
      : await LocalAiConnection.create({ ...data, api_key: draft.api_key });
    setSaving(false);
    if (result.error) return showToast(result.error, "error");

    await refresh();
    setSelectedId(String(result.connection.id));
    setDraft({ ...result.connection, api_key: "" });
    showToast("LocalAI connection saved.", "success");
  }

  async function deleteConnection() {
    if (!selectedId || !window.confirm("Delete this LocalAI connection?"))
      return;
    const result = await LocalAiConnection.delete(selectedId);
    if (!result.success) return showToast(result.error, "error");
    await refresh();
    setSelectedId("");
    setDraft({ ...EMPTY_CONNECTION });
    showToast("LocalAI connection deleted.", "success");
  }

  return (
    <div className="w-full max-w-[760px] rounded-lg border border-white/10 p-4 flex flex-col gap-4">
      <div>
        <p className="text-white text-sm font-semibold">Saved connections</p>
        <p className="text-white/60 text-xs mt-1">
          Workspaces and model routers can use these LocalAI endpoints
          concurrently.
        </p>
      </div>
      <select
        value={selectedId}
        onChange={(event) => selectConnection(event.target.value)}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5"
      >
        <option value="">Create a new connection</option>
        {connections.map((connection) => (
          <option key={connection.id} value={connection.id}>
            {connection.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ConnectionInput
          label="Connection name"
          value={draft.name}
          onChange={(value) => updateDraft("name", value)}
        />
        <ConnectionInput
          label="Base URL"
          type="url"
          value={draft.base_url}
          onChange={(value) => updateDraft("base_url", value)}
        />
        <ConnectionInput
          label="Default model"
          value={draft.model}
          onChange={(value) => updateDraft("model", value)}
        />
        <ConnectionInput
          label="Context window"
          type="number"
          value={draft.token_limit}
          onChange={(value) => updateDraft("token_limit", value)}
        />
        <ConnectionInput
          label={draft.hasApiKey ? "API key (leave blank to keep)" : "API key"}
          type="password"
          value={draft.api_key}
          onChange={(value) => updateDraft("api_key", value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={saveConnection}
          className="bg-primary-button px-3 py-2 rounded-lg text-sm font-medium"
        >
          {saving ? "Saving..." : "Save connection"}
        </button>
        {selectedId && (
          <button
            type="button"
            onClick={deleteConnection}
            className="bg-red-600 px-3 py-2 rounded-lg text-white text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function ConnectionInput({ label, type = "text", value, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-white text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        min={type === "number" ? 1 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5"
        autoComplete="off"
      />
    </label>
  );
}

function LocalAIModelSelection({ settings, basePath = null, apiKey = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath || !basePath.includes("/v1")) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels(
        "localai",
        typeof apiKey === "boolean" ? null : apiKey,
        basePath
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Chat Model Selection
        </label>
        <select
          name="LocalAiModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? "-- loading available models --"
              : "-- waiting for URL --"}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        Chat Model Selection
      </label>
      <select
        name="LocalAiModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.LocalAiModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}
