import React, { useState } from "react";
import System from "../../../../models/system";
import OpenAiLogo from "../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../media/llmprovider/azure.png";
import AnthropicLogo from "../../../../media/llmprovider/anthropic.png";
import showToast from "../../../../utils/toast";

const noop = () => false;
export default function LLMSelection({
  hideModal = noop,
  user,
  settings = {},
}) {
  const [hasChanges, setHasChanges] = useState(false);
  const [llmChoice, setLLMChoice] = useState(settings?.LLMProvider || "openai");
  const [saving, setSaving] = useState(false);
  const canDebug = settings.MultiUserMode
    ? settings?.CanDebug && user?.role === "admin"
    : settings?.CanDebug;

  function updateLLMChoice(selection) {
    if (!canDebug || selection === llmChoice) return false;
    setHasChanges(true);
    setLLMChoice(selection);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
    } else {
      showToast("LLM settings saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error ? true : false);
  };
  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            These are the credentials and settings for your preferred LLM chat &
            embedding provider. Its important these keys are current and correct
            or else AnythingLLM will not function properly.
          </p>
        </div>

        <form onSubmit={handleSubmit} onChange={() => setHasChanges(true)}>
          <div className="px-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <p className="block text-sm font-medium text-gray-800 dark:text-slate-200">
                LLM providers
              </p>
              <div className="w-full flex overflow-x-scroll gap-x-4">
                <input hidden={true} name="LLMProvider" value={llmChoice} />
                <LLMProviderOption
                  name="OpenAI"
                  value="openai"
                  link="openai.com"
                  description="The standard option for most non-commercial use. Provides both chat and embedding."
                  checked={llmChoice === "openai"}
                  image={OpenAiLogo}
                  onClick={updateLLMChoice}
                />
                <LLMProviderOption
                  name="Azure OpenAi"
                  value="azure"
                  link="azure.microsoft.com"
                  description="The enterprise option of OpenAI hosted on Azure services. Provides both chat and embedding."
                  checked={llmChoice === "azure"}
                  image={AzureOpenAiLogo}
                  onClick={updateLLMChoice}
                />
                <LLMProviderOption
                  name="Anthropic Claude 2"
                  value="anthropic-claude-2"
                  link="anthropic.com"
                  description="[COMING SOON] A friendly AI Assistant hosted by Anthropic. Provides chat services only!"
                  checked={llmChoice === "anthropic-claude-2"}
                  image={AnthropicLogo}
                />
              </div>
              {llmChoice === "openai" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      API Key
                    </label>
                    <input
                      type="text"
                      name="OpenAiKey"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="OpenAI API Key"
                      defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Chat Model Selection
                    </label>
                    <select
                      disabled={!canDebug}
                      name="OpenAiModelPref"
                      defaultValue={settings?.OpenAiModelPref}
                      required={true}
                      className="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-stone-700 dark:border-slate-200 dark:placeholder-stone-500 dark:text-slate-200"
                    >
                      {["gpt-3.5-turbo", "gpt-4"].map((model) => {
                        return (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}

              {llmChoice === "azure" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Azure Service Endpoint
                    </label>
                    <input
                      type="url"
                      name="AzureOpenAiEndpoint"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="https://my-azure.openai.azure.com"
                      defaultValue={settings?.AzureOpenAiEndpoint}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      API Key
                    </label>
                    <input
                      type="password"
                      name="AzureOpenAiKey"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="Azure OpenAI API Key"
                      defaultValue={
                        settings?.AzureOpenAiKey ? "*".repeat(20) : ""
                      }
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Chat Model Deployment Name
                    </label>
                    <input
                      type="text"
                      name="AzureOpenAiModelPref"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="Azure OpenAI chat model deployment name"
                      defaultValue={settings?.AzureOpenAiModelPref}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Embedding Model Deployment Name
                    </label>
                    <input
                      type="text"
                      name="AzureOpenAiEmbeddingModelPref"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="Azure OpenAI embedding model deployment name"
                      defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}

              {llmChoice === "anthropic-claude-2" && (
                <div className="w-full h-40 items-center justify-center flex">
                  <p className="text-gray-800 dark:text-slate-400">
                    This provider is unavailable and cannot be used in
                    AnythingLLM currently.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full p-4">
            <button
              hidden={!hasChanges}
              disabled={saving}
              type="submit"
              className="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const LLMProviderOption = ({
  name,
  link,
  description,
  value,
  image,
  checked = false,
  onClick,
}) => {
  return (
    <div onClick={() => onClick(value)}>
      <input
        type="checkbox"
        value={value}
        className="peer hidden"
        checked={checked}
        readOnly={true}
        formNoValidate={true}
      />
      <label className="transition-all duration-300 inline-flex h-full w-60 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:dark:bg-stone-800 peer-checked:text-gray-600 dark:border-slate-200 dark:bg-stone-800 dark:text-slate-400 dark:hover:bg-stone-700 dark:hover:text-slate-300 dark:peer-checked:text-slate-300">
        <div className="block">
          <img src={image} alt={name} className="mb-2 h-10 w-10 rounded-full" />
          <div className="w-full text-lg font-semibold">{name}</div>
          <div className="flex w-full flex-col gap-y-1 text-sm">
            <p className="text-xs text-slate-400">{link}</p>
            {description}
          </div>
        </div>
      </label>
    </div>
  );
};
