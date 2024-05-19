import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import CohereLogo from "@/media/llmprovider/cohere.png";
import VoyageAiLogo from "@/media/embeddingprovider/voyageai.png";

import PreLoader from "@/components/Preloader";
import ChangeWarningModal from "@/components/ChangeWarning";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";
import AzureAiOptions from "@/components/EmbeddingSelection/AzureAiOptions";
import LocalAiOptions from "@/components/EmbeddingSelection/LocalAiOptions";
import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import OllamaEmbeddingOptions from "@/components/EmbeddingSelection/OllamaOptions";
import LMStudioEmbeddingOptions from "@/components/EmbeddingSelection/LMStudioOptions";
import CohereEmbeddingOptions from "@/components/EmbeddingSelection/CohereOptions";
import VoyageAiOptions from "@/components/EmbeddingSelection/VoyageAiOptions";

import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

const EMBEDDERS = [
  {
    name: "AnythingLLM Embedder",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <NativeEmbeddingOptions settings={settings} />,
    description:
      "Use the built-in embedding provider for AnythingLLM. Zero setup!",
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "The standard option for most non-commercial use.",
  },
  {
    name: "Azure OpenAI",
    value: "azure",
    logo: AzureOpenAiLogo,
    options: (settings) => <AzureAiOptions settings={settings} />,
    description: "The enterprise option of OpenAI hosted on Azure services.",
  },
  {
    name: "Local AI",
    value: "localai",
    logo: LocalAiLogo,
    options: (settings) => <LocalAiOptions settings={settings} />,
    description: "Run embedding models locally on your own machine.",
  },
  {
    name: "Ollama",
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaEmbeddingOptions settings={settings} />,
    description: "Run embedding models locally on your own machine.",
  },
  {
    name: "LM Studio",
    value: "lmstudio",
    logo: LMStudioLogo,
    options: (settings) => <LMStudioEmbeddingOptions settings={settings} />,
    description:
      "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
  },
  {
    name: "Cohere",
    value: "cohere",
    logo: CohereLogo,
    options: (settings) => <CohereEmbeddingOptions settings={settings} />,
    description: "Run powerful embedding models from Cohere.",
  },
  {
    name: "Voyage AI",
    value: "voyageai",
    logo: VoyageAiLogo,
    options: (settings) => <VoyageAiOptions settings={settings} />,
    description: "Run powerful embedding models from Voyage AI.",
  },
];

export default function GeneralEmbeddingPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [hasCachedEmbeddings, setHasCachedEmbeddings] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();

  function embedderModelChanged(formEl) {
    try {
      const newModel = new FormData(formEl).get("EmbeddingModelPref") ?? null;
      if (newModel === null) return false;
      return settings?.EmbeddingModelPref !== newModel;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (selectedEmbedder !== settings?.EmbeddingEngine ||
        embedderModelChanged(e.target)) &&
      hasChanges &&
      (hasEmbeddings || hasCachedEmbeddings)
    ) {
      openModal();
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
    closeModal();
  };

  const updateChoice = (selection) => {
    setSearchQuery("");
    setSelectedEmbedder(selection);
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
      setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
      setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
      setHasCachedEmbeddings(_settings?.HasCachedEmbeddings || false);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  const selectedEmbedderObject = EMBEDDERS.find(
    (embedder) => embedder.value === selectedEmbedder
  );

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
          <form
            id="embedding-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    Embedding Preference
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  When using an LLM that does not natively support an embedding
                  engine - you may need to additionally specify credentials to
                  for embedding text.
                  <br />
                  Embedding is the process of turning text into vectors. These
                  credentials are required to turn your files and prompts into a
                  format which AnythingLLM can use to process.
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
                Embedding Provider
              </div>
              <div className="relative">
                {searchMenuOpen && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                    onClick={() => setSearchMenuOpen(false)}
                  />
                )}
                {searchMenuOpen ? (
                  <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-[#18181B] rounded-lg flex flex-col justify-between cursor-pointer border-2 border-[#46C8FF] z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-[#18181B]">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-white -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="embedder-search"
                          autoComplete="off"
                          placeholder="Search all embedding providers"
                          className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <X
                          size={20}
                          weight="bold"
                          className="cursor-pointer text-white hover:text-[#9CA3AF]"
                          onClick={handleXButton}
                        />
                      </div>
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                        {filteredEmbedders.map((embedder) => (
                          <EmbedderItem
                            key={embedder.name}
                            name={embedder.name}
                            value={embedder.value}
                            image={embedder.logo}
                            description={embedder.description}
                            checked={selectedEmbedder === embedder.value}
                            onClick={() => updateChoice(embedder.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full max-w-[640px] h-[64px] bg-[#18181B] rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-[#46C8FF] transition-all duration-300"
                    type="button"
                    onClick={() => setSearchMenuOpen(true)}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={selectedEmbedderObject.logo}
                        alt={`${selectedEmbedderObject.name} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedEmbedderObject.name}
                        </div>
                        <div className="mt-1 text-xs text-[#D2D5DB]">
                          {selectedEmbedderObject.description}
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
                {selectedEmbedder &&
                  EMBEDDERS.find(
                    (embedder) => embedder.value === selectedEmbedder
                  )?.options(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isOpen}>
        <ChangeWarningModal
          warningText="Switching the embedding model will break previously embedded documents from working during chat. They will need to un-embed from every workspace and fully removed and re-uploaded so they can be embed by the new embedding model."
          onClose={closeModal}
          onConfirm={handleSaveSettings}
        />
      </ModalWrapper>
    </div>
  );
}
