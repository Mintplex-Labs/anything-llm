import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import PreLoader from "@/components/Preloader";
import ChangeWarningModal from "@/components/ChangeWarning";
import ModalWrapper from "@/components/ModalWrapper";
import VectorDBItem from "@/components/VectorDBSelection/VectorDBItem";

import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import MilvusLogo from "@/media/vectordbs/milvus.png";
import ZillizLogo from "@/media/vectordbs/zilliz.png";
import AstraDBLogo from "@/media/vectordbs/astraDB.png";
import PGVectorLogo from "@/media/vectordbs/pgvector.png";

import LanceDBOptions from "@/components/VectorDBSelection/LanceDBOptions";
import ChromaDBOptions from "@/components/VectorDBSelection/ChromaDBOptions";
import ChromaCloudOptions from "@/components/VectorDBSelection/ChromaCloudOptions";
import PineconeDBOptions from "@/components/VectorDBSelection/PineconeDBOptions";
import WeaviateDBOptions from "@/components/VectorDBSelection/WeaviateDBOptions";
import QDrantDBOptions from "@/components/VectorDBSelection/QDrantDBOptions";
import MilvusDBOptions from "@/components/VectorDBSelection/MilvusDBOptions";
import ZillizCloudOptions from "@/components/VectorDBSelection/ZillizCloudOptions";
import AstraDBOptions from "@/components/VectorDBSelection/AstraDBOptions";
import PGVectorOptions from "@/components/VectorDBSelection/PGVectorOptions";

function getVectorDBs(t) {
  return [
    {
      name: t("vector.providers.lancedb.name"),
      value: "lancedb",
      logo: LanceDbLogo,
      options: (_) => <LanceDBOptions />,
      description: t("vector.providers.lancedb.description"),
    },
    {
      name: t("vector.providers.pgvector.name"),
      value: "pgvector",
      logo: PGVectorLogo,
      options: (settings) => <PGVectorOptions settings={settings} />,
      description: t("vector.providers.pgvector.description"),
    },
    {
      name: t("vector.providers.chroma.name"),
      value: "chroma",
      logo: ChromaLogo,
      options: (settings) => <ChromaDBOptions settings={settings} />,
      description: t("vector.providers.chroma.description"),
    },
    {
      name: t("vector.providers.chromacloud.name"),
      value: "chromacloud",
      logo: ChromaLogo,
      options: (settings) => <ChromaCloudOptions settings={settings} />,
      description: t("vector.providers.chromacloud.description"),
    },
    {
      name: t("vector.providers.pinecone.name"),
      value: "pinecone",
      logo: PineconeLogo,
      options: (settings) => <PineconeDBOptions settings={settings} />,
      description: t("vector.providers.pinecone.description"),
    },
    {
      name: t("vector.providers.zilliz.name"),
      value: "zilliz",
      logo: ZillizLogo,
      options: (settings) => <ZillizCloudOptions settings={settings} />,
      description: t("vector.providers.zilliz.description"),
    },
    {
      name: t("vector.providers.qdrant.name"),
      value: "qdrant",
      logo: QDrantLogo,
      options: (settings) => <QDrantDBOptions settings={settings} />,
      description: t("vector.providers.qdrant.description"),
    },
    {
      name: t("vector.providers.weaviate.name"),
      value: "weaviate",
      logo: WeaviateLogo,
      options: (settings) => <WeaviateDBOptions settings={settings} />,
      description: t("vector.providers.weaviate.description"),
    },
    {
      name: t("vector.providers.milvus.name"),
      value: "milvus",
      logo: MilvusLogo,
      options: (settings) => <MilvusDBOptions settings={settings} />,
      description: t("vector.providers.milvus.description"),
    },
    {
      name: t("vector.providers.astra.name"),
      value: "astra",
      logo: AstraDBLogo,
      options: (settings) => <AstraDBOptions settings={settings} />,
      description: t("vector.providers.astra.description"),
    },
  ];
}

export default function GeneralVectorDatabase() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVDBs, setFilteredVDBs] = useState([]);
  const [selectedVDB, setSelectedVDB] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const vectorDBs = useMemo(() => getVectorDBs(t), [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVDB !== settings?.VectorDB && hasChanges && hasEmbeddings) {
      openModal();
    } else {
      await handleSaveSettings();
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const form = document.getElementById("vectordb-form");
    const settingsData = {};
    const formData = new FormData(form);
    settingsData.VectorDB = selectedVDB;
    for (var [key, value] of formData.entries()) settingsData[key] = value;

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(t("vector.messages.saveError", { error }), "error");
      setHasChanges(true);
    } else {
      showToast(t("vector.messages.saveSuccess"), "success");
      setHasChanges(false);
    }
    setSaving(false);
    closeModal();
  };

  const updateVectorChoice = (selection) => {
    setSearchQuery("");
    setSelectedVDB(selection);
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
      setSelectedVDB(_settings?.VectorDB || "lancedb");
      setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = vectorDBs.filter((vdb) =>
      vdb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVDBs(filtered);
  }, [searchQuery, selectedVDB, vectorDBs]);

  const selectedVDBObject =
    vectorDBs.find((vdb) => vdb.value === selectedVDB) ?? vectorDBs[0];

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
            id="vectordb-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] py-16 md:py-6">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("vector.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  {t("vector.description")}
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
                {t("vector.provider.title")}
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
                          name="vdb-search"
                          autoComplete="off"
                          placeholder={t("vector.searchPlaceholder")}
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
                        {filteredVDBs.map((vdb) => (
                          <VectorDBItem
                            key={vdb.name}
                            name={vdb.name}
                            value={vdb.value}
                            image={vdb.logo}
                            description={vdb.description}
                            checked={selectedVDB === vdb.value}
                            onClick={() => updateVectorChoice(vdb.value)}
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
                        src={selectedVDBObject.logo}
                        alt={t("vector.logoAlt", {
                          name: selectedVDBObject.name,
                        })}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedVDBObject.name}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedVDBObject.description}
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
                {selectedVDB &&
                  vectorDBs.find((vdb) => vdb.value === selectedVDB)?.options(
                    settings
                  )}
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isOpen}>
        <ChangeWarningModal
          warningText={t("vector.switchWarning")}
          onClose={closeModal}
          onConfirm={handleSaveSettings}
        />
      </ModalWrapper>
    </div>
  );
}
