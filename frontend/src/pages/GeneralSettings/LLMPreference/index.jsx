import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import NovitaLogo from "@/media/llmprovider/novita.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import FireworksAILogo from "@/media/llmprovider/fireworksai.jpeg";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import KoboldCPPLogo from "@/media/llmprovider/koboldcpp.png";
import TextGenWebUILogo from "@/media/llmprovider/text-generation-webui.png";
import CohereLogo from "@/media/llmprovider/cohere.png";
import LiteLLMLogo from "@/media/llmprovider/litellm.png";
import AWSBedrockLogo from "@/media/llmprovider/bedrock.png";
import DeepSeekLogo from "@/media/llmprovider/deepseek.png";
import APIPieLogo from "@/media/llmprovider/apipie.png";
import XAILogo from "@/media/llmprovider/xai.png";

import PreLoader from "@/components/Preloader";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import GenericOpenAiOptions from "@/components/LLMSelection/GenericOpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import NovitaLLMOptions from "@/components/LLMSelection/NovitaLLMOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import FireworksAiOptions from "@/components/LLMSelection/FireworksAiOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
import HuggingFaceOptions from "@/components/LLMSelection/HuggingFaceOptions";
import PerplexityOptions from "@/components/LLMSelection/PerplexityOptions";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import CohereAiOptions from "@/components/LLMSelection/CohereAiOptions";
import KoboldCPPOptions from "@/components/LLMSelection/KoboldCPPOptions";
import TextGenWebUIOptions from "@/components/LLMSelection/TextGenWebUIOptions";
import LiteLLMOptions from "@/components/LLMSelection/LiteLLMOptions";
import AWSBedrockLLMOptions from "@/components/LLMSelection/AwsBedrockLLMOptions";
import DeepSeekOptions from "@/components/LLMSelection/DeepSeekOptions";
import ApiPieLLMOptions from "@/components/LLMSelection/ApiPieOptions";
import XAILLMOptions from "@/components/LLMSelection/XAiLLMOptions";

