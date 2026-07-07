import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
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
import ZAiLogo from "@/media/llmprovider/zai.png";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";
import PPIOLogo from "@/media/llmprovider/ppio.png";
import MoonshotAiLogo from "@/media/llmprovider/moonshotai.png";
import CometApiLogo from "@/media/llmprovider/cometapi.png";
import FoundryLogo from "@/media/llmprovider/foundry-local.png";
import GiteeAILogo from "@/media/llmprovider/giteeai.png";
import DockerModelRunnerLogo from "@/media/llmprovider/docker-model-runner.png";
import PrivateModeLogo from "@/media/llmprovider/privatemode.png";
import SambaNovaLogo from "@/media/llmprovider/sambanova.png";
import LemonadeLogo from "@/media/llmprovider/lemonade.png";
import MinimaxLogo from "@/media/llmprovider/minimax.png";
import CerebrasLogo from "@/media/llmprovider/cerebras.png";

import PreLoader from "@/components/Preloader";
import ModelRouterOptions from "@/components/LLMSelection/ModelRouterOptions";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import GenericOpenAiOptions from "@/components/LLMSelection/GenericOpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import NovitaLLMOptions from "@/components/LLMSelection/NovitaLLMOptions";
import CometApiLLMOptions from "@/components/LLMSelection/CometApiLLMOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import FireworksAiOptions from "@/components/LLMSelection/FireworksAiOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
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
import ZAiLLMOptions from "@/components/LLMSelection/ZAiLLMOptions";
import NvidiaNimOptions from "@/components/LLMSelection/NvidiaNimOptions";
import PPIOLLMOptions from "@/components/LLMSelection/PPIOLLMOptions";
import MoonshotAiOptions from "@/components/LLMSelection/MoonshotAiOptions";
import FoundryOptions from "@/components/LLMSelection/FoundryOptions";
import GiteeAIOptions from "@/components/LLMSelection/GiteeAIOptions/index.jsx";
import DockerModelRunnerOptions from "@/components/LLMSelection/DockerModelRunnerOptions";
import PrivateModeOptions from "@/components/LLMSelection/PrivateModeOptions";
import SambaNovaOptions from "@/components/LLMSelection/SambaNovaOptions";
import LemonadeOptions from "@/components/LLMSelection/LemonadeOptions";
import MinimaxOptions from "@/components/LLMSelection/MinimaxOptions";
import CerebrasLLMOptions from "@/components/LLMSelection/CerebrasLLMOptions";

import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

function llmProvider(t, config) {
  const { value, logo, options, requiredConfig, connectionConfig } = config;
  return {
    name: t(`llm.providers.${value}.name`),
    value,
    logo,
    options,
    description: t(`llm.providers.${value}.description`),
    requiredConfig,
    ...(connectionConfig ? { connectionConfig } : {}),
  };
}

