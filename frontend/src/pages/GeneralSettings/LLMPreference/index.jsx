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
import LMStudioLogo from "../../../media/llmprovider/lmstudio.png";
import LocalAiLogo from "../../../media/llmprovider/localai.png";
import PreLoader from "../../../components/Preloader";
import LLMProviderOption from "../../../components/LLMSelection/LLMProviderOption";
import OpenAiOptions from "../../../components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "../../../components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "../../../components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "../../../components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "../../../components/LLMSelection/LocalAiOptions";

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
    setHasChanges(!!error);
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
                  value="anthropic"
                  link="anthropic.com"
                  description="A friendly AI Assistant hosted by Anthropic. Provides chat services only!"
                  checked={llmChoice === "anthropic"}
                  image={AnthropicLogo}
                  onClick={updateLLMChoice}
                />
                <LLMProviderOption
                  name="LM Studio"
                  value="lmstudio"
                  link="lmstudio.ai"
                  description="Discover, download, and run thousands of cutting edge LLMs in a few clicks."
                  checked={llmChoice === "lmstudio"}
                  image={LMStudioLogo}
                  onClick={updateLLMChoice}
                />
                <LLMProviderOption
                  name="Local AI"
                  value="localai"
                  link="localai.io"
                  description="Run LLMs locally on your own machine."
                  checked={llmChoice === "localai"}
                  image={LocalAiLogo}
                  onClick={updateLLMChoice}
                />
              </div>
              <div className="mt-10 flex flex-wrap gap-4 max-w-[800px]">
                {llmChoice === "openai" && (
                  <OpenAiOptions settings={settings} />
                )}
                {llmChoice === "azure" && (
                  <AzureAiOptions settings={settings} />
                )}
                {llmChoice === "anthropic" && (
                  <AnthropicAiOptions settings={settings} showAlert={true} />
                )}
                {llmChoice === "lmstudio" && (
                  <LMStudioOptions settings={settings} showAlert={true} />
                )}
                {llmChoice === "localai" && (
                  <LocalAiOptions settings={settings} showAlert={true} />
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
