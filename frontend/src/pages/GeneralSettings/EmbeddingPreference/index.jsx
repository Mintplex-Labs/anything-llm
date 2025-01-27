import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";

import PreLoader from "@/components/Preloader";
import GenericOpenAiEmbeddingOptions from "@/components/EmbeddingSelection/GenericOpenAiOptions";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";
import { ALLOWED_SYSTEM_CONFIG_KEYS } from "@/utils/constants";

const SELECTED_EMBEDDER = {
  name: "Generic OpenAI",
  value: "generic-openai",
  logo: GenericOpenAiLogo,
  options: (settings) => <GenericOpenAiEmbeddingOptions settings={settings} />,
  description: "Run embedding models from any OpenAI compatible API service.",
};

export default function GeneralEmbeddingPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSaveSettings();
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const form = document.getElementById("embedding-form");
    const settingsData = {};
    const formData = new FormData(form);
    settingsData.EmbeddingEngine = SELECTED_EMBEDDER.value;
    for (var [key, value] of formData.entries()) settingsData[key] = value;

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
    }
    setSaving(false);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

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
            className="flex w-full"
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
                  >
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4 custom-text-secondary">
                {t("embedding.provider.title")}
              </div>
              <div className="relative">
                <div className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300">
                  <div className="flex gap-x-4 items-center">
                    <img
                      src={SELECTED_EMBEDDER?.logo}
                      alt={`${SELECTED_EMBEDDER?.name} logo`}
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="flex flex-col text-left">
                      <div className="text-sm font-semibold text-white custom-text-secondary">
                        {SELECTED_EMBEDDER?.name}
                      </div>
                      <div className="mt-1 text-xs text-description custom-text-secondary">
                        {SELECTED_EMBEDDER?.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1 custom-llm-provider-modal"
              >
                {SELECTED_EMBEDDER?.options(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
