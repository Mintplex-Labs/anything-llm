import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import PreLoader from "@/components/Preloader";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
import HuggingFaceOptions from "@/components/LLMSelection/HuggingFaceOptions";

import LLMItem from "@/components/LLMSelection/LLMItem";
import { MagnifyingGlass } from "@phosphor-icons/react";
import PerplexityOptions from "@/components/LLMSelection/PerplexityOptions";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const isHosted = window.location.hostname.includes("useanything.com");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { LLMProvider: selectedLLM };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
    } else {
      showToast("LLM preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateLLMChoice = (selection) => {
    setSelectedLLM(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = LLMS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  const LLMS = [
    {
      name: "OpenAI",
      value: "openai",
      logo: OpenAiLogo,
      options: <OpenAiOptions settings={settings} />,
      description: "The standard option for most non-commercial use.",
    },
    {
      name: "Azure OpenAI",
      value: "azure",
      logo: AzureOpenAiLogo,
      options: <AzureAiOptions settings={settings} />,
      description: "The enterprise option of OpenAI hosted on Azure services.",
    },
    {
      name: "Anthropic",
      value: "anthropic",
      logo: AnthropicLogo,
      options: <AnthropicAiOptions settings={settings} />,
      description: "A friendly AI Assistant hosted by Anthropic.",
    },
    {
      name: "Gemini",
      value: "gemini",
      logo: GeminiLogo,
      options: <GeminiLLMOptions settings={settings} />,
      description: "Google's largest and most capable AI model",
    },
    {
      name: "HuggingFace",
      value: "huggingface",
      logo: HuggingFaceLogo,
      options: <HuggingFaceOptions settings={settings} />,
      description:
        "Access 150,000+ open-source LLMs and the world's AI community",
    },
    {
      name: "Ollama",
      value: "ollama",
      logo: OllamaLogo,
      options: <OllamaLLMOptions settings={settings} />,
      description: "Run LLMs locally on your own machine.",
    },
    {
      name: "LM Studio",
      value: "lmstudio",
      logo: LMStudioLogo,
      options: <LMStudioOptions settings={settings} />,
      description:
        "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
    },
    {
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "Run LLMs locally on your own machine.",
    },
    {
      name: "Together AI",
      value: "togetherai",
      logo: TogetherAILogo,
      options: <TogetherAiOptions settings={settings} />,
      description: "Run open source models from Together AI.",
    },
    {
      name: "Mistral",
      value: "mistral",
      logo: MistralLogo,
      options: <MistralOptions settings={settings} />,
      description: "Run open source models from Mistral AI.",
    },
    {
      name: "Perplexity AI",
      value: "perplexity",
      logo: PerplexityLogo,
      options: <PerplexityOptions settings={settings} />,
      description:
        "Run powerful and internet-connected models hosted by Perplexity AI.",
    },
    {
      name: "OpenRouter",
      value: "openrouter",
      logo: OpenRouterLogo,
      options: <OpenRouterOptions settings={settings} />,
      description: "A unified interface for LLMs.",
    },
    {
      name: "Native",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeLLMOptions settings={settings} />,
      description:
        "Use a downloaded custom Llama model for chatting on this AnythingLLM instance.",
    },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient p-[18px] h-full overflow-y-scroll animate-pulse border-4 border-accent"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
        >
          <form onSubmit={handleSubmit} className="flex w-full">
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
              <div className="w-full">
                <div className="w-full relative border-slate-300/20 shadow border-4 rounded-xl text-white">
                  <div className="w-full p-4 absolute top-0 rounded-t-lg backdrop-blur-sm">
                    <div className="w-full flex items-center sticky top-0">
                      <MagnifyingGlass
                        size={16}
                        weight="bold"
                        className="absolute left-4 z-30 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Search LLM providers"
                        className="bg-zinc-600 z-20 pl-10 rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                  <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
                    {filteredLLMs.map((llm) => {
                      if (llm.value === "native" && isHosted) return null;
                      return (
                        <LLMItem
                          key={llm.name}
                          name={llm.name}
                          value={llm.value}
                          image={llm.logo}
                          description={llm.description}
                          checked={selectedLLM === llm.value}
                          onClick={() => updateLLMChoice(llm.value)}
                        />
                      );
                    })}
                  </div>
                </div>
                <div
                  onChange={() => setHasChanges(true)}
                  className="mt-4 flex flex-col gap-y-1"
                >
                  {selectedLLM &&
                    LLMS.find((llm) => llm.value === selectedLLM)?.options}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
