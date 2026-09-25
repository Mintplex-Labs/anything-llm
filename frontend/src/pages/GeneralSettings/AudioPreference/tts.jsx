import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import LLMItem from "@/components/LLMSelection/LLMItem";
import CTAButton from "@/components/lib/CTAButton";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import ElevenLabsIcon from "@/media/ttsproviders/elevenlabs.png";
import PiperTTSIcon from "@/media/ttsproviders/piper.png";
import GenericOpenAiLogo from "@/media/ttsproviders/generic-openai.png";
import KokoroIcon from "@/media/ttsproviders/kokoro.png";

import BrowserNative from "@/components/TextToSpeech/BrowserNative";
import OpenAiTTSOptions from "@/components/TextToSpeech/OpenAiOptions";
import ElevenLabsTTSOptions from "@/components/TextToSpeech/ElevenLabsOptions";
import PiperTTSOptions from "@/components/TextToSpeech/PiperTTSOptions";
import OpenAiGenericTTSOptions from "@/components/TextToSpeech/OpenAiGenericOptions";
import KokoroTTSOptions from "@/components/TextToSpeech/KokoroOptions";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";

const PROVIDERS = [
  {
    name: "System native",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <BrowserNative settings={settings} />,
    description: "Uses your browser's built in TTS service if supported.",
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiTTSOptions settings={settings} />,
    description: "Use OpenAI's text to speech voices.",
  },
  {
    name: "ElevenLabs",
    value: "elevenlabs",
    logo: ElevenLabsIcon,
    options: (settings) => <ElevenLabsTTSOptions settings={settings} />,
    description: "Use ElevenLabs's text to speech voices and technology.",
  },
  {
    name: "PiperTTS",
    value: "piper_local",
    logo: PiperTTSIcon,
    options: (settings) => <PiperTTSOptions settings={settings} />,
    description: "Run TTS models locally in your browser privately.",
  },
  {
    name: "Kokoro",
    value: "kokoro",
    logo: KokoroIcon,
    options: (settings) => <KokoroTTSOptions settings={settings} />,
    description:
      "Connect to a self-hosted kokoro-fastapi server for high-quality open-source voices.",
  },
  {
    name: "OpenAI Compatible",
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => <OpenAiGenericTTSOptions settings={settings} />,
    description:
      "Connect to an OpenAI compatible TTS service running locally or remotely.",
  },
];

export default function TextToSpeechProvider({ settings }) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    settings?.TextToSpeechProvider || "native"
  );

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const form = e.target;
    const data = { TextToSpeechProvider: selectedProvider };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(`Failed to save preferences: ${error}`, "error");
    } else {
      showToast("Text-to-speech preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateProviderChoice = (selection) => {
    setSelectedProvider(selection);
    setHasChanges(true);
  };

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
          <div className="flex gap-x-4 items-center">
            <p className="text-lg leading-6 font-bold text-white">
              Text-to-speech Preference
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            Here you can specify what kind of text-to-speech providers you would
            want to use in your AnythingLLM experience. By default, we use the
            browser's built in support for these services, but you may want to
            use others.
          </p>
        </div>
        <div className="w-full justify-end flex">
          {hasChanges && (
            <CTAButton className="mt-3 mr-0 -mb-14 z-10">
              {saving ? "Saving..." : "Save changes"}
            </CTAButton>
          )}
        </div>
        <div className="text-base font-bold text-white mt-6 mb-4">Provider</div>
        <div className="relative">
          <ProviderSearchMenu
            items={PROVIDERS}
            selected={selectedProviderObject}
            placeholder="Search text to speech providers"
            renderItem={(provider, close) => (
              <LLMItem
                name={provider.name}
                value={provider.value}
                image={provider.logo}
                description={provider.description}
                checked={selectedProvider === provider.value}
                onClick={() => {
                  updateProviderChoice(provider.value);
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
          {selectedProvider &&
            PROVIDERS.find(
              (provider) => provider.value === selectedProvider
            )?.options(settings)}
        </div>
      </div>
    </form>
  );
}
