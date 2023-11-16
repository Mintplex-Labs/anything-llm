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
import { Warning } from "@phosphor-icons/react";

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [llmChoice, setLLMChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (llmChoice !== settings?.LLMProvider && hasChanges) {
      document.getElementById("confirmation-modal")?.showModal();
    } else {
      handleSaveSettings();
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const data = new FormData(document.getElementById("llm-form"));
    const settingsData = {};
    for (let [key, value] of data.entries()) {
      settingsData[key] = value;
    }

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("LLM preferences saved successfully.", "success");
      setHasChanges(false);
    }
    setSaving(false);
    document.getElementById("confirmation-modal")?.close();
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
      <ConfirmationModal
        onClose={() => document.getElementById("confirmation-modal")?.close()}
        onConfirm={handleSaveSettings}
      />
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
            id="llm-form"
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

const ConfirmationModal = ({ onClose, onConfirm }) => (
  <dialog id="confirmation-modal" className="bg-transparent outline-none">
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <div className="flex items-center gap-2">
            <Warning
              className="text-yellow-300 text-lg w-6 h-6"
              weight="fill"
            />
            <h3 className="text-xl font-semibold text-yellow-300">Warning</h3>
          </div>
        </div>
        <div className="w-[550px] p-6 text-white">
          <p>
            Switching the LLM provider may affect querying documents and
            similarity search results.
            <br />
            <br />
            Are you sure you want to proceed?
          </p>
        </div>

        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </dialog>
);
