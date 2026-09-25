import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LemonadeLogo from "@/media/llmprovider/lemonade.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import LocalAiLogo from "@/media/llmprovider/localai.png";

import PreLoader from "@/components/Preloader";
import OpenAiOptions from "@/components/ImageGenerationSelection/OpenAiOptions";
import OllamaOptions from "@/components/ImageGenerationSelection/OllamaOptions";
import LemonadeOptions from "@/components/ImageGenerationSelection/LemonadeOptions";
import OpenRouterOptions from "@/components/ImageGenerationSelection/OpenRouterOptions";
import LocalAiOptions from "@/components/ImageGenerationSelection/LocalAiOptions";
import ImageGenerationItem from "@/components/ImageGenerationSelection/ImageGenerationItem";

import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";

const PROVIDERS = [
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "Generate images with OpenAI's DALL-E and image models.",
  },
  {
    name: "Ollama",
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaOptions settings={settings} />,
    description: "Generate images locally on your own machine (macOS only).",
  },
  {
    name: "Lemonade",
    value: "lemonade",
    logo: LemonadeLogo,
    options: (settings) => <LemonadeOptions settings={settings} />,
    description: "Generate images locally on your own machine using Lemonade.",
  },
  {
    name: "LocalAI",
    value: "localai",
    logo: LocalAiLogo,
    options: (settings) => <LocalAiOptions settings={settings} />,
    description: "Generate images locally on your own machine using LocalAI.",
  },
  {
    name: "OpenRouter",
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    description: "Generate images from image models on OpenRouter.",
  },
];

export default function ImageGenerationPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    const form = document.getElementById("image-generation-form");
    const settingsData = { ImageGenerationProvider: selectedProvider };
    const formData = new FormData(form);
    for (var [key, value] of formData.entries()) settingsData[key] = value;

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(`Failed to save image generation settings: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("Image generation preferences saved successfully.", "success");
      setHasChanges(false);
    }
    setSaving(false);
  };

  const updateChoice = (selection) => {
    setSelectedProvider(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedProvider(_settings?.ImageGenerationProvider || null);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
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
          <form
            id="image-generation-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] py-16 md:py-6">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("imageGeneration.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  {t("imageGeneration.description")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton className="mt-3 mr-0 -mb-14 z-10">
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4">
                {t("imageGeneration.provider")}
              </div>
              <div className="relative">
                <ProviderSearchMenu
                  items={PROVIDERS}
                  selected={
                    selectedProviderObject ?? {
                      name: "None selected",
                      logo: AnythingLLMIcon,
                      description:
                        "You need to select an image generation provider",
                    }
                  }
                  placeholder="Search image generation providers"
                  renderItem={(provider, close) => (
                    <ImageGenerationItem
                      name={provider.name}
                      value={provider.value}
                      image={provider.logo}
                      description={provider.description}
                      checked={selectedProvider === provider.value}
                      onClick={() => {
                        updateChoice(provider.value);
                        close();
                      }}
                    />
                  )}
                />
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1"
              >
                {selectedProvider && selectedProviderObject?.options(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
