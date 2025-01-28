import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

import showToast from "@/utils/toast";
import System from "@/models/system";
import {
  ALLOWED_SYSTEM_CONFIG_KEYS,
  DEFAULT_REWRITER_PROMPT,
} from "@/utils/constants";

import Sidebar from "@/components/SettingsSidebar";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import RerankerPreferences from "./RerankerPreferences";
import RewriterPreferences from "./RewriterPreferences";

const RE_RANKER_KEYS = [
  // Re-ranker keys
  "RerankerProvider",
  "RerankerModel",
  "RerankerApiKey",
  "RerankerUrl",
  "RerankTopNResults",
];
const RE_WRITER_KEYS = [
  // Re-Writer keys
  "QueryRewriterEnabled",
  "QueryRewriterPrompt",
];

const SETTING_KEYS = [...RE_RANKER_KEYS, ...RE_WRITER_KEYS];

const FORM_ID = "RERANKER_REWRITER_FORM";
export default function RerankerRewriter() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedReranker, setSelectedReranker] = useState(null);
  const [isRewriterEnabled, setIsRewriterEnabled] = useState(false);
  const [isRerankerEnabled, setIsRerankerEnabled] = useState(false);
  const { t } = useTranslation();

  // Functions
  const checkIfValuesChanged = (formData) => {
    for (const key of SETTING_KEYS) {
      const oldValue = settings?.[key];
      const newValue = formData?.[key];

      if (!isRerankerEnabled && RE_RANKER_KEYS.includes(key) && !newValue)
        continue;
      if (!isRewriterEnabled && RE_WRITER_KEYS.includes(key) && !newValue)
        continue;
      if (key === "RerankerApiKey" && !newValue?.replace(/\*/g, "")?.length)
        continue;
      if (newValue !== oldValue) {
        return true;
      }
    }
    return false;
  };
  const handleSaveSettings = async (e) => {
    setSaving(true);
    e?.preventDefault();
    const form = document.getElementById(FORM_ID);
    const formData = new FormData(form);
    const settingsData = {};
    for (let [key, value] of formData.entries()) settingsData[key] = value;
    settingsData.RerankerProvider = isRerankerEnabled
      ? selectedReranker
      : "none";
    settingsData.QueryRewriterEnabled = String(isRewriterEnabled);
    const valuesChanged = checkIfValuesChanged(settingsData);
    if (!valuesChanged) {
      showToast("There are no changes to save!", "info");
      setHasChanges(false);
    } else {
      if (isRerankerEnabled) {
        settingsData.RerankTopNResults = settingsData.RerankTopNResults || "3";
      }
      if (isRewriterEnabled) {
        settingsData.QueryRewriterPrompt =
          settingsData.QueryRewriterPrompt || DEFAULT_REWRITER_PROMPT;
      }
      const { error } = await System.updateSystem(
        settingsData,
        ALLOWED_SYSTEM_CONFIG_KEYS["reranker-rewriter"]
      );
      if (error) {
        showToast(
          `Failed to save Re-Ranker and Re-Writer  settings: ${error}`,
          "error"
        );
        setHasChanges(true);
      } else {
        showToast(
          "Re-Ranker and Re-Writer preferences saved successfully.",
          "success"
        );
        setHasChanges(false);
        fetchKeys();
      }
    }
    setSaving(false);
  };
  async function fetchKeys() {
    const _settings = await System.keys();
    setSettings(_settings);
    setSelectedReranker(_settings?.RerankerProvider || "prism");
    setIsRerankerEnabled(_settings?.RerankerProvider !== "none");
    setIsRewriterEnabled(_settings?.QueryRewriterEnabled === "true");
    setLoading(false);
  }
  useEffect(() => {
    fetchKeys();
  }, []);
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
      >
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        ) : (
          <div className="flex flex-col w-full h-full">
            <div className="space-y-1 px-1 md:pl-6 md:pr-[50px] py-16 md:py-6 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10 custom-border-secondary" style={{ borderLeft: 0, borderRight: 0, borderTop: 0,}}>
              <p className="text-lg leading-6 font-bold text-white custom-text-secondary">
                {t("reranker-rewriter.title")}
              </p>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 custom-text-secondary">
                {t("reranker-rewriter.desc-start")}
                <br />
                {t("reranker-rewriter.desc-end")}
              </p>
            </div>

            <form
              id={FORM_ID}
              onSubmit={handleSaveSettings}
              className="overflow-y-auto space-y-[32px] h-full py-6 px-1 md:px-6"
              onChange={() => {
                if (!hasChanges) setHasChanges(true);
              }}
            >
              <div className="justify-end flex">
                {hasChanges && (
                  <CTAButton
                    buttonProps={{
                      type: "submit",
                      disabled: saving,
                    }}
                    className="mt-3 mr-0 -mb-14 z-10 custom-theme-bg-quad custom-theme-color-quad"
                  >
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>

              <div className="flex-1">
                <RerankerPreferences
                  settings={settings}
                  isRerankerEnabled={isRerankerEnabled}
                  setIsRerankerEnabled={setIsRerankerEnabled}
                  selectedReranker={selectedReranker}
                  setSelectedReranker={(choice) => {
                    if (!hasChanges) setHasChanges(true);
                    setSelectedReranker(choice);
                  }}
                />
              </div>
              <div className="flex-1">
                <RewriterPreferences
                  settings={settings}
                  fetchKeys={fetchKeys}
                  isRewriterEnabled={isRewriterEnabled}
                  setIsRewriterEnabled={setIsRewriterEnabled}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
