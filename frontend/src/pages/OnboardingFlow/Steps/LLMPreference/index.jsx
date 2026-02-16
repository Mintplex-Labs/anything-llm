import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";
import { CheckCircle, XCircle, SpinnerGap } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export default function LLMPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [lisUrl, setLisUrl] = useState("");
  const [lisToken, setLisToken] = useState("");
  const [lisModel, setLisModel] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  const TITLE = t("onboarding.llm.title");
  const DESCRIPTION = t("onboarding.llm.description") || t("llm.lis.description") || "Connect to the Local Inference Service (LIS) to use models from the TensorNext ecosystem.";

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLisUrl(_settings?.LisBasePath ?? "");
      setLisToken(_settings?.LisAuthToken ?? "");
      setLisModel(_settings?.LisModelPref ?? "");
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    if (!settings?.LisBasePath?.trim() || !settings?.LisAuthToken) return;
    let cancelled = false;
    (async () => {
      const result = await System.checkLisConnection(
        settings.LisBasePath.trim(),
        settings.LisAuthToken
      );
      if (!cancelled) setConnectionStatus(result);
    })();
    return () => { cancelled = true; };
  }, [settings]);

  const loadModels = async () => {
    const base = lisUrl?.trim() || undefined;
    const token = lisToken || undefined;
    if (!base || !token) return;
    setModelsLoading(true);
    const { models: list, error } = await System.customModels("lis", token, base);
    setModelsLoading(false);
    if (!error && Array.isArray(list)) setModels(list);
    else setModels([]);
  };

  useEffect(() => {
    if (connectionStatus?.connected && lisUrl && lisToken) loadModels();
    else setModels([]);
  }, [connectionStatus?.connected, lisUrl, lisToken]);

  async function handleCheckConnection() {
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
  }

  async function handleForward() {
    try {
      await System.markOnboardingComplete();
    } catch (error) {
      console.error("Onboarding complete failed", error);
    } finally {
      if (hiddenSubmitButtonRef?.current) {
        hiddenSubmitButtonRef.current.click();
      }
    }
  }

  function handleBack() {
    navigate(paths.onboarding.home());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      LLMProvider: "lis",
      LisBasePath: lisUrl?.trim() || "",
      LisAuthToken: lisToken || "",
      LisModelPref: lisModel || "",
      EmbeddingEngine: "native",
      VectorDB: "lancedb",
    };
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.userSetup());
  };

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-white">
            {t("llm.lis.url") || "LIS URL"}
          </label>
          <input
            type="url"
            value={lisUrl}
            onChange={(e) => {
              setLisUrl(e.target.value);
              setConnectionStatus(null);
            }}
            placeholder="http://localhost:8080"
            className="border border-theme-chat-input-border bg-theme-bg-secondary text-white rounded-lg p-2.5 text-sm focus:outline-primary-button"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-white">
            {t("llm.lis.authToken") || "LIS Auth Token"}
          </label>
          <input
            type="password"
            value={lisToken}
            onChange={(e) => {
              setLisToken(e.target.value);
              setConnectionStatus(null);
            }}
            placeholder="••••••••"
            className="border border-theme-chat-input-border bg-theme-bg-secondary text-white rounded-lg p-2.5 text-sm focus:outline-primary-button"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
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
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-white">
            {t("llm.lis.model") || "Model"}
          </label>
          <select
            value={lisModel}
            onChange={(e) => setLisModel(e.target.value)}
            disabled={modelsLoading || (!connectionStatus?.connected && models.length === 0)}
            className="border border-theme-chat-input-border bg-theme-bg-secondary text-white rounded-lg p-2.5 text-sm focus:outline-primary-button"
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
        <button
          type="submit"
          ref={hiddenSubmitButtonRef}
          hidden
          aria-hidden="true"
        />
      </form>
    </div>
  );
}
