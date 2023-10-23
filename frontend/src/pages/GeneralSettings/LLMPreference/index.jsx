import React, { useEffect, useState } from "react";
import Sidebar, {
  SidebarMobileHeader,
} from "../../../components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "../../../models/system";
import showToast from "../../../utils/toast";
import OpenAiLogo from "../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../media/llmprovider/azure.png";
import AnthropicLogo from "../../../media/llmprovider/anthropic.png";
import PreLoader from "../../../components/Preloader";
import LLMProviderOption from "../../../components/LLMProviderOption";

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [llmChoice, setLLMChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const updateLLMChoice = (selection) => {
    setLLMChoice(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLLMChoice(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll animate-pulse"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
        >
          {isMobile && <SidebarMobileHeader />}
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    LLM Preference
                  </p>
                  {hasChanges && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  )}
                </div>
                <p className="text-sm font-base text-white text-opacity-60">
                  These are the credentials and settings for your preferred LLM
                  chat & embedding provider. Its important these keys are
                  current and correct or else AnythingLLM will not function
                  properly.
                </p>
              </div>
              <div className="text-white text-sm font-medium py-4">
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
                      This provider is unavailable and cannot be used in
                      AnythingLLM currently.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