const AVAILABLE_LLM_PROVIDER_CONFIGS = [
  {
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    requiredConfig: ["OpenAiKey"],
  },
  {
    value: "azure",
    logo: AzureOpenAiLogo,
    options: (settings) => <AzureAiOptions settings={settings} />,
    requiredConfig: ["AzureOpenAiEndpoint"],
  },
  {
    value: "anthropic",
    logo: AnthropicLogo,
    options: (settings) => <AnthropicAiOptions settings={settings} />,
    requiredConfig: ["AnthropicApiKey"],
  },
  {
    value: "gemini",
    logo: GeminiLogo,
    options: (settings) => <GeminiLLMOptions settings={settings} />,
    requiredConfig: ["GeminiLLMApiKey"],
  },
  {
    value: "nvidia-nim",
    logo: NvidiaNimLogo,
    options: (settings) => <NvidiaNimOptions settings={settings} />,
    requiredConfig: ["NvidiaNimLLMBasePath"],
  },
  {
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaLLMOptions settings={settings} />,
    requiredConfig: ["OllamaLLMBasePath"],
  },
  {
    value: "lmstudio",
    logo: LMStudioLogo,
    options: (settings) => <LMStudioOptions settings={settings} />,
    requiredConfig: ["LMStudioBasePath"],
  },
  {
    value: "docker-model-runner",
    logo: DockerModelRunnerLogo,
    options: (settings) => <DockerModelRunnerOptions settings={settings} />,
    requiredConfig: [
      "DockerModelRunnerBasePath",
      "DockerModelRunnerModelPref",
      "DockerModelRunnerModelTokenLimit",
    ],
  },
  {
    value: "lemonade",
    logo: LemonadeLogo,
    options: (settings) => <LemonadeOptions settings={settings} />,
    requiredConfig: ["LemonadeLLMBasePath"],
  },
  {
    value: "sambanova",
    logo: SambaNovaLogo,
    options: (settings) => <SambaNovaOptions settings={settings} />,
    requiredConfig: ["SambaNovaLLMApiKey"],
  },
  {
    value: "localai",
    logo: LocalAiLogo,
    options: (settings) => <LocalAiOptions settings={settings} />,
    requiredConfig: ["LocalAiApiKey", "LocalAiBasePath", "LocalAiTokenLimit"],
  },
  {
    value: "togetherai",
    logo: TogetherAILogo,
    options: (settings) => <TogetherAiOptions settings={settings} />,
    requiredConfig: ["TogetherAiApiKey"],
  },
  {
    value: "fireworksai",
    logo: FireworksAILogo,
    options: (settings) => <FireworksAiOptions settings={settings} />,
    requiredConfig: ["FireworksAiLLMApiKey"],
  },
  {
    value: "mistral",
    logo: MistralLogo,
    options: (settings) => <MistralOptions settings={settings} />,
    requiredConfig: ["MistralApiKey"],
  },
  {
    value: "perplexity",
    logo: PerplexityLogo,
    options: (settings) => <PerplexityOptions settings={settings} />,
    requiredConfig: ["PerplexityApiKey"],
  },
  {
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    requiredConfig: ["OpenRouterApiKey"],
  },
  {
    value: "groq",
    logo: GroqLogo,
    options: (settings) => <GroqAiOptions settings={settings} />,
    requiredConfig: ["GroqApiKey"],
  },
  {
    value: "koboldcpp",
    logo: KoboldCPPLogo,
    options: (settings) => <KoboldCPPOptions settings={settings} />,
    requiredConfig: [
      "KoboldCPPModelPref",
      "KoboldCPPBasePath",
      "KoboldCPPTokenLimit",
    ],
  },
  {
    value: "textgenwebui",
    logo: TextGenWebUILogo,
    options: (settings) => <TextGenWebUIOptions settings={settings} />,
    requiredConfig: ["TextGenWebUIBasePath", "TextGenWebUITokenLimit"],
  },
  {
    value: "cohere",
    logo: CohereLogo,
    options: (settings) => <CohereAiOptions settings={settings} />,
    requiredConfig: ["CohereApiKey"],
  },
  {
    value: "litellm",
    logo: LiteLLMLogo,
    options: (settings) => <LiteLLMOptions settings={settings} />,
    requiredConfig: ["LiteLLMBasePath"],
  },
  {
    value: "deepseek",
    logo: DeepSeekLogo,
    options: (settings) => <DeepSeekOptions settings={settings} />,
    requiredConfig: ["DeepSeekApiKey"],
  },
  {
    value: "ppio",
    logo: PPIOLogo,
    options: (settings) => <PPIOLLMOptions settings={settings} />,
    requiredConfig: ["PPIOApiKey"],
  },
  {
    value: "bedrock",
    logo: AWSBedrockLogo,
    options: (settings) => <AWSBedrockLLMOptions settings={settings} />,
    requiredConfig: [
      "AwsBedrockLLMApiKey",
      "AwsBedrockLLMRegion",
      "AwsBedrockLLMModel",
    ],
  },
  {
    value: "apipie",
    logo: APIPieLogo,
    options: (settings) => <ApiPieLLMOptions settings={settings} />,
    requiredConfig: ["ApipieLLMApiKey", "ApipieLLMModelPref"],
  },
  {
    value: "moonshotai",
    logo: MoonshotAiLogo,
    options: (settings) => <MoonshotAiOptions settings={settings} />,
    requiredConfig: ["MoonshotAiApiKey"],
  },
  {
    value: "privatemode",
    logo: PrivateModeLogo,
    options: (settings) => <PrivateModeOptions settings={settings} />,
    requiredConfig: ["PrivateModeBasePath"],
  },
  {
    value: "novita",
    logo: NovitaLogo,
    options: (settings) => <NovitaLLMOptions settings={settings} />,
    requiredConfig: ["NovitaLLMApiKey"],
  },
  {
    value: "cometapi",
    logo: CometApiLogo,
    options: (settings) => <CometApiLLMOptions settings={settings} />,
    requiredConfig: ["CometApiLLMApiKey"],
  },
  {
    value: "foundry",
    logo: FoundryLogo,
    options: (settings) => <FoundryOptions settings={settings} />,
    requiredConfig: [
      "FoundryBasePath",
      "FoundryModelPref",
      "FoundryModelTokenLimit",
    ],
  },
  {
    value: "xai",
    logo: XAILogo,
    options: (settings) => <XAILLMOptions settings={settings} />,
    requiredConfig: ["XAIApiKey", "XAIModelPref"],
  },
  {
    value: "zai",
    logo: ZAiLogo,
    options: (settings) => <ZAiLLMOptions settings={settings} />,
    requiredConfig: ["ZAiApiKey"],
  },
  {
    value: "giteeai",
    logo: GiteeAILogo,
    options: (settings) => <GiteeAIOptions settings={settings} />,
    requiredConfig: ["GiteeAIApiKey"],
  },
  {
    value: "minimax",
    logo: MinimaxLogo,
    options: (settings) => <MinimaxOptions settings={settings} />,
    requiredConfig: ["MinimaxApiKey"],
  },
  {
    value: "cerebras",
    logo: CerebrasLogo,
    options: (settings) => <CerebrasLLMOptions settings={settings} />,
    requiredConfig: ["CerebrasApiKey"],
  },
  {
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => <GenericOpenAiOptions settings={settings} />,
    requiredConfig: ["GenericOpenAiBasePath", "GenericOpenAiModelPref"],
    connectionConfig: ["GenericOpenAiBasePath"],
  },
];

