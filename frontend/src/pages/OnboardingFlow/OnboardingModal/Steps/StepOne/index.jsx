import React, { useEffect, useState } from "react";

import OpenAiLogo from "../../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../../media/llmprovider/azure.png";
import AnthropicLogo from "../../../../../media/llmprovider/anthropic.png";
import System from "../../../../../models/system";
import showToast from "../../../../../utils/toast";
import PreLoader from "../../../../../components/Preloader";
import LLMProviderOption from "../../../../../components/LLMProviderOption";

// LLM Preference Step
export default function StepOne() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [llmChoice, setLLMChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateLLMChoice = (selection) => {
    setLLMChoice(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      console.log("fetching keys");
      const _settings = await System.keys();
      setSettings(_settings);
      setLLMChoice(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

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
      showToast("LLM preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error ? true : false);
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onChange={() => setHasChanges(true)}
        className="flex w-full"
      >
        <div className="flex flex-col w-full px-1 md:px-8 py-12">
          <div className="text-white text-sm font-medium pb-4">
            LLM Providers
          </div>
          <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[900px]">
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
              name="Azure OpenAI"
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
          <div className="mt-10 flex flex-wrap gap-4 max-w-[800px]">
            {llmChoice === "openai" && (
              <>
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Key
                  </label>
                  <input
                    type="text"
                    name="OpenAiKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="OpenAI API Key"
                    defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Chat Model Selection
                  </label>
                  <select
                    name="OpenAiModelPref"
                    defaultValue={settings?.OpenAiModelPref}
                    required={true}
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
                  >
                    {[
                      "gpt-3.5-turbo",
                      "gpt-3.5-turbo-0613",
                      "gpt-3.5-turbo-16k",
                      "gpt-4",
                      "gpt-4-0613",
                      "gpt-4-32k",
                      "gpt-4-32k-0613",
                    ].map((model) => {
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
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Azure Service Endpoint
                  </label>
                  <input
                    type="url"
                    name="AzureOpenAiEndpoint"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="https://my-azure.openai.azure.com"
                    defaultValue={settings?.AzureOpenAiEndpoint}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Key
                  </label>
                  <input
                    type="password"
                    name="AzureOpenAiKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="Azure OpenAI API Key"
                    defaultValue={
                      settings?.AzureOpenAiKey ? "*".repeat(20) : ""
                    }
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Chat Model Deployment Name
                  </label>
                  <input
                    type="text"
                    name="AzureOpenAiModelPref"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="Azure OpenAI chat model deployment name"
                    defaultValue={settings?.AzureOpenAiModelPref}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Embedding Model Deployment Name
                  </label>
                  <input
                    type="text"
                    name="AzureOpenAiEmbeddingModelPref"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
                  This provider is unavailable and cannot be used in AnythingLLM
                  currently.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
