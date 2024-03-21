import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Sidebar from "@/components/SettingsSidebar";
import System from "@/models/system";
import showToast from "@/utils/toast";
import PreLoader from "@/components/Preloader";

import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiWhisperOptions from "@/components/TranscriptionSelection/OpenAiOptions";
import NativeTranscriptionOptions from "@/components/TranscriptionSelection/NativeTranscriptionOptions";
import LLMItem from "@/components/LLMSelection/LLMItem";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function TranscriptionModelPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { WhisperProvider: selectedProvider };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(`Failed to save preferences: ${error}`, "error");
    } else {
      showToast("Transcription preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateProviderChoice = (selection) => {
    setSelectedProvider(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedProvider(_settings?.WhisperProvider || "local");
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchQuery, selectedProvider]);

  const PROVIDERS = [
    {
      name: "OpenAI",
      value: "openai",
      logo: OpenAiLogo,
      options: <OpenAiWhisperOptions settings={settings} />,
      description:
        "Leverage the OpenAI Whisper-large model using your API key.",
    },
    {
      name: "AnythingLLM Built-In",
      value: "local",
      logo: AnythingLLMIcon,
      options: <NativeTranscriptionOptions settings={settings} />,
      description: "Run a built-in whisper model on this instance privately.",
    },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    Transcription Model Preference
                  </p>
                  {hasChanges && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-x-2 px-4 py-2 rounded-lg bg-[#2C2F36] text-white text-sm hover:bg-[#3D4147] shadow-md border border-[#3D4147]"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  )}
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  These are the credentials and settings for your preferred
                  transcription model provider. Its important these keys are
                  current and correct or else media files and audio will not
                  transcribe.
                </p>
              </div>
              <div className="text-sm font-medium text-white mt-6 mb-4">
                Transcription Providers
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
                        placeholder="Search audio transcription providers"
                        className="bg-zinc-600 z-20 pl-10 h-[38px] rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                  <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
                    {filteredProviders.map((provider) => {
                      return (
                        <LLMItem
                          key={provider.name}
                          name={provider.name}
                          value={provider.value}
                          image={provider.logo}
                          description={provider.description}
                          checked={selectedProvider === provider.value}
                          onClick={() => updateProviderChoice(provider.value)}
                        />
                      );
                    })}
                  </div>
                </div>
                <div
                  onChange={() => setHasChanges(true)}
                  className="mt-4 flex flex-col gap-y-1"
                >
                  {selectedProvider &&
                    PROVIDERS.find(
                      (provider) => provider.value === selectedProvider
                    )?.options}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
