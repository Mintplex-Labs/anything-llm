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
import LiteLLMLogo from "@/media/llmprovider/litellm.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import MistralAiLogo from "@/media/llmprovider/mistral.jpeg";

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
import LiteLLMOptions from "@/components/EmbeddingSelection/LiteLLMOptions";
import GenericOpenAiEmbeddingOptions from "@/components/EmbeddingSelection/GenericOpenAiOptions";

import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";
import MistralAiOptions from "@/components/EmbeddingSelection/MistralAiOptions";
import { ALLOWED_SYSTEM_CONFIG_KEYS } from "@/utils/constants";
import HybridSearchPreference from "./HybridSearchPreference";
import { parse } from "postcss";
import Workspace from "@/models/workspace";

const EMBEDDERS = [
  {
    name: "Native Embedder",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <NativeEmbeddingOptions settings={settings} />,
    description:
      "Use the built-in embedding provider for Prism. Zero setup!",
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
  {
    name: "LiteLLM",
    value: "litellm",
    logo: LiteLLMLogo,
    options: (settings) => <LiteLLMOptions settings={settings} />,
    description: "Run powerful embedding models from LiteLLM.",
  },
  {
    name: "Mistral AI",
    value: "mistral",
    logo: MistralAiLogo,
    options: (settings) => <MistralAiOptions settings={settings} />,
    description: "Run powerful embedding models from Mistral AI.",
  },
  {
    name: "Prism",
    value: "generic-openai",
    logo: AnythingLLMIcon,
    options: (settings) => (
      <GenericOpenAiEmbeddingOptions settings={settings} />
    ),
    description: "Run embedding models from any OpenAI compatible API service.",
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
  const [weightError, setWeightError] = useState(false);
  const searchInputRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  function valuesChanged(formData) {
    try {
      const keys = [
        "EmbeddingBasePath",
        "EmbeddingModelPref",
        "EmbeddingModelMaxChunkLength",
        "SparseEmbeddingBasePath",
        "SparseEmbeddingModelPref",
        "HybridSearchEnabled",
        // "HybridSearchDenseVectorWeight",
        // "HybridSearchSparseVectorWeight",
        // "GenericOpenAiEmbeddingApiKey",
        // "SparseGenericOpenAiEmbeddingApiKey",
        // "GenericOpenAiEmbeddingMaxConcurrentChunks",
        // "VoyageAiApiKey",
      ];
      for (const key of keys) {
        let newValue = formData.get(key) ?? null;
        if (newValue === null && key === "EmbeddingModelPref") return false;
        if (key === "HybridSearchEnabled") {
          newValue = newValue === "on" ? "true" : "false";
        }
        if (settings?.[key] !== newValue) return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const form = document.getElementById("embedding-form");
    const formData = new FormData(form);
    const isHybridSearchEnabled = formData.get("HybridSearchEnabled") === "on";
    if (isHybridSearchEnabled) {
      const HybridSearchDenseVectorWeight =
        parseFloat(formData.get("HybridSearchDenseVectorWeight")) || 0;
      const HybridSearchSparseVectorWeight =
        parseFloat(formData.get("HybridSearchSparseVectorWeight")) || 0;

      const isValidWeight = !!(
        HybridSearchSparseVectorWeight &&
        HybridSearchDenseVectorWeight &&
        HybridSearchDenseVectorWeight + HybridSearchSparseVectorWeight === 1
      );
      setWeightError(!isValidWeight);
      if (!isValidWeight) {
        return;
      }
    }
    if (
      (selectedEmbedder !== settings?.EmbeddingEngine ||
        valuesChanged(formData)) &&
      hasChanges &&
      (hasEmbeddings || hasCachedEmbeddings)
    ) {
      openModal();
    } else {
      await handleSaveSettings();
    }
  };
  const handleDeletingEmbeddings = async () => {
    setSaving(true);
    await Workspace.deleteEmbeddings();
    setSaving(false);
    return;
  };
  const handleSaveSettings = async () => {
    setSaving(true);
    const form = document.getElementById("embedding-form");
    const settingsData = {};
    const formData = new FormData(form);
    settingsData.EmbeddingEngine = selectedEmbedder;
    for (var [key, value] of formData.entries()) settingsData[key] = value;

    settingsData.HybridSearchEnabled =
      settingsData?.HybridSearchEnabled === "on" ? "true" : "false";

    const { error } = await System.updateSystem(
      settingsData,
      ALLOWED_SYSTEM_CONFIG_KEYS.embedding
    );
    if (error) {
      showToast(`Failed to save embedding settings: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("Embedding preferences saved successfully.", "success");
      setHasChanges(false);
      fetchKeys();
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
  async function fetchKeys() {
    const _settings = await System.keys();
    setSettings(_settings);
    setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
    setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
    setHasCachedEmbeddings(_settings?.HasCachedEmbeddings || false);
    setLoading(false);
  }
  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    if (weightError) {
      showToast(t("embedding.hybrid-search.weightInfo"), "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightError]);

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
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
        >
          <form
            id="embedding-form"
            onSubmit={handleSubmit}
            className="flex w-full flex-1 h-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] py-16 md:py-6">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10 custom-border-secondary" style={{ borderTop: 0, borderRight: 0, borderLeft: 0 }}>
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white custom-text-secondary">
                    {t("embedding.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60 custom-text-secondary">
                  {t("embedding.desc-start")}
                  <br />
                  {t("embedding.desc-end")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={() => handleSubmit()}
                    className="mt-3 mr-0 -mb-14 z-10 custom-theme-bg-quad custom-theme-color-quad"
                    buttonProps={{
                      // onClick: (e) => handleSubmit(e),
                      type: "submit",
                      disabled: saving,
                    }}
                  >
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4 custom-text-secondary">
                {t("embedding.provider.title")}
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
                          name="embedder-search"
                          autoComplete="off"
                          placeholder="Search all embedding providers"
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
                    className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
                    type="button"
                    onClick={() => setSearchMenuOpen(true)}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={selectedEmbedderObject?.logo}
                        alt={`${selectedEmbedderObject?.name} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white custom-text-secondary">
                          {selectedEmbedderObject?.name}
                        </div>
                        <div className="mt-1 text-xs text-description custom-text-secondary">
                          {selectedEmbedderObject?.description}
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
              <div className="flex-1 h-full w-full pl-2 overflow-y-auto">
                <div
                  onChange={() => setHasChanges(true)}
                  className="mt-4 flex flex-col gap-y-1 mb-[36px] custom-llm-provider-modal"
                >
                  {selectedEmbedder &&
                    EMBEDDERS.find(
                      (embedder) => embedder.value === selectedEmbedder
                    )?.options(settings)}
                </div>
                <HybridSearchPreference
                  settings={settings}
                  onChange={() => setHasChanges(true)}
                  weightError={weightError}
                />
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isOpen}>
        <ChangeWarningModal
          warningText={
            <div className="w-full">
              {t("embedding.warning-start")}
              <br />
              <br />
              {t("embedding.warning-end")}
            </div>
          }
          onClose={closeModal}
          onConfirm={async () => {
            await handleDeletingEmbeddings();
            await handleSaveSettings();
          }}
        />
      </ModalWrapper>
    </div>
  );
}
