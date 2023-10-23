import React, { memo, useEffect, useState } from "react";

import OpenAiLogo from "../../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../../media/llmprovider/azure.png";
import AnthropicLogo from "../../../../../media/llmprovider/anthropic.png";
import System from "../../../../../models/system";
import PreLoader from "../../../../../components/Preloader";
import LLMProviderOption from "../../../../../components/LLMProviderOption";

function LLMSelection({ nextStep, prevStep, currentStep }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateLLMChoice = (selection) => {
    setLLMChoice(selection);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLLMChoice(_settings?.LLMProvider);
      setLoading(false);
    }

    if (currentStep === 1) {
      fetchKeys();
    }
  }, [currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      alert(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    nextStep();
    return;
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div className="flex flex-col w-full px-1 md:px-8 py-12">
          <div className="text-white text-sm font-medium pb-4">
            LLM Providers
          </div>
          <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[900px]">
            <input hidden={true} name="LLMProvider" defaultValue={llmChoice} />
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
                    type="password"
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
        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>
          <button
            type="submit"
            className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(LLMSelection);