import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export const AVAILABLE_LLM_PROVIDERS = [
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "The standard option for most non-commercial use.",
    requiredConfig: ["OpenAiKey"],
  },
  {
    name: "Azure OpenAI",
    value: "azure",
    logo: AzureOpenAiLogo,
    options: (settings) => <AzureAiOptions settings={settings} />,
    description: "The enterprise option of OpenAI hosted on Azure services.",
    requiredConfig: ["AzureOpenAiEndpoint"],
  },
  {
    name: "Anthropic",
    value: "anthropic",
    logo: AnthropicLogo,
    options: (settings) => <AnthropicAiOptions settings={settings} />,
    description: "A friendly AI Assistant hosted by Anthropic.",
    requiredConfig: ["AnthropicApiKey"],
  },
  {
    name: "Gemini",
    value: "gemini",
    logo: GeminiLogo,
    options: (settings) => <GeminiLLMOptions settings={settings} />,
    description: "Google's largest and most capable AI model",
    requiredConfig: ["GeminiLLMApiKey"],
  },
  {
    name: "HuggingFace",
    value: "huggingface",
    logo: HuggingFaceLogo,
    options: (settings) => <HuggingFaceOptions settings={settings} />,
    description:
      "Access 150,000+ open-source LLMs and the world's AI community",
    requiredConfig: [
      "HuggingFaceLLMEndpoint",
      "HuggingFaceLLMAccessToken",
      "HuggingFaceLLMTokenLimit",
    ],
  },
  {
    name: "Ollama",
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaLLMOptions settings={settings} />,
    description: "Run LLMs locally on your own machine.",
    requiredConfig: ["OllamaLLMBasePath"],
  },
  {
    name: "Novita AI",
    value: "novita",
    logo: NovitaLogo,
    options: (settings) => <NovitaLLMOptions settings={settings} />,
    description:
      "Reliable, Scalable, and Cost-Effective for LLMs from Novita AI",
    requiredConfig: ["NovitaLLMApiKey"],
  },
  {
    name: "LM Studio",
    value: "lmstudio",
    logo: LMStudioLogo,
    options: (settings) => <LMStudioOptions settings={settings} />,
    description:
      "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
    requiredConfig: ["LMStudioBasePath"],
  },
  {
    name: "Local AI",
    value: "localai",
    logo: LocalAiLogo,
    options: (settings) => <LocalAiOptions settings={settings} />,
    description: "Run LLMs locally on your own machine.",
    requiredConfig: ["LocalAiApiKey", "LocalAiBasePath", "LocalAiTokenLimit"],
  },
  {
    name: "Together AI",
    value: "togetherai",
    logo: TogetherAILogo,
    options: (settings) => <TogetherAiOptions settings={settings} />,
    description: "Run open source models from Together AI.",
    requiredConfig: ["TogetherAiApiKey"],
  },
  {
    name: "Fireworks AI",
    value: "fireworksai",
    logo: FireworksAILogo,
    options: (settings) => <FireworksAiOptions settings={settings} />,
    description:
      "The fastest and most efficient inference engine to build production-ready, compound AI systems.",
    requiredConfig: ["FireworksAiLLMApiKey"],
  },
  {
    name: "Mistral",
    value: "mistral",
    logo: MistralLogo,
    options: (settings) => <MistralOptions settings={settings} />,
    description: "Run open source models from Mistral AI.",
    requiredConfig: ["MistralApiKey"],
  },
  {
    name: "Perplexity AI",
    value: "perplexity",
    logo: PerplexityLogo,
    options: (settings) => <PerplexityOptions settings={settings} />,
    description:
      "Run powerful and internet-connected models hosted by Perplexity AI.",
    requiredConfig: ["PerplexityApiKey"],
  },
  {
    name: "OpenRouter",
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    description: "A unified interface for LLMs.",
    requiredConfig: ["OpenRouterApiKey"],
  },
  {
    name: "Groq",
    value: "groq",
    logo: GroqLogo,
    options: (settings) => <GroqAiOptions settings={settings} />,
    description:
      "The fastest LLM inferencing available for real-time AI applications.",
    requiredConfig: ["GroqApiKey"],
  },
  {
    name: "KoboldCPP",
    value: "koboldcpp",
    logo: KoboldCPPLogo,
    options: (settings) => <KoboldCPPOptions settings={settings} />,
    description: "Run local LLMs using koboldcpp.",
    requiredConfig: [
      "KoboldCPPModelPref",
      "KoboldCPPBasePath",
      "KoboldCPPTokenLimit",
    ],
  },
  {
    name: "Oobabooga Web UI",
    value: "textgenwebui",
    logo: TextGenWebUILogo,
    options: (settings) => <TextGenWebUIOptions settings={settings} />,
    description: "Run local LLMs using Oobabooga's Text Generation Web UI.",
    requiredConfig: ["TextGenWebUIBasePath", "TextGenWebUITokenLimit"],
  },
  {
    name: "Cohere",
    value: "cohere",
    logo: CohereLogo,
    options: (settings) => <CohereAiOptions settings={settings} />,
    description: "Run Cohere's powerful Command models.",
    requiredConfig: ["CohereApiKey"],
  },
  {
    name: "LiteLLM",
    value: "litellm",
    logo: LiteLLMLogo,
    options: (settings) => <LiteLLMOptions settings={settings} />,
    description: "Run LiteLLM's OpenAI compatible proxy for various LLMs.",
    requiredConfig: ["LiteLLMBasePath"],
  },
  {
    name: "DeepSeek",
    value: "deepseek",
    logo: DeepSeekLogo,
    options: (settings) => <DeepSeekOptions settings={settings} />,
    description: "Run DeepSeek's powerful LLMs.",
    requiredConfig: ["DeepSeekApiKey"],
  },
  {
    name: "AWS Bedrock",
    value: "bedrock",
    logo: AWSBedrockLogo,
    options: (settings) => <AWSBedrockLLMOptions settings={settings} />,
    description: "Run powerful foundation models privately with AWS Bedrock.",
    requiredConfig: [
      "AwsBedrockLLMAccessKeyId",
      "AwsBedrockLLMAccessKey",
      "AwsBedrockLLMRegion",
      "AwsBedrockLLMModel",
    ],
  },
  {
    name: "APIpie",
    value: "apipie",
    logo: APIPieLogo,
    options: (settings) => <ApiPieLLMOptions settings={settings} />,
    description: "A unified API of AI services from leading providers",
    requiredConfig: ["ApipieLLMApiKey", "ApipieLLMModelPref"],
  },
  {
    name: "Generic OpenAI",
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => <GenericOpenAiOptions settings={settings} />,
    description:
      "Connect to any OpenAi-compatible service via a custom configuration",
    requiredConfig: [
      "GenericOpenAiBasePath",
      "GenericOpenAiModelPref",
      "GenericOpenAiTokenLimit",
      "GenericOpenAiKey",
    ],
  },
  {
    name: "xAI",
    value: "xai",
    logo: XAILogo,
    options: (settings) => <XAILLMOptions settings={settings} />,
    description: "Run xAI's powerful LLMs like Grok-2 and more.",
    requiredConfig: ["XAIApiKey", "XAIModelPref"],
  },

  {
    name: "Native",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <NativeLLMOptions settings={settings} />,
    description:
      "Use a downloaded custom Llama model for chatting on this AnythingLLM instance.",
    requiredConfig: [],
  },
];

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const isHosted = window.location.hostname.includes("useanything.com");
  const { t } = useTranslation();

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
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
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
    const filtered = AVAILABLE_LLM_PROVIDERS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  const selectedLLMObject = AVAILABLE_LLM_PROVIDERS.find(
    (llm) => llm.value === selectedLLM
  );
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("llm.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  {t("llm.description")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={() => handleSubmit()}
                    className="mt-3 mr-0 -mb-14 z-10"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4">
                {t("llm.provider")}
              </div>
              <div className="relative">
                {searchMenuOpen && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                    onClick={() => setSearchMenuOpen(false)}
                  />
                )}
                {searchMenuOpen ? (
                  <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="llm-search"
                          autoComplete="off"
                          placeholder="Search all LLM providers"
                          className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <X
                          size={20}
                          weight="bold"
                          className="cursor-pointer text-white hover:text-x-button"
                          onClick={handleXButton}
                        />
                      </div>
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
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
                  </div>
                ) : (
                  <button
                    className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
                    type="button"
                    onClick={() => setSearchMenuOpen(true)}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={selectedLLMObject?.logo || AnythingLLMIcon}
                        alt={`${selectedLLMObject?.name} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedLLMObject?.name || "None selected"}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedLLMObject?.description ||
                            "You need to select an LLM"}
                        </div>
                      </div>
                    </div>
                    <CaretUpDown
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </button>
                )}
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1"
              >
                {selectedLLM &&
                  AVAILABLE_LLM_PROVIDERS.find(
                    (llm) => llm.value === selectedLLM
                  )?.options?.(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
