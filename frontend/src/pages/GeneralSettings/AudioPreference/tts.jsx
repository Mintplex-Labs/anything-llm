import React, { useEffect, useState, useRef } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import ElevenLabsIcon from "@/media/ttsproviders/elevenlabs.png";
import BrowserNative from "@/components/TextToSpeech/BrowserNative";
import OpenAiTTSOptions from "@/components/TextToSpeech/OpenAiOptions";
import ElevenLabsTTSOptions from "@/components/TextToSpeech/ElevenLabsOptions";
import { useTranslation } from "react-i18next";

const PROVIDERS = [
  {
    name: "System native",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <BrowserNative settings={settings} />,
    description: (t) => t("tts.providers.native"),
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiTTSOptions settings={settings} />,
    description: (t) => t("tts.providers.openai"),
  },
  {
    name: "ElevenLabs",
    value: "elevenlabs",
    logo: ElevenLabsIcon,
    options: (settings) => <ElevenLabsTTSOptions settings={settings} />,
    description: (t) => t("tts.providers.elevenlabs"),
  },
];

export default function TextToSpeechProvider({ settings }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(
    settings?.TextToSpeechProvider || "native"
  );
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const form = e.target;
    const data = { TextToSpeechProvider: selectedProvider };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(t("tts.error", { error }), "error");
    } else {
      showToast(t("tts.success"), "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateProviderChoice = (selection) => {
    setSearchQuery("");
    setSelectedProvider(selection);
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
    const filtered = PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchQuery, selectedProvider]);

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
          <div className="flex gap-x-4 items-center">
            <p className="text-lg leading-6 font-bold text-white">
              {t("tts.title")}
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            {t("tts.description")}
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
          {t("tts.provider")}
        </div>
        <div className="relative">
          {searchMenuOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
              onClick={() => setSearchMenuOpen(false)}
            />
          )}
          {searchMenuOpen ? (
            <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-dark-input rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
              <div className="w-full flex flex-col gap-y-1">
                <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-dark-input">
                  <MagnifyingGlass
                    size={20}
                    weight="bold"
                    className="absolute left-4 z-30 text-white -ml-4 my-2"
                  />
                  <input
                    type="text"
                    name="tts-provider-search"
                    autoComplete="off"
                    placeholder={t("tts.searchPlaceholder")}
                    className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-white placeholder:text-white placeholder:font-medium"
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
                  {filteredProviders.map((provider) => (
                    <LLMItem
                      key={provider.name}
                      name={provider.name}
                      value={provider.value}
                      image={provider.logo}
                      description={provider.description(t)}
                      checked={selectedProvider === provider.value}
                      onClick={() => updateProviderChoice(provider.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <button
              className="w-full max-w-[640px] h-[64px] bg-dark-input rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
              type="button"
              onClick={() => setSearchMenuOpen(true)}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src={selectedProviderObject.logo}
                  alt={`${selectedProviderObject.name} logo`}
                  className="w-10 h-10 rounded-md"
                />
                <div className="flex flex-col text-left">
                  <div className="text-sm font-semibold text-white">
                    {selectedProviderObject.name}
                  </div>
                  <div className="mt-1 text-xs text-description">
                    {selectedProviderObject.description(t)}
                  </div>
                </div>
              </div>
              <CaretUpDown size={24} weight="bold" className="text-white" />
            </button>
          )}
        </div>
        <div
          onChange={() => setHasChanges(true)}
          className="mt-4 flex flex-col gap-y-1"
        >
          {selectedProvider &&
            PROVIDERS.find(
              (provider) => provider.value === selectedProvider
            )?.options(settings)}
        </div>
      </div>
    </form>
  );
}
