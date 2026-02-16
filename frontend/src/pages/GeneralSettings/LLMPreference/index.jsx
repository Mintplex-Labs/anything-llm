import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import { CheckCircle, XCircle, SpinnerGap } from "@phosphor-icons/react";

export const AVAILABLE_LLM_PROVIDERS = [
  {
    name: "LIS (TensorNext)",
    value: "lis",
    logo: GenericOpenAiLogo,
    options: () => null,
    description: "Local Inference Service — connect to the LIS + Agent + Runtime + Control Plane ecosystem.",
    requiredConfig: ["LisBasePath", "LisAuthToken"],
  },
];

export const LLM_PREFERENCE_CHANGED_EVENT = "llm-preference-changed";

export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lisUrl, setLisUrl] = useState("");
  const [lisToken, setLisToken] = useState("");
  const [lisModel, setLisModel] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLisUrl(_settings?.LisBasePath ?? "");
      setLisToken(_settings?.LisAuthToken ?? "");
      setLisModel(_settings?.LisModelPref ?? "");
      setLoading(false);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const base = settings?.LisBasePath?.trim();
    const token = settings?.LisAuthToken;
    if (!settings || !base || !token) return;
    let cancelled = false;
    (async () => {
      const result = await System.checkLisConnection(base, token);
      if (!cancelled) setConnectionStatus(result);
    })();
    return () => { cancelled = true; };
  }, [settings]);

  const loadModels = async () => {
    const base = lisUrl?.trim() || undefined;
    const token = lisToken || undefined;
    if (!base || !token) {
      setModels([]);
      return;
    }
    setModelsLoading(true);
    const { models: list, error } = await System.customModels("lis", token, base);
    setModelsLoading(false);
    if (error) {
      setModels([]);
      return;
    }
    setModels(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    if (lisUrl && lisToken && connectionStatus?.connected) {
      loadModels();
    } else {
      setModels([]);
    }
  }, [lisUrl, lisToken, connectionStatus?.connected]);

  const handleCheckConnection = async () => {
    const base = lisUrl?.trim();
    const token = lisToken;
    if (!base || !token) {
      showToast(t("llm.lis.urlAndTokenRequired") || "LIS URL and Auth Token are required", "error");
      return;
    }
    setCheckingConnection(true);
    setConnectionStatus(null);
    const result = await System.checkLisConnection(base, token);
    setCheckingConnection(false);
    setConnectionStatus(result);
    if (result.connected) {
      showToast(t("llm.lis.connected") || "LIS connected", "success");
      loadModels();
    }
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const data = {
      LLMProvider: "lis",
      LisBasePath: lisUrl?.trim() || "",
      LisAuthToken: lisToken || "",
      LisModelPref: lisModel || "",
    };
    const { error } = await System.updateSystem(data);
    setSaving(true);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
    } else {
      showToast(t("llm.saved") || "LLM preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(false);
  };

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
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("llm.title")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  {t("llm.lis.description") || "Connect to the Local Inference Service (LIS) to use models from the TensorNext ecosystem."}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={handleSubmit}
                    className="mt-3 mr-0 -mb-14 z-10"
                  >
                    {saving ? (t("llm.saving") || "Saving...") : (t("llm.saveChanges") || "Save changes")}
                  </CTAButton>
                )}
              </div>

              <div className="text-base font-bold text-white mt-6 mb-2">
                {t("llm.lis.connection") || "LIS connection"}
              </div>
              <div className="flex flex-col gap-4 max-w-[640px]">
                <div>
                  <label className="block input-label text-white text-opacity-80 mb-1">
                    {t("llm.lis.url") || "LIS URL"}
                  </label>
                  <input
                    type="url"
                    name="LisBasePath"
                    value={lisUrl}
                    onChange={(e) => {
                      setLisUrl(e.target.value);
                      setHasChanges(true);
                      setConnectionStatus(null);
                    }}
                    placeholder="http://localhost:8080"
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button block w-full p-2.5"
                  />
                </div>
                <div>
                  <label className="block input-label text-white text-opacity-80 mb-1">
                    {t("llm.lis.authToken") || "LIS Auth Token"}
                  </label>
                  <input
                    type="password"
                    name="LisAuthToken"
                    value={lisToken}
                    onChange={(e) => {
                      setLisToken(e.target.value);
                      setHasChanges(true);
                      setConnectionStatus(null);
                    }}
                    placeholder="••••••••"
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button block w-full p-2.5"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <CTAButton
                    type="button"
                    onClick={handleCheckConnection}
                    disabled={checkingConnection || !lisUrl?.trim() || !lisToken}
                  >
                    {checkingConnection ? (
                      <>
                        <SpinnerGap size={18} className="animate-spin mr-2" />
                        {t("llm.lis.checking") || "Checking..."}
                      </>
                    ) : (
                      t("llm.lis.checkConnection") || "Check connection"
                    )}
                  </CTAButton>
                  {connectionStatus !== null && (
                    <span className="flex items-center gap-2 text-sm">
                      {connectionStatus.connected ? (
                        <>
                          <CheckCircle size={20} weight="fill" className="text-green-500" />
                          <span className="text-green-500">{t("llm.lis.connected") || "LIS connected"}</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={20} weight="fill" className="text-red-500" />
                          <span className="text-red-500">{connectionStatus.error || (t("llm.lis.notConnected") || "Not connected")}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-base font-bold text-white mt-8 mb-2">
                {t("llm.lis.model") || "Model"}
              </div>
              <div className="max-w-[640px]">
                <label className="block input-label text-white text-opacity-80 mb-1">
                  {t("llm.lis.modelDescription") || "Select a model from the LIS ecosystem"}
                </label>
                <select
                  name="LisModelPref"
                  value={lisModel}
                  onChange={(e) => {
                    setLisModel(e.target.value);
                    setHasChanges(true);
                  }}
                  disabled={modelsLoading || (!connectionStatus?.connected && models.length === 0)}
                  className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button block w-full p-2.5"
                >
                  <option value="">
                    {modelsLoading
                      ? (t("llm.lis.loadingModels") || "Loading models...")
                      : !connectionStatus?.connected && models.length === 0
                        ? (t("llm.lis.checkConnectionFirst") || "Check connection first")
                        : (t("llm.lis.selectModel") || "Select model")}
                  </option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
