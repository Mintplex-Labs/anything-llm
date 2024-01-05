import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import PreLoader from "@/components/Preloader";
import ChangeWarningModal from "@/components/ChangeWarning";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";
import AzureAiOptions from "@/components/EmbeddingSelection/AzureAiOptions";
import LocalAiOptions from "@/components/EmbeddingSelection/LocalAiOptions";
import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function GeneralEmbeddingPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      selectedEmbedder !== settings?.EmbeddingEngine &&
      hasChanges &&
      hasEmbeddings
    ) {
      document.getElementById("confirmation-modal")?.showModal();
    } else {
      await handleSaveSettings();
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const form = document.getElementById("embedding-form");
    const settingsData = {};
    const formData = new FormData(form);
    settingsData.EmbeddingEngine = selectedEmbedder;
    for (var [key, value] of formData.entries()) settingsData[key] = value;

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(`Failed to save embedding settings: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("Embedding preferences saved successfully.", "success");
      setHasChanges(false);
    }
    setSaving(false);
    document.getElementById("confirmation-modal")?.close();
  };

  const updateChoice = (selection) => {
    setSelectedEmbedder(selection);
    setHasChanges(true);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
      setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const EMBEDDERS = [
    {
      name: "AnythingLLM Embedder",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeEmbeddingOptions settings={settings} />,
      description:
        "Use the built-in embedding engine for AnythingLLM. Zero setup!",
    },
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
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "Run embedding models locally on your own machine.",
    },
  ];

  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <ChangeWarningModal
        warningText=" Switching the embedder may affect previously embedded documents and future similarity search results."
        onClose={() => document.getElementById("confirmation-modal")?.close()}
        onConfirm={handleSaveSettings}
      />
      {!isMobile && <Sidebar />}
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
          {isMobile && <SidebarMobileHeader />}
          <form
            id="embedding-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    Embedding Preference
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
                  When using an LLM that does not natively support an embedding
                  engine - you may need to additionally specify credentials to
                  for embedding text.
                  <br />
                  Embedding is the process of turning text into vectors. These
                  credentials are required to turn your files and prompts into a
                  format which AnythingLLM can use to process.
                </p>
              </div>

              <>
                <div className="text-white text-sm font-medium py-4">
                  Embedding Providers
                </div>
                <div className="w-full">
                  <div className="w-full relative border-slate-300/20 shadow border-4 rounded-xl text-white">
                    <div className="w-full p-4 absolute top-0 rounded-t-lg backdrop-blur-sm">
                      <div className="w-full flex items-center sticky top-0 z-20">
                        <MagnifyingGlass
                          size={16}
                          weight="bold"
                          className="absolute left-4 z-30 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Search Embedding providers"
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
                      {filteredEmbedders.map((embedder) => {
                        return (
                          <EmbedderItem
                            key={embedder.name}
                            name={embedder.name}
                            value={embedder.value}
                            image={embedder.logo}
                            description={embedder.description}
                            checked={selectedEmbedder === embedder.value}
                            onClick={() => updateChoice(embedder.value)}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div
                    onChange={() => setHasChanges(true)}
                    className="mt-4 flex flex-col gap-y-1"
                  >
                    {selectedEmbedder &&
                      EMBEDDERS.find(
                        (embedder) => embedder.value === selectedEmbedder
                      )?.options}
                  </div>
                </div>
              </>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