export function getModelRouterProvider(t) {
  return llmProvider(t, {
    value: "anythingllm-router",
    logo: AnythingLLMIcon,
    options: (settings) => <ModelRouterOptions settings={settings} />,
    requiredConfig: [],
  });
}

export function getAvailableLLMProviders(t) {
  return AVAILABLE_LLM_PROVIDER_CONFIGS.map((config) => llmProvider(t, config));
}

export function getAllLLMProviders(t) {
  return [getModelRouterProvider(t), ...getAvailableLLMProviders(t)];
}

const defaultT = (key, opts) => i18n.t(key, opts);

export const MODEL_ROUTER_PROVIDER = getModelRouterProvider(defaultT);

/**
 * All LLM providers that are available to the user.
 * This **never** includes the model router provider.
 */
export const AVAILABLE_LLM_PROVIDERS = getAvailableLLMProviders(defaultT);

/**
 * All LLM providers that are available to the user.
 * This **always** includes the model router provider.
 */
export const ALL_LLM_PROVIDERS = getAllLLMProviders(defaultT);

export const LLM_PREFERENCE_CHANGED_EVENT = "llm-preference-changed";
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
  const { t } = useTranslation();
  const availableLLMProviders = useMemo(
    () => getAvailableLLMProviders(t),
    [t]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { LLMProvider: selectedLLM };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(t("llm.messages.saveError", { error }), "error");
    } else {
      showToast(t("llm.messages.saveSuccess"), "success");
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

  // Some more complex LLM options do not bubble up the change event, so we need to listen to the custom event
  // we can emit from the LLM options component using window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
  useEffect(() => {
    function updateHasChanges() {
      setHasChanges(true);
    }
    window.addEventListener(LLM_PREFERENCE_CHANGED_EVENT, updateHasChanges);
    return () => {
      window.removeEventListener(
        LLM_PREFERENCE_CHANGED_EVENT,
        updateHasChanges
      );
    };
  }, []);

  useEffect(() => {
    const filtered = availableLLMProviders.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM, availableLLMProviders]);

  const selectedLLMObject = availableLLMProviders.find(
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
                    {saving ? t("common.saving") : t("common.save")}
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
                  <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="llm-search"
                          autoComplete="off"
                          placeholder={t("llm.searchPlaceholder")}
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
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]">
                        {filteredLLMs.map((llm) => {
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
                        alt={
                          selectedLLMObject?.name
                            ? t("llm.logoAlt", {
                                name: selectedLLMObject.name,
                              })
                            : ""
                        }
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedLLMObject?.name || t("llm.noneSelected")}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedLLMObject?.description ||
                            t("llm.needSelect")}
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
                  availableLLMProviders.find(
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
