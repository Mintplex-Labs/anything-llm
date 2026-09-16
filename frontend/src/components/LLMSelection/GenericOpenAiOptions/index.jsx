import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import GenericOpenAiConnections from "@/models/genericOpenAiConnections";
import showToast from "@/utils/toast";
import { LLM_PREFERENCE_CHANGED_EVENT } from "@/pages/GeneralSettings/LLMPreference";

const MANUAL_CONNECTION_VALUE = "__manual__";

export default function GenericOpenAiOptions({ settings }) {
  const { t } = useTranslation();
  const [localSettings, setLocalSettings] = useState(settings);
  const [connections, setConnections] = useState(
    settings?.GenericOpenAiSavedConnections || []
  );
  const [selectedConnectionId, setSelectedConnectionId] = useState(
    settings?.GenericOpenAiActiveConnectionId || MANUAL_CONNECTION_VALUE
  );
  const [formKey, setFormKey] = useState(0);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [applyingConnection, setApplyingConnection] = useState(false);
  const formRef = useRef(null);

  const refreshConnections = async () => {
    setLoadingConnections(true);
    const result = await GenericOpenAiConnections.list();
    if (result.success) {
      setConnections(result.connections || []);
      setSelectedConnectionId(
        result.activeConnectionId || MANUAL_CONNECTION_VALUE
      );
    }
    setLoadingConnections(false);
    return result;
  };

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    refreshConnections();
  }, []);

  const reloadSettings = async () => {
    const updatedSettings = await System.keys();
    if (!updatedSettings) return null;
    setLocalSettings(updatedSettings);
    setConnections(updatedSettings.GenericOpenAiSavedConnections || []);
    setSelectedConnectionId(
      updatedSettings.GenericOpenAiActiveConnectionId || MANUAL_CONNECTION_VALUE
    );
    setFormKey((key) => key + 1);
    window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
    return updatedSettings;
  };

  const readFormValues = () => {
    const container = formRef.current;
    if (!container) return null;
    const getValue = (name) =>
      container.querySelector(`[name="${name}"]`)?.value ?? "";
    return {
      basePath: String(getValue("GenericOpenAiBasePath")).trim(),
      apiKey: String(getValue("GenericOpenAiKey")).trim(),
      modelPref: String(getValue("GenericOpenAiModelPref")).trim(),
      tokenLimit: Number(getValue("GenericOpenAiTokenLimit")),
      maxTokens: Number(getValue("GenericOpenAiMaxTokens")),
    };
  };

  const handleConnectionSelect = async (event) => {
    const value = event.target.value;
    setSelectedConnectionId(value);

    if (value === MANUAL_CONNECTION_VALUE) return;

    setApplyingConnection(true);
    const result = await GenericOpenAiConnections.activate(value);
    setApplyingConnection(false);

    if (!result.success) {
      showToast(
        t("llm.providers.generic_openai.saved_connection_apply_failed", {
          error: result.error || "Unknown error",
        }),
        "error"
      );
      return;
    }

    await reloadSettings();
    showToast(
      t("llm.providers.generic_openai.saved_connection_applied"),
      "success"
    );
  };

  const handleSaveConnection = async () => {
    const values = readFormValues();
    if (!values) return;

    const defaultName =
      connections.find((c) => c.id === selectedConnectionId)?.name ||
      values.modelPref ||
      values.basePath;

    const name = window.prompt(
      t("llm.providers.generic_openai.saved_connection_name_prompt"),
      defaultName
    );
    if (!name?.trim()) return;

    const payload = {
      ...values,
      name: name.trim(),
      id:
        selectedConnectionId !== MANUAL_CONNECTION_VALUE
          ? selectedConnectionId
          : undefined,
    };

    if (
      payload.apiKey &&
      payload.apiKey.length > 0 &&
      payload.apiKey === "*".repeat(20)
    ) {
      delete payload.apiKey;
    }

    const result = await GenericOpenAiConnections.save(payload);
    if (!result.success) {
      showToast(
        t("llm.providers.generic_openai.saved_connection_save_failed", {
          error: result.error || "Unknown error",
        }),
        "error"
      );
      return;
    }

    setConnections(result.connections || []);
    setSelectedConnectionId(
      result.activeConnectionId || MANUAL_CONNECTION_VALUE
    );
    await reloadSettings();
    showToast(
      t("llm.providers.generic_openai.saved_connection_saved"),
      "success"
    );
  };

  const handleDeleteConnection = async () => {
    if (selectedConnectionId === MANUAL_CONNECTION_VALUE) return;
    if (
      !window.confirm(
        t("llm.providers.generic_openai.saved_connection_delete_confirm")
      )
    ) {
      return;
    }

    const result = await GenericOpenAiConnections.delete(selectedConnectionId);
    if (!result.success) {
      showToast(
        t("llm.providers.generic_openai.saved_connection_delete_failed", {
          error: result.error || "Unknown error",
        }),
        "error"
      );
      return;
    }

    setConnections(result.connections || []);
    setSelectedConnectionId(MANUAL_CONNECTION_VALUE);
    showToast(
      t("llm.providers.generic_openai.saved_connection_deleted"),
      "success"
    );
  };

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex flex-col gap-y-3">
        <p className="text-white text-sm font-semibold">
          {t("llm.providers.generic_openai.saved_connections_label")}
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col w-60 min-w-[240px]">
            <label className="text-white text-sm font-semibold block mb-3">
              {t("llm.providers.generic_openai.saved_connection_select")}
            </label>
            <select
              value={selectedConnectionId}
              onChange={handleConnectionSelect}
              disabled={loadingConnections || applyingConnection}
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              <option value={MANUAL_CONNECTION_VALUE}>
                {t("llm.providers.generic_openai.saved_connection_manual")}
              </option>
              {connections.map((connection) => (
                <option key={connection.id} value={connection.id}>
                  {connection.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSaveConnection}
            className="text-sm font-semibold text-white bg-theme-settings-input-bg hover:bg-theme-bg-primary rounded-lg px-4 py-2.5 h-[42px]"
          >
            {t("llm.providers.generic_openai.saved_connection_save")}
          </button>
          <button
            type="button"
            onClick={handleDeleteConnection}
            disabled={selectedConnectionId === MANUAL_CONNECTION_VALUE}
            className="text-sm font-semibold text-white bg-theme-settings-input-bg hover:bg-theme-bg-primary disabled:opacity-40 rounded-lg px-4 py-2.5 h-[42px]"
          >
            {t("llm.providers.generic_openai.saved_connection_delete")}
          </button>
        </div>
        <p className="text-xs text-white text-opacity-60 max-w-2xl">
          {t("llm.providers.generic_openai.saved_connections_help")}
        </p>
      </div>

      <GenericOpenAiForm
        key={formKey}
        settings={localSettings}
        formRef={formRef}
      />
    </div>
  );
}

function GenericOpenAiForm({ settings, formRef }) {
  const [genericOpenAiBasePath, setGenericOpenAiBasePath] = useState(
    settings?.GenericOpenAiBasePath
  );
  const [genericOpenAiApiKey, setGenericOpenAiApiKey] = useState(
    settings?.GenericOpenAiApiKey
  );
  const [genericOpenAiModelPref, setGenericOpenAiModelPref] = useState(
    settings?.GenericOpenAiModelPref
  );

  return (
    <div ref={formRef} className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Base URL
          </label>
          <input
            type="url"
            name="GenericOpenAiBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: https://proxy.openai.com"
            defaultValue={settings?.GenericOpenAiBasePath}
            onChange={(e) => setGenericOpenAiBasePath(e.target.value)}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="GenericOpenAiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Generic service API Key"
            defaultValue={settings?.GenericOpenAiKey ? "*".repeat(20) : ""}
            onChange={(e) => setGenericOpenAiApiKey(e.target.value)}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <GenericOpenAiModelSelection
          settings={settings}
          basePath={genericOpenAiBasePath}
          apiKey={genericOpenAiApiKey}
          genericOpenAiModelPref={genericOpenAiModelPref}
          setGenericOpenAiModelPref={setGenericOpenAiModelPref}
        />
      </div>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model context window
          </label>
          <input
            type="number"
            name="GenericOpenAiTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Content window limit (eg: 4096)"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.GenericOpenAiTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Max Tokens
          </label>
          <input
            type="number"
            name="GenericOpenAiMaxTokens"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Max tokens per request (eg: 1024)"
            min={1}
            defaultValue={settings?.GenericOpenAiMaxTokens || 1024}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function GenericOpenAiModelSelection({
  settings,
  basePath = null,
  apiKey = null,
  genericOpenAiModelPref,
  setGenericOpenAiModelPref,
}) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { models } = await System.customModels(
          "generic-openai",
          apiKey,
          basePath
        );
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <div className="flex items-center mb-2 gap-x-1">
          <label className="text-white text-sm font-semibold">
            Selected Model
          </label>
        </div>
        <select
          name="GenericOpenAiModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            --loading available models--
          </option>
        </select>
      </div>
    );
  }

  if (customModels.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Selected Model
        </label>
        <input
          type="text"
          name="GenericOpenAiModelPref"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Model id used for chat requests"
          defaultValue={genericOpenAiModelPref}
          onChange={(e) => setGenericOpenAiModelPref(e.target.value)}
          onBlur={() => setGenericOpenAiModelPref(genericOpenAiModelPref)}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        Selected Model
      </label>
      <select
        name="GenericOpenAiModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        defaultValue={settings?.GenericOpenAiModelPref}
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option key={model.id} value={model.id}>
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
